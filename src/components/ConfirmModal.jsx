'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

/**
 * ConfirmModal — replaces window.confirm() with an accessible, styled modal.
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Cancel Consultation?',
  message = 'Are you sure you want to cancel this appointment? This action will release your reserved slot.',
  confirmLabel = 'Yes, Cancel Appointment',
  danger = true,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      onClick={onClose}
    >
      <div
        className="glass-card w-full max-w-sm rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md ${
          danger
            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 shadow-rose-500/20'
            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shadow-amber-500/20'
        }`}>
          <AlertTriangle className="w-7 h-7" />
        </div>

        {/* Text */}
        <div className="text-center space-y-2 mb-6">
          <h3 id="confirm-modal-title" className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Keep Appointment
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors active:scale-95 ${
              danger
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/30'
                : 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/30'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
