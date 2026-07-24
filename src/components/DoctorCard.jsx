'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Star, MapPin, Clock, Building2, ChevronRight, Award } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function DoctorCard({ doctor }) {
  const router = useRouter();
  const { user } = useAuth();

  const handleViewDetails = () => {
    const docId = doctor.customId || doctor._id;
    if (user) {
      router.push(`/doctors/${docId}`);
    } else {
      router.push(`/login?returnUrl=/doctors/${docId}`);
    }
  };

  return (
    <div className="group glass-card rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800/80 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300 flex flex-col justify-between h-full">
      <div>
        {/* Doctor Image & Badge */}
        <div className="relative w-full h-56 rounded-2xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-900">
          <Image
            src={doctor.image || 'https://images.unsplash.com/photo-1594824813566-88855ce78c9c?auto=format&fit=crop&q=80&w=600'}
            alt={doctor.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
          <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-teal-700 dark:text-teal-300 shadow-md">
            {doctor.specialty}
          </div>
          <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 shadow-md">
            <Star className="w-3.5 h-3.5 fill-current" />
            {doctor.rating || 4.8}
          </div>
        </div>

        {/* Doctor Name & Details */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            {doctor.name}
          </h3>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-semibold bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-md">
              <Award className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              {doctor.experience} Exp
            </span>
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              {doctor.hospital}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
            <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
            <span className="truncate">{doctor.location}</span>
          </div>

          {doctor.availability && doctor.availability.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Available: {doctor.availability[0]}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Fee & View Details CTA */}
      <div className="pt-5 mt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Consultation Fee
          </span>
          <span className="text-lg font-extrabold text-teal-600 dark:text-teal-400">
            ৳{doctor.fee}
          </span>
        </div>

        <button
          onClick={handleViewDetails}
          className="gradient-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1"
        >
          View Details
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
