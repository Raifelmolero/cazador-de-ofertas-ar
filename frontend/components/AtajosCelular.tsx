import Link from 'next/link'

/** Celular (68 % de las visitas): el menú de rubros está oculto y el buscador
 *  de la grilla aparece recién en la pantalla 4-5. Esta fila va dentro del
 *  header fijo: buscador (salta a la grilla con ?q=) + rubros de ticket alto
 *  deslizables. En escritorio no se muestra (ahí está el menú). */
const RUBROS: { label: string; href: string }[] = [
  { label: '❄️ Aires', href: '/categoria/aire-acondicionado' },
  { label: '📱 Celulares', href: '/categoria/celulares' },
  { label: '📺 Smart TV', href: '/categoria/smart-tv' },
  { label: '💻 Notebooks', href: '/categoria/notebooks' },
  { label: '🛏️ Colchones', href: '/categoria/colchones' },
  { label: '🧊 Heladeras', href: '/categoria/heladeras' },
  { label: '🛠️ Herramientas', href: '/categoria/herramientas-electricas' },
  { label: '📉 Mínimos', href: '/ofertas/minimos-historicos-hoy' },
]

export default function AtajosCelular() {
  return (
    <div className="md:hidden border-t border-zinc-900 px-4 pb-2.5 pt-2">
      <form method="get" role="search" className="flex gap-2">
        <label htmlFor="buscar-celular" className="sr-only">Buscar ofertas</label>
        <input
          id="buscar-celular"
          name="q"
          type="search"
          placeholder="Buscá: aire, iphone, colchón…"
          className="min-w-0 flex-1 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-yellow-400 focus:outline-none"
        />
        <button type="submit" className="rounded-full bg-yellow-400 px-4 text-sm font-bold text-black">
          Buscar
        </button>
      </form>
      <nav aria-label="Rubros" className="-mx-4 mt-2 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none]">
        {RUBROS.map(r => (
          <Link
            key={r.href}
            href={r.href}
            className="shrink-0 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-semibold text-zinc-200 hover:border-yellow-400"
          >
            {r.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
