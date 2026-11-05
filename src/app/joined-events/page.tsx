'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  Calendar,
  MapPin,
  Tag,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function JoinedEventsPage() {
  return (
    <ProtectedRoute>
      <JoinedEventsContent />
    </ProtectedRoute>
  );
}

function JoinedEventsContent() {
  const { user, token } = useAuth();
  const [joinedEvents, setJoinedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchJoinedEvents() {
      if (!token) return;
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/events/user/joined`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setJoinedEvents(data.data || []);
        }
      } catch (err) {
        toast.error('Failed to load your joined events.');
      } finally {
        setLoading(false);
      }
    }

    fetchJoinedEvents();
  }, [token]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-2 pb-6 border-b border-slate-200 dark:border-slate-800">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Volunteer Dashboard
        </span>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          My Joined Initiatives
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          All social welfare drives joined by {user?.email}, automatically sorted by event date.
        </p>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-xs text-slate-500">Retrieving your joined volunteer commitments...</p>
        </div>
      ) : joinedEvents.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No joined events yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven&apos;t joined any community drives so far. Explore upcoming drives and take part!
          </p>
          <Link
            href="/upcoming-events"
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold text-white bg-emerald-600 rounded-xl"
          >
            <span>Browse Upcoming Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {joinedEvents.map((item) => {
            const eventDateObj = new Date(item.eventDate);
            const dateStr = eventDateObj.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });
            const timeStr = eventDateObj.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={item._id}
                className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all group"
              >
                <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                  <img
                    src={item.thumbnail}
                    alt={item.eventTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                      {item.eventType}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white p-1 rounded-full shadow-md" title="Confirmed Joined">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex flex-col flex-grow p-5 justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-2">
                      {item.eventTitle}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{dateStr} at {timeStr}</span>
                    </div>

                    <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
                      Joined on: {new Date(item.joinedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <Link
                    href={`/events/${item.eventId}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-4 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-600 hover:text-white rounded-xl transition-colors"
                  >
                    <span>View Event Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
