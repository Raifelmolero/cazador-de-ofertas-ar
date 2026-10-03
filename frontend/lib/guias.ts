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
  // Botón final a medida (ej. a una comparativa); pisa al de categoría.
  cta?: { href: string; titulo: string; boton: string }
  /** Preguntas frecuentes extra (van al FAQPage JSON-LD junto con la principal). */
  faq?: { q: string; a: string }[]
  /** Links internos destacados (comparativa, calculadora, /hoy). */
  enlaces?: { href: string; texto: string }[]
  /** Fuentes oficiales citadas. */
  fuentes?: { texto: string; url: string }[]
  /** Slug de /mejores/* de donde mostrar ofertas reales del catálogo del día. */
  comparativa?: string
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
          'En nuestros datos, alrededor de 1 de cada 4 ofertas de mercadolibre.com.ar/ofertas tiene el descuento inflado. El detalle, la metodología y los números mes a mes están en el estudio de descuentos inflados (cazadordeofertas.com.ar/estudio/descuentos-inflados-mercado-libre).',
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
          'En 2026, el Cyber Monday argentino (lo organiza la Cámara Argentina de Comercio Electrónico, CACE) va del lunes 2 al miércoles 4 de noviembre, y el Black Friday cae el viernes 27 de noviembre. Al final de esta guía tenés las ofertas del Cyber Monday comparadas contra el historial de precios.',
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
    cta: {
      href: '/mejores/ofertas-cyber-monday',
      titulo: 'Cyber Monday 2026: qué ofertas bajaron de verdad',
      boton: 'Ver las ofertas de Cyber Monday 🎯',
    },
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
    titulo: 'Dónde buscar cupones de Mercado Libre Argentina y cómo funcionan',
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
    cta: {
      href: '/cupones-mercado-libre',
      titulo: 'Guía completa de cupones, con fuentes oficiales',
      boton: 'Ver la guía de cupones 🎟️',
    },
  },
  {
    slug: 'cuantas-frigorias-necesito-aire-acondicionado',
    titulo: '¿Qué aire acondicionado comprar? Cálculo de frigorías por m², inverter vs on-off y consumo',
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
    comparativa: 'mejores-aires-acondicionados',
    faq: [
      {
        q: '¿Cómo se calcula el aire acondicionado para un ambiente?',
        a: 'Multiplicá los metros cuadrados por la altura del techo y ese volumen por 50 frigorías. Después elegí el equipo de capacidad inmediatamente superior y sumá 10% a 20% si hay mucho sol, último piso o varias personas. La calculadora de frigorías hace la cuenta con esos ajustes.',
      },
      {
        q: '¿Qué conviene, inverter u on-off?',
        a: 'Si lo vas a usar muchas horas por día, inverter: regula la velocidad del compresor en vez de cortar y arrancar, por lo que gasta menos luz y hace menos ruido. Un on-off es más barato de entrada y puede alcanzar para un uso esporádico.',
      },
      {
        q: '¿Cuánta luz consume un aire acondicionado?',
        a: 'Depende de la potencia, las horas de uso y la eficiencia. El dato para comparar está en la etiqueta de eficiencia energética, obligatoria en Argentina, que indica la clase y el consumo. Con la potencia de la etiqueta podés calcular los kWh por mes en la calculadora de consumo eléctrico.',
      },
      {
        q: '¿La instalación viene incluida?',
        a: 'Casi nunca. Fijate en la publicación si la incluye y, si no, pedí presupuesto a un instalador antes de comprar, sobre todo antes del verano, cuando se saturan.',
      },
    ],
    enlaces: [
      { href: '/calculadora-frigorias', texto: 'Calculadora de frigorías ❄️' },
      { href: '/calculadora-consumo-electrico', texto: 'Calculadora de consumo ⚡' },
      { href: '/mejores/mejores-aires-acondicionados', texto: 'Comparativa de aires' },
      { href: '/hoy', texto: 'Ofertas de hoy' },
    ],
    fuentes: [
      { texto: 'Secretaría de Energía de la Nación: eficiencia energética y etiquetado', url: 'https://www.argentina.gob.ar/economia/energia/eficiencia-energetica' },
      { texto: 'IRAM: normas de etiquetado de eficiencia energética por producto', url: 'https://www.iram.org.ar/' },
    ],
  },
  {
    slug: 'que-heladera-comprar',
    titulo: '¿Qué heladera comprar? No frost o cíclica, litros por persona y etiqueta energética',
    descripcion:
      'Cómo elegir una heladera en Argentina: no frost o cíclica, cuántos litros según las personas, freezer, medidas y cómo leer la etiqueta de eficiencia energética.',
    pregunta: '¿Qué heladera conviene comprar?',
    respuestaCorta:
      'Elegí primero la capacidad (como referencia orientativa, 250 a 300 litros suelen alcanzar para una familia chica; con más personas, más litros) y después el sistema: no frost si no querés descongelar nunca, cíclica si buscás precio. Como la heladera está enchufada las 24 horas, la etiqueta de eficiencia energética (obligatoria en Argentina) pesa más que en casi cualquier otro electrodoméstico: compará el consumo anual en kWh que figura en ella.',
    secciones: [
      {
        h: 'No frost o cíclica',
        p: [
          'No frost: un ventilador distribuye el frío y no se forma escarcha, así que no hay que descongelarla. Suele costar más.',
          'Cíclica: acumula hielo en el freezer y cada tanto hay que descongelarla a mano. Es más económica de entrada.',
        ],
      },
      {
        h: 'Cuántos litros',
        p: [
          'Depende de cuántos son y de cada cuánto hacés las compras. Como referencia orientativa, una de 250 a 300 litros suele alcanzar para una familia chica; si compran por mes o son más, conviene subir de capacidad.',
          'Si congelás mucho, mirá la capacidad del freezer por separado, no solo la total. Freezer arriba es lo más común; abajo deja el sector de heladera a la altura de la vista; side by side es para mucho volumen y necesita un hueco ancho.',
        ],
      },
      {
        h: 'Etiqueta energética y medidas',
        p: [
          'En Argentina la etiqueta de eficiencia energética es obligatoria para heladeras (Secretaría de Energía, con normas IRAM). Indica la clase de eficiencia y el consumo anual en kWh: ese número es el que conviene comparar entre modelos. Pasalo a la calculadora de consumo eléctrico para ver cuánto es por mes con tu precio del kWh.',
          'Medí el hueco (alto, ancho y profundidad), dejá espacio atrás y a los costados para ventilación y comprobá que pase por puertas y pasillos. Fijate también hacia qué lado abre la puerta y si se puede invertir.',
        ],
      },
    ],
    categoria: { slug: 'heladeras', nombre: 'heladeras' },
    comparativa: 'mejores-heladeras',
    cta: { href: '/mejores/mejores-heladeras', titulo: 'Heladeras en oferta hoy, comparadas', boton: 'Ver la comparativa de heladeras 🧊' },
    faq: [
      {
        q: '¿Cuántos litros de heladera necesito por persona?',
        a: 'No hay una cifra oficial. Como referencia orientativa, 250 a 300 litros suelen alcanzar para una familia chica; con más integrantes o si hacés compras grandes por mes, conviene más capacidad.',
      },
      {
        q: '¿Qué diferencia hay entre no frost y cíclica?',
        a: 'La no frost no forma escarcha y no hay que descongelarla; la cíclica acumula hielo y hay que descongelarla cada tanto, pero suele ser más barata.',
      },
      {
        q: '¿Cómo leo la etiqueta de eficiencia energética de una heladera?',
        a: 'La etiqueta, obligatoria en Argentina, muestra la clase de eficiencia con letras (las primeras son las más eficientes) y el consumo de energía anual en kWh. Para comparar dos heladeras, mirá ese consumo anual: menos kWh es menos gasto de luz.',
      },
      {
        q: '¿Cómo sé si el descuento de una heladera es real?',
        a: 'Comparando con el historial de precios. En Cazador de Ofertas AR descartamos las ofertas cuyo precio ya se había visto igual o más bajo antes y marcamos las que están en su mínimo registrado.',
      },
    ],
    enlaces: [
      { href: '/mejores/mejores-heladeras', texto: 'Comparativa de heladeras' },
      { href: '/calculadora-consumo-electrico', texto: 'Calculadora de consumo ⚡' },
      { href: '/guias/que-lavavajillas-comprar', texto: 'Qué lavavajillas comprar' },
      { href: '/hoy', texto: 'Ofertas de hoy' },
    ],
    fuentes: [
      { texto: 'Secretaría de Energía de la Nación: eficiencia energética y etiquetado', url: 'https://www.argentina.gob.ar/economia/energia/eficiencia-energetica' },
      { texto: 'IRAM: normas de etiquetado de eficiencia energética por producto', url: 'https://www.iram.org.ar/' },
    ],
  },
  {
    slug: 'que-lavarropas-comprar',
    titulo: '¿Qué lavarropas comprar? Carga frontal o superior, cuántos kg e inverter',
    descripcion:
      'Cómo elegir un lavarropas en Argentina: carga frontal o superior, capacidad en kg según la familia, motor inverter, centrifugado, medidas y etiqueta de eficiencia energética.',
    pregunta: '¿Qué lavarropas conviene comprar?',
    respuestaCorta:
      'Elegí la capacidad según cuántos son (6 a 7 kg para 1 a 3 personas, 8 kg o más para familias o si lavás acolchados), carga frontal si querés gastar menos agua y cuidar más la ropa, o carga superior si priorizás precio y ciclos más cortos. El motor inverter suele ser más silencioso y eficiente. Compará el consumo por ciclo de la etiqueta de eficiencia energética, obligatoria en Argentina.',
    secciones: [
      {
        h: 'Carga frontal o superior',
        p: [
          'Carga frontal: lava por volteo, usa menos agua y es más suave con la ropa; los ciclos suelen ser más largos y hay que agacharse para cargarlo.',
          'Carga superior: en general más barato, con ciclos más rápidos, y en muchos modelos podés agregar ropa durante el lavado. Los semiautomáticos son la opción más barata, pero hay que pasar la ropa a mano al centrifugado.',
        ],
      },
      {
        h: 'Capacidad, centrifugado e inverter',
        p: [
          'Capacidad (kg de ropa seca): 6 a 7 kg para 1 a 3 personas; 8 kg o más para familias o para lavar acolchados.',
          'Centrifugado: con 1.000 rpm o más la ropa sale más seca y tarda menos en secarse.',
          'Motor inverter: regula la velocidad sin escobillas, suele hacer menos ruido y vibrar menos. Revisá los años de garantía que da el fabricante sobre el motor.',
        ],
      },
      {
        h: 'Etiqueta energética y medidas',
        p: [
          'La etiqueta de eficiencia energética de lavarropas es obligatoria en Argentina (Secretaría de Energía, normas IRAM): indica la clase y el consumo de energía por ciclo. Calentar agua es lo que más gasta; lavar en frío baja mucho el consumo. Podés estimar el costo mensual en la calculadora de consumo eléctrico.',
          'Medí ancho, profundidad y alto (en carga superior, también el espacio para abrir la tapa) y dejá lugar atrás para las mangueras.',
        ],
      },
    ],
    categoria: { slug: 'lavarropas', nombre: 'lavarropas' },
    comparativa: 'mejores-lavarropas',
    cta: { href: '/mejores/mejores-lavarropas', titulo: 'Lavarropas en oferta hoy, comparados', boton: 'Ver la comparativa de lavarropas 🧺' },
    faq: [
      {
        q: '¿Qué es mejor, lavarropas de carga frontal o superior?',
        a: 'Carga frontal si buscás gastar menos agua y cuidar la ropa; carga superior si priorizás precio, ciclos más cortos y cargar sin agacharte.',
      },
      {
        q: '¿De cuántos kg tiene que ser el lavarropas?',
        a: 'Para 1 a 3 personas alcanzan 6 a 7 kg; para familias, o si querés lavar acolchados y frazadas, 8 kg o más.',
      },
      {
        q: '¿Conviene un lavarropas inverter?',
        a: 'Si lo usás seguido, sí: el motor inverter suele ser más silencioso, vibra menos y es más eficiente. Cuesta algo más que uno con motor convencional.',
      },
      {
        q: '¿Cuánta luz gasta un lavarropas?',
        a: 'La etiqueta indica el consumo por ciclo. La mayor parte se va en calentar agua: lavando en frío el gasto baja mucho. Con ese dato podés calcular el costo por mes en la calculadora de consumo eléctrico.',
      },
    ],
    enlaces: [
      { href: '/mejores/mejores-lavarropas', texto: 'Comparativa de lavarropas' },
      { href: '/calculadora-consumo-electrico', texto: 'Calculadora de consumo ⚡' },
      { href: '/guias/que-lavarropas-comprar-cyber-monday', texto: 'Lavarropas en el Cyber Monday' },
      { href: '/guias/que-lavavajillas-comprar', texto: 'Qué lavavajillas comprar' },
      { href: '/hoy', texto: 'Ofertas de hoy' },
    ],
    fuentes: [
      { texto: 'Secretaría de Energía de la Nación: eficiencia energética y etiquetado', url: 'https://www.argentina.gob.ar/economia/energia/eficiencia-energetica' },
      { texto: 'IRAM: normas de etiquetado de eficiencia energética por producto', url: 'https://www.iram.org.ar/' },
    ],
  },
  {
    slug: 'que-lavavajillas-comprar',
    titulo: '¿Qué lavavajillas comprar? Cubiertos, 45 o 60 cm, consumo e instalación',
    descripcion:
      'Cómo elegir un lavavajillas en Argentina: cuántos cubiertos según la familia, ancho de 45 o 60 cm, libre instalación o empotrable, consumo de agua y luz, y qué necesita la instalación (toma de agua fría, desagüe y enchufe).',
    pregunta: '¿Qué lavavajillas conviene comprar?',
    respuestaCorta:
      'Elegí el tamaño por cuántos son: los de 45 cm de ancho suelen llevar unos 9 a 10 cubiertos y alcanzan para 1 a 3 personas; los de 60 cm llevan 12 a 14 cubiertos y convienen si son 4 o más o cocinan mucho. Antes de comprar, confirmá que tenés toma de agua fría, desagüe y un enchufe con descarga a tierra cerca del lugar, y medí el hueco. Compará el consumo de agua y energía por ciclo que figura en la ficha del modelo, y el precio contra el historial.',
    secciones: [
      {
        h: 'Cuántos cubiertos y qué ancho: 45 o 60 cm',
        p: [
          'La capacidad se mide en "cubiertos": un cubierto es el juego de vajilla de una persona en una comida (platos, vaso, taza y cubiertos). Es una medida de referencia: ollas y fuentes ocupan más lugar.',
          'Ancho de 45 cm ("slim"): suelen llevar alrededor de 9 a 10 cubiertos. Entran en cocinas chicas y alcanzan para 1 a 3 personas.',
          'Ancho de 60 cm (tamaño estándar): suelen llevar 12 a 14 cubiertos. Convienen para 4 personas o más, o si lavás ollas y fuentes grandes seguido. También hay modelos compactos de mesada para muy poca vajilla.',
        ],
      },
      {
        h: 'Instalación: agua fría, desagüe y enchufe',
        p: [
          'El lavavajillas se conecta a una toma de agua fría (con llave de paso) y calienta el agua él mismo con su resistencia. El desagüe va a la bacha o a una descarga cercana, y necesita un enchufe con descarga a tierra. Revisá en el manual del modelo el largo de las mangueras y la presión de agua que pide.',
          'Libre instalación (con tapa, va en cualquier lugar) o empotrable (va bajo la mesada, a veces con panel frontal de mueble). Medí ancho, alto y profundidad del hueco y dejá lugar para abrir la puerta y para las mangueras atrás.',
          'Si en la cocina no hay toma de agua ni desagüe cerca, sumá al presupuesto el trabajo de un plomero: casi nunca está incluido en el precio.',
        ],
      },
      {
        h: 'Consumo de agua y de luz',
        p: [
          'La ficha técnica de cada modelo indica cuántos litros de agua y cuántos kWh usa por ciclo en el programa estándar o eco. Compará esos dos números entre modelos del mismo tamaño.',
          'La mayor parte de la energía se va en calentar el agua: los programas eco o de baja temperatura tardan más pero gastan menos. Con el consumo por ciclo y cuántas veces por semana lo usás podés estimar el costo mensual en la calculadora de consumo eléctrico.',
          'Usarlo con la carga completa rinde más que varios ciclos a media carga.',
        ],
      },
      {
        h: 'Qué más mirar y cuánto sale',
        p: [
          'Programas útiles: eco, rápido, intensivo para ollas y media carga. Canasto de cubiertos o tercera bandeja, canastos regulables en altura, nivel de ruido (dB) si la cocina está integrada al living, y garantía oficial en Argentina.',
          'Es un electrodoméstico de ticket alto y los precios cambian mucho entre modelos, tamaños y semanas. Por eso no damos un precio fijo: en la comparativa de lavavajillas tenés los que están en oferta hoy, con el precio actual y el mínimo que registramos para cada uno.',
        ],
      },
    ],
    categoria: { slug: 'lavarropas', nombre: 'lavarropas y lavavajillas' },
    comparativa: 'mejores-lavavajillas',
    cta: { href: '/mejores/mejores-lavavajillas', titulo: 'Lavavajillas en oferta hoy, comparados', boton: 'Ver la comparativa de lavavajillas 🍽️' },
    faq: [
      {
        q: '¿De cuántos cubiertos conviene el lavavajillas?',
        a: 'Para 1 a 3 personas suele alcanzar uno de 45 cm (unos 9 a 10 cubiertos). Para 4 personas o más, o si lavás ollas y fuentes seguido, uno de 60 cm (12 a 14 cubiertos).',
      },
      {
        q: '¿El lavavajillas necesita agua caliente?',
        a: 'No. Se conecta a la toma de agua fría y calienta el agua con su propia resistencia. Necesita además un desagüe cerca y un enchufe con descarga a tierra.',
      },
      {
        q: '¿Qué diferencia hay entre un lavavajillas de 45 y uno de 60 cm?',
        a: 'El ancho y la capacidad: el de 45 cm entra en cocinas chicas y lleva menos vajilla; el de 60 cm es el tamaño estándar y lleva 12 a 14 cubiertos.',
      },
      {
        q: '¿Cuánta luz y agua gasta un lavavajillas?',
        a: 'Depende del modelo y del programa: la ficha técnica indica litros y kWh por ciclo. Calentar el agua es lo que más consume, por eso los programas eco gastan menos. Con esos datos podés calcular el costo mensual en la calculadora de consumo eléctrico.',
      },
    ],
    enlaces: [
      { href: '/mejores/mejores-lavavajillas', texto: 'Comparativa de lavavajillas' },
      { href: '/calculadora-consumo-electrico', texto: 'Calculadora de consumo ⚡' },
      { href: '/guias/que-lavarropas-comprar', texto: 'Qué lavarropas comprar' },
      { href: '/guias/que-heladera-comprar', texto: 'Qué heladera comprar' },
      { href: '/hoy', texto: 'Ofertas de hoy' },
    ],
    fuentes: [
      { texto: 'Secretaría de Energía de la Nación: eficiencia energética y etiquetado', url: 'https://www.argentina.gob.ar/economia/energia/eficiencia-energetica' },
    ],
  },
  {
    slug: 'que-freidora-de-aire-comprar',
    titulo: '¿Qué freidora de aire comprar? Litros, potencia y consumo',
    descripcion:
      'Cómo elegir una freidora de aire (air fryer) en Argentina: cuántos litros según las personas, potencia en watts, consumo eléctrico, canasto y cuándo conviene comprarla.',
    pregunta: '¿Qué freidora de aire conviene comprar?',
    respuestaCorta:
      'Elegí por capacidad: de 2 a 4 litros para una o dos personas y de 5 litros en adelante para una familia (o doble canasto para cocinar dos cosas a la vez). La potencia de placa (en watts) define qué tan rápido calienta: más watts, más rápido pero más consumo por hora. Preferí canasto antiadherente desmontable y compará el precio contra el historial antes de comprar, sobre todo en Hot Sale y Cyber Monday.',
    secciones: [
      {
        h: 'Cuántos litros',
        p: [
          '2 a 4 litros: una o dos personas, porciones chicas. 5 litros o más: familias. Los hornos air fryer (10 litros o más) y los modelos de doble canasto permiten cocinar varias cosas a la vez, pero ocupan más lugar en la mesada.',
        ],
      },
      {
        h: 'Potencia y consumo',
        p: [
          'La potencia figura en la placa del equipo y en la publicación, en watts. A más potencia, precalienta y cocina más rápido, pero consume más por hora de uso.',
          'El consumo es simple de calcular: watts × horas de uso ÷ 1000 = kWh. Como la resistencia corta y arranca al llegar a la temperatura, el consumo real suele ser algo menor que el de placa. En la calculadora de consumo eléctrico ponés la potencia y los minutos por día y te da los kWh por mes.',
        ],
      },
      {
        h: 'Qué más revisar',
        p: [
          'Canasto antiadherente y desmontable (y si el fabricante indica que va al lavavajillas). Controles digitales con programas, o perilla analógica si buscás lo más simple. Ventana o luz interior para ver la cocción sin abrir.',
          'Garantía oficial en Argentina y espacio libre alrededor: necesita ventilación y no debería quedar pegada a la pared.',
        ],
      },
    ],
    categoria: { slug: 'freidoras-de-aire', nombre: 'freidoras de aire' },
    comparativa: 'mejores-freidoras-de-aire',
    cta: { href: '/mejores/mejores-freidoras-de-aire', titulo: 'Freidoras de aire en oferta hoy, comparadas', boton: 'Ver la comparativa de freidoras 🍟' },
    faq: [
      {
        q: '¿De cuántos litros conviene la freidora de aire?',
        a: 'Para una o dos personas, de 2 a 4 litros. Para una familia, de 5 litros o más, o un modelo de doble canasto.',
      },
      {
        q: '¿Cuánta luz gasta una freidora de aire?',
        a: 'Watts de placa × horas de uso ÷ 1000 = kWh. Por ejemplo, una de 1.500 W usada media hora gasta como máximo 0,75 kWh; como la resistencia cicla, suele ser algo menos. Multiplicalo por el precio del kWh de tu factura.',
      },
      {
        q: '¿Conviene comprar la freidora de aire en el Hot Sale o el Cyber Monday?',
        a: 'Solo si el precio es realmente más bajo que en las semanas previas. Muchos descuentos de esas fechas se calculan sobre un precio anterior inflado: compará contra el historial de precios del modelo.',
      },
      {
        q: '¿Una freidora de aire reemplaza al horno?',
        a: 'Para porciones chicas y medianas cocina más rápido porque calienta menos volumen de aire. Para platos grandes o varias bandejas, el horno sigue siendo más práctico.',
      },
    ],
    enlaces: [
      { href: '/mejores/mejores-freidoras-de-aire', texto: 'Comparativa de freidoras' },
      { href: '/calculadora-consumo-electrico', texto: 'Calculadora de consumo ⚡' },
      { href: '/guias/hot-sale-cyber-monday-o-dia-comun-cuando-comprar-en-mercado-libre', texto: 'Hot Sale o Cyber Monday: cuándo comprar' },
      { href: '/hoy', texto: 'Ofertas de hoy' },
    ],
    fuentes: [
      { texto: 'Secretaría de Energía de la Nación: eficiencia energética', url: 'https://www.argentina.gob.ar/economia/energia/eficiencia-energetica' },
    ],
  },
  {
    slug: 'que-colchon-comprar-firmeza-y-material',
    titulo: '¿Qué colchón comprar? Resortes pocket vs. espuma, medidas y densidad',
    descripcion:
      'Guía para elegir colchón en Argentina: resortes pocket, bonell, espuma de alta densidad o viscoelástico, qué firmeza según tu peso y postura, y medidas de 1 plaza a king.',
    pregunta: '¿Qué colchón me conviene comprar?',
    respuestaCorta:
      'Depende sobre todo de tu peso, de cómo dormís y de si dormís solo o acompañado. Para dos personas, los resortes pocket (resortes individuales embolsados) transmiten menos el movimiento y ventilan mejor; la espuma de alta densidad da buena relación precio-calidad si la densidad declarada es alta. Como referencia orientativa: contextura liviana va mejor con firmeza media y contextura pesada con una firme; quien duerme de costado suele preferir algo menos firme. Antes de comprar, medí tu base: 2 plazas es 140 × 190 cm y queen, 160 × 200 cm.',
    secciones: [
      {
        h: 'Resortes pocket vs. espuma: qué cambia en la práctica',
        p: [
          'Resortes pocket: cada resorte va en su propia bolsa de tela y trabaja por separado. Por eso aíslan el movimiento (si el otro se da vuelta, lo sentís menos) y circula más aire, algo que se agradece en verano. Suelen ser más pesados y más caros que la espuma.',
          'Resortes bonell: resortes unidos entre sí. Son más económicos y frescos, pero transmiten más el movimiento de una plaza a la otra.',
          'Espuma de alta densidad: firme y pareja, sin ruidos. Su duración depende de la densidad, no de la palabra "espuma": fijate el número que declara el fabricante.',
          'Viscoelástico (memory foam): se adapta al cuerpo y alivia puntos de presión, pero retiene más calor. Muchos colchones combinan una capa de viscoelástico arriba con resortes o espuma abajo.',
        ],
      },
      {
        h: 'Densidad de la espuma: cómo leer el número',
        p: [
          'La densidad se expresa en kg/m³ y es el dato más útil para comparar colchones de espuma: a igual tipo de espuma, más densidad suele significar más durabilidad y que se hunda menos con los años.',
          'Muchos fabricantes además indican el peso máximo recomendado por plaza. Ese dato, más que el nombre comercial ("ortopédico", "premium"), te dice si el colchón está pensado para tu contextura. Si la publicación no informa densidad ni peso máximo, preguntá antes de comprar.',
        ],
      },
      {
        h: 'Medidas en Argentina',
        p: [
          'Las medidas más comunes son 1 plaza (80 × 190 cm), 1 plaza y media (100 × 190 cm), 2 plazas (140 × 190 cm; también hay 130 × 190), queen (160 × 200 cm) y king (180 o 200 × 200 cm). Confirmá que coincida exactamente con tu base o sommier antes de comprar.',
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
    faq: [
      {
        q: '¿Qué es mejor, colchón de resortes pocket o de espuma?',
        a: 'Ninguno es mejor para todos. Los resortes pocket aíslan mejor el movimiento entre dos personas y son más frescos; la espuma de alta densidad suele ser más económica y no hace ruido. Si dormís acompañado y te molesta que el otro se mueva, conviene pocket.',
      },
      {
        q: '¿Qué medida tiene un colchón de 2 plazas?',
        a: 'En Argentina, 2 plazas es 140 × 190 cm (también se vende 130 × 190). Queen es 160 × 200 cm y king, 180 × 200 o 200 × 200 cm. Medí tu base o sommier antes de comprar.',
      },
      {
        q: '¿Qué densidad de espuma conviene?',
        a: 'Más densidad suele significar más durabilidad. Más que buscar un número mágico, compará la densidad (kg/m³) y el peso máximo por plaza que declara cada fabricante, y elegí uno cuyo peso máximo te quede holgado.',
      },
      {
        q: '¿Es normal que el colchón llegue enrollado en una caja?',
        a: 'Sí. Los colchones "en caja" vienen comprimidos y tardan entre 24 y 48 horas en recuperar su forma y firmeza. Abrilo en el lugar donde lo vas a usar.',
      },
    ],
    enlaces: [
      { href: '/mejores/mejores-colchones-2-plazas', texto: 'Colchones 2 plazas, queen y king en oferta' },
      { href: '/mejores/mejores-colchones', texto: 'Todos los colchones en oferta' },
      { href: '/hoy', texto: 'Todas las ofertas verificadas de hoy' },
    ],
    comparativa: 'mejores-colchones-2-plazas',
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
    cta: { href: '/herramientas', titulo: 'Todo para el taller, en un solo lugar', boton: 'Ver herramientas en oferta' },
  },
  {
    slug: 'que-amoladora-comprar',
    titulo: 'Qué amoladora comprar: 115 o 230 mm, potencia y seguridad',
    descripcion:
      'Cómo elegir amoladora en Argentina: diferencia entre disco de 115 y 230 mm, cuánta potencia hace falta, con cable o a batería y qué seguridad mirar.',
    pregunta: '¿Qué amoladora me conviene comprar?',
    respuestaCorta:
      'Para la casa y trabajos generales (cortar hierro, caños, cerámica o desbastar) alcanza una amoladora angular de 115 mm con 700 a 900 W. La de 230 mm es para cortes profundos y uso de obra: pesa más, es más difícil de controlar y conviene solo si la vas a usar seguido.',
    secciones: [
      {
        h: '115 mm vs 230 mm',
        p: [
          'Amoladora de 115 mm (4½"): liviana y fácil de manejar con una mano en la empuñadura y otra en el cuerpo. Los discos son baratos y se consiguen en cualquier ferretería. Es la que conviene para la mayoría de los usos hogareños.',
          'Amoladora de 230 mm (9"): corta más profundo (hormigón, adoquines, perfiles gruesos), pero pesa el doble y el arranque es brusco. Es una herramienta de obra.',
        ],
      },
      {
        h: 'Qué mirar antes de comprar',
        p: [
          'Potencia: 700-900 W para 115 mm es suficiente; más watts sostienen mejor las RPM en cortes largos.',
          'Seguridad: protector del disco regulable, empuñadura lateral y, si podés, arranque suave y traba de interruptor. Usá siempre anteojos y guantes.',
          'A batería: cómodas para changas, pero la autonomía en corte continuo es corta. Fijate si incluye batería y cargador.',
        ],
      },
    ],
    categoria: { slug: 'herramientas-electricas', nombre: 'herramientas eléctricas' },
    cta: { href: '/herramientas', titulo: 'Amoladoras y todo para el taller, en oferta', boton: 'Ver herramientas en oferta' },
  },
  {
    slug: 'que-regalar-el-dia-de-la-madre',
    titulo: 'Qué regalar el Día de la Madre 2026: ideas por presupuesto y cuándo comprar',
    descripcion:
      'Ideas de regalo para el Día de la Madre 2026 (domingo 18 de octubre) según presupuesto, qué conviene según los gustos de tu mamá y con cuánta anticipación comprar en Mercado Libre.',
    pregunta: '¿Qué le regalo a mi mamá el Día de la Madre?',
    respuestaCorta:
      'El Día de la Madre 2026 en Argentina es el domingo 18 de octubre. Lo más elegido son perfumes, cuidado personal (secador, planchita), pequeños electrodomésticos de cocina (cafetera, freidora de aire) y tecnología (smartwatch, auriculares). Conviene comprar al menos una semana antes para que llegue a tiempo y revisar que el descuento sea real mirando el historial de precios.',
    secciones: [
      {
        h: 'Ideas según presupuesto',
        p: [
          'Hasta $50.000: perfumes de marcas nacionales, sets de cuidado personal, secador o planchita de gama de entrada, auriculares.',
          'De $50.000 a $150.000: perfumes importados, cafeteras de cápsulas, freidoras de aire, smartwatch, masajeadores.',
          'Más de $150.000: robot aspiradora, cafetera espresso, celular o tablet, electrodomésticos de cocina de mayor gama.',
          'En nuestra comparativa de regalos los productos en oferta de hoy están ordenados por estos mismos rangos, con el descuento verificado.',
        ],
      },
      {
        h: 'Según qué le gusta',
        p: [
          'Si le gusta arreglarse: perfume, secador, planchita o rizador. En perfumes, comprá en tiendas oficiales o vendedores con muy buena reputación.',
          'Si le gusta cocinar o el café: freidora de aire, cafetera, batidora o mixer. Es el regalo "útil" que rara vez falla.',
          'Si está siempre con el celular o sale a caminar: smartwatch o auriculares inalámbricos.',
          'Si no tiene tiempo para limpiar: una robot aspiradora es de los regalos más valorados, aunque es de ticket alto.',
        ],
      },
      {
        h: 'Cuándo comprar para que llegue',
        p: [
          'Comprá con al menos 5 a 7 días de margen y mirá la fecha de entrega que muestra Mercado Libre antes de pagar. La semana previa al 18 de octubre los envíos se cargan.',
          'Los productos con envío Full suelen llegar más rápido y tienen devolución simple si hay que cambiar el talle, el color o el modelo.',
          'Antes de comprar, fijate si el descuento es real: muchos precios "antes" están inflados. En cada producto seguido mostramos el precio más bajo que registramos.',
        ],
      },
    ],
    cta: {
      href: '/mejores/regalos-dia-de-la-madre',
      titulo: 'Regalos para el Día de la Madre en oferta hoy',
      boton: 'Ver regalos por presupuesto 🎁',
    },
  },
  {
    slug: 'que-soldadora-comprar',
    titulo: 'Qué soldadora comprar: inverter o transformador, y qué amperaje',
    descripcion:
      'Cómo elegir soldadora en Argentina: diferencia entre soldadora inverter y de transformador, qué amperaje alcanza para uso hogareño y qué mirar antes de comprar.',
    pregunta: '¿Qué soldadora me conviene comprar, inverter o transformador?',
    respuestaCorta:
      'Para uso hogareño y changas, una soldadora inverter de 120 a 160 A alcanza para la mayoría de los trabajos con electrodo (chapa, caños, estructuras livianas), pesa mucho menos que una de transformador y tiene mejor control del arco. La de transformador es más barata y resistente, pero pesa el triple y consume más luz por el mismo trabajo.',
    secciones: [
      {
        h: 'Inverter vs. transformador',
        p: [
          'Soldadora inverter: usa electrónica de potencia para convertir la corriente, así que pesa 3 a 5 kg en vez de 20 o 30. Da un arco más estable, más fácil de manejar para quien recién empieza, y varias permiten usar electrodo y también TIG o MIG según el modelo. Consume menos energía para la misma corriente de soldado.',
          'Soldadora de transformador: la tecnología clásica, pesada y sin electrónica que se pueda romper fácil. Es más barata a igual amperaje y muy resistente al maltrato de obra, pero el arco es menos parejo y consume bastante más luz.',
        ],
      },
      {
        h: 'Qué amperaje elegir',
        p: [
          'La regla práctica más usada es calcular 30 a 40 A por cada milímetro de diámetro del electrodo (varía según posición y tipo de recubrimiento): un electrodo de 2,5 mm ronda 75-100 A, uno de 3,25 mm ronda 100-130 A (el más usado para changas y uso general) y uno de 4 mm ronda 120-160 A.',
          'Con eso, una soldadora de 120-140 A cubre electrodos de 2,5 y 3,25 mm para chapa y estructuras livianas a medias. Para trabajar cómodo con electrodo de 4 mm en piezas más gruesas conviene una de 160-200 A.',
        ],
      },
      {
        h: 'Qué mirar antes de comprar',
        p: [
          'Ciclo de trabajo (duty cycle): el porcentaje de tiempo que puede soldar seguido antes de tener que enfriarse, a una corriente dada. Para uso hogareño no hace falta uno alto, pero conviene que el dato esté publicado (desconfiá de las que no lo informan).',
          'Voltaje de entrada: la mayoría de las inverter domésticas van a 220V monofásico; confirmá que coincide con tu instalación.',
          'Accesorios incluidos: pinza porta electrodo, pinza de masa y máscara no siempre vienen en la caja — fijate en la publicación.',
        ],
      },
    ],
    categoria: { slug: 'herramientas-electricas', nombre: 'herramientas eléctricas' },
    cta: { href: '/herramientas', titulo: 'Soldadoras y todo para el taller, en oferta', boton: 'Ver herramientas en oferta' },
  },
  {
    slug: 'que-hidrolavadora-comprar',
    titulo: 'Qué hidrolavadora comprar: presión, caudal y para qué alcanza cada una',
    descripcion:
      'Cómo elegir hidrolavadora en Argentina: qué significa la presión en bar, el caudal en litros por hora, y qué potencia conviene para lavar auto, patio o pisos.',
    pregunta: '¿Qué hidrolavadora me conviene comprar para casa?',
    respuestaCorta:
      'Para lavar auto, moto, patio o el frente de la casa alcanza una hidrolavadora doméstica de 110 a 140 bar de presión, con un caudal de 350 a 450 litros por hora. Solo hace falta más presión (150-200 bar y 450-600 l/h) si vas a sacar pintura, moho incrustado o suciedad muy pegada en superficies grandes con uso más seguido.',
    secciones: [
      {
        h: 'Presión (bar) y caudal (L/h): qué significa cada uno',
        p: [
          'La presión (medida en bar o PSI) es la fuerza del chorro: más presión saca suciedad más pegada. El caudal (litros por hora) es cuánta agua mueve la máquina: más caudal enjuaga más rápido una superficie grande, aunque la presión sea la misma.',
          'Para tareas domésticas conviene mirar los dos datos, no solo la presión: una máquina con mucha presión pero poco caudal tarda más en cubrir un patio entero.',
        ],
      },
      {
        h: 'Cuánta presión hace falta según la tarea',
        p: [
          'Auto, moto, bici, muebles de jardín: modelos de entrada de 100-110 bar y unos 350 l/h de caudal sobran (es el rango de las hidrolavadoras domésticas más chicas del mercado).',
          'Patio, vereda, rejas, frente de la casa: 110-140 bar con 350-450 l/h, el rango más común en las hidrolavadoras domésticas de uso general.',
          'Sacar pintura vieja, moho muy incrustado o uso más seguido (changas): 150-200 bar con 450-600 l/h, con motor más robusto.',
        ],
      },
      {
        h: 'Motor: inducción vs. universal',
        p: [
          'Motor de inducción: más silencioso, dura más y soporta mejor el uso seguido, pero las máquinas son más caras y algo más pesadas.',
          'Motor universal (a escobillas): más económico y liviano, ideal para uso ocasional de fin de semana; las escobillas se gastan con el uso frecuente.',
        ],
      },
      {
        h: 'Qué mirar antes de comprar',
        p: [
          'Accesorios incluidos: lanza turbo (más rápida que la chorro/abanico común), cepillo para autos y kit para sacar espuma dan más uso a la misma máquina.',
          'Manguera de succión de agua: revisá si trae la conexión para tanque o solo para canilla de red.',
          'Peso y ruedas: si la vas a mover seguido por el patio, pesa más de lo que parece en la foto.',
        ],
      },
    ],
    categoria: { slug: 'herramientas-electricas', nombre: 'herramientas eléctricas' },
    cta: { href: '/herramientas', titulo: 'Hidrolavadoras y todo para el taller, en oferta', boton: 'Ver herramientas en oferta' },
  },
  {
    slug: 'herramientas-electricas-cyber-monday-black-friday',
    titulo: 'Cyber Monday y Black Friday: cuándo conviene comprar herramientas eléctricas',
    descripcion:
      'Cuándo conviene comprar taladros, amoladoras, soldadoras e hidrolavadoras en el Cyber Monday argentino (CACE, 2 al 4 de noviembre de 2026) y en el Black Friday, y cómo evitar los descuentos inflados.',
    pregunta: '¿Conviene esperar al Cyber Monday o al Black Friday para comprar herramientas eléctricas?',
    respuestaCorta:
      'En Argentina el evento fuerte para herramientas es el Cyber Monday organizado por la CACE (2 al 4 de noviembre de 2026), no el Black Friday: reúne a muchas más marcas y ferreterías locales participando con stock propio. El Black Friday (fin de noviembre) suma descuentos puntuales de algunos vendedores, pero con menos participación. En ambos casos, conviene comparar el precio contra el historial de cada producto, no confiar solo en el cartel de "% OFF".',
    secciones: [
      {
        h: 'Cyber Monday: el evento que importa para herramientas',
        p: [
          'El Cyber Monday argentino lo organiza la Cámara Argentina de Comercio Electrónico (CACE) y en 2026 va del lunes 2 al miércoles 4 de noviembre. A diferencia del Black Friday (que en Argentina lo replica cada tienda por su cuenta, sin fecha ni organizador único), el Cyber Monday tiene un sitio oficial y convoca a cientos de marcas y comercios, incluidas ferreterías y marcas de herramientas.',
          'Es además la época en la que muchos arrancan changas de fin de año (pintura, arreglos, jardín) antes del verano, así que la demanda ayuda a que las marcas saquen stock con descuentos genuinos.',
        ],
      },
      {
        h: 'Y el Black Friday, ¿qué lugar tiene?',
        p: [
          'El Black Friday llega a Argentina unas semanas después del Cyber Monday (fin de noviembre) y cada tienda lo arma por su cuenta, sin un organizador central como la CACE. En herramientas suele traer descuentos puntuales de algunas marcas o vendedores, pero con menos participación que el Cyber Monday.',
          'Si ya compraste en el Cyber Monday y el precio estaba en su mínimo histórico, no hace falta esperar también al Black Friday: es difícil que baje más en pocas semanas.',
        ],
      },
      {
        h: 'Qué mirar para no caer en un descuento inflado',
        p: [
          'El mismo mecanismo de otras fechas especiales: algunos vendedores suben el precio "de lista" los días previos para que el descuento se vea más grande. Comparar contra el historial de precios de cada producto (no contra el % que muestra la publicación) es la única forma confiable de saber si hay una baja real.',
          'Si una herramienta que necesitás ya está en su mínimo histórico antes del evento, no hay motivo para esperar: puede no bajar más, o incluso subir por la demanda.',
        ],
      },
      {
        h: 'Cuándo esperar y cuándo comprar ya',
        p: [
          'Esperá al Cyber Monday (2 al 4 de noviembre de 2026) si buscás algo de ticket alto (amoladora grande, soldadora, hidrolavadora) y podés programar la compra: el evento suele sumar cuotas sin interés además del precio.',
          'Comprá antes si el precio actual ya es el mínimo histórico o si la herramienta se agota rápido en tu zona: las mejores unidades de stock limitado a veces se agotan antes del evento.',
        ],
      },
    ],
    categoria: { slug: 'herramientas-electricas', nombre: 'herramientas eléctricas' },
    cta: { href: '/herramientas', titulo: 'Herramientas eléctricas en oferta hoy', boton: 'Ver herramientas en oferta' },
  },
  {
    slug: 'que-horno-pizzero-comprar-para-mi-negocio',
    titulo: 'Qué horno pizzero comprar para mi negocio: gas, eléctrico o leña',
    descripcion:
      'Cómo elegir horno pizzero para local o foodtruck en Argentina: gas vs. eléctrico vs. leña, cuántas pizzas por hora rinde cada uno, tamaño de piedra y pisos, consumo y habilitación.',
    pregunta: '¿Qué horno pizzero me conviene comprar para mi local o foodtruck?',
    respuestaCorta:
      'Para arrancar un local chico o un foodtruck, un horno pizzero a gas de un piso con piedra refractaria es la opción más práctica: llega a temperaturas altas más rápido que el eléctrico, no depende de una instalación trifásica y cocina una pizza en 2 a 4 minutos. El eléctrico rinde parecido pero pide más potencia de tablero; el de leña da el sabor distintivo pero exige más espacio, más práctica del pizzero y trámites de habilitación por el humo.',
    secciones: [
      {
        h: 'Gas vs. eléctrico vs. leña',
        p: [
          'A gas: es el más elegido para arrancar un negocio. Calienta rápido, el consumo se paga con garrafa o gas de red (más barato que la luz en la mayoría de los casos) y no necesita instalación eléctrica especial. Buena parte de los hornos pizzeros a gas para uso comercial que se consiguen en el país traen piedra refractaria de fábrica.',
          'Eléctrico: más simple de instalar donde no hay gas natural ni se puede tener garrafa (algunos locales y shoppings lo exigen por seguridad), pero un horno de uso comercial pide bastante potencia y casi siempre una conexión trifásica — hay que confirmarlo con un electricista antes de comprar.',
          'A leña: el que más sabor le da a la pizza y el que más diferencia un local, pero es el que más espacio ocupa, necesita salida de humos propia y un pizzero con más práctica para manejar la temperatura a ojo. También es el que más trámites de habilitación municipal suele pedir por el tema humo y seguridad contra incendio.',
        ],
      },
      {
        h: 'Cuántas pizzas por hora rinde',
        p: [
          'A las temperaturas de un horno pizzero comercial (400-500°C en la piedra) una pizza se cocina en 60 a 90 segundos apenas el horno está a régimen, así que el límite real no es el horno sino cuántas entran juntas en la piedra y cuánto tarda el pizzero en armarlas y sacarlas. Un horno de un piso chico (para foodtruck o local con poco espacio) suele entrar 1 a 2 pizzas por vez; uno de uso comercial más grande puede tener capacidad para varias pizzas de 30-35 cm en simultáneo.',
          'Para calcular cuánto necesitás, pensá en el pico de un sábado a la noche, no en un día común: si vendés 40 pizzas en 3 horas de pico, con pizzas de 2-3 minutos y espacio para 2 a la vez, el horno no es el cuello de botella — el armado sí.',
        ],
      },
      {
        h: 'Tamaño de piedra y pisos',
        p: [
          'La piedra refractaria (o cordierita) es la que retiene el calor y le da el piso crocante a la pizza; cuanto más gruesa, mejor mantiene la temperatura entre pizza y pizza, pero tarda más en precalentar. Para el diámetro de pizza que vendés, la piedra tiene que ser un poco más grande que la pizza más grande de tu carta.',
          'Los hornos de un piso (una sola cámara) alcanzan para la mayoría de los locales chicos y foodtrucks. Los de dos o más pisos sirven para separar pizzas de distintos tiempos de cocción o para duplicar producción sin ocupar más superficie de mostrador — conviene evaluarlos cuando el local ya tiene volumen probado, no para arrancar.',
        ],
      },
      {
        h: 'Consumo y habilitación',
        p: [
          'El consumo real depende del modelo y de cuántas horas por día lo tenés prendido, pero en general el gas sale más barato de sostener por hora de uso que el eléctrico a la misma temperatura, mientras que el eléctrico es más previsible si el precio del gas envasado varía en tu zona.',
          'Antes de comprar, confirmá con el municipio qué habilitación te van a pedir para el rubro (gastronómico con cocción) y si el horno que elegís necesita instalación por gasista matriculado (a gas) o certificación de instalación eléctrica (eléctrico) — varía según partido/localidad y es un paso obligatorio para poder operar, no un trámite opcional.',
        ],
      },
    ],
    categoria: { slug: 'equipamiento-gastronomico', nombre: 'equipamiento gastronómico' },
    cta: { href: '/gastronomia', titulo: 'Equipamiento gastronómico en oferta hoy', boton: 'Ver equipamiento en oferta' },
  },
  {
    slug: 'que-freidora-industrial-comprar',
    titulo: 'Qué freidora industrial comprar según el volumen de tu negocio',
    descripcion:
      'Cómo elegir freidora industrial para local o foodtruck en Argentina: litros según volumen de ventas, gas vs. eléctrica, cuba simple o doble, termostato y acero inoxidable.',
    pregunta: '¿Qué freidora industrial me conviene comprar para mi negocio?',
    respuestaCorta:
      'La capacidad se elige por litros de aceite, no por tamaño de la cuba a simple vista: para un local chico o foodtruck con volumen bajo a medio alcanza con 7 a 12 litros; para un local con más movimiento o que fríe seguido en el pico conviene 15 litros o más, o directamente dos cubas para freír dos productos distintos (por ejemplo papas y algo rebozado) sin mezclar sabores ni tener que esperar a que se vacíe una.',
    secciones: [
      {
        h: 'Litros según volumen de ventas',
        p: [
          'De 7 a 10 litros: alcanza para un foodtruck o un local con producción baja, con tandas chicas y seguidas.',
          'De 12 a 18 litros: el rango más común para un local gastronómico de volumen medio, que fríe en tandas más grandes y no quiere estar recargando aceite cada rato en el pico.',
          'De 18 litros para arriba, o varias cubas: para volumen alto y sostenido, donde una sola cuba chica obligaría a esperar entre tanda y tanda y se pierden ventas en el pico.',
        ],
      },
      {
        h: 'Gas vs. eléctrica',
        p: [
          'A gas: recupera la temperatura más rápido entre tanda y tanda (importante si freís seguido en el pico) y no depende de la potencia del tablero. Es la opción más elegida en locales que ya tienen instalación de gas para la cocina.',
          'Eléctrica: más simple de instalar en locales sin gas o donde no se permite garrafa, con temperatura más estable y control más preciso, pero una freidora industrial eléctrica de buena capacidad puede pedir bastante potencia — confirmá con un electricista si tu instalación la soporta antes de comprar.',
        ],
      },
      {
        h: 'Cuba simple o doble, y termostato',
        p: [
          'Cuba simple: más barata y suficiente si freís un solo tipo de producto o no te molesta que se mezclen sabores (papas y milanesas, por ejemplo).',
          'Cuba doble: dos compartimentos con calentamiento independiente, para freír dos productos sin que uno tome el sabor del otro, o para no perder producción si una cuba está en limpieza.',
          'Termostato: buscá que sea regulable (no solo on/off) para poder bajar la temperatura en horas flojas y cuidar el aceite, y que tenga corte de seguridad si se pasa de temperatura — casi todos los modelos de uso comercial lo traen, pero conviene confirmarlo en la publicación.',
        ],
      },
      {
        h: 'Acero inoxidable y qué más mirar',
        p: [
          'El acero inoxidable en la cuba y el cuerpo es el estándar para uso comercial: no se oxida con el contacto diario de aceite y agua de limpieza, y es lo que suelen pedir las habilitaciones bromatológicas municipales para equipamiento gastronómico.',
          'Revisá si trae canasta extra (para tener una lista mientras la otra escurre), grifo de vaciado de aceite (facilita muchísimo la limpieza diaria) y si el filtro de aceite viene incluido o se compra aparte.',
        ],
      },
    ],
    categoria: { slug: 'equipamiento-gastronomico', nombre: 'equipamiento gastronómico' },
    cta: { href: '/gastronomia', titulo: 'Equipamiento gastronómico en oferta hoy', boton: 'Ver equipamiento en oferta' },
  },
  {
    slug: 'que-notebook-comprar',
    titulo: '¿Qué notebook comprar? Procesador, RAM y SSD según para qué la usás',
    descripcion:
      'Guía para elegir notebook en Argentina para estudiar, trabajar o jugar: qué procesador, cuánta RAM y qué disco SSD conviene, y qué evitar.',
    pregunta: '¿Qué notebook me conviene comprar?',
    respuestaCorta:
      'Para estudiar o trabajar: procesador Ryzen 5 o Core i5 (o superior), 16 GB de RAM (8 GB como mínimo, mejor si se puede ampliar) y disco SSD de 512 GB (256 GB como mínimo). Para gaming: además, placa de video dedicada (NVIDIA GeForce RTX o AMD Radeon) y 16 GB de RAM. Los modelos con Celeron, Intel N100 o 4 GB de RAM sirven solo para navegar y ofimática liviana.',
    secciones: [
      {
        h: 'Para estudiar',
        p: [
          'Navegar, Word, Classroom, Zoom y muchas pestañas: un Ryzen 3 / Core i3 moderno con 8 GB de RAM y SSD alcanza; si podés, subí a Ryzen 5 / Core i5 para que dure más años.',
          'Si la vas a llevar todos los días, priorizá peso y batería: 14 pulgadas es más cómodo de transportar que 15,6.',
        ],
      },
      {
        h: 'Para trabajar',
        p: [
          'Ryzen 5 / Core i5 o superior y 16 GB de RAM: con el navegador, planillas, videollamadas y un par de programas abiertos a la vez, 8 GB se quedan cortos.',
          'Pantalla de 15,6 pulgadas con panel IPS y resolución Full HD (1920 × 1080): se lee mejor y se ve bien de costado. Evitá los paneles TN y las pantallas de 1366 × 768.',
          'Puertos: fijate que tenga los que usás (HDMI para un monitor, USB-A, USB-C, lector de tarjetas) para no depender de adaptadores.',
        ],
      },
      {
        h: 'Para gaming o edición',
        p: [
          'Lo que más pesa es la placa de video dedicada: una NVIDIA GeForce RTX o AMD Radeon. Los gráficos integrados alcanzan para juegos livianos, no para títulos exigentes.',
          '16 GB de RAM, SSD de 512 GB o más (los juegos ocupan mucho) y una pantalla de 120 Hz o más si jugás competitivo. Estas notebooks pesan más y la batería dura menos.',
        ],
      },
      {
        h: 'RAM y SSD: los dos datos que más cambian la experiencia',
        p: [
          'RAM: con Windows 11, 4 GB no alcanza y 8 GB es el mínimo razonable. Revisá si la memoria está soldada o si tiene un slot libre para ampliarla más adelante.',
          'Disco: un SSD arranca y abre programas mucho más rápido que un disco rígido (HDD). Los SSD NVMe son más rápidos que los SATA. 256 GB se llena rápido; 512 GB es más cómodo.',
          'Garantía oficial en Argentina y teclado en español: los equipos importados a veces no traen ninguna de las dos.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Cuánta RAM necesita una notebook para estudiar?',
        a: '8 GB como mínimo. Con 16 GB va a seguir rindiendo bien varios años aunque abras muchas pestañas y programas. 4 GB no alcanza con Windows 11.',
      },
      {
        q: '¿Conviene Ryzen o Intel?',
        a: 'A igual nivel (Ryzen 5 vs. Core i5, Ryzen 7 vs. Core i7) rinden parecido para estudiar y trabajar. Conviene comparar la generación del procesador y el resto del equipo (RAM, SSD, pantalla) más que la marca.',
      },
      {
        q: '¿Un SSD de 256 GB alcanza?',
        a: 'Para estudiar y trabajar con archivos en la nube, sí, aunque queda justo. Si guardás fotos, videos o juegos, buscá 512 GB o más, o un modelo con lugar para un segundo disco.',
      },
      {
        q: '¿Qué notebook sirve para jugar?',
        a: 'Una con placa de video dedicada (NVIDIA GeForce RTX o AMD Radeon), 16 GB de RAM y SSD de 512 GB o más. Sin placa dedicada, solo vas a poder jugar títulos livianos.',
      },
    ],
    enlaces: [
      { href: '/mejores/mejores-notebooks', texto: 'Notebooks en oferta: comparativa de precios' },
      { href: '/hoy', texto: 'Todas las ofertas verificadas de hoy' },
    ],
    comparativa: 'mejores-notebooks',
    cta: {
      href: '/mejores/mejores-notebooks',
      titulo: 'Notebooks en oferta hoy, comparadas contra su historial',
      boton: 'Ver notebooks en oferta 💻',
    },
  },
  {
    slug: 'que-celular-comprar-segun-presupuesto',
    titulo: '¿Qué celular comprar según tu presupuesto? Gama media: RAM, memoria, 5G y batería',
    descripcion:
      'Guía para elegir celular en Argentina según el presupuesto: cuánta RAM y almacenamiento conviene, si hace falta 5G, batería, pantalla y años de actualizaciones.',
    pregunta: '¿Qué celular me conviene comprar según mi presupuesto?',
    respuestaCorta:
      'Para la mayoría, un gama media es la mejor relación precio-calidad: 128 GB de almacenamiento como mínimo (256 GB si sacás muchas fotos y videos), 6 a 8 GB de RAM, batería de 5.000 mAh y varios años de actualizaciones del fabricante. El 5G es un plus si tu compañía lo ofrece en tu zona, pero no es imprescindible. Preferí equipos con garantía oficial en Argentina.',
    secciones: [
      {
        h: 'Gama de entrada: lo justo para WhatsApp, redes y fotos',
        p: [
          'Priorizá 128 GB de almacenamiento y 4 a 6 GB de RAM. Con 64 GB el espacio se llena enseguida con fotos, videos y WhatsApp.',
          'Si el modelo tiene ranura para tarjeta microSD, podés sumar espacio para fotos más adelante.',
        ],
      },
      {
        h: 'Gama media: dónde está la mejor relación precio-calidad',
        p: [
          'RAM: 6 u 8 GB para tener varias apps abiertas sin que se cierren solas. Almacenamiento: 128 GB mínimo, 256 GB si grabás video.',
          'Pantalla: AMOLED se ve mejor (negros más profundos, mejor a pleno sol) que LCD; 90 o 120 Hz hace que todo se sienta más fluido.',
          'Batería: 5.000 mAh es lo habitual en la gama y suele dar un día completo de uso. Mirá también la potencia de carga y si el cargador viene en la caja.',
          'Actualizaciones: algunos fabricantes prometen varios años de actualizaciones de Android y parches de seguridad. Un equipo que se actualiza por más tiempo dura más; el dato está en la página oficial del modelo.',
        ],
      },
      {
        h: '5G: ¿hace falta?',
        p: [
          'El 5G da más velocidad donde hay cobertura, pero el 4G sigue funcionando bien para el uso diario. Conviene si tu compañía ya tiene 5G en tu zona o si pensás usar el equipo varios años.',
          'Sea 4G o 5G, revisá que sea una versión que funcione con las bandas de las compañías argentinas y si es dual SIM o admite eSIM.',
        ],
      },
      {
        h: 'Garantía y vendedor',
        p: [
          'Comprá en tiendas oficiales o vendedores con reputación verde. Los equipos importados a veces no tienen garantía oficial en Argentina.',
          'Los combos con regalo (funda, auriculares, cargador) no siempre valen más: compará el precio del equipo solo.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Cuánta RAM necesita un celular?',
        a: '4 GB alcanza para lo básico; 6 u 8 GB es lo recomendable en gama media si usás muchas apps a la vez o jugás.',
      },
      {
        q: '¿Alcanza con 128 GB de almacenamiento?',
        a: 'Para la mayoría, sí. Si sacás muchas fotos, grabás video o guardás todo lo de WhatsApp, conviene 256 GB o un modelo con ranura microSD.',
      },
      {
        q: '¿Vale la pena pagar más por 5G?',
        a: 'Solo si tu compañía tiene 5G en tu zona o si vas a usar el celular varios años. Para WhatsApp, redes y video, el 4G alcanza.',
      },
      {
        q: '¿Qué batería conviene?',
        a: 'Unos 5.000 mAh, que es lo habitual en gama media y suele durar un día completo. La duración real depende también de la pantalla y del procesador.',
      },
    ],
    enlaces: [
      { href: '/mejores/mejores-celulares', texto: 'Celulares en oferta: comparativa de precios' },
      { href: '/guias/que-celular-gama-alta-comprar', texto: 'Qué celular de gama alta comprar: iPhone, Galaxy S, Edge y Xiaomi' },
      { href: '/hoy', texto: 'Todas las ofertas verificadas de hoy' },
    ],
    comparativa: 'mejores-celulares',
    cta: {
      href: '/mejores/mejores-celulares',
      titulo: 'Celulares en oferta hoy, comparados contra su historial',
      boton: 'Ver celulares en oferta 📱',
    },
  },
  {
    slug: 'que-celular-gama-alta-comprar',
    titulo: '¿Qué celular de gama alta comprar? iPhone, Samsung Galaxy S, Motorola Edge y Xiaomi',
    descripcion:
      'Guía para elegir un celular de gama alta en Argentina: iPhone, Samsung Galaxy S, Motorola Edge o Xiaomi tope de gama. Qué mirar, cuotas sin interés y cuándo conviene esperar al Cyber Monday o al Black Friday.',
    pregunta: '¿Qué celular de gama alta conviene comprar en Argentina?',
    respuestaCorta:
      'En gama alta la elección pasa más por el ecosistema que por la ficha: si ya usás Mac, iPad o Apple Watch, un iPhone se integra mejor; si preferís Android, la serie Galaxy S de Samsung y los tope de gama de Motorola (Edge) y Xiaomi compiten en cámara, pantalla y rendimiento. Antes de pagar, compará el precio contra su historial, revisá que tenga garantía oficial en Argentina (tienda oficial o distribuidor autorizado) y hacé la cuenta de las cuotas: en un equipo de varios millones, las cuotas sin interés pueden convenir más que un descuento chico en un pago.',
    secciones: [
      {
        h: 'iPhone o Android: primero el ecosistema',
        p: [
          'iPhone: tiene sentido si ya usás otros productos de Apple (Mac, iPad, AirPods, Apple Watch), porque se integran entre sí. Apple suele actualizar sus iPhone durante muchos años.',
          'Android de gama alta: la serie Galaxy S de Samsung (con la versión Ultra como tope), los Motorola Edge y los Xiaomi tope de gama ofrecen más variedad de formatos, precios y personalización.',
          'Cambiar de sistema se puede, pero lleva trabajo (por ejemplo, migrar los chats de WhatsApp). Si estás conforme con el que usás, quedarte simplifica el cambio.',
        ],
      },
      {
        h: 'Qué mirar en un gama alta',
        p: [
          'Almacenamiento: la mayoría de los gama alta no tiene ranura microSD, así que no se puede ampliar. Si grabás video, 256 GB es un piso cómodo.',
          'Años de actualizaciones: los fabricantes anuncian cuántos años de actualizaciones de sistema y seguridad dan a sus tope de gama. Un equipo caro que se actualiza más tiempo te dura más; el dato está en la página oficial de cada modelo.',
          'Cámara: las versiones "Pro", "Pro Max" o "Ultra" suelen sumar teleobjetivo con más zoom óptico. Si casi no usás zoom, la versión base puede alcanzarte.',
          'Modelo anterior: cuando sale una generación nueva, la anterior muchas veces baja de precio y sigue recibiendo actualizaciones. Compará los dos antes de decidir.',
        ],
      },
      {
        h: 'Garantía, vendedor y versión',
        p: [
          'Comprá en la tienda oficial de la marca o en un distribuidor autorizado: los equipos importados por particulares a veces no tienen garantía oficial en Argentina.',
          'Revisá que la versión funcione con las bandas 4G/5G de tu compañía y si admite eSIM o dos chips.',
          'Desconfiá de precios muy por debajo del resto para el mismo modelo, sobre todo de vendedores sin reputación.',
        ],
      },
      {
        h: 'Cuotas sin interés: cómo hacer la cuenta',
        p: [
          'En un celular de varios millones, las cuotas sin interés pesan mucho: con inflación, las cuotas fijas de los últimos meses valen menos en términos reales.',
          'Compará el total en cuotas contra el precio en un pago: a veces el pago único trae un descuento extra que compensa. La calculadora de cuotas sin interés del sitio hace esa cuenta.',
          'Fijate qué tarjetas y bancos aplican: las cuotas sin interés suelen depender del medio de pago.',
        ],
      },
      {
        h: '¿Comprar ahora o esperar al Cyber Monday o al Black Friday?',
        p: [
          'El Cyber Monday 2026 en Argentina va del lunes 2 al miércoles 4 de noviembre (fechas de la CACE) y el Black Friday es a fines de noviembre. Los celulares están entre los productos más promocionados en esos eventos.',
          'Si no te urge, esperar puede convenir. Si lo necesitás ahora, mirá si el precio de hoy ya está cerca del mínimo que registramos: si lo está, esperar no garantiza un precio mejor.',
          'Ojo con los descuentos de cartel: anotá el precio de hoy del modelo que te interesa y compará el día del evento. En cazadordeofertas.com.ar cada oferta se muestra contra el precio más bajo que registramos.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Conviene más un iPhone o un Samsung Galaxy S?',
        a: 'Depende del ecosistema: si ya usás Mac, iPad o Apple Watch, el iPhone se integra mejor; si preferís Android, la serie Galaxy S es la alternativa natural. Compará precio, almacenamiento y garantía oficial del modelo puntual.',
      },
      {
        q: '¿Cuánto almacenamiento conviene en un gama alta?',
        a: 'La mayoría no tiene ranura microSD, así que no se puede ampliar. Si grabás video o sacás muchas fotos, 256 GB es un piso cómodo.',
      },
      {
        q: '¿Conviene esperar al Cyber Monday para comprar un celular caro?',
        a: 'Si no te urge, puede convenir: es de los rubros con más promociones. Pero compará el precio contra su historial: si hoy ya está cerca del mínimo registrado, esperar no garantiza un precio mejor.',
      },
      {
        q: '¿Las cuotas sin interés convienen para un celular de gama alta?',
        a: 'Con inflación, las cuotas fijas pierden valor real, así que suelen convenir. Compará igual el total en cuotas contra el precio en un pago, que a veces trae un descuento extra.',
      },
    ],
    enlaces: [
      { href: '/mejores/mejores-celulares-gama-alta', texto: 'Celulares de gama alta en oferta: comparativa de precios' },
      { href: '/calculadora-cuotas-sin-interes', texto: 'Calculadora de cuotas sin interés' },
      { href: '/guias/que-celular-comprar-segun-presupuesto', texto: 'Qué celular comprar según tu presupuesto (gama media y de entrada)' },
      { href: '/guias/que-celular-comprar-cyber-monday', texto: 'Qué celular comprar en el Cyber Monday 2026' },
    ],
    comparativa: 'mejores-celulares-gama-alta',
    cta: {
      href: '/mejores/mejores-celulares-gama-alta',
      titulo: 'Celulares de gama alta en oferta hoy, comparados contra su historial',
      boton: 'Ver celulares gama alta en oferta 📱',
    },
  },
  {
    slug: 'que-smart-tv-comprar',
    titulo: '¿Qué smart TV comprar? Pulgadas según la distancia, 4K y sistema operativo',
    descripcion:
      'Guía para elegir smart TV en Argentina: cuántas pulgadas según la distancia al sillón, cuándo conviene 4K, LED vs. QLED vs. OLED y Google TV, Tizen o webOS.',
    pregunta: '¿Qué smart TV me conviene comprar?',
    respuestaCorta:
      'Elegí el tamaño según la distancia al sillón: a 1,5 metros, unas 43 pulgadas; a 2 metros, 50 a 55; a 2,5 metros o más, 65. Desde 43 pulgadas conviene 4K. El sistema operativo (Google TV, Tizen de Samsung o webOS de LG) tiene que tener las apps que usás. QLED y OLED dan mejor imagen que un LED común, pero cuestan más.',
    secciones: [
      {
        h: 'Cuántas pulgadas según la distancia',
        p: [
          'A 1,5 metros: 43 pulgadas. A 2 metros: 50 a 55 pulgadas. A 2,5 metros o más: 65 pulgadas. Es una referencia orientativa para una imagen 4K.',
          'Medí el mueble o la pared: un TV de 55 pulgadas mide unos 1,22 m de diagonal de pantalla y un poco más de ancho con el marco. Si lo vas a colgar, fijate la norma VESA del soporte.',
        ],
      },
      {
        h: 'Resolución: HD, Full HD o 4K',
        p: [
          'En 32 pulgadas alcanza con HD o Full HD. Desde 43 pulgadas conviene 4K (3840 × 2160): la diferencia se nota y ya no cuesta mucho más.',
          'HDR mejora el brillo y el contraste en el contenido compatible, pero rinde más cuanto más brillo tiene el panel.',
        ],
      },
      {
        h: 'Panel: LED, QLED u OLED',
        p: [
          'LED común: el más barato y suficiente para la mayoría. QLED: colores más vivos y más brillo, bueno para livings luminosos. OLED: negros perfectos y el mejor contraste, ideal para ver películas a oscuras, pero el más caro.',
          'Si vas a jugar con consola de última generación, buscá HDMI 2.1 y 120 Hz; si no, no pagues de más por eso.',
        ],
      },
      {
        h: 'Sistema operativo',
        p: [
          'Google TV / Android TV (varias marcas), Tizen (Samsung) y webOS (LG) tienen las apps principales de streaming. Si usás una app puntual, confirmá que esté en la tienda de ese sistema.',
          'Los sistemas menos conocidos de algunas marcas económicas a veces reciben menos actualizaciones y tienen menos apps.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Cuántas pulgadas de TV necesito para 2 metros de distancia?',
        a: 'Entre 50 y 55 pulgadas. A 1,5 metros va bien uno de 43 y a 2,5 metros o más, uno de 65.',
      },
      {
        q: '¿Conviene 4K o Full HD?',
        a: 'Desde 43 pulgadas conviene 4K: se nota la diferencia y ya no cuesta mucho más. En 32 pulgadas alcanza con HD o Full HD.',
      },
      {
        q: '¿Qué es mejor, Google TV, Tizen o webOS?',
        a: 'Los tres tienen las apps de streaming principales. Google TV está en varias marcas; Tizen es de Samsung y webOS de LG. Elegí el que tenga las apps que usás.',
      },
      {
        q: '¿Qué diferencia hay entre LED, QLED y OLED?',
        a: 'LED es el más económico. QLED da más brillo y colores más vivos. OLED tiene negros perfectos y el mejor contraste, pero cuesta más.',
      },
    ],
    enlaces: [
      { href: '/mejores/mejores-smart-tv', texto: 'Smart TV en oferta: comparativa de precios' },
      { href: '/hoy', texto: 'Todas las ofertas verificadas de hoy' },
    ],
    comparativa: 'mejores-smart-tv',
    cta: {
      href: '/mejores/mejores-smart-tv',
      titulo: 'Smart TV en oferta hoy, comparados contra su historial',
      boton: 'Ver smart TV en oferta 📺',
    },
  },
  {
    slug: 'que-notebook-comprar-cyber-monday',
    titulo: 'Qué notebook comprar en el Cyber Monday 2026: guía rápida',
    descripcion:
      'Cómo elegir una notebook en el Cyber Monday 2026 de Argentina: procesador, RAM, SSD y pantalla según el uso, y cómo saber si el descuento es real.',
    pregunta: '¿Qué notebook conviene comprar en el Cyber Monday?',
    respuestaCorta:
      'Para estudiar o trabajar, una notebook con procesador Ryzen 5 o Core i5 (o superior), 8 GB de RAM como mínimo (mejor 16 GB) y disco SSD de 256 GB o más. Los modelos con Celeron, Intel N100 o 4 GB de RAM sirven solo para navegar y ofimática liviana. El Cyber Monday 2026 en Argentina va del lunes 2 al miércoles 4 de noviembre (fechas de la CACE). Antes de comprar, compará el precio contra el historial del modelo.',
    secciones: [
      {
        h: 'Según para qué la vas a usar',
        p: [
          'Navegar, videollamadas y ofimática: alcanza con un Ryzen 3 o Core i3 moderno, 8 GB de RAM y SSD. Evitá los 4 GB de RAM: con Windows 11 se quedan cortos enseguida.',
          'Estudio y trabajo con muchas pestañas o programas abiertos: Ryzen 5 o Core i5 o superior y 16 GB de RAM (o 8 GB ampliables).',
          'Diseño, edición o juegos: placa de video dedicada; en ese caso mirá las notebooks gamer.',
        ],
      },
      {
        h: 'Detalles que se pasan por alto',
        p: [
          'Pantalla: 15,6 pulgadas es lo más cómodo para trabajar; 14 pulgadas si la vas a llevar a todos lados. Preferí panel IPS: los TN se ven mal de costado.',
          'Teclado en español y garantía oficial en Argentina: los equipos importados a veces no traen ninguna de las dos.',
          'Mirá si la RAM se puede ampliar: una notebook con 8 GB ampliables puede durar varios años más.',
        ],
      },
      {
        h: 'Cómo aprovechar el Cyber Monday sin caer en descuentos inflados',
        p: [
          'Antes del evento anotá el precio de hoy del modelo que te interesa: si el lunes 2 aparece con un "40% OFF" pero cuesta lo mismo que ahora, el descuento es de cartel. En cazadordeofertas.com.ar cada oferta se compara contra el precio más bajo que registramos.',
          'Compará el precio final en cuotas sin interés contra el precio en un pago y sumá el envío. Si el modelo ya está en su mínimo registrado antes del evento, no hace falta esperar.',
        ],
      },
    ],
    cta: {
      href: '/mejores/cyber-monday-notebooks',
      titulo: 'Notebooks en el Cyber Monday 2026: precios verificados',
      boton: 'Ver notebooks en oferta 💻',
    },
  },
  {
    slug: 'que-smart-tv-comprar-cyber-monday',
    titulo: 'Qué smart TV comprar en el Cyber Monday 2026: tamaño, resolución y precio',
    descripcion:
      'Cómo elegir un smart TV en el Cyber Monday 2026 de Argentina: tamaño según la distancia, 4K o Full HD, tipo de panel y sistema operativo.',
    pregunta: '¿Qué smart TV conviene comprar en el Cyber Monday?',
    respuestaCorta:
      'Elegí el tamaño según la distancia al sillón (a unos 2 metros, 50 a 55 pulgadas), 4K a partir de 43 pulgadas y un sistema operativo que tenga las apps que usás (Google TV, Tizen o webOS). QLED y OLED dan mejor imagen que un LED común, pero cuestan más. El Cyber Monday 2026 en Argentina va del lunes 2 al miércoles 4 de noviembre (fechas de la CACE). Compará el precio contra el historial del modelo.',
    secciones: [
      {
        h: 'Tamaño y resolución',
        p: [
          'A 1,5 metros va bien uno de 43 pulgadas; a 2 metros, 50 a 55; a 2,5 metros o más, 65.',
          'En 32 pulgadas alcanza con HD o Full HD; desde 43 conviene 4K, que ya no cuesta mucho más.',
        ],
      },
      {
        h: 'Panel y sistema',
        p: [
          'LED común: el más barato. QLED: colores más vivos y más brillo. OLED: el mejor contraste, pero el más caro.',
          'Google TV, Tizen (Samsung) y webOS (LG) tienen las apps principales; los sistemas menos conocidos a veces reciben menos actualizaciones.',
          'Si vas a jugar con consola, buscá HDMI 2.1 y 120 Hz; si no, no pagues de más por eso.',
        ],
      },
      {
        h: 'Cómo aprovechar el Cyber Monday',
        p: [
          'Antes del evento anotá el precio de hoy del modelo que te interesa: si el lunes 2 aparece con un "40% OFF" pero cuesta lo mismo que ahora, el descuento es de cartel. En cazadordeofertas.com.ar cada oferta se compara contra el precio más bajo que registramos.',
          'En los televisores de 32 y 43 pulgadas es común ver porcentajes de descuento grandes: mirá siempre el mínimo registrado antes de comprar.',
        ],
      },
    ],
    cta: {
      href: '/mejores/cyber-monday-smart-tv',
      titulo: 'Smart TV en el Cyber Monday 2026: cuáles bajan de verdad',
      boton: 'Ver smart TV en oferta 📺',
    },
  },
  {
    slug: 'que-celular-comprar-cyber-monday',
    titulo: 'Qué celular comprar en el Cyber Monday 2026: guía por presupuesto',
    descripcion:
      'Cómo elegir un celular en el Cyber Monday 2026 de Argentina: memoria, batería, cámara y garantía, y cómo detectar descuentos inflados.',
    pregunta: '¿Qué celular conviene comprar en el Cyber Monday?',
    respuestaCorta:
      'Para la mayoría alcanza con 128 GB de almacenamiento, 6 a 8 GB de RAM y una batería de 5.000 mAh. Preferí equipos liberados con garantía oficial en Argentina y compará el mismo modelo en tiendas oficiales. El Cyber Monday 2026 en Argentina va del lunes 2 al miércoles 4 de noviembre (fechas de la CACE). Antes de comprar, mirá el precio contra el historial del modelo.',
    secciones: [
      {
        h: 'Qué mirar según el presupuesto',
        p: [
          'Gama de entrada: priorizá 128 GB y 4 a 6 GB de RAM; con 64 GB el espacio se llena enseguida con fotos y WhatsApp.',
          'Gama media: suele tener la mejor relación precio-calidad; buscá buena batería, pantalla AMOLED y actualizaciones de sistema por varios años.',
          'Gama alta: cámaras y rendimiento superiores; son de los más buscados en los eventos, así que compará bien el precio de referencia.',
        ],
      },
      {
        h: 'Garantía y vendedor',
        p: [
          'Comprá en tiendas oficiales o vendedores con reputación verde. Los equipos importados a veces no tienen garantía oficial en Argentina.',
          'Revisá que funcione con las bandas de tu compañía y si es dual SIM o admite eSIM.',
        ],
      },
      {
        h: 'Cómo aprovechar el Cyber Monday',
        p: [
          'Antes del evento anotá el precio de hoy del modelo que te interesa: si el lunes 2 aparece con un "40% OFF" pero cuesta lo mismo que ahora, el descuento es de cartel. En cazadordeofertas.com.ar cada oferta se compara contra el precio más bajo que registramos.',
          'Los combos con regalo (funda, auriculares, cargador) no siempre valen más: compará el precio del equipo solo.',
        ],
      },
    ],
    enlaces: [
      { href: '/guias/que-celular-gama-alta-comprar', texto: 'Qué celular de gama alta comprar: iPhone, Galaxy S, Edge y Xiaomi' },
    ],
    cta: {
      href: '/mejores/cyber-monday-celulares',
      titulo: 'Celulares en el Cyber Monday 2026: ofertas reales',
      boton: 'Ver celulares en oferta 📱',
    },
  },
  {
    slug: 'conviene-comprar-aire-acondicionado-cyber-monday',
    titulo: '¿Conviene comprar el aire acondicionado en el Cyber Monday 2026?',
    descripcion:
      'Si conviene comprar el aire acondicionado en el Cyber Monday 2026 de Argentina o esperar a diciembre, cuántas frigorías necesitás y qué sumar al presupuesto.',
    pregunta: '¿Conviene comprar el aire acondicionado en el Cyber Monday?',
    respuestaCorta:
      'Suele convenir: el Cyber Monday (2 al 4 de noviembre de 2026) cae antes del pico de demanda del verano, cuando se saturan los instaladores. Elegí las frigorías según el ambiente (m² × altura × 50), preferí inverter si lo vas a usar muchas horas y sumá la instalación al presupuesto. Compará el precio contra el historial del modelo.',
    secciones: [
      {
        h: 'Por qué noviembre es buen momento',
        p: [
          'En diciembre y enero sube la demanda de aires y los tiempos de instalación se alargan. Comprar en noviembre te da margen para conseguir instalador antes del calor.',
          'Aun así, no todos los descuentos del evento son reales: mirá el mínimo registrado del modelo.',
        ],
      },
      {
        h: 'Cuántas frigorías necesitás',
        p: [
          'Regla simple: volumen del ambiente (m² × altura) × 50. Un cuarto de 20 m² con 2,5 m de altura necesita unas 2.500 frigorías.',
          'Sumá un 10 a 20 % si el ambiente da al sol de la tarde, tiene mucho vidrio o es el último piso.',
        ],
      },
      {
        h: 'Qué sumar al presupuesto',
        p: [
          'La instalación casi nunca está incluida: pedí presupuesto antes de comprar.',
          'Inverter cuesta más al principio, pero consume menos si lo usás muchas horas por día. Buscá etiqueta de eficiencia A o superior.',
        ],
      },
    ],
    cta: {
      href: '/mejores/cyber-monday-aires-acondicionados',
      titulo: 'Aires acondicionados en el Cyber Monday 2026',
      boton: 'Ver aires en oferta ❄️',
    },
  },
  {
    slug: 'que-lavarropas-comprar-cyber-monday',
    titulo: 'Qué lavarropas comprar en el Cyber Monday 2026: capacidad, carga y consumo',
    descripcion:
      'Cómo elegir un lavarropas en el Cyber Monday 2026 de Argentina: capacidad según la familia, carga frontal o superior, inverter y medidas, y cómo saber si el descuento es real.',
    pregunta: '¿Qué lavarropas conviene comprar en el Cyber Monday?',
    respuestaCorta:
      'Elegí la capacidad según cuántos son en casa (6 a 7 kg para 2 o 3 personas, 8 kg o más para familias), carga frontal si querés gastar menos agua y lavar mejor, o carga superior si buscás precio y rapidez. El motor inverter suele ser más silencioso y eficiente. El Cyber Monday 2026 en Argentina va del lunes 2 al miércoles 4 de noviembre (fechas de la CACE). Compará el precio contra el historial del modelo.',
    secciones: [
      {
        h: 'Capacidad y tipo de carga',
        p: [
          'Capacidad: 6 a 7 kg alcanzan para 2 o 3 personas; con chicos o si lavás acolchados, 8 kg o más.',
          'Carga frontal: usa menos agua y cuida más la ropa, pero los ciclos son más largos. Carga superior: más barato y rápido, y podés agregar ropa en medio del lavado.',
          'Semiautomáticos: los más baratos, pero hay que pasar la ropa a mano al centrifugado.',
        ],
      },
      {
        h: 'Antes de comprar',
        p: [
          'Medí el lugar: ancho, profundidad y la puerta si es de carga frontal. Dejá unos centímetros atrás para las mangueras.',
          'Mirá las revoluciones de centrifugado (1.000 rpm o más secan mejor) y la etiqueta de eficiencia energética.',
          'Revisá si el envío incluye subirlo al piso y retirar el viejo, y la garantía oficial.',
        ],
      },
      {
        h: 'Cómo aprovechar el Cyber Monday',
        p: [
          'Antes del evento anotá el precio de hoy del modelo que te interesa: si el lunes 2 aparece con un "40% OFF" pero cuesta lo mismo que ahora, el descuento es de cartel. En cazadordeofertas.com.ar cada oferta se compara contra el precio más bajo que registramos.',
          'Muchas publicaciones de lavarropas incluyen lavavajillas o secarropas en los resultados: fijate que el modelo sea el que buscás antes de comparar precios.',
        ],
      },
    ],
    cta: {
      href: '/mejores/cyber-monday-lavarropas',
      titulo: 'Lavarropas en el Cyber Monday 2026: precios comparados',
      boton: 'Ver lavarropas en oferta 🧺',
    },
  },
  {
    slug: 'que-auriculares-comprar-cyber-monday',
    titulo: 'Qué auriculares comprar en el Cyber Monday 2026: inalámbricos, in-ear u over-ear',
    descripcion:
      'Cómo elegir auriculares en el Cyber Monday 2026 de Argentina: in-ear u over-ear, cancelación de ruido, batería y micrófono, y cómo evitar descuentos inflados.',
    pregunta: '¿Qué auriculares conviene comprar en el Cyber Monday?',
    respuestaCorta:
      'Para el día a día, unos inalámbricos in-ear (tipo TWS) son lo más práctico; para viajar o trabajar en lugares ruidosos, unos over-ear con cancelación de ruido activa (ANC). Mirá la autonomía de batería, que carguen por USB-C y la calidad del micrófono si hacés llamadas. El Cyber Monday 2026 en Argentina va del lunes 2 al miércoles 4 de noviembre (fechas de la CACE). Compará el precio contra el historial del modelo.',
    secciones: [
      {
        h: 'In-ear u over-ear',
        p: [
          'In-ear (dentro del oído): chicos, livianos y cómodos para salir o entrenar. Probá que traigan varias medidas de gomitas.',
          'Over-ear (vincha que cubre la oreja): más cómodos para muchas horas, mejor sonido y mejor cancelación de ruido, pero ocupan más.',
          'Para jugar en la compu, unos con cable o con receptor USB tienen menos demora que los Bluetooth.',
        ],
      },
      {
        h: 'Qué mirar en la ficha',
        p: [
          'Cancelación de ruido activa (ANC): vale la pena si viajás en transporte público o trabajás en lugares ruidosos.',
          'Batería: fijate las horas con ANC encendido, que suelen ser menos que las que anuncian sin ANC.',
          'Micrófono y conexión multipunto si los usás para llamadas desde el celular y la compu.',
        ],
      },
      {
        h: 'Cómo aprovechar el Cyber Monday',
        p: [
          'Antes del evento anotá el precio de hoy del modelo que te interesa: si el lunes 2 aparece con un "40% OFF" pero cuesta lo mismo que ahora, el descuento es de cartel. En cazadordeofertas.com.ar cada oferta se compara contra el precio más bajo que registramos.',
          'Desconfiá de marcas conocidas a un precio muy por debajo del habitual en vendedores sin reputación: preferí tiendas oficiales.',
        ],
      },
    ],
    cta: {
      href: '/mejores/cyber-monday-auriculares',
      titulo: 'Auriculares en el Cyber Monday 2026: ofertas verificadas',
      boton: 'Ver auriculares en oferta 🎧',
    },
  },
  {
    slug: 'que-silla-gamer-comprar',
    titulo: '¿Qué silla gamer comprar? Peso y altura que soporta, tela o cuero sintético, reclinación y apoyabrazos',
    descripcion:
      'Cómo elegir una silla gamer en Argentina: peso máximo y altura recomendada, tela o cuero sintético (PU), reclinación, apoyabrazos 2D/3D/4D, base, ruedas y pistón, y qué mirar en el precio.',
    pregunta: '¿Qué silla gamer me conviene comprar?',
    respuestaCorta:
      'Empezá por tu cuerpo: elegí una silla cuyo peso máximo declarado te quede con margen y cuya altura recomendada te incluya. Después el material: la tela respira mejor en verano y el cuero sintético (PU) se limpia más fácil pero da más calor y con los años se puede descascarar. Para jugar o trabajar muchas horas importan el apoyo lumbar, la altura regulable y los apoyabrazos ajustables (3D o 4D) más que las luces o el diseño. Antes de pagar, chequeá en el historial que el descuento sea real.',
    secciones: [
      {
        h: 'Peso máximo y altura: lo primero que hay que mirar',
        p: [
          'Cada silla declara un peso máximo en la publicación o en la ficha técnica. Elegí una que te quede con margen por encima de tu peso: una silla trabajando al límite se gasta antes, sobre todo el pistón y la base.',
          'La altura también cuenta. Si sos muy alto o muy bajo, revisá la altura del respaldo y el rango de regulación del asiento: tenés que poder apoyar los pies en el piso con las rodillas a unos 90 grados, y el respaldo tiene que llegarte por lo menos a los hombros.',
        ],
      },
      {
        h: 'Tela o cuero sintético',
        p: [
          'Cuero sintético (PU o ecocuero): es el más común en sillas gamer, se limpia con un paño y se ve bien de nueva. Contras: da calor en verano y, con los años y el uso, puede cuartearse o descascararse.',
          'Tela o malla: respira mejor, así que es más cómoda en los meses de calor, y no se descascara. Contras: absorbe manchas y cuesta más limpiarla. Si en tu casa hace mucho calor o pasás muchas horas sentado, la tela suele ser la opción más cómoda.',
        ],
      },
      {
        h: 'Ergonomía: lumbar, cabezal y reclinación',
        p: [
          'Apoyo lumbar: la mayoría trae almohadón lumbar y cervical sueltos. Algunas tienen soporte lumbar integrado y regulable, que no se mueve de lugar. Si pasás muchas horas sentado, es lo que más se nota en la espalda.',
          'Reclinación: muchas sillas gamer reclinan el respaldo bastante más que una silla de oficina común y tienen función de balanceo (mecedora) con traba. Fijate el rango de grados que declara la publicación y que se pueda trabar en varias posiciones, no solo en vertical y acostado.',
        ],
      },
      {
        h: 'Apoyabrazos 2D, 3D o 4D',
        p: [
          'Los apoyabrazos fijos o 1D solo suben y bajan, o ni eso. Los 2D suman algún movimiento extra (según la marca, hacia adelante y atrás o hacia los costados); los 3D agregan otra dirección y los 4D además giran. No todas las marcas usan los mismos nombres, así que leé qué movimientos tiene realmente.',
          'Para jugar con teclado y mouse o trabajar, unos apoyabrazos que se ajusten a la altura del escritorio evitan cargar hombros y muñecas. Si la silla va a quedar bajo un escritorio, chequeá que los apoyabrazos bajen lo suficiente para que entre.',
        ],
      },
      {
        h: 'Base, ruedas y pistón',
        p: [
          'La base de metal (aluminio o acero) aguanta más que la de plástico. El pistón a gas es lo que sube y baja la silla: si la publicación menciona su clase o certificación, mejor; si es el primer componente en fallar, se puede reemplazar.',
          'Las ruedas comunes de nylon pueden rayar pisos de madera o flotantes; ahí conviene una alfombra protectora o ruedas de goma (PU).',
        ],
      },
      {
        h: 'Rangos de precio y cómo no pagar de más',
        p: [
          'Las sillas más baratas suelen tener base de plástico, apoyabrazos fijos y cuero sintético básico. A medida que sube el precio aparecen la base metálica, los apoyabrazos 3D/4D, el soporte lumbar regulable y las marcas con garantía oficial en Argentina. Como los precios cambian todo el tiempo, compará las sillas que están en oferta hoy en la tabla de la comparativa, con el precio más bajo que registramos para cada una.',
          'Preferí tiendas oficiales o vendedores con buena reputación, revisá la garantía y si llega armada o hay que armarla. Y fijate que el descuento sea real: comparamos el precio contra el historial y marcamos las que están en su mínimo registrado.',
        ],
      },
    ],
    categoria: { slug: 'gamer', nombre: 'productos gamer' },
    comparativa: 'mejores-sillas-gamer',
    cta: {
      href: '/mejores/mejores-sillas-gamer',
      titulo: 'Las sillas gamer en oferta hoy, comparadas',
      boton: 'Ver la comparativa de sillas 🪑',
    },
    faq: [
      {
        q: '¿Es mejor una silla gamer de tela o de cuero sintético?',
        a: 'Depende del calor y del uso. La tela respira mejor y no se descascara; el cuero sintético se limpia más fácil pero da calor en verano y con los años se puede cuartear. Para muchas horas en una casa calurosa, conviene tela.',
      },
      {
        q: '¿Qué son los apoyabrazos 4D?',
        a: 'Son apoyabrazos que se ajustan en cuatro movimientos: altura, adelante-atrás, hacia los costados y giro. Los 2D y 3D tienen menos ajustes. Como cada marca usa los nombres a su manera, leé en la publicación qué movimientos tiene.',
      },
      {
        q: '¿Cuánto peso aguanta una silla gamer?',
        a: 'Lo declara cada fabricante en la publicación o la ficha técnica. Elegí una que te deje margen por encima de tu peso para que el pistón y la base no trabajen al límite.',
      },
      {
        q: '¿Silla gamer o silla ergonómica de oficina?',
        a: 'Para muchas horas, lo que importa es el ajuste: altura regulable, apoyo lumbar y apoyabrazos ajustables. Una silla gamer con esas regulaciones sirve igual que una de oficina; una con solo diseño y luces, no.',
      },
    ],
    enlaces: [
      { href: '/mejores/mejores-sillas-gamer', texto: 'Comparativa de sillas gamer' },
      { href: '/mejores/mejores-monitores-gamer', texto: 'Comparativa de monitores gamer' },
      { href: '/gamer', texto: 'Ofertas gamer 🎮' },
      { href: '/hoy', texto: 'Ofertas de hoy' },
    ],
  },
  {
    slug: 'que-termotanque-comprar',
    titulo: '¿Qué termotanque comprar? Litros, gas o eléctrico y recuperación',
    descripcion:
      'Cómo elegir un termotanque en Argentina: cuántos litros según cuántos viven, gas natural, envasado o eléctrico, recuperación por hora, instalación y consumo.',
    pregunta: '¿Qué termotanque conviene comprar?',
    respuestaCorta:
      'Como referencia, elegí unos 50 litros para 1 o 2 personas, 80 litros para 3 o 4 y 120 litros o más para familias grandes o si se bañan varios seguidos. Si tenés gas natural, el termotanque a gas suele salir más barato de usar y recupera más rápido; el eléctrico no necesita salida de gases y se instala en más lugares, pero gasta más luz. Mirá la recuperación en litros por hora y la etiqueta de eficiencia energética, y hacé instalar el de gas por un gasista matriculado.',
    secciones: [
      {
        h: 'Cuántos litros según cuántos viven',
        p: [
          'La capacidad depende de cuánta agua caliente usan seguido, no solo de cuántos son. Como referencia: 50 litros para 1 o 2 personas, 80 litros para 3 o 4, y 120 litros o más si son 5 o más o se duchan uno atrás del otro.',
          'Si te quedás corto, el agua se enfría en la segunda o tercera ducha. Si te pasás, gastás más manteniendo caliente agua que no usás.',
        ],
      },
      {
        h: 'Gas o eléctrico',
        p: [
          'A gas (natural o envasado): con gas natural suele ser lo más barato de usar y recupera más rápido. Necesita salida de gases al exterior y ventilación según la normativa, y lo tiene que instalar un gasista matriculado. Confirmá que el modelo sea para tu tipo de gas.',
          'Eléctrico: no necesita salida de gases, así que entra en departamentos o lugares sin conexión de gas. Suele gastar más energía; podés estimar el costo por mes en la calculadora de consumo eléctrico con la potencia del modelo.',
          'Si vas a cambiar de gas a eléctrico o al revés, sumá al presupuesto la instalación nueva.',
        ],
      },
      {
        h: 'Recuperación, eficiencia y medidas',
        p: [
          'Recuperación (litros por hora): cuántos litros calienta en una hora. Cuanto más alta, menos esperás entre una ducha y otra.',
          'Etiqueta de eficiencia energética: es obligatoria en Argentina para estos equipos (Secretaría de Energía, normas IRAM). Compará la clase entre modelos del mismo tamaño.',
          'Medí el lugar: alto, diámetro y si va de pie o colgado. Revisá la garantía del tanque y que haya service oficial en tu zona.',
        ],
      },
      {
        h: 'Cuánto sale',
        p: [
          'Es un equipo de ticket alto y el precio cambia mucho según litros, tipo y marca. No damos un precio fijo: en la comparativa de termotanques están los que están en oferta hoy, con el precio actual y el mínimo que registramos para cada uno.',
        ],
      },
    ],
    categoria: { slug: 'termotanques', nombre: 'termotanques' },
    comparativa: 'mejores-termotanques',
    cta: { href: '/mejores/mejores-termotanques', titulo: 'Termotanques en oferta hoy, comparados', boton: 'Ver la comparativa de termotanques 🚿' },
    faq: [
      {
        q: '¿De cuántos litros tiene que ser el termotanque?',
        a: 'Como referencia, 50 litros para 1 o 2 personas, 80 litros para 3 o 4 y 120 litros o más para familias grandes o si se bañan varios seguidos.',
      },
      {
        q: '¿Qué conviene, termotanque a gas o eléctrico?',
        a: 'Con gas natural, el de gas suele ser más barato de usar y recupera más rápido. El eléctrico conviene donde no hay gas o no se puede hacer salida de gases, aunque gasta más luz.',
      },
      {
        q: '¿Qué es la recuperación de un termotanque?',
        a: 'Son los litros de agua que calienta por hora. Cuanto más alta, menos tiempo esperás para tener agua caliente de nuevo.',
      },
      {
        q: '¿Puedo instalar el termotanque yo mismo?',
        a: 'El de gas lo tiene que instalar un gasista matriculado, con la salida de gases y la ventilación que pide la normativa. El eléctrico necesita una instalación eléctrica adecuada a su potencia.',
      },
    ],
    enlaces: [
      { href: '/mejores/mejores-termotanques', texto: 'Comparativa de termotanques' },
      { href: '/calculadora-consumo-electrico', texto: 'Calculadora de consumo ⚡' },
      { href: '/guias/que-heladera-comprar', texto: 'Qué heladera comprar' },
      { href: '/hoy', texto: 'Ofertas de hoy' },
    ],
    fuentes: [
      { texto: 'Secretaría de Energía de la Nación: eficiencia energética y etiquetado', url: 'https://www.argentina.gob.ar/economia/energia/eficiencia-energetica' },
      { texto: 'ENARGAS: instalaciones de gas y gasistas matriculados', url: 'https://www.enargas.gob.ar/' },
    ],
  },
  {
    slug: 'que-tablet-comprar',
    titulo: '¿Qué tablet comprar? Pantalla, RAM, memoria y para qué la vas a usar',
    descripcion:
      'Cómo elegir una tablet en Argentina: tamaño de pantalla, RAM y almacenamiento, Android o iPad, chip LTE, lápiz y qué conviene para estudiar, leer, ver series o para chicos.',
    pregunta: '¿Qué tablet conviene comprar?',
    respuestaCorta:
      'Elegí primero para qué la vas a usar: para leer y llevar alcanza una de 8 pulgadas; para series, clases o trabajar conviene una de 10 u 11 pulgadas. Buscá como mínimo 4 GB de RAM y 64 GB de almacenamiento, y mejor 8 GB y 128 GB si la vas a usar para estudiar, dibujar o con muchas apps. Fijate si acepta microSD, si tiene versión con chip (LTE) y cuántos años de actualizaciones da el fabricante.',
    secciones: [
      {
        h: 'Tamaño de pantalla según el uso',
        p: [
          '8 pulgadas: liviana y fácil de llevar; sirve para leer, redes y videos cortos.',
          '10 u 11 pulgadas: la más versátil para series, clases virtuales, videollamadas y trabajar con teclado.',
          '12 pulgadas o más: para dibujar, editar o reemplazar una notebook liviana; es más cara y pesa más.',
        ],
      },
      {
        h: 'RAM, almacenamiento y actualizaciones',
        p: [
          'RAM: 4 GB como piso para que no se trabe; 8 GB si usás varias apps a la vez o la querés para estudiar o trabajar.',
          'Almacenamiento: 64 GB como mínimo; 128 GB si guardás fotos, series descargadas o juegos. Revisá si acepta tarjeta microSD para ampliar.',
          'Actualizaciones: los años de actualizaciones de sistema y seguridad que promete el fabricante dicen cuánto te va a durar. Las tablets muy baratas de marcas sin respaldo suelen quedarse sin actualizaciones rápido.',
        ],
      },
      {
        h: 'Android o iPad, chip y accesorios',
        p: [
          'Android: hay de todos los precios y la mayoría acepta microSD. iPad: suele durar más años con actualizaciones, pero no acepta microSD y es más cara en Argentina.',
          'Wi-Fi o LTE: la versión con chip te deja usarla fuera de casa sin compartir datos del celular, y cuesta más.',
          'Lápiz y teclado: si los vas a usar, confirmá que el modelo sea compatible y si vienen incluidos o se compran aparte.',
          'Para chicos: una funda resistente, control parental y buena batería importan más que el procesador.',
        ],
      },
      {
        h: 'Cuánto sale',
        p: [
          'El precio cambia mucho entre marcas, tamaños y memorias, y entre semanas. No damos un precio fijo: en la comparativa de tablets tenés las que están en oferta hoy, con el precio actual y el mínimo que registramos para cada una. Preferí tienda oficial o vendedor con garantía en Argentina.',
        ],
      },
    ],
    comparativa: 'mejores-tablets',
    cta: { href: '/mejores/mejores-tablets', titulo: 'Tablets en oferta hoy, comparadas', boton: 'Ver la comparativa de tablets 📱' },
    faq: [
      {
        q: '¿Cuánta RAM tiene que tener una tablet?',
        a: '4 GB como mínimo para un uso básico; 8 GB si la vas a usar para estudiar, trabajar o con varias apps abiertas a la vez.',
      },
      {
        q: '¿Qué tamaño de tablet conviene?',
        a: '8 pulgadas para leer y llevar; 10 u 11 pulgadas para series, clases y trabajar; 12 pulgadas o más para dibujar o reemplazar una notebook liviana.',
      },
      {
        q: '¿Conviene una tablet con chip (LTE)?',
        a: 'Solo si la vas a usar seguido fuera de casa sin Wi-Fi. Si no, la versión Wi-Fi es más barata y podés compartir datos desde el celular.',
      },
      {
        q: '¿Qué tablet le compro a un chico?',
        a: 'Una con buena batería, funda resistente y control parental. No hace falta la más potente; sí que tenga garantía y actualizaciones.',
      },
    ],
    enlaces: [
      { href: '/mejores/mejores-tablets', texto: 'Comparativa de tablets' },
      { href: '/guias/que-notebook-comprar', texto: 'Qué notebook comprar' },
      { href: '/guias/que-regalar-el-dia-de-la-madre', texto: 'Qué regalar el Día de la Madre' },
      { href: '/hoy', texto: 'Ofertas de hoy' },
    ],
  },
  {
    slug: 'que-cafetera-comprar',
    titulo: '¿Qué cafetera comprar? Espresso, cápsulas o de filtro',
    descripcion:
      'Cómo elegir una cafetera en Argentina: de filtro, espresso o de cápsulas, presión, vaporizador para leche, molinillo, costo por taza y limpieza.',
    pregunta: '¿Qué cafetera conviene comprar?',
    respuestaCorta:
      'Depende de cómo tomás el café: una de filtro si hacés varias tazas juntas y te gusta el café suave; una espresso si te gusta concentrado o con leche espumada (fijate que traiga vaporizador); una de cápsulas si priorizás rapidez y limpieza, sabiendo que cada taza sale más cara. Antes de comprar, mirá que el depósito de agua y la bandeja se saquen fácil y que consigas el café o las cápsulas que usa.',
    secciones: [
      {
        h: 'Filtro, espresso o cápsulas',
        p: [
          'De filtro (goteo): hace varias tazas juntas y es la más simple y barata de usar. Café más suave; ideal para la oficina o si toman varios en casa.',
          'Espresso: café concentrado, base para cortado, latte o capuchino. Si te gusta con leche, buscá que traiga vaporizador (lanza de vapor). Pide café molido fino o en grano si tiene molinillo integrado.',
          'De cápsulas: la más rápida y la que menos se ensucia. La máquina suele costar menos, pero cada taza sale más cara; confirmá que consigas cápsulas originales o compatibles en Argentina.',
        ],
      },
      {
        h: 'Qué mirar en una espresso',
        p: [
          'Presión: la mayoría de las hogareñas indica 15 a 20 bares; más bares no siempre es mejor café, importa que la temperatura sea estable.',
          'Vaporizador: si tomás café con leche, es lo que más vas a usar.',
          'Molinillo integrado: las superautomáticas muelen el grano en el momento; son más caras y ocupan más lugar. Si no tiene, podés comprar café ya molido para espresso.',
          'Portafiltro presurizado o no: el presurizado perdona más si el molido no es perfecto; es lo más cómodo para empezar.',
        ],
      },
      {
        h: 'Limpieza, tamaño y garantía',
        p: [
          'Que el depósito de agua y la bandeja de goteo se saquen fácil: la limpieza diaria es lo que más se usa. Las espresso necesitan descalcificar cada tanto según el agua de tu zona.',
          'Medí el lugar en la mesada, sobre todo en altura si vas a usar tazas grandes. Preferí tienda oficial o vendedor con garantía y service en Argentina.',
        ],
      },
      {
        h: 'Cuánto sale',
        p: [
          'Hay de todos los precios: las de filtro son las más baratas y las superautomáticas son de ticket alto. No damos un precio fijo: en la comparativa de cafeteras tenés las que están en oferta hoy, con el precio actual y el mínimo que registramos para cada una.',
        ],
      },
    ],
    categoria: { slug: 'electro-de-cocina', nombre: 'electro de cocina' },
    comparativa: 'mejores-cafeteras',
    cta: { href: '/mejores/mejores-cafeteras', titulo: 'Cafeteras en oferta hoy, comparadas', boton: 'Ver la comparativa de cafeteras ☕' },
    faq: [
      {
        q: '¿Qué es mejor, cafetera de cápsulas o espresso?',
        a: 'La de cápsulas es más rápida y limpia, pero cada taza sale más cara. La espresso da más control y el café por taza es más barato, a cambio de más limpieza.',
      },
      {
        q: '¿Cuántos bares tiene que tener una cafetera espresso?',
        a: 'Las hogareñas suelen indicar 15 a 20 bares, y alcanza. Más bares no garantiza mejor café: importa más la estabilidad de la temperatura y el molido.',
      },
      {
        q: '¿Conviene una cafetera con molinillo?',
        a: 'Si tomás mucho café y querés el mejor sabor, sí: muele en el momento. Es más cara y ocupa más lugar; si no, alcanza con café ya molido para espresso.',
      },
      {
        q: '¿Qué cafetera regalar el Día de la Madre?',
        a: 'Pensá en cómo toma el café: de cápsulas si quiere algo práctico, espresso con vaporizador si le gusta el café con leche, de filtro si hacen varias tazas juntas.',
      },
    ],
    enlaces: [
      { href: '/mejores/mejores-cafeteras', texto: 'Comparativa de cafeteras' },
      { href: '/guias/que-regalar-el-dia-de-la-madre', texto: 'Qué regalar el Día de la Madre' },
      { href: '/guias/que-freidora-de-aire-comprar', texto: 'Qué freidora de aire comprar' },
      { href: '/hoy', texto: 'Ofertas de hoy' },
    ],
  },
  {
    slug: 'que-cocina-comprar',
    titulo: '¿Qué cocina comprar? Gas natural, envasado, multigas o eléctrica',
    descripcion:
      'Cómo elegir una cocina en Argentina: a gas, multigas o eléctrica, medidas del hueco, horno con visor y luz, válvula de seguridad, encendido y instalación por gasista matriculado.',
    pregunta: '¿Qué cocina conviene comprar?',
    respuestaCorta:
      'Primero fijate qué gas tenés: si es gas natural o garrafa (envasado), elegí una cocina para ese gas o una multigas que traiga los picos para los dos. Si no tenés gas, la opción es una cocina o anafe eléctrico o de inducción, con una instalación eléctrica que aguante su potencia. Medí el hueco (la mayoría mide entre 50 y 56 cm de ancho), buscá válvula de seguridad en hornallas y horno, y hacé la conexión de gas con un gasista matriculado.',
    secciones: [
      {
        h: 'Gas natural, envasado, multigas o eléctrica',
        p: [
          'Gas natural o envasado: cada tipo de gas usa picos (inyectores) distintos. Comprá la cocina para el gas que tenés en casa o confirmá que el cambio de picos lo haga un gasista.',
          'Multigas: viene preparada para gas natural y envasado, y trae los picos para convertirla. Conviene si hoy usás garrafa y pensás conectarte a la red, o si te mudás seguido.',
          'Eléctrica o de inducción: no necesita conexión de gas, pero consume bastante potencia. Revisá que la instalación eléctrica y la térmica de tu casa la soporten; la de inducción además pide ollas aptas (con base magnética).',
        ],
      },
      {
        h: 'Medidas y horno',
        p: [
          'Medí el ancho, alto y profundidad del hueco antes de comprar: la mayoría de las cocinas mide entre 50 y 56 cm de ancho, y hay modelos más anchos con más hornallas.',
          'Horno: con visor (puerta de vidrio) y luz podés ver la comida sin abrir y perder calor. Fijate la capacidad en litros, si trae grill y cuántas posiciones de bandeja tiene.',
          'Si solo querés hornear o te falta lugar, un horno eléctrico de mesada puede complementar o reemplazar el horno de la cocina.',
        ],
      },
      {
        h: 'Seguridad e instalación',
        p: [
          'Válvula de seguridad: corta el gas si la llama se apaga. Buscá que la tengan las hornallas y el horno, no solo uno de los dos.',
          'Encendido electrónico: evita usar fósforos o encendedor y es más cómodo, pero necesita un enchufe cerca.',
          'La conexión de gas la tiene que hacer un gasista matriculado, con la ventilación que pide la normativa del ENARGAS. No la conectes por tu cuenta: una pérdida de gas o una mala combustión pueden generar monóxido de carbono.',
        ],
      },
      {
        h: 'Cuánto sale',
        p: [
          'El precio cambia mucho según tipo de gas, tamaño, horno y marca. No damos un precio fijo: en la comparativa de cocinas y hornos tenés los que están en oferta hoy, con el precio actual y el mínimo que registramos para cada uno. Sumá al presupuesto la instalación del gasista.',
        ],
      },
    ],
    categoria: { slug: 'cocinas-y-hornos', nombre: 'cocinas y hornos' },
    comparativa: 'mejores-cocinas-y-hornos',
    cta: { href: '/mejores/mejores-cocinas-y-hornos', titulo: 'Cocinas y hornos en oferta hoy, comparados', boton: 'Ver la comparativa de cocinas y hornos 🍳' },
    faq: [
      {
        q: '¿Qué es una cocina multigas?',
        a: 'Es una cocina que funciona con gas natural y con gas envasado (garrafa). Trae los picos para cambiar de un gas a otro; el cambio lo tiene que hacer un gasista matriculado.',
      },
      {
        q: '¿Puedo usar una cocina de gas natural con garrafa?',
        a: 'No sin cambiar los picos (inyectores), porque cada gas necesita uno distinto. Si la cocina es multigas trae los picos; si no, consultá con un gasista matriculado.',
      },
      {
        q: '¿Qué medida tiene una cocina estándar?',
        a: 'La mayoría mide entre 50 y 56 cm de ancho, pero varía según el modelo. Medí el hueco (ancho, alto y profundidad) antes de comprar.',
      },
      {
        q: '¿Puedo instalar la cocina yo mismo?',
        a: 'La conexión de gas la tiene que hacer un gasista matriculado, con la ventilación que pide la normativa. Una cocina eléctrica necesita una instalación adecuada a su potencia.',
      },
    ],
    enlaces: [
      { href: '/mejores/mejores-cocinas-y-hornos', texto: 'Comparativa de cocinas y hornos' },
      { href: '/guias/que-termotanque-comprar', texto: 'Qué termotanque comprar' },
      { href: '/hoy', texto: 'Ofertas de hoy' },
    ],
    fuentes: [
      { texto: 'ENARGAS: instalaciones de gas y gasistas matriculados', url: 'https://www.enargas.gob.ar/' },
      { texto: 'Secretaría de Energía de la Nación: eficiencia energética', url: 'https://www.argentina.gob.ar/economia/energia/eficiencia-energetica' },
    ],
  },
  {
    slug: 'que-monitor-comprar',
    titulo: '¿Qué monitor comprar? Pulgadas, resolución, panel y Hz para trabajar o jugar',
    descripcion:
      'Cómo elegir un monitor en Argentina para trabajo, estudio o gamer: pulgadas y resolución, panel IPS, VA o TN, Hz y tiempo de respuesta, conexiones HDMI, DisplayPort y USB-C, y ergonomía.',
    pregunta: '¿Qué monitor conviene comprar?',
    respuestaCorta:
      'Para trabajar o estudiar, un monitor de 24 pulgadas Full HD con panel IPS alcanza y cuida la vista; si vas a 27 pulgadas, conviene resolución 2K (QHD). Para jugar, buscá 144 Hz o más y tiempo de respuesta bajo, y fijate que tu placa de video llegue a esos cuadros. Antes de comprar, revisá que tenga las entradas que usa tu PC o notebook (HDMI, DisplayPort o USB-C) y si el pie permite regular la altura.',
    secciones: [
      {
        h: 'Pulgadas y resolución',
        p: [
          '22 a 24 pulgadas: Full HD (1920x1080) se ve bien y es lo más común para oficina, estudio y juegos competitivos.',
          '27 pulgadas: conviene 2K (QHD, 2560x1440); en Full HD a ese tamaño se nota el "pixelado" de cerca.',
          '32 pulgadas o más, o ultrawide: para edición, planillas grandes o simuladores; 4K pide una PC más potente si es para jugar.',
        ],
      },
      {
        h: 'Panel IPS, VA o TN',
        p: [
          'IPS: los mejores colores y ángulos de visión; el más recomendable para trabajar, diseñar y para la mayoría de los gamers.',
          'VA: mejor contraste (negros más profundos), bueno para películas y juegos con escenas oscuras; algunos dejan estela en movimientos rápidos.',
          'TN: el más rápido y barato, pero con colores y ángulos peores; hoy tiene sentido solo para juego competitivo con poco presupuesto.',
        ],
      },
      {
        h: 'Hz y tiempo de respuesta (gamer)',
        p: [
          '60 o 75 Hz alcanzan para trabajar y estudiar. Para jugar, 144 Hz o más se nota mucho en fluidez.',
          'Los Hz sirven solo si tu PC o consola llega a esos cuadros por segundo: revisá tu placa de video antes de pagar por 240 Hz.',
          'Tiempo de respuesta: 1 ms (MPRT o GtG) es lo habitual en gamers; ojo que las marcas miden distinto. FreeSync o G-Sync evitan cortes en la imagen.',
        ],
      },
      {
        h: 'Conexiones, ergonomía y cuánto sale',
        p: [
          'Conexiones: HDMI es lo universal; DisplayPort suele hacer falta para los Hz altos en PC; USB-C con video (y carga) es cómodo para notebooks con un solo cable. Fijate qué cable viene en la caja.',
          'Ergonomía: un pie con altura e inclinación regulables o compatibilidad VESA para brazo ayuda a la postura si pasás muchas horas. Modo de luz azul baja y sin parpadeo (flicker free) cuidan la vista.',
          'Precio: cambia mucho entre tamaños, paneles y Hz, y entre semanas. No damos un precio fijo: en la comparativa de monitores tenés los que están en oferta hoy, con el precio actual y el mínimo que registramos para cada uno.',
        ],
      },
    ],
    categoria: { slug: 'monitores', nombre: 'monitores' },
    comparativa: 'mejores-monitores',
    cta: { href: '/mejores/mejores-monitores', titulo: 'Monitores en oferta hoy, comparados', boton: 'Ver la comparativa de monitores 🖥️' },
    faq: [
      {
        q: '¿Qué monitor conviene para trabajar o estudiar?',
        a: 'Uno de 24 pulgadas Full HD con panel IPS y pie regulable alcanza. Si querés más espacio, uno de 27 pulgadas con resolución 2K.',
      },
      {
        q: '¿Cuántos Hz tiene que tener un monitor gamer?',
        a: '144 Hz o más es el estándar para jugar fluido. Más Hz solo sirven si tu placa de video o consola llega a esos cuadros por segundo.',
      },
      {
        q: '¿Qué es mejor, panel IPS o VA?',
        a: 'IPS tiene mejores colores y ángulos de visión; VA tiene mejor contraste y negros más profundos. Para uso general y gamer, IPS suele ser la opción más equilibrada.',
      },
      {
        q: '¿Necesito DisplayPort o alcanza con HDMI?',
        a: 'Para oficina alcanza con HDMI. Para Hz altos en PC muchas veces hace falta DisplayPort; revisá qué soportan tu placa de video y el monitor.',
      },
    ],
    enlaces: [
      { href: '/mejores/mejores-monitores', texto: 'Comparativa de monitores' },
      { href: '/mejores/mejores-monitores-gamer', texto: 'Comparativa de monitores gamer' },
      { href: '/guias/que-notebook-comprar', texto: 'Qué notebook comprar' },
      { href: '/hoy', texto: 'Ofertas de hoy' },
    ],
  },
  {
    slug: 'que-aspiradora-comprar',
    titulo: '¿Qué aspiradora comprar? De arrastre, vertical, robot o de mano',
    descripcion:
      'Cómo elegir una aspiradora en Argentina: de arrastre, vertical inalámbrica, robot o de mano; potencia y succión, filtro HEPA, batería, mascotas, tipo de piso, ruido y mantenimiento.',
    pregunta: '¿Qué aspiradora conviene comprar?',
    respuestaCorta:
      'Si tenés alfombras o una casa grande, la de arrastre con cable da la succión más pareja y no depende de una batería. Para pasadas rápidas en departamento, una vertical inalámbrica es lo más práctico: mirá la autonomía en minutos y si la batería se puede cambiar. Un robot aspiradora sirve para el mantenimiento diario sin esfuerzo, mejor si tiene mapeo. Con mascotas buscá cepillo antienredos y, si hay alergias, filtro HEPA.',
    secciones: [
      {
        h: 'Qué tipo de aspiradora te conviene',
        p: [
          'De arrastre (con cable): la clásica con cuerpo y manguera. Suele tener más succión sostenida y más capacidad de depósito; conviene para casas grandes, alfombras y limpiezas a fondo. Es más pesada y ocupa más lugar.',
          'Vertical o escoba inalámbrica: liviana, se guarda parada y muchas se convierten en aspiradora de mano. Ideal para departamentos y pasadas diarias. La limita la batería.',
          'Robot aspiradora: limpia solo mientras no estás. No reemplaza una limpieza a fondo, pero mantiene el piso. Los que tienen mapeo recorren ordenado; los de navegación aleatoria tardan más y dejan zonas. Algunos también pasan el trapo.',
          'De mano: chica, para el auto, el sillón, migas o pelos puntuales. Es un complemento, no la aspiradora principal.',
        ],
      },
      {
        h: 'Potencia, succión, filtro y batería',
        p: [
          'La potencia en watts indica cuánto consume el motor, no exactamente cuánto aspira. Si el fabricante informa la succión (en Pa o en AW), es un dato más útil para comparar modelos del mismo tipo. A mayor succión, mejor rinde en alfombras.',
          'Filtro HEPA: retiene partículas finas como polvo y polen; conviene si en casa hay alergias o asma. Fijate si es lavable o si hay que comprar repuesto.',
          'Batería (verticales, robots y de mano): mirá la autonomía en minutos, que suele bajar en el modo de máxima potencia, el tiempo de carga y si la batería es reemplazable.',
          'Si la vas a usar mucho, podés estimar el gasto de luz con la potencia del modelo en la calculadora de consumo eléctrico.',
        ],
      },
      {
        h: 'Mascotas, tipo de piso y ruido',
        p: [
          'Con perros o gatos: buscá cepillo antienredos o de goma (el pelo se enrosca menos), accesorio para tapizados y buen filtro.',
          'Pisos duros (cerámica, porcelanato, madera): casi cualquier tipo rinde; cuidá que el cepillo no raye la madera. Alfombras: conviene más succión y cepillo giratorio.',
          'Ruido: si el fabricante lo informa en decibeles (dB), menos es más silenciosa. Importa sobre todo en robots que van a andar mientras estás en casa.',
        ],
      },
      {
        h: 'Mantenimiento y cuánto sale',
        p: [
          'Con bolsa o sin bolsa: las sin bolsa (depósito) no tienen gasto en bolsas, pero hay que vaciarlas y limpiar el filtro seguido. Revisá que haya repuestos de filtros, cepillos y batería en el país, y la garantía.',
          'El precio cambia mucho según el tipo y la marca, así que no damos un precio fijo: en la comparativa de aspiradoras están las que están en oferta hoy, con el precio actual y el mínimo que registramos para cada una.',
        ],
      },
    ],
    categoria: { slug: 'aspiradoras', nombre: 'aspiradoras' },
    comparativa: 'mejores-aspiradoras',
    cta: { href: '/mejores/mejores-aspiradoras', titulo: 'Aspiradoras en oferta hoy, comparadas', boton: 'Ver la comparativa de aspiradoras 🧹' },
    faq: [
      {
        q: '¿Qué conviene, aspiradora vertical o de arrastre?',
        a: 'La de arrastre con cable conviene para casas grandes, alfombras y limpiezas a fondo. La vertical inalámbrica es más práctica para departamentos y pasadas rápidas, aunque depende de la batería.',
      },
      {
        q: '¿Vale la pena un robot aspiradora?',
        a: 'Sirve para mantener el piso limpio todos los días sin esfuerzo, pero no reemplaza una limpieza a fondo. Conviene que tenga mapeo para que recorra ordenado.',
      },
      {
        q: '¿Qué aspiradora conviene si tengo mascotas?',
        a: 'Una con buena succión, cepillo antienredos o de goma, accesorio para tapizados y filtro HEPA si hay alergias en casa.',
      },
      {
        q: '¿Para qué sirve el filtro HEPA?',
        a: 'Retiene partículas muy finas como polvo y polen, así no vuelven al aire. Es recomendable si en casa hay alergias o asma.',
      },
    ],
    enlaces: [
      { href: '/mejores/mejores-aspiradoras', texto: 'Comparativa de aspiradoras' },
      { href: '/guias/que-regalar-el-dia-de-la-madre', texto: 'Qué regalar el Día de la Madre' },
      { href: '/calculadora-consumo-electrico', texto: 'Calculadora de consumo ⚡' },
      { href: '/hoy', texto: 'Ofertas de hoy' },
    ],
  },
  {
    slug: 'que-smartwatch-comprar',
    titulo: '¿Qué smartwatch comprar? Compatibilidad, batería, GPS y sensores',
    descripcion:
      'Cómo elegir un smartwatch o una smartband en Argentina: compatibilidad con Android o iPhone, batería, GPS, sensores de salud y sus límites, resistencia al agua, pantalla y garantía.',
    pregunta: '¿Qué smartwatch conviene comprar?',
    respuestaCorta:
      'Primero confirmá que sea compatible con tu celular: el Apple Watch solo funciona con iPhone, y muchos relojes con Wear OS no andan bien con iPhone. Si querés notificaciones, pasos y sueño con batería que dure días, alcanza una smartband; si querés responder mensajes, apps o GPS propio para correr, conviene un smartwatch. Mirá la autonomía real, la resistencia al agua (5 ATM si nadás) y que tenga garantía en Argentina. Los sensores de salud orientan, pero no reemplazan a un dispositivo médico.',
    secciones: [
      {
        h: 'Smartwatch o smartband',
        p: [
          'Smartband (pulsera): liviana, barata y con batería que suele durar más de una semana. Muestra notificaciones, cuenta pasos, mide pulso y sueño. Pantalla chica y pocas apps.',
          'Smartwatch: pantalla más grande, más funciones (responder mensajes, apps, pagos o llamadas en algunos modelos) y suele tener que cargarse más seguido.',
          'Si solo querés contar pasos y ver quién te escribe, una smartband alcanza. Si lo vas a usar como extensión del celular, andá por un smartwatch.',
        ],
      },
      {
        h: 'Compatibilidad con Android o iPhone',
        p: [
          'Apple Watch: funciona solo con iPhone.',
          'Relojes con Wear OS: están pensados para Android; con iPhone la compatibilidad es limitada o nula según el modelo.',
          'Marcas con app propia (muchas smartbands y relojes de entrada): suelen andar con Android y iPhone, pero con iPhone algunas funciones, como responder mensajes, pueden no estar. Revisá en la publicación qué versión de sistema pide y si la app está en tu tienda.',
        ],
      },
      {
        h: 'Batería, GPS, sensores y agua',
        p: [
          'Batería: la duración que anuncia el fabricante es con uso moderado; con pantalla siempre encendida o GPS activo baja bastante.',
          'GPS: un reloj con GPS propio registra la ruta sin llevar el celular; los que usan "GPS conectado" necesitan el teléfono encima. Si corrés o andás en bici, conviene GPS propio.',
          'Sensores de salud: pulso, oxígeno en sangre, sueño o estrés son estimaciones útiles para seguir tendencias, pero no son dispositivos médicos. No los uses para diagnosticar nada: ante cualquier duda, consultá a un médico.',
          'Resistencia al agua: IP67/IP68 aguanta lluvia y lavarse las manos; para nadar buscá 5 ATM o más. Ninguno conviene usarlo en sauna o con agua caliente.',
        ],
      },
      {
        h: 'Pantalla, garantía y precio',
        p: [
          'Pantalla: las AMOLED se ven mejor y con más brillo; las LCD gastan distinto y suelen estar en los más baratos. Fijate que se lea bien al sol.',
          'Garantía: preferí tienda oficial o vendedor con garantía en Argentina; los importados sin respaldo complican cualquier reclamo.',
          'Precio: cambia mucho entre marcas y semanas. No damos un precio fijo: en la comparativa de smartwatch tenés los que están en oferta hoy, con el precio actual y el mínimo que registramos para cada uno.',
        ],
      },
    ],
    comparativa: 'mejores-smartwatch',
    cta: { href: '/mejores/mejores-smartwatch', titulo: 'Smartwatch en oferta hoy, comparados', boton: 'Ver la comparativa de smartwatch ⌚' },
    faq: [
      {
        q: '¿El Apple Watch funciona con Android?',
        a: 'No. El Apple Watch necesita un iPhone para configurarse y usarse. Si tenés Android, buscá un reloj con Wear OS o de una marca con app compatible.',
      },
      {
        q: '¿Qué diferencia hay entre smartwatch y smartband?',
        a: 'La smartband es más chica, barata y con más batería, ideal para pasos, sueño y notificaciones. El smartwatch tiene pantalla más grande y más funciones, como apps o responder mensajes.',
      },
      {
        q: '¿Los smartwatch miden bien la presión o el oxígeno?',
        a: 'Dan estimaciones útiles para seguir tendencias, pero no son dispositivos médicos. No sirven para diagnosticar; ante cualquier síntoma consultá a un médico.',
      },
      {
        q: '¿Puedo nadar con un smartwatch?',
        a: 'Solo si indica resistencia de 5 ATM o más. IP67 o IP68 aguanta salpicaduras y lluvia, pero no está pensado para nadar.',
      },
    ],
    enlaces: [
      { href: '/mejores/mejores-smartwatch', texto: 'Comparativa de smartwatch' },
      { href: '/guias/que-celular-comprar-segun-presupuesto', texto: 'Qué celular comprar según tu presupuesto' },
      { href: '/guias/que-regalar-el-dia-de-la-madre', texto: 'Qué regalar el Día de la Madre' },
      { href: '/hoy', texto: 'Ofertas de hoy' },
    ],
  },
  {
    slug: 'que-freezer-comprar',
    titulo: '¿Qué freezer comprar? Horizontal o vertical, litros y consumo',
    descripcion:
      'Cómo elegir un freezer en Argentina: horizontal o vertical, cuántos litros, dual freezer/heladera, no frost o cíclico, consumo y etiqueta de eficiencia energética, medidas y ventilación.',
    pregunta: '¿Qué freezer conviene comprar?',
    respuestaCorta:
      'Si querés guardar mucho por el mismo precio, el freezer horizontal suele rendir más litros y conservar mejor el frío al abrirlo; si tenés poco piso o querés ordenar y encontrar las cosas fácil, conviene uno vertical. Elegí los litros según cuánto comprás y congelás, medí el lugar dejando espacio para que ventile, y compará la clase y el consumo de la etiqueta de eficiencia energética: un freezer funciona todo el día y eso se nota en la factura.',
    secciones: [
      {
        h: 'Horizontal o vertical',
        p: [
          'Horizontal (tipo arcón): por el mismo precio suele tener más litros, y al abrir la tapa se escapa menos frío. Ocupa más piso y cuesta más encontrar lo que está al fondo; los canastos ayudan.',
          'Vertical: ocupa menos piso, se ordena con estantes o cajones como una heladera y se ve todo de un vistazo. Por la misma capacidad suele costar más.',
          'Dual (freezer/heladera): muchos horizontales se pueden usar como freezer o como conservadora con una perilla. Sirve si a veces lo querés para bebidas, por ejemplo en verano.',
        ],
      },
      {
        h: 'Cuántos litros',
        p: [
          'Depende de cuánto congelás más que de cuántos son: si comprás por mayor, hacés viandas o congelás carne en cantidad, conviene ir a más litros. Si es para complementar el freezer de la heladera, alcanza con uno chico.',
          'Un freezer muy grande y medio vacío gasta energía en enfriar aire. Pensá en lo que vas a guardar de forma habitual.',
        ],
      },
      {
        h: 'Consumo, no frost y medidas',
        p: [
          'La etiqueta de eficiencia energética es obligatoria en Argentina (Secretaría de Energía, normas IRAM): indica la clase y el consumo anual. Como funciona todo el día, la diferencia entre clases se nota. Podés estimar el costo por mes en la calculadora de consumo eléctrico.',
          'No frost: no junta hielo, pero suele costar más. Cíclico: hay que descongelarlo cada tanto.',
          'Medí ancho, profundidad y alto (en el horizontal, también el espacio para abrir la tapa) y dejá unos centímetros atrás y a los costados para que ventile. Revisá la garantía y que haya service oficial en tu zona.',
        ],
      },
      {
        h: 'Cuánto sale',
        p: [
          'Es un electrodoméstico de ticket alto y el precio cambia mucho según litros, tipo y marca. No damos un precio fijo: en la comparativa de freezers están los que están en oferta hoy, con el precio actual y el mínimo que registramos para cada uno.',
        ],
      },
    ],
    categoria: { slug: 'freezers', nombre: 'freezers' },
    comparativa: 'mejores-freezers',
    cta: { href: '/mejores/mejores-freezers', titulo: 'Freezers en oferta hoy, comparados', boton: 'Ver la comparativa de freezers 🧊' },
    faq: [
      {
        q: '¿Qué es mejor, freezer horizontal o vertical?',
        a: 'El horizontal guarda más por el mismo precio y pierde menos frío al abrirlo; el vertical ocupa menos piso y es más fácil de ordenar.',
      },
      {
        q: '¿De cuántos litros conviene el freezer?',
        a: 'Depende de cuánto congelás: si comprás por mayor o hacés viandas, más litros; si es para complementar la heladera, uno chico alcanza. Uno grande medio vacío gasta de más.',
      },
      {
        q: '¿Cuánta luz gasta un freezer?',
        a: 'La etiqueta de eficiencia energética indica el consumo anual. Con ese dato podés calcular el costo por mes en la calculadora de consumo eléctrico.',
      },
      {
        q: '¿Qué es un freezer dual?',
        a: 'Un freezer, en general horizontal, que con una perilla también funciona como conservadora o heladera. Es útil si a veces lo querés para bebidas.',
      },
    ],
    enlaces: [
      { href: '/mejores/mejores-freezers', texto: 'Comparativa de freezers' },
      { href: '/guias/que-heladera-comprar', texto: 'Qué heladera comprar' },
      { href: '/calculadora-consumo-electrico', texto: 'Calculadora de consumo ⚡' },
      { href: '/hoy', texto: 'Ofertas de hoy' },
    ],
    fuentes: [
      { texto: 'Secretaría de Energía de la Nación: eficiencia energética y etiquetado', url: 'https://www.argentina.gob.ar/economia/energia/eficiencia-energetica' },
      { texto: 'IRAM: normas de etiquetado de eficiencia energética por producto', url: 'https://www.iram.org.ar/' },
    ],
  },
  {
    slug: 'que-pileta-comprar',
    titulo: '¿Qué pileta comprar para el verano? Estructural, inflable o de lona',
    descripcion:
      'Cómo elegir una pileta para el verano en Argentina: estructural, inflable o de lona, litros y medidas según el patio y cuántos la usan, terreno, filtro y cloro, seguridad con chicos, agua, armado y guardado.',
    pregunta: '¿Qué pileta conviene comprar para el verano?',
    respuestaCorta:
      'Para el verano, primero medí el patio y pensá cuántos la van a usar: dejá espacio libre alrededor y elegí los litros en base a eso. La estructural (caños de acero y lona) dura más temporadas y aguanta más litros; la inflable es la más rápida de armar y guardar, ideal para chicos o espacios chicos; la de lona tipo pelopincho es el término medio. Armala siempre sobre terreno nivelado, sumá un filtro acorde a los litros y cloro, y si hay chicos, nunca los dejes solos: usá cerco o cobertor.',
    secciones: [
      {
        h: 'Estructural, inflable o de lona',
        p: [
          'Estructural: tiene caños de acero que sostienen la lona. Es la que aguanta más litros y más temporadas, pero tarda más en armarse y ocupa más lugar.',
          'Inflable: el aro de arriba se infla y la pileta se levanta sola al llenarse. Es la más fácil de armar y guardar, pero se puede pinchar y suele durar menos.',
          'De lona (tipo pelopincho): una lona reforzada sostenida con caños o varillas. Es un término medio en precio, duración y armado.',
        ],
      },
      {
        h: 'Litros y medidas según el patio y cuántos la usan',
        p: [
          'Medí el lugar y dejá espacio libre alrededor para circular y para el filtro. Las medidas y los litros están en la ficha de cada modelo.',
          'Pensá cuántos la van a usar a la vez y quiénes: para chicos chicos alcanza una baja; para adultos conviene más profundidad y superficie.',
          'Más litros significa más agua para llenarla, más cloro y un filtro más grande.',
        ],
      },
      {
        h: 'Terreno nivelado',
        p: [
          'Armala sobre un piso plano y firme, sin piedras ni raíces. Si el terreno está desnivelado, el agua carga más de un lado y la pileta se puede deformar o romper.',
          'Poné una lona o manta de base debajo para proteger el piso de la pileta.',
        ],
      },
      {
        h: 'Filtro, bomba y cloro',
        p: [
          'El filtro o bomba tiene que ser acorde al volumen de agua: compará los litros por hora que declara el fabricante con los litros de tu pileta.',
          'Con filtro y cloro el agua se mantiene limpia mucho más tiempo y no hace falta vaciarla seguido. Seguí las dosis que indica el producto y guardá el cloro fuera del alcance de los chicos.',
          'Un cobertor ayuda a que no caigan hojas y bichos cuando no se usa.',
        ],
      },
      {
        h: 'Seguridad con chicos',
        p: [
          'Nunca dejes a los chicos solos en la pileta ni cerca de ella, aunque sea baja: siempre tiene que haber un adulto mirando.',
          'Usá un cerco o barrera alrededor y tapala con un cobertor cuando no se usa. Si la pileta es elevada, sacá la escalera para que no puedan subir solos.',
          'Las piletas chicas o inflables también son un riesgo: si no se usan, conviene vaciarlas.',
        ],
      },
      {
        h: 'Consumo de agua',
        p: [
          'Llenarla usa muchos litros de agua de una vez. Con filtro, cloro y cobertor podés mantener la misma agua por más tiempo en vez de vaciarla y llenarla seguido.',
          'Fijate si en tu localidad hay restricciones de uso de agua en verano antes de llenarla.',
        ],
      },
      {
        h: 'Armado y guardado',
        p: [
          'Leé el manual y armala entre dos personas. Al terminar la temporada, vaciala, lavala, dejala secar bien y guardala doblada en un lugar seco y protegido del sol.',
          'Guardarla húmeda genera hongos y olor, y acorta la vida de la lona.',
        ],
      },
      {
        h: 'Cuánto sale',
        p: [
          'El precio cambia mucho según tipo, litros y si trae filtro. No damos un precio fijo: en la comparativa de piletas están las que están en oferta hoy, con el precio actual y el mínimo que registramos para cada una.',
        ],
      },
    ],
    comparativa: 'mejores-piletas',
    cta: { href: '/mejores/mejores-piletas', titulo: 'Piletas en oferta hoy, comparadas', boton: 'Ver la comparativa de piletas 🏊' },
    faq: [
      {
        q: '¿Qué conviene, pileta estructural o inflable?',
        a: 'La estructural dura más temporadas y aguanta más litros. La inflable es más fácil de armar y guardar y conviene para chicos o espacios chicos, aunque suele durar menos.',
      },
      {
        q: '¿De cuántos litros tiene que ser la pileta?',
        a: 'Depende del espacio que tengas y de cuántos la usen a la vez. Medí el patio dejando lugar alrededor y mirá los litros y medidas en la ficha de cada modelo.',
      },
      {
        q: '¿Hace falta filtro en una pileta de lona?',
        a: 'Con filtro y cloro el agua se mantiene limpia mucho más tiempo y no hay que vaciarla seguido. Elegí uno con un caudal en litros por hora acorde al volumen de la pileta.',
      },
      {
        q: '¿Cómo hago segura la pileta si hay chicos?',
        a: 'Nunca los dejes solos: siempre tiene que haber un adulto mirando. Sumá cerco o barrera, cobertor cuando no se usa y sacá la escalera de las piletas elevadas.',
      },
    ],
    enlaces: [
      { href: '/mejores/mejores-piletas', texto: 'Comparativa de piletas' },
      { href: '/mejores/mejores-muebles-de-jardin', texto: 'Muebles de jardín en oferta' },
      { href: '/mejores/mejores-parrillas', texto: 'Parrillas en oferta' },
      { href: '/hoy', texto: 'Ofertas de hoy' },
    ],
  },
  {
    slug: 'que-ventilador-comprar',
    titulo: '¿Qué ventilador comprar? De pie, de techo, turbo o torre',
    descripcion:
      'Cómo elegir un ventilador para el verano en Argentina: de pie, de techo, turbo de piso, de pared o torre; tamaño de aspas, potencia, ruido, control remoto y timer, consumo comparado con un aire y cuándo conviene pasar a un aire acondicionado.',
    pregunta: '¿Qué ventilador conviene comprar?',
    respuestaCorta:
      'Para un ambiente que usás todos los días, el de techo es el más cómodo: no ocupa lugar y reparte el aire en toda la habitación. Si lo querés mover de un cuarto a otro, andá por uno de pie; si buscás mucho caudal de aire en poco espacio, un turbo de piso; y si tenés poco lugar, uno de pared o una torre. Para dormir, fijate que tenga varias velocidades, bajo ruido y timer. Un ventilador gasta mucho menos que un aire, pero no baja la temperatura: si el calor es fuerte, compará con un aire acondicionado.',
    secciones: [
      {
        h: 'Los tipos de ventilador',
        p: [
          'De techo: se instala fijo, no ocupa piso y mueve el aire en todo el ambiente. Es el más cómodo para uso diario en dormitorios y livings. Necesita instalación y altura de techo suficiente; algunos traen luz incluida.',
          'De pie: el más versátil, lo llevás de una habitación a otra y regulás la altura y la oscilación. Ocupa algo de piso.',
          'Turbo o de piso: bajo y potente, tira mucho aire hacia adelante. Sirve para pegarle de frente a donde estás, pero suele ser más ruidoso.',
          'De pared: se fija en la pared con oscilación. Ideal para cocinas, locales o cuartos chicos donde no hay lugar en el piso.',
          'Torre: angosto y alto, ocupa poco y suele ser más silencioso y prolijo, aunque en general mueve menos aire que uno de pie con aspas grandes.',
        ],
      },
      {
        h: 'Tamaño de aspas y potencia',
        p: [
          'A más diámetro de aspas, más aire mueve. Para un dormitorio alcanza con un ventilador mediano; para un living o un ambiente grande conviene ir a aspas más grandes o a uno de techo.',
          'La potencia (en watts) indica cuánto consume el motor, no exactamente cuánto enfría: compará también el diámetro, la cantidad de velocidades y las opiniones de quienes ya lo compraron.',
          'Las aspas metálicas suelen mover más aire; las plásticas son más livianas y en general más silenciosas.',
        ],
      },
      {
        h: 'Ruido, control remoto y timer',
        p: [
          'Si es para dormir, el ruido importa tanto como el caudal. Mirá las opiniones en la publicación: es donde más se nota si un modelo hace ruido en velocidad baja.',
          'El control remoto es cómodo sobre todo en los de techo y en las torres. El timer te deja dormirte con el ventilador prendido y que se apague solo.',
          'Varias velocidades y oscilación hacen que lo puedas usar suave de noche y fuerte en la siesta.',
        ],
      },
      {
        h: 'Consumo: ventilador o aire acondicionado',
        p: [
          'Un ventilador consume mucho menos que un aire acondicionado, porque solo mueve el aire: da sensación de fresco, pero no baja la temperatura del ambiente. Podés comparar cuánto sale por mes cada uno en la calculadora de consumo eléctrico, con los watts de cada equipo y las horas de uso.',
          'Conviene pasar a un aire cuando el calor es fuerte y sostenido, el ambiente es grande o da al sol, o cuando el ventilador termina tirando aire caliente. Para elegir el tamaño del aire, mirá la guía de frigorías.',
        ],
      },
      {
        h: 'Cuándo comprar y cuánto sale',
        p: [
          'Conviene comprar antes de la ola de calor: en pleno verano la demanda sube y aparecen menos ofertas. No damos un precio fijo porque cambia según tipo, tamaño y marca: en la comparativa de ventiladores están los que están en oferta hoy, con el precio actual y el mínimo que registramos.',
        ],
      },
    ],
    categoria: { slug: 'ventiladores', nombre: 'ventiladores' },
    comparativa: 'mejores-ventiladores',
    cta: { href: '/mejores/mejores-ventiladores', titulo: 'Ventiladores en oferta hoy, comparados', boton: 'Ver la comparativa de ventiladores 🌀' },
    faq: [
      {
        q: '¿Qué es mejor, ventilador de techo o de pie?',
        a: 'El de techo no ocupa lugar y reparte el aire en todo el ambiente, ideal para uso diario. El de pie es más versátil porque lo movés de un cuarto a otro y no necesita instalación.',
      },
      {
        q: '¿Qué ventilador es más silencioso para dormir?',
        a: 'En general las torres y los de techo de buena calidad son más silenciosos que los turbo. Buscá varias velocidades y timer, y revisá las opiniones sobre el ruido en velocidad baja.',
      },
      {
        q: '¿Cuánta luz gasta un ventilador comparado con un aire?',
        a: 'Bastante menos, porque solo mueve el aire. Con los watts de cada equipo y las horas de uso podés comparar el costo por mes en la calculadora de consumo eléctrico.',
      },
      {
        q: '¿Cuándo conviene comprar un aire acondicionado en vez de un ventilador?',
        a: 'Cuando el calor es fuerte y sostenido, el ambiente es grande o da al sol: el ventilador no baja la temperatura y un aire sí. Para el tamaño, mirá la guía de cuántas frigorías necesitás.',
      },
    ],
    enlaces: [
      { href: '/mejores/mejores-ventiladores', texto: 'Comparativa de ventiladores' },
      { href: '/guias/cuantas-frigorias-necesito-aire-acondicionado', texto: 'Cuántas frigorías necesito' },
      { href: '/calculadora-consumo-electrico', texto: 'Calculadora de consumo ⚡' },
      { href: '/hoy', texto: 'Ofertas de hoy' },
    ],
  },
  {
    slug: 'aire-acondicionado-portatil-o-split',
    titulo: '¿Aire acondicionado portátil o split? Eficiencia, ruido, instalación y cuál conviene',
    descripcion:
      'Portátil vs split en Argentina: cuál enfría mejor, cuál gasta menos luz, ruido, manguera por la ventana, alquileres y departamentos. Además: inverter u on-off y frío solo o frío/calor.',
    pregunta: '¿Qué conviene, un aire acondicionado portátil o un split?',
    respuestaCorta:
      'Si podés instalarlo, el split conviene casi siempre: enfría mejor, gasta menos luz y hace menos ruido porque el compresor queda afuera. El portátil sirve cuando no se puede instalar un split (alquiler sin permiso, consorcio que no deja poner la unidad exterior, uso ocasional o para mover entre ambientes), pero hay que sacar la manguera de aire caliente por una ventana y rinde menos. En los dos casos, primero calculá las frigorías que necesitás y compará la etiqueta de eficiencia energética, obligatoria en Argentina.',
    secciones: [
      {
        h: 'Cómo funciona cada uno',
        p: [
          'Split: tiene una unidad interior (la que va en la pared) y una exterior con el compresor, unidas por cañerías con gas refrigerante. El calor y casi todo el ruido quedan afuera.',
          'Portátil: es un solo equipo con ruedas que va adentro del ambiente, con el compresor incluido. El aire caliente sale por una manguera que tiene que ir a una ventana o a un hueco al exterior; sin esa salida no enfría.',
        ],
      },
      {
        h: 'Eficiencia y ruido',
        p: [
          'El split suele ser más eficiente: el portátil tiene el compresor dentro del ambiente que querés enfriar y la manguera también irradia calor, así que a igual capacidad suele rendir menos y gastar más. Por eso conviene elegir un portátil con algo de margen sobre las frigorías calculadas.',
          'En ruido, el split gana: adentro solo queda el ventilador. El portátil tiene el compresor a tu lado, algo a tener en cuenta si es para dormir.',
          'Para comparar consumo, mirá la etiqueta de eficiencia energética de cada modelo: indica la clase y el consumo, y con esos datos podés estimar el gasto mensual en la calculadora de consumo eléctrico.',
        ],
      },
      {
        h: 'Instalación, alquileres y departamentos',
        p: [
          'El split necesita instalación: perforar la pared, montar la unidad exterior, conectar cañerías y cargar el gas. Hacela con un técnico matriculado; además, una instalación incorrecta puede afectar la garantía. Casi nunca viene incluida en el precio, así que pedí presupuesto antes de comprar.',
          'En departamentos, revisá el reglamento del consorcio sobre dónde se puede poner la unidad exterior y el desagüe. Si alquilás, pedí autorización al propietario antes de perforar.',
          'El portátil no requiere instalación: se enchufa y se saca la manguera por la ventana con el kit que trae. Lo que sí: la ventana queda entreabierta, así que conviene sellar el hueco para que no entre aire caliente. Algunos modelos acumulan agua de condensación y hay que vaciarla.',
        ],
      },
      {
        h: 'Inverter u on-off, frío solo o frío/calor',
        p: [
          'Inverter regula la potencia del compresor en vez de prender y apagar, así que gasta menos luz y hace menos ruido; conviene si lo vas a usar muchas horas. Un on-off es más barato de entrada y puede alcanzar para un uso esporádico.',
          'Frío/calor también calefacciona con bomba de calor, que suele ser más eficiente que una estufa eléctrica común. Si en invierno no lo vas a usar para calefaccionar, un frío solo puede alcanzar.',
        ],
      },
    ],
    categoria: { slug: 'aire-acondicionado', nombre: 'aires acondicionados' },
    comparativa: 'mejores-aires-acondicionados',
    faq: [
      {
        q: '¿El aire portátil enfría igual que un split?',
        a: 'En general no: a igual capacidad, el split rinde más porque el compresor y el calor quedan afuera. El portátil enfría, pero conviene elegirlo con algo de margen sobre las frigorías que necesitás y sellar bien la salida de la manguera.',
      },
      {
        q: '¿Se puede usar un aire portátil sin ventana?',
        a: 'Necesita sacar el aire caliente al exterior por la manguera. Sin una ventana u otra abertura al exterior, el calor queda en el mismo ambiente y no enfría.',
      },
      {
        q: '¿Quién tiene que instalar el split?',
        a: 'Un técnico matriculado. La instalación incluye perforar, montar la unidad exterior y cargar el gas refrigerante, y una mala instalación puede afectar la garantía. Casi nunca viene incluida en el precio.',
      },
      {
        q: '¿Conviene inverter y frío/calor?',
        a: 'Inverter conviene si lo vas a usar muchas horas: gasta menos luz y hace menos ruido. Frío/calor conviene si también lo querés para calefaccionar en invierno. Compará siempre la etiqueta de eficiencia energética.',
      },
    ],
    cta: {
      href: '/mejores/mejores-aires-acondicionados',
      titulo: 'Comparativa de aires acondicionados con precios actualizados',
      boton: 'Ver los mejores aires ❄️',
    },
    enlaces: [
      { href: '/guias/cuantas-frigorias-necesito-aire-acondicionado', texto: '¿Cuántas frigorías necesito? ❄️' },
      { href: '/mejores/mejores-aires-acondicionados', texto: 'Comparativa de aires' },
      { href: '/calculadora-consumo-electrico', texto: 'Calculadora de consumo ⚡' },
      { href: '/hoy', texto: 'Ofertas de hoy' },
    ],
    fuentes: [
      { texto: 'Secretaría de Energía de la Nación: eficiencia energética y etiquetado', url: 'https://www.argentina.gob.ar/economia/energia/eficiencia-energetica' },
    ],
  },
  {
    slug: 'que-muebles-de-jardin-comprar',
    titulo: '¿Qué muebles de jardín comprar? Materiales, sol, lluvia y espacio',
    descripcion:
      'Cómo elegir muebles de jardín para el verano en Argentina: ratán sintético, aluminio, hierro, madera o plástico y cuánto aguantan sol y lluvia; cuántas personas, reposeras, mesas, gazebos y sombrillas, balcón o patio, fundas, mantenimiento y armado.',
    pregunta: '¿Qué muebles de jardín conviene comprar?',
    respuestaCorta:
      'Primero medí el espacio y pensá cuántos van a usarlo: en un balcón conviene un juego chico, plegable o apilable; en un patio podés ir a un juego completo con mesa, sillones y reposeras. Si quedan a la intemperie, elegí materiales que aguanten sol y lluvia sin mucho mantenimiento, como aluminio, ratán sintético o plástico reforzado; la madera y el hierro quedan lindos pero piden tratamiento. Sumá sombra (gazebo o sombrilla) y fundas para alargarles la vida.',
    secciones: [
      {
        h: 'Materiales: cuánto aguantan sol y lluvia',
        p: [
          'Ratán sintético: tejido plástico sobre una estructura (en general de aluminio o acero). Aguanta bien la intemperie y es liviano; conviene que la estructura sea de aluminio o acero con pintura, y que diga protección UV para que no se reseque ni pierda color al sol.',
          'Aluminio: liviano y no se oxida, por eso es de los más cómodos para dejar afuera todo el año. Al sol directo se calienta, así que suma usar almohadones.',
          'Hierro: muy firme y pesado (no se vuela con el viento), pero se oxida si se pela la pintura. Hay que revisarlo y retocarlo cada tanto.',
          'Madera: cálida y linda, pero al sol y la lluvia se agrieta o se pone gris si no la tratás con aceite o protector cada temporada. Las maderas duras aguantan mejor.',
          'Plástico o resina: lo más barato, liviano, fácil de limpiar y apilable. El plástico reforzado y con protección UV dura más; el común se pone quebradizo con el sol.',
        ],
      },
      {
        h: 'Cuántas personas y qué piezas',
        p: [
          'Contá cuántos son en casa y cuántos suelen venir: un juego de 2 sillas y mesita alcanza para un balcón; para comer afuera en familia buscá una mesa con 4 a 6 sillas, o un juego de living (sillones con mesa ratona) para estar.',
          'Reposeras y camastros: ideales al lado de la pileta. Mirá el peso máximo que soportan, si el respaldo se regula y si se pliegan para guardarlos.',
          'Mesas: verificá la medida de la tapa y si tiene agujero para sombrilla. El vidrio templado o la tapa de aluminio o plástico se limpian fácil.',
        ],
      },
      {
        h: 'Sombra: gazebo o sombrilla',
        p: [
          'Sombrilla: práctica para una mesa o para un par de reposeras. Necesita una base pesada para que no se la lleve el viento; las de brazo lateral dejan la mesa libre.',
          'Gazebo: da sombra a un grupo entero. La medida más común es 3x3; mirá que la estructura sea de acero, que la lona tenga protección UV y si trae paredes laterales y estacas o vientos para fijarlo. Con viento fuerte conviene plegarlo.',
        ],
      },
      {
        h: 'Balcón o patio',
        p: [
          'Balcón: medí ancho y profundidad y dejá lugar para circular y abrir la puerta. Funcionan mejor las sillas plegables, las mesas rebatibles y los juegos de 2 piezas. Preferí materiales livianos.',
          'Patio o jardín: hay más lugar, pero también más sol y viento. Los muebles pesados (hierro) o un gazebo bien anclado aguantan mejor; en pasto conviene poner las patas sobre baldosas para que no se hundan.',
        ],
      },
      {
        h: 'Mantenimiento, fundas y armado',
        p: [
          'Fundas: cubrir los muebles cuando no se usan los protege del sol, la lluvia y la tierra, y es lo que más les alarga la vida. Los almohadones conviene guardarlos adentro o en un baúl de exterior.',
          'Limpieza: aluminio, ratán sintético y plástico con agua y jabón; la madera con su producto de tratamiento una vez por temporada; el hierro, revisar óxido y retocar la pintura.',
          'Armado: muchos juegos vienen desarmados. Revisá en la publicación si incluye herrajes e instrucciones y si tiene sentido guardarlos plegados en invierno.',
        ],
      },
      {
        h: 'Cuánto sale',
        p: [
          'El precio cambia muchísimo según material, cantidad de piezas y marca, y en primavera y verano suben las ofertas. No damos un precio fijo: en la comparativa de muebles de jardín y gazebos están los que están en oferta hoy, con el precio actual y el mínimo que registramos para cada uno.',
        ],
      },
    ],
    comparativa: 'mejores-muebles-de-jardin',
    cta: { href: '/mejores/mejores-muebles-de-jardin', titulo: 'Muebles de jardín y gazebos en oferta hoy, comparados', boton: 'Ver la comparativa de muebles de jardín ☀️' },
    faq: [
      {
        q: '¿Qué material de muebles de jardín aguanta mejor la intemperie?',
        a: 'El aluminio, el ratán sintético con protección UV y el plástico reforzado aguantan sol y lluvia con poco mantenimiento. La madera y el hierro necesitan tratamiento o retoques.',
      },
      {
        q: '¿Qué muebles conviene poner en un balcón?',
        a: 'Piezas livianas, plegables o apilables: un juego de 2 sillas con mesita o una mesa rebatible. Medí antes y dejá lugar para circular.',
      },
      {
        q: '¿Conviene un gazebo o una sombrilla?',
        a: 'La sombrilla alcanza para una mesa o un par de reposeras; el gazebo da sombra a un grupo entero. En los dos casos hay que fijarlos bien por el viento.',
      },
      {
        q: '¿Cómo hago que los muebles de jardín duren más?',
        a: 'Cubrilos con fundas cuando no los usás, guardá los almohadones adentro, limpialos cada tanto y tratá la madera o retocá el hierro una vez por temporada.',
      },
    ],
    enlaces: [
      { href: '/mejores/mejores-muebles-de-jardin', texto: 'Comparativa de muebles de jardín' },
      { href: '/guias/que-pileta-comprar', texto: 'Qué pileta comprar' },
      { href: '/mejores/mejores-parrillas', texto: 'Comparativa de parrillas' },
      { href: '/hoy', texto: 'Ofertas de hoy' },
    ],
  },
]

export const getGuia = (slug: string) => GUIAS.find(g => g.slug === slug)

/** Fechas de publicación y última revisión (del historial de git) para el
 *  Article JSON-LD. Al revisar una guía a fondo, actualizá `modificada`. */
export const FECHAS_GUIAS: Record<string, { publicada: string; modificada: string }> = {
  'que-parrilla-comprar': { publicada: '2026-10-03', modificada: '2026-10-03' },
  'aire-acondicionado-portatil-o-split': { publicada: '2026-10-02', modificada: '2026-10-02' },
  'que-ventilador-comprar': { publicada: '2026-10-02', modificada: '2026-10-02' },
  'que-pileta-comprar': { publicada: '2026-10-02', modificada: '2026-10-02' },
  'que-freezer-comprar': { publicada: '2026-10-02', modificada: '2026-10-02' },
  'que-aspiradora-comprar': { publicada: '2026-10-02', modificada: '2026-10-02' },
  'que-smartwatch-comprar': { publicada: '2026-10-02', modificada: '2026-10-02' },
  'que-cocina-comprar': { publicada: '2026-10-02', modificada: '2026-10-02' },
  'que-monitor-comprar': { publicada: '2026-10-02', modificada: '2026-10-02' },
  'que-termotanque-comprar': { publicada: '2026-10-02', modificada: '2026-10-02' },
  'que-tablet-comprar': { publicada: '2026-10-02', modificada: '2026-10-02' },
  'que-cafetera-comprar': { publicada: '2026-10-02', modificada: '2026-10-02' },
  'que-silla-gamer-comprar': { publicada: '2026-10-01', modificada: '2026-10-01' },
  'como-saber-si-un-descuento-de-mercado-libre-es-real': { publicada: '2026-09-21', modificada: '2026-09-21' },
  'hot-sale-cyber-monday-o-dia-comun-cuando-comprar-en-mercado-libre': { publicada: '2026-09-21', modificada: '2026-09-21' },
  'como-ahorrar-en-mercado-libre-argentina': { publicada: '2026-09-21', modificada: '2026-09-21' },
  'donde-encontrar-las-mejores-ofertas-de-mercado-libre-argentina': { publicada: '2026-09-23', modificada: '2026-09-23' },
  'que-es-el-minimo-historico-en-mercado-libre': { publicada: '2026-09-23', modificada: '2026-09-23' },
  'cupones-y-codigos-de-descuento-de-mercado-libre-argentina': { publicada: '2026-09-23', modificada: '2026-09-23' },
  'cuantas-frigorias-necesito-aire-acondicionado': { publicada: '2026-09-23', modificada: '2026-09-30' },
  'que-heladera-comprar': { publicada: '2026-09-30', modificada: '2026-09-30' },
  'que-lavarropas-comprar': { publicada: '2026-09-30', modificada: '2026-09-30' },
  'que-lavavajillas-comprar': { publicada: '2026-10-01', modificada: '2026-10-01' },
  'que-freidora-de-aire-comprar': { publicada: '2026-09-30', modificada: '2026-09-30' },
  'que-colchon-comprar-firmeza-y-material': { publicada: '2026-09-23', modificada: '2026-09-30' },
  'que-taladro-comprar-para-la-casa': { publicada: '2026-09-23', modificada: '2026-09-23' },
  'que-amoladora-comprar': { publicada: '2026-09-25', modificada: '2026-09-25' },
  'que-regalar-el-dia-de-la-madre': { publicada: '2026-09-24', modificada: '2026-09-24' },
  'que-soldadora-comprar': { publicada: '2026-09-25', modificada: '2026-09-25' },
  'que-hidrolavadora-comprar': { publicada: '2026-09-25', modificada: '2026-09-25' },
  'herramientas-electricas-cyber-monday-black-friday': { publicada: '2026-09-25', modificada: '2026-09-25' },
  'que-horno-pizzero-comprar-para-mi-negocio': { publicada: '2026-09-26', modificada: '2026-09-26' },
  'que-freidora-industrial-comprar': { publicada: '2026-09-26', modificada: '2026-09-26' },
  'que-notebook-comprar': { publicada: '2026-09-30', modificada: '2026-09-30' },
  'que-celular-comprar-segun-presupuesto': { publicada: '2026-09-30', modificada: '2026-10-01' },
  'que-celular-gama-alta-comprar': { publicada: '2026-10-01', modificada: '2026-10-01' },
  'que-smart-tv-comprar': { publicada: '2026-09-30', modificada: '2026-09-30' },
  'que-notebook-comprar-cyber-monday': { publicada: '2026-09-26', modificada: '2026-09-26' },
  'que-smart-tv-comprar-cyber-monday': { publicada: '2026-09-26', modificada: '2026-09-26' },
  'que-celular-comprar-cyber-monday': { publicada: '2026-09-26', modificada: '2026-09-26' },
  'conviene-comprar-aire-acondicionado-cyber-monday': { publicada: '2026-09-26', modificada: '2026-09-26' },
  'que-lavarropas-comprar-cyber-monday': { publicada: '2026-09-26', modificada: '2026-09-26' },
  'que-auriculares-comprar-cyber-monday': { publicada: '2026-09-26', modificada: '2026-09-26' },
}

const FECHA_DEFAULT = '2026-09-30'
export const fechasGuia = (slug: string) => FECHAS_GUIAS[slug] ?? { publicada: FECHA_DEFAULT, modificada: FECHA_DEFAULT }
