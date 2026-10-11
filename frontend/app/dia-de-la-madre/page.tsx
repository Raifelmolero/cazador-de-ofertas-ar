// Landing del Día de la Madre (Argentina: tercer domingo de octubre; en 2026,
// domingo 18/10). Regalos en oferta HOY por rango de precio, cuenta regresiva,
// cómo detectar descuentos inflados y links a comparativa, guía y categorías.
//
// Nada inventado: los productos salen de la comparativa
// /mejores/regalos-dia-de-la-madre (keywords regalables) más las categorías
// perfumes y electro de cocina, y de las comparativas por rubro (desde $30.000); los rangos se
// calculan sobre esos precios y el % de infladas sale del registro del bot.
// Sin JSON-LD de Event: el Día de la Madre no es un evento con organizador.
import Link from 'next/link'
import type { Metadata } from 'next'
import { tituloSeo, descripcionSeo } from '@/lib/seo'
import Footer from '@/components/Footer'
import LastUpdated from '@/components/LastUpdated'
import ExtensionCTA from '@/components/ExtensionCTA'
import OfertaCard, { type OfertaLight } from '@/components/OfertaCard'
import { getScrapedAt, type ProductWithMargins } from '@/lib/productos'
import { getComparativa, productosDe } from '@/lib/comparativas'
import { getCategoria, ofertasDeCategoria } from '@/lib/categorias'
import { GUIAS } from '@/lib/guias'
import { getEstudio } from '@/lib/estudio'
import { getInfladas } from '@/lib/infladas'
import { slugPorId } from '@/lib/seguimiento'
import { busquedaML } from '@/lib/afiliado'
import { temporadaActual } from '@/lib/temporada'
import CuentaRegresivaMadre from './CuentaRegresivaMadre'

const DEALS_URL = 'https://cazadordeofertas.com.ar'
const URL = `${DEALS_URL}/dia-de-la-madre`
const TELEGRAM_URL = 'https://t.me/cazadordeofertasar'
const WHATSAPP_URL = 'https://whatsapp.com/channel/0029Vb9CICi7DAWspd4ius2Z'
const AÑO = 2026
/** Tercer domingo de octubre de 2026 (el 1/10/2026 es jueves → 4, 11, 18). */
const FECHA = '2026-10-18'
const FECHA_TEXTO = 'domingo 18 de octubre'
const POR_RANGO = 8

const RANGOS = [
  { id: 'mas-de-150000', titulo: 'Más de $150.000', min: 150000, max: Infinity },
  { id: '50000-a-150000', titulo: 'De $50.000 a $150.000', min: 50000, max: 150000 },
  { id: 'hasta-50000', titulo: 'Hasta $50.000', min: 0, max: 50000 },
] as const

const CATEGORIAS_REGALO = [
  { slug: 'perfumes', nombre: 'Perfumes' },
  { slug: 'electro-de-cocina', nombre: 'Electro de cocina' },
  { slug: 'freidoras-de-aire', nombre: 'Freidoras de aire' },
  { slug: 'aspiradoras', nombre: 'Aspiradoras' },
  { slug: 'cocinas-y-hornos', nombre: 'Cocinas y hornos' },
  { slug: 'colchones', nombre: 'Colchones y sommiers' },
]

/** Guías de compra para regalos de ticket alto (lo que más se vendió). */
const GUIAS_REGALO = [
  'que-regalar-el-dia-de-la-madre',
  'que-notebook-comprar',
  'que-celular-comprar-segun-presupuesto',
  'que-smart-tv-comprar',
  'que-lavarropas-comprar',
  'que-lavavajillas-comprar',
  'que-colchon-comprar-firmeza-y-material',
  'que-freidora-de-aire-comprar',
]

/** Regalos de ticket medio/alto por rubro: cada uno sale de su comparativa
 *  (catálogo del día); si hoy no hay ofertas de un rubro, no se muestra. */
const RUBROS_REGALO = [
  { comp: 'mejores-notebooks', titulo: 'Notebooks', emoji: '💻' },
  { comp: 'mejores-celulares', titulo: 'Celulares', emoji: '📱' },
  { comp: 'mejores-smart-tv', titulo: 'Smart TV', emoji: '📺' },
  { comp: 'mejores-lavarropas', titulo: 'Lavarropas', emoji: '🧺' },
  { comp: 'mejores-lavavajillas', titulo: 'Lavavajillas', emoji: '🍽️' },
  { comp: 'mejores-colchones', titulo: 'Colchones', emoji: '🛏️' },
  { comp: 'mejores-perfumes', titulo: 'Perfumes', emoji: '🌸' },
  { comp: 'mejores-cafeteras', titulo: 'Cafeteras', emoji: '☕' },
  { comp: 'mejores-freidoras-de-aire', titulo: 'Freidoras de aire', emoji: '🍟' },
  { comp: 'mejores-batidoras', titulo: 'Batidoras', emoji: '🍰' },
  { comp: 'mejores-aspiradoras', titulo: 'Aspiradoras', emoji: '🧹' },
  { comp: 'mejores-tablets', titulo: 'Tablets', emoji: '📱' },
  { comp: 'mejores-smartwatch', titulo: 'Smartwatch', emoji: '⌚' },
  { comp: 'mejores-planchitas-y-secadores-de-pelo', titulo: 'Planchitas y secadores de pelo', emoji: '💇' },
  { comp: 'mejores-colchones-2-plazas', titulo: 'Colchones 2 plazas y queen', emoji: '🛏️' },
  { comp: 'mejores-sommiers', titulo: 'Sommiers y conjuntos', emoji: '🛏️' },
  { comp: 'mejores-muebles-de-jardin', titulo: 'Muebles de jardín y gazebos', emoji: '🌿' },
] as const
const POR_RUBRO = 4

