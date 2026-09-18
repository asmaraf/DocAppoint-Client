'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, User, Edit3, Trash2, Clock, Phone, Stethoscope, Mail, ShieldCheck, 
  Plus, CheckCircle, RefreshCw, Printer, AlertCircle, CalendarCheck, MapPin, 
  Activity, ArrowRight, HeartPulse
} from 'lucide-react';
import UpdateBookingModal from '@/components/UpdateBookingModal';
import UpdateProfileModal from '@/components/UpdateProfileModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import ConfirmModal from '@/components/ConfirmModal';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, API_BASE, token } = useAuth();

  const [activeTab, setActiveTab] = useState('bookings');
  const [appointmentFilter, setAppointmentFilter] = useState('all'); // 'all' | 'upcoming' | 'past'
  const [appointments, setAppointments] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Modals state
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isUpdateBookingOpen, setIsUpdateBookingOpen] = useState(false);
  const [isUpdateProfileOpen, setIsUpdateProfileOpen] = useState(false);

  // Confirm cancel modal state
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Auth Guard check
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?returnUrl=/dashboard');
    }
  }, [user, authLoading, router]);

  // Fetch My Bookings
  const fetchMyBookings = async () => {
    if (!user) return;
    setLoadingBookings(true);
    try {
      const res = await fetch(`${API_BASE}/api/appointments?email=${encodeURIComponent(user.email)}`, {
        headers: { Authorization: `Bearer ${token || localStorage.getItem('docappoint_token')}` }
      });
      const data = await res.json();
      if (data.success && data.appointments) {
        setAppointments(data.appointments);
      }
    } catch (err) {
      console.warn('Failed to fetch user appointments:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyBookings();
    } else {
      setLoadingBookings(false);
    }
  }, [user, API_BASE, token]);

  const handleEditClick = (booking) => {
    setSelectedBooking(booking);
    setIsUpdateBookingOpen(true);
  };

  const handleUpdateBookingSuccess = (updatedBooking) => {
    setAppointments((prev) =>
      prev.map((app) => (app._id === updatedBooking._id ? updatedBooking : app))
    );
  };

  // Opens the confirm cancel modal
  const handleCancelBooking = (bookingId) => {
    setConfirmDeleteId(bookingId);
  };

  // Confirmed cancellation
  const handleDeleteConfirmed = async () => {
    if (!confirmDeleteId) return;
    try {
      const res = await fetch(`${API_BASE}/api/appointments/${confirmDeleteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token || localStorage.getItem('docappoint_token')}` }
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to cancel appointment');
      }

      toast.success('Appointment cancelled successfully.');
      setAppointments((prev) => prev.filter((app) => app._id !== confirmDeleteId));
    } catch (err) {
      toast.error(err.message || 'Cancellation failed');
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handlePrintSlip = (booking) => {
    window.print();
  };

  // Metrics calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingCount = useMemo(() => {
    return appointments.filter(app => (app.appointmentDate || '') >= todayStr).length;
  }, [appointments, todayStr]);

  const pastCount = appointments.length - upcomingCount;

  // Filtered appointments list
  const filteredAppointments = useMemo(() => {
    if (appointmentFilter === 'upcoming') {
      return appointments.filter(app => (app.appointmentDate || '') >= todayStr);
    }
    if (appointmentFilter === 'past') {
      return appointments.filter(app => (app.appointmentDate || '') < todayStr);
    }
    return appointments;
  }, [appointments, appointmentFilter, todayStr]);

  if (authLoading) {
    return (
      <div className="py-24">
        <LoadingSpinner text="Checking authentication credentials..." />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="py-8 sm:py-12 lg:py-16 min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* ── Dashboard Header Profile Banner ── */}
        <section 
          aria-labelledby="dashboard-heading"
          className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm"
        >
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-teal-500 shadow-md bg-teal-100 shrink-0">
              <img
                src={user.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                alt={user.name || 'User profile'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=0d9488&color=fff`;
                }}
              />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 id="dashboard-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Welcome, {user.name}
                </h1>
                <span className="px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 text-[11px] font-extrabold uppercase tracking-wider border border-teal-200 dark:border-teal-800">
                  Patient Portal
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                {user.email}
              </p>
            </div>
          </div>

          {/* Nav Tabs Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'bookings'
                  ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-teal-600'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Consultations ({appointments.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-teal-600'
              }`}
            >
              <User className="w-4 h-4" />
              <span>My Profile</span>
            </button>
          </div>
        </section>

        {/* ── Key Patient Metric Summary Cards ── */}
        <section aria-label="Health statistics" className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between shadow-xs">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Consultations</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">{appointments.length}</p>
              <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">Lifetime Bookings</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Stethoscope className="w-6 h-6" />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between shadow-xs">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Upcoming Visits</p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{upcomingCount}</p>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Confirmed Schedule</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CalendarCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between shadow-xs">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Completed / Past</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-700 dark:text-slate-300 mt-1">{pastCount}</p>
              <span className="text-[11px] text-slate-500 font-semibold">Previous Consultations</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </section>

        {/* ── TAB 1: Consultations / Bookings ── */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            
            {/* Header with status filters & Book New CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  My Booked Appointments
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  View consultation details, reschedule time slots, or manage bookings
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Filter Pills */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
                  <button
                    onClick={() => setAppointmentFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      appointmentFilter === 'all'
                        ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-teal-600'
                    }`}
                  >
                    All ({appointments.length})
                  </button>
                  <button
                    onClick={() => setAppointmentFilter('upcoming')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      appointmentFilter === 'upcoming'
                        ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-teal-600'
                    }`}
                  >
                    Upcoming ({upcomingCount})
                  </button>
                  <button
                    onClick={() => setAppointmentFilter('past')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      appointmentFilter === 'past'
                        ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-teal-600'
                    }`}
                  >
                    Past ({pastCount})
                  </button>
                </div>

                <button
                  onClick={() => router.push('/appointments')}
                  className="gradient-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Book New</span>
                </button>
              </div>
            </div>

            {/* List / Cards */}
            {loadingBookings ? (
              <div className="py-12">
                <LoadingSpinner text="Fetching your booked appointments..." />
              </div>
            ) : filteredAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAppointments.map((booking) => {
                  const isUpcoming = (booking.appointmentDate || '') >= todayStr;
                  return (
                    <article
                      key={booking._id}
                      className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between hover:shadow-xl hover:border-teal-500/30 transition-all duration-300"
                    >
                      <div>
                        {/* Header: Specialty & Doctor */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/80 px-2.5 py-0.5 rounded-full border border-teal-200/60 dark:border-teal-900/60">
                              {booking.doctorSpecialty || 'Specialist'}
                            </span>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1 leading-snug">
                              {booking.doctorName}
                            </h3>
                          </div>
                          
                          <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                            isUpcoming 
                              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300' 
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isUpcoming ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                            {isUpcoming ? 'Confirmed Visit' : 'Past Visit'}
                          </span>
                        </div>

                        {/* Consultation Schedule Callout Badge */}
                        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200/50 dark:border-teal-900/40 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Scheduled Visit Date & Time</p>
                            <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                              {booking.appointmentDate} • <span className="text-teal-600 dark:text-teal-400">{booking.appointmentTime}</span>
                            </p>
                          </div>
                        </div>

                        {/* Patient & Clinic Details Grid */}
                        <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 mb-4">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Patient Name</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                              {booking.patientName} ({booking.gender})
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Contact Phone</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                              {booking.phone}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Consultation Fee</span>
                            <span className="font-bold text-teal-600 dark:text-teal-400">
                              ৳{booking.fee || 800} (Pay at Clinic)
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              Slot Reserved
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* ── Clear Action Distinction: Reschedule vs Cancel vs Slip ── */}
                      <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-2 flex-wrap">
                        
                        <button
                          onClick={() => handlePrintSlip(booking)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-1"
                          title="Print Consultation Slip"
                        >
                          <Printer className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                          <span>Print Slip</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditClick(booking)}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-xs font-bold transition-all active:scale-95 border border-amber-200/60 dark:border-amber-800/40"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Reschedule</span>
                          </button>
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-xs font-bold transition-all active:scale-95 border border-rose-200/60 dark:border-rose-800/40"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        </div>

                      </div>

                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 space-y-3">
                <Calendar className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                  {appointmentFilter === 'upcoming' 
                    ? 'No Upcoming Consultations' 
                    : appointmentFilter === 'past' 
                    ? 'No Past Consultations' 
                    : 'No Appointments Booked Yet'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  {appointmentFilter === 'all' 
                    ? "You haven't scheduled any doctor consultations yet. Browse verified specialist doctors and book your visit online in seconds."
                    : `No ${appointmentFilter} appointments found in your account history.`}
                </p>
                <button
                  onClick={() => router.push('/appointments')}
                  className="gradient-btn px-6 py-2.5 rounded-xl font-bold text-xs"
                >
                  Browse Available Consultations
                </button>
              </div>
            )}

          </div>
        )}

        {/* ── TAB 2: My Profile Overhaul ── */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto glass-card rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800/80 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Patient Profile Overview
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your registered patient details and healthcare account
                </p>
              </div>
              <button
                onClick={() => setIsUpdateProfileOpen(true)}
                className="gradient-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profile
              </button>
            </div>

            {/* Profile Avatar & Name */}
            <div className="flex flex-col items-center text-center space-y-3 py-4">
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-teal-500 shadow-xl bg-teal-100">
                <img
                  src={user.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                  alt={user.name || 'User profile portrait'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=0d9488&color=fff`;
                  }}
                />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  {user.name}
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  {user.email}
                </p>
                <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 uppercase text-[10px] font-black tracking-wider border border-teal-200 dark:border-teal-800">
                  {user.role || 'Verified Patient'}
                </span>
              </div>
            </div>

            {/* Details Cards */}
            <div className="space-y-3 pt-2 text-xs sm:text-sm">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50">
                <span className="font-bold text-slate-500 dark:text-slate-400">Account Access Type</span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  Personal Patient Account
                </span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50">
                <span className="font-bold text-slate-500 dark:text-slate-400">Total Consultation Visits</span>
                <span className="font-extrabold text-teal-600 dark:text-teal-400">
                  {appointments.length} Consultations
                </span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50">
                <span className="font-bold text-slate-500 dark:text-slate-400">Healthcare Portal Security</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  Protected & Verified
                </span>
              </div>
            </div>

            {/* Emergency & Helpline Info Box */}
            <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/70 dark:border-teal-900/50 flex items-center gap-3">
              <HeartPulse className="w-6 h-6 text-teal-600 dark:text-teal-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-teal-900 dark:text-teal-200">24/7 Patient Emergency Assistance</p>
                <p className="text-[11px] text-teal-700 dark:text-teal-300">Need urgent consultation rescheduling or helpline? Call +880 1700-123456</p>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Modals */}
      <UpdateBookingModal
        booking={selectedBooking}
        isOpen={isUpdateBookingOpen}
        onClose={() => setIsUpdateBookingOpen(false)}
        onUpdateSuccess={handleUpdateBookingSuccess}
      />

      <UpdateProfileModal
        isOpen={isUpdateProfileOpen}
        onClose={() => setIsUpdateProfileOpen(false)}
      />

      {/* Custom Confirm Delete / Cancel Modal */}
      <ConfirmModal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={handleDeleteConfirmed}
        title="Cancel Appointment Reservation?"
        message="Are you sure you want to cancel this doctor appointment? Your reserved time slot will be released back to the directory."
        confirmLabel="Yes, Cancel Visit"
        danger={true}
      />
    </main>
  );
}
