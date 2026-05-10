import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Phone } from 'lucide-react';
import Button from '../components/ui/Button';
import TripLogo from '../components/ui/TripLogo';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const demoEmail = prompt('Enter your Google email to sign in:');
      if (!demoEmail) { setLoading(false); return; }
      await googleLogin({
        email: demoEmail,
        first_name: demoEmail.split('@')[0],
        last_name: '',
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Google login failed.');
    } finally {
      setLoading(false);
    }
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

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700
              animate-[fadeUp_0.3s_ease-out_forwards]">
              {error}
            </div>
          )}

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
                <Link to="/forgot-password" className="text-xs text-primary-600 hover:text-primary-700 transition-colors font-medium">
                  Forgot password?
                </Link>
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

            <Button
              type="submit"
              variant="brand"
              size="lg"
              className="w-full mt-2"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>Sign in <ArrowRight className="w-4 h-4" /></>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or continue with</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Social login buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl
                border border-slate-200 bg-white text-sm font-medium text-slate-700
                hover:bg-slate-50 hover:border-slate-300 hover:shadow-card
                transition-all duration-200 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <Link
              to="/phone-login"
              className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl
                border border-slate-200 bg-white text-sm font-medium text-slate-700
                hover:bg-slate-50 hover:border-slate-300 hover:shadow-card
                transition-all duration-200"
            >
              <Phone className="w-4 h-4 text-primary-500" />
              Sign in with Phone
            </Link>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Your session will automatically expire after 10 minutes of inactivity.
          </p>
        </div>
      </div>
    </div>
  );
}
