// Cloudflare Worker for KPOP Debut Analyzer with LLM Integration
/// <reference types="@cloudflare/workers-types" />
import { z } from "zod";
import { kpopGroupsData as kpopGroupsDataKr } from "../server/kpop-data-kr";
import { kpopGroupsData as kpopGroupsDataEn } from "../server/kpop-data-en";

interface Env {
  DB: D1Database;
  AI?: any; // Cloudflare Workers AI binding (optional)
  LLM_ENDPOINT?: string; // External LLM API endpoint (optional)
}

// Quiz validation schema
const quizAnswersSchema = z.object({
  gender: z.enum(["male", "female"]),
  stagePresence: z.enum([
    "center",
    "leader",
    "performer",
    "charisma",
    "supporter",
    "allrounder",
  ]),
  friendsDescribe: z.enum([
    "mood_maker",
    "serious",
    "creative",
    "responsible",
    "energetic",
    "calm",
  ]),
  newProject: z.enum([
    "execute",
    "plan",
    "discuss",
    "think",
    "research",
    "experiment",
  ]),
  stageImportant: z.enum([
    "expression",
    "accuracy",
    "vocal",
    "teamwork",
    "energy",
    "connection",
  ]),
  practiceStyle: z.enum([
    "vocal",
    "dance",
    "direction",
    "care",
    "expression",
    "stamina",
  ]),
  danceStyle: z.enum([
    "hiphop",
    "contemporary",
    "powerful",
    "cute",
    "sensual",
    "energetic",
  ]),
  fashionStyle: z.enum([
    "street",
    "chic",
    "lovely",
    "trendy",
    "vintage",
    "minimal",
  ]),
  makeupStyle: z.enum(["natural", "bold", "retro", "elegant", "glam", "soft"]),
});

type QuizAnswers = z.infer<typeof quizAnswersSchema>;

// Expected shape of the LLM "flavor text" response.
// Structural fields (group / member / position) come from the deterministic
// score engine and are NEVER taken from the LLM, so they are intentionally
// absent here. Every field is optional: missing/invalid values fall back to
// engine-generated defaults at the call site.
const llmFlavorSchema = z.object({
  character: z.string().min(1).optional(),
  characterDesc: z.string().min(1).optional(),
  styleTags: z.array(z.string().min(1)).min(1).optional(),
});
type LlmFlavor = z.infer<typeof llmFlavorSchema>;

// Robustly pull a JSON object out of a free-text LLM response.
// Strips markdown code fences, then scans for the first *balanced* {...} block
// (brace-aware, string-aware) instead of a greedy first-{-to-last-} regex that
// over-captures when the model adds prose around the JSON.
function extractJsonObject(text: unknown): any | null {
  if (typeof text !== "string") return null;
  const cleaned = text.replace(/```(?:json)?/gi, "").trim();

  const start = cleaned.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        try {
          return JSON.parse(cleaned.slice(start, i + 1));
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

// Call external LLM API for analysis
async function callLLMAnalysis(prompt: string, env?: Env): Promise<any> {
  try {
    // Use environment variable for LLM endpoint (with fallback)
    const LLM_ENDPOINT =
      env?.LLM_ENDPOINT || "https://icy-sun-4b5d.heroskyt87.workers.dev/";

    console.log("\n=== LLM API 호출 ===");
    console.log("📤 Endpoint:", LLM_ENDPOINT);
    console.log("📤 전송하는 프롬프트:");
    console.log(prompt);
    console.log("=====================\n");

    // Add timeout to fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(LLM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are a KPOP expert analyst who knows all idol groups and members. Always respond with valid JSON format only.",
            },
            { role: "user", content: prompt },
          ],
          // Request guaranteed JSON output. Harmless if the endpoint ignores
          // it — extractJsonObject() still parses the text robustly downstream.
          response_format: { type: "json_object" },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log("📥 LLM API 응답 상태:", response.status);

      if (!response.ok) {
        throw new Error(
          `LLM API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = (await response.json()) as any;
      console.log("📥 LLM API 응답 데이터:");
      console.log(JSON.stringify(data, null, 2));

      // Extract a JSON object from the response. The endpoint may return the
      // payload as { response: "<text>" }, { response: {...} }, or a raw object.
      let result: any = null;
      const responseText = data?.response;

      if (typeof responseText === "string") {
        result = extractJsonObject(responseText);
      } else if (responseText && typeof responseText === "object") {
        result = responseText;
      } else if (data && typeof data === "object") {
        // Endpoint returned the object directly, without a wrapper.
        result = data;
      }

      if (!result || typeof result !== "object") {
        throw new Error("No valid JSON object found in LLM response");
      }

      console.log("✅ 파싱된 LLM 결과:");
      console.log(JSON.stringify(result, null, 2));
      console.log("===================\n");
      return result;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw new Error(
        `Fetch failed: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`,
      );
    }
  } catch (error) {
    console.error("\n❌ LLM Analysis 오류:", error);
    console.log("🔄 Fallback 시스템 활성화 중...\n");
    throw error; // Re-throw to use fallback
  }
}

