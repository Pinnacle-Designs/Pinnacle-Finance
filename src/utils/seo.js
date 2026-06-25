import { SITE_NAME, SITE_URL, SITE_TAGLINE, BUILT_BY } from '../config/brand';

export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;

export function absoluteUrl(path = '/') {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL.replace(/\/$/, '')}${normalized}`;
}

export function pageTitle(title) {
  return title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;
}

export function buildOrganizationSchema() {
  return {
    '@type': 'Organization',
    name: BUILT_BY,
    url: SITE_URL,
  };
}

export function buildWebSiteSchema() {
  return {
    '@type': 'WebSite',
    name: SITE_NAME,
    description: SITE_TAGLINE,
    url: SITE_URL,
    publisher: buildOrganizationSchema(),
  };
}

export function buildItemListSchema(calculators) {
  return {
    '@type': 'ItemList',
    name: 'Free Financial Calculators',
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
