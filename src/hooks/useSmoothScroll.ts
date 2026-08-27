import { useEffect } from 'react';
import Lenis from 'lenis';

import { gsap, ScrollTrigger } from '@/lib/gsap';
import { bindAnchorScrolling, setReducedMotion, setScrollEngine } from '@/lib/scroll';
import { settings } from '@/lib/content';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

/**
 * Boots Lenis smooth scrolling once for the whole app and wires it into GSAP's
 * ticker + ScrollTrigger. Honours `prefers-reduced-motion` and the
 * `settings.smoothScroll` flag; everything degrades to native scrolling.
 */
export function useSmoothScroll(): void {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    setReducedMotion(prefersReducedMotion);

    let lenis: Lenis | null = null;
    let raf: ((time: number) => void) | null = null;
    let offScroll: (() => void) | null = null;

    if (settings.smoothScroll && !prefersReducedMotion) {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.6,
      });

      setScrollEngine(lenis);

      // Drive Lenis from the GSAP ticker so the whole app shares one rAF loop.
      raf = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      const onScroll = () => ScrollTrigger.update();
      lenis.on('scroll', onScroll);
      offScroll = () => lenis?.off('scroll', onScroll);
    }

    const unbindAnchors = bindAnchorScrolling();

    return () => {
      unbindAnchors();
      offScroll?.();
      if (lenis) {
        if (raf) gsap.ticker.remove(raf);
        lenis.destroy();
      }
      setScrollEngine(null);
    };
  }, [prefersReducedMotion]);
}
