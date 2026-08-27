import { useEffect, useRef, type ElementType } from 'react';

import { gsap, EASE } from '@/lib/gsap';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

export interface SplitLinesProps {
  lines: string[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  innerClassName?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  /** `load` animates on mount; `scroll` on viewport entry; `none` = parent controls. */
  trigger?: 'load' | 'scroll' | 'none';
  start?: string;
  yPercent?: number;
}

/**
 * Line-mask reveal. Each line lives inside an `overflow-hidden` mask and slides
 * up with a slight stagger — the signature editorial motion of the site.
 */
export function SplitLines({
  lines,
  as: Tag = 'div',
  className,
  lineClassName = '',
  innerClassName = '',
  delay = 0,
  stagger = 0.09,
  duration = 1.1,
  trigger = 'scroll',
  start = 'top 86%',
  yPercent = 110,
}: SplitLinesProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const inner = root.querySelectorAll<HTMLElement>('[data-line-inner]');

    if (prefersReducedMotion || trigger === 'none') {
      // For `none`, leave the hidden inline style in place; the parent animates.
      if (prefersReducedMotion) gsap.set(inner, { yPercent: 0, opacity: 1 });
      return;
    }

    const tween = gsap.fromTo(
      inner,
      { yPercent, opacity: 1 },
      {
        yPercent: 0,
        opacity: 1,
        duration,
        delay,
        stagger,
        ease: EASE.expo,
        ...(trigger === 'scroll'
          ? { scrollTrigger: { trigger: root, start, once: true } }
          : {}),
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(inner, { clearProps: 'transform' });
    };
  }, [lines, prefersReducedMotion, delay, stagger, duration, trigger, start, yPercent]);

  return (
    <Tag ref={rootRef as never} className={className}>
      {lines.map((line, i) => (
        <span
          key={`${line}-${i}`}
          className={`block overflow-hidden ${lineClassName}`}
        >
          <span
            data-line-inner
            className={`block will-change-transform ${innerClassName}`}
            style={{ transform: prefersReducedMotion ? undefined : `translateY(${yPercent}%)` }}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
