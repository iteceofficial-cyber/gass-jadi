/**
 * PLACEHOLDER testimonials. These are sample entries for layout only and are
 * labelled as such on the site. Replace with real, permissioned reviews.
 */
export interface Testimonial {
  name: string
  from: string
  rating: number
  review: string
  initials: string
  tone: string
}

export const testimonialsArePlaceholders = true

export const testimonials: Testimonial[] = [
  {
    name: 'Sample Traveler',
    from: 'Jakarta, Indonesia',
    rating: 5,
    initials: 'ST',
    tone: 'bg-forest',
    review: 'Placeholder review — a real traveler story about the city tour will appear here once reviews are collected.',
  },
  {
    name: 'Sample Family',
    from: 'Bandung, Indonesia',
    rating: 5,
    initials: 'SF',
    tone: 'bg-ember',
    review: 'Placeholder review — a family’s experience of hot springs, local food and easy pacing will be featured here.',
  },
  {
    name: 'Sample Couple',
    from: 'Singapore',
    rating: 5,
    initials: 'SC',
    tone: 'bg-leaf',
    review: 'Placeholder review — a couple’s getaway story with sunrise and lakeside moments will be shared here.',
  },
  {
    name: 'Sample Company Team',
    from: 'Corporate group',
    rating: 5,
    initials: 'CT',
    tone: 'bg-ink',
    review: 'Placeholder review — feedback from a corporate or team outing will be added here once available.',
  },
]
