import type { Metadata } from 'next'
import Link from 'next/link'
import { aLight, getProductos, getScrapedAt } from '@/lib/productos'
import { CARGO_MAX, CARGO_MIN, COSTOS_VIGENCIA } from '@/lib/costosml'
import { CALC_URL, GUIAS_VENDER } from '@/lib/vender'
import CalcHeader from '@/components/CalcHeader'
import ProductsGrid from '@/components/ProductsGrid'
import Footer from '@/components/Footer'
import LastUpdated from '@/components/LastUpdated'

// Home de calculadoraml.com.ar (en cazadordeofertas.com.ar la raíz se reescribe
// a /hoy en next.config.mjs, así que esta página solo la ve el público vendedor).
// Arriba el hub de herramientas para vendedores; abajo, lo que ya rankeaba:
// productos rentables + calculadora de ganancia por producto.

const URL = `${CALC_URL}/`
const pct = (n: number) => String(n).replace('.', ',')
const TITULO = 'Calculadora Mercado Libre 2026: comisiones y ganancia'
const DESCRIPCION = `Calculadora de comisiones de Mercado Libre 2026 (cargo de ${pct(CARGO_MIN)}% a ${pct(CARGO_MAX)}%), ML vs Tiendanube, guías para vendedores y productos rentables.`

export const metadata: Metadata = {
  title: `${TITULO} | CalculadoraML`,
  description: DESCRIPCION,
  alternates: { canonical: URL },
  openGraph: { title: TITULO, description: DESCRIPCION, url: URL, type: 'website', locale: 'es_AR', siteName: 'CalculadoraML' },
}

const HERRAMIENTAS = [
  {
    href: '/calculadora-de-comisiones',
    emoji: '🧮',
    nombre: 'Calculadora de comisiones de Mercado Libre',
    texto: `Cuánto te cobra ML y cuánto te queda por venta: cargo por vender, costo fijo, cuotas y envío. Costos vigentes desde el ${COSTOS_VIGENCIA}.`,
    boton: 'Calcular comisiones',
  },
  {
    href: '/calculadora-precio-de-venta',
    emoji: '🏷️',
    nombre: '¿A cuánto publicar en Mercado Libre?',
    texto: 'Poné tu costo y la ganancia que querés y te damos el precio exacto de publicación, con comisión, costo fijo, cuotas y envío.',
    boton: 'Calcular precio',
  },
  {
    href: '/calculadora-envio-gratis',
    emoji: '📦',
    nombre: '¿Cuánto me cuesta el envío gratis?',
    texto: 'Precio, peso y color de tu reputación → lo que pagás por el envío gratis y cuánto te deposita ML después de la comisión.',
    boton: 'Calcular envío',
  },
  {
    href: '/calculadora-cuotas-sin-interes',
    emoji: '💳',
    nombre: '¿Cuánto me cuestan las cuotas sin interés?',
    texto: 'Precio y cantidad de cuotas → el costo extra, cuánto te deposita ML y a qué precio publicar para cobrar lo mismo que sin cuotas.',
    boton: 'Calcular cuotas',
  },
  {
    href: '/mercado-libre-vs-tiendanube',
    emoji: '⚖️',
    nombre: 'Mercado Libre vs Tiendanube',
    texto: 'Tu ganancia por mes en cada canal y cuántas ventas necesitás para que el plan de tu tienda propia se pague solo.',
    boton: 'Comparar',
  },
  {
    href: '/vender',
    emoji: '📚',
    nombre: 'Guías para vender',
    texto: 'Guías cortas para vendedores y revendedores: precios, comisiones y cuándo conviene tener tu propia tienda.',
    boton: 'Ver guías',
  },
]

