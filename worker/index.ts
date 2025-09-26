// Cloudflare Worker for KPOP Debut Analyzer
/// <reference types="@cloudflare/workers-types" />
import { z } from "zod";

interface Env {
  DB: D1Database;
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
        { "name": "Yujin", "position": ["Leader", "Lead Vocalist", "Lead Dancer"] },
        { "name": "Gaeul", "position": ["Main Rapper", "Sub Vocalist"] },
        { "name": "Rei", "position": ["Sub Vocalist", "Sub Rapper"] },
        { "name": "Wonyoung", "position": ["Center", "Visual", "Sub Vocalist", "Maknae"] },
        { "name": "Liz", "position": ["Main Vocalist"] },
        { "name": "Leeseo", "position": ["Sub Vocalist", "Sub Rapper", "Maknae"] }
      ]
    },
    {
      "name": "aespa",
      "agency": "SM Entertainment",
      "members": [
        { "name": "Karina", "position": ["Leader", "Main Dancer", "Lead Rapper", "Sub Vocalist", "Visual"] },
        { "name": "Giselle", "position": ["Main Rapper", "Sub Vocalist"] },
        { "name": "Winter", "position": ["Main Vocalist", "Lead Dancer", "Visual"] },
        { "name": "Ningning", "position": ["Main Vocalist", "Maknae"] }
      ]
    },
    {
      "name": "(G)I-DLE",
      "agency": "Cube Entertainment",
      "members": [
        { "name": "Miyeon", "position": ["Main Vocalist", "Visual"] },
        { "name": "Minnie", "position": ["Main Vocalist", "Sub Rapper"] },
        { "name": "Soyeon", "position": ["Leader", "Main Rapper", "Sub Vocalist"] },
        { "name": "Yuqi", "position": ["Lead Vocalist", "Lead Dancer", "Sub Rapper"] },
        { "name": "Shuhua", "position": ["Sub Vocalist", "Visual", "Maknae"] }
      ]
    }
  ]
};

