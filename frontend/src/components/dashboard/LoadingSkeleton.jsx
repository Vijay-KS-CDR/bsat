import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="animate-pulse space-y-8">
      {/* Top Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 h-32 flex flex-col justify-between">
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="h-4 w-20 bg-slate-200 rounded-md"></div>
                <div className="h-8 w-16 bg-slate-300 rounded-md"></div>
              </div>
              <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-[#E2E8F0]">
          <div className="h-10 w-64 bg-slate-200 rounded-[16px]"></div>
          <div className="flex gap-3">
            <div className="h-10 w-32 bg-slate-200 rounded-[16px]"></div>
            <div className="h-10 w-32 bg-slate-200 rounded-[16px]"></div>
          </div>
        </div>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100">
            <div className="h-5 w-24 bg-slate-200 rounded"></div>
            <div className="h-5 w-40 bg-slate-200 rounded"></div>
            <div className="h-5 w-16 bg-slate-200 rounded"></div>
            <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
            <div className="h-8 w-24 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
