import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, MapPin, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import Button from '../components/ui/Button';
import TripLogo from '../components/ui/TripLogo';

const passwordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pwd.length >= 8)      score++;
  if (/[A-Z]/.test(pwd))   score++;
  if (/[0-9]/.test(pwd))   score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const map = [
    { label: 'Too short',  color: 'bg-red-400'    },
    { label: 'Weak',       color: 'bg-orange-400' },
    { label: 'Fair',       color: 'bg-amber-400'  },
    { label: 'Good',       color: 'bg-primary-500'},
    { label: 'Strong',     color: 'bg-emerald-500'},
  ];
  return { score, ...map[score] };
};

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', city: '', country: '',
  });
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/');
  };

  const strength = passwordStrength(formData.password);

  return (
    <div className="min-h-screen flex relative overflow-hidden">

      {/* ── Left visual (hidden on mobile) ───────────────────────── */}
      <div className="hidden lg:flex lg:w-2/5 relative">
        <img
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=900&h=1200"
          alt="Mountain lake reflection"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 via-primary-800/50 to-primary-900/60" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <TripLogo size="md" className="[&_span]:text-white [&_span]:![background-image:none]" />

          <div className="space-y-4">
            <h2 className="text-3xl font-bold leading-tight">
              Your next adventure<br />begins here
            </h2>
            <p className="text-white/70 text-sm leading-relaxed">
              Join thousands of travelers who plan smarter,
              explore deeper, and remember every moment.
            </p>
            {/* Feature list */}
            {['Day-by-day itinerary builder', 'Smart activity suggestions', 'Budget estimator'].map((f) => (
              <div key={f} className="flex items-center gap-2.5 text-sm text-white/80">
                <span className="w-5 h-5 rounded-full bg-primary-400/30 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-primary-300" />
                </span>
                {f}
              </div>
            ))}
          </div>
          <p className="text-white/40 text-xs">Free forever · No credit card required</p>
        </div>
      </div>

      {/* ── Right form ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-12
        bg-white relative overflow-y-auto">
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full
          bg-primary-50 blur-3xl opacity-50 pointer-events-none" />

        <div className="max-w-md w-full mx-auto relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8"><TripLogo size="md" /></div>

          <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">Create your account</h2>
          <p className="text-slate-500 text-sm mb-8">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700 transition-colors">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'First name', name: 'firstName', placeholder: 'Alex', icon: User },
                { label: 'Last name',  name: 'lastName',  placeholder: 'Rivera', icon: User },
              ].map(({ label, name, placeholder, icon: Icon }) => (
                <div key={name} className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name={name}
                      required
                      value={formData[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50
                        focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400
                        transition-all text-slate-800 placeholder:text-slate-400 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Email address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50
                    focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400
                    transition-all text-slate-800 placeholder:text-slate-400 text-sm"
                />
              </div>
            </div>

            {/* Password + strength */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50
                    focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400
                    transition-all text-slate-800 placeholder:text-slate-400 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Strength bar */}
              {formData.password && (
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex gap-1 flex-1">
                    {[1,2,3,4].map((n) => (
                      <div
                        key={n}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          n <= strength.score ? strength.color : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500">{strength.label}</span>
                </div>
              )}
            </div>

            {/* Location row */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'City',    name: 'city',    placeholder: 'Mumbai'  },
                { label: 'Country', name: 'country', placeholder: 'India'   },
              ].map(({ label, name, placeholder }) => (
                <div key={name} className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">{label}</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name={name}
                      required
                      value={formData[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50
                        focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400
                        transition-all text-slate-800 placeholder:text-slate-400 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button type="submit" variant="brand" size="lg" className="w-full mt-2">
              Create Account
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-slate-400 leading-relaxed">
            By signing up, you agree to our{' '}
            <a href="#" className="text-primary-600 hover:underline">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
