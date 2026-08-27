import { contact, socials } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';

/**
 * ACT — the final invitation. Oversized type, clear CTAs, and every contact
 * channel pulled from configuration.
 */
export function Contact() {
  return (
    <section id={contact.id} className="relative overflow-hidden bg-paper py-28 md:py-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(50% 40% at 50% 100%, rgba(38,71,224,0.06), transparent 60%)',
        }}
      />

      <div className="relative mx-auto flex w-full max-w-[1400px] flex-col px-5 md:px-10">
        <SectionLabel index="09" label={contact.label} />

        <h2 className="mx-auto mt-12 max-w-5xl text-center text-[clamp(2.4rem,6vw,5.6rem)] font-extrabold leading-[1.02] tracking-[-0.025em] text-ink">
          {contact.headline}
        </h2>

        <Reveal as="p" className="mx-auto mt-8 max-w-xl text-center text-base leading-relaxed text-muted md:text-lg">
          {contact.body}
        </Reveal>

        <Reveal className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Button href={contact.primaryCta.href} variant="solid" size="lg" external={contact.primaryCta.href.startsWith('mailto:')} withArrow>
            {contact.primaryCta.label}
          </Button>
          <Button href={contact.secondaryCta.href} variant="ghost" size="lg">
            {contact.secondaryCta.label}
          </Button>
        </Reveal>

        {/* contact details */}
        <Reveal className="mx-auto mt-20 w-full max-w-4xl">
          <div className="grid grid-cols-1 divide-y divide-ink/10 rounded-3xl border border-ink/10 bg-paper-2 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <a
              href={contact.email.href}
              className="group flex flex-col gap-1.5 p-8 text-center transition-colors hover:bg-paper"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">
                {contact.email.label}
              </span>
              <span className="text-lg font-bold tracking-tight text-ink underline-offset-4 group-hover:underline">
                {contact.email.value}
              </span>
            </a>
            {contact.secondary.map((detail) =>
              detail.href ? (
                <a
                  key={detail.label}
                  href={detail.href}
                  className="group flex flex-col gap-1.5 p-8 text-center transition-colors hover:bg-paper"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">
                    {detail.label}
                  </span>
                  <span className="text-lg font-bold tracking-tight text-ink underline-offset-4 group-hover:underline">
                    {detail.value}
                  </span>
                </a>
              ) : (
                <div key={detail.label} className="flex flex-col gap-1.5 p-8 text-center">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">
                    {detail.label}
                  </span>
                  <span className="text-lg font-bold tracking-tight text-ink">{detail.value}</span>
                </div>
              ),
            )}
          </div>
          <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">
            {contact.responseNote}
          </p>
        </Reveal>

        {/* socials */}
        <Reveal className="mt-14 flex flex-wrap items-center justify-center gap-8">
          {socials.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex items-baseline gap-2 text-sm font-semibold tracking-tight text-ink/60 transition-colors hover:text-ink"
            >
              {social.label}
              <span className="font-mono text-xs text-ink/35 transition-colors group-hover:text-cobalt">
                {social.handle}
              </span>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
