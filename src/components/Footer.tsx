import { footer, brand, socials, ventures, navigation, contact } from '@/lib/content';
import { scrollToAnchor } from '@/lib/scroll';

/**
 * A premium, minimal close to the page. Ventures and connect columns are derived
 * from the same configuration that drives the rest of the site.
 */
export function Footer() {
  const year = new Date().getFullYear();

  const navigate = (href: string) => (event: React.MouseEvent) => {
    if (href.startsWith('#')) {
      event.preventDefault();
      scrollToAnchor(href, -1);
    }
  };

  return (
    <footer className="grain relative overflow-hidden bg-ink text-paper">
      <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-10 pt-20 md:px-10">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <span className="text-2xl font-extrabold tracking-[0.3em]">{brand.name}</span>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-paper/50">{footer.statement}</p>

            <div className="mt-8 flex gap-5">
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

          {/* Explore */}
          <div className="md:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper/40">
              {footer.columns[0]?.title ?? 'Explore'}
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {(footer.columns[0]?.links ?? navigation.links).map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={navigate(link.href)}
                    className="text-sm text-paper/60 transition-colors hover:text-paper"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Ventures */}
          <div className="md:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper/40">
              {footer.venturesColumnTitle}
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {ventures.items.map((venture) => (
                <li key={venture.id}>
                  {venture.url ? (
                    <a
                      href={venture.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-sm text-paper/60 transition-colors hover:text-paper"
                    >
                      {venture.name}
                    </a>
                  ) : (
                    <span className="text-sm text-paper/40">{venture.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="md:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper/40">
              {footer.connectColumnTitle}
            </p>
            <ul className="mt-5 flex flex-col gap-3 text-sm text-paper/60">
              <li>
                <a href={contact.email.href} className="transition-colors hover:text-paper">
                  {contact.email.value}
                </a>
              </li>
              {contact.secondary.map((detail) => (
                <li key={detail.label} className="text-paper/40">
                  {detail.value}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* legal row */}
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
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-paper/30">
            {footer.colophon}
          </p>
        </div>
      </div>

      {/* watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none overflow-hidden leading-none"
      >
        <span className="block translate-y-[28%] text-center text-[clamp(5rem,18vw,17rem)] font-extrabold tracking-[0.08em] text-paper/[0.05]">
          {brand.name}
        </span>
      </div>
    </footer>
  );
}
