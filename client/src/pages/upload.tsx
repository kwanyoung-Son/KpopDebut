import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Camera, CheckCircle, Upload, ArrowRight, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import * as faceapi from 'face-api.js';

export default function UploadPage() {
  const [, setLocation] = useLocation();
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const [faceDetected, setFaceDetected] = useState<boolean | null>(null);
  const [debugMode, setDebugMode] = useState(false);
  const { toast } = useToast();
  const imageRef = useRef<HTMLImageElement>(null);

  // localStorage 디버그 플래그 확인 및 Face-api.js 모델 로드
  useEffect(() => {
    // localStorage에서 디버그 플래그 확인
    const isLocalDebug = localStorage.getItem('debug_face_detection') === '1' || 
                        localStorage.getItem('DEBUG_FACE_API') === 'true' ||
                        localStorage.getItem('face_api_debug') === '1';
    
    if (isLocalDebug) {
      console.log('🔧 localStorage 디버그 모드 감지됨');
      setDebugMode(true);
      setIsLoadingModels(false);
      return;
    }

    const loadModels = async () => {
      console.log('🔄 얼굴 인식 모델 로드 시작...');
      try {
        // CDN에서 모델 로드 (얼굴 감지 + 성별/나이 감지 + 표정 감지)
        const modelUrl = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(modelUrl),
          faceapi.nets.ageGenderNet.loadFromUri(modelUrl),
          faceapi.nets.faceExpressionNet.loadFromUri(modelUrl)
        ]);
        setIsLoadingModels(false);
        console.log('✅ 얼굴 인식 모델 로드 완료 (얼굴 감지 + 성별/나이 감지 + 표정 감지)');
      } catch (error) {
        console.error('❌ 얼굴 인식 모델 로드 실패:', error);
        // 모델 로드에 실패하면 디버그 모드 활성화
        setIsLoadingModels(false);
        setDebugMode(true);
        console.log('🔧 디버그 모드 활성화 - 얼굴 검증 우회');
      }
    };
    loadModels();
  }, []);

  // 얼굴 감지 및 성별/나이/표정 분석 함수
  const detectFace = async (imageElement: HTMLImageElement) => {
    console.log('🔍 얼굴 감지 시작...');
    
    // 디버그 모드에서는 항상 true 반환
    if (debugMode) {
      console.log('🔧 디버그 모드: 얼굴 검증 우회');
      // 디버그 모드에서는 기본값 설정
      sessionStorage.setItem('detectedGender', 'female');
      sessionStorage.setItem('detectedAge', '21');
      sessionStorage.setItem('detectedExpression', 'happy');
      return true;
    }
    
    try {
      // 얼굴 감지 + 성별/나이 분석 + 표정 분석
      const detection = await faceapi
        .detectSingleFace(imageElement)
        .withAgeAndGender()
        .withFaceExpressions();
      
      if (detection) {
        const gender = detection.gender; // 'male' or 'female'
        const genderProbability = detection.genderProbability;
        const age = Math.round(detection.age);
        
        // 표정 분석 - 가장 높은 확률의 표정 찾기
        const expressions = detection.expressions;
        const expressionEntries = Object.entries(expressions) as [string, number][];
        const dominantExpression = expressionEntries.reduce((max, current) => 
          current[1] > max[1] ? current : max
        );
        
        console.log(`👤 얼굴 감지 성공`);
        console.log(`👥 성별: ${gender} (확률: ${(genderProbability * 100).toFixed(1)}%)`);
        console.log(`🎂 예상 나이: ${age}세`);
        console.log(`😊 주요 표정: ${dominantExpression[0]} (확률: ${(dominantExpression[1] * 100).toFixed(1)}%)`);
        
        // 분석 결과를 sessionStorage에 저장
        sessionStorage.setItem('detectedGender', gender);
        sessionStorage.setItem('detectedAge', age.toString());
        sessionStorage.setItem('detectedExpression', dominantExpression[0]);
        
        return true;
      } else {
        console.log('❌ 얼굴을 찾을 수 없습니다');
        return false;
      }
    } catch (error) {
      console.error('❌ 얼굴 감지 오류:', error);
      return false;
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedPhoto(file);
      setFaceDetected(null);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // 이미지 로드 후 얼굴 감지
      const img = new Image();
      img.onload = async () => {
        console.log('📷 이미지 로드 완료, 얼굴 감지 준비');
        
        if (!isLoadingModels) {
          const hasFace = await detectFace(img);
          setFaceDetected(hasFace);
          
          if (!hasFace && !debugMode) {
            toast({
              title: "얼굴이 감지되지 않았습니다",
              description: "정면을 바라보는 얼굴 사진을 업로드해주세요.",
              variant: "destructive",
            });
            return;
          }

          // 얼굴이 감지되면 세션 스토리지에 저장
          const reader = new FileReader();
          reader.onload = () => {
            sessionStorage.setItem('uploadedPhoto', reader.result as string);
            console.log('💾 사진이 세션 스토리지에 저장됨');
          };
          reader.readAsDataURL(file);
        } else {
          console.log('⏳ 모델 로딩 중... 잠시 기다려주세요');
        }
      };
      img.src = url;
    }
  };

  const handleNext = () => {
    if (selectedPhoto && (faceDetected === true || debugMode)) {
      console.log('✅ 다음 단계로 진행');
      setIsProcessing(true);
      // 짧은 딜레이로 처리 중임을 보여주고 다음 페이지로
      setTimeout(() => {
        setLocation("/quiz");
      }, 800);
    } else if (faceDetected === false && !debugMode) {
      toast({
        title: "얼굴이 감지되지 않은 사진입니다",
        description: "얼굴이 포함된 사진을 다시 업로드해주세요.",
        variant: "destructive",
      });
    }
  };

  const handleRetakePhoto = () => {
    // 현재 상태 초기화
    setSelectedPhoto(null);
    setPreviewUrl(null);
    setFaceDetected(null);
    setIsProcessing(false);
    
    // 세션 스토리지에서 사진 데이터 삭제
    sessionStorage.removeItem('uploadedPhoto');
    
    // 파일 input 초기화
    const fileInput = document.getElementById('photoInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    
    console.log('🔄 사진 업로드 상태 초기화');
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
            data-testid="input-photo"
          />
          <label
            htmlFor="photoInput"
            className="block w-full h-96 border-3 border-dashed border-[hsl(var(--primary-teal))] rounded-2xl cursor-pointer hover:border-[hsl(var(--primary-pink))] transition-colors bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center h-full">
              {previewUrl ? (
                <div className="w-full h-full rounded-2xl overflow-hidden relative">
                  <img 
                    ref={imageRef}
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    data-testid="uploaded-photo-preview"
                  />
                  {faceDetected === false && !debugMode && (
                    <div className="absolute inset-0 bg-red-500 bg-opacity-20 flex items-center justify-center" data-testid="face-not-detected-overlay">
                      <div className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center">
                        <AlertCircle className="mr-2" size={20} />
                        얼굴이 감지되지 않음
                      </div>
                    </div>
                  )}
                  {faceDetected === true && (
                    <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full flex items-center text-sm" data-testid="face-detected-badge">
                      <CheckCircle className="mr-1" size={16} />
                      얼굴 감지됨
                    </div>
                  )}
                  {debugMode && (
                    <div className="absolute top-4 left-4 bg-yellow-600 text-white px-3 py-1 rounded-full flex items-center text-sm" data-testid="debug-mode-badge">
                      🔧 디버그 모드
                    </div>
                  )}
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

        {/* 사진 다시 올리기 버튼 - 사진이 업로드된 경우에만 표시 */}
        {previewUrl && (
          <div className="mb-6">
            <Button
              onClick={handleRetakePhoto}
              variant="outline"
              size="lg"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-full"
              data-testid="button-retake-photo"
            >
              <RefreshCw className="mr-2" size={20} />
              사진 다시 올리기
            </Button>
          </div>
        )}

        {/* Tips */}
        <Card className="bg-green-50 border-green-200 mb-8">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
              <p className="text-sm text-green-700 font-medium">
                정면을 바라보는 사진 · 밝은 조명의 선명한 사진 · 얼굴이 가려지지 않은 사진
              </p>
            </div>
          </CardContent>
        </Card>

        {debugMode && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg" data-testid="debug-mode-banner">
            <p className="text-yellow-800 text-sm font-semibold">
              🔧 디버그 모드 활성화: 얼굴 검증이 우회됩니다
            </p>
            <p className="text-yellow-700 text-xs mt-1">
              localStorage 디버그 플래그 또는 모델 로드 실패로 인해 활성화됨
            </p>
          </div>
        )}

        <Button
          onClick={handleNext}
          disabled={!selectedPhoto || isProcessing || (!debugMode && faceDetected !== true) || isLoadingModels}
          size="lg"
          className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 rounded-full text-lg font-bold disabled:opacity-50"
          data-testid="button-next"
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
