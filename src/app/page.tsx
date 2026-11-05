'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  HeartHandshake,
  Calendar,
  Users,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  MapPin,
  MailCheck,
  Send
} from 'lucide-react';
import EventCard, { EventItem } from '@/components/EventCard';
import EventSkeleton from '@/components/EventSkeleton';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function HomePage() {
  const [recentEvents, setRecentEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);

  useEffect(() => {
    async function fetchRecentEvents() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/events/recent`);
        if (res.ok) {
          const data = await res.json();
          setRecentEvents(data.data || []);
        }
      } catch (err) {
        console.error('Failed to load recent events:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentEvents();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. BANNER SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-transparent dark:from-slate-900 dark:via-slate-900/50 dark:to-transparent border-b border-slate-200/60 dark:border-slate-800/60 pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Community Driven Impact Platform
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Unite for Good. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Transform Local Communities.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Empowering grassroots volunteers to create, discover, and mobilize around essential social initiatives — from winter blanket distribution and tree planting campaigns to medical relief and canal restoration.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/upcoming-events"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 text-base font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-lg shadow-emerald-600/30 transition-all"
              >
                <span>Browse Upcoming Events</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/create-event"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 text-base font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-xl transition-all shadow-sm"
              >
                <span>Organize an Initiative</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-400/10 dark:bg-emerald-500/10 blur-[100px] -z-10 pointer-events-none rounded-full" />
      </section>

      {/* 2. FEATURE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Why KindredActs
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Built for Transparent Community Welfare
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Every feature is crafted to remove friction between compassionate volunteers and families requiring urgent local assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              Verified Future Drives
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              No stale or past events. Automated scheduling strictly surfaces active and upcoming initiatives ready for your participation.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              1-Click Volunteer Join
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Connect directly with event coordinators with a single click. Keep track of all joined drives in your personal dashboard.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              Organizer Protection
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Cryptographically verified JWT authorization guarantees organizers have exclusive control to update or manage their events.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              Measurable Local Relief
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Direct neighborhood impact: blankets delivered, trees nurtured, shorelines cleaned, and street youth gifted foundational school bags.
            </p>
          </div>
        </div>
      </section>

      {/* 3. RECENT UPCOMING EVENTS SECTION (Using MongoDB .limit(6)) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Immediate Volunteer Opportunities
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Recent Upcoming Events
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Showing the top 6 upcoming social drives dynamically retrieved from our database.
            </p>
          </div>
          <Link
            href="/upcoming-events"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
          >
            <span>View All Upcoming Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Cards on 2 or 3 column grid layouts */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <EventSkeleton key={i} />
            ))}
          </div>
        ) : recentEvents.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
            <HeartHandshake className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No upcoming events yet</h3>
            <p className="text-sm text-slate-500 mt-1 mb-4">Be the pioneer to launch a community drive in your area!</p>
            <Link
              href="/create-event"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl"
            >
              Create First Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* 4. GALLERY SECTION (Static photographs of community service events) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Moments That Matter
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Impact in Action Photo Gallery
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Real snapshots from recent volunteer gatherings, showing the dedication of citizens working together.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="group relative h-48 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80"
              alt="Winter Blanket Warmth"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex items-end">
              <span className="text-xs font-semibold text-white">Warmth Distribution</span>
            </div>
          </div>

          <div className="group relative h-48 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80"
              alt="Community Tree Planting"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex items-end">
              <span className="text-xs font-semibold text-white">Urban Forestry</span>
            </div>
          </div>

          <div className="group relative h-48 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80"
              alt="Lake Cleanup Drive"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex items-end">
              <span className="text-xs font-semibold text-white">Lake Cleanup</span>
            </div>
          </div>

          <div className="group relative h-48 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80"
              alt="Free Medical Consultation"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex items-end">
              <span className="text-xs font-semibold text-white">Healthcare Camp</span>
            </div>
          </div>

          <div className="group relative h-48 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80"
              alt="Childhood Literacy Workshop"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex items-end">
              <span className="text-xs font-semibold text-white">Slum Literacy</span>
            </div>
          </div>

          <div className="group relative h-48 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80"
              alt="Emergency Relief Food Boxes"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex items-end">
              <span className="text-xs font-semibold text-white">Food Relief</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEWSLETTER SECTION (Designed, UI only, no backend functionality required) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white p-8 sm:p-12 lg:p-16 shadow-xl">
          <div className="max-w-2xl mx-auto text-center space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <MailCheck className="w-3.5 h-3.5" />
              Community Dispatch
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Stay Informed on Neighborhood Initiatives
            </h2>
            <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
              Subscribe to receive weekly updates on upcoming volunteer opportunities, relief dispatches, and emergency support drives in Dhaka and beyond.
            </p>

            {subscribed ? (
              <div className="pt-4 p-4 rounded-2xl bg-emerald-800/80 border border-emerald-500 text-emerald-100 text-sm font-semibold">
                ✓ Thank you for subscribing! You will receive our next community newsletter dispatch.
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="pt-4 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-grow px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-emerald-200/70 focus:outline-none focus:ring-2 focus:ring-white text-sm"
                />
                <button
                  type="submit"
                  className="px-6 py-3 font-bold text-sm bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0"
                >
                  <span>Subscribe</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
            <p className="text-[11px] text-emerald-200/70">
              Zero spam. Unsubscribe anytime with one click.
            </p>
          </div>

          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-80 h-80 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />
        </div>
      </section>
    </div>
  );
}
