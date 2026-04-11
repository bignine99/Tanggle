"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { MessageCircle, ChevronRight, Sparkles, Camera, Globe, BookOpen, ArrowRight, Star, Shield, Plus } from "lucide-react";
import { useRef, useEffect, useState } from "react";

/* ─── Floating Beauty Words Component ─── */
const BEAUTY_WORDS = [
  { text: "아름다움", lang: "ko" },
  { text: "美", lang: "zh" },
  { text: "beauty", lang: "en" },
  { text: "đẹp", lang: "vi" },
  { text: "красота", lang: "ru" },
  { text: "belleza", lang: "es" },
  { text: "beauté", lang: "fr" },
  { text: "schönheit", lang: "de" },
  { text: "美しさ", lang: "ja" },
  { text: "جمال", lang: "ar" },
  { text: "güzellik", lang: "tr" },
  { text: "สวยงาม", lang: "th" },
];

function FloatingBeautyWords() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const particlesInitialised = useRef(false);

  // Waypoints: the winding curve path from bottom-left (red) to top-right (yellow)
  // Traced from the user's hand-drawn black line
  const PATH_POINTS = [
    { x: 7, y: 88 },   // Start — red circle (bottom-left)
    { x: 14, y: 78 },
    { x: 22, y: 68 },
    { x: 28, y: 60 },
    { x: 32, y: 55 },
    { x: 38, y: 50 },
    { x: 44, y: 42 },
    { x: 50, y: 38 },
    { x: 55, y: 44 },  // slight dip/curve
    { x: 60, y: 36 },  
    { x: 64, y: 30 },
    { x: 68, y: 32 },  // another wave
    { x: 74, y: 26 },
    { x: 80, y: 20 },
    { x: 86, y: 16 },
    { x: 93, y: 12 },  // End — yellow circle (top-right)
  ];

  // Catmull-Rom spline interpolation for smooth curve
  function catmullRom(p0: {x:number,y:number}, p1: {x:number,y:number}, p2: {x:number,y:number}, p3: {x:number,y:number}, t: number) {
    const t2 = t * t;
    const t3 = t2 * t;
    return {
      x: 0.5 * ((2*p1.x) + (-p0.x+p2.x)*t + (2*p0.x-5*p1.x+4*p2.x-p3.x)*t2 + (-p0.x+3*p1.x-3*p2.x+p3.x)*t3),
      y: 0.5 * ((2*p1.y) + (-p0.y+p2.y)*t + (2*p0.y-5*p1.y+4*p2.y-p3.y)*t2 + (-p0.y+3*p1.y-3*p2.y+p3.y)*t3),
    };
  }

  // Get position on smooth path (t: 0 → 1)
  function getPointOnPath(t: number): { x: number; y: number } {
    if (isNaN(t) || !isFinite(t)) t = 0;
    const pts = PATH_POINTS;
    const n = pts.length - 1;
    const clampedT = Math.max(0, Math.min(t, 0.9999));
    const segment = Math.min(Math.floor(clampedT * n), n - 1) || 0;
    const localT = (clampedT * n) - segment || 0;

    const p0 = pts[Math.max(0, segment - 1)] || pts[0] || {x:0, y:0};
    const p1 = pts[segment] || pts[0] || {x:0, y:0};
    const p2 = pts[Math.min(n, segment + 1)] || pts[n] || {x:0, y:0};
    const p3 = pts[Math.min(n, segment + 2)] || pts[n] || {x:0, y:0};

    return catmullRom(p0, p1, p2, p3, localT);
  }

  // Particle data stored in ref for direct DOM manipulation
  const particlesRef = useRef<{
    id: number;
    word: typeof BEAUTY_WORDS[0];
    t: number;        // 0→1 progress along path
    speed: number;    // how fast (units per second)
    offsetX: number;  // lateral offset from main path
    offsetY: number;
    wobblePhase: number;
    wobbleSpeed: number;
    wobbleAmp: number;
    rotation: number;
    rotSpeed: number;
    size: number;
    baseOpacity: number;
  }[]>([]);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    // Create 24 words staggered along the path
    const count = 24;
    const items = Array.from({ length: count }, (_, i) => ({
      id: i,
      word: BEAUTY_WORDS[i % BEAUTY_WORDS.length],
      t: (i / count),               // evenly staggered start
      speed: 0.04 + Math.random() * 0.025,   // faster: full path ~15-25s
      offsetX: (Math.random() - 0.5) * 3,    // lateral drift ±1.5%
      offsetY: (Math.random() - 0.5) * 2,
      wobblePhase: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.5 + Math.random() * 0.8,
      wobbleAmp: 1.5 + Math.random() * 2,
      rotation: (Math.random() - 0.5) * 20,
      rotSpeed: (Math.random() - 0.5) * 15,
      size: 15 + Math.random() * 9,          // bigger: 15-24px
      baseOpacity: 0.45 + Math.random() * 0.35, // clearer and higher saturation: 45-80%
    }));

    particlesRef.current = items;
    setReady(true);

    // Animation loop
    let lastTime = performance.now();
    let frameId: number;

    function animate(time: number) {
      if (!active) return;
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      if (!containerRef.current) {
        frameId = requestAnimationFrame(animate);
        return;
      }

      const children = containerRef.current.children;

      particlesRef.current.forEach((p, i) => {
        // Advance along path
        p.t += p.speed * dt;
        if (p.t > 1) p.t -= 1; // loop

        // Rotation
        p.rotation += p.rotSpeed * dt;

        // Wobble (wind sway)
        p.wobblePhase += p.wobbleSpeed * dt;

        // Position on main path
        const pos = getPointOnPath(p.t);

        // Add lateral wobble (perpendicular to general direction)
        const wobX = Math.sin(p.wobblePhase) * p.wobbleAmp;
        const wobY = Math.cos(p.wobblePhase * 0.7) * (p.wobbleAmp * 0.5);

        const finalX = pos.x + p.offsetX + wobX;
        const finalY = pos.y + p.offsetY + wobY;

        // Opacity: fade in at start, full in middle, fade out at end
        let opacity = p.baseOpacity;
        if (p.t < 0.08) {
          opacity = p.baseOpacity * (p.t / 0.08); // fade in
        } else if (p.t > 0.85) {
          opacity = p.baseOpacity * ((1 - p.t) / 0.15); // fade out
        }

        // Apply to DOM directly (no React re-render)
        const el = children[i] as HTMLElement;
        if (el) {
          el.style.left = `${finalX}%`;
          el.style.top = `${finalY}%`;
          el.style.opacity = `${Math.max(0, opacity)}`;
          el.style.transform = `rotate(${p.rotation}deg)`;
        }
      });

      frameId = requestAnimationFrame(animate);
    }

    frameId = requestAnimationFrame(animate);

    return () => {
      active = false;
      cancelAnimationFrame(frameId);
    };
  }, []);

  if (!ready) return null;

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {particlesRef.current.map((p) => (
        <span
          key={p.id}
          className="absolute whitespace-nowrap text-white font-extralight tracking-widest drop-shadow-lg"
          style={{
            left: `${7}%`,
            top: `${88}%`,
            fontSize: `${p.size}px`,
            opacity: 0,
          }}
        >
          {p.word.text}
        </span>
      ))}
    </div>
  );
}

