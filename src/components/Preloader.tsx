import { useEffect, useRef, useState } from 'react';

import { gsap, EASE } from '@/lib/gsap';
import { content } from '@/lib/content';
import { BrandMark } from '@/components/ui/Logo';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

export interface PreloaderProps {
  onDone: () => void;
}

/**
 * A considered loading moment: the brand mark draws in, the wordmark letters
 * lift, and a live percentage + hairline progress sweep together before a single
 * curtain releases the site. Short by design (~1.6s) and skipped under
 * reduced-motion.
 */
export function Preloader({ onDone }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const countRef = useRef<HTMLSpanElement | null>(null);
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
    const mark = root.querySelector<HTMLElement>('[data-mark]');
    const counter = { value: 0 };

    const tl = gsap.timeline({
      defaults: { ease: EASE.expo },
      onComplete: () => setHidden(true),
    });

    tl.fromTo(mark, { scale: 0.6, opacity: 0, rotate: -20 }, { scale: 1, opacity: 1, rotate: 0, duration: 0.7, ease: EASE.out }, 0.05)
      .fromTo(letters, { yPercent: 120 }, { yPercent: 0, duration: 0.8, stagger: 0.045 }, 0.25)
      .fromTo(
        counter,
        { value: 0 },
        {
          value: 100,
          duration: 1.05,
          ease: EASE.inout,
          onUpdate: () => {
            if (countRef.current) {
              countRef.current.textContent = String(Math.round(counter.value)).padStart(3, '0');
            }
          },
        },
        0.3,
      )
      .fromTo(barRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.05, ease: EASE.inout }, 0.3)
      .to([mark, letters], { yPercent: -130, opacity: 0, duration: 0.5, stagger: 0.02 }, '+=0.12')
      .to(
        root,
        {
          yPercent: -100,
          duration: 0.85,
          ease: EASE.inout,
          onStart: onDone,
        },
        '<0.1',
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
      <div className="flex flex-col items-center gap-6">
        <div data-mark className="text-paper">
          <BrandMark className="h-12 w-12" />
        </div>

        <div className="flex overflow-hidden text-3xl font-extrabold tracking-[0.42em] md:text-5xl">
          {letters.map((letter, i) => (
            <span key={`${letter}-${i}`} className="inline-block overflow-hidden">
              <span
                data-letter
                className="inline-block will-change-transform"
                style={{ transform: 'translateY(120%)' }}
              >
                {letter}
              </span>
            </span>
          ))}
        </div>

        <div className="flex w-52 flex-col gap-3 md:w-64">
          <div className="h-px w-full overflow-hidden bg-paper/15">
            <div ref={barRef} className="h-full w-full origin-left bg-cobalt" style={{ transform: 'scaleX(0)' }} />
          </div>
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-paper/40">
            <span>{content.loading.label}</span>
            <span className="tnum text-paper/70">
              <span ref={countRef}>000</span>%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
