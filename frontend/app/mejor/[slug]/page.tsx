// "Mejor celular / notebook / smart TV hasta $X" con los equipos de hoy (lib/presupuesto.ts).
// Arriba la respuesta corta en HTML plano (la que citan Google y las IAs),
// después lo mejor en la parte alta del presupuesto y la lista completa.
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { tituloSeo, descripcionSeo } from '@/lib/seo'
import Footer from '@/components/Footer'
import LastUpdated from '@/components/LastUpdated'
import { getScrapedAt } from '@/lib/productos'
import { getComparador, type Equipo } from '@/lib/comparador'
import { armarPresupuesto, getPresupuesto, presupuestosConEquipos, type PresupuestoArmado } from '@/lib/presupuesto'
import { duelosConPrecio } from '@/lib/vs'

const DEALS_URL = 'https://cazadordeofertas.com.ar'
const TELEGRAM_URL = 'https://t.me/cazadordeofertasar'

export const generateStaticParams = () => presupuestosConEquipos().map(x => ({ slug: x.p.slug }))
export const dynamicParams = false

const pesos = (n: number) => `$${n.toLocaleString('es-AR')}`
const fechaAR = (iso: string) => iso.split('-').reverse().join('/')
const nombre = (x: PresupuestoArmado) => getComparador(x.p.comparador)?.nombre ?? x.p.comparador
/** "celulares", "notebooks", "smart TV" (para textos y migas). */
const plural = (x: PresupuestoArmado) => getComparador(x.p.comparador)?.plural ?? x.p.comparador
const esFem = (x: PresupuestoArmado) => getComparador(x.p.comparador)?.fem ?? false
const COMO_ELEGIMOS: Record<PresupuestoArmado['p']['comparador'], string> = {
  celulares:
    'Sumamos lo que dice el título de cada publicación: memoria interna, RAM (hasta 8 GB, porque los números más altos suelen incluir memoria virtual) y si tiene 5G. Si el título no lo dice, no suma. Recomendamos solo marcas conocidas.',
  notebooks:
    'Sumamos lo que dice el título de cada publicación: procesador (pesa más), memoria RAM hasta 16 GB, tamaño del disco SSD y si es gamer. Si el título no lo dice, no suma. Recomendamos solo marcas conocidas.',
  'smart-tv':
    'Sumamos lo que dice el título de cada publicación: las pulgadas (pesan más), la resolución (4K suma mucho más que Full HD o HD) y el tipo de panel (QLED, Mini LED u OLED suman sobre un LED común). Si el título no lo dice, no suma. Recomendamos solo marcas conocidas.',
}
const titulo = (x: PresupuestoArmado) => `Mejor ${nombre(x)} hasta $${x.p.texto} hoy en Mercado Libre`
const specsDe = (e: Equipo) => Object.values(e.specs).join(' · ')

function resumen(x: PresupuestoArmado, hoy: string): string {
  const r = x.recomendado
  const fem = esFem(x)
  const s = specsDe(r)
  return `Hoy (${hoy}), con hasta $${x.p.texto} ${fem ? 'la' : 'el'} ${nombre(x)} que más trae por su precio es ${r.titulo} (${s ? s + ', ' : ''}${pesos(r.precio)}). ${fem ? 'La más barata' : 'El más barato'} que entra es ${x.masBarato.titulo}, a ${pesos(x.masBarato.precio)}.`
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getPresupuesto((await params).slug)
  const x = p && armarPresupuesto(p)
  if (!x) return {}
  const url = `${DEALS_URL}/mejor/${x.p.slug}`
  const t = titulo(x)
  const desc = `${x.equipos.length} ${plural(x)} de hasta $${x.p.texto} en Mercado Libre Argentina, ordenados por lo que trae cada uno, con el precio más bajo que registramos. ${resumen(x, fechaAR(getScrapedAt().toISOString().slice(0, 10)))}`
  return {
    title: tituloSeo(t, [s => `${s} — Cazador de Ofertas AR`, s => s]),
    description: descripcionSeo(desc),
    metadataBase: new globalThis.URL(DEALS_URL),
    alternates: { canonical: url },
    openGraph: { title: t, description: desc, url, type: 'article', locale: 'es_AR', siteName: 'Cazador de Ofertas AR' },
  }
}

