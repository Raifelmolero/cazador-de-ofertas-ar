// /historial.json: el historial compacto que consultan el verificador de la
// home y la extensión. Estático (se arma en el build). Formato por id:
// [mínimo, fecha del mínimo, primera vez visto, último precio, última vez visto, slug de /precio o '']
import { getHistorial } from '@/lib/historial'
import { slugPorId } from '@/lib/seguimiento'

export const dynamic = 'force-static'

export function GET() {
  const slugs = slugPorId()
  const items: Record<string, [number, string, string, number, string, string]> = {}
  for (const [id, h] of Object.entries(getHistorial())) {
    items[id] = [Math.round(h.min), h.min_ts, h.first_ts, Math.round(h.last), h.last_ts, slugs[id] ?? '']
  }
  return new Response(JSON.stringify({ generado: new Date().toISOString(), items }), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'cache-control': 'public, max-age=0, s-maxage=3600',
    },
  })
}
