// Fechas del Cyber Monday: UN solo lugar para la landing /cyber-monday.
//
// 2026 — OFICIALES (verificadas el 2026-09-27): lunes 2 al miércoles 4 de
// noviembre. Fuentes: home de cybermonday.com.ar, el sitio oficial ("Una
// iniciativa de CACE": "CyberMonday 2, 3 y 4 de Noviembre de 2026"), y Ámbito
// (24/09/2026) citando a la CACE. Ojo: el cuerpo de
// cybermonday.com.ar/cuando-es-cybermonday todavía dice "3, 4 y 5 de Noviembre"
// (texto que quedó de 2025, cuando el lunes fue el 3), pero el encabezado de esa
// misma página y la home dicen 2-4, y el 2/11/2026 es lunes.
//
// Para el año que viene: cambiar las fechas acá, poner `oficial: false` hasta
// que la CACE las anuncie (la página muestra "a confirmar" y saca el JSON-LD de
// Event) y actualizar `verificado`. Los textos de lib/comparativas.ts,
// lib/guias.ts tienen las fechas escritas a mano.

export interface EventoComercial {
  año: number
  /** YYYY-MM-DD, hora argentina */
  inicio: string
  fin: string
  /** true solo si la CACE las anunció; si no, la página dice "a confirmar" */
  oficial: boolean
  /** "del lunes 2 al miércoles 4 de noviembre" */
  fechasTexto: string
  fuente: { nombre: string; url: string }
  /** YYYY-MM-DD en que se chequearon las fechas contra la fuente */
  verificado: string
}

export const CYBER_MONDAY: EventoComercial = {
  año: 2026,
  inicio: '2026-11-02',
  fin: '2026-11-04',
  oficial: true,
  fechasTexto: 'del lunes 2 al miércoles 4 de noviembre',
  fuente: { nombre: 'cybermonday.com.ar (sitio oficial de la CACE)', url: 'https://www.cybermonday.com.ar/' },
  verificado: '2026-09-27',
}

/** El Black Friday en Argentina no tiene organizador: es el viernes siguiente
 *  al Día de Acción de Gracias de EE.UU. (27/11/2026). */
export const BLACK_FRIDAY = {
  año: 2026,
  fecha: '2026-11-27',
  fechasTexto: 'viernes 27 de noviembre',
  /** Día de Acción de Gracias de EE.UU. 2026: jueves 26/11 (feriado federal, OPM). */
  fuente: { nombre: 'OPM (feriados federales de EE.UU. 2026: Thanksgiving, jueves 26 de noviembre)', url: 'https://www.opm.gov/policy-data-oversight/pay-leave/federal-holidays/#url=2026' },
  verificado: '2026-09-27',
  /** Último día que el sitio trata como Black Friday (muchas tiendas lo estiran el fin de semana). */
  ultimoDia: '2026-11-29',
}

/** Etapa del Black Friday (un solo día, hora argentina). */
export function etapaBlackFriday(ahora = new Date()) {
  return etapaCyber(ahora, { ...CYBER_MONDAY, inicio: BLACK_FRIDAY.fecha, fin: BLACK_FRIDAY.fecha })
}

const ms = (fecha: string, hora = '00:00:00') => new Date(`${fecha}T${hora}-03:00`).getTime()

/** En qué momento del evento estamos (el sitio se rebuildea 3×/día). */
export function etapaCyber(ahora = new Date(), e = CYBER_MONDAY): { etapa: 'antes' | 'durante' | 'despues'; dias: number } {
  const t = ahora.getTime()
  if (t < ms(e.inicio)) return { etapa: 'antes', dias: Math.ceil((ms(e.inicio) - t) / 86_400_000) }
  if (t <= ms(e.fin, '23:59:59')) return { etapa: 'durante', dias: 0 }
  return { etapa: 'despues', dias: 0 }
}

/** Pasado el Cyber Monday (4/11), los textos visibles de sus páginas hablan del Black Friday.
 *  Las direcciones (/cyber-monday/…) no cambian: ya están en Google. */
export function aBlackFridayTrasCyber(texto: string, ahora = new Date()): string {
  if (etapaCyber(ahora).etapa !== 'despues') return texto
  return texto
    .replace(CYBER_MONDAY.fechasTexto, BLACK_FRIDAY.fechasTexto)
    // Fechas escritas a mano en las guías: no pueden quedar pegadas al Black Friday.
    .replace(/Cyber Monday \(2 al 4 de noviembre de 2026\)/g, `Black Friday (${BLACK_FRIDAY.fechasTexto})`)
    .replace(/\bel lunes 2\b/g, 'el viernes 27')
    .replace(/Cyber Monday/g, 'Black Friday')
    .replace(/cyber monday/g, 'black friday')
    .replace(/CyberMonday/g, 'Black Friday')
    .replace(/(en|del|al|para el) Cyber\b/g, '$1 Black Friday')
    .replace(/Black Friday (y|o|e) (el |la )?Black Friday/g, 'Black Friday')
    .replace(/Black Friday\/Black Friday/g, 'Black Friday')
}

