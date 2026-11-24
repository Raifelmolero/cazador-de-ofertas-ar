// Fichas /precio/[slug] de productos que el bot NO sigue solo (update_seguimiento solo suma
// los de ganancia esperada alta) pero que están confirmados para el sitio. Lote ctr-cta del
// 24/11/2026: las 2 herramientas confirmadas (martillo demoledor Lusqtoff y llave de impacto
// Pektra).
//
// Por qué acá y no en data/seguimiento.json: ese archivo lo reescribe el bot 3 veces por día
// en main; editarlo en una rama choca en el merge. Si el bot empieza a seguir uno de estos
// ids, manda su entrada (lib/seguimiento.ts no pisa las del bot).
//
// Cada dato sale del repo, nada inventado:
// - título, link de afiliado y foto: frontend/data/productos_rentables.json (corte 23/11)
// - serie, mínimo y fechas: bot/state/price_history.json (min/min_ts/first_ts/last/last_ts),
//   bot/state/ofertas_manuales.json (precio de carga y fecha `agregada`) y, para el martillo,
//   bot/state/precio_testigo_2026.json (99.999 el 03/10).
// Se dejan de mostrar a los 60 días de `ultimo_visto`, igual que las del bot.
import type { Seguido } from '@/lib/seguimiento'

export interface SeguidoManual extends Seguido {
  /** <title> y comienzo de la meta description (la página le suma el último precio visto de la serie). Sin «mínimo». */
  seoTitulo: string
  seoDescripcion: string
}

export const SEGUIDOS_MANUALES: SeguidoManual[] = [
  {
    id: 'MLA25570995',
    slug: 'martillo-demoledor-900w-8-5-joules-lusqtoff-maletin-color-mla25570995',
    titulo: 'Martillo Demoledor 900w 8,5 Joules Lusqtoff Maletin Color Naranja',
    url: 'https://www.mercadolibre.com.ar/martillo-demoledor-900w-85-joules-lusqtoff-maletin-color-naranja/p/MLA25570995?matt_word=web&matt_tool=37267219',
    img: 'https://http2.mlstatic.com/D_NQ_NP_2X_665272-MLU78713137057_082024-F.webp',
    precio_lista: 181999,
    ultimo_visto: '2026-11-24',
    relampago: false,
    min: 94108,
    min_ts: '2026-11-21',
    desde: '2026-10-03',
    serie: [
      ['2026-10-03', 99999],
      ['2026-11-21', 94108],
      ['2026-11-24', 94108],
    ],
    seoTitulo: 'Martillo demoledor Lusqtoff 900 W 8,5 J: precio hoy',
    seoDescripcion:
      'Martillo demoledor Lusqtoff 900 W, 8,5 J, con maletín: precio de hoy en Mercado Libre e historial.',
  },
  {
    id: 'MLA42782167',
    slug: 'llave-impacto-inalambrica-20v-1-2-pulgadas-pektra-brushless-mla42782167',
    titulo: 'Llave Impacto Inalámbrica 20v 1/2 Pulgadas Pektra Brushless',
    url: 'https://www.mercadolibre.com.ar/llave-impacto-inalambrica-20v-12-pulgadas-pektra-brushless/p/MLA42782167?matt_word=web&matt_tool=37267219',
    img: 'https://http2.mlstatic.com/D_NQ_NP_2X_764441-MLA115250057830_082026-F.webp',
    precio_lista: 139999,
    ultimo_visto: '2026-11-24',
    relampago: false,
    min: 99999,
    min_ts: '2026-11-15',
    desde: '2026-11-15',
    serie: [
      ['2026-11-15', 99999],
      ['2026-11-21', 99999],
      ['2026-11-24', 99999],
    ],
    seoTitulo: 'Llave de impacto Pektra 20 V brushless 1/2": precio hoy',
    seoDescripcion:
      'Llave de impacto inalámbrica Pektra 20 V brushless de 1/2": precio de hoy en Mercado Libre e historial.',
  },
]

/** Días que una ficha sigue viva sin volver a verse (SEGUIMIENTO_MAX_DIAS del bot). */
export const DIAS_VIGENCIA_MANUAL = 60

/** Las manuales que siguen vivas a la fecha `actualizado` ('AAAA-MM-DD') y que el bot no sigue ya. */
export function seguidosManualesVivos(actualizado: string, idsDelBot: Set<string>): Seguido[] {
  const ref = /^\d{4}-\d{2}-\d{2}/.test(actualizado) ? new Date(`${actualizado.slice(0, 10)}T00:00:00Z`) : new Date()
  const limite = new Date(ref.getTime() - DIAS_VIGENCIA_MANUAL * 86_400_000).toISOString().slice(0, 10)
  return SEGUIDOS_MANUALES.filter(s => !idsDelBot.has(s.id) && s.ultimo_visto >= limite).map(s => ({
    id: s.id,
    slug: s.slug,
    titulo: s.titulo,
    url: s.url,
    img: s.img,
    precio_lista: s.precio_lista,
    ultimo_visto: s.ultimo_visto,
    relampago: s.relampago,
    min: s.min,
    min_ts: s.min_ts,
    desde: s.desde,
    serie: s.serie,
  }))
}

export const seoManual = (id: string) => SEGUIDOS_MANUALES.find(s => s.id === id)
