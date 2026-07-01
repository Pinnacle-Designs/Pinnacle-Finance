import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import Breadcrumb from '../components/Breadcrumb';
import { SITE_NAME, SITE_URL, CONTACT_EMAIL } from '../config/brand';
import { buildWebPageSchema } from '../utils/seo';

const TITLE = 'Privacy Policy';
const DESCRIPTION =
  'How Pinnacle Finance handles your data, cookies, and third-party advertising through Google AdSense.';

export default function PrivacyPolicy() {
  return (
    <>
      <SEOHead
        title={TITLE}
        description={DESCRIPTION}
        path="/privacy-policy"
        schema={buildWebPageSchema({ name: TITLE, description: DESCRIPTION, path: '/privacy-policy' })}
      />

      <Breadcrumb items={[{ label: TITLE }]} />

      <article className="max-w-3xl">
        <header className="mb-8">
          <p className="section-label mb-2">Legal</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">{TITLE}</h1>
          <p className="text-slate-600">Last updated: June 25, 2026</p>
        </header>

        <div className="card p-6 md:p-8 space-y-6 text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Overview</h2>
            <p>
              {SITE_NAME} ({SITE_URL}) provides free financial calculators for educational purposes. We respect
              your privacy and are committed to explaining what information is collected when you use our site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Information We Collect</h2>
            <p className="mb-3">
              Our calculators run entirely in your browser. We do not require an account, and we do not ask you
              to submit personal financial data to our servers. Calculator inputs stay on your device unless you
              choose to share results yourself.
            </p>
            <p>
              Like most websites, we may receive standard technical information through our hosting and analytics
              providers, such as your IP address, browser type, pages visited, and approximate location. This
              information helps us operate and improve the site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Cookies and Advertising</h2>
            <p className="mb-3">
              We use <strong className="text-slate-800">Google AdSense</strong> to display advertisements. Google
              and its partners may use cookies and similar technologies to serve ads based on your visits to this
              site and other sites on the Internet.
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-3">
              <li>
                Google&apos;s use of advertising cookies enables it and its partners to serve ads to you.
              </li>
              <li>
                You may opt out of personalized advertising by visiting{' '}
                <a
                  href="https://www.google.com/settings/ads"
                  className="text-brand-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Ads Settings
                </a>
                .
              </li>
              <li>
                Alternatively, visit{' '}
                <a
                  href="https://optout.aboutads.info/"
                  className="text-brand-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  aboutads.info
                </a>{' '}
                to opt out of third-party cookies for personalized ads.
              </li>
            </ul>
            <p>
              For more on how Google uses data, see{' '}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                className="text-brand-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google&apos;s partner sites policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Third-Party Services</h2>
            <p>
              Third parties, including Google, may place and read cookies on your browser or use web beacons to
              collect information in connection with ad serving. We do not control these third parties&apos;
              privacy practices. Please review their policies for more details.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">California Privacy Rights</h2>
            <p>
              If you are a California resident, you may have additional rights under the CCPA regarding personal
              information collected for advertising purposes. To make a request, contact us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-primary hover:underline">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Children&apos;s Privacy</h2>
            <p>
              This site is not directed at children under 13. We do not knowingly collect personal information
              from children.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an
              updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Contact</h2>
            <p>
              Questions about this policy? Email{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-primary hover:underline">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>
        </div>

        <p className="mt-8 text-sm text-brand-muted">
          <Link to="/" className="text-brand-primary hover:underline">
            ← Back to calculators
          </Link>
        </p>
      </article>
    </>
  );
}
