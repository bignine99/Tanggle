"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, RotateCcw, Download, CheckCircle2, ChevronDown, Image as ImageIcon, Check } from 'lucide-react';
import Link from 'next/link';

type SimulationState = 'idle' | 'scanning' | 'result';

const PROCEDURES = [
  '지방흡입', '얼굴거상', '동안성형', '이마거상', '가슴거상', 
  '팔거상', '복부거상', '허벅지거상', '엉덩이성형', '바디필러', '남성여유증'
];

export default function AIPreviewPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [selectedProcedure, setSelectedProcedure] = useState<string>('지방흡입');
  const [appState, setAppState] = useState<SimulationState>('idle');
  const [scanProgress, setScanProgress] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const [simulatedImageUrl, setSimulatedImageUrl] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
      setSimulatedImageUrl(null);
      setAppState('idle');
    }
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
    
    const interval = setInterval(() => {
      setScanProgress((prev) => Math.min(prev + Math.floor(Math.random() * 15) + 5, 90));
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
      
      clearInterval(interval);
      setScanProgress(100);
      setTimeout(() => setAppState('result'), 500);

    } catch (error) {
      console.error(error);
      alert('시뮬레이션 처리 중 오류가 발생했습니다.');
      clearInterval(interval);
      setAppState('idle');
      setScanProgress(0);
    }
  };

  const resetAll = () => {
    if(!window.confirm("초기화하시겠습니까?")) return;
    setImageFile(null);
    setImagePreviewUrl(null);
    setSimulatedImageUrl(null);
    setSelectedProcedure('지방흡입');
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
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-black font-sans relative overflow-hidden">
      {/* Decorative dark ambiance */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-pink-500/[0.05] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full lg:w-[400px] xl:w-[460px] glass-dark border-r border-white/10 shadow-[4px_0_24px_rgba(0,0,0,0.2)] flex flex-col z-20 h-[100dvh]">
        <div className="p-6 md:p-8 flex flex-col h-full overflow-y-auto hidden-scrollbar">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-8 shrink-0 group">
            <div className="w-8 h-8 rounded-full instagram-gradient text-white flex justify-center items-center shadow-lg group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-2xl font-serif tracking-widest font-medium text-white group-hover:text-pink-400 transition-colors drop-shadow-md">AI Simulation</span>
            </div>
          </Link>

          {/* Title */}
          <div className="mb-8 shrink-0">
            <h1 className="text-xl lg:text-2xl font-serif font-light text-white mb-1 leading-tight tracking-wide italic">
              Visualize Your
            </h1>
            <h1 className="text-2xl lg:text-3xl font-serif font-light text-gradient-insta mb-3 lg:mb-4 tracking-wide italic lg:pl-1">
              Transformation
            </h1>
            <p className="text-sm text-white/40 leading-relaxed font-light">
              첨단 AI 기술을 통해 시술 후의 모습을 미리 확인하세요.<br/>당신만의 아름다움을 찾아드립니다.
            </p>
          </div>

          <div className="flex flex-col space-y-6 mb-6">
            {/* Step 1: Upload */}
            <div className="space-y-3 flex flex-col min-h-0">
              <div className="flex items-center gap-2 text-xs font-bold text-pink-500 tracking-[0.2em] shrink-0">
                <span className="w-4 h-4 rounded-full border border-pink-500/50 flex items-center justify-center text-[10px]">1</span>
                UPLOAD BEFORE PHOTO
              </div>
              
              <label className="flex-1 block min-h-[160px] w-full rounded-2xl border border-dashed border-pink-500/30 bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer relative overflow-hidden group">
                {imagePreviewUrl ? (
                  <img src={imagePreviewUrl} className="w-full h-full object-cover" alt="Uploaded Profile" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white/30 group-hover:text-pink-500/80 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <ImageIcon className="w-6 h-6 opacity-70" />
                    </div>
                    <span className="text-sm font-light">클릭하여 사진 업로드</span>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>

            {/* Step 2: Select Procedure */}
            <div className="space-y-4 shrink-0 relative" style={{ zIndex: 9999 }}>
              <div className="flex items-center gap-2 text-xs font-bold text-pink-500 tracking-[0.2em]">
                <span className="w-4 h-4 rounded-full border border-pink-500/50 flex items-center justify-center text-[10px]">2</span>
                SELECT PROCEDURE
              </div>
              
              <div className="relative" style={{ zIndex: 10000 }}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between px-5 py-3.5 bg-white/[0.04] border border-white/[0.1] rounded-2xl text-sm font-light text-white hover:border-pink-500/50 focus:outline-none focus:ring-1 focus:ring-pink-500/50 transition-all"
                >
                  {selectedProcedure || '시술 선택'}
                  <ChevronDown className={`w-4 h-4 text-pink-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute top-full mt-2 w-full bg-[#111111] rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 border border-white/20" style={{ zIndex: 20000, boxShadow: '0 10px 40px -10px rgba(0,0,0,0.8)' }}>
                    <div className="max-h-[25vh] overflow-y-auto custom-scrollbar py-2">
                      {PROCEDURES.map((proc) => (
                        <button
                          key={proc}
                          onClick={() => {
                            setSelectedProcedure(proc);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-5 py-3 text-sm transition-colors flex items-center justify-between ${
                            selectedProcedure === proc ? 'bg-pink-500/10 text-pink-500 font-medium' : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                          }`}
                        >
                          {proc}
                          {selectedProcedure === proc && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Action Button */}
            <button
              onClick={startSimulation}
              disabled={!imageFile || appState === 'scanning'}
              className="w-full py-4 instagram-gradient text-white rounded-2xl font-bold text-sm tracking-widest disabled:opacity-50 hover:opacity-90 transition-all flex justify-center items-center gap-2 shadow-lg shrink-0 border-none outline-none relative"
              style={{ zIndex: 1 }}
            >
              <Sparkles className="w-4 h-4" />
              {appState === 'scanning' ? 'PROCESSING...' : 'SIMULATE RESULTS'}
            </button>
          </div>

          <div className="mt-8 shrink-0 flex flex-col items-center gap-2 text-[10px] text-white/30 tracking-widest font-light border-t border-white/10 pt-6"></div>
        </div>
      </div>

      {/* Right Content Area (Preview) */}
      <div className="flex-1 relative flex flex-col h-[100dvh]">
        
        {/* Top Controls */}
        <div className="absolute top-6 right-6 lg:top-8 lg:right-8 z-30 flex gap-3">
          <button onClick={resetAll} className="px-5 py-2.5 glass-card rounded-full text-xs font-bold tracking-wider text-white hover:bg-white/10 transition-colors flex items-center gap-2">
            <RotateCcw className="w-3.5 h-3.5" />
            RESET
          </button>
          <button 
            disabled={appState !== 'result'} 
            className="px-5 py-2.5 instagram-gradient text-white rounded-full text-xs font-bold tracking-wider flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:grayscale shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            SAVE
          </button>
        </div>

        {/* Center Canvas */}
        <div className="flex-1 flex flex-col items-center justify-center py-6 px-4 lg:px-8 relative z-10 w-full h-full">
          
          {/* Header */}
          {(appState === 'result' || appState === 'scanning') && (
            <div className="text-center mb-6 lg:mb-8 animate-in fade-in duration-500">
              <p className="text-[10px] text-pink-500 font-bold tracking-[0.3em] mb-3 uppercase">Simulation Result</p>
              <h2 className="text-3xl lg:text-5xl font-light text-white tracking-tight">{selectedProcedure}</h2>
            </div>
          )}

          {/* Main Display Area */}
          <div className="relative w-full max-w-[500px] max-h-[60vh] aspect-[3/4] transition-all duration-700 ease-out">
            
            {appState === 'idle' && (
              <div className="absolute inset-0 rounded-[2rem] glass-card flex flex-col items-center justify-center shadow-2xl">
                 <div className="w-24 h-24 rounded-full bg-black border border-white/20 flex items-center justify-center mb-6 shadow-lg shadow-pink-500/5">
                   <Sparkles className="w-10 h-10 text-white" />
                 </div>
                 <p className="text-white font-light text-lg tracking-wide mb-2">Ready for Simulation</p>
                 <p className="text-sm text-white/40 font-light">Upload a photo to begin</p>
              </div>
            )}

            {appState === 'scanning' && imagePreviewUrl && (
              <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-[0_20px_80px_rgba(236,72,153,0.3)] border border-pink-500/30">
                <img src={imagePreviewUrl} className="w-full h-full object-cover brightness-[0.2] contrast-125 saturate-0 scale-105 transition-all duration-[3s]" alt="Scanning" />
                
                {/* Cinematic Blueprint / Wireframe SVG Overlay */}
                <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-80">
                   <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                         <pattern id="blueprint-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                           <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(236, 72, 153, 0.15)" strokeWidth="1"/>
                         </pattern>
                         <pattern id="blueprint-grid-small" width="10" height="10" patternUnits="userSpaceOnUse">
                           <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(236, 72, 153, 0.05)" strokeWidth="0.5"/>
                         </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#blueprint-grid-small)" />
                      <rect width="100%" height="100%" fill="url(#blueprint-grid)" />
                      
                      {/* Animated Structure Drawing - SVG Microinteractions */}
                      <g stroke="rgba(236, 72, 153, 0.8)" strokeWidth="1.5" fill="none">
                         {/* Facial Tracking Points */}
                         <circle cx="30%" cy="35%" r="3" fill="#EC4899" className="animate-ping" style={{ animationDuration: '1.5s' }} />
                         <circle cx="70%" cy="35%" r="3" fill="#EC4899" className="animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.4s' }} />
                         <circle cx="50%" cy="55%" r="3" fill="#EC4899" className="animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.8s' }} />
                         <circle cx="50%" cy="75%" r="3" fill="#EC4899" className="animate-ping" style={{ animationDuration: '1.5s', animationDelay: '1.2s' }} />
                         
                         {/* Structural Topology Tracing */}
                         <path d="M 30 35 L 50 55 L 70 35" strokeDasharray="100" strokeDashoffset="100" transform="translate(100, 200) scale(2)">
                           <animate attributeName="stroke-dashoffset" values="100;0;100" dur="4s" repeatCount="indefinite" />
                         </path>
                         
                         {/* Golden Ratio arcs mapping */}
                         <path d="M 50 200 Q 250 400 450 200" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" strokeDasharray="800" strokeDashoffset="800">
                           <animate attributeName="stroke-dashoffset" values="800;0" dur="2s" fill="freeze" />
                         </path>
                         <path d="M 150 200 Q 250 300 350 200" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" strokeDasharray="600" strokeDashoffset="600">
                           <animate attributeName="stroke-dashoffset" values="600;0" dur="2.5s" fill="freeze" />
                         </path>
                      </g>
                   </svg>
                </div>

                {/* Volumetric Laser Scanner */}
                <div 
                  className="absolute left-0 right-0 h-[40vh] bg-gradient-to-b from-transparent via-pink-500/10 to-pink-500/30 z-10 pointer-events-none mix-blend-screen"
                  style={{ 
                    top: `${scanProgress}%`, 
                    transition: 'top 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    transform: 'translateY(-100%)'
                  }}
                >
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-400 shadow-[0_0_20px_#EC4899,0_0_40px_#EC4899]" />
                </div>
                
                {/* Central HUD Data Processing */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                  <div className="bg-black/40 px-10 py-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 border border-pink-500/30 backdrop-blur-[24px] saturate-[1.5]">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border border-white/10" />
                      <div className="absolute inset-0 rounded-full border-2 border-pink-500 border-t-transparent animate-spin" style={{ animationDuration: '1s' }} />
                      <span className="text-white text-sm font-bold tracking-wider">{scanProgress}<span className="text-[10px]">%</span></span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold tracking-[0.3em] text-pink-400 mb-1">
                        ANALYZING TOPOLOGY
                      </span>
                      <span className="text-[10px] text-white/60 tracking-widest uppercase font-light">
                        {selectedProcedure} Engine Running
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {appState === 'result' && imagePreviewUrl && simulatedImageUrl && (
              <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.5)] border border-white/10 animate-in zoom-in-95 duration-500">
                <div 
                  ref={sliderRef}
                  className="w-full h-full relative cursor-ew-resize touch-none select-none"
                  onMouseMove={(e) => e.buttons === 1 && handleSliderMove(e)}
                  onTouchMove={handleSliderMove}
                  onMouseDown={handleSliderMove}
                >
                  <img src={imagePreviewUrl} className="absolute inset-0 w-full h-full object-cover pointer-events-none" alt="Before" />
                  
                  <img 
                    src={simulatedImageUrl} 
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                    alt="After" 
                  />

                  <div 
                    className="absolute top-0 bottom-0 w-[2px] bg-white z-10 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-[0_0_30px_rgba(0,0,0,0.3)] flex items-center justify-center pointer-events-none">
                      <div className="flex gap-1">
                        <ChevronDown className="w-4 h-4 text-black rotate-90" />
                        <ChevronDown className="w-4 h-4 text-black -rotate-90" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 font-bold text-[10px] tracking-[0.2em] text-white glass-card px-4 py-2 rounded-lg">BEFORE</div>
                  <div className="absolute bottom-6 right-6 font-bold text-[10px] tracking-[0.2em] text-white instagram-gradient px-4 py-2 rounded-lg shadow-lg">AFTER</div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Stats Cards */}
          {/* Bottom Stats & Disclaimer */}
          {(appState === 'result' || appState === 'scanning') && (
            <div className="w-full max-w-[500px] mt-8 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <div className="grid grid-cols-3 gap-4">
                <div className="glass-card rounded-2xl p-4 flex flex-col justify-between">
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] mb-2">Accuracy</span>
                  <span className="text-xl font-light text-white tracking-tight">94.8%</span>
                </div>
                <div className="glass-card rounded-2xl p-4 flex flex-col justify-between">
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] mb-2">Engine</span>
                  <span className="text-sm font-light text-white mt-auto">Aura AI 3.1</span>
                </div>
                <div className="glass-card rounded-2xl p-4 flex flex-col justify-between">
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] mb-2">Status</span>
                  <div className="flex items-center gap-2 font-medium text-sm text-pink-500 mt-auto">
                    <CheckCircle2 className="w-4 h-4" />
                    Verified
                  </div>
                </div>
              </div>

              {/* Legal Disclaimer */}
              <div className="glass-card rounded-xl px-5 py-4 text-center mt-2">
                <p className="text-[11px] text-white/40 leading-relaxed font-light break-keep">
                  ※ 본 결과는 AI 기술로 생성된 가상의 시뮬레이션 이미지로 <strong className="text-white/60 font-medium">실제 시술/수술 결과를 절대 보장하지 않습니다.</strong><br/>
                  개인의 해부학적 특성에 따라 결과가 다를 수 있으며, 정확한 수술 계획은 반드시 원장님과의 대면 상담을 통해 확인하시기 바랍니다.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(236, 72, 153, 0.3); border-radius: 2px; }
        .hidden-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
}
