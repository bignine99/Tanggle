import { ShieldCheck, Cross } from "lucide-react";

export default function ClinicPage() {
  return (
    <main className="min-h-screen bg-white pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-tanggle-charcoal mb-4">의원 소개</h1>
          <p className="text-lg text-tanggle-darkgray font-light">투명하고 안전한 탱글성형외과를 확인하세요</p>
        </header>

        <section className="mb-24 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold text-tanggle-charcoal mb-4">자연스러운 결과를 위한 고집</h2>
            <p className="text-lg text-tanggle-darkgray leading-relaxed">
              탱글성형외과는 무리한 시술을 권하지 않습니다. 각자의 개성과 비율을 분석하여, 시간이 흐를수록 아름다움이 유지되는 자연스러운 성형을 추구합니다.
            </p>
            <div className="flex items-center gap-4 text-tanggle-gold font-bold">
              <span className="flex items-center gap-2"><ShieldCheck /> 의료사고 0%</span>
              <span className="flex items-center gap-2"><Cross /> 정품/정량 보증</span>
            </div>
          </div>
          <div className="flex-[1.5] w-full aspect-video bg-tanggle-bg rounded-3xl relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-tanggle-beige/40 to-white/40" />
            <span className="text-tanggle-charcoal/40 font-bold z-10 tracking-[0.2em] uppercase">Clinic Interior View</span>
          </div>
        </section>

        <section className="bg-tanggle-bg rounded-3xl p-10 md:p-16">
          <h2 className="text-3xl font-bold text-tanggle-charcoal mb-10 text-center">원스톱 첨단 안전 시스템</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "대리수술 원천 차단", desc: "수술실명제를 통한 전문의 책임 집도" },
              { title: "마취과 전문의 상주", desc: "양병이 원장의 1:1 전담 마취 관리" },
              { title: "살균·소독 시스템", desc: "청결하고 쾌적한 진료 및 수술 환경" },
              { title: "안전 최우선 설계", desc: "정전 및 응급 상황 대비 완비" },
            ].map((sys, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm text-center border border-tanggle-charcoal/5 hover:-translate-y-2 transition-transform">
                <ShieldCheck className="w-10 h-10 text-tanggle-gold mx-auto mb-4" />
                <h3 className="font-bold text-lg text-tanggle-charcoal mb-2">{sys.title}</h3>
                <p className="text-tanggle-darkgray text-sm">{sys.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Location & Contact Information */}
        <section className="mt-24 pt-20 border-t border-tanggle-beige">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-tanggle-gold tracking-widest mb-3">LOCATION & CLINIC HOURS</h2>
            <h3 className="text-4xl font-extrabold text-tanggle-charcoal">오시는 길 및 진료 시간</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-tanggle-bg p-10 md:p-16 rounded-3xl">
            <div className="space-y-10">
              <div>
                <h4 className="text-xl font-bold text-tanggle-charcoal mb-3">병원 위치</h4>
                <p className="text-tanggle-darkgray font-medium text-lg mb-2">서울특별시 강남구 논현로 842 (압구정 빌딩 7F)</p>
                <p className="text-tanggle-darkgray font-light">3호선 압구정역 3번출구로 나오셔서 도보 3분 (약 150m 직진, 올리브영 지나 정문 위치)</p>
              </div>
              
              <div>
                <h4 className="text-xl font-bold text-tanggle-charcoal mb-3">주차 안내</h4>
                <p className="text-tanggle-darkgray font-medium mb-1">상시 1시간 무료 (건물 뒤 지하 주차장 이용)</p>
                <p className="text-tanggle-darkgray font-light text-sm">※ 1시간 초과 시 10분당 1,000원 추가 (귀가 전 데스크에서 확인 도장 필수)</p>
              </div>
            </div>
            
            <div className="space-y-10">
              <div>
                <h4 className="text-xl font-bold text-tanggle-charcoal mb-3">진료 시간</h4>
                <ul className="space-y-3">
                  <li className="flex justify-between border-b border-tanggle-charcoal/10 pb-2">
                    <span className="font-bold text-tanggle-charcoal">평일</span>
                    <span className="text-tanggle-darkgray">AM 10:00 ~ PM 7:00</span>
                  </li>
                  <li className="flex justify-between border-b border-tanggle-charcoal/10 pb-2">
                    <span className="font-bold text-tanggle-charcoal">토요일</span>
                    <span className="text-tanggle-darkgray">AM 10:00 ~ PM 5:00</span>
                  </li>
                  <li className="flex justify-between border-b border-tanggle-charcoal/10 pb-2">
                    <span className="font-bold text-red-500">일요일·공휴일</span>
                    <span className="text-tanggle-darkgray">휴진</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-2xl border border-tanggle-charcoal/10">
                <h4 className="text-sm font-bold text-tanggle-gold tracking-widest mb-1">상담 및 예약</h4>
                <p className="text-3xl font-extrabold text-tanggle-charcoal">02-542-8427</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
