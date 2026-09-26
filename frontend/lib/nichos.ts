// Mini-cazadores por nicho (Fase 1 de la tarjeta #21 de Trello): un hub por
// rubro dentro del sitio actual (/herramientas, /hogar, ...). Cada hub junta
// las categorías, comparativas, guías e historial de su rubro, y sus salidas a
// ML llevan una etiqueta propia (matt_word) para medir el nicho aparte en el
// panel de afiliados. Si un nicho supera ~300 visitas/día pasa a dominio
// propio (Fase 2); por eso todo sale de esta config y no de páginas a mano.

export interface Nicho {
  slug: string // ruta: /<slug>
  marca: string // "Cazador de Herramientas"
  emoji: string
  titulo: string // H1 y <title>
  descripcion: string // meta description
  intro: string
  etiqueta: string // matt_word en el panel de afiliados de ML
  categorias: string[] // slugs de /categoria/* que forman el nicho
  busquedas: string[] // accesos directos a búsquedas de ML
}

export const NICHOS: Nicho[] = [
  {
    slug: 'herramientas',
    marca: 'Cazador de Herramientas',
    emoji: '🔧',
    titulo: 'Herramientas en oferta: taladros, amoladoras, soldadoras y más',
    descripcion:
      'Herramientas eléctricas en oferta hoy en Mercado Libre Argentina, con el descuento verificado contra el historial de precios. Guías para elegir taladro, amoladora, soldadora e hidrolavadora.',
    intro:
      'Todo lo del taller en un solo lugar: las herramientas que hoy tienen descuento real en Mercado Libre (lo verificamos contra el historial de precios, 3 veces por día), comparativas y guías cortas para elegir bien antes de comprar.',
    etiqueta: 'herramientas',
    categorias: ['herramientas-electricas'],
    busquedas: [
      'taladro percutor', 'atornillador 18v', 'rotomartillo', 'amoladora angular',
      'sierra circular', 'soldadora inverter', 'hidrolavadora', 'compresor de aire',
      'lijadora', 'caladora', 'set de herramientas', 'banco de trabajo',
    ],
  },
  {
    slug: 'hogar',
    marca: 'Cazador de Hogar',
    emoji: '🏠',
    titulo: 'Ofertas para el hogar: aires, colchones, heladeras y lavarropas',
    descripcion:
      'Aires acondicionados, colchones, heladeras, lavarropas y más electrodomésticos en oferta hoy en Mercado Libre Argentina, con el descuento verificado contra el historial de precios.',
    intro:
      'Lo grande de la casa en un solo lugar: aires, colchones, heladeras, lavarropas, cocinas y termotanques con descuento real hoy en Mercado Libre (lo verificamos contra el historial de precios, 3 veces por día). Son compras caras: por eso sumamos comparativas y guías para elegir bien.',
    etiqueta: 'hogar',
    categorias: [
      'aire-acondicionado', 'colchones', 'heladeras', 'lavarropas',
      'cocinas-y-hornos', 'termotanques', 'freezers',
    ],
    busquedas: [
      'aire acondicionado inverter', 'aire acondicionado 3000 frigorias', 'colchon 2 plazas',
      'sommier', 'heladera no frost', 'lavarropas automatico', 'lavasecarropas',
      'cocina a gas', 'horno electrico', 'termotanque', 'freezer', 'purificador de aire',
    ],
  },
  {
    slug: 'tecno',
    marca: 'Cazador de Tecno',
    emoji: '📺',
    titulo: 'Ofertas de tecnología: smart TV y monitores',
    descripcion:
      'Smart TV y monitores en oferta hoy en Mercado Libre Argentina, con el descuento verificado contra el historial de precios. Comparativas y guías para elegir pulgadas, panel y frecuencia.',
    intro:
      'Pantallas en un solo lugar: los smart TV y monitores que hoy tienen descuento real en Mercado Libre (lo verificamos contra el historial de precios, 3 veces por día), con comparativas para elegir tamaño, resolución y panel.',
    etiqueta: 'tecno',
    categorias: ['smart-tv', 'monitores'],
    busquedas: [
      'smart tv 50 pulgadas', 'smart tv 55 4k', 'smart tv 65', 'google tv', 'monitor 24 pulgadas',
      'monitor 27 pulgadas', 'monitor gamer 144hz', 'monitor curvo', 'soporte tv pared',
      'barra de sonido', 'chromecast', 'proyector',
    ],
  },
]

export const getNicho = (slug: string) => NICHOS.find(n => n.slug === slug)
