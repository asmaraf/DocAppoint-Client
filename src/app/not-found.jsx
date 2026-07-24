'use client';

import React from 'react';
import Link from 'next/link';
import { Stethoscope, Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="py-20 lg:py-32 flex items-center justify-center min-h-[75vh] px-4">
      <div className="glass-card w-full max-w-lg rounded-3xl p-8 sm:p-12 text-center border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
        
        <div className="w-20 h-20 rounded-3xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto shadow-xl shadow-teal-500/20">
          <Stethoscope className="w-10 h-10 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-6xl font-black gradient-text">404</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-sm mx-auto">
            The page or doctor appointment route you are searching for does not exist or has been relocated.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="gradient-btn inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm"
          >
            <Home className="w-4 h-4" />
            Return to Home Page
          </Link>
        </div>

      </div>
    </div>
  );
}
