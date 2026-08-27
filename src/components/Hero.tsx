import { useEffect, useRef } from 'react';
import { MoveDown } from 'lucide-react';

import { content, hero, brand } from '@/lib/content';
import { gsap, EASE } from '@/lib/gsap';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { Button } from '@/components/ui/Button';
import { SplitLines } from '@/components/ui/SplitLines';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';

const PILLAR_NOTES: Record<string, string> = {
  Learn: 'Online learning & tutoring',
  Create: 'Student & college projects',
  Celebrate: 'Events & experiences',
};

export interface HeroProps {
  booted: boolean;
}

/**
 * ARRIVE — a calm, premium opening. Serif statement on the left, a single
 * elegant image on the right, and the three pillars (Learn / Create / Celebrate)
 * as a quiet index beneath. Deliberately uncluttered.
 */
export function Hero({ booted }: HeroProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const imageWrapRef = useRef<HTMLDivElement | null>(null);
  const imageCoverRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !booted) return;

    const lines = root.querySelectorAll<HTMLElement>('[data-line-inner]');
    const fades = root.querySelectorAll<HTMLElement>('[data-hero-fade]');

    if (prefersReducedMotion) {
      gsap.set([...lines, ...fades], { clearProps: 'all' });
      gsap.set([imageCoverRef.current, imageWrapRef.current], { clearProps: 'all' });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: EASE.expo } });

    tl.fromTo(
      root.querySelector('[data-hero-eyebrow]'),
      { y: 22, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9 },
      0.1,
    )
      .fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.12 }, 0.25)
      .fromTo(imageCoverRef.current, { yPercent: 0 }, { yPercent: -101, duration: 1.1, ease: EASE.inout }, 0.4)
      .fromTo(imageWrapRef.current, { scale: 1.12 }, { scale: 1, duration: 1.6, ease: EASE.out }, 0.4)
      .fromTo(fades, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0, stagger: 0.1 }, 0.7);

    return () => {
      tl.kill();
    };
  }, [booted, prefersReducedMotion]);

  return (
    <section
      id={hero.id}
      ref={rootRef as never}
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
      aria-label="Invytra — introduction"
    >
      {/* Ambient washes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(48% 40% at 82% 18%, rgba(179,135,62,0.10), transparent 62%), radial-gradient(70% 55% at 6% 96%, rgba(230,221,203,0.7), transparent 60%), linear-gradient(180deg, var(--color-paper) 0%, var(--color-paper-2) 100%)',
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-12 left-0 select-none font-display text-[clamp(6rem,20vw,17rem)] leading-none tracking-tight text-ink/[0.04]"
      >
        {brand.name}
      </span>

      <div className="relative z-10 mx-auto grid w-full max-w-[1300px] flex-1 grid-cols-1 items-center gap-14 px-5 pb-12 pt-32 md:px-10 lg:grid-cols-12 lg:gap-10">
        {/* Copy */}
        <div className="lg:col-span-7">
          <p data-hero-eyebrow className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold opacity-0">
            {hero.eyebrow}
          </p>

          <h1 className="mt-7 font-display text-[clamp(2.8rem,7vw,6.2rem)] font-medium leading-[1.04] tracking-[-0.01em] text-ink">
            <SplitLines as="span" lines={hero.headlineLines} trigger="none" />
          </h1>

          <p data-hero-fade className="mt-7 max-w-xl text-base leading-relaxed text-muted opacity-0 md:text-lg">
            {hero.statement}
          </p>

          <div data-hero-fade className="mt-9 flex flex-wrap items-center gap-4 opacity-0">
            <Button href={hero.primaryCta.href} variant="solid" size="lg">
              {hero.primaryCta.label}
            </Button>
            <Button href={hero.secondaryCta.href} variant="ghost" size="lg" withArrow>
              {hero.secondaryCta.label}
            </Button>
          </div>
        </div>

        {/* Image */}
        <div className="lg:col-span-5">
          <div className="relative mx-auto max-w-[440px]">
            <div className="relative overflow-hidden rounded-t-[10rem] rounded-b-3xl shadow-lift">
              <div ref={imageWrapRef} className="will-change-transform">
                <ResponsiveImage path={hero.image} alt={hero.imageAlt} sizesKind="half" eager className="aspect-[4/5] w-full" />
              </div>
              <div ref={imageCoverRef} aria-hidden="true" className="absolute inset-0 bg-paper-2" />
            </div>
            {/* offset gold frame */}
            <div aria-hidden="true" className="pointer-events-none absolute -inset-3 -z-10 rounded-t-[10.5rem] rounded-b-[2rem] border border-gold/40" />
          </div>
        </div>
      </div>

      {/* Pillars strip */}
      <div data-hero-fade className="relative z-10 opacity-0">
        <div className="hairline mx-auto w-full max-w-[1300px]" />
        <div className="mx-auto grid w-full max-w-[1300px] grid-cols-1 gap-6 px-5 py-7 sm:grid-cols-3 md:px-10">
          {brand.pillars.map((pillar, i) => (
            <div key={pillar} className={`flex items-baseline gap-4 ${i > 0 ? 'sm:border-l sm:border-ink/10 sm:pl-8' : ''}`}>
              <span className="font-mono text-xs text-gold">0{i + 1}</span>
              <div>
                <p className="font-display text-xl font-semibold text-ink">{pillar}</p>
                <p className="mt-0.5 text-xs uppercase tracking-[0.18em] text-muted">{PILLAR_NOTES[pillar]}</p>
              </div>
            </div>
          ))}
          <div className="hidden items-center justify-end sm:flex">
            <MoveDown aria-hidden="true" className="h-4 w-4 animate-bounce text-gold" />
          </div>
        </div>
      </div>

      <p className="sr-only">{content.brand.statement}</p>
    </section>
  );
}
