import { philosophy } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';
import { SectionLabel } from '@/components/ui/SectionLabel';

/**
 * BELIEVE (part three) — the operating principles, set as monumental editorial
 * type against a sticky framing column.
 */
export function Philosophy() {
  return (
    <section id={philosophy.id} className="relative bg-paper-2 py-28 md:py-40">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-14 px-5 md:px-10 lg:grid-cols-12">
        {/* Sticky frame */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionLabel index="06" label={philosophy.label} />
            <h2 className="mt-8 text-[clamp(2rem,4vw,3.4rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-ink">
              {philosophy.title}
            </h2>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-muted">{philosophy.lead}</p>
          </div>
        </div>

        {/* Principles */}
        <div className="lg:col-span-8">
          <div className="flex flex-col">
            {philosophy.principles.map((principle, i) => (
              <Reveal
                key={principle.name}
                delay={0.05}
                className={`group grid grid-cols-1 gap-6 py-12 md:grid-cols-12 md:py-16 ${
                  i > 0 ? 'border-t border-ink/10' : ''
                }`}
              >
                <span className="font-mono text-sm text-cobalt md:col-span-2">
                  {principle.index}
                </span>
                <div className="md:col-span-10">
                  <h3 className="text-3xl font-extrabold tracking-tight text-ink transition-transform duration-500 group-hover:translate-x-2 md:text-5xl">
                    {principle.name}
                  </h3>
                  <p className="mt-3 text-lg font-medium text-ink/70 md:text-xl">
                    {principle.statement}
                  </p>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
                    {principle.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
