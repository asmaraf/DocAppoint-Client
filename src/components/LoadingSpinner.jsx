'use client';

import React from 'react';
import { HeartPulse } from 'lucide-react';

export default function LoadingSpinner({ text = 'Loading details...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[300px]">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-teal-200 dark:border-teal-900 border-t-teal-600 dark:border-t-teal-400 animate-spin"></div>
        <HeartPulse className="w-8 h-8 text-teal-600 dark:text-teal-400 absolute animate-pulse" />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-400 tracking-wide animate-pulse">
        {text}
      </p>
    </div>
  );
}
