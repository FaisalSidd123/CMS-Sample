import React from 'react';

export function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border border-neutral-100 bg-white p-5 animate-pulse flex flex-col justify-between h-[380px]">
          <div>
            <div className="aspect-16/9 bg-neutral-200 rounded-sm mb-5 w-full" />
            <div className="h-4 bg-neutral-200 w-2/3 rounded-xs mb-2" />
            <div className="h-3 bg-neutral-200 w-1/3 rounded-xs mb-4" />
            <div className="w-full h-[1px] bg-neutral-100 my-4" />
            <div className="grid grid-cols-3 gap-2">
              <div className="h-3 bg-neutral-200 rounded-xs" />
              <div className="h-3 bg-neutral-200 rounded-xs" />
              <div className="h-3 bg-neutral-200 rounded-xs" />
            </div>
          </div>
          <div className="h-4 bg-neutral-200 w-1/3 rounded-xs mt-6" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 4, cols = 4 }) {
  return (
    <div className="w-full bg-white border border-neutral-100 p-6 animate-pulse">
      <div className="space-y-4">
        <div className="h-6 bg-neutral-200 rounded-xs w-full mb-6" />
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-4 items-center">
            {Array.from({ length: cols }).map((_, c) => (
              <div key={c} className="h-4 bg-neutral-100 rounded-xs flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="w-full animate-pulse grid grid-cols-1 lg:grid-cols-5 gap-12 p-6 bg-white border border-neutral-100">
      <div className="lg:col-span-3">
        <div className="aspect-16/10 bg-neutral-200 rounded-sm mb-6 w-full" />
        <div className="flex gap-3">
          <div className="w-20 h-12 bg-neutral-100" />
          <div className="w-20 h-12 bg-neutral-100" />
          <div className="w-20 h-12 bg-neutral-100" />
        </div>
      </div>
      <div className="lg:col-span-2 space-y-6 text-left">
        <div className="h-3 bg-neutral-200 w-1/4 rounded-xs" />
        <div className="h-8 bg-neutral-200 w-3/4 rounded-xs" />
        <div className="h-4 bg-neutral-100 w-1/2 rounded-xs" />
        <div className="w-full h-[1px] bg-neutral-100" />
        <div className="space-y-3">
          <div className="h-3 bg-neutral-100 w-full" />
          <div className="h-3 bg-neutral-100 w-full" />
          <div className="h-3 bg-neutral-100 w-4/5" />
        </div>
        <div className="h-12 bg-neutral-200 w-2/3 mt-8" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="w-full space-y-8 animate-pulse text-left">
      {/* 4 Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-neutral-100 p-5 h-24 flex flex-col justify-between">
            <div className="h-3 bg-neutral-200 w-1/2 rounded-xs" />
            <div className="h-6 bg-neutral-200 w-1/3 rounded-xs" />
          </div>
        ))}
      </div>

      {/* Main flow and profile summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-neutral-100 p-6 h-80 flex flex-col justify-between">
          <div className="h-4 bg-neutral-200 w-1/4 rounded-xs" />
          <div className="h-20 bg-neutral-100 w-full rounded-xs" />
          <div className="h-4 bg-neutral-200 w-1/3 rounded-xs" />
        </div>
        <div className="bg-white border border-neutral-100 p-6 h-80 flex flex-col justify-between">
          <div className="h-4 bg-neutral-200 w-1/3 rounded-xs" />
          <div className="w-16 h-16 rounded-full bg-neutral-200 self-center" />
          <div className="h-4 bg-neutral-100 w-2/3 self-center rounded-xs" />
          <div className="h-8 bg-neutral-200 w-full rounded-xs mt-4" />
        </div>
      </div>
    </div>
  );
}
