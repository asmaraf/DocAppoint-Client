'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ShieldCheck, Star, Users, ArrowRight, ChevronLeft, ChevronRight, Award } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: "Book Appointments with Top Medical Specialists",
    subtitle: "Find certified doctors, check availability in real time, and book your consultation in seconds.",
    badge: "24/7 Verified Healthcare",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=1200",
    stats: "50+ Certified Doctors Available",
    ctaText: "Browse All Appointments",
    ctaLink: "/appointments"
  },
  {
    id: 2,
    title: "Expert Cardiology & Heart Care Specialists",
    subtitle: "Consult leading heart experts like Dr. Ayesha Rahman for preventive screening and advanced cardiac health.",
    badge: "Top Rated Cardiology Clinic",
    image: "https://images.unsplash.com/photo-1594824813566-88855ce78c9c?auto=format&fit=crop&q=80&w=1200",
    stats: "15k+ Successful Consultations",
    ctaText: "View Top Doctors",
    ctaLink: "/#top-doctors"
  },
  {
    id: 3,
    title: "Pediatric & Family Health Care Done Right",
    subtitle: "Gentle child specialists and comprehensive family health plans tailored to your family's needs.",
    badge: "Compassionate Child Care",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1200",
    stats: "99% Patient Satisfaction Rate",
    ctaText: "Book Your Visit Now",
    ctaLink: "/appointments"
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const slide = slides[currentSlide];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-teal-50/50 via-slate-50 to-white dark:from-slate-900/40 dark:via-slate-950 dark:to-slate-950 border-b border-slate-200/50 dark:border-slate-800/50">
      
      {/* Background Decorative Blur Blobs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-teal-400/20 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Banner Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[460px]">
          
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-200 dark:border-teal-800 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              {slide.badge}
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              {slide.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {slide.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={slide.ctaLink}
                className="gradient-btn px-7 py-3.5 rounded-xl font-bold text-base flex items-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                {slide.ctaText}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                className="px-6 py-3.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors shadow-sm"
              >
                My Dashboard
              </Link>
            </div>

            {/* Quick Stats Banner */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 dark:text-white text-base">50+</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Doctors</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 dark:text-white text-base">10k+</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Patients</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-500 shrink-0">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 dark:text-white text-base">4.9/5</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Rating</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Image Banner Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 p-4 glass-card rounded-2xl border border-white/20">
                <p className="text-xs font-semibold uppercase text-teal-600 dark:text-teal-400 tracking-wider">
                  Featured Doctor Highlight
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  {slide.stats}
                </p>
              </div>
            </div>

            {/* Slider Navigation Buttons */}
            <div className="absolute -bottom-5 right-6 flex items-center gap-2 z-20">
              <button
                onClick={prevSlide}
                aria-label="Previous Slide"
                className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-md flex items-center justify-center hover:bg-teal-50 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next Slide"
                className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-md flex items-center justify-center hover:bg-teal-50 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

        {/* Slide Indicator Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-8 bg-teal-600 dark:bg-teal-400' : 'w-2.5 bg-slate-300 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
