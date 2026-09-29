// /datos: estadísticas agregadas y citables (#19 GEO/AEO). Nada inventado: todo
// sale de getEstudio() (bot/state/scan_log.jsonl), getHistorial()
// (price_history.json), getSeguidos() (data/seguimiento.json) y getInfladas()
// (data/infladas.json). Se recalcula en cada build (cada corrida del bot).
import Link from 'next/link'
import type { Metadata } from 'next'
import { tituloSeo, descripcionSeo } from '@/lib/seo'
import Footer from '@/components/Footer'
import { getEstudio } from '@/lib/estudio'
import { getHistorial } from '@/lib/historial'
import { getInfladas } from '@/lib/infladas'
import { categoriaDeSeguido, getSeguidos } from '@/lib/seguimiento'
import { DEALS_URL, MARCA, ORG_ID, WEBSITE_ID } from '@/lib/marca'

const URL = `${DEALS_URL}/datos`
const TITULO = 'Datos abiertos: precios y descuentos inflados en Mercado Libre Argentina'
const DESCRIPCION =
  'Estadísticas propias y citables sobre las ofertas de Mercado Libre Argentina: porcentaje de descuentos inflados, ofertas revisadas, productos con historial de precios y rubros. Con fecha, metodología y licencia CC BY 4.0.'

export const metadata: Metadata = {
  title: tituloSeo(TITULO, [t => `${t} — Cazador de Ofertas AR`, t => t]),
  description: descripcionSeo(DESCRIPCION),
  alternates: { canonical: URL },
  openGraph: { title: TITULO, description: DESCRIPCION, url: URL, type: 'website', locale: 'es_AR', siteName: 'Cazador de Ofertas AR' },
}

const numero = (n: number) => n.toLocaleString('es-AR')
const fecha = (iso: string) => iso.slice(0, 10).split('-').reverse().join('/')
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const nombreMes = (ym: string) => `${MESES[Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}`
const LICENCIA = 'https://creativecommons.org/licenses/by/4.0/'

