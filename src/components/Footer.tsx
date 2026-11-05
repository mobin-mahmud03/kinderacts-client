'use client';

import React from 'react';
import Link from 'next/link';
import { HeartHandshake, Mail, MapPin, Phone, Github, Facebook, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">KindredActs</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              A community-driven platform empowering compassionate citizens to organize, join, and track vital social welfare events in their neighborhoods.
            </p>
            {/* Social Icons including the new X logo */}
            <div className="flex items-center gap-3 pt-2">
              {/* New X Logo */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (formerly Twitter)"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                title="Follow us on X"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Quick Navigation</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">Home Page</Link>
              </li>
              <li>
                <Link href="/upcoming-events" className="hover:text-emerald-400 transition-colors">Explore Upcoming Events</Link>
              </li>
              <li>
                <Link href="/create-event" className="hover:text-emerald-400 transition-colors">Create Social Initiative</Link>
              </li>
              <li>
                <Link href="/manage-events" className="hover:text-emerald-400 transition-colors">Organizer Dashboard</Link>
              </li>
              <li>
                <Link href="/joined-events" className="hover:text-emerald-400 transition-colors">My Volunteer Drives</Link>
              </li>
            </ul>
          </div>

          {/* Causes & Focus Areas */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Key Causes</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Winter Blanket & Clothes Drives</li>
              <li>Urban Tree Plantations</li>
              <li>Lake & Riverside Debris Cleanups</li>
              <li>Slum Education & Stationery Camps</li>
              <li>Free Eye & Health Screenings</li>
              <li>Emergency Disaster Food Relief</li>
            </ul>
          </div>

          {/* Contact & Community Office */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Contact Coordination</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>House 42, Road 11, Dhanmondi, Dhaka 1209, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>contact@kindredacts.org</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+880 1712-345678</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} KindredActs Community Platform. Built with heart for local impact.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Volunteer Code of Conduct</span>
            <span className="hover:text-slate-400 cursor-pointer">Community Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
