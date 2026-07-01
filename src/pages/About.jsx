import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import { SITE_NAME, SITE_TAGLINE, SITE_URL, BUILT_BY, CONTACT_EMAIL } from '../config/brand';
import { CALCULATORS } from '../data/calculators';
import { buildWebPageSchema } from '../utils/seo';

const TITLE = 'About Us';
const DESCRIPTION =
  'Learn about Pinnacle Finance — free online financial calculators built by Pinnacle Designs for smarter money decisions.';

export default function About() {
  return (
    <>
      <SEOHead
        title={TITLE}
        description={DESCRIPTION}
        path="/about"
        schema={buildWebPageSchema({ name: TITLE, description: DESCRIPTION, path: '/about' })}
      />

      <Breadcrumb items={[{ label: TITLE }]} />

      <article className="max-w-3xl">
        <header className="mb-8">
          <p className="section-label mb-2">{SITE_TAGLINE}</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            About {SITE_NAME}
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            We build free, professional-grade financial calculators that help you make confident decisions —
            without sign-ups, paywalls, or downloads.
          </p>
        </header>

        <div className="card p-6 md:p-8 space-y-6 text-slate-600 leading-relaxed mb-8">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Our Mission</h2>
            <p>
              {SITE_NAME} exists to put powerful financial planning tools in everyone&apos;s hands. Whether
              you&apos;re estimating a mortgage payment, planning retirement, or paying down debt, our {CALCULATORS.length}{' '}
              calculators give instant, transparent results right in your browser.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">How It Works</h2>
            <p>
              Every calculator runs 100% client-side. Your numbers never leave your device, and we don&apos;t store
              your inputs. Results update live as you change values so you can explore scenarios quickly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Who We Are</h2>
            <p>
              {SITE_NAME} is built and maintained by{' '}
              <strong className="text-slate-800">{BUILT_BY}</strong>. We focus on clear design, accurate
              formulas, and helpful educational content on every page.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Disclaimer</h2>
            <p>
              All tools on {SITE_URL} are for educational and informational purposes only. They do not constitute
              financial, tax, or legal advice. Consult a qualified professional before making major financial
              decisions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Contact</h2>
            <p>
              Feedback, corrections, or partnership inquiries:{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-primary hover:underline">
                {CONTACT_EMAIL}
              </a>
            </p>
          </section>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <Link to="/privacy-policy" className="text-brand-primary font-medium hover:underline">
            Privacy Policy
          </Link>
          <Link to="/" className="text-brand-primary font-medium hover:underline">
            Browse calculators
          </Link>
        </div>
      </article>
    </>
  );
}
