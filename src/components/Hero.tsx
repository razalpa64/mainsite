import { useEffect, useRef } from 'react';
import { MoveDown } from 'lucide-react';

import { content, hero } from '@/lib/content';
import { gsap, EASE } from '@/lib/gsap';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { Button } from '@/components/ui/Button';
import { SplitLines } from '@/components/ui/SplitLines';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { HeroCanvas } from '@/components/HeroCanvas';

export interface HeroProps {
  booted: boolean;
}

/**
 * ARRIVE — the cinematic opening statement. A full-bleed orbital 3D visual sits
 * to the right while an oversized headline asserts the brand.
 */
export function Hero({ booted }: HeroProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !booted) return;

    const lines = root.querySelectorAll<HTMLElement>('[data-line-inner]');
    const fades = root.querySelectorAll<HTMLElement>('[data-hero-fade]');

    if (prefersReducedMotion) {
      gsap.set([...lines, ...fades], { clearProps: 'all' });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: EASE.expo } });

    tl.fromTo(
      root.querySelector('[data-hero-eyebrow]'),
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9 },
      0.1,
    )
      .fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.12 }, 0.25)
      .fromTo(fades, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0, stagger: 0.1 }, 0.7);

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
      {/* Ambient background washes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 45% at 78% 30%, rgba(38,71,224,0.07), transparent 62%), radial-gradient(70% 55% at 10% 95%, rgba(231,226,216,0.6), transparent 60%), linear-gradient(180deg, var(--color-paper) 0%, var(--color-paper-2) 100%)',
        }}
      />

      {/* Orbital 3D visual */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-[-30%] w-[150%] opacity-60 sm:right-[-15%] sm:w-[120%] md:right-[-4%] md:w-[60%] md:opacity-100"
      >
        <HeroCanvas />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-5 pb-10 pt-32 md:px-10">
        <div data-hero-eyebrow className="opacity-0">
          <SectionLabel label={hero.eyebrow} />
        </div>

        <h1 className="mt-8 max-w-[16ch] text-[clamp(2.8rem,8.5vw,7.5rem)] font-extrabold leading-[0.98] tracking-[-0.03em] text-ink">
          <SplitLines as="span" lines={hero.headlineLines} trigger="none" innerClassName="text-ink" />
        </h1>

        <p data-hero-fade className="mt-8 max-w-xl text-base leading-relaxed text-muted opacity-0 md:text-lg">
          {hero.statement}
        </p>

        <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-4 opacity-0">
          <Button href={hero.primaryCta.href} variant="solid" size="lg">
            {hero.primaryCta.label}
          </Button>
          <Button href={hero.secondaryCta.href} variant="ghost" size="lg" withArrow>
            {hero.secondaryCta.label}
          </Button>
        </div>
      </div>

      {/* Bottom meta strip */}
      <div data-hero-fade className="relative z-10 opacity-0">
        <div className="hairline mx-auto w-full max-w-[1400px]" />
        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-2 items-end gap-6 px-5 py-6 md:grid-cols-4 md:px-10">
          {hero.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="tnum text-2xl font-bold tracking-tight text-ink md:text-3xl">
                {stat.value}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink/50">
                {stat.label}
              </span>
            </div>
          ))}

          <div className="col-span-2 flex items-center justify-start gap-3 md:col-span-1 md:justify-end">
            <MoveDown aria-hidden="true" className="h-4 w-4 animate-bounce text-cobalt" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/50">
              {hero.scrollCue}
            </span>
          </div>
        </div>
      </div>

      <p className="sr-only">{content.brand.statement}</p>
    </section>
  );
}
