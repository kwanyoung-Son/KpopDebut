import { useQuery } from "@tanstack/react-query";
import { Share, RotateCcw, Download, Star, Mic, Heart, Users } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ResultCard from "@/components/result-card";
import { AnalysisResult } from "@shared/schema";

interface ResultsPageProps {
  params: { sessionId: string };
}

export default function ResultsPage({ params }: ResultsPageProps) {
  const { sessionId } = params;

  const { data: result, isLoading, error } = useQuery<AnalysisResult>({
    queryKey: ['/api/results', sessionId],
  });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'KPOP 데뷔 포지션 분석 결과',
          text: `나의 KPOP 아이돌 포지션: ${result?.position}!`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback - copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('링크가 복사되었습니다!');
      } catch (error) {
        console.error('Copy failed:', error);
      }
    }
  };

  const handleSaveImage = () => {
    // This would generate and download the result card image
    alert('이미지 저장 기능을 준비중입니다!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4"></div>
          <p className="text-xl">결과를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">결과를 불러올 수 없습니다.</p>
            <Link href="/">
              <Button>홈으로 돌아가기</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Results Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6">
            <Star className="text-white" size={48} />
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">분석 완료!</h2>
          <p className="text-xl text-gray-600">당신의 KPOP 데뷔 프로필이 완성되었습니다</p>
        </div>

        {/* Main Result Card */}
        <Card className="bg-white rounded-3xl card-shadow overflow-hidden mb-8">
          {/* Card Header with Group Info */}
          <div className="gradient-bg p-8 text-white text-center">
            <div className="flex items-center justify-center mb-4">
              {result.photoData && (
                <div className="w-24 h-24 rounded-full overflow-hidden mr-4 border-4 border-white/20">
                  <img src={result.photoData} alt="User" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="text-left">
                <div className="text-sm opacity-80">그룹명</div>
                <div className="text-2xl font-bold">{result.groupName}</div>
              </div>
            </div>
          </div>

          {/* Position & Character */}
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Position */}
              <div className="text-center">
                <div className="w-16 h-16 bg-[hsl(var(--primary-pink))] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mic className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">포지션</h3>
                <div className="text-2xl font-bold text-[hsl(var(--primary-pink))] mb-2">{result.position}</div>
                {result.subPosition && (
                  <div className="text-[hsl(var(--primary-pink))] font-medium">{result.subPosition}</div>
                )}
              </div>

              {/* Character */}
              <div className="text-center">
                <div className="w-16 h-16 bg-[hsl(var(--primary-teal))] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">캐릭터</h3>
                <div className="text-lg font-semibold text-gray-700">{result.character}</div>
                <p className="text-sm text-gray-600 mt-2">{result.characterDesc}</p>
              </div>
            </div>

            {/* Style Tags */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">스타일 태그</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {Array.isArray(result.styleTags) && result.styleTags.map((tag, index) => {
                  const gradients = [
                    'from-pink-500 to-purple-500',
                    'from-teal-500 to-blue-500',
                    'from-yellow-500 to-orange-500'
                  ];
                  return (
                    <span
                      key={index}
                      className={`bg-gradient-to-r ${gradients[index % gradients.length]} text-white px-4 py-2 rounded-full text-sm font-medium`}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Compatibility */}
            <div className="mt-8 bg-gray-50 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                <Users className="inline mr-2" size={20} />
                이런 멤버들과 잘 어울려요
              </h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="w-12 h-12 bg-[hsl(var(--primary-blue))] rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">💃</span>
                  </div>
                  <div className="text-sm font-medium">댄스 머신</div>
                </div>
                <div>
                  <div className="w-12 h-12 bg-[hsl(var(--secondary-yellow))] rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">😊</span>
                  </div>
                  <div className="text-sm font-medium">무드메이커</div>
                </div>
                <div>
                  <div className="w-12 h-12 bg-[hsl(var(--secondary-lightpink))] rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">💎</span>
                  </div>
                  <div className="text-sm font-medium">비주얼 센터</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Share Card Preview */}
        <ResultCard result={result} />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleShare}
            size="lg"
            className="bg-[hsl(var(--primary-pink))] hover:bg-[hsl(var(--primary-pink))]/90 text-white px-8 py-4 rounded-full font-bold"
          >
            <Share className="mr-2" size={20} />
            결과 공유하기
          </Button>
          <Link href="/">
            <Button
              size="lg"
              variant="outline"
              className="border-[hsl(var(--primary-pink))] text-[hsl(var(--primary-pink))] hover:bg-[hsl(var(--primary-pink))]/10 px-8 py-4 rounded-full font-bold"
            >
              <RotateCcw className="mr-2" size={20} />
              다시 테스트하기
            </Button>
          </Link>
          <Button
            onClick={handleSaveImage}
            size="lg"
            className="bg-[hsl(var(--primary-teal))] hover:bg-[hsl(var(--primary-teal))]/90 text-white px-8 py-4 rounded-full font-bold"
          >
            <Download className="mr-2" size={20} />
            이미지 저장
          </Button>
        </div>
      </div>
    </div>
  );
}
