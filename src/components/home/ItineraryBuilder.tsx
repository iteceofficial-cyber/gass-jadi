import { Link } from '@tanstack/react-router'
import { ArrowRight, Bookmark, Clock, Info, Minus, Plus, Sparkles, Utensils, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { BookLink, btn } from '@/components/BookLink'
import { Reveal, SectionHeading } from '@/components/Reveal'
import { getDestination } from '@/data/destinations'
import { budgets, buildItinerary, styles, type Budget, type Duration, type PlanDay, type Style } from '@/data/itinerary'
import { savePlanSummary, useSavedDestinations } from '@/lib/trip'
import { useLanguage } from '@/lib/i18n'

function Group<T extends string | number>({
  label,
  options,
  value,
  onChange,
  format = (v) => String(v),
}: {
  label: string
  options: readonly T[]
  value: T
  onChange: (v: T) => void
  format?: (v: T) => string
}) {
  return (
    <fieldset>
      <legend className="text-xs font-bold uppercase tracking-[0.2em] text-cream/55">{label}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const on = o === value
          return (
            <label
              key={o}
              className={`cursor-pointer rounded-full px-4 py-2.5 text-sm font-semibold transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ember ${
                on ? 'bg-ember text-white' : 'bg-white/10 text-cream/85 hover:bg-white/20'
              }`}
            >
              <input type="radio" name={label} className="sr-only" checked={on} onChange={() => onChange(o)} />
              {format(o)}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

function summarize(plan: PlanDay[], meta: string) {
  return [meta, ...plan.map((d) => `Day ${d.day}: ` + d.stops.map((s) => `${s.time} ${s.destination}`).join(' → '))].join('\n')
}

export function ItineraryBuilder() {
  const [duration, setDuration] = useState<Duration>(1)
  const [style, setStyle] = useState<Style>('Family')
  const [budget, setBudget] = useState<Budget>('Standard')
  const [travelers, setTravelers] = useState(2)
  const [plan, setPlan] = useState<PlanDay[] | null>(null)
  const { saved, toggle } = useSavedDestinations()
  const resultRef = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()

  const meta = `${duration} ${duration > 1 ? t.itinerary.daysFormat : t.itinerary.dayFormat} · ${style} · ${budget} · ${travelers} ${t.itinerary.travelersLabel}`

  const build = () => {
    const p = buildItinerary(duration, style, budget, travelers)
    setPlan(p)
    requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const book = () => {
    if (!plan) return
    const extra = saved.length ? `\nSaved places: ${saved.map((s) => getDestination(s)?.name).filter(Boolean).join(', ')}` : ''
    savePlanSummary(summarize(plan, meta) + extra)
  }

  return (
    <section id="itinerary" className="relative overflow-hidden bg-forest py-24 text-cream sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <SectionHeading
              dark
              eyebrow={t.itinerary.eyebrow}
              title={
                <>
                  {t.itinerary.title} <em className="text-ember">Garut Journey</em>
                </>
              }
              intro={t.itinerary.intro}
            />
            {saved.length > 0 && (
              <Reveal className="mt-10 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
                  <Bookmark className="h-4 w-4" /> {t.itinerary.savedPlacesTitle}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {saved.map((slug) => {
                    const d = getDestination(slug)
                    if (!d) return null
                    return (
                      <li key={slug} className="flex items-center gap-1 rounded-full bg-white/10 py-1.5 pl-4 pr-1.5 text-sm">
                        <Link to="/destinations/$slug" params={{ slug }} className="hover:text-ember">
                          {d.name}
                        </Link>
                        <button type="button" onClick={() => toggle(slug)} aria-label={`Remove ${d.name}`} className="rounded-full p-1 hover:bg-white/15">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    )
                  })}
                </ul>
                <p className="mt-3 text-xs text-cream/50">{t.itinerary.savedPlacesDesc}</p>
              </Reveal>
            )}
          </div>

          <Reveal delay={120}>
            <div className="space-y-7 rounded-[2rem] bg-ink/40 p-7 ring-1 ring-white/10 backdrop-blur sm:p-9">
              <Group
                label={t.itinerary.durationLabel}
                options={[1, 2, 3] as const}
                value={duration}
                onChange={setDuration}
                format={(v) => `${v} ${v > 1 ? t.itinerary.daysFormat : t.itinerary.dayFormat}`}
              />
              <Group label={t.itinerary.styleLabel} options={styles} value={style} onChange={setStyle} />
              <Group label={t.itinerary.budgetLabel} options={budgets} value={budget} onChange={setBudget} />
              <div>
                <label htmlFor="travelers" className="text-xs font-bold uppercase tracking-[0.2em] text-cream/55">
                  {t.itinerary.travelersLabel}
                </label>
                <div className="mt-3 inline-flex items-center rounded-full bg-white/10 p-1">
                  <button type="button" aria-label="Fewer travelers" onClick={() => setTravelers((tr) => Math.max(1, tr - 1))} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/15">
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    id="travelers"
                    type="number"
                    min={1}
                    max={100}
                    value={travelers}
                    onChange={(e) => setTravelers(Math.min(100, Math.max(1, Number(e.target.value) || 1)))}
                    className="w-14 bg-transparent text-center text-lg font-semibold [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button type="button" aria-label="More travelers" onClick={() => setTravelers((tr) => Math.min(100, tr + 1))} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/15">
                    <Plus className="h-4 w-4" />
                  </button>
                  <span className="pl-2 pr-4 text-sm text-cream/60">{travelers} {t.itinerary.travelersLabel}</span>
                </div>
              </div>
              <button type="button" onClick={build} className={`${btn.primary} w-full !py-4 text-base`}>
                <Sparkles className="h-5 w-5" /> {t.itinerary.title}
              </button>
            </div>
          </Reveal>
        </div>

        <div ref={resultRef} className="scroll-mt-24">
          {plan && (
            <div className="fade-up mt-16 rounded-[2rem] bg-cream p-6 text-ink sm:p-10">
              <div className="flex flex-col gap-4 border-b border-ink/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="eyebrow">{t.itinerary.eyebrow}</p>
                  <h3 className="font-display mt-3 text-3xl sm:text-4xl">{t.itinerary.title}</h3>
                  <p className="mt-2 text-ink/60">{meta}</p>
                </div>
                <BookLink tour="Custom itinerary" onNavigate={book} className={btn.primary}>
                  {t.itinerary.bookCustom} <ArrowRight className="h-4 w-4" />
                </BookLink>
              </div>

              <div className="mt-8 space-y-10">
                {plan.map((day) => (
                  <div key={day.day}>
                    <h4 className="flex items-baseline gap-3">
                      <span className="font-display text-4xl text-ember">{t.itinerary.dayHeading} {day.day}</span>
                      <span className="text-sm font-semibold uppercase tracking-widest text-ink/50">{day.title}</span>
                    </h4>
                    <ol className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      {day.stops.map((s) => (
                        <li key={s.time + s.destination} className="flex flex-col rounded-3xl bg-white p-5 shadow-soft">
                          <span className="text-sm font-bold text-forest">{s.time}</span>
                          {s.slug ? (
                            <Link to="/destinations/$slug" params={{ slug: s.slug }} className="font-display mt-1 text-xl hover:text-forest">
                              {s.destination}
                            </Link>
                          ) : (
                            <span className="font-display mt-1 text-xl">{s.destination}</span>
                          )}
                          <p className="mt-1 text-sm text-ink/65">{s.activity}</p>
                          <dl className="mt-4 space-y-2 border-t border-ink/10 pt-4 text-sm">
                            <div className="flex items-start gap-2">
                              <dt><Clock className="mt-0.5 h-4 w-4 text-ember" aria-label="Duration" /></dt>
                              <dd>{s.duration}</dd>
                            </div>
                            <div className="flex items-start gap-2">
                              <dt><Utensils className="mt-0.5 h-4 w-4 text-ember" aria-label="Food" /></dt>
                              <dd>{s.food}</dd>
                            </div>
                            <div className="flex items-start gap-2 text-ink/60">
                              <dt><Info className="mt-0.5 h-4 w-4 text-ember" aria-label="Note" /></dt>
                              <dd>{s.note}</dd>
                            </div>
                          </dl>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-xs text-ink/50">
                Jadwal dapat disesuaikan dan dikonfirmasi langsung bersama tim lokal Garut Journey saat proses booking.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
