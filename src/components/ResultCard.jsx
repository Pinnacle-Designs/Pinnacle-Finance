export default function ResultCard({ label, value, highlight = false, variant = 'default' }) {
  const variantClasses = {
    default: 'text-brand-primary',
    success: 'text-brand-success',
    warning: 'text-brand-warning',
    danger: 'text-brand-danger',
  };

  if (highlight) {
    return (
      <div className="col-span-full rounded-2xl bg-gradient-to-br from-brand-primary to-brand-primary-dark p-px shadow-lg">
        <div className="rounded-2xl bg-white p-5 md:p-6">
          <p className="text-sm font-medium text-brand-muted mb-1">{label}</p>
          <p className="text-2xl md:text-3xl font-bold tracking-tight text-brand-primary">{value}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-brand-border bg-slate-50/80 p-4 hover:bg-white hover:shadow-sm transition">
      <p className="text-xs font-medium uppercase tracking-wide text-brand-muted mb-1.5">{label}</p>
      <p className={`text-xl font-bold tracking-tight ${variantClasses[variant]}`}>{value}</p>
    </div>
  );
}
