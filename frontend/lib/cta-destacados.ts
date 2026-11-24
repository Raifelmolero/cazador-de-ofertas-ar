// Bloque «oferta destacada» arriba de todo en las páginas que más impresiones juntan en
// Search Console y casi no reciben clics (lote ctr-cta del 24/11/2026, ver
// /workspace/cazador/analisis-metricas-2026-11-23.md, sección 2.A):
//   /guias/samsung-galaxy-a-o-s-cual-conviene      1.514 imp · posición 5,3
//   /guias/que-motorola-comprar-moto-g-o-edge      1.494 imp
//   /guias/que-xiaomi-redmi-comprar                1.170 imp
//   /guias/mejor-celular-para-jugar                3.024 imp
//   /precio-hoy/iphone                             8.625 imp · 0,06 % CTR
// (La calculadora de consumo usa el bloque de la calculadora de comisiones:
// lib/calc-ofertas.ts, RUBROS_CONSUMO.)
//
// Reglas (las mismas de las landings BF, no re-litigar):
// - Solo ids que están en data/productos_rentables.json. Título, foto, link de
//   afiliado y precio salen de ahí al armar el sitio (productosDeItems); si el bot
//   poda un producto, la tarjeta desaparece sola.
// - Precio solo si se vio hace DIAS_PRECIO_VIEJO días o menos; si no, botón sin precio.
// - Nada de % de descuento, precio tachado, «mínimo histórico» ni cupones.
// - Sin BGH, Likon (MLA80862058), HP, OMEN ni Victus.
import { productosDeItems, type ItemBF, type ProductoBF } from '@/lib/black-friday-landings'

/** Marcas que no van en ningún bloque destacado. */
export const MARCAS_EXCLUIDAS_CTA = /\b(bgh|likon|hp|omen|victus)\b/i
/** Ids que no van aunque el título no nombre la marca. */
export const IDS_EXCLUIDOS_CTA = new Set(['MLA80862058'])

export const MAX_DESTACADOS = 3

export interface CtaDestacadoDef {
  titulo: string
  /** data-seccion del bloque (lo cuenta clics-ml.tsx en clic_ml) */
  seccion: string
  /** data-evento del botón: evento propio en Vercel Analytics */
  evento: string
  /** en orden de recomendación; se muestran los MAX_DESTACADOS primeros que sigan en los datos */
  items: ItemBF[]
  verMas: { href: string; texto: string }
}

