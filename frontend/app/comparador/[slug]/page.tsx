// Comparador de celulares / notebooks con precios reales (lib/comparador.ts).
// Arriba, la "respuesta rápida" por presupuesto en HTML plano (lo que citan
// Google y las IAs); abajo, el comparador interactivo con filtros.
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { tituloSeo, descripcionSeo } from '@/lib/seo'
import Footer from '@/components/Footer'
import LastUpdated from '@/components/LastUpdated'
import ComparadorEquipos from '@/components/ComparadorEquipos'
import { COMPARADORES, equiposDe, getComparador, rangoDe, type Comparador, type Equipo } from '@/lib/comparador'
import { getScrapedAt } from '@/lib/productos'
import { GUIAS } from '@/lib/guias'
import { art, getPrecioHoy } from '@/lib/preciohoy'

const DEALS_URL = 'https://cazadordeofertas.com.ar'
const TELEGRAM_URL = 'https://t.me/cazadordeofertasar'

export const generateStaticParams = () => COMPARADORES.map(c => ({ slug: c.slug }))
export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getComparador((await params).slug)
  if (!c) return {}
  const url = `${DEALS_URL}/comparador/${c.slug}`
  return {
    title: tituloSeo(c.titulo, [t => `${t} — Cazador de Ofertas AR`, t => t]),
    description: descripcionSeo(c.descripcion),
    metadataBase: new globalThis.URL(DEALS_URL),
    alternates: { canonical: url },
    openGraph: { title: c.titulo, description: c.descripcion, url, type: 'website', locale: 'es_AR', siteName: 'Cazador de Ofertas AR' },
  }
}

const pesos = (n: number) => `$${n.toLocaleString('es-AR')}`
const fechaAR = (iso: string) => iso.split('-').reverse().join('/')

/** El más barato que cumple una condición (para las respuestas rápidas). */
const masBarato = (xs: Equipo[], f: (e: Equipo) => boolean) => xs.find(f)

function respuestas(c: Comparador, equipos: Equipo[]): { q: string; e: Equipo }[] {
  const uno = c.fem ? 'la' : 'el'
  const out: { q: string; e: Equipo | undefined }[] =
    c.slug === 'celulares'
      ? [
          { q: `${uno} ${c.nombre} más barato con 128 GB`, e: masBarato(equipos, e => e.orden.memoria >= 128) },
          { q: `${uno} ${c.nombre} más barato con 256 GB`, e: masBarato(equipos, e => e.orden.memoria >= 256) },
          { q: `${uno} ${c.nombre} 5G más barato`, e: masBarato(equipos, e => e.orden.g5 === 1) },
          { q: `el iPhone más barato`, e: masBarato(equipos, e => e.marca === 'Apple') },
          { q: `el Samsung más barato`, e: masBarato(equipos, e => e.marca === 'Samsung') },
          { q: `el Motorola más barato`, e: masBarato(equipos, e => e.marca === 'Motorola') },
        ]
      : [
          { q: `${uno} ${c.nombre} más barata con 8 GB de RAM y SSD`, e: masBarato(equipos, e => e.orden.ram >= 8 && e.orden.disco >= 128) },
          { q: `${uno} ${c.nombre} más barata con i5 o Ryzen 5`, e: masBarato(equipos, e => e.orden.cpu >= 3) },
          { q: `${uno} ${c.nombre} más barata con 16 GB de RAM`, e: masBarato(equipos, e => e.orden.ram >= 16) },
          { q: `${uno} ${c.nombre} más barata con i7 o Ryzen 7`, e: masBarato(equipos, e => e.orden.cpu >= 4) },
          { q: `${uno} ${c.nombre} gamer más barata`, e: masBarato(equipos, e => e.orden.gamer === 1) },
          { q: `la MacBook más barata`, e: masBarato(equipos, e => e.marca === 'Apple') },
        ]
  return out.filter((x): x is { q: string; e: Equipo } => !!x.e)
}

