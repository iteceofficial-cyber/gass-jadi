import { useEffect, useState } from 'react'
import { testimonials as defaultTestimonials, type Testimonial } from '@/data/testimonials'

const STORAGE_KEY = 'gj:testimonials:v1'

const TONES = [
  'bg-forest text-cream',
  'bg-ember text-white',
  'bg-leaf text-cream',
  'bg-ink text-cream',
]

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'GJ'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function getRandomTone(seed = 0): string {
  return TONES[Math.abs(seed) % TONES.length]
}

export function getStoredTestimonials(): Testimonial[] {
  if (typeof window === 'undefined') return defaultTestimonials
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultTestimonials
    const parsed = JSON.parse(raw) as Testimonial[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultTestimonials
  } catch {
    return defaultTestimonials
  }
}

export function saveStoredTestimonials(list: Testimonial[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    window.dispatchEvent(new CustomEvent('gj:testimonials-change'))
  } catch {
    // ignore quota errors
  }
}

export function upsertTestimonial(item: Testimonial): Testimonial[] {
  const current = getStoredTestimonials()
  const id = item.id || `rev-${Date.now()}`
  const normalized: Testimonial = {
    ...item,
    id,
    initials: item.initials?.trim() || getInitials(item.name),
    tone: item.tone?.trim() || getRandomTone(current.length),
  }
  const idx = current.findIndex((t) => t.id === id)
  const next = idx >= 0 ? current.map((t, i) => (i === idx ? normalized : t)) : [normalized, ...current]
  saveStoredTestimonials(next)
  return next
}

export function deleteTestimonial(id: string): Testimonial[] {
  const current = getStoredTestimonials()
  const next = current.filter((t, idx) => (t.id || `rev-${idx}`) !== id)
  saveStoredTestimonials(next)
  return next
}

export function resetTestimonialsToDefault(): Testimonial[] {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new CustomEvent('gj:testimonials-change'))
  }
  return defaultTestimonials
}

export function useTestimonials(): Testimonial[] {
  const [list, setList] = useState<Testimonial[]>(defaultTestimonials)

  useEffect(() => {
    const sync = () => setList(getStoredTestimonials())
    sync()
    window.addEventListener('gj:testimonials-change', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('gj:testimonials-change', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  return list
}
