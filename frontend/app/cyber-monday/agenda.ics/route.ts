// Recordatorios del Cyber Monday para el calendario del celular (.ics).
// Sin cuentas ni servidores: la persona lo descarga una vez y su propio
// calendario le avisa la noche anterior, al arrancar y el último día. Las
// fechas salen de lib/cybermonday.ts, así que si cambian acá se acompañan solas.
import { CYBER_MONDAY } from '@/lib/cybermonday'

export const dynamic = 'force-static'

const URL_CYBER = 'https://cazadordeofertas.com.ar/cyber-monday?utm_source=agenda&utm_medium=calendario&utm_campaign=cyber'

/** 'YYYY-MM-DD' + hora argentina (UTC-3, sin horario de verano) → 'YYYYMMDDTHHMMSSZ' */
function utc(fecha: string, hora: string, dias = 0) {
  const d = new Date(`${fecha}T${hora}-03:00`)
  d.setUTCDate(d.getUTCDate() + dias)
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

/** RFC 5545: las comas, punto y coma y saltos de línea se escapan. */
const esc = (t: string) => t.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')

export function GET() {
  const { inicio, fin, año } = CYBER_MONDAY
  const ahora = utc(new Date().toISOString().slice(0, 10), '00:00:00')
  const eventos = [
    {
      uid: `vispera-${año}`,
      desde: utc(inicio, '20:00:00', -1),
      hasta: utc(inicio, '20:30:00', -1),
      titulo: `Mañana arranca el Cyber Monday ${año}`,
      detalle: `Anotá el precio de hoy de lo que querés comprar: es la única forma de saber si la baja es real. Mirá cuáles bajaron de verdad contra su historial: ${URL_CYBER}`,
    },
    {
      uid: `arranca-${año}`,
      desde: utc(inicio, '09:00:00'),
      hasta: utc(inicio, '09:30:00'),
      titulo: 'Arrancó el Cyber Monday: mirá cuáles bajaron de verdad',
      detalle: `Ofertas de Mercado Libre comparadas contra su precio más bajo registrado: ${URL_CYBER}`,
    },
    {
      uid: `ultimo-${año}`,
      desde: utc(fin, '10:00:00'),
      hasta: utc(fin, '10:30:00'),
      titulo: 'Último día del Cyber Monday: mínimos históricos',
      detalle: `Hoy termina. Los productos en su mínimo histórico registrado, en un solo lugar: ${URL_CYBER}`,
    },
  ]
  const lineas = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Cazador de Ofertas AR//Cyber Monday//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Cyber Monday (Cazador de Ofertas AR)',
    ...eventos.flatMap(e => [
      'BEGIN:VEVENT',
      `UID:${e.uid}@cazadordeofertas.com.ar`,
      `DTSTAMP:${ahora}`,
      `DTSTART:${e.desde}`,
      `DTEND:${e.hasta}`,
      `SUMMARY:${esc(e.titulo)}`,
      `DESCRIPTION:${esc(e.detalle)}`,
      `URL:${URL_CYBER}`,
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${esc(e.titulo)}`,
      'TRIGGER:PT0S',
      'END:VALARM',
      'END:VEVENT',
    ]),
    'END:VCALENDAR',
  ]
  return new Response(lineas.join('\r\n') + '\r\n', {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="cyber-monday-${año}.ics"`,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
