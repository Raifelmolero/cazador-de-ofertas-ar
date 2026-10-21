// Cyber Monday de tecnología: el precio testigo de octubre de cada celular,
// iPhone, notebook, smart TV y monitor que seguimos (lib/cybertecno.ts), para
// saber el 2-4/11 si el descuento del evento es real. Antes del evento muestra
// el mínimo registrado y el precio de hoy; durante y después, el veredicto.
//
// Nada inventado: precios, fechas y conteos salen del registro del bot.
import Link from 'next/link'
import type { Metadata } from 'next'
import { tituloSeo, descripcionSeo } from '@/lib/seo'
import CuentaRegresivaEvento from '@/components/CuentaRegresivaEvento'
import Footer from '@/components/Footer'
import LastUpdated from '@/components/LastUpdated'
import { getScrapedAt } from '@/lib/productos'
import { CYBER_MONDAY as CM, etapaCyber } from '@/lib/cybermonday'
import { filasPorRubro, type FilaTecno } from '@/lib/cybertecno'
import { getTestigo, TESTIGO_MIN_DIAS } from '@/lib/testigo'
import { GUIAS } from '@/lib/guias'
import { getPrecioHoy, art } from '@/lib/preciohoy'

const DEALS_URL = 'https://cazadordeofertas.com.ar'
const URL = `${DEALS_URL}/cyber-monday/tecnologia`
const TELEGRAM_URL = 'https://t.me/cazadordeofertasar'
const MAX_FILAS = 12

const TITULO = `Cyber Monday ${CM.año}: celulares, iPhone y notebooks, ¿bajan de verdad?`
const DESCRIPCION = `El precio más bajo que registramos en octubre de cada iPhone, Samsung Galaxy, celular, notebook, smart TV y monitor de Mercado Libre, para comparar en el Cyber Monday ${CM.año} (${CM.fechasTexto}).`

export const metadata: Metadata = {
  title: tituloSeo(TITULO, [t => `${t} — Cazador de Ofertas AR`, t => t, () => `Cyber Monday ${CM.año}: celulares y notebooks, ¿bajan de verdad?`]),
  description: descripcionSeo(DESCRIPCION),
  keywords: [
    `cyber monday ${CM.año} celulares`,
    `cyber monday ${CM.año} iphone`,
    `cyber monday ${CM.año} notebooks`,
    'cyber monday tecnologia mercado libre',
    'precio iphone cyber monday',
  ],
  metadataBase: new globalThis.URL(DEALS_URL),
  alternates: { canonical: URL },
  openGraph: { title: TITULO, description: DESCRIPCION, url: URL, type: 'website', locale: 'es_AR', siteName: 'Cazador de Ofertas AR' },
}

/** "2026-09-27" → "27/09" */
const diaMes = (iso: string) => iso.slice(8, 10) + '/' + iso.slice(5, 7)
const fechaAR = (iso: string) => iso.split('-').reverse().join('/')
const pesos = (n: number) => `$${n.toLocaleString('es-AR')}`

function Estado({ f, etapa }: { f: FilaTecno; etapa: 'antes' | 'durante' | 'despues' }) {
  if (!f.hoy) return <span className="text-zinc-500">Hoy no está en oferta · visto el {diaMes(f.testigo.ult)}</span>
  const hoy = f.hoy.precio_actual
  if (etapa === 'antes') {
    const pct = Math.round((hoy / f.testigo.min - 1) * 100)
    return (
      <span>
        Hoy <strong className="text-zinc-100">{pesos(hoy)}</strong>{' '}
        {pct <= 2 ? (
          <span className="text-emerald-300">· en su precio más bajo</span>
        ) : (
          <span className="text-amber-300">· {pct} % arriba de su mínimo</span>
        )}
      </span>
    )
  }
  const txt = f.veredicto === 'bajo' ? '✅ Bajó de verdad' : f.veredicto === 'igual' ? '➖ Igual que en octubre' : '⚠️ Estaba más barato antes'
  const color = f.veredicto === 'bajo' ? 'text-emerald-300' : f.veredicto === 'igual' ? 'text-zinc-300' : 'text-amber-300'
  return (
    <span>
      Hoy <strong className="text-zinc-100">{pesos(hoy)}</strong> <span className={color}>· {txt}</span>
    </span>
  )
}

