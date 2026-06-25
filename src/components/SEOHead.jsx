import { Helmet } from 'react-helmet-async';
import { SITE_NAME } from '../config/brand';

export default function SEOHead({ title, description }) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
}
