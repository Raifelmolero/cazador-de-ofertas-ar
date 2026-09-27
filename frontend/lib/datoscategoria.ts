// Bloque "Datos del historial" de /categoria/[slug] (#06 SEO categorías): lo
// que la página tiene de propio frente a cualquier listado de ofertas. Todo se
// calcula en el build con datos que el sitio ya tiene; si una fuente falta, su
// parte no se muestra (nunca se estima ni se completa a mano):
//
// - Catálogo del día (data/productos_rentables.json, lo escribe el bot en cada
//   corrida y ya viene sin descuentos inflados): cantidad de ofertas, cuántas
//   están en su mínimo histórico, % OFF promedio y rango de precios.
// - Seguimiento (data/seguimiento.json): productos con historial de precio
//   propio (/precio/[slug]) y desde cuándo los seguimos.
// - Publicaciones (bot/state/posts_log.jsonl): ofertas distintas publicadas en
//   los canales en los últimos 30 días y su % OFF promedio.
// - Infladas (data/infladas.json): muestra de descuentos inflados de la misma
//   corrida. Es una muestra, por eso el texto dice "al menos".
import fs from 'node:fs'
import path from 'node:path'
import { enCategoria, enFrase, ofertasDeCategoria, type Categoria } from '@/lib/categorias'
import { getScrapedAt } from '@/lib/productos'
import { seguidosDeCategoria } from '@/lib/seguimiento'
import { getInfladas } from '@/lib/infladas'
import { PRECIOS_HOY, art, mediana } from '@/lib/preciohoy'
import { COMPARATIVAS, indexable } from '@/lib/comparativas'
import { GUIAS } from '@/lib/guias'
import { NICHOS } from '@/lib/nichos'

const DIAS_PUBLICADAS = 30
const DIA_MS = 86_400_000

export interface DatosCategoria {
  /** Corrida del bot que armó el catálogo (ISO) */
  scrapedAt: string
  ofertas: number
  minimos: number
  /** % OFF promedio (sobre el precio anterior que muestra ML), redondeado */
  descuentoPromedio: number | null
  precioMin: number | null
  precioMediana: number | null
  precioMax: number | null
  seguidos: number
  seguidosDesde: string | null
  /** null = no hay registro de publicaciones en este build */
  publicadas: { productos: number; descuentoPromedio: number | null } | null
  /** Casos de la categoría en la muestra de infladas de la misma corrida */
  infladasMuestra: number
}

interface Post {
  ts: string
  id: string
  title: string
  discount?: number
}

let posts: Post[] | null = null

function leerPosts(): Post[] {
  if (posts) return posts
  try {
    const p = path.join(process.cwd(), '..', 'bot', 'state', 'posts_log.jsonl')
    posts = fs
      .readFileSync(p, 'utf8')
      .split('\n')
      .filter(Boolean)
      .flatMap(l => {
        try {
          const x = JSON.parse(l)
          return typeof x?.ts === 'string' && typeof x?.id === 'string' && typeof x?.title === 'string' ? [x as Post] : []
        } catch {
          return []
        }
      })
  } catch {
    posts = []
  }
  return posts
}

const promedio = (xs: number[]) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null)

