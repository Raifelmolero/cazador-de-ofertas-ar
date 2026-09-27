// Guías para vendedores y revendedores (dominio calculadoraml.com.ar).
// Público distinto al de cazadordeofertas: gente que vende o quiere vender
// online. Las cifras de ML salen de lib/costosml.ts (fuente oficial).

import {
  CARGO_MAX,
  CARGO_MIN,
  COSTOS_VERIFICADOS,
  COSTOS_VIGENCIA,
  ENVIO_GRATIS_VERDE,
  ENVIO_GRATIS_VERIFICADO,
  UMBRAL_COSTO_FIJO,
} from '@/lib/costosml'
import {
  CATEGORIAS_MONOTRIBUTO,
  FUENTE_MONOTRIBUTO,
  MONOTRIBUTO_VERIFICADO,
  MONOTRIBUTO_VIGENCIA,
  PRECIO_UNITARIO_MAX,
  TOPE_MONOTRIBUTO,
  arsCentavos,
} from '@/lib/monotributo'

export const CALC_URL = 'https://calculadoraml.com.ar'

// Link de afiliado de Tiendanube (lo genera Raifel en su panel de afiliados).
// Vacío = link común, sin comisión. Siempre se aclara en la página que es
// un link de afiliado cuando lo es.
export const TIENDANUBE_AFILIADO = 'https://www.tiendanube.com/partners/cazador-de-ofertas-ar'
export const TIENDANUBE_URL = TIENDANUBE_AFILIADO || 'https://www.tiendanube.com/'

const pct = (n: number) => String(n).replace('.', ',')
const ars = (n: number) => `$${n.toLocaleString('es-AR')}`

export interface GuiaVendedor {
  slug: string
  titulo: string
  descripcion: string
  pregunta: string
  respuestaCorta: string
  secciones: { h: string; p: string[] }[]
  cta: { href: string; boton: string; texto: string; afiliado?: boolean }
  /** Link interno a una herramienta relacionada (se muestra antes del CTA). */
  herramienta?: { href: string; texto: string; boton: string }
  /** Fuentes oficiales citadas (se listan al final y van al JSON-LD). */
  fuentes?: { texto: string; url: string }[]
  /** Fecha en que se consultaron las fuentes ("27 de septiembre de 2026"). */
  verificado?: string
}

const MONO_A = CATEGORIAS_MONOTRIBUTO[0]
const MONO_K = CATEGORIAS_MONOTRIBUTO[CATEGORIAS_MONOTRIBUTO.length - 1]
const ENVIO_03 = ENVIO_GRATIS_VERDE[0]

const HERRAMIENTA_ML_VS_TN = {
  href: '/mercado-libre-vs-tiendanube',
  texto: 'Hacé la cuenta con tus números: precio, costo y ventas por mes en Mercado Libre y en Tiendanube, y cuántas ventas necesitás para que el plan se pague solo.',
  boton: 'Calculadora Mercado Libre vs Tiendanube 🧮',
}

