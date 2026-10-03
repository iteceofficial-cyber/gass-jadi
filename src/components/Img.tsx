import { img, srcSet } from '@/lib/img'

/** Lazy-loaded, CDN-optimised image from /public/img. */
export function Img({
  file,
  alt,
  sizes = '(min-width: 1024px) 33vw, 100vw',
  className = '',
  eager = false,
  width = 1200,
}: {
  file: string
  alt: string
  sizes?: string
  className?: string
  eager?: boolean
  width?: number
}) {
  return (
    <img
      src={img(file, width)}
      srcSet={srcSet(file)}
      sizes={sizes}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : undefined}
      className={className}
    />
  )
}
