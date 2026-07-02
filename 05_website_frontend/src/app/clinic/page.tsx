"use client";

import { ShieldCheck, Cross, Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";

export default function ClinicPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <main className="min-h-screen bg-white pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 mb-4">의원 소개</h1>
          <p className="text-lg text-neutral-500 font-light">투명하고 안전한 Aura Clinic를 확인하세요</p>
        </header>

        <section className="mb-24 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">자연스러운 결과를 위한 고집</h2>
            <p className="text-lg text-neutral-500 leading-relaxed">
              Aura Clinic는 무리한 시술을 권하지 않습니다. 각자의 개성과 비율을 분석하여, 시간이 흐를수록 아름다움이 유지되는 자연스러운 성형을 추구합니다.
            </p>
            <div className="flex items-center gap-4 text-primary-500 font-bold">
              <span className="flex items-center gap-2"><ShieldCheck /> 의료사고 0%</span>
              <span className="flex items-center gap-2"><Cross /> 정품/정량 보증</span>
            </div>
          </div>
          <div className="flex-[1.5] w-full aspect-video bg-neutral-900 rounded-2xl relative overflow-hidden border border-neutral-100 group">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              src="/images/aura_clinic.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
            <button
              onClick={toggleMute}
              className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2.5 rounded-full backdrop-blur-sm transition-all opacity-70 group-hover:opacity-100"
              aria-label={isMuted ? "소리 켜기" : "소리 끄기"}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </section>

        <section className="bg-neutral-50 rounded-2xl border border-neutral-100 p-10 md:p-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-10 text-center">원스톱 첨단 안전 시스템</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "대리수술 원천 차단", desc: "수술실명제를 통한 전문의 책임 집도" },
              { title: "마취과 전문의 상주", desc: "Aura 전문 마취 팀의 1:1 전담 마취 관리" },
              { title: "살균·소독 시스템", desc: "청결하고 쾌적한 진료 및 수술 환경" },
              { title: "안전 최우선 설계", desc: "정전 및 응급 상황 대비 완비" },
            ].map((sys, idx) => (
              <div key={idx} className="bg-white p-8 rounded-lg shadow-sm text-center border border-neutral-100 hover:-translate-y-2 hover:shadow-md transition-all">
                <ShieldCheck className="w-10 h-10 text-primary-500 mx-auto mb-4" />
                <h3 className="font-bold text-lg text-neutral-900 mb-2">{sys.title}</h3>
                <p className="text-neutral-500 text-sm">{sys.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Location & Contact Information */}
        <section className="mt-24 pt-20 border-t border-neutral-100">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-primary-500 tracking-widest mb-3">LOCATION & CLINIC HOURS</h2>
            <h3 className="text-4xl font-extrabold text-neutral-900">오시는 길 및 진료 시간</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-neutral-50 border border-neutral-100 p-10 md:p-16 rounded-2xl">
            <div className="space-y-10">
              <div>
                <h4 className="text-xl font-bold text-neutral-900 mb-3">병원 위치</h4>
                <p className="text-neutral-500 font-medium text-lg mb-2">서울특별시 강남구 AURA대로 123 (AURA 빌딩 7F)</p>
                <p className="text-neutral-500 font-light">AURA역 1번출구 앞 도보 1분</p>
              </div>
              
              <div>
                <h4 className="text-xl font-bold text-neutral-900 mb-3">주차 안내</h4>
                <p className="text-neutral-500 font-medium mb-1">발렛 파킹 상시 무료 지원</p>
                <p className="text-neutral-500 font-light text-sm">※ 데스크에서 차량 번호 등록 필수</p>
              </div>
            </div>
            
            <div className="space-y-10">
              <div>
                <h4 className="text-xl font-bold text-neutral-900 mb-3">진료 시간</h4>
                <ul className="space-y-3">
                  <li className="flex justify-between border-b border-neutral-200 pb-2">
                    <span className="font-bold text-neutral-900">평일</span>
                    <span className="text-neutral-500">AM 09:30 ~ PM 6:30</span>
                  </li>
                  <li className="flex justify-between border-b border-neutral-200 pb-2">
                    <span className="font-bold text-neutral-900">토요일</span>
                    <span className="text-neutral-500">AM 09:30 ~ PM 2:00</span>
                  </li>
                  <li className="flex justify-between border-b border-neutral-200 pb-2">
                    <span className="font-bold text-red-500">일요일·공휴일</span>
                    <span className="text-neutral-500">휴진</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm">
                <h4 className="text-sm font-bold text-primary-500 tracking-widest mb-1">상담 및 예약</h4>
                <p className="text-3xl font-extrabold text-neutral-900">010-4160-1876</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
