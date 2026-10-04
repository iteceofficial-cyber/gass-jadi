import { useEffect, useState } from 'react'
import { dishes as defaultDishes, type Dish } from '@/data/culinary'
import { gallery as defaultGallery, type GalleryItem } from '@/data/gallery'
import { experiences as defaultExperiences, type Experience } from '@/data/experiences'

const CULINARY_KEY = 'gj:culinary:v1'
const GALLERY_KEY = 'gj:gallery:v1'
const EXPERIENCES_KEY = 'gj:experiences:v1'

// --- Culinary ---
export function getStoredCulinary(): Dish[] {
  if (typeof window === 'undefined') return defaultDishes
  try {
    const raw = window.localStorage.getItem(CULINARY_KEY)
    if (!raw) return defaultDishes
    const parsed = JSON.parse(raw) as Dish[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultDishes
  } catch {
    return defaultDishes
  }
}

export function saveStoredCulinary(list: Dish[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(CULINARY_KEY, JSON.stringify(list))
    window.dispatchEvent(new CustomEvent('gj:culinary-change'))
  } catch {
    // ignore
  }
}

export function upsertCulinaryItem(item: Dish): Dish[] {
  const current = getStoredCulinary()
  const idx = current.findIndex((c) => c.id === item.id)
  const next = idx >= 0 ? current.map((c, i) => (i === idx ? item : c)) : [...current, item]
  saveStoredCulinary(next)
  return next
}

export function deleteCulinaryItem(id: string): Dish[] {
  const current = getStoredCulinary()
  const next = current.filter((c) => c.id !== id)
  saveStoredCulinary(next)
  return next
}

export function resetCulinaryToDefault(): Dish[] {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(CULINARY_KEY)
    window.dispatchEvent(new CustomEvent('gj:culinary-change'))
  }
  return defaultDishes
}

export function useCulinary(): Dish[] {
  const [list, setList] = useState<Dish[]>(defaultDishes)
  useEffect(() => {
    const sync = () => setList(getStoredCulinary())
    sync()
    window.addEventListener('gj:culinary-change', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('gj:culinary-change', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])
  return list
}

// --- Gallery ---
function withIds(items: GalleryItem[]): GalleryItem[] {
  return items.map((item, idx) => ({
    ...item,
    id: item.id || `gal-${idx}-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
  }))
}

export function getStoredGallery(): GalleryItem[] {
  if (typeof window === 'undefined') return withIds(defaultGallery)
  try {
    const raw = window.localStorage.getItem(GALLERY_KEY)
    if (!raw) return withIds(defaultGallery)
    const parsed = JSON.parse(raw) as GalleryItem[]
    return Array.isArray(parsed) && parsed.length > 0 ? withIds(parsed) : withIds(defaultGallery)
  } catch {
    return withIds(defaultGallery)
  }
}

export function saveStoredGallery(list: GalleryItem[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(GALLERY_KEY, JSON.stringify(list))
    window.dispatchEvent(new CustomEvent('gj:gallery-change'))
  } catch {
    // ignore
  }
}

export function upsertGalleryItem(item: GalleryItem): GalleryItem[] {
  const current = getStoredGallery()
  const id = item.id || `gal-${Date.now()}`
  const normalized = { ...item, id }
  const idx = current.findIndex((g) => g.id === id)
  const next = idx >= 0 ? current.map((g, i) => (i === idx ? normalized : g)) : [normalized, ...current]
  saveStoredGallery(next)
  return next
}

export function deleteGalleryItem(id: string): GalleryItem[] {
  const current = getStoredGallery()
  const next = current.filter((g) => g.id !== id)
  saveStoredGallery(next)
  return next
}

export function resetGalleryToDefault(): GalleryItem[] {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(GALLERY_KEY)
    window.dispatchEvent(new CustomEvent('gj:gallery-change'))
  }
  return withIds(defaultGallery)
}

export function useGallery(): GalleryItem[] {
  const [list, setList] = useState<GalleryItem[]>(() => withIds(defaultGallery))
  useEffect(() => {
    const sync = () => setList(getStoredGallery())
    sync()
    window.addEventListener('gj:gallery-change', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('gj:gallery-change', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])
  return list
}

// --- Experiences ---
export function getStoredExperiences(): Experience[] {
  if (typeof window === 'undefined') return defaultExperiences
  try {
    const raw = window.localStorage.getItem(EXPERIENCES_KEY)
    if (!raw) return defaultExperiences
    const parsed = JSON.parse(raw) as Experience[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultExperiences
  } catch {
    return defaultExperiences
  }
}

export function saveStoredExperiences(list: Experience[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(EXPERIENCES_KEY, JSON.stringify(list))
    window.dispatchEvent(new CustomEvent('gj:experiences-change'))
  } catch {
    // ignore
  }
}

export function upsertExperienceItem(item: Experience): Experience[] {
  const current = getStoredExperiences()
  const idx = current.findIndex((e) => e.id === item.id)
  const next = idx >= 0 ? current.map((e, i) => (i === idx ? item : e)) : [...current, item]
  saveStoredExperiences(next)
  return next
}

export function deleteExperienceItem(id: string): Experience[] {
  const current = getStoredExperiences()
  const next = current.filter((e) => e.id !== id)
  saveStoredExperiences(next)
  return next
}

export function resetExperiencesToDefault(): Experience[] {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(EXPERIENCES_KEY)
    window.dispatchEvent(new CustomEvent('gj:experiences-change'))
  }
  return defaultExperiences
}

export function useExperiences(): Experience[] {
  const [list, setList] = useState<Experience[]>(defaultExperiences)
  useEffect(() => {
    const sync = () => setList(getStoredExperiences())
    sync()
    window.addEventListener('gj:experiences-change', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('gj:experiences-change', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])
  return list
}
