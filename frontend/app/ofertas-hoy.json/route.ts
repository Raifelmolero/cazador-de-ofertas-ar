// /ofertas-hoy.json: todas las ofertas de la home, livianas. La grilla las
// baja después de pintar (ver lib/ofertashoy.ts). Estático, se arma en el build.
import { ofertasHoyLight } from '@/lib/ofertashoy'

export const dynamic = 'force-static'

export function GET() {
  return new Response(JSON.stringify(ofertasHoyLight()), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=3600',
    },
  })
}
