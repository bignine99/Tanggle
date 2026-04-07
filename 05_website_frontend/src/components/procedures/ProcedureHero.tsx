import React from "react";
import { ProcedureData } from "@/lib/dataFetcher";

export default function ProcedureHero({ data }: { data: ProcedureData }) {
  return (
    <div className="relative overflow-hidden bg-white rounded-lg border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-12">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        {/* Decorative graphic element (abstract) */}
        <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#262626" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.5,-45.8C87.2,-32.5,89.5,-16.2,88.2,-0.7C86.8,14.7,81.8,29.5,73.1,41.9C64.4,54.3,51.8,64.4,37.8,71.4C23.7,78.5,8.1,82.5,-6.3,81.1C-20.7,79.7,-34.1,72.9,-46.8,64.4C-59.5,55.9,-71.6,45.8,-79.8,32.4C-88,18.9,-92.3,2.2,-89.7,-13.6C-87,-29.4,-77.4,-44.2,-64.4,-54.5C-51.4,-64.9,-35.1,-70.6,-20.3,-74.6C-5.5,-78.5,7.9,-80.7,21.5,-80.2C35.1,-79.7,48.9,-76.4,44.7,-76.4Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="relative p-8 lg:p-12 z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-semibold tracking-wider uppercase">
              {data.category}
            </span>
            {data.target_audience && (
              <span className="text-sm text-neutral-500 font-medium">대상: {data.target_audience}</span>
            )}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-neutral-900 leading-tight">
            {data.title}
          </h1>
          
          <p className="text-lg text-neutral-600 leading-relaxed max-w-3xl">
            {data.summary}
          </p>
        </div>

        {/* Surgery Info Highlights (If exists) */}
        {data.surgery_info && (
          <div className="w-full md:w-auto shrink-0 bg-neutral-50 rounded-lg p-6 border border-neutral-100 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-neutral-900 border-b border-neutral-200 pb-2">시술 기본 정보</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {data.surgery_info.time && (
                <div>
                  <dt className="text-xs text-neutral-500 mb-1">수술 시간</dt>
                  <dd className="text-sm font-semibold text-neutral-800">{data.surgery_info.time}</dd>
                </div>
              )}
              {data.surgery_info.recovery && (
                <div>
                  <dt className="text-xs text-neutral-500 mb-1">회복 기간</dt>
                  <dd className="text-sm font-semibold text-neutral-800">{data.surgery_info.recovery}</dd>
                </div>
              )}
              {data.surgery_info.anesthesia && (
                <div>
                  <dt className="text-xs text-neutral-500 mb-1">마취 방법</dt>
                  <dd className="text-sm font-semibold text-neutral-800">{data.surgery_info.anesthesia}</dd>
                </div>
              )}
              {data.surgery_info.hospitalization && (
                <div>
                  <dt className="text-xs text-neutral-500 mb-1">입원 여부</dt>
                  <dd className="text-sm font-semibold text-neutral-800">{data.surgery_info.hospitalization}</dd>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
