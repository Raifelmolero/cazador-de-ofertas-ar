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
  {
    slug: 'gastronomia',
    marca: 'Cazador de Gastronomía',
    emoji: '🍳',
    titulo: 'Equipamiento gastronómico en oferta: hornos pizzeros, freidoras industriales y más',
    descripcion:
      'Hornos pizzeros, freidoras industriales, anafes, cortadoras de fiambre, batidoras planetarias y heladeras exhibidoras en oferta hoy en Mercado Libre Argentina, con el descuento verificado contra el historial de precios.',
    intro:
      'Para equipar la cocina de un local, una rotisería, una panadería o un foodtruck: los equipos que hoy tienen descuento real en Mercado Libre (lo chequeamos contra el historial de precios, 3 veces por día) y guías para no comprar de más ni de menos. Antes de comprar, confirmá con tu gasista o electricista que la instalación banca el equipo.',
    etiqueta: 'gastronomia',
    categorias: ['equipamiento-gastronomico'],
    busquedas: [
      'horno pizzero', 'freidora industrial', 'anafe industrial', 'cortadora de fiambre',
      'heladera exhibidora', 'plancha bifera', 'batidora planetaria', 'amasadora',
      'balanza comercial', 'licuadora industrial', 'cafetera industrial', 'horno convector',
    ],
  },
  {
    slug: 'gamer',
    marca: 'Cazador Gamer',
    emoji: '🎮',
    titulo: 'Ofertas gamer: monitores, notebooks, consolas, sillas y periféricos',
    descripcion:
      'Monitores gamer, notebooks gamer, consolas, joysticks, auriculares, teclados, mouse y sillas gamer en oferta hoy en Mercado Libre Argentina, con el descuento verificado contra el historial de precios.',
    intro:
      'Todo el setup gamer en un solo lugar: monitores, notebooks, consolas, joysticks, auriculares, teclados, mouse y sillas que hoy tienen descuento real en Mercado Libre (lo verificamos contra el historial de precios, 3 veces por día). Antes de comprar, fijate que tu equipo aproveche lo que pagás: un monitor de 240 Hz no sirve de mucho si tu placa de video no llega a esos cuadros.',
    etiqueta: 'gamer',
    categorias: ['gamer'],
    busquedas: [
      'monitor gamer 144hz', 'monitor gamer 27', 'notebook gamer', 'pc gamer', 'playstation 5',
      'nintendo switch', 'xbox series', 'joystick', 'auriculares gamer', 'teclado mecanico',
      'mouse gamer', 'silla gamer',
    ],
  },
  {
    slug: 'bebes-y-jugueteria',
    marca: 'Cazador de Bebés y Juguetes',
    emoji: '🧸',
    titulo: 'Ofertas de bebés y juguetes: cochecitos, butacas, cunas y juguetes',
    descripcion:
      'Cochecitos, butacas, cunas, sillitas, juguetes y juegos de exterior en oferta hoy en Mercado Libre Argentina, con el descuento verificado contra el historial de precios.',
    intro:
      'Lo de bebés y chicos en un solo lugar: cochecitos, butacas, cunas, juguetes y juegos que hoy tienen descuento real en Mercado Libre (lo verificamos contra el historial de precios, 3 veces por día). Se pone más movido antes de Navidad y Reyes: fijate el mínimo registrado antes de comprar.',
    etiqueta: 'bebes',
    categorias: ['bebes-y-jugueteria'],
    busquedas: [
      'cochecito bebe', 'butaca auto bebe', 'cuna', 'sillita de comer', 'practicuna', 'mochila portabebe',
      'lego', 'juego de mesa', 'cama elastica', 'pileta inflable', 'bicicleta infantil', 'juguetes didacticos',
    ],
  },
  {
    slug: 'pequenos-electrodomesticos',
    marca: 'Cazador de Electro',
    emoji: '☕',
    titulo: 'Pequeños electrodomésticos en oferta: freidoras de aire, aspiradoras, cafeteras y ventiladores',
    descripcion:
      'Freidoras de aire, aspiradoras y robots, cafeteras, microondas, licuadoras, batidoras y ventiladores en oferta hoy en Mercado Libre Argentina, con el descuento verificado contra el historial de precios.',
    intro:
      'El electro chico de la casa en un solo lugar: freidoras de aire, aspiradoras y robots, cafeteras, microondas, licuadoras, batidoras y ventiladores que hoy tienen descuento real en Mercado Libre (lo verificamos contra el historial de precios, 3 veces por día). Aparecen todos los días en las ofertas de ML, así que antes de comprar compará capacidad, potencia y garantía, no solo el % OFF.',
    etiqueta: 'electro',
    categorias: ['freidoras-de-aire', 'electro-de-cocina', 'aspiradoras', 'ventiladores'],
    busquedas: [
      'freidora de aire', 'horno air fryer', 'aspiradora robot', 'aspiradora inalambrica',
      'cafetera espresso', 'cafetera de capsulas', 'microondas', 'licuadora', 'batidora planetaria',
      'pava electrica', 'ventilador de techo', 'ventilador de pie',
    ],
  },
]

export const getNicho = (slug: string) => NICHOS.find(n => n.slug === slug)
