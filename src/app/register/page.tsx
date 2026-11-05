
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  HeartHandshake,
  User,
  Mail,
  Image as ImageIcon,
  Lock,
  UserPlus,
  ArrowRight,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasMinLength = password.length >= 6;

  const isPasswordValid =
    hasUpperCase && hasLowerCase && hasMinLength;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      toast.error('Please enter your full name.');
      return;
    }

    if (!cleanEmail) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (!isPasswordValid) {
      toast.error('Please fulfill all password requirements.');
      return;
    }

    setLoading(true);

    try {
      const defaultAvatar =
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

      const userPhoto = photoURL.trim() || defaultAvatar;

      // Step 1: Create account using Better Auth
      const result = await authClient.signUp.email({
        name: cleanName,
        email: cleanEmail,
        password,
        image: userPhoto,
      });

      if (result.error) {
        const message =
          result.error.message || 'Registration failed. Please try again.';

        toast.error(message);
        return;
      }

      // Step 2: Synchronize with the existing backend JWT system
      const apiBase = process.env.NEXT_PUBLIC_API_URL;

      if (apiBase) {
        try {
          const response = await fetch(
            `${apiBase.replace(/\/$/, '')}/auth/social-login`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: cleanName,
                email: cleanEmail,
                photoURL: userPhoto,
              }),
            }
          );

          if (response.ok) {
            const jwtData = await response.json();

            if (jwtData.token) {
              localStorage.setItem('kindred_token', jwtData.token);
            }

            if (jwtData.user) {
              localStorage.setItem(
                'kindred_user',
                JSON.stringify(jwtData.user)
              );
            }
          } else {
            const errorData = await response.json().catch(() => null);

            console.error(
              'Backend JWT synchronization failed:',
              errorData || response.status
            );
          }
        } catch (syncError) {
          console.error('Backend JWT synchronization error:', syncError);
        }
      } else {
        console.warn(
          'NEXT_PUBLIC_API_URL is not configured. Backend JWT sync skipped.'
        );
      }

      toast.success('Registration successful! Welcome to KindredActs.');

      router.refresh();
      router.push('/');
    } catch (error: unknown) {
      console.error('Registration error:', error);

      const message =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred during registration.';

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 sm:p-10 space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20">
            <HeartHandshake className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Create Volunteer Account
          </h1>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Start joining and leading social welfare events in your community.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name *
            </label>

            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

              <input
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Nusrat Jahan"
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm disabled:opacity-60"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address *
            </label>

            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nusrat@example.com"
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm disabled:opacity-60"
              />
            </div>
          </div>

          {/* Profile Photo */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Profile Photo URL
            </label>

            <div className="relative">
              <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://example.com/photo.jpg (Optional)"
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm disabled:opacity-60"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Password *
            </label>

            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

              <input
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm disabled:opacity-60"
              />
            </div>

            {/* Password Requirements */}
            <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5 text-xs">
              <p className="font-bold text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider">
                Password Requirements:
              </p>

              <div className="flex items-center gap-2">
                {hasMinLength ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-400" />
                )}

                <span className={hasMinLength ? 'text-emerald-600 font-medium' : 'text-slate-500'}>
                  At least 6 characters
                </span>
              </div>

              <div className="flex items-center gap-2">
                {hasUpperCase ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-400" />
                )}

                <span className={hasUpperCase ? 'text-emerald-600 font-medium' : 'text-slate-500'}>
                  At least one uppercase letter (A-Z)
                </span>
              </div>

              <div className="flex items-center gap-2">
                {hasLowerCase ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-400" />
                )}

                <span className={hasLowerCase ? 'text-emerald-600 font-medium' : 'text-slate-500'}>
                  At least one lowercase letter (a-z)
                </span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !isPasswordValid || !name.trim() || !email.trim()}
            className="w-full py-3 px-4 font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Complete Registration</span>
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
          Already have an account?{' '}

          <Link
            href="/login"
            className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-0.5"
          >
            <span>Sign in instead</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </p>
      </div>
    </div>
  );
}
