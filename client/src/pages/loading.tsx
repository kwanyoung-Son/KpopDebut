import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Brain } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const loadingMessages = [
  '얼굴 특징을 분석하고 있어요...',
  '성격 유형을 매칭하고 있어요...',
  '음악 취향을 분석하고 있어요...',
  '패션 스타일을 평가하고 있어요...',
  '완벽한 포지션을 찾고 있어요...',
  '결과를 생성하고 있어요...'
];

export default function LoadingPage() {
  const [, setLocation] = useLocation();
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const analysisMutation = useMutation({
    mutationFn: async () => {
      const quizAnswers = sessionStorage.getItem('quizAnswers');
      const photoData = sessionStorage.getItem('uploadedPhoto');
      
      if (!quizAnswers) {
        throw new Error('Quiz answers not found');
      }

      const formData = new FormData();
      formData.append('quizAnswers', quizAnswers);
      formData.append('sessionId', `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
      
      if (photoData) {
        // Convert base64 to blob
        const response = await fetch(photoData);
        const blob = await response.blob();
        formData.append('photo', blob, 'photo.jpg');
      }

      const res = await apiRequest('POST', '/api/analyze', formData);
      return res.json();
    },
    onSuccess: (data) => {
      // Store session ID and redirect to results
      sessionStorage.setItem('sessionId', data.sessionId);
      setLocation(`/results/${data.sessionId}`);
    },
    onError: (error) => {
      console.error('Analysis failed:', error);
      // Handle error - could redirect back to quiz or show error message
    }
  });

  useEffect(() => {
    // Start analysis
    analysisMutation.mutate();

    // Progress animation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 16.67; // 100 / 6 steps
      });
      
      setMessageIndex(prev => {
        if (prev < loadingMessages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
      <div className="text-center text-white">
        <div className="relative mb-8">
          <div className="w-32 h-32 border-4 border-white/30 rounded-full animate-spin">
            <div className="w-8 h-8 bg-white rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Brain className="animate-pulse" size={48} />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4">AI 분석 중...</h2>
        <div className="text-xl font-light mb-8">{loadingMessages[messageIndex]}</div>
        <div className="max-w-md mx-auto">
          <div className="bg-white/20 rounded-full h-2 mb-4">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-1000" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-white/80">잠시만 기다려주세요...</p>
        </div>
      </div>
    </div>
  );
}
