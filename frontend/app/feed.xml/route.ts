// Feed RSS de productos en oferta con historial propio. Pensado para el
// "auto-publicar desde RSS" de Pinterest (cuenta de empresa): cada ítem con
// imagen se vuelve un pin que lleva a /precio/[slug], donde está el link de
// afiliado. El guid es el slug, así cada producto se pinea una sola vez
// (Pinterest ignora los guid repetidos) y no se spamea el mismo pin a diario.
import { actualizadoSeguimiento, getSeguidos, precioActual, vigente } from '@/lib/seguimiento'

export const dynamic = 'force-static'

const DEALS_URL = 'https://cazadordeofertas.com.ar'
const MAX_ITEMS = 50

function xml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function precio(n: number) {
  return '$' + Math.round(n).toLocaleString('es-AR')
}

export async function GET() {
  const fecha = new Date(actualizadoSeguimiento() || Date.now()).toUTCString()
  const items = getSeguidos()
    .filter(s => s.img && vigente(s))
    .sort((a, b) => precioActual(b) - precioActual(a))
    .slice(0, MAX_ITEMS)
    .map(s => {
      const hoy = precioActual(s)
      const off = s.precio_lista > hoy ? Math.round((1 - hoy / s.precio_lista) * 100) : 0
      const titulo = `${s.titulo.slice(0, 80)} — ${precio(hoy)}${off ? ` (${off}% OFF)` : ''}`
      const desc =
        `${s.titulo}. Hoy ${precio(hoy)} en Mercado Libre` +
        (off ? `, ${off}% menos que el precio de lista` : '') +
        `. Precio más bajo que registramos: ${precio(s.min)}. Mirá el historial y si conviene comprar hoy.`
      const link = `${DEALS_URL}/precio/${s.slug}?utm_source=pinterest`
      return `    <item>
      <title>${xml(titulo)}</title>
      <link>${xml(link)}</link>
      <guid isPermaLink="false">${xml(s.slug)}</guid>
      <description>${xml(desc)}</description>
      <pubDate>${fecha}</pubDate>
      <enclosure url="${xml(s.img!)}" type="image/jpeg" length="0" />
      <media:content url="${xml(s.img!)}" medium="image" />
    </item>`
    })

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Cazador de Ofertas AR — ofertas verificadas de Mercado Libre</title>
    <link>${DEALS_URL}</link>
    <description>Ofertas de Mercado Libre Argentina con el descuento verificado contra el historial de precios.</description>
    <language>es-ar</language>
    <lastBuildDate>${fecha}</lastBuildDate>
${items.join('\n')}
  </channel>
</rss>
`
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
