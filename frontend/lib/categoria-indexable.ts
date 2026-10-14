import { ofertasDeCategoria, type Categoria } from '@/lib/categorias'
import { getContenidoCategoria } from '@/lib/categorias-contenido'
import { seguidosDeCategoria } from '@/lib/seguimiento'

const MIN_OFERTAS_CATEGORIA = 3

/**
 * ¿Vale la pena que Google indexe /categoria/[slug]? Con el catálogo chico
 * (escaneo pausado) varias categorías quedan con 0-2 ofertas: sin texto propio
 * ni historial serían páginas finas. Mismo criterio que `indexable()` de las
 * comparativas: hay productos hoy, historial propio o contenido editorial.
 */
export function categoriaIndexable(c: Categoria): boolean {
  if (getContenidoCategoria(c.slug)) return true
  if (seguidosDeCategoria(c.slug).length > 0) return true
  return ofertasDeCategoria(c).length >= MIN_OFERTAS_CATEGORIA
}
