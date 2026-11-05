
'use client';

import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Tag,
  ArrowRight,
  User,
} from 'lucide-react';

export interface EventItem {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string | Date;
  creatorEmail?: string;
  creatorName?: string;
}

interface EventCardProps {
  event: EventItem;
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80';

const badgeColors: Record<string, string> = {
  Donation:
    'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',

  Plantation:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',

  Cleanup:
    'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',

  Healthcare:
    'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',

  Education:
    'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
};

export default function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.eventDate);

  const formattedDate = Number.isNaN(eventDate.getTime())
    ? 'Date not available'
    : eventDate.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

  const category = event.eventType || 'General';

  const badgeClass =
    badgeColors[category] ||
    'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement>
  ) => {
    const target = e.currentTarget;

    if (target.src !== FALLBACK_IMAGE) {
      target.src = FALLBACK_IMAGE;
    }
  };

  return (
    <article className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">

      {/* Event Thumbnail */}
      <div className="relative w-full h-48 overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
        <img
          src={event.thumbnail || FALLBACK_IMAGE}
          alt={event.title || 'Community event'}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full border shadow-sm backdrop-blur-md ${badgeClass}`}
          >
            <Tag className="w-3 h-3" />
            {category}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-grow p-5 justify-between">

        <div className="space-y-3">

          {/* Event Title */}
          <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {event.title || 'Untitled Event'}
          </h3>

          {/* Event Location */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />

            <span className="truncate">
              {event.location || 'Location not specified'}
            </span>
          </div>

          {/* Event Date */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />

            <span>{formattedDate}</span>
          </div>

          {/* Event Organizer */}
          {event.creatorName && (
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />

              <span className="truncate">
                Organized by {event.creatorName}
              </span>
            </div>
          )}

          {/* Event Description */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {event.description || 'No description available.'}
          </p>

        </div>

        {/* View Event Button */}
        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
          <Link
            href={`/events/${event._id}`}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white rounded-xl transition-all duration-200 shadow-sm"
          >
            <span>View Event</span>

            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </article>
  );
}
