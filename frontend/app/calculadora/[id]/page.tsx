import { getProductos, getProductoById } from '@/lib/productos'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import CostBreakdownChart from '@/components/CostBreakdownChart'
import ProfitCalculator from '@/components/ProfitCalculator'

export async function generateStaticParams() {
  const productos = getProductos()
  return productos.map(p => ({ id: p.id_ml }))
}

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const producto = getProductoById(params.id)
  if (!producto) return { title: 'Producto no encontrado' }

  return {
    title: `Calculadora de Ganancia: ${producto.titulo} en Mercado Libre`,
    description: `Calculá cuánto podés ganar vendiendo "${producto.titulo}". Precio ML: $${producto.precio_actual.toLocaleString('es-AR')}. Margen estimado: $${Math.round(producto.margen_neto_clasico_ars).toLocaleString('es-AR')}.`,
    openGraph: {
      title: `Calculadora de Ganancia: ${producto.titulo}`,
      description: `Margen potencial: $${Math.round(producto.margen_neto_clasico_ars).toLocaleString('es-AR')} ARS`,
      ...(producto.url_imagen ? { images: [{ url: producto.url_imagen }] } : {}),
    },
  }
}

export default function CalculadoraPage({ params }: { params: { id: string } }) {
  const producto = getProductoById(params.id)
  if (!producto) notFound()

  const comisionArs = producto.precio_actual * producto.comision_clasica_pct
  const iibbArs = producto.precio_actual * producto.retencion_iibb_pct
  const envioArs = producto.costo_envio_base_ars

  return (
    <main className="min-h-screen">
      {/* Sticky header */}
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-2 min-w-0">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 flex-shrink-0"
          >
            ← Inicio
          </Link>
          <span className="text-gray-700 flex-shrink-0">/</span>
          <span className="text-sm text-gray-400 truncate">Calculadora</span>
          <span className="text-gray-700 flex-shrink-0">/</span>
          <span className="text-sm text-gray-200 truncate">{producto.titulo}</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-5">
        {/* Product hero card */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col sm:flex-row gap-5">
          {producto.url_imagen && (
            <div className="relative w-full sm:w-36 h-36 flex-shrink-0 bg-gray-800 rounded-xl overflow-hidden self-center sm:self-start">
              <Image
                src={producto.url_imagen}
                alt={producto.titulo}
                fill
                className="object-contain p-3"
                priority
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
              Producto en tendencia · Mercado Libre
            </p>
            <h1 className="text-xl font-bold text-white mb-4 leading-snug">
              {producto.titulo}
            </h1>
            <div className="flex flex-wrap gap-6 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Precio en ML</p>
                <p className="text-2xl font-bold text-white">
                  ${producto.precio_actual.toLocaleString('es-AR')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Margen estimado</p>
                <p className="text-2xl font-bold text-emerald-400">
                  ${Math.round(producto.margen_neto_clasico_ars).toLocaleString('es-AR')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">% del precio</p>
                <p className="text-2xl font-bold text-emerald-300">
                  {((producto.margen_neto_clasico_ars / producto.precio_actual) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            <a
              href={producto.url_producto}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Ver producto en Mercado Libre
              <span aria-hidden>↗</span>
            </a>
          </div>
        </section>

        {/* Cost breakdown chart */}
        <CostBreakdownChart
          precio={producto.precio_actual}
          comisionArs={comisionArs}
          iibbArs={iibbArs}
          envioArs={envioArs}
          margenArs={producto.margen_neto_clasico_ars}
        />

        {/* Interactive profit calculator */}
        <ProfitCalculator
          precioML={producto.precio_actual}
          comisionArs={comisionArs}
          iibbArs={iibbArs}
          envioArs={envioArs}
        />

        {/* Footer note */}
        <p className="text-xs text-gray-600 text-center pb-4">
          Los márgenes son estimados. Verificá comisiones y costos actuales en Mercado Libre antes de vender.
        </p>
      </div>
    </main>
  )
}
