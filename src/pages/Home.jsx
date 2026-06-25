import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdSlot, { ADS_ENABLED } from '../components/AdSlot';
import Logo from '../components/Logo';
import SEOHead from '../components/SEOHead';
import SeoContent from '../components/SeoContent';
import { CALCULATORS, CATEGORIES } from '../data/calculators';
import { HOME_SEO } from '../data/seo';
import { SITE_TAGLINE } from '../config/brand';
import { buildItemListSchema, buildWebPageSchema, buildWebSiteSchema } from '../utils/seo';

const TRUST_SIGNALS = [
  'Free forever',
  'No account needed',
  'Updated for 2026',
  '100% client-side',
];

export default function Home() {
  const [search, setSearch] = useState('');

  const filtered = CALCULATORS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = Object.keys(CATEGORIES)
    .map((key) => ({
      key,
      ...CATEGORIES[key],
      calculators: filtered.filter((c) => c.category === key),
    }))
    .filter((g) => g.calculators.length > 0);

  return (
    <>
      <SEOHead
        title={HOME_SEO.seoTitle}
        description={HOME_SEO.metaDescription}
        path="/"
        keywords={HOME_SEO.keywords}
        schema={[
          buildWebSiteSchema(),
          buildWebPageSchema({
            name: HOME_SEO.seoTitle,
            description: HOME_SEO.metaDescription,
            path: '/',
          }),
          buildItemListSchema(CALCULATORS),
        ]}
      />

      <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-14 md:py-20 mb-12 md:mb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 via-transparent to-brand-secondary/10 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-brand-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative text-center max-w-3xl mx-auto">
          <Logo className="h-auto max-w-[240px] md:max-w-[300px] w-full object-contain mx-auto mb-8" />
          <p className="section-label text-brand-secondary mb-4">{SITE_TAGLINE}</p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
            Free Financial Calculators
            <span className="block text-slate-300 font-semibold text-2xl md:text-3xl mt-2">
              No Sign-Up Required
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Make smarter money decisions with professional-grade calculators for mortgages,
            retirement, debt payoff, budgeting, and more — instant results, always free.
          </p>

          <div className="max-w-md mx-auto relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              placeholder="Search calculators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/50 backdrop-blur-sm transition"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {TRUST_SIGNALS.map((signal) => (
              <span
                key={signal}
                className="text-xs font-medium text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full"
              >
                {signal}
              </span>
            ))}
          </div>
        </div>
      </section>

      {ADS_ENABLED && <AdSlot size="leaderboard" className="mb-12" />}

      {grouped.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-brand-muted">No calculators match your search.</p>
          <button
            type="button"
            onClick={() => setSearch('')}
            className="mt-4 text-sm font-medium text-brand-primary hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        grouped.map((group) => (
          <section key={group.key} className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{group.icon}</span>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
                {group.label}
              </h2>
              <span className="text-sm text-brand-muted bg-slate-100 px-2.5 py-0.5 rounded-full">
                {group.calculators.length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {group.calculators.map((calc) => (
                <Link key={calc.id} to={calc.path} className="card-interactive p-6 group flex flex-col">
                  <span className="text-3xl mb-4 block">{calc.icon}</span>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-primary mb-2 leading-snug transition-colors">
                    {calc.name}
                  </h3>
                  <p className="text-sm text-brand-muted mb-5 leading-relaxed flex-1">{calc.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-primary">
                    Open calculator
                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))
      )}

      <SeoContent heading={HOME_SEO.contentHeading} paragraphs={HOME_SEO.paragraphs} />
    </>
  );
}
