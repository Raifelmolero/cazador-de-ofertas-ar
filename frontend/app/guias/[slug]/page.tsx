import type { Metadata } from 'next'
import { descripcionSeo, tituloSeo } from '@/lib/seo'
import { notFound } from 'next/navigation'
import Footer from '@/components/Footer'
import { GUIAS, fechasGuia, getGuia } from '@/lib/guias'
import { DEALS_URL, MARCA, ORG_ID, TELEGRAM_URL, WEBSITE_ID, WHATSAPP_URL } from '@/lib/marca'
import { getComparativa, productosDe } from '@/lib/comparativas'

export function generateStaticParams() {
  return GUIAS.map(g => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const g = getGuia((await params).slug)
  if (!g) return {}
  const url = `${DEALS_URL}/guias/${g.slug}`
  return {
    title: tituloSeo(g.titulo, [n => `${n} — Cazador de Ofertas AR`, n => n]),
    description: descripcionSeo(g.descripcion),
    alternates: { canonical: url },
    openGraph: {
      title: g.titulo,
      description: descripcionSeo(g.descripcion),
      url,
      type: 'article',
      locale: 'es_AR',
      siteName: 'Cazador de Ofertas AR',
    },
  }
}

export default async function GuiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const g = getGuia((await params).slug)
  if (!g) notFound()
  const url = `${DEALS_URL}/guias/${g.slug}`
  const comp = g.comparativa ? getComparativa(g.comparativa) : undefined
  const ofertas = comp ? productosDe(comp).slice(0, 4) : []
  const fechas = fechasGuia(g.slug)
  const org = { '@type': 'Organization', '@id': ORG_ID, name: MARCA, url: DEALS_URL }

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: g.titulo,
      description: g.descripcion,
      inLanguage: 'es-AR',
      mainEntityOfPage: url,
      datePublished: fechas.publicada,
      dateModified: fechas.modificada,
      author: org,
      publisher: org,
      isPartOf: { '@id': WEBSITE_ID },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: DEALS_URL },
        { '@type': 'ListItem', position: 2, name: g.titulo, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: g.pregunta, acceptedAnswer: { '@type': 'Answer', text: g.respuestaCorta } },
        ...(g.faq ?? []).map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      ],
    },
  ]

  return (
    <main className="min-h-screen">
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href={DEALS_URL} className="font-display text-lg font-extrabold tracking-tight">
            🎯 <span className="text-yellow-400">Cazador de Ofertas</span>
          </a>
          <a
            href={DEALS_URL}
            className="text-xs font-bold text-black bg-yellow-400 hover:bg-yellow-300 px-3 py-1.5 rounded-full"
          >
            Ver ofertas de hoy →
          </a>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
        <p className="text-xs font-bold tracking-widest text-yellow-400 mb-3">GUÍA</p>
        <h1 className="font-display text-3xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-6 [text-wrap:balance]">
          {g.titulo}
        </h1>

        <div className="rounded-2xl border border-yellow-400/30 bg-yellow-400/5 px-5 py-4 mb-8">
          <p className="text-xs font-bold text-yellow-400 mb-1">RESPUESTA CORTA</p>
          <p className="text-zinc-200 leading-relaxed">{g.respuestaCorta}</p>
        </div>

        {g.secciones.map(s => (
          <section key={s.h} className="mb-8">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3">{s.h}</h2>
            <div className="space-y-3 text-zinc-400 leading-relaxed">
              {s.p.map(t => (
                <p key={t}>{t}</p>
              ))}
            </div>
          </section>
        ))}

        {g.faq && g.faq.length > 0 && (
          <section className="mb-8">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Preguntas frecuentes</h2>
            <div className="space-y-4">
              {g.faq.map(f => (
                <div key={f.q}>
                  <h3 className="font-bold text-zinc-100 mb-1">{f.q}</h3>
                  <p className="text-zinc-400 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {comp && ofertas.length > 0 && (
          <section className="mb-8 rounded-2xl border border-zinc-800 p-5">
            <h2 className="font-display text-lg font-black mb-1">En oferta hoy</h2>
            <p className="text-xs text-zinc-500 mb-3">
              Del catálogo del día (se actualiza 3 veces por día). Links de afiliado de Mercado Libre: no cambian tu precio.
            </p>
            <ul className="space-y-2">
              {ofertas.map(p => (
                <li key={p.id_ml} className="flex items-baseline justify-between gap-3 text-sm">
                  <a href={p.url_producto} rel="sponsored nofollow" target="_blank" className="text-zinc-300 hover:text-yellow-400 line-clamp-1">
                    {p.titulo}
                  </a>
                  <span className="whitespace-nowrap text-zinc-100 font-semibold">
                    ${p.precio_actual.toLocaleString('es-AR')}
                    {p.descuento_pct != null && <span className="ml-2 text-red-400">-{p.descuento_pct}%</span>}
                  </span>
                </li>
              ))}
            </ul>
            <a href={`/mejores/${comp.slug}`} className="inline-block mt-3 text-sm font-bold text-yellow-400 hover:underline">
              Ver la comparativa completa →
            </a>
          </section>
        )}

        {g.enlaces && g.enlaces.length > 0 && (
          <nav className="mb-8 flex flex-wrap gap-2">
            {g.enlaces.map(e => (
              <a key={e.href} href={e.href} className="text-sm font-bold border border-zinc-700 hover:border-yellow-400 text-zinc-200 rounded-xl px-4 py-2">
                {e.texto}
              </a>
            ))}
          </nav>
        )}

        {g.fuentes && g.fuentes.length > 0 && (
          <div className="text-xs text-zinc-600 mb-8">
            <p>Fuentes:</p>
            <ul className="list-disc pl-5">
              {g.fuentes.map(f => (
                <li key={f.url}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-400">
                    {f.texto}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 px-6 py-7 text-center mt-10">
          <p className="font-display text-xl font-black mb-2">
            {g.cta
              ? g.cta.titulo
              : g.categoria
              ? `Ofertas de ${g.categoria.nombre} de hoy, ya verificadas`
              : 'Las ofertas reales de hoy, ya verificadas'}
          </p>
          <p className="text-sm text-zinc-400 mb-5">Sin registro, sin costo, actualizadas 3 veces por día.</p>
          <a
            href={g.cta ? g.cta.href : g.categoria ? `/categoria/${g.categoria.slug}` : DEALS_URL}
            className="inline-block text-sm font-bold bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl px-8 py-3"
          >
            {g.cta ? g.cta.boton : g.categoria ? `Ver ${g.categoria.nombre} en oferta 🎯` : 'Ver las ofertas de hoy 🎯'}
          </a>
        </div>

        <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="font-bold text-zinc-100 mb-1">
            ¿Todavía no comprás? Te avisamos cuando baje{g.categoria ? ` algo de ${g.categoria.nombre}` : ''} 🔔
          </p>
          <p className="text-sm text-zinc-400 mb-4">
            Todos los días publicamos las ofertas con descuento real verificado. Gratis, sin spam, te salís cuando quieras.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-black bg-green-500 hover:bg-green-400 px-4 py-2 rounded-full transition-colors"
            >
              Seguir el canal de WhatsApp 💬
            </a>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-black bg-yellow-400 hover:bg-yellow-300 px-4 py-2 rounded-full transition-colors"
            >
              Unirme a Telegram ✈️
            </a>
          </div>
        </section>
        <nav className="mt-10 text-sm">
          <p className="font-bold text-zinc-300 mb-2">Más guías</p>
          <ul className="space-y-1.5">
            {GUIAS.filter(x => x.slug !== g.slug).map(x => (
              <li key={x.slug}>
                <a href={`/guias/${x.slug}`} className="text-yellow-400/80 hover:text-yellow-400">
                  {x.titulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </article>
      <Footer brand="ofertas" />
    </main>
  )
}
