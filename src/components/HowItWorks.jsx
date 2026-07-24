'use client';

import React from 'react';
import { Search, CalendarCheck, ShieldCheck, UserCheck } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Find Doctor Specialist',
    description: 'Browse certified doctors by medical specialty, location, experience, and consultation fees.',
    icon: Search,
    color: 'from-teal-500 to-emerald-500'
  },
  {
    step: '02',
    title: 'Select Date & Slot',
    description: 'Choose your preferred morning or evening consultation time from real-time doctor availability.',
    icon: CalendarCheck,
    color: 'from-emerald-500 to-cyan-500'
  },
  {
    step: '03',
    title: 'Book Appointment',
    description: 'Confirm patient information in seconds with zero hidden charges or upfront hassle.',
    icon: UserCheck,
    color: 'from-cyan-500 to-teal-500'
  },
  {
    step: '04',
    title: 'Get Quality Care',
    description: 'Visit the medical center or connect online for personalized treatment and prescription.',
    icon: ShieldCheck,
    color: 'from-teal-600 to-emerald-600'
  }
];

export default function HowItWorks() {
  return (
    <section className="py-16 lg:py-24 bg-white dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/80 px-3.5 py-1 rounded-full border border-teal-200 dark:border-teal-800">
            Simplified Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How DocAppoint Booking Works
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base">
            Get quality medical care in just four straightforward steps with instant confirmation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative glass-card rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800/70 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-extrabold text-slate-300 dark:text-slate-800 font-mono">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