// ── Modo del Black Friday por fecha (pedido del 26/11/2026) ─────────────────
// UNA sola fuente de verdad para title, description, H1, hero y JSON-LD de
// /black-friday, /mejores/black-friday-*, /guias/*black-friday* y las guías
// /guias/*-cyber-monday (que ya hablan del Black Friday). Se evalúa en el render
// (esas páginas tienen ISR de 1 hora): no depende de un deploy el mismo día.
//   previa  → hasta el jueves 26/11 inclusive
//   hoy     → viernes 27/11 (el día)
//   ultimas → sábado 28 y domingo 29/11 (fin de semana estirado)
//   termino → desde el lunes 30/11: la página sigue viva, con link a las ofertas vigentes
// Todo en hora argentina (America/Argentina/Buenos_Aires, UTC-3 sin horario de verano).

export type ModoBF = 'previa' | 'hoy' | 'ultimas' | 'termino'

export function modoBF(ahora = new Date()): ModoBF {
  const t = ahora.getTime()
  if (t < ms(BLACK_FRIDAY.fecha)) return 'previa'
  if (t <= ms(BLACK_FRIDAY.fecha, '23:59:59.999')) return 'hoy'
  if (t <= ms(BLACK_FRIDAY.ultimoDia, '23:59:59.999')) return 'ultimas'
  return 'termino'
}

/** Etiqueta chica arriba del H1 (hero de landings y guías BF). */
export const ETIQUETA_MODO_BF: Record<ModoBF, string> = {
  previa: 'Black Friday 2026 · viernes 27/11',
  hoy: '🔥 Black Friday HOY · viernes 27/11',
  ultimas: '⏳ Black Friday: últimas horas',
  termino: 'Terminó el Black Friday 2026',
}

/** Botón del encabezado de landings y guías BF. */
export const CHIP_MODO_BF: Record<ModoBF, string> = {
  previa: 'Black Friday 27/11',
  hoy: 'Black Friday HOY',
  ultimas: 'Últimas horas BF',
  termino: 'Ofertas de hoy',
}

/** Título del cuadro de destacados de arriba (landings y /black-friday). */
export const DESTACADOS_MODO_BF: Record<ModoBF, string> = {
  previa: 'Los que recomendamos para el Black Friday',
  hoy: 'Black Friday HOY: los que recomendamos',
  ultimas: 'Últimas horas: los que recomendamos',
  termino: 'Siguen hoy: los que recomendamos',
}

type ModoActivo = Exclude<ModoBF, 'previa'>
const FRASE_BF = /\b(?:para el|en el|en) Black Friday(?: 2026)?(?: (?:de|en) Argentina)?/g
const FRASE_MODO: Record<ModoActivo, string> = {
  hoy: 'en el Black Friday de hoy',
  ultimas: 'en las últimas horas del Black Friday',
  termino: 'después del Black Friday 2026',
}
const INICIO_MODO: Record<ModoActivo, string> = {
  hoy: 'Black Friday HOY',
  ultimas: 'Últimas horas del Black Friday',
  termino: 'Ya pasó el Black Friday 2026',
}
const FECHA_MODO: Record<ModoActivo, string> = {
  hoy: '(hoy, viernes 27/11)',
  ultimas: '(fue el viernes 27/11)',
  termino: '(fue el viernes 27/11)',
}

/** Pasa un texto escrito para la previa («… para el Black Friday 2026», «en Black Friday 2026»,
 *  «Black Friday 2026 en Argentina (viernes 27/11): …») al modo del día. En la previa no lo toca. */
export function textoModoBF(texto: string, modo: ModoBF): string {
  if (modo === 'previa') return texto
  return texto
    // «El Black Friday 2026 (en Argentina) es el viernes 27 de noviembre»: respuestas cortas de las guías BF e intros.
    .replace(/\bEl Black Friday 2026( en Argentina)? es el viernes 27 de noviembre/g, (_, ar = '') =>
      modo === 'hoy' ? `El Black Friday 2026${ar} es hoy, viernes 27 de noviembre` : `El Black Friday 2026${ar} fue el viernes 27 de noviembre`)
    .replace(/^Black Friday 2026\b/, INICIO_MODO[modo])
    .replace(FRASE_BF, FRASE_MODO[modo])
    .replace(/\(viernes 27\/11\)/g, FECHA_MODO[modo])
}

