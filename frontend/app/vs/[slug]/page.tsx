// Duelo "X vs Y" con los precios reales de hoy (lib/vs.ts). Arriba la
// respuesta corta en HTML plano (la que citan Google y las IAs), después la
// tabla lado a lado y las publicaciones de cada modelo.
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { tituloSeo, descripcionSeo, MAX_DESCRIPCION } from '@/lib/seo'
import Footer from '@/components/Footer'
import LastUpdated from '@/components/LastUpdated'
import { getScrapedAt } from '@/lib/productos'
import { armarDuelo, diferencia, duelosConPrecio, getDuelo, type DueloArmado, type Lado } from '@/lib/vs'

const DEALS_URL = 'https://cazadordeofertas.com.ar'
const TELEGRAM_URL = 'https://t.me/cazadordeofertasar'

export const generateStaticParams = () => duelosConPrecio().map(x => ({ slug: x.duelo.slug }))
export const dynamicParams = false

const pesos = (n: number) => `$${n.toLocaleString('es-AR')}`
const fechaAR = (iso: string) => iso.split('-').reverse().join('/')
const sinMarca = (s: string) => s.replace(/(Samsung|Motorola|Xiaomi|Apple) /g, '')
const titulo = (x: DueloArmado) => `${x.a.modelo.nombre} vs ${x.b.modelo.nombre}: precio hoy en Mercado Libre`

function resumen(x: DueloArmado, hoy: string): string {
  const d = diferencia(x)
  // Sin memoria/procesador en común se aclara el de cada uno: si no, un 128 GB contra un 256 GB parece el mismo equipo.
  const memoDe = (e: typeof d.eBarato) => {
    if (d.igual) return ` con ${d.igual}`
    const propio = e.specs.memoria ?? e.specs.procesador
    return propio ? ` (${propio})` : ''
  }
  const [ea, eb] = x.a.equipos.includes(d.eBarato) ? [d.eBarato, d.eCaro] : [d.eCaro, d.eBarato]
  const [ma, mb] = [memoDe(ea), memoDe(eb)]
  // Si se comparó a igual pero el más barato de alguno es otra versión, se avisa: el "a igual" solo no cuenta todo.
  const otros =
    d.igual && (d.eBarato !== d.barato.equipos[0] || d.eCaro !== d.caro.equipos[0])
      ? ` Sin mirar ${x.duelo.comparador === 'notebooks' ? 'el procesador' : 'la memoria'}, el más barato de cada uno sale ${pesos(x.a.desde)} (${x.a.modelo.nombre}) y ${pesos(x.b.desde)} (${x.b.modelo.nombre}).`
      : ''
  if (d.pct <= 2) {
    return `Hoy (${hoy}) el ${x.a.modelo.nombre}${ma} y el ${x.b.modelo.nombre}${mb} cuestan prácticamente lo mismo en Mercado Libre: ${pesos(ea.precio)} contra ${pesos(eb.precio)}.${otros}`
  }
  return `Hoy (${hoy}) el ${d.barato.modelo.nombre}${memoDe(d.eBarato)} más barato sale ${pesos(d.eBarato.precio)} y el ${d.caro.modelo.nombre}${memoDe(d.eCaro)} ${pesos(d.eCaro.precio)}: el ${d.caro.modelo.nombre} cuesta ${pesos(d.pesos)} más (${d.pct} %).${otros}`
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const d = getDuelo((await params).slug)
  const x = d && armarDuelo(d)
  if (!x) return {}
  const url = `${DEALS_URL}/vs/${x.duelo.slug}`
  const t = titulo(x)
  // "X vs Y:" primero (lo que se busca) y sin la fecha adelante, que gastaba caracteres del resultado de Google.
  const dif = diferencia(x)
  const [nb, nc] = [sinMarca(dif.barato.modelo.nombre), sinMarca(dif.caro.modelo.nombre)]
  const base =
    dif.pct <= 2
      ? `${x.a.modelo.nombre} vs ${x.b.modelo.nombre}: hoy cuestan casi lo mismo, ${pesos(dif.eBarato.precio)} y ${pesos(dif.eCaro.precio)}.`
      : `${x.a.modelo.nombre} vs ${x.b.modelo.nombre}: hoy el ${nb} sale ${pesos(dif.eBarato.precio)} y el ${nc} ${pesos(dif.eCaro.precio)} (${dif.pct} % más).`
  const cola = ' Precios de Mercado Libre y el mínimo que registramos.'
  const desc = (base + cola).length <= MAX_DESCRIPCION ? base + cola : base
  return {
    // "X vs Y" siempre entero al principio: con nombres largos se acorta la cola fija,
    // y si igual no entra, la marca ("Samsung Galaxy A16" → "Galaxy A16"), nunca a mitad de frase.
    title: tituloSeo(`${x.a.modelo.nombre} vs ${x.b.modelo.nombre}`, [
      s => `${s}: precio hoy en Mercado Libre — Cazador de Ofertas AR`,
      s => `${s}: precio hoy en Mercado Libre`,
      s => `${s}: ¿cuál conviene? Precio hoy`,
      s => `${s}: precio hoy`,
      s => `${sinMarca(s)}: precio hoy`,
    ]),
    description: descripcionSeo(desc),
    metadataBase: new globalThis.URL(DEALS_URL),
    alternates: { canonical: url },
    openGraph: { title: t, description: desc, url, type: 'article', locale: 'es_AR', siteName: 'Cazador de Ofertas AR' },
  }
}

