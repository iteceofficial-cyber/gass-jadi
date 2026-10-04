/**
 * Serve images from /img directory, external URLs, or uploaded data URLs.
 */
export function img(file: string, _width = 1200) {
  if (!file) return '/img/hero.png'
  if (
    file.startsWith('http://') ||
    file.startsWith('https://') ||
    file.startsWith('//') ||
    file.startsWith('data:') ||
    file.startsWith('blob:')
  ) {
    return file
  }
  return file.startsWith('/') ? file : `/img/${file}`
}

/** A responsive srcSet for the given widths (omitted for data/blob URLs). */
export function srcSet(file: string, widths: number[] = [480, 800, 1200, 1800]): string | undefined {
  if (!file || file.startsWith('data:') || file.startsWith('blob:')) {
    return undefined
  }
  const url = img(file)
  return widths.map((w) => `${url} ${w}w`).join(', ')
}

/**
 * Compress and resize an uploaded image File into a lightweight base64 data URL
 * so it can be persisted safely in localStorage.
 */
export function readAndCompressImage(file: File, maxWidth = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'))
    reader.onload = () => {
      const result = String(reader.result || '')
      const image = new Image()
      image.onerror = () => resolve(result)
      image.onload = () => {
        try {
          const scale = image.width > maxWidth ? maxWidth / image.width : 1
          const canvas = document.createElement('canvas')
          canvas.width = Math.round(image.width * scale)
          canvas.height = Math.round(image.height * scale)
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            resolve(result)
            return
          }
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
          const compressed = canvas.toDataURL('image/jpeg', quality)
          resolve(compressed)
        } catch {
          resolve(result)
        }
      }
      image.src = result
    }
    reader.readAsDataURL(file)
  })
}
