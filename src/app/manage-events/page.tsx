'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  Calendar,
  MapPin,
  Tag,
  Edit3,
  Trash2,
  PlusCircle,
  AlertCircle,
  Loader2,
  X,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const EVENT_TYPES = ['Donation', 'Plantation', 'Cleanup', 'Healthcare', 'Education'];

export default function ManageEventsPage() {
  return (
    <ProtectedRoute>
      <ManageEventsContent />
    </ProtectedRoute>
  );
}

function ManageEventsContent() {
  const { user, token } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Edit Modal State
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editEventType, setEditEventType] = useState('Donation');
  const [editThumbnail, setEditThumbnail] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editDate, setEditDate] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete Confirm State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUserEvents = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/events/user/created`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEvents(data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load your organized events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserEvents();
  }, [token]);

  const openEditModal = (event: any) => {
    setEditingEvent(event);
    setEditTitle(event.title);
    setEditDescription(event.description);
    setEditEventType(event.eventType);
    setEditThumbnail(event.thumbnail);
    setEditLocation(event.location);

    // Format ISO string to datetime-local format
    const d = new Date(event.eventDate);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    setEditDate(d.toISOString().slice(0, 16));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editTitle.trim() || editTitle.length < 5) {
      toast.error('Title must be at least 5 characters.');
      return;
    }
    if (!editDescription.trim() || editDescription.length < 20) {
      toast.error('Description must be at least 20 characters.');
      return;
    }
    if (!editLocation.trim()) {
      toast.error('Location is required.');
      return;
    }
    if (!editThumbnail.trim()) {
      toast.error('Thumbnail URL is required.');
      return;
    }

    const selectedTime = new Date(editDate).getTime();
    if (selectedTime <= Date.now()) {
      toast.error('Event date must be in the future.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/events/${editingEvent._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDescription.trim(),
          eventType: editEventType,
          thumbnail: editThumbnail.trim(),
          location: editLocation.trim(),
          eventDate: new Date(editDate).toISOString()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || 'Update failed.');
      } else {
        toast.success('Event updated successfully!');
        setEditingEvent(null);
        fetchUserEvents();
      }
    } catch (err) {
      toast.error('Network error updating event.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || 'Delete failed.');
      } else {
        toast.success('Event removed successfully.');
        setEvents(events.filter((e) => e._id !== id));
        setDeletingId(null);
      }
    } catch (err) {
      toast.error('Error deleting event.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Organizer Management
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Manage Created Events
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review, edit, or delete events organized under your account ({user?.email}).
          </p>
        </div>

        <Link
          href="/create-event"
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Event</span>
        </Link>
      </div>

      {/* Events Table / List */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-xs text-slate-500">Loading your organized initiatives...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">You haven&apos;t created any events yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Ready to lead a social project? Click below to publish your first community initiative.
          </p>
          <Link
            href="/create-event"
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold text-white bg-emerald-600 rounded-xl"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create First Event</span>
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase tracking-wider text-[11px] font-bold text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Event</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {events.map((evt) => {
                  const dateStr = new Date(evt.eventDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  return (
                    <tr key={evt._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={evt.thumbnail}
                            alt={evt.title}
                            className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=200&q=80';
                            }}
                          />
                          <div>
                            <Link
                              href={`/events/${evt._id}`}
                              className="font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 line-clamp-1"
                            >
                              {evt.title}
                            </Link>
                            <span className="text-[10px] text-slate-400">ID: {evt._id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          {evt.eventType}
                        </span>
                      </td>
                      <td className="px-6 py-4 truncate max-w-[150px]">{evt.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{dateStr}</td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/events/${evt._id}`}
                            className="p-2 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="View Public Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => openEditModal(evt)}
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                            title="Edit Event"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setDeletingId(evt._id)}
                            className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* UPDATE EVENT MODAL */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Update Event Information
              </h2>
              <button
                onClick={() => setEditingEvent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Event Type
                  </label>
                  <select
                    value={editEventType}
                    onChange={(e) => setEditEventType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500"
                  >
                    {EVENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Date & Time (Future date only)
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Thumbnail Image URL
                  </label>
                  <input
                    type="url"
                    required
                    value={editThumbnail}
                    onChange={(e) => setEditThumbnail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl disabled:opacity-50 flex items-center gap-1.5"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete This Event?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                This action cannot be undone. All joined volunteer records associated with this drive will also be cleared.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => handleDelete(deletingId)}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
