import React from 'react';

export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded border border-gray-200/80 shadow-xs p-2.5 flex flex-col relative overflow-visible animate-pulse select-none">
      
      {/* Product Image Stage Placeholder */}
      <div className="relative w-full aspect-[4/5] bg-slate-100 rounded mb-2.5 border border-gray-100/60 shadow-2xs flex items-center justify-center">
        {/* Central decorative icon placeholder */}
        <div className="w-10 h-10 rounded-full bg-slate-200/50 flex items-center justify-center">
          <div className="w-5 h-5 bg-slate-200 rounded"></div>
        </div>
        {/* Absolute badges placeholders */}
        <div className="absolute top-1.5 left-1.5 w-9 h-9 bg-slate-200/60 rounded-full"></div>
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-1 space-y-2">
        
        {/* Title slots (2-line matching line-clamp-2 h-9) */}
        <div className="space-y-1.5">
          <div className="h-3.5 bg-slate-200/80 rounded-sm w-11/12"></div>
          <div className="h-3.5 bg-slate-200/80 rounded-sm w-8/12"></div>
        </div>
        
        {/* Author/Brand slot */}
        <div className="h-3 bg-slate-100/90 rounded-sm w-5/12 mt-1"></div>

        {/* Ratings Star Widget slot */}
        <div className="flex items-center space-x-1.5 mt-1.5">
          <div className="flex items-center space-x-0.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-slate-200 rounded-full"></div>
            ))}
          </div>
          <div className="w-7 h-3 bg-slate-100 rounded-sm"></div>
        </div>

        {/* Stock status slot */}
        <div className="w-24 h-4 bg-slate-100 rounded-sm mt-1.5"></div>

        {/* Price Tags layout matches real cards */}
        <div className="flex items-baseline space-x-2 mt-2.5 pt-2 border-t border-gray-100/60">
          <div className="h-4.5 bg-slate-200 rounded-sm w-5/12"></div>
          <div className="h-3.5 bg-slate-150 rounded-sm w-3/12"></div>
        </div>

      </div>
    </div>
  );
}