// Score-based matching engine with photo analysis
function scoreBasedMatching(
  answers: QuizAnswers,
  language: "kr" | "en",
  gender: "male" | "female",
  age: number,
  expression: string,
) {
  const kpopData = language === "kr" ? kpopGroupsDataKr : kpopGroupsDataEn;
  const currentYear = new Date().getFullYear();
  const userAge = age;

  // Map groups to gender to avoid mismatches
  const genderGroupMap: { [key: string]: "male" | "female" } = {
    BTS: "male",
    BLACKPINK: "female",
    IVE: "female",
    aespa: "female",
    NewJeans: "female",
    "Stray Kids": "male",
  };

  // Helpers: trait extraction and sampling for diversity
  function toWords(s: string): string[] {
    return s
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[^a-z0-9]+/gi, " ")
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
  }

  function normalizeTokens(arr: string[]): string[] {
    const out: string[] = [];
    for (const val of arr) {
      toWords(String(val)).forEach((w) => out.push(w));
    }
    return Array.from(new Set(out));
  }

  function extractTraitKeywords(a: QuizAnswers): string[] {
    const traits: string[] = [];

    // Stage presence
    switch (a.stagePresence) {
      case "center":
        traits.push("center", "visual", "charming");
        break;
      case "leader":
        traits.push("leader", "leadership", "reliable");
        break;
      case "performer":
        traits.push("performer", "dancer", "stage");
        break;
      case "charisma":
        traits.push("charisma", "charismatic");
        break;
      case "supporter":
        traits.push("supporter", "caring", "kind");
        break;
      case "allrounder":
        traits.push("allrounder", "versatile");
        break;
    }

    // Friends describe
    switch (a.friendsDescribe) {
      case "mood_maker":
        traits.push("funny", "cheerful", "bright");
        break;
      case "serious":
        traits.push("serious", "calm", "focused");
        break;
      case "creative":
        traits.push("creative", "artistic");
        break;
      case "responsible":
        traits.push("responsible", "planned", "reliable", "leader");
        break;
      case "energetic":
        traits.push("energetic", "dynamic");
        break;
      case "calm":
        traits.push("calm", "gentle");
        break;
    }

    // New project
    switch (a.newProject) {
      case "execute":
        traits.push("decisive", "action-oriented");
        break;
      case "plan":
        traits.push("planner", "organized", "leader");
        break;
      case "discuss":
        traits.push("communicator", "friendly");
        break;
      case "think":
        traits.push("thoughtful");
        break;
      case "research":
        traits.push("studious", "precise");
        break;
      case "experiment":
        traits.push("innovative", "unique");
        break;
    }

    // Stage important
    switch (a.stageImportant) {
      case "expression":
        traits.push("expressive", "visual");
        break;
      case "accuracy":
        traits.push("precise", "synchronized");
        break;
      case "vocal":
        traits.push("vocalist", "voice");
        break;
      case "teamwork":
        traits.push("teamwork", "leader");
        break;
      case "energy":
        traits.push("energetic", "powerful");
        break;
      case "connection":
        traits.push("charisma", "communication");
        break;
    }

    // Practice style
    switch (a.practiceStyle) {
      case "vocal":
        traits.push("vocalist", "voice");
        break;
      case "dance":
        traits.push("dancer", "choreography");
        break;
      case "direction":
        traits.push("creative", "director", "leader");
        break;
      case "care":
        traits.push("caring", "kind", "supporter");
        break;
      case "expression":
        traits.push("expressive");
        break;
      case "stamina":
        traits.push("stamina", "endurance");
        break;
    }

    // Dance style
    switch (a.danceStyle) {
      case "hiphop":
        traits.push("hiphop", "rap", "rhythm");
        break;
      case "contemporary":
        traits.push("artistic", "graceful", "smooth");
        break;
      case "powerful":
        traits.push("powerful", "strong");
        break;
      case "cute":
        traits.push("cute", "bright", "maknae");
        break;
      case "sensual":
        traits.push("chic", "elegant", "sexy");
        break;
      case "energetic":
        traits.push("energetic", "dynamic");
        break;
    }

    // Fashion style
    switch (a.fashionStyle) {
      case "street":
        traits.push("street", "trendy", "casual");
        break;
      case "chic":
        traits.push("chic", "cool", "professional");
        break;
      case "lovely":
        traits.push("lovely", "cute", "bright");
        break;
      case "trendy":
        traits.push("trendy", "fashionable");
        break;
      case "vintage":
        traits.push("retro", "vintage");
        break;
      case "minimal":
        traits.push("minimal", "clean");
        break;
    }

    // Makeup style
    switch (a.makeupStyle) {
      case "natural":
        traits.push("natural", "soft");
        break;
      case "bold":
        traits.push("bold", "strong");
        break;
      case "retro":
        traits.push("retro", "vintage");
        break;
      case "elegant":
        traits.push("elegant", "sophisticated");
        break;
      case "glam":
        traits.push("glamorous", "fashionable");
        break;
      case "soft":
        traits.push("soft", "gentle");
        break;
    }

    return Array.from(new Set(normalizeTokens(traits)));
  }

  function computeTraitOverlapScore(
    a: QuizAnswers,
    memberPersonality: string[],
    memberPositions: string[],
  ): number {
    const desired = extractTraitKeywords(a);
    const memberTokens = normalizeTokens([
      ...memberPersonality,
      ...memberPositions,
    ]);
    if (desired.length === 0 || memberTokens.length === 0) return 0;
    const desiredSet = new Set(desired);
    let overlap = 0;
    for (const t of memberTokens) {
      if (desiredSet.has(t)) overlap += 1;
    }
    // Normalize by the number of desired traits to measure "how much of user we cover"
    const score = overlap / desired.length; // 0..1
    return Math.max(0, Math.min(1, score));
  }

  function softmaxSample<T extends { score: number }>(
    items: T[],
    temperature = 0.7,
  ): T | null {
    if (items.length === 0) return null;
    const maxScore = Math.max(...items.map((i) => i.score));
    // Center scores to avoid overflow and keep top-biased
    const weights = items.map((i) => Math.exp((i.score - maxScore) / Math.max(0.1, temperature)));
    const sum = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * sum;
    for (let i = 0; i < items.length; i++) {
      r -= weights[i];
      if (r <= 0) return items[i];
    }
    return items[items.length - 1];
  }

  // Maxima for normalization
  const QUIZ_MAX = 75; // see calculateQuizScore
  const PHOTO_MAX = 40; // see calculatePhotoScore (30 age + 10 trait)
  const POS_MAX = 75; // see calculatePositionScore

  const candidates: Array<{
    member: any;
    group: string;
    agency: string;
    score: number; // normalized 0..1 total
    comps: { quiz: number; photo: number; pos: number; trait: number };
  }> = [];

  for (const group of kpopData.groups) {
    const groupGender = (group as any).gender || genderGroupMap[group.name];
    if (groupGender && groupGender !== gender) continue;

    for (const member of group.members) {
      if (!("birthYear" in member) || !("personality" in member)) continue;
      if (!member.birthYear || !member.personality) continue;

      const memberAge = currentYear - member.birthYear;

      const quizRaw = calculateQuizScore(answers, member);
      const photoRaw = calculatePhotoScore(
        userAge,
        expression,
        memberAge,
        member.personality,
      );
      const posRaw = calculatePositionScore(answers, member.position);
      const trait = computeTraitOverlapScore(
        answers,
        member.personality,
        member.position,
      );

      const quiz = Math.max(0, Math.min(1, quizRaw / QUIZ_MAX));
      const photo = Math.max(0, Math.min(1, photoRaw / PHOTO_MAX));
      const pos = Math.max(0, Math.min(1, posRaw / POS_MAX));

      // Weighted sum (must sum to 1.0)
      const total = 0.30 * quiz + 0.20 * photo + 0.25 * pos + 0.25 * trait;

      candidates.push({
        member,
        group: group.name,
        agency: group.agency,
        score: total,
        comps: { quiz, photo, pos, trait },
      });
    }
  }

  if (candidates.length === 0) return null;

  // Sort by score desc and sample among top candidates within margin
  candidates.sort((a, b) => b.score - a.score);
  const best = candidates[0];
  const relativeThreshold = 0.9; // within 90% of best
  const eligible = candidates.filter((c) => c.score >= best.score * relativeThreshold);
  const topK = eligible.slice(0, Math.max(3, Math.min(7, eligible.length)));
  const picked = softmaxSample(topK, 0.7) || best;

  return {
    groupName: picked.group,
    memberName: picked.member.name,
    position: picked.member.position[0],
    subPosition: picked.member.position[1] || "",
    agency: picked.agency,
    score: picked.score,
  };
}

