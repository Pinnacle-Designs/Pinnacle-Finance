import { Link } from 'react-router-dom';
import SEOHead from './SEOHead';
import AdSlot, { ADS_ENABLED } from './AdSlot';
import FAQ from './FAQ';
import Breadcrumb from './Breadcrumb';
import { getRelatedCalculators } from '../data/calculators';

export default function CalculatorPage({
  title,
  description,
  intro,
  howItWorks,
  faq,
  currentPath,
  children,
  results,
}) {
  const related = getRelatedCalculators(currentPath, 3);

  return (
    <>
      <SEOHead title={title} description={description} />

      <Breadcrumb items={[{ label: title }]} />

      <header className="mb-8">
        <p className="section-label mb-2">Calculator</p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
          {title}
        </h1>
        <p className="text-slate-600 leading-relaxed max-w-3xl text-lg">{intro}</p>
      </header>

      <div className={ADS_ENABLED ? 'flex flex-col lg:flex-row gap-8' : ''}>
        <div className="flex-1 min-w-0">
          <div className="card p-6 md:p-8 mb-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-brand-border">
              <span className="w-1 h-6 rounded-full bg-brand-primary" />
              <h2 className="text-lg font-semibold text-slate-900">Enter Your Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">{children}</div>

            {results && (
              <div className="mt-8 pt-8 border-t border-brand-border">
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-1 h-6 rounded-full bg-brand-success" />
                  <h2 className="text-lg font-semibold text-slate-900">Your Results</h2>
                  <span className="ml-auto text-xs text-brand-muted bg-slate-100 px-2.5 py-1 rounded-full">
                    Updates live
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{results}</div>
              </div>
            )}
          </div>

          <section className="card p-6 md:p-8 mb-8">
            <p className="section-label mb-2">Methodology</p>
            <h2 className="text-xl font-bold text-slate-900 mb-3">How It Works</h2>
            <p className="text-slate-600 leading-relaxed">{howItWorks}</p>
          </section>

          <AdSlot size="banner" className="mb-8" />

          <FAQ items={faq} />

          <section className="mt-12">
            <p className="section-label mb-2">Explore More</p>
            <h2 className="text-xl font-bold text-slate-900 mb-5">Related Calculators</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((calc) => (
                <Link
                  key={calc.id}
                  to={calc.path}
                  className="card-interactive p-5 group"
                >
                  <span className="text-2xl mb-3 block">{calc.icon}</span>
                  <h3 className="font-semibold text-slate-900 group-hover:text-brand-primary text-sm leading-snug">
                    {calc.name}
                  </h3>
                  <p className="text-xs text-brand-muted mt-2 line-clamp-2 leading-relaxed">{calc.description}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {ADS_ENABLED && (
          <aside className="lg:w-[300px] flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <AdSlot size="rectangle" />
            </div>
          </aside>
        )}
      </div>
    </>
  );
}
