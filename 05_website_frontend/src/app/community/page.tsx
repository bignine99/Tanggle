"use client";

import { motion } from "framer-motion";
import { ThumbsUp, MessageSquare, PlayCircle, ShieldCheck } from "lucide-react";

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-tanggle-bg pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-tanggle-charcoal/10 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-tanggle-charcoal mb-4">커뮤니티</h1>
            <p className="text-lg text-tanggle-darkgray font-light">검증된 환자들의 솔직한 후기와 질문</p>
          </div>
          <div className="mt-6 md:mt-0 flex gap-4">
            <span className="flex items-center gap-1 text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full"><ShieldCheck className="w-4 h-4" /> 실명 인증 작성만 노출</span>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex gap-8 mb-10 overflow-x-auto no-scrollbar border-b border-tanggle-charcoal/10">
          {["사진후기", "텍스트후기", "영상후기", "Q&A"].map((tab, idx) => (
            <button key={tab} className={`pb-4 px-2 font-bold whitespace-nowrap text-lg ${idx === 0 ? "text-tanggle-charcoal border-b-2 border-tanggle-charcoal" : "text-tanggle-darkgray hover:text-tanggle-charcoal"}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Video Testimonials Section (New) */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-tanggle-charcoal mb-6 flex items-center gap-2">
            <PlayCircle className="text-tanggle-gold" /> 생생 영상 후기
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((video) => (
              <div key={video} className="aspect-[9/16] bg-tanggle-charcoal rounded-2xl relative overflow-hidden group cursor-pointer shadow-md">
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors z-10">
                  <PlayCircle className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform" />
                </div>
                <div className="absolute bottom-4 left-4 z-20">
                  <p className="text-white font-bold">"자연스러운 리프팅"</p>
                  <p className="text-white/70 text-xs mt-1">시술 후 3주차</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map((item, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={item} 
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-tanggle-charcoal/5"
            >
              <div className="h-56 bg-tanggle-beige/40 flex items-center justify-center text-tanggle-darkgray/50">
                Before / After Image
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-tanggle-charcoal text-lg mb-1">최** 님 (30대)</h3>
                    <p className="text-xs text-tanggle-darkgray font-medium">시술: 복부 지방흡입 | 경과: 2개월</p>
                  </div>
                  <div className="flex gap-0.5 text-tanggle-gold">★ ★ ★ ★ ★</div>
                </div>
                <p className="text-tanggle-charcoal/80 text-sm leading-relaxed mb-6 line-clamp-3">
                  다이어트로는 절대 안빠지던 아랫배가 드디어 쏙 들어갔어요. 회복기간도 생각보다 빠르고 흉터도 속옷 라인이라 안보여서 너무 만족합니다.
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-tanggle-charcoal/5">
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-tanggle-darkgray hover:text-tanggle-gold transition-colors">
                    <ThumbsUp className="w-4 h-4" /> 도움됨 42
                  </button>
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-tanggle-darkgray hover:text-tanggle-charcoal transition-colors">
                    <MessageSquare className="w-4 h-4" /> 의료진 답변
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
