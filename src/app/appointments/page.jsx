'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DoctorCard from '@/components/DoctorCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import { Search, ArrowUpDown, Filter, Stethoscope, X, Sparkles, Check, Heart, Activity, Baby, Bone, Smile } from 'lucide-react';

const SPECIALTY_CHIPS = [
  { label: 'All Specialties', value: '', searchKey: '' },
  { label: 'Cardiology', value: 'Cardiology', searchKey: 'Cardio', icon: Heart },
  { label: 'Neurology', value: 'Neurology', searchKey: 'Neuro', icon: Activity },
  { label: 'Pediatrics', value: 'Pediatrics', searchKey: 'Pediatr', icon: Baby },
  { label: 'Orthopedics', value: 'Orthopedics', searchKey: 'Orthoped', icon: Bone },
  { label: 'Dermatology', value: 'Dermatology', searchKey: 'Dermatol', icon: Sparkles },
  { label: 'Dentistry', value: 'Dentistry', searchKey: 'Dent', icon: Smile },
];

function AppointmentsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedSpecialty, setSelectedSpecialty] = useState(() => {
    if (!initialSearch) return '';
    const match = SPECIALTY_CHIPS.find(c => c.value.toLowerCase() === initialSearch.toLowerCase());
    return match ? match.value : '';
  });
  const [sortBy, setSortBy] = useState('');
  const { API_BASE } = useAuth();

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        let query = searchTerm.trim();
        if (selectedSpecialty && !searchTerm) {
          const chip = SPECIALTY_CHIPS.find(c => c.value === selectedSpecialty);
          query = chip && chip.searchKey ? chip.searchKey : selectedSpecialty;
        }

        let url = `${API_BASE}/api/doctors?`;
        if (query) url += `search=${encodeURIComponent(query)}&`;
        if (sortBy) url += `sortBy=${sortBy}&`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.success && data.doctors) {
          setDoctors(data.doctors);
        } else {
          setDoctors([]);
        }
      } catch (err) {
        console.warn('Error fetching doctors list:', err);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchDoctors, 200);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedSpecialty, sortBy, API_BASE]);

  const handleSpecialtyClick = (specialty) => {
    if (selectedSpecialty === specialty) {
      setSelectedSpecialty('');
      setSearchTerm('');
    } else {
      setSelectedSpecialty(specialty);
      setSearchTerm('');
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedSpecialty('');
    setSortBy('');
  };

  return (
    <main className="py-8 sm:py-12 lg:py-16 min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* ── Page Banner Header ── */}
        <section 
          aria-labelledby="page-title"
          className="glass-card rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-cyan-500/10 shadow-sm relative overflow-hidden"
        >
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-3 relative z-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 text-xs font-extrabold uppercase tracking-wider border border-teal-200 dark:border-teal-800/60 shadow-xs">
              <Stethoscope className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Verified Doctor Directory
            </span>

            <h1 id="page-title" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              All Available Doctor Consultations
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              Find certified doctors across all medical departments, review schedules, consultation fees, and reserve your appointment online instantly.
            </p>
          </div>

          {/* ── Search & Sort Controls Bar ── */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-4 relative z-10">
            
            {/* Search Input with Clear Button */}
            <div className="md:col-span-8 relative">
              <label htmlFor="doctor-search" className="sr-only">
                Search by Doctor Name, Specialty, or Hospital
              </label>
              <input
                id="doctor-search"
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (selectedSpecialty) setSelectedSpecialty('');
                }}
                placeholder="Search by doctor name, specialty, or hospital chamber..."
                className="w-full pl-12 pr-11 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 font-medium text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none shadow-sm transition-all"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4 pointer-events-none" />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search input"
                  className="absolute right-3.5 top-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-4 relative">
              <label htmlFor="sort-dropdown" className="sr-only">
                Sort doctors
              </label>
              <select
                id="sort-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-11 pr-9 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none shadow-sm cursor-pointer appearance-none transition-all"
              >
                <option value="">Sort By: Default Recommendation</option>
                <option value="fee_asc">Consultation Fee: Low to High</option>
                <option value="fee_desc">Consultation Fee: High to Low</option>
                <option value="exp_desc">Highest Patient Rating</option>
              </select>
              <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-4 top-4 pointer-events-none" />
              <div className="absolute right-4 top-4 pointer-events-none border-l border-slate-200 dark:border-slate-700 pl-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">Sort</span>
              </div>
            </div>

          </div>

          {/* ── Quick Specialty Filter Pills ── */}
          <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-slate-800/60">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              Quick Specialty Filter:
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {SPECIALTY_CHIPS.map((chip) => {
                const isSelected = selectedSpecialty === chip.value && (!searchTerm || chip.value === '');
                const Icon = chip.icon;
                return (
                  <button
                    key={chip.label}
                    onClick={() => handleSpecialtyClick(chip.value)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 ${
                      isSelected
                        ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
                        : 'bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 hover:bg-teal-50/50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {Icon && <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-teal-600 dark:text-teal-400'}`} />}
                    {chip.label}
                    {isSelected && chip.value !== '' && <Check className="w-3 h-3 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

        </section>

        {/* ── Status & Results Counter Bar ── */}
        <div className="flex items-center justify-between flex-wrap gap-3 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {loading ? (
                'Loading doctor listings...'
              ) : (
                <span>
                  Showing <span className="text-teal-600 dark:text-teal-400 font-extrabold">{doctors.length}</span> Verified Specialists
                </span>
              )}
            </p>
          </div>

          {(searchTerm || selectedSpecialty || sortBy) && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Clear All Active Filters
            </button>
          )}
        </div>

        {/* ── Doctor Cards Grid ── */}
        {loading ? (
          <div className="py-12">
            <LoadingSpinner text="Searching verified medical specialists..." />
          </div>
        ) : doctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.customId || doctor._id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-20 glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto shadow-inner">
              <Filter className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              No Matching Doctors Found
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              We couldn't find any specialist doctor matching your criteria. Try searching with general terms or reset your filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="gradient-btn px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </main>
  );
}

export default function AppointmentsPage() {
  return (
    <Suspense fallback={<div className="py-24"><LoadingSpinner text="Loading appointment directory..." /></div>}>
      <AppointmentsContent />
    </Suspense>
  );
}
