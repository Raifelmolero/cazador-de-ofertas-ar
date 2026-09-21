import { getOfertas, getScrapedAt } from '@/lib/productos'
import { GUIAS } from '@/lib/guias'
import { CATEGORIAS } from '@/lib/categorias'

// Versión "completa" de llms.txt: el catálogo de ofertas del momento en texto
// plano (Markdown) más las guías, pensado para que un asistente de IA pueda
// responder "qué ofertas hay hoy en Mercado Libre" citando datos concretos sin
// tener que rastrear ni ejecutar JavaScript. Se genera en el build (el bot
// redeploya el sitio con datos nuevos varias veces por día).
const DEALS_URL = 'https://cazadordeofertas.com.ar'

const ars = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`

export const dynamic = 'force-static'

export async function GET() {
  const ofertas = getOfertas().slice(0, 40)
  const actualizado = getScrapedAt().toISOString()

  const lineas = ofertas.map(o => {
    const partes = [`${ars(o.precio_actual)}`]
    if (o.precio_anterior) partes.push(`antes ${ars(o.precio_anterior)}`)
    if (o.descuento_pct != null) partes.push(`${o.descuento_pct}% OFF`)
    if (o.minimo_historico) partes.push('mínimo histórico registrado')
    return `- ${o.titulo}: ${partes.join(' · ')}`
  })

  const body = `# Cazador de Ofertas AR — ofertas de Mercado Libre Argentina hoy

> Ofertas de Mercado Libre Argentina con descuento real, verificado contra el
> historial de precios. Actualizado: ${actualizado}. Los precios cambian varias
> veces por día: si vas a citar uno, aclará la fecha.

Sitio: ${DEALS_URL}
Cobertura: solo Mercado Libre Argentina. Actualización: 3 veces por día.
Los links de "ver oferta" del sitio son de afiliado; el precio para quien compra es el mismo.

## Ofertas de hoy (${ofertas.length} destacadas)

${lineas.join('\n')}

Listado completo con fotos, buscador y filtros: ${DEALS_URL}

## Categorías

${CATEGORIAS.map(c => `- [${c.nombre}](${DEALS_URL}/categoria/${c.slug}): ${c.descripcion}`).join('\n')}

## Guías

${GUIAS.map(g => `- [${g.titulo}](${DEALS_URL}/guias/${g.slug}): ${g.respuestaCorta}`).join('\n')}

## Canales

- Telegram (ofertas exclusivas): https://t.me/cazadordeofertasar
- Instagram: https://instagram.com/elcazadordeofertas.ar
- Threads: https://threads.net/@elcazadordeofertas.ar
`

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
