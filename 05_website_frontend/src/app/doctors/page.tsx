"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Award, BookOpen, Stethoscope, PlayCircle } from "lucide-react";

export default function DoctorsPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] pt-28 pb-32">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 mb-24 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <h3 className="text-tanggle-gold font-bold tracking-widest text-sm mb-4">REPRESENTATIVE DIRECTOR</h3>
            <h1 className="text-5xl md:text-6xl font-extrabold text-tanggle-charcoal mb-6 leading-tight">
              바디성형의 <br />
              <span className="text-tanggle-gold">디테일</span>을 완성하다
            </h1>
            <h2 className="text-3xl font-bold text-tanggle-charcoal mb-8">
              오창현 대표원장
            </h2>
            <p className="text-lg text-tanggle-darkgray leading-relaxed mb-10 font-light max-w-lg">
              "체형을 교정하는 것은 단순히 지방을 빼는 것이 아닙니다. 
              숨겨진 골격의 비율을 찾아내고, 처진 피부의 탄력을 복원하며, 
              평생 유지될 수 있는 가장 아름다운 곡선을 디자인하는 종합 예술입니다."
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => window.location.href = '/consult'}
                className="bg-tanggle-charcoal text-white px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl hover:bg-black transition-all"
              >
                원장님 1:1 상담 예약
              </button>
              <a 
                href="https://www.youtube.com/@Tanggle_Tube" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-3 bg-white border border-tanggle-beige text-tanggle-charcoal px-8 py-4 rounded-full font-bold shadow-sm hover:shadow-md transition-all"
              >
                <PlayCircle className="text-red-500 w-5 h-5" /> 유튜브 보러가기
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2 relative"
          >
            {/* Portrait Image Mockup using CSS */}
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative bg-gradient-to-tr from-tanggle-charcoal/80 to-tanggle-charcoal">
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
              {/* Fallback silhouette if image is missing */}
              <div className="w-full h-full flex flex-col items-center justify-end opacity-90">
                <div className="w-full h-full bg-gradient-to-b from-white/10 to-transparent">
                   {/* In a real scenario, an absolute Next/Image goes here */}
                   <div className="w-full h-full flex items-center justify-center">
                     <span className="text-white/40 font-light text-2xl tracking-widest">DR. O CHANG-HYUN</span>
                   </div>
                </div>
              </div>
            </div>
            
            {/* Floating stats card */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-8 -left-8 md:bottom-12 md:-left-12 bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/50 w-64"
            >
              <p className="text-tanggle-gold font-bold text-sm mb-1">유튜브 구독자</p>
              <p className="text-3xl font-extrabold text-tanggle-charcoal mb-2">1.14만 명+</p>
              <p className="text-xs text-tanggle-darkgray">바디성형 분야 누적 450개 이상의 지식 영상 등재</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* History & Philosophy Details */}
      <section className="bg-white py-24 border-t border-tanggle-beige">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-tanggle-gold tracking-widest mb-3">QUALIFICATION & CAREER</h2>
            <h3 className="text-4xl font-extrabold text-tanggle-charcoal">끊임없이 연구하는 의료진</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
            {[
              {
                icon: <Stethoscope className="w-8 h-8 text-tanggle-gold" />,
                title: "바디성형 전문가",
                desc: "복부거상, 가슴거상, 허벅지 및 팔거상 등 체형 윤곽 교정 수술의 전문가로서 처진 피부와 근본적 바디라인의 문제를 해결합니다."
              },
              {
                icon: <BookOpen className="w-8 h-8 text-tanggle-gold" />,
                title: "투명한 소통과 학술 데이터",
                desc: "환자들에게 올바른 성형 지식을 전달하기 위해 450여 개의 유튜브 영상을 제작하며, 투명하고 진정성 있는 상담을 최우선으로 합니다."
              },
              {
                icon: <Award className="w-8 h-8 text-tanggle-gold" />,
                title: "15년 차의 책임감",
                desc: "안전이 담보되지 않은 무리한 수술은 권하지 않으며, 15년 이상의 노하우로 수술 전 디자인부터 사후 관리까지 전 과정을 전담합니다."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
                className="bg-tanggle-bg p-8 rounded-3xl hover:bg-tanggle-beige/30 transition-colors border border-transparent hover:border-tanggle-beige"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
                  {feature.icon}
                </div>
                <h4 className="text-2xl font-bold text-tanggle-charcoal mb-4">{feature.title}</h4>
                <p className="text-tanggle-darkgray leading-relaxed font-light">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
          
          {/* Medical Team Additions */}
          <div className="border-t border-tanggle-charcoal/10 pt-20">
            <h2 className="text-sm font-bold text-tanggle-gold tracking-widest mb-3 text-center">SAFETY EXPERT</h2>
            <h3 className="text-3xl font-extrabold text-tanggle-charcoal text-center mb-12">마취통증의학과 전문의 1:1 전담 안전 시스템</h3>
            
            <div className="bg-tanggle-bg rounded-3xl p-10 lg:p-14 flex flex-col md:flex-row gap-12 items-center">
              <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-full bg-white shadow-xl overflow-hidden flex items-center justify-center border-4 border-tanggle-gold/20 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-tanggle-charcoal/5 to-transparent"></div>
                <span className="text-tanggle-charcoal/30 font-bold text-xl uppercase tracking-widest">DR. YANG</span>
              </div>
              
              <div className="flex-1">
                <h4 className="text-3xl font-bold text-tanggle-charcoal mb-2">양병이 원장</h4>
                <p className="text-tanggle-gold font-medium mb-6 flex gap-3 text-lg items-center">
                  <span>마취통증의학과 전문의</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-tanggle-gold/40"></span>
                  <span className="bg-tanggle-charcoal text-white text-xs px-3 py-1 rounded-full">본원 상주</span>
                </p>
                
                <ul className="space-y-3 font-light text-tanggle-darkgray mb-8">
                  <li className="flex gap-2"><span className="text-tanggle-gold font-bold">✓</span> 前) 그날/일퍼센트/유노성형외과 마취과장</li>
                  <li className="flex gap-2"><span className="text-tanggle-gold font-bold">✓</span> 前) 분당제일여성병원 마취과장</li>
                  <li className="flex gap-2"><span className="text-tanggle-gold font-bold">✓</span> 대한마취통증의학회 및 통증학회 정회원</li>
                </ul>
                
                <p className="text-tanggle-charcoal font-medium leading-relaxed bg-white/50 p-6 border border-tanggle-charcoal/5 rounded-2xl italic shadow-sm">
                  "환자의 안전이 그 어떤 결과보다 우선되어야 합니다. 수술 전 상담부터 수술 중 실시간 모니터링, 그리고 회복 후 마취에서 깨어나는 순간까지 1:1 전담으로 상주하며 철저히 관리합니다."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
