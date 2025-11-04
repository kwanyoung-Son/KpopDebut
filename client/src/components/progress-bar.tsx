import { useState, useEffect } from "react";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = (current / total) * 100;
  const [language, setLanguage] = useState<"kr" | "en">("kr");

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'kr' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>
          {language === "kr" ? "KPOP 포지션 분석" : "KPOP Position Analysis"}
        </span>
        <span>
          {current} / {total}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-pink-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
