import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import TripLogo from '../components/ui/TripLogo';
import { authService } from '../services/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.forgotPassword({ email, new_password: newPassword });
      setSuccess(true);
    } catch (err) {
      const data = err.data || {};
      if (data.email) {
        setError(Array.isArray(data.email) ? data.email[0] : data.email);
      } else {
        setError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">

      {/* ── Left panel — visual ───────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1488646472499-02f07917c123?auto=format&fit=crop&q=80&w=900&h=1200"
          alt="Travel landscape"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/70 via-primary-800/50 to-indigo-900/60" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <TripLogo size="md" className="[&_span]:text-white [&_span]:![background-image:none]" />
          <div>
            <h2 className="text-3xl font-bold leading-tight mb-3">
              Don't worry,<br />we've got you covered
            </h2>
            <p className="text-white/70 text-sm">
              Reset your password and get back to planning your next adventure.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="w-2 h-2 rounded-full bg-white/40" />
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — form ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12
        bg-white relative">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full
          bg-amber-50 blur-3xl opacity-60 pointer-events-none" />

        <div className="max-w-sm w-full mx-auto relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <TripLogo size="md" />
          </div>

          {success ? (
            /* ── Success state ──────────────────────────────── */
            <div className="text-center animate-[fadeUp_0.4s_ease-out_forwards]">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Password Reset!</h2>
              <p className="text-slate-500 text-sm mb-6">
                Your password has been changed successfully. You can now sign in with your new password.
              </p>
              <Button variant="brand" size="lg" className="w-full" onClick={() => navigate('/login')}>
                Sign in <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            /* ── Form state ────────────────────────────────── */
            <>
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Sign in
              </button>

              <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">Reset Password</h2>
              <p className="text-slate-500 text-sm mb-8">
                Enter your email and a new password below.
              </p>

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

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type={showPwd ? 'text' : 'password'}
                      required
                      minLength={8}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 8 characters"
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
                      Resetting...
                    </span>
                  ) : (
                    <>Reset Password <ArrowRight className="w-4 h-4" /></>
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
