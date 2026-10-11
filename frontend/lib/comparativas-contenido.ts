// Texto permanente de las comparativas /mejores/[slug]. La tabla de productos
// cambia con las ofertas del día; esto no. Una comparativa con contenido acá es
// siempre indexable (ver `indexable` en comparativas.ts): Google ve una guía
// completa aunque ese día haya pocas ofertas, que es lo que hace ganar al
// competidor (andocomprando.com.ar) en búsquedas como "mejores piletas de lona".
//
// Reglas: nada de precios ni modelos inventados; solo criterios que no caducan.

export interface ContenidoComparativa {
  /** Título SEO (si no, se usa el de la comparativa). */
  titulo?: string
  secciones: { titulo: string; parrafos: string[] }[]
  faq: { q: string; a: string }[]
}

export const CONTENIDO: Record<string, ContenidoComparativa> = {
  'mejores-piletas': {
    titulo: 'Mejores piletas de lona en Argentina 2026: precios y accesorios',
    secciones: [
      {
        titulo: 'Cómo elegir una pileta de lona',
        parrafos: [
          'Lo primero es el espacio: medí el lugar donde va a ir y sumale al menos 50 cm alrededor para circular y apoyar la escalera. La pileta tiene que quedar sobre un piso plano y firme; una diferencia de nivel de pocos centímetros hace que el agua empuje de un solo lado y deforme la estructura.',
          'El segundo dato es la capacidad en litros. Una pileta de 1.000 a 3.000 litros sirve para chicos y para refrescarse; de 5.000 litros en adelante ya entran varios adultos. A más litros, más agua, más filtrado y más tiempo de llenado, así que conviene pensar también en la bomba y en la manguera.',
          'Fijate en la altura: las bajas (hasta 40 cm) son para chicos chiquitos y se arman en minutos; las de 60 cm o más son para toda la familia pero necesitan estructura reforzada.',
        ],
      },
      {
        titulo: 'Estructural, inflable o de lona con tubos: cuál conviene',
        parrafos: [
          'Las inflables son las más baratas y se guardan fácil, pero se pinchan y duran poco. Las de lona con estructura de caños de acero (tipo Pelopincho, Tiburoncito o Intex) resisten varias temporadas si se las cuida. Las estructurales con paneles son las más duraderas y también las más caras.',
          'Si vas a usarla todo el verano, comprá una estructural o de lona con caños: la diferencia de precio se recupera en la segunda temporada.',
        ],
      },
      {
        titulo: 'Accesorios que sí vale la pena comprar',
        parrafos: [
          'Un cobertor evita que entren hojas e insectos y mantiene el agua más limpia. La lona de base protege el fondo de la pileta del piso. La bomba con filtro (depuradora) es lo que más cambia el mantenimiento: sin filtrar, el agua se pone verde en pocos días con calor.',
          'Sumá un kit de limpieza (barrefondo manual y saca hojas) y los químicos básicos: cloro en pastillas o granulado, y un medidor de pH. El filtro tiene que acompañar el volumen de agua: mirá los litros por hora que declara el fabricante y que cubra todo el volumen en pocas horas.',
        ],
      },
      {
        titulo: 'Cuándo conviene comprarla',
        parrafos: [
          'La demanda sube desde octubre y se dispara en diciembre y enero; en esa época los precios casi nunca bajan. Comprar a fines de septiembre u octubre, o aprovechar eventos como el Cyber Monday, suele salir mejor. En cada oferta de esta página mostramos el precio más bajo que registramos para que veas si el descuento es real.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Qué pileta de lona conviene comprar?',
        a: 'Para uso familiar durante todo el verano, una de lona con estructura de caños de acero: es más resistente que la inflable y bastante más barata que una estructural de paneles. Elegí la capacidad según cuántas personas la van a usar y comprá una bomba con filtro acorde a los litros.',
      },
      {
        q: '¿Cuántos litros necesito?',
        a: 'Para chicos alcanza con 1.000 a 3.000 litros. Para que se refresquen varios adultos, 5.000 litros o más. A mayor capacidad, más agua y más filtrado: tenelo en cuenta antes de comprar.',
      },
      {
        q: '¿Cuánto dura una pileta de lona?',
        a: 'Con piso nivelado, base protectora, cobertor y buen mantenimiento del agua, una pileta de lona con estructura dura varias temporadas. Las inflables suelen durar una sola.',
      },
      {
        q: '¿Hace falta bomba o filtro?',
        a: 'Sí, si querés que el agua dure. Sin filtrar y sin cloro, el agua se pone verde en pocos días con calor. La bomba con filtro tiene que cubrir el volumen total de la pileta en pocas horas.',
      },
      {
        q: '¿Cada cuánto cambian los precios de las piletas en Mercado Libre?',
        a: 'Cambian varias veces por semana y suben en temporada alta. Revisamos Mercado Libre tres veces por día y guardamos el precio más bajo registrado de cada modelo para que compares.',
      },
    ],
  },

  'mejores-parrillas': {
    secciones: [
      {
        titulo: 'Cómo elegir una parrilla o asador',
        parrafos: [
          'Pensá primero en el espacio y en cuánta gente cocinás. Una parrilla de 60 a 80 cm alcanza para una familia; para reuniones grandes buscá 1 metro o más de parrilla útil. Si el lugar es chico, hay modelos portátiles y plegables.',
          'El material define cuánto duran: el acero inoxidable y la chapa de buen espesor resisten mejor la humedad y el calor; la chapa fina se deforma con el uso. Las parrillas de hierro fundido retienen más calor, pero pesan más.',
        ],
      },
      {
        titulo: 'Carbón, gas o eléctrica',
        parrafos: [
          'La de carbón o leña da el sabor clásico del asado y es la más barata, pero lleva más tiempo y limpieza. La de gas enciende rápido y se controla mejor la temperatura, ideal para el día a día. La eléctrica es la opción para balcones y departamentos donde no se puede hacer fuego.',
          'Si tu consorcio no permite brasas, consultá el reglamento antes de comprar una de carbón.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Qué parrilla conviene para un asado familiar?',
        a: 'Una de 60 a 80 cm de parrilla útil, de acero inoxidable o chapa gruesa, con regulación de altura de la parrilla. Si cocinás todos los días, una a gas; si sólo los fines de semana, de carbón.',
      },
      {
        q: '¿Se puede usar una parrilla en un departamento?',
        a: 'Depende del reglamento del edificio. En balcones suelen permitirse las eléctricas y algunas a gas portátiles; las de carbón o leña, en general no.',
      },
    ],
  },

  'mejores-freezers': {
    secciones: [
      {
        titulo: 'Cómo elegir un freezer',
        parrafos: [
          'La capacidad se mide en litros: 100 a 150 litros para 1 o 2 personas, 200 a 300 para una familia, y más de 300 si comprás en cantidad (carne, por ejemplo). Medí el lugar y sumá espacio libre alrededor para la ventilación.',
          'Elegí entre horizontal (más capacidad y mejor aislamiento, ocupa más lugar) y vertical (más compacto, con cajones que ordenan). El horizontal consume menos y conserva mejor el frío si se corta la luz.',
        ],
      },
      {
        titulo: 'Consumo y eficiencia',
        parrafos: [
          'Fijate en la etiqueta de eficiencia energética (A o superior): un freezer funciona 24 horas, así que la diferencia de consumo se nota en la factura. Con nuestra calculadora de consumo eléctrico podés estimar el costo mensual en pesos.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Qué capacidad de freezer necesito?',
        a: 'De 100 a 150 litros para una o dos personas, de 200 a 300 para una familia, y más de 300 litros si comprás carne por mayor o cocinás para freezar.',
      },
      {
        q: '¿Es mejor freezer horizontal o vertical?',
        a: 'El horizontal consume menos y conserva más tiempo el frío ante un corte de luz; el vertical ocupa menos superficie y es más fácil de ordenar.',
      },
    ],
  },

  'mejores-lavavajillas': {
    secciones: [
      {
        titulo: 'Cómo elegir un lavavajillas',
        parrafos: [
          'La capacidad se mide en cubiertos o servicios: 6 a 8 para 1 o 2 personas (o los modelos compactos de mesada), 12 a 14 para familias. Medí el hueco de la cocina: los de empotrar suelen ser de 60 cm de ancho y los slim de 45 cm.',
          'Mirá la eficiencia energética y el consumo de agua por ciclo. Un buen lavavajillas gasta menos agua que lavar a mano, y los programas eco y de media carga ayudan a ahorrar.',
          'Necesita conexión de agua y desagüe: sumá la instalación al presupuesto si no tenés la toma preparada.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Qué capacidad de lavavajillas conviene?',
        a: 'Para una o dos personas alcanza uno compacto de 6 a 8 cubiertos; para una familia de cuatro, uno de 12 a 14.',
      },
      {
        q: '¿Un lavavajillas gasta más agua que lavar a mano?',
        a: 'Generalmente menos: un ciclo eco de un buen equipo consume bastante menos agua que lavar la misma cantidad de vajilla a mano.',
      },
    ],
  },

  'mejores-licuadoras': {
    secciones: [
      {
        titulo: 'Cómo elegir una licuadora',
        parrafos: [
          'La potencia en watts indica cuánto aguanta: 500 a 700 W alcanza para licuados y jugos; para picar hielo y frutas congeladas buscá 1.000 W o más. Las de vaso de vidrio resisten mejor el calor y las marcas; las de plástico son más livianas y baratas.',
          'Mirá la capacidad del vaso (1,5 a 2 litros es estándar), la cantidad de velocidades y si trae función pulsar. Las cuchillas de acero inoxidable de 4 o 6 puntas duran más.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Cuántos watts tiene que tener una licuadora?',
        a: 'Entre 500 y 700 W para uso diario; 1.000 W o más si vas a picar hielo o licuar frutas congeladas seguido.',
      },
      {
        q: '¿Vaso de vidrio o de plástico?',
        a: 'El de vidrio resiste mejor el calor y no se mancha ni absorbe olores, pero pesa y se puede romper. El de plástico es liviano y económico.',
      },
    ],
  },

  'mejores-perfumes': {
    secciones: [
      {
        titulo: 'Cómo comprar perfumes sin que te estafen',
        parrafos: [
          'Comprá siempre a vendedores oficiales o tiendas con reputación alta en Mercado Libre: fijate en las ventas, las calificaciones y si dice "Tienda oficial". Un precio muy por debajo del resto suele ser señal de producto falsificado o de contenido distinto al anunciado.',
          'Conviene mirar el tamaño (ml) y la concentración: el eau de parfum dura más que el eau de toilette. Comparar el precio por mililitro es la forma justa de ver cuál rinde más.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Cómo sé si un perfume en Mercado Libre es original?',
        a: 'Comprá a tiendas oficiales o a vendedores con muchas ventas y reputación alta, verificá el sello de la marca y desconfiá de precios muy por debajo del resto.',
      },
      {
        q: '¿Qué dura más, eau de parfum o eau de toilette?',
        a: 'El eau de parfum tiene más concentración de esencia y dura más horas en la piel.',
      },
    ],
  },

  'mejores-sillas-gamer': {
    secciones: [
      {
        titulo: 'Cómo elegir una silla gamer',
        parrafos: [
          'Lo que más importa es la ergonomía: respaldo reclinable, apoyabrazos regulables, soporte lumbar y altura ajustable. Si vas a pasar muchas horas sentado, esas regulaciones valen más que el diseño.',
          'Revisá el peso máximo que soporta, el material del tapizado (cuero sintético, tela respirable o malla) y la base: de metal dura más que la de plástico. En verano la tela respirable es más cómoda que el cuero sintético.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Qué hay que mirar al comprar una silla gamer?',
        a: 'Regulación de altura, respaldo reclinable, apoyabrazos y soporte lumbar, además del peso máximo y una base de metal. Sirven más que el diseño.',
      },
      {
        q: '¿Cuero sintético o tela?',
        a: 'La tela o malla es más fresca en verano; el cuero sintético se limpia más fácil pero da calor.',
      },
    ],
  },

  'mejores-afeitadoras-y-cortadoras-de-pelo': {
    secciones: [
      {
        titulo: 'Cómo elegir una afeitadora o cortadora de pelo',
        parrafos: [
          'Fijate en la autonomía de la batería y si puede usarse enchufada, en las cuchillas (acero inoxidable o cerámica), y en los peines o largos de corte incluidos. Las lavables con agua son más fáciles de limpiar.',
          'Si es para cortar el pelo en casa, buscá una con varios peines guía; si es para barba, una con regulación fina del largo.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Qué conviene más, cortadora con cable o inalámbrica?',
        a: 'La inalámbrica es más cómoda, pero revisá la autonomía. Algunas permiten usarse también enchufadas, que es lo ideal.',
      },
    ],
  },

  'mejores-ventiladores': {
    secciones: [
      {
        titulo: 'Cómo elegir un ventilador',
        parrafos: [
          'El tipo depende del lugar: de pie o de pared para ambientes medianos, de techo para dormitorios y livings, de mesa o turbo para espacios chicos. El de techo mueve el aire de todo el ambiente y casi no ocupa lugar.',
          'Fijate en la potencia en watts, el diámetro de las aspas (más grande mueve más aire) y las velocidades. Un motor con rulemanes es más silencioso y duradero que uno con bujes. Si lo vas a usar de noche, buscá uno de bajo nivel de ruido y con control remoto o temporizador.',
        ],
      },
      {
        titulo: 'Ventilador, ventilador de techo o aire acondicionado',
        parrafos: [
          'El ventilador no baja la temperatura: refresca porque mueve el aire sobre la piel. Gasta mucho menos que un aire (unos 50 a 100 W contra más de 1.000), pero en olas de calor fuertes no alcanza. Para dormir con mucho calor, un aire inverter suele ser la mejor inversión.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Qué ventilador conviene para un dormitorio?',
        a: 'Uno de techo si el ambiente lo permite, o uno de pie silencioso con temporizador. Mirá el nivel de ruido y que tenga velocidades bajas.',
      },
      {
        q: '¿Un ventilador gasta mucha luz?',
        a: 'No: la mayoría consume entre 50 y 100 W, bastante menos que un aire acondicionado.',
      },
      {
        q: '¿Ventilador o aire acondicionado?',
        a: 'El ventilador refresca moviendo el aire pero no baja la temperatura; con calor extremo conviene un aire, preferentemente inverter por el consumo.',
      },
    ],
  },

  'mejores-muebles-de-jardin': {
    secciones: [
      {
        titulo: 'Cómo elegir muebles de jardín',
        parrafos: [
          'Pensá primero en el uso: un juego de mesa y sillas para comer, un living con sillones y mesa ratona, o reposeras para la pileta. Medí el espacio y dejá lugar para circular.',
          'El material define cuánto duran a la intemperie: la resina y el aluminio no se oxidan; el hierro con pintura epoxi aguanta si se lo cuida; la madera necesita barniz cada temporada; el mimbre sintético (ratán) resiste el sol y la lluvia. Los almohadones tienen que ser desmontables para lavarlos.',
        ],
      },
      {
        titulo: 'Cómo cuidarlos',
        parrafos: [
          'Con una funda o guardándolos bajo techo en invierno duran varias temporadas más. Evitá dejar los almohadones a la lluvia y limpiá la estructura con agua y jabón neutro.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Qué material es mejor para muebles de exterior?',
        a: 'La resina, el aluminio y el mimbre sintético son los que mejor resisten sol y lluvia sin mantenimiento. La madera y el hierro necesitan cuidado periódico.',
      },
      {
        q: '¿Conviene comprar muebles de jardín en primavera?',
        a: 'Sí: la demanda sube desde octubre y en pleno verano hay menos stock. Comprar temprano o en eventos como el Cyber Monday suele salir mejor.',
      },
    ],
  },

  'mejores-bicicletas': {
    secciones: [
      {
        titulo: 'Cómo elegir una bicicleta',
        parrafos: [
          'Primero el uso: urbana o de paseo para la ciudad, mountain bike (MTB) para tierra y ripio, de ruta para asfalto y distancia. Después el talle: el rodado (26, 27,5, 29) y el tamaño del cuadro tienen que ir según tu altura. Una bici de talle incorrecto es incómoda y menos segura.',
          'Mirá el cuadro (aluminio es liviano y no se oxida; acero es más económico y resistente), los frenos (a disco frenan mejor en mojado que los V-brake) y la cantidad de cambios. Para uso urbano, 7 a 21 velocidades alcanzan.',
        ],
      },
      {
        titulo: 'Seguridad y accesorios',
        parrafos: [
          'Casco, luces delantera y trasera y una buena traba son lo mínimo. Verificá que venga armada o que el vendedor explique el armado: muchas se envían desarmadas y conviene que la ajuste un bicicletero.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Qué rodado de bicicleta necesito?',
        a: 'Depende de tu altura y del uso. Para adultos, 26 o 27,5 en MTB urbana y 29 para más rendimiento; para chicos hay rodados 12, 16 y 20. Revisá la tabla de talles del fabricante.',
      },
      {
        q: '¿Frenos a disco o V-brake?',
        a: 'El freno a disco frena mejor con lluvia y requiere menos fuerza; el V-brake es más simple y barato de mantener.',
      },
    ],
  },

  'mejores-aires-acondicionados': {
    secciones: [
      {
        titulo: 'Cuántas frigorías necesitás',
        parrafos: [
          'La regla práctica es multiplicar el volumen del ambiente (m² × altura en metros) por 50. Un cuarto de 20 m² con techo de 2,6 m son unas 2.600 frigorías. Sumá si hay mucho sol, ventanales o cocina; elegí un equipo de 3.000 o más en ese caso. Podés usar nuestra calculadora de frigorías para afinarlo.',
        ],
      },
      {
        titulo: 'Inverter, frío solo o frío/calor',
        parrafos: [
          'El inverter ajusta la potencia del compresor en lugar de prenderse y apagarse, así consume bastante menos y hace menos ruido. Si lo vas a usar muchas horas, se paga solo en la factura. El modelo frío/calor sirve también en invierno con bomba de calor, más eficiente que una estufa eléctrica.',
          'Contá la instalación: casi nunca está incluida en el precio y puede sumar un costo importante. Pedí presupuesto de un instalador matriculado antes de comprar.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Cuántas frigorías necesito para 20 m²?',
        a: 'Unas 2.600 frigorías con techo de 2,6 m (volumen × 50). Con mucho sol o ventanales conviene 3.000 o más.',
      },
      {
        q: '¿Vale la pena el aire inverter?',
        a: 'Sí si lo usás muchas horas: consume menos y es más silencioso que uno convencional. La diferencia de precio se recupera en la factura de luz.',
      },
      {
        q: '¿La instalación está incluida?',
        a: 'Casi nunca. Sumá al presupuesto el costo de un instalador, que depende de la distancia entre la unidad interior y la exterior.',
      },
    ],
  },

  'mejores-heladeras': {
    secciones: [
      {
        titulo: 'Cómo elegir una heladera',
        parrafos: [
          'La capacidad se mide en litros: 250 a 300 para 1 o 2 personas, 350 a 400 para una familia chica y 450 o más para familias grandes o si comprás en cantidad. Medí el hueco donde va y la puerta de entrada: muchas heladeras no pasan por pasillos angostos.',
          'No frost evita descongelar a mano y mantiene la temperatura pareja, aunque cuesta más y consume algo más. Las de freezer superior son las más económicas; las side by side y las de freezer inferior son más cómodas pero más caras.',
        ],
      },
      {
        titulo: 'Consumo y eficiencia',
        parrafos: [
          'Una heladera funciona todo el día, así que la etiqueta de eficiencia (A o superior) se nota en la factura. Con nuestra calculadora de consumo eléctrico podés estimar cuánto gasta en pesos por mes.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Qué capacidad de heladera necesito?',
        a: 'Para una o dos personas 250 a 300 litros; para una familia de 3 o 4, unos 350 a 400 litros.',
      },
      {
        q: '¿Conviene la heladera No Frost?',
        a: 'Si querés evitar descongelar y mantener la temperatura pareja, sí. Es más cara que una con freezer común y consume un poco más.',
      },
    ],
  },

  'mejores-colchones': {
    secciones: [
      {
        titulo: 'Resortes o espuma: cuál conviene',
        parrafos: [
          'El colchón de resortes es fresco, firme y el más elegido en Argentina; ideal si dormís con calor y querés un apoyo firme. El de espuma de alta densidad es más liviano, silencioso y se adapta mejor al cuerpo; suele ser más cómodo para quien se mueve poco o tiene dolores en las articulaciones.',
          'La densidad de la espuma (kg/m³) indica la durabilidad: para uso diario buscá 28 kg/m³ o más. En resortes, mirá la cantidad y el tipo (bicónicos, Bonnell o embolsados).',
        ],
      },
      {
        titulo: 'Medidas y firmeza',
        parrafos: [
          'Las medidas más comunes: 1 plaza (80 a 100 cm), 1 plaza y media (100 a 120 cm), 2 plazas (140 cm), queen (160 cm) y king (180 a 200 cm). Medí la cama y la habitación antes de comprar. La firmeza depende de tu peso y de cómo dormís: de costado conviene algo más blando, boca arriba o boca abajo, más firme.',
          'Revisá la garantía del fabricante y el período de prueba si lo ofrece. Un colchón dura en promedio 8 a 10 años.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Qué colchón es mejor, de resortes o de espuma?',
        a: 'El de resortes es más fresco y firme; el de espuma es más liviano y se adapta al cuerpo. Depende de tu preferencia de firmeza y de si dormís con calor.',
      },
      {
        q: '¿Cada cuánto hay que cambiar el colchón?',
        a: 'En promedio cada 8 a 10 años, o antes si se hunde, se nota el desgaste o amanecés con dolores.',
      },
      {
        q: '¿Qué medida de colchón necesito para dos personas?',
        a: 'Para dos, 140 cm (2 plazas) es lo mínimo; queen (160 cm) o king (180 a 200 cm) dan más espacio.',
      },
    ],
  },

  'mejores-freidoras-de-aire': {
    secciones: [
      {
        titulo: 'Cómo elegir una freidora de aire',
        parrafos: [
          'La capacidad se mide en litros: 2 a 4 litros para 1 o 2 personas, 5 a 7 para una familia, y más de 8 si cocinás para muchos o querés meter un pollo entero. La potencia (1.400 a 2.000 W) define la velocidad de cocción.',
          'Buscá canasta antiadherente y apta lavavajillas, control digital de temperatura y programas preconfigurados. Las de doble canasta o tipo horno permiten cocinar dos cosas a la vez.',
        ],
      },
      {
        titulo: 'Freidora de aire u horno eléctrico',
        parrafos: [
          'La freidora cocina más rápido, no necesita precalentar y gasta menos energía; el horno eléctrico es más versátil para pizzas, tortas y porciones grandes. Si cocinás para una o dos personas a diario, la freidora rinde más.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Qué capacidad de freidora de aire conviene?',
        a: 'De 2 a 4 litros para una o dos personas, de 5 a 7 para una familia chica y 8 o más para cocinar para muchos.',
      },
      {
        q: '¿Una freidora de aire gasta mucha luz?',
        a: 'Menos que un horno eléctrico: cocina más rápido y no necesita precalentar, aunque la potencia ronda los 1.400 a 2.000 W.',
      },
    ],
  },

  'mejores-smart-tv': {
    secciones: [
      {
        titulo: 'Cómo elegir una smart TV sin pagar de más',
        parrafos: [
          'Una smart TV se usa todos los días durante años, así que conviene decidir por lo que vas a ver y desde dónde. El tamaño depende de la distancia al sillón, el panel define cómo se ven los colores y el negro, y el sistema operativo decide qué tan fluida es la experiencia con las aplicaciones. Un descuento grande sobre un modelo flojo no es una buena compra: primero definí estos tres puntos y recién después compará precios.',
        ],
      },
      {
        titulo: 'Tamaño y distancia',
        parrafos: [
          'Como regla práctica, la distancia ideal es entre 1,5 y 2,5 veces la diagonal de la pantalla. Con 2,5 metros de distancia, una de 50 a 55 pulgadas se ve cómoda; en un dormitorio chico alcanza con 32 a 43. Comprar una pantalla enorme para un living chico cansa la vista.',
        ],
      },
      {
        titulo: 'Panel, resolución y tasa de refresco',
        parrafos: [
          'En 32 pulgadas o menos, HD es suficiente; de 43 en adelante conviene 4K, que además es lo que usan las plataformas de streaming. Los paneles QLED y OLED mejoran color y contraste frente a un LED común, aunque la diferencia de precio es considerable. Si vas a jugar con consola, buscá 120 Hz y modo juego de baja latencia.',
        ],
      },
      {
        titulo: 'Sistema operativo y conexiones',
        parrafos: [
          'Google TV, Android TV, Roku TV, webOS y Tizen son los más frecuentes. Lo importante es que tenga las aplicaciones que usás y que el fabricante siga dando actualizaciones. Verificá también la cantidad de puertos HDMI y si trae Wi-Fi de doble banda, porque una conexión inestable arruina el streaming.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Qué tamaño de smart TV conviene para un living?',
        a: 'Midiendo la distancia al sillón: a 2,5 metros funcionan bien entre 50 y 55 pulgadas; a 3 metros o más, de 55 a 65. En ambientes chicos, 43 pulgadas suele ser suficiente.',
      },
      {
        q: '¿Vale la pena pagar más por 4K?',
        a: 'Desde 43 pulgadas sí: casi todo el contenido nuevo está en 4K y la diferencia de precio con Full HD es chica. En 32 pulgadas el ojo casi no nota la mejora.',
      },
      {
        q: '¿QLED u OLED?',
        a: 'OLED ofrece el mejor negro y contraste, ideal para cuarto oscuro; QLED es más brillante, mejor para ambientes con mucha luz y suele costar menos.',
      },
    ],
  },

  'mejores-lavarropas': {
    secciones: [
      {
        titulo: 'Qué mirar antes de elegir un lavarropas',
        parrafos: [
          'Un lavarropas es una compra de varios años, y la diferencia entre acertar y errar se nota en la factura de agua y luz y en la vida útil de la ropa. Antes de mirar descuentos, definí tipo de carga, capacidad y si tenés el espacio y las conexiones para el modelo que querés.',
        ],
      },
      {
        titulo: 'Carga frontal o superior',
        parrafos: [
          'La carga frontal lava mejor, gasta menos agua y permite apilar una secadora arriba; el tambor gira sobre un eje horizontal y trata mejor la ropa. La carga superior es más cómoda de cargar sin agacharse, ocupa menos ancho y suele ser más económica, pero consume más agua.',
        ],
      },
      {
        titulo: 'Capacidad en kilos',
        parrafos: [
          'Para una o dos personas alcanzan 6 a 7 kg; para una familia de cuatro, 8 a 10 kg. Un tambor más grande evita lavar dos veces por semana los acolchados y los toallones. El valor de la ficha es el máximo en ropa seca de algodón, y rinde mejor cargado al 80 por ciento.',
        ],
      },
      {
        titulo: 'Centrifugado, eficiencia y motor',
        parrafos: [
          'Más revoluciones por minuto dejan la ropa menos mojada y acortan el tendido, aunque desgastan algo más. La etiqueta de eficiencia energética A indica menor consumo. El motor inverter es más silencioso y suele tener mayor garantía: compará el plazo de garantía del motor, que es la pieza cara.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Qué capacidad de lavarropas necesito?',
        a: 'Para una o dos personas, de 6 a 7 kg; para tres o cuatro, de 8 a 10 kg. Si lavás acolchados, conviene 10 kg o más.',
      },
      {
        q: '¿Es mejor carga frontal o superior?',
        a: 'La frontal lava mejor y ahorra agua; la superior es más cómoda y barata. Si el espacio permite, la frontal rinde más a largo plazo.',
      },
      {
        q: '¿Cuánto dura un lavarropas?',
        a: 'Con uso normal entre 8 y 12 años. Limpiar el filtro y no sobrecargar el tambor extiende su vida útil.',
      },
    ],
  },

  'mejores-notebooks': {
    secciones: [
      {
        titulo: 'Para qué la vas a usar define todo',
        parrafos: [
          'Una notebook para estudiar o trabajar con documentos y navegador no necesita lo mismo que una para editar video o jugar. Pagar de más por potencia que no vas a usar es el error más común, y el opuesto, comprar una muy básica, hace que se sienta lenta a los pocos meses. Empezá por el uso y recién después compará precio.',
        ],
      },
      {
        titulo: 'Procesador y memoria RAM',
        parrafos: [
          'Para uso general, un procesador de gama media actual y 8 GB de RAM funcionan bien; con 16 GB la máquina envejece mejor y aguanta muchas pestañas y programas abiertos. Evitá equipos con 4 GB de RAM: hoy el sistema solo consume casi todo. Fijate si la memoria es ampliable.',
        ],
      },
      {
        titulo: 'Almacenamiento y pantalla',
        parrafos: [
          'Un disco SSD es no negociable: acelera el arranque y los programas muchísimo más que cualquier otro componente. Buscá al menos 256 GB, mejor 512. En pantalla, priorizá resolución Full HD y panel IPS, que mejora ángulos y colores frente a los TN básicos.',
        ],
      },
      {
        titulo: 'Batería, peso y garantía',
        parrafos: [
          'Si la vas a llevar a diario, el peso y la autonomía pesan más que unos GHz extra. Chequeá que tenga garantía oficial en Argentina y qué cubre. En equipos gamer o de edición, mirá también la refrigeración: un buen procesador con mala ventilación se frena solo.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Cuánta RAM necesita una notebook?',
        a: 'Para estudiar y trabajar con navegador y ofimática, 8 GB es el piso razonable; con 16 GB la notebook rinde mejor durante más años.',
      },
      {
        q: '¿Conviene SSD o disco rígido?',
        a: 'SSD, siempre. Acelera el arranque, la apertura de programas y el uso cotidiano mucho más que cualquier otro cambio.',
      },
      {
        q: '¿Qué notebook sirve para estudiar?',
        a: 'Una liviana, con buena batería, 8 GB de RAM, SSD y pantalla Full HD. No hace falta placa de video dedicada salvo para diseño, edición o juegos.',
      },
    ],
  },

  'mejores-celulares': {
    secciones: [
      {
        titulo: 'Cómo comparar celulares sin perderte en las fichas',
        parrafos: [
          'Las especificaciones de un celular abruman: megapíxeles, núcleos, hertz. En la práctica, lo que más se siente en el uso diario es la fluidez, la autonomía de la batería, la calidad de las fotos con poca luz y cuántos años de actualizaciones va a recibir. Estos puntos ordenan una decisión que de otra manera se vuelve confusa.',
        ],
      },
      {
        titulo: 'Memoria y almacenamiento',
        parrafos: [
          'Con 4 GB de RAM el teléfono anda justo; 6 a 8 GB dan margen. En almacenamiento, 128 GB es el mínimo cómodo porque fotos, videos y aplicaciones llenan rápido los 64 GB. Si el equipo no acepta tarjeta, pagá la versión con más espacio en vez de depender de la nube.',
        ],
      },
      {
        titulo: 'Batería y carga',
        parrafos: [
          'Una batería de 5.000 mAh o más alcanza para un día completo de uso intenso. La carga rápida importa tanto como la capacidad: revisá si el cargador viene en la caja, porque algunos fabricantes ya no lo incluyen.',
        ],
      },
      {
        titulo: 'Cámara, pantalla y soporte',
        parrafos: [
          'Más megapíxeles no significa mejores fotos: pesa más el sensor y el procesamiento. Una pantalla AMOLED se ve mejor que una LCD básica, y una tasa de 90 o 120 Hz se nota en el desplazamiento. Fijate también cuántos años de parches de seguridad promete el fabricante y que sea de venta oficial en el país.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Cuánto almacenamiento conviene en un celular?',
        a: 'Al menos 128 GB. Con 64 GB se llena rápido con fotos, videos y aplicaciones, salvo que uses mucho la nube.',
      },
      {
        q: '¿Importan los megapíxeles de la cámara?',
        a: 'Menos de lo que parece. La calidad depende del sensor, la apertura de la lente y el procesamiento de imagen.',
      },
      {
        q: '¿Conviene comprar un celular importado?',
        a: 'Es más seguro uno de venta oficial: garantía local y compatibilidad con las frecuencias de las operadoras argentinas.',
      },
    ],
  },

  'mejores-celulares-gama-alta': {
    secciones: [
      {
        titulo: 'Cuándo vale la pena un celular de gama alta',
        parrafos: [
          'Un equipo premium justifica su precio cuando lo vas a conservar muchos años, sacás fotos y video seguido o lo usás para trabajar. Si solo usás mensajería y redes, un gama media actual rinde casi igual. Antes de pagar de más, preguntate cuánto del equipo vas a aprovechar realmente.',
        ],
      },
      {
        titulo: 'Años de actualizaciones y valor de reventa',
        parrafos: [
          'Los fabricantes premium prometen varios años de actualizaciones, y ese es el mayor argumento de compra: el celular sigue seguro y vigente mucho más tiempo. Además conservan mejor el valor de reventa, algo que reduce el costo real de cambiar cada dos o tres años.',
        ],
      },
      {
        titulo: 'Cámara y pantalla',
        parrafos: [
          'La ventaja real está en el procesamiento de imagen, el video estabilizado y el rendimiento con poca luz. En pantalla, buscá paneles con tasa de refresco adaptable, que cuidan la batería, y buen brillo máximo para usarlo al sol.',
        ],
      },
      {
        titulo: 'Accesorios, garantía y seguro',
        parrafos: [
          'Sumá al presupuesto una funda y un vidrio templado, y evaluá un seguro contra robo o rotura, porque una reparación fuera de garantía es cara. Comprá siempre equipo de venta oficial para conservar la garantía en el país.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Vale la pena un celular de gama alta?',
        a: 'Si lo vas a conservar varios años y usás mucho la cámara o trabajás con él, sí. Para uso básico, un gama media actual alcanza.',
      },
      {
        q: '¿Cuántos años de actualizaciones dan?',
        a: 'Los modelos premium suelen prometer varios años de parches; verificá la cifra oficial de cada fabricante antes de comprar.',
      },
      {
        q: '¿Conviene pagar en cuotas?',
        a: 'Si son sin interés, sí. Si tienen recargo, compará el precio final contra el de contado antes de decidir.',
      },
    ],
  },

  'mejores-taladros': {
    secciones: [
      {
        titulo: 'Tipos de taladro y para qué sirve cada uno',
        parrafos: [
          'Un taladro percutor perfora hormigón y ladrillo; uno sin percusión atornilla y perfora madera y metal con más precisión. Elegir mal significa tardar el doble o dañar la herramienta. Definí primero qué materiales vas a trabajar y con qué frecuencia.',
        ],
      },
      {
        titulo: 'A batería o con cable',
        parrafos: [
          'El de cable entrega potencia constante y no tiene límite de uso; el de batería es mucho más cómodo para trabajar en altura o sin tomacorriente. En los de batería, mirá el voltaje (12 V para tareas livianas, 18 V o más para uso exigente) y los amperes-hora de la batería, que definen la autonomía.',
        ],
      },
      {
        titulo: 'Mandril, potencia y torque',
        parrafos: [
          'Un mandril de 13 mm admite mechas más grandes que uno de 10 mm. La potencia en vatios es útil en los de cable; en los inalámbricos importa el torque. La velocidad variable y el reversible son imprescindibles para atornillar sin pasarse.',
        ],
      },
      {
        titulo: 'Marca y repuestos',
        parrafos: [
          'Una marca con servicio técnico y baterías de repuesto disponibles en el país evita que el equipo quede inútil. Si pensás sumar herramientas, elegí un sistema donde la misma batería sirva para varias.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Taladro percutor o atornillador?',
        a: 'El percutor perfora hormigón y ladrillo; el atornillador es más liviano y preciso para tornillos y madera. Para uso hogareño completo, un percutor con velocidad variable cubre ambos.',
      },
      {
        q: '¿Qué voltaje de batería conviene?',
        a: 'Para el hogar, 18 V es un buen equilibrio. 12 V sirve para tareas livianas y 20 V o más para uso intensivo.',
      },
      {
        q: '¿Con cable o inalámbrico?',
        a: 'Cable si lo vas a usar mucho en un mismo lugar; inalámbrico por comodidad y movilidad, siempre con una segunda batería.',
      },
    ],
  },

  'mejores-amoladoras': {
    secciones: [
      {
        titulo: 'Qué hace una amoladora y cómo elegirla',
        parrafos: [
          'La amoladora angular corta, desbasta y pule metal, cerámica y hormigón con discos intercambiables. Es una de las herramientas más peligrosas si se elige mal o se usa sin protección, así que conviene entender qué diámetro y potencia necesitás antes de comprar.',
        ],
      },
      {
        titulo: 'Diámetro del disco',
        parrafos: [
          'La de 115 mm (4 1/2 pulgadas) es la más manejable, ideal para uso doméstico. La de 125 mm admite discos algo mayores. Las de 180 y 230 mm son para trabajo profesional, de corte profundo y mayor peso, y exigen más experiencia.',
        ],
      },
      {
        titulo: 'Potencia y velocidad',
        parrafos: [
          'Entre 700 y 900 W alcanza para el hogar; los modelos de 1.200 W o más están pensados para uso continuo. La velocidad variable es útil para pulir sin quemar el material. Un arranque suave reduce el golpe al encender.',
        ],
      },
      {
        titulo: 'Seguridad',
        parrafos: [
          'Elegí una con protector regulable y empuñadura lateral, y usá siempre anteojos, guantes y un disco acorde a la velocidad máxima del equipo. Nunca retires la guarda. Un disco gastado o equivocado es una causa frecuente de accidentes.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Qué tamaño de amoladora conviene para el hogar?',
        a: 'La de 115 o 125 mm con 700 a 900 W resuelve casi todo lo doméstico: cortar caños, desbastar soldaduras y pulir.',
      },
      {
        q: '¿Qué discos se usan?',
        a: 'De corte para metal o piedra, de desbaste para dar forma y de lijado o copa para pulir. No se mezclan: cada uno es para una tarea.',
      },
      {
        q: '¿Es peligrosa una amoladora?',
        a: 'Puede serlo. Con guarda, anteojos, guantes y un agarre firme con las dos manos el riesgo baja mucho.',
      },
    ],
  },

  'mejores-soldadoras': {
    secciones: [
      {
        titulo: 'Tipos de soldadora y qué cubre cada una',
        parrafos: [
          'Las soldadoras inverter con electrodo revestido son las más usadas en talleres y hogares: livianas, económicas y versátiles. La MIG o MAG necesita gas o alambre tubular y da cordones más prolijos en chapa fina. Elegir depende de qué vas a soldar y con qué espesor.',
        ],
      },
      {
        titulo: 'Inverter frente a transformador',
        parrafos: [
          'La inverter pesa mucho menos, consume menos y entrega un arco más estable, ideal para quien no tiene experiencia. La de transformador es más robusta y barata, pero pesada y con arco menos suave. Para uso ocasional, la inverter es la opción práctica.',
        ],
      },
      {
        titulo: 'Amperaje y ciclo de trabajo',
        parrafos: [
          'Con 160 a 200 amperes se trabajan electrodos de 2,5 y 3,25 mm, suficientes para estructuras comunes. El ciclo de trabajo indica cuántos minutos por cada diez puede soldar sin recalentarse: cuanto mayor, más continuo el uso posible.',
        ],
      },
      {
        titulo: 'Protección e instalación eléctrica',
        parrafos: [
          'Una máscara fotosensible, guantes, delantal de cuero y calzado cerrado son obligatorios. Verificá la instalación eléctrica: muchas soldadoras exigen una línea de capacidad suficiente para que no salten las térmicas.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Qué soldadora conviene para uso hogareño?',
        a: 'Una inverter de 160 a 200 A con electrodo revestido: liviana, fácil de usar y alcanza para rejas, estructuras y reparaciones.',
      },
      {
        q: '¿Qué es el ciclo de trabajo?',
        a: 'Es el porcentaje de tiempo que puede soldar sin recalentarse en un ciclo de diez minutos. Un 60 por ciento permite soldar seis minutos seguidos.',
      },
      {
        q: '¿Hace falta una instalación especial?',
        a: 'Depende de la potencia. Verificá que la línea eléctrica y la térmica soporten el consumo máximo del equipo.',
      },
    ],
  },

  'mejores-hidrolavadoras': {
    secciones: [
      {
        titulo: 'Qué mirar en una hidrolavadora',
        parrafos: [
          'Una hidrolavadora limpia autos, veredas, patios y fachadas con agua a presión, mucho más rápido que con balde y manguera. La presión y el caudal definen qué tan eficaz es, y la elección correcta evita dañar pintura o juntas.',
        ],
      },
      {
        titulo: 'Presión y caudal',
        parrafos: [
          'Para auto y tareas livianas alcanzan 100 a 130 bar; para patios, pisos y fachadas conviene de 150 bar en adelante. El caudal en litros por hora define el enjuague: más caudal limpia más rápido el mismo sector.',
        ],
      },
      {
        titulo: 'Motor y accesorios',
        parrafos: [
          'Los motores de inducción duran mucho más que los universales, aunque son más caros y pesados. Chequeá que traiga manguera larga, lanza regulable y depósito de detergente. Un buen filtro de entrada protege la bomba.',
        ],
      },
      {
        titulo: 'Cuidados y almacenamiento',
        parrafos: [
          'No dejes agua dentro de la bomba en invierno: congelada, puede dañarla. Evitá usar presión alta en pintura de autos o madera blanda. Guardala con el cable enrollado y en un sitio seco.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Cuántos bar necesito para lavar el auto?',
        a: 'Entre 100 y 130 bar son suficientes y no dañan la pintura. Más presión es para pisos y fachadas.',
      },
      {
        q: '¿Qué motor es mejor?',
        a: 'El de inducción: dura más y es más silencioso. El universal es más barato y liviano, ideal para uso esporádico.',
      },
      {
        q: '¿Se puede usar con agua de un balde?',
        a: 'Algunos modelos succionan de un balde o tanque; verificá que tenga esa función en la ficha del producto.',
      },
    ],
  },

  'mejores-termotanques': {
    secciones: [
      {
        titulo: 'Cómo elegir un termotanque',
        parrafos: [
          'El termotanque define cuánta agua caliente tenés y cuánto gas o electricidad gastás por mes. Un tanque chico se queda corto en una familia, y uno grande pierde calor en vano. Evaluá tipo de energía, capacidad y recuperación antes de comprar.',
        ],
      },
      {
        titulo: 'Gas, eléctrico o solar',
        parrafos: [
          'El termotanque a gas es el más usado y económico en consumo; el eléctrico no necesita instalación de gas pero su costo de uso es mayor y depende de la tarifa. El solar ahorra energía a largo plazo, aunque requiere una inversión inicial más alta y buena exposición.',
        ],
      },
      {
        titulo: 'Capacidad y recuperación',
        parrafos: [
          'Para dos personas, 50 a 60 litros; para cuatro, 80 a 100 litros. Fijate la recuperación, es decir cuántos litros calienta por hora: un tanque grande con recuperación lenta no resuelve duchas seguidas.',
        ],
      },
      {
        titulo: 'Seguridad e instalación',
        parrafos: [
          'La instalación a gas debe hacerla un gasista matriculado, con ventilación y conducto adecuados. Revisá el ánodo de magnesio cada año: protege el tanque de la corrosión y alarga su vida útil.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Qué capacidad de termotanque necesito?',
        a: 'Entre 50 y 60 litros para dos personas; 80 a 100 litros para una familia de cuatro.',
      },
      {
        q: '¿Gas o eléctrico?',
        a: 'El de gas suele costar menos de usar; el eléctrico se instala donde no hay gas y es más simple.',
      },
      {
        q: '¿Cada cuánto se revisa?',
        a: 'El ánodo de magnesio conviene controlarlo una vez al año, y el equipo completo ante cualquier ruido, pérdida o falta de agua caliente.',
      },
    ],
  },

  'mejores-aspiradoras': {
    secciones: [
      {
        titulo: 'Qué aspiradora conviene según tu casa',
        parrafos: [
          'La aspiradora ideal depende de tus pisos, de si tenés mascotas y del tamaño del lugar. Hay verticales inalámbricas, de trineo con cable, robots y de mano. Cada formato resuelve algo distinto y comprar el equivocado es el error más común.',
        ],
      },
      {
        titulo: 'Tipos y para quién sirve cada uno',
        parrafos: [
          'La vertical inalámbrica es práctica para limpieza diaria en departamentos. La de trineo con cable tiene más potencia y autonomía ilimitada, buena para casas grandes. El robot mantiene limpio el piso sin esfuerzo pero no reemplaza una limpieza profunda.',
        ],
      },
      {
        titulo: 'Potencia, filtro y bolsa',
        parrafos: [
          'La succión real importa más que los vatios de la ficha. Un filtro HEPA retiene alérgenos y es clave si hay personas con asma. Las de depósito evitan comprar bolsas; las de bolsa son más higiénicas al vaciar.',
        ],
      },
      {
        titulo: 'Mantenimiento y batería',
        parrafos: [
          'En las inalámbricas, la autonomía real baja con la máxima potencia. Verificá que la batería sea reemplazable y que los repuestos de cepillos y filtros se consigan en el país.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Aspiradora vertical o de trineo?',
        a: 'La vertical es cómoda para el día a día y espacios chicos; la de trineo tiene más potencia y no depende de batería.',
      },
      {
        q: '¿Sirve un robot aspirador?',
        a: 'Sí para mantenimiento diario de pisos lisos y alfombras bajas, aunque no reemplaza la limpieza profunda.',
      },
      {
        q: '¿Qué es un filtro HEPA?',
        a: 'Un filtro que retiene partículas muy finas como polvo y polen. Es muy útil con alergias o mascotas.',
      },
    ],
  },

  'mejores-cocinas-y-hornos': {
    secciones: [
      {
        titulo: 'Cómo elegir una cocina o un horno',
        parrafos: [
          'Una cocina se usa todos los días y dura décadas, por eso conviene mirar construcción y seguridad además del precio. Definí el ancho que tenés, la cantidad de hornallas y si el horno es a gas o eléctrico.',
        ],
      },
      {
        titulo: 'Medidas y hornallas',
        parrafos: [
          'Las cocinas más habituales miden 55 o 60 cm de ancho; medí el hueco antes de comprar. Cuatro hornallas alcanzan para una familia; seis para cocinar mucho. Las hornallas de distinto tamaño aprovechan mejor ollas grandes y chicas.',
        ],
      },
      {
        titulo: 'Horno: capacidad y seguridad',
        parrafos: [
          'Un horno de 50 a 70 litros cubre la mayoría de las recetas. Verificá que tenga válvula de seguridad en el horno y las hornallas, que corta el gas si se apaga la llama. El vidrio doble o triple en la puerta mantiene el exterior más fresco.',
        ],
      },
      {
        titulo: 'Materiales y limpieza',
        parrafos: [
          'El acero inoxidable resiste más golpes y manchas que el esmaltado. Un horno con autolimpieza o paredes catalíticas reduce el esfuerzo. Elegí parrillas desmontables para limpiar mejor.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Cuántas hornallas conviene?',
        a: 'Cuatro para la mayoría de las familias; seis si cocinás en grandes cantidades o tenés espacio.',
      },
      {
        q: '¿Qué ancho de cocina compro?',
        a: 'Medí el hueco: las medidas más habituales son 55 y 60 cm de ancho.',
      },
      {
        q: '¿Qué es la válvula de seguridad?',
        a: 'Un dispositivo que corta el paso del gas si la llama se apaga sola. Es imprescindible en el horno y en las hornallas.',
      },
    ],
  },

  'mejores-microondas': {
    secciones: [
      {
        titulo: 'Cómo elegir un microondas',
        parrafos: [
          'El microondas recalienta, descongela y cocina rápido con poco consumo. La capacidad y las funciones extra, como grill o convección, hacen la diferencia entre un uso básico y reemplazar el horno en tareas simples.',
        ],
      },
      {
        titulo: 'Capacidad y tamaño',
        parrafos: [
          'Para una o dos personas, 20 litros bastan; para una familia, 25 a 30 litros permiten platos grandes. Medí el espacio disponible y dejá margen para ventilación.',
        ],
      },
      {
        titulo: 'Potencia y funciones',
        parrafos: [
          'De 700 a 900 W es lo normal. El grill dora la superficie y la convección convierte al microondas en un horno chico. Los programas automáticos y el plato giratorio extraíble facilitan el uso y la limpieza.',
        ],
      },
      {
        titulo: 'Uso seguro',
        parrafos: [
          'Usá recipientes aptos para microondas, sin metal ni papel de aluminio. Tapá los alimentos para evitar salpicaduras y no lo uses vacío.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Qué capacidad de microondas necesito?',
        a: 'Entre 20 y 25 litros para una o dos personas; 25 a 30 litros para familia.',
      },
      {
        q: '¿Vale la pena el grill?',
        a: 'Sí si querés gratinar o dorar; un microondas básico solo calienta y descongela.',
      },
      {
        q: '¿Qué recipientes sirven?',
        a: 'Vidrio, cerámica y plásticos aptos para microondas. Nunca metal.',
      },
    ],
  },

  'mejores-cafeteras': {
    secciones: [
      {
        titulo: 'Qué tipo de cafetera te conviene',
        parrafos: [
          'El café de cada día depende del equipo y del hábito. Hay cafeteras de filtro, de cápsulas, express y automáticas con molinillo. Elegí según cuántas tazas tomás, cuánto tiempo querés dedicarle y qué tipo de café preferís.',
        ],
      },
      {
        titulo: 'Filtro, cápsulas o express',
        parrafos: [
          'La de filtro prepara varias tazas de café suave y es económica de usar. Las de cápsulas son rápidas y limpias, pero cada taza cuesta más. Las express dan café intenso con crema y permiten capuchinos, aunque piden más práctica.',
        ],
      },
      {
        titulo: 'Presión y funciones',
        parrafos: [
          'En express, 15 bar es lo habitual. Un vaporizador permite espumar leche. Programación, apagado automático y depósito extraíble son comodidades que se usan a diario.',
        ],
      },
      {
        titulo: 'Mantenimiento',
        parrafos: [
          'Descalcificá periódicamente según la dureza del agua y limpiá los filtros. El mantenimiento regular alarga la vida útil y mejora el sabor.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Cafetera de filtro o de cápsulas?',
        a: 'Filtro para varias tazas a bajo costo; cápsulas para rapidez y practicidad aunque cada taza sale más cara.',
      },
      {
        q: '¿Cuántos bar necesita una express?',
        a: 'Alrededor de 15 bar es el estándar para obtener crema y buena extracción.',
      },
      {
        q: '¿Cada cuánto se descalcifica?',
        a: 'Depende del agua y del uso; en general cada uno a tres meses.',
      },
    ],
  },

  'mejores-batidoras': {
    secciones: [
      {
        titulo: 'Batidora de mano o de pie',
        parrafos: [
          'La batidora de mano es compacta y barata, ideal para claras, cremas y purés. La de pie con bowl libera las manos y amasa masas pesadas. Cuánto cocinás y qué hacés define cuál conviene.',
        ],
      },
      {
        titulo: 'Potencia y velocidades',
        parrafos: [
          'Para repostería ocasional, 300 a 500 W alcanza; para amasar pan con regularidad, buscá más potencia y motor robusto. Varias velocidades y turbo dan control sobre la textura.',
        ],
      },
      {
        titulo: 'Accesorios incluidos',
        parrafos: [
          'Los batidores, ganchos de amasar y bowl de acero inoxidable determinan el rendimiento. Un bowl grande permite hacer más cantidad. Los accesorios aptos lavavajillas ahorran tiempo.',
        ],
      },
      {
        titulo: 'Uso y cuidado',
        parrafos: [
          'No fuerces el motor con masas demasiado densas ni superes el tiempo de uso continuo recomendado. Un motor que se recalienta pierde vida útil.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Batidora de mano o de pie?',
        a: 'De mano para uso ocasional; de pie si hacés repostería o pan con frecuencia.',
      },
      {
        q: '¿Cuántos watts necesito?',
        a: 'De 300 a 500 W para tareas comunes; más para amasar a menudo.',
      },
      {
        q: '¿Sirve para amasar?',
        a: 'Solo si trae ganchos de amasar y potencia suficiente; las livianas se recalientan con masas densas.',
      },
    ],
  },

  'mejores-monitores': {
    secciones: [
      {
        titulo: 'Cómo elegir un monitor',
        parrafos: [
          'El monitor es lo que más mirás en un escritorio, y se nota en la vista y la productividad. Tamaño, resolución y tipo de panel pesan más que la marca. Elegí según el uso: oficina, diseño o entretenimiento.',
        ],
      },
      {
        titulo: 'Tamaño y resolución',
        parrafos: [
          'De 24 pulgadas en Full HD es lo cómodo para oficina; en 27 pulgadas conviene QHD para que el texto se vea nítido. 4K sirve para diseño y edición pero exige una computadora que lo mueva.',
        ],
      },
      {
        titulo: 'Tipo de panel',
        parrafos: [
          'IPS ofrece mejores colores y ángulos de visión, ideal para trabajo y diseño. VA da más contraste a buen precio. TN es veloz pero con colores más pobres. Elegí IPS si vas a pasar muchas horas.',
        ],
      },
      {
        titulo: 'Conexiones y ergonomía',
        parrafos: [
          'Verificá que tenga HDMI o DisplayPort según tu equipo. Un pie regulable en altura e inclinación cuida la postura. Las funciones de luz azul reducida ayudan en jornadas largas.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Qué tamaño de monitor conviene para trabajar?',
        a: 'De 24 a 27 pulgadas. Con 27 conviene resolución QHD para mejor nitidez.',
      },
      {
        q: '¿IPS o VA?',
        a: 'IPS para colores y ángulos; VA para más contraste a menor precio.',
      },
      {
        q: '¿Hace falta 4K?',
        a: 'Solo para diseño, edición o si querés mucho espacio de trabajo; para oficina Full HD o QHD alcanza.',
      },
    ],
  },

  'mejores-monitores-gamer': {
    secciones: [
      {
        titulo: 'Qué importa en un monitor para jugar',
        parrafos: [
          'En juegos importa menos la resolución máxima y más la fluidez: tasa de refresco, tiempo de respuesta y sincronización. Un monitor de 144 Hz con una placa de video que lo aproveche se siente muy distinto a uno de 60 Hz.',
        ],
      },
      {
        titulo: 'Tasa de refresco',
        parrafos: [
          '144 Hz es el punto dulce para la mayoría; 165 a 240 Hz sirven para shooters competitivos. Tu placa tiene que poder entregar esos cuadros por segundo, o no los vas a aprovechar.',
        ],
      },
      {
        titulo: 'Tiempo de respuesta y sincronización',
        parrafos: [
          'Un tiempo de respuesta de 1 a 4 ms reduce las estelas. FreeSync o G-Sync eliminan el desgarro de imagen, y suelen ser compatibles entre sí en muchos modelos. Verificá la compatibilidad con tu placa.',
        ],
      },
      {
        titulo: 'Panel, tamaño y curvatura',
        parrafos: [
          'Los paneles IPS rápidos combinan color y velocidad. Los VA curvos dan inmersión en 27 pulgadas o más. Para espacios chicos, 24 a 27 pulgadas es lo más cómodo.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Cuántos Hz necesito?',
        a: '144 Hz es suficiente para casi todos; 240 Hz solo si jugás competitivo y tu equipo lo mueve.',
      },
      {
        q: '¿Qué es FreeSync?',
        a: 'Una tecnología que sincroniza la imagen con la placa de video para evitar cortes. G-Sync cumple la misma función.',
      },
      {
        q: '¿Conviene curvo?',
        a: 'Es cuestión de gusto; da inmersión en tamaños grandes, pero en 24 pulgadas casi no se nota.',
      },
    ],
  },

  'mejores-tablets': {
    secciones: [
      {
        titulo: 'Para qué querés una tablet',
        parrafos: [
          'Una tablet sirve para ver series, leer, estudiar, dibujar o como segunda pantalla. El error común es comprar una de gama alta para solo mirar videos, o una muy básica para trabajar. Definí el uso primero.',
        ],
      },
      {
        titulo: 'Pantalla y tamaño',
        parrafos: [
          'Entre 10 y 11 pulgadas es lo más versátil; 8 pulgadas es más portable para lectura. Una pantalla con buena resolución y brillo se disfruta mucho más. Las de panel IPS u OLED se ven mejor que las LCD básicas.',
        ],
      },
      {
        titulo: 'Rendimiento y almacenamiento',
        parrafos: [
          '4 GB de RAM alcanza para uso básico; 6 u 8 GB sirven para multitarea y dibujo. En almacenamiento, 64 GB queda corto; 128 GB es lo cómodo, y una ranura para tarjeta ayuda.',
        ],
      },
      {
        titulo: 'Accesorios y software',
        parrafos: [
          'Funda, teclado y lápiz se compran aparte y suman al costo real. Fijate cuántos años de actualizaciones ofrece el fabricante y la disponibilidad de aplicaciones para tu sistema.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Qué tablet sirve para estudiar?',
        a: 'Una de 10 pulgadas, con 4 a 6 GB de RAM, 128 GB y compatibilidad con teclado y lápiz.',
      },
      {
        q: '¿Reemplaza a una notebook?',
        a: 'Para consumo y tareas livianas sí; para trabajo pesado o programas específicos no.',
      },
      {
        q: '¿Conviene con SIM?',
        a: 'Solo si querés usarla en la calle sin Wi-Fi; si no, la versión Wi-Fi es más barata.',
      },
    ],
  },

  'mejores-smartwatch': {
    secciones: [
      {
        titulo: 'Qué esperar de un smartwatch',
        parrafos: [
          'Un smartwatch muestra notificaciones, mide actividad física y sueño, y en algunos casos permite pagar o atender llamadas. Es útil si te interesa el seguimiento deportivo; si solo querés la hora, un reloj común alcanza.',
        ],
      },
      {
        titulo: 'Compatibilidad con tu celular',
        parrafos: [
          'Algunos funcionan mejor con Android y otros con iPhone, y ciertas funciones solo están disponibles con determinadas marcas. Verificá la compatibilidad antes de comprar para no perder funciones clave.',
        ],
      },
      {
        titulo: 'Sensores y batería',
        parrafos: [
          'Frecuencia cardíaca, oxígeno en sangre y GPS son los más útiles. El GPS integrado permite salir a correr sin llevar el celular. La batería va de un día en modelos con pantalla brillante a varias semanas en pulseras simples.',
        ],
      },
      {
        titulo: 'Resistencia y pantalla',
        parrafos: [
          'Revisá la resistencia al agua si vas a nadar. Una pantalla AMOLED se ve mejor al sol. Las correas intercambiables permiten adaptar el reloj a uso deportivo o elegante.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Smartwatch o pulsera de actividad?',
        a: 'La pulsera es más barata y dura más batería; el smartwatch ofrece más funciones y apps.',
      },
      {
        q: '¿Sirve con cualquier celular?',
        a: 'Depende del modelo; algunos funcionan con ambos sistemas y otros solo con uno. Verificalo.',
      },
      {
        q: '¿Cuánto dura la batería?',
        a: 'Entre uno y varios días según el modelo y el uso del GPS y la pantalla.',
      },
    ],
  },

  'mejores-planchitas-y-secadores-de-pelo': {
    secciones: [
      {
        titulo: 'Cómo elegir según tu tipo de cabello',
        parrafos: [
          'El secador y la planchita pueden dañar el cabello si se eligen mal o se usan sin protección. La temperatura regulable y el material de las placas son lo más importante para cuidar la fibra capilar.',
        ],
      },
      {
        titulo: 'Planchitas: placas y temperatura',
        parrafos: [
          'Las placas de cerámica o turmalina reparten el calor parejo; las de titanio calientan más rápido, para cabello grueso. Con temperatura regulable podés bajar el calor en cabello fino o teñido.',
        ],
      },
      {
        titulo: 'Secadores: potencia y accesorios',
        parrafos: [
          'Entre 1.800 y 2.200 W seca rápido. La tecnología iónica reduce el frizz. Los concentradores y difusores permiten peinar y dar volumen. Verificá que tenga varias velocidades y un botón de aire frío.',
        ],
      },
      {
        titulo: 'Cuidado del cabello',
        parrafos: [
          'Usá siempre protector térmico y no pases la planchita muchas veces por el mismo mechón. Dejá descansar el cabello entre usos.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Qué planchita es mejor, cerámica o titanio?',
        a: 'Cerámica o turmalina son más suaves; titanio calienta más fuerte, para cabello grueso o rebelde.',
      },
      {
        q: '¿Cuántos watts debe tener un secador?',
        a: 'De 1.800 a 2.200 W seca rápido sin ser excesivo.',
      },
      {
        q: '¿Qué temperatura usar?',
        a: 'Menos de 180 grados para cabello fino o teñido; hasta 200 en cabello grueso.',
      },
    ],
  },

  'mejores-colchones-2-plazas': {
    secciones: [
      {
        titulo: 'Colchón de 2 plazas: lo que conviene saber',
        parrafos: [
          'Una cama de 2 plazas mide habitualmente 140 cm de ancho, y compartirla exige un colchón que no transmita el movimiento de uno al otro. Más que el precio, importa el soporte, la firmeza y el espacio real por persona.',
        ],
      },
      {
        titulo: 'Medidas y alternativas',
        parrafos: [
          'Con 140 cm, cada persona dispone de 70 cm, menos que una cama individual. Si tenés lugar, un colchón queen de 160 cm da más comodidad. Medí siempre la cama y el ingreso a la habitación.',
        ],
      },
      {
        titulo: 'Resortes embolsados y espuma',
        parrafos: [
          'Los resortes embolsados aíslan el movimiento entre las dos personas. La espuma de alta densidad también absorbe bien los movimientos y es silenciosa. En resortes tradicionales, el movimiento se transmite más.',
        ],
      },
      {
        titulo: 'Firmeza y garantía',
        parrafos: [
          'Si hay diferencias de peso entre ambos, un colchón de firmeza media funciona para los dos. Revisá la garantía y las condiciones de prueba.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Cuánto mide un colchón de 2 plazas?',
        a: 'Habitualmente 140 cm de ancho por 190 cm de largo; revisá la ficha de cada modelo.',
      },
      {
        q: '¿Conviene queen en lugar de 2 plazas?',
        a: 'Si el espacio lo permite, sí: 160 cm ofrecen más comodidad para dos.',
      },
      {
        q: '¿Qué firmeza elegir para dos?',
        a: 'Una media suele servir para dos personas con distintas preferencias.',
      },
    ],
  },

  'mejores-sommiers': {
    secciones: [
      {
        titulo: 'Qué es un sommier y cuándo conviene',
        parrafos: [
          'Un sommier es el conjunto de colchón y base, pensado para trabajar juntos. Mantiene la altura, la firmeza y la ventilación sin necesidad de armar una cama aparte. Conviene si querés resolver todo en una sola compra.',
        ],
      },
      {
        titulo: 'Base: madera o metal',
        parrafos: [
          'La base de madera es más estable y silenciosa; la de metal es más liviana. Las bases con cajones aprovechan el espacio de guardado. Revisá que tenga patas firmes y buena separación para ventilar el colchón.',
        ],
      },
      {
        titulo: 'Colchón del sommier',
        parrafos: [
          'Aplican los mismos criterios que a un colchón individual: densidad de espuma o tipo de resortes, firmeza y garantía. Comprobá que el conjunto se venda junto y qué incluye.',
        ],
      },
      {
        titulo: 'Medidas y traslado',
        parrafos: [
          'Medí puertas y escaleras para que el conjunto entre. Algunos modelos se envían en cajas separadas; otros requieren flete especial.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Qué incluye un sommier?',
        a: 'En general colchón y base; algunos suman cabecera o almohadas. Verificá la ficha.',
      },
      {
        q: '¿Sommier o colchón con cama?',
        a: 'El sommier simplifica la compra y garantiza compatibilidad; una cama permite más variedad de estilos.',
      },
      {
        q: '¿Cada cuánto se cambia?',
        a: 'Entre 8 y 10 años, o antes si el colchón se hunde.',
      },
    ],
  },

  'mejores-neumaticos': {
    secciones: [
      {
        titulo: 'Cómo elegir neumáticos',
        parrafos: [
          'Los neumáticos son lo único que une el auto con el piso. Una buena elección mejora frenado, agarre en mojado y consumo. Mirá medida, tipo de uso y fecha de fabricación antes del precio.',
        ],
      },
      {
        titulo: 'Medida y especificaciones',
        parrafos: [
          'La medida está en el lateral con formato ancho, perfil y rodado. Respetá siempre la que indica el fabricante del auto. El índice de carga y el de velocidad también deben ser iguales o mayores al original.',
        ],
      },
      {
        titulo: 'Tipo de uso',
        parrafos: [
          'Para ciudad conviene confort y durabilidad; para ruta, buen agarre y estabilidad. Los de uso mixto en camionetas se adaptan a camino de tierra. Evaluá el desgaste y el comportamiento en mojado.',
        ],
      },
      {
        titulo: 'Fecha de fabricación',
        parrafos: [
          'El código DOT indica semana y año de fabricación. Evitá comprar neumáticos con varios años de antigüedad aunque estén sin uso. Sumá alineación y balanceo al presupuesto.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Cómo sé qué medida necesito?',
        a: 'Está impresa en el lateral del neumático actual y en el manual del vehículo.',
      },
      {
        q: '¿Cuándo cambiar los neumáticos?',
        a: 'Cuando el dibujo llega al indicador de desgaste o tienen grietas, o tras varios años aunque se vean bien.',
      },
      {
        q: '¿Qué es el código DOT?',
        a: 'Una numeración en el lateral cuyos últimos cuatro dígitos indican semana y año de fabricación.',
      },
    ],
  },
}
