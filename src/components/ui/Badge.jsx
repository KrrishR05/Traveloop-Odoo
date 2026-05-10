export default function Badge({ children, variant = 'teal', className = '' }) {
  const variants = {
    teal:   'bg-teal-100 text-teal-700',
    indigo: 'bg-indigo-100 text-indigo-700',
    sand:   'bg-amber-100 text-amber-700',
    slate:  'bg-slate-100 text-slate-600',
    green:  'bg-emerald-100 text-emerald-700',
    red:    'bg-red-100 text-red-700',
    pink:   'bg-pink-100 text-pink-700',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
        ${variants[variant] ?? variants.slate} ${className}`}
    >
      {children}
    </span>
  );
}
