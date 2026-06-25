import { ADS_ENABLED } from '../config/ads';

export { ADS_ENABLED };

export default function AdSlot({ size = 'rectangle', className = '' }) {
  if (!ADS_ENABLED) return null;

  const sizes = {
    leaderboard: 'w-full max-w-[728px] h-[90px]',
    rectangle: 'w-full max-w-[300px] h-[250px]',
    banner: 'w-full h-[90px]',
  };

  return (
    <div
      className={`bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-sm rounded mx-auto ${sizes[size]} ${className}`}
    >
      {/* TODO: Replace AdSlot with real AdSense code after site approval */}
      {/* <ins className="adsbygoogle" ... /> */}
      Ad — {size}
    </div>
  );
}
