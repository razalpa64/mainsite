import { useEffect, useRef, useState } from 'react';

import { gsap, EASE } from '@/lib/gsap';
import { content } from '@/lib/content';
import { FullLockup } from '@/components/ui/Logo';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

export interface PreloaderProps {
  onDone: () => void;
}

/**
 * A considered loading moment on deep ink: the full gold/serif lockup rises,
 * a live 000→100% counter runs with a hairline gold progress, then a single
 * curtain releases the site. Skipped under reduced-motion.
 */
export function Preloader({ onDone }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const lockupRef = useRef<HTMLDivElement | null>(null);
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

    const counter = { value: 0 };

    const tl = gsap.timeline({
      defaults: { ease: EASE.expo },
      onComplete: () => setHidden(true),
    });

    tl.fromTo(lockupRef.current, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: EASE.out }, 0.05)
      .fromTo(
        counter,
        { value: 0 },
        {
          value: 100,
          duration: 1.1,
          ease: EASE.inout,
          onUpdate: () => {
            if (countRef.current) countRef.current.textContent = String(Math.round(counter.value)).padStart(3, '0');
          },
        },
        0.25,
      )
      .fromTo(barRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: EASE.inout }, 0.25)
      .to(lockupRef.current, { y: -26, opacity: 0, duration: 0.45 }, '+=0.12')
      .to(root, { yPercent: -100, duration: 0.85, ease: EASE.inout, onStart: onDone }, '<0.08');

    return () => {
      tl.kill();
    };
  }, [prefersReducedMotion, onDone]);

  if (hidden) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="grain fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink text-paper"
    >
      <div ref={lockupRef} className="flex flex-col items-center px-6">
        <FullLockup tone="light" showPillars={false} />

        <div className="mt-10 flex w-60 flex-col gap-3 md:w-72">
          <div className="h-px w-full overflow-hidden bg-paper/15">
            <div ref={barRef} className="h-full w-full origin-left bg-gold" style={{ transform: 'scaleX(0)' }} />
          </div>
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-paper/40">
            <span>{content.loading.label}</span>
            <span className="tnum text-gold-soft">
              <span ref={countRef}>000</span>%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