function calculateQuizScore(answers: QuizAnswers, member: any): number {
  let score = 0;
  const positions = member.position.map((p: string) => p.toLowerCase());

  if (
    answers.stagePresence === "center" ||
    answers.stagePresence === "leader"
  ) {
    if (
      positions.some(
        (p: string) =>
          p.includes("leader") || p.includes("center") || p.includes("리더"),
      )
    )
      score += 15;
  }

  if (answers.stageImportant === "vocal" || answers.practiceStyle === "vocal") {
    if (
      positions.some((p: string) => p.includes("vocal") || p.includes("보컬"))
    )
      score += 15;
  }

  if (
    answers.practiceStyle === "dance" ||
    answers.stageImportant === "energy"
  ) {
    if (
      positions.some(
        (p: string) =>
          p.includes("dancer") || p.includes("dance") || p.includes("댄서"),
      )
    )
      score += 15;
  }

  if (answers.danceStyle === "hiphop" || answers.danceStyle === "powerful") {
    if (
      positions.some(
        (p: string) =>
          p.includes("rapper") || p.includes("rap") || p.includes("래퍼"),
      )
    )
      score += 10;
  }

  if (answers.danceStyle === "cute" || answers.fashionStyle === "lovely") {
    if (
      positions.some(
        (p: string) =>
          p.includes("visual") ||
          p.includes("maknae") ||
          p.includes("비주얼") ||
          p.includes("막내"),
      )
    )
      score += 10;
  }

  if (
    answers.friendsDescribe === "responsible" ||
    answers.newProject === "plan"
  ) {
    if (
      positions.some((p: string) => p.includes("leader") || p.includes("리더"))
    )
      score += 10;
  }

  return score;
}

