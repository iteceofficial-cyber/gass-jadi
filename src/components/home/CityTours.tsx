import { ArrowRight, Clock, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { BookLink, btn } from '@/components/BookLink'
import { Img } from '@/components/Img'
import { Reveal, SectionHeading } from '@/components/Reveal'
import { cityTours, type CityTour } from '@/data/tours'
import { useLanguage } from '@/lib/i18n'

function TourCard({ tour, index }: { tour: CityTour; index: number }) {
  const [open, setOpen] = useState(index === 0)
  const isDay = tour.id === 'one-day-city-tour'
  const { t } = useLanguage()

  return (
    <article className="grid overflow-hidden rounded-[2rem] bg-forest-700 ring-1 ring-white/10 lg:grid-cols-[1fr_1.1fr]">
      <div className="relative min-h-72 overflow-hidden lg:min-h-full">
        <Img file={tour.image} alt={tour.name} sizes="(min-width: 1024px) 45vw, 100vw" className="absolute inset-0 h-full w-full object-cover transition duration-[1.4s] hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
        <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-ember px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
          <Clock className="h-3.5 w-3.5" /> {tour.duration}
        </span>
      </div>
      <div className="p-7 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-ember">{t.cityTours.signatureTour} 0{index + 1}</p>
        <h3 className="font-display mt-3 text-3xl text-cream sm:text-4xl">{tour.name}</h3>
        <p className="mt-4 leading-relaxed text-cream/75">{tour.summary}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {tour.focus.map((f) => (
            <li key={f} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-cream/85">
              {f}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={`itinerary-${tour.id}`}
          className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-cream hover:text-ember"
        >
          {open ? t.cityTours.hideItinerary : t.cityTours.viewItinerary}
          <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
        </button>
        <div id={`itinerary-${tour.id}`} className={`grid transition-all duration-500 ${open ? 'mt-5 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <ol className="overflow-hidden border-l border-white/15 pl-6">
            {tour.itinerary.map((s) => (
              <li key={s.time} className="relative pb-4 last:pb-0">
                <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-ember ring-4 ring-forest-700" />
                <span className="block text-xs font-bold tracking-wider text-ember">{s.time}</span>
                <span className="text-cream/90">{s.title}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="block text-xs uppercase tracking-widest text-cream/50">{t.cityTours.priceFrom}</span>
            <span className="font-display text-xl text-cream">{tour.price}</span>
          </p>
          <BookLink tour={tour.name} className={btn.primary}>
            {isDay ? t.cityTours.bookThisTour : t.cityTours.explorePackage} <ArrowRight className="h-4 w-4" />
          </BookLink>
        </div>
      </div>
    </article>
  )
}

export function CityTours() {
  const { t } = useLanguage()

  return (
    <section id="city-tours" className="relative overflow-hidden bg-forest py-24 text-cream sm:py-32">
      <div aria-hidden="true" className="font-display pointer-events-none absolute -right-10 top-10 select-none text-[22vw] leading-none text-white/[0.04]">
        Tour
      </div>
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          dark
          eyebrow={t.cityTours.eyebrow}
          title={
            <>
              {t.cityTours.title} <em className="text-ember">Garut Journey</em>
            </>
          }
          intro={t.cityTours.intro}
        />
        <div className="mt-14 space-y-8">
          {cityTours.map((tItem, i) => (
            <Reveal key={tItem.id} delay={i * 100}>
              <TourCard tour={tItem} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
