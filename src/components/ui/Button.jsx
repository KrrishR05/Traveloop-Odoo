export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-xl ' +
    'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ' +
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';

  const sizes = {
    sm:   'px-4 py-2 text-sm gap-1.5',
    md:   'px-5 py-2.5 text-sm gap-2',
    lg:   'px-7 py-3.5 text-base gap-2',
  };

  const variants = {
    primary:
      'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-brand ' +
      'hover:from-primary-700 hover:to-primary-600 hover:shadow-lg hover:-translate-y-0.5 ' +
      'focus:ring-primary-500',

    brand:
      'text-white shadow-brand hover:shadow-lg hover:-translate-y-0.5 focus:ring-primary-500',

    secondary:
      'bg-white text-slate-700 border border-slate-200 shadow-card ' +
      'hover:border-primary-300 hover:text-primary-700 hover:shadow-card-lg hover:-translate-y-0.5 ' +
      'focus:ring-primary-500',

    outline:
      'bg-transparent text-primary-600 border-2 border-primary-500 ' +
      'hover:bg-primary-50 hover:-translate-y-0.5 focus:ring-primary-500',

    ghost:
      'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-800 ' +
      'focus:ring-slate-400',

    danger:
      'bg-red-500 text-white shadow-sm hover:bg-red-600 hover:shadow-md ' +
      'hover:-translate-y-0.5 focus:ring-red-500',
  };

  const variantStyle = variant === 'brand'
    ? { backgroundImage: 'linear-gradient(135deg, #0d9488 0%, #4f46e5 100%)' }
    : {};

  return (
    <button
      className={`${base} ${sizes[size] ?? sizes.md} ${variants[variant] ?? variants.primary} ${className}`}
      style={variantStyle}
      {...props}
    >
      {children}
    </button>
  );
}
