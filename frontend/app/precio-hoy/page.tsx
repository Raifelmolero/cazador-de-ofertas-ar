import type { Metadata } from 'next'
import { tituloSeo, descripcionSeo } from '@/lib/seo'
import Footer from '@/components/Footer'
import OfertasMinimoHoy from '@/components/OfertasMinimoHoy'
import LastUpdated from '@/components/LastUpdated'
import { getScrapedAt } from '@/lib/productos'
import { PRECIOS_HOY, ofertasDe } from '@/lib/preciohoy'
import { MARCA, ORG_ID, WEBSITE_ID } from '@/lib/marca'

const DEALS_URL = 'https://cazadordeofertas.com.ar'
const URL = `${DEALS_URL}/precio-hoy`
const TITULO = 'Precio hoy en Argentina: cuánto salen los productos más buscados'
const DESC =
  'Precio de hoy de smart TV, aires, heladeras, lavarropas, colchones, notebooks y más en Mercado Libre Argentina, con el rango de las ofertas con descuento real y el historial de precios.'

export const metadata: Metadata = {
  title: tituloSeo(TITULO, [t => `${t} — Cazador de Ofertas AR`, t => t]),
  description: descripcionSeo(DESC),
  metadataBase: new globalThis.URL(DEALS_URL),
  alternates: { canonical: URL },
}

const precio = (n: number) => '$' + Math.round(n).toLocaleString('es-AR')

export default function PrecioHoyIndex() {
  const scrapedAt = getScrapedAt().toISOString()
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: TITULO,
      description: DESC,
      url: URL,
      inLanguage: 'es-AR',
      dateModified: scrapedAt,
      isPartOf: { '@id': WEBSITE_ID },
      publisher: { '@type': 'Organization', '@id': ORG_ID, name: MARCA, url: DEALS_URL },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: PRECIOS_HOY.length,
        itemListElement: PRECIOS_HOY.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: `Precio de ${p.nombre} hoy`,
          url: `${DEALS_URL}/precio-hoy/${p.slug}`,
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ofertas de hoy', item: DEALS_URL },
        { '@type': 'ListItem', position: 2, name: 'Precio hoy', item: URL },
      ],
    },
  ]
  return (
    <main className="min-h-screen">
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}
      <header className="border-b border-zinc-900 bg-zinc-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <a href={DEALS_URL} className="font-display text-lg font-extrabold tracking-tight">
            🎯 <span className="text-yellow-400">Cazador de Ofertas</span>
          </a>
        </div>
      </header>
      <article className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <h1 className="font-display text-3xl sm:text-4xl font-black leading-[1.1] tracking-tight mb-4">{TITULO}</h1>
        <p className="text-zinc-300 mb-4">
          <strong className="text-zinc-100">Respuesta corta:</strong> {DESC} Cada página tiene el precio más bajo de
          hoy, la mediana y la cantidad de ofertas reales, con fecha de actualización.
        </p>
        <p className="mb-8 inline-flex text-[11px] sm:text-xs font-semibold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-1.5">
          <LastUpdated scrapedAt={scrapedAt} />
        </p>
        <ul className="divide-y divide-zinc-800 rounded-xl border border-zinc-800">
          {PRECIOS_HOY.map(p => {
            const o = ofertasDe(p)
            return (
              <li key={p.slug}>
                <a href={`/precio-hoy/${p.slug}`} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-zinc-900">
                  <span className="font-bold text-zinc-200">Precio de {p.nombre} hoy</span>
                  <span className="text-sm text-yellow-400 whitespace-nowrap">{o.length ? `desde ${precio(o[0].precio_actual)}` : 'ver historial'} →</span>
                </a>
              </li>
            )
          })}
        </ul>
      </article>
      <OfertasMinimoHoy />
      <Footer brand="ofertas" />
    </main>
  )
}
