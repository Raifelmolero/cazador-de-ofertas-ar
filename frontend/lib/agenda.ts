// Arma el archivo de calendario (.ics) de un evento comercial. Lo usan
// /cyber-monday/agenda.ics y /black-friday/agenda.ics. Sin cuentas ni
// servidores: la persona lo descarga una vez y su calendario le avisa.
// Horas en Argentina (UTC-3, sin horario de verano).

export interface AvisoAgenda {
  /** identificador estable, ej. 'vispera' */
  uid: string
  /** YYYY-MM-DD, hora argentina */
  fecha: string
  /** HH:MM, hora argentina */
  hora: string
  titulo: string
  detalle: string
}

/** 'YYYY-MM-DD' + 'HH:MM' en hora argentina → 'YYYYMMDDTHHMMSSZ' */
function utc(fecha: string, hora: string) {
  return new Date(`${fecha}T${hora}:00-03:00`).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

/** Día anterior de un YYYY-MM-DD. */
export function diaAnterior(fecha: string) {
  const d = new Date(`${fecha}T12:00:00-03:00`)
  d.setUTCDate(d.getUTCDate() - 1)
  return d.toISOString().slice(0, 10)
}

/** RFC 5545: se escapan barra, punto y coma, coma y saltos de línea. */
const esc = (t: string) => t.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')

export function respuestaIcs(opts: { nombre: string; archivo: string; url: string; avisos: AvisoAgenda[] }) {
  const ahora = utc(new Date().toISOString().slice(0, 10), '00:00')
  const lineas = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Cazador de Ofertas AR//Agenda//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${esc(opts.nombre)}`,
    ...opts.avisos.flatMap(a => {
      const fin = new Date(new Date(`${a.fecha}T${a.hora}:00-03:00`).getTime() + 30 * 60_000)
      return [
        'BEGIN:VEVENT',
        `UID:${a.uid}@cazadordeofertas.com.ar`,
        `DTSTAMP:${ahora}`,
        `DTSTART:${utc(a.fecha, a.hora)}`,
        `DTEND:${fin.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
        `SUMMARY:${esc(a.titulo)}`,
        `DESCRIPTION:${esc(`${a.detalle} ${opts.url}`)}`,
        `URL:${opts.url}`,
        'BEGIN:VALARM',
        'ACTION:DISPLAY',
        `DESCRIPTION:${esc(a.titulo)}`,
        'TRIGGER:PT0S',
        'END:VALARM',
        'END:VEVENT',
      ]
    }),
    'END:VCALENDAR',
  ]
  return new Response(lineas.join('\r\n') + '\r\n', {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${opts.archivo}"`,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
