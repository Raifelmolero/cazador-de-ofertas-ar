// Páginas por categoría (/categoria/[slug]). Son URLs estables que apuntan a
// búsquedas con intención de compra ("ofertas de monitores", "freidora de aire
// oferta"); el listado de adentro sale del catálogo del momento, y el texto
// (guía de compra + preguntas frecuentes) es lo que no cambia y le da a la
// página algo que ofrecer aunque hoy no haya ofertas del rubro.
//
// Primero se eligieron rubros que aparecen todos los días en /ofertas de ML y
// que están en el tramo de comisión media (~7%, ver CATEGORY_COMMISSION_WEIGHT
// en bot/cazador_bot.py): monitores, freidoras de aire, heladeras, aspiradoras,
// ventiladores.
//
// Actualización 2026-09-23: el panel de afiliados (30 días) mostró que
// Climatización (7%), Herramientas Eléctricas (15%) y Camas/Colchones (15%)
// generaron más plata en un mes que todo lo demás junto, aunque aparecen
// pocas veces en /ofertas — se agregan igual: la página no queda "vacía"
// (ofertasDeCategoria devuelve [] y el componente ya maneja ese caso con un
// mensaje + CTA a /), y son justo las búsquedas de alta intención de compra
// que le interesan a Google/las IAs para citar el sitio.
//
// ML no trae la categoría real en el scraper, así que se infiere por palabras
// clave del título (igual que el bot), con una lista de exclusiones para que
// "ventilador" no traiga repuestos ni "monitor" traiga tensiómetros.

import { getOfertas, type ProductWithMargins } from '@/lib/productos'

export interface Categoria {
  slug: string
  nombre: string // "Monitores" — para chips y enlaces
  titulo: string // <title> y H1
  descripcion: string // meta description
  intro: string
  keywords: string[]
  excluir: string[]
  guia: { h: string; p: string[] }[]
  faqs: { q: string; a: string }[]
}

