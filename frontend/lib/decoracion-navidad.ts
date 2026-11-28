// Decoración de Navidad (pedido del 28/11/2026, ticket-alto.md «Decoración de Navidad»): bloque dentro
// del hub /regalos-navidad, sin URL nueva. Árboles de 1,80 a 2,40 m, combos árbol + luces + adornos,
// inflables y luces/guirnaldas/adornos/pesebres. Solo ofertas que ya están en los datos del repo
// (getOfertas: precio visto hace DIAS_VIGENCIA días o menos); nada inventado. El rótulo de «mínimo
// histórico» lo pone OfertaCard solo si el dato lo dice (minimo_historico del bot).
import { normalizar } from '@/lib/categorias'
import { getOfertas, type ProductWithMargins } from '@/lib/productos'
import { MARCAS_PROHIBIDAS } from '@/lib/black-friday-landings'

export interface GrupoDecoracion {
  id: string
  titulo: string
  emoji: string
  total: number
  productos: ProductWithMargins[]
}

const NAVIDEÑO = /navid|navide|papa noel|pesebre|arbolito|reno |trineo/
// Lo que comparte palabra pero no es decoración ("Pack Isdin ... Navidad", colchón inflable).
const NO_DECO = /colchon|isdin|perfume|crema|serum|retinal|maquillaje|bicicleta|pileta|sillon/

const esArbol = (t: string) => /\barbol(ito)?\b/.test(t) && /navid|pino|frondoso|puntas|ramas/.test(t)
const esCombo = (t: string) => esArbol(t) && /combo|kit|set|adorno|esfera|bola|decorad|decoracion|\bled\b|luces/.test(t)

/** Altura del árbol en metros, si el título la dice ("1,80 Mts", "180 cm", "2.4m"). */
export function alturaArbol(titulo: string): number | undefined {
  const t = normalizar(titulo)
  const m = t.match(/\b(\d)[.,](\d{1,2})\s*(m|mt|mts|metros?)\b/)
  if (m) return Number(`${m[1]}.${m[2]}`)
  const cm = t.match(/\b(\d{2,3})\s*cm\b/)
  if (cm) return Number(cm[1]) / 100
  const ent = t.match(/\b(\d)\s*(m|mt|mts|metros?)\b/)
  return ent ? Number(ent[1]) : undefined
}

const GRUPOS: { id: string; titulo: string; emoji: string; es: (t: string, p: ProductWithMargins) => boolean }[] = [
  {
    id: 'deco-arboles',
    titulo: 'Árboles de 1,80 a 2,40 m',
    emoji: '🎄',
    es: (t, p) => {
      const h = alturaArbol(p.titulo)
      return esArbol(t) && !esCombo(t) && h !== undefined && h >= 1.8 && h <= 2.4
    },
  },
  { id: 'deco-combos', titulo: 'Combos árbol + luces + adornos', emoji: '🎁', es: t => esCombo(t) },
  { id: 'deco-inflables', titulo: 'Inflables', emoji: '🎅', es: t => t.includes('inflable') && NAVIDEÑO.test(t) },
  {
    id: 'deco-luces',
    titulo: 'Luces, guirnaldas, adornos y pesebres',
    emoji: '✨',
    es: t =>
      !esArbol(t) &&
      (t.includes('guirnalda') || t.includes('pesebre') || (/luces|luz|adorno|esfera|bola|cortina/.test(t) && NAVIDEÑO.test(t))),
  },
]

/** Grupos de decoración navideña con ofertas de hoy. Mínimos históricos primero, después del más caro
 *  al más barato (ticket medio/alto arriba). Un producto no se repite entre grupos; el mismo título de
 *  varios vendedores queda una sola vez (el más barato). */
export function gruposDecoracion(por = 4, ofertas: ProductWithMargins[] = getOfertas()): GrupoDecoracion[] {
  const vistos = new Set<string>()
  return GRUPOS.map(g => {
    const porTitulo = new Map<string, ProductWithMargins>()
    for (const p of ofertas) {
      const t = normalizar(p.titulo)
      if (vistos.has(p.id_ml) || NO_DECO.test(t) || MARCAS_PROHIBIDAS.test(p.titulo) || !g.es(t, p)) continue
      const otro = porTitulo.get(t)
      if (!otro || p.precio_actual < otro.precio_actual) porTitulo.set(t, p)
    }
    const todos = [...porTitulo.values()].sort(
      (a, b) => Number(b.minimo_historico ?? false) - Number(a.minimo_historico ?? false) || b.precio_actual - a.precio_actual,
    )
    for (const p of todos) vistos.add(p.id_ml)
    return { id: g.id, titulo: g.titulo, emoji: g.emoji, total: todos.length, productos: todos.slice(0, por) }
  })
}
