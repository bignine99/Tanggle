import React from 'react';

export default function ProceduresLoading() {
  return (
    <div className="space-y-12 pb-24 animate-pulse">
      {/* Skeleton Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col items-center">
        <div className="h-10 w-64 bg-neutral-200 rounded-lg mb-6" />
        <div className="h-6 w-full max-w-lg bg-neutral-100 rounded-md mb-2" />
        <div className="h-6 w-3/4 max-w-md bg-neutral-100 rounded-md" />
      </div>

      {/* Skeleton Sticky Context Navigation */}
      <div className="sticky top-[72px] z-40 py-4 -mx-4 px-4 bg-[#FDFBF9]/80 border-b border-neutral-200/50 mb-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="h-4 w-32 bg-neutral-200 rounded-md" />
          <div className="flex gap-4">
            <div className="h-4 w-24 bg-neutral-200 rounded-md" />
            <div className="h-4 w-24 bg-neutral-200 rounded-md" />
          </div>
        </div>
      </div>

      {/* Skeleton Grid with Soft Elevation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4 lg:px-0 max-w-7xl mx-auto">
        {[...Array(8)].map((_, idx) => (
          <div 
            key={idx} 
            className="group relative bg-white border border-neutral-100 rounded-[2rem] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col h-[320px]"
          >
            {/* Background Layer Skeleton */}
            <div className="absolute inset-0 z-0 bg-neutral-50" />
            
            {/* Content Skeleton */}
            <div className="relative z-10 mt-auto p-8 flex flex-col">
              <div className="h-8 w-32 bg-neutral-200 rounded-md mb-6" />
              <div className="flex items-center justify-between mt-6">
                <div className="h-4 w-20 bg-neutral-200 rounded-md" />
                <div className="w-10 h-10 rounded-full bg-neutral-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
