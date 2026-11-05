
'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Calendar,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

import EventCard, { EventItem } from '@/components/EventCard';
import EventSkeleton from '@/components/EventSkeleton';

// API Configuration
const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/api'
    : '')
).replace(/\/+$/, '');

const CATEGORIES = [
  'All',
  'Donation',
  'Plantation',
  'Cleanup',
  'Healthcare',
  'Education',
];

// Safely extract events from different API response formats
function extractEvents(payload: unknown): EventItem[] {
  if (Array.isArray(payload)) {
    return payload as EventItem[];
  }

  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const response = payload as Record<string, unknown>;

  if (Array.isArray(response.data)) {
    return response.data as EventItem[];
  }

  if (Array.isArray(response.events)) {
    return response.events as EventItem[];
  }

  if (Array.isArray(response.results)) {
    return response.results as EventItem[];
  }

  if (response.data && typeof response.data === 'object') {
    const nestedData = response.data as Record<string, unknown>;

    if (Array.isArray(nestedData.events)) {
      return nestedData.events as EventItem[];
    }

    if (Array.isArray(nestedData.results)) {
      return nestedData.results as EventItem[];
    }
  }

  return [];
}

export default function UpcomingEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchEvents() {
      try {
        setLoading(true);
        setError('');

        if (!API_BASE) {
          throw new Error(
            'Backend API URL is missing. Please configure NEXT_PUBLIC_API_URL in Vercel.'
          );
        }

        const params = new URLSearchParams();

        if (selectedCategory !== 'All') {
          params.set('category', selectedCategory);
        }

        if (searchQuery.trim()) {
          params.set('search', searchQuery.trim());
        }

        const queryString = params.toString();

        const endpoint = `${API_BASE}/events/upcoming${
          queryString ? `?${queryString}` : ''
        }`;

        console.log('Fetching upcoming events:', endpoint);

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
          cache: 'no-store',
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Unable to load events. Server returned ${response.status}.`
          );
        }

        const result: unknown = await response.json();

        console.log('Upcoming Events API Response:', result);

        const eventList = extractEvents(result);

        setEvents(eventList);

        if (eventList.length === 0) {
          console.warn(
            'No events returned by the Upcoming Events API.'
          );
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }

        console.error('Upcoming Events Fetch Error:', err);

        setEvents([]);

        setError(
          err instanceof Error
            ? err.message
            : 'Something went wrong while loading events.'
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    const debounceTimer = setTimeout(() => {
      fetchEvents();
    }, 300);

    return () => {
      clearTimeout(debounceTimer);
      controller.abort();
    };
  }, [selectedCategory, searchQuery]);

  const handleRetry = () => {
    setError('');
    setLoading(true);

    // Re-trigger the effect without changing the filters
    setSearchQuery((current) => current + ' ');
    setTimeout(() => {
      setSearchQuery((current) => current.trim());
    }, 0);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">

        {/* Header Banner */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Calendar className="w-4 h-4" />
            Community Welfare in Real Time
          </span>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Upcoming Social Initiatives
          </h1>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Explore upcoming drives organized by local volunteers.
            Events whose dates have passed are automatically filtered out.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">

          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, location, or keyword..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <EventSkeleton key={item} />
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-16 px-6 bg-white dark:bg-slate-900 rounded-3xl border border-red-200 dark:border-red-900 space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />

            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              Unable to Load Events
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              {error}
            </p>

            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && events.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />

            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              No Upcoming Events Found
            </h3>

            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery || selectedCategory !== 'All'
                ? 'Try adjusting your search terms or category filters to discover more events.'
                : 'There are currently no scheduled initiatives. Please check again later.'}
            </p>

            {(searchQuery || selectedCategory !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="mt-3 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Events Grid */}
        {!loading && !error && events.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing{' '}
                <span className="font-bold text-emerald-600">
                  {events.length}
                </span>{' '}
                upcoming events
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <EventCard
                  key={event._id || `event-${index}`}
                  event={event}
                />
              ))}
            </div>
          </>
        )}

      </div>
    </main>
  );
}
