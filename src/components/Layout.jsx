import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import AdSlot, { ADS_ENABLED } from './AdSlot';
import Logo from './Logo';
import { CALCULATORS, CATEGORIES } from '../data/calculators';
import { SITE_NAME, SITE_TAGLINE, BUILT_BY } from '../config/brand';

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();

  const navGroups = [
    { label: 'Loans', keys: ['home', 'debt'] },
    { label: 'Savings', keys: ['savings'] },
    { label: 'Investing', keys: ['investing'] },
    { label: 'Planning', keys: ['planning'] },
  ];

  const getCalcsForGroup = (keys) =>
    CALCULATORS.filter((c) => keys.includes(c.category));

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-950/95 backdrop-blur-md border-b border-white/5 sticky top-0 z-50 shadow-sm">
        <div className="page-container">
          <div className="flex items-center justify-between h-[4.5rem]">
            <Link to="/" className="flex items-center shrink-0">
              <Logo className="h-auto max-h-11 md:max-h-12 w-auto max-w-[160px] md:max-w-[190px] object-contain" />
            </Link>

            <nav className="hidden lg:flex items-center gap-0.5">
              <Link
                to="/"
                className={`px-3.5 py-2 text-sm font-medium rounded-lg transition ${
                  location.pathname === '/'
                    ? 'text-white bg-white/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                All Tools
              </Link>
              {navGroups.map((group) => (
                <div
                  key={group.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(group.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    type="button"
                    className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition"
                  >
                    {group.label}
                    <span className="ml-1 text-[10px] opacity-60">▾</span>
                  </button>
                  {openDropdown === group.label && (
                    <div className="absolute top-full left-0 pt-2 w-72 z-50">
                      <div className="bg-slate-900 border border-white/10 rounded-xl shadow-2xl py-2 overflow-hidden">
                        {getCalcsForGroup(group.keys).map((calc) => (
                          <Link
                            key={calc.id}
                            to={calc.path}
                            className="flex items-start gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition"
                          >
                            <span className="text-base mt-0.5">{calc.icon}</span>
                            <span>
                              <span className="block font-medium">{calc.name}</span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <button
              type="button"
              className="lg:hidden p-2.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-white/5 bg-slate-950 px-4 py-4 max-h-[70vh] overflow-y-auto">
            <Link
              to="/"
              className="block py-2.5 text-sm font-medium text-white"
              onClick={() => setMobileOpen(false)}
            >
              All Calculators
            </Link>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <div key={key} className="mt-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">
                  {cat.icon} {cat.label}
                </p>
                {CALCULATORS.filter((c) => c.category === key).map((calc) => (
                  <Link
                    key={calc.id}
                    to={calc.path}
                    className="block py-2 px-1 text-sm text-slate-300 hover:text-white"
                    onClick={() => setMobileOpen(false)}
                  >
                    {calc.name}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}
      </header>

      {ADS_ENABLED && (
        <div className="page-container py-4">
          <AdSlot size="leaderboard" className="mb-6" />
        </div>
      )}

      <main className="flex-1 page-container py-8 md:py-10">
        <Outlet />
      </main>

      <footer className="bg-slate-950 text-slate-400 mt-auto border-t border-white/5">
        <div className="page-container py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-10">
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <div key={key}>
                <h3 className="font-semibold text-white text-sm mb-4">
                  {cat.icon} {cat.label}
                </h3>
                <ul className="space-y-2.5">
                  {CALCULATORS.filter((c) => c.category === key).map((calc) => (
                    <li key={calc.id}>
                      <Link
                        to={calc.path}
                        className="text-sm text-slate-400 hover:text-white transition-colors"
                      >
                        {calc.name.replace(' Calculator', '').replace(' Planner', '')}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm">
            <div>
              <p className="font-semibold text-white">{SITE_NAME}</p>
              <p className="text-brand-secondary text-xs tracking-widest uppercase mt-1">{SITE_TAGLINE}</p>
            </div>
            <p className="max-w-xl leading-relaxed">
              For educational purposes only. Not financial advice. Consult a qualified professional before making financial decisions.
            </p>
            <p className="text-slate-500">© {new Date().getFullYear()} {SITE_NAME}</p>
          </div>
          <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-slate-500">
            <p>
              Built by{' '}
              <span className="font-semibold text-slate-300">{BUILT_BY}</span>
            </p>
            <p className="mt-1">
              © {new Date().getFullYear()} {BUILT_BY}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
