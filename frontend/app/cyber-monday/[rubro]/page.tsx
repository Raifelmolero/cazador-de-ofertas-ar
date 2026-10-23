// Cyber Monday por rubro (/cyber-monday/celulares, /notebooks, /smart-tv): el
// precio testigo de octubre de cada modelo contra el de hoy, agrupado por marca
// (iPhone, Galaxy S, Motorola Edge, notebooks gamer...). Es la cola larga de
// /cyber-monday/tecnologia: «iphone cyber monday 2026», «notebook gamer cyber monday».
//
// Nada inventado: modelos, precios y fechas salen del registro del bot
// (lib/cybertecno.ts). Con menos de MIN_CYBER_INDEXABLE productos, noindex.
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { tituloSeo, descripcionSeo } from '@/lib/seo'
import CuentaRegresivaEvento from '@/components/CuentaRegresivaEvento'
import EstadoTestigo from '@/components/EstadoTestigo'
import Footer from '@/components/Footer'
import LinksTecno from '@/components/LinksTecno'
import LastUpdated from '@/components/LastUpdated'
import OfertaCard, { type OfertaLight } from '@/components/OfertaCard'
import { getScrapedAt } from '@/lib/productos'
import { busquedaML } from '@/lib/afiliado'
import { CYBER_MONDAY as CM, etapaCyber } from '@/lib/cybermonday'
import {
  armarLandingCyber,
  getLandingCyber,
  landingCyberIndexable,
  LANDINGS_CYBER,
  type FilaTecno,
  type LandingCyberArmada,
} from '@/lib/cybertecno'
import { getTestigo, TESTIGO_MIN_DIAS } from '@/lib/testigo'
import { GUIAS } from '@/lib/guias'
import { getComparativa } from '@/lib/comparativas'

const DEALS_URL = 'https://cazadordeofertas.com.ar'
const TELEGRAM_URL = 'https://t.me/cazadordeofertasar'
const MAX_POR_MARCA = 10
const MAX_CARDS = 8

export const generateStaticParams = () => LANDINGS_CYBER.map(l => ({ rubro: l.slug }))
export const dynamicParams = false

/** "2026-09-27" → "27/09" */
const diaMes = (iso: string) => iso.slice(8, 10) + '/' + iso.slice(5, 7)
const fechaAR = (iso: string) => iso.split('-').reverse().join('/')
const pesos = (n: number) => `$${n.toLocaleString('es-AR')}`
const mayus = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** "iPhone" → "un iPhone"; notebooks y smart TV llevan el rubro adelante ("una notebook Lenovo"). */
function unoDe(slug: string, marca: string): string {
  const m = marca.replace(/ y otros$/, '')
  if (slug === 'notebooks') return m === 'MacBook' ? 'una MacBook' : `una notebook ${m}`
  if (slug === 'smart-tv') return `un smart TV ${m}`
  return `un ${m}`
}
function todosDe(slug: string, marca: string): string {
  const m = marca.replace(/ y otros$/, '')
  if (slug === 'notebooks') return m === 'MacBook' ? 'todas las MacBook' : `todas las notebooks ${m}`
  if (slug === 'smart-tv') return `todos los smart TV ${m}`
  return `todos los ${m}`
}

const titulo = (x: LandingCyberArmada) => `${mayus(x.l.nombre)} en el Cyber Monday ${CM.año}: precio de octubre vs. hoy`

function armar(slug: string) {
  const l = getLandingCyber(slug)
  return l ? armarLandingCyber(l) : undefined
}

export async function generateMetadata({ params }: { params: Promise<{ rubro: string }> }): Promise<Metadata> {
  const x = armar((await params).rubro)
  if (!x) return {}
  const url = `${DEALS_URL}/cyber-monday/${x.l.slug}`
  const t = titulo(x)
  const marcas = x.porMarca.filter(g => g.marca.nombre !== 'Otras marcas').slice(0, 3).map(g => g.marca.nombre).join(', ')
  const desc = `El precio más bajo que registramos en octubre de ${x.filas.length} ${x.l.nombre} de Mercado Libre${marcas ? ` (${marcas})` : ''}, para saber si el descuento del Cyber Monday ${CM.año} (${CM.fechasTexto}) es real.`
  return {
    title: tituloSeo(t, [s => `${s} — Cazador de Ofertas AR`, s => s, () => `${mayus(x.l.nombre)} Cyber Monday ${CM.año}: ¿bajan de verdad?`]),
    description: descripcionSeo(desc),
    keywords: x.l.keywords,
    metadataBase: new globalThis.URL(DEALS_URL),
    alternates: { canonical: url },
    openGraph: { title: t, description: desc, url, type: 'website', locale: 'es_AR', siteName: 'Cazador de Ofertas AR' },
    ...(landingCyberIndexable(x) ? {} : { robots: { index: false, follow: true } }),
  }
}

