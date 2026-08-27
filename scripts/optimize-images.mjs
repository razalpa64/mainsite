/**
 * Invytra image pipeline.
 *
 * Reads raw artwork from `src/assets/raw/<name>.jpg`, crops each to its target
 * aspect ratio, emits responsive WebP variants (+ JPEG fallbacks) and a tiny
 * base64 placeholder, then writes everything to `public/assets/images/` and a
 * manifest to `src/assets/images/manifest.json`.
 *
 * The manifest is the single runtime reference for aspect ratios and srcsets,
 * so images are never stretched and layout shift is avoided. Raw files are kept
 * out of the published bundle (gitignored) — only the manifest + optimized
 * variants ship.
 */
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const RAW_DIR = path.join(root, 'src', 'assets', 'raw');
const OUT_DIR = path.join(root, 'public', 'assets', 'images');
const MANIFEST_PATH = path.join(root, 'src', 'assets', 'images', 'manifest.json');

/** Which responsive widths to emit per image class. */
const WIDTHS = { portrait: [640, 1024], square: [480, 960] };

/**
 * Source -> target. `kind` selects width list + ratio; `exact` overrides with a
 * fixed pixel size (used for the OG cover).
 */
const SPEC = [
  { src: 'ventures-learning.jpg', out: 'ventures/learning.jpg', kind: 'portrait' },
  { src: 'ventures-labs.jpg', out: 'ventures/labs.jpg', kind: 'portrait' },
  { src: 'ventures-studio.jpg', out: 'ventures/studio.jpg', kind: 'portrait' },
  { src: 'ventures-platform.jpg', out: 'ventures/platform.jpg', kind: 'portrait' },
  { src: 'services-digital-products.jpg', out: 'services/digital-products.jpg', kind: 'square' },
  { src: 'services-technology.jpg', out: 'services/technology.jpg', kind: 'square' },
  { src: 'services-creative.jpg', out: 'services/creative.jpg', kind: 'square' },
  { src: 'services-education.jpg', out: 'services/education.jpg', kind: 'square' },
  { src: 'about-direction.jpg', out: 'about/direction.jpg', kind: 'portrait' },
  { src: 'about-craft.jpg', out: 'about/craft.jpg', kind: 'portrait', optional: true },
  { src: 'og-cover.jpg', out: 'og/cover.jpg', kind: 'og', exact: { width: 1200, height: 630 } },
];

const RATIO = { portrait: 1024 / 1536, square: 1 };

function hash(input) {
  return createHash('md5').update(input).digest('hex').slice(0, 8);
}

async function processEntry(entry) {
  const rawPath = path.join(RAW_DIR, entry.src);
  if (!fs.existsSync(rawPath)) {
    if (entry.optional) {
      console.warn(`• skipped (missing, optional): ${entry.src}`);
      return null;
    }
    throw new Error(`Missing raw image: ${entry.src}`);
  }

  const meta = await sharp(rawPath).metadata();
  const srcW = meta.width ?? 1000;
  const srcH = meta.height ?? 1000;

  let targetW;
  let targetH;
  if (entry.exact) {
    targetW = entry.exact.width;
    targetH = entry.exact.height;
  } else {
    const ratio = RATIO[entry.kind];
    // Crop source to the target ratio, centred.
    const srcRatio = srcW / srcH;
    let cropW;
    let cropH;
    if (srcRatio > ratio) {
      cropH = srcH;
      cropW = Math.round(srcH * ratio);
    } else {
      cropW = srcW;
      cropH = Math.round(srcW / ratio);
    }
    const base = sharp(rawPath).extract({
      left: Math.round((srcW - cropW) / 2),
      top: Math.round((srcH - cropH) / 2),
      width: cropW,
      height: cropH,
    });

    const widths = WIDTHS[entry.kind].filter((w) => w <= cropW);
    if (widths.length === 0) widths.push(Math.round(cropW));

    targetW = widths[widths.length - 1];
    targetH = Math.round(targetW / ratio);

    const variants = [];
    for (const w of widths) {
      const h = Math.round(w / ratio);
      const outBase = entry.out.replace(/\.jpg$/, '');
      const webpName = `${outBase}-${w}.webp`;
      const jpgName = `${outBase}-${w}.jpg`;
      ensureDir(path.join(OUT_DIR, path.dirname(webpName)));

      await base
        .clone()
        .resize({ width: w, height: h, fit: 'cover' })
        .webp({ quality: 82, effort: 5 })
        .toFile(path.join(OUT_DIR, webpName));

      await base
        .clone()
        .resize({ width: w, height: h, fit: 'cover' })
        .jpeg({ quality: 82, mozjpeg: true })
        .toFile(path.join(OUT_DIR, jpgName));

      variants.push({ width: w, webp: `/assets/images/${webpName}`, jpg: `/assets/images/${jpgName}` });
    }

    // Tiny base64 placeholder for blur-up.
    const lqipBuf = await base
      .clone()
      .resize({ width: 16, height: Math.max(1, Math.round(16 / ratio)), fit: 'fill' })
      .webp({ quality: 60 })
      .toBuffer();
    const lqip = `data:image/webp;base64,${lqipBuf.toString('base64')}`;

    return { entry, variants, lqip, width: targetW, height: targetH };
  }

  // ── Exact-size path (OG cover) ──
  const outBase = entry.out.replace(/\.jpg$/, '');
  ensureDir(path.join(OUT_DIR, path.dirname(outBase)));
  await sharp(rawPath)
    .resize({ width: targetW, height: targetH, fit: 'cover' })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(OUT_DIR, entry.out));
  await sharp(rawPath)
    .resize({ width: targetW, height: targetH, fit: 'cover' })
    .webp({ quality: 84, effort: 5 })
    .toFile(path.join(OUT_DIR, `${outBase}.webp`));

  const lqipBuf = await sharp(rawPath)
    .resize({ width: 16, height: Math.max(1, Math.round(16 * (targetH / targetW))), fit: 'fill' })
    .webp({ quality: 60 })
    .toBuffer();

  return {
    entry,
    variants: [
      { width: targetW, webp: `/assets/images/${outBase}.webp`, jpg: `/assets/images/${entry.out}` },
    ],
    lqip: `data:image/webp;base64,${lqipBuf.toString('base64')}`,
    width: targetW,
    height: targetH,
  };
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function run() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const manifest = {};

  for (const entry of SPEC) {
    const result = await processEntry(entry);
    if (!result) continue;

    const key = `/assets/images/${entry.out}`;
    const largest = result.variants[result.variants.length - 1];
    const webpSrcset = result.variants.map((v) => `${v.webp} ${v.width}w`).join(', ');
    const jpgSrcset = result.variants.map((v) => `${v.jpg} ${v.width}w`).join(', ');

    manifest[key] = {
      src: largest.webp,
      fallbackSrc: largest.jpg,
      srcset: webpSrcset,
      srcsetFallback: jpgSrcset,
      width: result.width,
      height: result.height,
      lqip: result.lqip,
      hash: hash(fs.readFileSync(path.join(RAW_DIR, entry.src))),
    };

    console.log(`✓ ${entry.src} → ${key} (${result.width}×${result.height})`);
  }

  ensureDir(path.dirname(MANIFEST_PATH));
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`\nWrote manifest with ${Object.keys(manifest).length} entries.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
