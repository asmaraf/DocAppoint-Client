'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Star, MapPin, Clock, Building2, Award, Calendar, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
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

      toast.success('Review submitted successfully!');
      setReviews([data.review, ...reviews]);
      setComment('');
    } catch (err) {
      toast.error(err.message || 'Review failed');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Fetching doctor profile & patient reviews..." />;
  }

  if (!doctor) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Doctor Profile Not Found</h2>
        <button
          onClick={() => router.push('/appointments')}
          className="mt-4 px-6 py-2.5 rounded-xl gradient-btn"
        >
          Back to All Appointments
        </button>
      </div>
    );
  }

  return (
    <div className="py-10 lg:py-16 min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Doctor Header Banner Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800/80 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Photo */}
            <div className="lg:col-span-4 relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border-2 border-teal-500/30">
              <Image
                src={doctor.image || 'https://images.unsplash.com/photo-1594824813566-88855ce78c9c?auto=format&fit=crop&q=80&w=600'}
                alt={doctor.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Middle Info */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3.5 py-1 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider">
                  {doctor.specialty}
                </span>
                <span className="flex items-center gap-1 bg-amber-400 text-slate-950 px-3 py-0.5 rounded-full text-xs font-extrabold shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {doctor.rating || 4.9} ({reviews.length} Verified Reviews)
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {doctor.name}
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-300 pt-2">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span><strong>Experience:</strong> {doctor.experience}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span><strong>Hospital:</strong> {doctor.hospital}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span><strong>Location:</strong> {doctor.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
                  <span><strong>Consultation Fee:</strong> ৳{doctor.fee}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                {doctor.description}
              </p>

              {/* Availability Timings Badges */}
              <div className="pt-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Available Slots:
                </p>
                <div className="flex flex-wrap gap-2">
                  {doctor.availability && doctor.availability.map((slot, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-800">
                      {slot}
                    </span>
                  ))}
                </div>
              </div>

              {/* Book Appointment CTA */}
              <div className="pt-4">
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="gradient-btn px-8 py-3.5 rounded-xl font-bold text-base flex items-center gap-2 shadow-lg shadow-teal-500/20"
                >
                  <Calendar className="w-5 h-5" />
                  Book Appointment Now
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Review Submission Form */}
          <div className="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 h-fit">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              Write a Review
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Share your consultation experience with Dr. {doctor.name}
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Rating Star
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating
                            ? 'text-amber-400 fill-current'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Your Review Comment *
                </label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe your appointment experience, waiting time, doctor behavior..."
                  className="w-full p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="gradient-btn w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {submittingReview ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          </div>

          {/* Right: Existing Patient Reviews List */}
          <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-6">
              Patient Reviews ({reviews.length})
            </h3>

            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((rev, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold text-sm">
                          {rev.userName ? rev.userName.charAt(0).toUpperCase() : 'P'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-sm">
                            {rev.userName || 'Verified Patient'}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-amber-400 font-bold text-xs bg-amber-400/10 px-2.5 py-1 rounded-full">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {rev.rating}/5
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-sm text-slate-500">
                No patient reviews yet for Dr. {doctor.name}. Be the first to share your experience!
              </p>
            )}
          </div>

        </div>

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
    </div>
  );
}