function aLight(f: FilaTecno): OfertaLight | null {
  const o = f.hoy
  if (!o) return null
  return {
    id_ml: o.id_ml,
    titulo: o.titulo,
    precio_actual: o.precio_actual,
    precio_anterior: o.precio_anterior,
    descuento_pct: o.descuento_pct,
    minimo_historico: o.minimo_historico,
    relampago: o.relampago,
    url_producto: o.url_producto,
    url_imagen: o.url_imagen,
    precio_visto: o.precio_visto,
    historial: f.historial,
  }
}

function Fila({ f, etapa, desde }: { f: FilaTecno; etapa: 'antes' | 'durante' | 'despues'; desde: string }) {
  const href = f.hoy?.url_producto ?? (f.historial ? `/precio/${f.historial}` : undefined)
  return (
    <li className="px-4 py-3 text-sm">
      {href ? (
        <a href={href} {...(f.hoy ? { target: '_blank', rel: 'noopener noreferrer sponsored' } : {})} className="font-semibold text-zinc-100 hover:text-yellow-400 [text-wrap:pretty]">
          {f.titulo}
        </a>
      ) : (
        <span className="font-semibold text-zinc-100 [text-wrap:pretty]">{f.titulo}</span>
      )}
      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-zinc-400">
        <span>
          Más bajo desde el {diaMes(desde)}: <strong className="text-cyan-300">{pesos(f.testigo.min)}</strong> ({diaMes(f.testigo.min_ts)})
        </span>
        <EstadoTestigo f={f} etapa={etapa} />
        {f.historial && (
          <a href={`/precio/${f.historial}`} className="text-yellow-400 hover:underline">historial →</a>
        )}
      </div>
    </li>
  )
}

