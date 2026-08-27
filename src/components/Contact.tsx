import { contact, socials } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';

/**
 * ACT — the final invitation, with a channel for each business.
 */
export function Contact() {
  const channels = [contact.email, ...contact.secondary];

  return (
    <section id={contact.id} className="relative overflow-hidden bg-paper py-28 md:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(50% 40% at 50% 100%, rgba(179,135,62,0.08), transparent 60%)' }}
      />

      <div className="relative mx-auto flex w-full max-w-[1300px] flex-col px-5 md:px-10">
        <div className="flex justify-center">
          <SectionLabel index="06" label={contact.label} />
        </div>

        <h2 className="mx-auto mt-10 max-w-4xl text-center font-display text-[clamp(2.4rem,5.6vw,5rem)] font-medium leading-[1.05] tracking-[-0.01em] text-ink">
          {contact.headline}
        </h2>

        <Reveal as="p" className="mx-auto mt-7 max-w-xl text-center text-base leading-relaxed text-muted md:text-lg">
          {contact.body}
        </Reveal>

        <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button href={contact.primaryCta.href} variant="solid" size="lg" external={contact.primaryCta.href.startsWith('mailto:')} withArrow>
            {contact.primaryCta.label}
          </Button>
          <Button href={contact.secondaryCta.href} variant="ghost" size="lg">
            {contact.secondaryCta.label}
          </Button>
        </Reveal>

        {/* channels per business */}
        <Reveal className="mx-auto mt-16 w-full max-w-5xl">
          <div className="grid grid-cols-1 divide-y divide-ink/10 rounded-3xl border border-ink/10 bg-paper-2 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
            {channels.map((detail) => (
              <a
                key={detail.label}
                href={detail.href}
                className="group flex flex-col gap-1.5 p-7 text-center transition-colors hover:bg-paper"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">{detail.label}</span>
                <span className="text-sm font-bold tracking-tight text-ink underline-offset-4 group-hover:underline md:text-base">
                  {detail.value}
                </span>
              </a>
            ))}
          </div>
          <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40">
            {contact.responseNote}
          </p>
        </Reveal>

        <Reveal className="mt-12 flex flex-wrap items-center justify-center gap-8">
          {socials.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex items-baseline gap-2 text-sm font-semibold tracking-tight text-ink/60 transition-colors hover:text-ink"
            >
              {social.label}
              <span className="font-mono text-xs text-ink/35 transition-colors group-hover:text-gold">{social.handle}</span>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
