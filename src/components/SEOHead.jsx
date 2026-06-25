import { Helmet } from 'react-helmet-async';
import { SITE_NAME } from '../config/brand';
import { absoluteUrl, DEFAULT_OG_IMAGE, pageTitle, toJsonLd } from '../utils/seo';

export default function SEOHead({
  title,
  description,
  path = '/',
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  keywords,
  noIndex = false,
  schema,
}) {
  const fullTitle = pageTitle(title);
  const canonical = absoluteUrl(path);
  const jsonLd = schema ? toJsonLd(...(Array.isArray(schema) ? schema : [schema])) : null;

  return (
    <Helmet>
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={`${SITE_NAME} logo`} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