/** <title> en el modo del día sin pasarse de `max`: si no entra ni sacando «Argentina», queda el
 *  original (que nunca dice que el evento no empezó). */
export function tituloModoBF(titulo: string, modo: ModoBF, max = 65): string {
  if (modo === 'previa') return titulo
  const t = textoModoBF(titulo, modo)
  if (t.length <= max) return t
  const corto = t.replace(/\s*\(Argentina\)$/, '').replace(/ en Argentina\b/, '')
  if (corto.length <= max) return corto
  // «Qué notebook comprar después del Black Friday 2026: RAM, SSD y CPU» no entra: se corta la bajada
  // después de los dos puntos antes que dejar el título de la previa («… en el Black Friday»).
  const sinBajada = corto.split(': ')[0]
  return sinBajada !== corto && sinBajada.length <= max && sinBajada.includes('Black Friday') ? sinBajada : titulo
}

/** <title> de una landing /mejores/black-friday-* en el modo del día, armado desde su H1. */
export function tituloLandingModoBF(h1: string, titulo: string, modo: ModoBF, max = 65): string {
  if (modo === 'previa') return titulo
  const h = textoModoBF(h1, modo)
  for (const c of [`${h} (Argentina)`, h]) if (c.length <= max) return c
  return tituloModoBF(titulo, modo, max)
}

/** La frase de fechas que comparten las guías «…-cyber-monday» («El Cyber Monday 2026 de la CACE
 *  fue…; los próximos eventos son el Black Friday (viernes 27/11) y…»), según el modo. Sin la
 *  palabra «Cyber»: aBlackFridayTrasCyber la convertiría. */
const FRASE_EVENTOS =
  /El Cyber Monday 2026 de la CACE fue del 2 al 4 de noviembre; los próximos eventos son el Black Friday \(viernes 27\/11\) y el Cyber Monday del lunes 30\/11\./g
const EVENTOS_MODO: Record<ModoBF, string> = {
  previa: 'El próximo evento es el Black Friday, el viernes 27 de noviembre.',
  hoy: 'El Black Friday es hoy, viernes 27 de noviembre.',
  ultimas: 'El Black Friday fue el viernes 27/11 y muchas tiendas lo estiran el fin de semana.',
  termino: 'El Black Friday 2026 fue el viernes 27/11; las ofertas siguen todos los días.',
}
export function eventosModoBF(texto: string, modo: ModoBF): string {
  return texto.replace(FRASE_EVENTOS, EVENTOS_MODO[modo])
}

/** Textos de /black-friday por modo (title ≤ 65, description ≤ 158). */
export const PAGINA_BF: Record<ModoBF, { titulo: string; descripcion: string; kicker: string; h1: string }> = {
  previa: {
    titulo: 'Black Friday y Cyber Monday 2026 Argentina: ofertas reales',
    descripcion:
      'Black Friday 27/11 y Cyber Monday 2026: las mejores ofertas de Mercado Libre, verificadas contra el historial de precios. Sin descuentos inflados.',
    kicker: 'Black Friday 2026 en Argentina',
    h1: 'Black Friday: viernes 27 de noviembre',
  },
  hoy: {
    titulo: 'Black Friday HOY (27/11): ofertas de Mercado Libre elegidas',
    descripcion:
      'Black Friday HOY, viernes 27/11: ofertas de Mercado Libre elegidas y verificadas contra el historial de precios, con link directo a la publicación.',
    kicker: '🔥 Black Friday HOY · viernes 27/11',
    h1: 'Black Friday HOY: lo que conviene comprar',
  },
  ultimas: {
    titulo: 'Black Friday 2026, últimas horas: ofertas que siguen hoy',
    descripcion:
      'Últimas horas del Black Friday 2026: ofertas de Mercado Libre que siguen hoy, verificadas contra el historial de precios, con link directo a la publicación.',
    kicker: '⏳ Black Friday: últimas horas',
    h1: 'Últimas horas del Black Friday: lo que sigue conviniendo',
  },
  // Después del BF (pedido del 27/11): la página empuja a Navidad sin cambiar la URL.
  termino: {
    titulo: 'Terminó el Black Friday 2026: ofertas y regalos de Navidad',
    descripcion:
      'El Black Friday 2026 terminó (fue el viernes 27/11). Ofertas de Mercado Libre que siguen con buen precio hoy y regalos de Navidad por presupuesto.',
    kicker: 'Terminó el Black Friday 2026',
    h1: 'Terminó el Black Friday 2026: estas siguen con buen precio',
  },
}
