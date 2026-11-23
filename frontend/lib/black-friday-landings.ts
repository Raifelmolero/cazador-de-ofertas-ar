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
    titulo: 'Black Friday 2026 y Cyber Monday: smart TV en Argentina',
    descripcion:
      'Black Friday 2026 en Argentina (viernes 27/11): smart TV 4K Samsung, LG y Hisense de 50, 55 y 65 pulgadas (QLED, Mini LED y OLED), con link a Mercado Libre.',
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
      'Black Friday 2026 en Argentina (viernes 27/11): aires split inverter frío/calor Samsung, LG, Philco, Hyundai y Likon para el verano, con link a Mercado Libre.',
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
