'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Stethoscope, Sun, Moon, LogOut, User as UserIcon, Menu, X, LayoutDashboard, Calendar, Home } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'All Appointments', href: '/appointments', icon: Calendar },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo + Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/25 group-hover:scale-105 transition-transform duration-200">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight gradient-text">
                DocAppoint
              </span>
              <span className="block text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 tracking-wider">
                Doctor Manager
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-900/80 p-1.5 rounded-full border border-slate-200/50 dark:border-slate-800/50">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Switcher Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>

            {/* User Auth Section */}
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-teal-500 shadow-sm">
                    {user.photoUrl ? (
                      <Image
                        src={user.photoUrl}
                        alt={user.name || 'User'}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 max-w-[120px] truncate">
                    {user.name || 'Patient'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="gradient-btn px-5 py-2.5 rounded-xl text-sm font-semibold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card border-t border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${
                  pathname === link.href
                    ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-2">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-teal-500">
                    <Image
                      src={user.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                      alt={user.name || 'User'}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-semibold"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="gradient-btn w-full py-2.5 text-center font-semibold rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
