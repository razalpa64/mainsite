import type { ReactNode, MouseEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';

import { useMagnetic } from '@/hooks/useMagnetic';
import { scrollToAnchor } from '@/lib/scroll';
import type { CtaVariant } from '@/types/site';

export interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: (event: MouseEvent) => void;
  variant?: CtaVariant;
  tone?: 'dark' | 'light';
  size?: 'md' | 'lg';
  external?: boolean;
  withArrow?: boolean;
  className?: string;
  ariaLabel?: string;
  type?: 'button' | 'submit';
}

/**
 * Tactile, magnetic call-to-action. The visual variants stay within the brand
 * system (solid ink / outline ghost / quiet text) so CTAs read as one family.
 */
export function Button({
  children,
  href,
  onClick,
  variant = 'solid',
  tone = 'dark',
  size = 'md',
  external = false,
  withArrow = false,
  className = '',
  ariaLabel,
  type = 'button',
}: ButtonProps) {
  const magneticRef = useMagnetic<HTMLSpanElement>();

  const base =
    'group/btn relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full font-medium tracking-tight transition-transform duration-300 will-change-transform select-none';
  const sizeCls = size === 'lg' ? 'px-8 py-4 text-base' : 'px-6 py-3 text-sm';

  const variantCls =
    variant === 'solid'
      ? tone === 'light'
        ? 'bg-paper text-ink hover:bg-white'
        : 'bg-ink text-paper hover:bg-black'
      : variant === 'ghost'
        ? tone === 'light'
          ? 'border border-paper/30 text-paper hover:border-paper/70 hover:bg-paper/5'
          : 'border border-ink/20 text-ink hover:border-ink/60 hover:bg-ink/5'
        : tone === 'light'
          ? 'text-paper/80 hover:text-paper'
          : 'text-ink/70 hover:text-ink';

  const underlined = variant === 'quiet';

  const inner = (
    <span ref={magneticRef} className={`${base} ${sizeCls} ${variantCls} ${className}`}>
      {/* fill sweep for solid/ghost */}
      {variant !== 'quiet' && (
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 -z-0 origin-bottom scale-y-0 rounded-full transition-transform duration-500 ease-out group-hover/btn:scale-y-100 ${
            variant === 'solid'
              ? tone === 'light'
                ? 'bg-black'
                : 'bg-gold'
              : 'bg-paper/10'
          }`}
        />
      )}
      <span className={`relative z-10 ${variant === 'solid' ? 'group-hover/btn:text-white transition-colors duration-300' : ''}`}>
        {children}
      </span>
      {(withArrow || external) && (
        <ArrowUpRight
          aria-hidden="true"
          className={`relative z-10 h-[1.1em] w-[1.1em] transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 ${
            underlined ? '' : ''
          }`}
        />
      )}
      {underlined && (
        <span
          aria-hidden="true"
          className="absolute bottom-1.5 left-0 h-px w-full origin-left scale-x-100 bg-current transition-transform duration-500 group-hover/btn:scale-x-50"
        />
      )}
    </span>
  );

  const handleClick = (event: MouseEvent) => {
    if (onClick) onClick(event);
    if (href && href.startsWith('#') && !external) {
      const handled = scrollToAnchor(href, -1);
      if (handled) event.preventDefault();
    }
  };

  if (href) {
    return (
      <a
        href={href}
        aria-label={ariaLabel}
        onClick={handleClick}
        {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
        className="inline-flex"
      >
        {inner}
      </a>
    );
  }

  return (
    <button type={type} aria-label={ariaLabel} onClick={handleClick} className="inline-flex">
      {inner}
    </button>
  );
}
