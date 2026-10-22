// Hub de un nicho (ver lib/nichos.ts). Lo usan /herramientas, /hogar, etc.

import type { Metadata } from 'next'
import { descripcionSeo, tituloSeo } from '@/lib/seo'
import Footer from '@/components/Footer'
import OfertaCard, { type OfertaLight } from '@/components/OfertaCard'
import LastUpdated from '@/components/LastUpdated'
import TopOfertasHoy from '@/components/TopOfertasHoy'
import { topDescuento } from '@/lib/relacionados'
import { getScrapedAt } from '@/lib/productos'
import { getCategoria, ofertasDeCategoria, type Categoria } from '@/lib/categorias'
import { GUIAS } from '@/lib/guias'
import { COMPARATIVAS } from '@/lib/comparativas'
import { PRECIOS_HOY, art } from '@/lib/preciohoy'
import { seguidosDeCategoria, slugPorId } from '@/lib/seguimiento'
import { busquedaML } from '@/lib/afiliado'
import type { Nicho } from '@/lib/nichos'

const DEALS_URL = 'https://cazadordeofertas.com.ar'
const TELEGRAM_URL = 'https://t.me/cazadordeofertasar'
const WHATSAPP_URL = 'https://whatsapp.com/channel/0029Vb9CICi7DAWspd4ius2Z'

export function nichoMetadata(n: Nicho): Metadata {
  const url = `${DEALS_URL}/${n.slug}`
  return {
    title: tituloSeo(n.titulo, [t => `${t} — Cazador de Ofertas AR`, t => t]),
    description: descripcionSeo(n.descripcion),
    alternates: { canonical: url },
    openGraph: { title: n.titulo, description: n.descripcion, url, type: 'website', locale: 'es_AR', siteName: 'Cazador de Ofertas AR' },
  }
}