export default function HomePage() {
  const productos = getProductos()
  const scrapedAt = getScrapedAt().toISOString()
  const guias = GUIAS_VENDER.slice(0, 6)

  const margenPromedio = productos.length
    ? Math.round(
        productos.reduce((sum, p) => sum + (p.margen_neto_clasico_ars / p.precio_actual) * 100, 0) / productos.length
      )
    : 0

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'CalculadoraML',
      url: URL,
      inLanguage: 'es-AR',
      description: DESCRIPCION,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Herramientas gratis para vender en Mercado Libre',
      itemListElement: [
        ...HERRAMIENTAS.map(h => ({ name: h.nombre, url: `${CALC_URL}${h.href}` })),
        { name: 'Productos más rentables de Mercado Libre para revender', url: `${URL}#productos` },
      ].map((item, i) => ({ '@type': 'ListItem', position: i + 1, ...item })),
    },
  ]

  return (
    <main className="min-h-screen">
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}
      <CalcHeader />

      {/* Hero: hub de herramientas para vendedores */}
      <section
        className="border-b border-zinc-900 px-4 py-12 sm:py-16"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(250,204,21,0.07) 0%, transparent 70%)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4 [text-wrap:balance]">
              Herramientas gratis para vender en <span className="text-yellow-400">Mercado Libre</span>
            </h1>
            <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed [text-wrap:pretty]">
              Calculá las comisiones de Mercado Libre 2026, compará con tu propia tienda y encontrá qué productos
              conviene revender. Sin registrarte.
            </p>
          </div>

          <ul className="grid gap-4 sm:grid-cols-3">
            {HERRAMIENTAS.map(h => (
              <li key={h.href}>
                <Link
                  href={h.href}
                  className="group flex h-full flex-col rounded-2xl border border-yellow-400/30 bg-yellow-400/5 hover:border-yellow-400/60 hover:bg-yellow-400/10 transition-colors p-5"
                >
                  <span className="text-2xl mb-2" aria-hidden="true">{h.emoji}</span>
                  <span className="font-bold text-yellow-300 leading-snug">{h.nombre}</span>
                  <span className="block text-sm text-zinc-400 mt-2 mb-4 leading-relaxed flex-1">{h.texto}</span>
                  <span className="text-xs font-bold text-black bg-yellow-400 group-hover:bg-yellow-300 self-start px-4 py-2 rounded-full transition-colors">
                    {h.boton} →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Guías para vender (se listan solas desde lib/vender.ts) */}
      {guias.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-2">
          <div className="flex items-end justify-between gap-3 mb-4">
            <h2 className="text-lg font-bold text-white">Guías para vender en Mercado Libre</h2>
            <Link href="/vender" className="shrink-0 text-xs font-semibold text-yellow-400 hover:text-yellow-300">
              Ver todas ({GUIAS_VENDER.length}) →
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {guias.map(g => (
              <li key={g.slug}>
                <Link
                  href={`/vender/${g.slug}`}
                  className="block h-full rounded-2xl border border-zinc-800 bg-zinc-900 hover:border-zinc-600 transition-colors p-4"
                >
                  <span className="font-semibold text-zinc-100 text-sm leading-snug">{g.titulo}</span>
                  <span className="block text-xs text-zinc-500 mt-1.5 leading-relaxed line-clamp-3">{g.descripcion}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Productos rentables (contenido original de la home) */}
      <section id="productos" className="max-w-7xl mx-auto px-4 sm:px-6 pt-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <LastUpdated scrapedAt={scrapedAt} /> · {productos.length} productos analizados
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mb-3">
            Los productos más rentables de <span className="text-yellow-400">Mercado Libre</span> ahora
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto mb-6 leading-relaxed">
            Analizamos tendencias diariamente para que encuentres qué vale la pena comprar o revender.
            Calculadora de ganancia incluida en cada producto, gratis.
          </p>
          <div className="flex justify-center gap-10 sm:gap-16">
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-yellow-400">{productos.length}</span>
              <span className="block text-xs text-zinc-600 mt-1">productos</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-yellow-400">{margenPromedio}%</span>
              <span className="block text-xs text-zinc-600 mt-1">te queda de ML (prom.)</span>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-black text-yellow-400 leading-tight">
                <LastUpdated scrapedAt={scrapedAt} />
              </span>
              <span className="block text-xs text-zinc-600 mt-1">actualizado</span>
            </div>
          </div>
        </div>

        <div className="pb-4 flex items-end justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white">Productos en tendencia</h3>
            <p className="text-xs text-zinc-600 mt-0.5">Ordenados por lo que te deposita ML por venta</p>
          </div>
          <span className="shrink-0 text-xs text-yellow-400 border border-yellow-400/20 bg-yellow-400/5 px-3 py-1 rounded-full">
            Mayor neto primero
          </span>
        </div>

        <div className="pb-8">
          <ProductsGrid productos={productos.map(aLight)} />
          <p className="mt-4 text-center text-xs">
            <Link href="/calculadora" className="text-yellow-400 hover:underline">
              Ver el índice de todas las fichas por precio ({productos.length})
            </Link>
          </p>
        </div>
      </section>

      {/* Ofertas para compradores (otro público): chico y al final */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-xs">
          <span className="text-zinc-400 text-center sm:text-left">
            ¿Buscás ofertas para comprar? 3 ofertas seleccionadas por día, gratis y sin spam.
          </span>
          <span className="flex items-center gap-4 shrink-0">
            <a
              href="https://t.me/cazadordeofertasar"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-sky-400 hover:text-sky-300"
            >
              📢 Canal de Telegram →
            </a>
            <Link href="/hoy" className="font-semibold text-yellow-400 hover:text-yellow-300">
              🎯 Ofertas de hoy →
            </Link>
          </span>
        </div>
      </section>

      <Footer />
    </main>
  )
}
