import Image from 'next/image'
import type { ProductWithMargins } from '@/lib/productos'

function precio(n: number) {
  return `$${Math.round(n).toLocaleString('es-AR')}`
}

export default function OfertaCard({ producto }: { producto: ProductWithMargins }) {
  const ahorro =
    producto.precio_anterior != null
      ? producto.precio_anterior - producto.precio_actual
      : null

  return (
    <article className="group flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-yellow-400/30 hover:shadow-[0_0_24px_rgba(250,204,21,0.06)] transition-all duration-200">

      {/* Image */}
      <a
        href={producto.url_producto}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="relative h-44 bg-zinc-800 block flex-shrink-0 overflow-hidden"
      >
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
        <div className="absolute top-2 left-2 flex flex-col items-start gap-1.5">
          {producto.descuento_pct != null && (
            <span className="text-xs font-extrabold bg-red-500 text-white px-2.5 py-0.5 rounded-full">
              {producto.descuento_pct}% OFF
            </span>
          )}
          {producto.minimo_historico && (
            <span className="text-xs font-extrabold bg-yellow-400 text-black px-2.5 py-0.5 rounded-full">
              📉 Mínimo histórico
            </span>
          )}
        </div>
      </a>

      {/* Content */}
      <div className="px-4 pt-4 pb-3 flex-1 flex flex-col">
        <h2 className="text-sm font-medium text-zinc-200 line-clamp-2 leading-snug mb-auto">
          {producto.titulo}
        </h2>

        <div className="mt-3 pt-3 border-t border-zinc-800 space-y-0.5">
          {producto.precio_anterior != null && (
            <div className="text-xs text-zinc-500 line-through">
              {precio(producto.precio_anterior)}
            </div>
          )}
          <div className="text-xl font-black text-white leading-tight">
            {precio(producto.precio_actual)}
          </div>
          {ahorro != null && ahorro > 0 && (
            <div className="text-xs font-semibold text-green-400">
              Ahorrás {precio(ahorro)}
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4 pt-1">
        <a
          href={producto.url_producto}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="block w-full text-center text-sm font-bold bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl py-2.5 transition-colors"
        >
          Ver oferta en ML ↗
        </a>
      </div>

    </article>
  )
}
