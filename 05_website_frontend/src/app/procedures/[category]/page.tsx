import Link from "next/link";
import { getProceduresByCategory } from "@/lib/dataFetcher";
import { notFound } from "next/navigation";
import { categoryDescriptions } from "@/lib/categoryDescriptions";
interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

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

// Next.js 15+ async params handling
export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const decodedCategory = decodeURIComponent(resolvedParams.category);
  const procedures = getProceduresByCategory(decodedCategory);

  if (!procedures || procedures.length === 0) {
    notFound();
  }

  return (
    <div className="space-y-12">
      <div className="border-b border-neutral-100 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-neutral-900">
            <span className="text-primary-500 mr-3">|</span> 
            {decodedCategory} 관련 시술
          </h2>
        </div>

        {/* 카테고리 상세 설명 콘텐츠 (Dynamic Render) */}
        {categoryDescriptions[decodedCategory] && (() => {
          const desc = categoryDescriptions[decodedCategory];
          return (
            <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-sm mt-4">
              {/* Background flourish */}
              <div className="absolute -top-16 -right-16 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 w-full">
                <h3 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                  {desc.title}
                </h3>
                <p className="text-neutral-700 leading-relaxed mb-8 font-medium text-[15px] whitespace-pre-line">
                  {desc.description}
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 적합한 대상 */}
                  <div className="bg-white/80 backdrop-blur-md rounded-2xl p-7 border border-orange-100/50 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="flex items-center gap-2 font-bold text-primary-600 mb-4 text-lg">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      이런 분들께 권장합니다
                    </h4>
                    <ul className="space-y-3 text-[14px] text-neutral-600 leading-relaxed">
                      {desc.targets.map((target, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="text-primary-500 mt-0.5 shrink-0 font-bold">✓</span> {target}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 비용 정보 */}
                  <div className="bg-white/80 backdrop-blur-md rounded-2xl p-7 border border-orange-100/50 shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="flex items-center gap-2 font-bold text-primary-600 mb-4 text-lg">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      시술 핵심 정보
                    </h4>
                    <ul className="space-y-4 text-[14px] text-neutral-600 leading-relaxed">
                      <li>
                        <strong className="text-neutral-800 font-bold inline-block w-20">수술 시간</strong> 
                        {desc.time}
                      </li>
                      <li>
                        <strong className="text-neutral-800 font-bold inline-block w-20">마취/회복</strong> 
                        {desc.recovery}
                      </li>
                      <li>
                        <strong className="text-neutral-800 font-bold inline-block w-20">비용 안내</strong> 
                        <span className="font-semibold text-primary-600 border-b border-primary-200">{desc.cost}</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-8 text-sm font-semibold text-primary-700 bg-primary-50/50 inline-flex items-center px-5 py-3 rounded-xl border border-primary-100 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2.5 shrink-0"></span>
                  {desc.footer}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {procedures.map((proc) => (
          <Link 
            key={proc.id} 
            href={`/procedures/${resolvedParams.category}/${proc.id}`}
            className="flex flex-col bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:-translate-y-2 transition-all duration-500 group relative isolate"
          >
            {/* Cinematic Background Image Container */}
            <div className="h-56 relative overflow-hidden bg-neutral-100">
              {proc.video_id ? (
                <img 
                  src={`https://img.youtube.com/vi/${proc.video_id}/maxresdefault.jpg`} 
                  alt={proc.title}
                  className="absolute inset-0 w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              ) : (
                <img
                  src={getCategoryImageUrl(decodedCategory)}
                  alt={proc.title}
                  className="absolute inset-0 w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out" 
                />
              )}
              
              {/* 다이내믹 메쉬/그라디언트 블렌드 (Cinematic Gradient) */}
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/40 via-neutral-800/10 to-transparent mix-blend-overlay z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              
              {!proc.video_id && (
                <span className="absolute top-4 left-4 z-20 text-white/60 font-bold text-xs uppercase tracking-[0.2em]">
                  TANGGLE CLINIC
                </span>
              )}

              {/* Hashtag Chips overlaid on the image bottom */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap gap-2">
                {proc.surgery_info?.recovery && (
                  <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-md text-[11px] font-medium text-white border border-white/30 shadow-sm transition-colors group-hover:bg-white/30">
                    #회복 {proc.surgery_info.recovery}
                  </span>
                )}
                {proc.surgery_info?.anesthesia && (
                  <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-md text-[11px] font-medium text-white border border-white/30 shadow-sm transition-colors group-hover:bg-white/30">
                    #{proc.surgery_info.anesthesia.replace('마취', '')}마취
                  </span>
                )}
                {proc.advantages && proc.advantages[0] && typeof proc.advantages[0] === 'string' && (
                  <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-md text-[11px] font-medium text-white border border-white/30 shadow-sm transition-colors group-hover:bg-white/30">
                    #{proc.advantages[0].substring(0, 10)}{proc.advantages[0].length > 10 ? '...' : ''}
                  </span>
                )}
              </div>
            </div>
            
            <div className="p-8 flex-1 flex flex-col bg-white">
              <span className="text-xs font-bold text-primary-500 mb-2 tracking-widest uppercase">{proc.category}</span>
              <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                {proc.title}
              </h3>
              <p className="text-sm text-neutral-500 line-clamp-3 leading-relaxed mb-6 flex-1 font-light">
                {proc.summary || "상세 내용을 확인하시려면 클릭하세요."}
              </p>
              
              <div className="mt-6 pt-5 border-t border-neutral-100 flex items-center justify-between group/btn">
                <span className="text-sm font-bold text-neutral-900 tracking-wide transition-colors group-hover/btn:text-primary-600">
                  자세히 보기
                </span>
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-50 text-neutral-400 group-hover:bg-primary-500 group-hover:text-white group-hover:-rotate-45 transition-all duration-300 shadow-sm group-hover:shadow-md">
                  <svg className="w-4 h-4 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
