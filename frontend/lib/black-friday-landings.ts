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
// - Nada de cifras de descuento ni precio tachado.
// - Sin marcas BGH, HP/OMEN/Victus, Vivobook ni Likon (MARCAS_PROHIBIDAS: se filtran
//   igual por si alguien carga una por error).
// - Si un producto ya no está en los datos (el bot poda a los 14 días), no se
//   muestra; si no queda ninguno, la página manda a la búsqueda de ML.
import { getProductoById } from '@/lib/productos'
import { AIRES_HOY, AIRES_VERIFICADO } from '@/lib/mejor-aires'
import { DIAS_PRECIO_VIEJO, diasDesde } from '@/lib/frescura'
import { busquedaML } from '@/lib/afiliado'
import { FECHA_REVISION_BF } from '@/lib/bf-guias'

/** Marcas que no se muestran en estas landings. */
export const MARCAS_PROHIBIDAS = /\b(bgh|hp|omen|victus|omnibook|vivobook|likon)\b/i

export interface ItemBF {
  /** id de ML tal cual figura en los datos del repo */
  id: string
  /** nombre corto para la tarjeta (sale del título de la publicación, sin agregar nada) */
  nombre: string
  /** specs que dice la publicación */
  detalle: string
  /** por qué está en la lista (sin precios ni porcentajes) */
  nota?: string
  /** true solo si la publicación es de una tienda oficial (dato verificado en ML). Sin el dato, no se muestra. */
  tiendaOficial?: boolean
}

/** Otras publicaciones del MISMO modelo en data/productos_rentables.json (26/11/2026, víspera del
 *  Black Friday): si la publicación elegida no tiene precio visto hace DIAS_PRECIO_VIEJO días o menos,
 *  landings, guías BF y cuadros de destacados muestran la primera de estas que sí lo tenga, con su
 *  propio link de afiliado y precio (nunca uno inventado). `detalle` solo si cambia algo (el color).
 *  Mismo procesador, memoria y disco que la elegida; si no, no va acá. */
