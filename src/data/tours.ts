/**
 * City tours and packages. Prices are intentionally placeholders
 * ("Rp XXX") until real pricing is confirmed.
 */
export interface ItineraryStop {
  time: string
  title: string
}

export interface CityTour {
  id: string
  name: string
  duration: string
  image: string
  summary: string
  focus: string[]
  price: string
  itinerary: ItineraryStop[]
}

export const cityTours: CityTour[] = [
  {
    id: 'one-day-city-tour',
    name: 'Garut One-Day City Tour',
    duration: '1 Day',
    image: 'citysquare.png',
    summary: 'The best of Garut in a single, well-paced day — city sights, heritage, local lunch and souvenirs.',
    focus: ['City', 'Heritage', 'Culinary', 'Souvenirs'],
    price: 'Starting from Rp XXX / person',
    itinerary: [
      { time: '08:00', title: 'Meeting point' },
      { time: '09:00', title: 'City sightseeing' },
      { time: '10:30', title: 'Cultural or heritage destination' },
      { time: '12:00', title: 'Local lunch experience' },
      { time: '14:00', title: 'Tourist attraction' },
      { time: '16:00', title: 'Local shopping & souvenirs' },
      { time: '17:00', title: 'Return to meeting point' },
    ],
  },
  {
    id: 'garut-experience-2d1n',
    name: 'Garut Experience — 2 Days 1 Night',
    duration: '2 Days 1 Night',
    image: 'sampireun.png',
    summary: 'Slow down and go deeper: highland nature, Sundanese food, culture, local life and a sunrise to remember.',
    focus: ['Nature', 'Culinary', 'Culture', 'Local experiences', 'Souvenirs', 'Sunrise & sunset'],
    price: 'Starting from Rp XXX / person',
    itinerary: [
      { time: 'Day 1 · Morning', title: 'Arrival & heritage visit' },
      { time: 'Day 1 · Afternoon', title: 'Sundanese lunch & local craft village' },
      { time: 'Day 1 · Evening', title: 'Hot springs & dinner' },
      { time: 'Day 2 · Dawn', title: 'Highland sunrise' },
      { time: 'Day 2 · Morning', title: 'Nature walk & breakfast' },
      { time: 'Day 2 · Afternoon', title: 'Souvenir shopping & return' },
    ],
  },
]

export type PackageTier = 'Explorer' | 'Garut Discovery' | 'Premium Experience'

export interface TourPackage {
  id: string
  name: PackageTier
  tagline: string
  duration: string
  durationDays: 1 | 2 | 3
  styles: string[]
  destinations: string[]
  activities: string[]
  included: string[]
  groupSize: string
  price: string
  featured?: boolean
}

export const packages: TourPackage[] = [
  {
    id: 'explorer',
    name: 'Explorer',
    tagline: 'Essential Garut, perfectly paced.',
    duration: '1 Day',
    durationDays: 1,
    styles: ['City', 'Culinary', 'Culture'],
    destinations: ['Garut City Square', 'Candi Cangkuang', 'Situ Bagendit'],
    activities: ['City sightseeing', 'Heritage visit', 'Local lunch', 'Souvenir stop'],
    included: ['Local guide', 'Transport during tour', 'Details coming soon'],
    groupSize: 'Group size to be confirmed',
    price: 'Starting from Rp XXX / person',
  },
  {
    id: 'garut-discovery',
    name: 'Garut Discovery',
    tagline: 'Our most-loved way to see Garut.',
    duration: '2 Days 1 Night',
    durationDays: 2,
    styles: ['Nature', 'Culinary', 'Culture', 'Family'],
    destinations: ['Candi Cangkuang', 'Cipanas Garut', 'Mount Papandayan', 'Garut City Square'],
    activities: ['Heritage visit', 'Hot springs', 'Sunrise hike', 'Culinary tour'],
    included: ['Local guide', 'Transport during tour', 'Accommodation (details coming soon)'],
    groupSize: 'Group size to be confirmed',
    price: 'Starting from Rp XXX / person',
    featured: true,
  },
  {
    id: 'premium-experience',
    name: 'Premium Experience',
    tagline: 'Private, unhurried and tailored to you.',
    duration: '3 Days 2 Nights',
    durationDays: 3,
    styles: ['Nature', 'Adventure', 'Romantic', 'Culture'],
    destinations: ['Kampung Sampireun', 'Darajat Pass', 'Mount Papandayan', 'Santolo Beach'],
    activities: ['Private guide', 'Highland drive', 'Lakeside stay', 'South-coast sunset'],
    included: ['Private guide', 'Private transport', 'Premium stays (details coming soon)'],
    groupSize: 'Private group — size to be confirmed',
    price: 'Starting from Rp XXX / person',
  },
]

export const tourOptions = [...cityTours.map((t) => t.name), ...packages.map((p) => p.name), 'Custom itinerary']
