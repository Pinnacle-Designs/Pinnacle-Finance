import { SITE_NAME, SITE_URL, SITE_TAGLINE, BUILT_BY } from '../config/brand';

export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;

export function absoluteUrl(path = '/') {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL.replace(/\/$/, '')}${normalized}`;
}

/** Primary keyword first, brand at end — fits Google SERP display */
export function pageTitle(title) {
  if (title.includes(SITE_NAME)) return title;
  return `${title} | ${SITE_NAME}`;
}

export function buildOrganizationSchema() {
  return {
    '@type': 'Organization',
    name: SITE_NAME,
    alternateName: BUILT_BY,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: DEFAULT_OG_IMAGE,
    },
  };
}

export function buildWebSiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    description: SITE_TAGLINE,
    url: SITE_URL,
    inLanguage: 'en-US',
    publisher: buildOrganizationSchema(),
  };
}

export function buildWebPageSchema({ name, description, path }) {
  return {
    '@type': 'WebPage',
    '@id': `${absoluteUrl(path)}#webpage`,
    name,
    description,
    url: absoluteUrl(path),
    inLanguage: 'en-US',
    isPartOf: { '@id': `${SITE_URL}/#website` },
  };
}

export function buildItemListSchema(calculators) {
  return {
    '@type': 'ItemList',
    name: 'Free Financial Calculators',
    description: 'Complete list of free online financial calculators',
    numberOfItems: calculators.length,
    itemListElement: calculators.map((calc, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: calc.name,
      url: absoluteUrl(calc.path),
    })),
  };
}

export function buildWebApplicationSchema({ name, description, path }) {
  return {
    '@type': 'WebApplication',
    name,
    description,
    url: absoluteUrl(path),
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    inLanguage: 'en-US',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    provider: buildOrganizationSchema(),
  };
}

export function buildFAQSchema(faq) {
  if (!faq?.length) return null;
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildBreadcrumbSchema(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        ...(item.path ? { item: absoluteUrl(item.path) } : {}),
      })),
    ],
  };
}

export function toJsonLd(...schemas) {
  const graph = schemas.filter(Boolean);
  if (!graph.length) return null;
  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
