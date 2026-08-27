import type { MouseEvent } from 'react';

import { footer, brand, socials, businesses, contact } from '@/lib/content';
import { scrollToAnchor } from '@/lib/scroll';
import { Logo } from '@/components/ui/Logo';

/**
 * Premium close: full lockup, explore / businesses / connect columns, legal row.
 */
export function Footer() {
  const year = new Date().getFullYear();

  const navigate = (href: string) => (event: MouseEvent) => {
    if (href.startsWith('#')) {
      event.preventDefault();
      scrollToAnchor(href, -1);
    }
  };

  return (
    <footer className="grain relative overflow-hidden bg-ink text-paper">
      <div className="relative mx-auto w-full max-w-[1300px] px-5 pb-12 pt-20 md:px-10">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo tone="light" size="md" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-paper/50">{footer.statement}</p>
            <p className="mt-4 font-display text-sm uppercase tracking-[0.3em] text-gold-soft">
              Learn · Create · Celebrate
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper/40">{footer.exploreTitle}</p>
            <ul className="mt-5 flex flex-col gap-3">
              {footer.explore.map((link) => (
                <li key={link.label}>
                  <a href={link.href} onClick={navigate(link.href)} className="text-sm text-paper/60 transition-colors hover:text-paper">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper/40">{footer.businessesTitle}</p>
            <ul className="mt-5 flex flex-col gap-3">
              {businesses.items.map((business) => (
                <li key={business.id}>
                  <a href="#businesses" onClick={navigate('#businesses')} className="text-sm text-paper/60 transition-colors hover:text-paper">
                    {business.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper/40">{footer.connectTitle}</p>
            <ul className="mt-5 flex flex-col gap-3 text-sm text-paper/60">
              <li>
                <a href={contact.email.href} className="transition-colors hover:text-paper">
                  {contact.email.value}
                </a>
              </li>
              {contact.secondary.map((detail) => (
                <li key={detail.label} className="text-paper/40">
                  {detail.label} — {detail.value}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-5">
              {socials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-xs font-medium uppercase tracking-[0.2em] text-paper/50 transition-colors hover:text-paper"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-paper/10 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-paper/40">
            © {year} {footer.copyright}
          </p>
          <div className="flex gap-6">
            {footer.legal.map((link) => (
              <a key={link.label} href={link.href} className="text-xs text-paper/50 transition-colors hover:text-paper">
                {link.label}
              </a>
            ))}
          </div>
          <p className="font-display text-[11px] uppercase tracking-[0.3em] text-gold-soft">{footer.colophon}</p>
        </div>
      </div>

      <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden leading-none">
        <span className="block translate-y-[28%] text-center font-display text-[clamp(5rem,18vw,16rem)] tracking-[0.08em] text-paper/[0.05]">
          {brand.name}
        </span>
      </div>
    </footer>
  );
}
