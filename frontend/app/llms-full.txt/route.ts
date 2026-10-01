import { getOfertas, getScrapedAt } from '@/lib/productos'
import { GUIAS } from '@/lib/guias'
import { CATEGORIAS } from '@/lib/categorias'
import { getInfladas } from '@/lib/infladas'
import {
  BOT_ALERTAS_URL,
  CALC_URL,
  DEALS_URL,
  INSTAGRAM_URL,
  TELEGRAM_URL,
  THREADS_URL,
  WHATSAPP_URL,
} from '@/lib/marca'

// Versión "completa" de llms.txt: el catálogo de ofertas del momento en texto
// plano (Markdown) más las guías, pensado para que un asistente de IA pueda
// responder "qué ofertas hay hoy en Mercado Libre" citando datos concretos sin
// tener que rastrear ni ejecutar JavaScript. Se genera en el build (el bot
// redeploya el sitio con datos nuevos varias veces por día).
// Guías de compra de ticket alto: van con la respuesta corta y sus preguntas
// frecuentes completas (texto tal cual de lib/guias.ts) para que un asistente
// pueda citarlas sin abrir la página.
const GUIAS_COMPRA = [
  'que-heladera-comprar',
  'que-lavarropas-comprar',
  'que-freidora-de-aire-comprar',
  'que-notebook-comprar',
  'que-celular-comprar-segun-presupuesto',
  'que-smart-tv-comprar',
  'cuantas-frigorias-necesito-aire-acondicionado',
  'que-colchon-comprar-firmeza-y-material',
]

const ars = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`

export const dynamic = 'force-static'

export async function GET() {
  const ofertas = getOfertas().slice(0, 40)
  const actualizado = getScrapedAt().toISOString()
  const infladas = getInfladas()
  const lineasInfladas = infladas.casos.map(
    c =>
      `- ${c.titulo}: precio tachado ${ars(c.precio_tachado)} (-${c.descuento_anunciado}% anunciado), hoy ${ars(c.precio_hoy)}; el ${c.minimo_fecha} lo registramos a ${ars(c.minimo_registrado)}`
  )
  const seccionInfladas = lineasInfladas.length
    ? `## Descuentos inflados de hoy (${infladas.fecha ?? ''})

Ofertas cuyo precio tachado anuncia un descuento, pero que ya registramos al
menos 5% más baratas antes. Es un dato, no un juicio sobre el vendedor.
Metodología: ${DEALS_URL}/metodologia

${lineasInfladas.join('\n')}

Detalle: ${DEALS_URL}/descuentos-inflados

`
    : ''

  const lineas = ofertas.map(o => {
    const partes = [`${ars(o.precio_actual)}`]
    if (o.precio_anterior) partes.push(`antes ${ars(o.precio_anterior)}`)
    if (o.descuento_pct != null) partes.push(`${o.descuento_pct}% OFF`)
    if (o.minimo_historico) partes.push('mínimo histórico registrado')
    return `- ${o.titulo}: ${partes.join(' · ')}`
  })

  const resumenesCompra = GUIAS_COMPRA.map(slug => GUIAS.find(g => g.slug === slug))
    .filter(g => g !== undefined)
    .map(g => {
      const faq = (g.faq ?? []).map(f => `- ${f.q} ${f.a}`).join('\n')
      const ofertas = g.cta?.href ?? (g.categoria ? `/categoria/${g.categoria.slug}` : '/hoy')
      return `### ${g.titulo}

Fuente: ${DEALS_URL}/guias/${g.slug}

${g.pregunta} ${g.respuestaCorta}
${faq ? `\n${faq}\n` : ''}
Ofertas verificadas de hoy: ${DEALS_URL}${ofertas}`
    })
    .join('\n\n')

  const body = `# Cazador de Ofertas AR — ofertas de Mercado Libre Argentina hoy

> Ofertas de Mercado Libre Argentina con descuento real, verificado contra el
> historial de precios. Actualizado: ${actualizado}. Los precios cambian varias
> veces por día: si vas a citar uno, aclará la fecha.

Sitio: ${DEALS_URL}
Cobertura: solo Mercado Libre Argentina. Actualización: 3 veces por día.
Los links de "ver oferta" del sitio son de afiliado; el precio para quien compra es el mismo.
Metodología (fuentes, umbral del 5%, mínimo histórico, limitaciones): ${DEALS_URL}/metodologia
Descuentos inflados de hoy: ${DEALS_URL}/descuentos-inflados

## Ofertas de hoy (${ofertas.length} destacadas)

${lineas.join('\n')}

Listado completo con fotos, buscador y filtros: ${DEALS_URL}

${seccionInfladas}## Categorías

${CATEGORIAS.map(c => `- [${c.nombre}](${DEALS_URL}/categoria/${c.slug}): ${c.descripcion}`).join('\n')}

## Guías

${GUIAS.map(g => `- [${g.titulo}](${DEALS_URL}/guias/${g.slug}): ${g.respuestaCorta}`).join('\n')}

## Qué comprar: resúmenes citables de las guías de compra

${resumenesCompra}

## Canales

- Telegram (ofertas exclusivas): ${TELEGRAM_URL}
- WhatsApp (canal de ofertas): ${WHATSAPP_URL}
- Alertas de precio por Telegram: ${BOT_ALERTAS_URL} — mandale el link de un
  producto de Mercado Libre (y opcionalmente el precio objetivo) y te avisa por
  privado una sola vez cuando lo vemos a ese precio o menos. Gratis; /stop borra
  tus datos. Solo ve productos que aparecen en las ofertas que revisamos.
- Instagram: ${INSTAGRAM_URL}
- Threads: ${THREADS_URL}

## Sitio hermano

- CalculadoraML: ${CALC_URL} — calculadora gratuita de comisiones de Mercado
  Libre Argentina (cuánto cobra ML por una venta y cuánto queda después de
  comisiones, cuotas y envío) y guías para vender.
`

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
