// Banner de temporada: UNA sola fuente de verdad de qué fecha comercial se
// promociona según el día (hora argentina). Las fechas de Cyber Monday y Black
// Friday salen de lib/cybermonday.ts; cambiar allá y esto acompaña.
// Se evalúa en el render del servidor: el sitio se rebuildea 3×/día con cada
// corrida del bot, así que el banner cambia solo en el primer build del día.
import { BLACK_FRIDAY, CYBER_MONDAY } from './cybermonday'

export interface Temporada {
  id: 'madre' | 'cyber' | 'blackfriday' | 'navidad'
  href: string
  titulo: string
  bajada: string
  /** clases Tailwind (literales, para que el JIT las vea) */
  caja: string
  texto: string
  /** YYYY-MM-DD inclusive, hora argentina; desde null = sin inicio */
  desde: string | null
  hasta: string
}

const diaSiguiente = (f: string) => {
  const d = new Date(`${f}T12:00:00-03:00`)
  d.setUTCDate(d.getUTCDate() + 1)
  return d.toISOString().slice(0, 10)
}

export const TEMPORADAS: Temporada[] = [
  {
    id: 'madre',
    href: '/dia-de-la-madre',
    titulo: '🎁 Día de la Madre: domingo 18 de octubre',
    bajada: 'Regalos en oferta con el descuento verificado → ver los regalos',
    caja: 'border-pink-400/30 bg-pink-500/10 hover:border-pink-400/60',
    texto: 'text-pink-200',
    desde: null,
    hasta: '2026-10-18',
  },
  {
    id: 'cyber',
    href: '/cyber-monday',
    titulo: `💻 Cyber Monday: ${CYBER_MONDAY.oficial ? CYBER_MONDAY.fechasTexto : 'fechas a confirmar'}`,
    bajada: 'Cada oferta contra su precio más bajo registrado → ver cuáles bajaron de verdad',
    caja: 'border-cyan-400/30 bg-cyan-500/10 hover:border-cyan-400/60',
    texto: 'text-cyan-200',
    desde: '2026-10-19',
    hasta: CYBER_MONDAY.fin,
  },
  {
    id: 'blackfriday',
    href: '/black-friday',
    titulo: `🖤 Black Friday: ${BLACK_FRIDAY.fechasTexto}`,
    bajada: 'Ofertas comparadas contra el historial de precios → ver cuáles son reales',
    caja: 'border-yellow-400/30 bg-yellow-400/10 hover:border-yellow-400/60',
    texto: 'text-yellow-200',
    desde: diaSiguiente(CYBER_MONDAY.fin),
    hasta: BLACK_FRIDAY.fecha,
  },
  {
    id: 'navidad',
    href: '/regalos-navidad',
    titulo: '🎄 Regalos de Navidad y Reyes en oferta',
    bajada: 'Por presupuesto y con el descuento verificado → ver los regalos',
    caja: 'border-green-400/30 bg-green-500/10 hover:border-green-400/60',
    texto: 'text-green-200',
    desde: diaSiguiente(BLACK_FRIDAY.fecha),
    hasta: '2027-01-06',
  },
]

const ms = (fecha: string, hora: string) => new Date(`${fecha}T${hora}-03:00`).getTime()

/** Temporada vigente en `ahora`, o null si no hay ninguna. */
export function temporadaActual(ahora = new Date()): Temporada | null {
  const t = ahora.getTime()
  return (
    TEMPORADAS.find(
      (s) => (s.desde === null || t >= ms(s.desde, '00:00:00')) && t <= ms(s.hasta, '23:59:59.999'),
    ) ?? null
  )
}
