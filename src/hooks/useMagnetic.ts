import { useEffect, useRef } from 'react';

import { gsap } from '@/lib/gsap';
import { settings } from '@/lib/content';
import { useIsFinePointer, usePrefersReducedMotion } from '@/hooks/useMediaQuery';

/**
 * Magnetic interaction: the element gently follows the cursor within a soft
 * radius and springs back on leave. Disabled for touch / reduced motion.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.32) {
  const ref = useRef<T | null>(null);
  const isFinePointer = useIsFinePointer();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !isFinePointer || prefersReducedMotion || !settings.magneticButtons) return;

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      gsap.to(el, {
        x: x * strength,
        y: y * strength,
        duration: 0.5,
        ease: 'power3.out',
      });
    };

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' });
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(el);
    };
  }, [strength, isFinePointer, prefersReducedMotion]);

  return ref;
}
