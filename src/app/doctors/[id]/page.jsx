'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Star, MapPin, Clock, Hospital, Award, Calendar, MessageSquare, Send, 
  ChevronRight, ShieldCheck, CheckCircle2, UserCheck, AlertCircle, ArrowLeft 
} from 'lucide-react';
import BookingModal from '@/components/BookingModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function DoctorDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, API_BASE, token } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const docRes = await fetch(`${API_BASE}/api/doctors/${id}`);
        const docData = await docRes.json();
        if (docData.success && docData.doctor) {
          setDoctor(docData.doctor);
        }

        const revRes = await fetch(`${API_BASE}/api/reviews/${id}`);
        const revData = await revRes.json();
        if (revData.success && revData.reviews) {
          setReviews(revData.reviews);
        }
      } catch (err) {
        console.warn('Error fetching doctor details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDoctorDetails();
  }, [id, API_BASE]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to leave a review');
      router.push(`/login?returnUrl=/doctors/${id}`);
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write your review comment');
      return;
    }

    setSubmittingReview(true);

    try {
      const res = await fetch(`${API_BASE}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || localStorage.getItem('docappoint_token')}`
        },
        body: JSON.stringify({
          doctorId: doctor.customId || doctor._id,
          rating,
          comment
        })
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to submit review');
      }

      toast.success('Thank you! Review submitted successfully.');
      setReviews([data.review, ...reviews]);
      setComment('');
      setRating(5);
    } catch (err) {
      toast.error(err.message || 'Review submission failed');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24">
        <LoadingSpinner text="Fetching verified doctor profile & patient reviews..." />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-4 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Doctor Profile Not Found</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          The doctor profile you are looking for may have been updated or does not exist.
        </p>
        <button
          onClick={() => router.push('/appointments')}
          className="gradient-btn px-6 py-2.5 rounded-xl font-bold text-xs"
        >
          Back to All Appointments
        </button>
      </div>
    );
  }

  // Calculate review score stats
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : (doctor.rating || 4.9);

  return (
    <main className="py-8 sm:py-12 lg:py-16 min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* ── Breadcrumb Navigation ── */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/appointments" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
            All Appointments
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 dark:text-white font-bold truncate max-w-[200px] sm:max-w-xs">
            {doctor.name}
          </span>
        </nav>

        {/* ── Doctor Header Profile Hero Card ── */}
        <section 
          aria-labelledby="doctor-hero-title"
          className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Doctor Photo */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="relative w-full aspect-[4/3] sm:aspect-square max-w-sm rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 border-2 border-teal-500/30 shadow-md">
                <img
                  src={doctor.image}
                  alt={`Portrait of Dr. ${doctor.name}, ${doctor.specialty} specialist`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=0d9488&color=fff&size=500`;
                  }}
                />
                <div className="absolute top-3 right-3 bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </div>
              </div>

              {/* Quick Fee Callout */}
              <div className="w-full max-w-sm mt-4 p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-900/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">
                    Consultation Fee
                  </span>
                  <span className="text-2xl font-black text-teal-600 dark:text-teal-400">
                    ৳{doctor.fee}
                  </span>
                </div>
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="gradient-btn px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Calendar className="w-4 h-4" />
                  Book Visit
                </button>
              </div>
            </div>

            {/* Right: Clinical Information */}
            <div className="lg:col-span-8 space-y-5">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3.5 py-1 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 text-xs font-extrabold uppercase tracking-wider border border-teal-200 dark:border-teal-800">
                    {doctor.specialty}
                  </span>
                  <div className="flex items-center gap-1 bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-xs font-black shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-slate-950 stroke-none" />
                    <span>{averageRating}</span>
                    <span className="text-slate-800 font-semibold ml-0.5">({reviews.length} Verified Reviews)</span>
                  </div>
                </div>

                <h1 id="doctor-hero-title" className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                  {doctor.name}
                </h1>
                <p className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                  Senior Consultant in {doctor.specialty}
                </p>
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Experience</span>
                    <span className="font-semibold">{doctor.experience} Clinical Practice</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Hospital className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Hospital Chamber</span>
                    <span className="font-semibold truncate block max-w-[220px]">{doctor.hospital}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Location</span>
                    <span className="font-semibold">{doctor.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Consultation Format</span>
                    <span className="font-semibold">In-Person & Chamber Visit</span>
                  </div>
                </div>
              </div>

              {/* Doctor Bio */}
              <div className="space-y-2">
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Doctor Profile & Specialty Details
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {doctor.description || 'Dedicated specialist with extensive clinical background providing comprehensive patient-focused diagnoses, personalized consultation schedules, and dedicated health management plans.'}
                </p>
              </div>

              {/* Consultation Availability Slots */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  Standard Chamber Consultation Slots:
                </p>
                <div className="flex flex-wrap gap-2">
                  {doctor.availability && doctor.availability.length > 0 ? (
                    doctor.availability.map((slot, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-800 shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        {slot}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">Regular daily chamber hours available</span>
                  )}
                </div>
              </div>

              {/* Primary Booking Action */}
              <div className="pt-2">
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="gradient-btn px-8 py-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-teal-500/20 active:scale-95 transition-all"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book In-Person Appointment</span>
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* ── Patient Reviews Section ── */}
        <section aria-labelledby="reviews-heading" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Write a Review Form */}
          <div className="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <div className="border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/80 px-2.5 py-0.5 rounded-full">
                Feedback
              </span>
              <h2 id="reviews-heading" className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                Write a Patient Review
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Help other patients by sharing your experience with Dr. {doctor.name}
              </p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Rating (Selected: {rating} of 5 Stars)
                </label>
                <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Select rating out of 5 stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      role="radio"
                      aria-checked={star === rating}
                      aria-label={`${star} star`}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-115 active:scale-95 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-lg"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          star <= (hoverRating || rating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Comment Textarea */}
              <div>
                <label htmlFor="review-comment" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Your Feedback Experience <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="review-comment"
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about consultation clarity, waiting time, chamber atmosphere, and doctor care..."
                  className="w-full p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="gradient-btn w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-teal-500/20 active:scale-95"
              >
                <Send className="w-4 h-4" />
                {submittingReview ? 'Submitting Review...' : 'Publish Patient Review'}
              </button>
            </form>
          </div>

          {/* Right: Existing Patient Reviews List */}
          <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Patient Reviews ({reviews.length})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Feedback from verified consultations
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 px-3 py-1.5 rounded-2xl">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-sm font-black text-amber-700 dark:text-amber-300">{averageRating}</span>
                <span className="text-xs text-slate-400">/ 5.0</span>
              </div>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((rev, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800/70 space-y-2.5 transition-all hover:border-teal-500/30 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-500 flex items-center justify-center text-white font-black text-sm shadow-xs">
                          {rev.userName ? rev.userName.charAt(0).toUpperCase() : 'P'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-sm">
                            {rev.userName || 'Verified Patient'}
                          </p>
                          <p className="text-[10px] font-semibold text-slate-400">
                            {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent Consultation'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-full border border-amber-200/60 dark:border-amber-800/40">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{rev.rating}/5</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No Patient Reviews Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Be the first patient to share your consultation experience with Dr. {doctor.name}.
                </p>
              </div>
            )}
          </div>

        </section>

      </div>

      {/* Booking Modal */}
      <BookingModal
        doctor={doctor}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSuccess={() => {
          setIsBookingOpen(false);
          router.push('/dashboard');
        }}
      />
    </main>
  );
}