export const CTAS_DESTACADOS: Record<string, CtaDestacadoDef> = {
  '/guias/samsung-galaxy-a-o-s-cual-conviene': {
    titulo: 'Galaxy A o Galaxy S: los que elegimos hoy',
    seccion: 'cta_guia_samsung',
    evento: 'cta_guia_samsung',
    items: [
      { id: 'MLA47114363', nombre: 'Samsung Galaxy A56 5G', detalle: '256 GB · 8 GB de RAM · Dual SIM', nota: 'Galaxy A: la gama media que más rinde.' },
      { id: 'MLA78803238', nombre: 'Samsung Galaxy S26 FE', detalle: '256 GB · Graphite', nota: 'Galaxy S a un precio más bajo.' },
      { id: 'MLA65503984', nombre: 'Samsung Galaxy S26 Ultra', detalle: '256 GB', nota: 'El tope de la línea S.' },
      { id: 'MLA62751899', nombre: 'Samsung Galaxy A17', detalle: '128 GB · 4 GB de RAM · negro', nota: 'El Galaxy A más barato.' },
    ],
    verMas: { href: '/mejores/black-friday-celulares', texto: 'Más celulares para el Black Friday' },
  },
  '/guias/que-motorola-comprar-moto-g-o-edge': {
    titulo: 'Moto G o Edge: los que elegimos hoy',
    seccion: 'cta_guia_motorola',
    evento: 'cta_guia_motorola',
    items: [
      { id: 'MLA65683670', nombre: 'Motorola Moto G15 Power', detalle: '256 GB · 8 GB de RAM · verde', nota: 'Moto G para el uso de todos los días.' },
      { id: 'MLA68413833', nombre: 'Motorola Moto G67 5G', detalle: '256 GB · 8 GB de RAM · dual SIM · IP68', nota: 'Moto G de gama media, con 5G.' },
      { id: 'MLA66618502', nombre: 'Motorola Edge 70 Fusion', detalle: '256 GB · 8 GB de RAM · azul celeste', nota: 'La línea Edge: gama media-alta.' },
      { id: 'MLA76204388', nombre: 'Motorola Moto G17', detalle: '128 GB · 4 GB de RAM · azul', nota: 'Moto G de entrada.' },
    ],
    verMas: { href: '/mejores/black-friday-celulares-baratos', texto: 'Celulares baratos para el Black Friday' },
  },
  '/guias/que-xiaomi-redmi-comprar': {
    titulo: 'Xiaomi Redmi: los que elegimos hoy',
    seccion: 'cta_guia_xiaomi',
    evento: 'cta_guia_xiaomi',
    items: [
      { id: 'MLA45605578', nombre: 'Xiaomi Redmi 14C', detalle: '256 GB · 8 GB de RAM (4 + 4 virtuales) · dual SIM', nota: 'El Redmi más barato de la lista.' },
      { id: 'MLA64361840', nombre: 'Xiaomi Redmi Note 15', detalle: '4G · 256 GB · 8 GB de RAM · azul', nota: 'La línea Note: mejor pantalla y cámara.' },
      { id: 'MLA64362084', nombre: 'Xiaomi Redmi Note 15 Pro 5G', detalle: '256 GB · 8 GB de RAM · azul', nota: 'El Note con 5G.' },
    ],
    verMas: { href: '/mejores/black-friday-celulares-baratos', texto: 'Celulares baratos para el Black Friday' },
  },
  '/guias/mejor-celular-para-jugar': {
    titulo: 'Celulares para jugar: los que elegimos hoy',
    seccion: 'cta_guia_jugar',
    evento: 'cta_guia_jugar',
    items: [
      { id: 'MLA69983500', nombre: 'Samsung Galaxy A57 5G', detalle: '256 GB · 8 GB de RAM', nota: 'Gama media alta de Samsung.' },
      { id: 'MLA66618502', nombre: 'Motorola Edge 70 Fusion', detalle: '256 GB · 8 GB de RAM · azul celeste', nota: 'El Edge Fusion que nombra la guía.' },
      { id: 'MLA66045214', nombre: 'Xiaomi Redmi Note 15 Pro+ 5G', detalle: '256 GB · 8 GB de RAM · negro', nota: 'La opción de Xiaomi.' },
    ],
    verMas: { href: '/mejores/black-friday-gaming', texto: 'PC gamer y monitores para el Black Friday' },
  },
  '/precio-hoy/iphone': {
    titulo: 'El iPhone que conviene hoy',
    seccion: 'cta_preciohoy_iphone',
    evento: 'cta_preciohoy_iphone',
    items: [
      { id: 'MLA1040287808', nombre: 'Apple iPhone 16', detalle: '128 GB · Negro · Distribuidor autorizado', nota: 'El que más recomendamos hoy.' },
      { id: 'MLA27172677', nombre: 'Apple iPhone 15', detalle: '128 GB · Negro', nota: 'La puerta de entrada a iPhone.' },
      { id: 'MLA55309009', nombre: 'Apple iPhone 17', detalle: '256 GB · Blanco', nota: 'El más nuevo, con el doble de memoria.' },
    ],
    verMas: { href: '/mejores/black-friday-celulares', texto: 'iPhone y Galaxy para el Black Friday' },
  },
}

/** <title> y meta description por CTR (lote 24/11). `desde` = « desde $X» (con espacio adelante)
 *  del más barato que muestra el bloque, o '' si hoy no hay precio visible. Formatos del más
 *  completo al más corto: tituloSeo usa el primero que entra en MAX_TITULO_CTA. */
export const MAX_TITULO_CTA = 60
export interface SeoCta {
  titulo: (desde: string) => ((n: string) => string)[]
  descripcion: (desde: string) => string
}
const coma = (desde: string) => (desde ? `,${desde}` : '')
const hoyEnML = (desde: string) => (desde ? ` Hoy${desde} en Mercado Libre.` : '')

