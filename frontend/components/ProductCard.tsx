import Link from 'next/link'
import Image from 'next/image'
import type { ProductWithMargins } from '@/lib/productos'

export default function ProductCard({ producto }: { producto: ProductWithMargins }) {
  const margenPct = Math.round((producto.margen_neto_clasico_ars / producto.precio_actual) * 100)
  const isTop = margenPct >= 35

  return (
    <article className="group flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-yellow-400/30 hover:shadow-[0_0_24px_rgba(250,204,21,0.06)] transition-all duration-200">

      {/* Image */}
      <Link href={`/calculadora/${producto.id_ml}`} className="relative h-44 bg-zinc-800 block flex-shrink-0 overflow-hidden">
        {producto.url_imagen ? (
          <Image
            src={producto.url_imagen}
            alt={producto.titulo}
            fill
            className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600 text-4xl">📦</div>
        )}

        {/* Badges */}
        {isTop && (
          <span className="absolute top-2 left-2 text-xs font-extrabold bg-yellow-400 text-black px-2.5 py-0.5 rounded-full">
            Top
          </span>
        )}
        <span className="absolute top-2 right-2 text-xs font-bold text-yellow-400 bg-black/70 border border-yellow-400/30 px-2 py-0.5 rounded-full">
          {margenPct}%
        </span>
      </Link>

      {/* Content */}
      <Link href={`/calculadora/${producto.id_ml}`} className="px-4 pt-4 pb-3 flex-1 flex flex-col">
        <h2 className="text-sm font-medium text-zinc-200 line-clamp-2 leading-snug mb-auto">
          {producto.titulo}
        </h2>

        <div className="mt-3 pt-3 border-t border-zinc-800 space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-zinc-500">Precio ML</span>
            <span className="text-sm font-semibold text-white">
              ${producto.precio_actual.toLocaleString('es-AR')}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-zinc-500">Ganancia estimada</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-yellow-400">
                ${Math.round(producto.margen_neto_clasico_ars).toLocaleString('es-AR')}
              </span>
              <span className="text-xs font-bold bg-yellow-400 text-black px-1.5 py-0.5 rounded-full">
                {margenPct}%
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* CTAs */}
      <div className="px-4 pb-4 pt-1 flex flex-col gap-2">
        <a
          href={producto.url_producto}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="block w-full text-center text-sm font-bold bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl py-2.5 transition-colors"
        >
          Comprarlo en Mercado Libre ↗
        </a>
        <Link
          href={`/calculadora/${producto.id_ml}`}
          className="block text-center text-xs text-zinc-600 hover:text-yellow-400 transition-colors py-1"
        >
          Ver análisis completo →
        </Link>
      </div>

    </article>
  )
}
