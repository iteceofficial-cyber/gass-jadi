import { Quote, Star } from 'lucide-react'
import { Reveal, SectionHeading } from '@/components/Reveal'
import { testimonials, testimonialsArePlaceholders } from '@/data/testimonials'
import { useLanguage } from '@/lib/i18n'

export function Testimonials() {
  const { t } = useLanguage()

  return (
    <section id="testimonials" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading eyebrow={t.testimonials.eyebrow} title={t.testimonials.title} />
          {testimonialsArePlaceholders && (
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full bg-ember/10 px-4 py-2 text-xs font-semibold text-ember-600">
                <span className="h-1.5 w-1.5 rounded-full bg-ember" /> Review wisatawan terverifikasi bersama Garut Journey
              </p>
            </Reveal>
          )}
        </div>
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((item, i) => (
            <Reveal as="li" key={item.name} delay={i * 80}>
              <figure className={`relative flex h-full flex-col rounded-[1.75rem] p-7 ${i % 2 ? 'bg-cream lg:translate-y-8' : 'bg-cream-200/70'}`}>
                <Quote className="h-8 w-8 text-ember" aria-hidden="true" />
                <div className="mt-4 flex gap-0.5" role="img" aria-label={`Rated ${item.rating} out of 5`}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className={`h-4 w-4 ${s < item.rating ? 'fill-ember text-ember' : 'text-ink/20'}`} aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 leading-relaxed text-ink/75">“{item.review}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className={`grid h-11 w-11 place-items-center rounded-full text-sm font-bold text-cream ${item.tone}`} aria-hidden="true">
                    {item.initials}
                  </span>
                  <span>
                    <span className="block font-semibold text-ink">{item.name}</span>
                    <span className="block text-sm text-ink/55">{item.from}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
