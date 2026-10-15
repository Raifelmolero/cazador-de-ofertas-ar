// Contenido propio extra para las páginas /categoria/[slug] de ticket alto o
// comisión alta. Es un solo lugar de datos: la página lo renderiza como un
// bloque "Cómo comprar ..." (intro + criterios) y suma las preguntas al
// FAQPage JSON-LD que ya existe. Complementa (no repite) lo que hay en
// `guia` y `faqs` de lib/categorias.ts: acá va el contexto de compra y los
// criterios de decisión; allá, el detalle técnico por tipo de producto.
//
// Sin precios ni especificaciones de modelos concretos: son criterios
// perennes. Los links a /mejores/ y /ofertas/ no se escriben a mano, salen de
// COMPARATIVAS y LANDINGS filtrando por categoría (ver la página).

export interface CategoriaContenido {
  /** 100-150 palabras: contexto de compra del rubro */
  intro: string
  /** 4-5 criterios de decisión */
  criterios: { t: string; d: string }[]
  /** 3 preguntas extra, distintas de las de `faqs` de la categoría */
  faqs: { q: string; a: string }[]
}

export const CONTENIDO_CATEGORIAS: Record<string, CategoriaContenido> = {
  'aire-acondicionado': {
    intro:
      'Un aire acondicionado es una compra de ticket alto que se usa todos los días durante meses y que no se puede probar antes de pagarla. Por eso los errores salen caros: un equipo chico para el ambiente trabaja al límite y no enfría, y uno demasiado grande se apaga y prende todo el tiempo, gasta de más y deja el ambiente húmedo. A eso se suman dos costos que no figuran en la publicación: la instalación y el consumo eléctrico de cada temporada. Lo más sensato es decidir primero la potencia según el ambiente, después si te sirve que también caliente, y recién ahí comparar precios entre modelos equivalentes. Las ofertas de este rubro suben y bajan con la temporada, así que conviene mirar el historial antes de apurarse.',
    criterios: [
      { t: 'Ambiente y orientación', d: 'La potencia depende de los metros cuadrados, pero también de cuánto sol da, la altura del techo y cuántas personas lo usan. Un ambiente al oeste necesita más que uno al sur.' },
      { t: 'Uso real del equipo', d: 'Si lo vas a usar pocas horas en verano, no hace falta pagar de más por funciones que no vas a aprovechar. Si va a andar muchas horas, el consumo pesa más que la diferencia de precio.' },
      { t: 'Lugar de instalación', d: 'Fijate dónde va la unidad exterior, el largo de cañería necesario y si hay que perforar o hacer una base. Eso cambia el presupuesto final.' },
      { t: 'Servicio técnico y garantía', d: 'Priorizá marcas con servicio técnico en tu zona y garantía oficial por escrito: un equipo parado en pleno verano es el peor momento para depender de un tercero.' },
      { t: 'Costo total, no solo precio', d: 'Sumá equipo, instalación y consumo estimado. A veces el modelo más barato termina siendo el más caro al segundo año.' },
    ],
    faqs: [
      { q: '¿En qué época conviene comprar un aire acondicionado?', a: 'Los precios tienden a subir con el calor y a aflojar fuera de temporada. Comprar antes del pico suele dar más margen para comparar e instalar sin apuro. Mirá el historial de precios del modelo para saber si el valor de hoy es bajo para ese equipo.' },
      { q: '¿Puedo instalar el aire yo mismo?', a: 'La parte eléctrica y la de refrigeración conviene que la haga un instalador matriculado: una mala instalación puede hacerte perder la garantía del fabricante. Pedí siempre presupuesto con materiales incluidos antes de comprar.' },
      { q: '¿Cuánto puedo ahorrar con un equipo eficiente?', a: 'Depende de cuántas horas lo uses y de la tarifa eléctrica de tu zona. Un equipo más eficiente cuesta más al comprarlo y gasta menos por hora; usá la calculadora de consumo del sitio para estimar la diferencia anual con tus números.' },
    ],
  },

  colchones: {
    intro:
      'Pasamos cerca de un tercio de la vida durmiendo, y aun así el colchón suele elegirse con apuro, mirando solo el precio y las medidas. Es un producto difícil de comparar: dos colchones que se ven iguales pueden tener materiales, densidades y durabilidad muy distintas, y la sensación en una foto no dice cómo se va a sentir después de dos meses. Lo que sí podés hacer es ordenar la decisión: primero medidas reales de tu cama o somier, después firmeza según tu peso y tu forma de dormir, y por último materiales y garantía. En esta categoría los descuentos grandes son frecuentes, por eso verificamos cada oferta contra el historial de precios antes de marcarla como oportunidad.',
    criterios: [
      { t: 'Medidas exactas', d: 'Medí el somier o la base, no te guíes solo por el nombre comercial (1 plaza, 2 plazas, queen). Hay diferencias de centímetros entre marcas que se notan con la sábana.' },
      { t: 'Peso y posición al dormir', d: 'Quien duerme de costado suele necesitar algo que ceda en hombros y caderas; quien duerme boca arriba, más soporte lumbar. Para dos personas de pesos muy distintos, mirá modelos que repartan bien el peso.' },
      { t: 'Altura y base', d: 'Un colchón alto sobre una base alta puede quedar incómodo para subir y bajar, y necesita sábanas ajustables más grandes. Fijate también que la base sea compatible con el tipo de colchón.' },
      { t: 'Condiciones de devolución', d: 'Antes de comprar, leé las condiciones de devolución. En un colchón, poder probarlo en tu casa vale más que cualquier descripción.' },
      { t: 'Garantía real', d: 'Confirmá cuántos años cubre la garantía, qué defectos incluye y quién la gestiona: el fabricante o el vendedor.' },
    ],
    faqs: [
      { q: '¿Cada cuánto hay que cambiar el colchón?', a: 'No hay un número exacto: depende del material, del uso y del peso. Las señales son hundimientos marcados, despertarte con dolor de espalda o cuello que mejora al dormir en otra cama, y ruidos o resortes que se sienten. Rotarlo según indique el fabricante ayuda a que dure más.' },
      { q: '¿Hace falta cambiar también el somier?', a: 'Si el somier está torcido, hundido o no es del tamaño correcto, el colchón nuevo se va a deformar rápido y podés perder la garantía. Si la base está en buen estado y es compatible con el tipo de colchón, se puede mantener.' },
      { q: '¿Conviene comprar colchón y almohadas por separado?', a: 'Sí, son decisiones distintas: la almohada depende de tu postura y de la altura del colchón. Elegí el colchón primero y probá la almohada después, así evitás combinaciones que te dejen el cuello incómodo.' },
    ],
  },

  'herramientas-electricas': {
    intro:
      'Las herramientas eléctricas parecen una compra simple hasta que la herramienta no alcanza para el trabajo o se rompe a la primera exigencia. La diferencia entre un equipo hogareño y uno de uso intensivo no siempre se ve en la foto, pero se nota en el motor, la refrigeración, la calidad del mandril y la disponibilidad de repuestos. Para arreglos de casa alcanza con una línea hogareña bien elegida; para trabajar todos los días conviene una línea profesional, aunque cueste más. También importa el ecosistema: si empezás con baterías de una marca, la siguiente herramienta te sale mucho más barata si es compatible. Por eso conviene pensar en el kit completo antes que en una sola herramienta.',
    criterios: [
      { t: 'Frecuencia y tipo de uso', d: 'No es lo mismo colgar un cuadro que armar muebles o trabajar en una obra. Elegí línea hogareña o profesional según cuántas horas por semana la vas a usar.' },
      { t: 'Compatibilidad de baterías', d: 'Si comprás una herramienta a batería, fijate si la misma batería sirve para otras de la marca. Es la forma más barata de ir armando un taller.' },
      { t: 'Accesorios incluidos', d: 'Mechas, puntas, discos o maletín incluidos cambian el valor real de un kit. Comparalo contra comprar esos accesorios por separado.' },
      { t: 'Repuestos y servicio técnico', d: 'Antes de comprar, verificá que haya repuestos y servicio técnico en Argentina para esa marca: carbones, cargadores y baterías son lo primero que se necesita.' },
      { t: 'Seguridad y protección', d: 'Sumá anteojos, guantes y protección auditiva al presupuesto, sobre todo con amoladoras y herramientas de corte.' },
    ],
    faqs: [
      { q: '¿Qué herramienta eléctrica conviene comprar primero?', a: 'Para la mayoría de las casas, un taladro atornillador resuelve la mayor parte de las tareas: agujeros, tornillos, armado de muebles. Después se suman según lo que necesites: amoladora, sierra caladora o lijadora.' },
      { q: '¿Es lo mismo una herramienta hogareña que una profesional?', a: 'No. Las profesionales suelen tener mejor refrigeración, materiales y tolerancia al uso continuo, y cuestan más. Para uso ocasional, una hogareña bien elegida es suficiente y más económica.' },
      { q: '¿Las herramientas de marcas desconocidas valen la pena?', a: 'Pueden servir para uso muy ocasional, pero verificá la garantía, la disponibilidad de repuestos y las opiniones de quienes ya las usaron. El ahorro se pierde rápido si no hay forma de repararla.' },
    ],
  },

  'smart-tv': {
    intro:
      'Comprar un televisor se volvió más complejo que mirar pulgadas y precio. Hoy el mismo tamaño convive con paneles, procesadores y sistemas operativos muy distintos, y dos modelos que parecen idénticos en la góndola pueden diferir en brillo, fluidez o en cuántos años van a recibir actualizaciones. Sumá que el Smart TV es una compra de ticket alto con descuentos muy publicitados en Cyber Monday y Black Friday, justo cuando más conviene verificar que el precio de lista no estuviera inflado. Lo práctico es decidir en este orden: tamaño según la distancia a la que te sentás, uso principal (series, deportes, juegos) y recién después marca y modelo.',
    criterios: [
      { t: 'Distancia de visión', d: 'Un televisor demasiado grande para tu living cansa la vista y uno chico se queda corto. Medí cuánto hay entre el sillón y la pared antes de elegir pulgadas.' },
      { t: 'Para qué lo vas a usar', d: 'Para series y streaming importan el sistema operativo y las apps; para deportes y juegos, la fluidez de imagen y las entradas HDMI disponibles.' },
      { t: 'Sistema operativo y apps', d: 'Verificá que tenga las apps que usás y que el sistema se actualice. Un televisor sin apps te obliga a sumar un dispositivo aparte.' },
      { t: 'Conexiones', d: 'Contá cuántos HDMI necesitás (consola, barra de sonido, decodificador) y si querés conexión para auriculares o salida óptica.' },
      { t: 'Soporte y montaje', d: 'Medí el lugar donde va y consultá si el soporte viene incluido o hay que comprarlo. Para colgarlo en pared necesitás un soporte compatible con el tamaño.' },
    ],
    faqs: [
      { q: '¿Qué diferencia hay entre LED, QLED y OLED?', a: 'Son tecnologías de panel distintas. LED usa retroiluminación; QLED agrega una capa de puntos cuánticos para mejorar color y brillo; OLED enciende cada píxel por separado y logra negros más profundos. En general, a más tecnología, más precio; para uso diario una buena pantalla LED o QLED alcanza en muchos hogares.' },
      { q: '¿Conviene comprar un televisor en Cyber Monday o Black Friday?', a: 'Puede convenir si el descuento es real. Antes del evento, mirá el historial de precio del modelo: si venía costando lo mismo, la oferta es solo marketing. Usá el seguimiento de precios del sitio.' },
      { q: '¿Importa la marca del televisor?', a: 'Importa por la garantía, el servicio técnico y las actualizaciones de software, no solo por la imagen. Una marca con soporte oficial en Argentina te evita problemas si hay una falla.' },
    ],
  },

  heladeras: {
    intro:
      'La heladera es el electrodoméstico que no se apaga nunca: funciona las 24 horas del día durante años. Eso significa que el costo real no es solo lo que pagás al comprarla, sino lo que consume cada mes y cuántos años te dura sin fallas. También es de las compras donde más se repite un error caro: medir mal el lugar o la puerta de entrada. Conviene empezar por el espacio disponible y la cantidad de personas, después decidir entre tecnologías como no frost o cíclica, y por último comparar eficiencia energética y garantía entre modelos de capacidad parecida. Así evitás pagar de más por funciones que no vas a usar o quedarte corto de espacio a los dos meses.',
    criterios: [
      { t: 'Espacio y acceso', d: 'Medí el hueco donde va, pero también puertas, pasillos y escaleras por donde tiene que pasar. Dejá margen para que circule el aire detrás y a los costados.' },
      { t: 'Capacidad según tu hogar', d: 'Pensá en cuántas personas son y con qué frecuencia comprás. Una heladera grande vacía gasta casi lo mismo que una llena y desperdicia energía.' },
      { t: 'Eficiencia energética', d: 'Mirá la etiqueta de eficiencia: un equipo más eficiente cuesta más pero gasta menos en cada factura durante toda su vida útil.' },
      { t: 'Distribución interna', d: 'Revisá cuántos estantes tiene, si son regulables, dónde está el freezer y si entra lo que realmente guardás (botellas grandes, bandejas).' },
      { t: 'Garantía y servicio', d: 'Confirmá el tiempo de garantía del compresor, que es la parte más cara, y que haya servicio técnico oficial en tu ciudad.' },
    ],
    faqs: [
      { q: '¿Cuánto dura una heladera?', a: 'Con buen uso y mantenimiento puede durar muchos años. Lo que más influye es la limpieza del condensador, la ventilación y que las puertas cierren bien (revisá las gomas).' },
      { q: '¿Cada cuánto hay que limpiar la heladera?', a: 'Una limpieza interna periódica evita olores y bacterias, y conviene limpiar la parte trasera o inferior una o dos veces al año para que el equipo no trabaje forzado. Las no frost no requieren descongelar.' },
      { q: '¿Conviene una heladera con dispenser de agua?', a: 'Es cómodo, pero suma piezas que pueden fallar y consume algo más. Si tomás mucha agua fría puede valer la pena; si no, una heladera simple es más sencilla y suele ser más barata.' },
    ],
  },

  lavarropas: {
    intro:
      'Un lavarropas se usa varias veces por semana y la decisión se reparte entre tres cosas: cuánta ropa lavás, cuánto espacio tenés y cuánto estás dispuesto a pagar en agua y electricidad. En ofertas es común ver modelos de capacidades muy distintas con descuentos parecidos, y la tentación es llevarse el más grande. Conviene lo contrario: elegir la capacidad según tu hogar real, porque lavar con el tambor a medias o sobrecargado desgasta el equipo y la ropa. Tené en cuenta además el ruido, el centrifugado y los programas que realmente vas a usar; muchos modelos tienen decenas de programas y la mayoría de los hogares usa tres o cuatro.',
    criterios: [
      { t: 'Capacidad para tu hogar', d: 'Calculá cuántas personas son y cuánta ropa grande (acolchados, jeans) lavás. Un tambor muy chico te obliga a más lavados; uno muy grande gasta de más si no lo llenás.' },
      { t: 'Espacio y conexiones', d: 'Medí ancho, alto y fondo, y revisá dónde están la entrada de agua y el desagüe. Los modelos de carga frontal necesitan espacio libre para abrir la puerta.' },
      { t: 'Centrifugado y ruido', d: 'Un centrifugado más alto deja la ropa más seca, pero hace más ruido y vibra más. Si el lavarropas va cerca de un dormitorio, tenelo en cuenta.' },
      { t: 'Consumo de agua y energía', d: 'Fijate en la etiqueta de eficiencia: ahorrás en cada lavado, y es un gasto que se repite durante años.' },
      { t: 'Programas que vas a usar', d: 'No pagues de más por programas que no vas a tocar. Con algodón, delicados, rápido y un ciclo para ropa de cama suele alcanzar.' },
    ],
    faqs: [
      { q: '¿Cada cuánto hay que limpiar el lavarropas?', a: 'Conviene limpiar el filtro y el cajón del jabón cada tanto, dejar la puerta entreabierta después de lavar para evitar olores y correr un ciclo de limpieza con producto específico cada algunos meses, según el uso.' },
      { q: '¿Se puede instalar el lavarropas en cualquier lugar?', a: 'Necesita agua, desagüe, una toma eléctrica con descarga a tierra y una superficie firme y nivelada. Verificá estas cosas antes de comprar para evitar sumar costos de instalación.' },
      { q: '¿Conviene un lavasecarropas?', a: 'Ahorra espacio si no tenés lugar para dos equipos, pero suele lavar y secar más despacio y con menos capacidad en secado. Si tenés lugar y secás al aire, un lavarropas solo suele ser más práctico.' },
    ],
  },

  'equipamiento-gastronomico': {
    intro:
      'Equipar una cocina comercial es una inversión que se recupera si cada equipo se elige para el volumen y el menú reales del negocio. Un horno, una freidora o una cortadora de fiambre que queda chica te limita las ventas; uno sobredimensionado inmoviliza capital y gasta de más en gas o electricidad. A diferencia del electro doméstico, acá importan la potencia, el tipo de conexión (gas natural, envasado o trifásica), la facilidad de limpieza y la disponibilidad de repuestos. También cuenta el espacio y la ventilación del local. Antes de mirar precios, conviene tener claro cuántos platos por hora necesitás y qué instalaciones ya tiene tu local.',
    criterios: [
      { t: 'Volumen de producción', d: 'Estimá cuánto producís en los momentos de mayor demanda, no el promedio. Un equipo que se queda corto en el pico pierde ventas.' },
      { t: 'Tipo de energía e instalación', d: 'Confirmá si tu local tiene gas natural, envasado o trifásica antes de comprar. Cambiar de tipo de conexión suma costo y tiempo.' },
      { t: 'Materiales y limpieza', d: 'Priorizá acero inoxidable y piezas fáciles de desarmar: la limpieza es parte del trabajo diario y la habilitación depende de ella.' },
      { t: 'Espacio y ventilación', d: 'Medí el lugar y la extracción disponible. Los equipos de cocción generan calor y humo que hay que sacar.' },
      { t: 'Repuestos y servicio', d: 'Un equipo parado es plata perdida: preguntá por repuestos, garantía y servicio técnico antes de comprar.' },
    ],
    faqs: [
      { q: '¿Conviene comprar equipos usados para empezar un negocio?', a: 'Puede ayudar a bajar la inversión inicial, pero revisá el estado, las instalaciones de gas y electricidad y si hay repuestos. Un usado sin garantía puede salir más caro si falla en plena temporada.' },
      { q: '¿Necesito factura para el equipamiento de mi negocio?', a: 'Pedí factura al comprar si vas a computar el gasto en tu actividad. Consultá con tu contador cómo tratar la compra según tu situación impositiva.' },
      { q: '¿Cómo calculo qué tamaño de equipo necesito?', a: 'Partí de tu carta y de la cantidad de platos o porciones por hora en los picos de demanda. Con esos números, compará la capacidad que informa el fabricante y dejá un margen para crecer.' },
    ],
  },

  perfumes: {
    intro:
      'Los perfumes son uno de los rubros donde más conviene desconfiar del descuento: es un producto que se falsifica, que se vende a precios muy distintos según el vendedor y cuyo valor depende de que sea original y esté bien conservado. Comprar online tiene una ventaja clara, que es la posibilidad de comparar precios y leer opiniones, pero exige mirar el vendedor, la reputación y el origen. Un perfume bien elegido se usa durante meses, así que vale la pena pensar en la concentración, la familia olfativa y el contexto de uso antes que en la marca. También es un gran regalo, pero conviene elegir con criterio si no conocés el gusto de la persona.',
    criterios: [
      { t: 'Vendedor y reputación', d: 'Priorizá tiendas oficiales o vendedores con buena reputación y muchas ventas. Un precio muy por debajo del mercado es una señal de alarma.' },
      { t: 'Concentración', d: 'Eau de parfum suele durar más y tener más intensidad que eau de toilette. Elegí según cuánto querés que dure sobre la piel.' },
      { t: 'Familia olfativa y ocasión', d: 'Las fragancias cítricas o frescas suelen ir mejor en verano y de día; las amaderadas o dulces, en invierno y de noche.' },
      { t: 'Tamaño del envase', d: 'Compará precio por mililitro: a veces el envase más grande sale mucho más barato por ml, pero solo conviene si lo vas a usar antes de que pierda calidad.' },
      { t: 'Empaque y sellado', d: 'Verificá que venga en caja con film sellado y datos del lote. Un perfume sin caja o sin sellar no es necesariamente falso, pero conviene entender de dónde viene.' },
    ],
    faqs: [
      { q: '¿Cómo guardo un perfume para que dure más?', a: 'Lejos del sol, del calor y de la humedad, por ejemplo en un cajón o placard, y con la tapa bien cerrada. El baño no es un buen lugar por los cambios de temperatura.' },
      { q: '¿Un perfume se vence?', a: 'Con el tiempo y mala conservación puede alterar su aroma, aunque muchos duran años si están bien guardados. Si cambia el color o huele distinto, ya no está en su mejor estado.' },
      { q: '¿Qué diferencia hay entre un perfume y una colonia?', a: 'Principalmente la concentración de esencia: el perfume tiene más y dura más sobre la piel; la colonia tiene menos y es más suave y fresca, ideal para uso diario o verano.' },
    ],
  },

  termotanques: {
    intro:
      'Un termotanque o calefón es de esos equipos que solo se notan cuando fallan, y reemplazarlo en pleno invierno es el peor momento para comparar. Elegir bien tiene dos partes: la técnica (capacidad, tipo de energía, instalación) y la económica (lo que te cuesta el gas o la electricidad por mes durante años). En Argentina, además, la elección entre gas y electricidad depende de las tarifas, de la conexión del hogar y de las normas de seguridad: la instalación de equipos a gas debe hacerla un gasista matriculado. Comparar precios sirve, pero la diferencia real está en elegir el tamaño justo y en que la instalación sea la correcta.',
    criterios: [
      { t: 'Cantidad de personas y uso', d: 'La capacidad depende de cuántas personas se bañan y a qué horas. Un tanque chico se queda sin agua caliente; uno grande gasta de más en mantener la temperatura.' },
      { t: 'Tipo de energía disponible', d: 'Confirmá si tu casa tiene gas natural, envasado o solo electricidad, y qué tarifa te conviene. La instalación existente puede definir la decisión.' },
      { t: 'Espacio y ventilación', d: 'Los equipos a gas necesitan ventilación adecuada y salida de gases. Medí el lugar y consultá con un gasista matriculado.' },
      { t: 'Aislación y eficiencia', d: 'Un buen aislamiento mantiene el agua caliente con menos consumo. Compará datos de eficiencia entre modelos equivalentes.' },
      { t: 'Instalación y seguridad', d: 'Sumá al presupuesto la instalación, las válvulas y la matrícula del profesional. Es una cuestión de seguridad, no de ahorro.' },
    ],
    faqs: [
      { q: '¿Cada cuánto hay que hacerle mantenimiento al termotanque?', a: 'Se recomienda una revisión periódica del ánodo de sacrificio, de las válvulas y de los sellos, según indique el fabricante. Un mantenimiento a tiempo alarga la vida útil del tanque.' },
      { q: '¿Por qué mi termotanque tarda en calentar?', a: 'Puede ser acumulación de sarro, un termostato desajustado o una capacidad chica para el uso. Un técnico puede diagnosticarlo; no conviene manipular un equipo a gas sin un profesional matriculado.' },
      { q: '¿Cuál es la diferencia entre un termotanque y un calefón?', a: 'El termotanque acumula agua caliente en un tanque; el calefón la calienta en el momento en que abrís la canilla. El calefón ocupa menos espacio, pero el caudal depende de su potencia.' },
    ],
  },

  monitores: {
    intro:
      'Un monitor es una de las compras tecnológicas que más tiempo te acompaña: se queda en el escritorio mucho después de que cambiás la computadora. Por eso conviene elegirlo por lo que vas a hacer con él y no por la marca o la oferta del día. Para oficina y estudio importan la comodidad visual, el tamaño y la resolución; para diseño, la fidelidad de color; para juegos, la frecuencia de refresco y el tiempo de respuesta. Un monitor de 144 Hz no sirve de mucho si tu equipo no mueve esos cuadros por segundo, y uno 4K necesita una placa de video que lo soporte. Primero definí el uso y el presupuesto; después comparás entre modelos equivalentes.',
    criterios: [
      { t: 'Uso principal', d: 'Oficina, diseño y juegos piden cosas distintas. Decidí qué es lo más importante y pagá por eso, no por funciones que no vas a usar.' },
      { t: 'Tamaño y distancia', d: 'A una distancia normal de escritorio, más pulgadas piden más resolución para que el texto no se vea pixelado.' },
      { t: 'Compatibilidad con tu equipo', d: 'Revisá qué salidas de video tiene tu computadora y que el monitor tenga una entrada compatible, además del cable.' },
      { t: 'Ergonomía', d: 'Regulación de altura, inclinación y giro importan si pasás muchas horas frente a la pantalla. Si no viene, puede comprarse un soporte VESA aparte.' },
      { t: 'Garantía y píxeles muertos', d: 'Consultá la política del fabricante ante píxeles muertos y revisá la pantalla al recibirla, dentro del plazo de devolución.' },
    ],
    faqs: [
      { q: '¿Un monitor curvo es mejor que uno plano?', a: 'Depende del uso y del tamaño. Los curvos tienden a ser más inmersivos en tamaños grandes y para juegos; para trabajar con varias ventanas o diseño, muchas personas prefieren uno plano.' },
      { q: '¿Qué es el tiempo de respuesta de un monitor?', a: 'Es lo que tarda un píxel en cambiar de color. Importa sobre todo en juegos rápidos, donde un tiempo alto puede dejar estelas en la imagen. Para oficina no suele ser decisivo.' },
      { q: '¿Cómo cuido la vista frente a un monitor?', a: 'Ajustá el brillo al ambiente, ubicá la pantalla a la altura de los ojos, hacé pausas cada tanto y mirá un punto lejano. Algunos monitores tienen modos que reducen la luz azul.' },
    ],
  },
  notebooks: {
    intro:
      'Una notebook es una compra que se usa todos los días durante años, y por eso conviene decidir por lo que vas a hacer con ella y no por el precio o la marca. Dos equipos que se ven parecidos en la publicación pueden diferir mucho en procesador, memoria, tipo de disco y calidad de pantalla, y esas diferencias se notan a diario: cuánto tarda en encender, si se traba con varias pestañas abiertas, cuánto dura la batería fuera de casa. Además, el título suele destacar la marca y esconde lo importante en la ficha técnica. Lo más sensato es definir primero el uso (estudio, oficina, diseño, juegos), fijar un piso de memoria y almacenamiento, y recién después comparar precios entre equipos equivalentes y verificar que el descuento sea real contra el historial.',
    criterios: [
      { t: 'Uso principal', d: 'Estudiar y navegar pide poco; editar video, programar o jugar exige procesador y placa de video más potentes. Comprar de más es tan malo como quedarse corto.' },
      { t: 'Memoria y disco', d: 'La combinación de RAM suficiente y disco SSD pesa más en el día a día que el nombre del procesador. Revisá si se puede ampliar o si viene soldado.' },
      { t: 'Pantalla y tamaño', d: 'Si la vas a mover seguido, el peso y el tamaño importan; si la usás en el escritorio, una pantalla más grande y con buen panel cansa menos la vista.' },
      { t: 'Batería y portabilidad', d: 'Mirá la autonomía real que cuentan las reseñas, no solo los números del fabricante, y si el cargador es chico o un ladrillo.' },
      { t: 'Garantía y servicio técnico', d: 'Priorizá garantía oficial en Argentina y marcas con servicio técnico cerca: una notebook parada en plena cursada o trabajo es un problema.' },
    ],
    faqs: [
      { q: '¿Conviene una notebook nueva o una reacondicionada?', a: 'La reacondicionada puede ser buena opción si el vendedor ofrece garantía clara y detalla el estado de batería y pantalla. Si no hay garantía real ni historial del vendedor, el ahorro suele no valer el riesgo.' },
      { q: '¿Cada cuánto cambia el precio de las notebooks?', a: 'Varían seguido, sobre todo con el dólar y en fechas de promociones. Por eso conviene mirar el historial de precios del modelo antes de decidir si la oferta de hoy es realmente baja.' },
      { q: '¿Windows, macOS o ChromeOS?', a: 'Depende de tus programas y de tu ecosistema. Windows es lo más compatible, macOS se elige por integración con otros equipos Apple y ChromeOS alcanza para quien usa casi todo en el navegador.' },
    ],
  },

  celulares: {
    intro:
      'El celular es probablemente el aparato que más usás en el día, y también uno de los que más cambian de precio: un mismo modelo puede variar bastante entre vendedores y semanas. Al comparar conviene mirar más allá de la marca y de los megapíxeles de la cámara: el almacenamiento, la memoria, la batería, cuántos años de actualizaciones promete el fabricante y si es la versión oficial para Argentina definen cuánto te va a durar y cómo se va a comportar. En esta categoría los descuentos grandes y las cuotas sin interés son frecuentes, así que la comparación correcta es el precio final contra el historial del producto, no el porcentaje que muestra la publicación.',
    criterios: [
      { t: 'Gama según tu uso', d: 'Para mensajes, redes y fotos casuales alcanza una gama media; la gama alta se justifica por cámara, rendimiento sostenido y años de actualizaciones.' },
      { t: 'Almacenamiento', d: 'Es lo más difícil de corregir después, porque casi ningún equipo moderno acepta tarjeta de memoria. Conviene pecar por exceso.' },
      { t: 'Versión y bandas de red', d: 'Confirmá que sea la versión para Argentina, con las bandas de 4G/5G de las compañías locales, y que tenga garantía oficial.' },
      { t: 'Actualizaciones y soporte', d: 'Un equipo con más años de parches de seguridad conserva mejor su valor de reventa y es más seguro para usar con apps bancarias.' },
      { t: 'Cuotas y precio final', d: 'Comparé el precio en un pago contra el de las cuotas: las cuotas sin interés pueden ocultar un precio de lista más alto.' },
    ],
    faqs: [
      { q: '¿Conviene comprar un celular nuevo o uno usado?', a: 'Uno nuevo con garantía oficial te cubre ante fallas y trae batería en buen estado. Uno usado puede ahorrar bastante, pero revisá la salud de la batería, que no esté bloqueado y la reputación del vendedor.' },
      { q: '¿Vale la pena pagar más por un iPhone o un Galaxy S?', a: 'Si valorás la cámara, el rendimiento sostenido y varios años de actualizaciones, sí. Para uso básico, un gama media actual cumple sin problema y cuesta mucho menos.' },
      { q: '¿Por qué un mismo celular tiene tantos precios distintos?', a: 'Cambian el vendedor, la garantía, las cuotas y si es envío internacional o stock local. Comparar siempre el mismo modelo y la misma capacidad, y mirar el historial, evita comprar un "descuento" que no lo es.' },
    ],
  },

  freezers: {
    intro:
      'Un freezer es una compra que se amortiza con el tiempo: guarda carne, comida hecha y compras grandes, y te deja aprovechar promociones sin apuro. Lo que más pesa en la decisión no es el precio de góndola sino el espacio que ocupa, cuánto consume y qué tipo de apertura te conviene. Un modelo horizontal rinde más por litro y mantiene mejor el frío al abrirlo, pero necesita más superficie; uno vertical entra en cualquier cocina y es más cómodo para ordenar. Como funciona las 24 horas, la diferencia de consumo entre un equipo eficiente y uno común se nota en la factura todos los meses. Mirá el historial del modelo antes de comprar: los freezers suelen tener promociones fuertes antes del verano.',
    criterios: [
      { t: 'Capacidad real que necesitás', d: 'Calculá por cantidad de personas y frecuencia de compra. Uno de más litros no siempre conviene: un freezer vacío igual consume.' },
      { t: 'Horizontal o vertical', d: 'El horizontal da más capacidad por precio y conserva mejor el frío; el vertical ocupa menos superficie y ordena mejor por estantes.' },
      { t: 'Eficiencia energética', d: 'Fijate la etiqueta de eficiencia. Al estar prendido todo el año, un modelo mejor clasificado se paga con el ahorro de luz.' },
      { t: 'Lugar y ventilación', d: 'Necesita espacio libre alrededor para disipar calor. En un lugar muy cerrado o caluroso, consume más y se desgasta antes.' },
      { t: 'Garantía y servicio técnico', d: 'Pedí garantía oficial y confirmá que haya service en tu zona: si falla con la mercadería adentro, el costo es mucho mayor que el del equipo.' },
    ],
    faqs: [
      { q: '¿Qué capacidad de freezer necesito para una familia?', a: 'Como referencia general, se piensa en unos 50 a 100 litros por persona según cuánto congeles. Si hacés compras grandes de carne o cocinás para toda la semana, andá hacia el rango alto.' },
      { q: '¿Conviene un freezer horizontal o vertical?', a: 'Si tenés lugar, el horizontal suele rendir más por el mismo dinero y conservar mejor el frío. El vertical es mejor para departamentos y para encontrar las cosas sin vaciar todo.' },
      { q: '¿Cuánto consume un freezer?', a: 'Depende de la capacidad y de la eficiencia, y se mide por año en la etiqueta. Usá la calculadora de consumo del sitio con los datos del modelo para estimar el costo mensual con tu tarifa.' },
    ],
  },

  'cocinas-y-hornos': {
    intro:
      'La cocina es el electrodoméstico que más años dura en una casa, así que conviene elegirla pensando en cómo cocinás y no solo en el precio. Antes de comparar modelos hay que definir el ancho disponible, si tenés gas natural o envasado, y si te alcanza con un horno básico o necesitás funciones como grill, ventilación o doble capa de vidrio. La limpieza y la seguridad también cuentan: válvulas de seguridad en las hornallas, vidrio templado y tapa de mejor calidad se notan en el uso diario. Un detalle que suele olvidarse es la instalación: una mala conexión de gas es un riesgo y puede invalidar la garantía, así que presupuestá un gasista matriculado.',
    criterios: [
      { t: 'Ancho y tipo de gas', d: 'Medí el hueco disponible y confirmá si tu conexión es de red o garrafa: algunos modelos vienen preparados para uno y requieren kit para el otro.' },
      { t: 'Tipo de horno', d: 'El horno a gas es el más común y económico; el eléctrico o con ventilación reparte mejor el calor y es más parejo para repostería.' },
      { t: 'Seguridad', d: 'Buscá válvula de seguridad en hornallas y horno, y vidrio templado en la puerta: previenen escapes y accidentes.' },
      { t: 'Limpieza y materiales', d: 'El acero inoxidable y las superficies lisas se limpian más rápido; los esmaltes de baja calidad se manchan y se descascaran.' },
      { t: 'Instalación y service', d: 'Incluí en el presupuesto la instalación por gasista matriculado y verificá que la marca tenga repuestos en tu zona.' },
    ],
    faqs: [
      { q: '¿Qué ancho de cocina conviene?', a: 'Depende del hueco que tengas: las medidas más comunes van de 50 a 60 cm, y las de 90 cm son más cómodas si cocinás para muchos. Medí antes de comprar, incluyendo espacio para ventilación.' },
      { q: '¿Se puede usar una cocina a gas natural con garrafa?', a: 'Depende del modelo: algunos vienen para un tipo de gas y necesitan inyectores o un kit para convertirse. Confirmalo en la ficha y que lo haga un gasista matriculado.' },
      { q: '¿Cada cuánto conviene revisar la instalación de gas?', a: 'Se recomienda una revisión periódica por un gasista matriculado y revisar mangueras y conexiones ante cualquier olor o llama amarilla. No improvises reparaciones.' },
    ],
  },

  piletas: {
    intro:
      'Comprar una pileta es una decisión de ticket alto que se usa pocos meses al año, así que conviene pensarla al revés: primero cuánto espacio tenés, quién la va a usar y quién se encarga del mantenimiento, y después el modelo. Las desmontables y las de estructura tienen diferencias grandes de durabilidad y de instalación: una desmontable se arma en un día y se guarda, mientras que una de estructura necesita base nivelada y más cuidado. Los accesorios cuentan: una pileta sin bomba y filtro adecuados termina con agua verde en poco tiempo. Como la demanda se concentra antes del verano, mirar el historial ayuda a no comprar en el pico de precio.',
    criterios: [
      { t: 'Espacio y base', d: 'Medí el lugar con margen alrededor. El suelo tiene que estar nivelado y firme: una base despareja es la causa más común de problemas.' },
      { t: 'Capacidad y uso', d: 'Pensá cuántas personas la usan y si es para chicos o adultos: profundidad y diámetro cambian la seguridad y la comodidad.' },
      { t: 'Bomba y filtro', d: 'Fijate que el equipo de filtrado sea adecuado al volumen de agua; uno subdimensionado no mantiene el agua limpia.' },
      { t: 'Materiales y durabilidad', d: 'La calidad del PVC y de la estructura define cuántas temporadas dura. Las muy baratas suelen rendir una sola.' },
      { t: 'Mantenimiento', d: 'Sumá al presupuesto cloro, limpiafondos y cobertor. El costo de mantenerla pesa en pocas temporadas.' },
    ],
    faqs: [
      { q: '¿Qué pileta conviene para un patio chico?', a: 'Las desmontables redondas u ovaladas de poca profundidad se adaptan mejor a espacios reducidos y se guardan en invierno. Medí el lugar y dejá margen alrededor para circular.' },
      { q: '¿Necesito bomba y filtro?', a: 'Para cualquier pileta de tamaño medio en adelante, sí: sin recirculación y filtrado el agua se ensucia rápido. Elegí un equipo dimensionado al volumen de agua del modelo.' },
      { q: '¿Cuándo conviene comprar una pileta?', a: 'Los precios suelen subir cerca del verano por la demanda. Consultar el historial del modelo ayuda a ver si el precio de hoy es bajo para ese producto.' },
    ],
  },

  bicicletas: {
    intro:
      'La bicicleta correcta depende más de cómo y dónde la vas a usar que del precio: una para ir al trabajo, una de montaña y una de ruta piden cosas distintas. El rodado, el tamaño del cuadro y el tipo de frenos definen si es cómoda o un problema, y se deciden antes que la marca. En el rango medio conviene mirar los componentes (cambios, frenos, ruedas) más que el diseño, porque ahí está la diferencia de rendimiento y de mantenimiento. Verificá el talle con la tabla del vendedor y contá con un armado y ajuste final en un taller si no tenés experiencia.',
    criterios: [
      { t: 'Uso principal', d: 'Ciudad, paseo, montaña o ruta: cada uso pide geometría, rodado y neumáticos distintos. Elegí por lo que más vas a hacer.' },
      { t: 'Rodado y talle', d: 'El tamaño del cuadro y el rodado dependen de tu altura. Una bicicleta de talle incorrecto es incómoda y menos segura.' },
      { t: 'Frenos', d: 'Los frenos a disco frenan mejor en mojado y en bajadas; los de zapata son más simples y baratos de mantener.' },
      { t: 'Cambios y componentes', d: 'Más velocidades no siempre es mejor. Mirá la calidad de los componentes, que definen la durabilidad y el mantenimiento.' },
      { t: 'Armado y garantía', d: 'Muchas llegan sin armar o con ajuste básico. Presupuestá una revisión en taller y confirmá la garantía del cuadro.' },
    ],
    faqs: [
      { q: '¿Qué rodado me conviene?', a: 'Depende de tu altura y del uso. Revisá la tabla de talles de cada modelo antes de comprar: rodados mayores ruedan mejor en terreno parejo y los menores son más ágiles.' },
      { q: '¿Frenos a disco o de zapata?', a: 'El disco da mejor frenada en lluvia y bajadas y requiere más cuidado al ajustar; la zapata es más simple de mantener y suele venir en modelos más económicos.' },
      { q: '¿Conviene comprar una bicicleta por internet?', a: 'Sí, si verificás talle y medidas y contás con un ajuste final en taller. Priorizá vendedores con garantía y devolución, porque es difícil probarla antes de pagarla.' },
    ],
  },

  aspiradoras: {
    intro:
      'Una aspiradora se elige por el tipo de piso, el tamaño de la casa y si hay mascotas, no por la potencia que dice la caja. Los watts engañan: lo que mejora la limpieza es el diseño del cepillo, el filtrado y la succión real. Entre una de trineo, una vertical, una inalámbrica o una robot cambia más la comodidad que la limpieza: la robot mantiene el piso a diario sin esfuerzo pero no reemplaza una pasada a fondo; la inalámbrica es cómoda pero tiene batería limitada. Antes de comprar revisá el costo de repuestos y filtros, que es un gasto recurrente que se olvida.',
    criterios: [
      { t: 'Tipo de piso', d: 'Alfombras y pisos duros piden cepillos distintos. Uno mal elegido arrastra la suciedad en vez de levantarla.' },
      { t: 'Tipo de equipo', d: 'Trineo, vertical, inalámbrica o robot: elegí según el tamaño de la casa y cuánto tiempo querés dedicarle.' },
      { t: 'Filtrado', d: 'Si hay alergias o mascotas, un filtro de mejor calidad evita que el polvo fino vuelva al ambiente.' },
      { t: 'Autonomía y capacidad', d: 'En inalámbricas y robots, fijate cuánto dura la batería y el tamaño del depósito: define si limpiás toda la casa de una vez.' },
      { t: 'Repuestos', d: 'Bolsas, filtros y baterías cuestan. Verificá que se consigan en tu zona antes de elegir un modelo poco común.' },
    ],
    faqs: [
      { q: '¿Cuál conviene si tengo mascotas?', a: 'Buscá una con buen filtrado, cepillo que no se enrede con el pelo y depósito fácil de vaciar. Las verticales e inalámbricas suelen ser cómodas para el pelo diario.' },
      { q: '¿Una aspiradora robot reemplaza a una común?', a: 'Mantiene el piso limpio a diario, pero no suele llegar a rincones ni reemplaza una limpieza a fondo. Muchos la usan como complemento.' },
      { q: '¿Cuánto duran los filtros y las baterías?', a: 'Depende del uso y del modelo: los filtros se lavan o reemplazan periódicamente y las baterías pierden capacidad con los años. Confirmá que haya repuestos disponibles.' },
    ],
  },
}

export function getContenidoCategoria(slug: string): CategoriaContenido | undefined {
  return CONTENIDO_CATEGORIAS[slug]
}
