import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Camera, CheckCircle, Upload, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function UploadPage() {
  const [, setLocation] = useLocation();
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedPhoto(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Store photo data in sessionStorage for next step
      const reader = new FileReader();
      reader.onload = () => {
        sessionStorage.setItem('uploadedPhoto', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (selectedPhoto) {
      setIsProcessing(true);
      // 짧은 딜레이로 처리 중임을 보여주고 다음 페이지로
      setTimeout(() => {
        setLocation("/quiz");
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-white py-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="text-white" size={32} />
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">얼굴 사진 업로드</h2>
          <p className="text-gray-600 text-lg">정면을 바라보는 셀카를 업로드해주세요</p>
        </div>

        {/* Upload Area */}
        <div className="relative mb-8">
          <input
            type="file"
            id="photoInput"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
          <label
            htmlFor="photoInput"
            className="block w-full h-96 border-3 border-dashed border-[hsl(var(--primary-teal))] rounded-2xl cursor-pointer hover:border-[hsl(var(--primary-pink))] transition-colors bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center h-full">
              {previewUrl ? (
                <div className="w-full h-full rounded-2xl overflow-hidden">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="text-6xl text-[hsl(var(--primary-teal))] mb-4 mx-auto" size={96} />
                  <p className="text-xl font-semibold text-gray-700 mb-2">클릭해서 사진 업로드</p>
                  <p className="text-gray-500">JPG, PNG 파일만 지원</p>
                </div>
              )}
            </div>
          </label>
        </div>

        {/* Tips */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <CheckCircle className="text-green-500 mb-2 mx-auto" size={20} />
              <p className="text-sm text-green-700 font-medium">정면을 바라보는 사진</p>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <CheckCircle className="text-green-500 mb-2 mx-auto" size={20} />
              <p className="text-sm text-green-700 font-medium">밝은 조명의 선명한 사진</p>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <CheckCircle className="text-green-500 mb-2 mx-auto" size={20} />
              <p className="text-sm text-green-700 font-medium">얼굴이 가려지지 않은 사진</p>
            </CardContent>
          </Card>
        </div>

        <Button
          onClick={handleNext}
          disabled={!selectedPhoto || isProcessing}
          size="lg"
          className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 rounded-full text-lg font-bold disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 animate-spin" size={20} />
              처리 중...
            </>
          ) : (
            <>
              다음 단계로
              <ArrowRight className="ml-2" size={20} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
