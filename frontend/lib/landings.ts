// Landings derivadas del catálogo real del día (/ofertas/[slug]): cortes por
// descuento, ticket alto, mínimos históricos, caídas de precio de la semana,
// aires por frigorías y colchones de 1 plaza. Nada se inventa: cada página
// filtra productos_rentables.json / seguimiento.json y solo es indexable si hoy
// tiene suficientes productos (mismo criterio que indexable() de /mejores).
import { getOfertas, type ProductWithMargins } from '@/lib/productos'
import { normalizar } from '@/lib/categorias'
import { frigoriasDelTitulo } from '@/lib/frigorias'
import { TICKET_ALTO_DESDE } from '@/lib/ticketalto'
import { getSeguidosPrincipales, actualizadoSeguimiento, precioActual, type Seguido } from '@/lib/seguimiento'

export const MIN_LANDING = 5

export interface Landing {
  slug: string
  /** slug de /categoria/* desde donde se enlaza (además de la sección general) */
  categoria?: string
  nombre: string
  titulo: string
  descripcion: string
  h1: string
  intro: string
  tipo: 'ofertas' | 'bajaron'
  filtrar?: (p: ProductWithMargins) => boolean
  ordenar?: (a: ProductWithMargins, b: ProductWithMargins) => number
  criterios: string[]
  faq: { q: string; a: string }[]
  min?: number
}

const porDescuento = (a: ProductWithMargins, b: ProductWithMargins) => (b.descuento_pct ?? 0) - (a.descuento_pct ?? 0)
const porPrecio = (a: ProductWithMargins, b: ProductWithMargins) => a.precio_actual - b.precio_actual

function esAire(p: ProductWithMargins) {
  return normalizar(p.titulo).includes('aire acondicionado')
}

