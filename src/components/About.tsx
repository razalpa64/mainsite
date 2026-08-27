import { about } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';
import { SplitLines } from '@/components/ui/SplitLines';
import { SectionLabel } from '@/components/ui/SectionLabel';

/**
 * BELIEVE — the parent-company self-portrait: one brand, three crafts, one standard.
 */
export function About() {
  return (
    <section id={about.id} className="relative bg-paper-2 py-28 md:py-36">
      <div className="mx-auto grid w-full max-w-[1300px] grid-cols-1 gap-12 px-5 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionLabel index="04" label={about.label} />
          <h2 className="mt-8 font-display text-[clamp(2.2rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.01em] text-ink">
            <SplitLines as="span" lines={about.headlineLines} />
          </h2>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-4 lg:col-start-9 lg:pt-2">
          {about.body.map((paragraph, i) => (
            <Reveal key={i} as="p" delay={0.1 * i} className="text-base leading-relaxed text-muted">
              {paragraph}
            </Reveal>
          ))}
          <Reveal className="mt-2 border-l-2 border-gold pl-6">
            <p className="font-display text-2xl font-medium italic text-ink">{about.visionStatement}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