export const SEO_CTA: Record<string, SeoCta> = {
  // 1.514 imp / 28 días en posición 5,3 con 0,79 % de CTR: el título no decía año ni precio.
  '/guias/samsung-galaxy-a-o-s-cual-conviene': {
    titulo: desde => [
      () => `Samsung Galaxy A o S: cuál conviene en 2026${coma(desde)}`,
      () => `Galaxy A o S: cuál conviene en 2026${coma(desde)}`,
      () => 'Samsung Galaxy A o Galaxy S: cuál conviene en 2026',
    ],
    descripcion: desde =>
      `Galaxy A56, S26 FE o S26 Ultra: qué cambia en cámara, pantalla y actualizaciones, y cuál conviene.${hoyEnML(desde)}`,
  },
  // 1.494 imp / 28 días, 0,40 % de CTR. El automático armaba «…comprar (2026): desde $X» (doble dos puntos).
  '/guias/que-motorola-comprar-moto-g-o-edge': {
    titulo: desde => [
      () => `Moto G o Motorola Edge: cuál comprar en 2026${coma(desde)}`,
      () => `Moto G o Edge: cuál comprar en 2026${coma(desde)}`,
      () => 'Motorola Moto G o Edge: cuál comprar en 2026',
    ],
    descripcion: desde =>
      `Moto G15 Power, G67 5G o Edge 70 Fusion: qué cambia en RAM, memoria, 5G y batería, y cuál conviene.${hoyEnML(desde)}`,
  },
  // 1.170 imp / 28 días, 0,43 % de CTR.
  '/guias/que-xiaomi-redmi-comprar': {
    titulo: desde => [
      () => `Qué Xiaomi comprar en 2026: Redmi o Note${coma(desde)}`,
      () => `Qué Xiaomi Redmi comprar en 2026${coma(desde)}`,
      () => 'Qué Xiaomi comprar en 2026: Redmi, Redmi Note o Poco',
    ],
    descripcion: desde =>
      `Redmi 14C, Redmi Note 15 o Note 15 Pro 5G: qué cambia, cuánta memoria conviene y cuál comprar.${hoyEnML(desde)}`,
  },
  // 3.024 imp / 28 días, 0,13 % de CTR. El title del PR #85 había perdido «mejor celular para jugar».
  '/guias/mejor-celular-para-jugar': {
    titulo: desde => [
      () => `Mejor celular para jugar (Free Fire, COD) 2026${coma(desde)}`,
      () => `Mejor celular para jugar en 2026${coma(desde)}`,
      () => 'Mejor celular para jugar 2026: Free Fire, COD y Genshin',
    ],
    descripcion: desde =>
      `Qué celular comprar para jugar Free Fire, COD y Genshin: procesador, RAM real y 120 Hz. Galaxy A57, Edge 70 Fusion o Redmi Note 15 Pro+.${desde ? ` Hoy${desde}.` : ''}`,
  },
}

const pesosSeo = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`

/** « desde $X» del bloque de la ruta (precio más bajo visible), o ''. */
export function desdeCta(cta: CtaDestacado | null): string {
  const precios = (cta?.productos ?? []).map(p => p.precio).filter((n): n is number => !!n && n > 0)
  return precios.length ? ` desde ${pesosSeo(Math.min(...precios))}` : ''
}

export const excluidoDeCta = (p: { id: string; nombre: string }, titulo = '') =>
  IDS_EXCLUIDOS_CTA.has(p.id) || MARCAS_EXCLUIDAS_CTA.test(p.nombre) || MARCAS_EXCLUIDAS_CTA.test(titulo)

export interface CtaDestacado extends CtaDestacadoDef {
  productos: ProductoBF[]
}

/** Bloque de la ruta con sus productos de hoy, o null si la ruta no tiene o no queda ninguno. */
export function ctaDestacado(ruta: string, hoy?: string): CtaDestacado | null {
  const def = CTAS_DESTACADOS[ruta]
  if (!def) return null
  const productos = productosDeItems(def.items, hoy)
    .filter(p => !excluidoDeCta(p))
    .slice(0, MAX_DESTACADOS)
  return productos.length ? { ...def, productos } : null
}
