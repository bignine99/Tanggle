import Link from "next/link";
import { getCategories } from "@/lib/dataFetcher";
import { ReactNode } from "react";

export const metadata = {
  title: "탱글성형외과 | 맞춤 시술 안내",
  description: "당신의 아름다움을 위한 완벽한 솔루션, 탱글성형외과의 시술 정보입니다.",
};

export default function ProceduresLayout({ children }: { children: ReactNode }) {
  // Fetch available categories directly in the Server Component
  const categories = getCategories();

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      
      {/* Premium Hero Header for Procedures - White Clean Concept */}
      <section className="relative pt-32 pb-16 overflow-hidden border-b border-neutral-100 bg-[#FFFFFF]">
        {/* Subtle sophisticated background pattern/gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-neutral-50 to-white" />
        
        {/* Subtle accent blur for premium touch */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-100/50 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-start gap-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 bg-white text-sm font-medium tracking-wide text-neutral-600 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary-500" />
            프리미엄 맞춤 컨설팅
          </span>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-800">
            당신의 가치를 높이는 <strong className="font-semibold text-neutral-950">시술 솔루션</strong>
          </h1>
          <p className="text-neutral-500 max-w-2xl mt-2 leading-relaxed">
            오창현 대표원장의 독보적인 기술력과 끊임없는 연구를 바탕으로, 가장 안전하고 이상적인 결과를 약속드립니다. 모든 데이터는 탱글성형외과의 자체 지식 기반으로 작성되었습니다.
          </p>
        </div>
      </section>

      {/* 2-Column Layout */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 flex flex-col md:flex-row gap-12 bg-[#FFFFFF]">
        
        {/* Left Sidebar (Vertical LNB) */}
        <aside className="w-full md:w-56 lg:w-64 shrink-0">
          <nav className="sticky top-28 bg-white/60 backdrop-blur-md rounded-xl border border-neutral-100 p-5 shadow-sm">
            <div className="mb-4">
              <Link 
                href="/procedures"
                className="flex items-center justify-between px-3 py-2 rounded-md text-[13px] font-bold tracking-wide text-neutral-800 hover:text-primary-600 hover:bg-primary-50 transition-all border border-neutral-100 bg-white shadow-sm"
              >
                전체보기
                <span className="text-primary-400 text-[10px]">▶</span>
              </Link>
            </div>

            {/* Group 1: 거상 (Lifting/Body Lift) */}
            <h4 className="text-[11px] font-extrabold tracking-widest text-primary-500 mt-6 mb-2 uppercase px-3">
              거상 클리닉
            </h4>
            <ul className="flex flex-col gap-0.5">
              {['얼굴거상', '이마거상', '목거상', '가슴거상', '팔거상', '복부거상', '허벅지거상']
                .filter(cat => categories.includes(cat))
                .map((cat) => (
                  <li key={cat}>
                     <Link 
                        href={`/procedures/${encodeURIComponent(cat)}`}
                        className="group flex items-center justify-between px-4 py-1.5 rounded-md text-[13px] font-medium tracking-wide text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-all"
                      >
                        {cat}
                      </Link>
                  </li>
              ))}
            </ul>

            {/* Group 2: 기타 성형수술 */}
            <h4 className="text-[11px] font-extrabold tracking-widest text-primary-500 mt-6 mb-2 uppercase px-3">
              성형 및 체형
            </h4>
            <ul className="flex flex-col gap-0.5">
              {['동안성형', '엉덩이성형', '지방흡입', '바디필러', '남성여유증', '기타']
                .filter(cat => categories.includes(cat))
                .map((cat) => (
                  <li key={cat}>
                     <Link 
                        href={`/procedures/${encodeURIComponent(cat)}`}
                        className="group flex items-center justify-between px-4 py-1.5 rounded-md text-[13px] font-medium tracking-wide text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-all"
                      >
                        {cat}
                      </Link>
                  </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
