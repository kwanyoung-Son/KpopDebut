import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAnalysisResultSchema, quizAnswersSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Analyze user input and generate KPOP group position
  app.post("/api/analyze", upload.single('photo'), async (req, res) => {
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
function generateAnalysisResult(answers: any) {
  const groupNames = ['STELLAR NOVA', 'COSMIC DREAM', 'RAINBOW STAR', 'NEON LIGHT', 'CRYSTAL WAVE'];
  
  const positionMap = {
    leader: { main: '리더', sub: '메인보컬' },
    entertainer: { main: '메인댄서', sub: '서브보컬' },
    charisma: { main: '래퍼', sub: '서브댄서' },
    cute: { main: '비주얼', sub: '서브보컬' }
  };

  const characterMap = {
    leader: { type: '따뜻한 카리스마의 리더형', desc: '강한 리더십과 따뜻한 인간미를 동시에 갖춘 완벽한 리더 타입' },
    entertainer: { type: '에너지 넘치는 댄스머신', desc: '무대 위에서 폭발적인 에너지로 관객을 사로잡는 타입' },
    charisma: { type: '쿨한 힙합 아티스트', desc: '강렬한 랩과 카리스마로 무대를 지배하는 타입' },
    cute: { type: '사랑스러운 비주얼 센터', desc: '완벽한 외모와 매력으로 시선을 집중시키는 타입' }
  };

  const styleTagsMap = {
    leader: ['#강인한리더', '#카리스마보컬', '#시크모던'],
    entertainer: ['#폭발적댄스', '#에너지넘침', '#스트릿감성'],
    charisma: ['#힙합퀸', '#강렬카리스마', '#도시적매력'],
    cute: ['#완벽비주얼', '#사랑스러움', '#러블리매력']
  };

  // Select result based on personality type
  const personality = answers.personality;
  const groupName = groupNames[Math.floor(Math.random() * groupNames.length)];
  const position = positionMap[personality];
  const character = characterMap[personality];
  const styleTags = styleTagsMap[personality];

  return {
    groupName,
    position: position.main,
    subPosition: position.sub,
    character: character.type,
    characterDesc: character.desc,
    styleTags
  };
}
