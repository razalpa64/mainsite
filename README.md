# INVYTRA — Parent Company Website

The official parent-brand site for **Invytra**: one company, three businesses —
**Invytra Learning (LEARN)**, **Invytra Projects (CREATE)** and **Invytra Events
(CELEBRATE)** — under the banner *"Ideas today. Impact tomorrow."*

Luxury editorial identity drawn from the provided logo: warm ivory, soft black and
signature **gold**, with a **serif display face (Playfair Display)** + Manrope body +
Geist Mono micro-labels.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
npm run preview
npm run images     # regenerate responsive image variants + manifest
npm run smoke      # SSR render-path smoke test
```

> Requires Node ≥ 20.19.

---

## Stack

- **React 19 + TypeScript + Vite**
- **Tailwind CSS v4** (tokens in `src/index.css` under `@theme` — gold/ivory/ink, serif display)
- **GSAP + ScrollTrigger**, **Lenis** smooth scroll, **Lucide React**
- Self-hosted **Playfair Display Variable**, **Manrope Variable**, **Geist Mono**
- No 3D, no Bootstrap, no UI libraries — the visual system is hand-built.

---

## Brand structure (the important part)

The site presents Invytra as the **parent** over three distinct businesses, mapped to
the brand pillars:

| Pillar    | Business         | Focus                                        |
|-----------|------------------|----------------------------------------------|
| LEARN     | Invytra Learning | Online tutoring, courses, academic support    |
| CREATE    | Invytra Projects | College/final-year projects — *idea → working* |
| CELEBRATE | Invytra Events   | Weddings, college/corporate events, invitations |

All copy, businesses, reviews, contact channels, socials and footer live in
**`src/data/site.json`** — edit it and the whole site updates. The typed, CMS-swappable
data layer is `src/lib/content.ts`; the contract is `src/types/site.ts`.

---

## Logo

The brand lockup is rebuilt as crisp vector/type in `src/components/ui/Logo.tsx`
(serif INVYTRA with gold "Y" + gold dot, "IV" book monogram, gold rule + leaf, tagline
and LEARN·CREATE·CELEBRATE). If you drop the original asset at
`public/assets/brand/logo-full.png`, swap `<FullLockup/>` for an `<img>` and everything
keeps working.

---

## Images

Raw artwork in `src/assets/raw/` (gitignored). `scripts/optimize-images.mjs` crops to
target ratios and emits responsive WebP/JPEG + blur-up placeholders into
`public/assets/images/`, writing `src/assets/images/manifest.json`.
`<ResponsiveImage/>` guarantees correct aspect ratio (zero CLS), lazy loading and a
graceful fade-in.

---

## Structure

```
src/components/   Preloader, Navbar, Hero, Intro, Businesses, Reviews,
                  About, Vision, Contact, Footer + ui/ (Logo, Button, Reveal,
                  SplitLines, ResponsiveImage, SectionLabel)
src/data/site.json  ALL content
```

Experience: ARRIVE → UNDERSTAND → EXPLORE (3 businesses) → BELIEVE (reviews/about) →
IMAGINE → ACT. `prefers-reduced-motion`, a11y, SEO (OG, canonical placeholder, robots,
sitemap) all handled. No fake statistics, no lorem ipsum.