export const CATEGORIAS: Categoria[] = [
  {
    slug: 'monitores',
    nombre: 'Monitores',
    titulo: 'Ofertas de monitores en Mercado Libre Argentina',
    descripcion:
      'Monitores en oferta en Mercado Libre Argentina con el descuento verificado contra el historial de precios. Cómo elegir tamaño, panel y frecuencia de refresco.',
    intro:
      'Los monitores que hoy están en oferta en Mercado Libre Argentina, con el descuento verificado contra el historial de precios del producto.',
    keywords: ['monitor'],
    excluir: [
      'arterial', 'presion', 'bebe', 'baby', 'cardiac', 'glucosa', 'tensiometro',
      'soporte', 'brazo', 'base para', 'filtro', 'limpiador', 'repuesto',
    ],
    guia: [
      {
        h: 'Cómo elegir un monitor',
        p: [
          'Tamaño y resolución: para trabajar o estudiar, un monitor de 22 a 24 pulgadas Full HD (1920×1080) alcanza y sobra. Si querés más espacio para tener ventanas abiertas o editar, mirá los de 27 pulgadas; a esa medida conviene una resolución más alta que Full HD para que el texto se vea nítido.',
          'Frecuencia de refresco: 60 Hz es lo normal para oficina y series. Si jugás, los de 120 Hz en adelante (por ejemplo 144 o 180 Hz) hacen que el movimiento se vea más fluido, pero tu placa de video tiene que poder entregar esos cuadros por segundo.',
          'Tipo de panel: IPS ofrece mejores colores y ángulos de visión; VA da más contraste (negros más profundos); TN es el más rápido y barato pero con peores colores.',
        ],
      },
      {
        h: 'Qué revisar antes de comprar',
        p: [
          'Conexiones: fijate que el monitor tenga una entrada que tu equipo pueda usar (HDMI, DisplayPort o USB-C) y que el cable venga incluido o lo consigas.',
          'Soporte: si querés regular la altura o montarlo en la pared, buscá que sea compatible con VESA. Muchos monitores económicos solo se inclinan.',
          'Precio: comprobá que el descuento sea real. Un monitor puede figurar con "40% OFF" sobre un precio de lista que nunca se cobró; por eso marcamos los que están en su mínimo histórico.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Qué tamaño de monitor conviene para trabajar o estudiar?',
        a: 'Para la mayoría de las tareas de oficina y estudio, un monitor de 22 a 24 pulgadas Full HD es suficiente. Si trabajás con muchas ventanas a la vez o editás fotos y video, un monitor de 27 pulgadas da más espacio.',
      },
      {
        q: '¿Vale la pena un monitor de 144 Hz o más?',
        a: 'Solo si jugás o querés más fluidez en movimiento y tu equipo puede generar esa cantidad de cuadros por segundo. Para oficina, series y navegación, 60 Hz alcanza.',
      },
      {
        q: '¿Cómo sé si el descuento de un monitor es real?',
        a: 'Comparando con el historial de precios del producto. En Cazador de Ofertas AR descartamos las ofertas que ya se habían visto más baratas antes y marcamos con el sello de mínimo histórico las que están en su precio más bajo registrado.',
      },
    ],
  },
  {
    slug: 'freidoras-de-aire',
    nombre: 'Freidoras de aire',
    titulo: 'Ofertas de freidoras de aire (air fryer) en Mercado Libre Argentina',
    descripcion:
      'Freidoras de aire y hornos air fryer en oferta en Mercado Libre Argentina, con descuentos verificados. Qué capacidad elegir y qué mirar antes de comprar.',
    intro:
      'Freidoras de aire y hornos air fryer que hoy tienen descuento real en Mercado Libre Argentina, verificado contra el historial de precios.',
    keywords: ['freidora de aire', 'freidora electrica', 'freidora sin aceite', 'air fryer', 'airfryer'],
    excluir: ['repuesto', 'accesorio', 'papel', 'molde', 'bandeja', 'canasta para', 'funda'],
    guia: [
      {
        h: 'Qué capacidad elegir',
        p: [
          'Es lo que más define la compra. Las de 2 a 4 litros van bien para una o dos personas; para una familia o para cocinar porciones más grandes, buscá de 5 litros en adelante. Los hornos air fryer de mayor tamaño (10 litros o más) permiten cocinar varias cosas a la vez, pero ocupan bastante lugar en la mesada.',
        ],
      },
      {
        h: 'Qué revisar antes de comprar',
        p: [
          'Potencia: a mayor potencia, más rápido precalienta, aunque también consume más. Controles: los digitales con programas preseteados son más cómodos que la perilla analógica de tiempo y temperatura.',
          'Limpieza: fijate que la canasta o bandeja tenga antiadherente y sea desmontable, así la lavás sin complicaciones. Confirmá también si el fabricante indica que se puede lavar en lavavajillas.',
          'Espacio: medí el lugar donde la vas a usar. Necesita algo de aire alrededor para funcionar bien y no debería quedar pegada a la pared.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Qué capacidad de freidora de aire necesito?',
        a: 'Para una o dos personas alcanza una de 2 a 4 litros. Para una familia, conviene una de 5 litros o más. Los hornos air fryer grandes sirven para cocinar varias porciones a la vez, pero ocupan más espacio.',
      },
      {
        q: '¿Una freidora de aire reemplaza al horno?',
        a: 'Para porciones chicas y medianas cocina más rápido que un horno común porque calienta menos volumen de aire. Para platos grandes o varias bandejas a la vez, el horno tradicional sigue siendo más práctico.',
      },
      {
        q: '¿Cómo sé si el descuento de una freidora es real?',
        a: 'Mirando el historial de precios. En Cazador de Ofertas AR descartamos las ofertas cuyo precio ya se había visto igual o más bajo antes, y marcamos con el sello de mínimo histórico las que están en su precio más bajo registrado.',
      },
    ],
  },
  {
    slug: 'heladeras',
    nombre: 'Heladeras',
    titulo: 'Ofertas de heladeras en Mercado Libre Argentina',
    descripcion:
      'Heladeras en oferta en Mercado Libre Argentina con descuento verificado contra el historial de precios. Guía para elegir capacidad, no frost y eficiencia.',
    intro:
      'Heladeras con descuento real en Mercado Libre Argentina hoy, verificado contra el historial de precios del producto.',
    keywords: ['heladera', 'refrigerador'],
    excluir: [
      'portatil', 'camping', 'conservadora', 'termo', 'bolso', 'organizador',
      'burlete', 'repuesto', 'exhibidora', 'bajo mesada frigobar',
    ],
    guia: [
      {
        h: 'Cómo elegir una heladera',
        p: [
          'Capacidad: se mide en litros y depende de cuántas personas son y cada cuánto hacés las compras. Como referencia orientativa, una heladera de unos 250 a 300 litros suele alcanzar para una familia chica; para más personas, buscá modelos más grandes.',
          'Con freezer o sin: las que tienen freezer integrado son las más comunes. Si además necesitás congelar mucho, revisá la capacidad específica del freezer y no solo el total.',
          'No frost o cíclica: las no frost evitan la escarcha y no hay que descongelarlas a mano; las cíclicas suelen ser más económicas pero requieren descongelado periódico.',
        ],
      },
      {
        h: 'Qué revisar antes de comprar',
        p: [
          'Eficiencia energética: buscá la etiqueta de eficiencia. Las de tecnología inverter suelen consumir menos y hacer menos ruido, algo que se nota en la factura de luz.',
          'Medidas: medí el hueco donde va a ir, sumando el espacio para que abran las puertas y la ventilación trasera, y comprobá que pase por la puerta y el pasillo de tu casa.',
          'Envío: en heladeras conviene revisar el plazo de entrega y qué incluye el envío antes de decidir por el precio.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Qué capacidad de heladera necesito?',
        a: 'Depende de cuántas personas sean y de cuánto compres por vez. Como referencia orientativa, unos 250 a 300 litros alcanzan para una familia chica; con más integrantes conviene subir de capacidad.',
      },
      {
        q: '¿Qué diferencia hay entre una heladera no frost y una cíclica?',
        a: 'La no frost no forma escarcha y no hay que descongelarla; la cíclica sí acumula hielo y hay que descongelarla de vez en cuando, pero suele ser más económica.',
      },
      {
        q: '¿Cómo sé si el descuento de una heladera es real?',
        a: 'Comparando con el historial de precios del producto. Descartamos las ofertas que ya se habían visto igual o más baratas antes y marcamos con el sello de mínimo histórico las que están en su precio más bajo registrado.',
      },
    ],
  },
  {
    slug: 'aspiradoras',
    nombre: 'Aspiradoras',
    titulo: 'Ofertas de aspiradoras en Mercado Libre Argentina',
    descripcion:
      'Aspiradoras, robots y aspiradoras verticales en oferta en Mercado Libre Argentina, con descuento verificado. Cómo elegir según tu casa.',
    intro:
      'Aspiradoras con descuento real hoy en Mercado Libre Argentina, verificado contra el historial de precios.',
    keywords: ['aspiradora', 'aspirador'],
    excluir: ['repuesto', 'bolsa para', 'filtro para', 'cepillo para', 'accesorio', 'manguera para'],
    guia: [
      {
        h: 'Qué tipo de aspiradora te conviene',
        p: [
          'De trineo (con bolsa o sin bolsa): potentes y con buena capacidad, ideales para toda la casa. Verticales o inalámbricas: más prácticas para pasadas rápidas, aunque dependen de la autonomía de la batería. Robots: limpian solos y son útiles para mantenimiento diario, no reemplazan una limpieza a fondo. Secas y líquidas: sirven también para derrames y usos en garaje o taller.',
        ],
      },
      {
        h: 'Qué revisar antes de comprar',
        p: [
          'Potencia y succión: los watts indican consumo, no necesariamente qué tan bien aspira; mirá también la succión que informa el fabricante y las opiniones de quienes ya la usan.',
          'Filtro: si alguien en tu casa tiene alergias, buscá filtro HEPA. Con mascotas, fijate en los cepillos y en qué tan fácil es vaciar y limpiar el depósito.',
          'Autonomía y accesorios: en las inalámbricas, la duración de la batería; en todas, que incluyan las boquillas que realmente vas a usar (rendijas, tapizados, cepillo para pisos duros).',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Conviene una aspiradora robot o una común?',
        a: 'El robot sirve para mantener el piso al día sin esfuerzo, pero no reemplaza una aspiradora tradicional para limpiezas profundas, escaleras o tapizados. Muchas casas usan una para el día a día y otra para el fondo.',
      },
      {
        q: '¿Qué significa que una aspiradora tenga filtro HEPA?',
        a: 'Es un filtro de alta eficiencia que retiene partículas muy finas como polvo y polen. Es una buena opción si hay personas con alergias en casa.',
      },
      {
        q: '¿Cómo sé si el descuento de una aspiradora es real?',
        a: 'Mirando el historial de precios. En Cazador de Ofertas AR descartamos las ofertas que ya se habían visto igual o más baratas antes y marcamos con el sello de mínimo histórico las que están en su precio más bajo registrado.',
      },
    ],
  },
  {
    slug: 'ventiladores',
    nombre: 'Ventiladores',
    titulo: 'Ofertas de ventiladores en Mercado Libre Argentina',
    descripcion:
      'Ventiladores de pie, de techo y de mesa en oferta en Mercado Libre Argentina, con descuento verificado. Qué tipo elegir y qué revisar.',
    intro:
      'Ventiladores de pie, de techo y de mesa con descuento real hoy en Mercado Libre Argentina, verificado contra el historial de precios.',
    keywords: ['ventilador'],
    excluir: [
      'repuesto', 'aspa', 'helice', 'capacitor', 'motor para', 'control remoto para',
      'notebook', 'gabinete', 'cpu', 'pc gamer', 'celular',
    ],
    guia: [
      {
        h: 'Qué tipo de ventilador elegir',
        p: [
          'De pie: se mueven por toda la casa y suelen regular altura e inclinación. De mesa: chicos y prácticos para un escritorio o una mesa de luz. De techo: liberan espacio y mueven aire en toda la habitación, pero requieren instalación eléctrica y una altura de techo adecuada; los retráctiles se pliegan cuando no se usan. Turbo o de alto rendimiento: mueven mucho aire y sirven para ambientes grandes, aunque suelen ser más ruidosos.',
        ],
      },
      {
        h: 'Qué revisar antes de comprar',
        p: [
          'Ruido: es lo que más molesta de noche. Buscá opiniones sobre el nivel de ruido en las velocidades bajas y medias, que son las que más vas a usar.',
          'Velocidades y control: varias velocidades y control remoto son cómodos, sobre todo en los de techo. En los que llevan luz, fijate qué tipo de lámpara usa y si se pueden cambiar.',
          'Instalación: en los de techo, confirmá si necesitás electricista y verificá que el soporte aguante el peso del modelo.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Qué ventilador conviene para un dormitorio?',
        a: 'Uno silencioso y con varias velocidades. Los de pie o de techo suelen ser los más cómodos para dormir porque mueven el aire sin quedar en el medio; lo importante es el nivel de ruido en las velocidades bajas.',
      },
      {
        q: '¿Los ventiladores de techo necesitan instalación?',
        a: 'Sí: van conectados a la instalación eléctrica y fijados al techo, así que conviene que los coloque un electricista. Revisá también que la altura del techo sea adecuada para el modelo.',
      },
      {
        q: '¿Cómo sé si el descuento de un ventilador es real?',
        a: 'Comparando con el historial de precios. Descartamos las ofertas que ya se habían visto igual o más baratas antes y marcamos con el sello de mínimo histórico las que están en su precio más bajo registrado.',
      },
    ],
  },
  {
    slug: 'aire-acondicionado',
    nombre: 'Aire acondicionado',
    titulo: 'Ofertas de aire acondicionado en Mercado Libre Argentina',
    descripcion:
      'Aires acondicionados split en oferta en Mercado Libre Argentina con descuento verificado contra el historial de precios. Cómo elegir frigorías, inverter o no y qué revisar antes de comprar.',
    intro:
      'Aires acondicionados split con descuento real hoy en Mercado Libre Argentina, verificado contra el historial de precios del producto.',
    keywords: ['aire acondicionado', 'acondicionado split'],
    excluir: [
      'funda', 'soporte', 'control remoto', 'filtro', 'repuesto', 'cargador',
      'ventilador', 'portatil', 'camping',
    ],
    guia: [
      {
        h: 'Cuántas frigorías necesitás',
        p: [
          'Se calcula por el tamaño del ambiente: como referencia orientativa se usan unas 600 a 700 frigorías por metro cuadrado en un ambiente bien aislado, algo más si el techo es de chapa, recibe sol directo o tiene poco aislamiento. Para un dormitorio de 12 a 15 m² suele alcanzar un equipo de 2250 a 3000 frigorías; para un living más grande, hay que subir a 3500 o más. Ante la duda, conviene quedarse corto con el gasto pero no con la potencia: un equipo justo trabaja forzado todo el verano.',
        ],
      },
      {
        h: 'Inverter o no, y frío/calor o solo frío',
        p: [
          'Los equipos inverter regulan la velocidad del compresor en lugar de prenderse y apagarse todo el tiempo: consumen menos luz y son más silenciosos, aunque cuestan más de entrada. Para uso diario varias horas por día, la diferencia en la factura de luz suele justificar la inversión.',
          'Frío/calor sirve como calefacción en invierno además de enfriar en verano; frío solo es más barato pero solo cubre el verano. Si no tenés otra calefacción en ese ambiente, frío/calor suele convenir más en el total del año.',
        ],
      },
      {
        h: 'Qué revisar antes de comprar',
        p: [
          'Instalación: un split necesita instalación con gas y mano de obra especializada, que en general se cotiza aparte del precio del equipo. Pedí el presupuesto de instalación antes de decidir por el precio del aire solo.',
          'Wifi y control por app: es una comodidad, no algo indispensable; fijate que no infle el precio de un equipo que por lo demás no te convence.',
          'Precio: comprobá que el descuento sea real contra el historial de precios. En climatización los descuentos "de lista" suelen ser los más inflados del año, sobre todo antes del verano.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Cuántas frigorías necesito para mi ambiente?',
        a: 'Como referencia orientativa, unas 600 a 700 frigorías por metro cuadrado en un ambiente bien aislado; más si el techo es de chapa, recibe sol directo o está poco aislado. Para un dormitorio de 12 a 15 m² suele alcanzar un equipo de 2250 a 3000 frigorías.',
      },
      {
        q: '¿Vale la pena pagar más por un equipo inverter?',
        a: 'Si lo vas a usar varias horas por día, sí: consume menos luz y es más silencioso que uno convencional. Para uso muy esporádico, la diferencia de precio tarda más en amortizarse.',
      },
      {
        q: '¿El precio del aire acondicionado incluye la instalación?',
        a: 'No, casi nunca. La instalación con gas y mano de obra especializada se cotiza aparte y varía según el instalador y la distancia entre la unidad interior y la exterior.',
      },
      {
        q: '¿Cómo sé si el descuento de un aire acondicionado es real?',
        a: 'Comparando con el historial de precios del producto. En Cazador de Ofertas AR descartamos las ofertas que ya se habían visto igual o más baratas antes y marcamos con el sello de mínimo histórico las que están en su precio más bajo registrado.',
      },
    ],
  },
  {
    slug: 'herramientas-electricas',
    nombre: 'Herramientas eléctricas',
    titulo: 'Ofertas de herramientas eléctricas en Mercado Libre Argentina',
    descripcion:
      'Taladros, amoladoras, soldadoras y demás herramientas eléctricas en oferta en Mercado Libre Argentina, con descuento verificado. Qué mirar antes de comprar.',
    intro:
      'Taladros, atornilladores, amoladoras y otras herramientas eléctricas con descuento real hoy en Mercado Libre Argentina, verificado contra el historial de precios.',
    keywords: [
      'taladro', 'atornillador', 'amoladora', 'esmeril angular', 'lijadora',
      'rotomartillo', 'sierra circular', 'sierra caladora', 'soldadora',
      'compresor de aire', 'motosierra', 'desmalezadora', 'bordeadora',
      'hidrolavadora',
    ],
    excluir: [
      'funda', 'repuesto', 'accesorio', 'broca', 'disco de corte', 'mecha',
      'maletin', 'valija para',
    ],
    guia: [
      {
        h: 'Con cable, a batería o neumática',
        p: [
          'Con cable: más potencia sostenida y sin límite de autonomía, ideal para uso frecuente en un taller fijo. A batería: se mueven a cualquier lado sin buscar un enchufe, cómodas para changas y uso ocasional, pero la autonomía y la potencia dependen de la batería (más volts e ínamperios, más rinde). Neumáticas (compresor): más potencia por menos peso en la herramienta, pero necesitás el compresor y la manguera, así que solo conviene si ya lo tenés o vas a usar varias herramientas neumáticas.',
        ],
      },
      {
        h: 'Qué mirar antes de comprar',
        p: [
          'Potencia y torque: en taladros y atornilladores, más torque (Nm) significa que perforan o atornillan materiales más duros sin trabarse. En amoladoras y sierras, los watts indican la potencia del motor.',
          'Batería: si es a batería, fijate el voltaje (18V es un estándar cómodo para uso general) y si el fabricante vende baterías y cargadores compatibles con otras herramientas de la misma línea, para no comprar una batería distinta por cada aparato.',
          'Accesorios incluidos: maletín, mechas o discos incluidos cambian el precio real de la compra. Compará lo que incluye cada oferta, no solo el precio de la herramienta sola.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Conviene una herramienta con cable o a batería?',
        a: 'Con cable rinde más para uso frecuente en un lugar fijo, sin límite de autonomía. A batería es más práctica para moverte y para changas, aunque la potencia y la duración dependen de la batería.',
      },
      {
        q: '¿Qué voltaje de batería conviene para taladros y atornilladores?',
        a: '18V es un estándar cómodo para uso general en el hogar y changas. Si ya tenés otras herramientas de una marca, conviene mantener el mismo voltaje y línea para compartir baterías y cargador.',
      },
      {
        q: '¿Cómo sé si el descuento de una herramienta eléctrica es real?',
        a: 'Mirando el historial de precios del producto. En Cazador de Ofertas AR descartamos las ofertas que ya se habían visto igual o más baratas antes y marcamos con el sello de mínimo histórico las que están en su precio más bajo registrado.',
      },
    ],
  },
  {
    slug: 'colchones',
    nombre: 'Colchones',
    titulo: 'Ofertas de colchones en Mercado Libre Argentina',
    descripcion:
      'Colchones en oferta en Mercado Libre Argentina con descuento verificado contra el historial de precios. Cómo elegir firmeza, material y tamaño.',
    intro:
      'Colchones con descuento real hoy en Mercado Libre Argentina, verificado contra el historial de precios del producto.',
    keywords: ['colchon', 'colchón', 'sommier', 'sommiers'],
    excluir: ['funda', 'protector', 'cubre colchon', 'cubre colchón', 'forro'],
    guia: [
      {
        h: 'Qué firmeza y material elegir',
        p: [
          'Firmeza: depende del peso y la postura de quien duerme, no hay una respuesta única. Como referencia orientativa, alguien de contextura liviana suele estar más cómodo en un colchón medio a blando, y alguien de contextura más pesada en uno firme, que sostenga mejor la columna. Los que duermen de costado suelen preferir algo menos firme que los que duermen boca arriba.',
          'Espuma de alta densidad: buena relación precio-calidad, sostiene bien y dura varios años si la densidad es alta (fijate el número de densidad, no solo "espuma"). Resortes: reparten el peso en toda la superficie y suelen sentirse más frescos. Viscoelástico o "memory foam": se adapta al cuerpo y alivia puntos de presión, pero retiene más calor.',
        ],
      },
      {
        h: 'Qué revisar antes de comprar',
        p: [
          'Medidas: confirmá que la medida (1 plaza, 1 plaza y media, 2 plazas, queen, king) coincida exactamente con tu sommier o base de cama; unos centímetros de diferencia ya generan un colchón que sobra o que queda corto.',
          '"En caja": muchos colchones se envían comprimidos y enrollados en una caja chica; es normal y no afecta la calidad, pero tarda un tiempo en expandirse del todo (generalmente 24 a 48 horas) antes de dar su firmeza real.',
          'Garantía: los colchones de espuma de buena calidad suelen traer varios años de garantía contra hundimiento. Un colchón muy barato sin garantía especificada suele avisar sobre su durabilidad real.',
        ],
      },
    ],
    faqs: [
      {
        q: '¿Qué firmeza de colchón me conviene?',
        a: 'Depende de tu peso y de cómo dormís. Como referencia orientativa, contextura liviana va mejor con firmeza media a blanda, contextura más pesada con uno firme; dormir de costado suele pedir algo menos firme que dormir boca arriba.',
      },
      {
        q: '¿Un colchón "en caja" es de menor calidad?',
        a: 'No, es solo la forma de envío: viene comprimido y enrollado para que entre en una caja chica, y se expande a su tamaño y firmeza reales en 24 a 48 horas. No afecta la calidad del colchón.',
      },
      {
        q: '¿Cómo sé si el descuento de un colchón es real?',
        a: 'Comparando con el historial de precios del producto. En Cazador de Ofertas AR descartamos las ofertas que ya se habían visto igual o más baratas antes y marcamos con el sello de mínimo histórico las que están en su precio más bajo registrado.',
      },
    ],
  },
]

export function getCategoria(slug: string): Categoria | undefined {
  return CATEGORIAS.find(c => c.slug === slug)
}

function normalizar(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

/** Ofertas del momento que caen en la categoría (mismo orden que /hoy).
 *
 *  Las exclusiones se miran solo en las primeras 4 palabras: un repuesto o un
 *  accesorio arranca así ("Repuesto aspa para ventilador…", "Soporte para
 *  monitor…"), mientras que un producto legítimo nombra esas palabras más
 *  adelante ("Ventilador de techo 4 aspas", "Aspiradora con 5 accesorios"). */
export function ofertasDeCategoria(cat: Categoria): ProductWithMargins[] {
  return getOfertas().filter(o => {
    const t = normalizar(o.titulo)
    const inicio = t.split(/\s+/).slice(0, 4).join(' ')
    return cat.keywords.some(k => t.includes(k)) && !cat.excluir.some(x => inicio.includes(x))
  })
}
