import { useState } from 'react';

export default function InputField({
  label,
  id,
  value,
  onChange,
  onBlur,
  onFocus,
  type = 'text',
  placeholder,
  tooltip,
  prefix,
  suffix,
  error,
  min,
  max,
  step,
  options,
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const inputClasses = `w-full h-11 px-3.5 rounded-xl border bg-white text-slate-800 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition shadow-sm ${
    error ? 'border-brand-danger ring-2 ring-brand-danger/10' : 'border-brand-border hover:border-slate-300'
  }`;

  return (
    <div className="mb-5">
      <div className="flex items-center gap-1.5 mb-1.5">
        <label htmlFor={id} className="text-sm font-medium text-slate-800">
          {label}
        </label>
        {tooltip && (
          <span className="relative">
            <button
              type="button"
              className="text-brand-muted hover:text-brand-primary text-[10px] w-4 h-4 rounded-full border border-brand-border flex items-center justify-center bg-slate-50"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
              aria-label="More info"
            >
              ?
            </button>
            {showTooltip && (
              <span className="absolute left-0 top-6 z-20 w-52 p-2.5 text-xs leading-relaxed bg-slate-900 text-white rounded-lg shadow-lg">
                {tooltip}
              </span>
            )}
          </span>
        )}
      </div>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted text-sm pointer-events-none">
            {prefix}
          </span>
        )}
        {options ? (
          <select id={id} value={value} onChange={onChange} className={inputClasses}>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            className={`${inputClasses} ${prefix ? 'pl-7' : ''} ${suffix ? 'pr-10' : ''}`}
          />
        )}
        {suffix && !options && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted text-sm pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-brand-danger mt-1.5 font-medium">{error}</p>}
    </div>
  );
}
