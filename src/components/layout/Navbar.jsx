import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Plus, Compass, Search, LayoutList, UserCircle2, Briefcase, Users, BookOpen } from 'lucide-react';
import TripLogo from '../ui/TripLogo';

const navLinks = [
  { to: '/',                  label: 'Discover',   icon: Compass    },
  { to: '/cities/search',     label: 'Cities',     icon: Search     },
  { to: '/activities/search', label: 'Activities', icon: LayoutList },
  { to: '/my-trips',          label: 'My Trips',   icon: Briefcase  },
  { to: '/community',         label: 'Community',  icon: Users      },
  { to: '/journal',           label: 'Journal',    icon: BookOpen   },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Main bar */}
      <div className="mx-4 mt-3">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6
            bg-white/80 backdrop-blur-xl
            border border-white/60 shadow-glass
            rounded-2xl"
        >
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <TripLogo size="md" />
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium
                    transition-all duration-200
                    ${isActive(to)
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
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

              {/* Avatar → Profile */}
              <Link
                to="/profile"
                className={`p-2 rounded-xl transition-all duration-200
                  ${isActive('/profile') ? 'text-primary-600 bg-primary-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                aria-label="Profile"
              >
                <UserCircle2 className="w-6 h-6" />
              </Link>

              {/* Mobile menu toggle */}
              <button
                className="lg:hidden p-2 rounded-xl text-slate-500
                  hover:bg-slate-100 transition-colors"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div
            className="lg:hidden mt-2 max-w-7xl mx-auto px-2
              bg-white/95 backdrop-blur-xl border border-white/60
              shadow-card-lg rounded-2xl overflow-hidden
              animate-[fadeUp_0.25s_ease-out_forwards]"
          >
            <div className="p-3 space-y-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                    transition-colors duration-200
                    ${isActive(to)
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}

              <div className="pt-2 border-t border-slate-100 space-y-1">
                <Link
                  to="/trips/create"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
                    text-white transition-all duration-200"
                  style={{ backgroundImage: 'linear-gradient(135deg, #0d9488 0%, #4f46e5 100%)' }}
                >
                  <Plus className="w-4 h-4" />
                  New Trip
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                    text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <UserCircle2 className="w-4 h-4" />
                  My Profile
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
