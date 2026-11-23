// Landings de Black Friday de ticket alto (/mejores/black-friday-*), pensadas para
// el celular: botón «Ver en Mercado Libre» del producto principal arriba de todo y
// una lista corta, elegida a mano, debajo.
//
// Reglas (pedido del 23/11/2026, no re-litigar):
// - Solo productos y links de afiliado que ya están en los datos del repo
//   (data/productos_rentables.json o lib/mejor-aires.ts). Acá van solo los ids:
//   título, precio, foto y link salen de esos datos al armar el sitio.
// - Precio solo si se vio hace DIAS_PRECIO_VIEJO días o menos; si no, la tarjeta
//   queda con el botón y sin precio. Nunca se inventa un precio.
// - Nada de % de descuento, precio tachado, «mínimo histórico» ni cupones.
// - Sin marcas BGH ni HP/OMEN/Victus (MARCAS_PROHIBIDAS: se filtran igual por si
//   alguien carga una por error).
// - Si un producto ya no está en los datos (el bot poda a los 14 días), no se
//   muestra; si no queda ninguno, la página manda a la búsqueda de ML.
import { getProductoById } from '@/lib/productos'
import { AIRES_HOY, AIRES_VERIFICADO } from '@/lib/mejor-aires'
import { DIAS_PRECIO_VIEJO, diasDesde } from '@/lib/frescura'
import { busquedaML } from '@/lib/afiliado'

/** Marcas que no se muestran en estas landings. */
export const MARCAS_PROHIBIDAS = /\b(bgh|hp|omen|victus)\b/i

export interface ItemBF {
  /** id de ML tal cual figura en los datos del repo */
  id: string
  /** nombre corto para la tarjeta (sale del título de la publicación, sin agregar nada) */
  nombre: string
  /** specs que dice la publicación */
  detalle: string
  /** por qué está en la lista (sin precios ni porcentajes) */
  nota?: string
}

export interface FaqBF {
  q: string
  a: string
}

export interface LandingBF {
  slug: string
  /** "Notebooks" (chips y migas) */
  rubro: string
  emoji: string
  h1: string
  /** <title> (≤ 65 caracteres) */
  titulo: string
  /** meta description (≤ 158 caracteres) */
  descripcion: string
  keywords: string[]
  intro: string
  /** el primero es el principal (botón grande de arriba) */
  items: ItemBF[]
  criterios: string[]
  faq: FaqBF[]
  /** búsqueda de ML de respaldo (link de afiliado) si no queda ningún producto */
  busqueda: string
  enlaces: { href: string; texto: string }[]
}

