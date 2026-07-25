'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Star, MapPin, Clock, Hospital, ChevronRight, Award } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function DoctorCard({ doctor }) {
  const router = useRouter();
  const { user } = useAuth();

  const docId = doctor.customId || doctor._id;

  const handleViewDetails = () => {
    if (user) {
      router.push(`/doctors/${docId}`);
    } else {
      router.push(`/login?returnUrl=/doctors/${docId}`);
    }
  };

  const fallbackImg = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=0d9488&color=fff&size=400`;

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:shadow-teal-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden">

      {/* ── Doctor Image ── */}
      <div className="relative w-full h-56 bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImg;
          }}
        />
        {/* Specialty badge */}
        <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-bold text-teal-700 dark:text-teal-300 shadow">
          {doctor.specialty}
        </div>
        {/* Rating badge */}
        <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 shadow">
          <Star className="w-3.5 h-3.5 fill-current" />
          {doctor.rating || 4.8}
        </div>
      </div>

      {/* ── Card Body ── */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
          {doctor.name}
        </h3>

        <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4 flex-1">
          <div className="flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">{doctor.experience} Experience</span>
          </div>
          <div className="flex items-center gap-2">
            <Hospital className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{doctor.hospital}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
            <span className="truncate">{doctor.location}</span>
          </div>
          {doctor.availability?.[0] && (
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Available: {doctor.availability[0]}</span>
            </div>
          )}
        </div>

        {/* ── Footer: Fee + CTA ── */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Consultation Fee
            </span>
            <span className="text-xl font-extrabold text-teal-600 dark:text-teal-400">
              ৳{doctor.fee}
            </span>
          </div>
          <button
            onClick={handleViewDetails}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-500/30 transition-colors active:scale-95"
          >
            View Details
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
