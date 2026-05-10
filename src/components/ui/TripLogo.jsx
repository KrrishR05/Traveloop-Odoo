/**
 * TripLogo — Traveloop brand logo component
 * Renders a custom SVG compass rose + gradient wordmark
 */
export default function TripLogo({ size = 'md', className = '' }) {
  const sizes = {
    sm:  { icon: 28, text: 'text-xl'  },
    md:  { icon: 36, text: 'text-2xl' },
    lg:  { icon: 48, text: 'text-4xl' },
    xl:  { icon: 64, text: 'text-5xl' },
  };
  const s = sizes[size] ?? sizes.md;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Compass SVG mark */}
      <div
        style={{ width: s.icon, height: s.icon }}
        className="flex-shrink-0"
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width={s.icon}
          height={s.icon}
        >
          <defs>
            <linearGradient id="logoGradA" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#0d9488" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
            <linearGradient id="logoGradB" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>

          {/* Outer ring */}
          <circle cx="24" cy="24" r="22" stroke="url(#logoGradA)" strokeWidth="2.5" />

          {/* Inner glow ring */}
          <circle cx="24" cy="24" r="17" stroke="url(#logoGradB)" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />

          {/* North needle (teal) */}
          <path d="M24 6 L27.5 24 L24 21 L20.5 24 Z" fill="url(#logoGradA)" />

          {/* South needle (indigo, lighter) */}
          <path d="M24 42 L20.5 24 L24 27 L27.5 24 Z" fill="url(#logoGradB)" opacity="0.6" />

          {/* East needle (small) */}
          <path d="M42 24 L24 20.5 L27 24 L24 27.5 Z" fill="url(#logoGradA)" opacity="0.4" />

          {/* West needle (small) */}
          <path d="M6 24 L24 27.5 L21 24 L24 20.5 Z" fill="url(#logoGradA)" opacity="0.4" />

          {/* Center dot */}
          <circle cx="24" cy="24" r="3" fill="url(#logoGradA)" />
          <circle cx="24" cy="24" r="1.5" fill="white" />

          {/* N label */}
          <text x="24" y="13" textAnchor="middle" fontSize="5" fontWeight="700"
            fontFamily="Inter,sans-serif" fill="#0d9488" letterSpacing="0">N</text>
        </svg>
      </div>

      {/* Wordmark */}
      <span
        className={`font-bold tracking-tight leading-none bg-clip-text text-transparent
          ${s.text}`}
        style={{ backgroundImage: 'linear-gradient(135deg, #0d9488 0%, #4f46e5 100%)' }}
      >
        Traveloop
      </span>
    </div>
  );
}
