import Link from 'next/link'

/** Atajos a las comparativas que más ganancia dejan (panel de afiliados
 *  27/09-03/10: notebooks + celulares + colchones = 65% de lo ganado por la
 *  web). Van arriba de la grilla porque casi todo el tráfico entra por la home. */
const ATAJOS = [
  { href: '/mejores/mejores-notebooks', texto: '💻 Notebooks' },
  { href: '/mejores/mejores-celulares', texto: '📱 Celulares' },
  { href: '/mejores/mejores-colchones', texto: '🛏️ Colchones' },
  { href: '/mejores/mejores-celulares-gama-alta', texto: '⭐ Celulares gama alta' },
  { href: '/mejores/mejores-colchones-2-plazas', texto: '🛏️ Colchones 2 plazas' },
  { href: '/mejores/mejores-sommiers', texto: '🛌 Sommiers' },
]

export default function AtajosTicketAlto() {
  return (
    <nav aria-label="Lo que más se compra" className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
      <p className="text-xs font-bold uppercase tracking-wide text-zinc-500 mb-2">🔥 Lo que más se compra — comparativas de hoy</p>
      <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {ATAJOS.map(a => (
          <li key={a.href} className="shrink-0">
            <Link
              href={a.href}
              className="block rounded-full border border-yellow-400/40 bg-zinc-900 px-3.5 py-1.5 text-sm font-bold text-yellow-300 hover:border-yellow-400 transition-colors whitespace-nowrap"
            >
              {a.texto}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
