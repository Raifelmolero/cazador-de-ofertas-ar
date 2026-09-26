import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import { getEstudio } from '@/lib/estudio'

const DEALS_URL = 'https://cazadordeofertas.com.ar'
const URL = `${DEALS_URL}/estudio/descuentos-inflados-mercado-libre`

const e = getEstudio()
const numero = (n: number) => n.toLocaleString('es-AR')
const fecha = (iso: string) => iso.split('-').reverse().join('/')
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const nombreMes = (ym: string) => `${MESES[Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}`
const unoCada = Math.max(1, Math.round(100 / (e.pctInfladas || 100)))

const TITULO = `1 de cada ${unoCada} ofertas de Mercado Libre Argentina tiene el descuento inflado`
const DATO = `De ${numero(e.revisadas)} ofertas de mercadolibre.com.ar/ofertas que revisamos entre el ${fecha(e.desde)} y el ${fecha(e.hasta)}, el ${e.pctInfladas.toLocaleString('es-AR')}% tenía el descuento inflado: el mismo producto ya se había vendido al menos 5% más barato en días anteriores.`

export const metadata: Metadata = {
  title: `${TITULO} — Estudio Cazador de Ofertas AR`,
  description: DATO,
  alternates: { canonical: URL },
  openGraph: { title: TITULO, description: DATO, url: URL, type: 'article', locale: 'es_AR', siteName: 'Cazador de Ofertas AR' },
}

const FAQS = [
  {
    q: '¿Qué es un descuento inflado?',
    a: 'Es una oferta cuyo porcentaje de descuento se calcula contra un "precio anterior" que no refleja lo que el producto costó de verdad. En este estudio la contamos como inflada cuando nosotros mismos ya habíamos registrado ese producto al menos 5% más barato en una pasada anterior.',
  },
  {
    q: '¿Cómo se hizo el estudio?',
    a: 'Un programa recorre las 20 páginas de mercadolibre.com.ar/ofertas tres veces por día y guarda el precio de cada producto. Cada oferta se compara contra el precio más bajo que registramos antes de ese producto. Los datos se actualizan solos con cada pasada.',
  },
  {
    q: '¿Cómo sé si una oferta puntual es real?',
    a: 'Mirá el historial de precio del producto: si en las últimas semanas ya estuvo igual o más barato sin promoción, el descuento no es real. En cazadordeofertas.com.ar solo mostramos ofertas que pasan ese control y marcamos las que están en su precio mínimo registrado.',
  },
]

export default function EstudioPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: 'Descuentos inflados en Mercado Libre Argentina',
      description: DATO,
      url: URL,
      creator: { '@type': 'Organization', name: 'Cazador de Ofertas AR', url: DEALS_URL },
      temporalCoverage: `${e.desde}/${e.hasta}`,
      spatialCoverage: 'Argentina',
      variableMeasured: ['ofertas revisadas', 'ofertas con descuento inflado'],
      isAccessibleForFree: true,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ]

  return (
    <main className="min-h-screen">
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}

      <header className="border-b border-zinc-900 bg-zinc-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <a href={DEALS_URL} className="font-display text-lg font-extrabold tracking-tight">
            🎯 <span className="text-yellow-400">Cazador de Ofertas</span>
          </a>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-wider text-yellow-400 mb-3">Estudio con datos propios</p>
        <h1 className="font-display text-3xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-6 [text-wrap:balance]">
          {TITULO}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <div className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 p-4">
            <p className="text-3xl font-black text-yellow-300">{e.pctInfladas.toLocaleString('es-AR')}%</p>
            <p className="text-xs text-zinc-400 mt-1">de las ofertas con descuento inflado</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-3xl font-black">{numero(e.revisadas)}</p>
            <p className="text-xs text-zinc-400 mt-1">ofertas revisadas</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-3xl font-black">{numero(e.pasadas)}</p>
            <p className="text-xs text-zinc-400 mt-1">pasadas desde el {fecha(e.desde)}</p>
          </div>
        </div>

        <p className="text-lg text-zinc-200 leading-relaxed mb-8">{DATO}</p>

        <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Mes a mes</h2>
        <div className="overflow-x-auto rounded-xl border border-zinc-800 mb-8">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900 text-zinc-400 text-left">
              <tr>
                <th className="px-3 py-2 font-semibold">Mes</th>
                <th className="px-3 py-2 font-semibold">Pasadas</th>
                <th className="px-3 py-2 font-semibold">Ofertas revisadas</th>
                <th className="px-3 py-2 font-semibold">Infladas</th>
              </tr>
            </thead>
            <tbody>
              {e.porMes.map(m => (
                <tr key={m.mes} className="border-t border-zinc-800">
                  <td className="px-3 py-2 text-zinc-300">{nombreMes(m.mes)}</td>
                  <td className="px-3 py-2">{numero(m.pasadas)}</td>
                  <td className="px-3 py-2">{numero(m.revisadas)}</td>
                  <td className="px-3 py-2 font-semibold">{m.pct.toLocaleString('es-AR')}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Metodología</h2>
        <div className="space-y-3 text-zinc-400 leading-relaxed mb-8">
          <p>
            Tres veces por día recorremos las 20 páginas de mercadolibre.com.ar/ofertas y guardamos el precio de cada
            producto. Cada oferta se compara contra el precio más bajo que habíamos registrado antes de ese mismo producto.
            Si ya lo habíamos visto al menos 5% más barato, la contamos como inflada: el &quot;antes&quot; que muestra la
            publicación no es un ahorro real.
          </p>
          <p>
            Límites: contamos apariciones de ofertas, así que un mismo producto que sigue en oferta varios días se cuenta
            en cada pasada. Un producto nuevo para nosotros no tiene historia y nunca se cuenta como inflado, por eso el
            número real probablemente es más alto. Los datos se recalculan solos con cada pasada.
          </p>
        </div>

        <h2 className="font-display text-xl sm:text-2xl font-black mb-4">Preguntas frecuentes</h2>
        <div className="space-y-3 mb-8">
          {FAQS.map(f => (
            <details key={f.q} className="group bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
              <summary className="cursor-pointer text-sm font-bold text-zinc-100 list-none flex items-center justify-between gap-3">
                {f.q}
                <span className="text-yellow-400 shrink-0 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>

        <p className="text-sm text-zinc-500 mb-6">
          Cómo citar: &quot;Cazador de Ofertas AR (cazadordeofertas.com.ar), estudio de descuentos inflados en Mercado
          Libre Argentina, datos al {fecha(e.hasta)}&quot;.
        </p>

        <div className="flex flex-wrap gap-3">
          <a href={DEALS_URL} className="inline-block text-sm font-bold bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl px-6 py-2.5">
            Ver las ofertas de hoy con descuento real
          </a>
          <a href="/guias/como-saber-si-un-descuento-de-mercado-libre-es-real" className="inline-block text-sm font-bold border border-zinc-700 hover:border-yellow-400 rounded-xl px-6 py-2.5">
            Cómo detectar un descuento inflado
          </a>
        </div>
      </article>

      <Footer brand="ofertas" />
    </main>
  )
}