/** Regalos de comisión alta (belleza, perfumes, cuidado del cabello, electro de
 *  cocina): se muestran arriba de todo. `busqueda` arma el link de afiliado
 *  (matt_word=web) con el helper de lib/afiliado. */
const DESTACADOS = [
  { comp: 'mejores-perfumes', titulo: 'Perfumes', emoji: '🌸', busqueda: 'perfume mujer' },
  { comp: 'mejores-planchitas-y-secadores-de-pelo', titulo: 'Cuidado del cabello', emoji: '💇', busqueda: 'planchita de pelo' },
  { comp: 'mejores-cafeteras', titulo: 'Cafeteras', emoji: '☕', busqueda: 'cafetera' },
  { comp: 'mejores-freidoras-de-aire', titulo: 'Freidoras de aire', emoji: '🍟', busqueda: 'freidora de aire' },
] as const
const POR_DESTACADO = 2

const DIAS_SEMANA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
/** "martes 13": el día que queda `faltan` días antes del Día de la Madre. */
function etiquetaDia(faltan: number): string {
  const d = new Date(`${FECHA}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() - faltan)
  return `${DIAS_SEMANA[d.getUTCDay()]} ${d.getUTCDate()}`
}

/** Etapas de la última semana según los días que faltan. Son recomendaciones
 *  nuestras de margen, NO fechas de corte de Mercado Libre: la fecha real la
 *  muestra cada publicación para el código postal de quien compra. */
const TRAMOS = [
  {
    id: 'margen',
    min: 5,
    max: Infinity,
    titulo: 'Faltan 5 o más días',
    cuando: `hasta el ${etiquetaDia(5)}`,
    texto: `Todavía hay margen. Pedí primero lo grande (smart TV, lavarropas, colchón, notebook) y elegí publicaciones cuya fecha de entrega sea anterior al domingo 18. Recomendación nuestra: que la fecha prometida sea, como mucho, el ${etiquetaDia(3)}, para tener margen si se demora.`,
  },
  {
    id: 'ajustado',
    min: 3,
    max: 4,
    titulo: 'Faltan 3 o 4 días',
    cuando: `${etiquetaDia(4)} y ${etiquetaDia(3)}`,
    texto:
      'Ya hay que ser selectivo: mirá solo publicaciones con fecha de entrega anterior al domingo y dales prioridad a las que tengan envío Full. Si el regalo grande ya roza el domingo, conviene pasar a uno más chico que sí llegue.',
  },
  {
    id: 'ultimo',
    min: 1,
    max: 2,
    titulo: 'Faltan 1 o 2 días',
    cuando: `${etiquetaDia(2)} y ${etiquetaDia(1)}`,
    texto:
      'Último momento: solo cuentan las publicaciones con fecha de entrega anterior al domingo. Si la que querías ya no llega, fijate si ofrece retiro en una sucursal o punto de retiro (compará la fecha con la entrega a domicilio) o elegí algo más chico que sí llegue. Y si no llega, regalalo igual con una tarjeta que diga que ya viene en camino.',
  },
] as const

/** Checklist de regalo por perfil. Los ítems salen de nuestras guías de compra;
 *  los links a comparativas y guías se muestran solo si existen. */
const PERFILES = [
  {
    id: 'cocina',
    emoji: '🍳',
    titulo: 'Le gusta cocinar o tomar café',
    regalos: 'Freidora de aire, cafetera, batidora',
    checks: [
      'Freidora: de 2 a 4 litros para una o dos personas, de 5 o más para una familia.',
      'Cafetera: de filtro si hacen varias tazas, espresso (con vaporizador si toma con leche) o de cápsulas si quiere rapidez.',
      'Garantía oficial en Argentina, y que consiga el café o las cápsulas que usa.',
    ],
    comps: ['mejores-freidoras-de-aire', 'mejores-cafeteras', 'mejores-batidoras'],
    guias: ['que-freidora-de-aire-comprar', 'que-cafetera-comprar'],
  },
  {
    id: 'belleza',
    emoji: '🌸',
    titulo: 'Le gusta arreglarse',
    regalos: 'Perfume, planchita, secador de pelo',
    checks: [
      'Perfume de tienda oficial o de un vendedor con muy buena reputación: evitás réplicas y la devolución es más simple.',
      'Si no sabés qué fragancia usa, fijate en la que tiene en el tocador y buscá la misma marca o línea.',
      'Planchita o secador: garantía oficial en Argentina y vendedor con buena reputación.',
    ],
    comps: ['mejores-perfumes', 'mejores-planchitas-y-secadores-de-pelo'],
    guias: [],
  },
  {
    id: 'movimiento',
    emoji: '⌚',
    titulo: 'Siempre con el celular o sale a caminar',
    regalos: 'Smartwatch, tablet, celular',
    checks: [
      'Smartwatch: confirmá que sea compatible con su celular (el Apple Watch solo funciona con iPhone).',
      'Smartband si le alcanza con pasos, sueño y notificaciones; smartwatch si quiere responder mensajes o usar apps.',
      'Mirá la autonomía real, la resistencia al agua y la garantía en Argentina.',
    ],
    comps: ['mejores-smartwatch', 'mejores-tablets', 'mejores-celulares'],
    guias: ['que-smartwatch-comprar', 'que-celular-comprar-segun-presupuesto', 'que-tablet-comprar'],
  },
  {
    id: 'casa',
    emoji: '🏠',
    titulo: 'Para la casa',
    regalos: 'Aspiradora, lavarropas, colchón',
    checks: [
      'Aspiradora: de arrastre para casa grande o alfombras; vertical inalámbrica o robot para el mantenimiento diario en departamento.',
      'Con mascotas, cepillo antienredos; con alergias, filtro HEPA.',
      'Los regalos grandes (lavarropas, colchón) pedilos primero y chequeá la fecha de entrega con tu código postal.',
    ],
    comps: ['mejores-aspiradoras', 'mejores-lavarropas', 'mejores-colchones'],
    guias: ['que-aspiradora-comprar', 'que-lavarropas-comprar', 'que-colchon-comprar-firmeza-y-material'],
  },
  {
    id: 'grande',
    emoji: '🎁',
    titulo: 'Regalo grande entre hermanos',
    regalos: 'Notebook, smart TV, celular de gama media o alta',
    checks: [
      'Acordá quién compra y quién recibe, para que alguien esté en casa el día de la entrega.',
      'Antes de pagar, compará el precio contra el historial: en ticket alto, un descuento inflado se nota en el bolsillo.',
      'Leé la guía del producto: explica qué mirar según el uso, antes de mirar el precio.',
    ],
    comps: ['mejores-notebooks', 'mejores-smart-tv', 'mejores-celulares'],
    guias: ['que-notebook-comprar', 'que-smart-tv-comprar', 'que-celular-gama-alta-comprar'],
  },
] as const

const TITULO = `Regalos para el Día de la Madre ${AÑO}: ofertas reales por presupuesto`
const DESCRIPCION = `El Día de la Madre ${AÑO} en Argentina es el ${FECHA_TEXTO}. Ideas de regalo en oferta en Mercado Libre por rango de precio (hasta $50.000, de $50.000 a $150.000 y más de $150.000: perfumes, electro de cocina, notebooks, celulares, smart TV, colchones), con el descuento verificado contra el historial.`

export const metadata: Metadata = {
  title: tituloSeo(TITULO, [t => `${t} — Cazador de Ofertas AR`, t => t]),
  description: descripcionSeo(DESCRIPCION),
  keywords: [
    `día de la madre ${AÑO}`,
    `regalos día de la madre ${AÑO}`,
    'qué regalar el día de la madre',
    'cuándo es el día de la madre argentina',
    'regalos día de la madre mercado libre',
    'ofertas día de la madre',
  ],
  metadataBase: new globalThis.URL(DEALS_URL),
  alternates: { canonical: URL },
  openGraph: { title: TITULO, description: DESCRIPCION, url: URL, type: 'website', locale: 'es_AR', siteName: 'Cazador de Ofertas AR' },
}

const fechaAR = (iso: string) => iso.split('-').reverse().join('/')
const pesos = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`

/** Días hasta el Día de la Madre (hora argentina; el sitio se rebuildea 3×/día). */
function diasHasta(ahora = new Date()): number {
  const fin = new Date(`${FECHA}T00:00:00-03:00`).getTime()
  return Math.ceil((fin - ahora.getTime()) / 86_400_000)
}

export default function DiaDeLaMadrePage() {
  const scrapedAt = getScrapedAt().toISOString()
  const estudio = getEstudio()
  const infladas = getInfladas()
  const historial = slugPorId()
  const dias = diasHasta()

  const comp = getComparativa('regalos-dia-de-la-madre')
  // Comparativa de regalos + categorías regalables enteras (perfumes, electro
  // de cocina), sin repetidos.
  const vistos = new Set<string>()
  const regalos: ProductWithMargins[] = [
    ...(comp ? productosDe(comp) : []),
    ...['perfumes', 'electro-de-cocina'].flatMap(s => {
      const c = getCategoria(s)
      return c ? ofertasDeCategoria(c) : []
    }),
  ].filter(p => (vistos.has(p.id_ml) ? false : (vistos.add(p.id_ml), true)))
  const light = (o: ProductWithMargins): OfertaLight => ({
    id_ml: o.id_ml,
    titulo: o.titulo,
    precio_actual: o.precio_actual,
    precio_anterior: o.precio_anterior,
    descuento_pct: o.descuento_pct,
    minimo_historico: o.minimo_historico,
    relampago: o.relampago,
    url_producto: o.url_producto,
    url_imagen: o.url_imagen,
    historial: historial[o.id_ml],
  })
  // Ya vienen ordenados por ganancia esperada (igual que /hoy). Los rangos
  // altos suman los rubros de ticket alto (notebooks, celulares, TV, etc.).
  const deRubros = RUBROS_REGALO.flatMap(r => {
    const c = getComparativa(r.comp)
    return c ? productosDe(c) : []
  })
  // Cosas que se cuelan por categoría pero no son regalo para mamá
  const NO_REGALO = ['bomba', 'presurizadora', 'masculino', 'hombre', 'for men', 'pour homme', 'repuesto', 'industrial', 'compresor', 'amoladora', 'soldadora', 'neumatico', 'neumático', 'microfono', 'micrófono', 'lavalier', 'inflable', 'hidrolavadora', 'pencil', 'rugged', 'militar']
  const esRegalo = (p: ProductWithMargins) => !NO_REGALO.some(w => p.titulo.toLowerCase().includes(w))
  // Mismo título con otro ID (color/variante) = el mismo regalo repetido
  const claveTitulo = (p: ProductWithMargins) => p.titulo.toLowerCase().replace(/\s+/g, ' ').trim()
  const pool = [...regalos, ...deRubros].filter(
    (p, i, a) => esRegalo(p) && a.findIndex(x => x.id_ml === p.id_ml || claveTitulo(x) === claveTitulo(p)) === i,
  )
  // Destacados de comisión alta: arriba de todo; después no se repiten en los rangos.
  const destacados = DESTACADOS.flatMap(d => {
    const c = getComparativa(d.comp)
    if (!c) return []
    const productos = productosDe(c).filter(p => esRegalo(p)).slice(0, POR_DESTACADO)
    return productos.length ? [{ ...d, productos }] : []
  })
  const claveDestacados = new Set(destacados.flatMap(d => d.productos.map(claveTitulo)))
  const idsDestacados = new Set(destacados.flatMap(d => d.productos.map(p => p.id_ml)))
  const rangos = RANGOS.map(r => {
    const todos = pool.filter(
      p => p.precio_actual >= r.min && p.precio_actual < r.max && !idsDestacados.has(p.id_ml) && !claveDestacados.has(claveTitulo(p)),
    )
    return { ...r, total: todos.length, productos: todos.slice(0, POR_RANGO) }
  })
  // Se va completando: un regalo no se repite entre rangos ni entre rubros
  const yaEnRangos = new Set([...claveDestacados, ...rangos.flatMap(r => r.productos.map(claveTitulo))])
  // Por rubro, solo ticket medio/alto (≥ $30.000): lo que más comisión deja.
  const rubros = RUBROS_REGALO.flatMap(r => {
    const c = getComparativa(r.comp)
    if (!c) return []
    const todos = productosDe(c).filter(
      (p, i, a) => p.precio_actual >= 30000 && esRegalo(p) && !yaEnRangos.has(claveTitulo(p)) && a.findIndex(x => claveTitulo(x) === claveTitulo(p)) === i,
    )
    const productos = todos.slice(0, POR_RUBRO)
    productos.forEach(p => yaEnRangos.add(claveTitulo(p)))
    return todos.length ? [{ ...r, slug: c.slug, compTitulo: c.titulo, total: todos.length, productos }] : []
  })
  const mostrados = [...destacados.flatMap(d => d.productos), ...rangos.flatMap(r => r.productos), ...rubros.flatMap(r => r.productos)].filter(
    (p, i, a) => a.findIndex(x => x.id_ml === p.id_ml) === i,
  )

  const guias = GUIAS_REGALO.map(s => GUIAS.find(g => g.slug === s)).filter(g => g !== undefined)
  const tramoActual = TRAMOS.find(t => dias >= t.min && dias <= t.max)
  const perfiles = PERFILES.map(p => ({
    ...p,
    comparativas: p.comps.map(c => getComparativa(c)).filter(c => c !== undefined),
    guiasPerfil: p.guias.map(s => GUIAS.find(g => g.slug === s)).filter(g => g !== undefined),
  }))
  const pct = estudio.pctInfladas.toLocaleString('es-AR')

  const faqs = [
    {
      q: `¿Cuándo es el Día de la Madre ${AÑO} en Argentina?`,
      a: `El ${FECHA_TEXTO} de ${AÑO}. En Argentina se celebra siempre el tercer domingo de octubre.`,
    },
    {
      q: '¿Con cuánta anticipación conviene comprar el regalo?',
      a: `Cuanto antes, mejor. Mercado Libre muestra en cada publicación la fecha de entrega estimada para tu código postal antes de pagar: esa es la única referencia confiable. Fijate que diga una fecha anterior al ${FECHA_TEXTO}.`,
    },
    {
      q: '¿Cómo sé si el descuento de un regalo es real?',
      a: `Comparando el precio de hoy contra lo que el producto costó antes, no contra el precio tachado. En nuestro registro, el ${pct}% de las ofertas que revisamos en mercadolibre.com.ar/ofertas tenía el descuento inflado: el producto ya se había vendido al menos 5% más barato. Cada regalo de esta página muestra su mínimo registrado.`,
    },
    {
      q: '¿Qué regalar según el presupuesto?',
      a: 'Depende de lo que haya en oferta ese día: en esta página separamos las ofertas regalables de hoy en tres rangos: hasta $50.000 (perfumes, cuidado del cabello, electro de cocina chico), de $50.000 a $150.000 (freidoras, cafeteras, tablets, celulares de entrada) y más de $150.000 (notebooks, smart TV, lavarropas, colchones). Para los regalos grandes tenemos guías de compra que explican qué mirar en cada uno.',
    },
    {
      q: `¿Hasta cuándo conviene pedir el regalo para que llegue el ${FECHA_TEXTO}?`,
      a: `No hay una fecha única: depende del vendedor, del tipo de envío y de tu código postal. Antes de pagar, Mercado Libre muestra la fecha estimada de entrega; elegí una publicación cuya fecha sea anterior al ${FECHA_TEXTO}. En productos grandes (colchones, lavarropas, smart TV) revisala con más cuidado.`,
    },
    {
      q: `¿Qué hago si el regalo no llega antes del ${FECHA_TEXTO}?`,
      a: `Lo mejor es evitarlo antes de pagar: mirá la fecha de entrega que muestra Mercado Libre en la publicación con tu código postal y elegí una anterior al ${FECHA_TEXTO}. Si ya compraste y no llega, seguí el envío desde tus compras en Mercado Libre. Si todavía no pagaste, buscá otra publicación del mismo producto con fecha anterior, fijate si ofrece retiro en una sucursal o punto de retiro, o elegí un regalo más chico. Y siempre queda regalarlo igual: una tarjeta que diga que ya viene en camino.`,
    },
    {
      q: '¿Qué es el envío Full de Mercado Libre y sirve para el Día de la Madre?',
      a: 'En las publicaciones con la etiqueta Full, el producto sale de un depósito de Mercado Libre, que se encarga del envío. Sirve para el Día de la Madre porque suele tener fechas de entrega más cortas, pero no es una garantía: la fecha que cuenta es la que muestra la publicación con tu código postal antes de pagar.',
    },
    {
      q: '¿Qué regalo conviene si no sé qué le gusta a mi mamá?',
      a: 'Empezá por lo que usa todos los días: si toma café o cocina, una cafetera o una freidora de aire; si le gusta arreglarse, un perfume de tienda oficial (mirá cuál usa hoy); si está siempre con el celular, un smartwatch compatible con su teléfono. En esta página tenés un checklist por perfil con qué revisar en cada caso.',
    },
    {
      q: '¿Qué regalos grandes hay en oferta para el Día de la Madre?',
      a: 'En esta página mostramos, por rubro, las ofertas de hoy desde $30.000 en notebooks, celulares, smart TV, lavarropas, colchones, perfumes, cafeteras, freidoras de aire, batidoras, aspiradoras, tablets, smartwatch, planchitas y secadores de pelo, colchones, sommiers y muebles de jardín. Solo aparecen los rubros que hoy tienen ofertas, y cada rubro enlaza a su comparativa completa.',
    },
  ]

  const jsonLd: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Ofertas de hoy', item: DEALS_URL },
        { '@type': 'ListItem', position: 2, name: `Día de la Madre ${AÑO}`, item: URL },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
    ...(mostrados.length > 0
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: `Regalos en oferta para el Día de la Madre ${AÑO}`,
            itemListElement: mostrados.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.titulo, url: p.url_producto })),
          },
        ]
      : []),
  ]

  // Después del 18/10: la página sigue útil y apunta a la temporada vigente (Cyber/Navidad)
  const siguiente = dias < 0 ? temporadaActual() : null
  const estado = dias > 1 ? `Faltan ${dias} días` : dias === 1 ? 'Es mañana' : dias === 0 ? 'Es hoy' : 'Ya pasó'

  return (
    <main className="min-h-screen">
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}

      <header className="sticky top-0 z-10 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <a href={DEALS_URL} className="font-display text-lg font-extrabold tracking-tight">
            🎯 <span className="text-yellow-400">Cazador de Ofertas</span>
          </a>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-black bg-yellow-400 hover:bg-yellow-300 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
          >
            Alertas gratis
          </a>
        </div>
      </header>

      <section
        className="border-b border-zinc-900 px-4 py-8 sm:py-12"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% -20%, rgba(244,114,182,0.08) 0%, transparent 70%)' }}
      >
        <div className="max-w-3xl mx-auto">
          <nav aria-label="Ruta" className="text-xs text-zinc-500 mb-3">
            <a href={DEALS_URL} className="hover:text-yellow-400">Ofertas de hoy</a> <span aria-hidden="true">/</span>{' '}
            <span className="text-zinc-300">Día de la Madre {AÑO}</span>
          </nav>
          <h1 className="font-display text-2xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-3 sm:mb-4 [text-wrap:balance]">
            {TITULO}
          </h1>
          <p className="hidden sm:block text-zinc-400 leading-relaxed [text-wrap:pretty]">
            Desde perfumes y electro de cocina hasta notebooks, celulares, smart TV, lavarropas y colchones, separados por presupuesto. Cada regalo está
            comparado contra el precio más bajo que registramos, así sabés si el descuento es de verdad.
          </p>

          <div className="mt-3 sm:mt-6 rounded-2xl border border-pink-400/30 bg-pink-500/[0.07] p-4 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-pink-300">Tercer domingo de octubre · {estado}</p>
            <p className="mt-1 sm:mt-2 font-display text-xl sm:text-3xl font-black text-zinc-50 [text-wrap:balance]">
              Domingo 18 de octubre de {AÑO}
            </p>
            <p className="hidden sm:block mt-2 text-sm text-zinc-400 leading-relaxed">
              {dias > 7
                ? 'Si comprás en Mercado Libre, apuntá a tenerlo pedido una semana antes: mirá la fecha de entrega antes de pagar.'
                : dias >= 0
                  ? 'Queda poco: priorizá envío Full o retiro y chequeá la fecha de entrega antes de pagar.'
                  : 'Igual te dejamos los regalos en oferta de hoy, con el descuento verificado.'}
            </p>
            <CuentaRegresivaMadre fecha={FECHA} diasBuild={dias} />
            {siguiente && (
              <Link href={siguiente.href} className="mt-3 block rounded-xl border border-yellow-400/40 bg-yellow-400/10 px-4 py-3 text-sm font-bold text-yellow-200 hover:border-yellow-400">
                El Día de la Madre ya pasó. Ahora: {siguiente.titulo} →
              </Link>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {tramoActual && (
                <a href="#ultima-semana" className="text-xs font-bold rounded-full border border-yellow-400/40 bg-yellow-400/10 px-3 py-1 text-yellow-200 hover:border-yellow-400">
                  ⏰ Qué pedir antes de que no llegue
                </a>
              )}
              <a href="#por-perfil" className="text-xs font-bold rounded-full border border-pink-400/30 px-3 py-1 text-pink-200 hover:border-pink-400/60">
                🎁 Checklist por perfil
              </a>
              {rangos.map(r => (
                <a key={r.id} href={`#${r.id}`} className="text-xs font-bold rounded-full border border-pink-400/30 px-3 py-1 text-pink-200 hover:border-pink-400/60">
                  {r.titulo} ({r.total})
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {tramoActual && (
        <section id="ultima-semana" className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 scroll-mt-20">
          <div className="max-w-3xl mb-4">
            <h2 className="font-display text-xl sm:text-2xl font-black [text-wrap:balance]">
              ⏰ {dias <= 7 ? 'Última semana' : 'Se acerca'}: qué pedir antes de que no llegue
            </h2>
            <p className="mt-1 text-sm text-zinc-400 leading-relaxed">
              No hay una fecha de corte única: depende del vendedor, del tipo de envío y de tu código postal. La única
              referencia confiable es la fecha de entrega que muestra Mercado Libre en la publicación antes de pagar:
              tiene que ser anterior al {FECHA_TEXTO}.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {TRAMOS.map(t => {
              const actual = t.id === tramoActual.id
              return (
                <div
                  key={t.id}
                  className={`rounded-2xl border p-4 ${actual ? 'border-pink-400/60 bg-pink-500/[0.08]' : 'border-zinc-800 bg-zinc-900/60'}`}
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-pink-300">
                    {actual ? 'Hoy estás acá' : t.cuando}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-black text-zinc-50">{t.titulo}</h3>
                  {actual && <p className="text-xs text-zinc-500">({t.cuando})</p>}
                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{t.texto}</p>
                </div>
              )
            })}
          </div>
          <div className="mt-4 max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
            <h3 className="font-display text-base font-black text-zinc-100">Cómo chequear la fecha de entrega en 4 pasos</h3>
            <ol className="mt-2 list-decimal pl-5 space-y-1.5 text-sm text-zinc-400 leading-relaxed">
              <li>
                <strong className="text-zinc-200">Cargá tu código postal</strong> en la publicación: Mercado Libre calcula
                la fecha de entrega para tu zona.
              </li>
              <li>
                <strong className="text-zinc-200">Compará con el domingo 18.</strong> Si la publicación muestra un rango de
                fechas, tomá la más tardía.
              </li>
              <li>
                <strong className="text-zinc-200">Buscá la etiqueta Full.</strong> El producto sale de un depósito de
                Mercado Libre, que se encarga del envío. No garantiza llegar a tiempo: mirá la fecha igual.
              </li>
              <li>
                <strong className="text-zinc-200">Revisá la fecha en el resumen de compra</strong>, antes de pagar: puede
                cambiar según el tipo de envío que elijas (a domicilio o retiro).
              </li>
            </ol>
            <p className="mt-3 text-xs text-zinc-500">
              Los tramos de arriba son recomendaciones nuestras de margen, no fechas de corte de Mercado Libre. Cuando
              compares precios, usá el{' '}
              <a href={`${DEALS_URL}/#verificador`} className="text-yellow-400 hover:underline">verificador de descuentos</a>.
            </p>
          </div>
        </section>
      )}

      {destacados.length > 0 && (
        <section id="destacados" className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 scroll-mt-20">
          <div className="max-w-3xl mb-4">
            <h2 className="font-display text-xl sm:text-2xl font-black">⭐ Los regalos que más conviene mirar primero</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Perfumes, cuidado del cabello y electro de cocina: lo que más se elige para mamá, con el descuento comparado
              contra el mínimo registrado.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {destacados.flatMap(d => d.productos.map(o => <OfertaCard key={o.id_ml} producto={light(o)} priority />))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {destacados.map(d => (
              <a
                key={d.comp}
                href={busquedaML(d.busqueda)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="text-sm font-bold bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl px-4 py-2 transition-colors"
              >
                {d.emoji} {d.titulo}: Ver en Mercado Libre
              </a>
            ))}
          </div>
        </section>
      )}

      {rangos.map(r => (
        <section key={r.id} id={r.id} className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 scroll-mt-20">
          <div className="max-w-3xl mb-4">
            <h2 className="font-display text-xl sm:text-2xl font-black">🎁 Regalos {r.titulo.toLowerCase()}</h2>
            <p className="mt-1 text-sm text-zinc-400">
              {r.total === 0
                ? 'Hoy no hay ofertas regalables en este rango. Volvé en unas horas: revisamos 3 veces por día.'
                : r.total > r.productos.length
                  ? `Las ${r.productos.length} mejores de ${r.total} ofertas de hoy en este rango.`
                  : `${r.total} ${r.total === 1 ? 'oferta' : 'ofertas'} de hoy en este rango.`}{' '}
              {r.productos.length > 0 && <>Desde {pesos(Math.min(...r.productos.map(p => p.precio_actual)))}. </>}
              <span className="text-zinc-500">
                <LastUpdated scrapedAt={scrapedAt} />.
              </span>
            </p>
          </div>
          {r.productos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {r.productos.map((o, i) => (
                <OfertaCard key={o.id_ml} producto={light(o)} priority={r.id === 'mas-de-150000' && i < 4} />
              ))}
            </div>
          )}
        </section>
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-8">
        <Link href="/mejores/regalos-dia-de-la-madre" className="text-sm font-bold text-yellow-400 hover:text-yellow-300">
          Ver la comparativa completa de regalos, con el mínimo registrado de cada uno →
        </Link>
      </div>

      {rubros.length > 0 && (
        <section id="por-rubro" className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 scroll-mt-20">
          <div className="max-w-3xl mb-2">
            <h2 className="font-display text-xl sm:text-2xl font-black">Regalos grandes por rubro</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Si la idea es un regalo que dure (o armar una vaquita entre hermanos), estas son las ofertas de hoy desde
              $30.000 en cada rubro, con el mínimo registrado de cada una.
            </p>
          </div>
          {rubros.map(r => (
            <div key={r.comp} className="pt-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                <h3 className="font-display text-lg font-black">
                  {r.emoji} {r.titulo} <span className="text-sm font-semibold text-zinc-500">({r.total} en oferta)</span>
                </h3>
                <Link href={`/mejores/${r.slug}`} className="text-sm font-bold text-yellow-400 hover:text-yellow-300">
                  Comparar todos →
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {r.productos.map(o => (
                  <OfertaCard key={o.id_ml} producto={light(o)} />
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      <section id="por-perfil" className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 scroll-mt-20">
        <div className="max-w-3xl mb-4">
          <h2 className="font-display text-xl sm:text-2xl font-black">🎁 Checklist de regalo por perfil</h2>
          <p className="mt-1 text-sm text-zinc-400 leading-relaxed">
            Si no sabés qué elegir, empezá por lo que ella hace todos los días. Para cada perfil, qué revisar antes de pagar
            y dónde ver las ofertas comparadas.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {perfiles.map(p => (
            <div key={p.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
              <h3 className="font-display text-lg font-black text-zinc-50">
                {p.emoji} {p.titulo}
              </h3>
              <p className="text-xs font-semibold text-pink-300">{p.regalos}</p>
              <ul className="mt-3 space-y-1.5 text-sm text-zinc-400 leading-relaxed">
                {p.checks.map(c => (
                  <li key={c} className="flex gap-2">
                    <span aria-hidden="true" className="text-zinc-600">☐</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-bold">
                {p.comparativas.map(c => (
                  <Link key={c.slug} href={`/mejores/${c.slug}`} className="text-yellow-400 hover:underline">
                    📊 {c.titulo}
                  </Link>
                ))}
                {p.guiasPerfil.map(g => (
                  <Link key={g.slug} href={`/guias/${g.slug}`} className="text-yellow-400/80 hover:underline">
                    📖 {g.titulo}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 pb-10">
        <section className="mb-10">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Cómo no caer en un descuento inflado</h2>
          <p className="text-zinc-400 leading-relaxed mb-4 [text-wrap:pretty]">
            En las {estudio.revisadas.toLocaleString('es-AR')} ofertas de mercadolibre.com.ar/ofertas que revisamos desde el{' '}
            {fechaAR(estudio.desde)}, el <strong className="text-zinc-100">{pct}%</strong> tenía el precio tachado inflado:
            el producto ya se había vendido al menos 5% más barato antes. En fechas de regalo, con más carteles de
            &quot;% OFF&quot;, vale la pena mirar dos veces.
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-zinc-400 leading-relaxed mb-5">
            <li>
              <strong className="text-zinc-200">Ignorá el precio tachado.</strong> Lo pone quien vende; lo que importa es
              cuánto costó de verdad las semanas previas.
            </li>
            <li>
              <strong className="text-zinc-200">Mirá el historial.</strong> Si ya estuvo igual o más barato en un día
              común, el descuento no te ahorra nada.
            </li>
            <li>
              <strong className="text-zinc-200">Perfumes, de tienda oficial.</strong> Evitás réplicas y la devolución es
              más simple.
            </li>
            <li>
              <strong className="text-zinc-200">Hacé la cuenta final.</strong> Envío, cuotas sin interés de verdad y
              reintegros con tope.
            </li>
          </ol>
          <div className="flex flex-wrap gap-3">
            <a
              href={`${DEALS_URL}/#verificador`}
              className="inline-block text-sm font-bold bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl px-5 py-2.5 transition-colors"
            >
              Verificar un descuento
            </a>
            <Link
              href="/descuentos-inflados"
              className="inline-block text-sm font-bold border border-red-500/40 hover:border-red-400 text-red-300 rounded-xl px-5 py-2.5 transition-colors"
            >
              {infladas.casos.length > 0 ? `Los descuentos inflados de hoy (${infladas.casos.length})` : 'Los descuentos inflados de hoy'}
            </Link>
            <Link
              href="/metodologia"
              className="inline-block text-sm font-bold border border-zinc-700 hover:border-yellow-400 text-zinc-200 rounded-xl px-5 py-2.5 transition-colors"
            >
              Cómo lo medimos
            </Link>
          </div>
          <ExtensionCTA className="mt-5" />
        </section>

        <section className="mb-10">
          <h2 className="font-display text-xl sm:text-2xl font-black mb-3">Más para elegir el regalo</h2>
          <ul className="space-y-2">
            {comp && (
              <li>
                <a href={`/mejores/${comp.slug}`} className="font-bold text-yellow-400 hover:underline">📊 {comp.titulo} →</a>
              </li>
            )}
            {RUBROS_REGALO.map(r => getComparativa(r.comp)).filter(c => c !== undefined).map(c => (
              <li key={c.slug}>
                <a href={`/mejores/${c.slug}`} className="font-bold text-yellow-400 hover:underline">📊 {c.titulo} →</a>
              </li>
            ))}
            {guias.map(g => (
              <li key={g.slug}>
                <a href={`/guias/${g.slug}`} className="font-bold text-yellow-400 hover:underline">📖 {g.titulo} →</a>
              </li>
            ))}
          </ul>
          <p className="mt-4 mb-2 text-sm text-zinc-400">Ofertas por categoría:</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIAS_REGALO.map(c => (
              <a
                key={c.slug}
                href={`/categoria/${c.slug}`}
                className="text-sm font-semibold rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-zinc-200 hover:border-yellow-400/40 hover:text-yellow-300"
              >
                {c.nombre}
              </a>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-8 text-center mb-10">
          <h2 className="font-display text-xl font-black mb-2">¿Querés los regalos que bajan de verdad?</h2>
          <p className="text-sm text-zinc-400 mb-5">Publicamos las ofertas verificadas 3 veces por día, con alerta de mínimos históricos.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm font-bold bg-green-500 hover:bg-green-400 text-black rounded-xl px-6 py-2.5 transition-colors"
            >
              Seguir en WhatsApp 💬
            </a>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm font-bold bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl px-6 py-2.5 transition-colors"
            >
              Unirme al canal ✈️
            </a>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl sm:text-2xl font-black mb-4">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {faqs.map(f => (
              <details key={f.q} className="group bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
                <summary className="cursor-pointer text-sm font-bold text-zinc-100 list-none flex items-center justify-between gap-3">
                  {f.q}
                  <span className="text-yellow-400 shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </article>

      <Footer brand="ofertas" />
    </main>
  )
}
