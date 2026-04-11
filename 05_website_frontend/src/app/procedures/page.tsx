import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/lib/dataFetcher";

const getCategoryBg = (cat: string) => {
  const map: Record<string, string> = {
    '얼굴거상': '/images/category_bg/card_face_lift.png',
    '이마거상': '/images/category_bg/card_forehead_lift.png',
    '가슴거상': '/images/category_bg/card_breast_lift.png',
    '팔거상': '/images/category_bg/card_arm_lift.png',
    '복부거상': '/images/category_bg/card_tummy_tuck.png',
    '허벅지거상': '/images/category_bg/card_thigh_lift.png',
    '동안성형': '/images/category_bg/card_anti_aging.png',
    '엉덩이성형': '/images/category_bg/card_hip_up.jpeg',
    '지방흡입': '/images/category_bg/card_liposuction.png',
    '바디필러': '/images/category_bg/card_body_filler.png',
    '남성여유증': '/images/category_bg/card_gynecomastia.png',
    '기타': '/images/category_bg/card_special_clinic.png'
  };
  return map[cat] || '/images/category_bg/bg_special.png'; // Fallback
};

const CATEGORY_ORDER = [
  '얼굴거상', '이마거상', '가슴거상', '팔거상', '복부거상', '허벅지거상',
  '동안성형', '엉덩이성형', '지방흡입', '바디필러', '남성여유증', '기타'
];

export default function ProceduresIndexPage() {
  const categories = getCategories().sort((a, b) => {
    const idxA = CATEGORY_ORDER.indexOf(a);
    const idxB = CATEGORY_ORDER.indexOf(b);
    if (idxA === -1 && idxB === -1) return 0;
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });

  return (
    <div className="space-y-12 pb-24">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-4xl font-light text-neutral-800 mb-6">어떤 <span className="font-bold text-gradient-insta">고민</span>이 있으신가요?</h2>
        <p className="text-neutral-500 font-light text-lg">
          Aura Clinic의 축적된 임상 데이터와 독보적인 노하우를 바탕으로, 각 부위별 최적화된 수술 정보를 제공합니다.
        </p>
      </div>

      {/* Sticky Context Navigation */}
      <div className="sticky top-[72px] z-40 py-4 -mx-4 px-4 bg-[#FDFBF9]/80 backdrop-blur-xl border-b border-neutral-200/50 mb-12 shadow-[0_4px_30px_rgba(0,0,0,0.03)] layout-shift-prevent">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-sm font-bold text-neutral-800 tracking-widest uppercase">Select Category</span>
          <div className="flex gap-4 text-xs font-semibold">
            {/* Semantic Color Coding: Green for Safe/Proven, Red/Pink for Hot/Trending */}
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Proven Process</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-pink-500" /> High Demand</div>
          </div>
        </div>
      </div>

      {/* Grid with Soft Elevation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4 lg:px-0 max-w-7xl mx-auto">
        {categories.map((cat, idx) => {
          const isHighDemand = ['얼굴거상', '가슴거상', '동안성형'].includes(cat);
          const isProven = ['복부거상', '지방흡입'].includes(cat);
          
          return (
            <Link 
              key={cat} 
              href={`/procedures/${encodeURIComponent(cat)}`}
              className="group relative bg-white border border-neutral-100 rounded-[2rem] overflow-hidden hover:-translate-y-2 transition-all duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_80px_rgba(236,72,153,0.12)] flex flex-col h-[320px]"
            >
              {/* Semantic Badges */}
              <div className="absolute top-5 right-5 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                {isHighDemand && (
                  <span className="px-2.5 py-1 rounded-full bg-pink-500/10 backdrop-blur-md text-pink-600 text-[10px] font-bold tracking-widest border border-pink-500/20">
                    HIGH DEMAND
                  </span>
                )}
                {isProven && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 backdrop-blur-md text-emerald-600 text-[10px] font-bold tracking-widest border border-emerald-500/20">
                    PROVEN
                  </span>
                )}
              </div>

              {/* Background Image Layer */}
              <div className="absolute inset-0 z-0">
                <Image 
                  src={getCategoryBg(cat)} 
                  alt={`${cat} background`} 
                  fill 
                  className="object-cover opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out saturate-50 group-hover:saturate-100" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-transparent" />
              </div>
              
              <div className="relative z-10 mt-auto p-8 transform group-hover:-translate-y-2 transition-transform duration-500">
                <h3 className="text-2xl font-bold text-neutral-900 mb-2 group-hover:text-pink-500 transition-colors duration-300">
                  {cat}
                </h3>
                <p className="text-sm font-semibold text-neutral-400 flex items-center justify-between mt-6 group-hover:text-pink-500 transition-colors">
                  상세 가이드 보기
                  <span className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md text-neutral-300 flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] border border-neutral-100 group-hover:border-pink-400">
                    &rarr;
                  </span>
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