export const LANDINGS_BF: LandingBF[] = [
  {
    slug: 'black-friday-notebooks',
    rubro: 'Notebooks',
    emoji: '💻',
    h1: 'Notebooks para el Black Friday 2026',
    titulo: 'Black Friday 2026 notebooks Argentina: cuál comprar',
    descripcion:
      'Black Friday 2026 en Argentina (viernes 27/11): notebooks Lenovo, Asus y Dell elegidas para estudiar, trabajar y jugar, con link directo a Mercado Libre.',
    keywords: ['black friday 2026 notebooks argentina', 'notebook black friday 2026', 'mejor notebook black friday', 'notebook mercado libre black friday'],
    intro:
      'Elegimos pocas y buenas: 16 GB de RAM y disco SSD en todas, de marcas con service en Argentina. Arriba, la que más recomendamos para la mayoría.',
    items: [
      { id: 'MLA77766168', nombre: 'Lenovo IdeaPad Slim 3', detalle: 'Ryzen 5 · 16 GB de RAM · 512 GB SSD', nota: 'La que recomendamos para la mayoría: estudio, oficina y uso diario.' },
      { id: 'MLA72201400', nombre: 'Lenovo V15 Gen 5', detalle: 'Intel Core i5 · 16 GB de RAM · 512 GB SSD', nota: 'Alternativa con Intel para trabajar.' },
      { id: 'MLA53659389', nombre: 'Lenovo IdeaPad Slim 3 táctil', detalle: 'Ryzen 7 8840HS · 16 GB de RAM · 512 GB SSD · Windows 11', nota: 'Más procesador y pantalla táctil.' },
      { id: 'MLA61813247', nombre: 'Asus Zenbook 14 OLED', detalle: 'Ryzen 7 8840HS · 16 GB de RAM · 1 TB SSD', nota: 'Liviana y con pantalla OLED.' },
      { id: 'MLA54436970', nombre: 'Lenovo LOQ (gamer)', detalle: 'Core i5-12450HX · 16 GB · 512 GB SSD · RTX 3050 6 GB', nota: 'Para jugar y editar.' },
      { id: 'MLA61270430', nombre: 'Asus TUF Gaming A15', detalle: 'Ryzen 7 7445HS · 16 GB · 512 GB SSD · RTX 3050 4 GB', nota: 'Otra gamer, de Asus.' },
    ],
    criterios: [
      '16 GB de RAM: con 8 GB se queda corta en un par de años.',
      'Disco SSD (512 GB alcanza para la mayoría).',
      'Ryzen 5 / Core i5 o más para trabajar cómodo; para jugar, placa de video dedicada (RTX).',
      'Fijate si trae Windows o viene sin sistema operativo.',
    ],
    faq: [
      { q: '¿Qué notebook conviene comprar en el Black Friday 2026?', a: 'Para la mayoría, una con Ryzen 5 o Core i5, 16 GB de RAM y SSD de 512 GB, como la Lenovo IdeaPad Slim 3 de esta página. Si vas a jugar o editar video, una con placa RTX, como la Lenovo LOQ o la Asus TUF.' },
      { q: '¿Cuándo es el Black Friday 2026 en Argentina?', a: 'El viernes 27 de noviembre de 2026. Cada tienda decide si se suma y por cuántos días.' },
      { q: '¿El precio es el mismo que en Mercado Libre?', a: 'Sí. Los botones llevan a la publicación de Mercado Libre con nuestro link de afiliado: pagás lo mismo que entrando directo. El precio puede cambiar, confirmalo ahí antes de comprar.' },
    ],
    busqueda: busquedaML('notebook 16gb ram'),
    enlaces: [
      { href: '/guias/que-notebook-comprar-black-friday', texto: 'Guía: qué notebook comprar en el Black Friday' },
      { href: '/comparador/notebooks', texto: 'Comparador de notebooks con filtros' },
    ],
  },
  {
    slug: 'black-friday-celulares',
    rubro: 'Celulares',
    emoji: '📱',
    h1: 'iPhone y Samsung Galaxy para el Black Friday 2026',
    titulo: 'Black Friday 2026 celulares Argentina: iPhone y Galaxy',
    descripcion:
      'Black Friday 2026 en Argentina (viernes 27/11): iPhone 15, 16 y 17 y Samsung Galaxy S26 y A56 elegidos, con link directo a la publicación de Mercado Libre.',
    keywords: ['black friday 2026 celulares argentina', 'iphone black friday 2026 argentina', 'samsung galaxy black friday 2026', 'celular black friday mercado libre'],
    intro:
      'Los celulares que más se buscan, sin vueltas: iPhone de los últimos tres años y Samsung Galaxy de gama media y alta. Arriba, el que más recomendamos.',
    items: [
      { id: 'MLA1040287808', nombre: 'Apple iPhone 16', detalle: '128 GB · Negro · Distribuidor autorizado', nota: 'El iPhone que más recomendamos hoy.' },
      { id: 'MLA55309009', nombre: 'Apple iPhone 17', detalle: '256 GB · Blanco', nota: 'El más nuevo, con el doble de memoria.' },
      { id: 'MLA27172677', nombre: 'Apple iPhone 15', detalle: '128 GB · Negro', nota: 'La puerta de entrada a iPhone.' },
      { id: 'MLA65503984', nombre: 'Samsung Galaxy S26 Ultra', detalle: '256 GB', nota: 'El tope de gama de Samsung.' },
      { id: 'MLA78803238', nombre: 'Samsung Galaxy S26 FE', detalle: '256 GB · Graphite', nota: 'Gama alta a un precio más bajo.' },
      { id: 'MLA47114363', nombre: 'Samsung Galaxy A56 5G', detalle: '256 GB · 8 GB de RAM · Dual SIM', nota: 'La gama media que más rinde.' },
    ],
    criterios: [
      'Memoria: 128 GB como mínimo; 256 GB si sacás muchas fotos y videos.',
      'Comprá a la tienda oficial o a un distribuidor autorizado, con factura y garantía en Argentina.',
      'Mirá que sea la versión que buscás (capacidad y color) antes de pagar.',
    ],
    faq: [
      { q: '¿Qué celular conviene comprar en el Black Friday 2026?', a: 'Si querés iPhone, el iPhone 16 es el equilibrio entre precio y años de actualizaciones. En Samsung, el Galaxy S26 FE es gama alta a un precio más bajo y el Galaxy A56 5G es la gama media que más rinde.' },
      { q: '¿Cuándo es el Black Friday 2026 en Argentina?', a: 'El viernes 27 de noviembre de 2026. Cada tienda decide si se suma y por cuántos días.' },
      { q: '¿El precio es el mismo que en Mercado Libre?', a: 'Sí. Los botones llevan a la publicación de Mercado Libre con nuestro link de afiliado: pagás lo mismo que entrando directo. El precio puede cambiar, confirmalo ahí antes de comprar.' },
    ],
    busqueda: busquedaML('iphone'),
    enlaces: [
      { href: '/guias/que-celular-comprar-black-friday', texto: 'Guía: qué celular comprar en el Black Friday' },
      { href: '/comparador/celulares', texto: 'Comparador de celulares con filtros' },
    ],
  },
  {
    slug: 'black-friday-smart-tv',
    rubro: 'Smart TV',
    emoji: '📺',
    h1: 'Smart TV para el Black Friday 2026',
    titulo: 'Black Friday 2026 smart TV Argentina: 50, 55 y 65"',
    descripcion:
      'Black Friday 2026 en Argentina (viernes 27/11): smart TV 4K Samsung, LG y Hisense de 50, 55 y 65 pulgadas (QLED, Mini LED y OLED), con link directo a Mercado Libre.',
    keywords: ['black friday 2026 smart tv argentina', 'smart tv black friday 2026', 'tv 55 pulgadas black friday', 'televisor black friday mercado libre'],
    intro:
      'Teles 4K de marcas conocidas, de 50 a 65 pulgadas. Arriba, la de 55" que más recomendamos para un living común.',
    items: [
      { id: 'MLA47330762', nombre: 'Samsung 55" QLED Serie D', detalle: '4K · QLED', nota: 'La que recomendamos para un living común.' },
      { id: 'MLA80753446', nombre: 'Samsung 50" Mini LED M60H', detalle: 'Mini LED · HDR', nota: 'Si el espacio da para 50".' },
      { id: 'MLA54630072', nombre: 'Hisense 55" Mini LED 55U6QV', detalle: '4K · Mini LED · QLED · modo juego', nota: 'Buena para consola.' },
      { id: 'MLA51226992', nombre: 'LG 55" QNED AI 55QNED82', detalle: '4K · QNED', nota: 'La opción de LG.' },
      { id: 'MLA70642474', nombre: 'Samsung 65" Neo QLED QN70H', detalle: '4K · Neo QLED · modelo 2026', nota: 'Para livings grandes.' },
      { id: 'MLA65261667', nombre: 'Samsung 55" OLED S85F', detalle: '4K · OLED', nota: 'La de mejor imagen de la lista.' },
    ],
    criterios: [
      'Pulgadas según la distancia: 50" a unos 2 m; 55" a 65" para livings grandes.',
      '4K desde 43"; QLED, Mini LED u OLED dan mejores colores que un LED común.',
      'Sistema (Google TV, Tizen, webOS): que tenga las apps que usás.',
    ],
    faq: [
      { q: '¿Qué smart TV conviene comprar en el Black Friday 2026?', a: 'Para un living común, una 4K de 55 pulgadas con panel QLED o Mini LED, como la Samsung 55" QLED de esta página. Para consola, una con modo juego, como la Hisense 55U6QV.' },
      { q: '¿Cuándo es el Black Friday 2026 en Argentina?', a: 'El viernes 27 de noviembre de 2026. Cada tienda decide si se suma y por cuántos días.' },
      { q: '¿El precio es el mismo que en Mercado Libre?', a: 'Sí. Los botones llevan a la publicación de Mercado Libre con nuestro link de afiliado: pagás lo mismo que entrando directo. El precio puede cambiar, confirmalo ahí antes de comprar.' },
    ],
    busqueda: busquedaML('smart tv 55 4k'),
    enlaces: [
      { href: '/guias/que-smart-tv-comprar-black-friday', texto: 'Guía: qué smart TV comprar en el Black Friday' },
      { href: '/comparador/smart-tv', texto: 'Comparador de smart TV con filtros' },
    ],
  },
  {
    slug: 'black-friday-aires-acondicionados',
    rubro: 'Aires y verano',
    emoji: '❄️',
    h1: 'Aires acondicionados para el Black Friday 2026',
    titulo: 'Black Friday 2026 aires acondicionados Argentina',
    descripcion:
      'Black Friday 2026 en Argentina (viernes 27/11): aires split inverter frío/calor Samsung, LG, Philco, Hyundai y Likon para el verano, con link directo a Mercado Libre.',
    keywords: ['black friday 2026 aires acondicionados argentina', 'aire acondicionado black friday 2026', 'split inverter black friday', 'ofertas verano mercado libre'],
    intro:
      'Antes de que arranque el calor fuerte: splits inverter frío/calor de 2.500 a 4.500 frigorías. Arriba, el que más recomendamos para un ambiente de hasta 20 m².',
    items: [
      { id: 'MLA60932288', nombre: 'Samsung split inverter 2580 F', detalle: 'Frío/calor · inverter · 2580 frigorías', nota: 'El que recomendamos para hasta 20 m².' },
      { id: 'MLA80862058', nombre: 'Likon split inverter 3200 F', detalle: 'Frío/calor · inverter · 3200 frigorías', nota: 'Más frigorías por menos plata.' },
      { id: 'MLA45670320', nombre: 'Hyundai split inverter 3200 W con wifi', detalle: 'Inverter · wifi · 3200 W' },
      { id: 'MLA63226247', nombre: 'Philco split inverter 3225 F', detalle: 'Frío/calor · inverter · 3225 frigorías' },
      { id: 'MLA15316559', nombre: 'LG DualCool 4500 F', detalle: 'Frío/calor · inverter · 4500 frigorías', nota: 'Para ambientes de unos 30 m².' },
      { id: 'MLA39382495', nombre: 'Pileta rectangular 7.800 L', detalle: 'PVC · 4,5 × 2,2 m · con válvula de desagote', nota: 'Para el verano, si tenés patio.' },
    ],
    criterios: [
      'Frigorías según el ambiente: hasta 20 m², 2.500 a 3.000; unos 30 m², 4.500.',
      'Inverter si lo vas a usar muchas horas: gasta menos luz y hace menos ruido.',
      'La instalación casi nunca está incluida: sumala al presupuesto y pedí turno antes de enero.',
    ],
    faq: [
      { q: '¿Qué aire acondicionado conviene comprar en el Black Friday 2026?', a: 'Para un ambiente de hasta 20 m², un split inverter frío/calor de 2.500 a 3.000 frigorías, como el Samsung 2580 F de esta página. Para unos 30 m², uno de 4.500, como el LG DualCool.' },
      { q: '¿Cuántas frigorías necesito?', a: 'Como regla práctica, de 100 a 150 frigorías por m², según el sol, la altura del techo y cuánta gente usa el ambiente. Podés calcularlo con la calculadora de frigorías del sitio.' },
      { q: '¿El precio es el mismo que en Mercado Libre?', a: 'Sí. Los botones llevan a la publicación de Mercado Libre con nuestro link de afiliado: pagás lo mismo que entrando directo. El precio puede cambiar, confirmalo ahí antes de comprar.' },
    ],
    busqueda: busquedaML('aire acondicionado split inverter'),
    enlaces: [
      { href: '/calculadora-frigorias', texto: 'Calculadora de frigorías' },
      { href: '/mejor/aires-acondicionados', texto: 'Guía: qué aire acondicionado comprar' },
      { href: '/calculadora-consumo-electrico', texto: 'Cuánta luz gasta un aire' },
    ],
  },
]

