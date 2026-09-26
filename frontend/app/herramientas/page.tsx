// Nicho piloto (Fase 1 de la tarjeta #21 de Trello): un hub por rubro dentro
// del sitio actual. Herramientas deja ~15% de comisión (el tramo más alto del
// panel), así que se prueba acá primero. Las salidas a ML usan la etiqueta
// `herramientas` para medir el nicho aparte en el panel de afiliados; si el
// hub rinde, pasa a dominio propio (Fase 2).

import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import OfertaCard, { type OfertaLight } from '@/components/OfertaCard'
import LastUpdated from '@/components/LastUpdated'
import { getScrapedAt } from '@/lib/productos'
import { getCategoria, ofertasDeCategoria } from '@/lib/categorias'
import { GUIAS } from '@/lib/guias'
import { COMPARATIVAS } from '@/lib/comparativas'
import { seguidosDeCategoria, slugPorId } from '@/lib/seguimiento'
import { busquedaML } from '@/lib/afiliado'

const DEALS_URL = 'https://cazadordeofertas.com.ar'
const URL = `${DEALS_URL}/herramientas`
const TELEGRAM_URL = 'https://t.me/cazadordeofertasar'
const ETIQUETA = 'herramientas'
const CAT = 'herramientas-electricas'

const TITULO = 'Herramientas en oferta: taladros, amoladoras, soldadoras y más'
const DESCRIPCION =
  'Herramientas eléctricas en oferta hoy en Mercado Libre Argentina, con el descuento verificado contra el historial de precios. Guías para elegir taladro y amoladora.'

// Búsquedas de alta intención dentro del rubro (todas con la etiqueta del nicho)
const BUSQUEDAS = [
  'taladro percutor',
  'atornillador 18v',
  'rotomartillo',
  'amoladora angular',
  'sierra circular',
  'soldadora inverter',
  'hidrolavadora',
  'compresor de aire',
  'lijadora',
  'caladora',
  'set de herramientas',
  'banco de trabajo',
]

export const metadata: Metadata = {
  title: `${TITULO} — Cazador de Ofertas AR`,
  description: DESCRIPCION,
  alternates: { canonical: URL },
  openGraph: { title: TITULO, description: DESCRIPCION, url: URL, type: 'website', locale: 'es_AR', siteName: 'Cazador de Ofertas AR' },
}

