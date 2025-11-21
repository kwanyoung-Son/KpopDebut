import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertAnalysisResultSchema,
  quizAnswersSchema,
  type QuizAnswers,
} from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import { kpopGroupsData as kpopGroupsDataKr } from "./kpop-data-kr";
import { kpopGroupsData as kpopGroupsDataEn } from "./kpop-data-en";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
  files?:
    | { [fieldname: string]: Express.Multer.File[] }
    | Express.Multer.File[];
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Analyze user input and generate KPOP group position
  app.post(
    "/api/analyze",
    upload.fields([{ name: "photo", maxCount: 1 }]),
    async (req: MulterRequest, res) => {
      try {
        const sessionId =
          req.body.sessionId ||
          `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const language = (req.body.language || "kr") as "kr" | "en";
        const gender = (req.body.gender || "female") as "male" | "female";
        const age = parseInt(req.body.age || "21", 10);
        const expression = req.body.expression || "happy";

        // Validate quiz answers
        console.log("Raw quiz answers:", req.body.quizAnswers);
        console.log("Detected gender:", gender);
        console.log("Detected age:", age);
        console.log("Detected expression:", expression);

        if (!req.body.quizAnswers || req.body.quizAnswers === "undefined") {
          throw new Error("Quiz answers are missing or undefined");
        }

        const quizAnswers = quizAnswersSchema.parse(
          JSON.parse(req.body.quizAnswers),
        );

        // Convert uploaded photo to base64 if exists
        let photoData = null;
        if (
          req.files &&
          !Array.isArray(req.files) &&
          req.files["photo"] &&
          req.files["photo"][0]
        ) {
          const file = req.files["photo"][0] as Express.Multer.File;
          photoData = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
        }

        // Generate analysis result using LLM with photo analysis information
        const result = await generateAnalysisResult(
          quizAnswers,
          language,
          gender,
          age,
          expression,
        );

        const analysisData = {
          sessionId,
          photoData,
          quizAnswers,
          language,
          age: age.toString(),
          expression,
          gender,
          ...result,
        };

        const savedResult = await storage.createAnalysisResult(analysisData);

        res.json(savedResult);
      } catch (error) {
        console.error("Analysis error:", error);
        res.status(400).json({ error: "Analysis failed" });
      }
    },
  );

  // Get analysis result by session ID
  app.get("/api/results/:sessionId", async (req, res) => {
    try {
      const result = await storage.getAnalysisResult(req.params.sessionId);
      if (!result) {
        return res.status(404).json({ error: "Result not found" });
      }
      res.json(result);
    } catch (error) {
      console.error("Get result error:", error);
      res.status(500).json({ error: "Failed to retrieve result" });
    }
  });

  // Get analysis count for stats
  app.get("/api/stats", async (req, res) => {
    try {
      const count = await storage.getAnalysisCount();
      res.json({ totalAnalyses: count });
    } catch (error) {
      console.error("Stats fetch error:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Convert quiz answers to prompt for LLM
function createAnalysisPrompt(
  answers: QuizAnswers,
  language: "kr" | "en" = "kr",
  gender: "male" | "female" = "female",
) {
  const questionMapping = {
    stagePresence: { center: "Center", leader: "Leader", performer: "Performer", charisma: "Charisma", supporter: "Supporter", allrounder: "All-rounder" },
    friendsDescribe: { mood_maker: "Mood maker", serious: "Serious", creative: "Creative", responsible: "Responsible", energetic: "Energetic", calm: "Calm" },
    newProject: { execute: "Execute", plan: "Plan", discuss: "Discuss", think: "Think", research: "Research", experiment: "Experiment" },
    stageImportant: { expression: "Expression", accuracy: "Accuracy", vocal: "Vocal", teamwork: "Teamwork", energy: "Energy", connection: "Connection" },
    practiceStyle: { vocal: "Vocal", dance: "Dance", direction: "Direction", care: "Care", expression: "Expression", stamina: "Stamina" },
    danceStyle: { hiphop: "Hip-hop", contemporary: "Contemporary", powerful: "Powerful", cute: "Cute", sensual: "Sensual", energetic: "Energetic" },
    fashionStyle: { street: "Street", chic: "Chic", lovely: "Lovely", trendy: "Trendy", vintage: "Vintage", minimal: "Minimal" },
    makeupStyle: { natural: "Natural", bold: "Bold", retro: "Retro", elegant: "Elegant", glam: "Glam", soft: "Soft" },
  };

  const genderHint = gender === "male"
    ? "Match with male idol groups and members."
    : "Match with female idol groups and members.";

  const groupExamples = gender === "male"
    ? "BTS, SEVENTEEN, Stray Kids, TXT, ENHYPEN"
    : "NewJeans, BLACKPINK, aespa, IVE, LE SSERAFIM, TWICE, Red Velvet";

  const prompt = `You are a K-Pop idol expert. ${genderHint}

Here are the answers to 9 KPOP idol aptitude analysis questions:

1. Stage presence: ${questionMapping.stagePresence[answers.stagePresence]}
2. Personality described by friends: ${questionMapping.friendsDescribe[answers.friendsDescribe]}
3. Approach to new projects: ${questionMapping.newProject[answers.newProject]}
4. What's important on stage: ${questionMapping.stageImportant[answers.stageImportant]}
5. Focus during practice: ${questionMapping.practiceStyle[answers.practiceStyle]}
6. Preferred dance style: ${questionMapping.danceStyle[answers.danceStyle]}
7. Fashion style: ${questionMapping.fashionStyle[answers.fashionStyle]}
8. Makeup style: ${questionMapping.makeupStyle[answers.makeupStyle]}
9. Gender: ${gender}

Provide the result as JSON with fields: groupName, position, subPosition, character, characterDesc, styleTags, memberName, agency.`;

  return prompt;
}

// Call Cloudflare Workers AI for analysis
async function callLLMAnalysis(prompt: string): Promise<any> {
  try {
    console.log("\n=== LLM API 호출 ===");
    console.log("📤 전송하는 프롬프트:");
    console.log(prompt);
    console.log("=====================\n");

    const response = await fetch(
      "https://icy-sun-4b5d.heroskyt87.workers.dev/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are a K-POP expert analyst who knows ALL idol groups and members from various agencies (HYBE, SM, YG, JYP, ADOR, etc.). You MUST provide diverse and varied results based on the user's personality. Consider groups like: BTS, Seventeen, Stray Kids, TXT, ENHYPEN (for males) and NewJeans, BLACKPINK, aespa, IVE, LE SSERAFIM, TWICE, Red Velvet (for females). NEVER repeat the same group/member for different users. Analyze the personality traits carefully and match with the MOST suitable member. Always respond with valid JSON format only.",
            },
            { role: "user", content: prompt },
          ],
        }),
      },
    );

    console.log("📥 LLM API 응답 상태:", response.status);

    if (!response.ok) {
      throw new Error(
        `LLM API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    console.log("📥 LLM API 응답 데이터:");
    console.log(JSON.stringify(data, null, 2));

    // Extract the JSON from LLM response - flexible parsing
    let result;
    let responseText;

    // Handle Cloudflare Workers AI batch response format (array)
    if (Array.isArray(data)) {
      // Find the response that matches our request (usually the last one)
      const ourResponse =
        data.find((item) =>
          item.inputs?.messages?.some(
            (msg: any) =>
              msg.content?.includes("KPOP") || msg.content?.includes("아이돌"),
          ),
        ) || data[data.length - 1];

      responseText = ourResponse?.response?.response || ourResponse?.response;
    } else if (data.response?.response) {
      responseText = data.response.response;
    } else if (data.response) {
      responseText = data.response;
    } else if (data.result) {
      responseText = data.result;
    } else if (typeof data === "object" && data.groupName) {
      result = data; // Direct JSON response
    }

    // Parse responseText if we have it
    if (!result && responseText) {
      // Try to extract JSON from the response text
      const jsonMatch =
        typeof responseText === "string"
          ? responseText.match(/\{[\s\S]*\}/)
          : null;

      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else if (typeof responseText === "object") {
        result = responseText;
      } else {
        throw new Error("No valid JSON found in LLM response");
      }
    }

    if (!result) {
      throw new Error("Invalid LLM response format");
    }

    console.log("✅ 파싱된 LLM 결과:");
    console.log(JSON.stringify(result, null, 2));
    console.log("===================\n");
    return result;
  } catch (error) {
    console.error("\n❌ LLM Analysis 오류:", error);
    console.log("🔄 Fallback 시스템 활성화 중...\n");

    // Enhanced fallback with varied responses based on error
    const fallbackResponses = [
      {
        groupName: "NewJeans",
        position: "Main Vocalist",
        subPosition: "Visual",
        character: "NewJeans Hanni 스타일",
        characterDesc: "밝고 친근한 매력으로 팬들을 사로잡는 타입",
        styleTags: ["#NewJeans스타일", "#MainVocalist", "#Hanni형"],
        memberName: "Hanni",
        agency: "ADOR",
      },
      {
        groupName: "BLACKPINK",
        position: "Main Dancer",
        subPosition: "Lead Rapper",
        character: "BLACKPINK Lisa 스타일",
        characterDesc: "강렬한 댄스와 카리스마로 무대를 사로잡는 타입",
        styleTags: ["#BLACKPINK스타일", "#MainDancer", "#Lisa형"],
        memberName: "Lisa",
        agency: "YG Entertainment",
      },
      {
        groupName: "aespa",
        position: "Leader",
        subPosition: "Main Dancer",
        character: "aespa Karina 스타일",
        characterDesc: "완벽한 리더십과 뛰어난 퍼포먼스 능력을 가진 타입",
        styleTags: ["#aespa스타일", "#Leader", "#Karina형"],
        memberName: "Karina",
        agency: "SM Entertainment",
      },
    ];

    const randomFallback =
      fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    console.log("📋 사용할 Fallback 응답:");
    console.log(JSON.stringify(randomFallback, null, 2));
    console.log("===================\n");
    return randomFallback;
  }
}

// Score-based matching engine
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
    const score = overlap / desired.length; // 0..1
    return Math.max(0, Math.min(1, score));
  }

  function softmaxSample<T extends { score: number }>(
    items: T[],
    temperature = 0.7,
  ): T | null {
    if (items.length === 0) return null;
    const maxScore = Math.max(...items.map((i) => i.score));
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
        (p: string) => p.includes("leader") || p.includes("center"),
      )
    )
      score += 15;
  }

  if (answers.stageImportant === "vocal" || answers.practiceStyle === "vocal") {
    if (positions.some((p: string) => p.includes("vocal"))) score += 15;
  }

  if (
    answers.practiceStyle === "dance" ||
    answers.stageImportant === "energy"
  ) {
    if (
      positions.some((p: string) => p.includes("dancer") || p.includes("dance"))
    )
      score += 15;
  }

  if (answers.danceStyle === "hiphop" || answers.danceStyle === "powerful") {
    if (
      positions.some((p: string) => p.includes("rapper") || p.includes("rap"))
    )
      score += 10;
  }

  if (answers.danceStyle === "cute" || answers.fashionStyle === "lovely") {
    if (
      positions.some(
        (p: string) => p.includes("visual") || p.includes("maknae"),
      )
    )
      score += 10;
  }

  if (
    answers.friendsDescribe === "responsible" ||
    answers.newProject === "plan"
  ) {
    if (positions.some((p: string) => p.includes("leader"))) score += 10;
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
    posStr.includes("leader")
  ) {
    score += 20;
  }

  if (
    (answers.stageImportant === "vocal" || answers.practiceStyle === "vocal") &&
    posStr.includes("vocal")
  ) {
    score += 20;
  }

  if (
    (answers.practiceStyle === "dance" ||
      answers.stageImportant === "energy") &&
    posStr.includes("danc")
  ) {
    score += 20;
  }

  if (
    (answers.danceStyle === "hiphop" || answers.danceStyle === "powerful") &&
    posStr.includes("rap")
  ) {
    score += 15;
  }

  return score;
}