export function getDatosCategoria(c: Categoria): DatosCategoria {
  const scraped = getScrapedAt()
  const ofertas = ofertasDeCategoria(c)
  const precios = ofertas.map(o => o.precio_actual).sort((a, b) => a - b)
  const descuentos = ofertas.map(o => o.descuento_pct ?? 0).filter(d => d > 0)

  const seguidos = seguidosDeCategoria(c.slug)
  const desde = seguidos.map(s => s.desde).filter(Boolean).sort()[0] ?? null

  // Una fila por producto (el mismo sale en Telegram, IG, Threads…): queda la
  // última publicación de cada uno dentro de la ventana.
  const log = leerPosts()
  let publicadas: DatosCategoria['publicadas'] = null
  if (log.length) {
    const corte = scraped.getTime() - DIAS_PUBLICADAS * DIA_MS
    const porId = new Map<string, Post>()
    for (const p of log) {
      const t = Date.parse(p.ts)
      if (Number.isFinite(t) && t >= corte && t <= scraped.getTime() + DIA_MS && enCategoria(c, p.title)) porId.set(p.id, p)
    }
    const ps = [...porId.values()]
    publicadas = {
      productos: ps.length,
      descuentoPromedio: promedio(ps.map(p => p.discount ?? 0).filter(d => typeof d === 'number' && d > 0)),
    }
  }

  // Solo si la muestra de infladas es de la misma corrida que el catálogo
  const inf = getInfladas()
  const mismaCorrida = inf.actualizado != null && Math.abs(Date.parse(inf.actualizado) - scraped.getTime()) < 6 * 3_600_000
  const infladasMuestra = mismaCorrida ? inf.casos.filter(k => enCategoria(c, k.titulo)).length : 0

  return {
    scrapedAt: scraped.toISOString(),
    ofertas: ofertas.length,
    minimos: ofertas.filter(o => o.minimo_historico).length,
    descuentoPromedio: promedio(descuentos),
    precioMin: precios.length ? precios[0] : null,
    precioMediana: precios.length ? mediana(precios) : null,
    precioMax: precios.length ? precios[precios.length - 1] : null,
    seguidos: seguidos.length,
    seguidosDesde: desde,
    publicadas,
    infladasMuestra,
  }
}

export const pesos = (n: number) => '$' + Math.round(n).toLocaleString('es-AR')

/** "2026-07-18" → "18/07/2026" (fechas sin hora del seguimiento) */
export const fechaCorta = (iso: string) => iso.slice(0, 10).split('-').reverse().join('/')

/** Día de la revisión en hora argentina (la corrida de las 21 h cae después de medianoche UTC). */
export const diaRevision = (iso: string) =>
  new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(iso))

const plural = (n: number, uno: string, varios: string) => (n === 1 ? uno : varios)

/** Resumen en texto de los datos (lo que un buscador o una IA puede citar tal cual). */
export function resumenDatos(c: Categoria, d: DatosCategoria): string[] {
  const cat = enFrase(c)
  const dia = diaRevision(d.scrapedAt)
  const parrafos: string[] = []

  if (d.ofertas === 1) {
    let t = `En la revisión del ${dia} listamos 1 oferta de ${cat} en Mercado Libre Argentina, con el descuento chequeado contra nuestro historial de precios (sin descuentos inflados). `
    t += d.minimos
      ? 'Está en el precio más bajo que registramos para ese producto. '
      : 'No está en el precio más bajo que registramos para ese producto. '
    if (d.descuentoPromedio != null) t += `Anuncia un ${d.descuentoPromedio}% de descuento sobre el precio anterior. `
    if (d.precioMin != null) t += `Sale ${pesos(d.precioMin)}.`
    parrafos.push(t.trim())
  } else if (d.ofertas > 1) {
    let t = `En la revisión del ${dia} listamos ${d.ofertas} ofertas de ${cat} en Mercado Libre Argentina, todas con el descuento chequeado contra nuestro historial de precios (sin descuentos inflados). `
    t +=
      d.minimos > 0
        ? `${d.minimos} de ${d.ofertas} ${plural(d.minimos, 'está', 'están')} en el precio más bajo que registramos para ese producto. `
        : 'Ninguna está hoy en el precio más bajo que registramos para ese producto. '
    if (d.descuentoPromedio != null) t += `El descuento promedio que anuncian es de ${d.descuentoPromedio}% sobre el precio anterior. `
    if (d.precioMin != null && d.precioMax != null)
      t +=
        d.ofertas >= 3 && d.precioMediana != null
          ? `Los precios van de ${pesos(d.precioMin)} a ${pesos(d.precioMax)}, con una mediana de ${pesos(d.precioMediana)}.`
          : `Los precios van de ${pesos(d.precioMin)} a ${pesos(d.precioMax)}.`
    parrafos.push(t.trim())
  } else {
    parrafos.push(
      `En la revisión del ${dia} no quedó ninguna oferta de ${cat} con descuento real para listar. Revisamos Mercado Libre Argentina 3 veces por día, así que puede cambiar en la próxima pasada.`
    )
  }

  if (d.infladasMuestra > 0)
    parrafos.push(
      `En esa misma revisión descartamos al menos ${d.infladasMuestra} ${plural(d.infladasMuestra, 'oferta', 'ofertas')} de ${cat} con el descuento inflado: ya ${plural(d.infladasMuestra, 'la', 'las')} habíamos visto al menos un 5% más ${plural(d.infladasMuestra, 'barata', 'baratas')} antes.`
    )

  const extra: string[] = []
  if (d.seguidos > 0 && d.seguidosDesde)
    extra.push(
      `Tenemos historial de precio propio de ${d.seguidos} ${plural(d.seguidos, 'producto', 'productos')} de esta categoría, ${plural(d.seguidos, 'con su página de precio', 'cada uno con su página de precio')} (seguimos el más antiguo desde el ${fechaCorta(d.seguidosDesde)}).`
    )
  if (d.publicadas && d.publicadas.productos > 0)
    extra.push(
      `En los últimos ${DIAS_PUBLICADAS} días publicamos ${d.publicadas.productos} ${plural(d.publicadas.productos, 'oferta', 'ofertas distintas')} de ${cat} en nuestros canales` +
        (d.publicadas.descuentoPromedio != null ? `, con un descuento promedio de ${d.publicadas.descuentoPromedio}%.` : '.')
    )
  if (extra.length) parrafos.push(extra.join(' '))

  return parrafos
}

