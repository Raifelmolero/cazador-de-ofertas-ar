// Guías de compra de ticket alto (colchones, sommiers, herramientas, aires,
// heladeras, termotanques, fitness). Solo criterios técnicos verificables: no
// hay precios, reseñas ni cantidades vendidas inventadas. Los precios reales
// están en las categorías y comparativas que se enlazan.
import type { Guia } from './guias'

export const GUIAS_TICKET_ALTO: Guia[] = [
  {
    slug: 'colchon-de-resortes-o-de-espuma',
    titulo: 'Colchón de resortes o de espuma: cuál conviene y para quién',
    descripcion:
      'Diferencias entre colchón de resortes (bonnell y pocket) y de espuma (poliuretano, alta densidad, viscoelástico): firmeza, durabilidad, calor, movimiento de a dos y cuál elegir según tu peso y cómo dormís.',
    pregunta: '¿Conviene más un colchón de resortes o uno de espuma?',
    respuestaCorta:
      'Ninguno es mejor en todo. El de espuma de alta densidad es silencioso, no transmite el movimiento de a dos y suele ser más cómodo para quien busca contención; el de resortes ventila más y da un apoyo más firme y elástico. Con resortes pocket (individuales) se logra lo mejor de los dos mundos, y es la opción habitual para dos personas. Lo que más pesa en la decisión es tu peso, la posición en la que dormís y si tenés calor de noche.',
    secciones: [
      {
        h: 'Cómo es un colchón de resortes',
        p: [
          'Tiene un núcleo de resortes de acero cubierto por capas de espuma o fibras. Hay dos tipos comunes: bonnell (los resortes están unidos entre sí en una sola red) y pocket o embolsados (cada resorte va en su funda y trabaja por separado).',
          'El bonnell es más económico y firme, pero un movimiento en un lado se siente en el otro. El pocket se adapta mejor al cuerpo y aísla el movimiento, por eso rinde mejor en una cama de dos.',
          'Al tener aire entre los resortes, ventilan bien y suelen sentirse más frescos.',
        ],
      },
      {
        h: 'Cómo es un colchón de espuma',
        p: [
          'Es de espuma de poliuretano en bloque. Lo que más cambia su calidad es la densidad (se indica en kg/m³): a mayor densidad, mejor aguanta el uso sin hundirse. Hay también espumas viscoelásticas (memory foam) que copian la forma del cuerpo.',
          'Es silencioso, no cruje, no transmite el movimiento de la otra persona y suele ser más liviano. A cambio, puede retener más calor, sobre todo el viscoelástico, y una espuma de baja densidad se deforma en pocos años.',
        ],
      },
      {
        h: 'Cuál elegir según tu caso',
        p: [
          'Dormís de lado y buscás contención en hombros y cadera: espuma de alta densidad o resortes pocket con capa superior de confort.',
          'Dormís boca arriba o boca abajo y preferís apoyo firme: resortes o espuma de alta densidad firme.',
          'Sos una persona de más peso: mirá el peso máximo que declara el fabricante por plaza; en general conviene un colchón firme, ya sea de resortes pocket o de espuma de densidad alta.',
          'Tenés calor de noche: los resortes ventilan mejor que una espuma densa o viscoelástica.',
          'Dormís de a dos y uno se mueve mucho: resortes pocket o espuma.',
        ],
      },
      {
        h: 'Qué mirar en la ficha antes de pagar',
        p: [
          'Densidad de la espuma (kg/m³) y altura total del colchón.',
          'Tipo de resorte (bonnell o pocket) y cantidad aproximada si el fabricante la informa.',
          'Peso máximo recomendado por plaza.',
          'Garantía del fabricante y si el colchón viene comprimido en caja, que puede tardar entre 24 y 48 horas en tomar su forma.',
          'Medida exacta: mirá la guía de medidas de colchón y sommier.',
        ],
      },
      {
        h: 'Un dato práctico',
        p: [
          'Cuando no sepas, buscá un colchón con política de prueba o devolución clara y respetá el período de adaptación: el cuerpo tarda unas semanas en acostumbrarse a un colchón nuevo.',
          'No damos precios fijos acá: en la categoría de colchones y en la comparativa están los que están en oferta hoy, con el precio actual y el descuento verificado contra el historial.',
        ],
      },
    ],
    categoria: { slug: 'colchones', nombre: 'colchones' },
    comparativa: 'mejores-colchones-2-plazas',
    cta: { href: '/mejores/mejores-colchones-2-plazas', titulo: 'Colchones en oferta hoy, comparados', boton: 'Ver la comparativa de colchones 🛏️' },
    faq: [
      {
        q: '¿Qué colchón es mejor para la espalda?',
        a: 'Uno que mantenga la columna alineada: ni tan blando que te hunda ni tan duro que no acompañe la curva de la espalda. Para la mayoría, una firmeza media o media-firme. Si tenés una molestia, consultá con tu médico.',
      },
      {
        q: '¿Cuánto dura un colchón de espuma?',
        a: 'Depende de la densidad y del uso. Una espuma de baja densidad se hunde antes; una de alta densidad aguanta más. El fabricante informa la garantía, que es un buen indicio de la calidad esperada.',
      },
      {
        q: '¿Qué son los resortes pocket?',
        a: 'Son resortes embolsados individualmente que trabajan por separado. Se adaptan mejor al cuerpo y evitan que el movimiento de una persona se transmita a la otra.',
      },
      {
        q: '¿El colchón viscoelástico es más caluroso?',
        a: 'Suele retener más calor que uno de resortes, porque la espuma densa ventila menos. Algunos modelos traen capas con gel o perforaciones para mejorar la ventilación.',
      },
    ],
    enlaces: [
      { href: '/guias/que-colchon-comprar-firmeza-y-material', texto: 'Qué colchón comprar: firmeza y material' },
      { href: '/guias/medidas-de-colchon-y-sommier', texto: 'Medidas de colchón y sommier' },
      { href: '/guias/cuanto-sale-un-colchon-2-plazas', texto: 'Cuánto sale un colchón 2 plazas' },
      { href: '/mejores/mejores-sommiers', texto: 'Mejores sommiers' },
      { href: '/categoria/colchones', texto: 'Colchones en oferta' },
      { href: '/precio', texto: 'Precio de hoy de cada producto' },
    ],
  },
  {
    slug: 'medidas-de-colchon-y-sommier',
    titulo: '¿Qué medida de sommier necesito? Medidas de colchón en Argentina',
    descripcion:
      'Medidas estándar de colchones y sommiers en Argentina (1 plaza, 1 y media, 2 plazas, queen, king), cómo medir tu cama, qué altura tiene el conjunto y qué fijarte para que el colchón entre justo.',
    pregunta: '¿Qué medida de sommier necesito?',
    respuestaCorta:
      'El sommier tiene que ser de la misma medida que el colchón. Las medidas más comunes en Argentina son 1 plaza (80 u 90 x 190 cm), 1 plaza y media (100 x 190), 2 plazas (130 o 140 x 190), queen (160 x 200) y king (180 x 200, o 200 x 200). Antes de comprar, medí el lugar de la cama y las puertas por donde tiene que pasar.',
    secciones: [
      {
        h: 'Medidas más comunes',
        p: [
          '1 plaza: 80 x 190 cm o 90 x 190 cm.',
          '1 plaza y media: 100 x 190 cm.',
          '2 plazas: 130 x 190 cm o 140 x 190 cm.',
          'Queen: 160 x 200 cm.',
          'King: 180 x 200 cm, y en algunas marcas 200 x 200 cm.',
          'No hay un estándar único obligatorio, y algunas marcas varían unos centímetros: por eso conviene confirmar siempre las medidas exactas en la ficha del producto.',
        ],
      },
      {
        h: 'Cómo medir antes de comprar',
        p: [
          'Medí el largo y el ancho del lugar donde va la cama y dejá espacio para circular y abrir placares: lo recomendable es un paso libre de al menos 60 cm alrededor.',
          'Si ya tenés sommier o base y solo cambiás el colchón, medí la base por fuera: el colchón nuevo tiene que tener la misma medida, ni más chico ni más grande.',
          'Medí también el ancho de puertas, pasillos y escaleras: un queen o king de una pieza puede no pasar por un pasillo angosto. Los conjuntos de dos módulos o los colchones comprimidos en caja resuelven ese problema.',
        ],
      },
      {
        h: 'Colchón solo, sommier solo o conjunto',
        p: [
          'El sommier es la base sobre la que se apoya el colchón (puede ser de madera con tablas, de metal o tapizado). Si tu cama no tiene una base firme y ventilada, el colchón se deteriora antes.',
          'El conjunto (sommier más colchón) suele ser una compra práctica porque la medida ya coincide y la altura final queda armada. Comparalo contra comprar las dos cosas por separado.',
          'Fijate si el sommier trae patas incluidas, cajones o respaldo, y cuánto soporta como peso máximo.',
        ],
      },
      {
        h: 'La altura total',
        p: [
          'La altura final de la cama es la del sommier más la del colchón. Una cama muy alta puede ser incómoda para personas mayores o para chicos, y una muy baja cuesta más para levantarse.',
          'Si tenés sábanas ajustables, verificá que alcancen para la altura del colchón nuevo, sobre todo si es de espuma o con pillow top, que suele ser más alto.',
        ],
      },
      {
        h: 'Cuál medida elegir según el espacio y las personas',
        p: [
          'Una persona sola: 1 plaza o 1 plaza y media si querés más lugar.',
          'Dos personas: 2 plazas es lo mínimo, pero queen o king dan más comodidad, siempre que entren en el dormitorio dejando espacio para circular.',
          'Pensá si la cama va a crecer con vos o con los chicos: es más fácil acertar la medida ahora que cambiar toda la ropa de cama después.',
        ],
      },
    ],
    categoria: { slug: 'colchones', nombre: 'colchones y sommiers' },
    comparativa: 'mejores-sommiers',
    cta: { href: '/mejores/mejores-sommiers', titulo: 'Sommiers y conjuntos en oferta hoy, comparados', boton: 'Ver la comparativa de sommiers 🛏️' },
    faq: [
      {
        q: '¿Qué diferencia hay entre 2 plazas y queen?',
        a: 'El 2 plazas mide 130 o 140 cm de ancho por 190 de largo; el queen mide 160 x 200 cm, con más ancho y más largo. El queen es más cómodo para dos personas, pero necesita un dormitorio más grande.',
      },
      {
        q: '¿Cuánto mide un colchón king?',
        a: 'Lo más común es 180 x 200 cm. Algunas marcas lo hacen de 200 x 200 cm, por eso hay que confirmar la medida en la ficha.',
      },
      {
        q: '¿Se puede usar un colchón sin sommier?',
        a: 'Sí, siempre que lo apoyes sobre una base firme, plana y ventilada. Apoyarlo directo en el piso o en una base sin ventilación favorece la humedad y desgasta el colchón.',
      },
      {
        q: '¿Qué hago si el colchón no pasa por la puerta?',
        a: 'Buscá un conjunto de sommier en dos módulos o un colchón enrollado en caja, que llega comprimido y toma su forma al abrirlo.',
      },
    ],
    enlaces: [
      { href: '/guias/colchon-de-resortes-o-de-espuma', texto: 'Colchón de resortes o de espuma' },
      { href: '/guias/cuanto-sale-un-colchon-2-plazas', texto: 'Cuánto sale un colchón 2 plazas' },
      { href: '/guias/que-colchon-comprar-firmeza-y-material', texto: 'Qué colchón comprar' },
      { href: '/mejores/mejores-colchones-2-plazas', texto: 'Mejores colchones 2 plazas' },
      { href: '/categoria/colchones', texto: 'Colchones y sommiers en oferta' },
    ],
  },
  {
    slug: 'cuanto-sale-un-colchon-2-plazas',
    titulo: '¿Cuánto sale un colchón de 2 plazas? De qué depende el precio',
    descripcion:
      'De qué depende el precio de un colchón de 2 plazas, queen o king en Argentina: material, densidad, resortes, medida, garantía, y cómo saber si estás pagando de más con el historial de precios.',
    pregunta: '¿Cuánto sale un colchón de 2 plazas?',
    respuestaCorta:
      'No hay un precio único: varía mucho según el material (espuma, resortes bonnell o pocket), la densidad, la altura, el tamaño y la marca. Como los precios en Argentina se mueven seguido, lo confiable es mirar el precio de hoy y compararlo con el historial: en Cazador de Ofertas mostramos el precio actual, el descuento verificado y el mínimo que registramos.',
    secciones: [
      {
        h: 'Por qué el rango de precios es tan amplio',
        p: [
          'Dos colchones de 2 plazas pueden verse parecidos y ser muy distintos por dentro. Lo que más mueve el precio es el núcleo: una espuma de baja densidad cuesta bastante menos que una de alta densidad, y un resorte bonnell menos que un pocket.',
          'También pesan la altura del colchón, las capas de confort (pillow top, viscoelástico, látex), la marca y la garantía que da el fabricante.',
          'Y la medida: un queen o un king salen más que un 2 plazas, y un conjunto con sommier más que el colchón solo.',
        ],
      },
      {
        h: 'Qué mirar para no pagar de más',
        p: [
          'Compará colchones de la misma medida y del mismo tipo de núcleo: comparar una espuma básica con un pocket de gama alta no sirve.',
          'Fijate la densidad de la espuma y el peso máximo por plaza: son datos que el fabricante informa y permiten comparar calidad real.',
          'Mirá la garantía: una garantía más larga suele ir con un producto de mejor calidad.',
          'Revisá si el precio incluye envío y cuántas cuotas ofrece. Para ver cuánto te cuesta una compra en cuotas, usá la calculadora de cuotas sin interés.',
        ],
      },
      {
        h: 'Cómo saber si el descuento es real',
        p: [
          'En colchones es muy común ver "40% OFF" o más. Ese porcentaje se calcula contra un precio anterior que define el vendedor y no siempre fue el precio real.',
          'Por eso en Cazador de Ofertas guardamos el historial: si el colchón ya estuvo igual de barato antes, descartamos la oferta. Los que quedan tienen la baja verificada, y a los que están en su precio más bajo registrado les ponemos el sello de mínimo histórico.',
        ],
      },
      {
        h: 'Colchón solo o conjunto con sommier',
        p: [
          'Si ya tenés una base en buen estado, con el colchón alcanza. Si tenés que armar la cama de cero, el conjunto suele resultar más práctico y a veces más conveniente que comprar todo por separado; vale la pena comparar ambas opciones.',
        ],
      },
      {
        h: 'Cuándo conviene comprar',
        p: [
          'Los colchones son de los productos que más suben en eventos como el Cyber Monday y el Black Friday, pero también donde más descuentos inflados hay. La regla es la de siempre: comprá cuando el precio está en el mínimo o cerca del mínimo registrado, no cuando el porcentaje es más grande.',
          'En la comparativa de colchones 2 plazas ves el precio de hoy de cada uno. En la sección de precio de hoy ves además cómo evolucionó.',
        ],
      },
    ],
    categoria: { slug: 'colchones', nombre: 'colchones' },
    comparativa: 'mejores-colchones-2-plazas',
    cta: { href: '/mejores/mejores-colchones-2-plazas', titulo: 'Precios de hoy de colchones 2 plazas', boton: 'Ver precios de hoy de colchones 🛏️' },
    faq: [
      {
        q: '¿Cuánto sale un colchón queen o king?',
        a: 'Más que un 2 plazas, porque lleva más material. El precio exacto depende del tipo de núcleo y la marca: mirá el precio de hoy en la comparativa en lugar de guiarte por números viejos.',
      },
      {
        q: '¿Es más barato un colchón de espuma que uno de resortes?',
        a: 'Depende de la calidad: una espuma básica suele ser más barata, pero una de alta densidad o viscoelástica puede costar tanto o más que un resorte pocket.',
      },
      {
        q: '¿Conviene comprar el colchón en cuotas sin interés?',
        a: 'Si la cuota es realmente sin interés y el precio es el mismo que de contado, sí. Verificalo con la calculadora de cuotas, porque a veces el precio en cuotas es mayor.',
      },
      {
        q: '¿Cada cuánto conviene cambiar el colchón?',
        a: 'Depende de la calidad y el uso, pero cuando notás que se hunde, te despertás con dolores o aparece una marca donde dormís siempre, es señal de que ya cumplió su ciclo.',
      },
    ],
    enlaces: [
      { href: '/guias/colchon-de-resortes-o-de-espuma', texto: 'Colchón de resortes o de espuma' },
      { href: '/guias/medidas-de-colchon-y-sommier', texto: 'Medidas de colchón y sommier' },
      { href: '/guias/como-saber-si-un-descuento-de-mercado-libre-es-real', texto: 'Cómo saber si un descuento es real' },
      { href: '/calculadora-cuotas-sin-interes', texto: 'Calculadora de cuotas sin interés' },
      { href: '/mejores/mejores-sommiers', texto: 'Mejores sommiers' },
      { href: '/precio', texto: 'Precio de hoy' },
    ],
  },
  {
    slug: 'soldadora-inverter-o-convencional',
    titulo: 'Soldadora inverter o convencional: cuál conviene comprar',
    descripcion:
      'Diferencias entre soldadora inverter y convencional (transformador) para electrodo: peso, consumo, calidad del arco, instalación eléctrica, ciclo de trabajo y qué elegir para el taller de casa o para uso intensivo.',
    pregunta: '¿Conviene una soldadora inverter o una convencional?',
    respuestaCorta:
      'Para la mayoría de la gente conviene la inverter: pesa mucho menos, da un arco más estable y fácil de manejar, consume menos y es más cómoda de llevar. La convencional (de transformador) es más pesada pero muy robusta y simple, y aguanta uso rudo continuo. Para el taller de casa, el hobby o trabajos de mantenimiento, una inverter suele ser la mejor compra.',
    secciones: [
      {
        h: 'Cómo funciona cada una',
        p: [
          'La soldadora convencional usa un transformador grande de cobre y hierro: baja la tensión y sube la corriente. Es una tecnología vieja, robusta y simple.',
          'La inverter convierte la electricidad con componentes electrónicos, lo que permite un equipo mucho más chico y liviano, con un arco más controlado.',
        ],
      },
      {
        h: 'Ventajas de la inverter',
        p: [
          'Peso y tamaño: mucho más liviana y compacta, se lleva fácil a una obra o se guarda en cualquier rincón.',
          'Arco más estable: es más fácil de encender y mantener, lo que ayuda a quien recién empieza.',
          'Consumo: aprovecha mejor la energía, y muchas pueden usarse con instalaciones domiciliarias comunes.',
          'Regulación: la mayoría ajusta la corriente con precisión y trae funciones de ayuda al arranque.',
        ],
      },
      {
        h: 'Ventajas de la convencional',
        p: [
          'Es muy robusta y tolera golpes, polvo y trabajo continuo en talleres exigentes.',
          'Tiene menos electrónica que pueda fallar y suele repararse fácil.',
          'A cambio es pesada, voluminosa y suele consumir más, y el arco es menos suave para un principiante.',
        ],
      },
      {
        h: 'Qué mirar antes de comprar',
        p: [
          'Amperaje: define el espesor de chapa que podés soldar y el diámetro de electrodo que podés usar. Para trabajos de casa y reparaciones, un rango medio suele alcanzar.',
          'Ciclo de trabajo (duty cycle): indica cuánto tiempo puede soldar seguida sin recalentarse. Si vas a hacer cordones largos, importa.',
          'Alimentación: confirmá que tu instalación eléctrica soporta la corriente que pide el equipo (monofásica común o trifásica).',
          'Qué incluye: pinza de masa, pinza portaelectrodo, cables y máscara. Una máscara de oscurecimiento automático ayuda mucho.',
          'Seguridad: usá siempre máscara, guantes, ropa que cubra y un lugar ventilado y sin materiales inflamables cerca.',
        ],
      },
      {
        h: 'Cuál elegir según tu uso',
        p: [
          'Taller de casa, hobby, reparaciones, portones y rejas: inverter de potencia media.',
          'Uso profesional intensivo con trabajo pesado todo el día: una inverter profesional de mayor ciclo de trabajo o una convencional robusta, según el presupuesto y la instalación.',
          'Si querés soldar aluminio o hacer cordones de alta terminación, vas a necesitar un equipo de otro tipo (MIG o TIG), que no es lo mismo que una soldadora para electrodo.',
        ],
      },
    ],
    categoria: { slug: 'herramientas-electricas', nombre: 'herramientas eléctricas' },
    comparativa: 'mejores-soldadoras',
    cta: { href: '/mejores/mejores-soldadoras', titulo: 'Soldadoras en oferta hoy, comparadas', boton: 'Ver la comparativa de soldadoras 🔧' },
    faq: [
      {
        q: '¿Qué soldadora inverter conviene para el hogar?',
        a: 'Una de potencia media para electrodo, con el amperaje suficiente para chapa y perfiles comunes, que incluya cables y máscara. Mirá el amperaje y el ciclo de trabajo en la ficha.',
      },
      {
        q: '¿Una soldadora inverter consume menos luz?',
        a: 'En general aprovecha mejor la energía que una convencional del mismo rendimiento. El consumo real depende de la potencia y del tiempo de uso.',
      },
      {
        q: '¿Se puede usar una soldadora inverter con un generador?',
        a: 'Algunas sí, pero depende de la potencia del generador y de la soldadora. Revisá en el manual el requerimiento de potencia antes de conectarla.',
      },
      {
        q: '¿Qué electrodos uso?',
        a: 'Para acero común, los de rutilo (6013) son los más fáciles de usar para empezar. El diámetro depende del espesor de la pieza y del amperaje del equipo.',
      },
    ],
    enlaces: [
      { href: '/guias/que-soldadora-comprar', texto: 'Qué soldadora comprar' },
      { href: '/guias/taladro-percutor-o-atornillador', texto: 'Taladro percutor o atornillador' },
      { href: '/guias/que-amoladora-comprar', texto: 'Qué amoladora comprar' },
      { href: '/guias/herramientas-electricas-cyber-monday-black-friday', texto: 'Herramientas en Cyber Monday' },
      { href: '/categoria/herramientas-electricas', texto: 'Herramientas eléctricas en oferta' },
    ],
  },
  {
    slug: 'taladro-percutor-o-atornillador',
    titulo: 'Taladro percutor o atornillador: cuál necesito',
    descripcion:
      'Diferencias entre taladro percutor, atornillador a batería y taladro atornillador: para qué sirve cada uno, qué son las revoluciones y el torque, batería de litio, mandril y qué conviene para la casa.',
    pregunta: '¿Necesito un taladro percutor o un atornillador?',
    respuestaCorta:
      'Si vas a perforar hormigón o ladrillo (colgar un estante en una pared, instalar un aire), necesitás un taladro percutor con cable o un taladro percutor a batería. Si lo tuyo es atornillar y perforar madera, chapa o durlock, un atornillador o un taladro atornillador a batería es más cómodo y liviano. Para la casa, la opción más versátil es un taladro percutor a batería con dos velocidades.',
    secciones: [
      {
        h: 'Qué hace cada uno',
        p: [
          'Taladro percutor: además de girar, golpea en el eje (percusión), lo que le permite perforar materiales duros como ladrillo, hormigón o piedra con una mecha de widia. Sin percusión, solo gira, y sirve para madera y metal.',
          'Atornillador: está pensado para atornillar y desatornillar. Tiene poca fuerza de perforación pero es liviano y se maneja con una mano. Suele ser a batería.',
          'Taladro atornillador: combina las dos funciones. Es el que más se ve a batería, con regulación de torque para atornillar sin pasarse.',
        ],
      },
      {
        h: 'Los datos de la ficha que importan',
        p: [
          'Potencia (en watts, en los de cable): más potencia, más capacidad para perforar materiales duros. Para uso hogareño, un taladro de potencia media suele alcanzar.',
          'Tensión de la batería (en volts, en los inalámbricos): en general, a más volts, más fuerza; los de 12 V son livianos y los de 18 o 20 V rinden para trabajos más exigentes.',
          'Capacidad de la batería (Ah): define cuánto dura trabajando. Conviene que traiga dos baterías para no frenar el trabajo.',
          'Revoluciones por minuto (RPM) y velocidades: dos velocidades permiten usar alta para perforar y baja para atornillar con más fuerza.',
          'Torque: es la fuerza de giro. Un regulador de torque evita que se estropee el tornillo o la pieza.',
          'Mandril: el de 13 mm acepta mechas más gruesas; el de 10 mm es común en los livianos. Los de encastre rápido agilizan el cambio.',
        ],
      },
      {
        h: 'Cable o batería',
        p: [
          'Con cable tenés potencia constante sin que se acabe la carga, pero dependés de un enchufe y de un alargue. Es una buena opción si perforás paredes con frecuencia.',
          'A batería gana en comodidad y movilidad, ideal para trabajar en altura o en lugares sin enchufe. Las baterías de litio son livianas y no se descargan solas tan rápido. Revisá el tiempo de carga y que sea fácil conseguir repuestos de batería.',
        ],
      },
      {
        h: 'Cuál conviene según el trabajo',
        p: [
          'Colgar cuadros y estantes en pared de ladrillo o cemento: taladro percutor.',
          'Armar muebles, atornillar madera o durlock: taladro atornillador o atornillador.',
          'Instalar un aire acondicionado o hacer perforaciones grandes en hormigón: percutor potente, y en algunos casos un martillo rotopercutor.',
          'Todo lo anterior de manera ocasional: un taladro percutor a batería de 18 V con dos baterías cubre casi todo en una casa.',
        ],
      },
      {
        h: 'Cuidados y seguridad',
        p: [
          'Usá anteojos de seguridad al perforar y la mecha adecuada para cada material (widia para pared, HSS para metal, mechas de punta para madera).',
          'Antes de perforar una pared, verificá que no pasen caños ni cables por ese lugar.',
          'No fuerces el taladro: dejá que la mecha haga el trabajo y desenchufá o sacá la batería para cambiar de mecha.',
        ],
      },
    ],
    categoria: { slug: 'herramientas-electricas', nombre: 'herramientas eléctricas' },
    comparativa: 'mejores-taladros',
    cta: { href: '/mejores/mejores-taladros', titulo: 'Taladros en oferta hoy, comparados', boton: 'Ver la comparativa de taladros 🔧' },
    faq: [
      {
        q: '¿Qué significa que un taladro sea percutor?',
        a: 'Que además de girar puede golpear, lo que le permite perforar materiales duros como ladrillo u hormigón. Sin la función de percusión no hace falta para madera ni metal.',
      },
      {
        q: '¿Cuántos volts conviene que tenga un taladro a batería?',
        a: 'Para uso en casa, 12 V alcanza para atornillar y perforar madera; 18 o 20 V da más fuerza para perforar pared y trabajar más tiempo.',
      },
      {
        q: '¿Se puede perforar hormigón con un atornillador?',
        a: 'No es lo indicado. Para hormigón y ladrillo necesitás un taladro con percusión o un rotopercutor.',
      },
      {
        q: '¿Cuántas baterías conviene que traiga?',
        a: 'Dos, así podés seguir trabajando mientras la otra se carga. Es una de las cosas que más se agradece en el uso real.',
      },
    ],
    enlaces: [
      { href: '/guias/que-taladro-comprar-para-la-casa', texto: 'Qué taladro comprar para la casa' },
      { href: '/guias/que-amoladora-comprar', texto: 'Qué amoladora comprar' },
      { href: '/guias/soldadora-inverter-o-convencional', texto: 'Soldadora inverter o convencional' },
      { href: '/guias/herramientas-electricas-cyber-monday-black-friday', texto: 'Herramientas en Cyber Monday' },
      { href: '/categoria/herramientas-electricas', texto: 'Herramientas eléctricas en oferta' },
    ],
  },
  {
    slug: 'aire-acondicionado-inverter-o-convencional',
    titulo: 'Aire acondicionado inverter o convencional: cuál conviene',
    descripcion:
      'Diferencias entre un aire acondicionado split inverter y uno convencional (on/off): cómo funcionan, consumo, ruido, confort, precio de compra, etiqueta de eficiencia energética y cuándo vale la pena el inverter.',
    pregunta: '¿Conviene un aire acondicionado inverter o uno convencional?',
    respuestaCorta:
      'En general conviene el inverter si lo vas a usar muchas horas: regula la velocidad del compresor en vez de prenderse y apagarse, mantiene la temperatura más estable, hace menos ruido y suele consumir menos. El convencional (on/off) es más barato de comprar y puede servir si lo usás pocas horas al año. La diferencia de precio inicial se compensa con la factura de luz cuanto más lo uses.',
    secciones: [
      {
        h: 'Cómo funciona cada uno',
        p: [
          'El aire convencional (on/off) tiene un compresor que trabaja siempre a la misma velocidad: cuando llega a la temperatura pedida se apaga, y cuando el ambiente vuelve a calentarse se prende de nuevo.',
          'El inverter ajusta la velocidad del compresor. Primero trabaja fuerte para llegar rápido a la temperatura y después baja la marcha para mantenerla, sin apagarse del todo.',
        ],
      },
      {
        h: 'Qué ventajas tiene el inverter',
        p: [
          'Consumo: al no hacer los picos de arranque del compresor, suele gastar menos energía en uso prolongado.',
          'Confort: la temperatura se mantiene más pareja, sin los vaivenes de frío y calor del on/off.',
          'Ruido: al trabajar a menor velocidad, suele ser más silencioso, algo que se nota en un dormitorio.',
          'Muchos modelos inverter son frío-calor, así que sirven también para calefaccionar en invierno.',
        ],
      },
      {
        h: 'Cuándo puede convenir el convencional',
        p: [
          'Si lo vas a usar pocas horas al año, la diferencia de consumo no llega a compensar el mayor precio del inverter.',
          'Si el presupuesto es lo que más pesa, un on/off de la potencia correcta resuelve el calor.',
          'Si el equipo va a una vivienda alquilada o un lugar de uso ocasional, también puede ser razonable.',
        ],
      },
      {
        h: 'Cómo comparar consumo de verdad',
        p: [
          'Mirá la etiqueta de eficiencia energética del equipo (va de A, la más eficiente, hasta G) y el dato de potencia eléctrica en watts.',
          'Con los watts y las horas de uso podés estimar el consumo con la calculadora de consumo eléctrico. Para saber qué potencia de frío necesitás, usá la calculadora de frigorías: un equipo mal dimensionado, sea inverter o no, consume más y enfría peor.',
        ],
      },
      {
        h: 'Otros datos que importan',
        p: [
          'La instalación: el split requiere instalador y cañerías. Preguntá qué incluye el precio y qué no.',
          'Garantía y servicio técnico: confirmá que la marca tenga service en tu zona.',
          'Frío solo o frío-calor: si querés usarlo también en invierno, elegí frío-calor.',
        ],
      },
    ],
    categoria: { slug: 'aire-acondicionado', nombre: 'aires acondicionados' },
    comparativa: 'mejores-aires-acondicionados',
    cta: { href: '/mejores/mejores-aires-acondicionados', titulo: 'Aires acondicionados en oferta hoy, comparados', boton: 'Ver la comparativa de aires ❄️' },
    faq: [
      {
        q: '¿El aire inverter consume menos?',
        a: 'En uso prolongado suele consumir menos que uno convencional del mismo tamaño, porque regula el compresor en vez de prenderse y apagarse. La diferencia real depende del modelo y de las horas de uso.',
      },
      {
        q: '¿Vale la pena pagar más por un inverter?',
        a: 'Si lo usás muchas horas al día o durante varios meses, probablemente sí; si lo usás pocos días al año, puede no llegar a compensarse.',
      },
      {
        q: '¿Los aires inverter hacen frío y calor?',
        a: 'Muchos modelos sí, pero no todos. Fijate en la ficha si dice frío-calor o solo frío.',
      },
      {
        q: '¿Cuántas frigorías necesito?',
        a: 'Depende de los metros cuadrados, la exposición al sol y el aislamiento. Usá la calculadora de frigorías para estimarlo.',
      },
    ],
    enlaces: [
      { href: '/guias/cuantas-frigorias-necesito-aire-acondicionado', texto: 'Cuántas frigorías necesito' },
      { href: '/guias/aire-acondicionado-portatil-o-split', texto: 'Aire portátil o split' },
      { href: '/guias/conviene-comprar-aire-acondicionado-cyber-monday', texto: 'Aire en Cyber Monday' },
      { href: '/calculadora-frigorias', texto: 'Calculadora de frigorías' },
      { href: '/calculadora-consumo-electrico', texto: 'Calculadora de consumo eléctrico' },
      { href: '/categoria/aire-acondicionado', texto: 'Aires en oferta' },
    ],
  },
  {
    slug: 'heladera-no-frost-o-con-freezer',
    titulo: 'Heladera No Frost o con freezer: cuál conviene y qué medidas mirar',
    descripcion:
      'Diferencias entre heladera No Frost y heladera con freezer (cíclica): descongelado, consumo, capacidad útil, ubicación del freezer, medidas de nicho, etiqueta energética y cuál conviene según tu familia.',
    pregunta: '¿Conviene más una heladera No Frost o una con freezer?',
    respuestaCorta:
      'La No Frost evita tener que descongelar a mano, mantiene el frío más parejo y no se llena de hielo, a cambio suele costar más. La heladera cíclica, con freezer y descongelado manual, es más simple y barata, pero requiere desescarcharla cada tanto. Para una familia o uso intensivo conviene No Frost; para uso liviano o presupuesto ajustado, una cíclica puede alcanzar.',
    secciones: [
      {
        h: 'Cómo funciona cada una',
        p: [
          'En la heladera cíclica, el frío viene de una placa evaporadora. Con el uso se forma hielo (escarcha) que hay que sacar periódicamente apagando y descongelando.',
          'En la No Frost, un ventilador reparte el aire frío y un sistema automático evita la acumulación de hielo. Por eso no necesita descongelado manual.',
        ],
      },
      {
        h: 'Ventajas de la No Frost',
        p: [
          'No hay que descongelar: ahorra tiempo y evita los típicos "días de limpiar el hielo".',
          'El frío es más parejo en todo el interior, lo que ayuda a conservar alimentos.',
          'Los alimentos no quedan pegados por el hielo y los estantes son más fáciles de acomodar.',
          'Muchos modelos incluyen etiqueta de eficiencia energética alta y funciones extra (dispenser, control digital).',
        ],
      },
      {
        h: 'Ventajas de la cíclica (con freezer)',
        p: [
          'Suele ser más económica de comprar y de reparar, porque es de menor complejidad.',
          'Puede ser una buena opción para uso ocasional, para una casa de fin de semana o para alguien que vive solo.',
          'Hay que descongelar a mano cada tanto: es el precio de pagar menos.',
        ],
      },
      {
        h: 'Cómo elegir el tamaño y el formato',
        p: [
          'Capacidad: la capacidad en litros es el dato principal. Como referencia, para una o dos personas alcanza una capacidad menor, y para una familia hace falta más; revisá cuánta comida guardás por semana.',
          'Formato: freezer arriba (el clásico), freezer abajo (más cómodo porque lo que más usás queda a la altura de los ojos) o side by side (dos puertas, mucha capacidad, requiere más ancho).',
          'Medidas del nicho: medí el alto, el ancho y la profundidad del lugar donde va y dejá unos centímetros libres atrás y a los costados para ventilación. Verificá también que la heladera pase por la puerta de entrada.',
          'Apertura de la puerta: confirmá que haya espacio para abrirla del todo y que el sentido de apertura sea el que necesitás.',
        ],
      },
      {
        h: 'Consumo y etiqueta energética',
        p: [
          'La etiqueta de eficiencia energética (de A a G) te dice qué tan eficiente es: cuanto más cerca de A, menos consume por litro. Como la heladera funciona las 24 horas, la diferencia se nota en la factura todo el año.',
          'Mirá también el consumo anual en kWh que indica la etiqueta y compará modelos de capacidad similar.',
        ],
      },
    ],
    categoria: { slug: 'heladeras', nombre: 'heladeras' },
    comparativa: 'mejores-heladeras',
    cta: { href: '/mejores/mejores-heladeras', titulo: 'Heladeras en oferta hoy, comparadas', boton: 'Ver la comparativa de heladeras 🧊' },
    faq: [
      {
        q: '¿Qué significa No Frost?',
        a: 'Que la heladera evita la formación de hielo en el interior gracias a la circulación de aire frío y un sistema automático de descongelado. No tenés que descongelarla a mano.',
      },
      {
        q: '¿La No Frost consume más?',
        a: 'No necesariamente: depende del modelo y de su etiqueta de eficiencia energética. Compará el consumo anual en kWh entre modelos de capacidad similar.',
      },
      {
        q: '¿Qué capacidad necesito?',
        a: 'Depende de cuántas personas son y cuánto cocinan. Mirá la capacidad en litros y pensá en la cantidad de comida que guardás en una semana normal.',
      },
      {
        q: '¿Cuánto espacio hay que dejar para ventilar una heladera?',
        a: 'Cada fabricante indica sus medidas en el manual; en general piden unos centímetros libres atrás, a los costados y arriba para que el calor se disipe.',
      },
    ],
    enlaces: [
      { href: '/guias/que-heladera-comprar', texto: 'Qué heladera comprar' },
      { href: '/guias/que-freezer-comprar', texto: 'Qué freezer comprar' },
      { href: '/calculadora-consumo-electrico', texto: 'Calculadora de consumo eléctrico' },
      { href: '/categoria/heladeras', texto: 'Heladeras en oferta' },
      { href: '/precio', texto: 'Precio de hoy' },
    ],
  },
  {
    slug: 'termotanque-electrico-o-a-gas-o-calefon',
    titulo: 'Termotanque eléctrico, a gas o calefón: cuál conviene en casa',
    descripcion:
      'Diferencias entre termotanque a gas, termotanque eléctrico, calefón y calefón de bajo consumo: cómo calientan, capacidad, consumo, instalación y seguridad, para decidir cuál conviene según tu familia y tu instalación.',
    pregunta: '¿Qué conviene: termotanque eléctrico, a gas o calefón?',
    respuestaCorta:
      'Si tenés gas natural o envasado, el termotanque a gas suele ser el que más conviene por costo de uso; el calefón calienta el agua al instante sin guardarla, ideal para espacios chicos pero con menos caudal simultáneo. El termotanque eléctrico no necesita gas ni conducto de ventilación, y sirve donde no hay gas, aunque el costo de la energía pesa más. Depende de qué instalación tenés y cuántas personas usan agua caliente.',
    secciones: [
      {
        h: 'Termotanque a gas',
        p: [
          'Guarda el agua en un tanque aislado y la mantiene caliente con un quemador. Tiene agua lista y buen caudal para varias canillas a la vez.',
          'Requiere instalación de gas y salida de gases de combustión al exterior, hecha por un gasista matriculado. Sin esa instalación correcta no es seguro.',
          'La capacidad se mide en litros: para pocas personas alcanza una chica, y para una familia más grande conviene un tanque mayor.',
        ],
      },
      {
        h: 'Termotanque eléctrico',
        p: [
          'Calienta el agua con una resistencia eléctrica. No necesita gas ni conducto de ventilación, así que sirve en departamentos o zonas sin red de gas.',
          'El consumo eléctrico pesa más en la factura que el gas, y tarda en recuperar la temperatura si se vacía el tanque. Mirá la potencia en watts y la capacidad en litros.',
        ],
      },
      {
        h: 'Calefón',
        p: [
          'Calienta el agua en el momento en que abrís la canilla, sin guardarla en un tanque. No consume gas mientras nadie usa agua.',
          'Funciona bien para una ducha o una canilla, pero con dos canillas abiertas a la vez el caudal baja. También requiere instalación de gas y salida de gases por un gasista matriculado.',
          'Los modelos de encendido electrónico (sin piloto) evitan la llama permanente.',
        ],
      },
      {
        h: 'Qué elegir según tu casa',
        p: [
          'Familia con varias personas que se bañan seguido y gas disponible: termotanque a gas de capacidad acorde.',
          'Una o dos personas, espacio chico: calefón o un termotanque chico.',
          'Sin gas natural ni envasado: termotanque eléctrico.',
          'Si querés bajar el consumo, hay termotanques solares y bombas de calor, con más inversión inicial, que ahorran energía a la larga.',
        ],
      },
      {
        h: 'Seguridad: lo que no hay que ahorrar',
        p: [
          'Todo artefacto a gas debe instalarse con salida de gases al exterior y con ventilación adecuada. El monóxido de carbono no tiene olor y es peligroso.',
          'La instalación y las revisiones periódicas las tiene que hacer un gasista matriculado. No improvises la instalación para ahorrar.',
          'Verificá que el equipo tenga el sello de aprobación correspondiente en la ficha técnica.',
        ],
      },
    ],
    categoria: { slug: 'termotanques', nombre: 'termotanques' },
    comparativa: 'mejores-termotanques',
    cta: { href: '/mejores/mejores-termotanques', titulo: 'Termotanques en oferta hoy, comparados', boton: 'Ver la comparativa de termotanques 🔥' },
    faq: [
      {
        q: '¿Cuántos litros de termotanque necesito?',
        a: 'Depende de cuántas personas son y cuánta agua caliente usan. Para una o dos personas alcanza una capacidad chica; para una familia numerosa conviene una mayor. La ficha del fabricante suele orientar según la cantidad de baños.',
      },
      {
        q: '¿Qué es mejor, calefón o termotanque?',
        a: 'El calefón calienta en el momento y ocupa poco lugar; el termotanque guarda agua caliente y rinde mejor con varias canillas a la vez. Depende del uso y del espacio.',
      },
      {
        q: '¿Se puede instalar un termotanque a gas yo mismo?',
        a: 'No. Debe instalarlo un gasista matriculado, por la salida de gases y la seguridad.',
      },
      {
        q: '¿El termotanque eléctrico consume mucha luz?',
        a: 'Consume bastante porque calienta con una resistencia. Con la potencia en watts y las horas de uso podés estimarlo con la calculadora de consumo eléctrico.',
      },
    ],
    enlaces: [
      { href: '/guias/que-termotanque-comprar', texto: 'Qué termotanque comprar' },
      { href: '/guias/que-cocina-comprar', texto: 'Qué cocina comprar' },
      { href: '/calculadora-consumo-electrico', texto: 'Calculadora de consumo eléctrico' },
      { href: '/categoria/termotanques', texto: 'Termotanques en oferta' },
      { href: '/precio', texto: 'Precio de hoy' },
    ],
  },
  {
    slug: 'cinta-para-correr-en-casa-como-elegir',
    titulo: 'Cómo elegir una cinta para correr en casa: motor, superficie y plegado',
    descripcion:
      'Qué mirar al comprar una cinta para correr en casa: potencia del motor (HP continuos), superficie de carrera, velocidad e inclinación, peso máximo del usuario, amortiguación, plegado, ruido y mantenimiento.',
    pregunta: '¿Cómo elijo una cinta para correr para casa?',
    respuestaCorta:
      'Fijate primero en el motor (la potencia continua, no la pico), en el tamaño de la superficie de carrera, en el peso máximo de usuario que soporta y en si se pliega, para que entre en tu casa. Para caminar alcanza una cinta liviana y compacta; para correr de manera seguida conviene un motor más potente, una superficie más larga y buena amortiguación. Siempre confirmá las medidas de la cinta armada y plegada.',
    secciones: [
      {
        h: 'Motor: potencia continua, no pico',
        p: [
          'La potencia del motor se expresa en HP. Hay dos números que se confunden: el HP continuo (lo que el motor sostiene trabajando) y el HP pico (un máximo momentáneo). El continuo es el que importa.',
          'Para caminar y trotar suave alcanza un motor de potencia más baja; para correr con frecuencia o a más velocidad, conviene un motor más fuerte, que se recalienta menos y dura más.',
        ],
      },
      {
        h: 'Superficie de carrera',
        p: [
          'Es el largo y el ancho de la banda donde apoyás los pies. Para caminar alcanza una superficie más corta; si corrés, necesitás más largo para que la zancada no quede justa, y más aún si sos alto.',
          'Una banda ancha da más margen de error. Verificá estos datos en la ficha, que los fabricantes suelen informar.',
        ],
      },
      {
        h: 'Velocidad, inclinación y programas',
        p: [
          'Velocidad máxima: para caminar y trotar alcanzan velocidades moderadas; para correr más rápido, buscá un máximo mayor.',
          'Inclinación: ayuda a variar el entrenamiento y a sumar esfuerzo sin aumentar la velocidad. Puede ser manual o motorizada, y esta última es más cómoda.',
          'Programas y pantalla: sirven para entrenar con rutinas, pero no son lo más importante. Conviene priorizar motor, superficie y robustez antes que funciones extra.',
        ],
      },
      {
        h: 'Peso máximo del usuario y amortiguación',
        p: [
          'Cada cinta indica el peso máximo del usuario. Elegí una con un margen por encima de tu peso, no justa, para que dure y trabaje sin forzarse.',
          'La amortiguación reduce el impacto en rodillas y tobillos al correr. Es un punto importante si vas a correr seguido.',
        ],
      },
      {
        h: 'Espacio, plegado y ruido',
        p: [
          'Medí el lugar donde va a quedar y verificá las medidas de la cinta armada, con espacio libre atrás para bajarte con seguridad.',
          'Si no tenés un lugar fijo, buscá una plegable y mirá las medidas ya plegada. Algunas traen ruedas para moverlas.',
          'Los departamentos requieren pensar en el ruido y la vibración: una base firme y una colchoneta debajo ayudan.',
        ],
      },
      {
        h: 'Mantenimiento y seguridad',
        p: [
          'Muchas cintas piden lubricar la banda cada cierto tiempo según el manual del fabricante, y mantenerla limpia y centrada.',
          'Usá la llave o clip de seguridad que corta el motor si te caés, y no dejes que los chicos jueguen cerca.',
          'Antes de empezar una rutina de ejercicio exigente, consultá con tu médico, sobre todo si tenés alguna condición de salud.',
        ],
      },
      {
        h: 'Cuánto sale',
        p: [
          'No damos un precio fijo: varía mucho según motor, superficie y marca. Seguimos las ofertas de equipamiento deportivo en el catálogo del día, y el precio de cada producto con su historial se ve en las páginas de precio.',
        ],
      },
    ],
    cta: { href: '/hoy', titulo: 'Las ofertas reales de hoy, ya verificadas', boton: 'Ver las ofertas de hoy 🎯' },
    faq: [
      {
        q: '¿Qué motor necesito para correr en casa?',
        a: 'Fijate en el HP continuo, no en el pico. Para correr con frecuencia conviene un motor de potencia continua más alta que para caminar.',
      },
      {
        q: '¿Qué tamaño de superficie conviene?',
        a: 'Para caminar alcanza una banda más corta; para correr necesitás más largo y ancho, sobre todo si sos alto o de zancada larga.',
      },
      {
        q: '¿Las cintas plegables son buenas?',
        a: 'Sí, y son prácticas para ahorrar espacio. Revisá que el sistema de plegado sea firme y que la cinta tenga la robustez que necesitás para tu uso.',
      },
      {
        q: '¿Cada cuánto hay que lubricar la banda?',
        a: 'Depende del modelo y del uso. El manual del fabricante indica la frecuencia y el tipo de lubricante a usar.',
      },
    ],
    enlaces: [
      { href: '/guias/bicicleta-fija-o-cinta-para-correr', texto: 'Bicicleta fija o cinta para correr' },
      { href: '/guias/que-bicicleta-comprar', texto: 'Qué bicicleta comprar' },
      { href: '/guias/que-smartwatch-comprar', texto: 'Qué smartwatch comprar' },
      { href: '/calculadora-consumo-electrico', texto: 'Calculadora de consumo eléctrico' },
      { href: '/hoy', texto: 'Ofertas de hoy' },
    ],
  },
  {
    slug: 'bicicleta-fija-o-cinta-para-correr',
    titulo: 'Bicicleta fija o cinta para correr: cuál conviene para entrenar en casa',
    descripcion:
      'Comparación entre bicicleta fija (spinning y magnética) y cinta para correr para entrenar en casa: impacto en las articulaciones, espacio, ruido, tipo de ejercicio, mantenimiento y cuál elegir según tu objetivo.',
    pregunta: '¿Qué conviene para entrenar en casa: bicicleta fija o cinta?',
    respuestaCorta:
      'Si buscás ejercicio cardiovascular con poco impacto en las articulaciones, poco ruido y menos espacio, la bicicleta fija es la opción más cómoda. Si querés caminar o correr como en la calle, la cinta es la indicada, aunque ocupa más lugar y pide más mantenimiento. Lo mejor es la que realmente vayas a usar todas las semanas: elegí según tu objetivo, tu espacio y tus rodillas.',
    secciones: [
      {
        h: 'Bicicleta fija: tipos',
        p: [
          'Bicicleta de spinning: con volante de inercia y manubrio inclinado, imita a una bici de ruta. Es la más exigente y la elegida para sesiones intensas.',
          'Bicicleta magnética: la resistencia se regula con imanes, así que funciona de forma silenciosa y suave. Es la más práctica para el hogar.',
          'Bicicleta reclinada o con respaldo: más cómoda para quien tiene problemas de espalda o necesita más apoyo.',
          'Bicicleta plegable o de uso suave: pensada para rehabilitación o ejercicio liviano.',
        ],
      },
      {
        h: 'Ventajas de la bicicleta fija',
        p: [
          'Bajo impacto en rodillas, tobillos y cadera, porque el pie no golpea el piso.',
          'Ocupa menos espacio que una cinta y suele ser más silenciosa.',
          'Se puede usar mirando una serie, sin la concentración que exige correr.',
          'Menos mantenimiento: una revisión del ajuste y la limpieza alcanzan en la mayoría de los modelos.',
        ],
      },
      {
        h: 'Ventajas de la cinta',
        p: [
          'Reproduce el movimiento de caminar y correr, útil si querés prepararte para una carrera o entrenar al aire libre.',
          'Permite ajustar velocidad e inclinación con precisión.',
          'Trabaja más grupos musculares por el apoyo del peso corporal.',
          'A cambio, ocupa más espacio, hace más ruido y vibración y exige más mantenimiento.',
        ],
      },
      {
        h: 'Cuál elegir según tu caso',
        p: [
          'Tenés molestias en las rodillas o querés empezar suave: bicicleta fija.',
          'Vivís en un departamento chico y con vecinos: bicicleta magnética, más silenciosa y compacta.',
          'Te preparás para correr: cinta.',
          'Querés quemar calorías con la mayor intensidad en poco tiempo: ambas sirven; spinning o cinta con inclinación.',
          'Ante cualquier duda de salud, consultá con tu médico antes de elegir y empezar.',
        ],
      },
      {
        h: 'Qué mirar al comprar una bicicleta fija',
        p: [
          'Peso máximo del usuario y robustez del cuadro.',
          'Regulación del asiento y del manubrio, para que se adapte a tu altura.',
          'Tipo de resistencia (magnética o por fricción) y cantidad de niveles.',
          'Pedales con correas o jaulas y una pantalla simple con tiempo y distancia.',
          'Medidas del equipo armado para confirmar que entra en el lugar elegido.',
        ],
      },
    ],
    categoria: { slug: 'bicicletas', nombre: 'bicicletas' },
    cta: { href: '/hoy', titulo: 'Las ofertas reales de hoy, ya verificadas', boton: 'Ver las ofertas de hoy 🎯' },
    faq: [
      {
        q: '¿Qué es mejor para bajar de peso, bicicleta fija o cinta?',
        a: 'Las dos sirven si las usás con regularidad. Lo que más influye es la constancia, la intensidad y la alimentación, no tanto la máquina. Elegí la que puedas sostener en el tiempo.',
      },
      {
        q: '¿La bicicleta fija es buena para las rodillas?',
        a: 'Es un ejercicio de bajo impacto, por eso suele recomendarse para empezar. Con una molestia concreta, consultá con tu médico.',
      },
      {
        q: '¿Cuál es la diferencia entre bicicleta magnética y de spinning?',
        a: 'La magnética regula la resistencia con imanes y es silenciosa y práctica; la de spinning usa un volante de inercia pesado y permite entrenamientos más intensos.',
      },
      {
        q: '¿Cuánto espacio necesito?',
        a: 'Menos para una bicicleta fija que para una cinta. Confirmá siempre las medidas del equipo armado y dejá espacio libre alrededor.',
      },
    ],
    enlaces: [
      { href: '/guias/cinta-para-correr-en-casa-como-elegir', texto: 'Cómo elegir una cinta para correr' },
      { href: '/guias/que-bicicleta-comprar', texto: 'Qué bicicleta comprar' },
      { href: '/guias/que-smartwatch-comprar', texto: 'Qué smartwatch comprar' },
      { href: '/mejores/mejores-bicicletas', texto: 'Mejores bicicletas' },
      { href: '/hoy', texto: 'Ofertas de hoy' },
    ],
  },
]

export const FECHAS_GUIAS_TICKET_ALTO: Record<string, { publicada: string; modificada: string }> = Object.fromEntries(
  GUIAS_TICKET_ALTO.map(g => [g.slug, { publicada: '2026-10-05', modificada: '2026-10-05' }]),
)
