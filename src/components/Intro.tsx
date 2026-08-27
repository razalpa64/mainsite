import { intro } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';
import { SplitLines } from '@/components/ui/SplitLines';
import { SectionLabel } from '@/components/ui/SectionLabel';

/**
 * UNDERSTAND — the editorial statement of the company's core idea, followed by
 * the four guiding actions rendered as an index row rather than cards.
 */
export function Intro() {
  return (
    <section id={intro.id} className="relative bg-paper py-28 md:py-40">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <SectionLabel index="01" label={intro.label} />

        <div className="mt-14 grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-10">
          {/* Large statement */}
          <h2 className="md:col-span-7 text-[clamp(1.9rem,4.2vw,3.6rem)] font-bold leading-[1.08] tracking-[-0.02em] text-ink">
            <SplitLines as="span" lines={intro.statementLines} />
          </h2>

          {/* Supporting body */}
          <div className="md:col-span-4 md:col-start-9 flex flex-col gap-6 md:pt-3">
            {intro.body.map((paragraph, i) => (
              <Reveal key={i} as="p" delay={0.1 * i} className="text-base leading-relaxed text-muted">
                {paragraph}
              </Reveal>
            ))}
          </div>
        </div>

        {/* Principles index row */}
        <div className="mt-24">
          <div className="hairline w-full" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {intro.principles.map((principle, i) => (
              <Reveal
                key={principle.name}
                delay={i * 0.08}
                className={`group relative flex flex-col gap-4 py-10 pr-8 ${i > 0 ? 'border-t border-ink/10 sm:border-t-0 sm:border-l' : ''}`}
              >
                <span className="font-mono text-xs text-cobalt">{principle.index}</span>
                <h3 className="text-2xl font-bold tracking-tight text-ink transition-transform duration-500 group-hover:translate-x-1">
                  {principle.name}
                </h3>
                <p className="text-sm leading-relaxed text-muted">{principle.description}</p>
              </Reveal>
            ))}
          </div>
          <div className="hairline w-full" />
        </div>
      </div>
    </section>
  );
}
