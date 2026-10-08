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
import { CONTENIDO } from '@/lib/comparativas-contenido'

export interface Comparativa {
  slug: string
  nombre: string // "aires acondicionados"
  titulo: string
  descripcion: string
  intro: string
  categoria?: string // slug de /categoria/* de donde salen los productos
  keywords?: string[] // o palabras propias (para comparativas que cruzan rubros)
  excluir?: string[] // palabras que sacan un producto de la tabla (en cualquier parte del título)
  /** Palabras de accesorio que se toleran en combos ("Tablet + Funda"): anulan
   *  las exclusiones fijas y las de `excluir`, pero el accesorio suelto sigue
   *  afuera (título que empieza con la palabra o dice "<palabra> para"). */
  permitir?: string[]
  criterios: string[]
  guia?: string // slug de /guias/* relacionada
  /** Cortes de precio para la sección "por presupuesto" (regalos) */
  presupuestos?: number[]
  /** Links internos extra (ej. del monitor gamer a la silla gamer). */
  enlaces?: { href: string; texto: string }[]
}

/** Comparativas de ticket alto que ya venden: quedan indexables aunque un día
 *  tengan menos de MIN_PRODUCTOS_INDEXABLE ofertas (la página igual trae el
 *  historial de precios de la categoría). Sin esto Google las sacaba del índice
 *  un día flojo y tardaba semanas en volver (pasó con notebooks, oct/2026). */
