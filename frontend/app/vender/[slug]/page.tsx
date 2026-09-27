import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import CalcHeader from '@/components/CalcHeader'
import Footer from '@/components/Footer'
import { CALC_URL, GUIAS_VENDER, getGuiaVendedor } from '@/lib/vender'

export function generateStaticParams() {
  return GUIAS_VENDER.map(g => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const g = getGuiaVendedor((await params).slug)
  if (!g) return {}
  const url = `${CALC_URL}/vender/${g.slug}`
  return {
    title: `${g.titulo} — CalculadoraML`,
    description: g.descripcion,
    alternates: { canonical: url },
    openGraph: { title: g.titulo, description: g.descripcion, url, type: 'article', locale: 'es_AR', siteName: 'CalculadoraML' },
  }
}

export default async function GuiaVendedorPage({ params }: { params: Promise<{ slug: string }> }) {
  const g = getGuiaVendedor((await params).slug)
  if (!g) notFound()
  const url = `${CALC_URL}/vender/${g.slug}`
  const externo = g.cta.href.startsWith('http')

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: g.titulo,
      description: g.descripcion,
      inLanguage: 'es-AR',
      mainEntityOfPage: url,
      author: { '@type': 'Organization', name: 'CalculadoraML', url: CALC_URL },
      publisher: { '@type': 'Organization', name: 'CalculadoraML', url: CALC_URL },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [{ '@type': 'Question', name: g.pregunta, acceptedAnswer: { '@type': 'Answer', text: g.respuestaCorta } }],
    },
  ]

  return (
    <main className="min-h-screen">
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}
      <CalcHeader />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-xs text-zinc-500 mb-3">
          <Link href="/vender" className="hover:text-yellow-400">Guías para vender</Link>
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-black leading-tight tracking-tight mb-6 [text-wrap:balance]">
          {g.titulo}
        </h1>
        <section className="rounded-2xl border border-yellow-400/25 bg-yellow-400/5 p-5 mb-8">
          <h2 className="font-bold text-yellow-200 mb-2">{g.pregunta}</h2>
          <p className="text-zinc-200 leading-relaxed">{g.respuestaCorta}</p>
        </section>
        {g.secciones.map(s => (
          <section key={s.h} className="mb-8">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3">{s.h}</h2>
            <div className="space-y-3 text-zinc-300 leading-relaxed">
              {s.p.map(t => (
                <p key={t}>{t}</p>
              ))}
            </div>
          </section>
        ))}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
          <p className="text-zinc-300 mb-4">{g.cta.texto}</p>
          <a
            href={g.cta.href}
            {...(externo ? { target: '_blank', rel: g.cta.afiliado ? 'sponsored noopener' : 'noopener' } : {})}
            className="inline-block text-sm font-bold bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl px-6 py-3"
          >
            {g.cta.boton}
          </a>
          {g.cta.afiliado && (
            <p className="text-xs text-zinc-500 mt-3">
              Es un link de afiliado: si abrís tu tienda desde ahí, CalculadoraML recibe una comisión sin costo extra para vos.
            </p>
          )}
        </section>
        <nav className="mt-10 text-sm">
          <p className="font-bold text-zinc-300 mb-2">Otras guías</p>
          <ul className="space-y-1.5">
            <li><Link href="/calculadora-de-comisiones" className="text-yellow-400 hover:underline">Calculadora de comisiones de Mercado Libre</Link></li>
            {GUIAS_VENDER.filter(x => x.slug !== g.slug).map(x => (
              <li key={x.slug}><Link href={`/vender/${x.slug}`} className="text-yellow-400 hover:underline">{x.titulo}</Link></li>
            ))}
          </ul>
        </nav>
      </article>
      <Footer />
    </main>
  )
}