// Monotributo, envío gratis y reputación (fuentes consultadas el 27/09/2026).
const GUIAS_NUEVAS: GuiaVendedor[] = [
  {
    slug: 'monotributo-para-vender-en-mercado-libre',
    titulo: 'Monotributo para vender en Mercado Libre: categorías 2026, facturación y retenciones',
    descripcion: `Cuándo necesitás el monotributo para vender en Mercado Libre, las categorías vigentes desde el ${MONOTRIBUTO_VIGENCIA} (hasta ${arsCentavos(TOPE_MONOTRIBUTO)} por año), cómo facturar con Factura C y qué retenciones te aplica ML.`,
    pregunta: '¿Necesito ser monotributista para vender en Mercado Libre?',
    respuestaCorta: `Si vendés seguido o como negocio, conviene estar inscripto: para el régimen de IVA de plataformas digitales, ARCA considera habitual hacer 10 o más ventas en un mes en una misma plataforma por $750.000 o más (RG 5794/2025), y si no estás inscripto, Mercado Libre te aplica una percepción de IVA del 8% sobre el precio de venta. Con la tabla de ARCA vigente desde el ${MONOTRIBUTO_VIGENCIA}, el monotributo llega hasta ${arsCentavos(TOPE_MONOTRIBUTO)} de facturación anual y ${arsCentavos(PRECIO_UNITARIO_MAX)} de precio por unidad, con una cuota mensual para venta de productos de ${arsCentavos(MONO_A.cuotaVenta)} (categoría A) a ${arsCentavos(MONO_K.cuotaVenta)} (categoría K). Facturás con Factura C y podés usar el Facturador gratuito de Mercado Libre.`,
    secciones: [
      {
        h: '¿Hace falta ser monotributista?',
        p: [
          'El monotributo es el régimen de ARCA para pequeños contribuyentes: unifica en una cuota mensual el IVA, Ganancias, el aporte jubilatorio y la obra social. Pueden adherir, entre otros, quienes venden productos (ARCA, "¿Qué es el monotributo?").',
          'Para el régimen de IVA de ventas por plataformas digitales, ARCA considera que vendés en forma habitual si en un mes hacés 10 o más ventas en una misma plataforma por un total de $750.000 o más, o si hacés 4 o más ventas en cada mes de un cuatrimestre (enero-abril, mayo-agosto o septiembre-diciembre) por $750.000 o más en total. Si solo vendés cosas usadas de uso personal, no cuenta como habitual mientras el total acumulado sea menor a $1.500.000 (RG 5794/2025 de ARCA, vigente desde el 1/12/2025, Boletín Oficial).',
          'Si superás esos parámetros sin estar inscripto, Mercado Libre te aplica una percepción de IVA del 8% sobre el precio de venta de tus productos, nuevos o usados. Y si no estás inscripto en Ingresos Brutos y vendés 10 veces o más en un mes superando el monto que indica ML, en las provincias adheridas a SIRTAC te retiene 3% de cada venta hasta que te inscribas (Centro de vendedores de Mercado Libre).',
          'Vender de vez en cuando algo tuyo que ya no usás no es lo mismo que tener un negocio. Si comprás para revender, fabricás o vendés todos los meses, consultá con un contador cómo inscribirte en tu caso.',
        ],
      },
      {
        h: `Categorías y cuotas vigentes desde el ${MONOTRIBUTO_VIGENCIA} (venta de productos)`,
        p: [
          'Según la tabla de ARCA con valores desde el 1/08/2026, estos son el tope de facturación anual y la cuota mensual total para quien vende productos (impuesto integrado + aporte jubilatorio + obra social del titular, sin adherentes):',
          ...CATEGORIAS_MONOTRIBUTO.map(
            c => `Categoría ${c.cat}: hasta ${arsCentavos(c.tope)} por año · cuota de ${arsCentavos(c.cuotaVenta)} por mes.`,
          ),
          `En todas las categorías el precio máximo por unidad para venta de productos es de ${arsCentavos(PRECIO_UNITARIO_MAX)}. Además de la facturación, la categoría depende de la superficie afectada, la energía eléctrica consumida y los alquileres.`,
          'La recategorización se hace dos veces por año, en febrero y en agosto (hasta el día 5), mirando los últimos 12 meses. Si seguís en la misma categoría, no tenés que hacer nada (ARCA, "¿Cuándo y cómo me recategorizo?").',
        ],
      },
      {
        h: 'Ojo con los productos caros: la percepción de IVA del 7%',
        p: [
          `Si sos monotributista, Mercado Libre te aplica una percepción especial de IVA del 7% sobre el precio de venta cuando vendés un producto de más de ${arsCentavos(PRECIO_UNITARIO_MAX)} o cuando tus ventas en ML de los últimos 12 meses suman más de ${arsCentavos(TOPE_MONOTRIBUTO)}. Se aplica si el monto a percibir supera $2.000, se calcula al cierre del mes y se suma a tu factura de ML. Publicar productos más caros sin venderlos no la genera.`,
          'Si vendés productos usados o reacondicionados de uso personal, podés declararlos exentos al publicarlos (hasta 10 por mes de facturación). Fuente: Centro de vendedores de Mercado Libre, "Percepción de IVA para monotributistas" (montos actualizados en agosto de 2026).',
        ],
      },
      {
        h: 'Cómo facturar tus ventas de Mercado Libre',
        p: [
          'ARCA indica que los monotributistas de todas las categorías emiten comprobantes electrónicos tipo C (tipo E si exportan). Para empezar hay que dar de alta un punto de venta desde el servicio con clave fiscal "Registro Único Tributario".',
          'Podés facturar con las herramientas de ARCA (el Facturador en facturador.afip.gob.ar, Comprobantes en línea o la app Facturador móvil para Android) o con el Facturador de Mercado Libre, que es gratuito y lo pueden usar monotributistas, responsables inscriptos y exentos de IVA.',
          'Para configurar el Facturador de ML cargás tu fecha de inicio de actividades, tu categoría de monotributo y tus datos de ARCA (necesitás un certificado digital y un punto de venta). Después elegís el modo automático, que emite la factura y se la envía al comprador en cada venta, o el manual, venta por venta o de forma masiva.',
        ],
      },
      {
        h: 'Qué retenciones y percepciones te aplica Mercado Libre',
        p: [
          'Mercado Libre es agente de recaudación. Si sos monotributista te puede aplicar retención de Ingresos Brutos en cada cobro por venta, percepción de Ingresos Brutos al cierre de la factura mensual y, en los casos de arriba, la percepción especial de IVA.',
          'En las provincias adheridas a SIRTAC (Buenos Aires, Córdoba, Mendoza, Salta y otras 16) la alícuota base de la retención de IIBB sale del padrón de la Comisión Arbitral y puede ir del 0% al 5%.',
          'Las retenciones y percepciones de IIBB son pagos a cuenta: las usás como saldo a favor en tu declaración jurada. Los certificados se descargan desde Información fiscal > Cálculos fiscales > Retenciones en los primeros 5 días hábiles del mes siguiente. Si estás exento o excluido, subí la constancia en Información fiscal.',
          'ML toma tu condición de monotributista de ARCA automáticamente (puede tardar hasta 4 días hábiles); algunas inscripciones de IIBB las tenés que cargar vos.',
        ],
      },
      {
        h: 'Antes de inscribirte',
        p: [
          'Esta guía resume lo que publican ARCA y Mercado Libre y no reemplaza a un contador. Consultá con uno sobre todo cómo tributar Ingresos Brutos si vendés a varias provincias y si en tu provincia el IIBB se paga junto con la cuota (monotributo unificado).',
          `Datos verificados el ${MONOTRIBUTO_VERIFICADO}.`,
        ],
      },
    ],
    fuentes: [
      { texto: 'ARCA: categorías del monotributo (valores desde el 1/08/2026)', url: FUENTE_MONOTRIBUTO },
      { texto: 'ARCA: ¿Qué es el monotributo?', url: 'https://www.arca.gob.ar/monotributo/ayuda/que-es.asp' },
      { texto: 'ARCA: facturación del monotributo', url: 'https://www.arca.gob.ar/monotributo/ayuda/facturacion.asp' },
      { texto: 'ARCA: recategorización', url: 'https://www.arca.gob.ar/monotributo/ayuda/recategorizacion.asp' },
      { texto: 'Boletín Oficial: RG 5794/2025 de ARCA', url: 'https://www.boletinoficial.gob.ar/detalleAviso/primera/335414/20251202' },
      { texto: 'Mercado Libre: Si sos monotributista y vendés en Mercado Libre', url: 'https://vendedores.mercadolibre.com.ar/nota/monotributistas-en-mercado-libre' },
      { texto: 'Mercado Libre: Percepción de IVA para monotributistas', url: 'https://vendedores.mercadolibre.com.ar/nota/percepcion-de-iva-para-monotributistas-en-mercado-libre' },
      { texto: 'Mercado Libre: Retención de IIBB para monotributistas', url: 'https://vendedores.mercadolibre.com.ar/nota/retencion-de-iibb-para-monotributistas-en-mercado-libre' },
      { texto: 'Mercado Libre: Retención de IIBB para sujetos no categorizados', url: 'https://vendedores.mercadolibre.com.ar/nota/retencion-de-iibb-para-sujetos-no-categorizados' },
      { texto: 'Mercado Libre: Qué es el Facturador', url: 'https://vendedores.mercadolibre.com.ar/nota/que-es-el-facturador-de-mercado-libre' },
      { texto: 'Mercado Libre: Cómo emitir las facturas con el Facturador', url: 'https://www.mercadolibre.com.ar/ayuda/35900' },
    ],
    verificado: MONOTRIBUTO_VERIFICADO,
    cta: {
      href: '/calculadora-de-comisiones',
      boton: 'Calcular mi ganancia por venta 🧮',
      texto: 'Mirá cuánto te queda después de lo que cobra ML y sumá tu cuota de monotributo a tus costos.',
    },
  },
  {
    slug: 'envio-gratis-mercado-libre-cuanto-paga-el-vendedor',
    herramienta: {
      href: '/calculadora-envio-gratis',
      texto: 'Calculalo con tus números: precio, peso del paquete y color de tu reputación, y te decimos cuánto pagás de envío y cuánto te queda.',
      boton: 'Calculadora de envío gratis 📦',
    },
    titulo: 'Envío gratis en Mercado Libre: cuánto paga el vendedor en 2026',
    descripcion:
      'Cuánto le cuesta al vendedor el envío gratis en Mercado Libre Argentina: desde qué precio viene incluido ($33.000), cómo se calcula por peso y reputación, tabla de costos y ejemplos.',
    pregunta: '¿Cuánto paga el vendedor por el envío gratis en Mercado Libre?',
    respuestaCorta: `Depende del peso del paquete, del precio y de tu reputación. En productos nuevos desde $33.000 el envío gratis viene incluido y, con reputación verde (o sin reputación todavía), pagás desde ${ars(ENVIO_03.de33a50)} por unidad hasta 0,3 kg, con 50% de descuento. Por debajo de $33.000 es opcional: si lo ofrecés, cuesta desde ${ars(ENVIO_03.menos33)} con 30% de descuento. Con reputación amarilla el descuento baja a 40% y 20%, y con naranja o roja no hay descuento (desde $12.380). El costo se descuenta de lo que cobrás por la venta.`,
    secciones: [
      {
        h: 'Cuándo se ofrece envío gratis',
        p: [
          'En publicaciones de productos nuevos desde $33.000 se ofrece envío gratis (o un descuento en el envío cuando la distancia, las medidas o el peso no lo permiten) y vos pagás el costo con un descuento según tu reputación.',
          'En productos de menos de $33.000 el envío gratis es opcional: si lo ofrecés, el costo corre por tu cuenta.',
          'Si un comprador lleva varios productos tuyos que juntos suman $33.000, tiene envío gratis y lo paga Mercado Libre (no aplica si están en distintos centros de Envíos Full).',
          'En distancias muy largas o productos muy grandes, en vez de envío gratis ofrecés un descuento y el comprador paga la diferencia.',
        ],
      },
      {
        h: 'Cómo se calcula el costo',
        p: [
          'Es un costo fijo por unidad según el peso del paquete ya embalado y el color de tu reputación. Para el peso, ML compara el peso físico con el volumétrico y usa el más alto.',
          'Se cobra por unidad: si el envío de una unidad cuesta $2.000 y vendés 3, pagás $6.000. Si vendés un kit, pagás un solo envío por kit.',
          'El costo que ves al publicar es estimado: cuando despachás, ML mide y pesa el paquete y, si hay diferencias, el costo cambia para tus próximas ventas, no para la actual. Con Full, el embalaje lo hace ML.',
          'Las categorías de moda (zapatillas, botas, sandalias, mochilas, camperas y camisetas de fútbol) y los productos usados o de publicación gratuita tienen tablas propias.',
        ],
      },
      {
        h: 'Tabla: reputación verde, MercadoLíder o sin reputación',
        p: [
          'Costo por unidad de productos nuevos: menos de $33.000 con 30% de descuento; desde $33.000 con 50% de descuento.',
          ...ENVIO_GRATIS_VERDE.map(
            e => `${e.peso}: ${ars(e.menos33)} (menos de $33.000) · ${ars(e.de33a50)} ($33.000 a $49.999) · ${ars(e.desde50)} ($50.000 o más).`,
          ),
          'Para paquetes de más de 10 kg (hasta más de 180 kg) revisá la tabla completa en la ayuda de Mercado Libre.',
        ],
      },
      {
        h: 'Cuánto cambia con tu reputación',
        p: [
          'Reputación amarilla: 20% de descuento en productos de menos de $33.000 y 40% desde $33.000. Hasta 0,3 kg pagás $9.904, $7.428 o $8.148; de 0,5 a 1 kg, $12.464, $9.348 o $9.948.',
          'Reputación naranja o roja: sin descuento. Hasta 0,3 kg pagás $12.380 en productos de menos de $33.000 y $13.580 desde $33.000; de 0,5 a 1 kg, $15.580 y $16.580.',
          'Un paquete de 0,5 a 1 kg en un producto de $60.000 cuesta $8.290 con reputación verde y $16.580 con naranja o roja: el doble.',
        ],
      },
      {
        h: 'Ejemplos con números',
        p: [
          'Producto de $40.000 que pesa 0,8 kg, con cargo por vender del 14% y reputación verde: ML se queda con $5.600 de cargo y $7.790 de envío, y te quedan $26.610 antes de tu costo. Con reputación naranja el envío pasa a $16.580 y te quedan $17.820.',
          'Producto de $25.000 de hasta 0,3 kg con reputación verde: sin envío gratis pagás $3.500 de cargo y $3.320 de costo fijo y te quedan $18.180. Si además ofrecés envío gratis ($8.666), te quedan $9.514: el envío se lleva más de un tercio del precio.',
          'Si ese mismo producto se vende a $33.000, desaparece el costo fijo y el envío baja a $6.190: pagás $4.620 de cargo y te quedan $22.190. Cerca del umbral, subir el precio o armar un kit puede dejarte más plata.',
          `Costos verificados el ${ENVIO_GRATIS_VERIFICADO} en la ayuda oficial de Mercado Libre.`,
        ],
      },
    ],
    fuentes: [
      { texto: 'Mercado Libre: Funcionamiento de los envíos gratis', url: 'https://www.mercadolibre.com.ar/ayuda/16467' },
      { texto: 'Mercado Libre: ¿Cuáles son los costos de ofrecer envíos gratis?', url: 'https://www.mercadolibre.com.ar/ayuda/3482' },
      { texto: 'Mercado Libre: costos para MercadoLíderes, reputación verde o sin reputación', url: 'https://www.mercadolibre.com.ar/ayuda/40538' },
      { texto: 'Mercado Libre: costos para reputación amarilla', url: 'https://www.mercadolibre.com.ar/ayuda/40545' },
      { texto: 'Mercado Libre: costos para reputación naranja o roja', url: 'https://www.mercadolibre.com.ar/ayuda/40547' },
    ],
    verificado: ENVIO_GRATIS_VERIFICADO,
    cta: {
      href: '/calculadora-de-comisiones',
      boton: 'Calcular con el costo de envío 🧮',
      texto: 'Poné tu precio, tu costo y lo que pagás de envío y mirá cuánto te queda.',
    },
  },
  {
    slug: 'como-mejorar-reputacion-mercado-libre',
    titulo: 'Cómo mejorar la reputación en Mercado Libre: colores, límites y qué la afecta',
    descripcion:
      'Cómo funciona el termómetro de reputación de Mercado Libre: los colores, el porcentaje máximo de reclamos, cancelaciones y envíos incorrectos para ser verde, qué no cuenta y cómo mejorarla.',
    pregunta: '¿Cómo mejoro mi reputación en Mercado Libre?',
    respuestaCorta:
      'La reputación es un termómetro que va del rojo al verde y mide tres cosas: reclamos, ventas canceladas por vos y envíos incorrectos (despachos con demora o desde el depósito equivocado). Para ser verde, los reclamos no pueden pasar del 1,5% de tus ventas, las cancelaciones del 1% (o 1,5% si te miden por 365 días) y los envíos incorrectos del 10% (o 13%). La variable con peor desempeño define tu color. Para mejorarla: despachá a tiempo, describí bien el producto, respondé las preguntas y no canceles ventas.',
    secciones: [
      {
        h: 'Cómo funciona el termómetro',
        p: [
          'Mercado Libre empieza a medir tu reputación cuando completás tus primeras 10 ventas de los últimos 365 días; hasta entonces el termómetro está en gris.',
          'Si tenés 101 ventas concretadas o más en los últimos 60 días, te miden por esos 60 días; si tenés menos, por los últimos 365 días. El período se actualiza todos los días.',
          'Se miden tres variables: reclamos, canceladas por vos y envíos incorrectos (si sos MercadoLíder, también las mediaciones). La peor define el color: para ser verde tenés que estar dentro del límite en todas.',
        ],
      },
      {
        h: 'Los límites de cada color',
        p: [
          'Reclamos (igual para 60 y 365 días): verde hasta 1,5%, amarillo entre 1,5% y 3%, naranja entre 3% y 6%, rojo más de 6%.',
          'Canceladas por vos: verde hasta 1% (60 días) o 1,5% (365 días); amarillo hasta 2,5% o 4%; naranja hasta 3% o 5%; rojo por encima.',
          'Envíos incorrectos: verde hasta 10% (60 días) o 13% (365 días); amarillo hasta 15% o 19,5%; naranja hasta 22% o 28,5%; rojo por encima.',
          'Son porcentajes sobre el total de tus ventas del período (ayuda de Mercado Libre, verificada el 27 de septiembre de 2026).',
        ],
      },
      {
        h: 'Qué cuenta y qué no',
        p: [
          'Reclamos: solo afectan los de productos incompletos o con faltantes y los de calidad (defectuosos, con fallas de fábrica o que no funcionan). Los de paquetes rotos o dañados no cuentan, y tampoco los que inicia el comprador porque se arrepintió.',
          'Canceladas por vos: cuenta cada venta que cancelás vos. Si el comprador se arrepiente, tiene que pedir él la cancelación para que no te afecte. Si la venta tuvo un reclamo y después se canceló, cuenta solo como reclamo.',
          'Envíos incorrectos: despachos con demora y envíos desde un depósito equivocado. Con Flex también cuentan las entregas que no se concretan antes de las 21 h y el comprador reprograma, los intentos con comprador ausente después de las 21 h y los envíos demorados que cancela el comprador.',
          'Excepciones: las ventas de Inmuebles no afectan la reputación, y en envíos incorrectos no se cuentan arte y artesanías ni alianzas y kits personalizados de juguete. En autopartes sí cuentan los reclamos por informar mal la compatibilidad.',
        ],
      },
      {
        h: 'Cómo mejorarla, paso a paso',
        p: [
          'Despachá dentro del tiempo que indica cada forma de envío. Si necesitás más días, usá la opción Disponibilidad de stock: el plazo se cuenta desde el día que indicás que lo tenés listo.',
          'Evitá reclamos con buena información: completá la ficha técnica, cargá el stock disponible y respondé las preguntas con datos concretos. Muchos reclamos se abren por falta de información.',
          'No canceles ventas: con el stock bien cargado no vendés lo que no tenés.',
          'Con Flex, entregá antes de las 21 h. Si tenés más de un depósito, despachá desde el correcto.',
          'Como se mide en porcentaje, cada venta sin problemas diluye las que tuvieron, y las ventas viejas van saliendo del período de medición (60 o 365 días).',
          'Si tu reputación está en rojo, naranja o amarillo, Mercado Libre ofrece el Beneficio de reputación. Si sos nuevo y todavía no llegaste a 10 ventas, podés activar el Programa de Despegue dejando dinero en garantía (si cumplís los requisitos) para arrancar con color verde claro.',
        ],
      },
      {
        h: 'Por qué te conviene cuidarla: visibilidad y plata',
        p: [
          'Con buena reputación más compradores ven tus publicaciones.',
          'Además el envío gratis te sale más barato: con reputación verde tenés 50% de descuento en productos desde $33.000 y 30% en los de menos; con amarilla, 40% y 20%; con naranja o roja, ninguno. En un paquete de 0,5 a 1 kg de un producto de $60.000 son $8.290 contra $16.580 por venta.',
          'MercadoLíder: más de 4 meses de antigüedad, reputación verde oscuro y, en los últimos 60 días, 101 ventas o más y $1.500.000 facturados o más (180 ventas y $3.000.000 para Gold; 415 ventas y $9.000.000 para Platinum), con reclamos hasta 1%, mediaciones y cancelaciones hasta 0,5% y envíos incorrectos hasta 8%. Sus publicaciones tienen más prioridad y exposición en las búsquedas.',
        ],
      },
    ],
    fuentes: [
      { texto: 'Mercado Libre: Qué es y cómo funciona la reputación como vendedor', url: 'https://www.mercadolibre.com.ar/ayuda/866' },
      { texto: 'Mercado Libre: Qué se tiene en cuenta para calcular mi reputación', url: 'https://www.mercadolibre.com.ar/ayuda/30193' },
      { texto: 'Mercado Libre: número permitido de ventas afectadas para cada color', url: 'https://www.mercadolibre.com.ar/ayuda/21062' },
      { texto: 'Mercado Libre: en qué tiempos miden la reputación', url: 'https://www.mercadolibre.com.ar/ayuda/21060' },
      { texto: 'Mercado Libre: Todo sobre ser MercadoLíder', url: 'https://www.mercadolibre.com.ar/ayuda/864' },
      { texto: 'Mercado Libre: Por qué es importante la reputación del vendedor', url: 'https://vendedores.mercadolibre.com.ar/nota/por-que-es-importante-la-reputacion-del-vendedor' },
      { texto: 'Mercado Libre: costos de ofrecer envíos gratis', url: 'https://www.mercadolibre.com.ar/ayuda/3482' },
    ],
    verificado: '27 de septiembre de 2026',
    cta: {
      href: '/calculadora-de-comisiones',
      boton: 'Calcular cuánto te queda 🧮',
      texto: 'Probá cuánto cambia tu ganancia con el costo de envío de tu color de reputación.',
    },
  },
]

