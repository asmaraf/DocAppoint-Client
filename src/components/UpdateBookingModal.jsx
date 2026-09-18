'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, Stethoscope, Save, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function UpdateBookingModal({ booking, isOpen, onClose, onUpdateSuccess }) {
  const { API_BASE, token } = useAuth();

  const [patientName, setPatientName] = useState('');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (booking) {
      setPatientName(booking.patientName || '');
      setGender(booking.gender || 'Male');
      setPhone(booking.phone || '');
      setAppointmentDate(booking.appointmentDate || '');
      setAppointmentTime(booking.appointmentTime || '10:30 AM');
    }
  }, [booking]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !booking) return null;

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

  const defaultSlots = ['09:30 AM', '10:30 AM', '11:30 AM', '04:30 PM', '05:30 PM', '06:30 PM'];

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

    setSaving(true);

    try {
      const payload = {
        patientName,
        gender,
        phone,
        appointmentDate,
        appointmentTime
      };

      const res = await fetch(`${API_BASE}/api/appointments/${booking._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || localStorage.getItem('docappoint_token')}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to update appointment');
      }

      toast.success('Appointment schedule updated successfully!');
      if (onUpdateSuccess) onUpdateSuccess(data.appointment);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="update-modal-title"
      onClick={onClose}
    >
      <div 
        className="glass-card w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 mb-6 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-2.5 py-0.5 rounded-full">
              Modify Schedule
            </span>
            <h2 id="update-modal-title" className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Reschedule Appointment
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Doctor: <strong className="text-slate-700 dark:text-slate-200">{booking.doctorName}</strong> ({booking.doctorSpecialty || 'Specialist'})
            </p>
          </div>
        </div>

        {/* Update Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Patient Name */}
          <div>
            <label htmlFor="updatePatientName" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Patient Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="updatePatientName"
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Gender & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label htmlFor="updateGender" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Gender <span className="text-rose-500">*</span>
              </label>
              <select
                id="updateGender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="updatePhone" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="updatePhone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>
          </div>

          {/* Appointment Date with Helper */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="updateDate" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
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
                id="updateDate"
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-teal-500 outline-none cursor-pointer"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Time Slot Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Select Time Slot <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {defaultSlots.map((slot, idx) => {
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

          {/* Submit Action */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-semibold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="gradient-btn px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Schedule Changes'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
