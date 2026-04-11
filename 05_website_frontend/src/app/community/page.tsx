import { Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as motion from "framer-motion/client";

export const metadata = {
  title: "Aura Clinic | 커뮤니티",
  description: "Aura Clinic에서 병원 관계자와 환자들이 소통할 수 있는 공간입니다.",
};

const REVIEWS = [
  { id: 1, title: "10년 젊어진 기분이에요!", tag: "얼굴거상", tagEn: "Face Lifting", before: "/images/category_bg/card_anti_aging.png", after: "/images/category_bg/card_face_lift.png", height: "h-[300px]" },
  { id: 2, title: "출산 후 늘어진 뱃살 완벽 해결", tag: "복부거상", tagEn: "Tummy Tuck", before: "/images/category_bg/bg_body.png", after: "/images/category_bg/card_tummy_tuck.png", height: "h-[450px]" },
  { id: 3, title: "무너진 턱선 라인 정리", tag: "목거상", tagEn: "Neck Lifting", before: "/images/category_bg/bg_lifting.png", after: "/images/category_lifting.png", height: "h-[350px]" },
  { id: 4, title: "운동으로도 안 빠지던 군살 흡입", tag: "지방흡입", tagEn: "Liposuction", before: "/images/category_body_4.png", after: "/images/hero_clinic_interior.png", height: "h-[400px]" },
  { id: 5, title: "가슴 처짐, 이제 당당해졌습니다", tag: "가슴거상", tagEn: "Breast Lift", before: "/images/category_body.png", after: "/images/category_body_2.png", height: "h-[320px]" },
  { id: 6, title: "탄력있는 애플힙 만들기", tag: "엉덩이성형", tagEn: "Hip-Up", before: "/images/category_body_3.png", after: "/images/hero_main_consult.png", height: "h-[480px]" },
];

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF9] text-neutral-900 font-sans pt-32 pb-24 overflow-hidden">
      {/* Header Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-6 lg:px-12 mb-16 flex flex-col items-center text-center"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-pink-500/20 bg-pink-500/5 text-sm font-medium tracking-wide text-pink-500 shadow-sm mb-4">
          <Sparkles className="w-4 h-4" />
          AURA Clinic COMMUNITY
        </span>
        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-800 mb-4">
          환자와 소통하는 <strong className="font-semibold text-gradient-insta">아우라 커뮤니티</strong>
        </h1>
        <p className="text-neutral-500 max-w-2xl leading-relaxed">
          이수현 대표원장의 독보적인 기술력으로 완성된 VIP 고객님들의 실제 전후 사진입니다. 마우스를 올리면 시술 전 사진을 확인할 수 있습니다.
        </p>
        
        {/* Quick Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          <button className="px-5 py-2.5 rounded-full instagram-gradient text-white font-bold text-sm shadow-lg hover:opacity-90 transition-opacity">전체보기</button>
          <button className="px-5 py-2.5 rounded-full bg-white border border-neutral-200 text-neutral-600 hover:border-pink-300 hover:text-pink-600 font-bold text-sm transition-colors">얼굴거상</button>
          <button className="px-5 py-2.5 rounded-full bg-white border border-neutral-200 text-neutral-600 hover:border-pink-300 hover:text-pink-600 font-bold text-sm transition-colors">복부/체형거상</button>
          <button className="px-5 py-2.5 rounded-full bg-white border border-neutral-200 text-neutral-600 hover:border-pink-300 hover:text-pink-600 font-bold text-sm transition-colors">기타 성형</button>
        </div>
      </motion.section>

      {/* Masonry-like Grid Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {REVIEWS.map((review, idx) => (
            <motion.div 
              key={review.id} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
              className={`relative break-inside-avoid rounded-[2rem] overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(236,72,153,0.15)] transition-all duration-700 group border border-neutral-100 bg-white cursor-pointer ${review.height}`}
            >
              {/* After Image (Always visible by default) */}
              <div className="absolute inset-0 w-full h-full bg-neutral-200">
                <img 
                  src={review.after} 
                  alt={review.title} 
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out saturate-110 contrast-105 brightness-105" 
                />
              </div>

              {/* Before Image (Revealed on hover via opacity) */}
              <div className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 bg-neutral-900">
                <img 
                  src={review.before} 
                  alt={`${review.title} Before`} 
                  className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                  style={{
                    filter: "saturate(0.5) contrast(0.9) brightness(0.8)",
                  }} 
                />
              </div>

              {/* Gradient Overlays */}
              <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/90 via-black/40 to-transparent z-20 pointer-events-none mix-blend-multiply" />
              <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/40 to-transparent z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Labels with Glassmorphism 2.0 */}
              <div className="absolute top-5 left-5 z-30 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-2 group-hover:translate-y-0">
                 <span className="px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-[24px] saturate-[1.3] text-white text-[10px] font-bold tracking-widest border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                   BEFORE
                 </span>
              </div>
              <div className="absolute top-5 right-5 z-30 group-hover:opacity-0 transition-opacity duration-500">
                 <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-[24px] saturate-[1.3] text-white text-[10px] font-bold tracking-widest border border-white/20 shadow-[0_4px_30px_rgba(236,72,153,0.3)]">
                   <span className="text-gradient-insta">AFTER</span>
                 </span>
              </div>
              
              {/* Content block */}
              <div className="absolute inset-x-0 bottom-0 p-6 z-30 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex gap-2 items-center mb-3">
                  <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-[24px] saturate-[1.3] text-white text-xs font-bold border border-white/20 shadow-lg">
                    #{review.tag}
                  </span>
                  <span className="text-[10px] text-pink-400 tracking-widest uppercase font-bold drop-shadow-md">
                    {review.tagEn}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 leading-snug drop-shadow-md group-hover:text-pink-100 transition-colors">
                  {review.title}
                </h3>
                <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                  <span className="text-sm font-bold border-b text-gradient-insta border-pink-400/50">자세히 보기</span>
                  <ArrowRight className="w-4 h-4 text-pink-400" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section with Aurora Background */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto px-6 mt-32 text-center"
      >
        <div className="p-16 rounded-[2.5rem] bg-black text-white shadow-2xl relative overflow-hidden">
          {/* Aurora Blobs */}
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-pink-500/30 rounded-full blur-[80px] mix-blend-screen animate-blob" style={{ animationDelay: '0s', animationDuration: '20s' }} />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/30 rounded-full blur-[80px] mix-blend-screen animate-blob" style={{ animationDelay: '5s', animationDuration: '25s' }} />
          <div className="absolute top-[20%] right-[20%] w-[40%] h-[40%] bg-orange-500/20 rounded-full blur-[80px] mix-blend-screen animate-blob" style={{ animationDelay: '10s', animationDuration: '22s' }} />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">다음 <span className="text-gradient-insta">프리미엄 모델</span>의 주인공은<br />바로 당신입니다</h2>
            <p className="text-white/60 mb-10 max-w-lg mx-auto font-light leading-relaxed">
              수만 건의 데이터와 숙련된 의료진의 기술력으로 당신만의 아름다움을 완벽하게 되찾아 드립니다.
            </p>
            <Link href="/consult" className="inline-flex items-center justify-center px-10 py-5 bg-white/10 backdrop-blur-[24px] saturate-[1.3] text-white font-bold rounded-2xl border border-white/20 hover:bg-white/20 hover:-translate-y-1 transition-all shadow-[0_10px_40px_rgba(236,72,153,0.3)]">
              무료 상담 예약하기
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