export default function CyberTecnologiaPage() {
  const { etapa } = etapaCyber()
  const testigo = getTestigo()
  const grupos = filasPorRubro()
  const total = grupos.reduce((n, g) => n + g.filas.length, 0)
  const enOferta = grupos.flatMap(g => g.filas).filter(f => f.hoy)
  const enMinimo = enOferta.filter(f => f.hoy!.precio_actual <= f.testigo.min * 1.02).length
  const iphones = grupos.find(g => g.rubro.slug === 'iphone')?.filas ?? []
  const iphoneMin = iphones.length ? Math.min(...iphones.map(f => f.testigo.min)) : 0
  const guias = GUIAS.filter(g => grupos.some(x => x.rubro.guia === g.slug))

  const faqs = [
    {
      q: `¿Conviene esperar al Cyber Monday ${CM.año} para comprar un celular o una notebook?`,
      a: `Depende del producto. De los ${total} productos de tecnología que seguimos desde el ${fechaAR(testigo.desde)}, hoy ${enOferta.length} están en oferta y ${enMinimo} ya están en el precio más bajo que registramos. Si el que querés ya está en su mínimo, esperar no garantiza que baje más; si está por arriba, anotá el precio y compará el ${diaMes(CM.inicio)}.`,
    },
    {
      q: '¿Cómo sé si un descuento del Cyber Monday es real?',
      a: `Comparalo contra el precio de antes del evento, no contra el precio tachado. Nosotros guardamos el precio más bajo de cada producto entre el ${fechaAR(testigo.desde)} y el ${fechaAR(testigo.hasta)} (con al menos ${TESTIGO_MIN_DIAS} días de registro): si el ${diaMes(CM.inicio)} está al menos 3 % más barato, es una baja real.`,
    },
    ...(iphones.length > 0
      ? [
          {
            q: `¿Cuánto salía un iPhone antes del Cyber Monday ${CM.año}?`,
            a: `El iPhone más barato que registramos en octubre de ${CM.año} costó ${pesos(iphoneMin)} en Mercado Libre Argentina. Seguimos ${iphones.length} modelos de iPhone; el precio de cada uno está en esta página.`,
          },
        ]
      : []),
    {
      q: `¿Cuándo es el Cyber Monday ${CM.año} en Argentina?`,
      a: `${CM.fechasTexto.charAt(0).toUpperCase() + CM.fechasTexto.slice(1)} de ${CM.año}${CM.oficial ? ', según la CACE' : ' (a confirmar)'}.`,
    },
  ]

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ofertas de hoy', item: DEALS_URL },
        { '@type': 'ListItem', position: 2, name: `Cyber Monday ${CM.año}`, item: `${DEALS_URL}/cyber-monday` },
        { '@type': 'ListItem', position: 3, name: 'Tecnología', item: URL },
      ],
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

      <section className="border-b border-zinc-900 px-4 py-8 sm:py-12" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% -20%, rgba(34,211,238,0.08) 0%, transparent 70%)' }}>
        <div className="max-w-3xl mx-auto">
          <nav aria-label="Ruta" className="text-xs text-zinc-500 mb-3">
            <a href={DEALS_URL} className="hover:text-yellow-400">Ofertas de hoy</a> <span aria-hidden="true">/</span>{' '}
            <Link href="/cyber-monday" className="hover:text-yellow-400">Cyber Monday {CM.año}</Link> <span aria-hidden="true">/</span>{' '}
            <span className="text-zinc-300">Tecnología</span>
          </nav>
          <h1 className="font-display text-3xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-4 [text-wrap:balance]">{TITULO}</h1>
          <p className="text-zinc-400 leading-relaxed [text-wrap:pretty]">
            Desde el {fechaAR(testigo.desde)} anotamos el precio de cada producto de tecnología en oferta en Mercado Libre.
            Acá está el más bajo que registramos de <strong className="text-zinc-100">{total} celulares, notebooks, smart TV y monitores</strong>:
            {etapa === 'antes'
              ? ` cuando arranque el Cyber (${CM.fechasTexto}) vas a ver al lado de cada uno si bajó de verdad.`
              : ' al lado de cada uno, si el precio del Cyber bajó de verdad.'}
          </p>
          {etapa === 'antes' && <CuentaRegresivaEvento fecha={CM.inicio} nombre="Cyber Monday" />}
          <p className="mt-4 text-sm text-zinc-500">
            Hoy {enOferta.length} están en oferta y {enMinimo} ya están en su precio más bajo. <LastUpdated scrapedAt={getScrapedAt().toISOString()} />.
          </p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 py-8 sm:py-10">
        {grupos.map(({ rubro, filas }) => {
          const ph = rubro.precioHoy ? getPrecioHoy(rubro.precioHoy) : undefined
          return (
            <section key={rubro.slug} id={rubro.slug} className="mb-10 scroll-mt-20">
              <h2 className="font-display text-xl sm:text-2xl font-black mb-3">
                {rubro.nombre} <span className="text-zinc-500 text-base font-bold">({filas.length})</span>
              </h2>
              <ul className="divide-y divide-zinc-800 rounded-2xl border border-zinc-800 bg-zinc-900/60">
                {filas.slice(0, MAX_FILAS).map(f => {
                  const href = f.hoy?.url_producto ?? (f.historial ? `/precio/${f.historial}` : undefined)
                  return (
                    <li key={f.id} className="px-4 py-3 text-sm">
                      {href ? (
                        <a href={href} {...(f.hoy ? { target: '_blank', rel: 'noopener noreferrer sponsored' } : {})} className="font-semibold text-zinc-100 hover:text-yellow-400 [text-wrap:pretty]">
                          {f.titulo}
                        </a>
                      ) : (
                        <span className="font-semibold text-zinc-100 [text-wrap:pretty]">{f.titulo}</span>
                      )}
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-zinc-400">
                        <span>
                          Más bajo desde el {diaMes(testigo.desde)}: <strong className="text-cyan-300">{pesos(f.testigo.min)}</strong> ({diaMes(f.testigo.min_ts)})
                        </span>
                        <Estado f={f} etapa={etapa} />
                        {f.historial && (
                          <a href={`/precio/${f.historial}`} className="text-yellow-400 hover:underline">historial →</a>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
              {filas.length > MAX_FILAS && (
                <p className="mt-2 text-xs text-zinc-500">Y {filas.length - MAX_FILAS} más con precio registrado.</p>
              )}
              <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {ph && (
                  <a href={`/precio-hoy/${ph.slug}`} className="font-bold text-yellow-400 hover:underline">💲 Cuánto sale {art(ph, false)} {ph.nombre} hoy →</a>
                )}
                {rubro.guia && GUIAS.some(g => g.slug === rubro.guia) && (
                  <a href={`/guias/${rubro.guia}`} className="font-bold text-yellow-400 hover:underline">📘 Guía para elegir →</a>
                )}
              </p>
            </section>
          )
        })}

        <section className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-2">Cómo leemos estos precios</h2>
          <p className="text-zinc-400 leading-relaxed [text-wrap:pretty]">
            El «más bajo» es el menor precio que vimos de ese producto entre el {fechaAR(testigo.desde)} y hoy, solo con
            productos que registramos al menos {TESTIGO_MIN_DIAS} días. Durante el Cyber, si el precio está al menos 3 % por
            debajo, lo marcamos como una baja real; si no, estuvo igual o más barato antes. Los precios son de contado y
            pueden cambiar en cualquier momento: confirmalos en Mercado Libre antes de comprar.{' '}
            <Link href="/metodologia" className="text-yellow-400 hover:underline">Metodología completa</Link>.
          </p>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <Link href="/cyber-monday" className="font-bold text-yellow-400 hover:underline">Todo sobre el Cyber Monday {CM.año} →</Link>
            <Link href="/tecno" className="font-bold text-yellow-400 hover:underline">Ofertas de tecnología de hoy →</Link>
            <Link href="/comparador/celulares" className="font-bold text-yellow-400 hover:underline">Comparador de celulares →</Link>
            <Link href="/comparador/notebooks" className="font-bold text-yellow-400 hover:underline">Comparador de notebooks →</Link>
            <Link href="/descuentos-inflados" className="font-bold text-yellow-400 hover:underline">Descuentos inflados de hoy →</Link>
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
      <Footer />
    </main>
  )
}
