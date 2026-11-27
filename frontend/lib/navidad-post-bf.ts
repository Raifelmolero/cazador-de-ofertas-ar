// Después del Black Friday, a Navidad (pedido del 27/11/2026).
//
// Cuando termina el Black Friday (modoBF === 'termino': desde el lunes 30/11 00:00 hora argentina,
// el fin que ya usa lib/cybermonday.ts con BLACK_FRIDAY.ultimoDia = 29/11), /black-friday,
// /mejores/black-friday-* y las guías BF muestran arriba el cuadro «Black Friday terminó» con link
// a /regalos-navidad y a la categoría equivalente del rubro. Las URLs no cambian (ya están en Google).
//
// Módulo puro (sin fs ni alias @/): lo prueban bot/tests/test_navidad_post_bf.py con node.
import { BLACK_FRIDAY, modoBF, type ModoBF } from './cybermonday'

export const NAVIDAD = '2026-12-25'
/** Reyes Magos: miércoles 6 de enero del año siguiente. */
export const REYES = '2027-01-06'

export interface DestinoRubro {
  href: string
  /** «las notebooks»: va dentro de «Ver las notebooks de hoy» */
  nombre: string
}

/** Landing BF (/mejores/<slug>) → página del rubro que sigue viva todo el año. Solo rutas que existen. */
export const CATEGORIA_POR_LANDING_BF: Record<string, DestinoRubro> = {
  'black-friday-notebooks': { href: '/categoria/notebooks', nombre: 'las notebooks' },
  'black-friday-celulares': { href: '/categoria/celulares', nombre: 'los celulares' },
  'black-friday-celulares-baratos': { href: '/categoria/celulares', nombre: 'los celulares' },
  'black-friday-smart-tv': { href: '/categoria/smart-tv', nombre: 'los smart TV' },
  'black-friday-aires-acondicionados': { href: '/categoria/aire-acondicionado', nombre: 'los aires acondicionados' },
  'black-friday-lavarropas': { href: '/categoria/lavarropas', nombre: 'los lavarropas' },
  'black-friday-heladeras': { href: '/categoria/heladeras', nombre: 'las heladeras' },
  'black-friday-cafeteras': { href: '/categoria/electro-de-cocina', nombre: 'el electro de cocina' },
  'black-friday-freidoras-de-aire': { href: '/categoria/freidoras-de-aire', nombre: 'las freidoras de aire' },
  'black-friday-bicicletas': { href: '/categoria/bicicletas', nombre: 'las bicicletas' },
  'black-friday-colchones': { href: '/categoria/colchones', nombre: 'los colchones' },
  'black-friday-gaming': { href: '/categoria/gamer', nombre: 'lo gamer' },
  'black-friday-herramientas': { href: '/herramientas', nombre: 'las herramientas' },
  'black-friday-juguetes': { href: '/bebes-y-jugueteria', nombre: 'los juguetes' },
  'black-friday-auriculares': { href: '/tecno', nombre: 'la tecnología' },
  'black-friday-tablets': { href: '/tecno', nombre: 'la tecnología' },
  'black-friday-smartwatch': { href: '/tecno', nombre: 'la tecnología' },
}

/** Categoría equivalente de una landing BF; sin landing (o desconocida), undefined. */
export function categoriaEquivalente(landing?: string): DestinoRubro | undefined {
  return landing ? CATEGORIA_POR_LANDING_BF[landing] : undefined
}

const ms = (fecha: string, hora = '00:00:00') => new Date(`${fecha}T${hora}-03:00`).getTime()

/** ¿Se muestra el link «Regalos de Navidad» en home, /mejores, /black-friday y guías?
 *  Desde el día del Black Friday hasta Reyes inclusive (hora argentina). */
export function enlaceNavidadVigente(ahora = new Date()): boolean {
  const t = ahora.getTime()
  return t >= ms(BLACK_FRIDAY.fecha) && t <= ms(REYES, '23:59:59.999')
}

/** ¿Ya terminó el Black Friday? (atajo de modoBF para quien solo necesita sí/no). */
export function terminoBF(ahora = new Date()): boolean {
  return modoBF(ahora) === 'termino'
}

/** Guías (/guias/<slug>) de rubros que se regalan caros: llevan el link a /regalos-navidad. */
const GUIA_REGALABLE = /notebook|laptop|macbook|celular|iphone|samsung-galaxy|smart-tv|televisor|(^|-)tv(-|$)|regalo|navidad|juguete|consola|playstation|nintendo|gamer|tablet|ipad|auricular|smartwatch/

export function guiaLlevaNavidad(slug: string): boolean {
  return GUIA_REGALABLE.test(slug)
}

/** Meta description de una página BF ya terminado. Las escritas para la previa («Black Friday y Cyber
 *  Monday 2026 en Argentina: …», «Black Friday 2026: 27/11.») no se pueden pasar a pasado frase por
 *  frase, así que en 'termino' se reemplazan por una armada con el rubro (≤ 158). Antes, sin cambios. */
export function descripcionConNavidad(descripcion: string, modo: ModoBF, rubro?: string): string {
  if (modo !== 'termino') return descripcion
  // «Smart TV» → «smart TV» (solo la primera letra: las siglas quedan como están).
  const que = rubro ? `${rubro.charAt(0).toLowerCase()}${rubro.slice(1)} que siguen` : 'ofertas de Mercado Libre que siguen'
  const d = `Ya pasó el Black Friday 2026 (fue el 27/11): ${que} con buen precio, con link a la publicación, y regalos de Navidad por presupuesto.`
  return d.length <= 158 ? d : `Ya pasó el Black Friday 2026 (fue el viernes 27/11): ofertas que siguen con buen precio y regalos de Navidad por presupuesto.`
}

/** Preguntas sobre envíos para Navidad. Nunca una fecha de Mercado Libre que no esté verificada:
 *  la fecha de entrega la da cada publicación según el vendedor y el código postal. */
export const FAQ_ENVIO_NAVIDAD: { q: string; a: string }[] = [
  {
    q: '¿Hasta cuándo puedo comprar para que el regalo llegue antes del 24/12?',
    a: 'No hay una fecha única: depende del vendedor, de dónde sale el producto y de tu código postal. Revisá la fecha de entrega en la publicación antes de pagar (cambia según tu código postal) y elegí una que llegue antes del 24/12 con algunos días de margen, porque en diciembre los envíos se cargan. Si la fecha que ves es muy justa, buscá otra publicación del mismo modelo con entrega antes.',
  },
  {
    q: '¿Y con notebooks, celulares y TV, conviene comprar antes?',
    a: 'Sí: son los regalos que más cuesta reponer si llegan tarde. Comprá con tiempo, revisá la fecha de entrega en la publicación y fijate si el vendedor es tienda oficial y qué garantía ofrece. Un TV grande puede tener un envío distinto al de un paquete chico: la publicación te dice cómo llega.',
  },
  {
    q: '¿Qué pasa si el regalo no le gusta o llega con un problema?',
    a: 'Las condiciones de devolución y garantía las indica cada publicación: leelas antes de comprar, sobre todo si comprás con anticipación. Guardá la caja y el comprobante hasta después de las fiestas.',
  },
]