export default function NichoHub({ nicho: n, extra }: { nicho: Nicho; extra?: React.ReactNode }) {
  const url = `${DEALS_URL}/${n.slug}`
  const cats = n.categorias.map(getCategoria).filter((c): c is Categoria => !!c)
  const vistos = new Set<string>()
  const ofertas = cats.flatMap(ofertasDeCategoria).filter(o => !vistos.has(o.id_ml) && vistos.add(o.id_ml))
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
  const top3 = topDescuento(ofertasLight, 3)
  const guias = GUIAS.filter(g => g.categoria && n.categorias.includes(g.categoria.slug))
  const comparativas = COMPARATIVAS.filter(c => c.categoria && n.categorias.includes(c.categoria))
  const precios = PRECIOS_HOY.filter(p => (p.categoria && n.categorias.includes(p.categoria)) || n.precios?.includes(p.slug))
  const seguidos = n.categorias.flatMap(seguidosDeCategoria).slice(0, 30)
  // Las 2 primeras preguntas de cada categoría: el hub no repite páginas enteras
  const faqs = cats.flatMap(c => c.faqs.slice(0, cats.length > 1 ? 2 : c.faqs.length))

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ofertas de hoy', item: DEALS_URL },
        { '@type': 'ListItem', position: 2, name: n.marca, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ]

  const chip =
    'block rounded-full border border-zinc-800 bg-zinc-900 px-3.5 py-1.5 text-xs font-bold text-zinc-300 hover:border-yellow-400/40 hover:text-yellow-300 transition-colors'

  return (
    <main className="min-h-screen">
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}

      <header className="sticky top-0 z-10 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <a href={DEALS_URL} className="font-display text-lg font-extrabold tracking-tight">
            {n.emoji} <span className="text-yellow-400">{n.marca}</span>
          </a>
          <div className="flex items-center gap-2">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-black bg-green-500 hover:bg-green-400 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
          >
            WhatsApp 💬
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
        </div>
      </header>

      <section className="border-b border-zinc-900 px-4 py-5 sm:py-12">
        <div className="max-w-3xl mx-auto">
          <nav aria-label="Ruta" className="text-xs text-zinc-500 mb-3">
            <a href={DEALS_URL} className="hover:text-yellow-400">Ofertas de hoy</a> <span aria-hidden="true">/</span>{' '}
            <span className="text-zinc-300">{n.marca}</span>
          </nav>
          <h1 className="font-display text-2xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-3 sm:mb-4 [text-wrap:balance]">
            {n.titulo}
          </h1>
          <p className="text-zinc-400 leading-relaxed [text-wrap:pretty]">{n.intro}</p>
          <p className="mt-4 inline-flex flex-wrap items-center gap-x-2 text-[11px] sm:text-xs font-semibold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-1.5">
            <LastUpdated scrapedAt={scrapedAt} /> · {ofertas.length} {ofertas.length === 1 ? 'oferta' : 'ofertas'} hoy
          </p>
          {n.busquedas[0] && (
            <a
              href={busquedaML(n.busquedas[0], n.etiqueta)}
              target="_blank"
              rel="noopener noreferrer sponsored"
              data-seccion={`hub_${n.slug}_hero`}
              className="mt-4 flex w-full items-center justify-center rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black text-black transition-colors hover:bg-yellow-300 sm:inline-flex sm:w-auto"
            >
              Ver {n.busquedas[0]} en Mercado Libre ↗
            </a>
          )}
        </div>
      </section>

      <TopOfertasHoy
        ofertas={top3}
        titulo="🔥 Las 3 ofertas con más descuento hoy"
        seccion={`hub_${n.slug}_top3`}
        id={`top3-${n.slug}`}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div data-seccion={`hub_${n.slug}_ofertas`}>
        <h2 className="font-display text-xl sm:text-2xl font-black mb-4">En oferta hoy</h2>
        {ofertas.length === 0 ? (
          <p className="text-sm text-zinc-500 mb-8">
            Hoy no apareció ningún producto de este rubro con descuento real. Sumamos ofertas nuevas seguido:
            mientras tanto, usá las búsquedas de arriba o sumate al canal.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {ofertasLight.map((o, i) => (
              <OfertaCard key={o.id_ml} producto={o} priority={i < 4} />
            ))}
          </div>
        )}
        </div>

        {cats.length > 1 && (
          <>
            <h2 className="font-display text-xl sm:text-2xl font-black mb-4">Por rubro</h2>
            <ul className="flex flex-wrap gap-2 mb-8">
              {cats.map(c => (
                <li key={c.slug}>
                  <a href={`/categoria/${c.slug}`} className={chip}>{c.nombre}</a>
                </li>
              ))}
            </ul>
          </>
        )}

        <h2 className="font-display text-xl sm:text-2xl font-black mb-4">Buscá en Mercado Libre</h2>
        <ul className="flex flex-wrap gap-2 mb-8">
          {n.busquedas.map(q => (
            <li key={q}>
              <a href={busquedaML(q, n.etiqueta)} target="_blank" rel="noopener noreferrer sponsored" className={chip}>
                {q} ↗
              </a>
            </li>
          ))}
        </ul>

      </section>

      <article className="max-w-3xl mx-auto px-4 pb-10">
        {n.destacados && n.destacados.length > 0 && (
          <ul className="mb-8 space-y-1.5">
            {n.destacados.map(d => (
              <li key={d.href}>
                <a href={d.href} className="font-bold text-cyan-300 hover:underline">{d.texto} →</a>
              </li>
            ))}
          </ul>
        )}
        {precios.length > 0 && (
          <section className="mb-8">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Precio de hoy</h2>
            <ul className="space-y-1.5">
              {precios.map(p => (
                <li key={p.slug}>
                  <a href={`/precio-hoy/${p.slug}`} className="font-bold text-yellow-400 hover:underline">💲 Cuánto sale {art(p, false)} {p.nombre} hoy →</a>
                </li>
              ))}
            </ul>
          </section>
        )}

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

        {guias.length > 0 && (
          <section className="mb-8">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Guías para elegir</h2>
            <ul className="space-y-1.5">
              {guias.map(g => (
                <li key={g.slug}>
                  <a href={`/guias/${g.slug}`} className="text-yellow-400/80 hover:text-yellow-400">{g.titulo}</a>
                </li>
              ))}
            </ul>
          </section>
        )}

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

        {faqs.length > 0 && (
          <section className="mb-8">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-4">Preguntas frecuentes</h2>
            <div className="space-y-3">
              {faqs.map(f => (
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
        )}

        {extra}

        <p className="text-xs text-zinc-600">
          No probamos productos ni hacemos reseñas: comparamos precio, descuento y el historial que registramos. Los
          links a Mercado Libre son de afiliado; si comprás, recibimos una comisión sin costo extra para vos.
        </p>
      </article>

      <Footer brand="ofertas" />
    </main>
  )
}
