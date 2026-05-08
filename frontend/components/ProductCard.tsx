import Link from 'next/link'
import Image from 'next/image'
import type { ProductWithMargins } from '@/lib/productos'

export default function ProductCard({ producto }: { producto: ProductWithMargins }) {
  const margenPct = ((producto.margen_neto_clasico_ars / producto.precio_actual) * 100).toFixed(1)
  const isHighMargin = producto.margen_neto_clasico_ars > 30000

  return (
    <Link href={`/calculadora/${producto.id_ml}`} className="group block h-full">
      <article className="h-full flex flex-col bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-200">
        {/* Image */}
        <div className="relative h-44 bg-gray-800 overflow-hidden flex-shrink-0">
          {producto.url_imagen ? (
            <Image
              src={producto.url_imagen}
              alt={producto.titulo}
              fill
              className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600 text-4xl">
              📦
            </div>
          )}
          {isHighMargin && (
            <span className="absolute top-2 right-2 text-xs font-semibold bg-emerald-500 text-gray-950 px-2 py-0.5 rounded-full">
              Top
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h2 className="text-sm font-medium text-gray-100 line-clamp-2 mb-auto leading-snug">
            {producto.titulo}
          </h2>

          <div className="mt-3 pt-3 border-t border-gray-800 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Precio ML</span>
              <span className="text-sm font-semibold text-white">
                ${producto.precio_actual.toLocaleString('es-AR')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Margen potencial</span>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-emerald-400">
                  ${Math.round(producto.margen_neto_clasico_ars).toLocaleString('es-AR')}
                </span>
                <span className="text-xs text-emerald-600 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                  {margenPct}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <span className="text-xs text-gray-600 group-hover:text-emerald-500 transition-colors">
              Ver calculadora →
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
