"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SlidersHorizontal, Clock, Star, Activity, Plus } from "lucide-react";
import { useState } from "react";

export default function ProceduresPage() {
  const categories = ["전체보기", "안면거상", "복부/가슴거상", "상하체 리프팅", "지방흡입/필러"];
  const [activeCategory, setActiveCategory] = useState("전체보기");
  
  const procedures = [
    { 
      id: 'face-lift', 
      cat: "안면거상", 
      title: "안면거상 (Face Lift)", 
      time: "2~3시간", 
      desc: "늘어지고 주름진 얼굴과 목의 피부, 그리고 근막(SMAS)층까지 당겨 올려 확실하고 영구적인 젊음을 되찾아 드립니다.", 
      recommends: 1350 
    },
    { 
      id: 'tummy-tuck', 
      cat: "복부/가슴거상", 
      title: "복부거상 (Tummy Tuck)", 
      time: "2~3시간", 
      desc: "출산, 급격한 다이어트 후 심하게 처진 뱃살과 튼살을 제거하고 늘어진 복직근을 조여 탄탄한 복부를 완성합니다.", 
      recommends: 1240 
    },
    { 
      id: 'breast-lift', 
      cat: "복부/가슴거상", 
      title: "가슴거상 (Mastopexy)", 
      time: "2시간", 
      desc: "모유 수유나 노화로 인해 처진 가슴의 탄력을 끌어올려 이상적인 비율과 볼륨감을 되찾아 드립니다.", 
      recommends: 852 
    },
    { 
      id: 'thigh-lift', 
      cat: "상하체 리프팅", 
      title: "허벅지거상 (Thigh Lift)", 
      time: "2시간", 
      desc: "허벅지 안쪽의 쭈글쭈글하고 처진 살을 매끄럽게 정리하여 탄력 있는 다리 라인을 만듭니다.", 
      recommends: 410 
    },
    { 
      id: 'arm-lift', 
      cat: "상하체 리프팅", 
      title: "팔거상 (Arm Lift)", 
      time: "1.5시간", 
      desc: "운동으로도 빠지지 않는 팔 뒷부분의 처진 피부와 지방을 동시에 제거하여 매끈한 직각 어깨 라인을 연출합니다.", 
      recommends: 320 
    },
    { 
      id: 'hip-up', 
      cat: "상하체 리프팅", 
      title: "엉덩이성형 (Hip-up)", 
      time: "1.5시간", 
      desc: "납작하고 처진 엉덩이에 볼륨을 채우고 라인을 교정하여 다리가 길어 보이는 애플힙을 디자인합니다.", 
      recommends: 520 
    },
    { 
      id: 'liposuction', 
      cat: "지방흡입/필러", 
      title: "바디 지방흡입", 
      time: "1~2시간", 
      desc: "피부 표면의 울퉁불퉁함 없이, 불필요한 심층 심부 지방만을 안전하고 정교하게 흡입합니다.", 
      recommends: 915 
    },
    { 
      id: 'body-filler', 
      cat: "지방흡입/필러", 
      title: "바디필러 (골반/힙)", 
      time: "30분", 
      desc: "수술 없이 빈약한 골반이나 힙딥(Hip-dip)을 채워 즉각적이고 완성도 높은 S라인을 구현합니다.", 
      recommends: 645 
    },
    { 
      id: 'gynecomastia', 
      cat: "기타", 
      title: "남성 여유증", 
      time: "1.5시간", 
      desc: "불필요하게 발달한 유선 조직과 지방을 제거하여 남성다운 탄탄한 가슴 라인으로 교정합니다.", 
      recommends: 210 
    },
  ];

  const filteredProcedures = activeCategory === "전체보기" 
    ? procedures 
    : procedures.filter(p => p.cat === activeCategory);
  
  return (
    <main className="min-h-screen bg-[#FDFBF7] pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 text-center">
          <h3 className="text-tanggle-gold font-bold tracking-widest text-sm mb-4">BODY CONTOURING CLINIC</h3>
          <h1 className="text-4xl md:text-5xl font-extrabold text-tanggle-charcoal mb-6">탱글 체형성형 수술</h1>
          <p className="text-lg text-tanggle-darkgray font-light max-w-2xl mx-auto">
            15년 경력 오창현 대표원장이 직접 집도하는 프리미엄 바디 컨투어링.<br/>
            단순한 사이즈 감소가 아닌, 가장 이상적인 신체 비율과 탄력을 디자인합니다.
          </p>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-full font-bold text-sm transition-all shadow-sm
                ${activeCategory === cat 
                  ? "bg-tanggle-charcoal text-white ring-2 ring-tanggle-charcoal ring-offset-2 ring-offset-[#FDFBF7]" 
                  : "bg-white text-tanggle-darkgray hover:text-tanggle-charcoal hover:bg-tanggle-beige border border-tanggle-charcoal/5"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProcedures.map((proc, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={proc.id} 
              className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-tanggle-beige group flex flex-col cursor-pointer"
            >
              {/* Premium Image Placeholder */}
              <div className="h-56 bg-tanggle-charcoal/5 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 directly to-transparent z-10" />
                <Activity className="w-12 h-12 text-tanggle-charcoal/10" />
                <div className="absolute bottom-4 left-6 z-20">
                  <span className="bg-tanggle-gold text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block">
                    {proc.cat}
                  </span>
                  <h3 className="text-2xl font-extrabold text-white">{proc.title}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-1">
                <p className="text-tanggle-darkgray font-light text-sm leading-relaxed mb-6 flex-1">
                  {proc.desc}
                </p>
                
                <div className="flex items-center justify-between text-xs text-tanggle-charcoal font-bold mb-8 p-4 bg-[#FDFBF7] rounded-2xl">
                  <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-tanggle-gold" /> {proc.time}</span>
                  <span className="flex items-center gap-2"><Star className="w-4 h-4 text-tanggle-gold fill-tanggle-gold" /> 추천 {proc.recommends}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <button className="flex-1 bg-white border-2 border-tanggle-charcoal text-tanggle-charcoal py-3 rounded-xl font-bold text-sm hover:bg-tanggle-charcoal hover:text-white transition-colors">
                    상세보기
                  </button>
                  <button className="bg-tanggle-gold text-white p-3 rounded-xl hover:bg-yellow-600 transition-colors shadow-lg">
                    <Plus className="w-5 h-5" />
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
