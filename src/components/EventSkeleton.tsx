import React from 'react';

export default function EventSkeleton() {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-48 bg-slate-200 dark:bg-slate-800" />

      {/* Content Skeleton */}
      <div className="flex flex-col flex-grow p-5 justify-between space-y-4">
        <div className="space-y-3">
          {/* Badge & Title */}
          <div className="w-1/3 h-5 bg-slate-200 dark:bg-slate-800 rounded-full" />
          <div className="w-full h-6 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="w-3/4 h-6 bg-slate-200 dark:bg-slate-800 rounded-lg" />

          {/* Details */}
          <div className="w-2/3 h-4 bg-slate-200 dark:bg-slate-800 rounded-md mt-2" />
          <div className="w-1/2 h-4 bg-slate-200 dark:bg-slate-800 rounded-md" />
        </div>

        {/* Button Skeleton */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="w-full h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
