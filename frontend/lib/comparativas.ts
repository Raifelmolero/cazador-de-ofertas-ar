// Comparativas "Mejores X en oferta" (/mejores/[slug]). Apuntan a la búsqueda
// que se hace justo antes de comprar algo caro ("mejor aire acondicionado
// 2026", "qué smart tv comprar") en los rubros que más comisión dejan por venta.
//
// La tabla sale del catálogo del momento (ordenado por ganancia esperada, ver
// ganancia_esperada en bot/cazador_bot.py); lo fijo es la lista de criterios.
// No son reseñas: no probamos productos, comparamos precio, descuento y el
// historial de precios que registramos. La página lo dice explícitamente.

import { CATEGORIAS, getCategoria, normalizar, ofertasDeCategoria, type Categoria } from '@/lib/categorias'
import type { ProductWithMargins } from '@/lib/productos'

export interface Comparativa {
  slug: string
  nombre: string // "aires acondicionados"
  titulo: string
  descripcion: string
  intro: string
  categoria?: string // slug de /categoria/* de donde salen los productos
  keywords?: string[] // o palabras propias (para comparativas que cruzan rubros)
  criterios: string[]
  guia?: string // slug de /guias/* relacionada
  /** Cortes de precio para la sección "por presupuesto" (regalos) */
  presupuestos?: number[]
}

const AÑO = 2026

