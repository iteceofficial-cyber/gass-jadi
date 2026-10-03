/**
 * Serve images from /img directory or external URLs.
 */
export function img(file: string, _width = 1200) {
  if (!file) return '/img/hero.png'
  if (file.startsWith('http://') || file.startsWith('https://') || file.startsWith('//')) {
    return file
  }
  return file.startsWith('/') ? file : `/img/${file}`
}

/** A responsive srcSet for the given widths. */
export function srcSet(file: string, widths: number[] = [480, 800, 1200, 1800]) {
  const url = img(file)
  return widths.map((w) => `${url} ${w}w`).join(', ')
}
