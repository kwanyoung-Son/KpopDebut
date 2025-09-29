import { Link } from "wouter";
import { Music, Star, Camera, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export default function Home() {
  const [language, setLanguage] = useState<'kr' | 'en'>('kr');
  
  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'kr' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when changed
  const handleLanguageChange = (lang: 'kr' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
    queryFn: () => fetch('/api/stats').then(res => res.json()),
  });

  const texts = {
    kr: {
      title: 'KPOP 분석기',
      heroTitle1: '나는 어떤',
      heroTitle2: 'KPOP 아이돌',
      heroTitle3: '일까?',
      subtitle: 'AI로 알아보는 나의 KPOP 포지션',
      startButton: '지금 시작하기',
      analysisComplete: '분석 완료',
      footerTitle: 'KPOP 데뷔 분석기',
      footerDesc: 'AI 기술로 당신의 숨겨진 아이돌 매력을 발견하세요',
      footerCopy: '© 2025 KPOP 데뷔 분석기. 재미있게 즐겨주세요!'
    },
    en: {
      title: 'KPOP Analyzer',
      heroTitle1: 'Which',
      heroTitle2: 'KPOP Idol',
      heroTitle3: 'am I?',
      subtitle: 'Discover your KPOP position with AI',
      startButton: 'Start Now',
      analysisComplete: 'Analyses Complete',
      footerTitle: 'KPOP Debut Analyzer',
      footerDesc: 'Discover your hidden idol charm with AI technology',
      footerCopy: '© 2025 KPOP Debut Analyzer. Enjoy!'
    }
  };

  const t = texts[language];
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center">
                <Music className="text-white" size={16} />
              </div>
              <span className="font-bold text-xl text-gray-800">{t.title}</span>
            </div>
            
            {/* Language Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-full p-1">
              <button
                onClick={() => handleLanguageChange('kr')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  language === 'kr'
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                data-testid="language-kr-button"
              >
                한국어
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  language === 'en'
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                data-testid="language-en-button"
              >
                English
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen gradient-bg flex items-center justify-center px-4 pt-20">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="animate-float mb-8">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="text-4xl" size={48} />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            {t.heroTitle1}<br />
            <span className="bg-white text-transparent bg-clip-text">{t.heroTitle2}</span><br />
            {t.heroTitle3}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 font-light">
            {t.subtitle}
          </p>
          <Link href="/upload">
            <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100 text-lg font-bold px-8 py-4 rounded-full transform hover:scale-105 transition-all shadow-lg" data-testid="button-start">
              <Camera className="mr-2" size={20} />
              {t.startButton}
            </Button>
          </Link>
          
          {/* Stats */}
          <div className="mt-16 text-center">
            <div className="text-4xl font-bold">{stats?.totalAnalyses || 0}</div>
            <div className="text-white/80 text-lg">{t.analysisComplete}</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center mr-3">
              <Music className="text-white" size={20} />
            </div>
            <span className="text-2xl font-bold">{t.footerTitle}</span>
          </div>
          <p className="text-gray-400 mb-6">{t.footerDesc}</p>
          <p className="text-gray-500 text-sm">{t.footerCopy}</p>
        </div>
      </footer>
    </div>
  );
}
