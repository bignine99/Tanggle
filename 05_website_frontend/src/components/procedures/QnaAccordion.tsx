"use client";

import React, { useState } from "react";
import { QnAPair } from "@/lib/dataFetcher";

export default function QnaAccordion({ qnaList }: { qnaList: QnAPair[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  if (!qnaList || qnaList.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-neutral-100 p-8 shadow-sm">
      <h3 className="text-2xl font-bold text-neutral-900 mb-8 border-b border-neutral-100 pb-4">
        이수현 원장이 답하는 <span className="text-primary-500">핵심 Q&A</span>
      </h3>
      
      <div className="space-y-4">
        {qnaList.map((qna, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx} 
              className={`border-b border-neutral-100 last:border-0 pb-4 transition-all duration-300 ${isOpen ? 'bg-neutral-50 p-4 rounded-md border-transparent' : ''}`}
            >
              <button
                className="w-full flex items-center justify-between text-left focus:outline-none group"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
              >
                <span className="text-lg font-semibold text-neutral-800 group-hover:text-primary-500 transition-colors flex gap-3">
                  <span className="text-primary-500">Q.</span>
                  {qna.question}
                </span>
                <span className={`w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-primary-50 text-primary-500' : ''}`}>
                  ↓
                </span>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="pl-7 text-neutral-600 leading-relaxed break-keep">
                  <span className="font-bold text-neutral-800 mr-2">A.</span>
                  {qna.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

