// Recordatorios del Black Friday para el calendario del celular (.ics).
// La fecha sale de lib/cybermonday.ts (BLACK_FRIDAY).
import { diaAnterior, respuestaIcs } from '@/lib/agenda'
import { BLACK_FRIDAY } from '@/lib/cybermonday'

export const dynamic = 'force-static'

export function GET() {
  const { fecha, año } = BLACK_FRIDAY
  return respuestaIcs({
    nombre: 'Black Friday (Cazador de Ofertas AR)',
    archivo: `black-friday-${año}.ics`,
    url: 'https://cazadordeofertas.com.ar/black-friday?utm_source=agenda&utm_medium=calendario&utm_campaign=blackfriday',
    avisos: [
      {
        uid: `bf-vispera-${año}`,
        fecha: diaAnterior(fecha),
        hora: '20:00',
        titulo: `Mañana es el Black Friday ${año}`,
        detalle: 'Anotá el precio de hoy de lo que querés comprar para saber si la baja es real. Ofertas contra su historial de precios:',
      },
      {
        uid: `bf-dia-${año}`,
        fecha,
        hora: '09:00',
        titulo: 'Hoy es el Black Friday: mirá cuáles bajaron de verdad',
        detalle: 'Ofertas de Mercado Libre comparadas contra su precio más bajo registrado:',
      },
    ],
  })
}
