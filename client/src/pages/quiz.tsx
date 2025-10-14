import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Brain, Crown, Laugh, Flame, Heart, Music, Mic, Headphones, Guitar, Shirt, Gem, Bus, Disc, Users, Star, BookOpen, Sparkles, Smile, Zap, Eye, Drama, Battery, Wind, Palette, Feather } from "lucide-react";
import QuizQuestion from "@/components/quiz-question";
import ProgressBar from "@/components/progress-bar";
import { Card, CardContent } from "@/components/ui/card";
import { QuizAnswers } from "@shared/schema";

const getQuestions = (language: 'kr' | 'en') => (language === 'kr' ? [
  {
    id: 1,
    title: "성격/성향 분석",
    question: "무대 위에서의 나는?",
    field: "stagePresence" as keyof QuizAnswers,
    options: [
      { value: "center", icon: Crown, color: "text-yellow-500", title: "중심에서 빛나는 타입", desc: "" },
      { value: "leader", icon: Crown, color: "text-blue-500", title: "팀을 이끄는 리더형", desc: "" },
      { value: "performer", icon: Flame, color: "text-red-500", title: "열정적인 퍼포머", desc: "" },
      { value: "charisma", icon: Heart, color: "text-purple-500", title: "조용한 카리스마", desc: "" },
      { value: "supporter", icon: Users, color: "text-green-500", title: "든든한 서포터형", desc: "" },
      { value: "allrounder", icon: Star, color: "text-orange-500", title: "만능 올라운더", desc: "" }
    ]
  },
  {
    id: 2,
    title: "성격/성향 분석",
    question: "친구들이 말하는 내 성격은?",
    field: "friendsDescribe" as keyof QuizAnswers,
    options: [
      { value: "mood_maker", icon: Laugh, color: "text-orange-500", title: "분위기 메이커", desc: "" },
      { value: "serious", icon: Brain, color: "text-blue-600", title: "진지하고 신중함", desc: "" },
      { value: "creative", icon: Disc, color: "text-purple-500", title: "창의적이고 예술적", desc: "" },
      { value: "responsible", icon: Crown, color: "text-green-600", title: "계획적이고 책임감", desc: "" },
      { value: "energetic", icon: Zap, color: "text-yellow-500", title: "활기차고 밝음", desc: "" },
      { value: "calm", icon: Heart, color: "text-blue-400", title: "차분하고 온화함", desc: "" }
    ]
  },
  {
    id: 3,
    title: "성격/성향 분석", 
    question: "새로운 안무나 곡이 주어졌을 때 나는?",
    field: "newProject" as keyof QuizAnswers,
    options: [
      { value: "execute", icon: Flame, color: "text-red-500", title: "바로 따라하며 몸으로 익힌다", desc: "" },
      { value: "plan", icon: Brain, color: "text-blue-500", title: "먼저 구조를 분석하고 계획한다", desc: "" },
      { value: "discuss", icon: Music, color: "text-green-500", title: "멤버들과 함께 의견 나눈다", desc: "" },
      { value: "think", icon: Heart, color: "text-purple-500", title: "혼자 차근차근 이해한다", desc: "" },
      { value: "research", icon: BookOpen, color: "text-amber-600", title: "레퍼런스 자료를 찾아본다", desc: "" },
      { value: "experiment", icon: Sparkles, color: "text-pink-500", title: "나만의 방식으로 실험한다", desc: "" }
    ]
  },
  {
    id: 4,
    title: "무대/표현 스타일 분석",
    question: "무대에서 가장 중요하게 생각하는 건?",
    field: "stageImportant" as keyof QuizAnswers,
    options: [
      { value: "expression", icon: Heart, color: "text-pink-500", title: "표정과 눈빛", desc: "" },
      { value: "accuracy", icon: Music, color: "text-blue-500", title: "안무 정확도", desc: "" },
      { value: "vocal", icon: Mic, color: "text-purple-500", title: "음정과 감정 전달", desc: "" },
      { value: "teamwork", icon: Crown, color: "text-green-500", title: "전체적인 팀워크", desc: "" },
      { value: "energy", icon: Zap, color: "text-orange-500", title: "에너지와 열정", desc: "" },
      { value: "connection", icon: Eye, color: "text-teal-500", title: "관객과의 교감", desc: "" }
    ]
  },
  {
    id: 5,
    title: "무대/표현 스타일 분석",
    question: "연습 중 가장 열중하는 건?",
    field: "practiceStyle" as keyof QuizAnswers,
    options: [
      { value: "vocal", icon: Mic, color: "text-purple-500", title: "고음 처리나 감정 전달", desc: "" },
      { value: "dance", icon: Music, color: "text-blue-500", title: "칼군무와 동작 정리", desc: "" },
      { value: "direction", icon: Brain, color: "text-orange-500", title: "무대 연출/구성 아이디어", desc: "" },
      { value: "care", icon: Heart, color: "text-green-500", title: "멤버들 케어 및 소통", desc: "" },
      { value: "expression", icon: Drama, color: "text-pink-500", title: "표현력과 감정 몰입", desc: "" },
      { value: "stamina", icon: Battery, color: "text-red-500", title: "체력과 지구력 향상", desc: "" }
    ]
  },
  {
    id: 6,
    title: "무대/표현 스타일 분석",
    question: "춤 스타일을 고르자면?",
    field: "danceStyle" as keyof QuizAnswers,
    options: [
      { value: "hiphop", icon: Headphones, color: "text-gray-700", title: "리듬감 넘치는 힙합", desc: "" },
      { value: "contemporary", icon: Disc, color: "text-purple-500", title: "부드러운 컨템포러리", desc: "" },
      { value: "powerful", icon: Flame, color: "text-red-500", title: "파워풀한 퍼포먼스", desc: "" },
      { value: "cute", icon: Heart, color: "text-pink-500", title: "키치하고 귀여운 안무", desc: "" },
      { value: "sensual", icon: Wind, color: "text-purple-600", title: "세련되고 섹시한 댄스", desc: "" },
      { value: "energetic", icon: Zap, color: "text-yellow-600", title: "역동적이고 활기찬 움직임", desc: "" }
    ]
  },
  {
    id: 7,
    title: "스타일/패션 감각 분석",
    question: "평소 내 패션 스타일은?",
    field: "fashionStyle" as keyof QuizAnswers,
    options: [
      { value: "street", icon: Shirt, color: "text-gray-700", title: "스트릿, 캐주얼", desc: "" },
      { value: "chic", icon: Gem, color: "text-gray-800", title: "시크하고 모던", desc: "" },
      { value: "lovely", icon: Heart, color: "text-pink-500", title: "러블리하고 컬러풀", desc: "" },
      { value: "trendy", icon: Disc, color: "text-purple-500", title: "트렌디하고 유니크", desc: "" },
      { value: "vintage", icon: Music, color: "text-amber-700", title: "빈티지와 레트로", desc: "" },
      { value: "minimal", icon: Gem, color: "text-blue-600", title: "미니멀과 심플", desc: "" }
    ]
  },
  {
    id: 8,
    title: "스타일/패션 감각 분석",
    question: "가장 선호하는 헤어/메이크업 스타일은?",
    field: "makeupStyle" as keyof QuizAnswers,
    options: [
      { value: "natural", icon: Heart, color: "text-green-500", title: "자연스러운 내추럴", desc: "" },
      { value: "bold", icon: Flame, color: "text-red-500", title: "강렬한 포인트 컬러", desc: "" },
      { value: "retro", icon: Disc, color: "text-amber-600", title: "레트로 감성", desc: "" },
      { value: "elegant", icon: Gem, color: "text-purple-500", title: "깔끔하고 고급진 스타일", desc: "" },
      { value: "glam", icon: Sparkles, color: "text-yellow-500", title: "화려한 글램 메이크업", desc: "" },
      { value: "soft", icon: Feather, color: "text-pink-400", title: "부드러운 페미닌 룩", desc: "" }
    ]
  }
] : [
  {
    id: 1,
    title: "Personality Analysis",
    question: "On stage, I am?",
    field: "stagePresence" as keyof QuizAnswers,
    options: [
      { value: "center", icon: Crown, color: "text-yellow-500", title: "Shining at center", desc: "" },
      { value: "leader", icon: Crown, color: "text-blue-500", title: "Team leader type", desc: "" },
      { value: "performer", icon: Flame, color: "text-red-500", title: "Passionate performer", desc: "" },
      { value: "charisma", icon: Heart, color: "text-purple-500", title: "Quiet charisma", desc: "" },
      { value: "supporter", icon: Users, color: "text-green-500", title: "Reliable supporter", desc: "" },
      { value: "allrounder", icon: Star, color: "text-orange-500", title: "Versatile all-rounder", desc: "" }
    ]
  },
  {
    id: 2,
    title: "Personality Analysis",
    question: "Friends describe me as?",
    field: "friendsDescribe" as keyof QuizAnswers,
    options: [
      { value: "mood_maker", icon: Laugh, color: "text-orange-500", title: "Mood maker", desc: "" },
      { value: "serious", icon: Brain, color: "text-blue-600", title: "Serious and careful", desc: "" },
      { value: "creative", icon: Disc, color: "text-purple-500", title: "Creative and artistic", desc: "" },
      { value: "responsible", icon: Crown, color: "text-green-600", title: "Responsible planner", desc: "" },
      { value: "energetic", icon: Zap, color: "text-yellow-500", title: "Energetic and bright", desc: "" },
      { value: "calm", icon: Heart, color: "text-blue-400", title: "Calm and gentle", desc: "" }
    ]
  },
  {
    id: 3,
    title: "Personality Analysis",
    question: "When given new choreography or song, I?",
    field: "newProject" as keyof QuizAnswers,
    options: [
      { value: "execute", icon: Flame, color: "text-red-500", title: "Learn by doing right away", desc: "" },
      { value: "plan", icon: Brain, color: "text-blue-500", title: "Analyze and plan first", desc: "" },
      { value: "discuss", icon: Music, color: "text-green-500", title: "Discuss with team", desc: "" },
      { value: "think", icon: Heart, color: "text-purple-500", title: "Understand step by step alone", desc: "" },
      { value: "research", icon: BookOpen, color: "text-amber-600", title: "Look for references", desc: "" },
      { value: "experiment", icon: Sparkles, color: "text-pink-500", title: "Try my own way", desc: "" }
    ]
  },
  {
    id: 4,
    title: "Performance Style Analysis",
    question: "What's most important on stage?",
    field: "stageImportant" as keyof QuizAnswers,
    options: [
      { value: "expression", icon: Heart, color: "text-pink-500", title: "Facial expression & eyes", desc: "" },
      { value: "accuracy", icon: Music, color: "text-blue-500", title: "Choreography accuracy", desc: "" },
      { value: "vocal", icon: Mic, color: "text-purple-500", title: "Pitch & emotion delivery", desc: "" },
      { value: "teamwork", icon: Crown, color: "text-green-500", title: "Overall teamwork", desc: "" },
      { value: "energy", icon: Zap, color: "text-orange-500", title: "Energy and passion", desc: "" },
      { value: "connection", icon: Eye, color: "text-teal-500", title: "Audience connection", desc: "" }
    ]
  },
  {
    id: 5,
    title: "Performance Style Analysis",
    question: "What I focus on during practice?",
    field: "practiceStyle" as keyof QuizAnswers,
    options: [
      { value: "vocal", icon: Mic, color: "text-purple-500", title: "High notes & emotion", desc: "" },
      { value: "dance", icon: Music, color: "text-blue-500", title: "Synchronized moves", desc: "" },
      { value: "direction", icon: Brain, color: "text-orange-500", title: "Stage direction ideas", desc: "" },
      { value: "care", icon: Heart, color: "text-green-500", title: "Member care & communication", desc: "" },
      { value: "expression", icon: Drama, color: "text-pink-500", title: "Expressiveness & emotion", desc: "" },
      { value: "stamina", icon: Battery, color: "text-red-500", title: "Stamina & endurance", desc: "" }
    ]
  },
  {
    id: 6,
    title: "Performance Style Analysis",
    question: "Preferred dance style?",
    field: "danceStyle" as keyof QuizAnswers,
    options: [
      { value: "hiphop", icon: Headphones, color: "text-gray-700", title: "Rhythmic hip-hop", desc: "" },
      { value: "contemporary", icon: Disc, color: "text-purple-500", title: "Smooth contemporary", desc: "" },
      { value: "powerful", icon: Flame, color: "text-red-500", title: "Powerful performance", desc: "" },
      { value: "cute", icon: Heart, color: "text-pink-500", title: "Cute & playful", desc: "" },
      { value: "sensual", icon: Wind, color: "text-purple-600", title: "Sophisticated & sensual", desc: "" },
      { value: "energetic", icon: Zap, color: "text-yellow-600", title: "Dynamic & energetic", desc: "" }
    ]
  },
  {
    id: 7,
    title: "Style/Fashion Analysis",
    question: "My usual fashion style?",
    field: "fashionStyle" as keyof QuizAnswers,
    options: [
      { value: "street", icon: Shirt, color: "text-gray-700", title: "Street, casual", desc: "" },
      { value: "chic", icon: Gem, color: "text-gray-800", title: "Chic and modern", desc: "" },
      { value: "lovely", icon: Heart, color: "text-pink-500", title: "Lovely and colorful", desc: "" },
      { value: "trendy", icon: Disc, color: "text-purple-500", title: "Trendy and unique", desc: "" },
      { value: "vintage", icon: Music, color: "text-amber-700", title: "Vintage and retro", desc: "" },
      { value: "minimal", icon: Gem, color: "text-blue-600", title: "Minimal and simple", desc: "" }
    ]
  },
  {
    id: 8,
    title: "Style/Fashion Analysis",
    question: "Preferred hair/makeup style?",
    field: "makeupStyle" as keyof QuizAnswers,
    options: [
      { value: "natural", icon: Heart, color: "text-green-500", title: "Natural style", desc: "" },
      { value: "bold", icon: Flame, color: "text-red-500", title: "Bold point colors", desc: "" },
      { value: "retro", icon: Disc, color: "text-amber-600", title: "Retro vibes", desc: "" },
      { value: "elegant", icon: Gem, color: "text-purple-500", title: "Clean & sophisticated", desc: "" },
      { value: "glam", icon: Sparkles, color: "text-yellow-500", title: "Glamorous makeup", desc: "" },
      { value: "soft", icon: Feather, color: "text-pink-400", title: "Soft feminine look", desc: "" }
    ]
  }
]);

