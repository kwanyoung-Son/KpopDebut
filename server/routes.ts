import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAnalysisResultSchema, quizAnswersSchema, type QuizAnswers } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import { kpopGroupsData as kpopGroupsDataKr, type KpopMember } from "./kpop-data-kr";
import { kpopGroupsData as kpopGroupsDataEn } from "./kpop-data-en";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
  files?: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[];
}

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Analyze user input and generate KPOP group position
  app.post("/api/analyze", upload.fields([{ name: 'photo', maxCount: 1 }]), async (req: MulterRequest, res) => {
    try {
      const sessionId = req.body.sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Validate quiz answers
      console.log('Raw quiz answers:', req.body.quizAnswers);
      
      if (!req.body.quizAnswers || req.body.quizAnswers === 'undefined') {
        throw new Error('Quiz answers are missing or undefined');
      }
      
      const quizAnswers = quizAnswersSchema.parse(JSON.parse(req.body.quizAnswers));
      
      // Convert uploaded photo to base64 if exists
      let photoData = null;
      if (req.files && !Array.isArray(req.files) && req.files['photo'] && req.files['photo'][0]) {
        const file = req.files['photo'][0] as Express.Multer.File;
        photoData = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
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

  // Get analysis count for stats
  app.get("/api/stats", async (req, res) => {
    try {
      const count = await storage.getAnalysisCount();
      res.json({ totalAnalyses: count });
    } catch (error) {
      console.error('Stats fetch error:', error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Generate analysis result based on quiz answers
function generateAnalysisResult(answers: QuizAnswers) {
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

  // 최고 점수 포지션 결정 및 실제 KPOP 그룹 멤버 매칭
  const scores = { leaderScore, vocalScore, danceScore, rapScore, visualScore };
  const maxScore = Math.max(...Object.values(scores));
  
  let matchedMember: KpopMember | null = null;
  let matchedGroup = '';
  let positionType = '';

  if (scores.leaderScore === maxScore) {
    positionType = 'Leader';
    // 리더 포지션 멤버들 중에서 선택
    const leaderMembers = [
      { member: kpopGroupsData.groups[0].members[0], group: 'BTS' }, // RM
      { member: kpopGroupsData.groups[2].members[0], group: 'IVE' }, // Yujin
      { member: kpopGroupsData.groups[3].members[0], group: 'aespa' }, // Karina
      { member: kpopGroupsData.groups[4].members[0], group: '(G)I-DLE' }, // Soyeon
    ];
    const selected = leaderMembers[Math.floor(Math.random() * leaderMembers.length)];
    matchedMember = selected.member;
    matchedGroup = selected.group;
  } else if (scores.vocalScore === maxScore) {
    positionType = 'Main Vocalist';
    // 메인보컬 멤버들 중에서 선택
    const vocalMembers = [
      { member: kpopGroupsData.groups[0].members[6], group: 'BTS' }, // Jungkook
      { member: kpopGroupsData.groups[1].members[2], group: 'BLACKPINK' }, // Rosé
      { member: kpopGroupsData.groups[2].members[4], group: 'IVE' }, // Liz
      { member: kpopGroupsData.groups[3].members[3], group: 'aespa' }, // Ningning
      { member: kpopGroupsData.groups[4].members[1], group: '(G)I-DLE' }, // Minnie
    ];
    const selected = vocalMembers[Math.floor(Math.random() * vocalMembers.length)];
    matchedMember = selected.member;
    matchedGroup = selected.group;
  } else if (scores.danceScore === maxScore) {
    positionType = 'Main Dancer';
    // 메인댄서 멤버들 중에서 선택
    const danceMembers = [
      { member: kpopGroupsData.groups[0].members[3], group: 'BTS' }, // j-hope
      { member: kpopGroupsData.groups[0].members[4], group: 'BTS' }, // Jimin
      { member: kpopGroupsData.groups[1].members[3], group: 'BLACKPINK' }, // Lisa
      { member: kpopGroupsData.groups[3].members[0], group: 'aespa' }, // Karina
    ];
    const selected = danceMembers[Math.floor(Math.random() * danceMembers.length)];
    matchedMember = selected.member;
    matchedGroup = selected.group;
  } else if (scores.rapScore === maxScore) {
    positionType = 'Main Rapper';
    // 메인래퍼 멤버들 중에서 선택
    const rapMembers = [
      { member: kpopGroupsData.groups[0].members[0], group: 'BTS' }, // RM
      { member: kpopGroupsData.groups[1].members[1], group: 'BLACKPINK' }, // Jennie
      { member: kpopGroupsData.groups[2].members[1], group: 'IVE' }, // Gaeul
      { member: kpopGroupsData.groups[3].members[1], group: 'aespa' }, // Giselle
      { member: kpopGroupsData.groups[4].members[0], group: '(G)I-DLE' }, // Soyeon
    ];
    const selected = rapMembers[Math.floor(Math.random() * rapMembers.length)];
    matchedMember = selected.member;
    matchedGroup = selected.group;
  } else {
    positionType = 'Visual';
    // 비주얼 멤버들 중에서 선택
    const visualMembers = [
      { member: kpopGroupsData.groups[0].members[1], group: 'BTS' }, // Jin
      { member: kpopGroupsData.groups[0].members[5], group: 'BTS' }, // V
      { member: kpopGroupsData.groups[1].members[0], group: 'BLACKPINK' }, // Jisoo
      { member: kpopGroupsData.groups[2].members[3], group: 'IVE' }, // Wonyoung
      { member: kpopGroupsData.groups[3].members[2], group: 'aespa' }, // Winter
      { member: kpopGroupsData.groups[4].members[3], group: '(G)I-DLE' }, // Shuhua
    ];
    const selected = visualMembers[Math.floor(Math.random() * visualMembers.length)];
    matchedMember = selected.member;
    matchedGroup = selected.group;
  }

  // 캐릭터 설명 생성
  const characterDescriptions = {
    'Leader': `${matchedMember?.name}처럼 팀을 이끄는 카리스마와 리더십을 가진 타입`,
    'Main Vocalist': `${matchedMember?.name}처럼 완벽한 음정과 감정 전달로 청중을 사로잡는 타입`,
    'Main Dancer': `${matchedMember?.name}처럼 뛰어난 댄스 실력과 무대 장악력을 가진 타입`,
    'Main Rapper': `${matchedMember?.name}처럼 강렬한 랩과 카리스마로 무대를 지배하는 타입`,
    'Visual': `${matchedMember?.name}처럼 뛰어난 외모와 독특한 매력을 가진 타입`
  };

  const styleTags = [
    `#${matchedGroup}스타일`,
    `#${positionType.replace(' ', '')}`,
    `#${matchedMember?.name}형`
  ];

  return {
    groupName: matchedGroup,
    position: matchedMember?.position[0] || positionType,
    subPosition: matchedMember?.position[1] || '',
    character: `${matchedGroup} ${matchedMember?.name} 스타일`,
    characterDesc: characterDescriptions[positionType as keyof typeof characterDescriptions] || '',
    styleTags,
    memberName: matchedMember?.name,
    agency: kpopGroupsData.groups.find(g => g.name === matchedGroup)?.agency || ''
  };
}
