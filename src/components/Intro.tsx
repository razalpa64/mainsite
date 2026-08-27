import { intro } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';
import { SplitLines } from '@/components/ui/SplitLines';
import { SectionLabel } from '@/components/ui/SectionLabel';

/**
 * UNDERSTAND — the parent-company statement: one brand, three crafts.
 */
export function Intro() {
  return (
    <section id={intro.id} className="relative bg-paper py-28 md:py-36">
      <div className="mx-auto w-full max-w-[1300px] px-5 md:px-10">
        <SectionLabel index="01" label={intro.label} />

        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-12">
          <h2 className="md:col-span-7 font-display text-[clamp(1.9rem,4vw,3.4rem)] font-medium leading-[1.12] tracking-[-0.01em] text-ink">
            <SplitLines as="span" lines={intro.statementLines} />
          </h2>

          <div className="md:col-span-4 md:col-start-9 flex flex-col gap-6 md:pt-2">
            {intro.body.map((paragraph, i) => (
              <Reveal key={i} as="p" delay={0.1 * i} className="text-base leading-relaxed text-muted">
                {paragraph}
              </Reveal>
            ))}
            <Reveal delay={0.25} className="gold-rule w-24" />
          </div>
        </div>
      </div>
    </section>
  );
}
