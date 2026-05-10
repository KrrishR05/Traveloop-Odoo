import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import TripLogo from '../components/ui/TripLogo';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate successful login → go to dashboard
    navigate('/');
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">

      {/* ── Left panel — visual ────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=900&h=1200"
          alt="Tropical beach sunset"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/70 via-primary-800/50 to-indigo-900/60" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <TripLogo size="md" className="[&_span]:text-white [&_span]:![background-image:none]" />
          <div>
            <blockquote className="text-2xl font-light leading-relaxed text-white/90 mb-6">
              "The world is a book,<br />and those who do not travel<br />
              <span className="font-semibold text-white">read only one page."</span>
            </blockquote>
            <p className="text-white/60 text-sm">— Saint Augustine</p>
          </div>
          <div className="flex items-center gap-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="w-2 h-2 rounded-full bg-white/40" />
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — form ──────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12
        bg-white relative">
        {/* Subtle decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full
          bg-primary-50 blur-3xl opacity-60 pointer-events-none" />

        <div className="max-w-sm w-full mx-auto relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <TripLogo size="md" />
          </div>

          <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-medium hover:text-primary-700 transition-colors">
              Sign up free
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50
                    focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400
                    transition-all duration-200 text-slate-800 placeholder:text-slate-400 text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <a href="#" className="text-xs text-primary-600 hover:text-primary-700 transition-colors font-medium">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50
                    focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400
                    transition-all duration-200 text-slate-800 placeholder:text-slate-400 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400
                    hover:text-slate-600 transition-colors"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-primary-600
                  focus:ring-primary-500 accent-primary-600"
              />
              <label htmlFor="remember" className="text-sm text-slate-600">Remember me</label>
            </div>

            <Button type="submit" variant="brand" size="lg" className="w-full mt-2">
              Sign in
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or continue as</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full py-3 rounded-xl text-sm font-medium text-slate-600
              border border-slate-200 hover:bg-slate-50 hover:border-slate-300
              transition-all duration-200"
          >
            Continue as Guest →
          </button>
        </div>
      </div>
    </div>
  );
}
