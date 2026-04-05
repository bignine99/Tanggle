"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, MessageCircle, Info, ShieldCheck, ChevronRight, PlayCircle, Plus } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col w-full min-h-screen relative font-sans">
      {/* 1. Hero Section */}
      <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Placeholder for High-quality Hospital Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-tanggle-beige/40 to-[#e3d7cf]/70 mix-blend-multiply opacity-80 z-10" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 z-[15] mix-blend-overlay" />
        
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 bg-tanggle-bg z-0" />
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0 flex items-center justify-center opacity-40"
        >
          <div className="w-[800px] h-[800px] rounded-full bg-tanggle-gold/10 blur-3xl absolute -top-40 -right-20" />
          <div className="w-[600px] h-[600px] rounded-full bg-tanggle-coral/10 blur-3xl absolute bottom-0 left-10" />
        </motion.div>

        <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-5xl mx-auto mt-16">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="px-4 py-1.5 rounded-full border border-tanggle-charcoal/20 bg-white/40 backdrop-blur-md text-tanggle-charcoal text-xs font-bold tracking-widest mb-8"
          >
            PREMIUM BODY CONTOURING CLINIC
          </motion.div>
          
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-tanggle-charcoal mb-6 leading-tight"
          >
            당신의 바디라인,<br />전문가의 <span className="text-tanggle-gold">디테일</span>이 결정합니다
          </motion.h1>
          
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl font-light text-tanggle-charcoal/80 mb-12 max-w-2xl leading-relaxed"
          >
            단순한 사이즈 감소를 넘어, 가장 이상적인 신체 비율과 탄력을 디자인합니다.<br />
            오창현 대표원장의 15년 노하우가 담긴 탱글 바디 센터 경험하기.
          </motion.p>
          
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <button 
              onClick={() => window.location.href = '/consult'}
              className="px-10 py-5 bg-tanggle-charcoal text-white rounded-full font-bold text-lg hover:bg-black transition-colors shadow-2xl hover:shadow-[0_20px_50px_rgba(42,39,35,0.4)]"
            >
              대표원장 1:1 상담 예약
            </button>
            <button className="px-10 py-5 bg-white backdrop-blur-md text-tanggle-charcoal rounded-full font-bold text-lg hover:bg-tanggle-beige transition-colors border border-tanggle-charcoal/10 shadow-lg flex items-center justify-center gap-3">
              <MessageCircle className="w-6 h-6 text-yellow-500" />
              카톡 간편 상담
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. Quick Stats Bar */}
      <section className="relative -mt-16 z-30 px-6">
        <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 flex flex-wrap justify-around items-center gap-8 shadow-2xl border border-white">
          <div className="flex flex-col flex-1 min-w-[200px] items-center text-center">
            <p className="text-sm font-bold text-tanggle-gold tracking-widest mb-2">EXPERIENCE</p>
            <p className="text-4xl font-extrabold text-tanggle-charcoal mb-2">15<span className="text-2xl font-medium">년</span></p>
            <span className="text-sm text-tanggle-darkgray font-medium">오창현 대표원장 무사고 경력</span>
          </div>
          
          <div className="w-px h-20 bg-tanggle-charcoal/10 hidden md:block" />
          
          <div className="flex flex-col flex-1 min-w-[200px] items-center text-center">
            <p className="text-sm font-bold text-tanggle-gold tracking-widest mb-2">KNOWLEDGE</p>
            <p className="text-4xl font-extrabold text-tanggle-charcoal mb-2">450<span className="text-2xl font-medium">+</span></p>
            <span className="text-sm text-tanggle-darkgray font-medium">바디성형 관련 지식 영상 등재</span>
          </div>

          <div className="w-px h-20 bg-tanggle-charcoal/10 hidden md:block" />

          <div className="flex flex-col flex-1 min-w-[200px] items-center text-center group cursor-pointer" onClick={() => window.location.href='/doctors'}>
            <p className="text-sm font-bold text-tanggle-gold tracking-widest mb-2">MEDICAL TEAM</p>
            <p className="text-lg font-extrabold text-tanggle-charcoal mb-2 flex items-center gap-2">
              의료진 소개 보기 <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </p>
            <span className="text-sm text-tanggle-darkgray font-medium">대표원장 전담 책임 진료제</span>
          </div>
        </div>
      </section>

      {/* 3. Featured YouTube Integration */}
      <section className="py-32 px-6 bg-[#FDFBF7]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-sm font-bold text-tanggle-gold tracking-widest mb-3">TANGGLE KNOWLEDGE</h2>
              <h3 className="text-4xl font-extrabold text-tanggle-charcoal">탱글성형외과의 진짜 실력,<br/>투명하게 보여드립니다.</h3>
            </div>
            <a 
              href="https://www.youtube.com/@Tanggle_Tube" 
              target="_blank" 
              rel="noreferrer"
              className="group flex items-center gap-2 text-tanggle-charcoal font-bold bg-white px-6 py-3 rounded-full border border-tanggle-beige shadow-sm hover:shadow-md transition-all"
            >
              <PlayCircle className="text-red-500 w-5 h-5 group-hover:scale-110 transition-transform" /> 
              유튜브 1.14만 구독자 보러가기
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Example Video Cards pulled from data */}
            {[
              { title: "복부거상, 이 3가지만 피하면 무조건 성공합니다", view: "12만", cat: "복부성형" },
              { title: "운동으로도 절대 안 빠지는 뱃살의 충격적 원인", view: "8.5만", cat: "바디거상" },
              { title: "처진 가슴, 보형물 없이 거상만으로 해결 가능할까?", view: "5.3만", cat: "가슴거상" }
            ].map((video, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-tanggle-beige group cursor-pointer flex flex-col"
              >
                <div className="aspect-[16/9] bg-tanggle-charcoal/10 relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <PlayCircle className="w-16 h-16 text-white/50 z-20 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-8">
                  <span className="text-tanggle-gold text-xs font-bold tracking-widest mb-3 block">{video.cat}</span>
                  <h4 className="text-xl font-bold text-tanggle-charcoal mb-4 line-clamp-2 leading-snug">{video.title}</h4>
                  <div className="flex items-center text-sm font-medium text-tanggle-darkgray">
                    조회수 {video.view}회 • 유튜브
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Signature Clinics */}
      <section className="py-32 px-6 bg-white border-t border-tanggle-beige">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-tanggle-gold tracking-widest mb-3">CORE EXPERTISE</h2>
            <h3 className="text-4xl font-extrabold text-tanggle-charcoal">탱글 거상(Lifting) 센터</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "안면 거상", desc: "중력과 세월이 남긴 얼굴의 흔적을 끌어올려 젊음의 V라인 복원" },
              { name: "가슴 거상", desc: "처진 가슴을 탄력 있게 끌어올려 최적의 비율과 볼륨 완성" },
              { name: "복부 거상", desc: "피부 처짐과 튼살을 동시에 제거하는 고난도 복부 리프팅" },
              { name: "허벅지/바디 거상", desc: "탄력을 잃고 쭈글쭈글해진 바디 라인을 극한의 매끄러움으로 타이트닝" }
            ].map((item, i) => (
              <Link href="/procedures" key={i}>
                <div className="bg-tanggle-bg p-8 rounded-[2rem] hover:bg-tanggle-charcoal hover:text-white transition-all duration-300 group h-full flex flex-col justify-between border border-transparent hover:border-tanggle-charcoal min-h-[220px]">
                  <div>
                    <h4 className="text-2xl font-extrabold text-tanggle-charcoal group-hover:text-white mb-3">{item.name}</h4>
                    <p className="font-light text-tanggle-darkgray group-hover:text-white/80">{item.desc}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center self-end shadow-sm group-hover:bg-white/20 transition-colors">
                    <Plus className="text-tanggle-charcoal group-hover:text-white w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
