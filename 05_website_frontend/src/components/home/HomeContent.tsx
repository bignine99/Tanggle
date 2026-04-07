"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, ChevronRight, PlayCircle, Plus } from "lucide-react";

export default function HomeContent({ categories }: { categories: string[] }) {
  // If categories list is very long, just slice a few prominent ones or show all if short
  const displayCategories = categories.length > 0 ? categories.slice(0, 8) : [];
  
  function getCategoryImageUrl(category: string): string {
    const map: Record<string, string> = {
      '가슴거상': '/images/category_body.png',
      '바디필러': '/images/category_body_2.png',
      '복부거상': '/images/category_body_3.png',
      '엉덩이성형': '/images/category_body_4.png',
      '지방흡입': '/images/category_body_2.png',
      '팔거상': '/images/category_body_3.png',
      '허벅지거상': '/images/category_body_4.png',
      '남성여유증': '/images/hero_clinic_interior_2.png',
      '동안성형': '/images/category_lifting.png',
      '쇼츠': '/images/hero_community.png',
      '병원정보': '/images/hero_clinic_interior.png',
      '기타': '/images/hero_main_consult.png'
    };

    if (map[category]) return map[category];
    
    // Fallbacks
    if (category.includes('여유증') || category.includes('남성')) return '/images/hero_clinic_interior_2.png';
    if (category.includes('동안') || category.includes('리프팅') || category.includes('얼굴') || category.includes('이마') || category.includes('목')) return '/images/category_lifting.png';
    if (category.includes('가슴') || category.includes('바디') || category.includes('복부') || category.includes('엉덩이') || category.includes('허벅지') || category.includes('팔') || category.includes('지방')) return '/images/category_body.png';
    if (category.includes('눈')) return '/images/category_eye.png';
    if (category.includes('코')) return '/images/category_nose.png';
    if (category.includes('쁘띠') || category.includes('필러') || category.includes('보톡스')) return '/images/category_petite.png';
    return '/images/hero_main_consult_2.png';
  }

  return (
    <main className="flex flex-col w-full min-h-screen relative font-sans bg-white">
      {/* 1. Hero Section */}
      <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden bg-white">
        {/* Clean Clinic Aesthetic Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-white z-10" />
        
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0 flex items-center justify-center opacity-30"
        >
          <div className="w-[800px] h-[800px] rounded-full bg-primary-100/30 blur-[100px] absolute -top-40 -right-20" />
          <div className="w-[600px] h-[600px] rounded-full bg-primary-50/20 blur-[100px] absolute bottom-0 left-10" />
        </motion.div>

        <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-5xl mx-auto mt-16">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="px-4 py-1.5 rounded-full border border-neutral-200 bg-white shadow-sm text-neutral-600 text-xs font-bold tracking-widest mb-8"
          >
            PREMIUM PLASTIC SURGERY CLINIC
          </motion.div>
          
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-light tracking-tight text-neutral-900 mb-6 leading-tight"
          >
            당신의 가치,<br />전문가의 <strong className="font-bold text-primary-600">디테일</strong>이 결정합니다
          </motion.h1>
          
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl font-light text-neutral-500 mb-12 max-w-2xl leading-relaxed"
          >
            단순한 성형을 넘어, 가장 이상적인 비율과 조화를 디자인합니다.<br />
            오창현 대표원장의 15년 노하우가 담긴 탱글성형외과를 경험하세요.
          </motion.p>
          
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <button 
              onClick={() => window.location.href = '/consult'}
              className="px-10 py-5 bg-neutral-900 text-white rounded-full font-bold text-lg hover:bg-black transition-colors shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
            >
              대표원장 1:1 상담 예약
            </button>
            <button className="px-10 py-5 bg-white backdrop-blur-md text-neutral-900 rounded-full font-bold text-lg hover:bg-neutral-50 transition-colors border border-neutral-200 shadow-sm flex items-center justify-center gap-3">
              <MessageCircle className="w-6 h-6 text-yellow-500" />
              카톡 간편 상담
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. Quick Stats Bar */}
      <section className="relative -mt-16 z-30 px-6">
        <div className="max-w-6xl mx-auto bg-white rounded-lg p-8 md:p-10 flex flex-wrap justify-around items-center gap-8 shadow-xl border border-neutral-100">
          <div className="flex flex-col flex-1 min-w-[200px] items-center text-center">
            <p className="text-sm font-bold text-primary-500 tracking-widest mb-2">EXPERIENCE</p>
            <p className="text-4xl font-extrabold text-neutral-900 mb-2">15<span className="text-2xl font-medium">년</span></p>
            <span className="text-sm text-neutral-500 font-medium">오창현 대표원장 무사고 경력</span>
          </div>
          
          <div className="w-px h-20 bg-neutral-100 hidden md:block" />
          
          <div className="flex flex-col flex-1 min-w-[200px] items-center text-center">
            <p className="text-sm font-bold text-primary-500 tracking-widest mb-2">KNOWLEDGE</p>
            <p className="text-4xl font-extrabold text-neutral-900 mb-2">150<span className="text-2xl font-medium">+</span></p>
            <span className="text-sm text-neutral-500 font-medium">성형 지식 및 Q&A 데이터베이스</span>
          </div>

          <div className="w-px h-20 bg-neutral-100 hidden md:block" />

          <div className="flex flex-col flex-1 min-w-[200px] items-center text-center group cursor-pointer" onClick={() => window.location.href='/doctors'}>
            <p className="text-sm font-bold text-primary-500 tracking-widest mb-2">MEDICAL TEAM</p>
            <p className="text-lg font-extrabold text-neutral-900 mb-2 flex items-center gap-2">
              의료진 소개 보기 <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </p>
            <span className="text-sm text-neutral-500 font-medium">대표원장 전담 책임 진료제</span>
          </div>
        </div>
      </section>

      {/* 3. Dynamic Signature Clinics Categories */}
      <section className="py-32 px-6 bg-neutral-50 border-t border-neutral-100 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-primary-500 tracking-widest mb-3">SERVICES</h2>
            <h3 className="text-4xl font-light text-neutral-900">
              어떤 <strong className="font-bold">솔루션</strong>이 필요하신가요?
            </h3>
            <p className="mt-4 text-neutral-500">지식 베이스에 기반한 맞춤형 안내를 도와드립니다.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayCategories.map((cat, i) => (
              <Link href={`/procedures/${encodeURIComponent(cat)}`} key={i}>
                <div className="relative overflow-hidden rounded-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:-translate-y-2 transition-all duration-500 group h-[280px] flex flex-col justify-end border border-neutral-100 isolate">
                  <img
                    src={getCategoryImageUrl(cat)}
                    alt={cat}
                    className="absolute inset-0 w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-out" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-900/40 to-neutral-900/90 mix-blend-multiply z-10 transition-opacity duration-300 group-hover:opacity-80" />
                  
                  <div className="relative z-20 p-6 w-full flex flex-col justify-end">
                    <div className="flex justify-between items-end">
                      <div>
                        <h4 className="text-2xl font-bold text-white group-hover:text-primary-300 transition-colors mb-1 drop-shadow-md">
                          {cat}
                        </h4>
                        <p className="text-sm font-light text-neutral-200 opacity-90 drop-shadow-md">
                          관련 수술 및 Q&A 확인
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg group-hover:bg-primary-500 transition-colors border border-white/30">
                        <Plus className="text-white w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/procedures"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white border border-neutral-200 text-neutral-700 rounded-full hover:bg-neutral-50 hover:text-neutral-900 font-semibold transition-colors"
            >
              전체 시술 둘러보기 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
