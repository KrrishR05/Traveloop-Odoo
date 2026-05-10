export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyle = "px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center";
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5",
    secondary: "bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