function Columna({ l }: { l: Lado }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
      <h3 className="font-display text-lg font-black mb-3">{l.modelo.nombre}</h3>
      <ul className="space-y-3">
        {l.equipos.slice(0, 5).map(e => (
          <li key={e.id} className="flex gap-3">
            {e.img && <Image src={e.img} alt="" width={56} height={56} className="h-14 w-14 shrink-0 rounded-lg bg-white object-contain" />}
            <div className="min-w-0 text-sm">
              <a href={e.url} target="_blank" rel="noopener noreferrer sponsored" className="font-semibold text-zinc-100 hover:text-yellow-400 line-clamp-2">
                {e.titulo}
              </a>
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
        ))}
      </ul>
      {l.equipos.length > 5 && <p className="mt-3 text-xs text-zinc-500">Y {l.equipos.length - 5} publicaciones más en el comparador.</p>}
    </div>
  )
}

export default async function DueloPage({ params }: { params: Promise<{ slug: string }> }) {
  const d = getDuelo((await params).slug)
  const x = d && armarDuelo(d)
  if (!x) notFound()
  const url = `${DEALS_URL}/vs/${x.duelo.slug}`
  const hoy = fechaAR(getScrapedAt().toISOString().slice(0, 10))
  const dif = diferencia(x)
  const otros = duelosConPrecio().filter(o => o.duelo.slug !== x.duelo.slug && o.duelo.comparador === x.duelo.comparador)
  const relacionados = [
    ...otros.filter(o => [o.a, o.b].some(l => l.modelo === x.a.modelo || l.modelo === x.b.modelo)),
    ...otros.filter(o => ![o.a, o.b].some(l => l.modelo === x.a.modelo || l.modelo === x.b.modelo)),
  ].slice(0, 6)

  const notebook = x.duelo.comparador === 'notebooks'
  const nada = 'No figura en el título'
  const filas: [string, (l: Lado) => string][] = [
    [notebook ? 'La más barata hoy' : 'Más barato hoy', l => pesos(l.desde)],
    ['Más bajo que registramos', l => (l.minimo ? pesos(l.minimo) : 'Sin historial todavía')],
    ...(notebook ? ([['Procesadores a la venta', (l: Lado) => l.procesadores.join(', ') || nada]] as [string, (l: Lado) => string][]) : []),
    [notebook ? 'Discos a la venta' : 'Memorias a la venta', l => l.memorias.join(', ') || nada],
    ['Publicaciones encontradas', l => `${l.equipos.length} (${l.enOferta} en oferta hoy)`],
  ]

  // "¿Cuál conviene según lo que buscás?": solo con lo que sale de las publicaciones de hoy, sin specs inventadas.
  const gb = (s: string) => parseFloat(s) * (s.endsWith('TB') ? 1024 : 1)
  const maxMem = (l: Lado) => (l.memorias.length ? l.memorias[l.memorias.length - 1] : null)
  const [ma, mb] = [maxMem(x.a), maxMem(x.b)]
  const cercaDelMinimo = (l: Lado) => (l.minimo ? l.desde / l.minimo : Infinity)
  const usos: [string, string][] = [
    dif.pct <= 2
      ? ['Si querés gastar lo menos posible', `Hoy da casi lo mismo: ${pesos(dif.eBarato.precio)} contra ${pesos(dif.eCaro.precio)}. Elegí por la marca o el tamaño que prefieras.`]
      : ['Si querés gastar lo menos posible', `El ${dif.barato.modelo.nombre}: hoy te ahorrás ${pesos(dif.pesos)} (${dif.pct} %) frente al ${dif.caro.modelo.nombre}${dif.igual ? `, comparando los dos con ${dif.igual}` : ''}.`],
  ]
  if (ma && mb) {
    const label = notebook ? 'más disco' : 'más memoria'
    usos.push(
      gb(ma) === gb(mb)
        ? [`Si querés ${label}`, `Los dos se consiguen hoy con hasta ${ma}: en eso empatan.`]
        : gb(ma) > gb(mb)
          ? [`Si querés ${label}`, `El ${x.a.modelo.nombre}: hoy hay publicaciones con hasta ${ma}, contra ${mb} del ${x.b.modelo.nombre}.`]
          : [`Si querés ${label}`, `El ${x.b.modelo.nombre}: hoy hay publicaciones con hasta ${mb}, contra ${ma} del ${x.a.modelo.nombre}.`],
    )
  }
  const [ca, cb] = [cercaDelMinimo(x.a), cercaDelMinimo(x.b)]
  if (Number.isFinite(ca) || Number.isFinite(cb)) {
    const mejor = ca <= cb ? x.a : x.b
    usos.push([
      'Si querés comprar en buen momento',
      mejor.minimo && mejor.desde <= mejor.minimo
        ? `El ${mejor.modelo.nombre}: hoy está en el precio más bajo que le registramos (${pesos(mejor.desde)}).`
        : `El ${mejor.modelo.nombre} es el que hoy está más cerca de su precio más bajo registrado (${pesos(mejor.desde)} contra ${pesos(mejor.minimo!)}).`,
    ])
  }
  const masPubs = x.a.equipos.length >= x.b.equipos.length ? x.a : x.b
  const menosPubs = masPubs === x.a ? x.b : x.a
  if (masPubs.equipos.length > menosPubs.equipos.length) {
    usos.push(['Si querés elegir entre más vendedores', `El ${masPubs.modelo.nombre}: encontramos ${masPubs.equipos.length} publicaciones hoy, contra ${menosPubs.equipos.length} del ${menosPubs.modelo.nombre}.`])
  }

  const faqs = [
    { q: `¿Qué conviene más, el ${x.a.modelo.nombre} o el ${x.b.modelo.nombre}?`, a: `${resumen(x, hoy)} Si la diferencia no te cambia nada, conviene el que más se acerque a su precio más bajo registrado; si estás justo, el ${dif.barato.modelo.nombre} te deja ${pesos(dif.pesos)} en el bolsillo.` },
    { q: `¿Cuánto sale el ${x.a.modelo.nombre} hoy en Argentina?`, a: `En Mercado Libre Argentina, desde ${pesos(x.a.desde)} hoy (${hoy})${x.a.minimo ? `; el más bajo que registramos fue ${pesos(x.a.minimo)}` : ''}.` },
    { q: `¿Cuánto sale el ${x.b.modelo.nombre} hoy en Argentina?`, a: `En Mercado Libre Argentina, desde ${pesos(x.b.desde)} hoy (${hoy})${x.b.minimo ? `; el más bajo que registramos fue ${pesos(x.b.minimo)}` : ''}.` },
    { q: '¿De dónde salen estos precios?', a: 'Son las publicaciones de Mercado Libre Argentina que están en oferta hoy o que seguimos día por día (vistas en la última semana). Guardamos el precio de cada una para mostrar el más bajo registrado. Los precios cambian todos los días: confirmalo en Mercado Libre antes de comprar.' },
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ofertas de hoy', item: DEALS_URL },
        { '@type': 'ListItem', position: 2, name: `Comparador de ${x.duelo.comparador}`, item: `${DEALS_URL}/comparador/${x.duelo.comparador}` },
        { '@type': 'ListItem', position: 3, name: `${x.a.modelo.nombre} vs ${x.b.modelo.nombre}`, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${x.a.modelo.nombre} vs ${x.b.modelo.nombre}`,
      itemListElement: [x.a, x.b].map((l, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Product',
          name: l.modelo.nombre,
          ...(l.equipos[0].img ? { image: l.equipos[0].img } : {}),
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'ARS',
            lowPrice: l.desde,
            highPrice: Math.max(...l.equipos.map(e => e.precio)),
            offerCount: l.equipos.length,
          },
        },
      })),
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
            <Link href={`/comparador/${x.duelo.comparador}`} className="hover:text-yellow-400">Comparador de {x.duelo.comparador}</Link> <span aria-hidden="true">/</span>{' '}
            <span className="text-zinc-300">{x.a.modelo.nombre} vs {x.b.modelo.nombre}</span>
          </nav>
          <h1 className="font-display text-3xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-4 [text-wrap:balance]">{titulo(x)}</h1>
          <p className="max-w-3xl text-zinc-400 leading-relaxed [text-wrap:pretty]">{x.duelo.contexto}</p>
          <p className="mt-3 text-sm text-zinc-500">
            <LastUpdated scrapedAt={getScrapedAt().toISOString()} />.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <section data-seccion="vs-respuesta" className="mb-8 rounded-2xl border border-yellow-400/30 bg-yellow-400/5 px-5 py-4">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-2">Respuesta rápida</h2>
          <p className="text-zinc-200 leading-relaxed [text-wrap:pretty]">{resumen(x, hoy)}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[x.a, x.b].map(l => (
              <a key={l.modelo.nombre} href={l.equipos[0].url} target="_blank" rel="noopener noreferrer sponsored" className="rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-black hover:bg-yellow-300">
                Ver {l.modelo.nombre} desde {pesos(l.desde)} ↗
              </a>
            ))}
          </div>
        </section>

        <section className="mb-8 max-w-3xl">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-3">¿Cuál te conviene según lo que buscás?</h2>
          <ul className="space-y-2">
            {usos.map(([cuando, cual]) => (
              <li key={cuando} className="text-zinc-300 leading-relaxed [text-wrap:pretty]">
                <strong className="text-zinc-100">{cuando}:</strong> {cual}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8 overflow-x-auto">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Lado a lado</h2>
          <table className="w-full min-w-[480px] text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-left">
                <th className="py-2 pr-3 font-normal text-zinc-500"></th>
                <th className="py-2 pr-3 font-black">{x.a.modelo.nombre}</th>
                <th className="py-2 font-black">{x.b.modelo.nombre}</th>
              </tr>
            </thead>
            <tbody>
              {filas.map(([nombre, f]) => (
                <tr key={nombre} className="border-b border-zinc-900">
                  <td className="py-2 pr-3 text-zinc-400">{nombre}</td>
                  <td className="py-2 pr-3 text-zinc-100">{f(x.a)}</td>
                  <td className="py-2 text-zinc-100">{f(x.b)}</td>
                </tr>
              ))}
              <tr data-seccion="vs-tabla">
                <td className="py-3 pr-3 text-zinc-400">Comprar</td>
                {[x.a, x.b].map(l => (
                  <td key={l.modelo.nombre} className="py-3 pr-3">
                    <a href={l.equipos[0].url} target="_blank" rel="noopener noreferrer sponsored" className="inline-block rounded-full bg-yellow-400 px-3 py-1.5 text-xs font-bold text-black hover:bg-yellow-300">
                      Ver en Mercado Libre ↗
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          {dif.igual && (
            <p className="mt-2 text-xs text-zinc-500">La diferencia de la respuesta rápida compara los dos con {dif.igual}, para que sea justa.</p>
          )}
        </section>

        <section data-seccion="vs-publicaciones" className="mb-10">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Las publicaciones de hoy</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Columna l={x.a} />
            <Columna l={x.b} />
          </div>
        </section>

        <section className="mb-10 max-w-3xl">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Seguí comparando</h2>
          <ul className="space-y-1.5">
            <li>
              <Link href={`/comparador/${x.duelo.comparador}`} className="font-bold text-yellow-400 hover:underline">🔎 Comparador de {x.duelo.comparador}: filtrá por precio, {notebook ? 'procesador y RAM' : 'memoria y 5G'} →</Link>
            </li>
            {relacionados.map(o => (
              <li key={o.duelo.slug}>
                <Link href={`/vs/${o.duelo.slug}`} className="font-bold text-yellow-400 hover:underline">⚔️ {o.a.modelo.nombre} vs {o.b.modelo.nombre} →</Link>
              </li>
            ))}
            <li>
              <Link href="/cyber-monday/tecnologia" className="font-bold text-cyan-300 hover:underline">🛒 Cyber Monday: ¿bajan de verdad los {x.duelo.comparador}? →</Link>
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