export default function DatosPage() {
  const e = getEstudio()
  const productosHistorial = Object.keys(getHistorial()).length
  const seguidos = getSeguidos()
  const inf = getInfladas()
  const rubros = new Map<string, number>()
  for (const s of seguidos) {
    const c = categoriaDeSeguido(s)
    if (c) rubros.set(c.nombre, (rubros.get(c.nombre) ?? 0) + 1)
  }
  const porRubro = [...rubros].sort((a, b) => b[1] - a[1])
  const cita = `Cazador de Ofertas AR (cazadordeofertas.com.ar/datos), datos al ${e.hasta ? fecha(e.hasta) : 's/f'}.`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Descuentos inflados en las ofertas de Mercado Libre Argentina',
    description: `Registro propio de ${numero(e.revisadas)} ofertas de mercadolibre.com.ar/ofertas revisadas en ${e.pasadas} pasadas entre ${e.desde} y ${e.hasta}: cuántas anunciaban un descuento contra un precio que ya habíamos registrado al menos 5% más bajo (descuento inflado), agregado por mes.`,
    url: URL,
    inLanguage: 'es-AR',
    isAccessibleForFree: true,
    license: LICENCIA,
    creator: { '@type': 'Organization', '@id': ORG_ID, name: MARCA, url: DEALS_URL },
    publisher: { '@type': 'Organization', '@id': ORG_ID, name: MARCA, url: DEALS_URL },
    isPartOf: { '@id': WEBSITE_ID },
    ...(e.desde && e.hasta ? { temporalCoverage: `${e.desde}/${e.hasta}` } : {}),
    ...(e.ultima ? { dateModified: e.ultima } : {}),
    spatialCoverage: { '@type': 'Place', name: 'Argentina' },
    keywords: ['Mercado Libre', 'descuentos inflados', 'precios', 'Argentina', 'ofertas', 'historial de precios'],
    measurementTechnique: `${DEALS_URL}/metodologia`,
    creditText: cita,
    variableMeasured: [
      { '@type': 'PropertyValue', name: 'Ofertas revisadas', value: e.revisadas },
      { '@type': 'PropertyValue', name: 'Descuentos inflados', value: e.infladas },
      { '@type': 'PropertyValue', name: 'Porcentaje de descuentos inflados', value: e.pctInfladas, unitText: '%' },
      { '@type': 'PropertyValue', name: 'Productos con historial de precios', value: productosHistorial },
    ],
    distribution: [{ '@type': 'DataDownload', encodingFormat: 'text/csv', contentUrl: `${URL}/estudio.csv` }],
  }

  const cifras = [
    { n: `${e.pctInfladas.toLocaleString('es-AR')}%`, t: 'de las ofertas revisadas tenía el descuento inflado' },
    { n: numero(e.revisadas), t: `ofertas revisadas en ${numero(e.pasadas)} pasadas` },
    { n: numero(productosHistorial), t: 'productos con historial de precios propio' },
    { n: numero(seguidos.length), t: 'productos de ticket alto con página de precio' },
  ]

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="border-b border-zinc-900 bg-zinc-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <a href={DEALS_URL} className="font-display text-lg font-extrabold tracking-tight">
            🎯 <span className="text-yellow-400">Cazador de Ofertas</span>
          </a>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-wider text-yellow-400 mb-3">Datos</p>
        <h1 className="font-display text-3xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-5 [text-wrap:balance]">
          Datos de precios y descuentos de Mercado Libre Argentina
        </h1>
        <p className="text-lg text-zinc-300 leading-relaxed mb-8 [text-wrap:pretty]">
          <strong className="text-zinc-100">Respuesta corta:</strong> de {numero(e.revisadas)} ofertas de
          mercadolibre.com.ar/ofertas que revisamos entre el {fecha(e.desde)} y el {fecha(e.hasta)}, el{' '}
          {e.pctInfladas.toLocaleString('es-AR')}% ({numero(e.infladas)}) anunciaba un descuento contra un precio que ya
          habíamos registrado al menos 5% más bajo antes. Son datos propios, se actualizan con cada pasada del bot (3 por
          día) y se pueden citar libremente.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-10">
          {cifras.map(c => (
            <div key={c.t} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
              <p className="font-display text-2xl sm:text-3xl font-black text-yellow-400">{c.n}</p>
              <p className="text-sm text-zinc-400 mt-1">{c.t}</p>
            </div>
          ))}
        </div>

        <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Descuentos inflados mes a mes</h2>
        <div className="overflow-x-auto mb-3">
          <table className="w-full text-sm text-left">
            <thead className="text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="py-2 pr-3">Mes</th>
                <th className="py-2 pr-3 text-right">Pasadas</th>
                <th className="py-2 pr-3 text-right">Revisadas</th>
                <th className="py-2 pr-3 text-right">Infladas</th>
                <th className="py-2 text-right">%</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              {e.porMes.map(m => (
                <tr key={m.mes} className="border-b border-zinc-900">
                  <td className="py-2 pr-3">{nombreMes(m.mes)}</td>
                  <td className="py-2 pr-3 text-right">{numero(m.pasadas)}</td>
                  <td className="py-2 pr-3 text-right">{numero(m.revisadas)}</td>
                  <td className="py-2 pr-3 text-right">{numero(m.infladas)}</td>
                  <td className="py-2 text-right">{m.pct.toLocaleString('es-AR')}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-zinc-400 mb-10">
          Descargá la tabla en{' '}
          <a href="/datos/estudio.csv" className="text-yellow-400 underline">
            CSV
          </a>
          . Análisis completo en el{' '}
          <Link href="/estudio/descuentos-inflados-mercado-libre" className="text-yellow-400 underline">
            estudio de descuentos inflados
          </Link>
          .
        </p>

        {inf.detectadas !== null && inf.fecha && (
          <p className="text-zinc-300 mb-10">
            En la última pasada ({fecha(inf.fecha)}) marcamos {numero(inf.detectadas)} ofertas como infladas. La lista del
            día está en{' '}
            <Link href="/descuentos-inflados" className="text-yellow-400 underline">
              descuentos inflados de hoy
            </Link>
            .
          </p>
        )}

        {porRubro.length > 0 && (
          <>
            <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Productos con página de precio, por rubro</h2>
            <ul className="mb-10 space-y-1 text-zinc-300">
              {porRubro.map(([nombre, n]) => (
                <li key={nombre} className="flex justify-between border-b border-zinc-900 py-1">
                  <span>{nombre}</span>
                  <span>{numero(n)}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Metodología y cómo citar</h2>
        <div className="space-y-3 text-zinc-300 leading-relaxed mb-10">
          <p>
            Un programa recorre mercadolibre.com.ar/ofertas 3 veces por día y guarda el precio de cada producto. Una oferta
            cuenta como inflada cuando ya la habíamos registrado al menos 5% más barata en una pasada anterior. Detalle,
            fuentes y limitaciones en la{' '}
            <Link href="/metodologia" className="text-yellow-400 underline">
              metodología
            </Link>
            .
          </p>
          <p>
            Licencia{' '}
            <a href={LICENCIA} className="text-yellow-400 underline" rel="license">
              CC BY 4.0
            </a>
            : podés usar y republicar estos datos citando la fuente. Cita sugerida:
          </p>
          <p className="rounded-lg bg-zinc-900 border border-zinc-800 p-3 font-mono text-sm">{cita}</p>
        </div>
      </article>
      <Footer brand="ofertas" />
    </main>
  )
}