export default async function CyberRubroPage({ params }: { params: Promise<{ rubro: string }> }) {
  const x = armar((await params).rubro)
  if (!x) notFound()
  const { l, filas, porMarca, destacadas } = x
  const url = `${DEALS_URL}/cyber-monday/${l.slug}`
  const { etapa } = etapaCyber()
  const testigo = getTestigo()
  const enOferta = filas.filter(f => f.hoy)
  const enMinimo = enOferta.filter(f => f.hoy!.precio_actual <= f.testigo.min * 1.02).length
  const cards = enOferta.map(aLight).filter((o): o is OfertaLight => o !== null).slice(0, MAX_CARDS)
  const guias = GUIAS.filter(g => l.guias.includes(g.slug))
  const comparativa = getComparativa(l.comparativa)
  const otras = LANDINGS_CYBER.filter(o => o.slug !== l.slug)
  const nombreMayus = mayus(l.nombre)

  const marcasFaq = porMarca.filter(g => g.marca.nombre !== 'Otras marcas').slice(0, 3)
  const faqs = [
    {
      q: `¿Conviene esperar al Cyber Monday ${CM.año} para comprar ${l.slug === 'notebooks' ? 'una notebook' : l.slug === 'smart-tv' ? 'un smart TV' : 'un celular'}?`,
      a: `Depende del modelo. De los ${filas.length} ${l.nombre} que seguimos desde el ${fechaAR(testigo.desde)}, hoy ${enOferta.length} están en oferta y ${enMinimo} ya están en el precio más bajo que registramos. Si el que querés ya está en su mínimo, esperar no garantiza que baje más; si está por arriba, anotá el precio de hoy y compará el ${diaMes(CM.inicio)}.`,
    },
    ...marcasFaq.map(g => {
      const mins = g.filas.map(f => f.testigo.min)
      const barato = g.filas.reduce((a, b) => (b.testigo.min < a.testigo.min ? b : a))
      return {
        q: `¿Cuánto salía ${unoDe(l.slug, g.marca.nombre)} antes del Cyber Monday ${CM.año}?`,
        a:
          g.filas.length === 1
            ? `Seguimos un modelo: ${barato.titulo}. Su precio más bajo desde el ${fechaAR(testigo.desde)} fue ${pesos(barato.testigo.min)} en Mercado Libre Argentina.`
            : `De los ${g.filas.length} modelos que seguimos, el más barato que registramos desde el ${fechaAR(testigo.desde)} fue ${barato.titulo}, a ${pesos(barato.testigo.min)}; el más caro, ${pesos(Math.max(...mins))}. El precio de cada uno está en esta página.`,
      }
    }),
    {
      q: `¿Cómo sé si un descuento en ${l.nombre} del Cyber Monday es real?`,
      a: `Comparalo contra el precio de antes del evento, no contra el precio tachado. Guardamos el precio más bajo de cada modelo entre el ${fechaAR(testigo.desde)} y el ${fechaAR(testigo.hasta)} (con al menos ${TESTIGO_MIN_DIAS} días de registro): si en el Cyber está al menos 3 % más barato, es una baja real. Si está igual o más caro, el «% OFF» es de cartel.`,
    },
    {
      q: `¿Cuándo es el Cyber Monday ${CM.año} en Argentina?`,
      a: `${mayus(CM.fechasTexto)} de ${CM.año}${CM.oficial ? ', según la Cámara Argentina de Comercio Electrónico (CACE)' : ' (a confirmar por la CACE)'}.`,
    },
  ]

  const jsonLd: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ofertas de hoy', item: DEALS_URL },
        { '@type': 'ListItem', position: 2, name: `Cyber Monday ${CM.año}`, item: `${DEALS_URL}/cyber-monday` },
        { '@type': 'ListItem', position: 3, name: 'Tecnología', item: `${DEALS_URL}/cyber-monday/tecnologia` },
        { '@type': 'ListItem', position: 4, name: nombreMayus, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
    ...(cards.length > 0
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: `${nombreMayus} en oferta hoy, con precio testigo para el Cyber Monday ${CM.año}`,
            itemListElement: cards.map((o, i) => ({ '@type': 'ListItem', position: i + 1, name: o.titulo, url: o.url_producto })),
          },
        ]
      : []),
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

      <section className="border-b border-zinc-900 px-4 py-8 sm:py-12" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% -20%, rgba(34,211,238,0.08) 0%, transparent 70%)' }}>
        <div className="max-w-3xl mx-auto">
          <nav aria-label="Ruta" className="text-xs text-zinc-500 mb-3">
            <a href={DEALS_URL} className="hover:text-yellow-400">Ofertas de hoy</a> <span aria-hidden="true">/</span>{' '}
            <Link href="/cyber-monday" className="hover:text-yellow-400">Cyber Monday {CM.año}</Link> <span aria-hidden="true">/</span>{' '}
            <Link href="/cyber-monday/tecnologia" className="hover:text-yellow-400">Tecnología</Link> <span aria-hidden="true">/</span>{' '}
            <span className="text-zinc-300">{nombreMayus}</span>
          </nav>
          <h1 className="font-display text-3xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-4 [text-wrap:balance]">{titulo(x)}</h1>
          <p className="text-zinc-400 leading-relaxed [text-wrap:pretty]">
            Desde el {fechaAR(testigo.desde)} anotamos el precio de cada {l.slug === 'notebooks' ? 'notebook' : l.slug === 'smart-tv' ? 'smart TV' : 'celular'} en oferta en Mercado Libre.
            Acá está el más bajo que registramos de <strong className="text-zinc-100">{filas.length} {l.nombre}</strong>, por marca:
            {etapa === 'antes'
              ? ` cuando arranque el Cyber (${CM.fechasTexto}) vas a ver al lado de cada uno si el precio bajó de verdad.`
              : ' al lado de cada uno, si el precio del Cyber bajó de verdad.'}
          </p>
          {etapa === 'antes' && <CuentaRegresivaEvento fecha={CM.inicio} nombre="Cyber Monday" />}
          <p className="mt-4 text-sm text-zinc-500">
            Hoy {enOferta.length} están en oferta y {enMinimo} ya están en su precio más bajo. <LastUpdated scrapedAt={getScrapedAt().toISOString()} />.
          </p>
          {porMarca.length > 1 && (
            <p className="mt-3 flex flex-wrap gap-2 text-sm">
              {destacadas.length > 0 && l.destacado && (
                <a href={`#${l.destacado.id}`} className="rounded-full border border-cyan-400/30 bg-cyan-500/[0.07] px-3 py-1 font-bold text-cyan-200 hover:border-cyan-300/60">
                  {l.destacado.nombre} ({destacadas.length})
                </a>
              )}
              {porMarca.map(g => (
                <a key={g.marca.nombre} href={`#marca-${g.marca.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="rounded-full border border-zinc-700 px-3 py-1 font-bold text-zinc-200 hover:border-yellow-400/60">
                  {g.marca.nombre} ({g.filas.length})
                </a>
              ))}
            </p>
          )}
        </div>
      </section>

      {cards.length > 0 && (
        <section data-seccion="cyber_rubro_ofertas" className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4">
          <div className="max-w-3xl mx-auto sm:mx-0 mb-4">
            <h2 className="font-display text-xl sm:text-2xl font-black">{nombreMayus} en oferta hoy</h2>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              {etapa === 'antes'
                ? 'Todavía no son precios del evento: son las ofertas de hoy de los modelos que seguimos, de mayor a menor precio. Sirven para comparar cuando arranque.'
                : 'Las ofertas de hoy de los modelos que seguimos, de mayor a menor precio, comparadas contra su precio de octubre.'}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {cards.map((o, i) => (
              <OfertaCard key={o.id_ml} producto={o} priority={i < 4} />
            ))}
          </div>
        </section>
      )}

      <article className="max-w-3xl mx-auto px-4 py-8 sm:py-10">
        {l.destacado && destacadas.length > 0 && (
          <section id={l.destacado.id} className="mb-10 scroll-mt-20">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-2">
              {l.destacado.nombre} <span className="text-zinc-500 text-base font-bold">({destacadas.length})</span>
            </h2>
            <p className="text-sm text-zinc-400 mb-3 [text-wrap:pretty]">{l.destacado.texto}</p>
            <ul className="divide-y divide-zinc-800 rounded-2xl border border-zinc-800 bg-zinc-900/60">
              {destacadas.slice(0, MAX_POR_MARCA).map(f => (
                <Fila key={f.id} f={f} etapa={etapa} desde={testigo.desde} />
              ))}
            </ul>
            {destacadas.length > MAX_POR_MARCA && <p className="mt-2 text-xs text-zinc-500">Y {destacadas.length - MAX_POR_MARCA} más con precio registrado.</p>}
            <p className="mt-3 text-sm">
              <a href={busquedaML('notebook gamer')} target="_blank" rel="noopener noreferrer sponsored" className="font-bold text-yellow-400 hover:underline">
                Ver todas las notebooks gamer en Mercado Libre →
              </a>
            </p>
          </section>
        )}

        {porMarca.map(({ marca, filas: fm }) => (
          <section key={marca.nombre} id={`marca-${marca.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="mb-10 scroll-mt-20">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3">
              {marca.nombre} <span className="text-zinc-500 text-base font-bold">({fm.length})</span>
            </h2>
            <ul className="divide-y divide-zinc-800 rounded-2xl border border-zinc-800 bg-zinc-900/60">
              {fm.slice(0, MAX_POR_MARCA).map(f => (
                <Fila key={f.id} f={f} etapa={etapa} desde={testigo.desde} />
              ))}
            </ul>
            {fm.length > MAX_POR_MARCA && <p className="mt-2 text-xs text-zinc-500">Y {fm.length - MAX_POR_MARCA} más con precio registrado.</p>}
            <p className="mt-3 text-sm">
              <a href={busquedaML(marca.busqueda)} target="_blank" rel="noopener noreferrer sponsored" className="font-bold text-yellow-400 hover:underline">
                {marca.nombre === 'Otras marcas' ? `Ver más ${l.nombre} en Mercado Libre →` : `Ver ${todosDe(l.slug, marca.nombre)} en Mercado Libre →`}
              </a>
            </p>
          </section>
        ))}

        <section className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-2">Cómo leemos estos precios</h2>
          <p className="text-zinc-400 leading-relaxed [text-wrap:pretty]">
            El «más bajo» es el menor precio que vimos de ese modelo entre el {fechaAR(testigo.desde)} y hoy, solo con
            productos que registramos al menos {TESTIGO_MIN_DIAS} días. Durante el Cyber, si el precio está al menos 3 % por
            debajo, lo marcamos como una baja real; si no, estuvo igual o más barato antes. Los precios son de contado y
            pueden cambiar en cualquier momento: confirmalos en Mercado Libre antes de comprar.{' '}
            <Link href="/metodologia" className="text-yellow-400 hover:underline">Metodología completa</Link>.
          </p>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <Link href="/cyber-monday" className="font-bold text-yellow-400 hover:underline">Todo sobre el Cyber Monday {CM.año} →</Link>
            <Link href="/cyber-monday/tecnologia" className="font-bold text-yellow-400 hover:underline">Toda la tecnología del Cyber →</Link>
            {comparativa && (
              <Link href={`/mejores/${comparativa.slug}`} className="font-bold text-yellow-400 hover:underline">📊 {comparativa.titulo} →</Link>
            )}
            <Link href={`/comparador/${l.comparador}`} className="font-bold text-yellow-400 hover:underline">Comparador de {l.nombre} →</Link>
            {otras.map(o => (
              <Link key={o.slug} href={`/cyber-monday/${o.slug}`} className="font-bold text-yellow-400 hover:underline">{mayus(o.nombre)} en el Cyber →</Link>
            ))}
          </p>
        </section>

        {guias.length > 0 && (
          <section className="mb-10">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Guías para elegir antes del Cyber</h2>
            <ul className="space-y-1.5">
              {guias.map(g => (
                <li key={g.slug}>
                  <a href={`/guias/${g.slug}`} className="font-bold text-yellow-400 hover:underline">📘 {g.titulo} →</a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
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
      </article>
      <LinksTecno className="mx-auto max-w-4xl px-4 mt-10" />
      <Footer brand="ofertas" />
    </main>
  )
}
