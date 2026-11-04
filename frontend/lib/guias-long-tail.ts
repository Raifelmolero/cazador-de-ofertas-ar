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
      { href: '/mejores/mejores-auriculares', texto: 'Mejores auriculares en oferta hoy' },
      { href: '/guias/auriculares-con-cancelacion-de-ruido-vale-la-pena', texto: '¿Vale la pena la cancelación de ruido?' },
      { href: '/guias/sony-wh-ch520-o-anker-soundcore-q20i', texto: 'Sony WH-CH520 o Anker Q20i' },
      { href: '/guias/auriculares-open-ear-o-in-ear', texto: 'Auriculares open ear o in-ear' },
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
    comparativa: 'mejores-sillas-gamer',
    cta: { href: '/mejores/mejores-sillas-gamer', titulo: 'Sillas en oferta hoy, comparadas', boton: 'Ver la comparativa de sillas' },
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
      { href: '/mejores/mejores-sillas-gamer', texto: 'Sillas en oferta' },
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
    categoria: { slug: 'bebes-y-jugueteria', nombre: 'bebés y juguetería' },
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
      { href: '/categoria/bebes-y-jugueteria', texto: 'Bebés y juguetería en oferta' },
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
    comparativa: 'mejores-tablets',
    cta: { href: '/mejores/mejores-tablets', titulo: 'Tablets en oferta hoy, comparadas', boton: 'Ver la comparativa de tablets' },
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
      { href: '/mejores/mejores-tablets', texto: 'Tablets en oferta' },
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
    categoria: { slug: 'aspiradoras', nombre: 'aspiradoras' },
    comparativa: 'mejores-aspiradoras',
    cta: { href: '/mejores/mejores-aspiradoras', titulo: 'Aspiradoras en oferta hoy, comparadas', boton: 'Ver la comparativa de aspiradoras' },
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
      { href: '/mejores/mejores-aspiradoras', texto: 'Aspiradoras en oferta' },
      { href: '/categoria/aspiradoras', texto: 'Aspiradoras en oferta' },
      { href: '/hoy', texto: 'Ofertas del día en Mercado Libre' },
      { href: '/guias/que-aspiradora-comprar', texto: 'Qué aspiradora comprar' },
      { href: '/guias/que-aspiradora-robot-comprar', texto: 'Qué aspiradora robot comprar' },
      { href: '/precio', texto: 'Precio de hoy de cada producto' },
    ],
  },
  {
    slug: 'maquina-de-soda-vale-la-pena',
    titulo: 'Máquina de soda: vale la pena y qué mirar antes de comprar',
    descripcion:
      'Cómo funciona una máquina para hacer soda en casa, qué cuesta mantenerla (garrafas de CO2 y recargas), cuándo conviene y qué mirar: tipo de cilindro, compatibilidad y botellas.',
    pregunta: '¿Vale la pena comprar una máquina para hacer soda en casa?',
    respuestaCorta:
      'Conviene si tomás soda o agua con gas todos los días: te ahorrás cargar botellas y siempre tenés a mano. La cuenta cambia según el costo de recargar el cilindro de CO2 y qué tan cerca tenés dónde hacerlo. Antes de comprar, fijate el tipo de cilindro que usa la máquina, si se recarga en tu zona y si trae botellas aptas.',
    secciones: [
      {
        h: 'Cómo funciona y qué se gasta',
        p: [
          'La máquina carga agua fría con dióxido de carbono (CO2) que viene en un cilindro. Cuando el cilindro se agota, se cambia por uno lleno o se recarga.',
          'El gasto fijo es el CO2; el agua sale de tu canilla. Por eso conviene mirar cuántos litros rinde un cilindro y cuánto cuesta cada recarga en tu zona antes de calcular si te ahorra.',
        ],
      },
      {
        h: 'Tipos de cilindro y compatibilidad',
        p: [
          'No todas las máquinas usan el mismo cilindro ni el mismo sistema de conexión. Confirmá en la ficha cuál usa y si se recarga en comercios cercanos.',
          'Algunas incluyen dos cilindros: así podés seguir usando uno mientras el otro se recarga.',
        ],
      },
      {
        h: 'Qué mirar antes de pagar',
        p: [
          'Qué trae en la caja: cantidad de cilindros y de botellas.',
          'Si las botellas son aptas para la máquina y para lavar a mano o en lavavajillas.',
          'Garantía y si el vendedor es oficial.',
        ],
      },
    ],
    categoria: { slug: 'electro-de-cocina', nombre: 'electro de cocina' },
    cta: { href: '/categoria/electro-de-cocina', titulo: 'Electro de cocina en oferta hoy', boton: 'Ver electro de cocina en oferta' },
    faq: [
      {
        q: '¿Qué pasa cuando se acaba el gas?',
        a: 'Hay que cambiar o recargar el cilindro de CO2. Fijate que tu máquina use un tipo que se consiga cerca.',
      },
      {
        q: '¿Se puede hacer agua saborizada?',
        a: 'Depende del modelo: muchas solo están pensadas para agua. Revisá el manual antes de agregarle jugos o saborizantes.',
      },
      {
        q: '¿Ocupa mucho lugar?',
        a: 'Se apoya sobre la mesada y suele ser compacta. Verificá las medidas en la ficha.',
      },
    ],
    enlaces: [
      { href: '/categoria/electro-de-cocina', texto: 'Electro de cocina en oferta' },
      { href: '/hoy', texto: 'Ofertas del día en Mercado Libre' },
      { href: '/guias/como-saber-si-un-descuento-de-mercado-libre-es-real', texto: 'Cómo saber si un descuento es real' },
      { href: '/precio', texto: 'Precio de hoy de cada producto' },
    ],
  },
  {
    slug: 'anafe-vitroceramico-o-induccion',
    titulo: 'Anafe vitrocerámico o de inducción: diferencias y cuál conviene',
    descripcion:
      'Diferencias entre un anafe eléctrico vitrocerámico y uno de inducción: cómo calientan, ollas compatibles, consumo, instalación eléctrica y limpieza.',
    pregunta: '¿Conviene un anafe vitrocerámico o uno de inducción?',
    respuestaCorta:
      'El de inducción calienta la olla directamente, por eso es más rápido y deja menos calor residual, pero solo funciona con ollas de material magnético. El vitrocerámico calienta una resistencia bajo el vidrio: sirve con cualquier olla, aunque tarda más y se mantiene caliente después de apagarlo. En ambos hay que revisar la potencia y que la instalación eléctrica de tu casa lo soporte.',
    secciones: [
      {
        h: 'Cómo calienta cada uno',
        p: [
          'El vitrocerámico usa resistencias eléctricas debajo de un vidrio. Calienta la zona y de ahí la olla.',
          'La inducción genera un campo magnético que calienta la base de la olla; el vidrio se calienta solo por contacto con ella.',
        ],
      },
      {
        h: 'Ollas, limpieza y seguridad',
        p: [
          'La inducción requiere ollas aptas (un imán debería pegarse en la base). Si tenés ollas de aluminio o vidrio, no sirven.',
          'Ambos tienen superficie lisa fácil de limpiar. El indicador de calor residual avisa que la zona sigue caliente.',
        ],
      },
      {
        h: 'Instalación y potencia',
        p: [
          'Los anafes eléctricos consumen mucha potencia. Consultá con un electricista si tu tablero y tu cableado lo soportan antes de comprar.',
          'Fijate si es empotrable o de apoyo y las medidas de la mesada.',
        ],
      },
    ],
    categoria: { slug: 'cocinas-y-hornos', nombre: 'cocinas y hornos' },
    comparativa: 'mejores-cocinas-y-hornos',
    cta: { href: '/mejores/mejores-cocinas-y-hornos', titulo: 'Cocinas y hornos en oferta hoy, comparados', boton: 'Ver la comparativa de cocinas y hornos' },
    faq: [
      {
        q: '¿Cuál consume menos?',
        a: 'La inducción aprovecha mejor la energía porque calienta la olla directamente. Igual depende de la potencia declarada y del uso.',
      },
      {
        q: '¿Puedo usar mis ollas actuales?',
        a: 'En vitrocerámico sí. En inducción solo las de base magnética: probá con un imán.',
      },
      {
        q: '¿Necesita instalación especial?',
        a: 'Suele requerir una conexión eléctrica adecuada a su potencia. Consultá con un electricista matriculado.',
      },
    ],
    enlaces: [
      { href: '/mejores/mejores-cocinas-y-hornos', texto: 'Cocinas y hornos en oferta' },
      { href: '/categoria/cocinas-y-hornos', texto: 'Cocinas y hornos en oferta' },
      { href: '/guias/que-cocina-comprar', texto: 'Qué cocina comprar' },
      { href: '/hoy', texto: 'Ofertas del día en Mercado Libre' },
      { href: '/precio', texto: 'Precio de hoy de cada producto' },
    ],
  },
  {
    slug: 'desmalezadora-a-explosion-o-a-bateria',
    titulo: 'Desmalezadora a explosión o a batería: cuál conviene',
    descripcion:
      'Diferencias entre desmalezadoras a nafta (explosión) y a batería: potencia, autonomía, ruido, mantenimiento y qué elegir según el tamaño de tu terreno.',
    pregunta: '¿Conviene una desmalezadora a explosión o una a batería?',
    respuestaCorta:
      'La de explosión (nafta) rinde más en terrenos grandes y yuyos duros, a cambio de ruido, vibración y mantenimiento. La de batería es más liviana, silenciosa y práctica para jardines chicos o medianos, pero la autonomía limita el tiempo de trabajo. Mirá la potencia, el tipo de corte (hilo o cuchilla) y, en las de batería, la capacidad y si se vende la batería por separado.',
    secciones: [
      {
        h: 'Potencia y autonomía',
        p: [
          'El motor a nafta se carga de combustible en segundos y trabaja mientras haya mezcla. Suele tener más fuerza para maleza densa.',
          'La batería ofrece menos tiempo continuo: conviene tener una segunda o saber cuánto rinde una carga.',
        ],
      },
      {
        h: 'Ruido, peso y mantenimiento',
        p: [
          'La de nafta requiere mezclar combustible con aceite, limpiar filtros y revisar bujía. Hace más ruido y vibra más.',
          'La de batería casi no necesita mantenimiento y es más fácil de arrancar.',
        ],
      },
      {
        h: 'Qué mirar antes de pagar',
        p: [
          'Tipo de corte: hilo para pasto, cuchilla para yuyos más duros.',
          'Si incluye arnés, protecciones y repuestos de hilo o cuchillas.',
          'Disponibilidad de repuestos y service en tu zona.',
        ],
      },
    ],
    categoria: { slug: 'herramientas-electricas', nombre: 'herramientas' },
    cta: { href: '/categoria/herramientas-electricas', titulo: 'Herramientas en oferta hoy', boton: 'Ver herramientas en oferta' },
    faq: [
      {
        q: '¿Qué mezcla usa una de nafta?',
        a: 'Depende del modelo: seguí la proporción de nafta y aceite que indica el manual del fabricante.',
      },
      {
        q: '¿Sirve una de batería para un terreno grande?',
        a: 'Puede quedarse corta de autonomía. Con una segunda batería se alarga el trabajo.',
      },
      {
        q: '¿Hilo o cuchilla?',
        a: 'El hilo es para pasto y bordes; la cuchilla corta yuyos y matas más duras.',
      },
    ],
    enlaces: [
      { href: '/categoria/herramientas-electricas', texto: 'Herramientas en oferta' },
      { href: '/hoy', texto: 'Ofertas del día en Mercado Libre' },
      { href: '/guias/como-saber-si-un-descuento-de-mercado-libre-es-real', texto: 'Cómo saber si un descuento es real' },
      { href: '/precio', texto: 'Precio de hoy de cada producto' },
    ],
  },
  {
    slug: 'lavarropas-inverter-que-es-y-conviene',
    titulo: 'Lavarropas inverter: qué es y si conviene',
    descripcion:
      'Qué significa que un lavarropas sea inverter: motor, consumo, ruido y durabilidad; y qué más mirar: capacidad en kilos, RPM de centrifugado y carga frontal o superior.',
    pregunta: '¿Qué es un lavarropas inverter y conviene?',
    respuestaCorta:
      'Un lavarropas inverter tiene un motor que regula su velocidad según la carga, lo que suele traducirse en menos ruido, menos vibración y menor consumo eléctrico que un motor común. Suele costar más, y conviene sobre todo si lavás seguido. Además del motor, mirá la capacidad en kilos, las RPM de centrifugado y si es de carga frontal o superior.',
    secciones: [
      {
        h: 'Qué cambia con el motor inverter',
        p: [
          'El motor inverter ajusta la velocidad con electrónica en lugar de usar siempre el mismo régimen. Eso reduce ruido y vibración.',
          'Muchos fabricantes ofrecen garantías extendidas sobre el motor; verificá en la ficha qué cubre.',
        ],
      },
      {
        h: 'Capacidad, RPM y tipo de carga',
        p: [
          'La capacidad en kilos define cuánta ropa lavás por vez: pensá en cuántas personas son en casa.',
          'Más RPM de centrifugado dejan la ropa menos húmeda, útil si secás en interior.',
          'La carga frontal suele ahorrar agua y entra bajo mesada; la superior ocupa menos ancho y es más cómoda para cargar.',
        ],
      },
      {
        h: 'Qué mirar antes de pagar',
        p: [
          'Etiqueta de eficiencia energética y consumo de agua.',
          'Medidas del lugar donde va, incluyendo el espacio para la puerta.',
          'Garantía y service oficial en tu zona.',
        ],
      },
    ],
    categoria: { slug: 'lavarropas', nombre: 'lavarropas' },
    comparativa: 'mejores-lavarropas',
    cta: { href: '/mejores/mejores-lavarropas', titulo: 'Lavarropas en oferta hoy, comparados', boton: 'Ver la comparativa de lavarropas' },
    faq: [
      {
        q: '¿Inverter siempre es mejor?',
        a: 'Suele ser más silencioso y eficiente, pero también más caro. Si lavás poco, la diferencia en consumo se nota menos.',
      },
      {
        q: '¿Cuántos kilos necesito?',
        a: 'Para una o dos personas alcanza con menos capacidad; para una familia, más kilos evita hacer varios lavados.',
      },
      {
        q: '¿Y el lavasecarropas?',
        a: 'Tenemos una guía que compara lavasecarropas, lavarropas con secarropas y bomba de calor.',
      },
    ],
    enlaces: [
      { href: '/mejores/mejores-lavarropas', texto: 'Lavarropas en oferta' },
      { href: '/categoria/lavarropas', texto: 'Lavarropas en oferta' },
      { href: '/guias/que-lavarropas-comprar', texto: 'Qué lavarropas comprar' },
      { href: '/guias/lavasecarropas-secarropas-o-bomba-de-calor', texto: 'Lavasecarropas, secarropas o bomba de calor' },
      { href: '/precio', texto: 'Precio de hoy de cada producto' },
    ],
  },
  {
    slug: 'bicicleta-rodado-26-27-5-o-29',
    titulo: 'Bicicleta de montaña: rodado 26, 27,5 o 29, cuál elegir',
    descripcion:
      'Qué cambia entre un rodado 26, 27,5 y 29 en una bicicleta de montaña: altura del ciclista, estabilidad, maniobrabilidad, talle de cuadro y qué mirar antes de comprar.',
    pregunta: '¿Qué rodado de bicicleta conviene: 26, 27,5 o 29?',
    respuestaCorta:
      'El rodado 29 rueda mejor sobre terreno irregular y mantiene la velocidad, pero es menos ágil y puede quedar grande para personas bajas. El 26 es más maniobrable y más chico; el 27,5 queda en el medio. Lo que más pesa es tu altura y dónde vas a andar: elegí el talle de cuadro según la tabla del fabricante antes de decidir.',
    secciones: [
      {
        h: 'Qué cambia con el tamaño de la rueda',
        p: [
          'La rueda grande supera mejor los baches y conserva el impulso, por eso se siente más estable en caminos de tierra y subidas.',
          'La rueda chica acelera más rápido y gira con más agilidad, útil en trazados cerrados y para ciclistas de menor estatura.',
        ],
      },
      {
        h: 'Altura del ciclista y talle de cuadro',
        p: [
          'El rodado no es lo único: el talle del cuadro tiene que acompañar tu altura. Cada fabricante publica una tabla con la relación entre altura y talle.',
          'Un cuadro demasiado grande o chico genera mala postura y menos control, aunque la rueda sea la correcta.',
        ],
      },
      {
        h: 'Qué mirar antes de pagar',
        p: [
          'Tipo de freno: a disco ofrece más potencia de frenado que los de zapata, sobre todo con barro o lluvia.',
          'Cantidad de cambios y marca de los componentes.',
          'Material del cuadro (acero o aluminio) y peso total.',
        ],
      },
    ],
    categoria: { slug: 'bicicletas', nombre: 'bicicletas' },
    comparativa: 'mejores-bicicletas',
    cta: { href: '/mejores/mejores-bicicletas', titulo: 'Bicicletas en oferta hoy, comparadas', boton: 'Ver la comparativa de bicicletas' },
    faq: [
      {
        q: '¿Qué rodado uso si soy bajo?',
        a: 'Suele convenir un rodado menor o un talle de cuadro chico. Consultá la tabla de talles del fabricante.',
      },
      {
        q: '¿Aluminio o acero?',
        a: 'El aluminio es más liviano y no se oxida; el acero suele ser más económico y resistente.',
      },
      {
        q: '¿Sirve para ciudad?',
        a: 'Sí, aunque para uso urbano también hay rodados y cubiertas pensadas para asfalto.',
      },
    ],
    enlaces: [
      { href: '/mejores/mejores-bicicletas', texto: 'Bicicletas en oferta' },
      { href: '/categoria/bicicletas', texto: 'Bicicletas en oferta' },
      { href: '/guias/que-bicicleta-comprar', texto: 'Qué bicicleta comprar' },
      { href: '/hoy', texto: 'Ofertas del día en Mercado Libre' },
      { href: '/precio', texto: 'Precio de hoy de cada producto' },
    ],
  },
  {
    slug: 'pc-de-escritorio-o-notebook',
    titulo: 'PC de escritorio o notebook: cuál conviene',
    descripcion:
      'Comparación entre una PC de escritorio y una notebook: rendimiento por precio, portabilidad, actualización de piezas, consumo y para qué uso conviene cada una.',
    pregunta: '¿Conviene una PC de escritorio o una notebook?',
    respuestaCorta:
      'Si vas a trabajar siempre en el mismo lugar, la PC de escritorio suele rendir más por el mismo dinero y se puede actualizar pieza por pieza. La notebook gana si necesitás moverte, ya que trae pantalla, teclado y batería incluidos. Fijate en el procesador, la memoria RAM, el tipo de disco (SSD) y, en la PC, si incluye monitor.',
    secciones: [
      {
        h: 'Rendimiento y precio',
        p: [
          'En una PC de escritorio, el espacio y la ventilación permiten componentes más potentes por el mismo precio.',
          'En una notebook, parte del costo va a la pantalla, la batería y el diseño compacto.',
        ],
      },
      {
        h: 'Portabilidad y actualización',
        p: [
          'La notebook se lleva a cualquier lado y funciona sin enchufar un rato.',
          'La PC de escritorio permite cambiar memoria, disco o placa de video más adelante. En la notebook las mejoras suelen ser más limitadas.',
        ],
      },
      {
        h: 'Qué mirar antes de pagar',
        p: [
          'Procesador y memoria RAM: para uso de oficina y estudio alcanza con gamas medias; para edición o juegos conviene más potencia.',
          'Un disco SSD acelera mucho el arranque y la apertura de programas.',
          'En una PC armada, confirmá si incluye monitor, teclado, mouse y sistema operativo.',
        ],
      },
    ],
    categoria: { slug: 'notebooks', nombre: 'notebooks' },
    comparativa: 'mejores-notebooks',
    cta: { href: '/mejores/mejores-notebooks', titulo: 'Notebooks en oferta hoy, comparadas', boton: 'Ver la comparativa de notebooks' },
    faq: [
      {
        q: '¿Una PC armada sirve para estudiar o trabajar?',
        a: 'Sí, siempre que el procesador, la RAM y el disco SSD acompañen el uso. Mirá qué incluye en la ficha.',
      },
      {
        q: '¿Cuánta RAM necesito?',
        a: 'Para oficina y estudio suele alcanzar con una cantidad media; para edición o juegos conviene más.',
      },
      {
        q: '¿Y si juego?',
        a: 'Tenemos una guía específica de notebooks gamer con qué mirar en la placa de video.',
      },
    ],
    enlaces: [
      { href: '/mejores/mejores-notebooks', texto: 'Notebooks en oferta' },
      { href: '/categoria/notebooks', texto: 'Notebooks en oferta' },
      { href: '/guias/que-notebook-comprar', texto: 'Qué notebook comprar' },
      { href: '/guias/que-notebook-gamer-comprar', texto: 'Qué notebook gamer comprar' },
      { href: '/precio', texto: 'Precio de hoy de cada producto' },
    ],
  },
  {
    "slug": "cuanta-ram-necesita-una-notebook",
    "titulo": "¿Cuánta RAM necesita una notebook? 8, 16 o 32 GB",
    "descripcion": "Cuánta memoria RAM conviene en una notebook según el uso: estudio y oficina, programación, diseño, edición de video y juegos. Qué es la RAM soldada y si se puede ampliar.",
    "pregunta": "¿Cuánta RAM necesita una notebook?",
    "respuestaCorta": "Para estudiar, navegar y usar programas de oficina, 8 GB de RAM es el mínimo y 16 GB es lo recomendable para que la notebook no se ponga lenta en unos años. Para programar, diseñar o editar video conviene 16 GB o más, y 32 GB solo si trabajás con proyectos pesados. Antes de comprar, fijate si la RAM está soldada: si lo está, no se puede ampliar después.",
    "secciones": [
      {
        "h": "8 GB: el mínimo para uso básico",
        "p": [
          "Con 8 GB se puede navegar, usar Word, Excel y videollamadas. El límite aparece cuando abrís muchas pestañas a la vez o dejás varios programas abiertos.",
          "Si el presupuesto obliga a 8 GB, buscá un modelo que permita ampliar la memoria más adelante."
        ]
      },
      {
        "h": "16 GB: lo que conviene hoy",
        "p": [
          "Es la medida más equilibrada: la notebook sigue rápida con muchas pestañas, programas de estudio o trabajo y actualizaciones durante varios años.",
          "Para programar, diseño gráfico liviano o juegos casuales, 16 GB alcanza en la mayoría de los casos."
        ]
      },
      {
        "h": "32 GB o más: para trabajo pesado",
        "p": [
          "Sirve si editás video en alta resolución, usás máquinas virtuales o modelos 3D grandes. Para el uso común no se nota la diferencia contra 16 GB."
        ]
      },
      {
        "h": "Qué mirar en la ficha antes de pagar",
        "p": [
          "Cantidad de RAM y tipo (DDR4 o DDR5).",
          "Si la memoria está soldada o tiene una ranura libre para ampliar.",
          "Que el disco sea SSD: con poca RAM y disco mecánico la notebook se siente mucho más lenta.",
          "Garantía oficial y si el envío es gratis."
        ]
      }
    ],
    "categoria": {
      "slug": "notebooks",
      "nombre": "notebooks"
    },
    "comparativa": "mejores-notebooks",
    "cta": {
      "href": "/mejores/mejores-notebooks",
      "titulo": "Notebooks en oferta hoy, comparadas",
      "boton": "Ver la comparativa de notebooks"
    },
    "faq": [
      {
        "q": "¿Alcanzan 8 GB de RAM en una notebook?",
        "a": "Para uso básico sí, pero con muchas pestañas o programas abiertos se pone lenta. Si podés, elegí 16 GB o un modelo que permita ampliar."
      },
      {
        "q": "¿Se puede agregar más RAM a una notebook?",
        "a": "Solo si tiene una ranura libre y la memoria no está soldada. Muchas notebooks delgadas traen la RAM soldada."
      },
      {
        "q": "¿Qué es más importante, RAM o procesador?",
        "a": "Para el uso diario, tener 16 GB de RAM y disco SSD se nota más que un procesador un poco más potente."
      }
    ],
    "enlaces": [
      {
        "href": "/mejores/mejores-notebooks",
        "texto": "Mejores notebooks en oferta"
      },
      {
        "href": "/guias/que-notebook-comprar",
        "texto": "Qué notebook comprar"
      },
      {
        "href": "/categoria/notebooks",
        "texto": "Notebooks en oferta"
      },
      {
        "href": "/guias/intel-core-i5-o-ryzen-5-cual-conviene",
        "texto": "Intel Core i5 o Ryzen 5"
      },
      {
        "href": "/guias/notebook-ssd-256-o-512-gb",
        "texto": "SSD de 256 o 512 GB"
      }
    ]
  },
  {
    "slug": "intel-core-i5-o-ryzen-5-cual-conviene",
    "titulo": "Intel Core i5 o AMD Ryzen 5: cuál conviene en una notebook",
    "descripcion": "Diferencias entre Intel Core i5 (y los nuevos Core 5) y AMD Ryzen 5 en notebooks: rendimiento, batería, gráficos integrados y cómo leer el nombre del procesador.",
    "pregunta": "¿Conviene una notebook con Intel Core i5 o con Ryzen 5?",
    "respuestaCorta": "Para estudiar, trabajar y uso diario, un Intel Core i5 (o Core 5) y un AMD Ryzen 5 de la misma generación rinden parecido, así que conviene decidir por precio, RAM y disco. Los Ryzen suelen tener mejores gráficos integrados; los Intel recientes son muy parejos. Lo importante es que el procesador sea de una generación reciente.",
    "secciones": [
      {
        "h": "Cómo leer el nombre del procesador",
        "p": [
          "En Intel, el número después de i5 indica la generación: un i5-1235U es de 12.ª generación. Los modelos nuevos se llaman Core 5 o Core Ultra 5.",
          "En AMD, la letra U indica bajo consumo (más batería) y H o HS más potencia. Un número de serie más alto suele indicar un modelo más nuevo, aunque conviene confirmar el año en la ficha."
        ]
      },
      {
        "h": "Rendimiento y batería",
        "p": [
          "En tareas comunes la diferencia entre ambas marcas de la misma época es chica. Las letras U priorizan batería y las H rendimiento para juegos o edición."
        ]
      },
      {
        "h": "Gráficos integrados",
        "p": [
          "Si vas a jugar algo liviano sin placa de video dedicada, los Ryzen con gráficos Radeon integrados suelen rendir mejor; los Intel recientes con Iris Xe o Arc acortan la diferencia."
        ]
      },
      {
        "h": "Qué mirar antes de comprar",
        "p": [
          "Generación del procesador (que no sea muy vieja).",
          "Al menos 16 GB de RAM y disco SSD.",
          "Pantalla Full HD (1920 x 1080) y garantía oficial."
        ]
      }
    ],
    "categoria": {
      "slug": "notebooks",
      "nombre": "notebooks"
    },
    "comparativa": "mejores-notebooks",
    "cta": {
      "href": "/mejores/mejores-notebooks",
      "titulo": "Notebooks en oferta hoy, comparadas",
      "boton": "Ver la comparativa de notebooks"
    },
    "faq": [
      {
        "q": "¿Qué es mejor, i5 o Ryzen 5?",
        "a": "De la misma generación rinden parecido. Elegí por precio, RAM, disco y pantalla; los Ryzen suelen traer mejores gráficos integrados."
      },
      {
        "q": "¿Qué significa la letra U en el procesador?",
        "a": "Que es de bajo consumo: rinde un poco menos pero la batería dura más. La H o HS indica más potencia."
      },
      {
        "q": "¿Intel Core 5 es lo mismo que Core i5?",
        "a": "Es la nueva forma de nombrar la gama media de Intel; equivale a un i5 de generación reciente."
      }
    ],
    "enlaces": [
      {
        "href": "/mejores/mejores-notebooks",
        "texto": "Mejores notebooks en oferta"
      },
      {
        "href": "/guias/que-notebook-comprar",
        "texto": "Qué notebook comprar"
      },
      {
        "href": "/categoria/notebooks",
        "texto": "Notebooks en oferta"
      },
      {
        "href": "/guias/cuanta-ram-necesita-una-notebook",
        "texto": "Cuánta RAM necesita una notebook"
      }
    ]
  },
  {
    "slug": "notebook-ssd-256-o-512-gb",
    "titulo": "Notebook con SSD de 256 o 512 GB: cuánto disco necesitás",
    "descripcion": "Cuánto almacenamiento conviene en una notebook: 256 GB, 512 GB o 1 TB de SSD según el uso, qué ocupa Windows y cómo sumar espacio después.",
    "pregunta": "¿Alcanza una notebook con SSD de 256 GB o conviene 512 GB?",
    "respuestaCorta": "Un SSD de 256 GB alcanza si usás la notebook para estudiar y navegar y guardás tus archivos en la nube, pero se llena rápido. Para la mayoría conviene 512 GB, y 1 TB si guardás videos, juegos o proyectos grandes. Siempre SSD y no disco mecánico, porque es lo que hace que la notebook arranque y abra programas rápido.",
    "secciones": [
      {
        "h": "Cuánto ocupa lo básico",
        "p": [
          "Windows con sus actualizaciones ocupa decenas de GB, y a eso se suman los programas que uses.",
          "Con 256 GB queda lugar para documentos, pero no para muchas fotos, videos o juegos."
        ]
      },
      {
        "h": "512 GB: el punto justo",
        "p": [
          "Deja margen para programas, fotos y algunos juegos sin tener que borrar a cada rato. Es la medida que más conviene para uso general."
        ]
      },
      {
        "h": "Cómo sumar espacio después",
        "p": [
          "Algunas notebooks tienen una segunda ranura M.2 para agregar otro SSD; fijate en la ficha técnica.",
          "Un disco externo o la nube son una opción barata para lo que no usás todos los días."
        ]
      }
    ],
    "categoria": {
      "slug": "notebooks",
      "nombre": "notebooks"
    },
    "comparativa": "mejores-notebooks",
    "cta": {
      "href": "/mejores/mejores-notebooks",
      "titulo": "Notebooks en oferta hoy, comparadas",
      "boton": "Ver la comparativa de notebooks"
    },
    "faq": [
      {
        "q": "¿256 GB es poco para una notebook?",
        "a": "Para uso básico con archivos en la nube alcanza, pero se llena rápido. Para la mayoría conviene 512 GB."
      },
      {
        "q": "¿SSD o disco HDD?",
        "a": "Siempre SSD como disco principal: la notebook arranca y abre programas mucho más rápido."
      },
      {
        "q": "¿Se puede cambiar el SSD de una notebook?",
        "a": "En muchas sí, porque usan SSD M.2 reemplazable. Confirmalo en la ficha antes de comprar."
      }
    ],
    "enlaces": [
      {
        "href": "/mejores/mejores-notebooks",
        "texto": "Mejores notebooks en oferta"
      },
      {
        "href": "/guias/que-notebook-comprar",
        "texto": "Qué notebook comprar"
      },
      {
        "href": "/categoria/notebooks",
        "texto": "Notebooks en oferta"
      },
      {
        "href": "/guias/cuanta-ram-necesita-una-notebook",
        "texto": "Cuánta RAM necesita una notebook"
      }
    ]
  },
  {
    "slug": "que-zte-comprar",
    "titulo": "¿Qué ZTE comprar? Blade A, Blade V y nubia",
    "descripcion": "Cómo elegir un celular ZTE en Argentina: diferencias entre las líneas Blade A, Blade V y nubia, cuánta memoria conviene y qué mirar antes de comprar.",
    "pregunta": "¿Qué celular ZTE conviene comprar?",
    "respuestaCorta": "Los ZTE Blade A son los más baratos y sirven para WhatsApp, redes y llamadas; los Blade V suman mejor pantalla, cámara y batería por poco más; y la línea nubia apunta a gama media con más potencia. Para que el celular no se ponga lento en un año, conviene elegir uno con al menos 4 GB de RAM y 128 GB de almacenamiento.",
    "secciones": [
      {
        "h": "Blade A: lo básico al mejor precio",
        "p": [
          "Es la línea de entrada. Alcanza para WhatsApp, redes sociales, llamadas y fotos de día.",
          "Es una buena opción como primer celular o para alguien que lo usa poco; para juegos o muchas apps abiertas se queda corta."
        ]
      },
      {
        "h": "Blade V: el equilibrio",
        "p": [
          "Suma pantallas más grandes, mejores cámaras y baterías de más duración. Para la mayoría de la gente es la línea que más conviene de ZTE."
        ]
      },
      {
        "h": "nubia: gama media",
        "p": [
          "Los nubia apuntan a quien quiere más potencia, mejor cámara o carga rápida sin pagar un gama alta."
        ]
      },
      {
        "h": "Qué mirar en la ficha antes de pagar",
        "p": [
          "Al menos 4 GB de RAM y 128 GB de almacenamiento.",
          "Capacidad de la batería en mAh y si incluye cargador.",
          "Que sea versión para Argentina, con garantía oficial.",
          "Comparar el precio de hoy contra otros días: muchos descuentos parten de un precio de lista inflado."
        ]
      }
    ],
    "categoria": {
      "slug": "celulares",
      "nombre": "celulares"
    },
    "comparativa": "mejores-celulares",
    "cta": {
      "href": "/mejores/mejores-celulares",
      "titulo": "Celulares en oferta hoy, comparados",
      "boton": "Ver la comparativa de celulares"
    },
    "faq": [
      {
        "q": "¿Los celulares ZTE son buenos?",
        "a": "En su rango de precio rinden bien: ofrecen pantallas grandes y buena batería por menos plata que otras marcas. No compiten con un gama alta."
      },
      {
        "q": "¿Qué diferencia hay entre ZTE Blade A y Blade V?",
        "a": "El Blade A es la línea más barata, para uso básico. El Blade V suma mejor pantalla, cámara y batería por un poco más."
      },
      {
        "q": "¿Cuánta memoria debería tener un ZTE?",
        "a": "Al menos 4 GB de RAM y 128 GB de almacenamiento para que no se llene ni se ponga lento rápido."
      }
    ],
    "enlaces": [
      {
        "href": "/mejores/mejores-celulares",
        "texto": "Mejores celulares en oferta"
      },
      {
        "href": "/guias/que-celular-comprar-segun-presupuesto",
        "texto": "Qué celular comprar según presupuesto"
      },
      {
        "href": "/guias/cuantos-gb-necesito-celular",
        "texto": "Cuántos GB necesita un celular"
      },
      {
        "href": "/categoria/celulares",
        "texto": "Celulares en oferta"
      },
      {
        "href": "/guias/que-xiaomi-redmi-comprar",
        "texto": "Qué Xiaomi Redmi comprar"
      }
    ]
  },
  {
    "slug": "que-xiaomi-redmi-comprar",
    "titulo": "¿Qué Xiaomi comprar? Redmi, Redmi Note o Poco",
    "descripcion": "Cómo elegir un celular Xiaomi en Argentina: diferencias entre Redmi, Redmi Note, Poco y la línea Xiaomi, cuánta memoria conviene y qué mirar antes de comprar.",
    "pregunta": "¿Qué celular Xiaomi conviene comprar?",
    "respuestaCorta": "Los Redmi (sin Note) son la línea más barata, para uso básico. Los Redmi Note son los que más convienen para la mayoría: mejor pantalla, cámara y batería a precio medio. Los Poco priorizan potencia para juegos, y la línea Xiaomi numerada es la gama alta. Elegí al menos 6 GB de RAM y 128 GB de almacenamiento si lo vas a usar varios años.",
    "secciones": [
      {
        "h": "Redmi: la entrada",
        "p": [
          "Pensados para WhatsApp, redes, llamadas y fotos de día a un precio bajo."
        ]
      },
      {
        "h": "Redmi Note: el más elegido",
        "p": [
          "Es la línea con mejor relación precio-calidad de la marca: pantallas grandes, buenas cámaras y baterías que duran todo el día.",
          "Las versiones Pro y Pro+ suman mejor cámara y carga más rápida."
        ]
      },
      {
        "h": "Poco y Xiaomi: más potencia",
        "p": [
          "Los Poco usan procesadores más potentes por el precio, ideales para juegos.",
          "La línea Xiaomi numerada es la gama alta de la marca, con las mejores cámaras."
        ]
      },
      {
        "h": "Qué mirar en la ficha antes de pagar",
        "p": [
          "RAM y almacenamiento (6 GB y 128 GB como base recomendable).",
          "Que sea versión global con garantía en Argentina.",
          "Si incluye cargador en la caja.",
          "Comparar el precio de hoy con otros días antes de comprar."
        ]
      }
    ],
    "categoria": {
      "slug": "celulares",
      "nombre": "celulares"
    },
    "comparativa": "mejores-celulares",
    "cta": {
      "href": "/mejores/mejores-celulares",
      "titulo": "Celulares en oferta hoy, comparados",
      "boton": "Ver la comparativa de celulares"
    },
    "faq": [
      {
        "q": "¿Qué es mejor, Redmi o Redmi Note?",
        "a": "El Redmi Note: mejor pantalla, cámara y batería por una diferencia de precio chica. El Redmi común conviene solo para uso muy básico."
      },
      {
        "q": "¿Qué diferencia hay entre Poco y Redmi Note?",
        "a": "Los Poco priorizan el procesador (rinden más en juegos); los Redmi Note suelen tener mejor cámara por el mismo precio."
      },
      {
        "q": "¿Los Xiaomi tienen garantía en Argentina?",
        "a": "Depende del vendedor: fijate que la publicación diga garantía oficial o del vendedor y cuánto dura."
      }
    ],
    "enlaces": [
      {
        "href": "/mejores/mejores-celulares",
        "texto": "Mejores celulares en oferta"
      },
      {
        "href": "/guias/que-celular-comprar-segun-presupuesto",
        "texto": "Qué celular comprar según presupuesto"
      },
      {
        "href": "/guias/cuantos-gb-necesito-celular",
        "texto": "Cuántos GB necesita un celular"
      },
      {
        "href": "/categoria/celulares",
        "texto": "Celulares en oferta"
      },
      {
        "href": "/guias/que-zte-comprar",
        "texto": "Qué ZTE comprar"
      }
    ]
  },
  {
    slug: 'black-friday-argentina-que-conviene-comprar',
    titulo: 'Black Friday en Argentina: qué conviene comprar y cómo no caer en falsos descuentos',
    descripcion:
      'Cómo aprovechar el Black Friday en Mercado Libre Argentina: qué productos suelen bajar, cómo comparar con el precio de las semanas anteriores, cuotas sin interés y qué revisar antes de pagar.',
    pregunta: '¿Qué conviene comprar en el Black Friday de Argentina?',
    respuestaCorta:
      'En el Black Friday suelen convenir los productos de precio alto, donde un descuento real se nota en pesos: celulares, notebooks, smart TV, heladeras y aires acondicionados. La clave es comparar con el precio de las semanas anteriores, no con el precio tachado, y fijarse si las cuotas son realmente sin interés.',
    secciones: [
      {
        h: 'Qué suele bajar en el Black Friday',
        p: [
          'Tecnología (celulares, notebooks, tablets, smart TV) y electrodomésticos grandes (heladeras, lavarropas, aires) son las categorías donde las marcas concentran más ofertas.',
          'A fin de noviembre los aires y ventiladores entran en temporada alta: si lo necesitás para el verano, compará igual con el precio de octubre.',
        ],
      },
      {
        h: 'Cómo saber si el descuento es real',
        p: [
          'El porcentaje de descuento se calcula contra un precio de referencia que puede haber subido días antes. Lo que importa es el precio final comparado con lo que costaba el producto en las semanas previas.',
          'En nuestras páginas de producto mostramos el historial y el mínimo histórico registrado, para que veas si el precio de hoy es bueno de verdad.',
        ],
      },
      {
        h: 'Cuotas, envío y vendedor',
        p: [
          'Revisá si las cuotas son sin interés con tu banco o tarjeta, y cuál es el precio total financiado.',
          'Mirá si el envío es gratis y el plazo de entrega, sobre todo si es un regalo de fin de año.',
          'Preferí tiendas oficiales o vendedores con buena reputación y factura, por la garantía.',
        ],
      },
      {
        h: 'Black Friday o Cyber Monday',
        p: [
          'Los dos eventos tienen ofertas parecidas. Si viste un buen precio en el Cyber Monday y no compraste, el Black Friday es una segunda oportunidad para comparar.',
        ],
      },
    ],
    cta: { href: '/black-friday', titulo: 'Ofertas de Black Friday de hoy', boton: 'Ver las ofertas de Black Friday' },
    faq: [
      {
        q: '¿Conviene esperar al Black Friday para comprar?',
        a: 'Si el producto no es urgente y es de precio alto, conviene seguir el precio unas semanas y comparar en el evento. Si hoy ya está en su mínimo histórico, no hace falta esperar.',
      },
      {
        q: '¿Los descuentos del Black Friday son reales?',
        a: 'Algunos sí y otros no. Compará el precio final con el de las semanas anteriores en lugar de mirar solo el porcentaje.',
      },
      {
        q: '¿Qué conviene más, cuotas sin interés o descuento en un pago?',
        a: 'Compará el total de las cuotas con el precio de contado: si son iguales, las cuotas sin interés suelen convenir.',
      },
    ],
    enlaces: [
      { href: '/black-friday', texto: 'Ofertas de Black Friday' },
      { href: '/guias/como-saber-si-un-descuento-de-mercado-libre-es-real', texto: 'Cómo saber si un descuento es real' },
      { href: '/guias/que-es-el-minimo-historico-en-mercado-libre', texto: 'Qué es el mínimo histórico' },
      { href: '/guias/hot-sale-cyber-monday-o-dia-comun-cuando-comprar-en-mercado-libre', texto: 'Hot Sale, Cyber Monday o día común' },
      { href: '/precio', texto: 'Precio de hoy de cada producto' },
    ],
  },
  {
    slug: 'que-regalar-en-navidad-segun-presupuesto',
    titulo: '¿Qué regalar en Navidad? Ideas según presupuesto y para quién',
    descripcion:
      'Ideas de regalos de Navidad ordenadas por presupuesto y por tipo de persona: tecnología, cocina, cuidado personal, perfumes, juguetes y herramientas. Qué mirar para que llegue a tiempo.',
    pregunta: '¿Qué regalar en Navidad?',
    respuestaCorta:
      'Lo más fácil es partir del presupuesto y de lo que la persona usa todos los días: auriculares, smartwatch o parlante bluetooth para los que viven con el celular; freidora de aire o cafetera para los que cocinan; perfumes o planchitas para cuidado personal; herramientas para los que arreglan cosas. Comprá con tiempo y fijate el plazo de envío para que llegue antes del 24.',
    secciones: [
      {
        h: 'Regalos chicos',
        p: [
          'Auriculares inalámbricos de entrada, parlantes bluetooth chicos, accesorios de cocina, juegos de mesa y kits de cuidado personal son regalos útiles sin gastar mucho.',
        ],
      },
      {
        h: 'Regalos medianos',
        p: [
          'Freidoras de aire, cafeteras, smartwatch, perfumes importados, planchitas o secadores de pelo y taladros para la casa están en un rango intermedio y se usan seguido.',
        ],
      },
      {
        h: 'Regalos grandes (o entre varios)',
        p: [
          'Celulares, tablets, notebooks, smart TV o una bicicleta. Si se juntan varios para un regalo grande, conviene aprovechar el Black Friday para pagar menos.',
        ],
      },
      {
        h: 'Para que llegue a tiempo',
        p: [
          'En diciembre los envíos se demoran más. Revisá la fecha estimada de entrega antes de pagar y preferí envíos rápidos cuando falte poco.',
          'Guardá la factura: si el regalo no le gusta o falla, la vas a necesitar para el cambio o la garantía.',
        ],
      },
    ],
    comparativa: 'regalos-de-navidad',
    cta: { href: '/mejores/regalos-de-navidad', titulo: 'Regalos de Navidad en oferta hoy', boton: 'Ver regalos de Navidad' },
    faq: [
      {
        q: '¿Cuándo conviene comprar los regalos de Navidad?',
        a: 'Con tiempo: el Black Friday de fin de noviembre suele tener buenos precios y deja margen para el envío.',
      },
      {
        q: '¿Qué regalar si no sé qué le gusta?',
        a: 'Algo de uso diario y fácil de cambiar: auriculares, un parlante, un perfume o un accesorio de cocina. Guardá la factura por si hay que cambiarlo.',
      },
    ],
    enlaces: [
      { href: '/mejores/regalos-de-navidad', texto: 'Regalos de Navidad' },
      { href: '/guias/que-parlante-bluetooth-comprar', texto: 'Qué parlante bluetooth comprar' },
      { href: '/guias/que-smartwatch-comprar', texto: 'Qué smartwatch comprar' },
      { href: '/guias/que-freidora-de-aire-comprar', texto: 'Qué freidora de aire comprar' },
      { href: '/guias/como-saber-si-un-perfume-es-original', texto: 'Cómo saber si un perfume es original' },
    ],
  },
  {
    slug: 'como-saber-si-un-perfume-es-original',
    titulo: 'Cómo saber si un perfume es original al comprarlo online',
    descripcion:
      'Qué revisar para comprar un perfume original en Mercado Libre: tienda oficial o vendedor, precio sospechoso, caja y celofán, lote, factura y diferencia entre Eau de Parfum y Eau de Toilette.',
    pregunta: '¿Cómo saber si un perfume es original?',
    respuestaCorta:
      'Lo más seguro es comprar en una tienda oficial de la marca o en un vendedor con muy buena reputación que entregue factura. Desconfiá de precios muy por debajo del resto, revisá que la caja tenga celofán prolijo y un código de lote que coincida con el del frasco, y guardá la factura por si hay que reclamar.',
    secciones: [
      {
        h: 'Dónde comprarlo',
        p: [
          'Las tiendas oficiales de las marcas y las perfumerías grandes con tienda en Mercado Libre son la opción más segura.',
          'Si es un vendedor particular, mirá su reputación, cuántas ventas tiene y qué dicen las opiniones sobre perfumes en particular.',
        ],
      },
      {
        h: 'Señales de alerta',
        p: [
          'Un precio mucho más bajo que el del resto de los vendedores para el mismo perfume y tamaño.',
          'Fotos genéricas o descripciones que hablan de réplica, "inspirado en" o "alternativo".',
          'Caja sin celofán, mal impresa o con un código de lote distinto al que figura en la base del frasco.',
        ],
      },
      {
        h: 'Eau de Parfum, Eau de Toilette y tamaño',
        p: [
          'El Eau de Parfum tiene más concentración y suele durar más que el Eau de Toilette, por eso cuesta más. Compará precios entre la misma concentración y la misma cantidad de mililitros.',
        ],
      },
      {
        h: 'Qué hacer al recibirlo',
        p: [
          'Revisá la caja y el frasco antes de abrir el celofán y guardá la factura. Si algo no coincide, reclamá dentro del plazo de devolución.',
        ],
      },
    ],
    categoria: { slug: 'perfumes', nombre: 'perfumes' },
    comparativa: 'mejores-perfumes',
    cta: { href: '/mejores/mejores-perfumes', titulo: 'Perfumes en oferta hoy, comparados', boton: 'Ver la comparativa de perfumes' },
    faq: [
      {
        q: '¿Los perfumes de Mercado Libre son originales?',
        a: 'Los de tiendas oficiales y vendedores serios con factura, sí. El riesgo está en vendedores sin reputación y precios demasiado bajos.',
      },
      {
        q: '¿Qué dura más, Eau de Parfum o Eau de Toilette?',
        a: 'En general el Eau de Parfum, porque tiene mayor concentración de fragancia.',
      },
    ],
    enlaces: [
      { href: '/mejores/mejores-perfumes', texto: 'Perfumes en oferta' },
      { href: '/categoria/perfumes', texto: 'Perfumes en oferta' },
      { href: '/guias/que-regalar-en-navidad-segun-presupuesto', texto: 'Qué regalar en Navidad' },
      { href: '/guias/como-saber-si-un-descuento-de-mercado-libre-es-real', texto: 'Cómo saber si un descuento es real' },
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
  'maquina-de-soda-vale-la-pena': '2026-10-18',
  'anafe-vitroceramico-o-induccion': '2026-10-18',
  'desmalezadora-a-explosion-o-a-bateria': '2026-10-18',
  'lavarropas-inverter-que-es-y-conviene': '2026-10-18',
  'bicicleta-rodado-26-27-5-o-29': '2026-10-18',
  'pc-de-escritorio-o-notebook': '2026-10-18',
  'cuanta-ram-necesita-una-notebook': '2026-11-03',
  'intel-core-i5-o-ryzen-5-cual-conviene': '2026-11-03',
  'notebook-ssd-256-o-512-gb': '2026-11-03',
  'que-zte-comprar': '2026-11-03',
  'que-xiaomi-redmi-comprar': '2026-11-03',
  'black-friday-argentina-que-conviene-comprar': '2026-11-04',
  'que-regalar-en-navidad-segun-presupuesto': '2026-11-04',
  'como-saber-si-un-perfume-es-original': '2026-11-04',
}

export const FECHAS_GUIAS_LONG_TAIL: Record<string, { publicada: string; modificada: string }> = Object.fromEntries(
  GUIAS_LONG_TAIL.map(g => {
    const f = FECHAS_NUEVAS[g.slug] ?? '2026-10-15'
    return [g.slug, { publicada: f, modificada: f }]
  }),
)