export const COMPARATIVAS: Comparativa[] = [
  {
    slug: 'mejores-aires-acondicionados',
    nombre: 'aires acondicionados',
    titulo: `Mejores aires acondicionados en oferta ${AÑO}: comparativa de precios`,
    descripcion:
      'Comparativa de los aires acondicionados split en oferta hoy en Mercado Libre Argentina: precio, descuento y precio mínimo registrado. Qué mirar antes de comprar.',
    intro:
      'Los aires acondicionados en oferta hoy, comparados por precio, descuento y el precio más bajo que registramos para cada uno. La tabla se actualiza 3 veces por día.',
    categoria: 'aire-acondicionado',
    criterios: [
      'Frigorías según el ambiente: volumen (m² × altura) × 50. Un cuarto de 20 m² necesita unas 2.600 frigorías.',
      'Inverter si lo vas a usar muchas horas: consume menos y hace menos ruido.',
      'Frío/calor: calefacciona con bomba de calor, más eficiente que una estufa eléctrica.',
      'Instalación: casi nunca está incluida en el precio; sumala al presupuesto.',
      'Etiqueta de eficiencia energética: A o superior.',
    ],
    guia: 'cuantas-frigorias-necesito-aire-acondicionado',
  },
  {
    slug: 'mejores-smart-tv',
    nombre: 'smart TV',
    titulo: `Mejores smart TV en oferta ${AÑO}: comparativa de precios`,
    descripcion:
      'Comparativa de smart TV en oferta hoy en Mercado Libre Argentina: 32 a 75 pulgadas, precio, descuento y precio mínimo registrado.',
    intro:
      'Los smart TV en oferta hoy, comparados por precio, descuento y el precio más bajo que registramos. Se actualiza 3 veces por día.',
    categoria: 'smart-tv',
    criterios: [
      'Tamaño según la distancia: a 2 metros va bien uno de 50 a 55 pulgadas.',
      '4K desde 43 pulgadas; en 32 alcanza con HD o Full HD.',
      'Panel: QLED y OLED dan mejores colores y contraste que un LED común.',
      'Sistema (Google TV, webOS, Tizen): que tenga las apps que usás.',
      'Garantía oficial de la marca en Argentina.',
    ],
  },
  {
    slug: 'mejores-lavarropas',
    nombre: 'lavarropas',
    titulo: `Mejores lavarropas en oferta ${AÑO}: comparativa de precios`,
    descripcion:
      'Comparativa de lavarropas y lavasecarropas en oferta hoy en Mercado Libre Argentina: carga, centrifugado, precio y precio mínimo registrado.',
    intro:
      'Los lavarropas en oferta hoy, comparados por precio, descuento y el precio más bajo que registramos. Se actualiza 3 veces por día.',
    categoria: 'lavarropas',
    criterios: [
      'Capacidad: 6-7 kg para 1-2 personas, 8 kg o más para familias.',
      'Carga frontal: lava mejor y gasta menos agua; carga superior: más barato.',
      'Centrifugado: 1000 rpm o más deja la ropa más seca.',
      'Inverter: menos ruido y consumo.',
      'Medidas: confirmá el espacio y la puerta de acceso antes de comprar.',
    ],
  },
  {
    slug: 'mejores-heladeras',
    nombre: 'heladeras',
    titulo: `Mejores heladeras en oferta ${AÑO}: comparativa de precios`,
    descripcion:
      'Comparativa de heladeras en oferta hoy en Mercado Libre Argentina: no frost o cíclica, litros, precio y precio mínimo registrado.',
    intro:
      'Las heladeras en oferta hoy, comparadas por precio, descuento y el precio más bajo que registramos. Se actualiza 3 veces por día.',
    categoria: 'heladeras',
    criterios: [
      'No frost: no junta hielo; cíclica: más barata y gasta menos.',
      'Litros: unos 100 a 150 L por persona como referencia.',
      'Freezer: arriba, abajo o side by side según cuánto congeles.',
      'Eficiencia energética A o superior: la heladera está prendida las 24 h.',
      'Medidas del hueco y apertura de la puerta.',
    ],
  },
  {
    slug: 'mejores-colchones',
    nombre: 'colchones',
    titulo: `Mejores colchones en oferta ${AÑO}: comparativa de precios`,
    descripcion:
      'Comparativa de colchones en oferta hoy en Mercado Libre Argentina: espuma, resortes o viscoelástico, medidas, precio y precio mínimo registrado.',
    intro:
      'Los colchones en oferta hoy, comparados por precio, descuento y el precio más bajo que registramos. Se actualiza 3 veces por día.',
    categoria: 'colchones',
    criterios: [
      'Firmeza según tu peso y postura: de costado, algo menos firme.',
      'Espuma de alta densidad (mirá el número), resortes pocket o viscoelástico.',
      'Medida exacta de tu base: 1 plaza, 2 plazas, queen o king.',
      'Colchón "en caja": tarda 24-48 h en tomar su forma.',
      'Garantía del fabricante.',
    ],
    guia: 'que-colchon-comprar-firmeza-y-material',
  },
  {
    slug: 'mejores-taladros',
    nombre: 'taladros y herramientas',
    titulo: `Mejores taladros y herramientas eléctricas en oferta ${AÑO}`,
    descripcion:
      'Comparativa de taladros, atornilladores y herramientas eléctricas en oferta hoy en Mercado Libre Argentina: precio, descuento y precio mínimo registrado.',
    intro:
      'Taladros, atornilladores, amoladoras y más herramientas en oferta hoy, comparadas por precio, descuento y el precio más bajo que registramos.',
    categoria: 'herramientas-electricas',
    criterios: [
      'Para la casa: percutor de 500-750 W o atornillador 18 V con percutor.',
      'Rotomartillo solo para hormigón u obra.',
      'A batería: fijate si incluye batería y cargador (muchos vienen "sin batería").',
      'Mandril de 13 mm acepta más mechas que uno de 10 mm.',
      'Kits con maletín y accesorios suelen salir más baratos que por separado.',
    ],
    guia: 'que-taladro-comprar-para-la-casa',
  },
  {
    slug: 'regalos-dia-de-la-madre',
    presupuestos: [50000, 150000],
    guia: 'que-regalar-el-dia-de-la-madre',
    nombre: 'regalos para el Día de la Madre',
    titulo: `Regalos para el Día de la Madre ${AÑO} en oferta`,
    descripcion:
      'Ideas de regalo para el Día de la Madre (domingo 18 de octubre de 2026) en oferta en Mercado Libre Argentina, por presupuesto (hasta $50.000, hasta $150.000 y más): perfumes, cuidado personal, cocina, smartwatch y más.',
    intro:
      'El Día de la Madre en Argentina es el domingo 18 de octubre de 2026. Estos son los regalos en oferta hoy, con el descuento verificado contra el historial de precios.',
    keywords: [
      'perfume', 'secador de pelo', 'planchita', 'alisadora', 'rizador', 'smartwatch',
      'cartera', 'masajeador', 'cafetera', 'freidora de aire', 'robot aspiradora',
      'aspiradora robot', 'batidora', 'maquina de coser', 'auriculares', 'depiladora',
    ],
    criterios: [
      'Comprá con al menos 5-7 días de margen: mirá la fecha de entrega en Mercado Libre.',
      'Envío Full llega más rápido y tiene devolución simple si hay que cambiar.',
      'Perfumes: elegí vendedores oficiales o tiendas oficiales de la marca.',
      'Si no estás seguro del gusto, un electrodoméstico útil (cafetera, freidora) rara vez falla.',
    ],
  },
  {
    slug: 'ofertas-black-friday',
    nombre: 'ofertas de Black Friday',
    titulo: `Black Friday ${AÑO} en Mercado Libre: ofertas con descuento verificado`,
    descripcion:
      'Ofertas de Black Friday 2026 en Mercado Libre Argentina (viernes 27 de noviembre): smart TV, notebooks, celulares, consolas y electrodomésticos, con el descuento comparado contra el historial de precios.',
    intro:
      'El Black Friday 2026 es el viernes 27 de noviembre. Muchas tiendas suben los precios las semanas previas para anunciar descuentos más grandes: por eso acá cada oferta se compara contra el precio más bajo que registramos. La tabla se actualiza 3 veces por día, también antes del evento.',
    keywords: [
      'smart tv', 'notebook', 'celular', 'consola', 'playstation', 'nintendo',
      'lavarropas', 'heladera', 'monitor', 'tablet', 'aire acondicionado',
      'auriculares', 'smartwatch',
    ],
    presupuestos: [150000, 500000],
    criterios: [
      'Mirá el precio de hoy contra el mínimo registrado: si el "antes" está inflado, el descuento es de mentira.',
      'Si lo que querés ya está en su precio mínimo, no hace falta esperar al viernes: los mejores precios a veces aparecen antes.',
      'Compará cuotas sin interés y el costo de envío: a igual precio, eso define cuál conviene.',
      'En productos caros, preferí tiendas oficiales o vendedores con reputación verde y garantía oficial.',
    ],
    guia: 'hot-sale-cyber-monday-o-dia-comun-cuando-comprar-en-mercado-libre',
  },
  {
    slug: 'regalos-de-navidad',
    nombre: 'regalos de Navidad',
    titulo: `Regalos de Navidad ${AÑO} en oferta: ideas por presupuesto`,
    descripcion:
      'Regalos de Navidad 2026 en oferta en Mercado Libre Argentina, por presupuesto: consolas, bicicletas, monopatines, auriculares, smartwatch, perfumes, parlantes y más, con el descuento verificado.',
    intro:
      'Regalos para Navidad en oferta hoy, ordenados por presupuesto y con el descuento comparado contra el precio más bajo que registramos. Para que llegue antes del 24 de diciembre, comprá con al menos una semana de margen.',
    keywords: [
      'consola', 'playstation', 'nintendo', 'bicicleta', 'monopatin', 'monopatín',
      'auriculares', 'smartwatch', 'perfume', 'parlante', 'lego', 'tablet',
    ],
    presupuestos: [50000, 150000],
    criterios: [
      'Comprá con al menos 7 días de margen: la semana previa al 24 los envíos se cargan. Mirá la fecha de entrega antes de pagar.',
      'Envío Full llega más rápido y simplifica el cambio si el regalo no convence.',
      'Consolas y tecnología: preferí tiendas oficiales y revisá la garantía (oficial o del vendedor).',
      'Bicicletas y monopatines: chequeá el rodado o la edad recomendada según quién lo va a usar.',
    ],
  },
  {
    slug: 'mejores-cocinas-y-hornos',
    nombre: 'cocinas y hornos',
    titulo: `Mejores cocinas y hornos en oferta ${AÑO}: comparativa de precios`,
    descripcion:
      'Comparativa de cocinas a gas, multigas, eléctricas y hornos en oferta hoy en Mercado Libre Argentina: precio, descuento y precio mínimo registrado.',
    intro:
      'Las cocinas y hornos en oferta hoy, comparados por precio, descuento y el precio más bajo que registramos para cada uno. La tabla se actualiza 3 veces por día.',
    categoria: 'cocinas-y-hornos',
    criterios: [
      'Tipo de gas: si tenés gas natural o envasado (garrafa), elegí una multigas o confirmá que trae los picos para tu instalación.',
      'Medidas: la mayoría mide 50 a 56 cm de ancho; medí el hueco antes de comprar.',
      'Horno: con visor y luz es más cómodo; el encendido electrónico y la válvula de seguridad suman seguridad.',
      'Instalación de gas: la tiene que hacer un gasista matriculado.',
    ],
  },
  {
    slug: 'mejores-termotanques',
    nombre: 'termotanques',
    titulo: `Mejores termotanques en oferta ${AÑO}: comparativa de precios`,
    descripcion:
      'Comparativa de termotanques a gas y eléctricos en oferta hoy en Mercado Libre Argentina: precio, descuento, capacidad y precio mínimo registrado.',
    intro:
      'Los termotanques en oferta hoy, comparados por precio, descuento y el precio más bajo que registramos para cada uno. La tabla se actualiza 3 veces por día.',
    categoria: 'termotanques',
    criterios: [
      'Capacidad según cuántos viven: como referencia, 50 litros para 1-2 personas, 80 litros para 3-4 y 120 litros o más para familias grandes.',
      'Gas o eléctrico: el eléctrico no necesita salida de gases, pero suele gastar más; el de gas recupera más rápido.',
      'Recuperación (litros por hora): cuanto más alta, menos esperás entre una ducha y otra.',
      'La instalación a gas la tiene que hacer un gasista matriculado.',
    ],
  },
  {
    slug: 'mejores-freezers',
    nombre: 'freezers',
    titulo: `Mejores freezers en oferta ${AÑO}: comparativa de precios`,
    descripcion:
      'Comparativa de freezers horizontales y verticales en oferta hoy en Mercado Libre Argentina: precio, descuento, capacidad y precio mínimo registrado.',
    intro:
      'Los freezers en oferta hoy, comparados por precio, descuento y el precio más bajo que registramos para cada uno. La tabla se actualiza 3 veces por día.',
    categoria: 'freezers',
    criterios: [
      'Horizontal o vertical: el horizontal guarda más por el mismo precio; el vertical ocupa menos piso y es más fácil de ordenar.',
      'Capacidad: medí el lugar y dejá unos centímetros atrás y a los costados para que ventile.',
      'Dual (freezer/heladera): algunos horizontales se pueden usar como conservadora; útil si lo querés para bebidas.',
      'Eficiencia energética: la etiqueta A o superior se nota en la factura porque funciona todo el día.',
    ],
  },
  {
    slug: 'mejores-aspiradoras',
    nombre: 'aspiradoras',
    titulo: `Mejores aspiradoras y robots aspiradores en oferta ${AÑO}: comparativa`,
    descripcion:
      'Comparativa de aspiradoras, robots aspiradores y aspiradoras de mano en oferta hoy en Mercado Libre Argentina: precio, descuento y precio mínimo registrado.',
    intro:
      'Las aspiradoras en oferta hoy (robots, verticales, de mano y de arrastre), comparadas por precio, descuento y el precio más bajo que registramos. La tabla se actualiza 3 veces por día.',
    categoria: 'aspiradoras',
    criterios: [
      'Robot: sirve para el mantenimiento diario sin esfuerzo; fijate si tiene mapeo (recorre ordenado) o navegación aleatoria, y si también pasa el trapo.',
      'Vertical o de mano a batería: práctica para pasadas rápidas; mirá la autonomía en minutos y si la batería es reemplazable.',
      'Con mascotas: buscá cepillo antienredos y buen filtro (HEPA si hay alergias).',
      'Potencia de succión (Pa o W): a mayor número, mejor en alfombras.',
    ],
  },
  {
    slug: 'mejores-perfumes',
    nombre: 'perfumes',
    titulo: `Perfumes en oferta ${AÑO}: comparativa de precios en Mercado Libre`,
    descripcion:
      'Comparativa de perfumes de mujer y hombre en oferta hoy en Mercado Libre Argentina: precio, descuento y precio mínimo registrado. Consejos para comprar originales.',
    intro:
      'Los perfumes en oferta hoy, comparados por precio, descuento y el precio más bajo que registramos. La tabla se actualiza 3 veces por día.',
    categoria: 'perfumes',
    presupuestos: [50000, 150000],
    criterios: [
      'Originalidad: comprá en tiendas oficiales de la marca o vendedores con reputación verde y muchas ventas; desconfiá de precios muy por debajo del resto.',
      'Eau de parfum dura más en la piel que eau de toilette; por eso suele costar más por mililitro.',
      'Compará por mililitro: el frasco grande casi siempre sale más barato por ml.',
      'Para regalo, si no conocés el gusto, las fragancias frescas o florales suaves son las más seguras.',
    ],
    guia: 'que-regalar-el-dia-de-la-madre',
  },
  {
    slug: 'mejores-freidoras-de-aire',
    nombre: 'freidoras de aire',
    titulo: `Mejores freidoras de aire en oferta ${AÑO}: comparativa de precios`,
    descripcion:
      'Comparativa de freidoras de aire (air fryer) en oferta hoy en Mercado Libre Argentina: precio, descuento, capacidad y precio mínimo registrado.',
    intro:
      'Las freidoras de aire en oferta hoy, comparadas por precio, descuento y el precio más bajo que registramos para cada una. La tabla se actualiza 3 veces por día.',
    categoria: 'freidoras-de-aire',
    criterios: [
      'Capacidad: 3 a 4 litros alcanza para 1-2 personas; para familias conviene 5 litros o más (o doble canasto).',
      'Potencia: entre 1.400 y 1.800 W cocina parejo y rápido.',
      'Canasto antiadherente y apto lavavajillas: se nota en el uso diario.',
      'Con ventana o luz interior podés ver la cocción sin abrir.',
    ],
  },
  {
    slug: 'mejores-ventiladores',
    nombre: 'ventiladores',
    titulo: `Mejores ventiladores en oferta ${AÑO}: comparativa de precios`,
    descripcion:
      'Comparativa de ventiladores de pie, de techo, turbo y de pared en oferta hoy en Mercado Libre Argentina: precio, descuento y precio mínimo registrado.',
    intro:
      'Los ventiladores en oferta hoy, comparados por precio, descuento y el precio más bajo que registramos. Conviene comprar antes de la ola de calor: en pleno verano los precios suben y el stock baja.',
    categoria: 'ventiladores',
    criterios: [
      'De techo para ambientes grandes y uso diario; de pie o turbo si lo querés mover de una habitación a otra.',
      'Tamaño: 16 a 20 pulgadas para dormitorios, 20 o más para livings.',
      'Motor: los de 3 o más velocidades y bajo ruido son mejores para dormir.',
      'Si te sobra presupuesto y el calor es fuerte, compará con un aire acondicionado: enfría, no solo mueve el aire.',
    ],
  },
  {
    slug: 'mejores-monitores',
    nombre: 'monitores',
    titulo: `Mejores monitores en oferta ${AÑO}: comparativa de precios`,
    descripcion:
      'Comparativa de monitores para PC, gamer y oficina en oferta hoy en Mercado Libre Argentina: precio, descuento, pulgadas, Hz y precio mínimo registrado.',
    intro:
      'Los monitores en oferta hoy, comparados por precio, descuento y el precio más bajo que registramos. La tabla se actualiza 3 veces por día.',
    categoria: 'monitores',
    criterios: [
      'Para oficina: 24 pulgadas Full HD con panel IPS alcanza y cuida la vista.',
      'Para juegos: 144 Hz o más y 1 ms; fijate que tu placa de video llegue a esos cuadros.',
      '27 pulgadas o más: conviene resolución 2K (QHD) para que no se vea "pixelado".',
      'Revisá las entradas (HDMI, DisplayPort) y si trae el cable que necesitás.',
    ],
  },
]

export function getComparativa(slug: string) {
  return COMPARATIVAS.find(c => c.slug === slug)
}

export function categoriaDe(c: Comparativa): Categoria | undefined {
  return c.categoria ? getCategoria(c.categoria) : undefined
}

export function productosDe(c: Comparativa): ProductWithMargins[] {
  const cat = categoriaDe(c)
  if (cat) return ofertasDeCategoria(cat)
  const kws = (c.keywords ?? []).map(normalizar)
  // Reusa el catálogo completo vía cualquier categoría: ofertasDeCategoria
  // con una categoría "virtual" sin exclusiones.
  return ofertasDeCategoria({ ...CATEGORIAS[0], keywords: kws, excluir: ['repuesto', 'funda', 'soporte'] })
}
