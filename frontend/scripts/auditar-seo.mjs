#!/usr/bin/env node
// Auditoría SEO técnica sobre el HTML del build (.next/server/app).
//
// Uso (desde frontend/, después de `next build --webpack`):
//   node scripts/auditar-seo.mjs            → levanta `next start` en un puerto libre para leer los sitemaps
//   node scripts/auditar-seo.mjs --sin-server → solo HTML en disco (se saltean los chequeos de sitemap)
//   node scripts/auditar-seo.mjs --json     → imprime el detalle completo en JSON
//
// Chequea: título/descripción (≤65/≤158, lib/seo.ts) y duplicados, canonical
// (falta / host equivocado / no coincide con la URL), h1 (0 o >1), JSON-LD que
// no parsea, links internos a rutas que no existen en el build, links relativos
// que cruzan de dominio, sitemap (URLs con noindex, inexistentes o que no son
// su propio canonical) y páginas indexables fuera del sitemap, y las URLs de
// llms.txt / llms-calc.txt. Sale con código 1 si hay errores.
import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import net from 'node:net'
import http from 'node:http'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const APP = path.join(ROOT, '.next', 'server', 'app')
const PUBLIC = path.join(ROOT, 'public')
const DEALS = 'cazadordeofertas.com.ar'
const CALC = 'calculadoraml.com.ar'
const MAX_T = 65
const MAX_D = 158
const args = new Set(process.argv.slice(2))

if (!fs.existsSync(APP)) { console.error('No hay build: corré `npx next build --webpack` primero.'); process.exit(2) }

// ---------- rutas del build ----------
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out); else out.push(p)
  }
  return out
}
const archivos = walk(APP)
const rutaDe = (f, ext) => {
  let r = '/' + path.relative(APP, f).split(path.sep).join('/').slice(0, -ext.length)
  if (r === '/index') r = '/'
  return r
}
const paginas = new Map() // ruta → html
const rutas = new Set()
for (const f of archivos) {
  if (f.endsWith('.html')) {
    const r = rutaDe(f, '.html')
    if (r === '/_not-found' || r === '/_global-error') continue
    paginas.set(r, fs.readFileSync(f, 'utf8'))
    rutas.add(r)
  } else if (f.endsWith('.body')) rutas.add(rutaDe(f, '.body')) // route handlers prerenderizados (feed.xml, llms.txt…)
}
for (const f of walk(PUBLIC)) rutas.add('/' + path.relative(PUBLIC, f).split(path.sep).join('/'))
// Rutas dinámicas (sin prerender): app-paths-manifest
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, '.next', 'server', 'app-paths-manifest.json'), 'utf8'))
for (const k of Object.keys(manifest)) {
  const r = k.replace(/\/(page|route)$/, '') || '/'
  if (!r.includes('[')) rutas.add(r)
}
// Rutas dinámicas con dynamicParams=false: solo valen las prerenderizadas
const prer = JSON.parse(fs.readFileSync(path.join(ROOT, '.next', 'prerender-manifest.json'), 'utf8'))
const cerradas = new Set(Object.entries(prer.dynamicRoutes ?? {}).filter(([, v]) => v.fallback === false).map(([k]) => k))
const dinamicasAbiertas = Object.keys(manifest)
  .map(k => k.replace(/\/(page|route)$/, ''))
  .filter(r => r.includes('[') && !cerradas.has(r))
  .map(r => new RegExp('^' + r.replace(/\[\.\.\.[^\]]+\]/g, '.+').replace(/\[[^\]]+\]/g, '[^/]+') + '$'))
const existe = r => {
  r = decodeURIComponent(r.split('#')[0].split('?')[0]).replace(/\/$/, '') || '/'
  if (rutas.has(r)) return true
  // Reescrituras: '/' en el dominio de ofertas sirve /hoy; /llms.txt en calc sirve /llms-calc.txt
  return dinamicasAbiertas.some(re => re.test(r))
}

// ---------- parseo liviano ----------
const decode = s => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
const head = html => html.slice(0, html.indexOf('</head>') + 7 || undefined)
function meta(html) {
  const h = head(html)
  const t = h.match(/<title[^>]*>([\s\S]*?)<\/title>/)
  const d = h.match(/<meta name="description" content="([^"]*)"/)
  const c = h.match(/<link rel="canonical" href="([^"]*)"/)
  const rb = h.match(/<meta name="robots" content="([^"]*)"/)
  // Solo el <body> real (sin los payloads RSC de <script>)
  const body = html.replace(/<script\b[\s\S]*?<\/script>/g, (m) => (m.includes('application/ld+json') ? m : ''))
  const h1 = (body.match(/<h1[\s>]/g) ?? []).length
  const ld = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1])
  const hrefs = [...body.matchAll(/<a\b[^>]*\shref="([^"]*)"/g)].map(m => decode(m[1]))
  return {
    title: t ? decode(t[1]) : null,
    desc: d ? decode(d[1]) : null,
    canonical: c ? decode(c[1]) : null,
    noindex: rb ? /noindex/.test(rb[1]) : false,
    h1, ld, hrefs,
  }
}

