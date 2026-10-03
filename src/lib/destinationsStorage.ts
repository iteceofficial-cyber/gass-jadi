import { useEffect, useState } from 'react'
import { destinations as defaultDestinations, type Destination } from '@/data/destinations'

const DESTINATIONS_KEY = 'garut_journey_custom_destinations_v1'
const DESTINATIONS_EVENT = 'garut_destinations_updated'

const PRICES_KEY = 'garut_journey_tour_prices_v1'
const PRICES_EVENT = 'garut_tour_prices_updated'

export const DEFAULT_TOUR_PRICES: Record<string, number> = {
  'Garut One-Day City Tour': 350000,
  'Papandayan Volcano & Highland Trek': 450000,
  'Garut Heritage & Lake Experience': 375000,
  'Garut South Coast Explorer (Santolo & Rancabuaya)': 550000,
  'Custom itinerary': 400000,
}

// -------------------------------------------------------------
// TOUR PRICES MANAGEMENT
// -------------------------------------------------------------
export function getStoredTourPrices(): Record<string, number> {
  if (typeof window === 'undefined') return DEFAULT_TOUR_PRICES
  try {
    const raw = localStorage.getItem(PRICES_KEY)
    if (raw) return { ...DEFAULT_TOUR_PRICES, ...JSON.parse(raw) }
  } catch (err) {
    console.error('Failed to get tour prices:', err)
  }
  return DEFAULT_TOUR_PRICES
}

export function saveTourPrice(tourName: string, price: number): boolean {
  if (typeof window === 'undefined') return false
  try {
    const current = getStoredTourPrices()
    const updated = { ...current, [tourName]: price }
    localStorage.setItem(PRICES_KEY, JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent(PRICES_EVENT, { detail: updated }))
    return true
  } catch (err) {
    console.error('Failed to save tour price:', err)
    return false
  }
}

export function useTourPrices() {
  const [prices, setPrices] = useState<Record<string, number>>(DEFAULT_TOUR_PRICES)

  useEffect(() => {
    setPrices(getStoredTourPrices())
    const handler = () => setPrices(getStoredTourPrices())
    window.addEventListener(PRICES_EVENT, handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener(PRICES_EVENT, handler)
      window.removeEventListener('storage', handler)
    }
  }, [])

  return { prices, updatePrice: saveTourPrice }
}

// -------------------------------------------------------------
// DESTINATIONS MANAGEMENT
// -------------------------------------------------------------
export function getStoredDestinations(): Destination[] {
  if (typeof window === 'undefined') return defaultDestinations
  try {
    const raw = localStorage.getItem(DESTINATIONS_KEY)
    if (raw) {
      const custom: Destination[] = JSON.parse(raw)
      const base = [...defaultDestinations]
      // Replace existing or append new
      custom.forEach((c) => {
        const idx = base.findIndex((b) => b.slug === c.slug)
        if (idx >= 0) {
          base[idx] = c
        } else {
          base.push(c)
        }
      })
      return base
    }
  } catch (err) {
    console.error('Failed to get custom destinations:', err)
  }
  return defaultDestinations
}

export function saveCustomDestination(dest: Destination): boolean {
  if (typeof window === 'undefined') return false
  try {
    const raw = localStorage.getItem(DESTINATIONS_KEY)
    const custom: Destination[] = raw ? JSON.parse(raw) : []
    const updated = [dest, ...custom.filter((d) => d.slug !== dest.slug)]
    localStorage.setItem(DESTINATIONS_KEY, JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent(DESTINATIONS_EVENT, { detail: updated }))
    return true
  } catch (err) {
    console.error('Failed to save destination:', err)
    return false
  }
}

export function deleteDestination(slug: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    const raw = localStorage.getItem(DESTINATIONS_KEY)
    const custom: Destination[] = raw ? JSON.parse(raw) : []
    const updated = custom.filter((d) => d.slug !== slug)
    localStorage.setItem(DESTINATIONS_KEY, JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent(DESTINATIONS_EVENT, { detail: updated }))
    return true
  } catch (err) {
    console.error('Failed to delete destination:', err)
    return false
  }
}

export function useDestinations() {
  const [destinationsList, setDestinationsList] = useState<Destination[]>(defaultDestinations)

  useEffect(() => {
    setDestinationsList(getStoredDestinations())
    const handler = () => setDestinationsList(getStoredDestinations())
    window.addEventListener(DESTINATIONS_EVENT, handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener(DESTINATIONS_EVENT, handler)
      window.removeEventListener('storage', handler)
    }
  }, [])

  return {
    destinations: destinationsList,
    saveDestination: saveCustomDestination,
    removeDestination: deleteDestination,
  }
}
