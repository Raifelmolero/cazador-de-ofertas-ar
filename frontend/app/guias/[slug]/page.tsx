import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Footer from '@/components/Footer'
import { GUIAS, getGuia } from '@/lib/guias'

const DEALS_URL = 'https://cazadordeofertas.com.ar'

export function generateStaticParams() {
  return GUIAS.map(g => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const g = getGuia((await params).slug)
  if (!g) return {}
  const url = `${DEALS_URL}/guias/${g.slug}`
  return {
    title: `${g.titulo} — Cazador de Ofertas AR`,
    description: g.descripcion,
    alternates: { canonical: url },
    openGraph: {
      title: g.titulo,
      description: g.descripcion,
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

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: g.titulo,
      description: g.descripcion,
      inLanguage: 'es-AR',
      mainEntityOfPage: url,
      author: { '@type': 'Organization', name: 'Cazador de Ofertas AR', url: DEALS_URL },
      publisher: { '@type': 'Organization', name: 'Cazador de Ofertas AR', url: DEALS_URL },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: g.pregunta, acceptedAnswer: { '@type': 'Answer', text: g.respuestaCorta } },
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
