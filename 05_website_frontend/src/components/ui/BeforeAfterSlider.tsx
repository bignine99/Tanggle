"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfterSlider({ 
  beforeImage, 
  afterImage, 
  beforeLabel = "BEFORE", 
  afterLabel = "AFTER (AI PREVIEW)" 
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleSliderMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!sliderRef.current) return;
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
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full max-w-2xl mx-auto p-2"
    >
      {/* Aurora Background Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-[2.5rem] pointer-events-none opacity-50 transition-opacity duration-700">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-pink-500/30 rounded-full blur-[80px] mix-blend-screen animate-blob" style={{ animationDelay: '0s', animationDuration: '20s' }} />
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/30 rounded-full blur-[80px] mix-blend-screen animate-blob" style={{ animationDelay: '5s', animationDuration: '23s' }} />
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-orange-500/20 rounded-full blur-[80px] mix-blend-screen animate-blob" style={{ animationDelay: '10s', animationDuration: '25s' }} />
      </div>

      {/* Main Slider Container (Glassmorphism 2.0 Border) */}
      <div 
        ref={sliderRef}
        className={`relative aspect-[4/3] rounded-[2rem] overflow-hidden cursor-ew-resize select-none touch-none shadow-2xl transition-all duration-700 border border-white/20 bg-neutral-900/50 z-10 ${
          isHovered ? 'shadow-[0_0_40px_rgba(236,72,153,0.3)]' : 'shadow-neutral-900/50'
        }`}
        onMouseMove={(e) => {
          if (e.buttons === 1) handleSliderMove(e);
        }}
        onTouchMove={handleSliderMove}
        onMouseDown={handleSliderMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img 
          src={beforeImage} 
          alt="Before" 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none saturate-[0.85] contrast-[1.05]" 
        />
        
        <img 
          src={afterImage} 
          alt="After" 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none saturate-[1.1] contrast-[1.05] transition-transform duration-700 ease-out"
          style={{ 
            clipPath: `inset(0 0 0 ${sliderPosition}%)`,
            transform: isHovered ? 'scale(1.02)' : 'scale(1)'
          }}
        />

        {/* Divider Line */}
        <div 
          className="absolute top-0 bottom-0 w-[2px] z-20 pointer-events-none"
          style={{ 
            left: `${sliderPosition}%`, 
            transform: 'translateX(-50%)',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)',
            boxShadow: '0 0 15px rgba(236,72,153,0.5)'
          }}
        >
          {/* Glassmorphism Handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5),inset_0_0_10px_rgba(255,255,255,0.5)] bg-white/10 backdrop-blur-[12px] border border-white/40 hover:scale-110 hover:bg-white/20">
            <div className="flex gap-1.5 opacity-80">
              <div className="w-0.5 h-4 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
              <div className="w-0.5 h-4 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
            </div>
          </div>
        </div>

        {/* Labels with Glassmorphism 2.0 & Gradient Shift */}
        <div className="absolute top-5 left-5 z-10 pointer-events-none">
          <div className="bg-black/40 backdrop-blur-[16px] saturate-[1.3] text-white/90 text-xs font-semibold px-4 py-2 rounded-xl border border-white/10 shadow-lg">
            {beforeLabel}
          </div>
        </div>
        <div className="absolute top-5 right-5 z-30 pointer-events-none">
          <div className="bg-white/10 backdrop-blur-[16px] saturate-[1.3] px-4 py-2 rounded-xl border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
            <span className="text-xs font-bold text-gradient-insta">{afterLabel}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