export const LANDINGS: Landing[] = [
  {
    slug: 'ofertas-mas-de-30-off',
    nombre: 'ofertas de más de 30% OFF',
    titulo: 'Ofertas de más de 30% OFF hoy en Mercado Libre',
    descripcion:
      'Productos con más de 30% de descuento hoy en Mercado Libre Argentina, de mayor a menor descuento y con historial de precios propio para detectar inflados.',
    h1: 'Ofertas de más de 30% OFF en Mercado Libre',
    intro:
      'Los productos que hoy tienen 30% o más de descuento en Mercado Libre Argentina, de mayor a menor descuento. Un porcentaje alto no garantiza un buen precio: revisamos 3 veces por día y marcamos los que están en su mínimo registrado.',
    tipo: 'ofertas',
    filtrar: p => (p.descuento_pct ?? 0) >= 30,
    ordenar: porDescuento,
    criterios: [
      'El descuento se calcula contra un precio "anterior" que pone el vendedor: comparalo con el mínimo registrado y el historial de precios.',
      'Descuentos de 60% o más sobre productos de ticket alto merecen una segunda mirada antes de comprar.',
      'Mirá la reputación del vendedor, el costo de envío y si hay cuotas sin interés.',
    ],
    faq: [
      { q: '¿Un 30% OFF es siempre una buena oferta?', a: 'No. El porcentaje se mide contra el precio anterior que publica el vendedor, que a veces está inflado. Por eso mostramos el precio mínimo que registramos y el historial de cada producto.' },
      { q: '¿Cada cuánto se actualiza esta lista?', a: 'Revisamos Mercado Libre 3 veces por día y la lista cambia con cada corrida.' },
    ],
  },
  {
    slug: 'ofertas-ticket-alto',
    nombre: 'ofertas de más de $250.000',
    titulo: 'Ofertas de más de $250.000 hoy en Mercado Libre',
    descripcion:
      'Electrodomésticos, tecnología y muebles de más de $250.000 en oferta hoy en Mercado Libre Argentina, con descuento, mínimo registrado e historial de precio.',
    h1: 'Ofertas de ticket alto (más de $250.000) en Mercado Libre',
    intro:
      'Compras grandes con descuento hoy: productos de $250.000 o más en Mercado Libre Argentina. En importes altos conviene comparar el historial antes de pagar, por eso cada uno enlaza a su evolución de precio cuando la tenemos.',
    tipo: 'ofertas',
    filtrar: p => p.precio_actual >= TICKET_ALTO_DESDE,
    ordenar: porDescuento,
    criterios: [
      'En compras grandes, 10% de diferencia son decenas de miles de pesos: mirá el historial antes de decidir.',
      'Compará cuotas sin interés y costo de envío: a veces pesan más que el descuento.',
      'Verificá la garantía oficial de la marca en Argentina y la reputación del vendedor.',
    ],
    faq: [
      { q: '¿Desde qué monto consideramos "ticket alto"?', a: 'Desde $250.000. Son las compras donde más importa comparar precios y mirar el historial.' },
      { q: '¿Cómo sé si el precio es bueno?', a: 'Mirá si figura como mínimo histórico y abrí el historial de precios del producto cuando esté disponible.' },
    ],
  },
  {
    slug: 'minimos-historicos-hoy',
    nombre: 'productos en su precio mínimo histórico',
    titulo: 'Productos en su precio mínimo histórico hoy — Mercado Libre',
    descripcion:
      'Productos de Mercado Libre Argentina que hoy están en el precio más bajo que registramos, con descuento y link directo a la oferta.',
    h1: 'Productos en su mínimo histórico hoy',
    intro:
      'Estos productos están hoy en el precio más bajo que registramos desde que los seguimos (revisamos 3 veces por día). Es el mejor momento que vimos para comprarlos, aunque no sabemos qué pasó antes de empezar a seguirlos.',
    tipo: 'ofertas',
    filtrar: p => !!p.minimo_historico,
    ordenar: porDescuento,
    criterios: [
      '"Mínimo histórico" significa el precio más bajo desde que empezamos a seguir ese producto, no desde que existe.',
      'Un mínimo reciente puede durar horas: los precios cambian varias veces por día.',
      'Confirmá en la publicación el precio final con envío y cuotas.',
    ],
    faq: [
      { q: '¿Qué significa mínimo histórico?', a: 'Que el precio de hoy es igual o menor al más bajo que registramos para ese producto desde que lo seguimos.' },
      { q: '¿Cuánto dura un mínimo histórico?', a: 'Puede ser de horas o de días. La lista se actualiza 3 veces por día.' },
    ],
  },
  {
    slug: 'bajaron-de-precio-esta-semana',
    nombre: 'productos que bajaron de precio esta semana',
    titulo: 'Productos que bajaron de precio esta semana — Mercado Libre',
    descripcion:
      'Productos de Mercado Libre Argentina que hoy cuestan menos que en los últimos 7 días, con el precio anterior, el actual y el historial completo.',
    h1: 'Productos que bajaron de precio esta semana',
    intro:
      'Productos con historial propio que hoy están en oferta y cuestan al menos 5% menos que su precio más alto de los últimos 7 días. Los números salen de nuestro seguimiento diario, no del precio "anterior" que declara el vendedor.',
    tipo: 'bajaron',
    criterios: [
      'Comparamos el precio de hoy con el máximo de los 7 días anteriores en nuestro registro.',
      'Una baja de 5% o más sobre un producto caro ya son miles de pesos.',
      'Abrí el historial de cada producto para ver si hoy está cerca de su mínimo.',
    ],
    faq: [
      { q: '¿Cómo detectan que un precio bajó?', a: 'Registramos el precio de cada producto 3 veces por día. Si el de hoy es al menos 5% menor al máximo de los 7 días anteriores, entra en esta lista.' },
      { q: '¿Es lo mismo que el descuento que muestra Mercado Libre?', a: 'No. El descuento de ML se calcula contra un precio anterior que fija el vendedor; esta lista usa nuestro propio historial.' },
    ],
  },
  {
    slug: 'aires-acondicionados-hasta-3000-frigorias',
    categoria: 'aire-acondicionado',
    nombre: 'aires acondicionados hasta 3.000 frigorías',
    titulo: 'Aires acondicionados hasta 3.000 frigorías en oferta hoy',
    descripcion:
      'Aires acondicionados de hasta 3.000 frigorías en oferta hoy en Mercado Libre Argentina: split y portátiles para ambientes chicos, con precio y descuento.',
    h1: 'Aires acondicionados de hasta 3.000 frigorías en oferta',
    intro:
      'Equipos de hasta 3.000 frigorías (las declara el título de la publicación) para dormitorios y ambientes chicos, en oferta hoy en Mercado Libre. Si no sabés cuántas necesitás, usá la calculadora de frigorías.',
    tipo: 'ofertas',
    filtrar: p => esAire(p) && (frigoriasDelTitulo(p.titulo) ?? Infinity) <= 3000,
    ordenar: porPrecio,
    min: 3,
    criterios: [
      'Regla práctica: volumen del ambiente (m² × altura) × 50 frigorías.',
      'Los portátiles son más fáciles de instalar pero rinden menos que un split.',
      'Sumá la instalación al presupuesto: casi nunca está incluida.',
    ],
    faq: [
      { q: '¿Para cuántos m² alcanzan 3.000 frigorías?', a: 'Con la regla de 50 frigorías por m³, unas 3.000 cubren cerca de 60 m³ (por ejemplo 24 m² con techo de 2,5 m). Ajustá por sol y personas con la calculadora.' },
      { q: '¿De dónde sale la capacidad?', a: 'Del título de la publicación: si no declara frigorías, el equipo no entra en esta lista.' },
    ],
  },
  {
    slug: 'aires-acondicionados-mas-de-3000-frigorias',
    categoria: 'aire-acondicionado',
    nombre: 'aires acondicionados de más de 3.000 frigorías',
    titulo: 'Aires acondicionados de más de 3.000 frigorías en oferta hoy',
    descripcion:
      'Aires acondicionados de más de 3.000 frigorías en oferta hoy en Mercado Libre Argentina: para livings y ambientes grandes, con precio y descuento.',
    h1: 'Aires acondicionados de más de 3.000 frigorías en oferta',
    intro:
      'Equipos de más de 3.000 frigorías (declaradas en el título) para ambientes grandes, en oferta hoy en Mercado Libre. Compará precio, descuento y mínimo registrado.',
    tipo: 'ofertas',
    filtrar: p => esAire(p) && (frigoriasDelTitulo(p.titulo) ?? 0) > 3000,
    ordenar: porPrecio,
    min: 3,
    criterios: [
      'Para ambientes de más de 30 m² o con mucho sol suelen hacer falta 4.500 o más frigorías.',
      'Inverter consume menos si lo usás muchas horas.',
      'Revisá la etiqueta de eficiencia energética y el costo de instalación.',
    ],
    faq: [
      { q: '¿Cuántas frigorías necesito para un living?', a: 'Calculá volumen × 50 y sumá por sol y personas. La calculadora de frigorías del sitio lo resuelve.' },
      { q: '¿Por qué no aparece mi modelo?', a: 'Solo listamos los que declaran las frigorías en el título y están en oferta hoy.' },
    ],
  },
  {
    slug: 'colchones-1-plaza-y-media-en-oferta',
    categoria: 'colchones',
    nombre: 'colchones de 1 plaza y 1 plaza y media',
    titulo: 'Colchones y sommiers de 1 plaza y media en oferta hoy',
    descripcion:
      'Colchones y sommiers de 1 plaza y de 1 plaza y media en oferta hoy en Mercado Libre Argentina: medida, precio, descuento y mínimo registrado.',
    h1: 'Colchones de 1 plaza y 1 plaza y media en oferta',
    intro:
      'Colchones y sommiers para camas de 1 plaza o 1 plaza y media (90x190 o 100x190) en oferta hoy en Mercado Libre Argentina.',
    tipo: 'ofertas',
    filtrar: p => {
      const t = normalizar(p.titulo)
      return (
        /colchon|sommier|somier/.test(t) &&
        /(1 plaza|1 1\/2|1 y media|1\/2 plaza|90x190|100x190|80x190)/.test(t) &&
        !/(inflable|antiescaras|respaldo|funda|protector)/.test(t)
      )
    },
    ordenar: porPrecio,
    min: 3,
    criterios: [
      'Medidas habituales: 1 plaza 80x190 o 90x190; 1 plaza y media 100x190. Medí la base antes de comprar.',
      'Espuma de alta densidad o resortes: la firmeza depende del peso y de cómo dormís.',
      'Si es sommier, la medida de base y colchón tiene que coincidir.',
    ],
    faq: [
      { q: '¿Cuánto mide un colchón de 1 plaza y media?', a: 'Generalmente 100x190 cm, aunque algunos fabricantes usan 90x190. Confirmá la medida exacta en la ficha.' },
      { q: '¿Con qué comparar?', a: 'Mirá también los colchones de 2 plazas y los sommiers en la categoría de colchones.' },
    ],
  },
  {
    slug: 'aires-acondicionados-inverter-en-oferta',
    categoria: 'aire-acondicionado',
    nombre: 'aires acondicionados inverter',
    titulo: 'Aires acondicionados inverter en oferta hoy',
    descripcion:
      'Aires acondicionados inverter en oferta hoy en Mercado Libre Argentina: precio, descuento y mínimo registrado para comparar antes de comprar.',
    h1: 'Aires acondicionados inverter en oferta',
    intro:
      'Equipos inverter (compresor de velocidad variable) en oferta hoy en Mercado Libre Argentina. Cuestan más al inicio pero consumen menos si los usás muchas horas; comparalos con su mínimo registrado.',
    tipo: 'ofertas',
    filtrar: p => esAire(p) && normalizar(p.titulo).includes('inverter'),
    ordenar: porPrecio,
    min: 3,
    criterios: [
      'Inverter ajusta la potencia en vez de prenderse y apagarse: menos consumo y menos ruido.',
      'Revisá la etiqueta de eficiencia energética (A o mejor) y si es frío solo o frío/calor.',
      'Sumá el costo de instalación al precio: varía mucho según la zona.',
    ],
    faq: [
      { q: '¿Conviene un aire inverter?', a: 'Si lo usás varias horas por día, el menor consumo suele compensar la diferencia de precio. Para uso esporádico, un modelo convencional puede alcanzar.' },
      { q: '¿Cuántas frigorías necesito?', a: 'Calculá el volumen del ambiente × 50 y sumá por sol y personas. La calculadora de frigorías del sitio lo resuelve.' },
    ],
  },
  {
    slug: 'colchones-2-plazas-queen-king-en-oferta',
    categoria: 'colchones',
    nombre: 'colchones de 2 plazas, queen y king',
    titulo: 'Colchones de 2 plazas, queen y king en oferta hoy',
    descripcion:
      'Colchones y sommiers de 2 plazas, queen y king en oferta hoy en Mercado Libre Argentina: medida, precio, descuento y mínimo registrado.',
    h1: 'Colchones de 2 plazas, queen y king en oferta',
    intro:
      'Colchones y sommiers para cama matrimonial (140x190), queen (160x200) y king (180x200) en oferta hoy en Mercado Libre Argentina. Es una compra grande: mirá el mínimo registrado antes de pagar.',
    tipo: 'ofertas',
    filtrar: p => {
      const t = normalizar(p.titulo)
      return (
        /colchon|sommier|somier/.test(t) &&
        /(2 plazas|queen|king|140x190|150x190|160x200|180x200|200x200)/.test(t) &&
        !/(inflable|antiescaras|respaldo|funda|protector|cuna)/.test(t)
      )
    },
    ordenar: porPrecio,
    min: 3,
    criterios: [
      'Medidas habituales: 2 plazas 140x190, queen 160x200, king 180x200. Medí el somier o la base antes de comprar.',
      'Resortes o espuma de alta densidad: la firmeza ideal depende del peso y de cómo dormís.',
      'Fijate si el precio incluye la base (sommier) o solo el colchón, y si hay cuotas sin interés.',
    ],
    faq: [
      { q: '¿Qué medida es un colchón queen?', a: 'Generalmente 160x200 cm. El king mide 180x200 y el de 2 plazas 140x190.' },
      { q: '¿Cada cuánto se renueva un colchón?', a: 'Entre 8 y 10 años, según el uso y el material.' },
    ],
  },
  {
    slug: 'smart-tv-55-pulgadas-o-mas-en-oferta',
    categoria: 'smart-tv',
    nombre: 'Smart TV de 55 pulgadas o más',
    titulo: 'Smart TV de 55 pulgadas o más en oferta hoy',
    descripcion:
      'Smart TV de 55, 58, 65 y 75 pulgadas en oferta hoy en Mercado Libre Argentina: precio, descuento y mínimo registrado.',
    h1: 'Smart TV de 55 pulgadas o más en oferta',
    intro:
      'Televisores smart de 55 pulgadas o más en oferta hoy en Mercado Libre Argentina, del más barato al más caro. En esta franja el precio cambia seguido: comparalo con el mínimo registrado.',
    tipo: 'ofertas',
    filtrar: p => {
      const t = normalizar(p.titulo)
      return /(smart tv|televisor|\btv\b)/.test(t) && /\b(55|58|60|65|70|75|85)\s?(\"|pulgadas|pulg|')/.test(t)
    },
    ordenar: porPrecio,
    min: 4,
    criterios: [
      'Para ver desde 3 metros, 55" ya alcanza; 65" o más se justifica en living grande.',
      'Mirá el panel (LED, QLED, OLED), la resolución 4K y el sistema (Google TV, Roku, webOS).',
      'Verificá la garantía oficial de la marca en Argentina y el costo del envío.',
    ],
    faq: [
      { q: '¿Qué tamaño de TV me conviene?', a: 'Regla práctica: la distancia de visión en cm dividida 2,5 da las pulgadas. A 3 metros, unas 47 a 55 pulgadas.' },
      { q: '¿4K vale la pena?', a: 'En 55" o más sí: el contenido actual de streaming ya viene en 4K y la diferencia de precio es chica.' },
    ],
  },
  {
    slug: 'heladeras-no-frost-en-oferta',
    categoria: 'heladeras',
    nombre: 'heladeras en oferta',
    titulo: 'Heladeras en oferta hoy en Mercado Libre',
    descripcion:
      'Heladeras con freezer, no frost y side by side en oferta hoy en Mercado Libre Argentina: precio, descuento y mínimo registrado.',
    h1: 'Heladeras en oferta',
    intro:
      'Heladeras en oferta hoy en Mercado Libre Argentina. Es de las compras más caras del hogar: revisá el mínimo registrado y las cuotas antes de decidir.',
    tipo: 'ofertas',
    filtrar: p => /heladera/.test(normalizar(p.titulo)) && !/(portatil|camping|conservadora|vitrina)/.test(normalizar(p.titulo)),
    ordenar: porPrecio,
    min: 3,
    criterios: [
      'No frost evita descongelar a mano y mantiene mejor el frío; cuesta algo más.',
      'Revisá capacidad en litros según tu hogar (unos 100 litros por persona) y las medidas del hueco y de las puertas por donde pasa.',
      'La etiqueta de eficiencia energética define cuánto gastás en luz durante años.',
    ],
    faq: [
      { q: '¿Cuántos litros necesito?', a: 'Como referencia, unos 100 litros por persona; para 4 personas, entre 350 y 450 litros.' },
      { q: '¿No frost o con escarcha?', a: 'No frost no forma hielo y es más cómoda; las de ciclo normal son más baratas pero hay que descongelarlas.' },
    ],
  },
  {
    slug: 'herramientas-electricas-en-oferta',
    categoria: 'herramientas-electricas',
    nombre: 'taladros, amoladoras y herramientas eléctricas',
    titulo: 'Taladros, amoladoras y herramientas eléctricas en oferta hoy',
    descripcion:
      'Taladros, atornilladores, amoladoras y sierras en oferta hoy en Mercado Libre Argentina: precio, descuento y mínimo registrado.',
    h1: 'Taladros, amoladoras y herramientas eléctricas en oferta',
    intro:
      'Herramientas eléctricas en oferta hoy en Mercado Libre Argentina: taladros, atornilladores, amoladoras y sierras. Comparalas con su mínimo registrado y fijate qué incluye cada kit.',
    tipo: 'ofertas',
    filtrar: p => /(taladro|atornillador|amoladora|sierra circular|caladora|rotomartillo|lijadora|esmeril)/.test(normalizar(p.titulo)),
    ordenar: porDescuento,
    min: 5,
    criterios: [
      'Inalámbrico da libertad pero depende de la batería: fijate el voltaje, los Ah y si trae una de repuesto.',
      'Para uso frecuente conviene una marca con servicio técnico y repuestos en Argentina.',
      'Mirá qué accesorios trae el kit (mechas, maletín, cargador) antes de comparar precios.',
    ],
    faq: [
      { q: '¿Taladro con cable o a batería?', a: 'Con cable rinde más potencia constante y es más barato; a batería es más cómodo para trabajos cortos o en altura.' },
      { q: '¿Qué significa percutor?', a: 'Que además de girar golpea, para perforar mampostería y hormigón. Para madera y metal no hace falta.' },
    ],
  },
  {
    slug: 'termotanques-y-calefones-en-oferta',
    categoria: 'termotanques',
    nombre: 'termotanques y calefones',
    titulo: 'Termotanques y calefones en oferta hoy',
    descripcion:
      'Termotanques eléctricos, a gas y calefones en oferta hoy en Mercado Libre Argentina: precio, descuento y mínimo registrado.',
    h1: 'Termotanques y calefones en oferta',
    intro:
      'Termotanques y calefones en oferta hoy en Mercado Libre Argentina. Antes del invierno suben las ventas y el precio: comparalos con el mínimo registrado.',
    tipo: 'ofertas',
    filtrar: p => /(termotanque|calefon)/.test(normalizar(p.titulo)),
    ordenar: porPrecio,
    min: 5,
    criterios: [
      'Capacidad: 40 a 60 litros para 1 o 2 personas, 80 a 120 para una familia.',
      'A gas calienta rápido y gasta menos; eléctrico no requiere instalación de gas.',
      'Revisá si es apto para la presión de tu red y el costo de instalación.',
    ],
    faq: [
      { q: '¿Cuántos litros necesita una familia?', a: 'Para 3 o 4 personas, entre 80 y 120 litros.' },
      { q: '¿Termotanque o calefón?', a: 'El termotanque acumula agua caliente; el calefón la calienta al momento y ocupa menos espacio.' },
    ],
  },
]

export const getLanding = (slug: string) => LANDINGS.find(l => l.slug === slug)

export interface Baja {
  s: Seguido
  hoy: number
  antes: number
  pct: number
}

/** Seguidos en oferta hoy que cuestan ≥5% menos que su máximo de los 7 días previos. */
export function bajasDeLaSemana(): Baja[] {
  const act = actualizadoSeguimiento()
  if (!act) return []
  const ref = new Date(act + 'T00:00:00Z').getTime()
  const out: Baja[] = []
  for (const s of getSeguidosPrincipales()) {
    if (s.ultimo_visto !== act || s.serie.length < 2) continue
    const hoy = precioActual(s)
    const prev = s.serie
      .slice(0, -1)
      .filter(([d]) => ref - new Date(d + 'T00:00:00Z').getTime() <= 7 * 86400000)
      .map(x => x[1])
    if (!prev.length) continue
    const antes = Math.max(...prev)
    const pct = Math.round(((antes - hoy) / antes) * 100)
    if (pct >= 5) out.push({ s, hoy, antes, pct })
  }
  return out.sort((a, b) => b.pct - a.pct || a.s.slug.localeCompare(b.s.slug))
}

export function productosLanding(l: Landing): ProductWithMargins[] {
  if (l.tipo !== 'ofertas' || !l.filtrar) return []
  const base = getOfertas().filter(l.filtrar)
  return l.ordenar ? [...base].sort(l.ordenar) : base
}

export function cantidadLanding(l: Landing): number {
  return l.tipo === 'bajaron' ? bajasDeLaSemana().length : productosLanding(l).length
}

export function indexableLanding(l: Landing): boolean {
  return cantidadLanding(l) >= (l.min ?? MIN_LANDING)
}

/** Landings indexables que corresponden a una guía (por categoría o, si la guía no
 *  la declara, por el tema que lleva en el slug). Sirve para el link contextual. */
export function landingsDeGuia(g: { slug: string; categoria?: { slug: string } }): Landing[] {
  let cat = g.categoria?.slug
  if (!cat) {
    if (g.slug.includes('smart-tv')) cat = 'smart-tv'
    else if (g.slug.includes('aire-acondicionado')) cat = 'aire-acondicionado'
  }
  if (!cat) return []
  return LANDINGS.filter(l => l.categoria === cat && indexableLanding(l))
}

/** Landings de ticket alto / comisión 15% que van como chips en la home. */
export const LANDINGS_RENTABLES = [
  'ofertas-ticket-alto',
  'aires-acondicionados-inverter-en-oferta',
  'colchones-2-plazas-queen-king-en-oferta',
  'smart-tv-55-pulgadas-o-mas-en-oferta',
  'herramientas-electricas-en-oferta',
  'heladeras-no-frost-en-oferta',
]
