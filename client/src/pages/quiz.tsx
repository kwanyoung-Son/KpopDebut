import { useState } from "react";
import { useLocation } from "wouter";
import { Brain, Crown, Laugh, Flame, Heart, Music, Mic, Headphones, Guitar, Shirt, Gem, Bus, Disc } from "lucide-react";
import QuizQuestion from "@/components/quiz-question";
import ProgressBar from "@/components/progress-bar";
import { Card, CardContent } from "@/components/ui/card";
import { QuizAnswers } from "@shared/schema";

const questions = [
  {
    id: 1,
    title: "성격/성향 분석",
    question: "무대 위에서의 나는?",
    field: "stagePresence" as keyof QuizAnswers,
    options: [
      { value: "center", icon: Crown, color: "text-yellow-500", title: "중심에서 빛나는 타입", desc: "" },
      { value: "leader", icon: Crown, color: "text-blue-500", title: "팀을 이끄는 리더형", desc: "" },
      { value: "performer", icon: Flame, color: "text-red-500", title: "열정적인 퍼포머", desc: "" },
      { value: "charisma", icon: Heart, color: "text-purple-500", title: "조용한 카리스마", desc: "" }
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
      { value: "responsible", icon: Crown, color: "text-green-600", title: "계획적이고 책임감", desc: "" }
    ]
  },
  {
    id: 3,
    title: "성격/성향 분석", 
    question: "새로운 프로젝트가 주어졌을 때 나는?",
    field: "newProject" as keyof QuizAnswers,
    options: [
      { value: "execute", icon: Flame, color: "text-red-500", title: "바로 실행해본다", desc: "" },
      { value: "plan", icon: Brain, color: "text-blue-500", title: "일단 계획부터 세운다", desc: "" },
      { value: "discuss", icon: Music, color: "text-green-500", title: "주변 사람들과 먼저 얘기해본다", desc: "" },
      { value: "think", icon: Heart, color: "text-purple-500", title: "혼자 조용히 생각 정리한다", desc: "" }
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
      { value: "teamwork", icon: Crown, color: "text-green-500", title: "전체적인 팀워크", desc: "" }
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
      { value: "care", icon: Heart, color: "text-green-500", title: "멤버들 케어 및 소통", desc: "" }
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
      { value: "cute", icon: Heart, color: "text-pink-500", title: "키치하고 귀여운 안무", desc: "" }
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
      { value: "trendy", icon: Disc, color: "text-purple-500", title: "트렌디하고 유니크", desc: "" }
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
      { value: "elegant", icon: Gem, color: "text-purple-500", title: "깔끔하고 고급진 스타일", desc: "" }
    ]
  }
];

export default function QuizPage() {
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});

  const handleAnswer = (field: keyof QuizAnswers, value: string) => {
    const newAnswers = { ...answers, [field]: value };
    setAnswers(newAnswers);

    // Store current answers
    sessionStorage.setItem('quizAnswers', JSON.stringify(newAnswers));

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