export default async function ComparadorPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = getComparador((await params).slug)
  if (!c) notFound()
  const url = `${DEALS_URL}/comparador/${c.slug}`
  const equipos = equiposDe(c)
  const enOferta = equipos.filter(e => e.enOferta).length
  const porRango = c.rangos.map((r, i) => ({ r, xs: equipos.filter(e => rangoDe(c, e.precio) === i) }))
  const rapidas = respuestas(c, equipos)
  const hoy = fechaAR(getScrapedAt().toISOString().slice(0, 10))
  const guias = GUIAS.filter(g => c.guias.includes(g.slug))
  const precios = c.precioHoy.map(getPrecioHoy).filter(p => !!p)
  const otro = COMPARADORES.find(x => x.slug !== c.slug)

  const faqs = [
    ...rapidas.slice(0, 4).map(({ q, e }) => ({
      q: `¿Cuál es ${q} hoy en Mercado Libre?`,
      a: `Hoy (${hoy}) ${q} que encontramos es ${e.titulo}, a ${pesos(e.precio)}${e.minimo ? `; el más bajo que registramos fue ${pesos(e.minimo)}` : ''}. Los precios cambian todos los días: confirmalo en Mercado Libre antes de comprar.`,
    })),
    {
      q: `¿De dónde salen estos precios?`,
      a: `Son los ${c.plural} en oferta hoy en Mercado Libre Argentina y los que seguimos día por día (vistos en la última semana). Guardamos el precio de cada uno para mostrar el más bajo registrado; las características salen del título de la publicación.`,
    },
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ofertas de hoy', item: DEALS_URL },
        { '@type': 'ListItem', position: 2, name: 'Tecnología', item: `${DEALS_URL}/tecno` },
        { '@type': 'ListItem', position: 3, name: `Comparador de ${c.plural}`, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${c.plural[0].toUpperCase() + c.plural.slice(1)} en Mercado Libre Argentina, de menor a mayor precio`,
      itemListElement: equipos.slice(0, 30).map((e, i) => ({ '@type': 'ListItem', position: i + 1, name: e.titulo, url: e.url })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
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
            🎯 <span className="text-yellow-400">Cazador de Ofertas</span>
          </a>
          <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-black bg-yellow-400 hover:bg-yellow-300 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap">
            Alertas gratis
          </a>
        </div>
      </header>

      <section className="border-b border-zinc-900 px-4 py-8 sm:py-10">
        <div className="max-w-5xl mx-auto">
          <nav aria-label="Ruta" className="text-xs text-zinc-500 mb-3">
            <a href={DEALS_URL} className="hover:text-yellow-400">Ofertas de hoy</a> <span aria-hidden="true">/</span>{' '}
            <Link href="/tecno" className="hover:text-yellow-400">Tecnología</Link> <span aria-hidden="true">/</span>{' '}
            <span className="text-zinc-300">Comparador de {c.plural}</span>
          </nav>
          <h1 className="font-display text-3xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-4 [text-wrap:balance]">{c.titulo}</h1>
          <p className="max-w-3xl text-zinc-400 leading-relaxed [text-wrap:pretty]">{c.intro}</p>
          <p className="mt-3 text-sm text-zinc-500">
            {equipos.length} {c.plural} · {enOferta} en oferta hoy · <LastUpdated scrapedAt={getScrapedAt().toISOString()} />.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {rapidas.length > 0 && (
          <section className="mb-8">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Respuesta rápida: hoy, {hoy}</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {rapidas.map(({ q, e }) => (
                <li key={q} className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm">
                  <span className="text-zinc-400">{q[0].toUpperCase() + q.slice(1)}:</span>{' '}
                  <a href={e.url} target="_blank" rel="noopener noreferrer sponsored" className="font-semibold text-zinc-100 hover:text-yellow-400">
                    {e.titulo}
                  </a>{' '}
                  <strong className="text-yellow-400 whitespace-nowrap">{pesos(e.precio)}</strong>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mb-8">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Por presupuesto</h2>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            {porRango.map(({ r, xs }) => (
              <li key={r.texto} className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
                <p className="font-bold text-zinc-100">{r.texto}</p>
                <p className="text-zinc-400">
                  {xs.length === 0 ? (
                    'Hoy no encontramos ninguno.'
                  ) : (
                    <>
                      {xs.length} {xs.length === 1 ? c.nombre : c.plural}. Desde {pesos(xs[0].precio)}: {xs[0].titulo}
                    </>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10" data-seccion="comparador">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Filtrá y compará</h2>
          <ComparadorEquipos equipos={equipos} rangos={c.rangos} filtros={c.filtros} specs={c.specs} plural={c.plural} />
        </section>

        <section className="mb-10 max-w-3xl">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Antes de elegir</h2>
          <ul className="space-y-1.5">
            <li>
              <Link href="/cyber-monday/tecnologia" className="font-bold text-cyan-300 hover:underline">🛒 Cyber Monday: ¿bajan de verdad los celulares y notebooks? →</Link>
            </li>
            {precios.map(p => (
              <li key={p!.slug}>
                <a href={`/precio-hoy/${p!.slug}`} className="font-bold text-yellow-400 hover:underline">💲 Cuánto sale {art(p!, false)} {p!.nombre} hoy →</a>
              </li>
            ))}
            {guias.map(g => (
              <li key={g.slug}>
                <a href={`/guias/${g.slug}`} className="font-bold text-yellow-400 hover:underline">📘 {g.titulo} →</a>
              </li>
            ))}
            {otro && (
              <li>
                <Link href={`/comparador/${otro.slug}`} className="font-bold text-yellow-400 hover:underline">🔎 Comparador de {otro.plural} →</Link>
              </li>
            )}
            <li>
              <Link href="/tecno" className="font-bold text-yellow-400 hover:underline">📱 Todas las ofertas de tecnología de hoy →</Link>
            </li>
          </ul>
        </section>

        <section className="max-w-3xl">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-4">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {faqs.map(f => (
              <div key={f.q}>
                <h3 className="font-bold text-zinc-100 mb-1">{f.q}</h3>
                <p className="text-zinc-400 leading-relaxed [text-wrap:pretty]">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}
