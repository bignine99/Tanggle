"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircle2, ChevronRight, MessageCircle, Sparkles } from "lucide-react";

export default function ConsultPage() {
  const [step, setStep] = useState(1);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [concern, setConcern] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [kakaoAlert, setKakaoAlert] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAiContext, setHasAiContext] = useState(false);

  useEffect(() => {
    // 챗봇에서 요약된 내용 불러오기
    const summary = sessionStorage.getItem("aura_chat_summary");
    if (summary) {
      setConcern(`--- AI 수석실장 요약 내역 ---\n${summary}\n----------------------\n\n`);
      setHasAiContext(true);
      sessionStorage.removeItem("aura_chat_summary");
    }
  }, []);

  const togglePart = (part: string) => {
    setSelectedParts(prev => 
      prev.includes(part) ? prev.filter(p => p !== part) : [...prev, part]
    );
  };

  const handleSubmit = async () => {
    if (!name || !phone) {
      alert("성함과 연락처를 모두 입력해주세요.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parts: selectedParts.length > 0 ? selectedParts : ["전체/미지정"],
          concern,
          name,
          phone,
          kakaoAlert
        })
      });

      if (response.ok) {
        setStep(4);
      } else {
        alert("접수 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error(error);
      alert("접수 중 오류가 발생했습니다. 원활한 상담을 위해 02-1234-5678로 유선 문의 바랍니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black pt-24 pb-20 px-4 flex justify-center items-center font-sans">
      <div className="w-full max-w-3xl bg-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[500px]">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-neutral-100">
          <motion.div 
            className="h-full instagram-gradient" 
            initial={{ width: "20%" }}
            animate={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <header className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-black mb-2">무료 전문의 상담</h1>
          <p className="text-neutral-500 w-full max-w-sm shrink-0 mx-auto">고민을 남겨주시면 1시간 내에 답변해 드립니다.</p>
          {hasAiContext && step < 4 && (
            <div className="mt-4 inline-flex items-center gap-2 bg-pink-500/10 text-pink-500 px-4 py-1.5 rounded-full text-sm font-bold border border-pink-500/30">
              <Sparkles className="w-4 h-4 shrink-0" />
              AI 수석 실장이 이전 대화 내용을 성공적으로 전달했습니다.
            </div>
          )}
        </header>

        <div className="flex-1 flex flex-col justify-start relative">
          <AnimatePresence mode="popLayout">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="w-full"
              >
                <h2 className="text-xl font-bold text-black mb-6">1. 원하시는 시술 부위를 선택해주세요 (다중 선택 가능)</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {["얼굴", "바디", "피부"].map(bodyPart => (
                    <button 
                      key={bodyPart} 
                      onClick={() => togglePart(bodyPart)} 
                      className={`py-6 rounded-2xl border transition-all text-lg font-bold ${
                        selectedParts.includes(bodyPart) 
                          ? "instagram-gradient text-white border-transparent" 
                          : "border-neutral-200 hover:border-pink-500 hover:bg-pink-50 text-black"
                      }`}
                    >
                      {bodyPart}
                    </button>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button onClick={() => setStep(2)} className="instagram-gradient text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:opacity-90">
                    다음 단계 <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="w-full flex-col h-full flex"
              >
                <h2 className="text-xl font-bold text-black mb-3">2. 이 부분이 가장 고민입니다.</h2>
                {hasAiContext && (
                  <p className="text-sm text-pink-500 mb-3 font-medium">✨ AI와의 상담 내용이 원장님 제출용으로 요약되었습니다.</p>
                )}
                <textarea 
                  value={concern}
                  onChange={(e) => setConcern(e.target.value)}
                  className="w-full p-6 rounded-2xl border border-neutral-200 bg-white min-h-[160px] outline-none focus:border-pink-500 resize-none mb-6 text-black shadow-inner"
                  placeholder="예) 아랫배가 처져서 고민이에요. 예전에 다이어트를 크게 한 적이 있습니다."
                />
                <div className="flex justify-between items-center mt-auto">
                  <button onClick={() => setStep(1)} className="text-neutral-500 font-medium hover:text-black px-4">
                    이전
                  </button>
                  <button onClick={() => setStep(3)} className="instagram-gradient text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:opacity-90">
                    다음 단계 <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="w-full flex flex-col h-full"
              >
                <h2 className="text-xl font-bold text-black mb-6">3. 연락 받으실 정보를 입력해 주세요.</h2>
                <div className="space-y-4 mb-8">
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="성함" 
                    className="w-full p-4 rounded-xl border border-neutral-200 bg-white outline-none focus:border-pink-500 text-black font-medium" 
                  />
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    inputMode="numeric" 
                    placeholder="휴대전화 번호 (숫자만)" 
                    className="w-full p-4 rounded-xl border border-neutral-200 bg-white outline-none focus:border-pink-500 text-black font-medium" 
                  />
                </div>
                <div className="flex justify-between items-center bg-[#FEE500]/20 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="text-[#3A1D1D] w-6 h-6 fill-[#FEE500]" />
                    <span className="font-semibold text-black">카카오톡으로 알림 받기</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={kakaoAlert}
                    onChange={(e) => setKakaoAlert(e.target.checked)}
                    className="w-5 h-5 accent-pink-500 cursor-pointer" 
                  />
                </div>
                
                <div className="flex justify-between items-center mt-auto pt-8">
                  <button onClick={() => setStep(2)} className="text-neutral-500 font-medium hover:text-black px-4 shrink-0">
                    이전
                  </button>
                  <button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="instagram-gradient text-white px-8 py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:opacity-90 disabled:opacity-70 flex-1 ml-4 shadow-lg hover:shadow-xl transition-all"
                  >
                    {isSubmitting ? "접수 완료 중..." : "상담 신청 완료하기"}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full text-center py-10"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[-4px_4px_15px_-4px_rgba(34,197,94,0.3)]">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-black mb-2">상담이 성공적으로 접수되었습니다.</h2>
                <p className="text-neutral-500 mb-8">입력해주신 연락처로 1시간 내에 예약 확정 연락을 드리겠습니다.</p>
                <button onClick={() => window.location.href = '/'} className="bg-neutral-100 border border-neutral-200 text-black px-8 py-3 rounded-full font-bold hover:bg-black hover:text-white transition-colors cursor-pointer shadow-sm">
                  홈으로 돌아가기
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
