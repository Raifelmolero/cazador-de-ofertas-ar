// Guías de compra de búsquedas "long tail" (microondas, licuadoras, planchitas,
// afeitadoras, auriculares, tipos de pantalla, robots aspiradores). Solo criterios
// técnicos generales: no hay precios, reseñas ni cantidades vendidas inventadas.
// Los precios reales están en las comparativas y categorías que se enlazan.
import type { Guia } from './guias'

export const GUIAS_LONG_TAIL: Guia[] = [
  {
    slug: 'que-microondas-comprar',
    titulo: '¿Qué microondas comprar? Litros, potencia, grill y panel',
    descripcion:
      'Cómo elegir un microondas: capacidad en litros según cuántos son en casa, potencia en watts, función grill, panel digital o mecánico y qué mirar antes de comprar.',
    pregunta: '¿Qué microondas conviene comprar?',
    respuestaCorta:
      'Para una o dos personas alcanza con un microondas de unos 20 litros; para una familia conviene uno de 25 a 30 litros. Fijate en la potencia (700 a 1000 W es lo habitual), en si tiene grill para gratinar y en que el plato giratorio sea lo bastante grande para tus platos.',
    secciones: [
      {
        h: 'Capacidad: cuántos litros necesitás',
        p: [
          'La capacidad se mide en litros y define qué tamaño de plato o fuente entra. Para una o dos personas, un modelo compacto de alrededor de 20 litros resuelve casi todo.',
          'Si cocinás para una familia o calentás fuentes grandes, un modelo de 25 a 30 litros evita tener que usar dos tandas. Medí el plato más grande que usás y compará con el diámetro del plato giratorio.',
        ],
      },
      {
        h: 'Potencia y funciones',
        p: [
          'La potencia se informa en watts. Mayor potencia calienta más rápido, pero lo importante es que tenga varios niveles para descongelar y recalentar sin resecar.',
          'El grill sirve para gratinar y dorar. Es útil si querés más que recalentar; no reemplaza a un horno, pero suma versatilidad.',
          'Los programas automáticos (descongelar por peso, pochoclo, pizza) ahorran tiempo si los vas a usar de verdad.',
        ],
      },
      {
        h: 'Panel digital o mecánico',
        p: [
          'El mecánico (perillas) es simple y rara vez falla. El digital permite programar tiempos exactos y suele traer más programas automáticos.',
        ],
      },
      {
        h: 'Qué mirar en la ficha antes de pagar',
        p: [
          'Capacidad en litros y diámetro del plato giratorio.',
          'Potencia en watts y si tiene grill.',
          'Dimensiones externas: confirmá que entra en el lugar donde lo vas a poner y que queda espacio para ventilar.',
          'Garantía del fabricante y si el envío es gratis.',
        ],
      },
    ],
    categoria: { slug: 'electro-de-cocina', nombre: 'electro de cocina' },
    comparativa: 'mejores-microondas',
    cta: { href: '/mejores/mejores-microondas', titulo: 'Microondas en oferta hoy, comparados', boton: 'Ver la comparativa de microondas' },
    faq: [
      {
        q: '¿De cuántos litros conviene un microondas?',
        a: 'Para una o dos personas, de unos 20 litros. Para una familia, de 25 a 30 litros. Lo que importa es que el plato giratorio sea lo bastante grande para tus platos y fuentes.',
      },
      {
        q: '¿Vale la pena que tenga grill?',
        a: 'Si querés gratinar o dorar y no tenés horno a mano, sí. Si solo vas a recalentar y descongelar, no hace falta.',
      },
      {
        q: '¿Qué diferencia hay entre panel digital y mecánico?',
        a: 'El mecánico usa perillas y es simple. El digital permite programar tiempos exactos y suele traer programas automáticos de cocción.',
      },
    ],
    enlaces: [
      { href: '/mejores/mejores-microondas', texto: 'Mejores microondas en oferta' },
      { href: '/guias/que-freidora-de-aire-comprar', texto: 'Qué freidora de aire comprar' },
      { href: '/guias/que-cafetera-comprar', texto: 'Qué cafetera comprar' },
      { href: '/categoria/electro-de-cocina', texto: 'Electro de cocina en oferta' },
      { href: '/precio', texto: 'Precio de hoy de cada producto' },
    ],
  },
  {
    slug: 'licuadora-batidora-o-minipimer',
    titulo: 'Licuadora, batidora o minipimer: cuál conviene y para qué',
    descripcion:
      'Diferencias entre licuadora de jarra, batidora y minipimer (mixer de mano): qué hace cada una, potencia, vaso de vidrio o plástico y cuál elegir según lo que cocinás.',
    pregunta: '¿Qué conviene más: licuadora, batidora o minipimer?',
    respuestaCorta:
      'La licuadora de jarra es la mejor para jugos, batidos y picar hielo; el minipimer (mixer de mano) es ideal para sopas, salsas y purés directo en la olla; la batidora sirve para claras, cremas y masas livianas. Si solo vas a comprar una y cocinás de todo, el minipimer con vaso es la más versátil por tamaño y precio.',
    secciones: [
      {
        h: 'Licuadora de jarra',
        p: [
          'Tiene una jarra fija sobre una base con motor. Es la indicada para jugos, licuados, smoothies y picar hielo si el motor y las cuchillas lo soportan.',
          'Fijate en la potencia, en que las cuchillas sean de acero inoxidable y en el material de la jarra: el vidrio no se mancha ni retiene olores, pero pesa más; el plástico es liviano pero puede rayarse.',
        ],
      },
      {
        h: 'Minipimer o mixer de mano',
        p: [
          'Es una varilla con motor que se mete en la olla o en un vaso. Sirve para sopas, salsas, purés y mezclas rápidas, y se lava fácil.',
          'Muchos vienen con vaso medidor, picadora y batidor de alambre, lo que lo vuelve un equipo múltiple en poco espacio.',
        ],
      },
      {
        h: 'Batidora',
        p: [
          'Con varillas o con batidores, aire la mezcla: claras a nieve, crema, masas livianas. La de pie con bowl libera las manos; la de mano es más económica y fácil de guardar.',
        ],
      },
      {
        h: 'Cuál elegir según tu caso',
        p: [
          'Querés jugos y licuados todos los días: licuadora de jarra.',
          'Hacés sopas, cremas y purés: minipimer.',
          'Hacés repostería seguido: batidora, de pie si es de uso frecuente.',
          'Tenés poco lugar y querés una sola: minipimer con accesorios.',
        ],
      },
    ],
    categoria: { slug: 'electro-de-cocina', nombre: 'electro de cocina' },
    comparativa: 'mejores-licuadoras',
    cta: { href: '/mejores/mejores-licuadoras', titulo: 'Licuadoras en oferta hoy, comparadas', boton: 'Ver la comparativa de licuadoras' },
    faq: [
      {
        q: '¿Una licuadora pica hielo?',
        a: 'Depende del modelo: necesita motor potente y cuchillas resistentes. Revisá en la ficha si el fabricante indica que pica hielo.',
      },
      {
        q: '¿Qué es mejor, el vaso de vidrio o el de plástico?',
        a: 'El vidrio no se mancha ni retiene olores pero es más pesado y frágil; el plástico es liviano y resiste golpes pero puede rayarse con el uso.',
      },
      {
        q: '¿El minipimer reemplaza a la licuadora?',
        a: 'Para sopas, salsas y purés sí. Para licuados muy espesos o picar hielo, la licuadora de jarra rinde mejor.',
      },
    ],
    enlaces: [
      { href: '/mejores/mejores-licuadoras', texto: 'Mejores licuadoras en oferta' },
      { href: '/mejores/mejores-batidoras', texto: 'Mejores batidoras en oferta' },
      { href: '/guias/que-microondas-comprar', texto: 'Qué microondas comprar' },
      { href: '/categoria/electro-de-cocina', texto: 'Electro de cocina en oferta' },
      { href: '/precio', texto: 'Precio de hoy de cada producto' },
    ],
  },
  {
    slug: 'que-planchita-de-pelo-comprar',
    titulo: '¿Qué planchita de pelo comprar? Cerámica, turmalina o titanio',
    descripcion:
      'Cómo elegir una planchita de pelo: tipos de placa (cerámica, turmalina, titanio), temperatura regulable, ancho de placa y funciones para cuidar el cabello.',
    pregunta: '¿Qué planchita de pelo conviene comprar?',
    respuestaCorta:
      'Para uso frecuente conviene una planchita con placas de cerámica o turmalina y temperatura regulable: reparte el calor parejo y permite bajar la temperatura en cabello fino o dañado. El titanio calienta más rápido y resulta más agresivo, pensado para cabello grueso o rebelde.',
    secciones: [
      {
        h: 'Tipo de placa',
        p: [
          'Cerámica: reparte el calor de forma pareja y es una opción equilibrada para uso diario.',
          'Turmalina: se suele combinar con cerámica y emite iones que ayudan a reducir el frizz.',
          'Titanio: calienta rápido y llega a temperaturas altas; es más agresiva y conviene en cabello grueso y con experiencia, bajando la temperatura cuando se pueda.',
        ],
      },
      {
        h: 'Temperatura regulable',
        p: [
          'Tener varios niveles de temperatura es lo más importante para cuidar el cabello: más baja para cabello fino, teñido o dañado, más alta para cabello grueso o muy rizado.',
        ],
      },
      {
        h: 'Ancho de placa y otros detalles',
        p: [
          'Las placas angostas sirven para flequillo y para hacer ondas o rulos; las anchas, para cabello largo y espeso porque cubren más superficie por pasada.',
          'Cable giratorio, apagado automático y luz de encendido son detalles que se agradecen en el uso diario.',
        ],
      },
      {
        h: 'Qué mirar en la ficha antes de pagar',
        p: [
          'Material de las placas y si son flotantes (se ajustan al mechón).',
          'Rango de temperatura y si indica cuánto tarda en calentar.',
          'Largo del cable y garantía.',
        ],
      },
    ],
    cta: { href: '/mejores/mejores-planchitas-y-secadores-de-pelo', titulo: 'Planchitas y secadores en oferta hoy', boton: 'Ver la comparativa de planchitas' },
    comparativa: 'mejores-planchitas-y-secadores-de-pelo',
    faq: [
      {
        q: '¿Qué planchita es mejor para el cabello fino o dañado?',
        a: 'Una con placas de cerámica o turmalina y temperatura regulable, para usar temperaturas bajas y no sobrecalentar el cabello.',
      },
      {
        q: '¿Qué diferencia hay entre cerámica y titanio?',
        a: 'La cerámica reparte el calor parejo y es más suave; el titanio calienta más rápido y llega a temperaturas altas, por eso es más agresivo.',
      },
      {
        q: '¿Conviene una placa angosta o ancha?',
        a: 'Angosta para flequillo, ondas y rulos; ancha para cabello largo y espeso, porque cubre más superficie por pasada.',
      },
    ],
    enlaces: [
      { href: '/mejores/mejores-planchitas-y-secadores-de-pelo', texto: 'Mejores planchitas y secadores en oferta' },
      { href: '/mejores/mejores-afeitadoras-y-cortadoras-de-pelo', texto: 'Mejores afeitadoras y cortadoras' },
      { href: '/guias/como-saber-si-un-descuento-de-mercado-libre-es-real', texto: 'Cómo saber si un descuento es real' },
      { href: '/precio', texto: 'Precio de hoy de cada producto' },
    ],
  },
  {
    slug: 'que-afeitadora-electrica-comprar',
    titulo: '¿Qué afeitadora eléctrica comprar? Rotativa o de láminas',
    descripcion:
      'Cómo elegir una afeitadora eléctrica: rotativa o de láminas, uso en seco o mojado, batería, cabezal flotante y qué conviene según tu piel y tu barba.',
    pregunta: '¿Qué afeitadora eléctrica conviene comprar?',
    respuestaCorta:
      'La de láminas suele dar un afeitado más al ras y es más suave con la piel sensible; la rotativa se adapta mejor a barbas de varios días y a los contornos del rostro. Fijate en que sea recargable, que se pueda lavar y en la autonomía de la batería.',
    secciones: [
      {
        h: 'Rotativa o de láminas',
        p: [
          'La de láminas tiene una malla fina con cuchillas que se mueven detrás: corta al ras y suele ser más suave en piel sensible, sobre todo en cuello y mentón.',
          'La rotativa tiene cabezales circulares que siguen el contorno del rostro y se llevan bien con barbas de varios días, aunque pueden irritar más a algunas pieles.',
        ],
      },
      {
        h: 'En seco o con espuma',
        p: [
          'Muchos modelos funcionan en seco y también con espuma o gel. El uso en mojado suele sentirse más cómodo; confirmá en la ficha si es apta para usar en la ducha.',
        ],
      },
      {
        h: 'Batería y mantenimiento',
        p: [
          'Una recargable con indicador de carga evita quedarte sin batería. Si es lavable, la limpiás bajo la canilla y se mantiene en mejor estado.',
          'Las láminas y cuchillas se desgastan: conviene que existan repuestos fáciles de conseguir.',
        ],
      },
    ],
    cta: { href: '/mejores/mejores-afeitadoras-y-cortadoras-de-pelo', titulo: 'Afeitadoras y cortadoras en oferta hoy', boton: 'Ver la comparativa de afeitadoras' },
    comparativa: 'mejores-afeitadoras-y-cortadoras-de-pelo',
    faq: [
      {
        q: '¿Cuál irrita menos la piel?',
        a: 'En general, la de láminas es más suave. Aun así depende de cada piel: probá en seco o con espuma y elegí el que te resulte más cómodo.',
      },
      {
        q: '¿Una afeitadora eléctrica afeita tan al ras como una hoja?',
        a: 'Suele dejar un afeitado muy prolijo pero un poco menos al ras que una hoja; a cambio es más rápida y menos agresiva.',
      },
      {
        q: '¿Se puede usar en la ducha?',
        a: 'Solo si la ficha del fabricante indica que es resistente al agua o apta para uso en mojado.',
      },
    ],
    enlaces: [
      { href: '/mejores/mejores-afeitadoras-y-cortadoras-de-pelo', texto: 'Mejores afeitadoras y cortadoras en oferta' },
      { href: '/mejores/mejores-planchitas-y-secadores-de-pelo', texto: 'Mejores planchitas y secadores' },
      { href: '/precio', texto: 'Precio de hoy de cada producto' },
    ],
  },
  {
    slug: 'que-auriculares-comprar',
    titulo: '¿Qué auriculares comprar? Bluetooth, in-ear u over-ear y cancelación de ruido',
    descripcion:
      'Cómo elegir auriculares: in-ear, on-ear u over-ear, Bluetooth o con cable, cancelación activa de ruido, autonomía y resistencia al agua según tu uso.',
    pregunta: '¿Qué auriculares conviene comprar?',
    respuestaCorta:
      'Para uso diario y deporte, unos in-ear Bluetooth con buena autonomía y resistencia al agua; para trabajar, viajar o escuchar música en casa, unos over-ear, idealmente con cancelación activa de ruido. Fijate en la autonomía, el micrófono para llamadas y que sean cómodos en uso prolongado.',
    secciones: [
      {
        h: 'Formato: in-ear, on-ear u over-ear',
        p: [
          'In-ear: se meten en el oído, son pequeños y cómodos para salir y hacer deporte.',
          'On-ear: apoyan sobre la oreja, son livianos pero pueden cansar en sesiones largas.',
          'Over-ear: rodean la oreja, aíslan mejor del ruido y suelen ser los más cómodos para escuchar muchas horas.',
        ],
      },
      {
        h: 'Cancelación activa de ruido',
        p: [
          'La cancelación activa (ANC) usa micrófonos para reducir ruidos constantes como motores, aire acondicionado o tránsito. Es muy útil en transporte y oficina; suma costo y consume algo de batería.',
        ],
      },
      {
        h: 'Autonomía, micrófono y resistencia',
        p: [
          'Autonomía: mirá las horas con una carga y cuántas cargas extra trae el estuche.',
          'Micrófono: importa si vas a atender llamadas o videollamadas seguido.',
          'Resistencia al agua: la certificación IPX indica cuánta protección ofrece contra sudor y lluvia; es la que importa para deporte.',
          'Con cable o Bluetooth: el cable no necesita batería y suele ofrecer menos latencia; el Bluetooth es más cómodo.',
        ],
      },
    ],
    categoria: { slug: 'gamer', nombre: 'gamer' },
    cta: { href: '/mejores/cyber-monday-auriculares', titulo: 'Auriculares en oferta hoy', boton: 'Ver auriculares en oferta' },
    faq: [
      {
        q: '¿Vale la pena la cancelación de ruido?',
        a: 'Si viajás en transporte o trabajás en un lugar ruidoso, sí: reduce ruidos constantes y permite escuchar a menor volumen.',
      },
      {
        q: '¿Qué significa IPX en unos auriculares?',
        a: 'Es una certificación de resistencia al agua. A mayor número, mayor protección; para deporte alcanza con una que soporte sudor y lluvia ligera.',
      },
      {
        q: '¿Conviene más Bluetooth o con cable?',
        a: 'Bluetooth por comodidad en el día a día; con cable cuando priorizás cero latencia y no querés depender de la batería.',
      },
    ],
    enlaces: [
      { href: '/guias/que-auriculares-comprar-cyber-monday', texto: 'Auriculares en el Cyber Monday' },
      { href: '/mejores/mejores-smartwatch', texto: 'Mejores smartwatch en oferta' },
      { href: '/guias/que-celular-comprar-segun-presupuesto', texto: 'Qué celular comprar según presupuesto' },
      { href: '/precio', texto: 'Precio de hoy de cada producto' },
    ],
  },
  {
    slug: 'led-qled-u-oled-diferencias-smart-tv',
    titulo: 'LED, QLED u OLED: diferencias entre tipos de pantalla de smart TV',
    descripcion:
      'Qué diferencia hay entre una TV LED, QLED y OLED: cómo se ve el negro, el brillo, el color, el consumo y cuál conviene según la luz de tu living y tu presupuesto.',
    pregunta: '¿Qué diferencia hay entre una TV LED, QLED y OLED?',
    respuestaCorta:
      'Una LED es un panel LCD con retroiluminación LED: es la más económica y suficiente para la mayoría. QLED agrega una capa de puntos cuánticos que mejora el color y el brillo, por eso funciona bien en ambientes luminosos. OLED enciende cada píxel por separado: logra el negro más profundo y el mejor contraste, ideal para ver en la oscuridad.',
    secciones: [
      {
        h: 'LED',
        p: [
          'Es un panel LCD iluminado por LEDs desde atrás o desde los costados. Es la opción más difundida y económica. Los negros se ven más grisáceos que en OLED, pero para uso diario con TV abierta, series y fútbol cumple muy bien.',
        ],
      },
      {
        h: 'QLED',
        p: [
          'Es un LCD con una capa de puntos cuánticos que mejora la pureza del color y permite más brillo. Rinde muy bien en habitaciones con mucha luz natural.',
          'Sigue necesitando retroiluminación, por lo que el negro no es tan profundo como en OLED, aunque los modelos con atenuación local mejoran mucho.',
        ],
      },
      {
        h: 'OLED',
        p: [
          'Cada píxel emite su propia luz y se apaga por completo cuando muestra negro: el contraste y el negro son los mejores del mercado.',
          'Suele tener menos brillo máximo que un QLED, por lo que luce más en ambientes con poca luz. Se recomienda evitar dejar imágenes estáticas por horas.',
        ],
      },
      {
        h: 'Cuál elegir',
        p: [
          'Living luminoso y presupuesto ajustado: LED o QLED.',
          'Querés color y brillo para ver en ambientes luminosos: QLED.',
          'Mirás películas con poca luz y buscás la mejor imagen: OLED.',
          'Más allá del panel, fijate en el tamaño según la distancia de visión, la resolución y el sistema operativo.',
        ],
      },
    ],
    categoria: { slug: 'smart-tv', nombre: 'smart TV' },
    comparativa: 'mejores-smart-tv',
    cta: { href: '/mejores/mejores-smart-tv', titulo: 'Smart TV en oferta hoy, comparadas', boton: 'Ver la comparativa de smart TV' },
    faq: [
      {
        q: '¿Qué es mejor, QLED u OLED?',
        a: 'Depende del uso: QLED rinde más brillo y es ideal para ambientes luminosos; OLED ofrece el mejor negro y contraste, ideal para ver con poca luz.',
      },
      {
        q: '¿Una TV LED es mala?',
        a: 'No: para uso diario cumple muy bien y es la opción más económica. La diferencia se nota más en contraste y negros.',
      },
      {
        q: '¿Un OLED puede quemarse?',
        a: 'Existe el riesgo de retención de imagen si se dejan imágenes estáticas por muchas horas seguidas. En uso normal y variado es poco probable.',
      },
    ],
    enlaces: [
      { href: '/guias/que-smart-tv-comprar', texto: 'Qué smart TV comprar: pulgadas, 4K y sistema' },
      { href: '/mejores/mejores-tv-55-65-pulgadas', texto: 'Mejores TV de 55 y 65 pulgadas' },
      { href: '/guias/que-smart-tv-comprar-cyber-monday', texto: 'Smart TV en el Cyber Monday' },
      { href: '/categoria/smart-tv', texto: 'Smart TV en oferta' },
      { href: '/precio', texto: 'Precio de hoy de cada producto' },
    ],
  },
  {
    slug: 'que-aspiradora-robot-comprar',
    titulo: '¿Qué aspiradora robot comprar? Navegación, succión y mopa',
    descripcion:
      'Cómo elegir un robot aspirador: tipo de navegación (giroscopio, cámara o láser), succión, autonomía, función de trapeado, base de vaciado y qué mirar antes de comprar.',
    pregunta: '¿Qué aspiradora robot conviene comprar?',
    respuestaCorta:
      'Lo que más cambia entre modelos es la navegación: los que mapean la casa con láser o cámara recorren de forma ordenada y evitan obstáculos; los básicos andan al azar. Después fijate en la succión, la autonomía, si trapea y si el tacho es lo bastante grande para tu casa.',
    secciones: [
      {
        h: 'Navegación y mapeo',
        p: [
          'Los modelos básicos usan sensores y recorren al azar. Los de giroscopio avanzan en líneas ordenadas. Los de láser (lidar) o cámara mapean la casa, permiten definir zonas y evitan mejor los obstáculos.',
        ],
      },
      {
        h: 'Succión, autonomía y tacho',
        p: [
          'La succión se informa en pascales (Pa); más no siempre es mejor, pero ayuda con alfombras y pelos de mascotas.',
          'La autonomía define cuántos metros cuadrados cubre con una carga; muchos vuelven solos a la base y retoman la tarea.',
          'Un tacho más grande significa menos vaciados; algunos modelos con base de autovaciado lo hacen solos.',
        ],
      },
      {
        h: 'Trapeado y detalles',
        p: [
          'Algunos incluyen tanque de agua y paño para trapear. Sirve para mantenimiento diario del piso, no reemplaza una fregada profunda.',
          'Mirá la altura que puede superar (umbrales y alfombras), si tiene app y control por voz, y que los cepillos y filtros se consigan de repuesto.',
        ],
      },
    ],
    categoria: { slug: 'aspiradoras', nombre: 'aspiradoras' },
    comparativa: 'mejores-aspiradoras-robot',
    cta: { href: '/mejores/mejores-aspiradoras-robot', titulo: 'Aspiradoras robot en oferta hoy', boton: 'Ver la comparativa de aspiradoras robot' },
    faq: [
      {
        q: '¿Qué es mejor, navegación láser o por cámara?',
        a: 'Ambas mapean la casa. El láser (lidar) funciona bien con poca luz; la cámara puede reconocer algunos objetos pero necesita buena iluminación.',
      },
      {
        q: '¿Un robot aspirador reemplaza a la aspiradora común?',
        a: 'Mantiene el piso limpio a diario, pero para limpieza profunda, escaleras y rincones conviene tener una aspiradora tradicional.',
      },
      {
        q: '¿Sirve en casas con mascotas?',
        a: 'Sí, sobre todo si tiene buena succión y un cepillo que no se enrede con pelos. Hay que limpiar los cepillos con frecuencia.',
      },
    ],
    enlaces: [
      { href: '/guias/que-aspiradora-comprar', texto: 'Qué aspiradora comprar' },
      { href: '/mejores/mejores-aspiradoras', texto: 'Mejores aspiradoras en oferta' },
      { href: '/categoria/aspiradoras', texto: 'Aspiradoras en oferta' },
      { href: '/precio', texto: 'Precio de hoy de cada producto' },
    ],
  },
  {
    slug: 'como-leer-medida-neumatico',
    titulo: 'Cómo leer la medida de un neumático: 205/55 R16 91V explicado',
    descripcion:
      'Qué significa cada número de la medida de un neumático (ancho, perfil, radial, llanta, índice de carga y velocidad) y cómo ver la fecha de fabricación DOT.',
    pregunta: '¿Cómo se lee la medida de un neumático?',
    respuestaCorta:
      'En 205/55 R16 91V: 205 es el ancho en milímetros, 55 es el perfil (la altura del flanco como porcentaje del ancho), R indica construcción radial, 16 es el diámetro de la llanta en pulgadas, 91 es el índice de carga y V el índice de velocidad. La fecha de fabricación está en el código DOT: las cuatro últimas cifras son semana y año.',
    secciones: [
      {
        h: 'Los números del flanco, uno por uno',
        p: [
          'Ejemplo: 205/55 R16 91V. El primer número (205) es el ancho de la banda de rodamiento en milímetros.',
          'El segundo (55) es el perfil: la altura del flanco expresada como porcentaje del ancho. Un perfil menor significa un flanco más bajo.',
          'La letra R indica construcción radial, la habitual hoy. El 16 es el diámetro de la llanta en pulgadas: tiene que coincidir con tu rodado.',
        ],
      },
      {
        h: 'Índice de carga y de velocidad',
        p: [
          'El 91 es el índice de carga: un código que corresponde a un peso máximo por neumático según una tabla estandarizada.',
          'La letra final (V en el ejemplo) es el índice de velocidad máxima para la que está homologado. No conviene bajar de lo que indica el manual de tu auto.',
        ],
      },
      {
        h: 'La fecha de fabricación (DOT)',
        p: [
          'Buscá en el flanco la sigla DOT seguida de un código. Las últimas cuatro cifras son la semana y el año de fabricación: 2423 significa semana 24 de 2023.',
          'Un neumático sin uso pero muy viejo igual envejece el caucho, así que conviene mirar la fecha antes de comprar.',
        ],
      },
      {
        h: 'Qué medida poner en tu auto',
        p: [
          'La medida original está en el manual, en una etiqueta en el marco de la puerta del conductor o en el flanco de los neumáticos actuales.',
          'Si querés cambiar de medida, hacelo con asesoramiento de un gomero de confianza: el diámetro total tiene que quedar parecido al original.',
        ],
      },
    ],
    categoria: { slug: 'vehiculos', nombre: 'vehículos' },
    comparativa: 'mejores-neumaticos',
    cta: { href: '/mejores/mejores-neumaticos', titulo: 'Neumáticos en oferta hoy, comparados', boton: 'Ver la comparativa de neumáticos' },
    faq: [
      {
        q: '¿Qué significa la R en la medida de un neumático?',
        a: 'Indica construcción radial, que es la que usan prácticamente todos los neumáticos de auto actuales.',
      },
      {
        q: '¿Puedo usar un neumático con otro índice de velocidad?',
        a: 'Conviene respetar como mínimo el que indica el fabricante del auto. Uno con índice menor no está pensado para la velocidad que puede alcanzar tu vehículo.',
      },
      {
        q: '¿Cómo sé qué tan viejo es un neumático?',
        a: 'Mirá el código DOT en el flanco: las últimas cuatro cifras son la semana y el año de fabricación.',
      },
    ],
    enlaces: [
      { href: '/guias/cuando-cambiar-los-neumaticos', texto: 'Cuándo cambiar los neumáticos' },
      { href: '/mejores/mejores-neumaticos', texto: 'Mejores neumáticos en oferta' },
      { href: '/categoria/vehiculos', texto: 'Vehículos y repuestos en oferta' },
      { href: '/precio', texto: 'Precio de hoy de cada producto' },
    ],
  },
  {
    slug: 'cuando-cambiar-los-neumaticos',
    titulo: 'Cuándo cambiar los neumáticos: desgaste, edad y señales',
    descripcion:
      'Cómo saber si hay que cambiar los neumáticos: profundidad mínima del dibujo (indicador TWI de 1,6 mm), edad, grietas, deformaciones y desgaste irregular.',
    pregunta: '¿Cuándo hay que cambiar los neumáticos?',
    respuestaCorta:
      'Cuando el dibujo llega a 1,6 mm (los indicadores TWI quedan a ras de la banda), cuando hay grietas, cortes o deformaciones en el flanco, o cuando son muy viejos aunque tengan dibujo. Revisalos cada tanto: el desgaste irregular suele avisar de problemas de alineación o presión.',
    secciones: [
      {
        h: 'El dibujo: el límite de 1,6 mm',
        p: [
          'Los neumáticos traen indicadores de desgaste (TWI) en los surcos principales. Cuando la banda queda a ras con ellos, el dibujo llegó a 1,6 mm y hay que cambiarlos.',
          'Con poco dibujo aumenta la distancia de frenado en piso mojado y el riesgo de aquaplaning.',
        ],
      },
      {
        h: 'Edad y estado del caucho',
        p: [
          'El caucho envejece aunque el auto ande poco. Revisá la fecha en el código DOT y desconfiá de neumáticos muy viejos, sobre todo si tienen microgrietas.',
          'Grietas, cortes, ampollas o deformaciones en el flanco son motivo de cambio inmediato.',
        ],
      },
      {
        h: 'Desgaste irregular',
        p: [
          'Si se gastan más de un lado, puede haber problemas de alineación o de presión. Corregir la causa antes de poner neumáticos nuevos evita repetirlo.',
          'Rotarlos cada cierto kilometraje, según indique el fabricante, ayuda a que se gasten parejo.',
        ],
      },
      {
        h: 'Antes de comprar',
        p: [
          'Confirmá la medida original en el manual o en el flanco. Si tenés dudas, mirá la guía de cómo leer la medida.',
          'Cambiá siempre de a pares por eje como mínimo, para mantener el comportamiento del auto.',
        ],
      },
    ],
    categoria: { slug: 'vehiculos', nombre: 'vehículos' },
    comparativa: 'mejores-neumaticos',
    cta: { href: '/mejores/mejores-neumaticos', titulo: 'Neumáticos en oferta hoy, comparados', boton: 'Ver la comparativa de neumáticos' },
    faq: [
      {
        q: '¿Con cuántos milímetros hay que cambiar un neumático?',
        a: 'El límite de uso es 1,6 mm de profundidad de dibujo. Muchos conductores los cambian antes para mejorar el agarre en piso mojado.',
      },
      {
        q: '¿Los neumáticos vencen aunque no se usen?',
        a: 'El caucho envejece con el tiempo. Revisá la fecha de fabricación (DOT) y el estado del flanco.',
      },
      {
        q: '¿Hay que cambiar los cuatro a la vez?',
        a: 'Lo ideal es cambiar al menos de a pares por eje, con la misma medida y características.',
      },
    ],
    enlaces: [
      { href: '/guias/como-leer-medida-neumatico', texto: 'Cómo leer la medida de un neumático' },
      { href: '/mejores/mejores-neumaticos', texto: 'Mejores neumáticos en oferta' },
      { href: '/categoria/vehiculos', texto: 'Vehículos y repuestos en oferta' },
      { href: '/precio', texto: 'Precio de hoy de cada producto' },
    ],
  },
  {
    slug: 'cuantos-gb-necesito-celular',
    titulo: 'Cuántos GB necesito en un celular: almacenamiento y RAM',
    descripcion:
      'Cuánto almacenamiento y cuánta RAM conviene según tu uso: fotos, videos, juegos y apps. Diferencia entre GB de memoria interna y de RAM.',
    pregunta: '¿Cuántos GB necesito en un celular?',
    respuestaCorta:
      'Para uso básico (WhatsApp, redes, algunas fotos) alcanzan 64 a 128 GB de almacenamiento; si sacás muchas fotos y videos o instalás juegos, 256 GB. La RAM es otra cosa: 4 a 6 GB para uso cotidiano y 8 GB o más para juegos y multitarea. Ojo: el sistema ocupa parte del almacenamiento.',
    secciones: [
      {
        h: 'Almacenamiento y RAM no son lo mismo',
        p: [
          'El almacenamiento (memoria interna) es donde guardás apps, fotos, videos y archivos. La RAM es la memoria de trabajo: cuánto puede tener abierto el celular a la vez.',
          'Se suelen mostrar juntas, por ejemplo 8/256 GB: 8 de RAM y 256 de almacenamiento.',
        ],
      },
      {
        h: 'Cuánto almacenamiento según tu uso',
        p: [
          'Uso básico (mensajes, redes, pocas fotos): 64 a 128 GB.',
          'Muchas fotos y videos, música offline y varias apps: 128 a 256 GB.',
          'Juegos pesados, video en alta resolución o si no usás la nube: 256 GB o más.',
          'Parte del espacio lo ocupa el sistema y las apps preinstaladas, así que el disponible es menor al que figura en la ficha.',
        ],
      },
      {
        h: 'Cuánta RAM',
        p: [
          'Para el uso cotidiano, 4 a 6 GB alcanzan. Con 8 GB o más tenés más margen para juegos y para tener muchas apps abiertas sin que se recarguen.',
          'Más RAM no compensa un procesador flojo: mirá el conjunto.',
        ],
      },
      {
        h: 'Tarjeta microSD y nube',
        p: [
          'No todos los celulares aceptan tarjeta microSD: confirmalo en la ficha.',
          'Usar la nube para fotos y archivos permite comprar menos almacenamiento, siempre que tengas buena conexión.',
        ],
      },
    ],
    categoria: { slug: 'celulares', nombre: 'celulares' },
    comparativa: 'mejores-celulares',
    cta: { href: '/mejores/mejores-celulares', titulo: 'Celulares en oferta hoy, comparados', boton: 'Ver la comparativa de celulares' },
    faq: [
      {
        q: '¿128 GB alcanzan hoy?',
        a: 'Para la mayoría del uso cotidiano sí, sobre todo si usás la nube para fotos. Si grabás mucho video o instalás juegos pesados, conviene 256 GB.',
      },
      {
        q: '¿Cuál es la diferencia entre RAM y almacenamiento?',
        a: 'La RAM es la memoria de trabajo del equipo; el almacenamiento es donde guardás tus archivos y apps.',
      },
      {
        q: '¿Se puede ampliar la memoria con una microSD?',
        a: 'Solo en los modelos que tienen ranura para tarjeta. Revisá la ficha técnica antes de comprar.',
      },
    ],
    enlaces: [
      { href: '/guias/que-celular-comprar-segun-presupuesto', texto: 'Qué celular comprar según tu presupuesto' },
      { href: '/mejores/mejores-celulares', texto: 'Mejores celulares en oferta' },
      { href: '/categoria/celulares', texto: 'Celulares en oferta' },
      { href: '/precio', texto: 'Precio de hoy de cada producto' },
    ],
  },
  {
    slug: 'que-iphone-comprar',
    titulo: '¿Qué iPhone comprar? Modelo, almacenamiento y qué pagar de más',
    descripcion:
      'Cómo elegir un iPhone: diferencias entre modelo base, Plus, Pro y Pro Max, cuánto almacenamiento conviene, si vale la pena un modelo anterior y qué revisar al comprar.',
    pregunta: '¿Qué iPhone conviene comprar?',
    respuestaCorta:
      'Si no necesitás las cámaras más avanzadas, el modelo base o uno de la generación anterior suele ser la mejor relación precio-prestación. Los Pro suman mejores cámaras y pantalla; el almacenamiento es lo que más cuesta ampliar después, así que elegilo según cuántas fotos y videos guardás.',
    secciones: [
      {
        h: 'Base, Plus, Pro y Pro Max',
        p: [
          'El modelo base cubre el uso cotidiano: buena cámara, buen rendimiento y años de actualizaciones de software.',
          'Los modelos Pro suman cámaras adicionales y mejoras de pantalla; los Max son simplemente más grandes. Pagás de más por funciones que tal vez no uses.',
        ],
      },
      {
        h: 'Cuánto almacenamiento elegir',
        p: [
          'No se puede ampliar con tarjeta: lo que elegís al comprar es lo que tenés.',
          'Si guardás pocas fotos y usás la nube, alcanza con la capacidad más baja; si grabás mucho video, conviene subir un escalón.',
        ],
      },
      {
        h: 'Nuevo o generación anterior',
        p: [
          'Un modelo de la generación anterior suele ser más barato y cubre casi todo lo que usa la mayoría. Compará la diferencia de precio contra lo que realmente cambia.',
        ],
      },
      {
        h: 'Qué revisar antes de pagar',
        p: [
          'Que el vendedor sea oficial o un distribuidor autorizado y que figure la garantía.',
          'Modelo exacto y almacenamiento en la ficha, y si incluye cargador y cable.',
          'Que el precio no esté inflado: compará con el historial.',
        ],
      },
    ],
    categoria: { slug: 'celulares', nombre: 'celulares' },
    comparativa: 'mejores-iphone',
    cta: { href: '/mejores/mejores-iphone', titulo: 'iPhone en oferta hoy, comparados', boton: 'Ver la comparativa de iPhone' },
    faq: [
      {
        q: '¿Conviene comprar un iPhone de la generación anterior?',
        a: 'Si la diferencia de precio es grande y no necesitás las novedades de cámara, suele ser la mejor compra.',
      },
      {
        q: '¿Qué almacenamiento elegir?',
        a: 'Depende de cuántas fotos y videos guardes y de si usás la nube. No se puede ampliar después, así que conviene no quedarse justo.',
      },
      {
        q: '¿Cómo sé que el iPhone es original?',
        a: 'Comprá a vendedores oficiales o distribuidores autorizados y revisá que figure la garantía en la publicación.',
      },
    ],
    enlaces: [
      { href: '/guias/que-celular-gama-alta-comprar', texto: 'Qué celular de gama alta comprar' },
      { href: '/guias/cuantos-gb-necesito-celular', texto: 'Cuántos GB necesito en un celular' },
      { href: '/mejores/mejores-iphone', texto: 'Mejores iPhone en oferta' },
      { href: '/precio', texto: 'Precio de hoy de cada producto' },
    ],
  },
  {
    slug: 'que-monitor-gamer-comprar',
    titulo: 'Qué monitor gamer comprar: Hz, tiempo de respuesta y panel',
    descripcion:
      'Cómo elegir un monitor gamer: tasa de refresco en Hz, tiempo de respuesta, tipo de panel (IPS, VA, TN), resolución y tamaño, según tu placa de video y tu presupuesto.',
    pregunta: '¿Qué monitor gamer conviene comprar?',
    respuestaCorta:
      'Para la mayoría, un monitor Full HD de 24 a 27 pulgadas con 144 Hz y panel IPS es el punto dulce. Los Hz solo se aprovechan si tu PC genera esos cuadros por segundo, así que ajustá la resolución y la tasa de refresco a tu placa de video.',
    secciones: [
      {
        h: 'Hz: la tasa de refresco',
        p: [
          'Un monitor de 60 Hz muestra 60 imágenes por segundo; uno de 144 Hz o más se ve más fluido en juegos rápidos.',
          'Para aprovecharlos, tu PC tiene que entregar esos cuadros por segundo. Si no, pagás de más.',
        ],
      },
      {
        h: 'Tiempo de respuesta y panel',
        p: [
          'El tiempo de respuesta (ms) indica qué tan rápido cambia un píxel; menor es mejor para evitar el efecto estela.',
          'IPS tiene mejores colores y ángulos de visión; VA, mejor contraste; TN, el más rápido pero con peores colores.',
        ],
      },
      {
        h: 'Resolución y tamaño',
        p: [
          'Full HD en 24 a 27 pulgadas es lo más exigente que cualquier placa media mueve bien. 2K o 4K piden una placa potente.',
          'Elegí el tamaño según la distancia a la que te sentás.',
        ],
      },
      {
        h: 'Qué mirar en la ficha',
        p: [
          'Hz reales (no solo "overclock"), tiempo de respuesta, tipo de panel y resolución.',
          'Conexiones: HDMI o DisplayPort según tu placa, y que el soporte sea ajustable.',
          'Garantía y si el envío es gratis.',
        ],
      },
    ],
    categoria: { slug: 'monitores', nombre: 'monitores' },
    comparativa: 'mejores-monitores-gamer',
    cta: { href: '/mejores/mejores-monitores-gamer', titulo: 'Monitores gamer en oferta hoy', boton: 'Ver la comparativa de monitores gamer' },
    faq: [
      {
        q: '¿144 Hz se nota frente a 60 Hz?',
        a: 'Sí, en juegos rápidos y siempre que tu PC genere esos cuadros por segundo. Para uso de oficina casi no se nota.',
      },
      {
        q: '¿IPS, VA o TN para gaming?',
        a: 'IPS es el equilibrio entre colores y velocidad; TN es el más rápido y VA ofrece mejor contraste. Para la mayoría conviene IPS.',
      },
      {
        q: '¿Vale la pena un monitor 4K para jugar?',
        a: 'Solo si tu placa de video lo mueve con fluidez. Con una placa media, Full HD o 2K rinden mejor.',
      },
    ],
    enlaces: [
      { href: '/guias/que-monitor-comprar', texto: 'Qué monitor comprar' },
      { href: '/guias/que-silla-gamer-comprar', texto: 'Qué silla gamer comprar' },
      { href: '/mejores/mejores-monitores-gamer', texto: 'Mejores monitores gamer en oferta' },
      { href: '/categoria/monitores', texto: 'Monitores en oferta' },
    ],
  },
  {
    slug: 'que-samsung-galaxy-comprar',
    titulo: 'Qué Samsung Galaxy comprar: serie A, S o Z, según tu uso',
    descripcion:
      'Cómo elegir un Samsung Galaxy: diferencias entre la serie A (gama media y de entrada), la S (gama alta) y la Z (plegables), y qué mirar en la ficha antes de comprar.',
    pregunta: '¿Qué Samsung Galaxy conviene comprar?',
    respuestaCorta:
      'La serie A cubre gama de entrada y media con la mejor relación precio-prestación; la serie S es la gama alta, con mejores cámaras y pantalla; la serie Z son los plegables. Para la mayoría alcanza con un A de gama media; la S se justifica si usás mucho la cámara o querés más años de rendimiento.',
    secciones: [
      {
        h: 'Serie A: la más vendida',
        p: [
          'Reúne desde modelos de entrada hasta gama media. Suele tener buena pantalla y batería, con menos potencia y cámara que la serie S.',
        ],
      },
      {
        h: 'Serie S: gama alta',
        p: [
          'Procesador más potente, mejores cámaras y pantalla, y en general más años de rendimiento fluido. Cuesta bastante más.',
        ],
      },
      {
        h: 'Serie Z: plegables',
        p: [
          'Son los plegables: pantalla grande que se pliega. Son una compra de nicho; mirá bien el uso real antes de pagar la diferencia.',
        ],
      },
      {
        h: 'Qué mirar en la ficha',
        p: [
          'Almacenamiento y RAM, capacidad de batería y tipo de pantalla.',
          'Si tiene versión con más memoria a un precio razonable.',
          'Garantía oficial y envío gratis.',
        ],
      },
    ],
    categoria: { slug: 'celulares', nombre: 'celulares' },
    comparativa: 'mejores-samsung-galaxy',
    cta: { href: '/mejores/mejores-samsung-galaxy', titulo: 'Samsung Galaxy en oferta hoy', boton: 'Ver la comparativa de Samsung Galaxy' },
    faq: [
      {
        q: '¿Qué diferencia hay entre la serie A y la serie S?',
        a: 'La A es gama de entrada y media; la S es gama alta, con más potencia, mejores cámaras y pantalla, y precio mayor.',
      },
      {
        q: '¿Conviene un Galaxy A de gama media?',
        a: 'Para uso cotidiano suele ser la mejor relación precio-prestación.',
      },
      {
        q: '¿Vale la pena un plegable?',
        a: 'Solo si te interesa la pantalla grande o el formato; es más caro y de uso específico.',
      },
    ],
    enlaces: [
      { href: '/guias/que-celular-comprar-segun-presupuesto', texto: 'Qué celular comprar según tu presupuesto' },
      { href: '/guias/cuantos-gb-necesito-celular', texto: 'Cuántos GB necesito en un celular' },
      { href: '/mejores/mejores-samsung-galaxy', texto: 'Mejores Samsung Galaxy en oferta' },
      { href: '/ofertas/samsung-en-oferta', texto: 'Samsung en oferta' },
    ],
  },
  {
    slug: 'lavasecarropas-secarropas-o-bomba-de-calor',
    titulo: 'Lavasecarropas, lavarropas + secarropas o bomba de calor: cuál conviene',
    descripcion:
      'Diferencias entre un lavasecarropas (todo en uno), un lavarropas con secarropas aparte y un secarropas con bomba de calor: espacio, tiempo, consumo y qué elegir según tu casa.',
    pregunta: '¿Conviene un lavasecarropas o un lavarropas con secarropas aparte?',
    respuestaCorta:
      'Si tenés poco lugar, el lavasecarropas (lava y seca en la misma máquina) resuelve todo en un solo equipo, aunque el secado es más lento y suele admitir menos ropa que el lavado. Si tenés espacio y lavás mucho, dos equipos separados (lavarropas más secarropas) son más rápidos; y el secarropas con bomba de calor seca con menos consumo que uno común, a costa de un precio mayor.',
    secciones: [
      {
        h: 'Lavasecarropas: un solo equipo para lavar y secar',
        p: [
          'Es una máquina que lava y seca en el mismo tambor. Ocupa el lugar de un solo electrodoméstico, lo que ayuda en departamentos o lavaderos chicos.',
          'Lo habitual es que la capacidad de secado sea menor que la de lavado: si lavás una carga completa, es probable que tengas que secar en dos tandas. Además el ciclo completo de lavar y secar lleva más tiempo.',
        ],
      },
      {
        h: 'Lavarropas más secarropas: dos equipos',
        p: [
          'Con dos equipos, mientras uno seca el otro puede lavar la siguiente carga. Es más rápido para una familia que lava a diario.',
          'Ojo con el nombre: en Argentina muchos "secarropas" son centrífugos, que solo exprimen el agua girando; no secan con calor. Revisá en la ficha si dice centrifugado o secado por calor, porque son productos muy distintos.',
        ],
      },
      {
        h: 'Secarropas con bomba de calor',
        p: [
          'Seca con calor a menor temperatura que un secarropas convencional por resistencia. Eso suele traducirse en menor consumo de energía y menos castigo para las telas.',
          'En general no necesita sacar el aire caliente al exterior: junta el agua en un depósito o la desagota. A cambio, el precio de compra es más alto y el ciclo puede ser más largo.',
        ],
      },
      {
        h: 'Qué mirar en la ficha antes de pagar',
        p: [
          'Capacidad de lavado y, por separado, capacidad de secado en kilos.',
          'Si es de carga frontal (la que se usa para lavasecarropas) y las medidas, para confirmar que entra por la puerta y el lugar.',
          'Eficiencia energética y consumo de agua informados por el fabricante.',
          'Garantía y si el envío es gratis; son equipos pesados.',
        ],
      },
    ],
    categoria: { slug: 'lavarropas', nombre: 'lavarropas' },
    comparativa: 'mejores-lavarropas',
    cta: { href: '/mejores/mejores-lavarropas', titulo: 'Lavarropas y lavasecarropas en oferta hoy', boton: 'Ver la comparativa de lavarropas' },
    faq: [
      {
        q: '¿Un lavasecarropas seca tanta ropa como lava?',
        a: 'En general no: la capacidad de secado suele ser menor que la de lavado. Mirá los dos números en la ficha técnica.',
      },
      {
        q: '¿Qué es un secarropas centrífugo?',
        a: 'Un equipo que solo exprime el agua girando a alta velocidad. No seca con calor, así que la ropa sale húmeda aunque mucho menos mojada.',
      },
      {
        q: '¿Vale la pena la bomba de calor?',
        a: 'Si secás mucha ropa seguido, el menor consumo puede compensar el precio más alto. Si lo vas a usar poco, un secarropas convencional alcanza.',
      },
    ],
    enlaces: [
      { href: '/guias/que-lavarropas-comprar', texto: 'Qué lavarropas comprar' },
      { href: '/mejores/mejores-lavarropas', texto: 'Mejores lavarropas en oferta' },
      { href: '/categoria/lavarropas', texto: 'Lavarropas en oferta' },
      { href: '/guias/que-termotanque-comprar', texto: 'Qué termotanque comprar' },
      { href: '/precio', texto: 'Precio de hoy de cada producto' },
    ],
  },
  {
    slug: 'sommier-o-colchon-cual-conviene',
    titulo: 'Sommier o colchón: cuál conviene y qué incluye cada uno',
    descripcion:
      'Diferencia entre sommier (colchón con base) y colchón solo: qué necesitás ya tener, medidas, altura, soporte y cuándo conviene cada uno.',
    pregunta: '¿Conviene comprar un sommier o solo el colchón?',
    respuestaCorta:
      'Un sommier es el colchón más su base (el "box") en un conjunto; sirve si todavía no tenés dónde apoyar el colchón. Si ya tenés una cama o una base en buen estado y de la medida correcta, comprar solo el colchón sale más barato. Lo clave es que la medida coincida y que la base sostenga el colchón sin hundirse.',
    secciones: [
      {
        h: 'Qué es cada cosa',
        p: [
          'El colchón es la parte blanda donde dormís. El sommier es el conjunto de colchón y base (también llamada box o somier), que reemplaza a una cama con patas o somier de tablas.',
          'Hay sommiers que ya traen patas y sommiers para apoyar sobre una cama armada. Revisá cuál es en la ficha del producto.',
        ],
      },
      {
        h: 'Cuándo conviene el sommier',
        p: [
          'Si estás armando el dormitorio desde cero o tu base actual está hundida o no es de la medida que querés.',
          'Un conjunto completo suele ser práctico porque colchón y base están pensados para trabajar juntos.',
        ],
      },
      {
        h: 'Cuándo conviene solo el colchón',
        p: [
          'Si tenés una cama o base firme y de la medida exacta, no hace falta pagar otra base.',
          'Una base en mal estado arruina un colchón nuevo: tiene que ser pareja y sin partes que se hundan.',
        ],
      },
      {
        h: 'Qué mirar antes de pagar',
        p: [
          'La medida exacta (por ejemplo 1 plaza, 2 plazas, queen o king) y el largo, para que coincida con tu cama o con el lugar.',
          'La altura total del conjunto: con base y patas puede quedar muy alto o muy bajo.',
          'El tipo de relleno (resortes o espuma) y la firmeza, que depende de tu peso y de cómo dormís.',
          'Si el envío es gratis y cómo se entrega: son bultos grandes y pesados, y conviene confirmar que pasan por la puerta.',
        ],
      },
    ],
    categoria: { slug: 'colchones', nombre: 'colchones' },
    comparativa: 'mejores-sommiers',
    cta: { href: '/mejores/mejores-sommiers', titulo: 'Sommiers en oferta hoy, comparados', boton: 'Ver la comparativa de sommiers' },
    faq: [
      {
        q: '¿El sommier incluye el colchón?',
        a: 'Depende del producto: muchos se venden como conjunto (colchón y base) y otros solo la base. Fijate en el título y la descripción qué trae.',
      },
      {
        q: '¿Puedo usar un colchón nuevo sobre una base vieja?',
        a: 'Sí, siempre que la base sea de la medida correcta, pareja y no esté hundida. Si no, el colchón nuevo se deforma antes.',
      },
      {
        q: '¿Qué medida de sommier elijo?',
        a: 'La del colchón que querés usar: 1 plaza, 2 plazas, queen o king. Medí el lugar donde va y confirmá el largo.',
      },
    ],
    enlaces: [
      { href: '/guias/que-colchon-comprar-firmeza-y-material', texto: 'Qué colchón comprar: firmeza y material' },
      { href: '/mejores/mejores-sommiers', texto: 'Mejores sommiers en oferta' },
      { href: '/mejores/mejores-colchones-2-plazas', texto: 'Mejores colchones de 2 plazas' },
      { href: '/categoria/colchones', texto: 'Colchones en oferta' },
      { href: '/precio', texto: 'Precio de hoy de cada producto' },
    ],
  },
  {
    slug: 'que-motorola-comprar-moto-g-o-edge',
    titulo: 'Motorola Moto G o Edge: cuál conviene comprar',
    descripcion:
      'Cómo elegir entre las líneas Moto G y Moto Edge de Motorola: diferencias generales, qué mirar en RAM, almacenamiento, NFC y 5G, y para quién sirve cada una.',
    pregunta: '¿Conviene un Motorola Moto G o un Edge?',
    respuestaCorta:
      'En general la línea Moto G apunta a la gama de entrada y media, con buen precio para uso cotidiano; la línea Edge suele ser de gama media-alta, con más prestaciones y mayor precio. Dentro de cada una cambia mucho de un modelo a otro, así que lo que decide es la ficha: RAM, almacenamiento, NFC, 5G y batería.',
    secciones: [
      {
        h: 'Moto G: la línea de uso diario',
        p: [
          'Es la familia más amplia de Motorola y la que suele tener los precios más accesibles. Sirve para mensajes, redes, fotos y videos sin pedirle demasiado.',
          'Dentro de la línea hay modelos muy distintos; mirá la ficha del modelo puntual en vez de asumir que todos los Moto G son iguales.',
        ],
      },
      {
        h: 'Moto Edge: un paso hacia la gama alta',
        p: [
          'Edge suele ubicarse arriba de la línea G, con más prestaciones. Es la opción si querés más rendimiento o mejores componentes sin llegar a lo más caro del mercado.',
          'El precio es mayor, así que conviene comparar contra los Moto G más completos antes de decidir.',
        ],
      },
      {
        h: 'Qué mirar en la ficha de cualquier modelo',
        p: [
          'RAM y almacenamiento interno: son lo que más se nota con el tiempo. Si guardás muchas fotos o apps, evitá quedarte corto.',
          'NFC, si querés pagar con el celular; y 5G, si lo necesitás en tu zona.',
          'Capacidad de la batería y si trae cargador en la caja.',
          'Si es un modelo oficial para Argentina y qué garantía ofrece el vendedor.',
        ],
      },
    ],
    categoria: { slug: 'celulares', nombre: 'celulares' },
    comparativa: 'mejores-motorola',
    cta: { href: '/mejores/mejores-motorola', titulo: 'Motorola en oferta hoy, comparados', boton: 'Ver la comparativa de Motorola' },
    faq: [
      {
        q: '¿Qué diferencia hay entre Moto G y Moto Edge?',
        a: 'En general, Moto G es gama de entrada y media y Edge es gama media-alta, con más prestaciones y mayor precio. Dentro de cada línea los modelos varían bastante.',
      },
      {
        q: '¿Qué conviene mirar primero?',
        a: 'La RAM y el almacenamiento, después NFC y 5G, y por último la batería. El nombre de la línea importa menos que esos datos.',
      },
      {
        q: '¿Conviene más memoria o un modelo más nuevo?',
        a: 'Para uso diario suele convenir más memoria interna y RAM antes que un modelo apenas más nuevo con menos almacenamiento.',
      },
    ],
    enlaces: [
      { href: '/guias/que-celular-comprar-segun-presupuesto', texto: 'Qué celular comprar según tu presupuesto' },
      { href: '/guias/cuantos-gb-necesito-celular', texto: 'Cuántos GB necesito en un celular' },
      { href: '/mejores/mejores-motorola', texto: 'Mejores Motorola en oferta' },
      { href: '/mejores/mejores-celulares', texto: 'Mejores celulares en oferta' },
      { href: '/categoria/celulares', texto: 'Celulares en oferta' },
    ],
  },
  {
    slug: 'aire-acondicionado-solo-frio-o-frio-calor',
    titulo: 'Aire acondicionado solo frío o frío-calor: cuál conviene',
    descripcion:
      'Diferencia entre un split solo frío y uno frío-calor (bomba de calor): para qué sirve cada uno, qué clima te conviene y cuándo vale la pena pagar de más.',
    pregunta: '¿Conviene un aire acondicionado solo frío o frío-calor?',
    respuestaCorta:
      'Un split frío-calor enfría en verano y también calefacciona en invierno usando la misma unidad; el solo frío únicamente enfría y suele costar menos. Si vas a usarlo todo el año o no tenés otra calefacción, el frío-calor suele convenir; si solo lo necesitás para el verano, el solo frío alcanza.',
    secciones: [
      {
        h: 'Qué hace cada uno',
        p: [
          'El solo frío saca el calor del ambiente y lo manda afuera. Funciona únicamente para refrescar.',
          'El frío-calor (bomba de calor) puede invertir el ciclo: en invierno toma calor del exterior y lo entrega adentro. Es un equipo que sirve en las dos estaciones.',
        ],
      },
      {
        h: 'Cuándo conviene el frío-calor',
        p: [
          'Si no tenés calefacción central o querés evitar estufas, porque calefaccionar con bomba de calor suele consumir menos energía que una estufa eléctrica común.',
          'Si el aire va en un ambiente que usás todo el año, como un dormitorio o una oficina.',
        ],
      },
      {
        h: 'Cuándo alcanza el solo frío',
        p: [
          'Si ya tenés una calefacción que te alcanza y solo querés combatir el calor del verano.',
          'Si el presupuesto es lo principal: el modelo solo frío suele ser más barato. Compará igual contra el frío-calor del mismo fabricante y capacidad, porque a veces la diferencia es chica.',
        ],
      },
      {
        h: 'Qué mirar en la ficha antes de pagar',
        p: [
          'Que diga explícitamente "frío/calor" o "bomba de calor" si querés calefaccionar.',
          'Las frigorías (y las calorías informadas) para tu ambiente: mirá la guía de cálculo de frigorías.',
          'Si es inverter, que regula la potencia y suele gastar menos.',
          'La instalación: casi todos los split necesitan instalador y no suele estar incluida en el precio.',
        ],
      },
    ],
    categoria: { slug: 'aire-acondicionado', nombre: 'aires acondicionados' },
    comparativa: 'mejores-aires-acondicionados',
    cta: { href: '/mejores/mejores-aires-acondicionados', titulo: 'Aires acondicionados en oferta hoy, comparados', boton: 'Ver la comparativa de aires' },
    faq: [
      {
        q: '¿El aire frío-calor calefacciona bien en invierno?',
        a: 'Sí en climas templados; en frío extremo pierde rendimiento. Para una casa en Buenos Aires u otras zonas templadas suele alcanzar para un ambiente.',
      },
      {
        q: '¿Gasta más electricidad que una estufa?',
        a: 'En general gasta menos para entregar la misma cantidad de calor, porque mueve calor en vez de generarlo con una resistencia.',
      },
      {
        q: '¿La instalación viene incluida?',
        a: 'Normalmente no. Consultá con el vendedor o un instalador matriculado y sumalo al presupuesto.',
      },
    ],
    enlaces: [
      { href: '/guias/cuantas-frigorias-necesito-aire-acondicionado', texto: 'Cuántas frigorías necesito' },
      { href: '/guias/aire-acondicionado-inverter-o-convencional', texto: 'Aire inverter o convencional' },
      { href: '/mejores/mejores-aires-acondicionados', texto: 'Mejores aires acondicionados en oferta' },
      { href: '/categoria/aire-acondicionado', texto: 'Aires acondicionados en oferta' },
      { href: '/precio', texto: 'Precio de hoy de cada producto' },
    ],
  },
  {
    slug: 'tablet-o-notebook-cual-conviene',
    titulo: 'Tablet o notebook: cuál conviene según lo que hacés',
    descripcion:
      'Cuándo alcanza una tablet y cuándo necesitás una notebook: estudiar, trabajar, mirar contenido o jugar. Diferencias de teclado, programas, batería y precio.',
    pregunta: '¿Conviene más una tablet o una notebook?',
    respuestaCorta:
      'Una tablet es mejor para mirar contenido, leer, dibujar y llevar a todos lados; una notebook es mejor para escribir mucho, trabajar con planillas o programas completos y tener varias ventanas abiertas. Si vas a estudiar o trabajar la mayor parte del día, la notebook rinde más; si es para consumo y uso liviano, una tablet alcanza.',
    secciones: [
      {
        h: 'Cuándo alcanza una tablet',
        p: [
          'Para ver series y videos, leer, videollamadas, juegos livianos y tareas simples. Es más liviana y la batería suele durar bastante.',
          'Con un teclado externo se puede escribir más cómodo, pero sigue siendo un sistema pensado para apps táctiles.',
        ],
      },
      {
        h: 'Cuándo necesitás una notebook',
        p: [
          'Si escribís textos largos, usás planillas de cálculo, programas de edición o varias ventanas a la vez.',
          'Si tu trabajo o tu facultad piden un programa que solo corre en Windows o macOS, una tablet no lo va a resolver.',
        ],
      },
      {
        h: 'Qué mirar antes de decidir',
        p: [
          'Qué programas vas a usar y si existen en versión tablet.',
          'RAM, almacenamiento y procesador en cualquiera de los dos; son lo que más se nota con el uso.',
          'Si necesitás teclado y si viene incluido o se compra aparte.',
          'El peso y la duración de la batería, si la vas a llevar todos los días.',
        ],
      },
    ],
    categoria: { slug: 'notebooks', nombre: 'notebooks' },
    comparativa: 'mejores-notebooks',
    cta: { href: '/mejores/mejores-notebooks', titulo: 'Notebooks en oferta hoy, comparadas', boton: 'Ver la comparativa de notebooks' },
    faq: [
      {
        q: '¿Una tablet reemplaza a una notebook para estudiar?',
        a: 'Para leer, tomar apuntes y hacer trabajos simples sí. Si necesitás programas específicos o escribir mucho, la notebook es más cómoda.',
      },
      {
        q: '¿Qué es mejor para un chico en edad escolar?',
        a: 'Para tareas y videoconferencias, una tablet o una notebook económica alcanzan. Depende de si la escuela pide programas de computadora.',
      },
      {
        q: '¿Hay tablets con teclado que sirvan como notebook?',
        a: 'Hay modelos con teclado, pero el sistema sigue siendo de tablet. Mirá qué apps necesitás antes de pensarla como reemplazo.',
      },
    ],
    enlaces: [
      { href: '/guias/que-tablet-comprar', texto: 'Qué tablet comprar' },
      { href: '/guias/que-notebook-comprar', texto: 'Qué notebook comprar' },
      { href: '/mejores/mejores-tablets', texto: 'Mejores tablets en oferta' },
      { href: '/categoria/notebooks', texto: 'Notebooks en oferta' },
      { href: '/precio', texto: 'Precio de hoy de cada producto' },
    ],
  },
  {
    slug: 'que-notebook-gamer-comprar',
    titulo: 'Qué notebook gamer comprar: placa de video, RAM y pantalla',
    descripcion:
      'Cómo elegir una notebook para jugar: qué importa más (placa de video), cuánta RAM, qué pantalla y Hz, refrigeración y qué evitar al comparar precios.',
    pregunta: '¿Qué mirar al comprar una notebook gamer?',
    respuestaCorta:
      'En una notebook gamer lo que más pesa es la placa de video (GPU) dedicada: define a qué juegos y con qué calidad vas a poder jugar. Después fijate en 16 GB de RAM como punto de partida, un SSD, una pantalla con buena tasa de refresco y una refrigeración que aguante sesiones largas.',
    secciones: [
      {
        h: 'La placa de video es lo principal',
        p: [
          'Para jugar necesitás una placa de video dedicada, no integrada en el procesador. Es la pieza que más cambia el rendimiento en juegos.',
          'Compará modelos de la misma generación: una placa de gama media actual puede rendir más que una gama alta de hace varios años. Fijate el nombre exacto del modelo en la ficha.',
        ],
      },
      {
        h: 'Procesador, RAM y almacenamiento',
        p: [
          'Un procesador de gama media-alta alcanza para casi todos los juegos si la placa de video acompaña.',
          '16 GB de RAM es un buen punto de partida actual; con menos, algunos juegos y programas se sienten justos.',
          'Un SSD hace que el sistema y los juegos carguen mucho más rápido que un disco mecánico. Elegí una capacidad que te alcance para varios juegos grandes.',
        ],
      },
      {
        h: 'Pantalla y refrigeración',
        p: [
          'Una pantalla con mayor tasa de refresco (por ejemplo 120 o 144 Hz) se ve más fluida, si la placa de video puede entregar esos cuadros por segundo.',
          'La refrigeración importa: una notebook que se recalienta baja el rendimiento. Conviene un diseño con buena ventilación y, para sesiones largas, una base con ventiladores.',
        ],
      },
      {
        h: 'Qué mirar antes de pagar',
        p: [
          'Que la ficha indique claramente la placa de video dedicada y su modelo exacto.',
          'Cuántos puertos y qué tipo de conexión tiene para monitor y periféricos.',
          'La garantía y quién la presta, porque son equipos caros.',
          'Si el cargador es el original y su potencia, ya que estas notebooks consumen bastante.',
        ],
      },
    ],
    categoria: { slug: 'gamer', nombre: 'gamer' },
    comparativa: 'mejores-notebooks',
    cta: { href: '/mejores/mejores-notebooks', titulo: 'Notebooks en oferta hoy, comparadas', boton: 'Ver la comparativa de notebooks' },
    faq: [
      {
        q: '¿Cuánta RAM necesita una notebook gamer?',
        a: '16 GB es un punto de partida razonable hoy. Con 8 GB algunos juegos funcionan pero con menos margen.',
      },
      {
        q: '¿Sirve una notebook sin placa de video dedicada para jugar?',
        a: 'Para juegos livianos o antiguos puede alcanzar; para juegos actuales exigentes necesitás una placa dedicada.',
      },
      {
        q: '¿Conviene más una notebook o una PC de escritorio para jugar?',
        a: 'La PC de escritorio rinde más por el mismo precio y se puede mejorar; la notebook gana en portabilidad. Depende de si necesitás moverla.',
      },
    ],
    enlaces: [
      { href: '/guias/que-notebook-comprar', texto: 'Qué notebook comprar' },
      { href: '/guias/que-monitor-gamer-comprar', texto: 'Qué monitor gamer comprar' },
      { href: '/mejores/mejores-notebooks', texto: 'Mejores notebooks en oferta' },
      { href: '/categoria/gamer', texto: 'Productos gamer en oferta' },
      { href: '/precio', texto: 'Precio de hoy de cada producto' },
    ],
  },
  {
    slug: 'que-camara-de-seguridad-wifi-comprar',
    titulo: 'Qué cámara de seguridad wifi comprar: resolución, visión nocturna y almacenamiento',
    descripcion:
      'Cómo elegir una cámara de seguridad wifi para casa o negocio: resolución, visión nocturna, dónde se guardan las grabaciones, si es para interior o exterior y qué revisar antes de comprar.',
    pregunta: '¿Qué mirar al comprar una cámara de seguridad wifi?',
    respuestaCorta:
      'Fijate en que sea apta para donde la vas a poner (interior o exterior), en la resolución de imagen, en la visión nocturna y en cómo guarda las grabaciones: tarjeta de memoria o servicio en la nube. También conviene confirmar que funcione con el wifi de tu casa y que la app sea clara.',
    secciones: [
      {
        h: 'Interior o exterior',
        p: [
          'Las de interior no están preparadas para lluvia ni polvo. Si va afuera, buscá una que indique resistencia al agua o al clima en la ficha.',
          'También conviene que alcance la señal de wifi en ese lugar: una cámara sin buena señal pierde video.',
        ],
      },
      {
        h: 'Resolución y visión nocturna',
        p: [
          'Una mayor resolución permite ver más detalle, por ejemplo una cara o una patente, a más distancia.',
          'La visión nocturna es clave: la mayoría de los problemas de seguridad pasan de noche. Confirmá que la ficha la mencione y a qué distancia llega.',
        ],
      },
      {
        h: 'Dónde se guardan las grabaciones',
        p: [
          'Algunas usan una tarjeta de memoria que se compra aparte; otras ofrecen guardado en la nube, a veces con un costo mensual.',
          'Antes de comprar, revisá si el almacenamiento viene incluido y cuánto tiempo de grabación te da.',
        ],
      },
      {
        h: 'Qué mirar antes de pagar',
        p: [
          'La compatibilidad con la app que vas a usar y con tu red wifi (muchas funcionan solo en 2,4 GHz).',
          'Si tiene alarma o aviso de movimiento en el celular.',
          'La alimentación: enchufe, batería o cable.',
          'Garantía y reputación del vendedor, y si el envío es gratis.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Necesito tarjeta de memoria?',
        a: 'Depende del modelo: muchas graban en una tarjeta que se vende aparte. Revisá en la ficha si viene incluida o si usa nube.',
      },
      {
        q: '¿Funciona sin internet?',
        a: 'Algunas siguen grabando en la tarjeta aunque se corte internet, pero no podés verlas desde el celular hasta que vuelva.',
      },
      {
        q: '¿Sirve para exterior una cámara de interior?',
        a: 'No: la lluvia y el polvo la dañan. Para afuera elegí una que indique resistencia al agua en la ficha.',
      },
    ],
    enlaces: [
      { href: '/hoy', texto: 'Ofertas del día en Mercado Libre' },
      { href: '/guias/como-saber-si-un-descuento-de-mercado-libre-es-real', texto: 'Cómo saber si un descuento es real' },
      { href: '/guias/cupones-y-codigos-de-descuento-de-mercado-libre-argentina', texto: 'Cupones de descuento' },
      { href: '/precio', texto: 'Precio de hoy de cada producto' },
    ],
  },
  {
    slug: 'microondas-u-horno-electrico-cual-conviene',
    titulo: 'Microondas u horno eléctrico: cuál conviene para tu cocina',
    descripcion:
      'Diferencias entre microondas y horno eléctrico: qué hace cada uno, tiempos, espacio y qué cocinás. Cuándo alcanza uno y cuándo conviene tener los dos.',
    pregunta: '¿Conviene un microondas o un horno eléctrico?',
    respuestaCorta:
      'El microondas es ideal para recalentar y descongelar rápido; el horno eléctrico cocina, dora y gratina como un horno común. Si recalentás y cocinás poco, alcanza con el microondas; si querés asar, hornear o gratinar sin usar el horno de la cocina, conviene un horno eléctrico, y algunos microondas con grill cubren parte de esa función.',
    secciones: [
      {
        h: 'Qué hace mejor el microondas',
        p: [
          'Calienta rápido y descongela. Es práctico para recalentar comida, hervir agua o preparar cosas simples.',
          'No dora ni da textura crocante por sí solo, salvo que tenga función grill.',
        ],
      },
      {
        h: 'Qué hace mejor el horno eléctrico',
        p: [
          'Hornea, gratina y dora de manera parecida a un horno de cocina. Sirve para pizzas, tartas, carnes y pan.',
          'Es útil si no querés prender el horno grande de la cocina o si la cocina no tiene horno. Suele ocupar más espacio en la mesada.',
        ],
      },
      {
        h: 'Qué mirar antes de pagar',
        p: [
          'La capacidad en litros: confirmá que entran las fuentes que usás.',
          'La potencia en watts y si el horno tiene resistencia superior e inferior, además de temperatura regulable.',
          'Las medidas externas para saber si entra en la mesada y dejá espacio para ventilar.',
          'La garantía y si el envío es gratis.',
        ],
      },
    ],
    categoria: { slug: 'electro-de-cocina', nombre: 'electro de cocina' },
    comparativa: 'mejores-microondas',
    cta: { href: '/mejores/mejores-microondas', titulo: 'Microondas en oferta hoy, comparados', boton: 'Ver la comparativa de microondas' },
    faq: [
      {
        q: '¿Un microondas con grill reemplaza a un horno eléctrico?',
        a: 'Cubre parte de la función (gratinar y dorar), pero un horno eléctrico hornea con más espacio y mejor control de temperatura.',
      },
      {
        q: '¿Puedo usar los dos?',
        a: 'Sí: el microondas para recalentar rápido y el horno eléctrico para cocinar. Si tenés lugar, se complementan.',
      },
      {
        q: '¿Qué conviene si vivo solo?',
        a: 'Un microondas compacto suele alcanzar. Si querés hornear, sumá un horno eléctrico chico.',
      },
    ],
    enlaces: [
      { href: '/guias/que-microondas-comprar', texto: 'Qué microondas comprar' },
      { href: '/guias/que-freidora-de-aire-comprar', texto: 'Qué freidora de aire comprar' },
      { href: '/mejores/mejores-microondas', texto: 'Mejores microondas en oferta' },
      { href: '/categoria/electro-de-cocina', texto: 'Electro de cocina en oferta' },
      { href: '/precio', texto: 'Precio de hoy de cada producto' },
    ],
  },
  {
    slug: 'que-parlante-bluetooth-comprar',
    titulo: 'Qué parlante bluetooth comprar: potencia, batería y resistencia al agua',
    descripcion:
      'Cómo elegir un parlante bluetooth o torre de sonido: potencia real, duración de batería, resistencia al agua, conexiones y para qué lo vas a usar.',
    pregunta: '¿Qué mirar al comprar un parlante bluetooth?',
    respuestaCorta:
      'Para llevar a todos lados, priorizá batería y resistencia al agua; para una reunión en casa, una torre de sonido de más potencia. Ojo con las cifras de "watts" de algunos anuncios, que suelen ser potencia máxima y no real: compará contra el tamaño del parlante y las conexiones que ofrece.',
    secciones: [
      {
        h: 'Portátil o torre de sonido',
        p: [
          'Un parlante portátil es chico, tiene batería y se lleva a la playa o la pileta. Suele priorizar autonomía y resistencia al agua.',
          'Una torre de sonido es más grande y potente, pensada para una casa o una reunión. Suele enchufarse y a veces trae micrófono.',
        ],
      },
      {
        h: 'Potencia, batería y agua',
        p: [
          'Algunas fichas informan la potencia en valores muy altos que no son la potencia real sostenida. Comparar con el tamaño del equipo y con modelos conocidos ayuda a no confundirse.',
          'Si es portátil, mirá las horas de batería declaradas y si indica resistencia al agua (por ejemplo, grado IP) para usarlo cerca de la pileta.',
        ],
      },
      {
        h: 'Conexiones y funciones',
        p: [
          'Bluetooth es lo básico; entrada auxiliar, USB o tarjeta suman opciones.',
          'Algunos permiten conectar dos parlantes para estéreo y traen luces o micrófono para karaoke.',
        ],
      },
      {
        h: 'Qué mirar antes de pagar',
        p: [
          'Para qué lo vas a usar y dónde: interior, exterior, de viaje.',
          'La duración real de la batería según lo que declare el fabricante.',
          'Garantía y si el vendedor es oficial.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Cuántos watts necesito?',
        a: 'Depende del lugar: para uso personal alcanza uno pequeño; para una reunión en casa conviene más potencia. Desconfiá de cifras muy altas en parlantes chicos.',
      },
      {
        q: '¿Sirve para la pileta?',
        a: 'Solo si la ficha indica resistencia al agua. Si no la tiene, evitá mojarlo.',
      },
      {
        q: '¿Se pueden conectar dos parlantes juntos?',
        a: 'Algunos modelos lo permiten para sonido estéreo. Revisalo en la ficha antes de comprar.',
      },
    ],
    enlaces: [
      { href: '/hoy', texto: 'Ofertas del día en Mercado Libre' },
      { href: '/guias/que-auriculares-comprar', texto: 'Qué auriculares comprar' },
      { href: '/guias/como-saber-si-un-descuento-de-mercado-libre-es-real', texto: 'Cómo saber si un descuento es real' },
      { href: '/precio', texto: 'Precio de hoy de cada producto' },
    ],
  },
  {
    slug: 'que-silla-de-oficina-comprar',
    titulo: 'Qué silla de oficina comprar: ergonomía, regulaciones y materiales',
    descripcion:
      'Cómo elegir una silla de escritorio u oficina: respaldo, apoyabrazos, regulación de altura, materiales y qué mirar si pasás muchas horas sentado.',
    pregunta: '¿Qué mirar al comprar una silla de oficina?',
    respuestaCorta:
      'Si vas a pasar muchas horas sentado, priorizá regulación de altura, un respaldo que acompañe la zona lumbar y un asiento cómodo. Las sillas "gerenciales" lucen bien, pero compará siempre qué regulaciones tienen en la ficha y no solo el tapizado.',
    secciones: [
      {
        h: 'Regulaciones que importan',
        p: [
          'La altura del asiento regulable es lo mínimo: tus pies tienen que apoyar en el piso y tus codos quedar a la altura del escritorio.',
          'Si la ficha indica respaldo reclinable, apoyabrazos regulables o soporte lumbar, son detalles que se notan en jornadas largas.',
        ],
      },
      {
        h: 'Materiales y mantenimiento',
        p: [
          'El cuero ecológico o PU se limpia fácil pero puede calentar en verano; la malla ventila mejor; el tapizado de tela es más cálido.',
          'Mirá el tipo de base (nylon o metal) y las ruedas: si tenés piso de madera, conviene que sean aptas para ese piso.',
        ],
      },
      {
        h: 'Qué mirar antes de pagar',
        p: [
          'El peso máximo que soporta, según la ficha del vendedor.',
          'Si trae manual y si el armado es sencillo.',
          'Garantía y si el vendedor es oficial.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Silla de oficina o silla gamer?',
        a: 'Las dos pueden servir. Lo importante es la regulación y el soporte lumbar más que el diseño: comparalas por esas características.',
      },
      {
        q: '¿Conviene la malla?',
        a: 'Ventila mejor, algo útil en verano. Es cuestión de preferencia y de cómo se sienta el asiento.',
      },
      {
        q: '¿Cada cuánto conviene levantarse?',
        a: 'Ninguna silla reemplaza moverse: levantarte y estirarte cada tanto ayuda más que cualquier accesorio.',
      },
    ],
    enlaces: [
      { href: '/hoy', texto: 'Ofertas del día en Mercado Libre' },
      { href: '/guias/que-silla-gamer-comprar', texto: 'Qué silla gamer comprar' },
      { href: '/guias/como-saber-si-un-descuento-de-mercado-libre-es-real', texto: 'Cómo saber si un descuento es real' },
      { href: '/precio', texto: 'Precio de hoy de cada producto' },
    ],
  },
  {
    slug: 'que-cochecito-de-bebe-comprar',
    titulo: 'Qué cochecito de bebé comprar: travel system, plegado y seguridad',
    descripcion:
      'Cómo elegir un cochecito de bebé: travel system con huevito, peso, plegado, ruedas, arnés y qué revisar antes de comprar.',
    pregunta: '¿Qué mirar al comprar un cochecito de bebé?',
    respuestaCorta:
      'Pensá en cómo lo vas a usar: si viajás en auto, un travel system con huevito te ahorra pasar al bebé de un lado a otro; si vivís en departamento o usás transporte, mirá el peso y el plegado. Chequeá siempre el arnés y los frenos en la ficha.',
    secciones: [
      {
        h: 'Travel system o cochecito simple',
        p: [
          'El travel system incluye el huevito (silla para auto) que se engancha al chasis del cochecito. Es práctico en los primeros meses.',
          'Un cochecito simple, sin huevito, suele ser más liviano y sirve si ya tenés silla para auto aparte.',
        ],
      },
      {
        h: 'Peso, plegado y ruedas',
        p: [
          'Si lo vas a subir y bajar seguido, el peso y el plegado compacto importan más que el diseño.',
          'Las ruedas más grandes suelen andar mejor en veredas irregulares; las chicas, en superficies lisas.',
        ],
      },
      {
        h: 'Seguridad y comodidad',
        p: [
          'Revisá que tenga arnés de varios puntos, freno firme y respaldo reclinable.',
          'Una capota amplia y un canasto para cosas se agradecen en el día a día.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Hace falta el huevito?',
        a: 'Para viajar en auto con un recién nacido, necesitás una silla de seguridad apta. El travel system la incluye y se acopla al cochecito.',
      },
      {
        q: '¿Hasta qué edad sirve?',
        a: 'Depende del modelo y del peso máximo que indique el fabricante. Revisalo en la ficha.',
      },
      {
        q: '¿Conviene comprar usado?',
        a: 'Es una decisión personal; si lo hacés, revisá que los frenos, el arnés y el plegado funcionen bien.',
      },
    ],
    enlaces: [
      { href: '/hoy', texto: 'Ofertas del día en Mercado Libre' },
      { href: '/guias/como-saber-si-un-descuento-de-mercado-libre-es-real', texto: 'Cómo saber si un descuento es real' },
      { href: '/guias/que-es-el-minimo-historico-en-mercado-libre', texto: 'Qué es el mínimo histórico' },
      { href: '/precio', texto: 'Precio de hoy de cada producto' },
    ],
  },
  {
    slug: 'kindle-o-tablet-para-leer',
    titulo: 'Kindle o tablet para leer: cuál conviene según cómo leas',
    descripcion:
      'Diferencias entre un lector de libros electrónicos (Kindle) y una tablet: pantalla, batería, luz, usos y para quién conviene cada uno.',
    pregunta: '¿Conviene un Kindle o una tablet para leer?',
    respuestaCorta:
      'Si lo tuyo es leer libros durante horas, el Kindle (pantalla de tinta electrónica) cansa menos la vista y la batería dura mucho más. Si además querés ver videos, usar apps o navegar, una tablet es más versátil.',
    secciones: [
      {
        h: 'Pantalla y lectura',
        p: [
          'El lector electrónico usa una pantalla pensada para parecerse al papel, que se ve bien incluso con sol.',
          'La tablet tiene pantalla más vistosa y a color, pero tiene más reflejos y puede cansar más en lecturas largas.',
        ],
      },
      {
        h: 'Batería y uso',
        p: [
          'El lector suele durar semanas con una carga, según el uso y lo que declare el fabricante.',
          'La tablet se carga con más frecuencia, pero sirve para mucho más que leer.',
        ],
      },
      {
        h: 'Qué mirar antes de pagar',
        p: [
          'Si necesitás leer PDF, revistas o cómics a color, comprobá cómo los muestra el modelo.',
          'Cuánta memoria trae y si tiene luz integrada para leer de noche.',
          'Garantía y si el vendedor es oficial.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Se pueden usar libros de otras tiendas?',
        a: 'Depende del modelo y del formato. Revisalo en la ficha o en la página del fabricante antes de comprar.',
      },
      {
        q: '¿Sirve para leer de noche?',
        a: 'Muchos traen luz integrada. Si la ficha no la menciona, asumí que no la tiene.',
      },
      {
        q: '¿Una tablet reemplaza al lector?',
        a: 'Sirve para leer, pero si leés mucho, la pantalla del lector suele ser más cómoda.',
      },
    ],
    enlaces: [
      { href: '/hoy', texto: 'Ofertas del día en Mercado Libre' },
      { href: '/guias/que-tablet-comprar', texto: 'Qué tablet comprar' },
      { href: '/guias/tablet-o-notebook-cual-conviene', texto: 'Tablet o notebook' },
      { href: '/precio', texto: 'Precio de hoy de cada producto' },
    ],
  },
  {
    slug: 'aspiradora-inalambrica-o-con-cable',
    titulo: 'Aspiradora inalámbrica o con cable: cuál conviene',
    descripcion:
      'Comparación entre aspiradoras verticales inalámbricas y las de cable: potencia, autonomía, peso, filtros y qué conviene según tu casa.',
    pregunta: '¿Conviene una aspiradora inalámbrica o una con cable?',
    respuestaCorta:
      'La inalámbrica es más cómoda para limpiar rápido y por zonas; la de cable no depende de la batería y suele rendir parejo en casas grandes. Mirá la autonomía declarada, el tipo de filtro y el tamaño del depósito antes de decidir.',
    secciones: [
      {
        h: 'Comodidad y autonomía',
        p: [
          'La inalámbrica se usa sin enchufar ni arrastrar cable, ideal para limpiezas rápidas. La contra es que depende de la batería.',
          'La de cable puede usarse el tiempo que haga falta sin quedarse sin carga.',
        ],
      },
      {
        h: 'Filtros, depósito y accesorios',
        p: [
          'Un filtro HEPA ayuda a retener polvo fino, algo útil si hay alergias. Fijate si es lavable o hay que reponerlo.',
          'Cuanto más grande el depósito, menos veces lo vaciás. Los accesorios (cepillos, boquillas) suman en tapizados y rincones.',
        ],
      },
      {
        h: 'Qué mirar antes de pagar',
        p: [
          'La autonomía real suele ser menor en el modo de máxima potencia.',
          'Si la batería se puede reemplazar o comprar aparte.',
          'Garantía y si el vendedor es oficial.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Una inalámbrica reemplaza a una de cable?',
        a: 'Para departamentos y limpiezas diarias, sí suele alcanzar. Para casas grandes, podés quedarte corto de batería.',
      },
      {
        q: '¿Y el robot aspirador?',
        a: 'Limpia solo de forma recurrente, pero no reemplaza una limpieza profunda. Mirá nuestra guía del robot aspirador.',
      },
      {
        q: '¿Sirve para mascotas?',
        a: 'Hay modelos con cepillos pensados para pelo de mascotas; revisá si la ficha lo indica.',
      },
    ],
    enlaces: [
      { href: '/hoy', texto: 'Ofertas del día en Mercado Libre' },
      { href: '/guias/que-aspiradora-comprar', texto: 'Qué aspiradora comprar' },
      { href: '/guias/que-aspiradora-robot-comprar', texto: 'Qué aspiradora robot comprar' },
      { href: '/precio', texto: 'Precio de hoy de cada producto' },
    ],
  },
]

// Guías sumadas después de la tanda del 15/10 (fecha de publicación real).
const FECHAS_NUEVAS: Record<string, string> = {
  'aire-acondicionado-solo-frio-o-frio-calor': '2026-10-16',
  'tablet-o-notebook-cual-conviene': '2026-10-16',
  'que-notebook-gamer-comprar': '2026-10-16',
  'que-camara-de-seguridad-wifi-comprar': '2026-10-16',
  'microondas-u-horno-electrico-cual-conviene': '2026-10-16',
  'que-parlante-bluetooth-comprar': '2026-10-16',
  'lavasecarropas-secarropas-o-bomba-de-calor': '2026-10-16',
  'sommier-o-colchon-cual-conviene': '2026-10-16',
  'que-motorola-comprar-moto-g-o-edge': '2026-10-16',
  'que-silla-de-oficina-comprar': '2026-10-17',
  'que-cochecito-de-bebe-comprar': '2026-10-17',
  'kindle-o-tablet-para-leer': '2026-10-17',
  'aspiradora-inalambrica-o-con-cable': '2026-10-17',
}

export const FECHAS_GUIAS_LONG_TAIL: Record<string, { publicada: string; modificada: string }> = Object.fromEntries(
  GUIAS_LONG_TAIL.map(g => {
    const f = FECHAS_NUEVAS[g.slug] ?? '2026-10-15'
    return [g.slug, { publicada: f, modificada: f }]
  }),
)
