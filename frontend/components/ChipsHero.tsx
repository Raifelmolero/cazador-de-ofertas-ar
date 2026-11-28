'use client'

// Chips del hero de la home (rediseño 27/11): presupuesto y rubro, a un pulgar. No filtran acá:
// le avisan a la grilla (OfertasGrid escucha EVENTO_FILTRO) y bajan hasta #ofertas. Sin JS
// siguen andando: el href lleva ?presupuesto= / ?categoria=, que la grilla lee al cargar.
import { EVENTO_FILTRO, type DetalleFiltro } from '@/lib/rubros-filtro'

export type ChipHero = { texto: string; n?: number; filtro: DetalleFiltro; href: string }

export function aplicarFiltro(e: React.MouseEvent, filtro: DetalleFiltro) {
  // Ctrl/⌘/rueda: dejar que abra la pestaña nueva con el filtro en la URL
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
  e.preventDefault()
  window.dispatchEvent(new CustomEvent<DetalleFiltro>(EVENTO_FILTRO, { detail: filtro }))
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById('ofertas')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}

export default function ChipsHero({ titulo, chips }: { titulo: string; chips: ChipHero[] }) {
  if (chips.length === 0) return null
  return (
    <div>
      <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">{titulo}</p>
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:px-0">
        {chips.map(c => (
          <li key={c.texto} className="shrink-0">
            <a
              href={c.href}
              onClick={e => aplicarFiltro(e, c.filtro)}
              className="chip presionable flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-full border border-zinc-700 bg-zinc-900 px-4 text-base font-bold text-zinc-100 hover:border-yellow-400/70 hover:text-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
            >
              {c.texto}
              {c.n !== undefined && <span className="text-sm font-semibold text-zinc-400 tabular-nums">{c.n.toLocaleString('es-AR')}</span>}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Botón del contador «→ N en su mínimo histórico»: activa ese filtro en la grilla. */
export function BotonMinimos({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <a href="#ofertas" onClick={e => aplicarFiltro(e, { minimos: true })} className={className}>
      {children}
    </a>
  )
}
