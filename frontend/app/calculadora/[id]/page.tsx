import { getProductos, getProductoById, fichasParecidas, fichaPrincipal, getFichasPorPrecio } from '@/lib/productos'
import { CALC_URL } from '@/lib/vender'
import { MAX_DESCRIPCION, conDiferencia, diferenciadores, tituloSeo } from '@/lib/seo'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CARGO_REFERENCIA } from '@/lib/costosml'
import AlertaCTA from '@/components/AlertaCTA'
import Image from 'next/image'
import CostBreakdownChart from '@/components/CostBreakdownChart'
import ProfitCalculator from '@/components/ProfitCalculator'
import Footer from '@/components/Footer'

export async function generateStaticParams() {
  const productos = getProductos()
  return productos.map(p => ({ id: p.id_ml }))
}

const FORMATOS_TITULO = [
  (n: string) => `Calculadora de ganancia: ${n} en Mercado Libre`,
  (n: string) => `Calculadora de ganancia: ${n}`,
]

/** Productos distintos cuyo título recortado coincide: sumamos lo que los distingue. */
let difs: Map<string, string> | null = null
function diferenciaDe(id: string) {
  difs ??= diferenciadores(
    new Map(getFichasPorPrecio().map(p => [p.id_ml, p.titulo])),
    n => tituloSeo(n, FORMATOS_TITULO),
  )
  return difs.get(id)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const producto = getProductoById(id)
  if (!producto) return { title: 'Producto no encontrado' }

  const dif = diferenciaDe(producto.id_ml)
  const deposita = Math.round(producto.margen_neto_clasico_ars).toLocaleString('es-AR')
  const precioMl = producto.precio_actual.toLocaleString('es-AR')
  return {
    alternates: { canonical: `${CALC_URL}/calculadora/${fichaPrincipal(producto).id_ml}` },
    title: tituloSeo(producto.titulo, conDiferencia(dif, FORMATOS_TITULO)),
    description: tituloSeo(producto.titulo, conDiferencia(dif, [
      n => `Calculá cuánto ganás vendiendo "${n}". Precio ML: $${precioMl}. Te deposita ML: $${deposita}.`,
    ]), MAX_DESCRIPCION),
    openGraph: {
      title: `Calculadora de Ganancia: ${producto.titulo}`,
      description: `Te deposita ML: $${Math.round(producto.margen_neto_clasico_ars).toLocaleString('es-AR')} ARS por venta (costos oficiales 2026)`,
      ...(producto.url_imagen ? { images: [{ url: producto.url_imagen }] } : {}),
    },
  }
}

export default async function CalculadoraPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const producto = getProductoById(id)
  if (!producto) notFound()

  const comisionArs = producto.precio_actual * producto.comision_clasica_pct
  const iibbArs = producto.precio_actual * producto.retencion_iibb_pct
  const envioArs = producto.costo_envio_base_ars
  const parecidas = fichasParecidas(producto.id_ml)

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
          <Link href="/calculadora" className="text-sm text-gray-400 hover:text-white truncate">Calculadora</Link>
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
                unoptimized
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
                <p className="text-xs text-gray-500 mb-0.5">Neto a Cobrar</p>
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
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-sm px-5 py-2.5 rounded-xl transition-colors"
            >
              Ver Oferta y Stock en ML ↗
            </a>
            <AlertaCTA id={producto.id_ml} className="mt-3" />
          </div>
        </section>

        <p className="text-xs text-gray-500 [text-wrap:pretty]">
          Calculado con los costos oficiales de Mercado Libre vigentes desde el 1/09/2026: cargo por vender de referencia de{' '}
          {String(CARGO_REFERENCIA).replace('.', ',')}% (el real va de 11,62% a 17,75% según la categoría), costo fijo por unidad
          si cuesta menos de $33.000 y sin cuotas propias. No incluye envío ni tus impuestos. Para tu caso exacto usá la{' '}
          <Link href="/calculadora-de-comisiones" className="text-yellow-400 hover:underline">calculadora de comisiones</Link>.
        </p>

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

        {parecidas.length > 0 && (
          <nav aria-label="Fichas de precio parecido" className="text-sm">
            <p className="font-bold text-gray-300 mb-2">Productos de precio parecido</p>
            <ul className="space-y-1.5">
              {parecidas.map(p => (
                <li key={p.id_ml} className="flex justify-between gap-3 min-w-0">
                  <Link href={`/calculadora/${p.id_ml}`} className="text-gray-400 hover:text-yellow-400 truncate">{p.titulo}</Link>
                  <span className="shrink-0 text-gray-500 tabular-nums">${p.precio_actual.toLocaleString('es-AR')}</span>
                </li>
              ))}
            </ul>
            <Link href="/calculadora" className="inline-block mt-3 text-yellow-400 hover:underline">Ver todas las fichas por precio →</Link>
          </nav>
        )}
      </div>

      <Footer />
    </main>
  )
}
