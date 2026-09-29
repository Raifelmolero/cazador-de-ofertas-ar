// CSV del estudio mes a mes (distribución del Dataset de /datos).
import { getEstudio } from '@/lib/estudio'

export const dynamic = 'force-static'

export function GET() {
  const e = getEstudio()
  const filas = [
    'mes,pasadas,ofertas_revisadas,descuentos_inflados,pct_inflados',
    ...e.porMes.map(m => `${m.mes},${m.pasadas},${m.revisadas},${m.infladas},${m.pct}`),
    `total,${e.pasadas},${e.revisadas},${e.infladas},${e.pctInfladas}`,
  ]
  return new Response(filas.join('\n') + '\n', {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'inline; filename="descuentos-inflados-mercado-libre.csv"',
    },
  })
}