export function getLandingBF(slug: string): LandingBF | undefined {
  return LANDINGS_BF.find(l => l.slug === slug)
}

export interface ProductoBF extends ItemBF {
  url: string
  img: string | null
  /** null = no hay precio visto hace DIAS_PRECIO_VIEJO días o menos: no se muestra */
  precio: number | null
  /** 'AAAA-MM-DD' en que se vio el precio (solo si hay precio) */
  visto: string | null
}

/** Precio solo si se vio hace DIAS_PRECIO_VIEJO días o menos. */
export function precioMostrable(precio: number | null | undefined, visto: string | null | undefined, hoy?: string): number | null {
  if (!precio || precio <= 0) return null
  const d = diasDesde(visto, hoy)
  return d !== null && d <= DIAS_PRECIO_VIEJO ? precio : null
}

/** Arma los productos de la landing con los datos del repo (catálogo y, para aires, lib/mejor-aires). */
export function productosBF(l: LandingBF, hoy?: string): ProductoBF[] {
  const aires = new Map(AIRES_HOY.map(a => [a.id, a]))
  const out: ProductoBF[] = []
  for (const it of l.items) {
    const p = getProductoById(it.id)
    const a = aires.get(it.id)
    const titulo = p?.titulo ?? a?.titulo
    if (!titulo || MARCAS_PROHIBIDAS.test(titulo) || MARCAS_PROHIBIDAS.test(it.nombre)) continue
    if (p) {
      const precio = precioMostrable(p.precio_actual, p.precio_visto, hoy)
      out.push({ ...it, url: p.url_producto, img: p.url_imagen, precio, visto: precio ? p.precio_visto ?? null : null })
    } else if (a) {
      const precio = precioMostrable(a.precio, AIRES_VERIFICADO, hoy)
      out.push({ ...it, url: a.url, img: null, precio, visto: precio ? AIRES_VERIFICADO : null })
    }
  }
  return out
}