/** Pregunta frecuente calculada (solo con al menos 3 ofertas: con menos, un rango no dice nada). */
export function faqDatos(c: Categoria, d: DatosCategoria): { q: string; a: string } | null {
  if (d.ofertas < 3 || d.precioMin == null || d.precioMax == null || d.precioMediana == null) return null
  const cat = enFrase(c)
  return {
    q: `¿Cuánto cuestan hoy las ofertas de ${cat} en Mercado Libre?`,
    a:
      `En la revisión del ${diaRevision(d.scrapedAt)}, las ${d.ofertas} ofertas de ${cat} con descuento real que listamos van de ${pesos(d.precioMin)} a ${pesos(d.precioMax)}, con una mediana de ${pesos(d.precioMediana)}. ` +
      (d.minimos > 0
        ? `${d.minimos} de ellas ${plural(d.minimos, 'está', 'están')} en su precio más bajo registrado. `
        : '') +
      'Los precios cambian varias veces por día: el listado de esta página se actualiza en cada revisión.',
  }
}

export interface Enlace {
  href: string
  texto: string
  tipo: 'nicho' | 'comparativa' | 'precio' | 'guia'
}

/** Páginas del sitio que tratan el mismo rubro: hub del nicho, comparativas
 *  (solo las indexables: con menos de 3 productos llevan noindex), "precio hoy"
 *  y guías cuya categoría o comparativa es esta. */
export function enlacesRelacionados(c: Categoria): Enlace[] {
  const comparativas = COMPARATIVAS.filter(x => x.categoria === c.slug)
  const guias = GUIAS.filter(
    g =>
      g.categoria?.slug === c.slug ||
      comparativas.some(x => x.guia === g.slug || g.cta?.href === `/mejores/${x.slug}`)
  )
  return [
    ...NICHOS.filter(n => n.categorias.includes(c.slug)).map(n => ({
      href: `/${n.slug}`,
      texto: `${n.emoji} Todo en un lugar: ${n.marca}`,
      tipo: 'nicho' as const,
    })),
    ...comparativas.filter(indexable).map(x => ({ href: `/mejores/${x.slug}`, texto: x.titulo, tipo: 'comparativa' as const })),
    ...PRECIOS_HOY.filter(p => p.categoria === c.slug).map(p => ({
      href: `/precio-hoy/${p.slug}`,
      texto: `¿Cuánto sale ${art(p, false)} ${p.nombre} hoy?`,
      tipo: 'precio' as const,
    })),
    ...guias.map(g => ({ href: `/guias/${g.slug}`, texto: g.titulo, tipo: 'guia' as const })),
  ]
}
