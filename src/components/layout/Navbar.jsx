import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, Plus, Compass, Search, LayoutList, UserCircle2, Briefcase,
  Users, BookOpen, DollarSign, BarChart3, LogOut, Bell, ChevronDown,
  MapPin, Settings, Plane, CheckSquare, Globe,
} from 'lucide-react';
import TripLogo from '../ui/TripLogo';
import { useAuth } from '../../context/AuthContext';

/* ── Nav link groups for dropdown ─────────────────────────────── */
const navGroups = [
  {
    title: 'Explore',
    links: [
      { to: '/',                  label: 'Discover',     icon: Compass,    desc: 'Browse trending destinations' },
      { to: '/cities/search',     label: 'Cities',       icon: Globe,      desc: 'Search cities & countries' },
      { to: '/activities/search', label: 'Activities',   icon: LayoutList, desc: 'Find things to do' },
    ],
  },
  {
    title: 'My Travel',
    links: [
      { to: '/my-trips',   label: 'My Trips',     icon: Briefcase,   desc: 'View & manage trips' },
      { to: '/trips/create', label: 'Plan New Trip', icon: Plane,      desc: 'Start planning' },
      { to: '/budget',      label: 'Budget',        icon: DollarSign,  desc: 'Track expenses' },
      { to: '/checklist',   label: 'Packing List',  icon: CheckSquare, desc: 'Checklists & packing' },
    ],
  },
  {
    title: 'Social',
    links: [
      { to: '/community',  label: 'Community',    icon: Users,    desc: 'Travel stories & posts' },
      { to: '/journal',    label: 'Journal',      icon: BookOpen, desc: 'Write trip journals' },
      { to: '/analytics',  label: 'Analytics',    icon: BarChart3, desc: 'Travel insights' },
    ],
  },
];

/* Flat nav links for mobile */
const allLinks = navGroups.flatMap(g => g.links);