function Tarjeta({ e, destacado }: { e: Equipo; destacado?: string }) {
  return (
    <li className="flex gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
      {e.img && <Image src={e.img} alt="" width={64} height={64} className="h-16 w-16 shrink-0 rounded-lg bg-white object-contain" />}
      <div className="min-w-0 text-sm">
        {destacado && <p className="text-xs font-bold uppercase tracking-wide text-yellow-400">{destacado}</p>}
        <a href={e.url} target="_blank" rel="noopener noreferrer sponsored" className="font-semibold text-zinc-100 hover:text-yellow-400 line-clamp-2">
          {e.titulo}
        </a>
        {specsDe(e) && <p className="text-xs text-zinc-400">{specsDe(e)}</p>}
        <p>
          <strong className="text-yellow-400">{pesos(e.precio)}</strong>
          {e.descuento ? <span className="ml-1 text-emerald-400">{e.descuento}% OFF</span> : null}
        </p>
        {e.minimo ? (
          <p className="text-xs text-zinc-500">
            Más bajo registrado: {pesos(e.minimo)}
            {e.precio <= e.minimo ? <span className="text-cyan-300"> · está en su mínimo</span> : null}
          </p>
        ) : null}
      </div>
    </li>
  )
}

export default async function PresupuestoPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPresupuesto((await params).slug)
  const x = p && armarPresupuesto(p)
  if (!x) notFound()
  const url = `${DEALS_URL}/mejor/${x.p.slug}`
  const hoy = fechaAR(getScrapedAt().toISOString().slice(0, 10))
  const fem = esFem(x)
  const otros = presupuestosConEquipos().filter(o => o.p.comparador === x.p.comparador && o.p.slug !== x.p.slug)
  const duelos = duelosConPrecio().filter(d => d.duelo.comparador === x.p.comparador && Math.min(d.a.desde, d.b.desde) <= x.p.hasta).slice(0, 5)
  const alta = x.franjaAlta.filter(e => e !== x.recomendado)

  const faqs = [
    { q: `¿Cuál es ${fem ? 'la mejor' : 'el mejor'} ${nombre(x)} hasta $${x.p.texto}?`, a: resumen(x, hoy) },
    { q: `¿Cómo elegimos ${fem ? 'la que más trae' : 'el que más trae'}?`, a: COMO_ELEGIMOS[x.p.comparador] },
    { q: '¿De dónde salen los precios?', a: `Son los ${plural(x)} en oferta hoy en Mercado Libre Argentina y los que seguimos día por día (vistos en la última semana). Guardamos el precio de cada uno para mostrar el más bajo registrado. Los precios cambian todos los días: confirmalo en Mercado Libre antes de comprar.` },
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ofertas de hoy', item: DEALS_URL },
        { '@type': 'ListItem', position: 2, name: `Comparador de ${plural(x)}`, item: `${DEALS_URL}/comparador/${x.p.comparador}` },
        { '@type': 'ListItem', position: 3, name: `Hasta $${x.p.texto}`, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: titulo(x),
      itemListElement: x.equipos.slice(0, 20).map((e, i) => ({ '@type': 'ListItem', position: i + 1, name: e.titulo, url: e.url })),
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
            <Link href={`/comparador/${x.p.comparador}`} className="hover:text-yellow-400">Comparador de {plural(x)}</Link> <span aria-hidden="true">/</span>{' '}
            <span className="text-zinc-300">Hasta ${x.p.texto}</span>
          </nav>
          <h1 className="font-display text-3xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-4 [text-wrap:balance]">{titulo(x)}</h1>
          <p className="max-w-3xl text-zinc-400 leading-relaxed [text-wrap:pretty]">
            {x.equipos.length} {plural(x)} que hoy cuestan hasta ${x.p.texto} en Mercado Libre Argentina, ordenados por lo que trae cada {fem ? 'una' : 'uno'} según su publicación, con el precio más bajo que registramos.
          </p>
          <p className="mt-3 text-sm text-zinc-500">
            <LastUpdated scrapedAt={getScrapedAt().toISOString()} />.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <section className="mb-8 rounded-2xl border border-yellow-400/30 bg-yellow-400/5 px-5 py-4">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-2">Respuesta rápida</h2>
          <p className="text-zinc-200 leading-relaxed [text-wrap:pretty]">{resumen(x, hoy)}</p>
        </section>

        <section className="mb-8">
          <ul className="grid gap-3 sm:grid-cols-2">
            <Tarjeta e={x.recomendado} destacado={fem ? 'La que más trae' : 'El que más trae'} />
            {x.masBarato !== x.recomendado && <Tarjeta e={x.masBarato} destacado={fem ? 'La más barata' : 'El más barato'} />}
          </ul>
        </section>

        {alta.length > 0 && (
          <section className="mb-8">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Si querés aprovechar todo el presupuesto</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {alta.map(e => (
                <Tarjeta key={e.id} e={e} />
              ))}
            </ul>
          </section>
        )}

        {x.enMinimo.length > 0 && (
          <section className="mb-8">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Hoy en su precio más bajo</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {x.enMinimo.map(e => (
                <Tarjeta key={e.id} e={e} />
              ))}
            </ul>
          </section>
        )}

        <section className="mb-10">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-3">
            Todos hasta ${x.p.texto} ({x.equipos.length})
          </h2>
          <ol className="divide-y divide-zinc-900 text-sm">
            {x.equipos.slice(0, 30).map((e, i) => (
              <li key={e.id} className="flex items-baseline gap-3 py-2">
                <span className="w-6 shrink-0 text-right text-zinc-500">{i + 1}.</span>
                <a href={e.url} target="_blank" rel="noopener noreferrer sponsored" className="min-w-0 flex-1 text-zinc-200 hover:text-yellow-400">
                  {e.titulo}
                  {specsDe(e) && <span className="block text-xs text-zinc-500">{specsDe(e)}</span>}
                </a>
                <strong className="whitespace-nowrap text-yellow-400">{pesos(e.precio)}</strong>
              </li>
            ))}
          </ol>
          {x.equipos.length > 30 && (
            <p className="mt-2 text-xs text-zinc-500">
              Ves los 30 que más traen. El resto, con filtros, en el <Link href={`/comparador/${x.p.comparador}`} className="text-yellow-400 hover:underline">comparador</Link>.
            </p>
          )}
        </section>

        <section className="mb-10 max-w-3xl">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Seguí comparando</h2>
          <ul className="space-y-1.5">
            {otros.map(o => (
              <li key={o.p.slug}>
                <Link href={`/mejor/${o.p.slug}`} className="font-bold text-yellow-400 hover:underline">💲 Mejor {nombre(x)} hasta ${o.p.texto} →</Link>
              </li>
            ))}
            {duelos.map(d => (
              <li key={d.duelo.slug}>
                <Link href={`/vs/${d.duelo.slug}`} className="font-bold text-yellow-400 hover:underline">⚔️ {d.a.modelo.nombre} vs {d.b.modelo.nombre} →</Link>
              </li>
            ))}
            <li>
              <Link href={`/comparador/${x.p.comparador}`} className="font-bold text-yellow-400 hover:underline">🔎 Comparador de {plural(x)} con filtros →</Link>
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
      <Footer brand="ofertas" />
    </main>
  )
}
