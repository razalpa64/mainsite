import { vision, brand } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';
import { SplitLines } from '@/components/ui/SplitLines';
import { SectionLabel } from '@/components/ui/SectionLabel';

/**
 * IMAGINE — dark stage, expanding gold rings, oversized declaration, and the
 * three pillars carried forward.
 */
export function Vision() {
  return (
    <section id={vision.id} className="grain relative overflow-hidden bg-ink py-32 text-paper md:py-44">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/20"
            style={{ animation: `ring-pulse 6s ease-out ${i * 1.5}s infinite backwards` }}
          />
        ))}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(60% 50% at 50% 50%, rgba(179,135,62,0.14), transparent 70%)' }}
      />

      <div className="relative mx-auto flex w-full max-w-[1300px] flex-col items-center px-5 text-center md:px-10">
        <SectionLabel index="06" label={vision.label} tone="light" />

        <h2 className="mt-10 font-display text-[clamp(2.6rem,7vw,6.4rem)] font-medium leading-[1.0] tracking-[-0.01em]">
          <SplitLines as="span" lines={vision.headline.split('\n')} />
        </h2>

        <Reveal as="p" className="mt-8 max-w-2xl text-base leading-relaxed text-paper/60 md:text-lg">
          {vision.body}
        </Reveal>

        <Reveal className="mt-14 flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {brand.pillars.map((pillar, i) => (
            <span key={pillar} className="flex items-center gap-6 md:gap-10">
              {i > 0 && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-gold" />}
              <span className="font-display text-2xl font-medium uppercase tracking-[0.3em] text-paper/80 md:text-3xl">
                {pillar}
              </span>
            </span>
          ))}
        </Reveal>

        <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.3em] text-paper/40">{vision.note}</p>
      </div>
    </section>
  );
}
