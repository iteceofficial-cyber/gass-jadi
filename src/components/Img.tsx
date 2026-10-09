import { useState, useEffect } from 'react'
import { img, srcSet, DEFAULT_FALLBACK_IMAGE, SVG_FALLBACK_PLACEHOLDER } from '@/lib/img'

/** Lazy-loaded, error-resilient image with automated fallback to prevent broken UI */
export function Img({
  file,
  alt,
  sizes = '(min-width: 1024px) 33vw, 100vw',
  className = '',
  eager = false,
  width = 1200,
  fallback,
  onClick,
}: {
  file: string | null | undefined
  alt: string
  sizes?: string
  className?: string
  eager?: boolean
  width?: number
  fallback?: string
  onClick?: () => void
}) {
  const [errorCount, setErrorCount] = useState(0)
  const initialSrc = img(file, width)
  const [src, setSrc] = useState(initialSrc)

  useEffect(() => {
    setErrorCount(0)
    setSrc(img(file, width))
  }, [file, width])

  const handleError = () => {
    if (errorCount === 0) {
      // First attempt: fallback to custom or default fallback image
      setErrorCount(1)
      setSrc(fallback ? img(fallback, width) : DEFAULT_FALLBACK_IMAGE)
    } else if (errorCount === 1) {
      // Second attempt: fallback to guaranteed inline SVG placeholder
      setErrorCount(2)
      setSrc(SVG_FALLBACK_PLACEHOLDER)
    }
  }

  const computedSrcSet = errorCount > 0 ? undefined : srcSet(file)

  return (
    <img
      src={src}
      srcSet={computedSrcSet}
      sizes={sizes}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : undefined}
      onError={handleError}
      onClick={onClick}
      className={className}
    />
  )
}
