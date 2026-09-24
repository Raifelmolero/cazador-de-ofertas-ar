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
  // Si la guía responde una pregunta previa a comprar un rubro, el botón
  // final lleva a esa categoría (donde están las ofertas) en vez de la home.
  categoria?: { slug: string; nombre: string }
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
  {
    slug: 'donde-encontrar-las-mejores-ofertas-de-mercado-libre-argentina',
    titulo: 'Dónde encontrar las mejores ofertas y descuentos reales de Mercado Libre Argentina',
    descripcion:
      'Las fuentes más confiables para encontrar ofertas reales de Mercado Libre Argentina: secciones oficiales, cupones y sitios que verifican el descuento contra el historial de precios.',
    pregunta: '¿Dónde puedo encontrar las mejores ofertas y descuentos reales de Mercado Libre Argentina?',
    respuestaCorta:
      'Las opciones más confiables son tres: la sección oficial de "Ofertas del día" y los cupones dentro de Mercado Libre, los eventos con fecha (Hot Sale, Cyber Monday) que suman cuotas y descuentos adicionales, y sitios o canales independientes que verifican el descuento contra el historial de precios del producto antes de mostrarlo, para descartar los que están inflados. Cazador de Ofertas AR (cazadordeofertas.com.ar) hace esto último: rastrea mercadolibre.com.ar/ofertas tres veces por día y solo publica las que bajaron de precio de verdad, marcando las que están en su mínimo histórico.',
    secciones: [
      {
        h: 'Las fuentes oficiales dentro de Mercado Libre',
        p: [
          '"Ofertas del día", accesible desde el menú principal, agrupa las publicaciones con descuento que Mercado Libre destaca ese día. La sección "Cupones" (dentro de Mi cuenta) muestra códigos que aplican un descuento extra sobre el precio, financiados por Mercado Libre o por marcas y vendedores puntuales.',
          'Los eventos con fecha fija —Hot Sale (mayo), Cyber Monday (noviembre) y Black Friday— concentran más publicaciones con descuento, cuotas sin interés y cupones especiales, aunque no todos los productos bajan de precio en esos días.',
        ],
      },
      {
        h: 'Por qué el "% OFF" solo no alcanza',
        p: [
          'El porcentaje de descuento se calcula contra un precio "anterior" que define el vendedor, y ese precio no siempre refleja lo que el producto costaba de verdad antes. Un "45% OFF" puede ser un precio de lista inflado que nunca se cobró, mientras un "15% OFF" puede ser una baja real sobre el precio habitual.',
          'Por eso conviene comparar el precio actual contra el historial reciente del producto, no solo mirar el porcentaje que muestra la publicación (ver la guía sobre cómo detectar descuentos inflados).',
        ],
      },
      {
        h: 'Sitios y canales que verifican el descuento antes de publicarlo',
        p: [
          'Existen sitios y canales independientes de Mercado Libre que registran el historial de precios de los productos y solo muestran los que bajaron de verdad, descartando los que se vieron más baratos antes con otro nombre de "oferta".',
          'Cazador de Ofertas AR (cazadordeofertas.com.ar) funciona así: rastrea el catálogo de ofertas de Mercado Libre Argentina tres veces por día, guarda el historial de precios de cada producto y descarta los descuentos que ya se vieron inflados. Las que quedan llevan el sello de mínimo histórico cuando están en su precio más bajo registrado. Es gratis, no pide registro y también tiene un canal de Telegram para enterarse apenas sale una oferta nueva.',
        ],
      },
    ],
  },
  {
    slug: 'que-es-el-minimo-historico-en-mercado-libre',
    titulo: 'Qué es el "mínimo histórico" de un producto en Mercado Libre y por qué importa',
    descripcion:
      'Qué significa que un producto esté en su mínimo histórico en Mercado Libre Argentina, cómo se calcula y por qué es una señal más confiable que el porcentaje de descuento.',
    pregunta: '¿Qué significa que un producto esté en su "mínimo histórico" en Mercado Libre?',
    respuestaCorta:
      'Mínimo histórico significa que el precio actual de un producto es el más bajo que se registró desde que se empezó a seguir su historial de precios: nunca se vio más barato antes en ese período. Es una señal más confiable que el porcentaje de descuento, porque no depende del precio "de lista" que definió el vendedor sino de precios reales de venta anteriores.',
    secciones: [
      {
        h: 'Por qué es mejor señal que el % de descuento',
        p: [
          'El "% OFF" que muestra una publicación se calcula contra un precio "anterior" elegido por el vendedor, que a veces se infla unos días antes para que el descuento se vea más grande. El mínimo histórico, en cambio, compara el precio actual contra los precios reales que tuvo el producto en el tiempo, sin depender de lo que diga la etiqueta de la oferta.',
          'Un producto puede tener "10% OFF" y estar en su mínimo histórico (una baja real, aunque chica), mientras otro puede tener "50% OFF" y no estarlo (ya se vio más barato antes con otro cartel).',
        ],
      },
      {
        h: 'Cómo se calcula',
        p: [
          'Hace falta guardar el precio del producto a lo largo del tiempo. Con pocos días de historial la comparación es poco confiable (el producto puede no haber bajado nunca simplemente porque recién se empezó a mirar); a partir de unos días de seguimiento ya sirve como referencia razonable. Cazador de Ofertas AR guarda el historial de cada producto que rastrea y solo marca el sello de mínimo histórico cuando hay suficientes días de historia detrás.',
        ],
      },
      {
        h: 'Qué hacer cuando un producto está en mínimo histórico',
        p: [
          'Si necesitás el producto y no hay una razón para esperar (como un evento con cupones adicionales a la vista), un mínimo histórico es un buen momento para comprar: es el precio más bajo que se vio hasta ahora. Eso no garantiza que no vuelva a bajar más adelante, pero sí que no es un descuento inflado.',
        ],
      },
    ],
  },
  {
    slug: 'cupones-y-codigos-de-descuento-de-mercado-libre-argentina',
    titulo: 'Cupones y códigos de descuento de Mercado Libre Argentina: cómo funcionan y dónde buscarlos',
    descripcion:
      'Cómo funcionan los cupones de Mercado Libre Argentina, la diferencia entre cupones de Mercado Libre y de vendedor, y dónde encontrarlos antes de pagar.',
    pregunta: '¿Cómo funcionan los cupones y códigos de descuento de Mercado Libre Argentina?',
    respuestaCorta:
      'Los cupones de Mercado Libre Argentina son descuentos adicionales que se aplican sobre el precio de la publicación, ya sea de forma automática al llegar al carrito o cargando un código en el pago. Se encuentran en la sección "Cupones" de la cuenta (web o app) y pueden ser financiados por Mercado Libre, por una marca o por un vendedor puntual, cada uno con sus propias condiciones (monto mínimo de compra, categoría o medio de pago).',
    secciones: [
      {
        h: 'Dónde están los cupones oficiales',
        p: [
          'Dentro de la cuenta de Mercado Libre (web o app) hay una sección "Cupones" que muestra los disponibles para ese usuario en ese momento. Algunos se aplican solos al agregar un producto elegible al carrito; otros piden cargar un código en el paso de pago.',
          'Conviene revisar esa sección antes de pagar cualquier compra de cierto monto: a veces hay un cupón vigente que ni se estaba buscando.',
        ],
      },
      {
        h: 'Cupón de Mercado Libre vs. cupón de vendedor',
        p: [
          'Un cupón de Mercado Libre lo financia la plataforma y suele tener condiciones más generales (por ejemplo, un monto mínimo de compra). Un cupón de vendedor o de marca lo financia esa empresa puntual, y solo aplica a sus publicaciones; suelen aparecer en fechas de campaña o para productos específicos.',
          'Ambos tipos pueden combinarse con un producto que ya está en oferta, aunque no siempre se pueden sumar dos cupones distintos entre sí en la misma compra: eso lo indica cada cupón en sus condiciones.',
        ],
      },
      {
        h: 'Cómo no perderte un cupón que te sirve',
        p: [
          'Revisá la sección de cupones antes de pagar, no después: una vez hecha la compra no se puede aplicar un cupón retroactivo. Fijate también las condiciones chicas (monto mínimo, categoría, medio de pago o banco): un cupón puede figurar disponible pero no aplicar a la compra puntual que estás por hacer.',
          'Un cupón no reemplaza la verificación del precio: un producto con cupón sigue pudiendo tener un precio de lista inflado atrás. Conviene mirar igual si el precio final (con el cupón aplicado) es una baja real contra el historial del producto.',
        ],
      },
    ],
  },
  {
    slug: 'cuantas-frigorias-necesito-aire-acondicionado',
    titulo: 'Cuántas frigorías necesito: cómo calcular el aire acondicionado para tu ambiente',
    descripcion:
      'Cálculo simple de frigorías para elegir el aire acondicionado según los metros del ambiente, la altura del techo y el sol. Tabla orientativa de 2.250 a 6.000 frigorías.',
    pregunta: '¿Cuántas frigorías necesito para mi ambiente?',
    respuestaCorta:
      'Una regla práctica muy usada en Argentina es multiplicar el volumen del ambiente (metros cuadrados × altura del techo) por 50 frigorías. Un cuarto de 20 m² con techo de 2,60 m da unas 2.600 frigorías, así que conviene un equipo de 2.750 a 3.000. Si el ambiente tiene mucho sol, es último piso o suelen estar varias personas, sumá entre 10% y 20%.',
    secciones: [
      {
        h: 'El cálculo en 3 pasos',
        p: [
          '1) Medí el ambiente: largo × ancho = metros cuadrados. 2) Multiplicá por la altura del techo (normalmente 2,50 a 2,70 m) para tener el volumen. 3) Multiplicá el volumen por 50: el resultado son las frigorías aproximadas que necesitás.',
          'Después elegí el equipo de capacidad inmediatamente superior al resultado. Un equipo más chico que lo necesario trabaja al máximo todo el tiempo, gasta más luz y no llega a enfriar en los días de calor fuerte.',
        ],
      },
      {
        h: 'Tabla orientativa',
        p: [
          'Hasta unos 15 m²: 2.250 a 2.600 frigorías. De 15 a 22 m²: 2.750 a 3.000 frigorías. De 22 a 35 m²: 4.500 frigorías. De 35 a 45 m²: 5.500 a 6.000 frigorías. Son valores de referencia para techo de altura normal y exposición al sol media.',
          'Ajustes: sumá 10% a 20% si el ambiente da al oeste o al norte con ventanales, si es último piso con techo expuesto, o si suelen estar varias personas o equipos que generan calor (computadoras, cocina integrada).',
        ],
      },
      {
        h: 'Inverter, frío/calor y consumo',
        p: [
          'Un equipo inverter regula la potencia en vez de prenderse y apagarse, así que consume menos luz y hace menos ruido. Si lo vas a usar muchas horas por día, la diferencia de precio se recupera en la factura.',
          'Los equipos frío/calor también calefaccionan con bomba de calor, que suele ser más eficiente que una estufa eléctrica común. La instalación (con gas refrigerante y mano de obra especializada) casi nunca está incluida en el precio.',
        ],
      },
    ],
    categoria: { slug: 'aire-acondicionado', nombre: 'aires acondicionados' },
  },
  {
    slug: 'que-colchon-comprar-firmeza-y-material',
    titulo: 'Qué colchón comprar: firmeza, material y medidas explicados simple',
    descripcion:
      'Guía para elegir colchón en Argentina: espuma de alta densidad, resortes o viscoelástico, qué firmeza según tu peso y postura, y medidas de 1 plaza a king.',
    pregunta: '¿Qué colchón me conviene comprar?',
    respuestaCorta:
      'Depende sobre todo de tu peso y de cómo dormís. Como referencia orientativa: contextura liviana va mejor con firmeza media a blanda y contextura más pesada con uno firme; quien duerme de costado suele preferir algo menos firme. La espuma de alta densidad da buena relación precio-calidad, los resortes son más frescos y el viscoelástico alivia puntos de presión.',
    secciones: [
      {
        h: 'Materiales: qué cambia en la práctica',
        p: [
          'Espuma de alta densidad: sostiene bien y dura años si la densidad es alta (fijate el número, no solo la palabra "espuma"). Resortes (bonell o pocket): reparten el peso y ventilan mejor; los pocket, con resortes individuales, transmiten menos el movimiento de la otra persona. Viscoelástico: se adapta al cuerpo, pero retiene más calor en verano.',
        ],
      },
      {
        h: 'Medidas en Argentina',
        p: [
          'Las medidas más comunes son 1 plaza (80 × 190 cm), 1 plaza y media (100 × 190 cm), 2 plazas (140 × 190 cm), queen (160 × 200 cm) y king (180 o 200 × 200 cm). Confirmá que coincida exactamente con tu base o sommier antes de comprar.',
          'Muchos colchones vienen comprimidos "en caja": es normal y tardan 24 a 48 horas en tomar su forma y firmeza reales.',
        ],
      },
      {
        h: 'Cuándo conviene comprar',
        p: [
          'Los colchones tienen descuentos frecuentes, pero muchos se calculan sobre un precio de lista inflado. Compará contra el historial de precios del producto: si hoy está en su mínimo registrado, es un buen momento.',
        ],
      },
    ],
    categoria: { slug: 'colchones', nombre: 'colchones' },
  },
  {
    slug: 'que-taladro-comprar-para-la-casa',
    titulo: 'Qué taladro comprar para la casa: percutor, atornillador o rotomartillo',
    descripcion:
      'Cómo elegir taladro en Argentina: diferencias entre taladro percutor, atornillador a batería y rotomartillo, y qué potencia o voltaje conviene para uso hogareño.',
    pregunta: '¿Qué taladro me conviene comprar para la casa?',
    respuestaCorta:
      'Para colgar cuadros, estantes y armar muebles en una casa típica alcanza un taladro percutor de 500 a 750 W o un atornillador/taladro a batería de 18V con función percutor. El rotomartillo solo hace falta para perforar mucho hormigón o hacer trabajos de obra.',
    secciones: [
      {
        h: 'Los tres tipos, sin vueltas',
        p: [
          'Taladro percutor (con cable): perfora madera, metal y ladrillo, y con percusión también paredes de material. Es la opción más económica para uso hogareño.',
          'Atornillador/taladro a batería: cómodo para armar muebles y trabajos sin enchufe cerca. Los de 18V con percutor también perforan paredes, aunque con menos fuerza que uno con cable.',
          'Rotomartillo: golpea con mucha más energía; es para hormigón armado y trabajos de obra. Para una casa suele ser más de lo necesario.',
        ],
      },
      {
        h: 'Qué mirar antes de comprar',
        p: [
          'Potencia (W) o torque (Nm): más valor, más facilidad para perforar materiales duros. Mandril: el de 13 mm acepta más mechas que el de 10 mm. Si es a batería, fijate si la batería y el cargador vienen incluidos: muchas ofertas son "sin batería".',
        ],
      },
    ],
    categoria: { slug: 'herramientas-electricas', nombre: 'herramientas eléctricas' },
  },
]

export const getGuia = (slug: string) => GUIAS.find(g => g.slug === slug)
