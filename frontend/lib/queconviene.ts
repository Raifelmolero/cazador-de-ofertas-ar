// Producto con botón «Ver en ML» en la primera pantalla (propuesta 1 de
// EQUIPO-GROK/CLICS-Y-VENTAS-2026-11-19.md): Google manda a la home y a guías
// informativas que no tenían un producto a mano, y rinde 0,15 clics a ML por
// sesión contra 0,58 de ChatGPT.
//
// No hay criterio nuevo: cada caja reutiliza la selección que ya existe
// (lib/prioridades, vidrieraTecno, equiposDeGuia, productosDe de la comparativa
// de la guía) y encima pide precio reciente: `precio_visto` de hace
// DIAS_PRECIO_RECIENTE días o menos (lib/frescura). Sin `precio_visto` no entra.
// Si no queda ninguno, la caja no se muestra.
import type { OfertaLight } from '@/components/OfertaCard'
import { getCategoria, enCategoria, normalizar } from '@/lib/categorias'
import { getComparativa, productosDe } from '@/lib/comparativas'
import { DIAS_PRECIO_RECIENTE, diasDesde } from '@/lib/frescura'
import type { Guia } from '@/lib/guias'
import { equiposDeGuia } from '@/lib/guias-equipos'
import { ofertasHoyLight } from '@/lib/ofertashoy'
import { getOfertas } from '@/lib/productos'
import { candidatasDeCategoria, claveModelo, elegirMezcla, esExcluidaDeDestacados } from '@/lib/prioridades'
import { vidrieraTecno } from '@/lib/vidrieratecno'

export interface ItemConviene {
  id: string
  /** qué es (Notebook, Smart TV…), solo en la home */
  rubro?: string
  titulo: string
  precio: number
  descuento: number | null
  minimo_historico: boolean
  /** link de afiliado del catálogo, tal cual lo usan las demás fichas (clics-ml.tsx le pone `sitio` al clic) */
  url: string
  img: string | null
  /** precio_visto del catálogo: día en que se leyó el precio */
  visto?: string
}

/** ¿El precio se vio hace DIAS_PRECIO_RECIENTE días o menos? Sin fecha: no. */
export function precioReciente(precioVisto?: string | null): boolean {
  const d = diasDesde(precioVisto)
  return d !== null && d <= DIAS_PRECIO_RECIENTE
}

function desdeOferta(o: OfertaLight, rubro?: string): ItemConviene {
  return {
    id: o.id_ml,
    rubro,
    titulo: o.titulo,
    precio: o.precio_actual,
    descuento: o.descuento_pct ?? null,
    minimo_historico: !!o.minimo_historico,
    url: o.url_producto,
    img: o.url_imagen,
    visto: o.precio_visto,
  }
}

/** Primer elemento de `lista` que esté en la categoría del sitio `slug` (sin categoría: el primero). */
function primeraEn<T extends { titulo: string }>(lista: T[], slug: string): T | undefined {
  const cat = getCategoria(slug)
  return lista.find(o => !cat || enCategoria(cat, o.titulo))
}

/**
 * Home: una notebook, una TV y un aire (o una heladera si no hay aire válido),
 * del catálogo del día con precio reciente. Cada rubro sin candidata se omite.
 */
