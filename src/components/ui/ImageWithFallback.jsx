import { useState } from 'react';
import { MapPin } from 'lucide-react';

export default function ImageWithFallback({
  src,
  alt = '',
  className = '',
  fallbackText = '',
  ...props
}) {
  const [status, setStatus] = useState('loading'); // loading | loaded | error

  return (
    <div className={`relative overflow-hidden ${className}`} {...props}>
      {/* Loading skeleton */}
      {status === 'loading' && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse" />
      )}

      {/* Error fallback */}
      {status === 'error' && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-indigo-600/90
          flex flex-col items-center justify-center gap-2 text-white">
          <MapPin className="w-8 h-8 opacity-40" />
          {fallbackText && (
            <span className="text-sm font-medium opacity-70">{fallbackText}</span>
          )}
        </div>
      )}

      {/* Actual image */}
      {status !== 'error' && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500
            ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          loading="lazy"
        />
      )}
    </div>
  );
}
