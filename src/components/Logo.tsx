export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden="true">
        <circle cx="16" cy="16" r="16" className="fill-ember" />
        <path d="M5 23 L12.5 12 L17 18 L20 14 L27 23 Z" className={light ? 'fill-cream' : 'fill-forest'} />
        <circle cx="21.5" cy="9.5" r="2.5" className="fill-cream" />
      </svg>
      <span className="flex flex-col">
        <span className={`font-display text-[1.05rem] font-semibold leading-none tracking-[0.12em] ${light ? 'text-cream' : 'text-ink'}`}>
          GARUT<span className="text-ember"> JOURNEY</span>
        </span>
        <span className="text-[0.55rem] font-bold uppercase tracking-[0.18em] text-ember mt-0.5">
          Explore Swiss van Java
        </span>
      </span>
    </span>
  )
}
