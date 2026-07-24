'use client';

import React, { useState, useEffect } from 'react';
import DoctorCard from '@/components/DoctorCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import { Search, ArrowUpDown, Filter, Stethoscope } from 'lucide-react';

export default function AppointmentsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const { API_BASE } = useAuth();

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        let url = `${API_BASE}/api/doctors?`;
        if (searchTerm) url += `search=${encodeURIComponent(searchTerm)}&`;
        if (sortBy) url += `sortBy=${sortBy}&`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.success && data.doctors) {
          setDoctors(data.doctors);
        }
      } catch (err) {
        console.warn('Error fetching doctors list:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchDoctors, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, sortBy, API_BASE]);

  return (
    <div className="py-10 lg:py-16 min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Banner Header */}
        <div className="glass-card rounded-3xl p-8 sm:p-12 mb-10 border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-transparent">
          <div className="max-w-3xl space-y-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider">
              <Stethoscope className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Verified Doctor Directory
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              All Available Doctor Appointments
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-base">
              Find certified doctors across all medical specialties, check consultation schedules, and book your appointment online.
            </p>
          </div>

          {/* Search & Sort Controls Bar */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Doctor Name, Specialty, or Hospital..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-500 outline-none shadow-sm transition-all"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
            </div>

            {/* Sort Select Dropdown */}
            <div className="md:col-span-4 relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-11 pr-8 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-500 outline-none shadow-sm cursor-pointer appearance-none"
              >
                <option value="">Sort By: Default Rating</option>
                <option value="fee_asc">Fee: Low to High</option>
                <option value="fee_desc">Fee: High to Low</option>
                <option value="exp_desc">Highest Rating</option>
              </select>
              <ArrowUpDown className="w-5 h-5 text-slate-400 absolute left-4 top-4 pointer-events-none" />
            </div>

          </div>
        </div>

        {/* Doctor Cards Grid */}
        {loading ? (
          <LoadingSpinner text="Searching available doctor appointments..." />
        ) : doctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.customId || doctor._id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
            <Filter className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">No Matching Doctors Found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              We couldn't find any doctor matching "{searchTerm}". Try clearing your search term or select a different specialty.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSortBy('');
              }}
              className="mt-4 px-5 py-2.5 rounded-xl bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
