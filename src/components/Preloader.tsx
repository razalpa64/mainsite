import { useEffect, useRef, useState } from 'react';

import { gsap, EASE } from '@/lib/gsap';
import { content } from '@/lib/content';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

export interface PreloaderProps {
  onDone: () => void;
}

/**
 * Cinematic brand reveal. Deliberately short (≈1.4s) so it never feels like a
 * gate; reduced-motion users skip straight to the site.
 */
export function Preloader({ onDone }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const root = rootRef.current;

    if (prefersReducedMotion) {
      onDone();
      setHidden(true);
      return;
    }

    if (!root) {
      onDone();
      return;
    }

    const letters = root.querySelectorAll<HTMLElement>('[data-letter]');

    const tl = gsap.timeline({
      defaults: { ease: EASE.expo },
      onComplete: () => setHidden(true),
    });

    tl.fromTo(
      letters,
      { yPercent: 110 },
      { yPercent: 0, duration: 0.9, stagger: 0.05 },
      0.1,
    )
      .fromTo(
        barRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.0, ease: EASE.inout },
        0.2,
      )
      .to(letters, { yPercent: -110, duration: 0.6, stagger: 0.03 }, '+=0.15')
      .to(
        root,
        {
          yPercent: -100,
          duration: 0.8,
          ease: EASE.inout,
          onStart: onDone, // begin hero reveal as the curtain lifts
        },
        '<0.15',
      );

    return () => {
      tl.kill();
    };
  }, [prefersReducedMotion, onDone]);

  if (hidden) return null;

  const letters = content.loading.wordmark.split('');

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink text-paper"
    >
      <div className="flex overflow-hidden font-semibold tracking-[0.42em] text-3xl md:text-5xl">
        {letters.map((letter, i) => (
          <span key={`${letter}-${i}`} className="inline-block overflow-hidden">
            <span
              data-letter
              className="inline-block will-change-transform"
              style={{ transform: 'translateY(110%)' }}
            >
              {letter}
            </span>
          </span>
        ))}
      </div>

      <div className="mt-8 h-px w-40 overflow-hidden bg-paper/15 md:w-56">
        <div ref={barRef} className="h-full w-full origin-left bg-cobalt" style={{ transform: 'scaleX(0)' }} />
      </div>

      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-paper/40">
        {content.loading.label}
      </p>
    </div>
  );
}
