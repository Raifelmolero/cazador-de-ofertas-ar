// Verifica que ninguna ficha /precio/[slug] generada desde data/seguimiento.json
// quede huérfana (sin enlaces internos entrantes desde OTRA página).
// Lee el HTML prerenderizado de `next build`, así que hay que correrlo después:
//   node node_modules/next/dist/bin/next build --webpack && node scripts/verificar-huerfanos.mjs
// Sale con código 1 si hay huérfanas entre las fichas principales (las
// duplicadas canonicalizan a su principal y no reciben links a propósito).
import fs from 'node:fs'
import path from 'node:path'

const raiz = process.cwd()
const seg = JSON.parse(fs.readFileSync(path.join(raiz, 'data', 'seguimiento.json'), 'utf8'))
const items = Object.entries(seg.items).map(([id, v]) => ({ id, ...v }))
const slugs = new Set(items.map(s => s.slug))

const normalizar = t =>
  t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim()

// Misma regla que lib/seguimiento.ts#mapaPrincipal: grupo por título normalizado;
// principal = más historial, luego menor mínimo, luego slug.
const grupos = new Map()
for (const s of items) {
  const k = normalizar(s.titulo)
  grupos.set(k, [...(grupos.get(k) ?? []), s])
}
const principales = new Set()
for (const g of grupos.values()) {
  const p = [...g].sort((a, b) => b.serie.length - a.serie.length || a.min - b.min || a.slug.localeCompare(b.slug))[0]
  principales.add(p.id)
}

const dirApp = path.join(raiz, '.next', 'server', 'app')
if (!fs.existsSync(dirApp)) {
  console.error('Falta .next/server/app: corré `next build` antes.')
  process.exit(2)
}

function* htmls(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) yield* htmls(p)
    else if (e.name.endsWith('.html')) yield p
  }
}

const entrantes = new Map([...slugs].map(s => [s, new Set()]))
const re = /href="(?:https:\/\/cazadordeofertas\.com\.ar)?\/precio\/([^"#?/]+)"/g
let paginas = 0
for (const f of htmls(dirApp)) {
  paginas++
  const rel = path.relative(dirApp, f).replace(/\\/g, '/').replace(/\.html$/, '')
  const html = fs.readFileSync(f, 'utf8')
  for (const m of html.matchAll(re)) {
    const slug = decodeURIComponent(m[1])
    const destino = entrantes.get(slug)
    if (destino && rel !== `precio/${slug}`) destino.add(rel)
  }
}

const huerfanas = items.filter(s => entrantes.get(s.slug).size === 0)
const huerfanasPrincipales = huerfanas.filter(s => principales.has(s.id))
const conteos = items.filter(s => principales.has(s.id)).map(s => entrantes.get(s.slug).size).sort((a, b) => a - b)

console.log(`Páginas HTML escaneadas: ${paginas}`)
console.log(`Fichas /precio: ${items.length} (principales: ${principales.size}, duplicadas: ${items.length - principales.size})`)
console.log(`Entrantes por ficha principal: mín ${conteos[0]}, mediana ${conteos[Math.floor(conteos.length / 2)]}, máx ${conteos[conteos.length - 1]}`)
console.log(`Huérfanas totales: ${huerfanas.length} | huérfanas principales: ${huerfanasPrincipales.length}`)
for (const s of huerfanasPrincipales.slice(0, 50)) console.log(`  - /precio/${s.slug}`)
process.exit(huerfanasPrincipales.length ? 1 : 0)
