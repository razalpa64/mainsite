import { brand } from '@/lib/content';

/**
 * The Invytra brand lockup, rebuilt as crisp vector/type so it scales perfectly
 * and matches the provided mark: serif wordmark with a gold "Y" and a gold dot in
 * the "A", an "IV" book monogram, a gold rule with a leaf ornament, the tagline
 * and the LEARN · CREATE · CELEBRATE pillars.
 *
 * If the original asset is dropped at `public/assets/brand/logo-full.png`, swap
 * `<FullLockup/>` for an <img> and everything keeps working.
 */

const GOLD = 'var(--color-gold)';

/** Compact "IV" monogram — black serif I with a gold V. */
export function BrandMark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-baseline font-display leading-none ${className}`}
    >
      <span className="font-semibold">I</span>
      <span className="-ml-[0.08em] font-semibold" style={{ color: GOLD }}>
        V
      </span>
    </span>
  );
}

/** Small leaf ornament used on the divider. */
function Leaf({ className = 'h-3 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 20" className={className} aria-hidden="true" fill={GOLD}>
      <path d="M16 0c2.6 4 2.6 9 0 13C13.4 9 13.4 4 16 0Z" />
      <path d="M6 5c4 .8 7.4 4 8.6 8.6C10 13 6.8 9.6 6 5Z" opacity="0.85" />
      <path d="M26 5c-.8 4.6-4 8-8.6 8.6C18.6 9 22 5.8 26 5Z" opacity="0.85" />
      <circle cx="16" cy="17" r="1.6" />
    </svg>
  );
}

/** The full stacked lockup (mark, wordmark, rule+leaf, tagline, pillars). */
export function FullLockup({
  tone = 'dark',
  showPillars = true,
  className = '',
}: {
  tone?: 'dark' | 'light';
  showPillars?: boolean;
  className?: string;
}) {
  const main = tone === 'light' ? 'text-paper' : 'text-ink';
  const sub = tone === 'light' ? 'text-paper/60' : 'text-ink/55';

  return (
    <div className={`flex flex-col items-center text-center ${main} ${className}`}>
      <BrandMark className="h-14 w-14 text-5xl" />

      <span className="mt-5 font-display text-3xl font-medium uppercase tracking-[0.4em] md:text-4xl">
        IN<span>V</span>
        <span style={{ color: GOLD }}>Y</span>TR
        <span className="relative inline-block">
          A
          <span
            aria-hidden="true"
            className="absolute bottom-[0.16em] left-1/2 h-[0.1em] w-[0.1em] -translate-x-1/2 rounded-full"
            style={{ background: GOLD }}
          />
        </span>
      </span>

      <div className="mt-5 flex w-full max-w-xs items-center gap-3">
        <span className="gold-rule flex-1" />
        <Leaf />
        <span className="gold-rule flex-1" />
      </div>

      <p className={`mt-4 font-sans text-[11px] font-semibold uppercase tracking-[0.42em] ${sub}`}>
        Ideas today. Impact tomorrow.
      </p>

      {showPillars && (
        <div className={`mt-5 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.34em] ${sub}`}>
          <span>Learn</span>
          <span className="h-1 w-1 rounded-full" style={{ background: GOLD }} />
          <span>Create</span>
          <span className="h-1 w-1 rounded-full" style={{ background: GOLD }} />
          <span>Celebrate</span>
        </div>
      )}
    </div>
  );
}

/** Navbar-friendly horizontal logo: monogram + wordmark. */
export function Logo({
  tone = 'dark',
  size = 'md',
  className = '',
}: {
  tone?: 'dark' | 'light';
  size?: 'sm' | 'md';
  className?: string;
}) {
  const main = tone === 'light' ? 'text-paper' : 'text-ink';
  const text = size === 'sm' ? 'text-lg' : 'text-xl';

  return (
    <span className={`inline-flex items-center gap-2.5 ${main} ${className}`}>
      <BrandMark className={`${size === 'sm' ? 'h-6 w-6 text-2xl' : 'h-7 w-7 text-3xl'}`} />
      <span className={`font-display font-medium uppercase tracking-[0.3em] ${text}`}>
        INV
        <span style={{ color: GOLD }}>Y</span>TRA
      </span>
    </span>
  );
}

export { brand };
