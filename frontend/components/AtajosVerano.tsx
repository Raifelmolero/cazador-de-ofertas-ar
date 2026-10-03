import Link from 'next/link'

/** Atajos a las comparativas de verano (1/10 al 28/2, hora argentina): la home
 *  recibe casi todo el tráfico directo (bio, stories) y en esta época lo que
 *  más se busca es calor + aire libre, todo de ticket alto. */
const ATAJOS = [
  { href: '/mejores/mejores-aires-acondicionados', texto: '❄️ Aires' },
  { href: '/mejores/mejores-ventiladores', texto: '🌀 Ventiladores' },
  { href: '/mejores/mejores-piletas', texto: '🏊 Piletas' },
  { href: '/mejores/mejores-parrillas', texto: '🔥 Parrillas' },
  { href: '/mejores/mejores-muebles-de-jardin', texto: '🪑 Jardín' },
  { href: '/mejores/mejores-bicicletas', texto: '🚲 Bicicletas' },
  { href: '/mejores/mejores-freezers', texto: '🧊 Freezers' },
]

export function esVerano(ahora: Date): boolean {
  const ar = new Date(ahora.getTime() - 3 * 3600 * 1000)
  const m = ar.getUTCMonth() + 1
  return m >= 10 || m <= 2
}

export default function AtajosVerano({ ahora = new Date() }: { ahora?: Date }) {
  if (!esVerano(ahora)) return null
  return (
    <nav aria-label="Ofertas de verano" className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
      <p className="text-xs font-bold uppercase tracking-wide text-zinc-500 mb-2">☀️ Se viene el calor — comparativas de hoy</p>
      <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {ATAJOS.map(a => (
          <li key={a.href} className="shrink-0">
            <Link
              href={a.href}
              className="block rounded-full border border-zinc-800 bg-zinc-900 px-3.5 py-1.5 text-sm font-bold text-zinc-200 hover:border-yellow-400/50 hover:text-yellow-300 transition-colors whitespace-nowrap"
            >
              {a.texto}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