/* Top-level compact links for the navbar bar */
const topLinks = [
  { to: '/',                  label: 'Discover',  icon: Compass },
  { to: '/cities/search',     label: 'Cities',    icon: Search },
  { to: '/my-trips',          label: 'My Trips',  icon: Briefcase },
  { to: '/community',         label: 'Community', icon: Users },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const userInitial = user?.full_name?.[0] || user?.first_name?.[0] || '?';
  const avatarUrl = user?.avatar_url;

  // Track scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
    setNotifOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const handleLogout = async () => {
    setMobileOpen(false);
    await logout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-4 mt-3">
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6
            bg-white/80 backdrop-blur-xl
            border border-white/60
            rounded-2xl transition-shadow duration-300
            ${scrolled ? 'shadow-card-lg' : 'shadow-glass'}`}
        >
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <TripLogo size="md" />
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {topLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium
                    transition-all duration-200
                    ${isActive(to)
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}

              {/* More dropdown trigger */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(v => !v)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium
                    transition-all duration-200
                    ${dropdownOpen
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  More
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200
                    ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* ── Dropdown List ──────────────────────────────── */}
                {dropdownOpen && (
                  <div className="absolute top-full right-0 mt-3 w-64
                    bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/80
                    shadow-card-lg overflow-hidden py-2
                    animate-[fadeUp_0.2s_ease-out_forwards]">

                    {navGroups.map((group, idx) => (
                      <div key={group.title}>
                        <div className="px-5 py-2">
                          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                            {group.title}
                          </p>
                        </div>
                        <div className="flex flex-col">
                          {group.links.map(({ to, label, icon: Icon }) => (
                            <Link
                              key={to}
                              to={to}
                              className={`flex items-center gap-3 px-6 py-2.5 text-sm transition-colors
                                ${isActive(to)
                                  ? 'bg-primary-50 text-primary-700 font-medium'
                                  : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600'}`}
                            >
                              <Icon className="w-4 h-4" />
                              {label}
                            </Link>
                          ))}
                        </div>
                        {idx < navGroups.length - 1 && <div className="h-px bg-slate-100 my-1 mx-5" />}
                      </div>
                    ))}

                    <div className="h-px bg-slate-100 my-1 mx-5" />

                    <div className="flex flex-col pt-1">
                      <Link to="/profile" className="flex items-center gap-3 px-6 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary-600 transition-colors">
                        <UserCircle2 className="w-4 h-4" /> My Profile
                      </Link>
                      <Link to="/trips/create" className="flex items-center gap-3 px-6 py-2.5 text-sm text-primary-600 hover:bg-primary-50 transition-colors font-medium">
                        <Plus className="w-4 h-4" /> New Trip
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <Link
                to="/trips/create"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                  text-white transition-all duration-200 hover:shadow-brand hover:-translate-y-0.5"
                style={{ backgroundImage: 'linear-gradient(135deg, #0d9488 0%, #4f46e5 100%)' }}
              >
                <Plus className="w-4 h-4" />
                New Trip
              </Link>

              {/* Notification bell */}
              <div className="relative hidden sm:flex" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className={`relative p-2 rounded-xl transition-all duration-200
                    ${notifOpen ? 'bg-primary-50 text-primary-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full border-2 border-white" />
                </button>

                {/* Notifications Dropdown */}
                {notifOpen && (
                  <div className="absolute top-full right-0 mt-3 w-80
                    bg-white rounded-2xl border border-slate-100
                    shadow-card-lg overflow-hidden
                    animate-[fadeUp_0.2s_ease-out_forwards]">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <h3 className="font-semibold text-slate-800">Notifications</h3>
                      <button className="text-xs text-primary-600 font-medium hover:text-primary-700">Mark all read</button>
                    </div>
                    <div className="max-h-[320px] overflow-y-auto">
                      <div className="p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 cursor-pointer">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 text-primary-600">
                            <Plus className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-800"><span className="font-medium">Tom Fischer</span> liked your trip to <strong>Paris</strong></p>
                            <p className="text-xs text-slate-400 mt-0.5">2 hours ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-600">
                            <Star className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-800">Your trip to <strong>Bali</strong> was featured by editors!</p>
                            <p className="text-xs text-slate-400 mt-0.5">1 day ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 p-3 text-center bg-slate-50/50">
                      <Link to="/profile" className="text-xs font-medium text-slate-600 hover:text-primary-600">
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Avatar */}
              <Link
                to="/profile"
                className={`flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all duration-200
                  ${isActive('/profile') ? 'bg-primary-50' : 'hover:bg-slate-100'}`}
                aria-label="Profile"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="w-7 h-7 rounded-lg object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-indigo-500
                    flex items-center justify-center text-white text-xs font-bold">
                    {userInitial}
                  </div>
                )}
                {user?.first_name && (
                  <span className="hidden xl:block text-sm font-medium text-slate-700">
                    {user.first_name}
                  </span>
                )}
              </Link>

              {/* Mobile toggle */}
              <button
                className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
                onClick={() => setMobileOpen(v => !v)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile dropdown ───────────────────────────────────── */}
        {mobileOpen && (
          <div className="lg:hidden mt-2 max-w-7xl mx-auto px-2
            bg-white/95 backdrop-blur-xl border border-white/60
            shadow-card-lg rounded-2xl overflow-hidden
            animate-[fadeUp_0.25s_ease-out_forwards]">
            <div className="p-3">

              {/* Grouped sections */}
              {navGroups.map((group) => (
                <div key={group.title} className="mb-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 px-4">
                    {group.title}
                  </p>
                  <div className="space-y-0.5">
                    {group.links.map(({ to, label, icon: Icon }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                          transition-colors duration-200
                          ${isActive(to)
                            ? 'text-primary-700 bg-primary-50'
                            : 'text-slate-700 hover:bg-slate-50'}`}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {/* Actions */}
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <Link
                  to="/trips/create"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
                    text-white transition-all duration-200"
                  style={{ backgroundImage: 'linear-gradient(135deg, #0d9488 0%, #4f46e5 100%)' }}
                >
                  <Plus className="w-4 h-4" /> New Trip
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                    text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <UserCircle2 className="w-4 h-4" /> My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                    text-red-500 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
