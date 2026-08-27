import { useState, type CSSProperties } from 'react';

import { resolveImage, sizesFor } from '@/lib/images';

export interface ResponsiveImageProps {
  /** public path as referenced in `site.json`, e.g. `/assets/images/ventures/learning.jpg` */
  path: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizesKind?: 'full' | 'half' | 'third' | 'card';
  sizes?: string;
  eager?: boolean;
  style?: CSSProperties;
}

/**
 * Manifest-backed responsive image.
 *
 * Renders a `<picture>` with a WebP srcset and JPEG fallback, reserves the exact
 * intrinsic aspect ratio so there is zero layout shift, blur-ups from a base64
 * placeholder and fades in once decoded. If the image is missing from the
 * manifest it renders an elegant placeholder surface instead of a broken asset.
 */
export function ResponsiveImage({
  path,
  alt,
  className = '',
  imgClassName = '',
  sizesKind = 'full',
  sizes,
  eager = false,
  style,
}: ResponsiveImageProps) {
  const [loaded, setLoaded] = useState(false);
  const image = resolveImage(path);

  if (!image) {
    // Fail-soft: an art-directed placeholder keeps the composition intact.
    return (
      <div
        role="img"
        aria-label={alt}
        className={`invy-img-fallback ${className}`}
        style={style}
      />
    );
  }

  const sizesAttr = sizes ?? sizesFor(sizesKind);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: `${image.width} / ${image.height}`, ...style }}
    >
      <picture>
        <source type="image/webp" srcSet={image.srcset} sizes={sizesAttr} />
        <source type="image/jpeg" srcSet={image.srcsetFallback} sizes={sizesAttr} />
        <img
          src={image.fallbackSrc}
          srcSet={image.srcsetFallback}
          sizes={sizesAttr}
          width={image.width}
          height={image.height}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-[opacity,transform,filter] duration-700 ease-out ${
            loaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-md scale-[1.03]'
          } ${imgClassName}`}
          style={{ backgroundColor: '#0d0e12' }}
        />
      </picture>

      {/* Blur-up placeholder underneath while the real image decodes. */}
      {!loaded && (
        <img
          src={image.lqip}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl"
        />
      )}
    </div>
  );
}
