// Nombre corto para las tarjetas. Módulo puro: lo usan servidor y componentes cliente.
// El título completo queda en los datos estructurados y en la ficha /precio.

/** Lo que va antes del primer « - » o « | » si alcanza para identificar el producto, cortado en palabra. */
export function nombreCorto(titulo: string, max = 60): string {
  const t = titulo.replace(/\s+/g, ' ').trim()
  const primera = t.split(/\s[-|–]\s/)[0]
  const base = primera.length >= 20 ? primera : t
  if (base.length <= max) return base
  const corte = base.lastIndexOf(' ', max)
  const recorte = base.slice(0, corte > max / 2 ? corte : max).replace(/(\s(de|del|con|y|en|para|a)|[\s,.:/+-])+$/i, '')
  return `${recorte}…`
}
