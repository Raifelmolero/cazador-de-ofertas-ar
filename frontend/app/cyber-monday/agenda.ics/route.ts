// Recordatorios del Cyber Monday para el calendario del celular (.ics).
// Las fechas salen de lib/cybermonday.ts: si cambian ahí, el archivo las sigue.
import { diaAnterior, respuestaIcs } from '@/lib/agenda'
import { CYBER_MONDAY } from '@/lib/cybermonday'

export const dynamic = 'force-static'

export function GET() {
  const { inicio, fin, año } = CYBER_MONDAY
  return respuestaIcs({
    nombre: 'Cyber Monday (Cazador de Ofertas AR)',
    archivo: `cyber-monday-${año}.ics`,
    url: 'https://cazadordeofertas.com.ar/cyber-monday?utm_source=agenda&utm_medium=calendario&utm_campaign=cyber',
    avisos: [
      {
        uid: `vispera-${año}`,
        fecha: diaAnterior(inicio),
        hora: '20:00',
        titulo: `Mañana arranca el Cyber Monday ${año}`,
        detalle: 'Anotá el precio de hoy de lo que querés comprar: es la única forma de saber si la baja es real. Mirá cuáles bajaron de verdad contra su historial:',
      },
      {
        uid: `arranca-${año}`,
        fecha: inicio,
        hora: '09:00',
        titulo: 'Arrancó el Cyber Monday: mirá cuáles bajaron de verdad',
        detalle: 'Ofertas de Mercado Libre comparadas contra su precio más bajo registrado:',
      },
      {
        uid: `ultimo-${año}`,
        fecha: fin,
        hora: '10:00',
        titulo: 'Último día del Cyber Monday: mínimos históricos',
        detalle: 'Hoy termina. Los productos en su mínimo histórico registrado, en un solo lugar:',
      },
    ],
  })
}
