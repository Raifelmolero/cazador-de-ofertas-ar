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

export function aEtiquetaSitio(href: string, etiqueta = ETIQUETA_SITIO): string | null {
  let url: URL
  try {
    url = new URL(href)
  } catch {
    return null
  }
  if (url.searchParams.get('matt_word') !== 'web') return null
  url.searchParams.set('matt_word', etiqueta)
  return url.toString()
}

/** Página de compra de ML (cupones, promociones) con el link de afiliado visible. */
export function paginaML(url: string, etiqueta = 'web') {
  return `${url}${url.includes('?') ? '&' : '?'}matt_word=${etiqueta}&matt_tool=37267219`
}
