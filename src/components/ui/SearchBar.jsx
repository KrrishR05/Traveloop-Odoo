import { Search, X } from 'lucide-react';

export default function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Search…',
  className = '',
  size = 'md',
  id,
}) {
  const sizes = {
    sm: 'py-2.5 text-sm',
    md: 'py-3 text-sm',
    lg: 'py-4 text-base',
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-slate-400" />
      </div>

      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full pl-11 pr-10 rounded-2xl border border-slate-200
          bg-white/70 backdrop-blur-sm
          focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400
          transition-all duration-200 text-slate-800 placeholder:text-slate-400
          ${sizes[size]}`}
      />

      {value && (
        <button
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400
            hover:text-slate-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
