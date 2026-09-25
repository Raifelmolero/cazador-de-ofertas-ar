// Links de afiliado armados en el sitio (los de producto vienen del bot).

function normalizar(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

/** Búsqueda de ML con el link de afiliado (etiqueta `web`): si lo que buscás
 *  hoy no está en oferta, igual comprás por nuestro link (venta indirecta). */
export function busquedaML(q: string) {
  const slug = normalizar(q.trim()).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return `https://listado.mercadolibre.com.ar/${slug}?matt_word=web&matt_tool=37267219`
}
