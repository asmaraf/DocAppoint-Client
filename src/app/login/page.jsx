'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';

  const { user, login, socialLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push(returnUrl);
    }
  }, [user, router, returnUrl]);

  const handleSocialAuth = async () => {
    setLoading(true);
    try {
      const clientBase = window.location.origin; // http://localhost:3000
      const targetUrl = returnUrl && returnUrl.startsWith('/') ? `${clientBase}${returnUrl}` : `${clientBase}/`;
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: targetUrl,
      });
      // Google will redirect the browser back to client
    } catch (err) {
      toast.error(err.message || 'Google login failed');
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful!');
      router.push(returnUrl);
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card w-full max-w-md rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Login
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Welcome back! Access your DocAppoint appointment manager.
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Email Address
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

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Password
            </label>
            <span className="text-xs text-teal-600 dark:text-teal-400 hover:underline cursor-pointer">
              Forgot Password?
            </span>
          </div>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-teal-500 outline-none"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="gradient-btn w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
        >
          <LogIn className="w-4 h-4" />
          {loading ? 'Logging in...' : 'Sign In'}
        </button>
      </form>

      <div>
        <button
          onClick={handleSocialAuth}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-slate-900/10 bg-white text-slate-900 text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          </span>
          {loading ? 'Signing in with Google...' : 'Continue with Google'}
        </button>
      </div>

      {/* Footer Link */}
      <p className="text-center text-xs text-slate-500 dark:text-slate-400">
        Don’t have an account?{' '}
        <Link
          href={`/register?returnUrl=${encodeURIComponent(returnUrl)}`}
          className="font-bold text-teal-600 dark:text-teal-400 hover:underline"
        >
          Register Here
        </Link>
      </p>

    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="py-12 lg:py-20 flex items-center justify-center min-h-[80vh] px-4">
      <Suspense fallback={<div className="text-center p-8">Loading Login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
