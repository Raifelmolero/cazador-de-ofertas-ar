import Link from 'next/link'
import OfertaCard, { type OfertaLight } from '@/components/OfertaCard'
import { COMPARATIVAS } from '@/lib/comparativas'

/** Bloque de colchones y sommiers en la home: la categoría que más ganancia dejó
 *  (comisión 15%, ticket alto). Muestra las ofertas reales de hoy (mismo orden
 *  que /hoy) y no se dibuja si hoy no hay ninguna: nada de datos inventados. */
export default function ColchonesDestacados({ ofertas }: { ofertas: OfertaLight[] }) {
  if (ofertas.length === 0) return null
  const comparativas = COMPARATIVAS.filter(c => /colchon|sommier/.test(c.slug)).slice(0, 3)
  return (
    <section aria-labelledby="colchones-hoy" data-seccion="colchones_home" className="max-w-7xl mx-auto px-4 sm:px-6 pt-5">
      <div className="flex items-end justify-between gap-3 mb-3">
        <h2 id="colchones-hoy" className="font-display text-lg sm:text-xl font-black">
          🛏️ Colchones y sommiers en oferta hoy
        </h2>
        <Link href="/categoria/colchones" className="shrink-0 text-xs sm:text-sm font-bold text-yellow-400 hover:text-yellow-300">
          Ver todos →
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {ofertas.slice(0, 4).map(o => (
          <OfertaCard key={o.id_ml} producto={o} />
        ))}
      </div>
      {comparativas.length > 0 && (
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm">
          {comparativas.map(c => (
            <Link key={c.slug} href={`/mejores/${c.slug}`} className="font-semibold text-zinc-300 hover:text-yellow-300">
              📊 {c.titulo}
            </Link>
          ))}
        </p>
      )}
    </section>
  )
}
