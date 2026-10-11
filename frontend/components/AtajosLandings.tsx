import { LANDINGS, LANDINGS_RENTABLES, indexableLanding } from '@/lib/landings'

/** Fila de chips a las landings /ofertas/* de ticket alto (comisión 15%). Solo
 *  muestra las que hoy son indexables, así nunca enlaza una página vacía/noindex. */
export default function AtajosLandings() {
  const items = LANDINGS_RENTABLES.map(s => LANDINGS.find(l => l.slug === s)).filter(
    (l): l is NonNullable<typeof l> => !!l && indexableLanding(l),
  )
  if (items.length === 0) return null
  return (
    <nav aria-label="Ofertas de ticket alto" className="max-w-7xl mx-auto px-4 sm:px-6 pt-3">
      <p className="text-xs font-bold uppercase tracking-wide text-zinc-500 mb-2">💸 Ticket alto en oferta hoy</p>
      <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {items.map(l => (
          <li key={l.slug} className="shrink-0">
            <a
              href={`/ofertas/${l.slug}`}
              className="block rounded-full border border-zinc-700 bg-zinc-900 px-3.5 py-1.5 text-sm font-bold text-zinc-200 hover:border-yellow-400 hover:text-yellow-300 transition-colors whitespace-nowrap"
            >
              {l.nombre}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
