import { useEffect, useRef } from 'react';
import { MoveDown } from 'lucide-react';

import { content, hero, ventures } from '@/lib/content';
import { gsap, EASE } from '@/lib/gsap';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { Button } from '@/components/ui/Button';
import { SplitLines } from '@/components/ui/SplitLines';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';

export interface HeroProps {
  booted: boolean;
}

/**
 * ARRIVE — a cinematic, editorial hero. No 3D: a confident typographic statement
 * paired with a relevant brand image and two floating venture tiles that make the
 * ecosystem tangible at a glance.
 */
export function Hero({ booted }: HeroProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const imageWrapRef = useRef<HTMLDivElement | null>(null);
  const imageCoverRef = useRef<HTMLDivElement | null>(null);
  const tileARef = useRef<HTMLDivElement | null>(null);
  const tileBRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const [tileA, tileB] = ventures.items;

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !booted) return;

    const lines = root.querySelectorAll<HTMLElement>('[data-line-inner]');
    const fades = root.querySelectorAll<HTMLElement>('[data-hero-fade]');

    if (prefersReducedMotion) {
      gsap.set([...lines, ...fades], { clearProps: 'all' });
      gsap.set([imageCoverRef.current, imageWrapRef.current, tileARef.current, tileBRef.current], {
        clearProps: 'all',
      });
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
      // image curtain reveal
      .fromTo(
        imageCoverRef.current,
        { yPercent: 0 },
        { yPercent: -101, duration: 1.1, ease: EASE.inout },
        0.4,
      )
      .fromTo(
        imageWrapRef.current,
        { scale: 1.15 },
        { scale: 1, duration: 1.6, ease: EASE.out },
        0.4,
      )
      .fromTo(
        [tileARef.current, tileBRef.current],
        { y: 40, opacity: 0, scale: 0.94 },
        { y: 0, opacity: 1, scale: 1, duration: 0.9, stagger: 0.14, ease: EASE.out },
        0.9,
      )
      .fromTo(fades, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0, stagger: 0.1 }, 0.8);

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
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(50% 42% at 82% 22%, rgba(38,71,224,0.07), transparent 62%), radial-gradient(70% 55% at 8% 96%, rgba(231,226,216,0.65), transparent 60%), linear-gradient(180deg, var(--color-paper) 0%, var(--color-paper-2) 100%)',
        }}
      />
      {/* faint watermark */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 left-0 select-none text-[clamp(6rem,20vw,18rem)] font-extrabold leading-none tracking-tight text-ink/[0.035]"
      >
        {content.brand.name}
      </span>

      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 items-center gap-14 px-5 pb-12 pt-32 md:px-10 lg:grid-cols-12 lg:gap-8">
        {/* Copy */}
        <div className="lg:col-span-6">
          <div data-hero-eyebrow className="opacity-0">
            <SectionLabel label={hero.eyebrow} />
          </div>

          <h1 className="mt-8 max-w-[15ch] text-[clamp(2.9rem,7.5vw,6.8rem)] font-extrabold leading-[0.98] tracking-[-0.03em] text-ink">
            <SplitLines as="span" lines={hero.headlineLines} trigger="none" />
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

        {/* Visual composition */}
        <div className="relative lg:col-span-6">
          <div className="relative mx-auto max-w-[520px]">
            {/* main image with curtain */}
            <div className="relative overflow-hidden rounded-[2rem] shadow-lift">
              <div ref={imageWrapRef} className="will-change-transform">
                <ResponsiveImage
                  path={hero.image}
                  alt={hero.imageAlt}
                  sizesKind="half"
                  eager
                  className="aspect-[4/5] w-full"
                />
              </div>
              <div
                ref={imageCoverRef}
                aria-hidden="true"
                className="absolute inset-0 bg-paper-2"
              />
              {/* caption */}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-ink/60 to-transparent p-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper">
                  {hero.visual.label}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-cobalt" />
              </div>
            </div>

            {/* floating venture tiles */}
            {tileA && (
              <div
                ref={tileARef}
                className="absolute -left-6 -top-8 w-40 overflow-hidden rounded-2xl border border-ink/10 bg-paper shadow-card opacity-0 sm:-left-12 sm:w-48"
                style={{ animation: 'drift 7s ease-in-out 1.6s infinite' }}
              >
                <ResponsiveImage path={tileA.image} alt={tileA.name} sizesKind="third" aspect="4 / 3" className="w-full" />
                <div className="flex items-center justify-between px-3 py-2.5">
                  <span className="text-xs font-bold tracking-tight text-ink">{tileA.name}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-cobalt" />
                </div>
              </div>
            )}
            {tileB && (
              <div
                ref={tileBRef}
                className="absolute -bottom-8 -right-4 w-40 overflow-hidden rounded-2xl border border-ink/10 bg-paper shadow-card opacity-0 sm:-right-10 sm:w-48"
                style={{ animation: 'drift 8s ease-in-out 2s infinite' }}
              >
                <ResponsiveImage path={tileB.image} alt={tileB.name} sizesKind="third" aspect="4 / 3" className="w-full" />
                <div className="flex items-center justify-between px-3 py-2.5">
                  <span className="text-xs font-bold tracking-tight text-ink">{tileB.name}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom meta strip */}
      <div data-hero-fade className="relative z-10 opacity-0">
        <div className="hairline mx-auto w-full max-w-[1400px]" />
        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-2 items-end gap-6 px-5 py-6 md:grid-cols-4 md:px-10">
          {hero.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="tnum text-2xl font-extrabold tracking-tight text-ink md:text-3xl">
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
