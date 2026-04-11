"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Award, BookOpen, Stethoscope, PlayCircle } from "lucide-react";

export default function DoctorsPage() {
  return (
    <main className="min-h-screen bg-white pt-28 pb-32">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 mb-24 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <h3 className="text-primary-500 font-bold tracking-widest text-sm mb-4">REPRESENTATIVE DIRECTOR</h3>
            <h1 className="text-5xl md:text-6xl font-extrabold text-neutral-900 mb-6 leading-tight">
              바디성형의 <br />
              <span className="text-primary-500">디테일</span>을 완성하다
            </h1>
            <h2 className="text-3xl font-bold text-neutral-900 mb-8">
              이수현 대표원장
            </h2>
            <p className="text-lg text-neutral-500 leading-relaxed mb-10 font-light max-w-lg">
              "체형을 교정하는 것은 단순히 지방을 빼는 것이 아닙니다. 
              숨겨진 골격의 비율을 찾아내고, 처진 피부의 탄력을 복원하며, 
              평생 유지될 수 있는 가장 아름다운 곡선을 디자인하는 종합 예술입니다."
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => window.location.href = '/consult'}
                className="bg-neutral-900 text-white px-8 py-4 rounded-lg font-bold shadow-xl hover:shadow-2xl hover:bg-black transition-all"
              >
                원장님 1:1 상담 예약
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2 relative"
          >
            {/* Portrait Image */}
            <div className="aspect-[4/5] rounded-lg overflow-hidden shadow-2xl relative">
              <Image 
                src="/images/dr-lee.jpg" 
                alt="이수현 대표원장" 
                fill 
                className="object-cover" 
              />
            </div>
            
            {/* Floating stats card */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-8 -left-8 md:bottom-12 md:-left-12 bg-white/90 backdrop-blur-xl p-6 rounded-lg shadow-xl border border-neutral-100 w-64"
            >
              <p className="text-primary-500 font-bold text-sm mb-1">프리미엄 바디성형</p>
              <p className="text-3xl font-extrabold text-neutral-900 mb-2">4,500+</p>
              <p className="text-xs text-neutral-500">성공적인 체형 교정 및 수술 사례 달성</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* History & Philosophy Details */}
      <section className="bg-white py-24 border-t border-neutral-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-primary-500 tracking-widest mb-3">QUALIFICATION & CAREER</h2>
            <h3 className="text-4xl font-extrabold text-neutral-900">끊임없이 연구하는 의료진</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
            {[
              {
                icon: <Stethoscope className="w-8 h-8 text-primary-500" />,
                title: "바디성형 전문가",
                desc: "복부거상, 가슴거상, 허벅지 및 팔거상 등 체형 윤곽 교정 수술의 전문가로서 처진 피부와 근본적 바디라인의 문제를 해결합니다."
              },
              {
                icon: <BookOpen className="w-8 h-8 text-primary-500" />,
                title: "투명한 소통과 학술 데이터",
                desc: "환자들에게 올바른 성형 지식을 전달하기 위해 꾸준한 연구와 학술 활동을 진행하며, 투명하고 진정성 있는 상담을 최우선으로 합니다."
              },
              {
                icon: <Award className="w-8 h-8 text-primary-500" />,
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
                className="bg-neutral-50 p-8 rounded-lg hover:bg-neutral-100/50 transition-colors border border-transparent hover:border-neutral-200"
              >
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm mb-6 border border-neutral-100">
                  {feature.icon}
                </div>
                <h4 className="text-2xl font-bold text-neutral-900 mb-4">{feature.title}</h4>
                <p className="text-neutral-500 leading-relaxed font-light">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
          
          {/* Medical Team Additions */}
          <div className="border-t border-neutral-100 pt-20">
            <h2 className="text-sm font-bold text-primary-500 tracking-widest mb-3 text-center">SAFETY EXPERT</h2>
            <h3 className="text-3xl font-extrabold text-neutral-900 text-center mb-12">마취통증의학과 전문의 1:1 전담 안전 시스템</h3>
            
            <div className="bg-neutral-50 border border-neutral-100 rounded-lg p-10 lg:p-14 flex flex-col md:flex-row gap-12 items-center">
              <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-full bg-white shadow-xl overflow-hidden flex items-center justify-center border border-neutral-200 relative">
                <Image 
                  src="/images/dr-cho.jpg" 
                  alt="조난영 원장" 
                  fill 
                  className="object-cover" 
                />
              </div>
              
              <div className="flex-1">
                <h4 className="text-3xl font-bold text-neutral-900 mb-2">조난영 원장</h4>
                <p className="text-primary-500 font-medium mb-6 flex gap-3 text-lg items-center">
                  <span>마취통증의학과 전문의</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-200"></span>
                  <span className="bg-neutral-900 text-white text-xs px-3 py-1 rounded-full">본원 상주</span>
                </p>
                
                <ul className="space-y-3 font-light text-neutral-500 mb-8">
                  <li className="flex gap-2"><span className="text-primary-500 font-bold">✓</span> 前) 서울대학교병원 마취통증의학과 임상강사</li>
                  <li className="flex gap-2"><span className="text-primary-500 font-bold">✓</span> 前) 글로벌 탑티어 뷰티메디컬센터 마취과장</li>
                  <li className="flex gap-2"><span className="text-primary-500 font-bold">✓</span> 대한마취통증의학회 및 통증학회 정회원</li>
                </ul>
                
                <p className="text-neutral-900 font-medium leading-relaxed bg-white p-6 border border-neutral-100 rounded-lg italic shadow-sm">
                  "마취는 단순한 수면 상태가 아니라, 신체의 모든 핵심 생체 징후를 완벽히 통제하고 조율하는 정밀 의학입니다. 수술이 시작되는 순간부터 마취에서 완전히 깨어나는 순간까지, 단 1초도 환자의 곁을 떠나지 않고 안전을 지킵니다."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
