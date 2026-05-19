"use client";

import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Camera, Upload, AlertCircle, Sparkles, ChevronLeft, ChevronRight, Download, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

export default function AIPreviewPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // For scanning animation
  const [scanProgress, setScanProgress] = useState(0);

  // For before/after slider
  const [sliderPos, setSliderPos] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle Image Upload
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Start Analysis
  const startAnalysis = () => {
    if (!agreed) {
      alert("개인정보 처리 방침에 동의해주세요.");
      return;
    }
    if (!imageSrc) return;
    
    setStep(2);
    setScanProgress(0);
    
    // Mock processing animation
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setStep(3), 500); // Move to step 3 after scanning
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  // Handle Slider Drag
  const handleMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-pink-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-20 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <Link href="/" className="text-white/60 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium tracking-widest uppercase">
            <ChevronLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full instagram-gradient flex items-center justify-center shadow-lg shadow-pink-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-serif italic text-lg tracking-wider text-white/90">Aura AI Preview</span>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          
          {/* STEP 1: Upload */}
          {step === 1 && (
            <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="text-center mb-10">
                <p className="text-pink-400 font-bold tracking-[0.3em] text-xs mb-3">IMAGE-TO-IMAGE AI</p>
                <h1 className="text-4xl md:text-5xl font-extralight mb-4 leading-tight">가상 성형 <span className="text-gradient-insta font-semibold">프리뷰</span></h1>
                <p className="text-white/50 font-light text-lg">당신의 가장 아름다운 순간을 AI가 미리 그려드립니다.</p>
              </div>

              <div className="glass-card p-8 rounded-[2rem] border border-white/10 shadow-2xl bg-white/[0.02] backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {imageSrc ? (
                  <div className="relative w-full aspect-[3/4] md:aspect-square max-h-[500px] rounded-2xl overflow-hidden mb-6 border border-white/10">
                    <img src={imageSrc} alt="Uploaded" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setImageSrc(null)}
                      className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-2 rounded-full border border-white/20 hover:bg-black transition-colors"
                    >
                      <RefreshCcw className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-[4/3] md:aspect-[21/9] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-pink-500/50 hover:bg-pink-500/5 transition-all duration-300 mb-6 group/dropzone"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover/dropzone:scale-110 transition-transform duration-500">
                      <Camera className="w-6 h-6 text-white/60 group-hover/dropzone:text-pink-400 transition-colors" />
                    </div>
                    <p className="text-white/80 font-medium mb-1">여기를 클릭하여 사진 업로드</p>
                    <p className="text-white/40 text-sm font-light">정면에서 촬영된 밝고 선명한 사진을 권장합니다.</p>
                  </div>
                )}

                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  className="hidden" 
                />

                <div className="bg-white/[0.03] rounded-xl p-4 mb-6 border border-white/5 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white/90 text-sm font-bold mb-1">프라이버시 보호 안내</h4>
                    <p className="text-white/50 text-xs leading-relaxed">
                      업로드하신 사진은 가상 시뮬레이션 목적으로만 사용되며, <strong className="text-white/80">서버에 일절 저장되지 않고 세션 종료 시 즉시 영구 파기</strong>됩니다. 안심하고 이용하셔도 좋습니다.
                    </p>
                  </div>
                </div>

                <label className="flex items-center justify-center gap-3 cursor-pointer mb-8 group/checkbox">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      checked={agreed} 
                      onChange={(e) => setAgreed(e.target.checked)} 
                      className="peer appearance-none w-5 h-5 border border-white/30 rounded bg-white/5 checked:bg-pink-500 checked:border-pink-500 transition-colors cursor-pointer" 
                    />
                    <Sparkles className="w-3 h-3 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-white/80 text-sm font-light select-none group-hover/checkbox:text-white transition-colors">위 개인정보 보호 방침에 동의합니다.</span>
                </label>

                <button 
                  onClick={startAnalysis}
                  disabled={!imageSrc || !agreed}
                  className="w-full py-5 rounded-xl instagram-gradient text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all duration-300"
                >
                  AI 분석 시작하기
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Processing Animation */}
          {step === 2 && (
            <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
              <div className="relative w-full aspect-square md:aspect-[3/4] max-h-[600px] rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(236,72,153,0.15)] bg-black">
                <img src={imageSrc!} alt="Processing" className="w-full h-full object-cover opacity-50 saturate-0" />
                
                {/* Scanning Laser */}
                <div 
                  className="absolute left-0 right-0 h-1 bg-pink-500 shadow-[0_0_20px_rgba(236,72,153,1)] z-20 transition-all duration-75"
                  style={{ top: `${scanProgress}%` }}
                />
                
                {/* Glowing Overlay above the laser */}
                <div 
                  className="absolute top-0 left-0 right-0 bg-gradient-to-b from-transparent to-pink-500/20 z-10"
                  style={{ height: `${scanProgress}%` }}
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center z-30 mix-blend-screen">
                  <div className="w-24 h-24 border-4 border-dashed border-pink-500/50 rounded-full animate-[spin_4s_linear_infinite] flex items-center justify-center mb-6">
                    <Sparkles className="w-8 h-8 text-pink-400 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-light text-white tracking-widest uppercase mb-2">Analyzing</h3>
                  <p className="text-pink-400 font-mono text-sm tracking-widest">{scanProgress}%</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Result Comparison */}
          {step === 3 && (
            <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000">
              <div className="text-center mb-8">
                <p className="text-green-400 font-bold tracking-[0.3em] text-xs mb-3 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> ANALYSIS COMPLETE
                </p>
                <h2 className="text-3xl md:text-4xl font-extralight mb-2">Aura AI <span className="font-semibold text-gradient-insta">결과 리포트</span></h2>
                <p className="text-white/50 font-light text-sm">가운데 슬라이더를 좌우로 드래그하여 전/후 모습을 비교해보세요.</p>
              </div>

              <div 
                className="relative w-full aspect-[4/5] md:aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] select-none bg-black mb-10"
                ref={sliderRef}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                onMouseDown={() => setIsDragging(true)}
                onTouchStart={() => setIsDragging(true)}
              >
                {/* BEFORE Image (Background) */}
                <img src={imageSrc!} alt="Before" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
                <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 z-10">
                  <span className="text-white/80 text-xs font-bold tracking-widest">BEFORE</span>
                </div>

                {/* AFTER Image (Foreground/Clipped) */}
                <div 
                  className="absolute inset-0 w-full h-full pointer-events-none filter contrast-110 saturate-[1.15] brightness-105"
                  style={{ clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)` }}
                >
                  <img src={imageSrc!} alt="After" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute top-6 right-6 bg-pink-500/80 backdrop-blur-md px-4 py-2 rounded-full border border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.3)] z-10">
                    <span className="text-white text-xs font-bold tracking-widest flex items-center gap-2">
                      <Sparkles className="w-3 h-3" /> AFTER
                    </span>
                  </div>
                </div>

                {/* Slider Handle */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize z-20 flex items-center justify-center hover:bg-pink-400 transition-colors"
                  style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-neutral-200 text-black">
                    <div className="flex gap-0.5">
                      <ChevronLeft className="w-3 h-3" />
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => { setStep(1); setImageSrc(null); setAgreed(false); }}
                  className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors flex items-center justify-center gap-2 border border-white/10"
                >
                  <RefreshCcw className="w-4 h-4" /> 다시 해보기
                </button>
                <button 
                  onClick={() => alert("현재 데모 버전에서는 저장이 지원되지 않습니다.")}
                  className="px-8 py-4 rounded-xl instagram-gradient text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg"
                >
                  <Download className="w-5 h-5" /> 결과 이미지 다운로드
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
