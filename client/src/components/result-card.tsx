import { Card, CardContent } from "@/components/ui/card";
import { Share2 } from "lucide-react";
import { AnalysisResult } from "@shared/schema";

interface ResultCardProps {
  result: AnalysisResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  return (
    <Card className="bg-white rounded-2xl card-shadow p-6 mb-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
        <Share2 className="inline mr-2" size={20} />
        SNS 공유용 카드
      </h3>
      <div className="max-w-sm mx-auto">
        {/* Instagram-style result card */}
        <div className="bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 rounded-2xl p-1">
          <div className="bg-white rounded-xl p-6 text-center">
            {result.photoData && (
              <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden">
                <img src={result.photoData} alt="User" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="text-lg font-bold text-gray-800">나의 KPOP 포지션</div>
            <div className="text-sm text-gray-600 mb-2">{result.groupName}</div>
            <div className="text-[hsl(var(--primary-pink))] font-bold text-lg">
              {result.position}
              {result.subPosition && ` • ${result.subPosition}`}
            </div>
            <div className="flex justify-center mt-3 space-x-1">
              {Array.isArray(result.styleTags) && result.styleTags.slice(0, 2).map((tag, index) => {
                const colors = ['bg-[hsl(var(--primary-pink))]', 'bg-[hsl(var(--primary-teal))]'];
                return (
                  <span
                    key={index}
                    className={`${colors[index]} text-white px-2 py-1 rounded-full text-xs`}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
            <div className="text-xs text-gray-500 mt-3">KPOP 데뷔 분석기</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
