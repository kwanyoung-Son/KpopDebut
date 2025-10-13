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
// Import removed as we now use LLM for analysis instead of hardcoded data

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

        // Validate quiz answers
        console.log("Raw quiz answers:", req.body.quizAnswers);

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

        // Generate analysis result using LLM
        const result = await generateAnalysisResult(quizAnswers, language);

        const analysisData = {
          sessionId,
          photoData,
          quizAnswers,
          language,
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
) {
  const questionMapping =
    language === "kr"
      ? {
          stagePresence: {
            center: "중심에서 빛나는 타입",
            leader: "팀을 이끄는 리더형",
            performer: "열정적인 퍼포머",
            charisma: "조용한 카리스마",
          },
          friendsDescribe: {
            mood_maker: "분위기 메이커",
            serious: "진지하고 신중함",
            creative: "창의적이고 예술적",
            responsible: "계획적이고 책임감",
          },
          newProject: {
            execute: "바로 따라하며 몸으로 익힌다",
            plan: "먼저 구조를 분석하고 계획한다",
            discuss: "멤버들과 함께 의견 나눈다",
            think: "혼자 차근차근 이해한다",
          },
          stageImportant: {
            expression: "표정과 눈빛",
            accuracy: "안무 정확도",
            vocal: "음정과 감정 전달",
            teamwork: "전체적인 팀워크",
          },
          practiceStyle: {
            vocal: "고음 처리나 감정 전달",
            dance: "칼군무와 동작 정리",
            direction: "무대 연출/구성 아이디어",
            care: "멤버들 케어 및 소통",
          },
          danceStyle: {
            hiphop: "리듬감 넘치는 힙합",
            contemporary: "부드러운 컨템포러리",
            powerful: "파워풀한 퍼포먼스",
            cute: "키치하고 귀여운 안무",
          },
          fashionStyle: {
            street: "스트릿, 캐주얼",
            chic: "시크하고 모던",
            lovely: "러블리하고 컬러풀",
            trendy: "트렌디하고 유니크",
          },
          makeupStyle: {
            natural: "자연스러운 내추럴",
            bold: "강렬한 포인트 컬러",
            retro: "레트로 감성",
            elegant: "깔끔하고 고급진 스타일",
          },
        }
      : {
          stagePresence: {
            center: "Shining at the center",
            leader: "Leading the team",
            performer: "Passionate performer",
            charisma: "Quiet charisma",
          },
          friendsDescribe: {
            mood_maker: "Mood maker",
            serious: "Serious and careful",
            creative: "Creative and artistic",
            responsible: "Planned and responsible",
          },
          newProject: {
            execute: "Learn by doing immediately",
            plan: "Analyze structure and plan first",
            discuss: "Share opinions with members",
            think: "Understand step by step alone",
          },
          stageImportant: {
            expression: "Facial expressions and eyes",
            accuracy: "Choreography accuracy",
            vocal: "Pitch and emotion delivery",
            teamwork: "Overall teamwork",
          },
          practiceStyle: {
            vocal: "High notes and emotion delivery",
            dance: "Synchronized choreography",
            direction: "Stage direction/composition ideas",
            care: "Member care and communication",
          },
          danceStyle: {
            hiphop: "Rhythmic hip-hop",
            contemporary: "Smooth contemporary",
            powerful: "Powerful performance",
            cute: "Cute and playful choreography",
          },
          fashionStyle: {
            street: "Street, casual",
            chic: "Chic and modern",
            lovely: "Lovely and colorful",
            trendy: "Trendy and unique",
          },
          makeupStyle: {
            natural: "Natural style",
            bold: "Bold point colors",
            retro: "Retro vibes",
            elegant: "Clean and sophisticated style",
          },
        };

  const prompt =
    language === "kr"
      ? `다음은 KPOP 아이돌 적성 분석을 위한 8개 질문에 대한 답변입니다:

1. 무대 위에서의 모습: ${questionMapping.stagePresence[answers.stagePresence]}
2. 친구들이 말하는 성격: ${questionMapping.friendsDescribe[answers.friendsDescribe]}  
3. 새로운 프로젝트 접근법: ${questionMapping.newProject[answers.newProject]}
4. 무대에서 중요하게 생각하는 것: ${questionMapping.stageImportant[answers.stageImportant]}
5. 연습 중 집중하는 부분: ${questionMapping.practiceStyle[answers.practiceStyle]}
6. 선호하는 춤 스타일: ${questionMapping.danceStyle[answers.danceStyle]}
7. 패션 스타일: ${questionMapping.fashionStyle[answers.fashionStyle]}
8. 메이크업 스타일: ${questionMapping.makeupStyle[answers.makeupStyle]}

이 답변을 바탕으로 다음 JSON 형식으로 KPOP 아이돌 분석 결과를 생성해주세요:

{
  "groupName": "실제 KPOP 그룹명",
  "position": "메인 포지션 (예: Leader, Main Vocalist, Main Dancer, Main Rapper, Visual)",
  "subPosition": "서브 포지션 (선택사항)",
  "character": "그룹명 + 멤버명 + 스타일",
  "characterDesc": "해당 멤버의 특징을 반영한 성격 설명",
  "styleTags": ["#그룹스타일", "#포지션태그", "#멤버형"],
  "memberName": "실제 멤버 이름",
  "agency": "소속사명"
}

답변은 반드시 유효한 JSON 형식으로만 제공해주세요.`
      : `Here are the answers to 8 KPOP idol aptitude analysis questions:

1. Stage presence: ${questionMapping.stagePresence[answers.stagePresence]}
2. Personality described by friends: ${questionMapping.friendsDescribe[answers.friendsDescribe]}
3. Approach to new projects: ${questionMapping.newProject[answers.newProject]}
4. What's important on stage: ${questionMapping.stageImportant[answers.stageImportant]}
5. Focus during practice: ${questionMapping.practiceStyle[answers.practiceStyle]}
6. Preferred dance style: ${questionMapping.danceStyle[answers.danceStyle]}
7. Fashion style: ${questionMapping.fashionStyle[answers.fashionStyle]}
8. Makeup style: ${questionMapping.makeupStyle[answers.makeupStyle]}

Based on these answers, generate a KPOP idol analysis result in the following JSON format:

{
  "groupName": "Actual KPOP group name",
  "position": "Main position (e.g., Leader, Main Vocalist, Main Dancer, Main Rapper, Visual)",
  "subPosition": "Sub position (optional)",
  "character": "Group name + Member name + Style",
  "characterDesc": "Personality description reflecting the member's characteristics",
  "styleTags": ["#GroupStyle", "#PositionTag", "#MemberType"],
  "memberName": "Actual member name",
  "agency": "Agency name"
}

Please provide the answer only in valid JSON format.`;

  return prompt;
}

