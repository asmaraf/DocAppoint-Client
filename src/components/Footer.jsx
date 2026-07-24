'use client';

import React from 'react';
import Link from 'next/link';
import { Stethoscope, Facebook, Linkedin, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1: Brand & Logo */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-teal-500/30">
                <Stethoscope className="w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                DocAppoint
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              DocAppoint is a modern patient-centered healthcare platform connecting patients with top-rated medical specialists for seamless, instant appointment bookings.
            </p>
            {/* Social Icons including NEW X logo */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-teal-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                {/* SVG for New X Logo */}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-teal-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-teal-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-teal-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 tracking-wide uppercase text-xs">
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-teal-400 transition-colors">
                  Home Page
                </Link>
              </li>
              <li>
                <Link href="/appointments" className="hover:text-teal-400 transition-colors">
                  All Appointments
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-teal-400 transition-colors">
                  Patient Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-teal-400 transition-colors">
                  User Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-teal-400 transition-colors">
                  Account Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Medical Specialties */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 tracking-wide uppercase text-xs">
              Medical Specialties
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Cardiology & Heart Care</li>
              <li>Neurology & Brain Health</li>
              <li>Pediatrics & Child Care</li>
              <li>Orthopedic Surgery</li>
              <li>Dermatology & Skin Care</li>
              <li>Dental & Cosmetic Surgery</li>
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 tracking-wide uppercase text-xs">
              Emergency & Contact
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span>Dhanmondi Medical Zone, Dhaka 1209, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-teal-400 shrink-0" />
                <span>+880 1700-123456 (24/7 Helpline)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-teal-400 shrink-0" />
                <span>support@docappoint.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} DocAppoint Manager. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> for Quality Healthcare.
          </p>
        </div>
      </div>
    </footer>
  );
}