// ---------- chequeos por página ----------
const hallazgos = {}
const add = (tipo, ruta, detalle = '') => (hallazgos[tipo] ??= []).push(detalle ? `${ruta} → ${detalle}` : ruta)
const info = new Map()
const hostDe = u => { try { return new URL(u).host.replace(/^www\./, '') } catch { return null } }

for (const [ruta, html] of paginas) {
  const m = meta(html)
  info.set(ruta, m)
  // Páginas técnicas sin intención de indexar (redirecciones, callbacks)
  const esTecnica = /^\/tiktok\//.test(ruta)
  if (!m.title) add('titulo_faltante', ruta)
  else if (m.title.length > MAX_T) add('titulo_largo', ruta, `${m.title.length}: ${m.title}`)
  if (!m.desc) { if (!m.noindex) add('descripcion_faltante', ruta) }
  else if (m.desc.length > MAX_D) add('descripcion_larga', ruta, `${m.desc.length}`)
  if (m.noindex || esTecnica) continue
  if (!m.canonical) add('canonical_faltante', ruta)
  else {
    const ch = hostDe(m.canonical)
    if (ch !== DEALS && ch !== CALC) add('canonical_host_desconocido', ruta, m.canonical)
    else {
      const p = new URL(m.canonical).pathname.replace(/\/$/, '') || '/'
      const esperado = ruta === '/hoy' ? '/' : ruta
      if (p !== esperado) add('canonical_otra_ruta', ruta, m.canonical)
    }
  }
  if (m.h1 === 0) add('h1_faltante', ruta)
  if (m.h1 > 1) add('h1_multiple', ruta, String(m.h1))
  for (const j of m.ld) { try { JSON.parse(j) } catch (e) { add('jsonld_invalido', ruta, e.message) } }
}

// Host canónico de cada ruta (para links relativos que cruzan dominio)
const hostRuta = new Map()
for (const [r, m] of info) if (m.canonical && !m.noindex) hostRuta.set(r, hostDe(m.canonical))

const rotos = new Map()
const cruzados = new Map()
for (const [ruta, m] of info) {
  const miHost = hostRuta.get(ruta)
  for (const href of m.hrefs) {
    let destino = null
    let relativo = false
    if (href.startsWith('/') && !href.startsWith('//')) { destino = href; relativo = true }
    else { const h = hostDe(href); if (h === DEALS || h === CALC) destino = new URL(href).pathname }
    if (destino === null) continue
    const limpio = destino.split('#')[0].split('?')[0]
    if (!limpio) continue
    // '/' en cazadordeofertas se reescribe a /hoy: existe siempre
    if (!existe(limpio)) { rotos.set(`${ruta} → ${href}`, 1); continue }
    if (relativo && miHost) {
      const n = limpio.replace(/\/$/, '') || '/'
      const hd = n === '/' ? miHost : hostRuta.get(n)
      if (hd && hd !== miHost) cruzados.set(`${ruta} → ${href} (canonical en ${hd})`, 1)
    }
  }
}
if (rotos.size) hallazgos.link_interno_roto = [...rotos.keys()]
if (cruzados.size) hallazgos.link_relativo_cruza_dominio = [...cruzados.keys()]

// Duplicados (por host canónico)
const dup = (campo, tipo) => {
  const g = new Map()
  for (const [r, m] of info) {
    if (m.noindex || !m[campo] || !hostRuta.get(r)) continue
    const k = hostRuta.get(r) + '|' + m[campo]
    g.set(k, [...(g.get(k) ?? []), r])
  }
  for (const [k, rs] of g) if (rs.length > 1) add(tipo, rs.join(', '), k.split('|').slice(1).join('|').slice(0, 90))
}
dup('title', 'titulo_duplicado')
dup('desc', 'descripcion_duplicada')

