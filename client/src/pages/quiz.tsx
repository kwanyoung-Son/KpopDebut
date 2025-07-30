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
    title: "성격 유형 분석",
    question: "그룹에서 나의 역할은?",
    field: "personality" as keyof QuizAnswers,
    options: [
      { value: "leader", icon: Crown, color: "text-yellow-500", title: "리더형", desc: "앞장서서 팀을 이끌어가는 타입" },
      { value: "entertainer", icon: Laugh, color: "text-orange-500", title: "예능형", desc: "분위기를 밝게 만드는 무드메이커" },
      { value: "charisma", icon: Flame, color: "text-red-500", title: "카리스마형", desc: "강렬한 존재감으로 시선을 사로잡는 타입" },
      { value: "cute", icon: Heart, color: "text-pink-500", title: "러블리형", desc: "사랑스러운 매력으로 어필하는 타입" }
    ]
  },
  {
    id: 2,
    title: "음악 취향 분석",
    question: "좋아하는 음악 장르는?",
    field: "musicGenre" as keyof QuizAnswers,
    options: [
      { value: "dance", icon: Music, color: "text-[hsl(var(--primary-teal))]", title: "댄스/EDM", desc: "" },
      { value: "ballad", icon: Mic, color: "text-[hsl(var(--primary-teal))]", title: "발라드", desc: "" },
      { value: "hiphop", icon: Headphones, color: "text-[hsl(var(--primary-teal))]", title: "힙합/랩", desc: "" },
      { value: "trot", icon: Guitar, color: "text-[hsl(var(--primary-teal))]", title: "트로트", desc: "" }
    ]
  },
  {
    id: 3,
    title: "패션 스타일 분석",
    question: "나의 패션 스타일은?",
    field: "fashionStyle" as keyof QuizAnswers,
    options: [
      { value: "street", icon: Shirt, color: "text-gray-700", title: "스트릿", desc: "편안하고 캐주얼한 스타일" },
      { value: "lovely", icon: Gem, color: "text-pink-500", title: "러블리", desc: "귀엽고 사랑스러운 스타일" },
      { value: "chic", icon: Bus, color: "text-gray-800", title: "시크", desc: "세련되고 도시적인 스타일" },
      { value: "vintage", icon: Disc, color: "text-amber-600", title: "빈티지", desc: "레트로하고 클래식한 스타일" }
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
