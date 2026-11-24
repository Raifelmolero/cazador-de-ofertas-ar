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
import { FECHA_REVISION_BF } from '@/lib/bf-guias'

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
  /** true solo si la publicación es de una tienda oficial (dato verificado en ML). Sin el dato, no se muestra. */
  tiendaOficial?: boolean
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

/** Lo mismo para cualquier lista de ItemBF (las guías de Black Friday 2026 usan esta). */
export function productosDeItems(items: ItemBF[], hoy?: string): ProductoBF[] {
  const aires = new Map(AIRES_HOY.map(a => [a.id, a]))
  const out: ProductoBF[] = []
  for (const it of items) {
    const p = getProductoById(it.id)
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