export default function HerramientasPage() {
  const cat = getCategoria(CAT)!
  const ofertas = ofertasDeCategoria(cat)
  const scrapedAt = getScrapedAt().toISOString()
  const historial = slugPorId()
  const ofertasLight: OfertaLight[] = ofertas.map(o => ({
    id_ml: o.id_ml,
    titulo: o.titulo,
    precio_actual: o.precio_actual,
    precio_anterior: o.precio_anterior,
    descuento_pct: o.descuento_pct,
    minimo_historico: o.minimo_historico,
    relampago: o.relampago,
    url_producto: o.url_producto,
    url_imagen: o.url_imagen,
    historial: historial[o.id_ml],
  }))
  const guias = GUIAS.filter(g => g.categoria?.slug === CAT)
  const comparativas = COMPARATIVAS.filter(c => c.categoria === CAT)
  const seguidos = seguidosDeCategoria(CAT).slice(0, 20)

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ofertas de hoy', item: DEALS_URL },
        { '@type': 'ListItem', position: 2, name: 'Herramientas', item: URL },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: cat.faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ]

  return (
    <main className="min-h-screen">
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}

      <header className="sticky top-0 z-10 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <a href={DEALS_URL} className="font-display text-lg font-extrabold tracking-tight">
            🔧 <span className="text-yellow-400">Cazador de Herramientas</span>
          </a>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-black bg-yellow-400 hover:bg-yellow-300 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
          >
            Unite al canal ✈️
          </a>
        </div>
      </header>

      <section className="border-b border-zinc-900 px-4 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          <nav aria-label="Ruta" className="text-xs text-zinc-500 mb-3">
            <a href={DEALS_URL} className="hover:text-yellow-400">Ofertas de hoy</a> <span aria-hidden="true">/</span>{' '}
            <span className="text-zinc-300">Herramientas</span>
          </nav>
          <h1 className="font-display text-3xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-4 [text-wrap:balance]">
            {TITULO}
          </h1>
          <p className="text-zinc-400 leading-relaxed [text-wrap:pretty]">
            Todo lo del taller en un solo lugar: las herramientas que hoy tienen descuento real en Mercado Libre
            (lo verificamos contra el historial de precios, 3 veces por día), comparativas y guías cortas para
            elegir bien antes de comprar.
          </p>
          <p className="mt-4 inline-flex flex-wrap items-center gap-x-2 text-[11px] sm:text-xs font-semibold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-1.5">
            <LastUpdated scrapedAt={scrapedAt} /> · {ofertas.length} {ofertas.length === 1 ? 'oferta' : 'ofertas'} hoy
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h2 className="font-display text-xl sm:text-2xl font-black mb-4">Buscá por herramienta</h2>
        <ul className="flex flex-wrap gap-2 mb-8">
          {BUSQUEDAS.map(q => (
            <li key={q}>
              <a
                href={busquedaML(q, ETIQUETA)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="block rounded-full border border-zinc-800 bg-zinc-900 px-3.5 py-1.5 text-xs font-bold text-zinc-300 hover:border-yellow-400/40 hover:text-yellow-300 transition-colors"
              >
                {q} ↗
              </a>
            </li>
          ))}
        </ul>

        <h2 className="font-display text-xl sm:text-2xl font-black mb-4">En oferta hoy</h2>
        {ofertas.length === 0 ? (
          <p className="text-sm text-zinc-500 mb-6">
            Hoy no apareció ninguna herramienta con descuento real. Las ofertas cambian 3 veces por día: mientras tanto,
            usá los accesos de arriba o sumate al canal.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {ofertasLight.map((o, i) => (
              <OfertaCard key={o.id_ml} producto={o} priority={i < 4} />
            ))}
          </div>
        )}
      </section>

      <article className="max-w-3xl mx-auto px-4 pb-10">
        {comparativas.length > 0 && (
          <section className="mb-8">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Comparativas</h2>
            <ul className="space-y-1.5">
              {comparativas.map(c => (
                <li key={c.slug}>
                  <a href={`/mejores/${c.slug}`} className="font-bold text-yellow-400 hover:underline">📊 {c.titulo} →</a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mb-8">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Guías para elegir</h2>
          <ul className="space-y-1.5">
            {guias.map(g => (
              <li key={g.slug}>
                <a href={`/guias/${g.slug}`} className="text-yellow-400/80 hover:text-yellow-400">{g.titulo}</a>
              </li>
            ))}
            <li>
              <a href={`/categoria/${CAT}`} className="text-yellow-400/80 hover:text-yellow-400">
                Cómo elegir herramientas eléctricas (con cable, a batería o neumáticas)
              </a>
            </li>
          </ul>
        </section>

        {seguidos.length > 0 && (
          <section className="mb-8">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Historial de precios</h2>
            <ul className="space-y-1.5 text-sm">
              {seguidos.map(s => (
                <li key={s.id}>
                  <a href={`/precio/${s.slug}`} className="text-yellow-400/80 hover:text-yellow-400">{s.titulo}</a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mb-8">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-4">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {cat.faqs.map(f => (
              <details key={f.q} className="group bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
                <summary className="cursor-pointer text-sm font-bold text-zinc-100 list-none flex items-center justify-between gap-3">
                  {f.q}
                  <span className="text-yellow-400 shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="text-xs text-zinc-600">
          No probamos productos ni hacemos reseñas: comparamos precio, descuento y el historial que registramos. Los
          links a Mercado Libre son de afiliado; si comprás, recibimos una comisión sin costo extra para vos.
        </p>
      </article>

      <Footer brand="ofertas" />
    </main>
  )
}
