// Cloudflare Worker for KPOP Debut Analyzer with LLM Integration
/// <reference types="@cloudflare/workers-types" />
import { z } from "zod";
import { kpopGroupsData } from '../server/kpop-data-kr';

interface Env {
  DB: D1Database;
  AI?: any; // Cloudflare Workers AI binding (optional)
  LLM_ENDPOINT?: string; // External LLM API endpoint (optional)
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

// Convert quiz answers to LLM prompt
function createAnalysisPrompt(answers: QuizAnswers, language: 'kr' | 'en' = 'kr') {
  const questionMapping = language === 'kr' ? {
    stagePresence: {
      center: "중심에서 빛나는 타입",
      leader: "팀을 이끄는 리더형", 
      performer: "열정적인 퍼포머",
      charisma: "조용한 카리스마"
    },
    friendsDescribe: {
      mood_maker: "분위기 메이커",
      serious: "진지하고 신중함",
      creative: "창의적이고 예술적", 
      responsible: "계획적이고 책임감"
    },
    newProject: {
      execute: "바로 따라하며 몸으로 익힌다",
      plan: "먼저 구조를 분석하고 계획한다",
      discuss: "멤버들과 함께 의견 나눈다",
      think: "혼자 차근차근 이해한다"
    },
    stageImportant: {
      expression: "표정과 눈빛",
      accuracy: "안무 정확도", 
      vocal: "음정과 감정 전달",
      teamwork: "전체적인 팀워크"
    },
    practiceStyle: {
      vocal: "고음 처리나 감정 전달",
      dance: "칼군무와 동작 정리",
      direction: "무대 연출/구성 아이디어",
      care: "멤버들 케어 및 소통"
    },
    danceStyle: {
      hiphop: "리듬감 넘치는 힙합",
      contemporary: "부드러운 컨템포러리",
      powerful: "파워풀한 퍼포먼스", 
      cute: "키치하고 귀여운 안무"
    },
    fashionStyle: {
      street: "스트릿, 캐주얼",
      chic: "시크하고 모던",
      lovely: "러블리하고 컬러풀",
      trendy: "트렌디하고 유니크"
    },
    makeupStyle: {
      natural: "자연스러운 내추럴",
      bold: "강렬한 포인트 컬러", 
      retro: "레트로 감성",
      elegant: "깔끔하고 고급진 스타일"
    }
  } : {
    stagePresence: {
      center: "Shining at the center",
      leader: "Leading the team",
      performer: "Passionate performer", 
      charisma: "Quiet charisma"
    },
    friendsDescribe: {
      mood_maker: "Mood maker",
      serious: "Serious and careful",
      creative: "Creative and artistic",
      responsible: "Planned and responsible"
    },
    newProject: {
      execute: "Learn by doing immediately",
      plan: "Analyze structure and plan first", 
      discuss: "Share opinions with members",
      think: "Understand step by step alone"
    },
    stageImportant: {
      expression: "Facial expressions and eyes",
      accuracy: "Choreography accuracy",
      vocal: "Pitch and emotion delivery", 
      teamwork: "Overall teamwork"
    },
    practiceStyle: {
      vocal: "High notes and emotion delivery",
      dance: "Synchronized choreography",
      direction: "Stage direction/composition ideas",
      care: "Member care and communication"
    },
    danceStyle: {
      hiphop: "Rhythmic hip-hop",
      contemporary: "Smooth contemporary",
      powerful: "Powerful performance",
      cute: "Cute and playful choreography"
    },
    fashionStyle: {
      street: "Street, casual",
      chic: "Chic and modern", 
      lovely: "Lovely and colorful",
      trendy: "Trendy and unique"
    },
    makeupStyle: {
      natural: "Natural style",
      bold: "Bold point colors",
      retro: "Retro vibes", 
      elegant: "Clean and sophisticated style"
    }
  };

  const prompt = language === 'kr' ? 
    `다음은 KPOP 아이돌 적성 분석을 위한 8개 질문에 대한 답변입니다:

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

답변은 반드시 유효한 JSON 형식으로만 제공해주세요.` :
    `Here are the answers to 8 KPOP idol aptitude analysis questions:

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

// Call external LLM API for analysis
async function callLLMAnalysis(prompt: string, env?: Env): Promise<any> {
  try {
    // Use environment variable for LLM endpoint (with fallback)
    const LLM_ENDPOINT = env?.LLM_ENDPOINT || 'https://icy-sun-4b5d.heroskyt87.workers.dev/';
    
    console.log('\n=== LLM API 호출 ===');
    console.log('📤 Endpoint:', LLM_ENDPOINT);
    console.log('📤 전송하는 프롬프트:');
    console.log(prompt);
    console.log('=====================\n');
    
    // Add timeout to fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      const response = await fetch(LLM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are a KPOP expert analyst who knows all idol groups and members. Always respond with valid JSON format only.' },
            { role: 'user', content: prompt }
          ]
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('📥 LLM API 응답 상태:', response.status);

      if (!response.ok) {
        throw new Error(`LLM API error: ${response.status} ${response.statusText}`);
      }

    const data = await response.json() as any;
    console.log('📥 LLM API 응답 데이터:');
    console.log(JSON.stringify(data, null, 2));
    
    // Extract the JSON from LLM response
    let result: any;
    let responseText: any;
    
    if (data?.response) {
      responseText = data.response;
    } else if (typeof data === "object" && data !== null && data.groupName) {
      result = data;
    } else {
      throw new Error('Invalid LLM response format');
    }

    if (!result && responseText) {
      const jsonMatch = typeof responseText === 'string' 
        ? responseText.match(/\{[\s\S]*\}/) 
        : null;
      
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else if (typeof responseText === 'object') {
        result = responseText;
      } else {
        throw new Error('No valid JSON found in LLM response');
      }
    }
    
    if (!result) {
      throw new Error('Invalid LLM response format');
    }

    console.log('✅ 파싱된 LLM 결과:');
    console.log(JSON.stringify(result, null, 2));
    console.log('===================\n');
    return result;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw new Error(`Fetch failed: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`);
    }
  } catch (error) {
    console.error('\n❌ LLM Analysis 오류:', error);
    console.log('🔄 Fallback 시스템 활성화 중...\n');
    throw error; // Re-throw to use fallback
  }
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
    case 'center': visualScore += 3; break;
    case 'leader': leaderScore += 3; break;
    case 'performer': danceScore += 3; break;
    case 'charisma': rapScore += 3; break;
  }

  // 2. 성격 분석
  switch (quizAnswers.friendsDescribe) {
    case 'mood_maker': danceScore += 2; break;
    case 'serious': leaderScore += 2; break;
    case 'creative': vocalScore += 2; break;
    case 'responsible': leaderScore += 2; break;
  }

  // 3. 프로젝트 스타일 분석
  switch (quizAnswers.newProject) {
    case 'execute': danceScore += 2; break;
    case 'plan': leaderScore += 2; break;
    case 'discuss': vocalScore += 2; break;
    case 'think': visualScore += 2; break;
  }

  // 4. 무대 중요도 분석
  switch (quizAnswers.stageImportant) {
    case 'expression': visualScore += 3; break;
    case 'accuracy': danceScore += 3; break;
    case 'vocal': vocalScore += 3; break;
    case 'teamwork': leaderScore += 3; break;
  }

  // 5. 연습 스타일 분석
  switch (quizAnswers.practiceStyle) {
    case 'vocal': vocalScore += 3; break;
    case 'dance': danceScore += 3; break;
    case 'direction': leaderScore += 3; break;
    case 'care': leaderScore += 2; visualScore += 1; break;
  }

  // 6. 춤 스타일 분석
  switch (quizAnswers.danceStyle) {
    case 'hiphop': rapScore += 3; break;
    case 'contemporary': vocalScore += 2; break;
    case 'powerful': danceScore += 3; break;
    case 'cute': visualScore += 3; break;
  }

  // 7. 패션 스타일 보너스
  switch (quizAnswers.fashionStyle) {
    case 'street': rapScore += 1; break;
    case 'chic': leaderScore += 1; break;
    case 'lovely': visualScore += 1; break;
    case 'trendy': danceScore += 1; break;
  }

  // 8. 메이크업 스타일 보너스
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

  // 포지션별 멤버 수집
  const getAllMembersWithPosition = (positionKeywords: string[]) => {
    const allMatches: Array<{member: any, group: string}> = [];
    
    kpopGroupsData.groups.forEach(group => {
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
    const leaderMembers = getAllMembersWithPosition(['리더']);
    if (leaderMembers.length > 0) {
      const selected = leaderMembers[Math.floor(Math.random() * leaderMembers.length)];
      matchedMember = selected.member;
      matchedGroup = selected.group;
    }
  } else if (scores.vocalScore === maxScore) {
    positionType = 'Main Vocalist';
    const vocalistMembers = getAllMembersWithPosition(['메인 보컬', '리드 보컬']);
    if (vocalistMembers.length > 0) {
      const selected = vocalistMembers[Math.floor(Math.random() * vocalistMembers.length)];
      matchedMember = selected.member;
      matchedGroup = selected.group;
    }
  } else if (scores.danceScore === maxScore) {
    positionType = 'Main Dancer';
    const dancerMembers = getAllMembersWithPosition(['메인 댄서', '리드 댄서']);
    if (dancerMembers.length > 0) {
      const selected = dancerMembers[Math.floor(Math.random() * dancerMembers.length)];
      matchedMember = selected.member;
      matchedGroup = selected.group;
    }
  } else if (scores.rapScore === maxScore) {
    positionType = 'Main Rapper';
    const rapperMembers = getAllMembersWithPosition(['메인 래퍼', '리드 래퍼']);
    if (rapperMembers.length > 0) {
      const selected = rapperMembers[Math.floor(Math.random() * rapperMembers.length)];
      matchedMember = selected.member;
      matchedGroup = selected.group;
    }
  } else {
    positionType = 'Visual';
    const visualMembers = getAllMembersWithPosition(['비주얼', '센터']);
    if (visualMembers.length > 0) {
      const selected = visualMembers[Math.floor(Math.random() * visualMembers.length)];
      matchedMember = selected.member;
      matchedGroup = selected.group;
    }
  }

  // 매칭된 멤버가 없을 경우 기본값 설정
  if (!matchedMember || !matchedGroup) {
    matchedMember = kpopGroupsData.groups[0].members[0];
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
    agency: kpopGroupsData.groups.find(g => g.name === matchedGroup)?.agency || ''
  };
}

// Main analysis function with LLM + Fallback
async function generateAnalysisResult(quizAnswers: QuizAnswers, language: 'kr' | 'en' = 'kr', env?: Env) {
  try {
    // Try LLM first
    const prompt = createAnalysisPrompt(quizAnswers, language);
    const llmResult = await callLLMAnalysis(prompt, env);
    
    return {
      groupName: llmResult.groupName || "NewJeans",
      position: llmResult.position || "Main Vocalist", 
      subPosition: llmResult.subPosition || "",
      character: llmResult.character || "NewJeans Hanni 스타일",
      characterDesc: llmResult.characterDesc || "밝고 친근한 매력으로 팬들을 사로잡는 타입",
      styleTags: llmResult.styleTags || ["#NewJeans스타일", "#MainVocalist", "#Hanni형"],
      memberName: llmResult.memberName || "Hanni",
      agency: llmResult.agency || "ADOR"
    };
  } catch (error) {
    // Fallback to score-based analysis
    console.log('📋 Fallback 분석 시스템 사용');
    return generateAnalysisResultFallback(quizAnswers);
  }
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
        
        // Extract fields
        const sessionId = (formData.get('sessionId') as string) || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const quizAnswersRaw = formData.get('quizAnswers') as string;
        const language = (formData.get('language') as 'kr' | 'en') || 'kr';
        
        if (!quizAnswersRaw || quizAnswersRaw === 'undefined') {
          throw new Error('Quiz answers are missing or undefined');
        }
        
        // Parse and validate quiz answers
        const quizAnswers = quizAnswersSchema.parse(JSON.parse(quizAnswersRaw));
        
        // Handle photo upload
        let photoData = null;
        const photoFile = formData.get('photo') as File;
        if (photoFile && photoFile.size > 0) {
          console.log(`Photo received: ${photoFile.name}, size: ${photoFile.size} bytes`);
        }
        
        // Generate analysis result with LLM + Fallback
        const result = await generateAnalysisResult(quizAnswers, language, env);
        
        // Prepare data for database
        const analysisData = {
          sessionId,
          photoData,
          quizAnswers: JSON.stringify(quizAnswers),
          language,
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
          INSERT INTO analysis_results (session_id, photo_data, quiz_answers, language, group_name, position, sub_position, character, character_desc, style_tags, member_name, agency, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `);
        
        await stmt.bind(
          analysisData.sessionId,
          analysisData.photoData,
          analysisData.quizAnswers,
          analysisData.language,
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

      // Fallback 404
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ 
        error: "Internal server error",
        message: error instanceof Error ? error.message : String(error)
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
  },
};