export default function QuizPage() {
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [language, setLanguage] = useState<'kr' | 'en'>('kr');
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>(() => {
    // 퀴즈 시작 시 모든 저장된 데이터 초기화
    sessionStorage.removeItem('quizAnswers');
    sessionStorage.removeItem('selectedAnswers');
    localStorage.removeItem('quizState');
    return {};
  });

  const questions = getQuestions(language);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'kr' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleAnswer = (field: keyof QuizAnswers, value: string) => {
    const newAnswers = { ...answers, [field]: value };
    setAnswers(newAnswers);

    // Store current answers
    sessionStorage.setItem('quizAnswers', JSON.stringify(newAnswers));
    
    // Store language preference from localStorage
    const language = localStorage.getItem('language') || 'kr';
    sessionStorage.setItem('language', language);

    // Move to next question or complete quiz
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Quiz completed, go to loading
        setLocation("/loading");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <ProgressBar current={currentQuestion + 1} total={questions.length} />

        {/* Quiz Card */}
        <Card className="bg-white rounded-3xl card-shadow animate-slide-up">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{questions[currentQuestion].title}</h3>
              <p className="text-gray-600">{questions[currentQuestion].question}</p>
            </div>

            <QuizQuestion
              question={questions[currentQuestion]}
              onAnswer={handleAnswer}
              selectedValue={answers[questions[currentQuestion].field] as string}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
