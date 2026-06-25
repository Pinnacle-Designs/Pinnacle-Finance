import { SITE_NAME } from '../config/brand';
import logoSrc from '../assets/logo-transparent.png';

export default function Logo({ className = 'h-auto max-h-14 w-auto max-w-[200px] object-contain' }) {
  return (
    <img
      src={logoSrc}
      alt={SITE_NAME}
      className={className}
      width={1024}
      height={796}
      decoding="async"
      style={{ background: 'transparent' }}
    />
  );
}
