// Regalos de Navidad caros por presupuesto (hasta $300 mil, $300-700 mil, $700 mil-1,5 M, más de 1,5 M).
// Solo categorías regalables que ya tenemos cargadas (tecno, consolas, electro, colchones, juguetes, bicis);
// los precios son los de hoy, no los de diciembre. Mismo pool y mismas tarjetas que /regalos-navidad.
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { tituloSeo, descripcionSeo } from '@/lib/seo'
import Footer from '@/components/Footer'
import LastUpdated from '@/components/LastUpdated'
import OfertaCard, { type OfertaLight } from '@/components/OfertaCard'
import { getScrapedAt, type ProductWithMargins } from '@/lib/productos'
import { getCategoria, ofertasDeCategoria } from '@/lib/categorias'
import { slugPorId } from '@/lib/seguimiento'

const DEALS_URL = 'https://cazadordeofertas.com.ar'
const AÑO = 2026
const MAX = 24

const RANGOS = [
  { slug: 'hasta-300000', nombre: 'hasta $300.000', corto: 'hasta $300 mil', min: 0, max: 300000 },
  { slug: '300000-a-700000', nombre: 'de $300.000 a $700.000', corto: 'de $300 a $700 mil', min: 300000, max: 700000 },
  { slug: '700000-a-1500000', nombre: 'de $700.000 a $1.500.000', corto: 'de $700 mil a $1,5 millones', min: 700000, max: 1500000 },
  { slug: 'mas-de-1500000', nombre: 'de más de $1.500.000', corto: 'de más de $1,5 millones', min: 1500000, max: Infinity },
] as const

const CATEGORIAS_REGALO = [
  'notebooks', 'celulares', 'smart-tv', 'gamer', 'monitores', 'bebes-y-jugueteria', 'bicicletas', 'perfumes',
  'electro-de-cocina', 'freidoras-de-aire', 'heladeras', 'lavarropas', 'aspiradoras', 'colchones',
  'herramientas-electricas', 'cocinas-y-hornos', 'parrillas',
]

export const generateStaticParams = () => RANGOS.map(r => ({ presupuesto: r.slug }))
export const dynamicParams = false

const rango = (slug: string) => RANGOS.find(r => r.slug === slug)
const pesos = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`

function regalos(r: (typeof RANGOS)[number]): ProductWithMargins[] {
  const vistos = new Set<string>()
  return CATEGORIAS_REGALO.flatMap(s => {
    const c = getCategoria(s)
    return c ? ofertasDeCategoria(c) : []
  })
    .filter(p => p.precio_actual >= r.min && p.precio_actual < r.max && (vistos.has(p.id_ml) ? false : (vistos.add(p.id_ml), true)))
    .sort((a, b) => (b.prioridad ?? 0) - (a.prioridad ?? 0) || (b.descuento_pct ?? 0) - (a.descuento_pct ?? 0))
}

export async function generateMetadata({ params }: { params: Promise<{ presupuesto: string }> }): Promise<Metadata> {
  const r = rango((await params).presupuesto)
  if (!r) return {}
  const url = `${DEALS_URL}/regalos-navidad/${r.slug}`
  const t = `Regalos de Navidad ${r.corto} (${AÑO})`
  const d = `Ideas de regalo caros para Navidad ${AÑO} ${r.corto} en Argentina: notebooks, celulares, TV, consolas y electro de Mercado Libre con el descuento verificado contra el historial.`
  return {
    title: tituloSeo(t, [s => `${s} — Cazador de Ofertas AR`, s => s]),
    description: descripcionSeo(d),
    metadataBase: new globalThis.URL(DEALS_URL),
    alternates: { canonical: url },
    openGraph: { title: t, description: d, url, type: 'website', locale: 'es_AR', siteName: 'Cazador de Ofertas AR' },
  }
}

export default async function Page({ params }: { params: Promise<{ presupuesto: string }> }) {
  const r = rango((await params).presupuesto)
  if (!r) notFound()
  const historial = slugPorId()
  const todos = regalos(r)
  const productos = todos.slice(0, MAX)
  const light = (o: ProductWithMargins): OfertaLight => ({
    id_ml: o.id_ml, titulo: o.titulo, precio_actual: o.precio_actual, precio_anterior: o.precio_anterior,
    descuento_pct: o.descuento_pct, minimo_historico: o.minimo_historico, relampago: o.relampago,
    url_producto: o.url_producto, url_imagen: o.url_imagen, historial: historial[o.id_ml],
  })
  const url = `${DEALS_URL}/regalos-navidad/${r.slug}`
  const titulo = `Regalos de Navidad ${r.nombre} (${AÑO})`
  const jsonLd = [
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ofertas de hoy', item: DEALS_URL },
        { '@type': 'ListItem', position: 2, name: `Regalos de Navidad ${AÑO}`, item: `${DEALS_URL}/regalos-navidad` },
        { '@type': 'ListItem', position: 3, name: r.corto, item: url },
      ],
    },
    ...(productos.length > 0
      ? [{
          '@context': 'https://schema.org', '@type': 'ItemList', name: titulo,
          itemListElement: productos.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.titulo, url: p.url_producto })),
        }]
      : []),
  ]
  return (
    <main className="min-h-screen">
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}
      <section className="border-b border-zinc-900 px-4 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          <nav aria-label="Ruta" className="text-xs text-zinc-500 mb-3">
            <a href={DEALS_URL} className="hover:text-yellow-400">Ofertas de hoy</a> <span aria-hidden="true">/</span>{' '}
            <Link href="/regalos-navidad" className="hover:text-yellow-400">Regalos de Navidad</Link> <span aria-hidden="true">/</span>{' '}
            <span className="text-zinc-300">{r.corto}</span>
          </nav>
          <h1 className="font-display text-3xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-4 [text-wrap:balance]">{titulo}</h1>
          <p className="text-zinc-400 leading-relaxed [text-wrap:pretty]">
            {todos.length > 0
              ? `Hoy hay ${todos.length} ofertas regalables ${r.nombre}${productos.length < todos.length ? `; acá van las ${productos.length} mejores` : ''}. Desde ${pesos(Math.min(...productos.map(p => p.precio_actual)))}. `
              : 'Hoy no hay ofertas regalables en este rango; volvé en unas horas. '}
            Cada una está comparada contra el precio más bajo que registramos. Ojo: son los precios de hoy, no los de diciembre; verificá el precio el día que compres.{' '}
            <span className="text-zinc-500"><LastUpdated scrapedAt={getScrapedAt().toISOString()} />.</span>
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {RANGOS.map(x => (
              <Link key={x.slug} href={`/regalos-navidad/${x.slug}`}
                className={`text-xs font-bold rounded-full border px-3 py-1 ${x.slug === r.slug ? 'border-green-400/60 text-green-200' : 'border-zinc-700 text-zinc-300 hover:border-green-400/60'}`}>
                {x.corto}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {productos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {productos.map((o, i) => <OfertaCard key={o.id_ml} producto={light(o)} priority={i < 4} />)}
          </div>
        )}
        <p className="mt-6 text-sm">
          <Link href="/regalos-navidad" className="font-bold text-yellow-400 hover:underline">← Todos los regalos de Navidad, por presupuesto y destinatario</Link>
        </p>
      </section>
      <Footer brand="ofertas" />
    </main>
  )
}
