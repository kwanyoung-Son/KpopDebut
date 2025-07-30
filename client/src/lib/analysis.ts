import { QuizAnswers } from "@shared/schema";

export interface AnalysisConfig {
  groupNames: string[];
  positions: Record<string, { main: string; sub: string }>;
  characters: Record<string, { type: string; desc: string }>;
  styleTags: Record<string, string[]>;
}

export const analysisConfig: AnalysisConfig = {
  groupNames: ['STELLAR NOVA', 'COSMIC DREAM', 'RAINBOW STAR', 'NEON LIGHT', 'CRYSTAL WAVE'],
  
  positions: {
    leader: { main: '리더', sub: '메인보컬' },
    entertainer: { main: '메인댄서', sub: '서브보컬' },
    charisma: { main: '래퍼', sub: '서브댄서' },
    cute: { main: '비주얼', sub: '서브보컬' }
  },
  
  characters: {
    leader: { 
      type: '따뜻한 카리스마의 리더형', 
      desc: '강한 리더십과 따뜻한 인간미를 동시에 갖춘 완벽한 리더 타입' 
    },
    entertainer: { 
      type: '에너지 넘치는 댄스머신', 
      desc: '무대 위에서 폭발적인 에너지로 관객을 사로잡는 타입' 
    },
    charisma: { 
      type: '쿨한 힙합 아티스트', 
      desc: '강렬한 랩과 카리스마로 무대를 지배하는 타입' 
    },
    cute: { 
      type: '사랑스러운 비주얼 센터', 
      desc: '완벽한 외모와 매력으로 시선을 집중시키는 타입' 
    }
  },
  
  styleTags: {
    leader: ['#강인한리더', '#카리스마보컬', '#시크모던'],
    entertainer: ['#폭발적댄스', '#에너지넘침', '#스트릿감성'],
    charisma: ['#힙합퀸', '#강렬카리스마', '#도시적매력'],
    cute: ['#완벽비주얼', '#사랑스러움', '#러블리매력']
  }
};

export function generateAnalysisResult(answers: QuizAnswers) {
  const personality = answers.personality;
  const groupName = analysisConfig.groupNames[Math.floor(Math.random() * analysisConfig.groupNames.length)];
  
  return {
    groupName,
    position: analysisConfig.positions[personality].main,
    subPosition: analysisConfig.positions[personality].sub,
    character: analysisConfig.characters[personality].type,
    characterDesc: analysisConfig.characters[personality].desc,
    styleTags: analysisConfig.styleTags[personality]
  };
}
