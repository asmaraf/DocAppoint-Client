'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, ShieldCheck, Star, Users, ArrowRight, ChevronLeft, ChevronRight, Award } from 'lucide-react';

const slides = [
  {
    id: 1,
    badge: '24/7 Verified Healthcare',
    title: 'Book Appointments with Top Medical Specialists',
    subtitle: 'Find certified doctors, check availability in real time, and book your consultation in seconds.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200',
    stats: '50+ Certified Doctors Available',
    ctaText: 'Browse All Appointments',
    ctaLink: '/appointments',
  },
  {
    id: 2,
    badge: 'Top Rated Cardiology Clinic',
    title: 'Expert Cardiology & Heart Care Specialists',
    subtitle: 'Consult leading heart experts for preventive screening and advanced cardiac health consultations.',
    image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=1200',
    stats: '15k+ Successful Consultations',
    ctaText: 'View Top Doctors',
    ctaLink: '/#top-doctors',
  },
  {
    id: 3,
    badge: 'Compassionate Child Care',
    title: 'Pediatric & Family Health Care Done Right',
    subtitle: 'Gentle child specialists and comprehensive family health plans tailored to your entire family.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200',
    stats: '99% Patient Satisfaction Rate',
    ctaText: 'Book Your Visit Now',
    ctaLink: '/appointments',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);

  const prev = () => setCurrent((p) => (p - 1 + slides.length) % slides.length);
  const next = () => setCurrent((p) => (p + 1) % slides.length);

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 border-b border-slate-200/60 dark:border-slate-800/60 py-12 lg:py-20">
      {/* Decorative blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-300/20 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-300/20 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[440px]">

          {/* Left text */}
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-200 dark:border-teal-800">
              <ShieldCheck className="w-4 h-4" />
              {slide.badge}
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
              {slide.title}
            </h1>

            <p className="text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              {slide.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href={slide.ctaLink}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-lg shadow-teal-500/30 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                {slide.ctaText}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-400 transition-colors shadow-sm"
              >
                My Dashboard
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-8 pt-4 border-t border-slate-200 dark:border-slate-800">
              {[
                { label: 'Doctors', value: '50+', icon: Award },
                { label: 'Patients', value: '10k+', icon: Users },
                { label: 'Rating', value: '4.9/5', icon: Star },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <div>
                    <p className="font-extrabold text-slate-900 dark:text-white text-base leading-none">{value}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right image card */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl aspect-[4/3]">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&q=80&w=800';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              {/* Info card overlay */}
              <div className="absolute bottom-5 left-5 right-5 p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white/40 dark:border-slate-700/40">
                <p className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Featured Doctor Highlight</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{slide.stats}</p>
              </div>
            </div>

            {/* Prev / Next arrows */}
            <div className="absolute -bottom-6 right-5 flex gap-2 z-20">
              <button onClick={prev} aria-label="Previous" className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow flex items-center justify-center hover:border-teal-400 transition-colors">
                <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-200" />
              </button>
              <button onClick={next} aria-label="Next" className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow flex items-center justify-center hover:border-teal-400 transition-colors">
                <ChevronRight className="w-5 h-5 text-slate-700 dark:text-slate-200" />
              </button>
            </div>
          </div>

        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${current === idx ? 'w-8 bg-teal-600 dark:bg-teal-400' : 'w-2 bg-slate-300 dark:bg-slate-700'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
