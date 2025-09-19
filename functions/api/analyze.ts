// Cloudflare Function for POST /api/analyze
/// <reference types="@cloudflare/workers-types" />
import { z } from "zod";

interface Env {
  DB: D1Database;
}

interface EventContext<E, P, D> {
  request: Request;
  env: E;
  params: P;
  data: D;
  waitUntil: (promise: Promise<any>) => void;
  passThroughOnException: () => void;
}

// Quiz validation schema
const quizAnswersSchema = z.object({
  stagePresence: z.enum(["center", "leader", "performer", "charisma"]),
  friendsDescribe: z.enum(["mood_maker", "serious", "creative", "responsible"]),
  newProject: z.enum(["execute", "plan", "discuss", "think"]),
  stageImportant: z.enum(["expression", "accuracy", "vocal", "teamwork"]),
  practiceStyle: z.enum(["vocal", "dance", "direction", "care"]),
  danceStyle: z.enum(["hiphop", "contemporary", "powerful", "cute"]),
  fashionStyle: z.enum(["street", "chic", "lovely", "trendy"]),
  makeupStyle: z.enum(["natural", "bold", "retro", "elegant"]),
});

type QuizAnswers = z.infer<typeof quizAnswersSchema>;

// KPOP Groups Data
const kpopGroupsData = {
  "groups": [
    {
      "name": "BTS",
      "agency": "BigHit Music",
      "members": [
        { "name": "RM", "position": ["Leader", "Main Rapper"] },
        { "name": "Jin", "position": ["Sub Vocalist", "Visual"] },
        { "name": "SUGA", "position": ["Lead Rapper"] },
        { "name": "j-hope", "position": ["Main Dancer", "Sub Rapper", "Sub Vocalist"] },
        { "name": "Jimin", "position": ["Main Dancer", "Lead Vocalist"] },
        { "name": "V", "position": ["Lead Dancer", "Sub Vocalist", "Visual"] },
        { "name": "Jungkook", "position": ["Main Vocalist", "Lead Dancer", "Sub Rapper", "Center", "Maknae"] }
      ]
    },
    {
      "name": "BLACKPINK",
      "agency": "YG Entertainment", 
      "members": [
        { "name": "Jisoo", "position": ["Lead Vocalist", "Visual"] },
        { "name": "Jennie", "position": ["Main Rapper", "Lead Vocalist"] },
        { "name": "Rosé", "position": ["Main Vocalist", "Lead Dancer"] },
        { "name": "Lisa", "position": ["Main Dancer", "Lead Rapper", "Sub Vocalist", "Maknae"] }
      ]
    },
    {
      "name": "IVE",
      "agency": "Starship Entertainment",
      "members": [
        { "name": "Yujin", "position": ["Leader", "Lead Vocalist"] },
        { "name": "Gaeul", "position": ["Main Rapper", "Sub Vocalist"] },
        { "name": "Rei", "position": ["Rapper", "Sub Vocalist"] },
        { "name": "Wonyoung", "position": ["Lead Dancer", "Sub Vocalist", "Visual", "Center"] },
        { "name": "Liz", "position": ["Main Vocalist"] },
        { "name": "Leeseo", "position": ["Sub Vocalist", "Maknae"] }
      ]
    },
    {
      "name": "aespa",
      "agency": "SM Entertainment",
      "members": [
        { "name": "Karina", "position": ["Leader", "Main Dancer", "Lead Rapper", "Sub Vocalist", "Visual", "Center"] },
        { "name": "Giselle", "position": ["Main Rapper", "Sub Vocalist"] },
        { "name": "Winter", "position": ["Lead Vocalist", "Lead Dancer", "Visual"] },
        { "name": "Ningning", "position": ["Main Vocalist", "Maknae"] }
      ]
    },
    {
      "name": "(G)I-DLE",
      "agency": "CUBE Entertainment",
      "members": [
        { "name": "Soyeon", "position": ["Leader", "Main Rapper", "Center", "Sub Vocalist"] },
        { "name": "Minnie", "position": ["Main Vocalist"] },
        { "name": "Yuqi", "position": ["Lead Dancer", "Sub Vocalist", "Sub Rapper"] },
        { "name": "Shuhua", "position": ["Sub Vocalist", "Visual", "Maknae"] },
        { "name": "Miyeon", "position": ["Main Vocalist", "Visual"] }
      ]
    }
  ]
};

type KpopMember = typeof kpopGroupsData.groups[0]['members'][0];

export async function onRequestPost(context: EventContext<Env, any, any>): Promise<Response> {
  try {
    const formData = await context.request.formData();
    
    // Extract sessionId and quizAnswers
    const sessionId = (formData.get('sessionId') as string) || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const quizAnswersRaw = formData.get('quizAnswers') as string;
    
    if (!quizAnswersRaw || quizAnswersRaw === 'undefined') {
      throw new Error('Quiz answers are missing or undefined');
    }
    
    // Parse and validate quiz answers
    const quizAnswers = quizAnswersSchema.parse(JSON.parse(quizAnswersRaw));
    
    // Handle photo upload - MVP version: Accept but don't store images
    // Note: Photos are processed but not persisted to avoid D1 storage issues
    let photoData = null;
    const photoFile = formData.get('photo') as File;
    if (photoFile && photoFile.size > 0) {
      // Photo received and validated for analysis, but not stored
      console.log(`Photo received: ${photoFile.name}, size: ${photoFile.size} bytes`);
      // Future: Use R2 for photo storage
    }
    
    // Generate analysis result
    const result = generateAnalysisResult(quizAnswers);
    
    // Prepare data for database
    const analysisData = {
      sessionId,
      photoData,
      quizAnswers: JSON.stringify(quizAnswers),
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
    const stmt = context.env.DB.prepare(`
      INSERT INTO analysisResults (sessionId, photoData, quizAnswers, groupName, position, subPosition, character, characterDesc, styleTags, memberName, agency, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `);
    
    await stmt.bind(
      analysisData.sessionId,
      analysisData.photoData,
      analysisData.quizAnswers,
      analysisData.groupName,
      analysisData.position,
      analysisData.subPosition,
      analysisData.character,
      analysisData.characterDesc,
      analysisData.styleTags,
      analysisData.memberName,
      analysisData.agency
    ).run();
    
    // Return the complete result
    const response = {
      sessionId: analysisData.sessionId,
      photoData: analysisData.photoData,
      quizAnswers,
      groupName: result.groupName,
      position: result.position,
      subPosition: result.subPosition,
      character: result.character,
      characterDesc: result.characterDesc,
      styleTags: result.styleTags,
      memberName: result.memberName,
      agency: result.agency
    };
    
    return new Response(JSON.stringify(response), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
    
  } catch (error) {
    console.error('Analysis error:', error);
    return new Response(JSON.stringify({ error: "Analysis failed" }), {
      status: 400,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
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

// Handle CORS preflight
export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}