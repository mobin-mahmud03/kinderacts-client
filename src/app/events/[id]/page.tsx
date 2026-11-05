'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { authClient } from '@/lib/auth-client';
import {
  Calendar,
  MapPin,
  ArrowLeft,
  CheckCircle2,
  Users,
  Share2,
  Loader2,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function EventDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  // BetterAuth session ও Context
  const { data: session } = authClient.useSession();
  const { user: contextUser, token: contextToken } = useAuth();

  const user = (session as { user?: typeof contextUser } | null)?.user || contextUser;

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [joining, setJoining] = useState<boolean>(false);
  const [hasJoined, setHasJoined] = useState<boolean>(false);

  useEffect(() => {
    async function fetchEventDetails() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/events/${id}`);
        if (!res.ok) {
          toast.error('Event not found or has been removed.');
          router.push('/upcoming-events');
          return;
        }
        const data = await res.json();
        setEvent(data.data);
      } catch (err) {
        toast.error('Unable to fetch event details.');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchEventDetails();
    }
  }, [id, router]);

  // Check if current logged-in user has already joined this event
  useEffect(() => {
    async function checkJoinedStatus() {
      const storedToken = contextToken || (typeof window !== 'undefined' ? localStorage.getItem('kindred_token') : null);
      if (!user || !storedToken) return;
      try {
        const res = await fetch(`${API_BASE}/events/user/joined`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          const already = (data.data || []).some((j: any) => j.eventId === id);
          if (already) setHasJoined(true);
        }
      } catch (err) {
        console.error('Failed to check join status:', err);
      }
    }

    checkJoinedStatus();
  }, [user, contextToken, id]);

  const handleJoinEvent = async () => {
    if (!user) {
      toast.error('Please log in first to join this community event!');
      router.push(`/login?redirect=/events/${id}`);
      return;
    }

    setJoining(true);
    try {
      let activeToken = contextToken || (typeof window !== 'undefined' ? localStorage.getItem('kindred_token') : null);

      // যদি BetterAuth দিয়ে লগইন কিন্তু লোকালস্টোরেজে টোকেন না থাকে, তবে অটোমেটিক JWT সংগ্রহ করা
      if (!activeToken && user.email) {
        try {
          const jwtRes = await fetch(`${API_BASE}/auth/social-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              name: user.name || 'Volunteer',
              photoURL: (user as any).image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
            }),
          });
          if (jwtRes.ok) {
            const jwtData = await jwtRes.json();
            activeToken = jwtData.token;
            localStorage.setItem('kindred_token', jwtData.token);
            localStorage.setItem('kindred_user', JSON.stringify(jwtData.user));
          }
        } catch (e) {
          console.error('Auto JWT token fetch failed:', e);
        }
      }

      if (!activeToken) {
        toast.error('Please log in first to join this community event!');
        router.push(`/login?redirect=/events/${id}`);
        return;
      }

      const res = await fetch(`${API_BASE}/events/${id}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`
        }
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || 'Could not join event.');
      } else {
        toast.success(data.message || 'Joined event successfully!');
        setHasJoined(true);
      }
    } catch (err) {
      toast.error('Network error while joining event.');
    } finally {
      setJoining(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Event link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        <p className="text-sm text-slate-500">Loading initiative details...</p>
      </div>
    );
  }

  if (!event) return null;

  const eventDateObj = new Date(event.eventDate);
  const formattedFullDate = eventDateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = eventDateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const isCreator = user && user.email?.toLowerCase() === event.creatorEmail?.toLowerCase();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          href="/upcoming-events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Upcoming Events</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
        <div className="relative w-full h-80 sm:h-96 bg-slate-100 dark:bg-slate-800">
          <img
            src={event.thumbnail}
            alt={event.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80') {
                target.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80';
              }
            }}
          />
          <div className="absolute top-4 left-4">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 shadow-md backdrop-blur-md">
              {event.eventType}
            </span>
          </div>
          <button
            onClick={handleShare}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 dark:bg-slate-900/90 hover:bg-white text-slate-700 dark:text-slate-200 shadow-md backdrop-blur-md transition-all active:scale-90"
            title="Share this event"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 sm:p-10 space-y-8">
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {event.title}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Date</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{formattedFullDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Time</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{formattedTime}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 sm:col-span-2 lg:col-span-1">
                <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div className="truncate">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Location</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{event.location}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              About This Initiative
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                {(event.creatorName || event.creatorEmail || 'O')[0].toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Organized by {event.creatorName || 'Community Organizer'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Verified Contact: {event.creatorEmail}
                </p>
              </div>
            </div>

            {isCreator && (
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-700">
                You are the Organizer
              </span>
            )}
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Ready to stand with your community?
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Joining registers your commitment and informs organizers of volunteer capacity.
              </p>
            </div>

            {hasJoined ? (
              <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 font-bold text-sm shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>You Have Joined This Drive!</span>
              </div>
            ) : (
              <button
                onClick={handleJoinEvent}
                disabled={joining}
                className="w-full sm:w-auto px-8 py-3.5 font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:opacity-50 rounded-2xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
              >
                {joining ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Joining Initiative...</span>
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4" />
                    <span>Join Event Now</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}