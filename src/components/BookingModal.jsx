'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, Stethoscope, CheckCircle, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function BookingModal({ doctor, isOpen, onClose, onSuccess }) {
  const { user, API_BASE } = useAuth();

  const [patientName, setPatientName] = useState(user?.name || '');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [appointmentTime, setAppointmentTime] = useState(
    doctor?.availability?.[0] || '10:30 AM'
  );
  const [submitting, setSubmitting] = useState(false);

  // Sync default slot and patient name when doctor or user changes
  useEffect(() => {
    if (doctor?.availability?.length > 0) {
      setAppointmentTime(doctor.availability[0]);
    }
    if (user?.name) {
      setPatientName(user.name);
    }
  }, [doctor, user]);

  // Handle ESC key to close modal for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !doctor) return null;

  // Format human-friendly date string for UI feedback
  const getFormattedDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const availableSlots = doctor.availability && doctor.availability.length > 0
    ? doctor.availability
    : ['09:30 AM', '11:00 AM', '04:30 PM', '06:00 PM'];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientName.trim()) {
      toast.error('Please enter patient name');
      return;
    }
    if (!phone.trim()) {
      toast.error('Please enter contact phone number');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        userEmail: user?.email || 'user@gmail.com',
        doctorId: doctor.customId || doctor._id,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        patientName,
        gender,
        phone,
        appointmentDate,
        appointmentTime,
        fee: doctor.fee || 800
      };

      const res = await fetch(`${API_BASE}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('docappoint_token')}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to book appointment');
      }

      toast.success('Appointment booked successfully!');
      if (onSuccess) onSuccess(data.appointment);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      onClick={onClose}
    >
      <div 
        className="glass-card w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 mb-6 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 shadow-sm">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/80 px-2.5 py-0.5 rounded-full">
              Instant Reservation
            </span>
            <h2 id="booking-modal-title" className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Book Appointment
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Doctor: <strong className="text-slate-700 dark:text-slate-200">{doctor.name}</strong> ({doctor.specialty})
            </p>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Patient Details Section */}
          <div className="space-y-3.5">
            <div>
              <label htmlFor="patientName" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Patient Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="patientName"
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Rahim Uddin"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Gender & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="patientGender" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Gender <span className="text-rose-500">*</span>
                </label>
                <select
                  id="patientGender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="patientPhone" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="patientPhone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01712345678"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Section */}
          <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800/70 space-y-3.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="appointmentDate" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Appointment Date <span className="text-rose-500">*</span>
                </label>
                {appointmentDate && (
                  <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400">
                    {getFormattedDate(appointmentDate)}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  id="appointmentDate"
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all cursor-pointer"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Interactive Visual Time Slot Pills */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Select Consultation Slot <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableSlots.map((slot, idx) => {
                  const isSelected = appointmentTime === slot;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAppointmentTime(slot)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-teal-600 text-white shadow-md shadow-teal-500/25 ring-2 ring-teal-500'
                          : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 text-white shrink-0" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                      )}
                      <span>{slot}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Transparent Fee Summary Breakdown Card */}
          <div className="p-3.5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-900/60 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>Doctor Consultation Fee:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">৳{doctor.fee || 800}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>DocAppoint Platform Fee:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Free (৳0)</span>
            </div>
            <div className="flex items-center justify-between pt-1.5 border-t border-teal-200/60 dark:border-teal-900/60 font-bold text-slate-900 dark:text-white">
              <span>Total Payable at Clinic:</span>
              <span className="text-sm font-black text-teal-600 dark:text-teal-400">৳{doctor.fee || 800}</span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-semibold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="gradient-btn px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              {submitting ? 'Confirming...' : 'Confirm Appointment'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
