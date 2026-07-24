'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DoctorCard from './DoctorCard';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function TopRatedDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { API_BASE } = useAuth();

  useEffect(() => {
    const fetchTopDoctors = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/doctors?limit=3&sortBy=exp_desc`);
        const data = await res.json();
        if (data.success && data.doctors) {
          setDoctors(data.doctors);
        }
      } catch (err) {
        console.warn('Failed to fetch top doctors from server:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopDoctors();
  }, [API_BASE]);

  return (
    <section id="top-doctors" className="py-16 lg:py-24 bg-slate-50/50 dark:bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Verified Specialists
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Top Rated Medical Doctors
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base mt-2 max-w-xl">
              Meet our highest-rated medical specialists recommended by hundreds of verified patients.
            </p>
          </div>

          <Link
            href="/appointments"
            className="flex items-center gap-2 text-sm font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors group shrink-0"
          >
            Explore All 50+ Appointments
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Content / Cards */}
        {loading ? (
          <LoadingSpinner text="Fetching top-rated doctors..." />
        ) : doctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.customId || doctor._id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500 py-10">No doctors available at the moment.</p>
        )}

      </div>
    </section>
  );
}
