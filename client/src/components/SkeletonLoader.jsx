import React from 'react';

export const SummaryCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-4 w-24 bg-slate-200 rounded"></div>
      <div className="h-9 w-9 bg-slate-200 rounded-xl"></div>
    </div>
    <div className="h-8 w-36 bg-slate-200 rounded mb-3"></div>
    <div className="h-4 w-28 bg-slate-100 rounded"></div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse">
    <div className="flex items-center justify-between mb-6">
      <div className="h-5 w-36 bg-slate-200 rounded"></div>
      <div className="h-8 w-24 bg-slate-100 rounded"></div>
    </div>
    <div className="h-64 w-full bg-slate-100 rounded-xl flex items-end p-4 gap-3">
      {[40, 70, 30, 85, 60, 45, 90, 65].map((h, i) => (
        <div
          key={i}
          className="flex-1 bg-slate-200 rounded-t"
          style={{ height: `${h}%` }}
        ></div>
      ))}
    </div>
  </div>
);

export const TableSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse">
    <div className="flex justify-between items-center mb-6">
      <div className="h-5 w-40 bg-slate-200 rounded"></div>
      <div className="h-9 w-32 bg-slate-100 rounded"></div>
    </div>
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
            <div className="space-y-1.5">
              <div className="h-4 w-32 bg-slate-200 rounded"></div>
              <div className="h-3 w-20 bg-slate-100 rounded"></div>
            </div>
          </div>
          <div className="h-5 w-24 bg-slate-200 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);
