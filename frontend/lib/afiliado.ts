// Links de afiliado armados en el sitio (los de producto vienen del bot).

function normalizar(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

/** Búsqueda de ML con el link de afiliado (etiqueta `web`): si lo que buscás
 *  hoy no está en oferta, igual comprás por nuestro link (venta indirecta). */
export function busquedaML(q: string, etiqueta = 'web') {
  const slug = normalizar(q.trim()).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return `https://listado.mercadolibre.com.ar/${slug}?matt_word=${etiqueta}&matt_tool=37267219`
}

/** Experimento de atribución: los links salen del sitio (HTML, /ofertas-hoy.json,
 *  JSON-LD) con `matt_word=web`, y al hacer clic DENTRO del sitio se pasan a
 *  `sitio`. En el panel: `sitio` = clics nuestros; `web` = links copiados y
 *  usados afuera (docs/PLAN-REMONTAR-CLICS-2026-10-20.md, paso 3). Solo toca
 *  `web`; las etiquetas de nichos quedan como están. */
export const ETIQUETA_SITIO = 'sitio'

/** Test de Meta Ads: quien llega con `utm_source=meta` hace sus clics con
 *  `matt_word=meta`, así el panel separa los pedidos de los anuncios
 *  (docs/META-ADS-TEST-2026.md). Requiere la etiqueta `meta` creada en el panel. */
export const ETIQUETA_META = 'meta'

/** Etiqueta configurable por env var (se inyecta en el build). Si no está o no
 *  parece una etiqueta, queda la de siempre. */
function etiquetaEnv(valor: string | undefined, porDefecto: string) {
  return valor && /^[a-z0-9_-]{1,30}$/i.test(valor) ? valor : porDefecto
}

/** De dónde salen los links copiados (paso 3 del plan de clics): cada fuente
 *  pública lleva su etiqueta para ver en el panel por dónde llegan los clics
 *  `web` que no vienen de visitas al sitio.
 *  - `/ofertas-hoy.json` (lo baja la grilla, pero cualquiera lo puede leer).
 *  - JSON-LD de productos (`offers.url`, lo leen buscadores e IAs).
 *  - calculadoraml.com.ar: los clics hechos ahí, en vez de `sitio`.
 *  Por defecto quedan como hoy (`web` / `sitio`): una etiqueta que no existe en
 *  el panel de ML podría no pagar comisión (docs/META-ADS-TEST-2026.md). Se
 *  prenden creando la etiqueta en Central de afiliados → Administrar etiquetas
 *  y cargando la env var en Vercel (y redeploy):
 *    NEXT_PUBLIC_ML_ETIQUETA_JSON=webjson
 *    NEXT_PUBLIC_ML_ETIQUETA_JSONLD=webld
 *    NEXT_PUBLIC_ML_ETIQUETA_CALC=calcml */
export const ETIQUETA_JSON = etiquetaEnv(process.env.NEXT_PUBLIC_ML_ETIQUETA_JSON, 'web')
export const ETIQUETA_JSONLD = etiquetaEnv(process.env.NEXT_PUBLIC_ML_ETIQUETA_JSONLD, 'web')
export const ETIQUETA_CALC = etiquetaEnv(process.env.NEXT_PUBLIC_ML_ETIQUETA_CALC, ETIQUETA_SITIO)

/** Etiquetas de links públicos que, si el clic pasa DENTRO del sitio, se
 *  reescriben a `sitio` (la grilla de la home usa los links de /ofertas-hoy.json). */
const ETIQUETAS_PUBLICAS = new Set(['web', ETIQUETA_JSON, ETIQUETA_JSONLD])

/** Cambia `matt_word=web` por otra etiqueta (las de nichos u otras no se tocan).
 *  Devuelve null si no hay nada que cambiar. */
function reetiquetar(href: string, etiqueta: string, desde: ReadonlySet<string>): string | null {
  let url: URL
  try {
    url = new URL(href)
  } catch {
    return null
  }
  const actual = url.searchParams.get('matt_word')
  if (actual === null || !desde.has(actual) || actual === etiqueta) return null
  url.searchParams.set('matt_word', etiqueta)
  return url.toString()
}

export function aEtiquetaSitio(href: string, etiqueta = ETIQUETA_SITIO): string | null {
  return reetiquetar(href, etiqueta, ETIQUETAS_PUBLICAS)
}

const SOLO_WEB: ReadonlySet<string> = new Set(['web'])

/** Para /ofertas-hoy.json y el JSON-LD: el link con la etiqueta de esa fuente. */
export function conEtiqueta(href: string, etiqueta: string): string {
  return reetiquetar(href, etiqueta, SOLO_WEB) ?? href
}

/** Página de compra de ML (cupones, promociones) con el link de afiliado visible. */
export function paginaML(url: string, etiqueta = 'web') {
  return `${url}${url.includes('?') ? '&' : '?'}matt_word=${etiqueta}&matt_tool=37267219`
}
