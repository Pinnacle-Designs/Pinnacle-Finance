import { useEffect, useRef } from 'react';
import { ADSENSE_CLIENT, ADS_ENABLED, getAdSlot } from '../config/ads';

export { ADS_ENABLED };

const SIZE_CLASS = {
  leaderboard: 'min-h-[90px] max-w-[728px] mx-auto',
  rectangle: 'min-h-[250px] max-w-[300px] mx-auto',
  banner: 'min-h-[90px] w-full',
};

/**
 * @param {'leaderboard' | 'rectangle' | 'banner'} size - Maps to AD_SLOTS keys
 * @param {string} [slotId] - Override slot ID (defaults from AD_SLOTS by size)
 */
export default function AdSlot({ size = 'rectangle', slotId, className = '' }) {
  const slotKey = size === 'rectangle' ? 'sidebar' : size === 'banner' ? 'inContent' : 'leaderboard';
  const resolvedSlot = slotId ?? getAdSlot(slotKey);
  const pushed = useRef(false);

  useEffect(() => {
    if (!resolvedSlot || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense script may not be loaded yet in dev
    }
  }, [resolvedSlot]);

  if (!resolvedSlot) return null;

  return (
    <div className={`ad-slot overflow-hidden ${SIZE_CLASS[size] ?? ''} ${className}`.trim()}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={resolvedSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