function calculatePhotoScore(
  userAge: number,
  expression: string,
  memberAge: number,
  personality: string[],
): number {
  let score = 0;

  const ageDiff = Math.abs(userAge - memberAge);
  if (ageDiff <= 2) score += 30;
  else if (ageDiff <= 5) score += 20;
  else if (ageDiff <= 10) score += 10;
  else score += 5;

  const expressionMap: { [key: string]: string[] } = {
    happy: [
      "cheerful",
      "energetic",
      "bright",
      "friendly",
      "positive",
      "밝음",
      "활발함",
      "긍정적",
      "친근함",
    ],
    sad: ["emotional", "artistic", "calm", "감성적", "예술적", "차분함"],
    angry: ["passionate", "intense", "confident", "열정적", "강렬함", "자신감"],
    fearful: ["cute", "kind", "caring", "귀여움", "친절함", "다정함"],
    neutral: [
      "calm",
      "professional",
      "chic",
      "cool",
      "차분함",
      "프로페셔널",
      "시크함",
      "쿨함",
    ],
    surprised: [
      "energetic",
      "talented",
      "unique",
      "활발함",
      "재능있음",
      "독특함",
    ],
    disgusted: ["chic", "confident", "unique", "시크함", "자신감", "독특함"],
  };

  const matchingTraits = expressionMap[expression] || [];
  for (const trait of matchingTraits) {
    if (
      personality.some((p: string) =>
        p.toLowerCase().includes(trait.toLowerCase()),
      )
    ) {
      score += 10;
      break;
    }
  }

  return score;
}

function calculatePositionScore(
  answers: QuizAnswers,
  positions: string[],
): number {
  let score = 0;
  const posStr = positions.join(" ").toLowerCase();

  if (
    (answers.stagePresence === "leader" ||
      answers.friendsDescribe === "responsible") &&
    (posStr.includes("leader") || posStr.includes("리더"))
  ) {
    score += 20;
  }

  if (
    (answers.stageImportant === "vocal" || answers.practiceStyle === "vocal") &&
    (posStr.includes("vocal") || posStr.includes("보컬"))
  ) {
    score += 20;
  }

  if (
    (answers.practiceStyle === "dance" ||
      answers.stageImportant === "energy") &&
    (posStr.includes("danc") || posStr.includes("댄서"))
  ) {
    score += 20;
  }

  if (
    (answers.danceStyle === "hiphop" || answers.danceStyle === "powerful") &&
    (posStr.includes("rap") || posStr.includes("래퍼"))
  ) {
    score += 15;
  }

  return score;
}

