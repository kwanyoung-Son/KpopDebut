import { Link } from "wouter";
import { Music, Star, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
    queryFn: () => fetch('/api/stats').then(res => res.json()),
  });
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
              <span className="font-bold text-xl text-gray-800">KPOP 분석기</span>
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
            나는 어떤<br />
            <span className="bg-white text-transparent bg-clip-text">KPOP 아이돌</span><br />
            일까?
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 font-light">
            AI로 알아보는 나의 KPOP 포지션
          </p>
          <Link href="/upload">
            <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100 text-lg font-bold px-8 py-4 rounded-full transform hover:scale-105 transition-all shadow-lg">
              <Camera className="mr-2" size={20} />
              지금 시작하기
            </Button>
          </Link>
          
          {/* Stats */}
          <div className="mt-16 text-center">
            <div className="text-4xl font-bold">{stats?.totalAnalyses || 0}</div>
            <div className="text-white/80 text-lg">분석 완료</div>
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
            <span className="text-2xl font-bold">KPOP 데뷔 분석기</span>
          </div>
          <p className="text-gray-400 mb-6">AI 기술로 당신의 숨겨진 아이돌 매력을 발견하세요</p>
          <p className="text-gray-500 text-sm">© 2024 KPOP 데뷔 분석기. 재미있게 즐겨주세요!</p>
        </div>
      </footer>
    </div>
  );
}
