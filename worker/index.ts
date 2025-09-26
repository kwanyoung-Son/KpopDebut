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

// KPOP Groups Data - full dataset for better analysis results  
const kpopGroups = {
  groups: [
    // BTS
    { name: "BTS", agency: "BigHit Music", members: [
      { name: "RM", position: ["Leader", "Main Rapper"] },
      { name: "Jin", position: ["Sub Vocalist", "Visual"] },
      { name: "SUGA", position: ["Lead Rapper"] },
      { name: "j-hope", position: ["Main Dancer", "Sub Rapper", "Sub Vocalist"] },
      { name: "Jimin", position: ["Main Dancer", "Lead Vocalist"] },
      { name: "V", position: ["Lead Dancer", "Sub Vocalist", "Visual"] },
      { name: "Jungkook", position: ["Main Vocalist", "Lead Dancer", "Sub Rapper", "Center", "Maknae"] }
    ]},
    // BLACKPINK
    { name: "BLACKPINK", agency: "YG Entertainment", members: [
      { name: "Jisoo", position: ["Lead Vocalist", "Visual"] },
      { name: "Jennie", position: ["Main Rapper", "Lead Vocalist"] },
      { name: "Rosé", position: ["Main Vocalist", "Lead Dancer"] },
      { name: "Lisa", position: ["Main Dancer", "Lead Rapper", "Sub Vocalist", "Maknae"] }
    ]},
    // IVE
    { name: "IVE", agency: "Starship Entertainment", members: [
      { name: "Yujin", position: ["Leader", "Lead Vocalist"] },
      { name: "Gaeul", position: ["Main Rapper", "Sub Vocalist"] },
      { name: "Rei", position: ["Rapper", "Sub Vocalist"] },
      { name: "Wonyoung", position: ["Lead Dancer", "Sub Vocalist", "Visual", "Center"] },
      { name: "Liz", position: ["Main Vocalist"] },
      { name: "Leeseo", position: ["Sub Vocalist", "Maknae"] }
    ]},
    // aespa  
    { name: "aespa", agency: "SM Entertainment", members: [
      { name: "Karina", position: ["Leader", "Main Dancer", "Lead Rapper", "Sub Vocalist", "Visual", "Center"] },
      { name: "Giselle", position: ["Main Rapper", "Sub Vocalist"] },
      { name: "Winter", position: ["Lead Vocalist", "Lead Dancer", "Visual"] },
      { name: "Ningning", position: ["Main Vocalist", "Maknae"] }
    ]},
    // (G)I-DLE
    { name: "(G)I-DLE", agency: "CUBE Entertainment", members: [
      { name: "Soyeon", position: ["Leader", "Main Rapper", "Center", "Sub Vocalist"] },
      { name: "Minnie", position: ["Main Vocalist"] },
      { name: "Yuqi", position: ["Lead Dancer", "Sub Vocalist", "Sub Rapper"] },
      { name: "Shuhua", position: ["Sub Vocalist", "Visual", "Maknae"] },
      { name: "Miyeon", position: ["Main Vocalist", "Visual"] }
    ]},
    // NewJeans
    { name: "NewJeans", agency: "ADOR", members: [
      { name: "Minji", position: ["Leader", "Lead Vocalist"] },
      { name: "Hanni", position: ["Main Vocalist", "Lead Dancer"] },
      { name: "Danielle", position: ["Main Vocalist", "Lead Dancer"] },
      { name: "Haerin", position: ["Main Dancer", "Sub Vocalist", "Visual"] },
      { name: "Hyein", position: ["Lead Dancer", "Sub Vocalist", "Maknae"] }
    ]},
    // TWICE
    { name: "TWICE", agency: "JYP Entertainment", members: [
      { name: "Nayeon", position: ["Lead Vocalist", "Lead Dancer", "Center"] },
      { name: "Jeongyeon", position: ["Lead Vocalist"] },
      { name: "Momo", position: ["Main Dancer", "Sub Vocalist", "Sub Rapper"] },
      { name: "Sana", position: ["Sub Vocalist"] },
      { name: "Jihyo", position: ["Leader", "Main Vocalist"] },
      { name: "Mina", position: ["Main Dancer", "Sub Vocalist"] },
      { name: "Dahyun", position: ["Lead Rapper", "Sub Vocalist"] },
      { name: "Chaeyoung", position: ["Main Rapper", "Sub Vocalist"] },
      { name: "Tzuyu", position: ["Lead Dancer", "Sub Vocalist", "Visual", "Maknae"] }
    ]},
    // Red Velvet
    { name: "Red Velvet", agency: "SM Entertainment", members: [
      { name: "Irene", position: ["Leader", "Main Rapper", "Lead Dancer", "Visual", "Center"] },
      { name: "Seulgi", position: ["Main Dancer", "Lead Vocalist"] },
      { name: "Wendy", position: ["Main Vocalist"] },
      { name: "Joy", position: ["Lead Rapper", "Sub Vocalist"] },
      { name: "Yeri", position: ["Sub Vocalist", "Sub Rapper", "Maknae"] }
    ]},
    // STRAY KIDS  
    { name: "STRAY KIDS", agency: "JYP Entertainment", members: [
      { name: "Bang Chan", position: ["Leader", "Main Vocalist", "Lead Dancer", "Sub Rapper"] },
      { name: "Lee Know", position: ["Main Dancer", "Sub Vocalist", "Sub Rapper"] },
      { name: "Changbin", position: ["Main Rapper", "Sub Vocalist"] },
      { name: "Hyunjin", position: ["Main Dancer", "Lead Rapper", "Visual"] },
      { name: "Han", position: ["Main Rapper", "Lead Vocalist"] },
      { name: "Felix", position: ["Lead Dancer", "Lead Rapper", "Sub Vocalist"] },
      { name: "Seungmin", position: ["Main Vocalist"] },
      { name: "I.N", position: ["Sub Vocalist", "Maknae"] }
    ]},
    // ITZY
    { name: "ITZY", agency: "JYP Entertainment", members: [
      { name: "Yeji", position: ["Leader", "Main Dancer", "Lead Vocalist", "Sub Rapper"] },
      { name: "Lia", position: ["Main Vocalist", "Sub Rapper"] },
      { name: "Ryujin", position: ["Main Rapper", "Lead Dancer", "Sub Vocalist", "Center"] },
      { name: "Chaeryeong", position: ["Main Dancer", "Sub Vocalist", "Sub Rapper"] },
      { name: "Yuna", position: ["Lead Dancer", "Sub Vocalist", "Sub Rapper", "Visual", "Maknae"] }
    ]}
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

  // 전체 10개 그룹에서 포지션별 멤버 수집 - 훨씬 다양한 결과 제공
  const getAllMembersWithPosition = (positionKeywords: string[]) => {
    const allMatches: Array<{member: any, group: string}> = [];
    
    kpopGroups.groups.forEach(group => {
      group.members.forEach(member => {
        const hasPosition = member.position.some((pos: string) => 
          positionKeywords.some(keyword => pos.includes(keyword))
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
    positionType = 'Leader';
    const leaderMembers = getAllMembersWithPosition(['Leader']);
    if (leaderMembers.length > 0) {
      const selected = leaderMembers[Math.floor(Math.random() * leaderMembers.length)];
      matchedMember = selected.member;
      matchedGroup = selected.group;
    }
  } else if (scores.vocalScore === maxScore) {
    positionType = 'Main Vocalist';
    const vocalistMembers = getAllMembersWithPosition(['Main Vocalist', 'Lead Vocalist']);
    if (vocalistMembers.length > 0) {
      const selected = vocalistMembers[Math.floor(Math.random() * vocalistMembers.length)];
      matchedMember = selected.member;
      matchedGroup = selected.group;
    }
  } else if (scores.danceScore === maxScore) {
    positionType = 'Main Dancer';
    const dancerMembers = getAllMembersWithPosition(['Main Dancer', 'Lead Dancer']);
    if (dancerMembers.length > 0) {
      const selected = dancerMembers[Math.floor(Math.random() * dancerMembers.length)];
      matchedMember = selected.member;
      matchedGroup = selected.group;
    }
  } else if (scores.rapScore === maxScore) {
    positionType = 'Main Rapper';
    const rapperMembers = getAllMembersWithPosition(['Main Rapper', 'Lead Rapper']);
    if (rapperMembers.length > 0) {
      const selected = rapperMembers[Math.floor(Math.random() * rapperMembers.length)];
      matchedMember = selected.member;
      matchedGroup = selected.group;
    }
  } else {
    positionType = 'Visual';
    const visualMembers = getAllMembersWithPosition(['Visual', 'Center']);
    if (visualMembers.length > 0) {
      const selected = visualMembers[Math.floor(Math.random() * visualMembers.length)];
      matchedMember = selected.member;
      matchedGroup = selected.group;
    }
  }

  // 매칭된 멤버가 없을 경우 기본값 설정
  if (!matchedMember || !matchedGroup) {
    matchedMember = kpopGroups.groups[0].members[0]; // RM
    matchedGroup = 'BTS';
    positionType = 'Leader';
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
    agency: kpopGroups.groups.find(g => g.name === matchedGroup)?.agency || ''
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