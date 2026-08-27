import { vision } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';
import { SplitLines } from '@/components/ui/SplitLines';
import { SectionLabel } from '@/components/ui/SectionLabel';

/**
 * IMAGINE — the emotional peak. A dark, immersive stage with slow expanding
 * orbital rings behind an oversized declaration, then the horizons ahead.
 */
export function Vision() {
  return (
    <section id={vision.id} className="grain relative overflow-hidden bg-ink py-32 text-paper md:py-48">
      {/* expanding orbital rings */}
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cobalt/20"
            style={{ animation: `ring-pulse 6s ease-out ${i * 1.5}s infinite backwards` }}
          />
        ))}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 50%, rgba(38,71,224,0.14), transparent 70%)',
        }}
      />

      <div className="relative mx-auto flex w-full max-w-[1400px] flex-col items-center px-5 text-center md:px-10">
        <SectionLabel index="08" label={vision.label} tone="light" />

        <h2 className="mt-10 text-[clamp(2.6rem,7.5vw,7rem)] font-extrabold leading-[0.98] tracking-[-0.03em]">
          <SplitLines as="span" lines={vision.headline.split('\n')} />
        </h2>

        <Reveal as="p" className="mt-8 max-w-2xl text-base leading-relaxed text-paper/60 md:text-lg">
          {vision.body}
        </Reveal>

        {/* horizons */}
        <div className="mt-20 grid w-full grid-cols-1 gap-px overflow-hidden rounded-3xl border border-paper/10 bg-paper/10 text-left sm:grid-cols-2 lg:grid-cols-4">
          {vision.horizons.map((horizon, i) => (
            <Reveal
              key={horizon.name}
              delay={i * 0.07}
              className="group flex flex-col gap-4 bg-ink/80 p-8 transition-colors duration-500 hover:bg-ink-2"
            >
              <span className="h-1 w-8 bg-cobalt transition-all duration-500 group-hover:w-14" />
              <h3 className="text-xl font-bold tracking-tight">{horizon.name}</h3>
              <p className="text-sm leading-relaxed text-paper/50">{horizon.description}</p>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-paper/40">
          {vision.note}
        </p>
      </div>
    </section>
  );
}
