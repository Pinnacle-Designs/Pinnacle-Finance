export const SITE_NAME = 'Pinnacle Finance';
export const SITE_TAGLINE = 'Calculating Your Success';
export const SITE_URL = 'https://pinnaclefinancecalc.com';
export const BUILT_BY = 'Pinnacle Designs';

// Matches vite.config.js base — omit basename when served from domain root
const trimmed = import.meta.env.BASE_URL.replace(/\/$/, '');
export const ROUTER_BASENAME = trimmed || undefined;