// Fallback: Score-based analysis system (original logic)
function generateAnalysisResultFallback(quizAnswers: QuizAnswers) {
  // 5개 포지션별 점수 초기화
  let leaderScore = 0;
  let vocalScore = 0;
  let danceScore = 0;
  let rapScore = 0;
  let visualScore = 0;

  // 1. 무대 존재감 분석
  switch (quizAnswers.stagePresence) {
    case "center":
      visualScore += 3;
      break;
    case "leader":
      leaderScore += 3;
      break;
    case "performer":
      danceScore += 3;
      break;
    case "charisma":
      rapScore += 3;
      break;
  }

  // 2. 성격 분석
  switch (quizAnswers.friendsDescribe) {
    case "mood_maker":
      danceScore += 2;
      break;
    case "serious":
      leaderScore += 2;
      break;
    case "creative":
      vocalScore += 2;
      break;
    case "responsible":
      leaderScore += 2;
      break;
  }

  // 3. 프로젝트 스타일 분석
  switch (quizAnswers.newProject) {
    case "execute":
      danceScore += 2;
      break;
    case "plan":
      leaderScore += 2;
      break;
    case "discuss":
      vocalScore += 2;
      break;
    case "think":
      visualScore += 2;
      break;
  }

  // 4. 무대 중요도 분석
  switch (quizAnswers.stageImportant) {
    case "expression":
      visualScore += 3;
      break;
    case "accuracy":
      danceScore += 3;
      break;
    case "vocal":
      vocalScore += 3;
      break;
    case "teamwork":
      leaderScore += 3;
      break;
  }

  // 5. 연습 스타일 분석
  switch (quizAnswers.practiceStyle) {
    case "vocal":
      vocalScore += 3;
      break;
    case "dance":
      danceScore += 3;
      break;
    case "direction":
      leaderScore += 3;
      break;
    case "care":
      leaderScore += 2;
      visualScore += 1;
      break;
  }

  // 6. 춤 스타일 분석
  switch (quizAnswers.danceStyle) {
    case "hiphop":
      rapScore += 3;
      break;
    case "contemporary":
      vocalScore += 2;
      break;
    case "powerful":
      danceScore += 3;
      break;
    case "cute":
      visualScore += 3;
      break;
  }

  // 7. 패션 스타일 보너스
  switch (quizAnswers.fashionStyle) {
    case "street":
      rapScore += 1;
      break;
    case "chic":
      leaderScore += 1;
      break;
    case "lovely":
      visualScore += 1;
      break;
    case "trendy":
      danceScore += 1;
      break;
  }

  // 8. 메이크업 스타일 보너스
  switch (quizAnswers.makeupStyle) {
    case "bold":
      rapScore += 1;
      break;
    case "elegant":
      leaderScore += 1;
      break;
    case "natural":
      visualScore += 1;
      break;
    case "retro":
      vocalScore += 1;
      break;
  }

  // 최고 점수 포지션 결정
  const scores = { leaderScore, vocalScore, danceScore, rapScore, visualScore };
  const maxScore = Math.max(...Object.values(scores));

  let positionType = "";
  let matchedMember: { name: string; position: string[] } | null = null;
  let matchedGroup = "";

  // 포지션별 멤버 수집
  const getAllMembersWithPosition = (positionKeywords: string[]) => {
    const allMatches: Array<{ member: any; group: string }> = [];

    kpopGroupsDataKr.groups.forEach((group) => {
      group.members.forEach((member) => {
        const hasPosition = member.position.some((pos: string) =>
          positionKeywords.some((keyword) => pos.includes(keyword)),
        );
        if (hasPosition) {
          allMatches.push({ member, group: group.name });
        }
      });
    });

    return allMatches;
  };

  // 최고 점수에 해당하는 포지션의 모든 멤버들 중에서 랜덤 선택
  if (scores.leaderScore === maxScore) {
    positionType = "Leader";
    const leaderMembers = getAllMembersWithPosition(["리더"]);
    if (leaderMembers.length > 0) {
      const selected =
        leaderMembers[Math.floor(Math.random() * leaderMembers.length)];
      matchedMember = selected.member;
      matchedGroup = selected.group;
    }
  } else if (scores.vocalScore === maxScore) {
    positionType = "Main Vocalist";
    const vocalistMembers = getAllMembersWithPosition([
      "메인 보컬",
      "리드 보컬",
    ]);
    if (vocalistMembers.length > 0) {
      const selected =
        vocalistMembers[Math.floor(Math.random() * vocalistMembers.length)];
      matchedMember = selected.member;
      matchedGroup = selected.group;
    }
  } else if (scores.danceScore === maxScore) {
    positionType = "Main Dancer";
    const dancerMembers = getAllMembersWithPosition(["메인 댄서", "리드 댄서"]);
    if (dancerMembers.length > 0) {
      const selected =
        dancerMembers[Math.floor(Math.random() * dancerMembers.length)];
      matchedMember = selected.member;
      matchedGroup = selected.group;
    }
  } else if (scores.rapScore === maxScore) {
    positionType = "Main Rapper";
    const rapperMembers = getAllMembersWithPosition(["메인 래퍼", "리드 래퍼"]);
    if (rapperMembers.length > 0) {
      const selected =
        rapperMembers[Math.floor(Math.random() * rapperMembers.length)];
      matchedMember = selected.member;
      matchedGroup = selected.group;
    }
  } else {
    positionType = "Visual";
    const visualMembers = getAllMembersWithPosition(["비주얼", "센터"]);
    if (visualMembers.length > 0) {
      const selected =
        visualMembers[Math.floor(Math.random() * visualMembers.length)];
      matchedMember = selected.member;
      matchedGroup = selected.group;
    }
  }

  // 매칭된 멤버가 없을 경우 기본값 설정
  if (!matchedMember || !matchedGroup) {
    matchedMember = kpopGroupsDataKr.groups[0].members[0];
    matchedGroup = "BTS";
    positionType = "Leader";
  }

  // Character descriptions
  const characterDescriptions: Record<string, string> = {
    Leader: `${matchedMember?.name || "리더"}처럼 팀을 이끄는 카리스마와 리더십을 가진 타입`,
    "Main Vocalist": `${matchedMember?.name || "메인보컬"}처럼 완벽한 음정과 감정 전달로 청중을 사로잡는 타입`,
    "Main Dancer": `${matchedMember?.name || "메인댄서"}처럼 뛰어난 댄스 실력과 무대 장악력을 가진 타입`,
    "Main Rapper": `${matchedMember?.name || "메인래퍼"}처럼 강렬한 랩과 카리스마로 무대를 지배하는 타입`,
    Visual: `${matchedMember?.name || "비주얼"}처럼 뛰어난 외모와 독특한 매력을 가진 타입`,
  };

  const styleTags = [
    `#${matchedGroup}스타일`,
    `#${positionType.replace(" ", "")}`,
    `#${matchedMember?.name || "KPOP"}형`,
  ];

  return {
    groupName: matchedGroup,
    position: matchedMember?.position[0] || positionType,
    subPosition: matchedMember?.position[1] || "",
    character: `${matchedGroup} ${matchedMember?.name} 스타일`,
    characterDesc:
      characterDescriptions[
        positionType as keyof typeof characterDescriptions
      ] || "",
    styleTags,
    memberName: matchedMember?.name,
    agency:
      kpopGroupsDataKr.groups.find((g) => g.name === matchedGroup)?.agency ||
      "",
  };
}

