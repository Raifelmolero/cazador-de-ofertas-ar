import Image from 'next/image'
import type { ProductWithMargins } from '@/lib/productos'

function precio(n: number) {
  return `$${Math.round(n).toLocaleString('es-AR')}`
}

function Badges({ producto, className = '' }: { producto: ProductWithMargins; className?: string }) {
  return (
    <div className={`absolute top-2 left-2 flex flex-col items-start gap-1.5 ${className}`}>
      {producto.descuento_pct != null && (
        <span className="text-xs font-extrabold bg-red-600 text-white px-2.5 py-0.5 rounded-full shadow-sm">
          {producto.descuento_pct}% OFF
        </span>
      )}
      {producto.minimo_historico && (
        <span className="text-xs font-extrabold bg-yellow-400 text-black px-2.5 py-0.5 rounded-full shadow-sm">
          📉 Mínimo histórico
        </span>
      )}
    </div>
  )
}

/**
 * Toda la tarjeta es UN solo link (mejor tap target en mobile); el "botón"
 * es visual. Fondo blanco en la foto: las imágenes de ML son JPG de fondo
 * blanco, así quedan integradas en vez de flotar como rectángulos.
 */
export default function OfertaCard({
  producto,
  featured = false,
  priority = false,
}: {
  producto: ProductWithMargins
  featured?: boolean
  priority?: boolean
}) {
  const ahorro =
    producto.precio_anterior != null
      ? producto.precio_anterior - producto.precio_actual
      : null

  if (featured) {
    return (
      <a
        href={producto.url_producto}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="group col-span-full flex bg-zinc-900 border border-yellow-400/40 rounded-2xl overflow-hidden transition-colors duration-200 hover:border-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
      >
        <div className="relative w-[38%] max-w-72 shrink-0 self-stretch bg-white min-h-36">
          {producto.url_imagen ? (
            <Image
              src={producto.url_imagen}
              alt={producto.titulo}
              fill
              priority={priority}
              sizes="(max-width: 768px) 40vw, 288px"
              className="object-contain p-3"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-300 text-4xl">📦</div>
          )}
          {/* En lg el % va en grande a la derecha; el badge chico duplicaría */}
          <Badges producto={producto} className="lg:hidden" />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center px-4 py-4 sm:px-6 sm:py-5">
          <span className="text-[11px] font-extrabold tracking-wide text-yellow-400 mb-1.5">
            🎯 LA CAZA DEL DÍA
          </span>
          <h2 className="text-sm sm:text-lg font-bold text-white leading-snug line-clamp-2 mb-2 [text-wrap:balance]">
            {producto.titulo}
          </h2>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 tabular-nums">
            {producto.precio_anterior != null && (
              <span className="text-xs sm:text-sm text-zinc-500 line-through">
                {precio(producto.precio_anterior)}
              </span>
            )}
            <span className="text-2xl sm:text-3xl font-black text-yellow-400 leading-tight">
              {precio(producto.precio_actual)}
            </span>
          </div>
          {ahorro != null && ahorro > 0 && (
            <span className="text-xs sm:text-sm font-semibold text-green-400 mt-0.5 tabular-nums">
              Te ahorrás {precio(ahorro)}
            </span>
          )}
          <span className="mt-3 inline-flex w-fit items-center text-sm font-bold bg-yellow-400 text-black rounded-xl px-5 py-2.5 transition-colors group-hover:bg-yellow-300">
            Ver oferta en ML ↗
          </span>
        </div>

        {/* Desktop: el % en grande llena el espacio con el dato que importa */}
        {producto.descuento_pct != null && (
          <div className="hidden lg:flex flex-col items-center justify-center shrink-0 px-10 border-l border-zinc-800">
            <span className="text-6xl font-black text-yellow-400 leading-none tabular-nums">
              -{producto.descuento_pct}%
            </span>
            {producto.minimo_historico && (
              <span className="mt-3 text-xs font-extrabold bg-yellow-400 text-black px-2.5 py-0.5 rounded-full">
                📉 Mínimo histórico
              </span>
            )}
          </div>
        )}
      </a>
    )
  }

  return (
    <a
      href={producto.url_producto}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden transition-all duration-200 hover:border-yellow-400/40 hover:shadow-[0_0_24px_rgba(250,204,21,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
    >
      <div className="relative aspect-square bg-white">
        {producto.url_imagen ? (
          <Image
            src={producto.url_imagen}
            alt={producto.titulo}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-3"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-300 text-4xl">📦</div>
        )}
        <Badges producto={producto} />
      </div>

      <div className="px-3 pt-3 pb-3 sm:px-4 sm:pt-4 flex-1 flex flex-col">
        <h2 className="text-[13px] sm:text-sm font-medium text-zinc-200 line-clamp-2 leading-snug mb-auto">
          {producto.titulo}
        </h2>

        <div className="mt-2.5 pt-2.5 sm:mt-3 sm:pt-3 border-t border-zinc-800 space-y-0.5 tabular-nums">
          {producto.precio_anterior != null && (
            <div className="text-xs text-zinc-500 line-through">
              {precio(producto.precio_anterior)}
            </div>
          )}
          <div className="text-lg sm:text-xl font-black text-white leading-tight">
            {precio(producto.precio_actual)}
          </div>
          {ahorro != null && ahorro > 0 && (
            <div className="text-xs font-semibold text-green-400">
              Ahorrás {precio(ahorro)}
            </div>
          )}
        </div>

        <span className="mt-3 block w-full text-center text-[13px] sm:text-sm font-bold bg-yellow-400 text-black rounded-xl py-2.5 transition-colors group-hover:bg-yellow-300">
          Ver oferta en ML ↗
        </span>
      </div>
    </a>
  )
}
