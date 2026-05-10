export default function Card({ children, className = '', hover = true, ...props }) {
  return (
    <div
      className={`
        bg-white border border-slate-100 rounded-2xl shadow-card
        ${hover ? 'transition-all duration-300 hover:shadow-card-lg hover:-translate-y-1.5 hover:border-primary-100' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
