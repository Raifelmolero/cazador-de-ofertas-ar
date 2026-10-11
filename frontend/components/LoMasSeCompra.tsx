import Link from 'next/link'
import { enCategoria, getCategoria } from '@/lib/categorias'

/** Rubros que más ventas dejaron en el panel de afiliados (celulares, notebooks,
 *  TV, herramientas eléctricas, colchones, pequeños electrodomésticos, perfumes),
 *  en ese orden. Cada tile lleva a la página que ya convierte: la comparativa
 *  (/mejores) cuando el rubro no tiene categoría propia, o /categoria/<slug>
 *  con las ofertas del día. El contador sale de contar los títulos reales de
 *  hoy con la misma regla que usa /categoria; si hoy no hay ninguna, no se
 *  muestra número. */
const RUBROS: { emoji: string; nombre: string; href: string; categoria?: string }[] = [
  { emoji: '📱', nombre: 'Celulares', href: '/mejores/mejores-celulares' },
  { emoji: '💻', nombre: 'Notebooks', href: '/mejores/mejores-notebooks' },
  { emoji: '📺', nombre: 'Smart TV', href: '/categoria/smart-tv', categoria: 'smart-tv' },
  { emoji: '🛠️', nombre: 'Herramientas eléctricas', href: '/categoria/herramientas-electricas', categoria: 'herramientas-electricas' },
  { emoji: '🛏️', nombre: 'Colchones y sommiers', href: '/categoria/colchones', categoria: 'colchones' },
  { emoji: '🍳', nombre: 'Electro de cocina', href: '/categoria/electro-de-cocina', categoria: 'electro-de-cocina' },
  { emoji: '🧴', nombre: 'Perfumes', href: '/categoria/perfumes', categoria: 'perfumes' },
]

export default function LoMasSeCompra({ ofertas }: { ofertas: { titulo: string }[] }) {
  const items = RUBROS.map(r => {
    const cat = r.categoria ? getCategoria(r.categoria) : undefined
    const n = cat ? ofertas.filter(o => enCategoria(cat, o.titulo)).length : 0
    return { ...r, n }
  })
  return (
    <nav aria-label="Lo que más se compra" className="max-w-7xl mx-auto px-4 sm:px-6 pt-5">
      <h2 className="font-display text-base sm:text-xl font-black mb-2">🔥 Lo que más se compra</h2>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {items.map(r => (
          <li key={r.href}>
            <Link
              href={r.href}
              className="flex h-full items-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 transition-colors hover:border-yellow-400/60"
            >
              <span className="text-2xl" aria-hidden="true">{r.emoji}</span>
              <span className="min-w-0">
                <span className="block text-sm font-bold leading-tight text-zinc-100">{r.nombre}</span>
                <span className="block text-xs text-zinc-500">
                  {r.n > 0 ? `${r.n} ofertas hoy` : 'Comparativa y guía'}
                </span>
              </span>
            </Link>
          </li>
        ))}
        <li>
          <a
            href="#ofertas"
            className="flex h-full items-center gap-2.5 rounded-xl border border-yellow-400/40 bg-yellow-400/10 px-3 py-2.5 text-sm font-bold text-yellow-300"
          >
            <span className="text-2xl" aria-hidden="true">👇</span>
            Todas las ofertas
          </a>
        </li>
      </ul>
    </nav>
  )
}
