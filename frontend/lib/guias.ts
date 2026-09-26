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
    cta: { href: '/', titulo: 'Ofertas de equipamiento para tu negocio, todos los días', boton: 'Ver ofertas de hoy' },
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
    cta: { href: '/', titulo: 'Ofertas de equipamiento para tu negocio, todos los días', boton: 'Ver ofertas de hoy' },
  },
]

export const getGuia = (slug: string) => GUIAS.find(g => g.slug === slug)
