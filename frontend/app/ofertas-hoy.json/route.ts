// /ofertas-hoy.json: todas las ofertas de la home, livianas. La grilla las
// baja después de pintar (ver lib/ofertashoy.ts). Estático, se arma en el build.
import { ofertasHoyLight } from '@/lib/ofertashoy'
import { conEtiqueta, ETIQUETA_JSON } from '@/lib/afiliado'

export const dynamic = 'force-static'

export function GET() {
  // Etiqueta propia (lib/afiliado): separa en el panel los links copiados de
  // este JSON. Los clics en la grilla del sitio igual salen como `sitio`.
  const ofertas = ofertasHoyLight().map(o => ({ ...o, url_producto: conEtiqueta(o.url_producto, ETIQUETA_JSON) }))
  return new Response(JSON.stringify(ofertas), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=3600',
    },
  })
}