export const PUBLICACIONES_ALTERNATIVAS: Record<string, { id: string; detalle?: string }[]> = {
  // Lenovo IdeaPad Slim 3 Ryzen 5 · 16 GB · 512 GB (la más vendida del panel, 16-25/11).
  MLA77766168: [{ id: 'MLA61338032' }],
  // Lenovo V15 Gen 5 Core i5 · 16 GB · 512 GB.
  MLA72201400: [{ id: 'MLA72201391' }],
  // Apple iPhone 16 128 GB, distribuidor autorizado: la blanca.
  MLA1040287808: [{ id: 'MLA1040287791', detalle: '128 GB · Blanco · Distribuidor autorizado' }],
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
  /** «Respuesta corta» arriba de todo (2 o 3 frases, modelo concreto y por qué): la que citan Google y las IAs */
  respuestaCorta: string
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
    respuestaCorta:
      'Para la mayoría, la Lenovo IdeaPad Slim 3 con Ryzen 5, 16 GB de RAM y 512 GB de SSD: rinde de sobra para estudiar, trabajar y el uso diario, y con esa memoria no se queda corta en un par de años. Si preferís Intel, la Lenovo V15 Gen 5 con Core i5; para jugar o editar video, la Lenovo LOQ o la Asus TUF Gaming A15, que traen placa de video dedicada.',
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
      { href: '/guias/que-notebook-comprar-black-friday-2026', texto: 'Guía: qué notebook comprar en Black Friday 2026' },
      { href: '/guias/que-notebook-comprar-black-friday', texto: 'Guía: procesador, RAM y SSD para el Black Friday' },
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
    respuestaCorta:
      'Si querés iPhone, el iPhone 16 de 128 GB es el equilibrio entre precio y años de actualizaciones. En Samsung, el Galaxy A56 5G de 256 GB es la gama media que más rinde y el Galaxy S26 FE suma prestaciones de gama alta sin llegar al S26 Ultra. Comprá a la tienda oficial o a un distribuidor autorizado, con factura y garantía en Argentina.',
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
      { href: '/guias/iphone-o-samsung-cual-conviene-argentina', texto: 'Guía: iPhone o Samsung, cuál conviene' },
      { href: '/comparador/celulares', texto: 'Comparador de celulares con filtros' },
      { href: '/mejores/black-friday-celulares-baratos', texto: 'Celulares baratos, hasta $400.000' },
    ],
  },
  {
    slug: 'black-friday-smart-tv',
    rubro: 'Smart TV',
    emoji: '📺',
    h1: 'Smart TV para el Black Friday 2026',
    titulo: 'Black Friday 2026 y Cyber Monday: smart TV en Argentina',
    descripcion:
      'Black Friday 2026 en Argentina (viernes 27/11): smart TV 4K Samsung, LG y Hisense de 50, 55 y 65 pulgadas (QLED, Mini LED y OLED), con link a Mercado Libre.',
    keywords: ['black friday 2026 smart tv argentina', 'smart tv black friday 2026', 'tv 55 pulgadas black friday', 'televisor black friday mercado libre'],
    intro:
      'Teles 4K de marcas conocidas, de 50 a 65 pulgadas. Arriba, la de 55" que más recomendamos para un living común.',
    respuestaCorta:
      'Para un living común, la Samsung 55" QLED Serie D: es 4K, a unos 2 metros del sillón 55 pulgadas es el tamaño justo y el QLED da más brillo y color que un LED común. Para consola, la Hisense 55" Mini LED 55U6QV, que tiene modo juego. Antes de comprar, confirmá que el sistema de la tele tenga las apps que usás.',
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
      { href: '/guias/que-tv-50-pulgadas-comprar-black-friday-2026', texto: 'Guía: qué TV de 50 pulgadas comprar' },
      { href: '/comparador/smart-tv', texto: 'Comparador de smart TV con filtros' },
      { href: '/mejores/mejores-tv-55-65-pulgadas', texto: 'Smart TV 65 pulgadas' },
      { href: '/precio-hoy/smart-tv-32-pulgadas', texto: 'Smart TV 32 pulgadas: precio hoy' },
    ],
  },
  {
    slug: 'black-friday-aires-acondicionados',
    rubro: 'Aires y verano',
    emoji: '❄️',
    h1: 'Aires acondicionados para el Black Friday 2026',
    titulo: 'Black Friday 2026 aires acondicionados Argentina',
    descripcion:
      'Black Friday 2026 en Argentina (viernes 27/11): aires split inverter frío/calor Samsung, LG, Philco y Hyundai para el verano, con link a Mercado Libre.',
    keywords: ['black friday 2026 aires acondicionados argentina', 'aire acondicionado black friday 2026', 'split inverter black friday', 'ofertas verano mercado libre'],
    intro:
      'Antes de que arranque el calor fuerte: splits inverter frío/calor de 2.500 a 4.500 frigorías. Arriba, el que más recomendamos para un ambiente de hasta 20 m².',
    respuestaCorta:
      'Para un ambiente de hasta 20 m², el Samsung split inverter frío/calor de 2580 frigorías: el inverter gasta menos luz y hace menos ruido si lo usás muchas horas. Para unos 30 m², el LG DualCool de 4500 frigorías. La instalación casi nunca viene incluida: sumala al presupuesto y pedí turno antes de enero.',
    items: [
      { id: 'MLA60932288', nombre: 'Samsung split inverter 2580 F', detalle: 'Frío/calor · inverter · 2580 frigorías', nota: 'El que recomendamos para hasta 20 m².' },
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
      { href: '/guias/mejores-aires-acondicionados-black-friday-2026', texto: 'Guía: mejores aires para el Black Friday 2026' },
      { href: '/guias/cuantas-frigorias-necesito-aire-acondicionado', texto: 'Guía: cuántas frigorías necesito' },
      { href: '/calculadora-frigorias', texto: 'Calculadora de frigorías' },
      { href: '/mejor/aires-acondicionados', texto: 'Guía: qué aire acondicionado comprar' },
      { href: '/calculadora-consumo-electrico', texto: 'Cuánta luz gasta un aire' },
    ],
  },
  {
    slug: 'black-friday-lavarropas',
    rubro: 'Lavarropas',
    emoji: '🧺',
    h1: 'Lavarropas para el Black Friday 2026',
    titulo: 'Black Friday 2026 lavarropas Argentina: cuál comprar',
    descripcion:
      'Black Friday 2026 en Argentina (viernes 27/11): lavarropas carga frontal y lavasecarropas Samsung, Drean, Electrolux, Philco y TCL, con link a Mercado Libre.',
    keywords: ['black friday 2026 lavarropas argentina', 'lavarropas black friday 2026', 'lavarropas cyber monday', 'lavarropas carga frontal black friday', 'lavasecarropas black friday'],
    intro:
      'Automáticos de marcas con service en Argentina, de 6 a 11 kg, y un lavasecarropas para cuando no hay dónde tender. Arriba, el que más recomendamos para una familia.',
    respuestaCorta:
      'Para una familia, el Samsung Ecobubble de 10,5 kg: alcanza para acolchados y lavados grandes. Para 1 a 3 personas, el Drean automático de 6 kg; si no tenés dónde tender, el lavasecarropas TCL inverter de 10/7 kg lava y seca en el mismo equipo. Medí el lugar antes de comprar y confirmá si el envío lo sube al piso.',
    items: [
      { id: 'MLA52816628', nombre: 'Samsung Ecobubble 10,5 kg', detalle: 'Ecobubble · 10,5 kg · blanco', nota: 'El que recomendamos para una familia.' },
      { id: 'MLA47076104', nombre: 'Drean carga frontal 10 kg', detalle: 'Carga frontal · 10 kg · blanco', nota: 'Misma capacidad, de Drean.' },
      { id: 'MLA64336388', nombre: 'Electrolux carga frontal 8,5 kg', detalle: 'Carga frontal · 8,5 kg · gris ónix', nota: 'Para 3 o 4 personas.' },
      { id: 'MLA65950656', nombre: 'Philco 11 kg Slim Fit', detalle: 'Carga frontal · inverter · 11 kg · blanco', nota: 'El de más capacidad de la lista.' },
      { id: 'MLA47905826', nombre: 'Drean automático 6 kg', detalle: 'Automático · 6 kg · blanco', nota: 'Para 1 a 3 personas.' },
      { id: 'MLA59107268', nombre: 'TCL lavasecarropas inverter 10/7 kg', detalle: 'Lava 10 kg y seca 7 kg · inverter', nota: 'Lava y seca en el mismo equipo.' },
    ],
    criterios: [
      'Kilos según la casa: 6 a 7 kg para 1 a 3 personas; 8 kg o más para una familia o si lavás acolchados.',
      'Carga frontal: gasta menos agua y centrifuga más fuerte; carga superior: más cómoda y, en general, más barata.',
      'Inverter si lavás seguido: hace menos ruido y vibra menos.',
      'Medí el lugar (ancho, profundidad y alto) y confirmá si el envío lo sube al piso.',
    ],
    faq: [
      { q: '¿Qué lavarropas conviene comprar en el Black Friday 2026?', a: 'Para una familia, un automático de 8 kg o más, como el Samsung Ecobubble de 10,5 kg de esta página. Para 1 a 3 personas alcanza uno de 6 kg, como el Drean. Si no tenés dónde tender, un lavasecarropas como el TCL de 10/7 kg.' },
      { q: '¿Cuándo es el Black Friday 2026 en Argentina?', a: 'El viernes 27 de noviembre de 2026. Cada tienda decide si se suma y por cuántos días.' },
      { q: '¿El precio es el mismo que en Mercado Libre?', a: 'Sí. Los botones llevan a la publicación de Mercado Libre con nuestro link de afiliado: pagás lo mismo que entrando directo. El precio puede cambiar, confirmalo ahí antes de comprar.' },
    ],
    busqueda: busquedaML('lavarropas automatico'),
    enlaces: [
      { href: '/guias/mejores-lavarropas-black-friday-2026', texto: 'Guía: mejores lavarropas para el Black Friday 2026' },
      { href: '/mejores/mejores-lavarropas', texto: 'Todos los lavarropas en oferta hoy' },
      { href: '/guias/lavarropas-carga-frontal-o-superior', texto: 'Carga frontal o superior' },
    ],
  },
  {
    slug: 'black-friday-cafeteras',
    rubro: 'Cafeteras',
    emoji: '☕',
    h1: 'Cafeteras para el Black Friday 2026',
    titulo: 'Black Friday 2026 cafeteras Argentina: espresso y cápsulas',
    descripcion:
      'Black Friday 2026 en Argentina (viernes 27/11): cafeteras espresso, de cápsulas y de filtro Philips, Oster, Nespresso y Dolce Gusto, con link a Mercado Libre.',
    keywords: ['black friday 2026 cafeteras argentina', 'cafetera black friday 2026', 'cafetera express cyber monday', 'cafetera oferta', 'cafetera espresso black friday'],
    intro:
      'Una de cada tipo, para elegir según cómo tomás el café: espresso automática, espresso manual, de cápsulas y de filtro. Arriba, la que más recomendamos.',
    respuestaCorta:
      'Si querés espresso y café con leche sin complicarte, la Philips Serie 2200 LatteGo: es automática y prepara el café con leche con su sistema LatteGo. Si priorizás la practicidad, la Nespresso Inissia con Aeroccino 3, de cápsulas; para hacer varias tazas juntas, la Suono de filtro de 1,8 L.',
    items: [
      { id: 'MLA18154570', nombre: 'Philips Serie 2200 LatteGo', detalle: 'Espresso automática · LatteGo · 1,8 L', nota: 'La que recomendamos si querés espresso y café con leche sin complicarte.' },
      { id: 'MLA59887976', nombre: 'Oster PrimaLatte', detalle: 'Espresso automática · 15 bares', nota: 'Otra automática, de Oster.' },
      { id: 'MLA73112539', nombre: 'Suono Slim Digital', detalle: 'Espresso · 20 bares · vaporizador de leche · 1,2 L', nota: 'Espresso manual, compacta.' },
      { id: 'MLA19920468', nombre: 'Nespresso Inissia + Aeroccino 3', detalle: 'Cápsulas Nespresso · con espumador de leche', nota: 'La más práctica: cápsula y botón.' },
      { id: 'MLA63853117', nombre: 'Dolce Gusto Genio S', detalle: 'Cápsulas Dolce Gusto · blanca', nota: 'Otra de cápsulas, de Dolce Gusto.' },
      { id: 'MLA69661898', nombre: 'Suono de filtro digital 1,8 L', detalle: 'Filtro · 12 tazas · programable', nota: 'Para hacer varias tazas juntas.' },
    ],
    criterios: [
      'Tipo según cómo tomás el café: de filtro para varias tazas, espresso si te gusta concentrado, de cápsulas si priorizás la practicidad.',
      'Espresso: fijate si trae vaporizador para la leche y si usa café molido o en grano.',
      'Cápsulas: la máquina es barata, pero cada taza sale más cara; confirmá qué cápsulas usa.',
    ],
    faq: [
      { q: '¿Qué cafetera conviene comprar en el Black Friday 2026?', a: 'Si querés espresso y café con leche con un botón, una automática como la Philips Serie 2200 LatteGo. Si priorizás la practicidad, una de cápsulas como la Nespresso Inissia. Para varias tazas juntas, una de filtro como la Suono de 1,8 L.' },
      { q: '¿Cuándo es el Black Friday 2026 en Argentina?', a: 'El viernes 27 de noviembre de 2026. Cada tienda decide si se suma y por cuántos días.' },
      { q: '¿El precio es el mismo que en Mercado Libre?', a: 'Sí. Los botones llevan a la publicación de Mercado Libre con nuestro link de afiliado: pagás lo mismo que entrando directo. El precio puede cambiar, confirmalo ahí antes de comprar.' },
    ],
    busqueda: busquedaML('cafetera espresso'),
    enlaces: [
      { href: '/guias/que-cafetera-comprar', texto: 'Guía: qué cafetera comprar' },
      { href: '/guias/black-friday-argentina-que-conviene-comprar', texto: 'Guía: qué conviene comprar en el Black Friday' },
      { href: '/mejores/mejores-cafeteras', texto: 'Todas las cafeteras en oferta hoy' },
    ],
  },
  {
    slug: 'black-friday-bicicletas',
    rubro: 'Bicicletas',
    emoji: '🚲',
    h1: 'Bicicletas rodado 29 para el Black Friday 2026',
    titulo: 'Black Friday 2026 bicicletas R29 Argentina: cuál',
    descripcion:
      'Black Friday 2026 en Argentina (viernes 27/11): mountain bikes rodado 29 Battle, SLP, Overtech, Alpina y Gariotti elegidas, con link directo a Mercado Libre.',
    keywords: ['black friday 2026 bicicletas argentina', 'bicicleta r29 black friday 2026', 'mountain bike black friday', 'bicicleta mercado libre black friday'],
    intro:
      'Mountain bikes rodado 29 para tierra, ripio y calles rotas, todas de aluminio. Arriba, la que más recomendamos; abajo, otras R29 de varias marcas y talles.',
    respuestaCorta:
      'Para tierra, ripio y calles rotas, la Battle R29 de aluminio con monoplato Shimano: es simple de usar y de mantener. Si querés más cambios para las subidas, una de 21 velocidades con freno a disco, como la Overtech Q6 o la Alpina 3.0. Elegí el talle de cuadro por tu altura con la tabla de cada publicación, antes que por el rodado.',
    items: [
      { id: 'MLA53194352', nombre: 'Bicicleta MTB Battle R29', detalle: 'Aluminio · monoplato Shimano 8 velocidades · talle 16', nota: 'La que recomendamos: monoplato, simple de usar y de mantener.' },
      { id: 'MLA51766931', nombre: 'SLP MTB 10 Pro R29', detalle: 'Aluminio · Shimano 21 velocidades · cuadro 21', nota: 'Cuadro grande, para gente alta.' },
      { id: 'MLA47640884', nombre: 'Overtech Fortis R29', detalle: 'Aluminio · full Shimano · talle M' },
      { id: 'MLA44916984', nombre: 'Overtech Q6 R29', detalle: 'Aluminio · 21 velocidades · freno a disco · talle S', nota: 'Cuadro chico.' },
      { id: 'MLA2316228782', nombre: 'Alpina 3.0 R29', detalle: 'Aluminio · Shimano 21 velocidades · freno a disco' },
      { id: 'MLA59672753', nombre: 'Gariotti R29', detalle: 'Aluminio · Shimano 21 velocidades · disco · suspensión · talle M' },
    ],
    criterios: [
      'Talle de cuadro según tu altura: está en la tabla de talles de cada publicación y pesa más que el rodado.',
      'Freno a disco: frena mejor con lluvia y en bajada que el V-brake.',
      'Monoplato es más simple de usar y de mantener; 21 velocidades da más cambios para subidas.',
      'Fijate si llega armada o hay que terminar de armarla (manubrio, pedales, ajuste de frenos).',
    ],
    faq: [
      { q: '¿Qué bicicleta conviene comprar en el Black Friday 2026?', a: 'Para andar por tierra, ripio y calles rotas, una mountain bike rodado 29 de aluminio, como la Battle R29 monoplato de esta página. Si querés más cambios para subidas, una de 21 velocidades con freno a disco, como la Overtech Q6 o la Alpina 3.0.' },
      { q: '¿Qué talle de cuadro necesito?', a: 'Depende de tu altura: cada publicación trae la tabla de talles del fabricante (S, M, L, XL o en pulgadas). Elegí por esa tabla antes que por el rodado.' },
      { q: '¿El precio es el mismo que en Mercado Libre?', a: 'Sí. Los botones llevan a la publicación de Mercado Libre con nuestro link de afiliado: pagás lo mismo que entrando directo. El precio puede cambiar, confirmalo ahí antes de comprar.' },
    ],
    busqueda: busquedaML('bicicleta mtb rodado 29'),
    enlaces: [
      { href: '/guias/que-bicicleta-comprar-black-friday', texto: 'Guía: qué bicicleta comprar en el Black Friday' },
      { href: '/guias/que-bicicleta-comprar', texto: 'Guía: qué bicicleta comprar' },
    ],
  },
  {
    slug: 'black-friday-heladeras',
    rubro: 'Heladeras',
    emoji: '🧊',
    h1: 'Heladeras para el Black Friday 2026',
    titulo: 'Black Friday 2026 heladeras Argentina: no frost e inverter',
    descripcion:
      'Black Friday 2026 en Argentina (viernes 27/11): heladeras no frost e inverter Gafa, Philco, Electrolux y Samsung, de 244 a 523 litros, con link a ML.',
    keywords: ['black friday 2026 heladeras argentina', 'heladera black friday 2026', 'heladera no frost black friday', 'heladera inverter mercado libre black friday'],
    intro:
      'Heladeras con freezer de marcas con service en Argentina, de 244 a 523 litros. Arriba, la que más recomendamos para una familia de 3 o 4 personas.',
    respuestaCorta:
      'Para una familia de 3 o 4 personas, la Gafa HGNF340P de 350 litros: es no frost, así que no junta hielo, y el motor inverter gasta menos luz y hace menos ruido. Para 1 o 2 personas alcanza una de unos 250 litros, como la Philco de 244 litros; para familias grandes, la Electrolux Multidoor de 523 litros. Antes de comprar, medí el hueco y fijate para qué lado abre la puerta.',
    items: [
      { id: 'MLA75812333', nombre: 'Gafa HGNF340P 350 L', detalle: 'No frost · inverter · con freezer · 350 litros', nota: 'La que recomendamos para una familia de 3 o 4 personas.' },
      { id: 'MLA76009709', nombre: 'Philco NPHNC304P 299 L', detalle: 'No frost · freezer abajo · 299 litros · plata', nota: 'Freezer abajo: lo que más usás queda a la altura de la vista.' },
      { id: 'MLA82629454', nombre: 'Smartlife Combi 313 L', detalle: 'No frost · inverter · combi · 313 litros · inox' },
      { id: 'MLA61746423', nombre: 'Electrolux Multidoor IM7S 523 L', detalle: 'No frost · inverter · multidoor · 523 litros', nota: 'Para familias grandes.' },
      { id: 'MLA79807332', nombre: 'Samsung French Door RF44A5101S9 431 L', detalle: 'French door · 431 litros', nota: 'Puertas dobles, para cocinas amplias.' },
      { id: 'MLA75795585', nombre: 'Philco NPHCT260B 244 L', detalle: 'Con freezer · 244 litros · blanca', nota: 'Para 1 o 2 personas.' },
      // 26/11 (bf-ventas-2611): no frost inverter con precio visto el 25 y el 26/11 en los datos del repo.
      { id: 'MLA46219969', nombre: 'Midea Top Mount 412 L', detalle: 'No frost · inverter · freezer arriba · 412 litros · blanca', nota: 'Otra para familia, con más litros.' },
      { id: 'MLA58200691', nombre: 'Samsung RT42CG6720S9 407 L', detalle: 'Inverter · dispenser · 407 litros · inox', nota: 'Con dispenser de agua.' },
    ],
    criterios: [
      'Litros según la casa: unos 250 para 1 o 2 personas; 300 a 400 para una familia; más de 450 si son muchos o comprás para el mes.',
      'No frost: no junta hielo ni hay que descongelarla. Inverter: gasta menos luz y hace menos ruido.',
      'Medí el hueco (alto, ancho y profundidad) y dejá unos centímetros atrás y arriba para que ventile.',
      'Confirmá si el envío la sube al piso y si se llevan la heladera vieja.',
    ],
    faq: [
      { q: '¿Qué heladera conviene comprar en el Black Friday 2026?', a: 'Para una familia de 3 o 4 personas, una no frost de 300 a 400 litros, como la Gafa HGNF340P de 350 litros de esta página. Para 1 o 2 personas alcanza una de unos 250 litros, como la Philco de 244 litros.' },
      { q: '¿Cuántos litros de heladera necesito?', a: 'Como referencia, unos 250 litros para 1 o 2 personas, 300 a 400 para una familia de 3 o 4, y más de 450 si son más o comprás para todo el mes.' },
      { q: '¿Conviene una heladera no frost o una cíclica?', a: 'La no frost no junta hielo y conserva parejo en todo el freezer; la cíclica es más simple y suele ser más barata, pero hay que descongelarla cada tanto. Si la usás mucho, la no frost te ahorra trabajo.' },
      { q: '¿Qué es una heladera inverter?', a: 'Una con motor que ajusta la velocidad en vez de prenderse y apagarse a fondo: gasta menos luz y hace menos ruido. Conviene sobre todo si la heladera va a estar muchos años.' },
      { q: '¿Cuándo es el Black Friday 2026 en Argentina?', a: 'El viernes 27 de noviembre de 2026. Cada tienda decide si se suma y por cuántos días.' },
      { q: '¿El precio es el mismo que en Mercado Libre?', a: 'Sí. Los botones llevan a la publicación de Mercado Libre con nuestro link de afiliado: pagás lo mismo que entrando directo. El precio puede cambiar, confirmalo ahí antes de comprar.' },
    ],
    busqueda: busquedaML('heladera no frost'),
    enlaces: [
      { href: '/guias/que-heladera-comprar-black-friday-2026', texto: 'Guía: qué heladera comprar en Black Friday 2026' },
      { href: '/guias/que-heladera-comprar', texto: 'Guía: qué heladera comprar' },
      { href: '/guias/heladera-cuantos-litros-necesito', texto: 'Guía: cuántos litros de heladera necesito' },
      { href: '/guias/heladera-no-frost-o-con-freezer', texto: 'Guía: heladera no frost o con freezer' },
      { href: '/mejores/mejores-heladeras-no-frost', texto: 'Heladeras no frost en oferta hoy' },
      { href: '/mejores/black-friday-lavarropas', texto: 'Lavarropas para el Black Friday 2026' },
    ],
  },
  {
    slug: 'black-friday-celulares-baratos',
    rubro: 'Celulares baratos',
    emoji: '📲',
    h1: 'Celulares baratos para el Black Friday 2026 (hasta $400.000)',
    titulo: 'Black Friday 2026: celulares hasta $400.000 en Argentina',
    descripcion:
      'Black Friday 2026 en Argentina (viernes 27/11): celulares Motorola, Samsung, Xiaomi y ZTE de hasta $400.000, con 128 o 256 GB, con link a Mercado Libre.',
    keywords: ['black friday 2026 celulares baratos argentina', 'celular barato black friday 2026', 'celular hasta 400000', 'celular gama de entrada black friday', 'moto g15 black friday'],
    intro:
      'Celulares de hasta $400.000 de marcas conocidas, todos con 128 GB de memoria o más. Arriba, el que más recomendamos para la mayoría.',
    respuestaCorta:
      'Para la mayoría, el Motorola Moto G15 Power de 256 GB y 8 GB de RAM: en este rango es el que más memoria trae, así que entran fotos, videos y apps sin andar borrando. Si preferís Samsung, el Galaxy A17 o el Galaxy A16 de 128 GB; si querés pantalla grande, el ZTE Blade V80 Max de 256 GB. Comprá a la tienda oficial o a un vendedor con factura y garantía en Argentina.',
    items: [
      { id: 'MLA65683670', nombre: 'Motorola Moto G15 Power', detalle: '256 GB · 8 GB de RAM · verde', nota: 'El que recomendamos: la mayor memoria de la lista.' },
      { id: 'MLA62751899', nombre: 'Samsung Galaxy A17', detalle: '128 GB · 4 GB de RAM · negro', nota: 'El Samsung más nuevo de la lista.' },
      { id: 'MLA66345012', nombre: 'Samsung Galaxy A16', detalle: '128 GB · 4 GB de RAM · gris', nota: 'Otro Samsung, un modelo anterior.' },
      { id: 'MLA76204388', nombre: 'Motorola Moto G17', detalle: '128 GB · 4 GB de RAM · azul' },
      { id: 'MLA45605578', nombre: 'Xiaomi Redmi 14C', detalle: '256 GB · 8 GB de RAM (4 + 4 virtuales) · dual SIM', nota: 'La opción de Xiaomi, con 256 GB.' },
      { id: 'MLA75083957', nombre: 'ZTE Blade V80 Max', detalle: '256 GB · pantalla de 6,9" · NFC', nota: 'Pantalla grande y NFC para pagar con el celular.' },
    ],
    criterios: [
      'Memoria: 128 GB o más; 256 GB si sacás muchas fotos y videos.',
      'RAM: 4 GB alcanza para WhatsApp, redes y banco; 8 GB anda más suelto con muchas apps abiertas.',
      'NFC si querés pagar con el celular en el comercio.',
      'Comprá a la tienda oficial o a un vendedor con factura y garantía en Argentina.',
    ],
    faq: [
      { q: '¿Qué celular barato conviene comprar en el Black Friday 2026?', a: 'Para la mayoría, el Motorola Moto G15 Power de 256 GB y 8 GB de RAM de esta página. Si preferís Samsung, el Galaxy A17 o el A16 de 128 GB.' },
      { q: '¿Cuántos GB necesita un celular?', a: '128 GB alcanzan para la mayoría; si sacás muchas fotos y videos o no querés andar borrando, mejor 256 GB. De RAM, 4 GB para un uso común y 8 GB si usás muchas apps a la vez.' },
      { q: '¿Conviene un Motorola o un Samsung barato?', a: 'Los dos tienen service en Argentina. En este rango, Motorola suele dar más memoria por el mismo precio y Samsung, más años de actualizaciones: elegí según qué te importa más.' },
      { q: '¿Cuándo es el Black Friday 2026 en Argentina?', a: 'El viernes 27 de noviembre de 2026. Cada tienda decide si se suma y por cuántos días.' },
      { q: '¿El precio es el mismo que en Mercado Libre?', a: 'Sí. Los botones llevan a la publicación de Mercado Libre con nuestro link de afiliado: pagás lo mismo que entrando directo. El precio puede cambiar, confirmalo ahí antes de comprar.' },
    ],
    busqueda: busquedaML('celular 128gb'),
    enlaces: [
      { href: '/guias/que-celular-comprar-segun-presupuesto', texto: 'Guía: qué celular comprar según tu presupuesto' },
      { href: '/guias/cuantos-gb-necesito-celular', texto: 'Guía: cuántos GB necesito en el celular' },
      { href: '/guias/celular-con-mejor-bateria', texto: 'Guía: celulares con mejor batería' },
      { href: '/mejores/black-friday-celulares', texto: 'iPhone y Samsung Galaxy para el Black Friday' },
      { href: '/comparador/celulares', texto: 'Comparador de celulares con filtros' },
    ],
  },
  {
    slug: 'black-friday-gaming',
    rubro: 'Gaming',
    emoji: '🎮',
    h1: 'PC gamer y monitores para el Black Friday 2026',
    titulo: 'Black Friday 2026 gaming Argentina: PC gamer y monitores',
    descripcion:
      'Black Friday 2026 en Argentina (viernes 27/11): PC gamer armadas, monitores LG, Xiaomi y KTC de 144 a 240 Hz y la notebook Lenovo LOQ, con link a ML.',
    keywords: ['black friday 2026 gaming argentina', 'pc gamer black friday 2026', 'monitor gamer black friday', 'black friday gamer mercado libre', 'notebook gamer black friday'],
    intro:
      'Para armar el puesto de juego: PC gamer armadas, monitores de 144 a 240 Hz y una notebook gamer. Arriba, la PC que más recomendamos para empezar.',
    respuestaCorta:
      'Para empezar a jugar en serio sin gastar de más, la PC Gamer Compufan con Ryzen 7 5700G, 16 GB de RAM y placa de video RX 580 de 8 GB: la placa dedicada mueve juegos que los gráficos integrados no aguantan. Para acompañarla, un monitor de 144 Hz o más, como el LG UltraGear de 24" a 180 Hz. Si necesitás llevarla a todos lados, la notebook Lenovo LOQ con RTX 4050.',
    items: [
      { id: 'MLA65739116', nombre: 'PC Gamer Compufan Ryzen 7', detalle: 'Ryzen 7 5700G · 16 GB de RAM · RX 580 8 GB · SSD 480 GB', nota: 'La que recomendamos: placa de video dedicada.' },
      { id: 'MLA43957281', nombre: 'Monitor LG UltraGear 24GS60F', detalle: '24" · Full HD · 180 Hz', nota: 'El monitor que recomendamos para la mayoría.' },
      { id: 'MLA80767524', nombre: 'Monitor Xiaomi G25i', detalle: '25" · IPS · Full HD · 240 Hz · FreeSync Premium', nota: 'Para juegos competitivos.' },
      { id: 'MLA80311332', nombre: 'Monitor KTC 27DQ721', detalle: '27" · 2K QHD · 144 Hz · FreeSync Premium', nota: 'Más grande y con más resolución.' },
      { id: 'MLA73027866', nombre: 'PC Gamer Gaming City Ryzen 7 8700G', detalle: 'Ryzen 7 8700G · AM5 · 16 GB DDR5 · SSD 960 GB', nota: 'Plataforma nueva (AM5), lista para sumarle placa de video después.' },
      { id: 'MLA78830231', nombre: 'Notebook Lenovo LOQ', detalle: 'Ryzen 7 · 16 GB · 512 GB SSD · RTX 4050 · 15,6" Full HD', nota: 'Si la necesitás portátil.' },
    ],
    criterios: [
      'Placa de video dedicada (RX, RTX) para juegos nuevos; los gráficos integrados alcanzan para juegos livianos.',
      'Monitor: 144 Hz o más para juegos competitivos; 2K desde 27".',
      'Fijate qué incluye la PC (monitor, teclado, mouse, Windows) antes de comparar.',
      'PC de escritorio: más potencia por la misma plata y se puede mejorar; notebook: la llevás a todos lados.',
    ],
    faq: [
      { q: '¿Qué PC gamer conviene comprar en el Black Friday 2026?', a: 'Para empezar, una con placa de video dedicada y 16 GB de RAM, como la PC Gamer Compufan con Ryzen 7 5700G y RX 580 de esta página. Sin placa dedicada, solo vas a poder jugar títulos livianos.' },
      { q: '¿Qué monitor gamer conviene?', a: 'Para la mayoría, uno de 24" Full HD de 144 Hz o más, como el LG UltraGear de 180 Hz. Para juegos competitivos, 240 Hz como el Xiaomi G25i; si querés más pantalla, uno de 27" 2K como el KTC.' },
      { q: '¿PC de escritorio o notebook gamer?', a: 'La de escritorio da más potencia por la misma plata y se puede mejorar de a partes. La notebook gamer, como la Lenovo LOQ, conviene si la necesitás llevar a la facu, al trabajo o de viaje.' },
      { q: '¿Hay consolas en esta página?', a: 'Hoy no: esta lista es de PC, monitores y notebook gamer. Para elegir consola, mirá la guía de qué consola comprar en el Black Friday.' },
      { q: '¿Cuándo es el Black Friday 2026 en Argentina?', a: 'El viernes 27 de noviembre de 2026. Cada tienda decide si se suma y por cuántos días.' },
      { q: '¿El precio es el mismo que en Mercado Libre?', a: 'Sí. Los botones llevan a la publicación de Mercado Libre con nuestro link de afiliado: pagás lo mismo que entrando directo. El precio puede cambiar, confirmalo ahí antes de comprar.' },
    ],
    busqueda: busquedaML('pc gamer'),
    enlaces: [
      { href: '/guias/que-monitor-gamer-comprar', texto: 'Guía: qué monitor gamer comprar' },
      { href: '/guias/pc-de-escritorio-o-notebook', texto: 'Guía: PC de escritorio o notebook' },
      { href: '/guias/que-notebook-gamer-comprar', texto: 'Guía: qué notebook gamer comprar' },
      { href: '/guias/que-consola-comprar-black-friday', texto: 'Guía: qué consola comprar en el Black Friday' },
      { href: '/mejores/mejores-monitores-gamer', texto: 'Monitores gamer en oferta hoy' },
      { href: '/mejores/black-friday-notebooks', texto: 'Notebooks para el Black Friday 2026' },
    ],
  },
  // ── Lote del 24/11/2026 (bf-conv-2411): rubros que faltaban, con productos del catálogo vistos
  //    entre el 18 y el 24/11. Zapatillas quedó afuera (sin guías del rubro para enlazar, talle por
  //    publicación); monitores ya están en black-friday-gaming.
  {
    slug: 'black-friday-freidoras-de-aire',
    rubro: 'Freidoras de aire',
    emoji: '🍟',
    h1: 'Freidoras de aire para el Black Friday 2026',
    titulo: 'Black Friday 2026 freidoras de aire Argentina: cuál comprar',
    descripcion:
      'Black Friday y Cyber Monday 2026 en Argentina: freidoras de aire Philips, Electrolux, Cuisinart, Peabody y Atma de 4,5 a 12 litros, con link a Mercado Libre.',
    keywords: ['black friday 2026 freidoras de aire argentina', 'freidora de aire black friday 2026', 'airfryer black friday', 'freidora de aire cyber monday', 'freidora de aire mercado libre black friday'],
    intro:
      'Freidoras de aire de marcas conocidas, de 4,5 a 12 litros, para cocinar sin aceite. Arriba, la que más recomendamos para una familia de 3 o 4 personas.',
    respuestaCorta:
      'Para una familia de 3 o 4 personas, la Philips XL Series de 6,2 litros: alcanza para cocinar para todos de una vez y es de una marca con service en Argentina. Si son más o querés hacer dos cosas al mismo tiempo, la Novohome de doble canasto (6 + 6 litros); para 1 o 2 personas alcanza una de 4,5 litros, como la Daewoo DAF1857.',
    items: [
      { id: 'MLA54262263', nombre: 'Philips XL Series 6,2 L', detalle: 'Freidora de aire · 6,2 litros · negra · PHNA13000', nota: 'La que recomendamos para una familia de 3 o 4 personas.' },
      { id: 'MLA23078273', nombre: 'Electrolux Experience EAF90 12 L', detalle: 'Freidora de aire · 12 litros · grafito', nota: 'Grande: para familias numerosas.' },
      { id: 'MLA51421298', nombre: 'Novohome doble canasto 12 L', detalle: 'Dos canastos de 6 litros · panel táctil', nota: 'Dos comidas distintas al mismo tiempo.' },
      { id: 'MLA66543250', nombre: 'Cuisinart AIR700AR 7 L', detalle: 'Freidora de aire · 7 litros · 1700 W · gris' },
      { id: 'MLA41829394', nombre: 'Peabody PE-AFD720N 7,2 L', detalle: '7,2 litros · visor · 11 programas · negra', nota: 'Con visor para ver la comida sin abrir.' },
      { id: 'MLA27351841', nombre: 'Atma Pro FR60AR 6,5 L', detalle: 'Digital · 6,5 litros · blanca' },
      { id: 'MLA24096771', nombre: 'Daewoo DAF1857 4,5 L', detalle: '4,5 litros · 1400 W · negra', nota: 'Para 1 o 2 personas.' },
    ],
    criterios: [
      'Litros según la casa: 3 a 4,5 para 1 o 2 personas; 6 a 7 para una familia; 10 o más (o doble canasto) si son muchos.',
      'Canasto antiadherente que se pueda lavar fácil (mejor si va al lavavajillas).',
      'Visor y panel digital con programas son cómodos, pero no hacen falta para cocinar bien.',
      'Mirá las medidas: las de 10 litros o más ocupan bastante mesada.',
    ],
    faq: [
      { q: '¿Qué freidora de aire conviene comprar en el Black Friday 2026?', a: 'Para una familia de 3 o 4 personas, una de 6 a 7 litros como la Philips XL Series de 6,2 litros de esta página. Si son más, una de 12 litros o de doble canasto; para 1 o 2 personas alcanza una de 4,5 litros.' },
      { q: '¿Cuántos litros de freidora de aire necesito?', a: 'Como referencia, 3 a 4,5 litros para 1 o 2 personas, 6 a 7 litros para una familia de 3 o 4 y 10 litros o más si cocinás para muchos o querés hacer un pollo entero.' },
      { q: '¿Cuándo es el Black Friday 2026 en Argentina?', a: 'El viernes 27 de noviembre de 2026. Cada tienda decide si se suma y por cuántos días.' },
      { q: '¿El precio es el mismo que en Mercado Libre?', a: 'Sí. Los botones llevan a la publicación de Mercado Libre con nuestro link de afiliado: pagás lo mismo que entrando directo. El precio puede cambiar, confirmalo ahí antes de comprar.' },
    ],
    busqueda: busquedaML('freidora de aire'),
    enlaces: [
      { href: '/guias/que-freidora-de-aire-comprar-black-friday-2026', texto: 'Guía: qué freidora de aire comprar en Black Friday 2026' },
      { href: '/guias/freidora-de-aire-cuantos-litros-conviene', texto: 'Guía: cuántos litros de freidora conviene' },
      { href: '/guias/que-freidora-de-aire-comprar', texto: 'Guía: qué freidora de aire comprar' },
      { href: '/mejores/mejores-freidoras-de-aire', texto: 'Freidoras de aire en oferta hoy' },
      { href: '/mejores/black-friday-cafeteras', texto: 'Cafeteras para el Black Friday 2026' },
    ],
  },
  {
    slug: 'black-friday-auriculares',
    rubro: 'Auriculares',
    emoji: '🎧',
    h1: 'Auriculares para el Black Friday 2026',
    titulo: 'Black Friday 2026 auriculares Argentina: cuáles comprar',
    descripcion:
      'Black Friday y Cyber Monday 2026 en Argentina: auriculares Sony, Apple AirPods, Samsung Galaxy Buds, Soundcore y Redmi, in-ear y de vincha, con link a ML.',
    keywords: ['black friday 2026 auriculares argentina', 'auriculares black friday 2026', 'airpods black friday argentina', 'auriculares bluetooth cyber monday', 'auriculares cancelacion de ruido black friday'],
    intro:
      'Auriculares inalámbricos de marcas conocidas: in-ear para salir y entrenar, y de vincha para viajar o trabajar muchas horas. Arriba, los que más recomendamos para la mayoría.',
    respuestaCorta:
      'Para la mayoría, los Sony WF-C710N: son in-ear inalámbricos con cancelación de ruido, que es lo que más se nota en el colectivo o en la oficina. Si tenés iPhone, los Apple AirPods 4 con cancelación de ruido; si preferís de vincha, los Soundcore Space One también cancelan ruido y los Sony WH-CH520 son los más simples y livianos.',
    items: [
      { id: 'MLA48785783', nombre: 'Sony WF-C710N', detalle: 'In-ear · bluetooth · cancelación de ruido · azul', nota: 'Los que recomendamos para la mayoría.' },
      { id: 'MLA40520105', nombre: 'Apple AirPods 4 con cancelación de ruido', detalle: 'In-ear · cancelación activa de ruido', nota: 'Los que mejor se llevan con un iPhone.' },
      { id: 'MLA54106888', nombre: 'Apple AirPods Pro 3', detalle: 'In-ear · cancelación de ruido · blancos', nota: 'Los AirPods más completos.' },
      { id: 'MLA58012436', nombre: 'Samsung Galaxy Buds3 FE', detalle: 'In-ear · cancelación activa de ruido', nota: 'Para celulares Samsung.' },
      { id: 'MLA29041007', nombre: 'Soundcore Space One', detalle: 'Vincha (over-ear) · cancelación de ruido · LDAC', nota: 'De vincha, para viajar.' },
      { id: 'MLA23138487', nombre: 'Sony WH-CH520', detalle: 'Vincha (on-ear) · bluetooth · negros', nota: 'De vincha, simples y livianos.' },
      { id: 'MLA73944450', nombre: 'Xiaomi Redmi Buds 8', detalle: 'In-ear · bluetooth · negros', nota: 'Los más baratos de la lista.' },
    ],
    criterios: [
      'Formato: in-ear para salir y entrenar; de vincha para viajar y trabajar muchas horas.',
      'Cancelación activa de ruido (ANC) si viajás en colectivo, subte o avión: es lo que más se nota.',
      'Batería: mirá las horas con y sin cancelación de ruido, y cuánto suma el estuche.',
      'Con iPhone, los AirPods se conectan y cambian de equipo solos; con Samsung, los Galaxy Buds.',
    ],
    faq: [
      { q: '¿Qué auriculares conviene comprar en el Black Friday 2026?', a: 'Para la mayoría, unos in-ear inalámbricos con cancelación de ruido, como los Sony WF-C710N de esta página. Con iPhone, los AirPods 4 con cancelación de ruido; si preferís de vincha, los Soundcore Space One.' },
      { q: '¿Vale la pena la cancelación de ruido?', a: 'Si viajás en colectivo, subte o avión, o trabajás en un lugar con ruido, sí: es lo que más cambia la experiencia. Para usarlos en casa o para entrenar, no hace falta.' },
      { q: '¿Cuándo es el Black Friday 2026 en Argentina?', a: 'El viernes 27 de noviembre de 2026. Cada tienda decide si se suma y por cuántos días.' },
      { q: '¿El precio es el mismo que en Mercado Libre?', a: 'Sí. Los botones llevan a la publicación de Mercado Libre con nuestro link de afiliado: pagás lo mismo que entrando directo. El precio puede cambiar, confirmalo ahí antes de comprar.' },
    ],
    busqueda: busquedaML('auriculares bluetooth cancelacion de ruido'),
    enlaces: [
      { href: '/guias/que-auriculares-comprar', texto: 'Guía: qué auriculares comprar' },
      { href: '/guias/auriculares-con-cancelacion-de-ruido-vale-la-pena', texto: 'Guía: ¿vale la pena la cancelación de ruido?' },
      { href: '/guias/auriculares-open-ear-o-in-ear', texto: 'Guía: auriculares open ear o in-ear' },
      { href: '/mejores/mejores-auriculares', texto: 'Auriculares en oferta hoy' },
      { href: '/mejores/black-friday-smartwatch', texto: 'Smartwatch para el Black Friday 2026' },
    ],
  },
  {
    slug: 'black-friday-tablets',
    rubro: 'Tablets',
    emoji: '🖼️',
    h1: 'Tablets para el Black Friday 2026',
    titulo: 'Black Friday 2026 tablets Argentina: Samsung, iPad y Xiaomi',
    descripcion:
      'Black Friday y Cyber Monday 2026 en Argentina: tablets Samsung Galaxy Tab, iPad, Xiaomi Redmi Pad y Lenovo Idea Tab elegidas, con link a Mercado Libre.',
    keywords: ['black friday 2026 tablets argentina', 'tablet black friday 2026', 'ipad black friday argentina', 'galaxy tab black friday', 'tablet cyber monday'],
    intro:
      'Tablets de marcas con service en Argentina, de 8,7 a 13 pulgadas, para series, estudio y videollamadas. Arriba, la que más recomendamos para la mayoría.',
    respuestaCorta:
      'Para la mayoría, la Samsung Galaxy Tab S10 Lite de 128 GB y 6 GB de RAM: pantalla de 10,9 pulgadas para series, estudio y videollamadas, de una marca con service en Argentina. Si usás iPhone, el iPad 11 (A16) de 128 GB; si querés más memoria por menos, la Xiaomi Redmi Pad 7 de 256 GB y 8 GB de RAM.',
    items: [
      { id: 'MLA61965090', nombre: 'Samsung Galaxy Tab S10 Lite', detalle: '128 GB · 6 GB de RAM · 10,9"', nota: 'La que recomendamos para la mayoría.' },
      { id: 'MLA57493504', nombre: 'Apple iPad 11 (A16)', detalle: '11" · 128 GB · 6 GB de RAM · rosa', nota: 'Si ya usás iPhone.' },
      { id: 'MLA50195168', nombre: 'Xiaomi Redmi Pad 7', detalle: '11,2" · 256 GB · 8 GB de RAM · gris', nota: 'La que más memoria trae de la lista.' },
      { id: 'MLA61753207', nombre: 'Lenovo Idea Tab 11 2.5K', detalle: '128 GB · 8 GB de RAM · con lápiz y funda', nota: 'Viene con lápiz: para tomar apuntes.' },
      { id: 'MLA59138771', nombre: 'Samsung Galaxy Tab S10 FE+', detalle: '13,1" · 128 GB · 8 GB de RAM · con lápiz', nota: 'Pantalla grande, para dibujar o trabajar.' },
      { id: 'MLA65189679', nombre: 'Samsung Galaxy Tab A11', detalle: '8,7" · 64 GB · 4 GB de RAM · wifi', nota: 'Chica y barata: para leer o para chicos.' },
    ],
    criterios: [
      'Pantalla: 8 a 9 pulgadas para leer y llevar; 10 a 11 para series y estudio; 12 o más para dibujar o trabajar.',
      'Memoria: 128 GB y 6 u 8 GB de RAM si la vas a usar para estudiar o con muchas apps.',
      'Lápiz: algunas lo traen en la caja; si lo vas a usar, sumalo a la cuenta.',
      'Con chip (LTE o 5G) solo si la vas a usar fuera de casa sin wifi.',
    ],
    faq: [
      { q: '¿Qué tablet conviene comprar en el Black Friday 2026?', a: 'Para la mayoría, una de 10 u 11 pulgadas con 128 GB, como la Samsung Galaxy Tab S10 Lite de esta página. Si usás iPhone, el iPad 11 (A16); si querés más memoria por menos, la Xiaomi Redmi Pad 7.' },
      { q: '¿Tablet o notebook?', a: 'La tablet es mejor para series, leer, videollamadas y tomar apuntes con lápiz. Si vas a escribir mucho, usar programas de oficina o de la facultad, conviene una notebook.' },
      { q: '¿Cuándo es el Black Friday 2026 en Argentina?', a: 'El viernes 27 de noviembre de 2026. Cada tienda decide si se suma y por cuántos días.' },
      { q: '¿El precio es el mismo que en Mercado Libre?', a: 'Sí. Los botones llevan a la publicación de Mercado Libre con nuestro link de afiliado: pagás lo mismo que entrando directo. El precio puede cambiar, confirmalo ahí antes de comprar.' },
    ],
    busqueda: busquedaML('tablet 128gb'),
    enlaces: [
      { href: '/guias/que-tablet-comprar-black-friday-2026', texto: 'Guía: qué tablet comprar en Black Friday 2026' },
      { href: '/guias/que-tablet-comprar', texto: 'Guía: qué tablet comprar' },
      { href: '/guias/tablet-o-notebook-cual-conviene', texto: 'Guía: tablet o notebook, cuál conviene' },
      { href: '/mejores/mejores-tablets', texto: 'Tablets en oferta hoy' },
      { href: '/mejores/black-friday-notebooks', texto: 'Notebooks para el Black Friday 2026' },
    ],
  },
  {
    slug: 'black-friday-smartwatch',
    rubro: 'Smartwatch',
    emoji: '⌚',
    h1: 'Smartwatch para el Black Friday 2026',
    titulo: 'Black Friday 2026 smartwatch Argentina: cuál comprar',
    descripcion:
      'Black Friday y Cyber Monday 2026 en Argentina: smartwatch Huawei, Apple Watch, Samsung Galaxy Watch, Garmin y Amazfit elegidos, con link a Mercado Libre.',
    keywords: ['black friday 2026 smartwatch argentina', 'smartwatch black friday 2026', 'apple watch black friday argentina', 'reloj inteligente black friday', 'smartwatch cyber monday'],
    intro:
      'Relojes inteligentes de marcas conocidas, para Android y para iPhone. Arriba, el que más recomendamos si querés que funcione con los dos y que la batería dure días.',
    respuestaCorta:
      'Si querés uno que funcione con Android y con iPhone y que la batería dure varios días, el Huawei Watch GT 7 de 46 mm, con GPS y NFC. Con iPhone, el Apple Watch SE 3 es el que mejor se integra; con un celular Samsung, el Galaxy Watch9, y para correr, el Garmin Forerunner 170 Music.',
    items: [
      { id: 'MLA77843334', nombre: 'Huawei Watch GT 7 46 mm', detalle: 'GPS · NFC · bluetooth · Android e iOS', nota: 'El que recomendamos: anda con Android y con iPhone.' },
      { id: 'MLA54110750', nombre: 'Apple Watch SE 3 44 mm', detalle: 'GPS · caja de aluminio · blanco estelar', nota: 'Para iPhone.' },
      { id: 'MLA75492569', nombre: 'Samsung Galaxy Watch9 44 mm', detalle: 'Bluetooth · resistente al agua 5ATM · grafito', nota: 'Para celulares Samsung.' },
      { id: 'MLA70715360', nombre: 'Garmin Forerunner 170 Music', detalle: 'GPS · pantalla AMOLED · música', nota: 'Para correr.' },
      { id: 'MLA43283375', nombre: 'Amazfit T-Rex 3', detalle: 'GPS · mapas sin conexión · 10 ATM', nota: 'Resistente, para aire libre.' },
      { id: 'MLA39368735', nombre: 'Huawei Watch GT 5 41 mm', detalle: 'Caja de 41 mm · para correr y bici', nota: 'Más chico, para muñecas finas.' },
    ],
    criterios: [
      'Compatibilidad: el Apple Watch solo funciona con iPhone; Huawei, Garmin y Amazfit andan con Android y con iPhone.',
      'Batería: los Huawei, Garmin y Amazfit duran varios días; el Apple Watch y el Galaxy Watch piden carga casi diaria.',
      'GPS propio si salís a correr o a pedalear sin el celular.',
      'Tamaño de la caja según la muñeca: 40 a 42 mm para muñecas finas, 44 a 46 mm para el resto.',
    ],
    faq: [
      { q: '¿Qué smartwatch conviene comprar en el Black Friday 2026?', a: 'Depende del celular. Con iPhone, el Apple Watch SE 3; con Samsung, el Galaxy Watch9. Si querés uno que ande con los dos y dure varios días, el Huawei Watch GT 7 de esta página.' },
      { q: '¿El Apple Watch funciona con Android?', a: 'No. El Apple Watch necesita un iPhone para configurarse y usarse. Con Android conviene un Galaxy Watch, un Huawei, un Garmin o un Amazfit.' },
      { q: '¿Cuándo es el Black Friday 2026 en Argentina?', a: 'El viernes 27 de noviembre de 2026. Cada tienda decide si se suma y por cuántos días.' },
      { q: '¿El precio es el mismo que en Mercado Libre?', a: 'Sí. Los botones llevan a la publicación de Mercado Libre con nuestro link de afiliado: pagás lo mismo que entrando directo. El precio puede cambiar, confirmalo ahí antes de comprar.' },
    ],
    busqueda: busquedaML('smartwatch'),
    enlaces: [
      { href: '/guias/que-smartwatch-comprar-black-friday-2026', texto: 'Guía: qué smartwatch comprar en Black Friday 2026' },
      { href: '/guias/que-smartwatch-comprar', texto: 'Guía: qué smartwatch comprar' },
      { href: '/mejores/mejores-smartwatch', texto: 'Smartwatch en oferta hoy' },
      { href: '/mejores/black-friday-auriculares', texto: 'Auriculares para el Black Friday 2026' },
    ],
  },
  {
    slug: 'black-friday-colchones',
    rubro: 'Colchones',
    emoji: '🛏️',
    h1: 'Colchones para el Black Friday 2026',
    titulo: 'Black Friday 2026 colchones Argentina: espuma o resortes',
    descripcion:
      'Black Friday y Cyber Monday 2026 en Argentina: colchones y sommiers Cannon, Viggo y King Koil de espuma y resortes, de 1 ½ plaza a queen, con link a ML.',
    keywords: ['black friday 2026 colchones argentina', 'colchon black friday 2026', 'colchon 2 plazas black friday', 'sommier black friday', 'colchon cyber monday'],
    intro:
      'Colchones de marcas conocidas, de espuma y de resortes, en las medidas que más se usan. Arriba, el que más recomendamos para una cama de 2 plazas.',
    respuestaCorta:
      'Para una cama de 2 plazas, el Cannon Renovation Pillow de 140 × 190: es de espuma con pillow top y viene en la medida más común de Argentina. Si preferís resortes, el Viggo Cuarzo con resortes pocket; para cama queen, el Viggo Forte de 160 × 200.',
    items: [
      { id: 'MLA34102691', nombre: 'Cannon Renovation Pillow 2 plazas', detalle: 'Espuma · pillow top · 140 × 190 × 30 cm', nota: 'El que recomendamos para 2 plazas.' },
      { id: 'MLA80159945', nombre: 'Viggo Cuarzo 2 plazas', detalle: 'Resortes pocket · 140 × 190 cm', nota: 'Si preferís resortes.' },
      { id: 'MLA18618129', nombre: 'Cannon Doral Pillow Top 2 plazas', detalle: 'Resortes · pillow top · 33 cm de alto' },
      { id: 'MLA53968220', nombre: 'Viggo Forte Queen', detalle: 'Resortes · firme · 160 × 200 cm', nota: 'Para cama queen.' },
      { id: 'MLA15901311', nombre: 'Sommier y colchón Cannon Especial de Lujo', detalle: '2 plazas · 140 × 190 cm', nota: 'El conjunto completo, con sommier.' },
      { id: 'MLA30019963', nombre: 'King Koil Kensington 1 ½ plaza', detalle: 'Resortes pocket · firme · 100 × 200 cm', nota: 'Para 1 persona.' },
      // 26/11 (bf-ventas-2611): con precio visto el 26/11 en los datos del repo.
      { id: 'MLA23918588', nombre: 'Simmons Backcare Hotel Bilt 2 plazas', detalle: 'Colchón · 140 × 190 cm', nota: 'De Simmons, línea hotelera.' },
      { id: 'MLA18567231', nombre: 'Piero colchón en caja 2 plazas', detalle: 'Espuma de alta densidad · 140 × 190 cm · llega enrollado', nota: 'En caja: más fácil de subir por escalera.' },
    ],
    criterios: [
      'Medida: 2 plazas es 140 × 190; queen, 160 × 200; king, 180 o 200 × 200. Medí la cama antes de comprar.',
      'Espuma de alta densidad o resortes pocket: los dos duran; los pocket transmiten menos el movimiento del otro.',
      'Firmeza según el peso y cómo dormís: firme si dormís boca arriba o pesás más; intermedio si dormís de costado.',
      'Confirmá si viene en caja o enrollado y si el envío lo sube al piso.',
    ],
    faq: [
      { q: '¿Qué colchón conviene comprar en el Black Friday 2026?', a: 'Para una cama de 2 plazas, uno de espuma de alta densidad o de resortes pocket de una marca conocida, como el Cannon Renovation Pillow de esta página. Si preferís resortes, el Viggo Cuarzo.' },
      { q: '¿Espuma o resortes?', a: 'Los dos duran si son de buena calidad. Los resortes pocket ventilan más y transmiten menos el movimiento de la otra persona; la espuma es más silenciosa y suele pesar menos.' },
      { q: '¿Cuándo es el Black Friday 2026 en Argentina?', a: 'El viernes 27 de noviembre de 2026. Cada tienda decide si se suma y por cuántos días.' },
      { q: '¿El precio es el mismo que en Mercado Libre?', a: 'Sí. Los botones llevan a la publicación de Mercado Libre con nuestro link de afiliado: pagás lo mismo que entrando directo. El precio puede cambiar, confirmalo ahí antes de comprar.' },
    ],
    busqueda: busquedaML('colchon 2 plazas'),
    enlaces: [
      { href: '/guias/que-colchon-comprar-black-friday-2026', texto: 'Guía: qué colchón comprar en Black Friday 2026' },
      { href: '/guias/que-colchon-comprar-firmeza-y-material', texto: 'Guía: qué colchón comprar' },
      { href: '/guias/colchon-de-resortes-o-de-espuma', texto: 'Guía: colchón de resortes o de espuma' },
      { href: '/guias/medidas-de-colchon-y-sommier', texto: 'Guía: medidas de colchón y sommier' },
      { href: '/mejores/mejores-colchones', texto: 'Colchones en oferta hoy' },
    ],
  },
  {
    slug: 'black-friday-herramientas',
    rubro: 'Herramientas',
    emoji: '🛠️',
    h1: 'Herramientas para el Black Friday 2026',
    titulo: 'Black Friday 2026 herramientas Argentina: taladros y más',
    descripcion:
      'Black Friday y Cyber Monday 2026 en Argentina: taladros, rotomartillos, amoladoras, sierras e hidrolavadoras Bosch, Makita y Total, con link a Mercado Libre.',
    keywords: ['black friday 2026 herramientas argentina', 'taladro black friday 2026', 'herramientas electricas black friday', 'herramientas cyber monday', 'bosch black friday argentina'],
    intro:
      'Herramientas eléctricas de marcas conocidas, para arreglos de la casa y para obra. Arriba, la que más recomendamos para tener en casa.',
    respuestaCorta:
      'Para arreglos de la casa, el taladro percutor inalámbrico Total brushless con 2 baterías: perfora pared, madera y metal, atornilla y no depende de tener un enchufe cerca. Si vas a hacer obra, el rotomartillo Bosch GBH 3-28 DRE; para cortar y desbastar, la amoladora Bosch GWS 2200 de 9 pulgadas.',
    items: [
      { id: 'MLA42686679', nombre: 'Total taladro percutor inalámbrico', detalle: 'Brushless · 2 baterías · maletín y accesorios', nota: 'El que recomendamos para tener en casa.' },
      { id: 'MLA75242836', nombre: 'Makita DHP490 taladro percutor', detalle: 'A batería · línea Eco', nota: 'Otra a batería, de Makita.' },
      // 26/11 (bf-ventas-2611): dos a batería con precio visto el 26/11 en los datos del repo.
      { id: 'MLA22329091', nombre: 'Combo taladro percutor Stanley 20 V', detalle: 'Inalámbrico · baterías, cargador y caja', nota: 'Viene listo para usar, con caja.' },
      { id: 'MLA47372713', nombre: 'DeWalt DCD7781D2 taladro percutor', detalle: 'Inalámbrico · 2 baterías · cargador', nota: 'De DeWalt, con 2 baterías.' },
      { id: 'MLA64958954', nombre: 'Caterpillar combo taladro + amoladora', detalle: 'Inalámbricos · 18 V · sin carbones · maletín', nota: 'Dos herramientas con la misma batería.' },
      { id: 'MLA16120462', nombre: 'Bosch rotomartillo GBH 3-28 DRE', detalle: '800 W · para hormigón', nota: 'Para obra y paredes de hormigón.' },
      { id: 'MLA18522686', nombre: 'Bosch amoladora GWS 2200-230', detalle: '9" · 2200 W', nota: 'Para cortar y desbastar.' },
      { id: 'MLA15021003', nombre: 'Bosch sierra circular GKS 150', detalle: '7 ¼" · 1500 W · con disco y guía', nota: 'Para cortar madera.' },
      { id: 'MLA17940501', nombre: 'Logus hidrolavadora 170 bar', detalle: '2200 W · con espumador', nota: 'Para el patio, la vereda y el auto.' },
    ],
    criterios: [
      'Inalámbrico si la usás para arreglos sueltos; con cable si vas a perforar horas seguidas.',
      'Percutor para pared de ladrillo; rotomartillo (SDS) para hormigón.',
      'Brushless (sin carbones) dura más y rinde más por carga.',
      'Fijate si trae batería y cargador: algunas se venden «solo» la herramienta.',
    ],
    faq: [
      { q: '¿Qué taladro conviene comprar en el Black Friday 2026?', a: 'Para la casa, un taladro percutor inalámbrico con 2 baterías, como el Total brushless de esta página. Si vas a perforar hormigón, un rotomartillo, como el Bosch GBH 3-28 DRE.' },
      { q: '¿Taladro percutor o rotomartillo?', a: 'El percutor alcanza para ladrillo, madera y metal. El rotomartillo pega más fuerte y es el que hace falta para hormigón o para picar.' },
      { q: '¿Cuándo es el Black Friday 2026 en Argentina?', a: 'El viernes 27 de noviembre de 2026. Cada tienda decide si se suma y por cuántos días.' },
      { q: '¿El precio es el mismo que en Mercado Libre?', a: 'Sí. Los botones llevan a la publicación de Mercado Libre con nuestro link de afiliado: pagás lo mismo que entrando directo. El precio puede cambiar, confirmalo ahí antes de comprar.' },
    ],
    busqueda: busquedaML('taladro percutor inalambrico'),
    enlaces: [
      { href: '/guias/que-regalarle-a-un-hombre-en-navidad', texto: 'Guía: qué regalarle a un hombre en Navidad' },
      { href: '/guias/que-taladro-comprar-para-la-casa', texto: 'Guía: qué taladro comprar para la casa' },
      { href: '/guias/herramientas-electricas-cyber-monday-black-friday', texto: 'Guía: herramientas eléctricas en el Black Friday' },
      { href: '/mejores/mejores-taladros', texto: 'Taladros en oferta hoy' },
      { href: '/mejores/mejores-amoladoras', texto: 'Amoladoras en oferta hoy' },
    ],
  },
  {
    slug: 'black-friday-juguetes',
    rubro: 'Juguetes',
    emoji: '🧸',
    h1: 'Juguetes para el Black Friday 2026: adelantá la Navidad',
    titulo: 'Black Friday 2026 juguetes Argentina: regalos de Navidad',
    descripcion:
      'Black Friday y Cyber Monday 2026 en Argentina: Lego, bloques magnéticos, Cry Babies y Babycorns para adelantar los regalos de Navidad, con link a ML.',
    keywords: ['black friday 2026 juguetes argentina', 'juguetes black friday 2026', 'lego black friday argentina', 'regalos navidad black friday', 'juguetes cyber monday'],
    intro:
      'Juguetes de marcas conocidas para adelantar los regalos de Navidad: sets para armar y muñecas. Arriba, el que más recomendamos para chicos que ya arman solos.',
    respuestaCorta:
      'Para un regalo que se arma y se vuelve a armar, el Lego Speed Champions Chevrolet Corvette (76903), de 512 piezas. Para los más chicos, los bloques magnéticos Alamix de 300 piezas; si buscan muñecas, la Cry Babies Sam o la Babycorns interactiva de Zuru.',
    items: [
      { id: 'MLA19491975', nombre: 'Lego Speed Champions Chevrolet Corvette', detalle: 'Set 76903 · 512 piezas · dos autos', nota: 'El que recomendamos para chicos que ya arman solos.' },
      { id: 'MLA29708345', nombre: 'Lego Creator 3 en 1 Pavo real exótico', detalle: 'Set 31157 · 355 piezas · tres modelos', nota: 'Tres armados distintos con las mismas piezas.' },
      { id: 'MLA63018164', nombre: 'Lego City Camión de papas fritas', detalle: 'Set 60488', nota: 'Un Lego City para empezar.' },
      { id: 'MLA82409104', nombre: 'Bloques magnéticos Alamix 300 piezas', detalle: 'Cubos imantados para armar figuras', nota: 'Para los más chicos.' },
      { id: 'MLA53279808', nombre: 'Cry Babies Sam', detalle: 'Muñeca de 32 cm · Day Care', nota: 'La muñeca que llora.' },
      { id: 'MLA47346030', nombre: 'Zuru Babycorns', detalle: 'Muñeca bebé interactiva grande · cuna con sorpresas' },
      { id: 'MLA25469156', nombre: 'LOL Surprise Tweens Regina Hartt', detalle: 'Muñeca · línea Masquerade' },
    ],
    criterios: [
      'Edad recomendada: está en la caja y en la publicación; en sets con piezas chicas, respetala.',
      'Comprá con tiempo: la semana previa al 24 de diciembre los envíos se cargan.',
      'Preferí tiendas oficiales o vendedores con buena reputación: hay copias de las marcas más conocidas.',
      'Fijate si usa pilas y si vienen incluidas.',
    ],
    faq: [
      { q: '¿Qué juguete conviene comprar en el Black Friday 2026?', a: 'Para chicos que ya arman solos, un set de Lego como el Speed Champions Corvette de esta página. Para los más chicos, bloques magnéticos; si buscan muñecas, Cry Babies o Babycorns.' },
      { q: '¿Conviene comprar los regalos de Navidad en el Black Friday?', a: 'Si encontrás el juguete que buscás a buen precio, sí: te ahorrás la semana previa al 24, cuando los envíos se cargan y algunos productos se agotan.' },
      { q: '¿Cuándo es el Black Friday 2026 en Argentina?', a: 'El viernes 27 de noviembre de 2026. Cada tienda decide si se suma y por cuántos días.' },
      { q: '¿El precio es el mismo que en Mercado Libre?', a: 'Sí. Los botones llevan a la publicación de Mercado Libre con nuestro link de afiliado: pagás lo mismo que entrando directo. El precio puede cambiar, confirmalo ahí antes de comprar.' },
    ],
    busqueda: busquedaML('lego'),
    enlaces: [
      { href: '/guias/que-regalarle-a-un-chico-en-navidad', texto: 'Guía: qué regalarle a un chico en Navidad' },
      { href: '/guias/que-regalar-en-navidad-segun-presupuesto', texto: 'Guía: qué regalar en Navidad según el presupuesto' },
      { href: '/regalos-navidad', texto: 'Regalos de Navidad' },
      { href: '/mejores/regalos-de-navidad', texto: 'Regalos de Navidad en oferta hoy' },
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

/** Link de afiliado nuestro: publicación de ML con `matt_tool` fijo y etiqueta `matt_word`. */
export function esLinkAfiliado(url: string | null | undefined): boolean {
  if (!url) return false
  try {
    const u = new URL(url)
    return /(^|\.)mercadolibre\.com\.ar$/.test(u.hostname) && u.searchParams.get('matt_tool') === '37267219' && !!u.searchParams.get('matt_word')
  } catch {
    return false
  }
}

/** Arma los productos de la landing con los datos del repo (catálogo y, para aires, lib/mejor-aires).
 *  Un producto sin link de afiliado no se muestra: así el botón principal siempre lo lleva. */
export function productosBF(l: LandingBF, hoy?: string): ProductoBF[] {
  return productosDeItems(l.items, hoy)
}

/** Otra publicación del MISMO modelo (PUBLICACIONES_ALTERNATIVAS) con precio visto hace DIAS_PRECIO_VIEJO
 *  días o menos y link de afiliado, o null. Ya mapeada como ProductoBF, con el id de esa publicación. */
function alternativaVigente(it: ItemBF, hoy?: string): ProductoBF | null {
  for (const alt of PUBLICACIONES_ALTERNATIVAS[it.id] ?? []) {
    const p = getProductoById(alt.id)
    if (!p || MARCAS_PROHIBIDAS.test(p.titulo) || !esLinkAfiliado(p.url_producto)) continue
    const precio = precioMostrable(p.precio_actual, p.precio_visto, hoy)
    if (precio === null) continue
    return { ...it, id: alt.id, detalle: alt.detalle ?? it.detalle, url: p.url_producto, img: p.url_imagen, precio, visto: p.precio_visto ?? null }
  }
  return null
}

/** Lo mismo para cualquier lista de ItemBF (las guías de Black Friday 2026 usan esta). */
export function productosDeItems(items: ItemBF[], hoy?: string): ProductoBF[] {
  const aires = new Map(AIRES_HOY.map(a => [a.id, a]))
  const out: ProductoBF[] = []
  for (const it of items) {
    if (MARCAS_PROHIBIDAS.test(it.nombre)) continue
    const p = getProductoById(it.id)
    // 26/11: la publicación elegida quedó sin precio visto reciente (o el bot la podó) y hay otra del
    // mismo modelo con precio de estos días: se muestra esa, así el botón de arriba lleva precio.
    if (!p || precioMostrable(p.precio_actual, p.precio_visto, hoy) === null) {
      const alt = alternativaVigente(it, hoy)
      if (alt) {
        out.push(alt)
        continue
      }
    }
    const a = aires.get(it.id)
    const titulo = p?.titulo ?? a?.titulo
    if (!titulo || MARCAS_PROHIBIDAS.test(titulo) || MARCAS_PROHIBIDAS.test(it.nombre)) continue
    if (!esLinkAfiliado(p ? p.url_producto : a?.url)) continue
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

/** «Actualizado el»: la fecha más nueva entre la última revisión del texto (FECHA_REVISION_BF)
 *  y el último precio visto de los productos que muestra la página. Formato 'AAAA-MM-DD'. */
export function actualizadoBF(productos: ProductoBF[]): string {
  return productos.reduce((max, p) => (p.visto && p.visto.slice(0, 10) > max ? p.visto.slice(0, 10) : max), FECHA_REVISION_BF)
}
