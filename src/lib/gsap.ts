import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

/** Register GSAP plugins exactly once, app-wide. */
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export { gsap, ScrollTrigger, ScrollToPlugin };

/** Standard easing used across the site for cohesive motion. */
export const EASE = {
  out: 'power3.out',
  inout: 'power3.inOut',
  expo: 'expo.out',
  circ: 'circ.out',
} as const;

/** Kill every ScrollTrigger (used on unmount / route refresh). */
export function refreshTriggers(): void {
  ScrollTrigger.refresh();
}
