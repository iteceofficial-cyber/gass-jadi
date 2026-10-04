import { useEffect, useState } from 'react'
import { cityTours as defaultCityTours, packages as defaultPackages, type CityTour, type TourPackage } from '@/data/tours'

const CITY_TOURS_KEY = 'gj:city-tours:v1'
const PACKAGES_KEY = 'gj:tour-packages:v1'

export function getStoredCityTours(): CityTour[] {
  if (typeof window === 'undefined') return defaultCityTours
  try {
    const raw = window.localStorage.getItem(CITY_TOURS_KEY)
    if (!raw) return defaultCityTours
    const parsed = JSON.parse(raw) as CityTour[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultCityTours
  } catch {
    return defaultCityTours
  }
}

export function saveStoredCityTours(list: CityTour[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(CITY_TOURS_KEY, JSON.stringify(list))
    window.dispatchEvent(new CustomEvent('gj:tours-change'))
  } catch {
    // ignore quota errors
  }
}

export function upsertCityTour(tour: CityTour): CityTour[] {
  const current = getStoredCityTours()
  const idx = current.findIndex((t) => t.id === tour.id)
  const next = idx >= 0 ? current.map((t, i) => (i === idx ? tour : t)) : [...current, tour]
  saveStoredCityTours(next)
  return next
}

export function deleteCityTour(id: string): CityTour[] {
  const current = getStoredCityTours()
  const next = current.filter((t) => t.id !== id)
  saveStoredCityTours(next)
  return next
}

export function resetCityToursToDefault(): CityTour[] {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(CITY_TOURS_KEY)
    window.dispatchEvent(new CustomEvent('gj:tours-change'))
  }
  return defaultCityTours
}

export function getStoredPackages(): TourPackage[] {
  if (typeof window === 'undefined') return defaultPackages
  try {
    const raw = window.localStorage.getItem(PACKAGES_KEY)
    if (!raw) return defaultPackages
    const parsed = JSON.parse(raw) as TourPackage[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultPackages
  } catch {
    return defaultPackages
  }
}

export function saveStoredPackages(list: TourPackage[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(PACKAGES_KEY, JSON.stringify(list))
    window.dispatchEvent(new CustomEvent('gj:packages-change'))
  } catch {
    // ignore quota errors
  }
}

export function upsertTourPackage(pkg: TourPackage): TourPackage[] {
  const current = getStoredPackages()
  const idx = current.findIndex((p) => p.id === pkg.id)
  const next = idx >= 0 ? current.map((p, i) => (i === idx ? pkg : p)) : [...current, pkg]
  saveStoredPackages(next)
  return next
}

export function deleteTourPackage(id: string): TourPackage[] {
  const current = getStoredPackages()
  const next = current.filter((p) => p.id !== id)
  saveStoredPackages(next)
  return next
}

export function resetPackagesToDefault(): TourPackage[] {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(PACKAGES_KEY)
    window.dispatchEvent(new CustomEvent('gj:packages-change'))
  }
  return defaultPackages
}

export function useCityTours(): CityTour[] {
  const [list, setList] = useState<CityTour[]>(defaultCityTours)

  useEffect(() => {
    const sync = () => setList(getStoredCityTours())
    sync()
    window.addEventListener('gj:tours-change', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('gj:tours-change', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  return list
}

export function useTourPackages(): TourPackage[] {
  const [list, setList] = useState<TourPackage[]>(defaultPackages)

  useEffect(() => {
    const sync = () => setList(getStoredPackages())
    sync()
    window.addEventListener('gj:packages-change', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('gj:packages-change', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  return list
}