export function ofertasVerificadasHome(ofertas: OfertaLight[] = ofertasHoyLight()): ItemConviene[] {
  const recientes = ofertas.filter(o => precioReciente(o.precio_visto))
  const porId = new Map(recientes.map(o => [o.id_ml, o]))
  const out: ItemConviene[] = []

  // Notebook: misma vidriera que la home (marcas conocidas, mínimo o descuento real), primero hasta $2 M.
  const nb = vidrieraTecno({ cantidad: 12, solo: 'notebook', hasta: 2_000_000 })
    .map(i => porId.get(i.id_ml))
    .find(o => o !== undefined && !esExcluidaDeDestacados(o))
  if (nb) out.push(desdeOferta(nb, 'Notebook'))

  const tv = primeraEn(candidatasDeCategoria(recientes, 'tv_audio'), 'smart-tv')
  if (tv) out.push(desdeOferta(tv, 'Smart TV'))

  const aire = primeraEn(candidatasDeCategoria(recientes, 'climatizacion'), 'aire-acondicionado')
  const frio = aire ? { o: aire, rubro: 'Aire acondicionado' } : (() => {
    const h = primeraEn(candidatasDeCategoria(recientes, 'refrigeracion'), 'heladeras')
    return h ? { o: h, rubro: 'Heladera' } : undefined
  })()
  if (frio) out.push(desdeOferta(frio.o, frio.rubro))

  return out
}

/** Ofertas de la comparativa de la guía con precio reciente, sin lo excluido y un modelo por tarjeta. */
function deComparativa(slug: string, n: number): ItemConviene[] {
  const comp = getComparativa(slug)
  if (!comp) return []
  const vistos = new Set<string>()
  return productosDe(comp)
    .filter(p => {
      if (!precioReciente(p.precio_visto) || esExcluidaDeDestacados(p)) return false
      const m = claveModelo(p.titulo)
      if (vistos.has(m)) return false
      vistos.add(m)
      return true
    })
    .slice(0, n)
    .map(p => desdeOferta(p))
}

/** Equipos de la guía (lib/guias-equipos) que hoy están en oferta con precio reciente. */
function deEquipos(g: Guia, n: number): ItemConviene[] {
  const visto = new Map(getOfertas().map(o => [o.id_ml, o.precio_visto]))
  return equiposDeGuia(g)
    .filter(e => e.enOferta && precioReciente(visto.get(e.id)))
    .slice(0, n)
    .map(e => ({
      id: e.id,
      titulo: e.titulo,
      precio: e.precio,
      descuento: e.descuento,
      minimo_historico: e.minimo != null && e.precio <= e.minimo,
      url: e.url,
      img: e.img,
      visto: visto.get(e.id),
    }))
}

/** Lo mismo que destaca la home (mezcla de categorías prioritarias), con precio reciente. */
function destacadosDelDia(n: number): ItemConviene[] {
  return elegirMezcla(ofertasHoyLight().filter(o => precioReciente(o.precio_visto)), n).map(o => desdeOferta(o))
}

const PS5 = /\bps5\b|playstation 5/

/** Las guías que más entradas de Google reciben (Clarity 16-18/11) y qué muestra cada caja. */
const CAJAS: Record<string, (g: Guia) => ItemConviene[]> = {
  'black-friday-argentina-que-conviene-comprar': () => destacadosDelDia(3),
  'cupones-y-codigos-de-descuento-de-mercado-libre-argentina': () => destacadosDelDia(3),
  'samsung-galaxy-a-o-s-cual-conviene': g => deComparativa(g.comparativa ?? 'mejores-samsung-galaxy', 3),
  'que-aire-acondicionado-comprar': g => deComparativa(g.comparativa ?? 'mejores-aires-inverter', 3),
  // TV que cumple el criterio de la guía (4K, 50"+, panel) y, si hay, una PS5 con precio reciente.
  'smart-tv-para-ps5': g => {
    const tvs = deEquipos(g, 2)
    const ps5 = candidatasDeCategoria(ofertasHoyLight().filter(o => precioReciente(o.precio_visto)), 'consolas').find(o =>
      PS5.test(normalizar(o.titulo)),
    )
    return ps5 ? [...tvs, desdeOferta(ps5)] : tvs
  },
}

/** Productos de la caja «La que conviene hoy» de la guía (vacío si no tiene o si hoy no hay ninguno válido). */
export function cajaDeGuia(g: Guia): ItemConviene[] {
  return CAJAS[g.slug]?.(g) ?? []
}