// Main analysis function with LLM + Fallback with photo analysis data
async function generateAnalysisResult(
  quizAnswers: QuizAnswers,
  language: "kr" | "en" = "kr",
  gender: "male" | "female" = "female",
  age: number = 21,
  expression: string = "happy",
  env?: Env,
) {
  const scoreMatch = scoreBasedMatching(
    quizAnswers,
    language,
    gender,
    age,
    expression,
  );

  if (scoreMatch) {
    console.log(
      `✅ Score-based match found: ${scoreMatch.memberName} from ${scoreMatch.groupName} (score: ${scoreMatch.score})`,
    );

    try {
      const prompt =
        language === "kr"
          ? `당신은 KPOP 아이돌 분석 전문가입니다. 다음 정보를 바탕으로 이 멤버의 매력을 설명해주세요. 한국어로만 작성해주세요.:

그룹: ${scoreMatch.groupName}
멤버: ${scoreMatch.memberName}
포지션: ${scoreMatch.position}
소속사: ${scoreMatch.agency}

사용자 특징:
- 무대 태도: ${quizAnswers.stagePresence}
- 친구들이 보는 나: ${quizAnswers.friendsDescribe}
- 무대에서 중요한 것: ${quizAnswers.stageImportant}
- 댄스 스타일: ${quizAnswers.danceStyle}

위 정보를 바탕으로 다음 형식의 JSON으로 응답해주세요:
{
  "character": "${scoreMatch.groupName} ${scoreMatch.memberName} 스타일",
  "characterDesc": "이 멤버의 특징을 반영한 2-3문장 설명",
  "styleTags": [이 멤버의 특성을 표현할 해쉬태그 여러개]
}`
          : `You are a KPOP idol analysis expert. Create an engaging description based on. please respond only in English.:

Group: ${scoreMatch.groupName}
Member: ${scoreMatch.memberName}
Position: ${scoreMatch.position}
Agency: ${scoreMatch.agency}

User traits:
- Stage presence: ${quizAnswers.stagePresence}
- Friends describe as: ${quizAnswers.friendsDescribe}
- Important on stage: ${quizAnswers.stageImportant}
- Dance style: ${quizAnswers.danceStyle}

Respond in JSON format:
{
  "character": "${scoreMatch.groupName} ${scoreMatch.memberName} Style",
  "characterDesc": "2-3 sentence description reflecting this member's traits",
  "styleTags": [Give me multiple hashtags that describe this member's traits.]
}`;

      const rawLlm = await callLLMAnalysis(prompt, env);

      // Validate the LLM payload against the expected flavor-text shape.
      // Anything malformed is dropped here, so the fields below fall back to
      // deterministic engine defaults instead of leaking bad data into the UI.
      const parsedLlm = llmFlavorSchema.safeParse(rawLlm);
      if (!parsedLlm.success) {
        console.log(
          "⚠️ LLM 응답이 예상 스키마와 달라 폴백 기본값을 사용합니다:",
          parsedLlm.error.issues.map((i) => i.path.join(".")).join(", "),
        );
      }
      const llmResult: LlmFlavor = parsedLlm.success ? parsedLlm.data : {};

      return {
        groupName: scoreMatch.groupName,
        position: scoreMatch.position,
        subPosition: scoreMatch.subPosition,
        character:
          llmResult.character ||
          `${scoreMatch.groupName} ${scoreMatch.memberName} ${language === "kr" ? "스타일" : "Style"}`,
        characterDesc:
          llmResult.characterDesc ||
          (language === "kr"
            ? `${scoreMatch.memberName}과 비슷한 매력과 재능을 가진 타입`
            : `Similar charm and talent to ${scoreMatch.memberName}`),
        styleTags: llmResult.styleTags || [
          `#${scoreMatch.groupName}${language === "kr" ? "스타일" : "Style"}`,
          `#${scoreMatch.position}`,
          `#${scoreMatch.memberName}${language === "kr" ? "형" : "Type"}`,
        ],
        memberName: scoreMatch.memberName,
        agency: scoreMatch.agency,
      };
    } catch (error) {
      console.log(
        "⚠️ LLM failed, using score-based match with basic description",
      );
      return {
        groupName: scoreMatch.groupName,
        position: scoreMatch.position,
        subPosition: scoreMatch.subPosition,
        character: `${scoreMatch.groupName} ${scoreMatch.memberName} ${language === "kr" ? "스타일" : "Style"}`,
        characterDesc:
          language === "kr"
            ? `${scoreMatch.memberName}과 비슷한 매력과 재능을 가진 타입`
            : `Similar charm and talent to ${scoreMatch.memberName}`,
        styleTags: [
          `#${scoreMatch.groupName}${language === "kr" ? "스타일" : "Style"}`,
          `#${scoreMatch.position}`,
          `#${scoreMatch.memberName}${language === "kr" ? "형" : "Type"}`,
        ],
        memberName: scoreMatch.memberName,
        agency: scoreMatch.agency,
      };
    }
  }

  console.log("❌ No score-based match found, using old fallback system");
  return generateAnalysisResultFallback(quizAnswers);
}