const PERENNES = new Set([
  'mejores-notebooks', 'mejores-celulares', 'mejores-celulares-gama-alta',
  'mejores-colchones', 'mejores-colchones-2-plazas', 'mejores-sommiers',
  'mejores-aires-acondicionados', 'mejores-smart-tv', 'mejores-heladeras', 'mejores-lavarropas',
  // Cyber Monday (2 al 4/11): tienen que estar indexadas semanas antes del evento,
  // y "aire acondicionado cyber monday" ya rankea en la posición ~17 (GSC 04/10).
  'ofertas-cyber-monday', 'cyber-monday-smart-tv', 'cyber-monday-aires-acondicionados',
  'cyber-monday-notebooks', 'cyber-monday-celulares', 'cyber-monday-lavarropas', 'cyber-monday-auriculares',
])

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
    guia: 'que-smart-tv-comprar',
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
    excluir: ['lavavajillas', 'lava vajillas'],
    guia: 'que-lavarropas-comprar',
    criterios: [
      'Capacidad: 6-7 kg para 1-2 personas, 8 kg o más para familias.',
      'Carga frontal: lava mejor y gasta menos agua; carga superior: más barato.',
      'Centrifugado: 1000 rpm o más deja la ropa más seca.',
      'Inverter: menos ruido y consumo.',
      'Medidas: confirmá el espacio y la puerta de acceso antes de comprar.',
    ],
  },
  {
    slug: 'mejores-lavavajillas',
    nombre: 'lavavajillas',
    titulo: `Mejores lavavajillas en oferta ${AÑO}: comparativa de precios`,
    descripcion:
      'Comparativa de lavavajillas en oferta hoy en Mercado Libre Argentina: 45 o 60 cm, cubiertos, precio, descuento y precio mínimo registrado.',
    intro:
      'Los lavavajillas en oferta hoy, comparados por precio, descuento y el precio más bajo que registramos para cada uno. La tabla se actualiza 3 veces por día.',
    categoria: 'lavarropas',
    keywords: ['lavavajillas', 'lava vajillas', 'lavaplatos'],
    excluir: ['detergente', 'pastillas', 'abrillantador', 'sal para', 'canasto', 'manguera', 'repuesto'],
    guia: 'que-lavavajillas-comprar',
    criterios: [
      'Cubiertos: 45 cm de ancho (unos 9 a 10 cubiertos) para 1 a 3 personas; 60 cm (12 a 14) para familias.',
      'Instalación: necesita toma de agua fría, desagüe y enchufe con descarga a tierra cerca.',
      'Libre instalación o empotrable: medí el hueco y el espacio para abrir la puerta.',
      'Consumo: compará litros de agua y kWh por ciclo de la ficha técnica.',
      'Garantía oficial en Argentina y service cerca.',
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
    guia: 'que-heladera-comprar',
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
    slug: 'mejores-amoladoras',
    nombre: 'amoladoras',
    titulo: `Mejores amoladoras en oferta ${AÑO}: comparativa de precios`,
    descripcion:
      'Comparativa de amoladoras angulares en oferta hoy en Mercado Libre Argentina: 115 y 230 mm, precio, descuento y precio mínimo registrado.',
    intro:
      'Las amoladoras en oferta hoy, comparadas por precio, descuento y el precio más bajo que registramos. La tabla se actualiza 3 veces por día.',
    categoria: 'herramientas-electricas',
    keywords: ['amoladora', 'esmeril angular', 'amoladora angular'],
    criterios: [
      'Para uso general (cortar hierro, cerámica, desbastar): 115 mm con 700-900 W alcanza y sobra.',
      '230 mm es para obra: corta más profundo pero pesa el doble y es más difícil de controlar.',
      'Protector de disco regulable y empuñadura lateral no son opcionales.',
      'A batería: cómoda para changas, pero fijate si incluye batería y cargador.',
      'Sumale el precio de discos de repuesto si no los tenés: se gastan rápido.',
    ],
    guia: 'que-amoladora-comprar',
  },
  {
    slug: 'mejores-soldadoras',
    nombre: 'soldadoras',
    titulo: `Mejores soldadoras en oferta ${AÑO}: comparativa de precios`,
    descripcion:
      'Comparativa de soldadoras inverter y MIG en oferta hoy en Mercado Libre Argentina: precio, descuento y precio mínimo registrado.',
    intro:
      'Las soldadoras en oferta hoy, comparadas por precio, descuento y el precio más bajo que registramos. La tabla se actualiza 3 veces por día.',
    categoria: 'herramientas-electricas',
    keywords: ['soldadora'],
    criterios: [
      'Para arrancar en casa: inverter de electrodo (MMA) de 120-160 A anda con el enchufe común.',
      'MIG sin gas (alambre tubular) suelda chapa fina más prolijo, pero el consumible es más caro.',
      'Fijate el ciclo de trabajo: dice cuántos minutos de cada 10 puede soldar al amperaje máximo.',
      'Máscara fotosensible, guantes y pinza de masa: revisá si vienen incluidos o sumalos al precio.',
      'Si la instalación es vieja, confirmá con un electricista que la térmica banca el consumo.',
    ],
    guia: 'que-soldadora-comprar',
  },
  {
    slug: 'mejores-hidrolavadoras',
    nombre: 'hidrolavadoras',
    titulo: `Mejores hidrolavadoras en oferta ${AÑO}: comparativa de precios`,
    descripcion:
      'Comparativa de hidrolavadoras en oferta hoy en Mercado Libre Argentina: presión, precio, descuento y precio mínimo registrado.',
    intro:
      'Las hidrolavadoras en oferta hoy, comparadas por precio, descuento y el precio más bajo que registramos. La tabla se actualiza 3 veces por día.',
    categoria: 'herramientas-electricas',
    keywords: ['hidrolavadora'],
    criterios: [
      'Para auto, vereda y patio: 100-140 bar alcanza; más presión es para uso intensivo.',
      'Mirá el caudal (litros por hora): con más caudal se enjuaga más rápido, no solo la presión.',
      'Manguera larga y lanza con boquillas intercambiables ahorran mucho tiempo.',
      'Motor de inducción dura más que uno universal, pero pesa y cuesta más.',
      'No la uses con agua caliente si el fabricante no lo indica.',
    ],
    guia: 'que-hidrolavadora-comprar',
  },
  {
    slug: 'mejores-neumaticos',
    nombre: 'neumáticos',
    titulo: `Mejores neumáticos en oferta ${AÑO}: comparativa de precios`,
    descripcion:
      'Comparativa de neumáticos para auto y camioneta en oferta hoy en Mercado Libre Argentina: medida, precio, descuento y precio mínimo registrado.',
    intro:
      'Los neumáticos en oferta hoy, comparados por precio, descuento y el precio más bajo que registramos para cada uno. La tabla se actualiza 3 veces por día.',
    categoria: 'vehiculos',
    keywords: ['neumatico'],
    criterios: [
      'La medida manda: ancho, alto, rodado e índices de carga y de velocidad tienen que coincidir con el manual del auto.',
      'Ruta y ciudad: de turismo o H/T, más silenciosos y con más rendimiento en asfalto.',
      'Ripio o tierra: A/T (all terrain), con más agarre fuera del asfalto pero más ruido.',
      'Revisá si el precio es por unidad o por kit de dos o cuatro antes de comparar.',
      'Sumá colocación, alineado y balanceo al presupuesto.',
    ],
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
  // Fechas del Cyber Monday 2026 (verificadas el 2026-09-26): lunes 2 al
  // miércoles 4 de noviembre. Fuentes: home de cybermonday.com.ar (sitio oficial
  // de la CACE: "CyberMonday 2, 3 y 4 de Noviembre de 2026"), Ámbito (24/09/2026)
  // y C5N (06/05/2026), ambos citando a la CACE. Ojo: el cuerpo de
  // cybermonday.com.ar/cuando-es-cybermonday todavía dice "3 al 5", pero el
  // encabezado de esa misma página y la home dicen 2-4 (y el 2/11 es lunes).
  // Si la CACE las cambia, actualizar acá, en lib/cybermonday.ts (landing
  // /cyber-monday), en las guías cyber de lib/guias.ts y en el banner de
  // app/hoy/page.tsx.
  {
    slug: 'ofertas-cyber-monday',
    nombre: 'productos para el Cyber Monday',
    titulo: `Cyber Monday ${AÑO} en Mercado Libre Argentina: qué ofertas son reales`,
    descripcion:
      'Ofertas del Cyber Monday 2026 en Mercado Libre Argentina (lunes 2 al miércoles 4 de noviembre, fechas de la CACE): notebooks, celulares, smart TV, aires, electrodomésticos y herramientas, con el precio comparado contra el mínimo registrado.',
    intro:
      'El Cyber Monday 2026 en Argentina va del lunes 2 al miércoles 4 de noviembre (fechas oficiales de la CACE) y muchas tiendas estiran las promos toda esa semana. Antes y durante el evento, cada producto de esta tabla se compara contra el precio más bajo que registramos, así distinguís una baja de verdad de un "antes" inflado. Se actualiza 3 veces por día.',
    keywords: [
      'notebook', 'celular', 'smart tv', 'aire acondicionado', 'heladera',
      'lavarropas', 'colchon', 'freidora de aire', 'taladro', 'amoladora',
      'hidrolavadora', 'parlante', 'tablet',
    ],
    presupuestos: [100000, 400000],
    criterios: [
      'Armá tu lista antes del lunes 2 y anotá cuánto sale cada cosa hoy: así, cuando arranque el evento, sabés en dos segundos si bajó o si solo le cambiaron el cartel.',
      'El "% OFF" no dice nada si el precio de referencia subió las semanas previas. Lo que cuenta es el precio de hoy contra el mínimo registrado de ese mismo producto.',
      'Hacé la cuenta del precio final: envío, cuotas sin interés de verdad (no con recargo escondido) y reintegros o cupones del banco, que muchas veces tienen tope y fecha de acreditación.',
      'Si lo que buscás ya está en su mínimo histórico, no hace falta esperar al evento. Y si se te pasa, el Black Friday (viernes 27 de noviembre) es otra oportunidad, aunque ahí cada tienda arma sus promos por su cuenta.',
      'En compras grandes, priorizá tiendas oficiales o vendedores con reputación verde, y fijate que la garantía sea oficial en Argentina.',
    ],
    guia: 'hot-sale-cyber-monday-o-dia-comun-cuando-comprar-en-mercado-libre',
  },
  {
    slug: 'cyber-monday-smart-tv',
    nombre: 'smart TV en el Cyber Monday',
    titulo: `Smart TV en el Cyber Monday ${AÑO}: cuáles bajan de verdad`,
    descripcion:
      'Smart TV en oferta para el Cyber Monday 2026 en Mercado Libre Argentina (2 al 4 de noviembre): precio de hoy, descuento y mínimo registrado de cada modelo.',
    intro:
      'El Cyber Monday 2026 va del lunes 2 al miércoles 4 de noviembre (fechas de la CACE). Los smart TV son de lo más buscado del evento y también de lo más inflado: esta tabla compara cada modelo contra el precio más bajo que registramos. Se actualiza 3 veces por día, antes y durante el evento.',
    categoria: 'smart-tv',
    excluir: ['monitor'],
    criterios: [
      'Compará el precio del evento contra el mínimo registrado de la tabla: si el "antes" subió las semanas previas, el % OFF es de cartel.',
      'Tamaño según la distancia: a 2 metros va bien uno de 50 a 55 pulgadas; 4K desde 43.',
      'Mirá el sistema operativo (Google TV, Tizen, webOS) y que tenga las apps que usás.',
      'Cuotas sin interés: verificá que el precio en cuotas sea el mismo que en un pago.',
    ],
    guia: 'que-smart-tv-comprar-cyber-monday',
  },
  {
    slug: 'cyber-monday-aires-acondicionados',
    nombre: 'aires acondicionados en el Cyber Monday',
    titulo: `Aires acondicionados en el Cyber Monday ${AÑO}: ofertas con precio verificado`,
    descripcion:
      'Aires acondicionados split en oferta para el Cyber Monday 2026 en Mercado Libre Argentina: precio, descuento y mínimo registrado, justo antes del verano.',
    intro:
      'El Cyber Monday 2026 va del lunes 2 al miércoles 4 de noviembre (fechas de la CACE). Cae justo antes del verano, cuando los aires suben: comprarlo en noviembre suele salir más barato que en diciembre. Cada equipo se compara contra el precio más bajo que registramos.',
    categoria: 'aire-acondicionado',
    criterios: [
      'Compará el precio del evento contra el mínimo registrado de la tabla: si el "antes" subió las semanas previas, el % OFF es de cartel.',
      'Frigorías según el ambiente: m² × altura × 50 (un cuarto de 20 m² necesita unas 2.600).',
      'Inverter si lo vas a usar muchas horas: consume menos.',
      'La instalación casi nunca está incluida: sumala al presupuesto y pedí turno con tiempo, en diciembre se satura.',
    ],
    guia: 'conviene-comprar-aire-acondicionado-cyber-monday',
  },
  {
    slug: 'cyber-monday-notebooks',
    nombre: 'notebooks en el Cyber Monday',
    titulo: `Notebooks en el Cyber Monday ${AÑO}: ofertas con descuento verificado`,
    descripcion:
      'Notebooks en oferta para el Cyber Monday 2026 en Mercado Libre Argentina (2 al 4 de noviembre), comparadas contra el precio mínimo registrado de cada modelo.',
    intro:
      'El Cyber Monday 2026 va del lunes 2 al miércoles 4 de noviembre (fechas de la CACE). Las notebooks son la categoría estrella del evento. Esta tabla compara cada modelo contra el precio más bajo que registramos para que sepas si la baja es real.',
    keywords: ['notebook', 'laptop', 'macbook'],
    excluir: ['monitor', 'mochila', 'cargador'],
    criterios: [
      'Compará el precio del evento contra el mínimo registrado de la tabla: si el "antes" subió las semanas previas, el % OFF es de cartel.',
      'Para uso diario: 8 GB de RAM como mínimo (mejor 16) y disco SSD.',
      'Procesador: Ryzen 5 / Core i5 o superior si vas a trabajar o estudiar con varias cosas abiertas.',
      'Revisá que la garantía sea oficial en Argentina y que el teclado sea en español si te importa la ñ.',
    ],
    guia: 'que-notebook-comprar-cyber-monday',
  },
  {
    slug: 'cyber-monday-celulares',
    nombre: 'celulares en el Cyber Monday',
    titulo: `Celulares en el Cyber Monday ${AÑO}: ofertas reales en Mercado Libre`,
    descripcion:
      'Celulares en oferta para el Cyber Monday 2026 en Mercado Libre Argentina: Samsung, Motorola, iPhone y más, con el precio comparado contra el mínimo registrado.',
    intro:
      'El Cyber Monday 2026 va del lunes 2 al miércoles 4 de noviembre (fechas de la CACE). Cada celular de esta tabla se compara contra el precio más bajo que registramos, así distinguís una baja de verdad de un precio de lista inflado.',
    keywords: ['celular', 'smartphone', 'iphone', 'samsung galaxy', 'motorola moto'],
    excluir: ['funda', 'cargador para', 'soporte', 'smartwatch', 'reloj', 'tablet'],
    criterios: [
      'Compará el precio del evento contra el mínimo registrado de la tabla: si el "antes" subió las semanas previas, el % OFF es de cartel.',
      'Mirá la memoria: 128 GB de almacenamiento y 6 GB de RAM alcanzan para la mayoría.',
      'Preferí equipos liberados con garantía oficial; evitá los "importados" sin garantía local.',
      'Compará el mismo modelo en tiendas oficiales: a veces la diferencia está en las cuotas, no en el precio.',
    ],
    guia: 'que-celular-comprar-cyber-monday',
  },
  {
    slug: 'cyber-monday-lavarropas',
    nombre: 'lavarropas en el Cyber Monday',
    titulo: `Lavarropas en el Cyber Monday ${AÑO}: precios comparados`,
    descripcion:
      'Lavarropas en oferta para el Cyber Monday 2026 en Mercado Libre Argentina: carga frontal y superior, con el descuento verificado contra el historial de precios.',
    intro:
      'El Cyber Monday 2026 va del lunes 2 al miércoles 4 de noviembre (fechas de la CACE). Los lavarropas son una de las compras grandes que más conviene hacer en el evento, siempre que la baja sea real: acá cada uno se compara contra el mínimo que registramos.',
    categoria: 'lavarropas',
    keywords: ['lavarropas'],
    criterios: [
      'Compará el precio del evento contra el mínimo registrado de la tabla: si el "antes" subió las semanas previas, el % OFF es de cartel.',
      'Capacidad: 6 a 7 kg para 2 o 3 personas; 8 kg o más para familias.',
      'Carga frontal: lava mejor y gasta menos agua; carga superior: más barato y más rápido.',
      'Revisá las medidas del lugar y si incluye instalación o envío a domicilio.',
    ],
    guia: 'que-lavarropas-comprar-cyber-monday',
  },
  {
    slug: 'cyber-monday-auriculares',
    nombre: 'auriculares en el Cyber Monday',
    titulo: `Auriculares en el Cyber Monday ${AÑO}: ofertas con descuento verificado`,
    descripcion:
      'Auriculares en oferta para el Cyber Monday 2026 en Mercado Libre Argentina: inalámbricos, in-ear y over-ear, con el precio comparado contra el mínimo registrado.',
    intro:
      'El Cyber Monday 2026 va del lunes 2 al miércoles 4 de noviembre (fechas de la CACE). Los auriculares son un regalo fácil y un clásico del evento. Cada modelo se compara contra el precio más bajo que registramos.',
    keywords: ['auriculares', 'auricular'],
    excluir: ['smartphone', 'celular', 'telefono', 'parlante'],
    criterios: [
      'Compará el precio del evento contra el mínimo registrado de la tabla: si el "antes" subió las semanas previas, el % OFF es de cartel.',
      'Cancelación de ruido activa (ANC) si viajás o trabajás en lugares ruidosos.',
      'Mirá la autonomía de batería y si el estuche carga por USB-C.',
      'Desconfiá de las marcas famosas muy por debajo de su precio: preferí tiendas oficiales.',
    ],
    guia: 'que-auriculares-comprar-cyber-monday',
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
    guia: 'que-cocina-comprar',
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
    guia: 'que-termotanque-comprar',
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
    guia: 'que-freezer-comprar',
  },
  {
    slug: 'mejores-aspiradoras',
    guia: 'que-aspiradora-comprar',
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
    guia: 'que-freidora-de-aire-comprar',
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
    guia: 'que-ventilador-comprar',
  },
  {
    slug: 'mejores-cafeteras',
    nombre: 'cafeteras',
    titulo: `Mejores cafeteras en oferta ${AÑO}: comparativa de precios`,
    descripcion:
      'Comparativa de cafeteras espresso, de cápsulas y de filtro en oferta hoy en Mercado Libre Argentina: precio, descuento y precio mínimo registrado.',
    intro:
      'Las cafeteras en oferta hoy, comparadas por precio, descuento y el precio más bajo que registramos para cada una. La tabla se actualiza 3 veces por día.',
    categoria: 'electro-de-cocina',
    keywords: ['cafetera'],
    criterios: [
      'Tipo: de filtro para hacer varias tazas juntas; espresso si te gusta el café concentrado; de cápsulas si priorizás la practicidad.',
      'Espresso: fijate si trae vaporizador para espumar leche y si tiene molinillo integrado o necesitás café ya molido.',
      'Cápsulas: la máquina suele ser barata, pero cada taza sale más cara; confirmá que consigas cápsulas compatibles.',
      'Que el depósito de agua y la bandeja de goteo se saquen fácil: la limpieza diaria es lo que más se usa.',
    ],
    guia: 'que-cafetera-comprar',
  },
  {
    slug: 'mejores-microondas',
    nombre: 'microondas',
    titulo: `Mejores microondas en oferta ${AÑO}: comparativa de precios`,
    descripcion:
      'Comparativa de microondas en oferta hoy en Mercado Libre Argentina: precio, descuento, capacidad y precio mínimo registrado.',
    intro:
      'Los microondas en oferta hoy, comparados por precio, descuento y el precio más bajo que registramos para cada uno. La tabla se actualiza 3 veces por día.',
    categoria: 'electro-de-cocina',
    keywords: ['microondas'],
    criterios: [
      'Capacidad: 20 litros alcanza para calentar y descongelar; si vas a cocinar o usar fuentes grandes, conviene 25 litros o más.',
      'Con grill podés gratinar y dorar; si solo calentás, el modelo básico alcanza.',
      'Digital o mecánico: el digital trae programas automáticos; el de perilla es más simple y tiene menos que se rompa.',
      'Medí el hueco donde va antes de comprar y dejá espacio para ventilación a los costados y arriba.',
    ],
  },
  {
    slug: 'mejores-licuadoras',
    nombre: 'licuadoras y minipimers',
    titulo: `Mejores licuadoras y minipimers en oferta ${AÑO}: comparativa de precios`,
    descripcion:
      'Comparativa de licuadoras y minipimers (mixers de mano) en oferta hoy en Mercado Libre Argentina: precio, descuento y precio mínimo registrado.',
    intro:
      'Las licuadoras y minipimers en oferta hoy, comparados por precio, descuento y el precio más bajo que registramos. La tabla se actualiza 3 veces por día.',
    categoria: 'electro-de-cocina',
    keywords: ['licuadora', 'minipimer', 'mixer de mano'],
    criterios: [
      'Licuadora de vaso para licuados, salsas y hielo; minipimer para sopas, purés y cantidades chicas directo en la olla.',
      'Jarra de vidrio: no se raya ni toma olor; la plástica pesa menos y no se rompe si se cae.',
      'Si vas a triturar hielo o frutas congeladas, buscá cuchillas de acero y que el fabricante lo indique.',
      'Minipimer con accesorios (vaso, picador, batidor) reemplaza a varios aparatos en cocinas chicas.',
    ],
  },
  {
    slug: 'mejores-batidoras',
    nombre: 'batidoras',
    titulo: `Mejores batidoras en oferta ${AÑO}: comparativa de precios`,
    descripcion:
      'Comparativa de batidoras planetarias y de mano en oferta hoy en Mercado Libre Argentina: precio, descuento y precio mínimo registrado.',
    intro:
      'Las batidoras en oferta hoy, comparadas por precio, descuento y el precio más bajo que registramos para cada una. La tabla se actualiza 3 veces por día.',
    categoria: 'electro-de-cocina',
    keywords: ['batidora'],
    criterios: [
      'Planetaria si hacés masas, tortas o panes seguido: amasa sola y libera las manos. De mano si es para uso ocasional.',
      'Bowl: 4 a 5 litros alcanza para una casa; bowl de acero dura más que el plástico.',
      'Que traiga gancho amasador, batidor de globo y paleta: son los tres que se usan de verdad.',
      'Varias velocidades y arranque suave evitan salpicar harina al empezar.',
    ],
  },
  {
    slug: 'mejores-monitores',
    guia: 'que-monitor-comprar',
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
  {
    slug: 'mejores-monitores-gamer',
    nombre: 'monitores gamer',
    titulo: `Mejores monitores gamer en oferta ${AÑO}: comparativa de precios`,
    descripcion:
      'Comparativa de monitores gamer en oferta hoy en Mercado Libre Argentina: pulgadas, Hz, precio, descuento y precio mínimo registrado.',
    intro:
      'Los monitores gamer en oferta hoy, comparados por precio, descuento y el precio más bajo que registramos. La tabla se actualiza 3 veces por día.',
    categoria: 'gamer',
    keywords: ['monitor'],
    criterios: [
      'Frecuencia: 144 Hz o más para que el movimiento se vea fluido; tu placa de video o consola tiene que llegar a esos cuadros.',
      'Tiempo de respuesta de 1 ms o menos para evitar estelas en juegos rápidos.',
      '27 pulgadas o más: resolución 2K (QHD); en 24 pulgadas alcanza con Full HD.',
      'FreeSync o G-Sync evitan cortes en la imagen cuando los cuadros por segundo varían.',
      'Entradas: DisplayPort o HDMI que soporten la frecuencia máxima del monitor.',
    ],
    enlaces: [
      { href: '/mejores/mejores-sillas-gamer', texto: 'Comparativa de sillas gamer 🪑' },
      { href: '/guias/que-silla-gamer-comprar', texto: '¿Qué silla gamer comprar?' },
    ],
  },
  {
    slug: 'mejores-sillas-gamer',
    nombre: 'sillas gamer',
    titulo: `Mejores sillas gamer en oferta ${AÑO}: comparativa de precios`,
    descripcion:
      'Comparativa de sillas gamer en oferta hoy en Mercado Libre Argentina: precio, descuento y precio mínimo registrado. Qué mirar: peso máximo, tela o cuero sintético, reclinación y apoyabrazos.',
    intro:
      'Las sillas gamer en oferta hoy, comparadas por precio, descuento y el precio más bajo que registramos. La tabla se actualiza 3 veces por día.',
    categoria: 'gamer',
    keywords: ['silla'],
    excluir: ['funda', 'repuesto', 'piston', 'rueda', 'almohad'],
    criterios: [
      'Peso máximo y altura recomendada: elegí una que te quede con margen; el pistón y la base son lo primero que se gasta.',
      'Tela si hace calor o la usás muchas horas; cuero sintético (PU) si priorizás limpiarla fácil.',
      'Apoyo lumbar regulable y apoyabrazos ajustables (3D o 4D) pesan más que las luces o el diseño.',
      'Reclinación con traba en varias posiciones y base metálica para que dure.',
      'Garantía oficial en Argentina y si llega armada o hay que armarla.',
    ],
    guia: 'que-silla-gamer-comprar',
    enlaces: [{ href: '/mejores/mejores-monitores-gamer', texto: 'Comparativa de monitores gamer' }],
  },
  {
    slug: 'mejores-notebooks',
    nombre: 'notebooks',
    titulo: `Mejores notebooks en oferta ${AÑO}: comparativa de precios`,
    descripcion:
      'Comparativa de notebooks en oferta hoy en Mercado Libre Argentina: precio, descuento y precio mínimo registrado. Qué mirar antes de comprar.',
    intro:
      'Las notebooks en oferta hoy, comparadas por precio, descuento y el precio más bajo que registramos para cada una. La tabla se actualiza 3 veces por día.',
    keywords: ['notebook', 'laptop', 'macbook'],
    excluir: ['monitor', 'mochila', 'cargador', 'funda', 'soporte', 'base para'],
    criterios: [
      'Memoria: 8 GB de RAM como mínimo para uso diario; 16 GB si trabajás o estudiás con muchas cosas abiertas.',
      'Disco SSD: arranca y abre programas mucho más rápido que un disco rígido; 256 GB es lo mínimo razonable, 512 GB es más cómodo.',
      'Procesador: Ryzen 5 / Core i5 o superior para trabajo y estudio; Ryzen 3 / Core i3 alcanza para navegar y ofimática.',
      'Revisá que la garantía sea oficial en Argentina y que el teclado sea en español si te importa la ñ.',
    ],
    guia: 'que-notebook-comprar',
  },
  {
    slug: 'mejores-celulares',
    nombre: 'celulares',
    titulo: `Mejores celulares en oferta ${AÑO}: comparativa de precios`,
    descripcion:
      'Comparativa de celulares Samsung, Motorola, iPhone y otras marcas en oferta hoy en Mercado Libre Argentina: precio, descuento y precio mínimo registrado.',
    intro:
      'Los celulares en oferta hoy, comparados por precio, descuento y el precio más bajo que registramos para cada uno. La tabla se actualiza 3 veces por día.',
    keywords: ['celular', 'smartphone', 'iphone', 'samsung galaxy', 'motorola moto', 'moto g'],
    excluir: ['vidrio templado', 'protector', 'cargador', 'soporte', 'reloj', 'smartwatch', 'auricular inalambrico'],
    permitir: ['funda', 'cargador'],
    criterios: [
      'Almacenamiento: 128 GB como mínimo; las fotos, videos y WhatsApp llenan 64 GB rápido.',
      'RAM: 4 GB alcanza para lo básico; 6 u 8 GB si usás muchas apps a la vez o jugás.',
      'Que sea versión para Argentina (bandas de 4G/5G de las compañías locales) y con garantía oficial.',
      'Años de actualizaciones del fabricante: un equipo que recibe parches de seguridad por más tiempo dura más.',
    ],
    guia: 'que-celular-comprar-segun-presupuesto',
  },
  {
    slug: 'mejores-celulares-gama-alta',
    nombre: 'celulares de gama alta',
    titulo: `Mejores celulares de gama alta en oferta ${AÑO}: iPhone, Galaxy S y más`,
    descripcion:
      'Comparativa de celulares de gama alta en oferta hoy en Mercado Libre Argentina (iPhone, Samsung Galaxy S, Motorola Edge, Xiaomi tope de gama): precio, descuento y precio mínimo registrado.',
    intro:
      'Los celulares de gama alta en oferta hoy, comparados por precio, descuento y el precio más bajo que registramos para cada uno. La tabla se actualiza 3 veces por día.',
    keywords: ['iphone', 'galaxy s2', 'galaxy z fold', 'galaxy z flip', 'motorola edge', 'moto edge', 'motorola razr', 'pixel 9', 'pixel 10', 'xiaomi 15', 'xiaomi 16'],
    excluir: ['vidrio templado', 'protector', 'cargador', 'soporte', 'reloj', 'smartwatch', 'cable', 'auricular', 'reacondicionado'],
    permitir: ['funda'],
    criterios: [
      'Ecosistema: iPhone si ya usás Mac, iPad o Apple Watch; Galaxy S, Edge o Xiaomi si preferís Android.',
      'Almacenamiento: la mayoría no acepta microSD; 256 GB es un piso cómodo si grabás video.',
      'Garantía oficial en Argentina: tienda oficial o distribuidor autorizado.',
      'Cuotas sin interés: en equipos de varios millones, comparalas contra el precio en un pago.',
      'Años de actualizaciones del fabricante y precio del modelo anterior, que suele bajar al salir el nuevo.',
    ],
    guia: 'que-celular-gama-alta-comprar',
  },
  {
    slug: 'mejores-tablets',
    nombre: 'tablets',
    titulo: `Mejores tablets en oferta ${AÑO}: comparativa de precios`,
    descripcion:
      'Comparativa de tablets Android y iPad en oferta hoy en Mercado Libre Argentina: precio, descuento y precio mínimo registrado.',
    intro:
      'Las tablets en oferta hoy, comparadas por precio, descuento y el precio más bajo que registramos para cada una. La tabla se actualiza 3 veces por día.',
    keywords: ['tablet', 'tableta', 'ipad'],
    excluir: ['funda', 'vidrio templado', 'protector', 'soporte', 'teclado para', 'cargador', 'grafica', 'digitalizadora'],
    permitir: ['funda'],
    criterios: [
      'Pantalla: 8 pulgadas para leer y llevar; 10 u 11 pulgadas para series, clases o trabajar.',
      'RAM y almacenamiento: 4 GB y 64 GB como mínimo; si la vas a usar para estudiar o dibujar, mejor 8 GB y 128 GB.',
      'Fijate si acepta tarjeta microSD para ampliar la memoria y si tiene versión con chip (LTE) si la querés usar fuera de casa.',
      'Para chicos: una funda resistente y control parental importan más que el procesador.',
    ],
    guia: 'que-tablet-comprar',
  },
  {
    slug: 'mejores-smartwatch',
    guia: 'que-smartwatch-comprar',
    nombre: 'smartwatch',
    titulo: `Mejores smartwatch en oferta ${AÑO}: comparativa de precios`,
    descripcion:
      'Comparativa de smartwatch y smartbands en oferta hoy en Mercado Libre Argentina: precio, descuento y precio mínimo registrado. Qué mirar antes de comprar.',
    intro:
      'Los smartwatch y smartbands en oferta hoy, comparados por precio, descuento y el precio más bajo que registramos para cada uno. La tabla se actualiza 3 veces por día.',
    keywords: ['smartwatch', 'smart watch', 'reloj inteligente', 'smartband', 'smart band'],
    excluir: ['malla', 'correa', 'vidrio templado', 'protector', 'cargador', 'funda'],
    criterios: [
      'Compatibilidad: que funcione con el celular de quien lo va a usar (Android o iPhone).',
      'GPS propio si sale a correr o pedalear sin el celular.',
      'Batería: los relojes deportivos duran varios días; los más completos suelen pedir carga diaria.',
      'Sensores de salud (frecuencia cardíaca, oxígeno, ECG): revisá cuáles tiene cada modelo en la ficha.',
      'Tamaño de la pantalla y de la caja según la muñeca.',
    ],
  },
  {
    slug: 'mejores-planchitas-y-secadores-de-pelo',
    nombre: 'planchitas y secadores de pelo',
    titulo: `Mejores planchitas y secadores de pelo en oferta ${AÑO}`,
    descripcion:
      'Comparativa de planchitas, secadores y rizadores de pelo en oferta hoy en Mercado Libre Argentina: precio, descuento y precio mínimo registrado.',
    intro:
      'Las planchitas, secadores y rizadores de pelo en oferta hoy, comparados por precio, descuento y el precio más bajo que registramos. La tabla se actualiza 3 veces por día.',
    keywords: ['planchita', 'plancha de pelo', 'plancha pelo', 'alisador', 'secador de pelo', 'secador', 'rizador', 'buclera', 'ondulador'],
    excluir: ['secador de manos', 'secarropas', 'secador de ropa', 'plancha de ropa', 'plancha a vapor', 'plancha de vapor', 'protector termico para'],
    permitir: ['funda', 'protector'],
    criterios: [
      'Placas de cerámica o turmalina: reparten mejor el calor y maltratan menos el pelo.',
      'Temperatura regulable: pelo fino o teñido pide menos grados que uno grueso.',
      'Secador: 2000 W o más seca rápido; el aire frío ayuda a fijar el peinado.',
      'Ancho de placa: angosta para pelo corto o flequillo, ancha para pelo largo.',
      'Protector térmico antes de alisar, aunque la planchita no lo traiga.',
    ],
  },
  {
    slug: 'mejores-afeitadoras-y-cortadoras-de-pelo',
    nombre: 'afeitadoras y cortadoras de pelo',
    titulo: `Mejores afeitadoras y cortadoras de pelo en oferta ${AÑO}`,
    descripcion:
      'Comparativa de afeitadoras, cortadoras de pelo, trimmers y depiladoras en oferta hoy en Mercado Libre Argentina: precio, descuento y mínimo registrado.',
    intro:
      'Las afeitadoras, cortadoras de pelo, trimmers y depiladoras en oferta hoy, comparadas por precio, descuento y el precio más bajo que registramos. Se actualiza 3 veces por día.',
    keywords: ['afeitadora', 'cortadora de pelo', 'cortadora de barba', 'maquina cortar pelo', 'maquina de cortar pelo', 'trimmer', 'patillera', 'clipper', 'shaver', 'depiladora'],
    excluir: ['cuchilla', 'repuesto', 'aceite para', 'peine para'],
    criterios: [
      'Inalámbrica con batería de buena autonomía si la vas a usar lejos del enchufe.',
      'Peines guía: cuantos más largos de corte trae, más estilos podés hacer.',
      'Cuchillas de acero inoxidable o titanio, y que se puedan desmontar para limpiarlas.',
      'Afeitadora de lámina para afeitado al ras; trimmer para perfilar barba y patillas.',
      'Depiladora: con cabezal para zonas sensibles si la va a usar en todo el cuerpo.',
    ],
  },
  {
    slug: 'mejores-colchones-2-plazas',
    nombre: 'colchones de 2 plazas',
    titulo: `Mejores colchones 2 plazas y queen en oferta ${AÑO}`,
    descripcion:
      'Colchones de 2 plazas, queen y king en oferta hoy en Mercado Libre Argentina: medida, material, precio y precio mínimo registrado.',
    intro:
      'Los colchones de 2 plazas, queen y king en oferta hoy (solos o con sommier), comparados por precio, descuento y el precio más bajo que registramos. Se actualiza 3 veces por día.',
    categoria: 'colchones',
    keywords: ['2 plazas', 'dos plazas', 'queen', 'king', '130x190', '140x190', '140x200', '160x200', '180x200', '200x200'],
    excluir: ['practicuna', 'cuna', 'funda', 'protector', 'almohada'],
    criterios: [
      'Medida: 2 plazas es 130x190 o 140x190; queen, 160x200; king, 180x200 o 200x200. Medí la base antes de comprar.',
      'Con dos personas, resortes pocket o espuma de alta densidad transmiten menos el movimiento de uno al otro.',
      'Mirá el peso máximo por plaza que declara el fabricante.',
      'Si viene con sommier, fijate la altura total y si las patas vienen incluidas.',
      'Garantía del fabricante y si el colchón viene "en caja" (tarda 24-48 h en tomar su forma).',
    ],
    guia: 'que-colchon-comprar-firmeza-y-material',
  },
  {
    slug: 'mejores-sommiers',
    nombre: 'sommiers',
    titulo: `Mejores sommiers y conjuntos en oferta ${AÑO}: comparativa`,
    descripcion:
      'Sommiers y conjuntos sommier + colchón en oferta hoy en Mercado Libre Argentina: medida, precio, descuento y precio mínimo registrado.',
    intro:
      'Los sommiers y conjuntos sommier + colchón en oferta hoy, comparados por precio, descuento y el precio más bajo que registramos. Se actualiza 3 veces por día.',
    categoria: 'colchones',
    keywords: ['sommier', 'somier', 'box spring'],
    excluir: ['funda', 'cubre sommier', 'pollera'],
    criterios: [
      'Que la medida del sommier sea exactamente la del colchón (130x190, 140x190, 160x200...).',
      'Conjunto o solo base: el conjunto suele salir más barato que comprar las dos cosas por separado.',
      'Peso máximo que soporta y material de la estructura (madera o metal).',
      'Altura total con el colchón puesto y si trae patas, cajones o respaldo.',
    ],
    guia: 'que-colchon-comprar-firmeza-y-material',
  },
  {
    slug: 'mejores-muebles-de-jardin',
    nombre: 'muebles de jardín y gazebos',
    titulo: `Mejores muebles de jardín y gazebos en oferta ${AÑO}`,
    descripcion:
      'Gazebos, reposeras, sillas, mesas y guardado de exterior en oferta hoy en Mercado Libre Argentina, con precio mínimo registrado.',
    intro:
      'Gazebos, reposeras, sillas, mesas y guardado de exterior en oferta hoy, comparados por precio, descuento y el precio más bajo que registramos. Se actualiza 3 veces por día.',
    keywords: ['gazebo', 'glorieta', 'pergola', 'sombrilla', 'reposera', 'camastro', 'hamaca', 'jardin', 'exterior', 'gardenlife'],
    excluir: ['bordeadora', 'cortadora', 'desmalezadora', 'motosierra', 'bomba', 'manguera', 'tijera', 'hidrolavadora', 'sopladora', 'luz', 'lampara', 'camara'],
    criterios: [
      'Gazebo: medida (3x3 es la más común), estructura de acero y lona con protección UV; mirá si trae paredes laterales y estacas.',
      'Plástico reforzado o aluminio aguantan la intemperie sin mantenimiento; la madera necesita tratamiento.',
      'Reposeras y sillas: peso máximo que soportan y si son plegables o apilables para guardarlas en invierno.',
      'Guardado de exterior: acero galvanizado y medidas interiores reales, no solo las exteriores.',
    ],
  },
  {
    slug: 'mejores-parrillas',
    guia: 'que-parrilla-comprar',
    nombre: 'parrillas',
    titulo: `Mejores parrillas y asadores en oferta ${AÑO}: comparativa`,
    descripcion:
      'Parrillas, asadores, fogoneros y parrillas eléctricas en oferta hoy en Mercado Libre Argentina: precio, descuento y precio mínimo registrado.',
    intro:
      'Las parrillas y asadores en oferta hoy, comparados por precio, descuento y el precio más bajo que registramos. Se actualiza 3 veces por día.',
    categoria: 'parrillas',
    excluir: ['cocina', 'anafe', 'horno'],
    criterios: [
      'Para balcón o departamento: parrilla eléctrica o a gas; a carbón o leña, patio o quincho.',
      'Tamaño de la grilla según cuántos van a comer.',
      'Chapa gruesa o hierro fundido retienen mejor el calor y duran más.',
      'Ruedas, tapa y regulación de altura de la grilla hacen la diferencia en el uso diario.',
    ],
  },
  {
    slug: 'mejores-bicicletas',
    guia: 'que-bicicleta-comprar',
    nombre: 'bicicletas',
    titulo: `Mejores bicicletas en oferta ${AÑO}: comparativa de precios`,
    descripcion:
      'Bicicletas urbanas, mountain bike, de ruta, plegables y eléctricas en oferta hoy en Mercado Libre Argentina: precio, descuento y precio mínimo registrado.',
    intro:
      'Las bicicletas en oferta hoy, comparadas por precio, descuento y el precio más bajo que registramos. Se actualiza 3 veces por día.',
    categoria: 'bicicletas',
    criterios: [
      'Tipo según el uso: urbana o paseo para ciudad, mountain bike para tierra y ripio, ruta para asfalto y distancia.',
      'Rodado y talle de cuadro según tu altura: están en la ficha de cada modelo.',
      'Frenos a disco frenan mejor con lluvia que los V-brake.',
      'Cuadro de aluminio pesa menos; el de acero es más económico y resistente.',
    ],
  },
  {
    slug: 'mejores-piletas',
    guia: 'que-pileta-comprar',
    nombre: 'piletas',
    titulo: `Mejores piletas de lona y accesorios en Argentina ${AÑO}`,
    descripcion:
      'Piletas de lona, estructurales e inflables, bombas y filtros en oferta hoy en Mercado Libre Argentina, con precio mínimo registrado.',
    intro:
      'Piletas y equipamiento para la pileta en oferta hoy, comparados por precio, descuento y el precio más bajo que registramos. Se actualiza 3 veces por día.',
    keywords: ['pileta', 'piscina', 'pelopincho'],
    excluir: ['termometro', 'cloro', 'pastilla', 'barrefondo', 'saca hojas'],
    criterios: [
      'Capacidad en litros según el espacio disponible: está en la ficha de cada modelo.',
      'Estructural (caños de acero) dura más temporadas que la inflable.',
      'Filtro o bomba acordes al volumen de agua: mirá los litros por hora que declara el fabricante.',
      'Superficie nivelada y lona de base para que no se rompa el piso de la pileta.',
    ],
  },
]

export function getComparativa(slug: string) {
  return COMPARATIVAS.find(c => c.slug === slug)
}

export function categoriaDe(c: Comparativa): Categoria | undefined {
  return c.categoria ? getCategoria(c.categoria) : undefined
}

// Con menos productos la página es flaca: no va al sitemap y lleva noindex
// (vuelve sola cuando el catálogo del día tiene suficientes).
export const MIN_PRODUCTOS_INDEXABLE = 3

export function indexable(c: Comparativa): boolean {
  return PERENNES.has(c.slug) || c.slug in CONTENIDO || productosDe(c).length >= MIN_PRODUCTOS_INDEXABLE
}

export function productosDe(c: Comparativa): ProductWithMargins[] {
  const ok = (c.permitir ?? []).map(normalizar)
  const fuera = (c.excluir ?? []).map(normalizar).filter(x => !ok.includes(x))
  // Accesorio suelto: el título arranca con la palabra permitida o dice "<palabra> para".
  const suelto = (t: string) => ok.some(x => t.startsWith(x) || t.includes(`${x} para`))
  return productosBase(c).filter(p => {
    const t = normalizar(p.titulo)
    return !fuera.some(x => t.includes(x)) && !suelto(t)
  })
}

function productosBase(c: Comparativa): ProductWithMargins[] {
  const cat = categoriaDe(c)
  const kws = (c.keywords ?? []).map(normalizar)
  // Con categoría y keywords (soldadoras, amoladoras dentro de herramientas),
  // la tabla es solo de ese producto, no de toda la categoría.
  if (cat) {
    const deCat = ofertasDeCategoria(cat)
    return kws.length ? deCat.filter(p => kws.some(k => normalizar(p.titulo).includes(k))) : deCat
  }
  // Reusa el catálogo completo vía cualquier categoría: ofertasDeCategoria
  // con una categoría "virtual" sin exclusiones.
  const ok = (c.permitir ?? []).map(normalizar)
  const fijas = ['repuesto', 'funda', 'soporte', 'mochila', 'cargador', 'protector', 'vidrio templado', 'base para']
  const todos = ofertasDeCategoria({ ...CATEGORIAS[0], keywords: kws, excluir: fijas.filter(x => !ok.includes(x)) })
  // Las de temporada y regalos son para compradores comunes: sin equipamiento
  // de negocio ("heladera" traía una exhibidora comercial primera en la tabla).
  const gastro = getCategoria('equipamiento-gastronomico')
  if (!gastro) return todos
  const comerciales = new Set(ofertasDeCategoria(gastro).map(p => p.id_ml))
  return todos.filter(p => !comerciales.has(p.id_ml))
}
