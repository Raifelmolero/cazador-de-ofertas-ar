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
]

export const FECHAS_GUIAS_LONG_TAIL: Record<string, { publicada: string; modificada: string }> = Object.fromEntries(
  GUIAS_LONG_TAIL.map(g => [g.slug, { publicada: '2026-10-15', modificada: '2026-10-15' }]),
)
