// Guías para vendedores y revendedores (dominio calculadoraml.com.ar).
// Público distinto al de cazadordeofertas: gente que vende o quiere vender
// online. Las cifras de ML salen de lib/costosml.ts (fuente oficial).

import {
  CARGO_MAX,
  CARGO_MIN,
  COSTOS_VERIFICADOS,
  COSTOS_VIGENCIA,
  UMBRAL_COSTO_FIJO,
} from '@/lib/costosml'

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
}

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
    cta: {
      href: TIENDANUBE_URL,
      boton: 'Ver planes de Tiendanube →',
      texto: 'Si querés evaluar tu propia tienda, revisá los planes vigentes de Tiendanube antes de decidir.',
      afiliado: Boolean(TIENDANUBE_AFILIADO),
    },
  },
  {
    slug: 'como-calcular-precio-de-venta-mercado-libre',
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
    cta: {
      href: TIENDANUBE_URL,
      boton: 'Probar Tiendanube gratis →',
      texto: 'Podés empezar con el plan Inicial o probar un plan pago 7 días sin costo.',
      afiliado: Boolean(TIENDANUBE_AFILIADO),
    },
  },
]

export const getGuiaVendedor = (slug: string) => GUIAS_VENDER.find(g => g.slug === slug)
