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
