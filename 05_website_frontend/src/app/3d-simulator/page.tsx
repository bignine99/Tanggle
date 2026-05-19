"use client";
import React, { Suspense } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';
import ThreeDModel from '@/components/ThreeDModel';

export default function ThreeDSimulatorPage() {
  return (
    <div className="relative w-full h-[100dvh] bg-black overflow-hidden font-sans">
       <div className="absolute top-6 left-6 z-50">
         <Link href="/" className="glass-card px-4 py-2 rounded-full flex items-center gap-2 text-white text-sm font-bold tracking-widest hover:bg-white/10 transition-colors">
           <ArrowLeft className="w-4 h-4" /> BACK
         </Link>
       </div>
       <div className="absolute top-6 right-6 z-50">
         <div className="glass-card px-6 py-3 rounded-full flex items-center gap-3">
           <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
           <span className="text-white text-xs font-bold tracking-[0.2em]">3D INTERACTIVE AI</span>
         </div>
       </div>

       {/* The 3D Canvas */}
       <div className="absolute inset-0 z-10">
         <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white/50 tracking-widest font-light">Loading 3D Engine...</div>}>
           <ThreeDModel />
         </Suspense>
       </div>
       
       {/* UI Overlay */}
       <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center">
         <p className="text-white/50 text-xs tracking-[0.3em] font-light mb-2">AURA CLINIC</p>
         <h1 className="text-2xl md:text-4xl font-extralight text-white tracking-widest">
           TOUCH TO <span className="text-gradient-insta font-semibold">ANALYZE</span>
         </h1>
       </div>
    </div>
  )
}
