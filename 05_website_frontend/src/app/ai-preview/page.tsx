"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { UploadCloud, Sparkles, ArrowRight, RotateCcw, CalendarCheck2, Upload, ScanFace, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

type SimulationState = 'idle' | 'scanning' | 'result';

const PROCEDURES = [
  '얼굴거상', '이마거상', '가슴거상', '팔거상', '복부거상', '허벅지거상', '동안성형'
];

export default function AIPreviewPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [selectedProcedure, setSelectedProcedure] = useState<string>('');
  const [appState, setAppState] = useState<SimulationState>('idle');
  const [scanProgress, setScanProgress] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);

  const [simulatedImageUrl, setSimulatedImageUrl] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
      setSimulatedImageUrl(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
      setSimulatedImageUrl(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const startSimulation = async () => {
    if (!imageFile || !selectedProcedure) return;
    setAppState('scanning');
    setScanProgress(0);
    
    // 부드러운 스캐닝 UX를 위한 가짜 프로그레스 바 시작
    const interval = setInterval(() => {
      setScanProgress((prev) => Math.min(prev + Math.floor(Math.random() * 10) + 2, 90));
    }, 500);

    try {
      const base64Image = await fileToBase64(imageFile);
      
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: base64Image,
          procedure: selectedProcedure
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'API 요청 실패');
      }

      setSimulatedImageUrl(data.image);
      
      // 결과 반환 후 100% 채우고 전환
      clearInterval(interval);
      setScanProgress(100);
      setTimeout(() => setAppState('result'), 400);

    } catch (error) {
      console.error(error);
      alert('시뮬레이션 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
      clearInterval(interval);
      setAppState('idle');
      setScanProgress(0);
    }
  };

  const resetAll = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
    setSimulatedImageUrl(null);
    setSelectedProcedure('');
    setAppState('idle');
    setScanProgress(0);
    setSliderPosition(50);
  };

  const handleSliderMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!sliderRef.current || appState !== 'result') return;
    const rect = sliderRef.current.getBoundingClientRect();
    let clientX = 0;
    
    if ('touches' in event) {
      clientX = event.touches[0].clientX;
    } else {
      clientX = (event as React.MouseEvent).clientX;
    }
    
    const x = clientX - rect.left;
    const newPosition = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(newPosition);
  };

  return (
    <main className="min-h-screen bg-neutral-50 pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 text-white text-xs font-bold tracking-widest uppercase mb-4 shadow-xl shadow-black/10">
            <Sparkles className="w-4 h-4" />
            AI Virtual Try-On
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight">
            AI 뷰티 프리뷰
          </h1>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
            원하는 시술을 선택하고 사진을 업로드해보세요. 탱글의 축적된 데이터를 바탕으로 분석된 <strong className="text-neutral-900 font-semibold">시술 후 당신의 완벽한 모습</strong>을 미리 확인하실 수 있습니다.
          </p>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-neutral-200/50 p-8 md:p-12 overflow-hidden border border-neutral-100">
          
          {appState === 'idle' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left Column: Upload */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 mb-2">Step 1. 정면 사진 업로드</h2>
                  <p className="text-sm text-neutral-500">얼굴이나 체형이 잘 보이도록 밝은 곳에서 촬영한 사진을 권장합니다.</p>
                </div>
                
                <label 
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto aspect-[3/5] md:aspect-[3/4] border-2 border-dashed border-neutral-300 rounded-2xl cursor-pointer bg-neutral-50 hover:bg-neutral-100 transition-all overflow-hidden group"
                >
                  {imagePreviewUrl ? (
                    <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-cover pointer-events-none" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg shadow-neutral-200/50 mb-4 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-8 h-8 text-neutral-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <p className="mb-2 text-sm text-neutral-600 font-bold">
                        <span className="text-blue-600">클릭하여 업로드</span> 하거나 이미지를 드래그하세요
                      </p>
                      <p className="text-xs text-neutral-400">PNG, JPG, JPEG (최대 10MB)</p>
                    </div>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>

              {/* Right Column: Options & Action */}
              <div className="space-y-8 flex flex-col h-full">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 mb-2">Step 2. 관심 시술 선택</h2>
                  <p className="text-sm text-neutral-500 mb-6">시뮬레이션 해보고 싶은 시술을 하나 선택해주세요.</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {PROCEDURES.map(proc => (
                      <button
                        key={proc}
                        onClick={() => setSelectedProcedure(proc)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                          selectedProcedure === proc 
                          ? 'bg-neutral-900 text-white shadow-lg shadow-black/20' 
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        {proc}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-8 border-t border-neutral-100">
                  <button
                    onClick={startSimulation}
                    disabled={!imageFile || !selectedProcedure}
                    className="w-full h-14 bg-neutral-900 hover:bg-black disabled:bg-neutral-200 disabled:text-neutral-400 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all group"
                  >
                    {!imageFile ? '사진을 업로드해주세요' : !selectedProcedure ? '시술을 선택해주세요' : 'AI 시뮬레이션 시작'}
                    {imageFile && selectedProcedure && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                  </button>
                  <p className="text-center text-xs text-neutral-400 mt-4">
                    업로드된 사진은 시뮬레이션 목적 외에는 저장되거나 사용되지 않습니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {appState === 'scanning' && (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-neutral-100 overflow-hidden shadow-2xl shadow-blue-500/20 mb-12">
                <img src={imagePreviewUrl!} alt="Scanning" className="w-full h-full object-cover opacity-50 grayscale blend-luminosity" />
                
                {/* Laser line */}
                <div 
                  className="absolute left-0 right-0 h-1 bg-blue-500 shadow-[0_0_15px_rgba(var(--color-blue-500),1)] z-10"
                  style={{ 
                    top: `${Math.min(100, scanProgress)}%`, 
                    transition: 'top 0.4s ease-out',
                    transform: 'translateY(-50%)'
                  }}
                />
                <div 
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-blue-500/30 mix-blend-overlay"
                  style={{ height: `${Math.min(100, scanProgress)}%`, transition: 'height 0.4s ease-out' }}
                />

                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <ScanFace className="w-20 h-20 text-white drop-shadow-lg opacity-80 animate-pulse" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-neutral-900 mb-2 animate-pulse">
                AI 시뮬레이션 처리 중...
              </h3>
              <p className="text-neutral-500 text-center max-w-sm mb-6">
                최신 AI 엔진이 {selectedProcedure} 시술 후의 이상적인 변화를 분석하고 있습니다. ({scanProgress}%)
              </p>
              
              <div className="w-full max-w-md h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300 ease-out"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          )}

          {appState === 'result' && (
            <div className="flex flex-col items-center">
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full mb-4">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-extrabold text-neutral-900 mb-2">{selectedProcedure} 시뮬레이션 결과</h2>
                <p className="text-neutral-500">슬라이더를 좌우로 드래그하여 시술 전/후를 비교해보세요.</p>
              </div>

              {/* Before/After Slider Container */}
              <div 
                ref={sliderRef}
                className="relative w-full max-w-md mx-auto aspect-[3/5] md:aspect-[3/4] rounded-3xl overflow-hidden cursor-ew-resize select-none bg-neutral-100 touch-none shadow-2xl shadow-neutral-200/50"
                onMouseMove={(e) => e.buttons === 1 && handleSliderMove(e)}
                onTouchMove={handleSliderMove}
                onMouseDown={handleSliderMove}
              >
                {/* Before Image (Bottom Layer) */}
                <img 
                  src={imagePreviewUrl!} 
                  alt="Before" 
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
                />
                
                {/* After Image (Top Layer, shown on the right side of the slider) */}
                <img 
                  src={simulatedImageUrl || imagePreviewUrl!} 
                  alt="After" 
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  style={{ 
                    clipPath: `inset(0 0 0 ${sliderPosition}%)`
                  }}
                />

                {/* Slider Handle */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.3)] z-10"
                  style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <div className="flex gap-1">
                      <div className="w-0.5 h-3 md:h-4 bg-neutral-300 rounded-full" />
                      <div className="w-0.5 h-3 md:h-4 bg-neutral-300 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Labels */}
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg z-0">
                  BEFORE
                </div>
                <div className="absolute top-4 right-4 bg-blue-600/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg z-20">
                  AFTER (AI 예상)
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-12 w-full max-w-md">
                <button
                  onClick={resetAll}
                  className="flex-1 py-4 px-6 rounded-xl border-2 border-neutral-200 text-neutral-600 font-bold hover:bg-neutral-50 hover:border-neutral-300 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" /> 다시하기
                </button>
                <Link
                  href="/consult"
                  className="flex-1 py-4 px-6 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-neutral-900/20"
                >
                  <CalendarCheck2 className="w-5 h-5" /> 전문의 상담 예약
                </Link>
              </div>

            </div>
          )}

        </div>
      </div>
    </main>
  );
}
