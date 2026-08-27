# INVYTRA — Main Website

The official parent-brand site for the **Invytra** ecosystem: a technology and
creative company building digital products, learning experiences and new ventures
under one direction.

Built as a premium, editorial-tech marketing site — not a template. Light warm-ivory
surfaces with deep charcoal type and a single restrained cobalt accent, cinematic
motion, and a fully content-driven architecture.

---

## Quick start

```bash
npm install        # install dependencies
npm run dev        # start the dev server (http://localhost:5173)
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build
npm run images     # regenerate responsive image variants + manifest
```

> Requires Node ≥ 20.19.

---

## Stack

- **React 19 + TypeScript** with **Vite**
- **Tailwind CSS v4** (design tokens defined in `src/index.css` under `@theme`)
- **GSAP + ScrollTrigger** for scroll choreography
- **Lenis** for smooth scrolling
- **Lucide React** for icons
- **Three.js** (dynamically imported, tree-shaken) for the hero orbital visual
- Self-hosted **Manrope Variable** + **Geist Mono** (no third-party font CDNs)

No Bootstrap, no UI component libraries — the visual system is hand-built.

---

## Content management (the important part)

Everything the site renders — brand copy, hero, navigation, the ecosystem tree,
ventures, services, philosophy, about, vision, contact, socials and footer — lives
in a **single JSON file**:

```
src/data/site.json
```

The UI never hardcodes this content. To add/remove/edit a venture, change an image,
update contact details or tweak copy, edit `site.json` and save — no component
changes needed.

The typed data layer is in `src/lib/content.ts`. It resolves derived values
(e.g. the hero's `auto:pillars` / `auto:ventures` figures are **counted from the
data at runtime — never invented**) and is the single seam for a future backend:
swap `loadContent()` to a Supabase/CMS/API query returning the same `SiteContent`
shape and the whole site follows.

### Adding a venture

Append an object to `ventures.items` in `site.json`:

```json
{
  "id": "invytra-x",
  "name": "Invytra X",
  "category": "Technology",
  "status": "Concept",
  "year": "Forming",
  "description": "…",
  "image": "/assets/images/ventures/x.jpg",
  "url": "",
  "ctaLabel": "Coming Soon"
}
```

The ventures rail, the footer ventures column and the counts all update automatically.
Set a real `url` + `"status": "Active"` and the card becomes a live link and is counted
as an active venture. The featured section reads `featuredVenture.ventureId`.

---

## Images

Raw artwork lives in `src/assets/raw/` (gitignored — it never ships). The pipeline in
`scripts/optimize-images.mjs` crops each source to its target aspect ratio and emits
responsive WebP + JPEG variants plus a base64 blur-up placeholder into
`public/assets/images/`, then writes `src/assets/images/manifest.json`.

Add a new image by dropping a file in `src/assets/raw/`, adding a spec line in the
script, referencing the public path in `site.json`, and running `npm run images`.

`<ResponsiveImage />` reads the manifest to set the exact aspect ratio (zero layout
shift), srcset/sizes, lazy loading and a graceful fade-in; missing images degrade to an
art-directed placeholder surface rather than a broken asset.

---

## Structure

```
src/
  components/        # Preloader, Navbar, Hero, Intro, Ecosystem, Ventures,
                     # FeaturedVenture, Services, Philosophy, About, Vision,
                     # Contact, Footer + ui/ primitives
  components/ui/     # Button, Reveal, SplitLines, ResponsiveImage, SectionLabel
  data/site.json     # ALL site content
  lib/               # content, images, scroll, gsap
  hooks/             # useSmoothScroll, useMagnetic, useMediaQuery, useInView
  types/site.ts      # content type contract
  assets/images/     # generated manifest
public/
  assets/images/     # optimized responsive variants
  favicon*, robots.txt, sitemap.xml
```

---

## Experience & accessibility

- Emotional arc: **ARRIVE → UNDERSTAND → EXPLORE → BELIEVE → IMAGINE → ACT**.
- Smooth scrolling (Lenis), pinned horizontal ventures showcase, line-mask type
  reveals, magnetic CTAs, parallax imagery, cursor-aware hero visual.
- `prefers-reduced-motion` is respected everywhere: the preloader is skipped, the
  hero renders a still frame, the ventures rail becomes a native snap-scroll row and
  reveals render statically.
- Semantic landmarks, keyboard-focusable interactive elements, visible focus states,
  alt text, AA-contrast type and a logical heading hierarchy.
- No fake statistics, no lorem ipsum, no placeholder sections.

## SEO

Proper `<title>`, meta description, Open Graph / Twitter cards, canonical placeholder,
`robots.txt`, and a sitemap-ready `public/sitemap.xml`. Update `meta.siteUrl` /
`meta.canonical` in `site.json` and the canonical/OG URLs in `index.html` when the
real domain is confirmed.
