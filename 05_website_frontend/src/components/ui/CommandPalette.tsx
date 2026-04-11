"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Phone, Command, CalendarCheck2, Stethoscope, Video } from "lucide-react";

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((isOpen) => !isOpen);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!isOpen) return null;

  // Mock search logic based on simple keywords
  const handleSelect = (url: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(url);
  };

  const results = [
    { title: "얼굴거상 (Face Lifting)", type: "시술", icon: <Stethoscope className="w-4 h-4 text-blue-500" />, url: "/procedures/얼굴거상" },
    { title: "동안성형 (Anti-Aging)", type: "시술", icon: <Stethoscope className="w-4 h-4 text-purple-500" />, url: "/procedures/동안성형" },
    { title: "가슴거상 (Breast Lift)", type: "시술", icon: <Stethoscope className="w-4 h-4 text-pink-500" />, url: "/procedures/가슴거상" },
    { title: "AI 가상 성형 (Preview)", type: "기능", icon: <Command className="w-4 h-4 text-neutral-500" />, url: "/ai-preview" },
    { title: "상담 예약 (Consult)", type: "예약", icon: <CalendarCheck2 className="w-4 h-4 text-orange-500" />, url: "/consult" },
    { title: "리얼 후기 (Reviews)", type: "커뮤니티", icon: <Video className="w-4 h-4 text-red-500" />, url: "/reviews" }
  ].filter(item => 
    !query || 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    item.type.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-center items-start pt-[20vh]" onClick={() => setIsOpen(false)}>
      <div 
        className="w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 border-b border-neutral-100">
          <Search className="w-5 h-5 text-neutral-400" />
          <input
            type="text"
            className="w-full bg-transparent border-none focus:ring-0 px-4 py-4 text-lg outline-none placeholder:text-neutral-300 text-neutral-800"
            placeholder="증상, 부위, 수술명 등 무엇이든 검색해보세요."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          <kbd className="hidden sm:inline-block px-2 text-xs text-neutral-400 font-sans border border-neutral-200 rounded-md bg-neutral-50 shadow-sm ml-2">ESC</kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {query === "" && (
            <div className="p-2 border-b border-neutral-100/50">
              <div className="text-xs font-bold text-neutral-400 px-3 py-2 uppercase tracking-widest">바로가기 (퀵 링크)</div>
              <div className="grid grid-cols-2 gap-1 p-1">
                <button onClick={() => handleSelect('/consult')} className="flex items-center gap-3 px-3 py-3 hover:bg-neutral-50 rounded-xl transition-colors">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    <CalendarCheck2 className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-neutral-800">빠른 예약</div>
                    <div className="text-[11px] text-neutral-400">원장님 직접 전문의 상담</div>
                  </div>
                </button>
                <button onClick={() => handleSelect('/clinic')} className="flex items-center gap-3 px-3 py-3 hover:bg-neutral-50 rounded-xl transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-neutral-800">오시는 길</div>
                    <div className="text-[11px] text-neutral-400">압구정역 3번출구 직진 150m</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          <div className="p-2">
            <div className="text-xs font-bold text-neutral-400 px-3 py-2 uppercase tracking-widest">
              {query ? "검색 결과" : "추천 시술/메뉴"}
            </div>
            {results.length > 0 ? (
              <ul className="space-y-1">
                {results.map((result, i) => (
                  <li key={i}>
                    <button 
                      onClick={() => handleSelect(result.url)}
                      className="w-full flex items-center justify-between px-3 py-3 hover:bg-primary-50 rounded-xl transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center group-hover:bg-white border border-transparent group-hover:border-primary-200 transition-colors">
                          {result.icon}
                        </div>
                        <div className="text-left">
                          <div className="text-[15px] font-bold text-neutral-900 group-hover:text-primary-700 transition-colors">{result.title}</div>
                        </div>
                      </div>
                      <span className="text-xs px-2.5 py-1 bg-neutral-100 text-neutral-500 rounded-full group-hover:bg-primary-100 group-hover:text-primary-700 transition-colors">
                        {result.type}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-5 py-12 text-center text-neutral-500 text-sm">
                검색 결과가 없습니다.
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-neutral-50 px-4 py-3 border-t border-neutral-100 flex items-center justify-between">
          <div className="text-xs font-medium text-neutral-400">
            단축키 <kbd className="px-1 py-0.5 rounded border border-neutral-200 bg-white ml-1">Cmd</kbd> + <kbd className="px-1 py-0.5 rounded border border-neutral-200 bg-white">K</kbd> 로 언제든 검색창을 열 수 있습니다.
          </div>
        </div>
      </div>
    </div>
  );
}
