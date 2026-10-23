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
        a: 'Cambian varias veces por semana y suben en temporada alta. Revisamos a mano las ofertas de Mercado Libre y guardamos el precio más bajo registrado de cada modelo para que compares.',
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
      {
        q: '¿Cuál es el mejor aire split inverter en Argentina en 2026?',
        a: 'No hay uno solo: depende de los m² del ambiente y del uso. Para un dormitorio o living chico alcanza uno de 2.250 a 3.000 frigorías; para ambientes grandes o con mucho sol, 4.500 o más. Entre los modelos comparables elegí el inverter con mejor eficiencia energética (etiqueta A) y revisá en esta página el precio más bajo que registramos antes de pagar.',
      },
      {
        q: '¿Cuánto sale un aire acondicionado en Argentina?',
        a: 'El precio varía mucho según frigorías, marca y si es inverter o frío/calor, y cambia seguido en Mercado Libre. Por eso mostramos el precio de hoy junto al más bajo que registramos: si el de hoy está cerca del mínimo, es un buen momento; si está muy arriba, conviene esperar o poner una alerta.',
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
      {
        q: '¿Cuánto sale un colchón queen en Argentina?',
        a: 'Depende de la densidad de la espuma o de si es de resortes, del grosor y de la marca. Un queen de espuma de alta densidad suele ser más barato que uno de resortes con pillow top. Compará el precio de hoy con el más bajo que registramos antes de comprar: en colchones los descuentos del evento suelen ser sobre listas infladas.',
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
      {
        q: '¿Qué freidora de aire tiene mejor relación calidad precio?',
        a: 'La que tenga la capacidad justa para tu familia (3 a 4 litros para 1-2 personas, 5 a 7 para una familia), potencia de 1.400 W o más y cesta antiadherente desmontable. Las más baratas funcionan, pero suelen tener menos control de temperatura y más ruido; comparalas contra el precio mínimo que registramos.',
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
      {
        q: '¿Cuánto sale un smart TV de 55 pulgadas en Argentina?',
        a: 'El precio de un 55" cambia según la tecnología (LED, QLED, OLED) y la marca, y varía seguido en Mercado Libre. Mirá el precio de hoy contra el mínimo que registramos para saber si el descuento es real, y comparalo también con el de 50" y el de 65" de la misma línea.',
      },
      {
        q: '¿Qué tamaño de smart TV conviene según la distancia?',
        a: 'Una regla práctica: dividí la distancia al sillón en centímetros por 2,5 y obtenés las pulgadas aproximadas. A unos 2,5 m queda bien uno de 55"; a 3 m o más, de 65" en adelante.',
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
      {
        q: '¿Cuánto sale una notebook en Argentina hoy?',
        a: 'Depende del procesador, la memoria RAM y el almacenamiento. Para estudio y oficina alcanza con 8 GB de RAM y un SSD; para trabajo pesado o edición conviene 16 GB o más. En esta página ves el precio de hoy de cada modelo comparado con el más bajo que registramos, y la comisión no cambia lo que pagás.',
      },
      {
        q: '¿Qué notebook conviene para estudiar o trabajar?',
        a: 'Priorizá SSD (no disco rígido) y al menos 8 GB de RAM; después pantalla, peso y batería según si la llevás encima. Un procesador de gama media actual rinde de sobra para estudio, oficina y videollamadas.',
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
  // --- Comparativas estacionales (Cyber Monday, Black Friday, Madre, Navidad) ---
  // Fechas: solo las que están en lib/cybermonday.ts (Cyber 2 al 4/11, Black
  // Friday viernes 27/11) y lib/temporada.ts (Madre domingo 18/10).
  'regalos-dia-de-la-madre': {
    secciones: [
      {
        titulo: 'Cómo elegir un regalo que no falle',
        parrafos: [
          'El Día de la Madre cae el domingo 18 de octubre y casi todo el mundo compra en la última semana, que es justo cuando los envíos se cargan y las ofertas se vuelven más escasas. Por eso conviene decidir temprano: pensá qué le gusta a ella y no qué está de moda, fijate qué usa todos los días y qué se le rompió o se le quedó viejo, y recién después mirá precios. Un regalo útil y bien elegido le gana a uno caro que termina en un cajón.',
          'Si dudás entre dos opciones, elegí la que se pueda cambiar fácil: productos con envío Full y devolución simple te sacan del apuro si no era lo que esperabas.',
        ],
      },
      {
        titulo: 'Ofertas reales y plazos de entrega',
        parrafos: [
          'Antes de una fecha fuerte es común ver precios de referencia inflados. Para no caer, buscá el producto en la herramienta de precios del sitio (/precio) y compará el valor de hoy contra el mínimo que registramos; si el descuento es mayor al que tuvo históricamente, es sospechoso. También podés revisar /descuentos-inflados para ver cuáles dicen bajar y no bajaron.',
          'Sumá siempre la fecha de entrega que muestra la publicación: si la promesa pasa del sábado, no sirve aunque el precio sea bueno.',
        ],
      },
      {
        titulo: 'Cuotas, envío y presupuesto',
        parrafos: [
          'Armá un tope antes de empezar y respetalo: en la tabla podés filtrar por rangos de presupuesto. Fijate si las cuotas son realmente sin interés o si el precio ya las trae incluidas, y si el envío es gratis o se suma al final. Con la calculadora de cuotas del sitio (/calculadora-cuotas-sin-interes) comparás el costo real de pagar en una vez o en varias.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Hasta cuándo puedo comprar para llegar al domingo 18?',
        a: 'Lo más seguro es comprar con al menos una semana de margen. Mirá la fecha de entrega estimada de cada publicación: si el envío es Full suele ser más rápido y previsible.',
      },
      {
        q: '¿Cómo sé si el descuento es de verdad?',
        a: 'Comparando el precio actual contra el mínimo registrado del mismo producto. Si el producto ya estuvo más barato, el cartel de oferta no significa tanto.',
      },
      {
        q: '¿Qué regalo conviene si no sé qué elegir?',
        a: 'Algo de uso diario y fácil de cambiar: un electrodoméstico práctico o un producto de cuidado personal de una marca conocida, comprado en una tienda oficial o con devolución simple.',
      },
    ],
  },
  'ofertas-cyber-monday': {
    secciones: [
      {
        titulo: 'Cómo comprar en el Cyber Monday sin caer en descuentos inflados',
        parrafos: [
          'El Cyber Monday se hace del lunes 2 al miércoles 4 de noviembre y es la semana con más carteles de oferta del año. Eso no quiere decir que todo lo que dice bajar haya bajado: muchas tiendas suben el precio de lista unas semanas antes y después muestran un descuento enorme sobre ese número. La única forma de no equivocarte es comparar el precio de hoy contra el historial del mismo producto, no contra el "antes" que figura en la publicación.',
          'Si ya tenés en mente qué comprar, empezá a mirarlo hoy: cuanto más historial veas antes del evento, mejor vas a poder juzgar si el precio del lunes es bueno.',
        ],
      },
      {
        titulo: 'Las herramientas del sitio para verificar',
        parrafos: [
          'En /precio buscás un producto y ves su evolución y su mínimo registrado. En /descuentos-inflados listamos las ofertas cuyo precio de referencia no se sostiene. Con esas dos páginas armás una lista corta: producto, precio de hoy y mínimo histórico. Si el precio del evento no mejora ese mínimo, no hay apuro.',
        ],
      },
      {
        titulo: 'Cuotas, envío y cupones',
        parrafos: [
          'El precio final depende de cómo pagás. Confirmá si las cuotas son sin interés de verdad o si el valor ya las trae incorporadas, probá la calculadora de cuotas (/calculadora-cuotas-sin-interes) y mirá si el envío es gratis o se cobra aparte (/calculadora-envio-gratis ayuda a saber a partir de qué monto). Los cupones y reintegros bancarios suelen tener tope y fecha de acreditación: leé la letra chica.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Cuándo es el Cyber Monday 2026?',
        a: 'Del lunes 2 al miércoles 4 de noviembre, según las fechas que publica la CACE. Muchas tiendas estiran sus promociones durante toda la semana.',
      },
      {
        q: '¿Conviene esperar al Cyber Monday para comprar?',
        a: 'Depende del producto: si ya está en su mínimo registrado, no hace falta esperar. Si está caro respecto de su historial, tiene sentido aguardar al evento y comparar.',
      },
      {
        q: '¿Cómo detecto una oferta falsa?',
        a: 'Fijate si el precio "tachado" realmente existió. Con el historial de /precio ves cuánto costaba en las semanas previas y con /descuentos-inflados los casos más evidentes.',
      },
    ],
  },
  'cyber-monday-smart-tv': {
    secciones: [
      {
        titulo: 'Smart TV en el Cyber Monday: cómo juzgar el precio',
        parrafos: [
          'Los televisores son de lo más buscado del Cyber Monday (lunes 2 al miércoles 4 de noviembre) y también donde más se ven precios de referencia armados. Un mismo modelo puede aparecer con distintos descuentos según la publicación, y un equipo con "50% OFF" puede costar lo mismo que hace un mes. Antes de decidir, mirá el historial del modelo exacto: el nombre comercial no alcanza, hay que comparar la sigla completa porque marcas iguales tienen versiones distintas año tras año.',
          'Anotá hoy el valor de los dos o tres modelos que te interesan; el día del evento sabés al instante si hubo baja real.',
        ],
      },
      {
        titulo: 'Qué mirar en el televisor',
        parrafos: [
          'Tamaño en relación con la distancia al sillón, resolución, tipo de panel y sistema operativo (que tenga las apps que usás y siga recibiendo actualizaciones). Una pantalla más grande con menos calidad de panel rara vez conviene frente a una un poco más chica pero mejor. Sumá el costo de un soporte o de un mueble si no tenés donde apoyarlo.',
        ],
      },
      {
        titulo: 'Envío, garantía y cuotas',
        parrafos: [
          'Un televisor es frágil: priorizá envíos con seguimiento y revisá el producto al recibirlo, antes de firmar si es posible. Fijate que la garantía sea oficial en Argentina. Las cuotas sin interés ayudan en tickets altos, pero comparalas con el pago en una vez usando /calculadora-cuotas-sin-interes. Para verificar el descuento usá /precio y /descuentos-inflados.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Cuál es el mejor momento para comprar un smart TV?',
        a: 'Cuando el precio actual iguala o se acerca al mínimo registrado del modelo. Los eventos como el Cyber Monday (2 al 4 de noviembre) son una buena ocasión, pero no garantizan el mínimo.',
      },
      {
        q: '¿Qué tamaño de pantalla me conviene?',
        a: 'Depende de la distancia desde donde mirás. Como referencia general, a mayor distancia, más pulgadas; midiendo el espacio antes evitás comprar uno que no entra o se ve chico.',
      },
      {
        q: '¿Es importante que la garantía sea oficial?',
        a: 'Sí, en electrónica de ticket alto te simplifica los reclamos y el servicio técnico. Preferí tiendas oficiales o vendedores con buena reputación.',
      },
    ],
  },
  'cyber-monday-aires-acondicionados': {
    secciones: [
      {
        titulo: 'Aires acondicionados en el Cyber Monday',
        parrafos: [
          'Los aires se buscan mucho antes del verano y en el Cyber Monday (del lunes 2 al miércoles 4 de noviembre) aparecen promociones fuertes, pero la demanda de diciembre y enero hace que los precios casi nunca bajen después. Eso vuelve al evento una ventana razonable, siempre que verifiques que el descuento sea real. Comparar el modelo exacto contra su historial es clave: un split de la misma marca puede tener varias versiones con distinta eficiencia y distinta potencia.',
          'Acordate de que el precio del equipo no es todo: la instalación suele ser un costo aparte y puede cambiar bastante la cuenta final.',
        ],
      },
      {
        titulo: 'Potencia y tipo de equipo',
        parrafos: [
          'La potencia se mide en frigorías y depende del ambiente: metros cuadrados, orientación al sol, altura y cantidad de gente. Un equipo corto no llega a enfriar y uno de más gasta de sobra. Usá la calculadora de frigorías del sitio (/calculadora-frigorias) para tener una referencia. Elegí inverter si lo vas a usar muchas horas: consume menos y es más silencioso.',
        ],
      },
      {
        titulo: 'Instalación, consumo y garantía',
        parrafos: [
          'Consultá si el envío incluye instalación o si hay que contratarla aparte, y quién responde por la garantía si la hace un tercero. Mirá la etiqueta de eficiencia energética y estimá el gasto con /calculadora-consumo-electrico. Para validar que el descuento sea genuino, buscá el modelo en /precio y revisá /descuentos-inflados.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Conviene comprar el aire en el Cyber Monday?',
        a: 'Suele ser una buena ventana porque el verano empuja los precios hacia arriba después. Igual conviene comparar con el historial: si el precio no mejora su mínimo, podés esperar.',
      },
      {
        q: '¿Cuántas frigorías necesito?',
        a: 'Depende de los metros cuadrados, el sol y la cantidad de personas. La calculadora de frigorías del sitio te da un valor orientativo para el ambiente.',
      },
      {
        q: '¿Qué es un aire inverter?',
        a: 'Es un equipo que regula la velocidad del compresor en lugar de prenderse y apagarse. Consume menos y mantiene la temperatura más estable, a cambio de un precio inicial mayor.',
      },
    ],
  },
  'cyber-monday-notebooks': {
    secciones: [
      {
        titulo: 'Notebooks en el Cyber Monday: cuidado con las configuraciones',
        parrafos: [
          'En el Cyber Monday (lunes 2 al miércoles 4 de noviembre) las notebooks se publican con precios llamativos, pero el truco más frecuente no es el precio sino la configuración: dos equipos con el mismo nombre comercial pueden traer procesador, memoria y almacenamiento distintos, y el que parece más barato es el de peor especificación. Por eso conviene leer la ficha técnica completa y comparar equipos con componentes equivalentes antes de mirar el porcentaje de descuento.',
          'Definí primero para qué la vas a usar; eso te ahorra pagar de más por potencia que no necesitás.',
        ],
      },
      {
        titulo: 'Qué mirar en la ficha técnica',
        parrafos: [
          'Procesador y generación, memoria RAM (con posibilidad de ampliar), tipo de almacenamiento (SSD es lo que más se nota en el día a día), pantalla y batería. Para trabajar y estudiar alcanza con una configuración equilibrada; para diseño o juegos importa la placa de video. Fijate también el sistema operativo incluido.',
        ],
      },
      {
        titulo: 'Historial, cuotas y garantía',
        parrafos: [
          'Buscá el modelo exacto en /precio para ver cómo se movió en las últimas semanas y revisá /descuentos-inflados para descartar el "antes" armado. Para un ticket alto, comparalo en una cuota o en varias con /calculadora-cuotas-sin-interes y confirmá que la garantía sea oficial y que haya servicio técnico en el país.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Qué notebook conviene para estudiar o trabajar?',
        a: 'Una con SSD, memoria RAM suficiente para tus programas y buena batería. No hace falta un procesador de gama alta para tareas de oficina.',
      },
      {
        q: '¿Por qué dos notebooks con igual nombre cuestan distinto?',
        a: 'Porque suelen diferir en procesador, memoria, almacenamiento o pantalla. Leé la ficha técnica completa antes de comparar precios.',
      },
      {
        q: '¿Vale la pena esperar al Cyber Monday?',
        a: 'Si el modelo que querés está lejos de su mínimo registrado, sí puede valer la pena. Si ya está cerca, comprá sin esperar.',
      },
    ],
  },
  'cyber-monday-celulares': {
    secciones: [
      {
        titulo: 'Celulares en el Cyber Monday: precio y versión',
        parrafos: [
          'Entre el lunes 2 y el miércoles 4 de noviembre los celulares son de lo que más se mueve, y también de lo más fácil de confundir: el mismo modelo se vende en varias capacidades de almacenamiento y de memoria, a veces con variantes regionales, y el descuento anunciado puede referirse a la versión más cara. Antes de comprar, asegurate de estar mirando la misma versión en todas las publicaciones y de que el precio de referencia sea real.',
          'Un celular se usa todos los días durante años, así que más que el último modelo suele convenir el mejor equilibrio entre rendimiento, batería y soporte.',
        ],
      },
      {
        titulo: 'Qué comparar entre modelos',
        parrafos: [
          'Almacenamiento (que no se quede corto), memoria RAM, calidad de cámara, batería y velocidad de carga, y cuántos años de actualizaciones promete el fabricante. Si vas a guardar muchas fotos o videos, priorizá el almacenamiento antes que unos megapíxeles de más.',
        ],
      },
      {
        titulo: 'Compra segura',
        parrafos: [
          'Comprá a tiendas oficiales o vendedores con reputación alta, y confirmá que sea equipo nuevo, liberado y apto para las bandas del país. Verificá el descuento en /precio y /descuentos-inflados, y comparé cuotas y envío antes de pagar con /calculadora-cuotas-sin-interes y /calculadora-envio-gratis.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Cómo sé si un celular está en su mejor precio?',
        a: 'Compará el precio actual contra el mínimo registrado del mismo modelo y la misma capacidad en /precio. Si no lo supera, probablemente haya otra oportunidad.',
      },
      {
        q: '¿Qué almacenamiento conviene elegir?',
        a: 'Pensá en fotos, videos y apps. Un almacenamiento ajustado se nota rápido y no suele poder ampliarse, así que mejor ir un escalón arriba si el presupuesto lo permite.',
      },
      {
        q: '¿Hay que desconfiar de los celulares muy baratos?',
        a: 'Sí, cuando el precio es mucho menor que en otras publicaciones del mismo modelo. Revisá reputación del vendedor, que sea equipo nuevo y la garantía.',
      },
    ],
  },
  'cyber-monday-lavarropas': {
    secciones: [
      {
        titulo: 'Lavarropas en el Cyber Monday',
        parrafos: [
          'Un lavarropas es una compra de varios años, y el Cyber Monday (del lunes 2 al miércoles 4 de noviembre) puede ser un buen momento para hacerla porque las marcas grandes suelen sumar cuotas y envío sin cargo. Eso no impide que algunos modelos aparezcan con un descuento sobre un precio de lista que nunca se pagó. Lo mejor es decidir primero qué tipo y capacidad necesitás y después comparar el historial de las opciones que cumplen, en lugar de dejarte llevar por el mayor porcentaje.',
          'Medí el espacio y el acceso, porque un lavarropas que no entra por la puerta o por el pasillo es el peor negocio posible.',
        ],
      },
      {
        titulo: 'Carga, capacidad y consumo',
        parrafos: [
          'La carga frontal lava mejor y gasta menos agua; la superior ocupa menos lugar y es más rápida. La capacidad en kilos tiene que acompañar a cuántas personas viven en la casa: de 6 a 8 kg alcanza para una familia chica, más si lavás acolchados. Fijate la etiqueta de eficiencia energética y de agua, que impacta en las facturas durante toda la vida del equipo.',
        ],
      },
      {
        titulo: 'Entrega, instalación y garantía',
        parrafos: [
          'Consultá si el envío llega hasta el interior de la casa y si incluye retirar el equipo viejo. Pedí garantía oficial y averiguá si hay servicio técnico cerca. Para confirmar la baja usá /precio y /descuentos-inflados, y compará pagos con /calculadora-cuotas-sin-interes.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Carga frontal o superior?',
        a: 'La frontal es más eficiente en agua y energía y trata mejor la ropa; la superior es más compacta y rápida. Elegí según el espacio y tus hábitos.',
      },
      {
        q: '¿Cuántos kilos necesito?',
        a: 'Para una o dos personas alcanza con 6 kg; para una familia, 8 kg o más. Si lavás ropa de cama grande seguido, ir un escalón arriba te conviene.',
      },
      {
        q: '¿Conviene comprarlo en cuotas?',
        a: 'Si las cuotas son realmente sin interés, ayuda a no desembolsar todo junto. Verificá que el precio en cuotas no sea más alto que el de contado.',
      },
    ],
  },
  'mejores-auriculares': {
    titulo: 'Mejores auriculares en oferta 2026',
    secciones: [
      {
        titulo: 'Qué tipo de auricular te conviene',
        parrafos: [
          'In-ear (los que van dentro del oído, con estuche de carga): son los más chicos y los más vendidos. Sirven para la calle, el gimnasio y las llamadas. Si vas a entrenar, buscá resistencia al agua y al sudor (IPX4 o más).',
          'Vincha (on-ear u over-ear): los on-ear apoyan sobre la oreja y son livianos; los over-ear la envuelven, aíslan más y suelen ser más cómodos en sesiones largas. Son los mejores para viajar, estudiar o trabajar muchas horas.',
          'Open ear (de gancho o clip): dejan el oído libre y te permiten escuchar el tránsito. Son una buena opción para correr o andar en bici por la calle, a cambio de menos graves y de que el sonido se escapa a todo volumen.',
          'Gamer: vincha con micrófono de brazo. Para consola fijate si conectan por USB, por 2.4 GHz con su propio receptor o solo por Bluetooth, que en la PS5 no funciona para audio sin un adaptador.',
        ],
      },
      {
        titulo: 'Cancelación de ruido, autonomía y multipunto',
        parrafos: [
          'La cancelación activa de ruido (ANC) usa micrófonos para restar el ruido de afuera. Funciona muy bien con ruidos graves y constantes (el motor del colectivo, el aire acondicionado, el avión) y peor con voces. Vale la pena si viajás en transporte o trabajás en un lugar ruidoso.',
          'La autonomía que dice la publicación suele medirse con el ANC apagado: con la cancelación prendida, la batería dura menos. En los in-ear, mirá también cuántas cargas extra da el estuche.',
          'Multipunto quiere decir que el auricular queda conectado a dos equipos a la vez (por ejemplo, el celular y la notebook) y pasa de uno a otro solo. Es muy útil para trabajar.',
        ],
      },
      {
        titulo: 'Originales y reacondicionados',
        parrafos: [
          'En auriculares de marca circulan muchas copias: un AirPods o un Galaxy Buds muy por debajo del precio de la tienda oficial casi nunca es original. Las publicaciones que dicen "para iPhone" o "compatibles" sin marca suelen ser genéricos.',
          'Esta tabla deja afuera los reacondicionados: recomendamos auriculares nuevos, con garantía y la batería sin uso. Antes de pagar, compará el precio de hoy con el más bajo que registramos.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Qué auriculares conviene comprar?',
        a: 'Para la calle y el gimnasio, unos in-ear con resistencia al agua; para viajar o trabajar muchas horas, una vincha over-ear, mejor con cancelación de ruido; para correr por la calle, unos open ear que dejen escuchar el tránsito.',
      },
      {
        q: '¿Vale la pena la cancelación de ruido?',
        a: 'Si viajás en colectivo, subte o avión, o trabajás con ruido de fondo, sí. Para escuchar música en casa en silencio, no hace falta pagarla.',
      },
      {
        q: '¿Los auriculares Bluetooth sirven para la PS5?',
        a: 'La PS5 no saca audio por Bluetooth sin un adaptador. Para jugar, conviene un auricular con cable, por USB o con receptor inalámbrico propio de 2.4 GHz.',
      },
    ],
  },
  'cyber-monday-auriculares': {
    secciones: [
      {
        titulo: 'Auriculares en el Cyber Monday: marcas y copias',
        parrafos: [
          'Los auriculares son una compra de impulso en el Cyber Monday (lunes 2 al miércoles 4 de noviembre), y es justo ahí donde más se ven imitaciones y precios que parecen un regalo. Una marca conocida a un valor muy inferior al resto de las publicaciones casi siempre esconde un producto no original o un vendedor sin respaldo. Antes de comprar, comparalo contra el precio de la tienda oficial y contra el historial del modelo para entender cuánto de la baja es real.',
          'Pensá también para qué los vas a usar: lo que sirve para ir al gimnasio no es lo mejor para trabajar ocho horas.',
        ],
      },
      {
        titulo: 'Tipo, sonido y comodidad',
        parrafos: [
          'In-ear, on-ear u over-ear: los primeros son livianos y portátiles, los últimos suelen ser más cómodos en uso largo. La cancelación de ruido activa vale la pena si viajás o hacés ruido de fondo. Mirá la autonomía de batería, si el estuche carga por USB-C y si tienen micrófono decente para llamadas.',
        ],
      },
      {
        titulo: 'Verificar antes de pagar',
        parrafos: [
          'Buscá el modelo en /precio y revisá /descuentos-inflados para ver si la oferta se sostiene. Priorizá tiendas oficiales o vendedores con reputación verde, y fijate la política de devolución: en un producto que se prueba puesto, poder cambiarlo es muy valioso. Compará envío y cuotas con /calculadora-envio-gratis.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Cómo reconozco unos auriculares falsos?',
        a: 'Sospechá cuando el precio es muy inferior al de la tienda oficial, cuando el vendedor no tiene reputación y cuando las fotos son genéricas. Comprar en tiendas oficiales reduce el riesgo.',
      },
      {
        q: '¿Vale la pena la cancelación de ruido?',
        a: 'Si viajás, usás transporte o trabajás en ambientes ruidosos, sí. Para escuchar música en casa puede no justificar la diferencia de precio.',
      },
      {
        q: '¿Inalámbricos o con cable?',
        a: 'Los inalámbricos son más cómodos pero dependen de la batería; los de cable no se quedan sin carga y suelen dar mejor sonido por el mismo valor.',
      },
    ],
  },
  'cyber-monday-cafeteras': {
    secciones: [
      {
        titulo: 'Cafeteras en el Cyber Monday: qué conviene mirar',
        parrafos: [
          'Las cafeteras son un clásico del Cyber Monday (lunes 2 al miércoles 4 de noviembre) y un regalo fácil. El riesgo es el mismo de siempre: un "antes" inflado semanas atrás para que el porcentaje de descuento se vea más grande. Comparalo contra el historial del modelo y contra el precio de la tienda oficial para saber cuánto de la baja es real.',
          'Pensá primero cómo tomás café: de filtro para jarras grandes, espresso para café con presión y leche, o de cápsulas si priorizás la practicidad.',
        ],
      },
      {
        titulo: 'Tipo, presión y cápsulas',
        parrafos: [
          'En una espresso, la presión se informa en bares y el vaporizador permite espumar leche. En las de cápsulas, confirmá qué sistema usa antes de comprar: no todas las cápsulas son compatibles y el costo por taza es mayor que con café molido.',
        ],
      },
      {
        titulo: 'Verificar antes de pagar',
        parrafos: [
          'Buscá el modelo en /precio y revisá /descuentos-inflados para ver si la oferta se sostiene. Priorizá tiendas oficiales o vendedores con buena reputación y fijate la garantía. Compará envío y cuotas con /calculadora-envio-gratis.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Espresso o de cápsulas?',
        a: 'La de cápsulas es más práctica y constante; la espresso con café molido suele salir más barata por taza y permite elegir el café.',
      },
      {
        q: '¿Cuántos bares de presión necesito?',
        a: 'Para espresso, la ficha indica la presión en bares. Más que perseguir el número más alto, compará modelos del mismo tipo y revisá si trae vaporizador.',
      },
      {
        q: '¿Conviene esperar al Cyber Monday?',
        a: 'Solo si el precio del evento queda por debajo del mínimo registrado. Si no, la oferta de hoy puede ser igual o mejor.',
      },
    ],
  },
  'ofertas-black-friday': {
    secciones: [
      {
        titulo: 'Black Friday en Argentina: qué es y qué no',
        parrafos: [
          'El Black Friday es el viernes 27 de noviembre y, a diferencia del Cyber Monday, no tiene un organizador único en el país: cada tienda decide si participa, cuánto dura y qué descuentos hace. Eso significa que no hay una lista oficial de ofertas y que el nivel de promoción varía mucho de un comercio a otro. Al venir apenas después del Cyber Monday, algunas tiendas simplemente repiten o estiran sus promos, así que conviene comparar entre ambos eventos y no asumir que el viernes siempre es mejor.',
          'Lo importante es la misma regla de siempre: el descuento vale solo si el precio de hoy es bajo respecto del historial.',
        ],
      },
      {
        titulo: 'Cómo verificar una oferta',
        parrafos: [
          'Antes de pagar, buscá el producto en /precio y mirá su precio mínimo registrado y cómo se movió las semanas previas. Si subió justo antes del evento, el descuento no es tal. En /descuentos-inflados juntamos los casos más claros. Si el producto ya estuvo más barato hace poco, esperar al próximo evento o a una oferta puntual puede salir mejor.',
        ],
      },
      {
        titulo: 'Cuotas, envío y plazos',
        parrafos: [
          'En una compra grande, fijate si las cuotas son sin interés reales y comparalas con /calculadora-cuotas-sin-interes. Confirmá el costo del envío (/calculadora-envio-gratis) y la fecha de entrega: con la Navidad cerca, los plazos se alargan. Mirá también la política de cambios y la garantía antes de confirmar.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Cuándo es el Black Friday 2026?',
        a: 'El viernes 27 de noviembre, el día siguiente al Día de Acción de Gracias de Estados Unidos. En Argentina no hay un organizador oficial: cada tienda define sus promociones.',
      },
      {
        q: '¿Es mejor el Black Friday o el Cyber Monday?',
        a: 'No hay una regla fija. Depende del producto y de la tienda; compará el precio de cada evento contra el historial en lugar de dar por hecho que uno es mejor.',
      },
      {
        q: '¿Cómo sé si el descuento es real?',
        a: 'Comparando el precio actual con el mínimo registrado del producto. Si el "antes" subió en las semanas previas, el porcentaje no significa una baja de verdad.',
      },
    ],
  },
  'regalos-de-navidad': {
    secciones: [
      {
        titulo: 'Cómo organizar los regalos de Navidad',
        parrafos: [
          'Navidad y Reyes juntan muchos regalos en poco tiempo y mucha gente termina comprando a las apuradas, con menos opciones y envíos que no llegan al 24 de diciembre. La salida es armar una lista con nombres, presupuesto por persona y una idea para cada uno, y empezar a mirar precios con anticipación, incluso en noviembre durante el Cyber Monday y el Black Friday. Así comparás con calma, distribuís el gasto y evitás pagar de más por urgencia.',
          'Si el regalo es para un chico, fijate la edad recomendada y las baterías o accesorios que no vienen incluidos.',
        ],
      },
      {
        titulo: 'Presupuesto y descuentos verificados',
        parrafos: [
          'Definí un tope total y repartilo; la tabla de esta página agrupa regalos por rango de presupuesto para que veas qué entra en cada uno. Para cada candidato, consultá /precio y revisá su mínimo registrado: en diciembre los precios de referencia suelen estar inflados por la temporada. /descuentos-inflados te ayuda a descartar los que solo cambiaron el cartel.',
        ],
      },
      {
        titulo: 'Entrega, cambios y cuotas',
        parrafos: [
          'Comprá con al menos una semana de margen y mirá la fecha prometida de cada publicación. El envío Full y las tiendas oficiales simplifican los cambios si el regalo no sirve. Usá /calculadora-cuotas-sin-interes para decidir entre pagar de contado o en cuotas y /calculadora-envio-gratis para ver el monto mínimo del envío sin cargo.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Cuándo conviene comprar los regalos de Navidad?',
        a: 'Cuanto antes mejor: noviembre permite aprovechar los eventos de descuentos y diciembre trae envíos más cargados. Comprá con al menos una semana de margen sobre el 24.',
      },
      {
        q: '¿Cómo repartir el presupuesto?',
        a: 'Fijá un tope total, asignale un monto a cada persona y reservá una pequeña parte para imprevistos. Filtrar por rango de precio ayuda a no pasarte.',
      },
      {
        q: '¿Qué hago si el regalo no sirve?',
        a: 'Comprá con envío Full o en tiendas oficiales con devolución simple, y guardá el comprobante y el embalaje original hasta que lo entreguen.',
      },
    ],
  },

  'mejores-iphone': {
    titulo: 'Mejores iPhone en oferta 2026: qué modelo comprar y cuándo',
    secciones: [
      {
        titulo: 'Qué iPhone te conviene según cómo lo usás',
        parrafos: [
          'La línea tiene tres escalones. El modelo base alcanza para casi todo: WhatsApp, redes, fotos, banca y juegos. Los "e" son la puerta de entrada más económica y ya traen lo esencial de la generación. Los Pro y Pro Max suman mejores cámaras, pantalla más fluida y materiales premium; se justifican si sacás muchas fotos, grabás video o querés el equipo más duradero.',
          'Una regla práctica: si no vas a usar el zoom óptico ni grabar video en alta calidad, un modelo no Pro rinde igual en el día a día y ahorrás una diferencia grande.',
        ],
      },
      {
        titulo: 'Almacenamiento y generación anterior',
        parrafos: [
          'El iPhone no tiene ranura para tarjeta de memoria, así que la capacidad que elegís es la que vas a tener durante años. 256 GB es un piso cómodo si sacás fotos y videos; 128 GB sirve si dependés de iCloud y no grabás mucho.',
          'Cuando sale una generación nueva, la anterior baja de precio y sigue recibiendo actualizaciones durante muchos años. Para la mayoría, comprar el modelo del año pasado es la mejor relación entre precio y prestaciones.',
        ],
      },
      {
        titulo: 'Cómo comprarlo bien en Argentina',
        parrafos: [
          'Comprá siempre a una tienda oficial o a un distribuidor autorizado: es la única forma de tener garantía de Apple en el país y factura. Desconfiá de equipos "importados" muy baratos, reacondicionados o sin caja sellada.',
          'En equipos de varios millones, las cuotas sin interés pueden pesar más que un pequeño descuento en un pago. Comparalas siempre, y fijate en la tabla el precio mínimo que registramos para saber si el descuento es real.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Qué iPhone conviene comprar hoy?',
        a: 'Si buscás la mejor relación entre precio y prestaciones, el modelo base de la generación actual o el de la anterior. Los Pro valen la pena solo si vas a aprovechar las cámaras y la pantalla.',
      },
      {
        q: '¿128 GB alcanzan o conviene 256 GB?',
        a: 'Si grabás video o tomás muchas fotos, 256 GB. Con 128 GB alcanza para un uso moderado apoyado en iCloud, pero no se puede ampliar después.',
      },
      {
        q: '¿Conviene comprar el iPhone del año pasado?',
        a: 'Sí, en general. Baja de precio al salir el nuevo, rinde casi igual en el uso diario y sigue recibiendo actualizaciones de iOS durante varios años.',
      },
      {
        q: '¿Dónde comprar un iPhone con garantía oficial en Argentina?',
        a: 'En tiendas oficiales o distribuidores autorizados, con factura y caja sellada. Evitá vendedores sin reputación y equipos reacondicionados sin garantía.',
      },
      {
        q: '¿Cómo sé si el descuento es real?',
        a: 'Comparalo con el precio mínimo registrado que mostramos en cada oferta: si el precio actual está cerca de ese piso, es una buena oportunidad.',
      },
    ],
  },

  'mejores-samsung-galaxy': {
    titulo: 'Mejores Samsung Galaxy en oferta 2026: serie A, S y plegables',
    secciones: [
      {
        titulo: 'Cómo se ordena la línea Galaxy',
        parrafos: [
          'La serie A es la gama media y la que más se vende: buena pantalla, batería para el día y cámaras correctas. La serie S es la gama alta, con el mejor procesador, cámaras más versátiles y más años de actualizaciones. La serie Z agrupa los plegables, pensados para quien quiere un formato distinto y paga la diferencia.',
          'Dentro de la serie A, el número indica el escalón: los más altos suman pantalla AMOLED, más RAM y mejores cámaras que los de entrada.',
        ],
      },
      {
        titulo: 'Qué mirar en la ficha',
        parrafos: [
          'Memoria: 128 GB de almacenamiento es el piso razonable y 6 u 8 GB de RAM mantienen el equipo fluido por más tiempo; con 4 GB anda justo. Pantalla: AMOLED a 90 o 120 Hz se ve y se siente mejor que una LCD básica.',
          'Años de actualizaciones: Samsung promete varios años de parches de seguridad en los modelos recientes. Es lo que más estira la vida útil del equipo, más que cualquier número de megapíxeles.',
        ],
      },
      {
        titulo: 'Comprar sin sorpresas',
        parrafos: [
          'Verificá que sea la versión oficial para Argentina (con las bandas de 4G y 5G de las compañías locales) y que el vendedor sea tienda oficial o tenga buena reputación. Un mismo modelo aparece con varios colores y vendedores; el precio puede variar bastante entre ellos, por eso conviene mirar el mínimo registrado.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Qué diferencia hay entre la serie A y la serie S de Samsung?',
        a: 'La A es gama media, más económica y suficiente para el uso diario. La S es gama alta: mejor procesador, cámaras y pantalla, y más años de actualizaciones.',
      },
      {
        q: '¿Qué Samsung Galaxy conviene comprar?',
        a: 'Para uso diario, un A con 128 GB y al menos 6 GB de RAM. Si sacás muchas fotos o querés que dure más, un S del año anterior en oferta.',
      },
      {
        q: '¿Cuántos años de actualizaciones tiene un Galaxy?',
        a: 'Los modelos recientes de Samsung prometen varios años de parches de seguridad; consultá la ficha del modelo concreto antes de comprar.',
      },
      {
        q: '¿Vale la pena un Galaxy plegable?',
        a: 'Solo si te interesa el formato y aceptás pagar bastante más por lo mismo en potencia. Para uso general, un S rinde mejor por el precio.',
      },
      {
        q: '¿Cómo detecto una oferta real?',
        a: 'Compará el precio actual con el mínimo registrado que mostramos en cada producto, y con el de otros vendedores del mismo modelo.',
      },
    ],
  },

  'mejores-motorola': {
    titulo: 'Mejor Moto G 2026: celulares Motorola en oferta hoy',
    secciones: [
      {
        titulo: 'Las líneas de Motorola, en limpio',
        parrafos: [
          'Moto E es la entrada: para llamadas, WhatsApp y redes sin exigirle mucho. Moto G es la gama media y el corazón de la marca: buena batería, pantalla fluida y precio razonable. Edge es la gama alta, con mejores cámaras y pantalla; y Razr son los plegables.',
          'Dentro de la línea G, los números más altos y las versiones con más RAM se sienten mejor a lo largo del tiempo.',
        ],
      },
      {
        titulo: 'Por qué se eligen',
        parrafos: [
          'Motorola usa una versión de Android muy cercana a la original: es liviana, con pocas aplicaciones preinstaladas y con gestos propios (como girar la muñeca para abrir la cámara). Muchos modelos conservan ranura para tarjeta microSD y entrada de auriculares, algo que ya casi no existe en la gama alta.',
          'La contra es el soporte: fijate cuántas actualizaciones de Android y de seguridad promete el modelo, porque en la gama media suele ser menor que en un Galaxy S o un iPhone.',
        ],
      },
      {
        titulo: 'Qué configuración elegir',
        parrafos: [
          'Con 128 GB y 4 GB de RAM funciona; con 256 GB y 8 GB el equipo sigue andando bien varios años más. Si usás mucho la cámara, mirá que tenga estabilización óptica. Fijate también que sea la versión oficial para Argentina y de qué vendedor es.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Qué Motorola conviene comprar?',
        a: 'Para la mayoría, un Moto G de la generación actual con al menos 128 GB. Si querés mejores cámaras y pantalla, un Edge; si solo necesitás lo básico, un Moto E.',
      },
      {
        q: '¿Cuál es la diferencia entre Moto G y Moto E?',
        a: 'La Moto E es la entrada: más económica y con componentes más simples. La Moto G suma mejor pantalla, más batería, más RAM y mejores cámaras.',
      },
      {
        q: '¿Los Motorola tienen ranura para tarjeta de memoria?',
        a: 'Muchos modelos Moto G y Moto E sí. Es algo que conviene verificar en la ficha, porque en los de gama alta ya casi no existe.',
      },
      {
        q: '¿Cuánto duran las actualizaciones de un Motorola?',
        a: 'Depende del modelo y suele ser menos que en la gama alta de otras marcas. Revisá en la ficha o en el sitio de Motorola cuántas actualizaciones promete el equipo.',
      },
      {
        q: '¿Cómo sé si está en su precio más bajo?',
        a: 'En cada oferta mostramos el precio mínimo que registramos para ese producto: si el actual está cerca, es un buen momento.',
      },
    ],
  },

  'mejores-aires-inverter': {
    titulo: 'Mejores aires acondicionados inverter 2026: cuánto ahorran y cuál elegir',
    secciones: [
      {
        titulo: 'Qué es un inverter y por qué ahorra',
        parrafos: [
          'Un aire convencional se prende a máxima potencia y se apaga al llegar a la temperatura, una y otra vez. El inverter, en cambio, baja y sube la velocidad del compresor para mantener la temperatura pareja. Ese funcionamiento continuo a baja potencia consume menos energía, hace menos ruido y evita los picos de arranque.',
          'El ahorro depende de cuántas horas lo uses: si lo prendés pocas horas por semana, la diferencia contra un on/off es chica; si lo usás todo el día o también para calefaccionar, se nota mucho en la factura de luz.',
        ],
      },
      {
        titulo: 'Cuántas frigorías necesitás',
        parrafos: [
          'La cuenta práctica es multiplicar el volumen del ambiente (superficie por altura) por 50. Un ambiente de 20 m² con techo estándar necesita unas 2.500 a 3.000 frigorías. Si da al sol, tiene vidrios grandes o hay mucha gente, subí un escalón.',
          'Un equipo corto para el ambiente trabaja siempre al máximo y gasta más; uno demasiado grande se apaga rápido y deshumidifica mal. Usá la calculadora de frigorías del sitio para afinar el número.',
        ],
      },
      {
        titulo: 'Qué más mirar antes de comprar',
        parrafos: [
          'Frío/calor: casi todos los inverter calefaccionan con bomba de calor, más eficiente que una estufa eléctrica. Eficiencia energética: etiqueta A o superior. Conectividad Wi-Fi: útil para programarlo desde el celular.',
          'La instalación casi nunca viene incluida y puede sumar un costo importante. Pedí presupuesto a un instalador matriculado antes de decidir, y sumá caños, soporte de la unidad exterior y mano de obra.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Vale la pena un aire inverter?',
        a: 'Si lo vas a usar muchas horas por día o también en invierno, sí: consume menos y es más silencioso. Para uso muy esporádico, la diferencia de precio tarda más en recuperarse.',
      },
      {
        q: '¿Cuánto ahorra un aire inverter?',
        a: 'Depende del uso y del equipo. A mayor cantidad de horas de funcionamiento, mayor es la diferencia de consumo contra un aire convencional.',
      },
      {
        q: '¿Cuántas frigorías necesito?',
        a: 'Volumen del ambiente en m³ por 50. Para 20 m² con altura estándar, aproximadamente 2.500 a 3.000 frigorías, y un poco más si da al sol.',
      },
      {
        q: '¿El inverter sirve para calefaccionar?',
        a: 'Sí, los modelos frío/calor calefaccionan con bomba de calor, que es más eficiente que una estufa eléctrica, aunque pierde rendimiento con mucho frío.',
      },
      {
        q: '¿La instalación está incluida?',
        a: 'En general no. Pedí presupuesto a un instalador y sumalo al costo del equipo.',
      },
    ],
  },

  'mejores-tv-55-65-pulgadas': {
    titulo: 'Mejores smart TV de 55 y 65 pulgadas 2026: cuál elegir',
    secciones: [
      {
        titulo: 'Qué tamaño conviene según tu living',
        parrafos: [
          'La regla es simple: dividí la distancia entre el sillón y la tele por 1,5 a 2 y tenés el tamaño ideal en pulgadas multiplicando por 40 aproximadamente. En la práctica, a 2,5 o 3 metros, 55 pulgadas es el punto justo; para 3,5 metros o más, 65 pulgadas se disfruta mejor; 75 u 85 son para livings amplios o salas de cine.',
          'Medí también el mueble o la pared: un 65 pulgadas ocupa unos 145 cm de ancho, y el pie o la base suma más que el panel.',
        ],
      },
      {
        titulo: 'Resolución, panel y frecuencia',
        parrafos: [
          'A estos tamaños, 4K (UHD) es lo razonable: con Full HD se nota la falta de definición. Entre los paneles, el LED común es el más económico; QLED y Mini LED suben brillo y color; OLED da el negro más profundo y es el preferido para cine en ambientes oscuros.',
          'Para jugar con consola, buscá 120 Hz y modo de baja latencia. Para ver series y fútbol alcanza con 60 Hz; fijate que tenga HDR10 y buen procesamiento de movimiento.',
        ],
      },
      {
        titulo: 'Sistema y conexiones',
        parrafos: [
          'El sistema operativo importa: Google TV, Tizen (Samsung), webOS (LG) o Roku. Todos traen las apps principales, pero cambian la fluidez y la interfaz. Revisá las conexiones: al menos tres entradas HDMI, una con eARC para barra de sonido, y Wi-Fi de doble banda para streaming sin cortes.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Qué tamaño de televisor comprar: 55 o 65 pulgadas?',
        a: 'A 2,5 o 3 metros del sillón, 55 pulgadas; a 3,5 metros o más, o si querés efecto cine, 65. Medí antes el espacio disponible.',
      },
      {
        q: '¿Vale la pena un QLED u OLED?',
        a: 'QLED mejora brillo y color por poco más. OLED da el mejor contraste, ideal para ver en ambientes oscuros, pero cuesta bastante más.',
      },
      {
        q: '¿Qué es mejor, Google TV o Tizen?',
        a: 'Todos traen las apps principales. Google TV tiene catálogo más amplio y recomendaciones; Tizen y webOS son más simples. Elegí por la que te resulte más cómoda.',
      },
      {
        q: '¿Necesito 120 Hz?',
        a: 'Solo si jugás con consola o PC. Para series, películas y fútbol, 60 Hz con buen procesamiento alcanza.',
      },
      {
        q: '¿Cómo sé si el descuento es real?',
        a: 'En cada oferta mostramos el precio mínimo que registramos; si el actual está cerca, es un buen momento. Los eventos como Cyber Monday suelen traer los mejores precios del año.',
      },
    ],
  },

  'mejores-heladeras-no-frost': {
    titulo: 'Mejores heladeras no frost y side by side 2026: cuál conviene',
    secciones: [
      {
        titulo: 'No frost vs cíclica: qué cambia en el día a día',
        parrafos: [
          'La cíclica forma escarcha en el freezer y hay que descongelarla cada tanto. La no frost circula aire frío por ventilación, no forma hielo y mantiene la temperatura más pareja, lo que ayuda a conservar mejor la comida. A cambio, cuesta más y consume algo más si no es inverter.',
          'Si cocinás mucho, guardás verdura fresca o tenés freezer cargado, la no frost se paga sola en comodidad. Si es para una casa chica o un departamento con poco uso, una cíclica alcanza.',
        ],
      },
      {
        titulo: 'Capacidad, inverter y formato',
        parrafos: [
          'La capacidad se calcula en 100 a 150 litros por persona. Para una familia de cuatro, desde 350 litros. Más litros no siempre es mejor: una heladera grande y vacía consume de más.',
          'Inverter es lo que más reduce el consumo y el ruido. En formato, el top mount (freezer arriba) es el más común; el bottom freezer deja la comida fresca a la altura de los ojos; y el side by side tiene dos puertas verticales y mucha capacidad, pero necesita espacio para abrirlas y un enchufe y una cocina preparados.',
        ],
      },
      {
        titulo: 'Antes de comprarla, medí',
        parrafos: [
          'Medí el hueco, la puerta de entrada y los pasillos. Dejá unos centímetros libres a los costados y atrás para que ventile. Revisá si las puertas son reversibles y la etiqueta de eficiencia energética: A o superior baja el consumo año tras año. Fijate en la tabla el precio mínimo que registramos para no comprar en un pico.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Qué es una heladera no frost?',
        a: 'Es una heladera que enfría con aire circulante y no forma hielo en las paredes, por lo que no hay que descongelarla manualmente.',
      },
      {
        q: '¿La no frost consume más?',
        a: 'Un poco más que una cíclica comparable, salvo que sea inverter, que baja bastante el consumo y el ruido.',
      },
      {
        q: '¿Cuántos litros necesito?',
        a: 'Entre 100 y 150 litros por persona. Para cuatro personas, desde 350 litros.',
      },
      {
        q: '¿Qué ventajas tiene una side by side?',
        a: 'Mucha capacidad y acceso cómodo, a veces con dispenser de agua. Necesita más espacio para abrir las puertas y suele costar bastante más.',
      },
      {
        q: '¿Qué mido antes de comprarla?',
        a: 'El hueco donde va, la puerta de entrada y los pasillos, más un margen para ventilación a los costados y atrás.',
      },
    ],
  },

  'mejores-aspiradoras-robot': {
    titulo: 'Mejores aspiradoras robot 2026: cuál comprar y qué mirar',
    secciones: [
      {
        titulo: 'Qué tiene que tener un robot que valga la pena',
        parrafos: [
          'Lo que más separa a un robot bueno de uno barato es la navegación. Los que mapean con láser (LiDAR o LDS) recorren la casa ordenadamente, guardan el plano y permiten definir zonas y habitaciones. Los de sensores simples van al azar, repiten tramos y a veces se quedan trabados.',
          'El segundo punto es la succión, medida en Pascales (Pa). Para piso duro alcanza con 2.500 a 3.000 Pa; si hay alfombras o mascotas, buscá 5.000 Pa o más.',
        ],
      },
      {
        titulo: 'Aspirar y trapear: lo que realmente hacen',
        parrafos: [
          'Muchos modelos combinan aspirado y trapeado con un tanque de agua y un paño. Funcionan bien para mantener el piso, no para limpiar manchas pegadas. Los más completos levantan el paño al detectar alfombra, y los de gama alta traen base que vacía el polvo sola y hasta lava el paño.',
          'La base de autovaciado cuesta más, pero evita tener que vaciar el depósito cada uno o dos usos. Si el presupuesto es ajustado, priorizá navegación láser antes que la base.',
        ],
      },
      {
        titulo: 'Mantenimiento y repuestos',
        parrafos: [
          'Un robot necesita cambiar filtros, cepillos y paños cada tanto. Antes de comprar, fijate que haya repuestos en el país y que la aplicación esté en español, con horarios y mapas. Las marcas conocidas suelen tener mejor soporte, y en las de nicho conviene leer opiniones de compradores sobre el servicio posventa.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Una aspiradora robot reemplaza a la aspiradora tradicional?',
        a: 'Mantiene la casa limpia a diario, pero para rincones, escaleras y suciedad pesada sigue siendo útil una aspiradora común.',
      },
      {
        q: '¿Cuántos Pa de succión necesito?',
        a: 'Con piso duro, 2.500 a 3.000 Pa. Con alfombras y mascotas, 5.000 Pa o más.',
      },
      {
        q: '¿Qué es la navegación láser?',
        a: 'Un sensor LiDAR o LDS que mapea el ambiente y permite al robot recorrer de forma ordenada, guardar el plano y limpiar por zonas.',
      },
      {
        q: '¿Trapea bien?',
        a: 'Mantiene el piso limpio y retira polvo húmedo, pero no reemplaza una limpieza profunda para manchas pegadas.',
      },
      {
        q: '¿Conviene la base de autovaciado?',
        a: 'Si querés olvidarte del mantenimiento, sí. Sin base, hay que vaciar el depósito cada uno o dos usos.',
      },
    ],
  },

  'mejores-cintas-de-correr': {
    titulo: 'Mejores cintas de correr y caminadoras 2026: cuál elegir',
    secciones: [
      {
        titulo: 'Para caminar, trotar o correr: cada uso pide otra máquina',
        parrafos: [
          'Las caminadoras plegables y las walking pad están pensadas para caminar a ritmo suave en casa o debajo del escritorio: motor de 1,5 a 2 HP y velocidades de 6 a 8 km/h alcanzan. Para trotar y correr necesitás una cinta de correr con motor de 2,5 HP o más, velocidad de 12 km/h o más y superficie más ancha.',
          'Comprar una cinta que quede justa para tu uso es la causa más común de que se rompa o termine arrumbada.',
        ],
      },
      {
        titulo: 'Qué mirar en la ficha',
        parrafos: [
          'El peso máximo del usuario es el dato más importante: dejá un margen de al menos 20 kg por encima del tuyo. La superficie de la cinta debería tener unos 40 cm de ancho para trotar cómodo. Revisá que tenga inclinación, amortiguación y pantalla con datos básicos (tiempo, distancia, calorías).',
          'Si el espacio es chico, buscá un modelo plegable con ruedas. Las walking pad se guardan solas debajo de la cama o del sillón.',
        ],
      },
      {
        titulo: 'Y las bicicletas fijas',
        parrafos: [
          'La bicicleta fija o de spinning es una alternativa de menor impacto articular: mejor si tenés problemas de rodillas o querés entrenar cardio sin saltos. Fijate en el peso del volante (cuanto más pesado, más suave el pedaleo), en el ajuste de resistencia y en que el asiento y el manubrio regulen para tu altura.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Qué motor necesito en una cinta de correr?',
        a: 'Para caminar, 1,5 a 2 HP. Para correr, 2,5 HP o más y velocidad máxima de 12 km/h o más.',
      },
      {
        q: '¿Qué es una walking pad?',
        a: 'Una caminadora plana y compacta, pensada para caminar a ritmo suave, que se guarda debajo de la cama o del sillón.',
      },
      {
        q: '¿Qué peso máximo debe soportar?',
        a: 'El tuyo más al menos 20 kg de margen, para que la máquina no trabaje al límite.',
      },
      {
        q: '¿Cinta o bicicleta fija?',
        a: 'La cinta da más gasto calórico y entrena una actividad natural; la bicicleta fija tiene menos impacto en las articulaciones y suele ser más silenciosa.',
      },
      {
        q: '¿Se puede usar en un departamento?',
        a: 'Sí, pero poné una base antivibratoria debajo y elegí un modelo con buena amortiguación para no molestar a los vecinos.',
      },
    ],
  },
}
