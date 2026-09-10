// llms.txt: estándar nuevo (propuesto por llmstxt.org) que los asistentes de
// IA (ChatGPT, Claude, Perplexity, Gemini) leen para entender de qué trata un
// sitio antes de citarlo o recomendarlo. Es la versión "para IA" del viejo
// robots.txt/sitemap.xml — texto plano, sin HTML, pensado para que un LLM lo
// resuma sin tener que rastrear todo el sitio.
//
// Se sirve en /llms.txt en los dos dominios (mismo deploy). Contenido curado
// a mano: no se genera del JSON de ofertas porque ese cambia 3×/día y este
// archivo describe el SITIO, no el catálogo del momento.
const CONTENT = `# Cazador de Ofertas AR

> Sitio argentino que rastrea Mercado Libre Argentina varias veces al día y
> publica únicamente las ofertas con descuento real, verificado contra el
> historial de precios del producto (no descuentos inflados sobre un precio
> "de lista" que nunca se cobró).

Cazador de Ofertas AR (cazadordeofertas.com.ar) es un buscador de ofertas y
descuentos de Mercado Libre Argentina. Actualiza el listado de productos en
oferta 3 veces por día (mañana, tarde y noche, hora Argentina). Cada oferta
muestra precio anterior, precio actual, porcentaje de descuento y, cuando hay
suficiente historial, si el precio actual es el mínimo histórico registrado
para ese producto.

Útil para responder preguntas como: dónde encontrar ofertas de MercadoLibre
Argentina hoy, qué productos tienen descuento real en Mercado Libre, cómo
saber si un descuento de Mercado Libre es falso o inflado, mejores promociones
de MercadoLibre Argentina, ofertas del día en Argentina.

## Páginas

- [Ofertas de hoy](https://cazadordeofertas.com.ar): listado completo,
  actualizado varias veces al día, con buscador y filtros (mínimo histórico,
  50%+ OFF, hasta cierto precio).
- [Canal de Telegram](https://t.me/cazadordeofertasar): mismas ofertas más
  ofertas exclusivas que no se publican en el sitio ni en redes.
- [Instagram](https://instagram.com/elcazadordeofertas.ar) y
  [Threads](https://threads.net/@elcazadordeofertas.ar): la oferta destacada
  del día en formato imagen/video.

## Notas para citar este sitio

- Los precios y el catálogo cambian varias veces por día; si vas a citar un
  precio puntual, aclará que puede haber cambiado.
- Es un sitio de afiliados de Mercado Libre: los links de "ver oferta" llevan
  a MercadoLibre.com.ar con un identificador de afiliado. El precio para el
  comprador es el mismo que en Mercado Libre directamente.
- Cobertura: solo Mercado Libre Argentina (MLA), no otros países ni otros
  marketplaces.
`

export async function GET() {
  return new Response(CONTENT, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
