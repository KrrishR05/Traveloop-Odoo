import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail, Phone, MapPin, Send, Heart,
  Compass, Globe, Plane, ArrowRight, ExternalLink,
} from 'lucide-react';
import TripLogo from '../ui/TripLogo';

const quickLinks = [
  { to: '/',                label: 'Discover',    icon: Compass },
  { to: '/cities/search',  label: 'Destinations', icon: Globe },
  { to: '/activities/search', label: 'Activities', icon: Plane },
  { to: '/my-trips',       label: 'My Trips',    icon: MapPin },
  { to: '/community',      label: 'Community',   icon: Heart },
  { to: '/budget',         label: 'Budget',      icon: Send },
];

const socialLinks = [
  { label: 'Instagram', href: '#', color: 'hover:text-pink-400',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
  { label: 'Twitter', href: '#', color: 'hover:text-sky-400',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg> },
  { label: 'YouTube', href: '#', color: 'hover:text-red-400',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg> },
  { label: 'Facebook', href: '#', color: 'hover:text-blue-400',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="relative mt-auto">
      {/* Top wave decoration */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary-300 to-transparent" />

      <div className="bg-gradient-to-b from-slate-50 to-slate-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

          {/* ── Newsletter / Inspiration Banner ──────────────── */}
          <div className="relative mb-14 p-8 md:p-10 rounded-3xl overflow-hidden"
            style={{ backgroundImage: 'linear-gradient(135deg, #0d9488 0%, #4f46e5 100%)' }}>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=30&w=1200')] bg-cover bg-center opacity-15" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  ✦ Get Travel Inspiration
                </h3>
                <p className="text-white/70 text-sm mt-1.5 max-w-md">
                  Curated destination guides, hidden gems, and travel deals — delivered weekly.
                </p>
              </div>
              <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-2">
                <div className="relative flex-1 md:w-72">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/95 text-slate-800
                      placeholder:text-slate-400 text-sm border-0
                      focus:outline-none focus:ring-2 focus:ring-white/40"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary-700
                    font-semibold text-sm hover:bg-white/90 transition-all duration-200
                    hover:-translate-y-0.5 shadow-lg flex-shrink-0"
                >
                  {subscribed ? (
                    <>✓ Subscribed!</>
                  ) : (
                    <>Subscribe <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ── Main Grid ─────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <TripLogo size="md" />
              <p className="text-slate-500 text-sm mt-4 leading-relaxed max-w-xs">
                Plan smarter, explore deeper, and create memories that last a lifetime. Your journey starts here.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-2 mt-5">
                {socialLinks.map(({ label, href, color, svg }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center
                      bg-white border border-slate-200 text-slate-400
                      transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card
                      ${color}`}
                  >
                    {svg}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2.5">
                {quickLinks.map(({ to, label, icon: Icon }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="flex items-center gap-2.5 text-sm text-slate-500
                        hover:text-primary-600 transition-colors duration-200 group"
                    >
                      <Icon className="w-3.5 h-3.5 text-slate-300 group-hover:text-primary-400 transition-colors" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4">
                Company
              </h4>
              <ul className="space-y-2.5">
                {['About Us', 'Careers', 'Press', 'Blog', 'Privacy Policy', 'Terms of Service'].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-slate-500 hover:text-primary-600 transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4">
                Contact Us
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-500">hello@traveloop.com</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-500">+91 98765 43210</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-500">Pune, Maharashtra, India</span>
                </li>
              </ul>
            </div>
          </div>

          {/* ── Bottom bar ────────────────────────────────────── */}
          <div className="pt-6 border-t border-slate-200/80">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-slate-400">
                © {new Date().getFullYear()} Traveloop. All rights reserved.
              </p>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for travelers worldwide
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
