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
    <div className="space-y-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-neutral-900 mb-4">어떤 고민이 있으신가요?</h2>
        <p className="text-neutral-500">
          탱글성형외과의 축적된 임상 데이터를 바탕으로, 각 부위별 최적화된 수술 정보를 제공합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link 
            key={cat} 
            href={`/procedures/${encodeURIComponent(cat)}`}
            className="group relative bg-white border border-neutral-100 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col h-[280px]"
          >
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
              <Image 
                src={getCategoryBg(cat)} 
                alt={`${cat} background`} 
                fill 
                className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
            </div>
            
            <div className="relative z-10 mt-auto p-8">
              <h3 className="text-2xl font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                {cat}
              </h3>
              <p className="text-sm font-semibold text-neutral-500 flex items-center justify-between mt-6 group-hover:text-primary-600 transition-colors">
                자세히 보기
                <span className="w-8 h-8 rounded-full bg-white/80 backdrop-blur text-primary-500 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-[0_0_15px_rgba(255,107,33,0.3)] border border-primary-50">
                  &rarr;
                </span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