// Generate analysis result using LLM with photo analysis data
async function generateAnalysisResult(
  answers: QuizAnswers,
  language: "kr" | "en" = "kr",
  gender: "male" | "female" = "female",
  age: number = 21,
  expression: string = "happy",
) {
  const scoreMatch = scoreBasedMatching(
    answers,
    language,
    gender,
    age,
    expression,
  );

  if (scoreMatch) {
    return {
      groupName: scoreMatch.groupName,
      position: scoreMatch.position,
      subPosition: scoreMatch.subPosition,
      character: `${scoreMatch.groupName} ${scoreMatch.memberName} Style`,
      characterDesc: `Similar charm and talent to ${scoreMatch.memberName}`,
      styleTags: [
        `#${scoreMatch.groupName}Style`,
        `#${scoreMatch.position}`,
        `#${scoreMatch.memberName}Type`,
      ],
      memberName: scoreMatch.memberName,
      agency: scoreMatch.agency,
    };
  }

  // Basic fallback when no score-based match found
  return {
    groupName: gender === "male" ? "SEVENTEEN" : "NewJeans",
    position: "Main Vocalist",
    subPosition: "",
    character: gender === "male" ? "SEVENTEEN Style" : "NewJeans Style",
    characterDesc: "A balanced performer with solid potential.",
    styleTags: ["#IdolStyle", "#Balanced", "#Potential"],
    memberName: gender === "male" ? "DK" : "Hanni",
    agency: gender === "male" ? "Pledis" : "ADOR",
  };
}