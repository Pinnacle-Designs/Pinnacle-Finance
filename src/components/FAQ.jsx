import { useState } from 'react';

export default function FAQ({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="mt-12">
      <p className="section-label mb-2">FAQ</p>
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-6">
        Frequently Asked Questions
      </h2>
      <div className="space-y-2">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`card overflow-hidden transition-shadow ${isOpen ? 'shadow-lg border-brand-primary/20' : ''}`}
            >
              <button
                type="button"
                className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-slate-50/80 transition"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
              >
                <h3 className="font-semibold text-slate-900">{item.question}</h3>
                <span
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium transition-colors ${
                    isOpen ? 'bg-brand-primary text-white' : 'bg-slate-100 text-brand-primary'
                  }`}
                >
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-slate-600 leading-relaxed border-t border-brand-border pt-4">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