/* ─── Animated Section Title ─── */
function SectionTitle({ sub, title, desc, light = false }: { sub: string; title: React.ReactNode; desc?: string; light?: boolean }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-center mb-16"
    >
      <p className={`text-sm font-bold tracking-[0.3em] mb-4 text-neutral-500`}>{sub}</p>
      <h2 className={`text-4xl md:text-5xl font-light leading-tight ${light ? 'text-white' : 'text-black'}`}>{title}</h2>
      {desc && <p className={`mt-4 text-lg font-light ${light ? 'text-white/50' : 'text-black/50'}`}>{desc}</p>}
    </motion.div>
  );
}

/* ─── Feature Showcase Card (Glassmorphism & Bento) ─── */
function FeatureCard({ icon: Icon, title, desc, cta, href, delay, highlight, bgImage, className = "" }: {
  icon: any; title: string; desc: string; cta: string; href: string; delay: number; highlight?: boolean; bgImage?: string; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      <Link href={href} className="block h-full">
        <div className={`group relative p-8 md:p-10 rounded-[2rem] transition-all duration-700 hover:scale-[1.02] cursor-pointer overflow-hidden h-full flex flex-col justify-center ${
          highlight
            ? 'glass-card border border-white/10 shadow-[0_20px_40px_rgba(236,72,153,0.15)] hover:border-white/20 hover:shadow-[0_20px_50px_rgba(236,72,153,0.3)]'
            : 'glass-white bg-white/80 border border-neutral-200/50 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-pink-500/30'
        } ${highlight && !bgImage ? 'bg-neutral-900' : ''}`}>
          
          {bgImage && highlight && (
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
               <img src={bgImage} alt={title} className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-1000 mix-blend-luminosity brightness-90 saturate-50 group-hover:saturate-100" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            </div>
          )}

          {highlight && (
            <>
              <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-pink-500/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-pink-500/30 transition-all duration-700 mix-blend-screen animate-blob" style={{ animationDelay: '0s', animationDuration: '20s' }} />
              <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-purple-500/30 transition-all duration-700 mix-blend-screen animate-blob" style={{ animationDelay: '5s', animationDuration: '25s' }} />
            </>
          )}
          
          <div className={`relative z-20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
            highlight
              ? 'instagram-gradient shadow-lg'
              : 'bg-neutral-100 border border-neutral-200'
          } transition-all duration-500 group-hover:scale-110`}>
            <Icon className={`w-7 h-7 ${highlight ? 'text-white' : 'text-black'}`} />
          </div>
          
          <h3 className={`relative z-20 text-2xl font-bold mb-3 tracking-tight ${highlight ? 'text-white drop-shadow-lg' : 'text-black'}`}>{title}</h3>
          <p className={`relative z-20 text-[15px] leading-relaxed mb-6 font-light ${highlight ? 'text-white/90 drop-shadow-md' : 'text-black/60'} md:w-3/4`}>{desc}</p>
          
          {bgImage && highlight ? (
             <div className="absolute bottom-8 right-8 z-30 flex items-center gap-3 font-bold text-lg text-white drop-shadow-lg bg-pink-500/90 backdrop-blur-md px-6 py-3.5 rounded-full border border-pink-400/50 hover:bg-pink-500 transition-all group-hover:shadow-[0_10px_30px_rgba(236,72,153,0.5)]">
               {cta} <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
             </div>
          ) : (
            <div className={`relative z-20 flex items-center gap-2 font-semibold text-sm group-hover:gap-3 transition-all ${highlight ? 'text-pink-400' : 'text-pink-600'}`}>
              {cta} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Main Home Content ─── */
export default function HomeContent({ categories }: { categories: string[] }) {
  const displayCategories = categories.length > 0 ? categories.slice(0, 8) : [];
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.8], [0, 60]);

  function getCategoryImageUrl(cat: string): string {
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
    return map[cat] || '/images/category_bg/bg_special.png';
  }

  return (
    <main className="flex flex-col w-full min-h-screen relative font-sans">
      {/* ═══════════════════════════════════════════════════════════
          1. HERO — Immersive Full-Screen Dark Premium
         ═══════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Ambient glow layers */}
        <div className="hero-gradient-overlay absolute inset-0 z-[1]" />
        
        {/* Radial accent */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-pink-500/[0.04] rounded-full blur-[120px] z-[1]" />
        
        {/* Orbiting particles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] z-[2]">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-white/40"
              style={{
                animation: `orbit ${20 + i * 5}s linear infinite`,
                animationDelay: `${i * -5}s`,
              }}
            />
          ))}
        </div>

        {/* Floating Beauty Words */}
        <FloatingBeautyWords />

        {/* Hero Content */}
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="relative z-20 flex flex-col items-center text-center px-6 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/50" />
            <span className="text-white text-sm font-serif tracking-[0.3em] font-light uppercase">Aura Clinic</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/50" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-extralight text-white mb-6 leading-[1.1] tracking-tight"
          >
            당신만의{" "}
            <span className="text-gradient-insta font-light">아름다움</span>
            <br />
            <span className="text-2xl md:text-3xl lg:text-3xl font-serif font-light text-white/50 mt-4 block tracking-wide italic">
              Your Unique Beauty, Perfected
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-lg md:text-xl text-white/35 font-extralight max-w-2xl leading-relaxed mb-12"
          >
            AI 기반 다국어 상담 · 실시간 뷰티 시뮬레이션 · 600+ 전문 지식 콘텐츠
            <br />
            <span className="text-white/20">세계 어디서든, 당신의 언어로 아름다움을 설계합니다</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={() => window.location.href = '/ai-preview'}
              className="group relative px-10 py-5 rounded-full overflow-hidden transition-all duration-500"
            >
              <div className="absolute inset-0 instagram-gradient opacity-100 group-hover:opacity-90 transition-opacity" />
              <div className="absolute inset-0 shimmer" />
              <span className="relative z-10 flex items-center gap-3 text-white font-bold text-base shadow-sm">
                <Camera className="w-5 h-5" />
                AI 뷰티 시뮬레이션 체험
              </span>
            </button>

            <button
              onClick={() => {
                const chatBtn = document.querySelector('[data-chat-fab]') as HTMLButtonElement;
                if (chatBtn) chatBtn.click();
              }}
              className="group px-10 py-5 rounded-full border border-white/15 text-white font-semibold text-base hover:border-white/40 hover:bg-white/[0.03] transition-all duration-500 flex items-center justify-center gap-3"
            >
              <Globe className="w-5 h-5 text-white" />
              다국어 AI 상담 시작
            </button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="mt-16 flex items-center gap-8 text-white/20 text-xs font-light"
          >
            <span className="flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-white/50" /> 15년 무사고</span>
            <span className="w-px h-3 bg-white/10" />
            <span className="flex items-center gap-2"><Star className="w-3.5 h-3.5 text-white/50" /> 전문의 책임 집도</span>
            <span className="w-px h-3 bg-white/10" />
            <span className="flex items-center gap-2"><BookOpen className="w-3.5 h-3.5 text-white/50" /> 600+ 지식 콘텐츠</span>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <span className="text-white/20 text-[10px] tracking-[0.3em] font-light">SCROLL</span>
          <div className="w-px h-8 bg-gradient-to-b from-pink-500/40 to-transparent animate-pulse" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. THREE CORE FEATURES — Glassmorphism Showcase
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-32 px-6 bg-white overflow-hidden">
        {/* Background ambient */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-black/[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-black/[0.02] rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <SectionTitle
            sub="CORE FEATURES"
            title={<>AI로 완성하는 <strong className="font-semibold text-gradient-insta">프리미엄 경험</strong></>}
            desc="세 가지 핵심 기능이 당신의 아름다움 여정을 함께합니다"
            light={false}
          />

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 auto-rows-fr">
            {/* Bento Grid layout: Highlight card takes 2x2 on large screens */}
            <FeatureCard
              icon={Camera}
              title="AI 뷰티 시뮬레이션"
              desc="본인의 사진을 업로드하면 AI가 시술 전후를 실시간 시뮬레이션. 오차 없는 정교한 분석으로 나만의 아름다움을 미리 확인하세요."
              cta="시뮬레이션 시작"
              href="/ai-preview"
              delay={0}
              highlight
              bgImage="/images/ai_simulation_bg.png"
              className="md:col-span-2 md:row-span-2"
            />
            <FeatureCard
              icon={Globe}
              title="다국어 AI 상담 시스템"
              desc="한국어, English, 中文, Tiếng Việt, Русский, Español, 日本語, العربية, ภาษาไทย — 9개국어로 실시간 AI 커뮤니케이션. 600페이지 이상의 전문 임상 지식을 당신의 언어로 즉시 안내합니다."
              cta="AI 상담 체험하기"
              href="#"
              delay={0.15}
              highlight
              bgImage="/images/ai_consultation_bg.png"
              className="md:col-span-2"
            />
            <FeatureCard
              icon={BookOpen}
              title="프리미엄 지식 라이브러리"
              desc="안면거상, 체형교정, 동안성형 등 전문 콘텐츠를 AI가 요약·분석하여 환자의 상황에 가장 완벽하게 맞는 개인화된 가이드를 제공합니다."
              cta="지식 베이스 둘러보기"
              href="/procedures"
              delay={0.3}
              highlight
              bgImage="/images/library_bg.png"
              className="md:col-span-2"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          3. INTERACTIVE EXPERIENCE PREVIEW — Immersive Demo
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-32 px-6 bg-black overflow-hidden">
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />

        <div className="max-w-6xl mx-auto relative z-10">
          <SectionTitle
            sub="INTERACTIVE EXPERIENCE"
            title={<>처음 만나는 순간부터 <strong className="font-semibold text-gradient-insta">특별하게</strong></>}
            desc="방문 전부터 시작되는 맞춤형 케어 경험"
            light
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* AI Chat Preview */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7 }}
              className="glass-card rounded-3xl p-8 relative overflow-hidden group border border-white/10"
            >
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-pink-500/10 rounded-full blur-[50px] group-hover:bg-pink-500/20 transition-all duration-700" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full instagram-gradient flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">AI 수석 상담실장</h4>
                      <p className="text-green-400 text-xs flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        Aura-Intelligence Active
                      </p>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="text-[10px] text-pink-500 font-bold tracking-widest uppercase">Knowledge Base</div>
                    <div className="text-white/60 text-[11px] font-light italic">600+ Clinical Pages Linked</div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="bg-white/[0.06] rounded-2xl rounded-tl-sm px-5 py-3 text-white/70 text-sm max-w-[85%] border border-white/[0.05]">
                    안녕하세요! 무엇을 도와드릴까요? 저희 AI는 **약 600페이지의 전문 의학 데이터**를 바탕으로 정확한 상담을 도와드립니다.
                  </div>
                  <div className="bg-pink-500/20 rounded-2xl rounded-tr-sm px-5 py-3 text-white/80 text-sm max-w-[75%] ml-auto border border-pink-500/30">
                    얼굴거상의 흉터가 걱정돼요.
                  </div>
                  <div className="bg-white/[0.06] rounded-2xl rounded-tl-sm px-5 py-3 text-white/70 text-sm max-w-[85%] border border-white/[0.05]">
                    저희 Aura Clinic의 거상술은 최소 절개법을 사용합니다. AI 분석 결과, 환자분의 피부 탄력도에 따른 예상 흉터 위치는...
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-white/30 text-[10px] font-medium tracking-tight mr-2 uppercase">Multilingual:</div>
                  {["🇰🇷 KO", "🇺🇸 EN", "🇨🇳 ZH", "🇻🇳 VI", "🇷🇺 RU"].map((lang, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-white/[0.04] text-white/40 text-[9px] border border-white/[0.04]">{lang}</span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* AI Simulation Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="glass-card rounded-3xl p-8 relative overflow-hidden group cursor-pointer border border-white/10 hover:border-white/20"
              onClick={() => window.location.href = '/ai-preview'}
            >
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-pink-500/10 rounded-full blur-[50px] group-hover:bg-pink-500/20 transition-all duration-700" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-white font-bold text-lg">AI 뷰티 시뮬레이션</h4>
                  <span className="text-pink-400 text-xs font-semibold bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">LIVE PREVIEW</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] aspect-[3/4] relative overflow-hidden">
                    <img src="/images/sim_before.png" alt="Before" className="absolute inset-0 w-full h-full object-cover saturate-50 contrast-75 brightness-75 mix-blend-luminosity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                      <Camera className="w-3.5 h-3.5 text-white/70" />
                      <span className="text-white/70 text-[10px] font-bold tracking-wider">BEFORE</span>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-pink-500/[0.08] to-transparent border border-pink-500/30 aspect-[3/4] relative overflow-hidden shadow-[0_0_30px_rgba(236,72,153,0.15)] group-hover:shadow-[0_0_50px_rgba(236,72,153,0.3)] transition-all duration-700">
                    <img src="/images/sim_after.png" alt="After" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-pink-900/90 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 bg-pink-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-pink-400 shadow-lg">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                      <span className="text-white text-[10px] font-bold tracking-wider">AFTER (AI)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.06]">
                  <p className="text-white/60 text-xs font-light leading-relaxed">
                    📸 본인의 사진을 업로드하면 AI가 시술별 예상 결과를 실시간으로 시뮬레이션합니다.
                    <span className="text-pink-400 font-medium"> 지금 바로 체험해보세요 →</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          4. PROCEDURE CATEGORIES — Elegant Grid with hover
         ═══════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <SectionTitle
            sub="SERVICES"
            title={<>어떤 <strong className="font-bold">솔루션</strong>이 필요하신가요?</>}
            desc="AI 지식 베이스에 기반한 맞춤형 시술 안내"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayCategories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <Link href={`/procedures/${encodeURIComponent(cat)}`}>
                  <div className="relative overflow-hidden rounded-2xl group h-[300px] flex flex-col justify-end cursor-pointer isolate border border-neutral-100 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-500">
                    <img
                      src={getCategoryImageUrl(cat)}
                      alt={cat}
                      className="absolute inset-0 w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80 z-10 transition-opacity duration-300 group-hover:opacity-90" />

                    <div className="relative z-20 p-6 w-full flex flex-col justify-end">
                      <div className="flex justify-between items-end">
                        <div>
                          <h4 className="text-xl font-bold text-white group-hover:text-pink-300 transition-colors mb-1 drop-shadow-md">
                            {cat}
                          </h4>
                          <p className="text-xs font-light text-white/80 drop-shadow-md">
                            관련 수술 및 Q&A 확인
                          </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center shadow-lg group-hover:bg-gradient-to-br group-hover:from-pink-500 group-hover:to-orange-500 transition-colors duration-300 border border-white/20">
                          <Plus className="text-white w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              href="/procedures"
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full hover:bg-neutral-800 font-semibold text-sm transition-all duration-300 hover:shadow-xl"
            >
              전체 시술 둘러보기 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          5. BOTTOM CTA — Final Conversion Prompt
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-32 px-6 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black to-transparent z-10" />
        <FloatingBeautyWords />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center relative z-20"
        >
          <p className="text-white/50 text-xs tracking-[0.4em] font-bold mb-6">BEGIN YOUR JOURNEY</p>
          <h2 className="text-4xl md:text-5xl font-extralight text-white mb-6 leading-tight">
            지금, <span className="text-gradient-insta font-semibold">아름다움</span>을<br />설계하세요
          </h2>
          <p className="text-white/40 font-light text-lg mb-12">
            AI 상담부터 시뮬레이션까지, 모든 것이 준비되어 있습니다
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/consult'}
              className="px-10 py-5 rounded-full instagram-gradient text-white font-bold text-base hover:opacity-90 transition-opacity shadow-lg"
            >
              무료 상담 예약하기
            </button>
            <button
              onClick={() => window.location.href = '/ai-preview'}
              className="px-10 py-5 rounded-full border border-white/20 text-white font-semibold text-base hover:border-white/40 hover:bg-white/[0.03] transition-all flex items-center justify-center gap-3"
            >
              <Camera className="w-5 h-5 text-white" />
              AI 시뮬레이션 체험
            </button>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
