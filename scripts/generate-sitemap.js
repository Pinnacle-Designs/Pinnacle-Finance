import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { CALCULATORS } from '../src/data/calculators.js';

const SITE_URL = 'https://pinnaclefinancecalc.com';
const today = new Date().toISOString().slice(0, 10);

const urls = [
  { loc: `${SITE_URL}/`, changefreq: 'weekly', priority: '1.0' },
  ...CALCULATORS.map((calc) => ({
    loc: `${SITE_URL}${calc.path}`,
    changefreq: 'monthly',
    priority: '0.9',
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

for (const dir of ['public', 'dist']) {
  if (dir === 'dist' && !existsSync('dist')) continue;
  writeFileSync(`${dir}/sitemap.xml`, xml);
}

console.log(`Generated sitemap.xml with ${urls.length} URLs`);
