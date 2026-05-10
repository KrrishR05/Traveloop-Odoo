export default function Input({ label, id, className = '', ...props }) {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`px-4 py-3 rounded-xl glass-input w-full ${className}`}
        {...props}
      />
    </div>
  );
}
