import { brand } from '@/lib/content';

export interface LogoProps {
  tone?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  withWordmark?: boolean;
  className?: string;
}

const SIZES = {
  sm: { mark: 'h-6 w-6', text: 'text-sm tracking-[0.3em]' },
  md: { mark: 'h-8 w-8', text: 'text-base tracking-[0.32em]' },
  lg: { mark: 'h-12 w-12', text: 'text-2xl tracking-[0.34em]' },
} as const;

/**
 * The Invytra brand lockup.
 *
 * The mark is a minimal "orbit" monogram — an open ring (the ecosystem) with a
 * single cobalt node pushed ahead of it (what's next). Swap the SVG below for the
 * official asset by dropping it at `public/assets/brand/logo.svg` and replacing
 * `<BrandMark/>`, or hand this component the real file.
 */
export function BrandMark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" fill="none">
      {/* open ring */}
      <path
        d="M50 20.5A22 22 0 1 0 50 43.5"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* the node ahead — "next" */}
      <circle cx="50" cy="14" r="7" fill="var(--color-cobalt)" />
    </svg>
  );
}

export function Logo({ tone = 'dark', size = 'md', withWordmark = true, className = '' }: LogoProps) {
  const s = SIZES[size];
  const color = tone === 'light' ? 'text-paper' : 'text-ink';

  return (
    <span className={`inline-flex items-center gap-3 ${color} ${className}`}>
      <BrandMark className={s.mark} />
      {withWordmark && (
        <span className={`font-extrabold ${s.text} whitespace-nowrap`}>{brand.name}</span>
      )}
    </span>
  );
}
