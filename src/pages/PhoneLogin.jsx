import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';
import Button from '../components/ui/Button';
import TripLogo from '../components/ui/TripLogo';
import { useAuth } from '../context/AuthContext';

export default function PhoneLogin() {
  const navigate = useNavigate();
  const { phoneLogin, verifyOTP } = useAuth();
  const [step, setStep] = useState('phone'); // phone | otp | success
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const startCountdown = () => {
    setCountdown(30);
    const interval = setInterval(() => {
      setCountdown((v) => { if (v <= 1) { clearInterval(interval); return 0; } return v - 1; });
    }, 1000);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setError('');
    setLoading(true);
    try {
      await phoneLogin(phone);
      setStep('otp');
      startCountdown();
    } catch (err) {
      setError(err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Auto-focus next
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) return;
    setError('');
    setLoading(true);
    try {
      await verifyOTP(phone, code);
      setStep('success');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=900&h=1200"
          alt="Mountain lake"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 via-primary-800/50 to-primary-900/60" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <TripLogo size="md" className="[&_span]:text-white [&_span]:![background-image:none]" />
          <div>
            <h2 className="text-3xl font-bold leading-tight mb-3">
              Quick & Secure<br />Phone Verification
            </h2>
            <p className="text-white/70 text-sm">
              Sign in instantly with your phone number. No password needed.
            </p>
          </div>
          <div className="flex items-center gap-3 text-white/50 text-xs">
            <ShieldCheck className="w-4 h-4" />
            Demo OTP: 123456
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 bg-white relative">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-indigo-50 blur-3xl opacity-60 pointer-events-none" />

        <div className="max-w-sm w-full mx-auto relative z-10">
          <div className="lg:hidden mb-8">
            <TripLogo size="md" />
          </div>

          {step === 'success' ? (
            <div className="text-center animate-[fadeUp_0.4s_ease-out_forwards]">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Verified!</h2>
              <p className="text-slate-500 text-sm">Redirecting to your dashboard...</p>
            </div>
          ) : (
            <>
              <button
                onClick={() => step === 'otp' ? setStep('phone') : navigate('/login')}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" /> {step === 'otp' ? 'Change number' : 'Back to Sign in'}
              </button>

              <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">
                {step === 'phone' ? 'Phone Sign In' : 'Enter Verification Code'}
              </h2>
              <p className="text-slate-500 text-sm mb-8">
                {step === 'phone'
                  ? 'We\'ll send you a one-time verification code.'
                  : `Code sent to ${phone}. Enter it below.`}
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 animate-[fadeUp_0.3s_ease-out_forwards]">
                  {error}
                </div>
              )}

              {step === 'phone' ? (
                <form onSubmit={handleSendOTP} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50
                          focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400
                          transition-all duration-200 text-slate-800 placeholder:text-slate-400 text-sm"
                      />
                    </div>
                  </div>
                  <Button type="submit" variant="brand" size="lg" className="w-full" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <>Send OTP <ArrowRight className="w-4 h-4" /></>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* OTP boxes */}
                  <div className="flex justify-center gap-3">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOTPChange(i, e.target.value)}
                        onKeyDown={(e) => handleOTPKeyDown(i, e)}
                        className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-slate-200
                          bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40
                          focus:border-primary-400 transition-all text-slate-800"
                      />
                    ))}
                  </div>

                  <Button
                    variant="brand" size="lg" className="w-full"
                    disabled={loading || otp.join('').length !== 6}
                    onClick={handleVerify}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Verifying...
                      </span>
                    ) : (
                      <>Verify & Sign In <ArrowRight className="w-4 h-4" /></>
                    )}
                  </Button>

                  <p className="text-center text-sm text-slate-400">
                    {countdown > 0 ? (
                      <>Resend in <span className="font-semibold text-slate-600">{countdown}s</span></>
                    ) : (
                      <button onClick={handleSendOTP} className="text-primary-600 font-medium hover:underline">
                        Resend OTP
                      </button>
                    )}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
