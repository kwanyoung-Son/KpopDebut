import { useQuery } from "@tanstack/react-query";
import { Share, RotateCcw, Download, Star, Mic, Heart } from "lucide-react";
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

  const {
    data: result,
    isLoading,
    error,
  } = useQuery<AnalysisResult>({
    queryKey: ["/api/results", sessionId],
  });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "KPOP 데뷔 포지션 분석 결과",
          text: `나의 KPOP 아이돌 포지션: ${result?.position}!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback - copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("링크가 복사되었습니다!");
      } catch (error) {
        console.error("Copy failed:", error);
      }
    }
  };

  const handleSaveImage = () => {
    // This would generate and download the result card image
    alert("이미지 저장 기능을 준비중입니다!");
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-6 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Results Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 gradient-bg rounded-full flex items-center justify-center mx-auto mb-3">
            <Star className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">분석 완료!</h2>
          <p className="text-base text-gray-600">
            당신의 KPOP 데뷔 프로필이 완성되었습니다
          </p>
        </div>

        {/* Main Result Card */}
        <Card className="bg-white rounded-3xl card-shadow overflow-hidden mb-6">
          {/* Card Header with Group Info */}
          <div className="gradient-bg p-6 text-white text-center">
            <div className="flex items-center justify-center gap-4 mb-3">
              {result.photoData && (
                <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-white/20 flex-shrink-0">
                  <img
                    src={result.photoData}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="text-left">
                <div className="text-xs opacity-80">실제 KPOP 그룹</div>
                <div className="text-2xl font-bold">{result.groupName}</div>
                {(result as any).agency && (
                  <div className="text-xs opacity-90">
                    {(result as any).agency}
                  </div>
                )}
              </div>
            </div>
            {(result as any).memberName && (
              <div className="bg-white/20 rounded-full px-4 py-1.5 inline-block">
                <span className="text-sm">당신은 </span>
                <span className="font-bold">{(result as any).memberName}</span>
                <span className="text-sm"> 스타일!</span>
              </div>
            )}
          </div>

          {/* Position & Character */}
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Position */}
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-2">포지션</h3>
                <div className="text-xl font-bold text-[hsl(var(--primary-pink))]">
                  {result.position}
                </div>
                {result.subPosition && (
                  <div className="text-sm text-[hsl(var(--primary-pink))] font-medium mt-1">
                    {result.subPosition}
                  </div>
                )}
              </div>

              {/* Character */}
              <div className="text-center">
                <div className="w-14 h-14 bg-[hsl(var(--primary-teal))] rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl">✨</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">캐릭터</h3>
                <div className="text-base font-semibold text-gray-700">
                  {result.character}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {result.characterDesc}
                </p>
              </div>
            </div>

            {/* Style Tags */}
            <div className="mt-6">
              <h4 className="text-base font-semibold text-gray-800 mb-3 text-center">
                스타일 태그
              </h4>
              <div className="flex flex-wrap justify-center gap-2">
                {Array.isArray(result.styleTags) &&
                  result.styleTags.map((tag, index) => {
                    const gradients = [
                      "from-pink-500 to-purple-500",
                      "from-teal-500 to-blue-500",
                      "from-yellow-500 to-orange-500",
                    ];
                    return (
                      <span
                        key={index}
                        className={`bg-gradient-to-r ${gradients[index % gradients.length]} text-white px-3 py-1.5 rounded-full text-sm font-medium`}
                      >
                        {tag}
                      </span>
                    );
                  })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleShare}
            size="lg"
            className="bg-[hsl(var(--primary-pink))] hover:bg-[hsl(var(--primary-pink))]/90 text-white px-8 py-4 rounded-full font-bold"
          >
            <span className="mr-2 text-xl">📤</span>
            결과 공유하기
          </Button>
          <Link href="/">
            <Button
              size="lg"
              variant="outline"
              className="border-[hsl(var(--primary-pink))] text-[hsl(var(--primary-pink))] hover:bg-[hsl(var(--primary-pink))]/10 px-8 py-4 rounded-full font-bold"
            >
              <span className="mr-2 text-xl">🔄</span>
              다시 테스트하기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
