import { useEffect, useState } from 'react';
import TripLogo from './TripLogo';

export default function WelcomeModal({ userName, onClose }) {
  const [stage, setStage] = useState(0); // 0=entering 1=visible 2=exiting

  useEffect(() => {
    requestAnimationFrame(() => setStage(1));
    const timer = setTimeout(() => {
      setStage(2);
      setTimeout(onClose, 500);
    }, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center transition-all duration-500
        ${stage >= 1 ? 'bg-slate-900/60 backdrop-blur-sm' : 'bg-transparent'}
        ${stage === 2 ? 'opacity-0' : 'opacity-100'}`}
      onClick={() => { setStage(2); setTimeout(onClose, 500); }}
    >
      <div
        className={`relative bg-white rounded-4xl shadow-card-lg p-10 max-w-sm w-full mx-4
          text-center transition-all duration-500
          ${stage >= 1 && stage < 2 ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-8'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sparkle decorations */}
        <div className="absolute -top-3 -right-3 text-2xl animate-bounce">✨</div>
        <div className="absolute -bottom-2 -left-2 text-xl animate-bounce" style={{ animationDelay: '0.3s' }}>🌟</div>
        <div className="absolute top-1/4 -left-4 text-lg animate-pulse">⭐</div>

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-brand"
            style={{ backgroundImage: 'linear-gradient(135deg, #0d9488 0%, #4f46e5 100%)' }}>
            <span className="text-3xl">🌍</span>
          </div>
        </div>

        <TripLogo size="sm" className="justify-center mb-4" />

        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Welcome{userName ? `, ${userName}` : ''}! 🎉
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed">
          Your adventure begins now. Start exploring destinations,
          planning trips, and creating unforgettable memories.
        </p>

        <div className="mt-6 flex justify-center gap-2">
          {['🗺️', '✈️', '🏖️', '⛰️', '🌅'].map((emoji, i) => (
            <span
              key={i}
              className="text-xl animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {emoji}
            </span>
          ))}
        </div>

        <p className="mt-4 text-xs text-slate-300">Click anywhere to dismiss</p>
      </div>
    </div>
  );
}
