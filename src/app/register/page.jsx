'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Mail, Lock, Image as ImageIcon, UserPlus, Github, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';

  const { register, socialLogin } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passError, setPassError] = useState('');

  const validatePassword = (pass) => {
    if (pass.length < 6) {
      return 'Password must be at least 6 characters long.';
    }
    if (!/[A-Z]/.test(pass)) {
      return 'Password must contain at least 1 uppercase letter (A-Z).';
    }
    if (!/[a-z]/.test(pass)) {
      return 'Password must contain at least 1 lowercase letter (a-z).';
    }
    return '';
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    if (val) {
      setPassError(validatePassword(val));
    } else {
      setPassError('');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const err = validatePassword(password);
    if (err) {
      setPassError(err);
      toast.error(err);
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password, photoUrl);
      toast.success('Registration successful! Please log in.');
      router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider) => {
    try {
      const demoEmail = provider === 'Google' ? 'alex.google@gmail.com' : 'dev.github@github.com';
      const demoName = provider === 'Google' ? 'Alex Google User' : 'GitHub Developer';
      const demoPhoto = provider === 'Google'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200';

      await socialLogin(demoName, demoEmail, demoPhoto, provider);
      toast.success(`Account created via ${provider}!`);
      router.push('/');
    } catch (err) {
      toast.error(err.message || `${provider} signup failed`);
    }
  };

  const hasMinLen = password.length >= 6;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);

  return (
    <div className="glass-card w-full max-w-md rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Register
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Create your patient account to book appointments instantly.
        </p>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleRegister} className="space-y-4">
        
        {/* Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Full Name *
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Rahim Uddin"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-teal-500 outline-none"
            />
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Email Address *
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@gmail.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-teal-500 outline-none"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>
        </div>

        {/* Photo URL */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Photo URL
          </label>
          <div className="relative">
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://i.ibb.co/photo.jpg"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-teal-500 outline-none"
            />
            <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Password *
          </label>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border text-slate-900 dark:text-white font-medium text-sm focus:ring-2 outline-none ${
                passError
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'border-slate-300 dark:border-slate-700 focus:ring-teal-500'
              }`}
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          {/* Password Validation Checklist */}
          <div className="mt-2.5 p-3 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 space-y-1.5 text-[11px] font-semibold">
            <div className={`flex items-center gap-1.5 ${hasMinLen ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
              {hasMinLen ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              Minimum 6 characters long
            </div>
            <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
              {hasUpper ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              At least 1 Uppercase letter (A-Z)
            </div>
            <div className={`flex items-center gap-1.5 ${hasLower ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
              {hasLower ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              At least 1 Lowercase letter (a-z)
            </div>
          </div>

          {passError && (
            <p className="text-xs font-bold text-rose-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {passError}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !!passError}
          className="gradient-btn w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <UserPlus className="w-4 h-4" />
          {loading ? 'Registering Account...' : 'Register Account'}
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
        <span className="bg-white dark:bg-slate-950 px-3 text-[11px] font-bold uppercase text-slate-400 absolute">
          OR SIGNUP WITH
        </span>
      </div>

      {/* Social Signup Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleSocialAuth('Google')}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Google Signup
        </button>

        <button
          onClick={() => handleSocialAuth('GitHub')}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
        >
          <Github className="w-4 h-4 text-slate-800 dark:text-white" />
          GitHub Signup
        </button>
      </div>

      {/* Footer Link */}
      <p className="text-center text-xs text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link
          href={`/login?returnUrl=${encodeURIComponent(returnUrl)}`}
          className="font-bold text-teal-600 dark:text-teal-400 hover:underline"
        >
          Login Here
        </Link>
      </p>

    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="py-12 lg:py-20 flex items-center justify-center min-h-[85vh] px-4">
      <Suspense fallback={<div className="text-center p-8">Loading Registration...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
