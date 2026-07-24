'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Activity, Baby, Bone, Sparkles, Smile, ArrowRight } from 'lucide-react';

const specialties = [
  {
    name: 'Cardiology',
    count: '12 Doctors Available',
    description: 'Heart health, pulse screening, ECG & cardiac care.',
    icon: Heart,
    color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/50'
  },
  {
    name: 'Neurology',
    count: '9 Doctors Available',
    description: 'Brain wellness, migraine management & nerve care.',
    icon: Activity,
    color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/50'
  },
  {
    name: 'Pediatrics',
    count: '15 Doctors Available',
    description: 'Child healthcare, vaccinations & growth wellness.',
    icon: Baby,
    color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/50'
  },
  {
    name: 'Orthopedics',
    count: '8 Doctors Available',
    description: 'Joint replacement, bone fractures & spine rehabilitation.',
    icon: Bone,
    color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50'
  },
  {
    name: 'Dermatology',
    count: '10 Doctors Available',
    description: 'Skin restoration, acne solutions & laser care.',
    icon: Sparkles,
    color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50'
  },
  {
    name: 'Dentistry',
    count: '14 Doctors Available',
    description: 'Cosmetic alignment, root canal & dental implants.',
    icon: Smile,
    color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/50'
  }
];

export default function MedicalSpecialties() {
  return (
    <section className="py-16 lg:py-24 bg-slate-50/70 dark:bg-slate-950/70 border-t border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-950/80 px-3.5 py-1 rounded-full border border-teal-200 dark:border-teal-800">
              Department Explorer
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3">
              Browse by Medical Specialties
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base mt-2 max-w-xl">
              Quickly find experienced specialists in all major clinical departments.
            </p>
          </div>

          <Link
            href="/appointments"
            className="flex items-center gap-2 text-sm font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors group shrink-0"
          >
            Search by Specialty
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialties.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={`/appointments?search=${item.name}`}
                className="group glass-card rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800/70 hover:shadow-xl hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-1 mb-2">
                    {item.count}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                  <span>View Doctors</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