// Analysis algorithm - 점수 기반 정교한 분석 시스템
function generateAnalysisResult(quizAnswers: QuizAnswers) {
  // 5개 포지션별 점수 초기화
  let leaderScore = 0;
  let vocalScore = 0; 
  let danceScore = 0;
  let rapScore = 0;
  let visualScore = 0;

  // 1. 무대 존재감 분석 (stagePresence)
  switch (quizAnswers.stagePresence) {
    case 'center': visualScore += 3; break;
    case 'leader': leaderScore += 3; break;
    case 'performer': danceScore += 3; break;
    case 'charisma': rapScore += 3; break;
  }

  // 2. 성격 분석 (friendsDescribe)
  switch (quizAnswers.friendsDescribe) {
    case 'mood_maker': danceScore += 2; break;
    case 'serious': leaderScore += 2; break;
    case 'creative': vocalScore += 2; break;
    case 'responsible': leaderScore += 2; break;
  }

  // 3. 프로젝트 스타일 분석 (newProject)
  switch (quizAnswers.newProject) {
    case 'execute': danceScore += 2; break;
    case 'plan': leaderScore += 2; break;
    case 'discuss': vocalScore += 2; break;
    case 'think': visualScore += 2; break;
  }

  // 4. 무대 중요도 분석 (stageImportant)
  switch (quizAnswers.stageImportant) {
    case 'expression': visualScore += 3; break;
    case 'accuracy': danceScore += 3; break;
    case 'vocal': vocalScore += 3; break;
    case 'teamwork': leaderScore += 3; break;
  }

  // 5. 연습 스타일 분석 (practiceStyle)
  switch (quizAnswers.practiceStyle) {
    case 'vocal': vocalScore += 3; break;
    case 'dance': danceScore += 3; break;
    case 'direction': leaderScore += 3; break;
    case 'care': leaderScore += 2; visualScore += 1; break;
  }

  // 6. 춤 스타일 분석 (danceStyle)
  switch (quizAnswers.danceStyle) {
    case 'hiphop': rapScore += 3; break;
    case 'contemporary': vocalScore += 2; break;
    case 'powerful': danceScore += 3; break;
    case 'cute': visualScore += 3; break;
  }

  // 7. 패션 스타일 보너스 (fashionStyle)
  switch (quizAnswers.fashionStyle) {
    case 'street': rapScore += 1; break;
    case 'chic': leaderScore += 1; break;
    case 'lovely': visualScore += 1; break;
    case 'trendy': danceScore += 1; break;
  }

  // 8. 메이크업 스타일 보너스 (makeupStyle)
  switch (quizAnswers.makeupStyle) {
    case 'bold': rapScore += 1; break;
    case 'elegant': leaderScore += 1; break;
    case 'natural': visualScore += 1; break;
    case 'retro': vocalScore += 1; break;
  }

  // 최고 점수 포지션 결정
  const scores = { leaderScore, vocalScore, danceScore, rapScore, visualScore };
  const maxScore = Math.max(...Object.values(scores));
  
  let positionType = '';
  let matchedMember: { name: string; position: string[] } | null = null;
  let matchedGroup = '';

  // 최고 점수에 해당하는 포지션의 멤버들 중에서 랜덤 선택
  if (scores.leaderScore === maxScore) {
    positionType = 'Leader';
    const leaderMembers = [
      { member: kpopGroupsData.groups[0].members[0], group: 'BTS' }, // RM
      { member: kpopGroupsData.groups[2].members[0], group: 'IVE' }, // Yujin (실제로는 없음, 수정 필요)
      { member: kpopGroupsData.groups[3].members[0], group: 'aespa' }, // Karina
      { member: kpopGroupsData.groups[4].members[2], group: '(G)I-DLE' }, // Soyeon
    ];
    const selected = leaderMembers[Math.floor(Math.random() * leaderMembers.length)];
    matchedMember = selected.member;
    matchedGroup = selected.group;
  } else if (scores.vocalScore === maxScore) {
    positionType = 'Main Vocalist';
    const vocalistMembers = [
      { member: kpopGroupsData.groups[0].members[6], group: 'BTS' }, // Jungkook
      { member: kpopGroupsData.groups[1].members[2], group: 'BLACKPINK' }, // Rosé
      { member: kpopGroupsData.groups[2].members[4], group: 'IVE' }, // Liz
      { member: kpopGroupsData.groups[3].members[3], group: 'aespa' }, // Ningning
      { member: kpopGroupsData.groups[4].members[0], group: '(G)I-DLE' }, // Miyeon
    ];
    const selected = vocalistMembers[Math.floor(Math.random() * vocalistMembers.length)];
    matchedMember = selected.member;
    matchedGroup = selected.group;
  } else if (scores.danceScore === maxScore) {
    positionType = 'Main Dancer';
    const dancerMembers = [
      { member: kpopGroupsData.groups[0].members[3], group: 'BTS' }, // j-hope
      { member: kpopGroupsData.groups[0].members[4], group: 'BTS' }, // Jimin
      { member: kpopGroupsData.groups[1].members[3], group: 'BLACKPINK' }, // Lisa
      { member: kpopGroupsData.groups[3].members[0], group: 'aespa' }, // Karina
    ];
    const selected = dancerMembers[Math.floor(Math.random() * dancerMembers.length)];
    matchedMember = selected.member;
    matchedGroup = selected.group;
  } else if (scores.rapScore === maxScore) {
    positionType = 'Main Rapper';
    const rapperMembers = [
      { member: kpopGroupsData.groups[0].members[0], group: 'BTS' }, // RM
      { member: kpopGroupsData.groups[0].members[2], group: 'BTS' }, // SUGA
      { member: kpopGroupsData.groups[1].members[1], group: 'BLACKPINK' }, // Jennie
      { member: kpopGroupsData.groups[4].members[2], group: '(G)I-DLE' }, // Soyeon
    ];
    const selected = rapperMembers[Math.floor(Math.random() * rapperMembers.length)];
    matchedMember = selected.member;
    matchedGroup = selected.group;
  } else {
    positionType = 'Visual';
    const visualMembers = [
      { member: kpopGroupsData.groups[0].members[1], group: 'BTS' }, // Jin
      { member: kpopGroupsData.groups[0].members[5], group: 'BTS' }, // V
      { member: kpopGroupsData.groups[1].members[0], group: 'BLACKPINK' }, // Jisoo
      { member: kpopGroupsData.groups[2].members[3], group: 'IVE' }, // Wonyoung
      { member: kpopGroupsData.groups[3].members[2], group: 'aespa' }, // Winter
      { member: kpopGroupsData.groups[4].members[4], group: '(G)I-DLE' }, // Shuhua
    ];
    const selected = visualMembers[Math.floor(Math.random() * visualMembers.length)];
    matchedMember = selected.member;
    matchedGroup = selected.group;
  }

  // Character descriptions
  const characterDescriptions: Record<string, string> = {
    'Leader': `${matchedMember?.name || '리더'}처럼 팀을 이끄는 카리스마와 리더십을 가진 타입`,
    'Main Vocalist': `${matchedMember?.name || '메인보컬'}처럼 완벽한 음정과 감정 전달로 청중을 사로잡는 타입`,
    'Main Dancer': `${matchedMember?.name || '메인댄서'}처럼 뛰어난 댄스 실력과 무대 장악력을 가진 타입`,
    'Main Rapper': `${matchedMember?.name || '메인래퍼'}처럼 강렬한 랩과 카리스마로 무대를 지배하는 타입`,
    'Visual': `${matchedMember?.name || '비주얼'}처럼 뛰어난 외모와 독특한 매력을 가진 타입`
  };

  const styleTags = [
    `#${matchedGroup}스타일`,
    `#${positionType.replace(' ', '')}`,
    `#${matchedMember?.name || 'KPOP'}형`
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

// Main Worker export
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    try {
      // Route: GET /api/stats
      if (path === '/api/stats' && request.method === 'GET') {
        const result = await env.DB.prepare(
          "SELECT COUNT(*) as count FROM analysis_results"
        ).first();
        
        const count = result?.count || 0;
        
        return new Response(JSON.stringify({ totalAnalyses: count }), {
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }

      // Route: POST /api/analyze
      if (path === '/api/analyze' && request.method === 'POST') {
        const formData = await request.formData();
        
        // Extract sessionId and quizAnswers
        const sessionId = (formData.get('sessionId') as string) || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const quizAnswersRaw = formData.get('quizAnswers') as string;
        
        if (!quizAnswersRaw || quizAnswersRaw === 'undefined') {
          throw new Error('Quiz answers are missing or undefined');
        }
        
        // Parse and validate quiz answers
        const quizAnswers = quizAnswersSchema.parse(JSON.parse(quizAnswersRaw));
        
        // Handle photo upload - MVP version: Accept but don't store images
        let photoData = null;
        const photoFile = formData.get('photo') as File;
        if (photoFile && photoFile.size > 0) {
          console.log(`Photo received: ${photoFile.name}, size: ${photoFile.size} bytes`);
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
        const stmt = env.DB.prepare(`
          INSERT INTO analysis_results (session_id, photo_data, quiz_answers, group_name, position, sub_position, character, character_desc, style_tags, member_name, agency, created_at)
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
          ...result
        };
        
        return new Response(JSON.stringify(response), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }

      // Route: GET /api/results/:sessionId
      if (path.startsWith('/api/results/') && request.method === 'GET') {
        const sessionId = path.split('/').pop();
        
        if (!sessionId) {
          return new Response(JSON.stringify({ error: "Session ID is required" }), {
            status: 400,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          });
        }
        
        // Get analysis result from D1
        const result = await env.DB.prepare(
          `SELECT * FROM analysis_results WHERE session_id = ?`
        ).bind(sessionId).first();
        
        if (!result) {
          return new Response(JSON.stringify({ error: "Result not found" }), {
            status: 404,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          });
        }
        
        // Parse JSON fields
        const parsedResult = {
          ...result,
          quizAnswers: result.quiz_answers ? JSON.parse(result.quiz_answers as string) : null,
          styleTags: result.style_tags ? JSON.parse(result.style_tags as string) : []
        };
        
        return new Response(JSON.stringify(parsedResult), {
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }

      // Serve static files for any other request
      if (url.pathname === '/' || url.pathname.startsWith('/static/') || url.pathname.includes('.')) {
        return new Response('Static file serving not implemented yet', { 
          status: 404,
          headers: corsHeaders 
        });
      }

      // Fallback to index.html for SPA routing
      return new Response('SPA routing - serve index.html', { 
        status: 404,
        headers: corsHeaders 
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
  },
};