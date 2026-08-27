import { useEffect, useRef } from 'react';

import { about } from '@/lib/content';
import { gsap } from '@/lib/gsap';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { Reveal } from '@/components/ui/Reveal';
import { SplitLines } from '@/components/ui/SplitLines';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';

/**
 * BELIEVE (part four) — the company's self-portrait: no invented history, just
 * vision, philosophy and the ecosystem mindset, set against parallax imagery.
 */
export function About() {
  const rootRef = useRef<HTMLElement | null>(null);
  const firstImageRef = useRef<HTMLDivElement | null>(null);
  const secondImageRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (firstImageRef.current) {
        gsap.fromTo(
          firstImageRef.current,
          { yPercent: 8 },
          {
            yPercent: -6,
            ease: 'none',
            scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      }
      if (secondImageRef.current) {
        gsap.fromTo(
          secondImageRef.current,
          { yPercent: -10 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      }
    }, root);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const [primary, secondary] = about.images;

  return (
    <section id={about.id} ref={rootRef as never} className="relative overflow-hidden bg-paper py-28 md:py-40">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-16 px-5 md:px-10 lg:grid-cols-12">
        {/* Copy */}
        <div className="flex flex-col justify-center lg:col-span-6">
          <SectionLabel index="07" label={about.label} />
          <h2 className="mt-8 text-[clamp(2.2rem,5vw,4.4rem)] font-extrabold leading-[1.04] tracking-[-0.02em] text-ink">
            <SplitLines as="span" lines={about.headlineLines} />
          </h2>

          <div className="mt-8 flex flex-col gap-5">
            {about.body.map((paragraph, i) => (
              <p key={i} className="max-w-xl text-base leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Vision pull-quote */}
          <Reveal className="mt-10 border-l-2 border-cobalt pl-6">
            <p className="text-xl font-semibold leading-snug text-ink md:text-2xl">
              {about.visionStatement}
            </p>
          </Reveal>
        </div>

        {/* Imagery */}
        <div className="relative lg:col-span-6">
          {primary && (
            <div ref={firstImageRef} className="ml-auto w-[78%] overflow-hidden rounded-3xl shadow-lift md:w-[70%]">
              <ResponsiveImage path={primary.src} alt={primary.alt} sizesKind="half" className="aspect-[2/3] w-full" />
            </div>
          )}
          {secondary && (
            <div
              ref={secondImageRef}
              className="absolute -bottom-10 left-0 w-[52%] overflow-hidden rounded-3xl border-4 border-paper shadow-lift md:w-[44%]"
            >
              <ResponsiveImage path={secondary.src} alt={secondary.alt} sizesKind="third" className="aspect-square w-full" />
            </div>
          )}
        </div>
      </div>

      {/* Pillars */}
      <div className="mx-auto mt-28 w-full max-w-[1400px] px-5 md:px-10">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
          {about.pillars.map((pillar, i) => (
            <Reveal key={pillar.name} delay={i * 0.06} className="group flex flex-col gap-4 bg-paper p-8 transition-colors duration-500 hover:bg-paper-2 md:p-10">
              <span className="font-mono text-xs text-cobalt">0{i + 1}</span>
              <h3 className="text-2xl font-extrabold tracking-tight text-ink">{pillar.name}</h3>
              <p className="text-sm leading-relaxed text-muted">{pillar.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