export const GUIAS_VENDER: GuiaVendedor[] = [
  {
    slug: 'cuanto-cobra-mercado-libre-por-vender',
    titulo: `Cuánto cobra Mercado Libre por vender en 2026: comisiones, costo fijo y cuotas`,
    descripcion: `Cuánto cobra Mercado Libre Argentina por vender desde el ${COSTOS_VIGENCIA}: cargo por vender de ${pct(CARGO_MIN)}% a ${pct(CARGO_MAX)}%, costo fijo por unidad y costo por cuotas, con ejemplos.`,
    pregunta: '¿Cuánto cobra Mercado Libre por vender en Argentina?',
    respuestaCorta: `Desde el ${COSTOS_VIGENCIA}, Mercado Libre Argentina cobra un cargo por vender de entre ${pct(CARGO_MIN)}% y ${pct(CARGO_MAX)}% del precio, según la categoría y la provincia. A eso se suma un costo fijo por unidad solo en productos de menos de ${ars(UMBRAL_COSTO_FIJO)} (desde ${ars(1330)}) y, si ofrecés cuotas, un costo extra: 5% por cuotas con interés bajo o de 8,9% a 21,6% por cuotas al mismo precio. Publicar es gratis.`,
    secciones: [
      {
        h: 'Las tres partes del costo',
        p: [
          `Cargo por vender: siempre se paga, es un porcentaje del precio de entre ${pct(CARGO_MIN)}% y ${pct(CARGO_MAX)}%. Depende de la categoría del producto y del impuesto a los Ingresos Brutos de tu provincia.`,
          `Costo por unidad vendida: solo en productos de menos de ${ars(UMBRAL_COSTO_FIJO)}. Con Envíos Flex, acuerdo con el comprador o retiro es ${ars(1330)} hasta ${ars(14999)}, ${ars(2740)} entre ${ars(15000)} y ${ars(23999)}, y ${ars(3320)} entre ${ars(24000)} y ${ars(32999)}. Con Full, correo o colecta depende también del peso del paquete.`,
          'Costo por ofrecer cuotas: si agregás cuotas con interés bajo (3 a 12) pagás 5% más; si ofrecés cuotas al mismo precio, 8,90% en 3 cuotas, 13,40% en 6, 17,80% en 9 y 21,60% en 12.',
        ],
      },
      {
        h: 'Ejemplo con números',
        p: [
          'Un producto de $50.000 en una categoría con cargo del 14%, sin cuotas propias: ML se queda con $7.000 y no hay costo fijo (supera los $33.000). Te quedan $43.000 antes del envío y de tus impuestos.',
          'El mismo producto con 6 cuotas al mismo precio suma 13,40% más ($6.700): te quedan $36.300. Por eso muchas publicaciones con cuotas sin interés tienen un precio más alto.',
          'Un producto de $12.000 con cargo del 14% paga $1.680 de cargo más $1.330 de costo fijo: ML se queda con $3.010, un 25% del precio. En productos baratos el costo fijo pesa mucho.',
        ],
      },
      {
        h: 'Lo que no incluye',
        p: [
          'El costo del envío cuando ofrecés envío gratis, las retenciones o impuestos propios de tu condición fiscal, y la publicidad (Product Ads) si la usás.',
          `Para el número exacto de tu categoría usá el simulador de costos de Mercado Libre. Estos valores se verificaron el ${COSTOS_VERIFICADOS} en la ayuda oficial de ML.`,
        ],
      },
    ],
    cta: {
      href: '/calculadora-de-comisiones',
      boton: 'Calcular mi ganancia 🧮',
      texto: 'Poné tu precio y tu costo y mirá cuánto te queda.',
    },
  },
  {
    slug: 'vender-en-mercado-libre-o-tienda-propia',
    titulo: 'Vender en Mercado Libre o en tu propia tienda online: cuál conviene en 2026',
    descripcion:
      'Comparación práctica entre vender en Mercado Libre y tener tu tienda online propia (Tiendanube u otra): costos por venta, tráfico, clientes y cuándo conviene usar las dos.',
    pregunta: '¿Conviene vender en Mercado Libre o tener una tienda online propia?',
    respuestaCorta: `Depende de dónde vienen tus clientes. Mercado Libre te da tráfico desde el primer día, pero cobra entre ${pct(CARGO_MIN)}% y ${pct(CARGO_MAX)}% por venta más costos fijos y de cuotas, y el cliente es de ML. Una tienda propia cobra un plan mensual y el cobro del medio de pago, pero las visitas las tenés que traer vos (redes, Google, WhatsApp) y el cliente queda para vos. Lo más común es usar las dos: ML para vender volumen y la tienda propia para clientes que vuelven.`,
    secciones: [
      {
        h: 'Cuándo conviene Mercado Libre',
        p: [
          'Cuando recién arrancás y no tenés seguidores ni clientes: ML ya tiene la gente buscando lo que vendés.',
          'Para productos que la gente busca por nombre y compara por precio (electrónica, repuestos, herramientas).',
          'La contra: pagás comisión en cada venta, competís al lado de otros vendedores y no podés contactar al comprador por fuera de la plataforma.',
        ],
      },
      {
        h: 'Cuándo conviene una tienda propia',
        p: [
          'Cuando ya vendés por Instagram, WhatsApp o tenés clientes que vuelven: en vez de pagar comisión por cada venta, pagás un plan mensual y el costo del medio de pago.',
          'Cuando tu marca importa (ropa, deco, alimentos, productos propios): la tienda muestra tus productos sin competidores al lado.',
          'La contra: nadie te encuentra solo. Tenés que traer las visitas con redes, anuncios, Google o tu base de clientes.',
        ],
      },
      {
        h: 'Cómo hacer la cuenta',
        p: [
          'Sumá lo que ML te cobró el último mes (cargo por vender, costos fijos y cuotas). Si ese monto supera con holgura lo que costaría un plan de tienda propia más el cobro del medio de pago, y una parte de tus ventas ya viene de clientes tuyos, una tienda propia empieza a tener sentido.',
          'Una forma de arrancar sin riesgo: seguí vendiendo en ML y abrí la tienda propia para tus clientes frecuentes y tus redes. Las plataformas como Tiendanube se pueden conectar con Mercado Libre para manejar el stock en un solo lugar.',
        ],
      },
      {
        h: 'Qué plataforma usar',
        p: [
          'En Argentina, Tiendanube es la plataforma de tiendas online más usada por pymes y emprendedores: cobra con Mercado Pago y otros medios, se integra con envíos y con Mercado Libre, y tiene planes según el tamaño del negocio. Revisá los planes vigentes en su sitio antes de elegir.',
        ],
      },
    ],
    herramienta: HERRAMIENTA_ML_VS_TN,
    cta: {
      href: TIENDANUBE_URL,
      boton: 'Ver planes de Tiendanube →',
      texto: 'Si querés evaluar tu propia tienda, revisá los planes vigentes de Tiendanube antes de decidir.',
      afiliado: Boolean(TIENDANUBE_AFILIADO),
    },
  },
  {
    slug: 'como-calcular-precio-de-venta-mercado-libre',
    herramienta: {
      href: '/calculadora-precio-de-venta',
      texto: 'Hacé la cuenta al revés con tus números: poné tu costo y la ganancia que querés y te damos el precio exacto, con el costo fijo de cada franja ya resuelto.',
      boton: '¿A cuánto publicar? Calculadora 🧮',
    },
    titulo: 'Cómo calcular el precio de venta en Mercado Libre para no perder plata',
    descripcion:
      'Fórmula simple para poner el precio de venta en Mercado Libre Argentina: costo del producto, comisión, costo fijo, cuotas y envío, con ejemplo.',
    pregunta: '¿Cómo calculo a qué precio vender en Mercado Libre?',
    respuestaCorta: `Precio = (tu costo + ganancia que querés + costo fijo + envío) ÷ (1 − porcentaje total que cobra ML). El porcentaje total es el cargo por vender (${pct(CARGO_MIN)}% a ${pct(CARGO_MAX)}%) más el de cuotas si las ofrecés. El costo fijo solo se suma si el precio queda por debajo de ${ars(UMBRAL_COSTO_FIJO)}.`,
    secciones: [
      {
        h: 'La fórmula paso a paso',
        p: [
          '1) Sumá tu costo del producto, la ganancia que querés por unidad y el envío si lo pagás vos.',
          '2) Si el precio va a quedar por debajo de $33.000, sumá el costo fijo por unidad que corresponda.',
          '3) Dividí ese total por (1 − porcentaje de ML). Con un cargo del 14% y sin cuotas, dividís por 0,86.',
        ],
      },
      {
        h: 'Ejemplo',
        p: [
          'Costo $20.000, querés ganar $8.000, cargo del 14% y no pagás envío: $28.000 ÷ 0,86 = $32.558. Pero a ese precio se suma el costo fijo ($3.320 entre $24.000 y $32.999) y no llegás a los $8.000. Si subís a $33.000 el costo fijo desaparece: ML cobra $4.620 y te quedan $28.380, o sea $8.380 de ganancia. Cerca del umbral de $33.000 conviene probar los dos lados en la calculadora.',
          'Si además ofrecés 3 cuotas al mismo precio (8,90%), el porcentaje total pasa a 22,9%: $28.000 ÷ 0,771 = $36.316 (ya por encima del umbral, sin costo fijo).',
        ],
      },
      {
        h: 'Errores comunes',
        p: [
          'Calcular la comisión sobre el costo y no sobre el precio de venta: ML cobra un porcentaje del precio final.',
          'Olvidar el costo fijo en productos baratos: en un producto de $10.000 puede ser más del 10% del precio.',
          'Ofrecer cuotas sin interés sin subir el precio: en 12 cuotas el costo extra es 21,60%.',
        ],
      },
    ],
    cta: {
      href: '/calculadora-de-comisiones',
      boton: 'Probar precios en la calculadora 🧮',
      texto: 'Cambiá el precio y mirá al instante cuánto te queda.',
    },
  },
  {
    slug: 'cuotas-sin-interes-mercado-libre-cuanto-cuestan',
    titulo: 'Cuotas sin interés en Mercado Libre: cuánto le cuestan al vendedor y cuándo conviene',
    descripcion:
      'Cuánto cobra Mercado Libre Argentina por ofrecer cuotas sin interés (3, 6, 9 y 12) o con interés bajo, con ejemplos y cómo ajustar el precio para no perder margen.',
    pregunta: '¿Cuánto cuesta ofrecer cuotas sin interés en Mercado Libre?',
    respuestaCorta:
      'Además del cargo por vender, ofrecer cuotas al mismo precio cuesta 8,90% del precio en 3 cuotas, 13,40% en 6, 17,80% en 9 y 21,60% en 12. Las cuotas con interés bajo (3 a 12) cuestan 5%. Si no agregás cuotas propias no pagás nada extra y el comprador solo tiene las cuotas con interés de su banco.',
    secciones: [
      {
        h: 'Las opciones y su costo',
        p: [
          'Sin cuotas propias: pagás solo el cargo por vender (y el costo fijo si el producto cuesta menos de $33.000). El comprador puede pagar en cuotas con el interés de su banco.',
          'Cuotas con interés bajo (3 a 12): pagás 5% más. El comprador paga un interés menor que el del banco.',
          'Cuotas al mismo precio: 8,90% en 3 cuotas, 13,40% en 6, 17,80% en 9 y 21,60% en 12. El comprador paga lo mismo en cuotas que en un pago.',
        ],
      },
      {
        h: 'Ejemplo',
        p: [
          'Producto de $100.000 con cargo del 14%: sin cuotas propias te quedan $86.000. Con 6 cuotas al mismo precio te quedan $72.600. Con 12 cuotas, $64.400.',
          'Para mantener lo mismo que sin cuotas ($86.000) ofreciendo 6 cuotas al mismo precio, el precio tendría que ser $86.000 ÷ (1 − 0,274) = unos $118.500. Por eso los precios con muchas cuotas sin interés suelen ser más altos.',
        ],
      },
      {
        h: 'Cuándo conviene ofrecerlas',
        p: [
          'En productos caros (electrodomésticos, tecnología, muebles) las cuotas sin interés pesan mucho en la decisión de compra y suelen justificar el costo.',
          'En productos baratos casi nadie paga en cuotas: el costo extra solo te baja el margen.',
          'Probá con 3 cuotas antes que con 12: el costo es menos de la mitad y sigue siendo un atractivo.',
        ],
      },
    ],
    cta: {
      href: '/calculadora-de-comisiones',
      boton: 'Comparar con y sin cuotas 🧮',
      texto: 'Elegí la opción de cuotas en la calculadora y mirá cuánto te queda en cada caso.',
    },
  },
  {
    slug: 'precio-minimo-para-publicar-en-mercado-libre',
    titulo: 'Precio mínimo para publicar en Mercado Libre y cómo vender productos baratos con kits',
    descripcion:
      'Cuál es el precio mínimo para publicar en Mercado Libre Argentina ($1.000, o $3.500 en consumo masivo), qué pasa si quedás por debajo y cómo usar kits para vender productos baratos sin perder plata.',
    pregunta: '¿Cuál es el precio mínimo para vender en Mercado Libre?',
    respuestaCorta:
      'El precio de venta tiene que ser de al menos $1.000, y de $3.500 en productos de consumo masivo (incluida la tienda Full Súper). Si una publicación queda por debajo, se pausa automáticamente. Para vender algo más barato, agrupá varias unidades en un kit: pagás un solo costo fijo por kit vendido.',
    secciones: [
      {
        h: 'Por qué los productos baratos casi no dejan plata',
        p: [
          'Por debajo de $33.000 se suma un costo fijo por unidad al cargo por vender: $1.330 hasta $14.999 con Envíos Flex. En un producto de $5.000 eso solo ya es más del 25% del precio.',
          'Por ejemplo, un producto de $5.000 con cargo del 14% paga $700 + $1.330: ML se queda con $2.030 y te quedan $2.970 antes de tu costo.',
        ],
      },
      {
        h: 'La solución: kits',
        p: [
          'Un kit agrupa varias unidades en una sola publicación. Si el kit cuesta menos de $33.000, pagás un solo costo fijo por kit, no uno por unidad.',
          'Ejemplo: 4 unidades de $5.000 en un kit de $20.000 pagan $2.800 de cargo (14%) + $2.740 de costo fijo = $5.540. Vendidas por separado pagarían 4 × $2.030 = $8.120.',
          'Si el kit supera los $33.000 el costo fijo desaparece: a veces conviene armar un pack un poco más grande.',
        ],
      },
    ],
    cta: {
      href: '/calculadora-de-comisiones',
      boton: 'Calcular un kit 🧮',
      texto: 'Poné el precio del kit en la calculadora y compará con la venta por unidad.',
    },
  },
  ...GUIAS_NUEVAS,
  {
    slug: 'cuanto-cuesta-tiendanube',
    titulo: 'Cuánto cuesta Tiendanube en 2026: planes, comisiones y Pago Nube',
    descripcion: 'Precios de los planes de Tiendanube en Argentina, el costo por transacción y las tarifas de Pago Nube, comparados con lo que cobra Mercado Libre por venta.',
    pregunta: '¿Cuánto cuesta tener una tienda en Tiendanube?',
    respuestaCorta: 'Hay un plan Inicial de $0 por mes y planes pagos de $27.999 (Esencial), $79.999 (Impulso) y $244.999 (Escala). Si cobrás con Pago Nube no pagás costo por transacción; con otros medios es 2%, 1% o 0,7% según el plan. Aparte, Pago Nube cobra su tarifa de procesamiento (por ejemplo, desde 3,49% + IVA con acreditación a 14 días en el plan Esencial).',
    secciones: [
      {
        h: 'Planes y precios',
        p: [
          'Inicial: $0 por mes, pensado para arrancar. Esencial: $27.999 por mes. Impulso: $79.999 por mes. Escala: $244.999 por mes. Evolución: a consultar, para negocios grandes. Los planes pagos tienen 7 días de prueba gratis.',
          'Costo por transacción cuando cobrás con otros medios (no Pago Nube): 2% en Esencial, 1% en Impulso y 0,7% en Escala. Con Pago Nube ese costo está bonificado.',
        ],
      },
      {
        h: 'Tarifas de Pago Nube',
        p: [
          'Con tarjeta de crédito o débito, la tarifa depende del plan y de cuándo querés cobrar. En el plan Esencial: desde 6,09% + IVA a 1 día, 4,39% + IVA a 7 días y 3,49% + IVA a 14 días. En el plan Inicial arranca en 6,40%, 4,45% y 3,50% + IVA respectivamente.',
          'Con transferencia bancaria: 1,50% + IVA en Inicial y Esencial, 0,99% + IVA en Impulso y 0,85% + IVA en Escala, con acreditación en 1 día.',
        ],
      },
      {
        h: 'Comparado con Mercado Libre',
        p: [
          `En Mercado Libre el cargo por vender va de ${pct(CARGO_MIN)}% a ${pct(CARGO_MAX)}% del precio, más un costo fijo en productos de menos de ${ars(UMBRAL_COSTO_FIJO)}. En tu tienda propia el costo por venta suele ser bastante menor, pero pagás el plan mensual y el tráfico lo tenés que conseguir vos.`,
          'La cuenta simple: si tus ventas por mes en tienda propia superan lo que te ahorrás de comisión frente al abono del plan, la tienda se paga sola. Muchos vendedores usan las dos cosas: ML para conseguir clientes nuevos y la tienda para los que vuelven.',
        ],
      },
      {
        h: 'Antes de elegir',
        p: [
          'Precios verificados en tiendanube.com el ' + COSTOS_VERIFICADOS + '. Pueden cambiar: confirmalos en su sitio antes de contratar. Si recién arrancás, el plan Inicial o la prueba de 7 días alcanzan para probar sin gastar.',
        ],
      },
    ],
    herramienta: HERRAMIENTA_ML_VS_TN,
    cta: {
      href: TIENDANUBE_URL,
      boton: 'Probar Tiendanube gratis →',
      texto: 'Podés empezar con el plan Inicial o probar un plan pago 7 días sin costo.',
      afiliado: Boolean(TIENDANUBE_AFILIADO),
    },
  },
]

export const getGuiaVendedor = (slug: string) => GUIAS_VENDER.find(g => g.slug === slug)
