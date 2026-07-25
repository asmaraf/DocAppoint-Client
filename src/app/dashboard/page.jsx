'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, User, Edit3, Trash2, Clock, Phone, Stethoscope, Mail, ShieldCheck, Plus, CheckCircle, RefreshCw } from 'lucide-react';
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
  const [appointments, setAppointments] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Modals state
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isUpdateBookingOpen, setIsUpdateBookingOpen] = useState(false);
  const [isUpdateProfileOpen, setIsUpdateProfileOpen] = useState(false);

  // Confirm delete modal state
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Auth Guard check: prevent flash or unnecessary redirect on refresh
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

  // Opens the confirm modal — does NOT delete yet
  const handleDeleteBooking = (bookingId) => {
    setConfirmDeleteId(bookingId);
  };

  // Called only after user confirms inside the modal
  const handleDeleteConfirmed = async () => {
    if (!confirmDeleteId) return;
    try {
      const res = await fetch(`${API_BASE}/api/appointments/${confirmDeleteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token || localStorage.getItem('docappoint_token')}` }
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to delete appointment');
      }

      toast.success('Appointment deleted successfully!');
      // Instantly remove from UI
      setAppointments((prev) => prev.filter((app) => app._id !== confirmDeleteId));
    } catch (err) {
      toast.error(err.message || 'Deletion failed');
    } finally {
      setConfirmDeleteId(null);
    }
  };

  if (authLoading) {
    return <LoadingSpinner text="Checking authentication credentials..." />;
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="py-10 lg:py-16 min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Header Profile Banner */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 mb-8 border border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-teal-500 shadow-md bg-teal-100">
              <img
                src={user.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                alt={user.name || 'User'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=0d9488&color=fff`;
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Welcome, {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 text-[10px] font-bold uppercase tracking-wider">
                  Patient Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {user.email}
              </p>
            </div>
          </div>

          {/* Nav Tabs Switcher */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'bookings'
                  ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-teal-600'
              }`}
            >
              <Calendar className="w-4 h-4" />
              My Bookings ({appointments.length})
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-teal-600'
              }`}
            >
              <User className="w-4 h-4" />
              My Profile
            </button>
          </div>
        </div>

        {/* Tab 1: My Bookings */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Scheduled Appointments
              </h2>
              <button
                onClick={() => router.push('/appointments')}
                className="gradient-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Book New Appointment
              </button>
            </div>

            {loadingBookings ? (
              <LoadingSpinner text="Fetching your booked appointments..." />
            ) : appointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {appointments.map((booking) => (
                  <div
                    key={booking._id}
                    className="glass-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between hover:shadow-xl transition-all duration-300"
                  >
                    <div>
                      {/* Doctor Name & Specialty */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/80 px-2.5 py-0.5 rounded-full">
                            {booking.doctorSpecialty || 'Specialist'}
                          </span>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                            {booking.doctorName}
                          </h3>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                          {booking.status || 'Confirmed'}
                        </span>
                      </div>

                      {/* Booking Info Grid */}
                      <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 mb-4">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            Patient Name
                          </span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {booking.patientName} ({booking.gender})
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            Phone
                          </span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {booking.phone}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            Appointment Date
                          </span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-teal-600" />
                            {booking.appointmentDate}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            Time Slot
                          </span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-teal-600" />
                            {booking.appointmentTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons: Update & Delete */}
                    <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                        Fee: ৳{booking.fee || 800}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(booking)}
                          className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 hover:bg-amber-100 text-xs font-bold transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Update
                        </button>
                        <button
                          onClick={() => handleDeleteBooking(booking._id)}
                          className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-bold transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 space-y-3">
                <Calendar className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">No Appointments Booked Yet</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  You haven't scheduled any doctor consultations. Browse available doctors and book your visit now.
                </p>
                <button
                  onClick={() => router.push('/appointments')}
                  className="gradient-btn px-6 py-2.5 rounded-xl font-bold text-sm"
                >
                  Browse Available Appointments
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: My Profile */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto glass-card rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800/80 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                My Profile Details
              </h2>
              <button
                onClick={() => setIsUpdateProfileOpen(true)}
                className="gradient-btn px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Edit3 className="w-4 h-4" />
                Update Profile
              </button>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 py-4">
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-teal-500 shadow-xl bg-teal-100">
                <img
                  src={user.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                  alt={user.name || 'User'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=0d9488&color=fff`;
                  }}
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {user.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 text-sm">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60">
                <span className="font-bold text-slate-500 dark:text-slate-400">Account Type</span>
                <span className="font-bold text-teal-600 dark:text-teal-400 uppercase text-xs bg-teal-50 dark:bg-teal-950 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
                  {user.role || 'Patient'}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60">
                <span className="font-bold text-slate-500 dark:text-slate-400">Total Appointments</span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {appointments.length}
                </span>
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

      {/* Custom Confirm Delete Modal — replaces window.confirm */}
      <ConfirmModal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={handleDeleteConfirmed}
        title="Cancel Appointment?"
        message="This will permanently delete your appointment. This action cannot be undone."
        confirmLabel="Yes, Delete"
        danger={true}
      />
    </div>
  );
}