// Main Worker export
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    try {
      // Route: GET /api/stats
      if (path === "/api/stats" && request.method === "GET") {
        const result = await env.DB.prepare(
          "SELECT COUNT(*) as count FROM analysis_results",
        ).first();

        const count = result?.count || 0;

        return new Response(JSON.stringify({ totalAnalyses: count }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        });
      }

      // Route: POST /api/analyze
      if (path === "/api/analyze" && request.method === "POST") {
        const formData = await request.formData();

        // Extract fields
        const sessionId =
          (formData.get("sessionId") as string) ||
          `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const quizAnswersRaw = formData.get("quizAnswers") as string;
        const language = (formData.get("language") as "kr" | "en") || "kr";
        const gender =
          (formData.get("gender") as "male" | "female") || "female";
        const age = parseInt((formData.get("age") as string) || "21", 10);
        const expression = (formData.get("expression") as string) || "happy";

        console.log("Detected gender:", gender);
        console.log("Detected age:", age);
        console.log("Detected expression:", expression);

        if (!quizAnswersRaw || quizAnswersRaw === "undefined") {
          throw new Error("Quiz answers are missing or undefined");
        }

        // Parse and validate quiz answers
        const quizAnswers = quizAnswersSchema.parse(JSON.parse(quizAnswersRaw));

        // Handle photo upload
        let photoData: string | null = null;
        const photoFile = formData.get("photo") as File;
        if (photoFile && photoFile.size > 0) {
          console.log(
            `Photo received: ${photoFile.name}, size: ${photoFile.size} bytes`,
          );
          const arrayBuffer = await photoFile.arrayBuffer();

          // Convert ArrayBuffer to base64 in chunks to avoid stack overflow
          const bytes = new Uint8Array(arrayBuffer);
          let binary = "";
          const chunkSize = 0x8000; // 32KB chunks
          for (let i = 0; i < bytes.length; i += chunkSize) {
            const chunk = bytes.subarray(i, i + chunkSize);
            binary += String.fromCharCode.apply(null, Array.from(chunk));
          }
          const base64 = btoa(binary);
          const dataUrl = `data:${photoFile.type};base64,${base64}`;
          photoData = dataUrl;
          console.log(`Photo converted to base64, length: ${dataUrl.length}`);
        }

        // Generate analysis result with LLM + Fallback using photo analysis data
        const result = await generateAnalysisResult(
          quizAnswers,
          language,
          gender,
          age,
          expression,
          env,
        );

        // Prepare data for database with photo analysis metadata
        const analysisData = {
          sessionId,
          photoData,
          quizAnswers: JSON.stringify(quizAnswers),
          language,
          age: age.toString(),
          expression,
          gender,
          groupName: result.groupName,
          position: result.position,
          subPosition: result.subPosition || null,
          character: result.character,
          characterDesc: result.characterDesc,
          styleTags: JSON.stringify(result.styleTags),
          memberName: result.memberName || null,
          agency: result.agency || null,
        };

        // Save to D1 database
        const stmt = env.DB.prepare(`
          INSERT INTO analysis_results (session_id, photo_data, quiz_answers, language, age, expression, gender, group_name, position, sub_position, character, character_desc, style_tags, member_name, agency, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `);

        await stmt
          .bind(
            analysisData.sessionId,
            analysisData.photoData,
            analysisData.quizAnswers,
            analysisData.language,
            analysisData.age,
            analysisData.expression,
            analysisData.gender,
            analysisData.groupName,
            analysisData.position,
            analysisData.subPosition,
            analysisData.character,
            analysisData.characterDesc,
            analysisData.styleTags,
            analysisData.memberName,
            analysisData.agency,
          )
          .run();

        // Return the complete result with photoData
        const response = {
          sessionId: analysisData.sessionId,
          photoData: analysisData.photoData,
          ...result,
        };

        return new Response(JSON.stringify(response), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        });
      }

      // Route: GET /api/results/:sessionId
      if (path.startsWith("/api/results/") && request.method === "GET") {
        const sessionId = path.split("/").pop();

        if (!sessionId) {
          return new Response(
            JSON.stringify({ error: "Session ID is required" }),
            {
              status: 400,
              headers: {
                "Content-Type": "application/json",
                ...corsHeaders,
              },
            },
          );
        }

        // Get analysis result from D1
        const result = await env.DB.prepare(
          `SELECT * FROM analysis_results WHERE session_id = ?`,
        )
          .bind(sessionId)
          .first();

        if (!result) {
          return new Response(JSON.stringify({ error: "Result not found" }), {
            status: 404,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          });
        }

        // Parse JSON fields and convert to camelCase for frontend
        const parsedResult = {
          sessionId: result.session_id,
          photoData: result.photo_data,
          quizAnswers: result.quiz_answers
            ? JSON.parse(result.quiz_answers as string)
            : null,
          language: result.language,
          groupName: result.group_name,
          position: result.position,
          subPosition: result.sub_position,
          character: result.character,
          characterDesc: result.character_desc,
          styleTags: result.style_tags
            ? JSON.parse(result.style_tags as string)
            : [],
          memberName: result.member_name,
          agency: result.agency,
          createdAt: result.created_at,
        };

        return new Response(JSON.stringify(parsedResult), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        });
      }

      // Fallback 404
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    } catch (error) {
      console.error("Worker error:", error);
      return new Response(
        JSON.stringify({
          error: "Internal server error",
          message: error instanceof Error ? error.message : String(error),
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        },
      );
    }
  },
};
