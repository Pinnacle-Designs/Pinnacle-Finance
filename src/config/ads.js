export const ADSENSE_CLIENT = 'ca-pub-1014488780102797';

/**
 * Add ad unit slot IDs from AdSense → Ads → By ad unit after approval.
 * Leave empty during the application/review period — the head script and
 * ads.txt are enough for site verification and Auto ads.
 */
export const AD_SLOTS = {
  /** Below header on all pages */
  leaderboard: '',
  /** Sticky sidebar on calculator pages (desktop) */
  sidebar: '',
  /** Between calculator content and FAQ */
  inContent: '',
};

export const ADS_ENABLED = Object.values(AD_SLOTS).some(Boolean);

export function getAdSlot(name) {
  return AD_SLOTS[name] || '';
}
