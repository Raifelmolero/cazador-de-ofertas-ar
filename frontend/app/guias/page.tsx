import Link from 'next/link'
import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import { GUIAS } from '@/lib/guias'
import { DEALS_URL, MARCA, ORG_ID, WEBSITE_ID } from '@/lib/marca'

const url = `${DEALS_URL}/guias`
const TITULO = 'Guías de compra en Mercado Libre Argentina — Cazador de Ofertas AR'
const DESCRIPCION =
  'Guías para decidir qué comprar en Mercado Libre Argentina: heladeras, aires, colchones, notebooks, celulares, smart TV y cómo saber si un descuento es real.'

export const metadata: Metadata = {
  metadataBase: new URL(DEALS_URL),
  title: TITULO,
  description: DESCRIPCION,
  alternates: { canonical: url },
  openGraph: { title: TITULO, description: DESCRIPCION, url, type: 'website', locale: 'es_AR', siteName: MARCA },
}

// Índice de todas las guías: antes solo se llegaba a cada una desde la home o
// desde otra guía; este hub las enlaza a todas y las anuncia como colección.
export default function GuiasIndex() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: TITULO,
      description: DESCRIPCION,
      url,
      inLanguage: 'es-AR',
      isPartOf: { '@id': WEBSITE_ID },
      publisher: { '@id': ORG_ID },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: DEALS_URL },
        { '@type': 'ListItem', position: 2, name: 'Guías de compra', item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Guías de compra',
      itemListElement: GUIAS.map((g, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: g.titulo,
        url: `${DEALS_URL}/guias/${g.slug}`,
      })),
    },
  ]
  return (
    <main className="min-h-screen">
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <a href={DEALS_URL} className="font-display text-lg font-extrabold tracking-tight">
            🎯 <span className="text-yellow-400">Cazador de Ofertas</span>
          </a>
        </div>
      </header>
      <article className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
        <h1 className="font-display text-3xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-4 [text-wrap:balance]">
          Guías de compra en Mercado Libre Argentina
        </h1>
        <p className="text-zinc-400 mb-8">
          Respuestas cortas para decidir qué comprar y cómo no pagar de más. Las comparativas con precios de hoy están
          en{' '}
          <Link href="/mejores" className="underline text-yellow-400">
            Mejores en oferta
          </Link>
          .
        </p>
        <ul className="space-y-4">
          {GUIAS.map(g => (
            <li key={g.slug} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
              <a href={`/guias/${g.slug}`} className="font-bold text-zinc-50 hover:text-yellow-400">
                {g.titulo}
              </a>
              <p className="mt-1 text-sm text-zinc-400 line-clamp-3">{g.respuestaCorta}</p>
            </li>
          ))}
        </ul>
      </article>
      <Footer brand="ofertas" />
    </main>
  )
}
