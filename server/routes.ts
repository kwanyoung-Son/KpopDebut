import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAnalysisResultSchema, quizAnswersSchema, type QuizAnswers } from "@shared/schema";
import { z } from "zod";
import multer from "multer";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Analyze user input and generate KPOP group position
  app.post("/api/analyze", upload.single('photo'), async (req: MulterRequest, res) => {
    try {
      const sessionId = req.body.sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Validate quiz answers
      const quizAnswers = quizAnswersSchema.parse(JSON.parse(req.body.quizAnswers));
      
      // Convert uploaded photo to base64 if exists
      let photoData = null;
      if (req.file) {
        photoData = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      }

      // Generate analysis result based on quiz answers
      const result = generateAnalysisResult(quizAnswers);
      
      const analysisData = {
        sessionId,
        photoData,
        quizAnswers,
        ...result
      };

      const savedResult = await storage.createAnalysisResult(analysisData);
      
      res.json(savedResult);
    } catch (error) {
      console.error('Analysis error:', error);
      res.status(400).json({ error: "Analysis failed" });
    }
  });

  // Get analysis result by session ID
  app.get("/api/results/:sessionId", async (req, res) => {
    try {
      const result = await storage.getAnalysisResult(req.params.sessionId);
      if (!result) {
        return res.status(404).json({ error: "Result not found" });
      }
      res.json(result);
    } catch (error) {
      console.error('Get result error:', error);
      res.status(500).json({ error: "Failed to retrieve result" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Generate analysis result based on quiz answers
function generateAnalysisResult(answers: QuizAnswers) {
  const groupNames = ['STELLAR NOVA', 'COSMIC DREAM', 'RAINBOW STAR', 'NEON LIGHT', 'CRYSTAL WAVE'];
  
  // 점수 기반 분석 시스템
  let leaderScore = 0;
  let vocalScore = 0; 
  let danceScore = 0;
  let rapScore = 0;
  let visualScore = 0;

  // 무대 존재감 분석
  switch (answers.stagePresence) {
    case 'center': visualScore += 3; break;
    case 'leader': leaderScore += 3; break;
    case 'performer': danceScore += 3; break;
    case 'charisma': rapScore += 3; break;
  }

  // 성격 분석
  switch (answers.friendsDescribe) {
    case 'mood_maker': danceScore += 2; break;
    case 'serious': leaderScore += 2; break;
    case 'creative': vocalScore += 2; break;
    case 'responsible': leaderScore += 2; break;
  }

  // 프로젝트 스타일 분석
  switch (answers.newProject) {
    case 'execute': danceScore += 2; break;
    case 'plan': leaderScore += 2; break;
    case 'discuss': vocalScore += 2; break;
    case 'think': visualScore += 2; break;
  }

  // 무대 중요도 분석
  switch (answers.stageImportant) {
    case 'expression': visualScore += 3; break;
    case 'accuracy': danceScore += 3; break;
    case 'vocal': vocalScore += 3; break;
    case 'teamwork': leaderScore += 3; break;
  }

  // 연습 스타일 분석
  switch (answers.practiceStyle) {
    case 'vocal': vocalScore += 3; break;
    case 'dance': danceScore += 3; break;
    case 'direction': leaderScore += 3; break;
    case 'care': leaderScore += 2; visualScore += 1; break;
  }

  // 춤 스타일 분석
  switch (answers.danceStyle) {
    case 'hiphop': rapScore += 3; break;
    case 'contemporary': vocalScore += 2; break;
    case 'powerful': danceScore += 3; break;
    case 'cute': visualScore += 3; break;
  }

  // 패션/메이크업 보너스 점수
  if (answers.fashionStyle === 'street') rapScore += 1;
  if (answers.fashionStyle === 'chic') leaderScore += 1;
  if (answers.fashionStyle === 'lovely') visualScore += 1;
  if (answers.fashionStyle === 'trendy') danceScore += 1;

  if (answers.makeupStyle === 'bold') rapScore += 1;
  if (answers.makeupStyle === 'elegant') leaderScore += 1;
  if (answers.makeupStyle === 'natural') visualScore += 1;
  if (answers.makeupStyle === 'retro') vocalScore += 1;

  // 최고 점수 포지션 결정
  const scores = { leaderScore, vocalScore, danceScore, rapScore, visualScore };
  const maxScore = Math.max(...Object.values(scores));
  let mainPosition = '';
  let subPosition = '';
  let characterType = '';
  let characterDesc = '';
  let styleTags: string[] = [];

  if (scores.leaderScore === maxScore) {
    mainPosition = '리더';
    subPosition = '서브보컬';
    characterType = '카리스마 넘치는 팀 리더';
    characterDesc = '강한 리더십과 책임감으로 팀을 이끄는 든든한 존재';
    styleTags = ['#카리스마리더', '#책임감', '#시크모던'];
  } else if (scores.vocalScore === maxScore) {
    mainPosition = '메인보컬';
    subPosition = '서브댄서';
    characterType = '감성적인 보컬 전문가';
    characterDesc = '깊은 감정과 완벽한 음정으로 청중의 마음을 사로잡는 타입';
    styleTags = ['#감성보컬', '#완벽음정', '#아티스트'];
  } else if (scores.danceScore === maxScore) {
    mainPosition = '메인댄서';
    subPosition = '서브래퍼';
    characterType = '에너지 폭발 퍼포머';
    characterDesc = '무대 위에서 폭발적인 에너지와 완벽한 퍼포먼스를 선보이는 타입';
    styleTags = ['#폭발적댄스', '#퍼포먼스킹', '#에너지넘침'];
  } else if (scores.rapScore === maxScore) {
    mainPosition = '메인래퍼';
    subPosition = '서브댄서';
    characterType = '힙합 아티스트';
    characterDesc = '강렬한 랩과 카리스마로 무대를 완전히 장악하는 타입';
    styleTags = ['#힙합퀸', '#강렬카리스마', '#도시적매력'];
  } else {
    mainPosition = '센터/비주얼';
    subPosition = '서브보컬';
    characterType = '완벽한 비주얼 센터';
    characterDesc = '뛰어난 외모와 독특한 매력으로 모든 시선을 집중시키는 타입';
    styleTags = ['#완벽비주얼', '#센터포스', '#매력발산'];
  }

  const groupName = groupNames[Math.floor(Math.random() * groupNames.length)];

  return {
    groupName,
    position: mainPosition,
    subPosition,
    character: characterType,
    characterDesc,
    styleTags
  };
}