// ---------- sitemap y llms.txt (necesitan el server: el sitemap depende del host) ----------
async function libre() {
  return new Promise(res => { const s = net.createServer(); s.listen(0, () => { const p = s.address().port; s.close(() => res(p)) }) })
}
async function conServer(fn) {
  const port = await libre()
  const bin = path.join(ROOT, 'node_modules', 'next', 'dist', 'bin', 'next')
  const proc = spawn(process.execPath, [bin, 'start', '-H', '127.0.0.1', '-p', String(port)], { cwd: ROOT, stdio: args.has('--debug') ? 'inherit' : 'ignore' })
  try {
    for (let i = 0; i < 240; i++) {
      try { await get(port, CALC, '/robots.txt'); break } catch { await new Promise(r => setTimeout(r, 500)) }
    }
    return await fn(port)
  } finally { proc.kill() }
}
// fetch() ignora el header Host: se usa http.request para simular cada dominio
const get = (port, host, p) => new Promise((res, rej) => {
  http.get({ host: '127.0.0.1', port, path: p, headers: { host } }, r => {
    let b = ''; r.setEncoding('utf8'); r.on('data', c => (b += c)); r.on('end', () => res(b))
  }).on('error', rej)
})

if (!args.has('--sin-server')) {
  await conServer(async port => {
    const enSitemap = new Set()
    for (const host of [DEALS, CALC]) {
      const xml = await get(port, host, '/sitemap.xml')
      const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => decode(m[1]))
      if (!urls.length) add('sitemap_vacio', host)
      for (const u of urls) {
        const h = hostDe(u)
        if (h !== host) add('sitemap_url_de_otro_host', host, u)
        const p = new URL(u).pathname.replace(/\/$/, '') || '/'
        const ruta = h === DEALS && p === '/' ? '/hoy' : p
        enSitemap.add(ruta)
        const m = info.get(ruta)
        if (!m) { if (!existe(ruta)) add('sitemap_url_inexistente', u); continue }
        if (m.noindex) add('sitemap_url_noindex', u)
        else if (m.canonical && m.canonical.replace(/\/$/, '') !== u.replace(/\/$/, '')) add('sitemap_url_no_canonica', u, m.canonical)
      }
    }
    for (const [r, m] of info) {
      if (m.noindex || !m.canonical || /^\/tiktok\//.test(r)) continue
      // /calculadora/[id] se excluye a propósito del sitemap (rotan, ver app/sitemap.ts)
      if (/^\/calculadora\/[^/]+$/.test(r)) continue
      if (!enSitemap.has(r)) add('indexable_fuera_del_sitemap', r)
    }
    for (const [host, archivo] of [[DEALS, '/llms.txt'], [CALC, '/llms.txt'], [DEALS, '/llms-full.txt']]) {
      const txt = await get(port, host, archivo)
      for (const u of new Set([...txt.matchAll(/https?:\/\/(?:www\.)?(?:cazadordeofertas|calculadoraml)\.com\.ar[^\s)\]>"']*/g)].map(m => m[0].replace(/[.,;:]+$/, '')))) {
        const h = hostDe(u)
        const p = new URL(u).pathname.replace(/\/$/, '') || '/'
        const ruta = h === DEALS && p === '/' ? '/hoy' : p
        if (!existe(ruta)) add('llms_url_inexistente', `${host}${archivo}`, u)
        else if (info.get(ruta)?.noindex) add('llms_url_noindex', `${host}${archivo}`, u)
        else if (h && hostRuta.get(ruta) && hostRuta.get(ruta) !== h) add('llms_url_host_equivocado', `${host}${archivo}`, u)
      }
    }
    // Comparativas indexables que faltan en llms.txt
    const llms = await get(port, DEALS, '/llms.txt')
    for (const r of info.keys()) {
      const m = info.get(r)
      if (/^\/mejores\/[^/]+$/.test(r) && !m.noindex && !llms.includes(`${DEALS}${r}`)) add('mejores_indexable_fuera_de_llms', r)
    }
  })
}

// ---------- reporte ----------
const tipos = Object.keys(hallazgos).sort()
console.log(`Páginas HTML: ${paginas.size} (noindex: ${[...info.values()].filter(m => m.noindex).length})`)
if (!tipos.length) console.log('Sin hallazgos ✔')
for (const t of tipos) {
  console.log(`\n[${t}] ${hallazgos[t].length}`)
  for (const x of hallazgos[t].slice(0, args.has('--todo') ? Infinity : 15)) console.log('  ' + x)
  if (hallazgos[t].length > 15 && !args.has('--todo')) console.log(`  … (+${hallazgos[t].length - 15}, usar --todo)`)
}
if (args.has('--json')) console.log(JSON.stringify(hallazgos, null, 2))
process.exit(tipos.length ? 1 : 0)
