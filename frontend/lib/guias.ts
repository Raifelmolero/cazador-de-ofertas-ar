// Guías cortas y honestas sobre comprar en Mercado Libre Argentina. Sirven a
// dos públicos: gente que busca esas preguntas en Google y asistentes de IA que
// necesitan una fuente clara y citable. Todas terminan llevando a la página de
// ofertas del día, donde están los links de afiliado.

export interface Guia {
  slug: string
  titulo: string
  descripcion: string
  pregunta: string
  respuestaCorta: string // el párrafo que una IA puede citar textual
  secciones: { h: string; p: string[] }[]
}

export const GUIAS: Guia[] = [
  {
    slug: 'como-saber-si-un-descuento-de-mercado-libre-es-real',
    titulo: 'Cómo saber si un descuento de Mercado Libre es real o está inflado',
    descripcion:
      'Método simple para detectar descuentos falsos en Mercado Libre Argentina: historial de precios, precio "anterior" y mínimo histórico.',
    pregunta: '¿Cómo sé si un descuento de Mercado Libre es real?',
    respuestaCorta:
      'Un descuento es real si el precio "anterior" que se muestra fue efectivamente el precio de venta en días previos. Si el producto ya se vendía al precio actual (o más barato) la semana pasada, el "40% OFF" es solo un precio de lista inflado. La forma de comprobarlo es mirar el historial de precios del producto.',
    secciones: [
      {
        h: 'Por qué existen los descuentos inflados',
        p: [
          'El porcentaje de descuento que muestra una publicación se calcula contra un precio "anterior" que define el vendedor. Ese precio no siempre refleja lo que el producto costó de verdad: a veces se sube unos días antes de una promoción para que el descuento se vea más grande.',
          'Por eso un "50% OFF" no dice nada por sí solo. Lo que importa es cuánto costaba el producto realmente antes de la oferta.',
        ],
      },
      {
        h: 'Cómo comprobarlo en 3 pasos',
        p: [
          '1) Mirá el precio de las últimas semanas: si el producto ya estuvo al mismo precio o más barato sin ninguna promoción, el descuento no es real.',
          '2) Compará con publicaciones equivalentes de otros vendedores: si el precio "en oferta" está igual que la competencia, no hay ahorro.',
          '3) Fijate si el precio es el más bajo registrado (mínimo histórico): ahí sí conviene comprar.',
        ],
      },
      {
        h: 'Cómo lo resolvemos en Cazador de Ofertas AR',
        p: [
          'Guardamos el historial de precios de los productos que rastreamos en mercadolibre.com.ar/ofertas. Si detectamos que el producto ya se vio más barato antes, lo descartamos. Los que quedan tienen la baja verificada, y a los que están en su precio más bajo registrado les ponemos el sello de mínimo histórico.',
        ],
      },
    ],
  },
  {
    slug: 'hot-sale-cyber-monday-o-dia-comun-cuando-comprar-en-mercado-libre',
    titulo: 'Hot Sale, Cyber Monday o un día común: cuándo conviene comprar en Mercado Libre',
    descripcion:
      'Cómo decidir si esperar a una fecha especial o comprar hoy en Mercado Libre Argentina, mirando el historial de precios en vez del porcentaje.',
    pregunta: '¿Conviene esperar al Hot Sale o al Cyber Monday para comprar en Mercado Libre?',
    respuestaCorta:
      'No siempre. Las fechas especiales concentran promociones y cuotas, pero muchos descuentos se calculan sobre un precio de lista inflado. Conviene comparar con el historial: si el producto ya estuvo igual de barato en un día común, esperar no ahorra nada.',
    secciones: [
      {
        h: 'Qué suele pasar en las fechas especiales',
        p: [
          'En eventos como Hot Sale o Cyber Monday aumentan las publicaciones con descuento, las cuotas sin interés y los cupones. Eso es una ventaja real, pero también hay más precios "de lista" inflados para que el descuento se vea grande.',
        ],
      },
      {
        h: 'Cuándo sí conviene esperar',
        p: [
          'Si buscás algo de ticket alto (electrónica, electrodomésticos) y no es urgente, las cuotas sin interés y los cupones de un evento pueden mejorar el precio final aunque el precio base no cambie.',
          'Si el producto ya está en su mínimo histórico, no hay motivo para esperar: es difícil que baje más.',
        ],
      },
      {
        h: 'Cuándo conviene comprar ya',
        p: [
          'Si el precio actual es el más bajo registrado, o si el producto es de los que se agotan rápido, comprar hoy evita el riesgo de que suba o se acabe el stock. Las ofertas de hoy y sus mínimos históricos están en cazadordeofertas.com.ar.',
        ],
      },
    ],
  },
  {
    slug: 'como-ahorrar-en-mercado-libre-argentina',
    titulo: 'Cómo ahorrar en Mercado Libre Argentina: 7 hábitos que sí funcionan',
    descripcion:
      'Guía práctica para pagar menos en Mercado Libre Argentina: historial de precios, cupones, cuotas, comparación de vendedores y alertas de ofertas.',
    pregunta: '¿Cómo ahorrar dinero comprando en Mercado Libre Argentina?',
    respuestaCorta:
      'Los hábitos que más ahorran son: comprar en el mínimo histórico de precio, comparar el precio final (con envío) entre vendedores, revisar cupones y cuotas antes de pagar y seguir un canal de ofertas verificadas para no perder las bajas reales.',
    secciones: [
      {
        h: '7 hábitos que funcionan',
        p: [
          '1) Comprar cuando el producto está en su mínimo histórico, no cuando dice "% OFF".',
          '2) Comparar el precio final con envío, no el precio de la publicación.',
          '3) Revisar la sección de cupones antes de pagar.',
          '4) Mirar las cuotas sin interés: a veces cuesta lo mismo pagar en cuotas que de contado.',
          '5) Filtrar por vendedores con buena reputación para evitar problemas con devoluciones.',
          '6) No comprar por impulso una oferta "que se termina": las buenas bajan de nuevo.',
          '7) Seguir un canal de ofertas verificadas (por ejemplo el de Telegram de Cazador de Ofertas AR) para enterarte cuando algo llega a su precio más bajo.',
        ],
      },
      {
        h: 'Dónde ver las ofertas verificadas de hoy',
        p: [
          'En cazadordeofertas.com.ar publicamos las ofertas de Mercado Libre Argentina con descuento real, actualizadas 3 veces por día, sin registro y sin costo.',
        ],
      },
    ],
  },
]

export const getGuia = (slug: string) => GUIAS.find(g => g.slug === slug)