// Call Cloudflare Workers AI for analysis
async function callLLMAnalysis(prompt: string): Promise<any> {
  try {
    console.log('\n=== LLM API 호출 ===');
    console.log('📤 전송하는 프롬프트:');
    console.log(prompt);
    console.log('=====================\n');

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
                "You are a KPOP expert analyst who knows all idol groups and members. Always respond with valid JSON format only.",
            },
            { role: "user", content: prompt },
          ],
        }),
      },
    );

    console.log('📥 LLM API 응답 상태:', response.status);

    if (!response.ok) {
      throw new Error(
        `LLM API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    console.log('📥 LLM API 응답 데이터:');
    console.log(JSON.stringify(data, null, 2));

    // Extract the JSON from LLM response - flexible parsing
    let result;
    let responseText;
    
    // Handle Cloudflare Workers AI batch response format (array)
    if (Array.isArray(data)) {
      // Find the response that matches our request (usually the last one)
      const ourResponse = data.find(item => 
        item.inputs?.messages?.some((msg: any) => 
          msg.content?.includes('KPOP') || msg.content?.includes('아이돌')
        )
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
      const jsonMatch = typeof responseText === 'string' 
        ? responseText.match(/\{[\s\S]*\}/) 
        : null;
      
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else if (typeof responseText === 'object') {
        result = responseText;
      } else {
        throw new Error("No valid JSON found in LLM response");
      }
    }
    
    if (!result) {
      throw new Error("Invalid LLM response format");
    }

    console.log('✅ 파싱된 LLM 결과:');
    console.log(JSON.stringify(result, null, 2));
    console.log('===================\n');
    return result;
  } catch (error) {
    console.error('\n❌ LLM Analysis 오류:', error);
    console.log('🔄 Fallback 시스템 활성화 중...\n');

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
    console.log('📋 사용할 Fallback 응답:');
    console.log(JSON.stringify(randomFallback, null, 2));
    console.log('===================\n');
    return randomFallback;
  }
}

// Generate analysis result using LLM
async function generateAnalysisResult(
  answers: QuizAnswers,
  language: "kr" | "en" = "kr",
) {
  const prompt = createAnalysisPrompt(answers, language);
  const result = await callLLMAnalysis(prompt);

  return {
    groupName: result.groupName || "NewJeans",
    position: result.position || "Main Vocalist",
    subPosition: result.subPosition || "",
    character: result.character || "NewJeans Hanni 스타일",
    characterDesc:
      result.characterDesc || "밝고 친근한 매력으로 팬들을 사로잡는 타입",
    styleTags: result.styleTags || [
      "#NewJeans스타일",
      "#MainVocalist",
      "#Hanni형",
    ],
    memberName: result.memberName || "Hanni",
    agency: result.agency || "ADOR",
  };
}
