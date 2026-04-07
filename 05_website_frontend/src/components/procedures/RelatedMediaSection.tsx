import React from "react";

export default function RelatedMediaSection({ videoId }: { videoId?: string }) {
  if (!videoId) return null;

  return (
    <div className="bg-neutral-900 rounded-lg overflow-hidden shadow-2xl relative mt-12">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none z-10" />
      
      <div className="p-8 pb-0 relative z-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-white mb-4">
          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
          </svg>
          오창현 원장 직강
        </div>
        <h3 className="text-2xl font-light text-white mb-6">
          해당 시술에 대한 원장님의 <strong className="font-bold">심층 가이드 영상</strong> 시청하기
        </h3>
      </div>

      <div className="relative pt-[56.25%] w-full bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full border-0 z-20"
        />
      </div>
      
      <div className="p-6 bg-neutral-950 text-neutral-400 text-sm flex items-center justify-between z-20 relative">
        <p>영상 재생 시 소리가 발생할 수 있습니다.</p>
        <button className="text-white hover:text-primary-400 transition-colors">
          탱글성형외과 공식 채널 구경하기 &rarr;
        </button>
      </div>
    </div>
  );
}
