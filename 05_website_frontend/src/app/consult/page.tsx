"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { CheckCircle2, ChevronRight, MessageCircle } from "lucide-react";

export default function ConsultPage() {
  const [step, setStep] = useState(1);
  
  return (
    <main className="min-h-screen bg-tanggle-bg pt-24 pb-20 px-4 flex justify-center items-center">
      <div className="w-full max-w-3xl glass rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-tanggle-charcoal/5">
          <motion.div 
            className="h-full bg-tanggle-gold" 
            initial={{ width: "20%" }}
            animate={{ width: `${(step / 6) * 100}%` }}
          />
        </div>

        <header className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-tanggle-charcoal mb-2">무료 전문의 상담</h1>
          <p className="text-tanggle-darkgray">고민을 남겨주시면 1시간 내에 답변해 드립니다.</p>
        </header>

        <div className="min-h-[300px]">
          <AnimatePresence mode="popLayout">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <h2 className="text-xl font-bold text-tanggle-charcoal mb-6">1. 원하시는 시술 부위를 선택해주세요 (다중 선택 가능)</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {["얼굴", "바디", "피부"].map(bodyPart => (
                    <button key={bodyPart} onClick={() => setStep(2)} className="py-6 rounded-2xl border-2 border-tanggle-charcoal/10 hover:border-tanggle-gold hover:bg-tanggle-gold/5 transition-all text-lg font-bold text-tanggle-charcoal">
                      {bodyPart}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex flex-col h-full"
              >
                <h2 className="text-xl font-bold text-tanggle-charcoal mb-3">2. 이 부분이 가장 고민입니다.</h2>
                <textarea 
                  className="w-full p-6 rounded-2xl border-2 border-tanggle-charcoal/10 bg-white min-h-[150px] outline-none focus:border-tanggle-gold resize-none mb-6 text-tanggle-charcoal"
                  placeholder="예) 아랫배가 처져서 고민이에요. 예전에 다이어트를 크게 한 적이 있습니다."
                />
                <button onClick={() => setStep(3)} className="mt-auto self-end bg-tanggle-charcoal text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-black">
                  다음 단계 <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <h2 className="text-xl font-bold text-tanggle-charcoal mb-6">3. 연락 받으실 정보를 입력해 주세요.</h2>
                <div className="space-y-4 mb-8">
                  <input type="text" placeholder="성함" className="w-full p-4 rounded-xl border border-tanggle-charcoal/20 bg-white outline-none focus:border-tanggle-gold" />
                  <input type="tel" inputMode="numeric" placeholder="휴대전화 번호 (숫자만)" className="w-full p-4 rounded-xl border border-tanggle-charcoal/20 bg-white outline-none focus:border-tanggle-gold" />
                </div>
                <div className="flex justify-between items-center bg-tanggle-coral/30 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="text-yellow-600" />
                    <span className="font-semibold text-tanggle-charcoal">카카오톡으로 알림 받기</span>
                  </div>
                  <input type="checkbox" className="w-5 h-5 accent-tanggle-gold" defaultChecked />
                </div>
                <button onClick={() => setStep(4)} className="w-full mt-8 bg-tanggle-charcoal text-white px-8 py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-black">
                  상담 신청 완료하기
                </button>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-tanggle-charcoal mb-2">상담이 성공적으로 접수되었습니다.</h2>
                <p className="text-tanggle-darkgray mb-8">입력해주신 연락처로 1시간 내에 회신드리겠습니다.</p>
                <button onClick={() => window.location.href = '/'} className="bg-tanggle-bg border border-tanggle-charcoal/20 text-tanggle-charcoal px-8 py-3 rounded-full font-bold hover:bg-white transition-colors">
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
