import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react';

import { gsap, EASE } from '@/lib/gsap';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

export interface RevealProps {
  children?: ReactNode;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  /** initial vertical offset (px) */
  y?: number;
  /** initial blur amount (px) */
  blur?: number;
  delay?: number;
  duration?: number;
  /** ScrollTrigger start position */
  start?: string;
  once?: boolean;
  id?: string;
}

/**
 * Generic scroll-reveal. Elements translate + fade (optionally a whisper of
 * blur) when they enter the viewport. Reduced-motion renders them statically.
 */
export function Reveal({
  children,
  as: Tag = 'div',
  className,
  style,
  y = 28,
  blur = 0,
  delay = 0,
  duration = 1.1,
  start = 'top 86%',
  once = true,
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion) {
      gsap.set(el, { clearProps: 'all' });
      return;
    }

    const fromVars: Record<string, unknown> = { y, opacity: 0, ease: EASE.out };
    if (blur > 0) fromVars.filter = `blur(${blur}px)`;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { ...fromVars },
        {
          y: 0,
          opacity: 1,
          filter: blur > 0 ? 'blur(0px)' : undefined,
          duration,
          delay,
          ease: EASE.out,
          scrollTrigger: {
            trigger: el,
            start,
            once,
          },
        },
      );
    }, el);

    return () => {
      ctx.revert();
    };
  }, [prefersReducedMotion, y, blur, delay, duration, start, once]);

  return (
    <Tag ref={ref as never} id={id} className={className} style={style}>
      {children}
    </Tag>
  );
}

