// Verifica largo de <title> (≤65) y meta description (≤158) en TODAS las páginas masivas.
// Correr (desde frontend/):
//   npx tsc -p scripts/tsconfig.verificar-seo.json && node scripts/correr-verificar-seo.cjs
import { recortar, tituloSeo } from '../lib/seo'
import * as precio from '../app/precio/[slug]/page'
import * as calc from '../app/calculadora/[id]/page'
import * as mejores from '../app/mejores/[slug]/page'
import * as categoria from '../app/categoria/[slug]/page'
import * as guias from '../app/guias/[slug]/page'
import * as vender from '../app/vender/[slug]/page'
import * as precioHoy from '../app/precio-hoy/[slug]/page'
import * as home from '../app/page'

const MAX_T = 65
const MAX_D = 158

// Tests unitarios del helper
const asserts: [boolean, string][] = [
  [recortar('hola mundo', 20) === 'hola mundo', 'no recorta si entra'],
  [recortar('Precio del Samsung Galaxy A55 con envío gratis', 30).length <= 30, 'respeta max'],
  [!/\s(de|con|y)…$/.test(recortar('Heladera Samsung con freezer de acero', 26)), 'no termina en conector'],
  [tituloSeo('Samsung Galaxy A55 256gb Azul Oscuro Dual Sim', [n => `Precio ${n} — Marca Larga Registrada`, n => `Precio ${n}`], 30) === 'Precio Samsung Galaxy A55', 'recorta en palabra'],
]
let ok = true
for (const [c, m] of asserts) if (!c) { ok = false; console.log('FALLA test:', m) }

type Mod = { generateMetadata: (a: { params: Promise<Record<string, string>> }) => Promise<{ title?: unknown; description?: unknown }>; generateStaticParams: () => unknown }
const plantillas: [string, Mod][] = [
  ['/precio', precio as unknown as Mod], ['/calculadora', calc as unknown as Mod], ['/mejores', mejores as unknown as Mod],
  ['/categoria', categoria as unknown as Mod], ['/guias', guias as unknown as Mod], ['/vender', vender as unknown as Mod],
  ['/precio-hoy', precioHoy as unknown as Mod],
]

async function main() {
  const filas: { ruta: string; t: string; d: string }[] = []
  const h = (home as unknown as { metadata: { title: string; description: string } }).metadata
  filas.push({ ruta: '/ (calculadoraml)', t: h.title, d: h.description })
  for (const [base, m] of plantillas) {
    const params = (await m.generateStaticParams()) as Record<string, string>[]
    for (const p of params) {
      const md = await m.generateMetadata({ params: Promise.resolve(p) })
      filas.push({ ruta: `${base}/${Object.values(p)[0]}`, t: String(md.title ?? ''), d: String(md.description ?? '') })
    }
  }
  const maxT = filas.filter(f => !f.ruta.startsWith("/ (")).reduce((a, f) => (f.t.length > a.t.length ? f : a))
  const maxD = filas.reduce((a, f) => (f.d.length > a.d.length ? f : a))
  console.log(`Páginas: ${filas.length}`)
  console.log(`Home: title ${h.title.length} (fuera de alcance), description ${h.description.length}`)
  console.log(`Title máx: ${maxT.t.length} (${maxT.ruta}) "${maxT.t}"`)
  console.log(`Description máx: ${maxD.d.length} (${maxD.ruta})`)
  for (const f of filas) {
    if (f.t.length > MAX_T && !f.ruta.startsWith("/ (")) { ok = false; console.log(`TITLE ${f.t.length} ${f.ruta}`) }
    if (f.d.length > MAX_D) { ok = false; console.log(`DESC ${f.d.length} ${f.ruta}`) }
  }
  if (process.env.EJEMPLOS) for (const r of process.env.EJEMPLOS.split(',')) { const f = filas.find(x => x.ruta === r); if (f) console.log(`${r}\n  T(${f.t.length}): ${f.t}\n  D(${f.d.length}): ${f.d}`) }
  console.log(ok ? 'OK' : 'HAY FALLAS')
  if (!ok) process.exitCode = 1
}
main()
