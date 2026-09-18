'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Star, MapPin, Clock, Hospital, ChevronRight, Award, ShieldCheck } from 'lucide-react';
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

  const fallbackImg = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name || 'Doctor')}&background=0d9488&color=fff&size=400`;

  return (
    <article className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800/90 hover:border-teal-500/40 dark:hover:border-teal-500/40 shadow-sm hover:shadow-2xl hover:shadow-teal-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden focus-within:ring-2 focus-within:ring-teal-500">
      
      {/* ── Doctor Image Container ── */}
      <div className="relative w-full h-56 bg-slate-100 dark:bg-slate-800/80 overflow-hidden">
        <img
          src={doctor.image}
          alt={`Profile portrait of Dr. ${doctor.name}, ${doctor.specialty} specialist`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImg;
          }}
        />

        {/* Gradient overlay for better badge readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

        {/* Specialty badge */}
        <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold text-teal-700 dark:text-teal-300 shadow-md border border-teal-500/20 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
          {doctor.specialty}
        </div>

        {/* Rating badge */}
        <div 
          className="absolute top-3 right-3 bg-amber-400 text-slate-950 px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-md"
          aria-label={`Rated ${doctor.rating || 4.8} out of 5 stars`}
        >
          <Star className="w-3.5 h-3.5 fill-slate-950 stroke-none" />
          <span>{doctor.rating || 4.8}</span>
        </div>

        {/* Verified Badge */}
        <div className="absolute bottom-3 left-3 bg-slate-900/80 dark:bg-slate-950/80 text-teal-300 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-teal-400" />
          Verified Specialist
        </div>
      </div>

      {/* ── Card Body ── */}
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <div className="mb-3">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-snug line-clamp-1">
            {doctor.name}
          </h3>
          <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-0.5">
            {doctor.specialty} Consultant
          </p>
        </div>

        {/* Clinical Info List */}
        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 mb-5 flex-1">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {doctor.experience} Experience
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Hospital className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="truncate text-slate-700 dark:text-slate-300" title={doctor.hospital}>
              {doctor.hospital}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <span className="truncate text-slate-700 dark:text-slate-300" title={doctor.location}>
              {doctor.location}
            </span>
          </div>
          {doctor.availability?.[0] && (
            <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                Next Slot: {doctor.availability[0]}
              </span>
            </div>
          )}
        </div>

        {/* ── Footer: Fee + CTA ── */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/90 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Consultation Fee
            </span>
            <span className="text-xl font-black text-teal-600 dark:text-teal-400 tracking-tight">
              ৳{doctor.fee}
            </span>
          </div>

          <button
            onClick={handleViewDetails}
            aria-label={`View doctor profile and book consultation with Dr. ${doctor.name}`}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white shadow-md shadow-teal-500/20 hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            <span>Book Visit</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </article>
  );
}
