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
}
