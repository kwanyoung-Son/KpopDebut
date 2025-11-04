import { useQuery } from "@tanstack/react-query";
import { Share, RotateCcw, Download, Star, Mic, Heart } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ResultCard from "@/components/result-card";
import { AnalysisResult } from "@shared/schema";
import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";

interface ResultsPageProps {
  params: { sessionId: string };
}

const texts = {
  kr: {
    loading: "결과를 불러오는 중...",
    errorLoading: "결과를 불러올 수 없습니다.",
    backHome: "홈으로 돌아가기",
    debutProfile: "KPOP 데뷔 프로필",
    youAre: "당신은",
    style: "스타일!",
    position: "포지션",
    character: "캐릭터",
    styleTags: "스타일 태그",
    shareResult: "공유",
    saveImage: "저장",
    retryTest: "다시하기",
    shareTitle: "KPOP 데뷔 포지션 분석 결과",
    shareText: (position: string) => `나의 KPOP 아이돌 포지션: ${position}!`,
    imageCaptureFailed: "이미지 생성에 실패했습니다.",
    shareCanceled: "공유 취소됨",
  },
  en: {
    loading: "Loading results...",
    errorLoading: "Failed to load results.",
    backHome: "Back to Home",
    debutProfile: "KPOP Debut Profile",
    youAre: "You are",
    style: "style!",
    position: "Position",
    character: "Character",
    styleTags: "Style Tags",
    shareResult: "Share",
    saveImage: "Save",
    retryTest: "Retry",
    shareTitle: "KPOP Debut Position Analysis Result",
    shareText: (position: string) => `My KPOP Idol Position: ${position}!`,
    imageCaptureFailed: "Failed to generate image.",
    shareCanceled: "Share canceled",
  },
};

export default function ResultsPage({ params }: ResultsPageProps) {
  const { sessionId } = params;
  const cardRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [language, setLanguage] = useState<"kr" | "en">("kr");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as "kr" | "en";
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const t = texts[language];

  const {
    data: result,
    isLoading,
    error,
  } = useQuery<AnalysisResult>({
    queryKey: ["/api/results", sessionId],
  });

  const captureCardImage = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;

    try {
      setIsCapturing(true);
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        logging: false,
        useCORS: true,
      });

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          setIsCapturing(false);
          resolve(blob);
        }, "image/png");
      });
    } catch (error) {
      console.error(t.imageCaptureFailed, error);
      setIsCapturing(false);
      return null;
    }
  };

  const handleShare = async () => {
    const imageBlob = await captureCardImage();

    if (!imageBlob) {
      alert(t.imageCaptureFailed);
      return;
    }

    const file = new File([imageBlob], "kpop-result.png", {
      type: "image/png",
    });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          title: t.shareTitle,
          text: t.shareText(result?.position || ""),
          files: [file],
        });
      } catch (error) {
        console.log(t.shareCanceled);
      }
    } else {
      // 모바일에서 공유 불가능한 경우 다운로드
      handleDownload();
    }
  };

  const handleDownload = async () => {
    const imageBlob = await captureCardImage();

    if (!imageBlob) {
      alert(t.imageCaptureFailed);
      return;
    }

    const url = URL.createObjectURL(imageBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kpop-result-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4"></div>
          <p className="text-xl">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{t.errorLoading}</p>
            <Link href="/">
              <Button>{t.backHome}</Button>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {t.debutProfile}
          </h2>
        </div>

        {/* Main Result Card */}
        <Card
          ref={cardRef}
          className="bg-white rounded-3xl card-shadow overflow-hidden mb-6"
        >
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
                <span className="text-sm">{t.youAre} </span>
                <span className="font-bold">{(result as any).memberName}</span>
                <span className="text-sm"> {t.style}</span>
              </div>
            )}
          </div>

          {/* Position & Character */}
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* 🎤 Position Section */}
              <div className="text-center bg-gradient-to-b from-pink-50 to-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-3 shadow-sm">
                    <Mic size={24} className="text-pink-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1 tracking-tight">
                    {t.position}
                  </h3>
                  <div className="text-2xl font-extrabold text-[hsl(var(--primary-pink))] mb-1">
                    {result.position}
                  </div>
                  {result.subPosition && (
                    <div className="text-sm text-gray-500 italic">
                      {result.subPosition}
                    </div>
                  )}
                </div>
                <div className="mt-4 w-16 h-[2px] bg-gradient-to-r from-pink-400 to-orange-300 mx-auto rounded-full"></div>
              </div>

              {/* ✨ Character Section */}
              <div className="text-center bg-gradient-to-b from-teal-50 to-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-3 shadow-sm">
                    <Heart size={24} className="text-teal-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1 tracking-tight">
                    {t.character}
                  </h3>
                  <div className="text-base font-semibold text-gray-700 leading-snug">
                    {result.character}
                  </div>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed max-w-xs mx-auto">
                    {result.characterDesc}
                  </p>
                </div>
                <div className="mt-4 w-16 h-[2px] bg-gradient-to-r from-teal-400 to-blue-400 mx-auto rounded-full"></div>
              </div>
            </div>

            {/* Style Tags */}
            <div className="mt-8">
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
                        className={`bg-gradient-to-r ${gradients[index % gradients.length]} text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-sm`}
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
        <div className="w-full max-w-[540px] mx-auto px-2 overflow-x-hidden">
          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={handleShare}
              disabled={isCapturing}
              variant="outline"
              className="w-full border-[hsl(var(--primary-pink))] text-[hsl(var(--primary-pink))] 
                         hover:bg-[hsl(var(--primary-pink))]/10 px-3 py-2 rounded-full font-bold 
                         disabled:opacity-50 text-sm whitespace-nowrap shrink-0"
              data-testid="button-share"
            >
              <span className="inline-flex items-center justify-center">
                <span className="mr-1 text-base">📤</span>
                {t.shareResult}
              </span>
            </Button>

            <Button
              onClick={handleDownload}
              disabled={isCapturing}
              variant="outline"
              className="w-full border-[hsl(var(--primary-pink))] text-[hsl(var(--primary-pink))] 
                         hover:bg-[hsl(var(--primary-pink))]/10 px-3 py-2 rounded-full font-bold 
                         disabled:opacity-50 text-sm whitespace-nowrap shrink-0"
              data-testid="button-download"
            >
              <span className="mr-1 text-base">💾</span>
              {t.saveImage}
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full border-[hsl(var(--primary-pink))] text-[hsl(var(--primary-pink))] 
               hover:bg-[hsl(var(--primary-pink))]/10 px-3 py-2 rounded-full font-bold 
               disabled:opacity-50 text-sm whitespace-nowrap shrink-0"
              data-testid="button-restart"
            >
              <Link href="/">
                <span className="mr-1 text-base">🔄</span>
                {t.retryTest}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
