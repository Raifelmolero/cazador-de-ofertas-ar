// Guías de tecnología de cola larga (celulares, notebooks y smart TV) con
// intención de compra: "mejor celular para adultos mayores", "notebook para la
// facultad", "smart TV para PS5"... Cada una muestra los equipos reales de hoy
// que cumplen su criterio (lib/guias-equipos.ts, sale del comparador) con su
// link de Mercado Libre, y enlaza a los duelos /vs, a los presupuestos /mejor y
// al comparador.
//
// Solo criterios generales y verificables: nada de specs de un modelo que no
// diga su publicación, nada de precios fijos en el texto (los precios están en
// la lista de equipos, que se arma con los de hoy).
import type { Guia } from './guias'

export const GUIAS_TECNO: Guia[] = [
  {
    slug: 'mejor-celular-para-adultos-mayores',
    titulo: 'Mejor celular para adultos mayores: qué mirar y cuáles convienen hoy',
    descripcion:
      'Qué celular comprarle a una persona mayor en Argentina: pantalla grande, batería, memoria, modo simple y si conviene un smartphone o uno con teclas. Con los precios de hoy en Mercado Libre.',
    pregunta: '¿Cuál es el mejor celular para un adulto mayor?',
    respuestaCorta:
      'Para una persona mayor que usa WhatsApp, fotos y videollamadas conviene un smartphone simple de marca conocida (un Motorola Moto G o un Samsung Galaxy A de entrada) con pantalla grande, 128 GB de memoria y batería que aguante el día: no hace falta gama alta. Si solo va a llamar y mandar mensajes de texto, un celular con tapa y teclas grandes es más fácil de usar y casi no se descarga.',
    secciones: [
      {
        h: 'Qué necesita de verdad un celular para una persona mayor',
        p: [
          'Pantalla grande y nítida: la mayoría de los celulares de entrada actuales ya tiene más de 6,5 pulgadas, así que la diferencia la hace poder agrandar la letra y los íconos sin que se corte el texto.',
          'Batería: que llegue a la noche aunque se olvide de cargarlo. Los Moto G y Galaxy A de entrada traen baterías grandes; confirmá los mAh en la ficha de la publicación.',
          'Memoria: 128 GB. Con 64 GB el celular se llena rápido con las fotos y los audios de WhatsApp de la familia, y cuando no hay espacio las apps empiezan a fallar. Es el error más común al regalar un celular barato.',
          'Sonido y señal: un buen volumen en llamadas importa más que la cámara. Una marca conocida suele tener mejor recepción y repuestos.',
        ],
      },
      {
        h: 'Cómo dejarlo fácil de usar',
        p: [
          'Samsung trae un "Modo fácil" que agranda todo y simplifica la pantalla de inicio; en Motorola y Xiaomi se logra lo mismo desde Accesibilidad (tamaño de letra y de pantalla).',
          'Dejá en la pantalla de inicio solo lo que usa: Teléfono, WhatsApp, Cámara y Fotos. Cargá los contactos con foto y activá la función de emergencia (SOS) de Android con un número de la familia.',
          'Si está lejos, una app de asistencia remota o la ubicación compartida de Google te permite ayudarlo sin estar al lado.',
        ],
      },
      {
        h: 'Smartphone o celular con teclas',
        p: [
          'Un celular con tapa y teclas grandes (como el Nokia 2720 Flip que suele estar en oferta) es ideal para llamadas: se atiende abriendo la tapa, la batería dura días y no hay nada que configurar. La contra es que no está pensado para WhatsApp ni videollamadas.',
          'Si la familia se comunica por WhatsApp, conviene un smartphone simple. Un modelo de entrada de marca conocida rinde mejor que uno "potente" de marca desconocida con números inflados en el título.',
        ],
      },
      {
        h: 'Cuánto gastar',
        p: [
          'Con un Moto G o un Galaxy A de entrada alcanza: la lista de abajo muestra los de hoy con su precio y el más bajo que registramos. Por encima de eso estás pagando cámara o potencia que una persona mayor difícilmente va a aprovechar.',
          'Comprá a un vendedor con factura y garantía oficial: si el celular falla, el trámite lo vas a hacer vos.',
        ],
      },
    ],
    categoria: { slug: 'celulares', nombre: 'celulares' },
    equipos: {
      comparador: 'celulares',
      titulo: 'Celulares simples de marca conocida, con el precio de hoy',
      incluye: /\b(2720 flip|galaxy a07|galaxy a16|galaxy a17|g06|g15|redmi 15c)\b/,
      hasta: 450_000,
    },
    cta: { href: '/comparador/celulares', titulo: 'Compará los celulares de hoy por precio y memoria', boton: 'Abrir el comparador de celulares' },
    faq: [
      {
        q: '¿Qué celular es más fácil de usar para un adulto mayor?',
        a: 'Para llamar, uno con tapa y teclas grandes. Para WhatsApp y videollamadas, un smartphone de entrada de marca conocida (Motorola Moto G o Samsung Galaxy A) con la letra agrandada y solo las apps que usa en la pantalla de inicio.',
      },
      {
        q: '¿Cuánta memoria necesita el celular de una persona mayor?',
        a: '128 GB. Con 64 GB se llena rápido con las fotos y audios de WhatsApp y empieza a andar lento.',
      },
      {
        q: '¿Samsung o Motorola para una persona mayor?',
        a: 'Los dos sirven. Samsung tiene el Modo fácil, que simplifica la pantalla en un paso; Motorola trae un Android muy limpio, sin apps de más. Elegí por precio y que tenga 128 GB.',
      },
    ],
    enlaces: [
      { href: '/mejor/celular-hasta-300-mil', texto: 'Mejor celular hasta $300 mil' },
      { href: '/vs/moto-g06-vs-samsung-galaxy-a07', texto: 'Moto G06 vs Galaxy A07' },
      { href: '/vs/samsung-galaxy-a07-vs-galaxy-a16', texto: 'Galaxy A07 vs Galaxy A16' },
      { href: '/guias/cuantos-gb-necesito-celular', texto: 'Cuántos GB necesito en el celular' },
      { href: '/comparador/celulares', texto: 'Comparador de celulares' },
    ],
  },
  {
    slug: 'celular-con-mejor-bateria',
    titulo: 'Celular con mejor batería: qué mirar además de los mAh',
    descripcion:
      'Cómo elegir un celular con batería que dure: mAh, procesador, pantalla de 120 Hz, carga rápida y cuidados. Con los celulares de hoy en Mercado Libre Argentina y su precio más bajo registrado.',
    pregunta: '¿Qué celular tiene mejor batería?',
    respuestaCorta:
      'La duración depende de tres cosas: la capacidad (hoy 5000 mAh es lo normal y más de 6000 mAh es mucho), un procesador eficiente y la pantalla. Los Motorola Moto G y los Xiaomi Redmi de entrada suelen ser los que más duran por su precio porque combinan baterías grandes con pantallas y procesadores que consumen poco. Más mAh no sirve si el celular tiene un procesador viejo o una pantalla que consume mucho.',
    secciones: [
      {
        h: 'Los mAh: el número que más se mira (y no alcanza)',
        p: [
          'La capacidad de la batería se mide en miliamperios hora (mAh). En 2026 casi todos los celulares de gama de entrada y media traen 5000 mAh o más; algunos llegan a 6000 o 7000 mAh.',
          'Entre dos celulares parecidos, más mAh es más autonomía. Pero un celular de 6000 mAh con un procesador ineficiente puede durar lo mismo que uno de 5000 mAh bien optimizado.',
        ],
      },
      {
        h: 'Lo que más gasta: pantalla y procesador',
        p: [
          'La pantalla es lo que más consume. Las de 120 Hz se ven más fluidas pero gastan más; casi todas permiten bajarlas a 60 Hz si querés estirar la batería.',
          'Los procesadores nuevos de fabricación más fina consumen menos haciendo lo mismo. Por eso un modelo nuevo de gama media suele durar más que un gama alta de hace varios años.',
          'El 5G, el GPS y el brillo al máximo también gastan: si estás en una zona con señal floja, el celular busca red todo el tiempo y la batería cae rápido.',
        ],
      },
      {
        h: 'Carga rápida: tan importante como la duración',
        p: [
          'La potencia de carga se mide en watts (W). Con 30 W o más, media hora de carga te da buena parte del día. Revisá si el cargador viene en la caja: muchas marcas ya no lo incluyen y el celular solo carga rápido con uno compatible.',
        ],
      },
      {
        h: 'Cómo hacer que dure más (el celular y la batería)',
        p: [
          'Evitá dejarlo al sol o cargándolo debajo de la almohada: el calor es lo que más desgasta la batería.',
          'Si tu celular tiene la opción de limitar la carga al 80 % o "carga optimizada", activala: alarga la vida útil de la batería.',
          'Cuando compres, mirá en la ficha los mAh y la potencia de carga, no solo el título. En la lista de abajo están los que hoy tienen mejor relación entre batería y precio, con el más bajo que registramos de cada uno.',
        ],
      },
    ],
    categoria: { slug: 'celulares', nombre: 'celulares' },
    equipos: {
      comparador: 'celulares',
      titulo: 'Moto G y Redmi de batería grande, con el precio de hoy',
      incluye: /mah\b|\b(moto|motorola) ?g(06|15|17|47)\b|redmi 15c/,
      hasta: 600_000,
    },
    cta: { href: '/comparador/celulares', titulo: 'Compará los celulares de hoy por precio, memoria y 5G', boton: 'Abrir el comparador de celulares' },
    faq: [
      {
        q: '¿Cuántos mAh tiene que tener un celular con buena batería?',
        a: '5000 mAh es lo normal en 2026 y alcanza para un día de uso intenso. Más de 6000 mAh es mucha batería. Pero la duración también depende del procesador y de la pantalla.',
      },
      {
        q: '¿La pantalla de 120 Hz gasta más batería?',
        a: 'Sí, un poco más que una de 60 Hz. La mayoría de los celulares deja bajarla a 60 Hz desde los ajustes de pantalla.',
      },
      {
        q: '¿Qué marcas de celular duran más con una carga?',
        a: 'Por precio, los Motorola Moto G y los Xiaomi Redmi suelen ser los que más rinden porque combinan baterías grandes con pantallas y procesadores que consumen poco. Confirmá los mAh en la ficha de cada modelo.',
      },
    ],
    enlaces: [
      { href: '/vs/moto-g15-vs-moto-g17', texto: 'Moto G15 vs Moto G17' },
      { href: '/vs/xiaomi-redmi-15c-vs-moto-g15', texto: 'Redmi 15C vs Moto G15' },
      { href: '/vs/moto-g17-vs-moto-g47', texto: 'Moto G17 vs Moto G47' },
      { href: '/mejor/celular-hasta-400-mil', texto: 'Mejor celular hasta $400 mil' },
      { href: '/guias/que-motorola-comprar-moto-g-o-edge', texto: 'Qué Motorola comprar' },
    ],
  },
  {
    slug: 'primer-celular-para-chicos',
    titulo: 'Primer celular para un chico: cuál comprar y cómo configurarlo',
    descripcion:
      'Qué celular comprarle a un chico o adolescente como primer celular: presupuesto, memoria, funda, control parental con Google Family Link y qué evitar. Con precios de hoy en Mercado Libre.',
    pregunta: '¿Qué celular conviene comprarle a un chico como primer celular?',
    respuestaCorta:
      'Para un primer celular conviene un Android de entrada de marca conocida (Motorola Moto G, Samsung Galaxy A o Xiaomi Redmi) con 128 GB de memoria, una buena funda y vidrio templado. Con Android podés usar Google Family Link, gratis, para controlar el tiempo de pantalla, aprobar las apps que descarga y ver dónde está. No tiene sentido un gama alta: se cae, se rompe y se pierde.',
    secciones: [
      {
        h: 'Cuánto gastar en el primer celular',
        p: [
          'Un primer celular tiene que ser barato de reponer. Los Moto G, Galaxy A y Redmi de entrada hacen todo lo que necesita un chico: WhatsApp, fotos, música, videos y juegos livianos.',
          'Pedí 128 GB de memoria: los juegos y los videos llenan 64 GB en pocas semanas y el celular empieza a andar lento. Es mejor resignar cámara que memoria.',
        ],
      },
      {
        h: 'Control parental: Google Family Link',
        p: [
          'Family Link es la herramienta gratuita de Google para administrar la cuenta de un menor: limitar horas de uso, bloquear el celular a la hora de dormir, aprobar cada app que quiera instalar y ver la ubicación.',
          'Se configura desde tu propio celular al crear la cuenta de Google del chico. Hacelo antes de dárselo: es mucho más fácil que agregarlo después.',
          'En YouTube conviene activar la experiencia supervisada, y en WhatsApp revisar quién puede agregarlo a grupos (Ajustes, Privacidad, Grupos).',
        ],
      },
      {
        h: 'Lo que suma (y lo que no)',
        p: [
          'Suma: funda con bordes altos, vidrio templado y, si lo lleva al colegio, que la batería aguante todo el día.',
          'No suma: 5G, cámaras de muchos megapíxeles o "24 GB de RAM" de marcas desconocidas (suelen contar memoria virtual). Un modelo de entrada de marca conocida tiene mejores actualizaciones de seguridad.',
        ],
      },
    ],
    categoria: { slug: 'celulares', nombre: 'celulares' },
    equipos: {
      comparador: 'celulares',
      titulo: 'Celulares de entrada con 128 GB, con el precio de hoy',
      incluye: /\b(galaxy a07|galaxy a16|g06|g15|g24|g04s|redmi 15c)\b/,
      minimos: { memoria: 128 },
      hasta: 400_000,
    },
    cta: { href: '/comparador/celulares', titulo: 'Compará los celulares de hoy por precio y memoria', boton: 'Abrir el comparador de celulares' },
    faq: [
      {
        q: '¿A qué edad darle el primer celular a un chico?',
        a: 'No hay una edad fija: depende de la autonomía del chico (si viaja solo, si va y vuelve del colegio). Sea cuando sea, conviene empezar con un celular barato y Family Link configurado desde el primer día.',
      },
      {
        q: '¿Family Link es gratis?',
        a: 'Sí. Es de Google, funciona en celulares Android y se administra desde la app Family Link en el celular del padre o la madre.',
      },
      {
        q: '¿Cuánta memoria necesita el celular de un chico?',
        a: '128 GB. Los juegos y videos llenan rápido los 64 GB y el celular empieza a fallar.',
      },
    ],
    enlaces: [
      { href: '/mejor/celular-hasta-300-mil', texto: 'Mejor celular hasta $300 mil' },
      { href: '/vs/moto-g06-vs-moto-g15', texto: 'Moto G06 vs Moto G15' },
      { href: '/vs/samsung-galaxy-a07-vs-galaxy-a16', texto: 'Galaxy A07 vs Galaxy A16' },
      { href: '/guias/cuantos-gb-necesito-celular', texto: 'Cuántos GB necesito en el celular' },
      { href: '/comparador/celulares', texto: 'Comparador de celulares' },
    ],
  },
  {
    slug: 'conviene-celular-5g-en-argentina',
    titulo: '¿Conviene comprar un celular 5G en Argentina?',
    descripcion:
      'Si vale la pena pagar más por un celular 5G en Argentina: cobertura real, para quién conviene y para quién alcanza el 4G. Con los celulares 5G de hoy en Mercado Libre y su precio más bajo registrado.',
    pregunta: '¿Vale la pena un celular 5G en Argentina?',
    respuestaCorta:
      'Conviene si vivís en una ciudad grande con cobertura 5G de tu compañía y pensás usar el celular varios años: la red va a seguir creciendo y el 5G suele venir junto con mejores procesadores. Si vivís en una zona sin 5G o usás el celular para WhatsApp y redes, un buen 4G alcanza y ahorrás plata. No pagues de más solo por la sigla.',
    secciones: [
      {
        h: 'Cómo está el 5G en Argentina',
        p: [
          'Las tres compañías (Personal, Claro y Movistar) ya ofrecen 5G en las ciudades grandes y la cobertura se va ampliando, pero en buena parte del país el celular sigue usando 4G.',
          'Antes de pagar por 5G, revisá el mapa de cobertura de tu compañía para tu casa y tu trabajo, y si tu plan lo incluye.',
        ],
      },
      {
        h: 'Para quién conviene',
        p: [
          'Conviene si mirás video o jugás en línea en la calle, si compartís internet a la notebook o si cambiás de celular cada 3 o 4 años: lo que compres hoy va a estar en uso cuando el 5G llegue a más lugares.',
          'Alcanza con 4G si usás el celular para WhatsApp, redes y música, o si vivís donde no hay 5G. Con la diferencia de precio podés subir de memoria, que se nota todos los días.',
        ],
      },
      {
        h: 'Qué mirar en un celular 5G',
        p: [
          'En gama media, el 5G suele venir con mejor procesador y pantalla, y eso es lo que más vas a notar. Compará siempre a igual memoria (128 o 256 GB).',
          'El 5G consume algo más de batería, sobre todo con señal débil: si no lo necesitás en algún momento, se puede desactivar desde los ajustes de red.',
          'La lista de abajo muestra los celulares que hoy dicen 5G en su publicación, de marcas conocidas, con su precio y el más bajo que registramos.',
        ],
      },
    ],
    categoria: { slug: 'celulares', nombre: 'celulares' },
    equipos: {
      comparador: 'celulares',
      titulo: 'Celulares 5G de marca conocida, con el precio de hoy',
      minimos: { g5: 1 },
    },
    cta: { href: '/comparador/celulares', titulo: 'Filtrá los celulares con 5G en el comparador', boton: 'Abrir el comparador de celulares' },
    faq: [
      {
        q: '¿Funciona el 5G en Argentina?',
        a: 'Sí, Personal, Claro y Movistar tienen 5G en las ciudades grandes, y la cobertura se sigue ampliando. En el resto del país el celular usa 4G.',
      },
      {
        q: '¿Un celular 5G funciona donde no hay 5G?',
        a: 'Sí. Usa 4G automáticamente cuando no hay 5G, como cualquier otro celular.',
      },
      {
        q: '¿El 5G gasta más batería?',
        a: 'Algo más, sobre todo con señal débil. Si no lo necesitás, podés dejar el celular en 4G desde los ajustes de red.',
      },
    ],
    enlaces: [
      { href: '/vs/samsung-galaxy-a37-vs-galaxy-a57', texto: 'Galaxy A37 vs Galaxy A57' },
      { href: '/vs/motorola-edge-70-fusion-vs-samsung-galaxy-a37', texto: 'Edge 70 Fusion vs Galaxy A37' },
      { href: '/vs/samsung-galaxy-a17-vs-galaxy-a27', texto: 'Galaxy A17 vs Galaxy A27' },
      { href: '/mejor/celular-hasta-1-millon', texto: 'Mejor celular hasta $1 millón' },
      { href: '/comparador/celulares', texto: 'Comparador de celulares' },
    ],
  },
  {
    slug: 'celular-con-mejor-camara',
    titulo: 'Celular con mejor cámara: qué mirar además de los megapíxeles',
    descripcion:
      'Cómo elegir un celular para sacar buenas fotos y videos: sensor, estabilización óptica, zoom, video 4K y por qué los megapíxeles no lo son todo. Con los gama alta de hoy en Mercado Libre Argentina.',
    pregunta: '¿Qué celular tiene la mejor cámara?',
    respuestaCorta:
      'Las mejores cámaras están en la gama alta: los iPhone Pro, los Samsung Galaxy S Ultra y los Motorola Edge Pro. Lo que las hace mejores no son los megapíxeles sino el tamaño del sensor, la estabilización óptica (OIS), el zoom óptico y el procesamiento de la imagen. Si te importa el zoom, los Galaxy Ultra; si grabás mucho video, los iPhone Pro son la referencia.',
    secciones: [
      {
        h: 'Por qué los megapíxeles no dicen casi nada',
        p: [
          'Un celular de entrada puede anunciar 50 MP y sacar peores fotos que uno de 12 MP de gama alta. Lo que define la calidad es el sensor (más grande capta más luz), la lente y el procesamiento.',
          'Los megapíxeles altos sirven para recortar una foto sin perder tanto detalle, no para que la foto sea mejor de noche.',
        ],
      },
      {
        h: 'Lo que sí marca la diferencia',
        p: [
          'Estabilización óptica (OIS): evita fotos movidas de noche y videos temblorosos. Es lo primero que conviene buscar.',
          'Zoom óptico (teleobjetivo): una cámara aparte para acercar sin perder calidad. El zoom "digital" es solo recortar la foto.',
          'Video: 4K a 60 cuadros por segundo y buena estabilización. Si grabás para redes, es tan importante como la foto.',
          'Gran angular: suma para paisajes y espacios chicos, pero en muchos celulares es la cámara más floja.',
        ],
      },
      {
        h: 'Cuál elegir según lo que fotografiás',
        p: [
          'Zoom y fotos de lejos (recitales, partidos, viajes): los Samsung Galaxy S Ultra, que combinan sensor de muchos megapíxeles con teleobjetivos. El S25 Ultra de la lista lo detalla en su publicación (cámara cuádruple de 200 + 50 + 10 + 50 MP).',
          'Video y redes: los iPhone Pro. Graban video muy estable y con buen color sin tocar nada.',
          'Si el presupuesto no llega, el modelo Ultra o Pro del año anterior suele bajar bastante y sigue teniendo mejor cámara que un gama media nuevo. Mirá el duelo entre el Galaxy S24 Ultra y el S25 Ultra para ver cuánto ahorrás hoy.',
        ],
      },
    ],
    categoria: { slug: 'celulares', nombre: 'celulares' },
    equipos: {
      comparador: 'celulares',
      titulo: 'Gama alta con las mejores cámaras, con el precio de hoy',
      incluye: /iphone 17 pro|galaxy s2[456] ultra|galaxy s26\b|edge 60 pro|pixel/,
    },
    cta: { href: '/comparador/celulares', titulo: 'Compará los gama alta de hoy lado a lado', boton: 'Abrir el comparador de celulares' },
    faq: [
      {
        q: '¿Más megapíxeles es mejor cámara?',
        a: 'No necesariamente. Importa más el tamaño del sensor, la estabilización óptica y el procesamiento. Un gama alta de 12 o 48 MP suele sacar mejores fotos que un gama de entrada de 50 MP.',
      },
      {
        q: '¿iPhone o Samsung para sacar fotos?',
        a: 'Los dos tienen cámaras excelentes en su gama alta. Los Galaxy S Ultra se destacan por el zoom; los iPhone Pro, por el video. Elegí según qué fotografiás más.',
      },
      {
        q: '¿Qué es la estabilización óptica (OIS)?',
        a: 'Un mecanismo que mueve el sensor o la lente para compensar el temblor de la mano. Da fotos nítidas con poca luz y videos más estables.',
      },
    ],
    enlaces: [
      { href: '/vs/samsung-galaxy-s24-ultra-vs-galaxy-s25-ultra', texto: 'Galaxy S24 Ultra vs S25 Ultra' },
      { href: '/vs/samsung-galaxy-s25-ultra-vs-iphone-17-pro', texto: 'Galaxy S25 Ultra vs iPhone 17 Pro' },
      { href: '/vs/iphone-17-pro-vs-iphone-17-pro-max', texto: 'iPhone 17 Pro vs 17 Pro Max' },
      { href: '/guias/que-celular-gama-alta-comprar', texto: 'Qué celular gama alta comprar' },
      { href: '/comparador/celulares', texto: 'Comparador de celulares' },
    ],
  },
  {
    slug: 'iphone-o-samsung-cual-conviene-argentina',
    titulo: 'iPhone o Samsung: cuál conviene comprar en Argentina',
    descripcion:
      'iPhone o Samsung Galaxy en Argentina: precio, años de actualizaciones, reventa, service y ecosistema. Con los precios de hoy de cada uno en Mercado Libre y los duelos modelo a modelo.',
    pregunta: '¿Conviene más un iPhone o un Samsung en Argentina?',
    respuestaCorta:
      'Por plata, Samsung: a igual gama, un Galaxy S suele costar bastante menos que un iPhone en Argentina y además tenés Galaxy A para todos los presupuestos. Por reventa y por cuánto tiempo dura, el iPhone: se revende mejor y recibe actualizaciones por muchos años. Si ya usás Mac, iPad o Apple Watch, iPhone; si querés elegir cargador, personalizar y gastar menos, Samsung.',
    secciones: [
      {
        h: 'Precio: la diferencia más grande en Argentina',
        p: [
          'En Argentina el iPhone suele costar más que un Samsung de su misma gama. Un Galaxy S del año pasado (o un FE) suele estar bastante por debajo de un iPhone nuevo. La lista de abajo muestra los de hoy, y los duelos comparan modelo a modelo a igual memoria.',
          'Samsung tiene además toda la línea Galaxy A, desde entrada hasta gama media alta. Apple solo vende gama alta: el iPhone más barato sigue siendo un celular caro.',
        ],
      },
      {
        h: 'Actualizaciones y vida útil',
        p: [
          'Apple da actualizaciones de iOS durante muchos años a cada iPhone. Samsung también estiró su soporte: los Galaxy S recientes tienen la promesa de hasta siete años de actualizaciones de Android.',
          'En la práctica, un gama alta de cualquiera de las dos marcas te dura cuatro o cinco años si cuidás la batería. Los Galaxy A tienen menos años de soporte que los S.',
        ],
      },
      {
        h: 'Reventa y service',
        p: [
          'El iPhone se revende mejor: un usado de dos años vale proporcionalmente más que un Samsung de la misma edad. Si cambiás seguido de celular, eso compensa parte de la diferencia de precio.',
          'Apple no tiene tiendas propias en Argentina: se vende por distribuidores autorizados y el service se hace en servicios técnicos autorizados. Samsung tiene una red de servicio técnico oficial más amplia. Comprá siempre con factura y garantía oficial.',
        ],
      },
      {
        h: 'Ecosistema y uso diario',
        p: [
          'Si tenés Mac, iPad o Apple Watch, el iPhone se integra mejor (AirDrop, copiar y pegar entre equipos, mensajes). Con una PC con Windows o un reloj Android, Samsung se acopla mejor.',
          'Android deja personalizar más y usar cualquier cargador o accesorio USB-C; iOS es más cerrado pero más simple. Los dos tienen cámaras de primer nivel en la gama alta.',
        ],
      },
    ],
    categoria: { slug: 'celulares', nombre: 'celulares' },
    equipos: {
      comparador: 'celulares',
      titulo: 'iPhone y Samsung Galaxy S, con el precio de hoy',
      incluye: /\biphone\b|galaxy s2[456]/,
      max: 8,
    },
    cta: { href: '/comparador/celulares', titulo: 'Poné un iPhone y un Galaxy lado a lado', boton: 'Abrir el comparador de celulares' },
    faq: [
      {
        q: '¿Por qué el iPhone es más caro en Argentina?',
        a: 'Se vende importado por distribuidores autorizados y Apple solo hace gama alta. Por eso, a igual gama, un Samsung Galaxy S suele salir menos.',
      },
      {
        q: '¿Qué dura más, un iPhone o un Samsung?',
        a: 'Un gama alta de cualquiera de las dos dura cuatro o cinco años. El iPhone tiene muchos años de actualizaciones y los Galaxy S recientes prometen hasta siete años de Android.',
      },
      {
        q: '¿Conviene un iPhone del año pasado o un Samsung nuevo?',
        a: 'Depende de la diferencia de precio de hoy. En el duelo iPhone 16 vs Galaxy S26 ves cuánto cuesta cada uno en Mercado Libre y el más bajo que registramos.',
      },
    ],
    enlaces: [
      { href: '/vs/samsung-galaxy-s26-vs-iphone-17', texto: 'Galaxy S26 vs iPhone 17' },
      { href: '/vs/iphone-16-vs-samsung-galaxy-s26', texto: 'iPhone 16 vs Galaxy S26' },
      { href: '/vs/samsung-galaxy-s25-ultra-vs-iphone-17-pro', texto: 'Galaxy S25 Ultra vs iPhone 17 Pro' },
      { href: '/vs/samsung-galaxy-s26-fe-vs-iphone-16', texto: 'Galaxy S26 FE vs iPhone 16' },
      { href: '/guias/que-iphone-comprar', texto: 'Qué iPhone comprar' },
      { href: '/guias/que-samsung-galaxy-comprar', texto: 'Qué Samsung Galaxy comprar' },
    ],
  },
  {
    slug: 'mejor-celular-para-jugar',
    titulo: 'Mejor celular para jugar: qué mirar para Free Fire, COD y Genshin',
    descripcion:
      'Qué celular comprar para jugar en Argentina: procesador, RAM real, pantalla de 120 Hz o más, batería y temperatura. Con los celulares de hoy en Mercado Libre y su precio más bajo registrado.',
    pregunta: '¿Qué celular conviene para jugar?',
    respuestaCorta:
      'Para jugar fluido conviene un gama media alta con buen procesador, 8 GB de RAM real, pantalla de 120 Hz o más y 256 GB de memoria: el Motorola Edge Fusion, el Poco X de Xiaomi o los Galaxy A37 y A57 de Samsung. Para Free Fire alcanza con un gama media común; para Genshin Impact o COD con gráficos altos, cuanto mejor el procesador, mejor. Desconfiá de los "24 GB de RAM" en el título: suele ser memoria virtual.',
    secciones: [
      {
        h: 'Procesador: lo que más pesa',
        p: [
          'El procesador (con su chip gráfico) define cuántos cuadros por segundo da el juego y con qué gráficos. Es lo único que no se puede compensar después.',
          'Juegos livianos como Free Fire o Brawl Stars corren bien en casi cualquier celular actual. Para Genshin Impact, Call of Duty Mobile o EA FC con gráficos altos conviene la gama media alta o la gama alta.',
        ],
      },
      {
        h: 'RAM real y memoria',
        p: [
          '8 GB de RAM real alcanzan para jugar y tener WhatsApp abierto. Muchos títulos anuncian "16 GB" o "24 GB" sumando la RAM virtual (que usa parte de la memoria interna): no es lo mismo y no hace al juego más fluido.',
          'Memoria: 256 GB. Los juegos grandes pesan varios GB cada uno y se actualizan seguido.',
        ],
      },
      {
        h: 'Pantalla, batería y temperatura',
        p: [
          'Una pantalla de 120 o 144 Hz muestra más cuadros por segundo y se siente más fluida, siempre que el juego y el procesador lleguen. AMOLED da mejores negros y colores.',
          'Jugar gasta mucha batería: 5000 mAh y carga rápida son lo mínimo. Y después de un rato largo el celular se calienta y baja el rendimiento; los modelos pensados para juegos lo manejan mejor.',
        ],
      },
    ],
    categoria: { slug: 'celulares', nombre: 'celulares' },
    equipos: {
      comparador: 'celulares',
      titulo: 'Celulares para jugar, con el precio de hoy',
      incluye: /gt 30|poco x|edge 60 fusion|edge 70|galaxy a57|galaxy a37|1[24]4 ?hz/,
    },
    cta: { href: '/gamer', titulo: 'Ofertas gamer de hoy, verificadas', boton: 'Ver ofertas gamer 🎮' },
    faq: [
      {
        q: '¿Cuánta RAM necesita un celular para jugar?',
        a: '8 GB de RAM real. Los números más grandes que aparecen en algunos títulos suelen sumar RAM virtual, que no mejora el rendimiento en juegos.',
      },
      {
        q: '¿Qué celular necesito para Free Fire?',
        a: 'Free Fire corre bien en casi cualquier celular actual de gama media. Para jugarlo con 90 o 120 cuadros por segundo conviene una pantalla de más de 60 Hz y un procesador de gama media alta.',
      },
      {
        q: '¿Vale la pena una pantalla de 144 Hz?',
        a: 'Se nota en juegos competitivos que soportan esa tasa. Para la mayoría, 120 Hz ya es un salto grande frente a 60 Hz.',
      },
    ],
    enlaces: [
      { href: '/vs/xiaomi-poco-x8-pro-vs-samsung-galaxy-a57', texto: 'Poco X8 Pro vs Galaxy A57' },
      { href: '/vs/infinix-gt-30-pro-vs-xiaomi-poco-x8-pro', texto: 'Infinix GT 30 Pro vs Poco X8 Pro' },
      { href: '/vs/motorola-edge-60-fusion-vs-edge-70-fusion', texto: 'Edge 60 Fusion vs Edge 70 Fusion' },
      { href: '/mejor/celular-hasta-1-millon', texto: 'Mejor celular hasta $1 millón' },
      { href: '/comparador/celulares', texto: 'Comparador de celulares' },
    ],
  },
  {
    slug: 'notebook-para-la-facultad',
    titulo: 'Notebook para la facultad: qué comprar según tu carrera',
    descripcion:
      'Qué notebook comprar para estudiar en la facultad en Argentina: procesador, RAM, SSD, peso y batería según la carrera. Con las notebooks de hoy en Mercado Libre y su precio más bajo registrado.',
    pregunta: '¿Qué notebook comprar para la facultad?',
    respuestaCorta:
      'Para la mayoría de las carreras alcanza una notebook con Intel Core i3 o AMD Ryzen 3 (mejor i5 o Ryzen 5), 8 GB de RAM y disco SSD de 256 GB o más. Si estudiás ingeniería, arquitectura o sistemas, apuntá a Ryzen 5 o i5 con 16 GB de RAM y 512 GB. Evitá las de Celeron con memoria eMMC: arrancan bien y al año se vuelven lentas.',
    secciones: [
      {
        h: 'Lo mínimo para estudiar',
        p: [
          'Procesador: Intel Core i3 o AMD Ryzen 3 como piso; con i5 o Ryzen 5 la notebook te acompaña toda la carrera.',
          'RAM: 8 GB. Con 4 GB, el navegador con varias pestañas, el Meet y un Word ya la traban.',
          'Disco: SSD, nunca disco mecánico ni eMMC. Un SSD de 256 GB alcanza si guardás todo en la nube; 512 GB es más cómodo.',
        ],
      },
      {
        h: 'Según tu carrera',
        p: [
          'Derecho, económicas, sociales, letras, psicología: navegador, Word, Excel, PDF y videollamadas. Con la configuración mínima andás bien; priorizá peso y batería.',
          'Ingeniería, sistemas, arquitectura: programas más pesados (AutoCAD, MATLAB, entornos de programación). Ryzen 5 o i5, 16 GB de RAM y 512 GB de SSD. Si usás modelado 3D o render, mirá la guía de notebook para editar video y diseño.',
          'Diseño gráfico, multimedia, cine: necesitás más potencia y buena pantalla; también está en la guía de video y diseño.',
        ],
      },
      {
        h: 'Peso, batería y pantalla',
        p: [
          'Si la llevás todos los días, una de 14 pulgadas pesa menos y entra en cualquier mochila. Las de 15,6 pulgadas son más cómodas para estar muchas horas y suelen traer teclado numérico (útil en Excel).',
          'Pedí pantalla Full HD (1920 x 1080). Las de 1366 x 768 se ven borrosas y entra menos en pantalla.',
          'Fijate que venga con Windows original o, si sabés usarlo, con Linux; una notebook "sin sistema" te obliga a comprar la licencia aparte.',
        ],
      },
    ],
    categoria: { slug: 'notebooks', nombre: 'notebooks' },
    equipos: {
      comparador: 'notebooks',
      titulo: 'Notebooks para estudiar (i3/Ryzen 3 o mejor, 8 GB, SSD), con el precio de hoy',
      minimos: { cpu: 2, ram: 8, disco: 256 },
      hasta: 1_500_000,
    },
    cta: { href: '/comparador/notebooks', titulo: 'Filtrá notebooks por procesador, RAM y disco', boton: 'Abrir el comparador de notebooks' },
    faq: [
      {
        q: '¿Cuánta RAM necesita una notebook para la facultad?',
        a: '8 GB como mínimo. Si estudiás ingeniería, sistemas o arquitectura, 16 GB.',
      },
      {
        q: '¿Sirve una notebook con Celeron para estudiar?',
        a: 'Para tareas muy básicas sí, pero se queda corta rápido, sobre todo si tiene memoria eMMC. Conviene estirarse a un i3 o Ryzen 3 con SSD.',
      },
      {
        q: '¿14 o 15,6 pulgadas para la facultad?',
        a: 'Si la llevás todos los días, 14 pulgadas por peso. Si la usás más en casa o trabajás con planillas, 15,6 pulgadas con teclado numérico.',
      },
    ],
    enlaces: [
      { href: '/mejor/notebook-hasta-1-millon', texto: 'Mejor notebook hasta $1 millón' },
      { href: '/vs/asus-vivobook-15-vs-lenovo-ideapad-slim-3', texto: 'Vivobook 15 vs IdeaPad Slim 3' },
      { href: '/vs/hp-255-g10-vs-acer-aspire-go-15', texto: 'HP 255 G10 vs Acer Aspire Go 15' },
      { href: '/guias/notebook-14-o-15-pulgadas', texto: '¿14 o 15 pulgadas?' },
      { href: '/guias/tablet-o-notebook-cual-conviene', texto: 'Tablet o notebook' },
      { href: '/comparador/notebooks', texto: 'Comparador de notebooks' },
    ],
  },
  {
    slug: 'que-notebook-comprar-para-programar',
    titulo: 'Qué notebook comprar para programar en 2026',
    descripcion:
      'Qué notebook conviene para programar: 16 GB de RAM, SSD de 512 GB, Ryzen 5/7 o Intel i5/i7, pantalla y teclado. Con las notebooks de hoy en Mercado Libre Argentina y su precio más bajo registrado.',
    pregunta: '¿Qué notebook conviene para programar?',
    respuestaCorta:
      'Para programar, lo que más importa es la RAM: 16 GB como mínimo, porque el editor, el navegador con documentación, Docker o un emulador de Android se comen la memoria. Sumale un procesador AMD Ryzen 5 o 7 (o Intel Core i5 o i7), SSD de 512 GB y pantalla Full HD. No hace falta placa de video dedicada, salvo que quieras trabajar con inteligencia artificial o desarrollar juegos.',
    secciones: [
      {
        h: 'RAM: el cuello de botella',
        p: [
          'Un editor como VS Code más un navegador con varias pestañas ya usa varios GB. Si le sumás Docker, una base de datos local o el emulador de Android Studio, 8 GB se quedan cortos enseguida.',
          '16 GB es el punto justo para la mayoría; 32 GB si trabajás con varios contenedores, máquinas virtuales o modelos de IA locales. Revisá si la RAM se puede ampliar: muchas notebooks delgadas la traen soldada.',
        ],
      },
      {
        h: 'Procesador y disco',
        p: [
          'Un Ryzen 5 o 7 de las series U recientes, o un Intel Core i5 o i7, compilan rápido y tienen buena batería. Más núcleos ayudan en compilaciones grandes y en contenedores.',
          'SSD de 512 GB: los proyectos, las dependencias (node_modules) y las imágenes de Docker ocupan más de lo que parece. Que sea NVMe si se puede.',
        ],
      },
      {
        h: 'Pantalla, teclado y sistema',
        p: [
          'Pantalla Full HD como mínimo: vas a pasar horas leyendo código. Un buen teclado (con recorrido cómodo y retroiluminado) se agradece más que cualquier spec.',
          'Windows con WSL te deja usar herramientas de Linux sin salir de Windows; también podés instalar Linux directo. Si vas a desarrollar apps para iPhone, necesitás una Mac.',
          'Para desarrollo de juegos o IA con GPU, mirá una notebook con placa NVIDIA RTX (en la guía de notebook gamer).',
        ],
      },
    ],
    categoria: { slug: 'notebooks', nombre: 'notebooks' },
    equipos: {
      comparador: 'notebooks',
      titulo: 'Notebooks para programar (Ryzen 5/i5 o mejor, 16 GB, 512 GB), con el precio de hoy',
      minimos: { cpu: 3, ram: 16, disco: 512 },
    },
    cta: { href: '/comparador/notebooks', titulo: 'Filtrá notebooks con 16 GB y 512 GB', boton: 'Abrir el comparador de notebooks' },
    faq: [
      {
        q: '¿Cuánta RAM necesito para programar?',
        a: '16 GB para la mayoría de los casos. 32 GB si usás varios contenedores de Docker, máquinas virtuales o modelos de IA locales.',
      },
      {
        q: '¿Necesito placa de video para programar?',
        a: 'No para desarrollo web, móvil o backend. Sí para desarrollo de juegos o para entrenar o correr modelos de IA en la notebook.',
      },
      {
        q: '¿Ryzen o Intel para programar?',
        a: 'Los dos sirven. A igual precio, los Ryzen 5 y 7 suelen dar más núcleos; los Intel Core i5 e i7 recientes rinden parecido. Fijate más en la RAM y el disco.',
      },
    ],
    enlaces: [
      { href: '/mejor/notebook-hasta-1-5-millones', texto: 'Mejor notebook hasta $1,5 millones' },
      { href: '/vs/hp-255-g10-vs-asus-vivobook-15', texto: 'HP 255 G10 vs Vivobook 15' },
      { href: '/vs/hp-255-g10-vs-acer-aspire-go-15', texto: 'HP 255 G10 vs Acer Aspire Go 15' },
      { href: '/guias/que-notebook-gamer-comprar', texto: 'Qué notebook gamer comprar' },
      { href: '/comparador/notebooks', texto: 'Comparador de notebooks' },
    ],
  },
  {
    slug: 'notebook-para-editar-video-y-diseno',
    titulo: 'Notebook para editar video y diseño gráfico: qué necesitás',
    descripcion:
      'Qué notebook comprar para editar video (Premiere, DaVinci) y hacer diseño (Photoshop, Illustrator, 3D): placa de video, RAM, pantalla y disco. Con las de hoy en Mercado Libre Argentina.',
    pregunta: '¿Qué notebook conviene para editar video y hacer diseño gráfico?',
    respuestaCorta:
      'Para editar video conviene una notebook con placa de video dedicada (una NVIDIA RTX), 16 GB de RAM o más (32 GB si editás en 4K) y SSD de 1 TB. Para diseño gráfico 2D (Photoshop, Illustrator) pesa más una buena pantalla con colores fieles y 16 GB de RAM. Las notebooks gamer con RTX suelen ser la opción con más potencia por peso invertido.',
    secciones: [
      {
        h: 'Video: la placa de video manda',
        p: [
          'Premiere Pro y DaVinci Resolve usan la placa de video para la vista previa, los efectos y la exportación. Con una RTX el timeline va fluido y exportás mucho más rápido que solo con el procesador.',
          'RAM: 16 GB para Full HD; 32 GB si editás en 4K o con muchas capas. Disco: 1 TB SSD, porque el material en bruto ocupa muchísimo (y conviene un disco externo para archivar).',
        ],
      },
      {
        h: 'Diseño 2D: la pantalla manda',
        p: [
          'Para Photoshop, Illustrator o Figma, la potencia que hace falta es moderada: un Ryzen 5 o 7 (o Intel i5 o i7) con 16 GB alcanza.',
          'Lo importante es la pantalla: que sea IPS u OLED y que cubra bien el espacio de color sRGB (en la ficha figura como "100 % sRGB"). Las pantallas básicas se ven lavadas y vas a ver los colores distintos de como se imprimen.',
        ],
      },
      {
        h: '3D y render',
        p: [
          'Blender, SketchUp con render o 3ds Max necesitan placa de video dedicada y, si podés, 32 GB de RAM. Una notebook gamer con RTX es lo más razonable por precio.',
          'Ojo con la temperatura: en renders largos las notebooks finas bajan el rendimiento. Las gamer tienen mejor refrigeración.',
        ],
      },
    ],
    categoria: { slug: 'notebooks', nombre: 'notebooks' },
    equipos: {
      comparador: 'notebooks',
      titulo: 'Notebooks con RTX, OLED o 32 GB de RAM, con el precio de hoy',
      incluye: /rtx|oled|\b32 ?gb/,
      minimos: { ram: 16 },
    },
    cta: { href: '/comparador/notebooks', titulo: 'Filtrá notebooks por RAM, disco y uso gamer', boton: 'Abrir el comparador de notebooks' },
    faq: [
      {
        q: '¿Qué placa de video necesito para editar video?',
        a: 'Una NVIDIA RTX de las series recientes alcanza para editar en Full HD y 4K con Premiere o DaVinci Resolve. Sin placa dedicada se puede, pero la exportación es mucho más lenta.',
      },
      {
        q: '¿16 o 32 GB de RAM para editar video?',
        a: '16 GB para Full HD. 32 GB si editás en 4K, con muchas capas o efectos.',
      },
      {
        q: '¿Sirve una notebook gamer para diseño?',
        a: 'Sí, y suele ser la opción con más potencia por precio. Revisá que la pantalla tenga buena cobertura de color si hacés diseño gráfico.',
      },
    ],
    enlaces: [
      { href: '/vs/lenovo-loq-vs-hp-omen', texto: 'Lenovo LOQ vs HP OMEN' },
      { href: '/mejor/notebook-hasta-2-5-millones', texto: 'Mejor notebook hasta $2,5 millones' },
      { href: '/guias/que-notebook-gamer-comprar', texto: 'Qué notebook gamer comprar' },
      { href: '/guias/que-monitor-comprar', texto: 'Qué monitor comprar' },
      { href: '/comparador/notebooks', texto: 'Comparador de notebooks' },
    ],
  },
  {
    slug: 'notebook-14-o-15-pulgadas',
    titulo: 'Notebook de 14 o 15,6 pulgadas: cuál conviene',
    descripcion:
      'Diferencias entre una notebook de 14 y una de 15,6 pulgadas: peso, teclado numérico, pantalla, batería y precio. Con las notebooks de 14" de hoy en Mercado Libre Argentina.',
    pregunta: '¿Conviene una notebook de 14 o de 15,6 pulgadas?',
    respuestaCorta:
      'Si la llevás todos los días (facultad, oficina, viajes), conviene una de 14 pulgadas: pesa menos, ocupa menos y suele tener mejor batería. Si la usás casi siempre en el mismo lugar o trabajás mucho con planillas, la de 15,6 pulgadas es más cómoda por pantalla y teclado numérico, y a igual procesador suele salir algo menos.',
    secciones: [
      {
        h: 'Peso y tamaño',
        p: [
          'Una de 14 pulgadas suele pesar alrededor de 1,3 a 1,5 kg; una de 15,6 pulgadas, de 1,6 a 1,8 kg. Parece poco, pero se nota en la mochila todos los días.',
          'La de 14 entra en mochilas y mesas chicas (el bondi, la biblioteca, el bar). La de 15,6 necesita una mochila para notebook de ese tamaño.',
        ],
      },
      {
        h: 'Pantalla y teclado',
        p: [
          'La de 15,6 pulgadas muestra más contenido y es mejor para tener dos ventanas lado a lado. Casi todas traen teclado numérico, útil para Excel y contabilidad.',
          'En 14 pulgadas, la resolución importa más: pedí Full HD como mínimo. Algunas traen pantalla 16:10 o 2K, que compensan el tamaño menor.',
        ],
      },
      {
        h: 'Precio y alternativa',
        p: [
          'A igual procesador, RAM y disco, la de 15,6 pulgadas suele ser más barata porque hay más modelos de entrada en ese tamaño. Las de 14 pulgadas livianas cuestan algo más.',
          'Si querés lo mejor de los dos: una de 14 pulgadas para llevar y un monitor externo en casa. La lista de abajo muestra las de 14" de hoy; las de 15,6" están en el comparador.',
        ],
      },
    ],
    categoria: { slug: 'notebooks', nombre: 'notebooks' },
    equipos: {
      comparador: 'notebooks',
      titulo: 'Notebooks de 14 pulgadas, con el precio de hoy',
      incluye: /\b14\b|x1404|al14|14-h/,
      minimos: { ram: 8 },
    },
    cta: { href: '/comparador/notebooks', titulo: 'Todas las notebooks de hoy, de 14 y de 15,6 pulgadas', boton: 'Abrir el comparador de notebooks' },
    faq: [
      {
        q: '¿Cuánto pesa una notebook de 14 pulgadas?',
        a: 'En general entre 1,3 y 1,5 kg, contra 1,6 a 1,8 kg de una de 15,6 pulgadas. El peso exacto figura en la ficha de cada modelo.',
      },
      {
        q: '¿Las notebooks de 14 pulgadas tienen teclado numérico?',
        a: 'Casi nunca. Si lo necesitás, buscá una de 15,6 pulgadas o sumá un teclado numérico USB.',
      },
      {
        q: '¿Qué es mejor para estudiar, 14 o 15,6 pulgadas?',
        a: 'Si la llevás a cursar todos los días, 14 pulgadas. Si estudiás en casa, 15,6 pulgadas por pantalla y comodidad.',
      },
    ],
    enlaces: [
      { href: '/vs/asus-vivobook-14-vs-asus-vivobook-15', texto: 'Vivobook 14 vs Vivobook 15' },
      { href: '/vs/hp-omnibook-3-vs-asus-vivobook-14', texto: 'HP OmniBook 3 vs Vivobook 14' },
      { href: '/guias/notebook-para-la-facultad', texto: 'Notebook para la facultad' },
      { href: '/mejor/notebook-hasta-1-2-millones', texto: 'Mejor notebook hasta $1,2 millones' },
      { href: '/comparador/notebooks', texto: 'Comparador de notebooks' },
    ],
  },
  {
    slug: 'smart-tv-para-ps5',
    titulo: 'Smart TV para jugar a la PS5 o Xbox: qué mirar (y qué es marketing)',
    descripcion:
      'Qué smart TV conviene para PS5 o Xbox Series: 4K, HDR, 120 Hz nativos, HDMI 2.1, VRR y modo juego. Con los TV QLED y Mini LED de hoy en Mercado Libre Argentina y su precio más bajo registrado.',
    pregunta: '¿Qué smart TV conviene para jugar a la PS5?',
    respuestaCorta:
      'Para la PS5 o la Xbox Series conviene un TV 4K de 50 pulgadas o más con HDR y modo juego (ALLM) para tener poco retraso. Si querés jugar a 120 cuadros por segundo, necesitás un panel de 120 Hz nativos con HDMI 2.1, que suele estar en los QLED y Mini LED de gama media para arriba. Un 4K común de 60 Hz anda bien para la mayoría de los juegos: lo que más vas a notar es el brillo y el contraste.',
    secciones: [
      {
        h: 'Lo básico: 4K, HDR y modo juego',
        p: [
          'La PS5 y la Xbox Series X juegan en 4K: con un TV Full HD desperdiciás buena parte de la consola. Desde 50 pulgadas, 4K es obligatorio.',
          'HDR mejora mucho los juegos, pero solo si el TV tiene brillo suficiente. En los LED básicos el HDR se ve apagado; en QLED y Mini LED se nota de verdad.',
          'El modo juego (ALLM) apaga el procesamiento de imagen y baja el retraso entre el joystick y la pantalla. Casi todos los TV actuales lo tienen; algunos lo destacan como "Modo de juego" en la publicación.',
        ],
      },
      {
        h: '120 Hz y HDMI 2.1: cuándo importan',
        p: [
          'Muchos juegos de PS5 tienen un modo de 120 cuadros por segundo. Para aprovecharlo, el TV necesita panel de 120 Hz nativos y una entrada HDMI 2.1.',
          'Cuidado con el marketing: "Motion Rate 120" o "120 Hz" con tecnologías de interpolación no es lo mismo que 120 Hz nativos. Buscá en la ficha la frecuencia de actualización nativa y si alguna entrada HDMI es 2.1.',
          'VRR (frecuencia variable) evita cortes en la imagen cuando el juego baja de cuadros. Viene junto con HDMI 2.1 en la mayoría de los modelos.',
        ],
      },
      {
        h: 'Qué tamaño y qué panel',
        p: [
          'Para un living común (2 a 2,5 metros del sillón), 55 pulgadas es el punto justo para jugar. A 3 metros o más, 65 pulgadas.',
          'QLED y Mini LED dan más brillo y mejor HDR que un LED común; OLED da el mejor contraste y el menor retraso, pero cuesta más. La lista de abajo muestra los QLED y Mini LED 4K de 50" o más de hoy.',
        ],
      },
    ],
    categoria: { slug: 'smart-tv', nombre: 'smart TV' },
    equipos: {
      comparador: 'smart-tv',
      titulo: 'TV 4K QLED y Mini LED de 50" o más, con el precio de hoy',
      minimos: { resolucion: 3, pulgadas: 50, panel: 2 },
    },
    cta: { href: '/comparador/smart-tv', titulo: 'Filtrá smart TV por tamaño, 4K y panel', boton: 'Abrir el comparador de smart TV' },
    faq: [
      {
        q: '¿Necesito HDMI 2.1 para la PS5?',
        a: 'Solo para jugar a 120 cuadros por segundo en 4K y usar VRR. Para jugar en 4K a 60 o 30 cuadros, cualquier HDMI 2.0 alcanza.',
      },
      {
        q: '¿Un TV 4K de 60 Hz sirve para la PS5?',
        a: 'Sí. La mayoría de los juegos funcionan a 60 o 30 cuadros por segundo. Lo que te perdés es el modo de 120 cuadros de algunos juegos.',
      },
      {
        q: '¿QLED u OLED para jugar?',
        a: 'OLED tiene el mejor contraste y menor retraso; QLED y Mini LED tienen más brillo y suelen costar menos. Para un living luminoso, QLED o Mini LED.',
      },
    ],
    enlaces: [
      { href: '/mejor/smart-tv-hasta-1-millon', texto: 'Mejor smart TV hasta $1 millón' },
      { href: '/guias/led-qled-u-oled-diferencias-smart-tv', texto: 'LED, QLED u OLED' },
      { href: '/guias/de-cuantas-pulgadas-comprar-el-smart-tv', texto: 'De cuántas pulgadas comprar el TV' },
      { href: '/precio-hoy/smart-tv-55-pulgadas', texto: 'Precio de un smart TV de 55" hoy' },
      { href: '/comparador/smart-tv', texto: 'Comparador de smart TV' },
    ],
  },
  {
    slug: 'de-cuantas-pulgadas-comprar-el-smart-tv',
    titulo: 'De cuántas pulgadas comprar el smart TV según la distancia',
    descripcion:
      'Qué tamaño de smart TV conviene según la distancia al sillón: tabla de pulgadas por metros para 4K y Full HD, cuánto mide cada TV y qué mirar antes de comprar. Con los precios de hoy en Mercado Libre.',
    pregunta: '¿De cuántas pulgadas tiene que ser el televisor según la distancia?',
    respuestaCorta:
      'Con un TV 4K, la regla práctica es sentarse a una distancia de 1 a 1,5 veces la diagonal de la pantalla: a 1,5 metros va un 43", a 2 metros un 50" o 55", a 2,5 metros un 55" o 65" y a 3 metros o más un 65" o 75". Con un Full HD conviene alejarse un poco más o elegir un tamaño menor. En la duda, la mayoría de la gente se arrepiente de haber comprado chico, no grande.',
    secciones: [
      {
        h: 'Tabla rápida: pulgadas según la distancia (TV 4K)',
        p: [
          'Hasta 1,5 metros (dormitorio, cocina): 32" a 43".',
          'De 1,5 a 2 metros: 43" a 50".',
          'De 2 a 2,5 metros (living chico o mediano): 50" a 55".',
          'De 2,5 a 3 metros: 55" a 65".',
          'Más de 3 metros: 65" a 75" o más.',
          'La cuenta: la diagonal en centímetros es pulgadas × 2,54. Un 55" mide unos 140 cm de diagonal; a 1,5 veces eso (2,1 m) se ve toda la pantalla sin mover la cabeza.',
        ],
      },
      {
        h: '4K o Full HD cambia la distancia',
        p: [
          'En un TV 4K podés sentarte más cerca sin ver los puntos de la imagen. En Full HD, a la misma distancia, un TV grande se ve menos nítido: por eso hasta 43" el Full HD alcanza y desde 50" conviene 4K.',
          'El contenido también cuenta: el fútbol y las series en 4K aprovechan una pantalla grande; la TV de aire en definición estándar se ve peor cuanto más grande es la pantalla.',
        ],
      },
      {
        h: 'Antes de comprar: medí el mueble y la pared',
        p: [
          'El ancho real de un TV es aproximadamente la diagonal × 0,87: un 55" mide unos 122 cm de ancho y un 65" unos 144 cm (sin contar el marco ni las patas). Confirmalo en la ficha de cada modelo.',
          'Si va sobre un mueble, chequeá dónde van las patas: en muchos modelos están en los extremos y necesitan un mueble casi tan ancho como el TV. Si lo vas a colgar, mirá la medida VESA para elegir el soporte.',
        ],
      },
    ],
    categoria: { slug: 'smart-tv', nombre: 'smart TV' },
    equipos: {
      comparador: 'smart-tv',
      titulo: 'Smart TV de 43" a 75", con el precio de hoy',
      minimos: { resolucion: 2, pulgadas: 43 },
      max: 8,
    },
    cta: { href: '/comparador/smart-tv', titulo: 'Filtrá smart TV por pulgadas y resolución', boton: 'Abrir el comparador de smart TV' },
    faq: [
      {
        q: '¿Qué tamaño de TV conviene para 2 metros de distancia?',
        a: 'Con un TV 4K, entre 50 y 55 pulgadas.',
      },
      {
        q: '¿Cuánto mide de ancho un TV de 55 pulgadas?',
        a: 'Unos 122 cm de ancho y 68 cm de alto de pantalla, más el marco. La medida exacta está en la ficha de cada modelo.',
      },
      {
        q: '¿Un TV muy grande cansa la vista?',
        a: 'No si respetás la distancia: con 4K, sentate a 1 a 1,5 veces la diagonal. Lo que cansa es el brillo muy alto en un cuarto oscuro.',
      },
    ],
    enlaces: [
      { href: '/precio-hoy/smart-tv-43-pulgadas', texto: 'Precio de un smart TV de 43" hoy' },
      { href: '/precio-hoy/smart-tv-50-pulgadas', texto: 'Precio de un smart TV de 50" hoy' },
      { href: '/precio-hoy/smart-tv-55-pulgadas', texto: 'Precio de un smart TV de 55" hoy' },
      { href: '/precio-hoy/smart-tv-65-pulgadas', texto: 'Precio de un smart TV de 65" hoy' },
      { href: '/mejor/smart-tv-hasta-800-mil', texto: 'Mejor smart TV hasta $800 mil' },
      { href: '/comparador/smart-tv', texto: 'Comparador de smart TV' },
    ],
  },
  {
    slug: 'google-tv-roku-tizen-o-webos-cual-conviene',
    titulo: 'Google TV, Roku, Tizen o webOS: qué sistema de smart TV conviene',
    descripcion:
      'Diferencias entre los sistemas de los smart TV en Argentina: Google TV, Android TV, Roku, Tizen (Samsung), webOS (LG) y Vidaa. Apps, Chromecast, control por voz y actualizaciones. Con precios de hoy.',
    pregunta: '¿Qué sistema operativo de smart TV es mejor?',
    respuestaCorta:
      'Google TV es el que tiene más apps y trae Chromecast integrado para mandar videos desde el celular; lo usan TCL, Philips, Noblex, BGH y Philco, entre otros. Roku es el más simple y rápido en TV económicos. Tizen (Samsung) y webOS (LG) son muy fluidos y vienen solo en esas marcas. Antes de comprar, confirmá que esté la app que más usás (por ejemplo la de tu cable o un servicio local).',
    secciones: [
      {
        h: 'Google TV y Android TV',
        p: [
          'Tienen la tienda de apps más completa (Google Play) y Chromecast integrado: mandás un video de YouTube o una serie desde el celular con un toque. El control por voz usa el Asistente de Google.',
          'Google TV es la versión nueva de Android TV, con una pantalla de inicio que recomienda contenido de todas tus apps. En TV muy baratos puede andar algo más lento.',
        ],
      },
      {
        h: 'Roku',
        p: [
          'Es el más simple: una pantalla de inicio con las apps en cuadraditos y un control sin vueltas. Anda fluido incluso en TV económicos (en Argentina lo usan, por ejemplo, algunos Noblex).',
          'Tiene las apps de streaming principales; para mandar videos desde el celular usa su propia app y es compatible con AirPlay en muchos modelos.',
        ],
      },
      {
        h: 'Tizen (Samsung) y webOS (LG)',
        p: [
          'Son los sistemas propios de Samsung y LG: rápidos, bien optimizados y con las apps principales. El control remoto de LG (Magic Remote) funciona como un puntero.',
          'Tienen menos apps que Google TV, pero las grandes están todas. No traen Chromecast integrado, aunque sí AirPlay en muchos modelos recientes.',
        ],
      },
      {
        h: 'Vidaa, Whale y otros',
        p: [
          'Vidaa (Hisense y algunos Noblex y Enova) y Whale TV vienen en TV económicos. Funcionan, pero tienen menos apps: verificá que estén las que usás antes de comprar.',
          'Si el TV que te gusta tiene un sistema limitado, un dispositivo de streaming externo (Chromecast con Google TV, Roku o un TV Box) lo resuelve por poca plata.',
        ],
      },
    ],
    categoria: { slug: 'smart-tv', nombre: 'smart TV' },
    equipos: {
      comparador: 'smart-tv',
      titulo: 'Smart TV con Google TV, Roku y Android, con el precio de hoy',
      incluye: /google tv|roku|android|tizen|webos|vidaa/,
      minimos: { pulgadas: 40 },
    },
    cta: { href: '/comparador/smart-tv', titulo: 'Compará los smart TV de hoy con su sistema', boton: 'Abrir el comparador de smart TV' },
    faq: [
      {
        q: '¿Qué es mejor, Google TV o Roku?',
        a: 'Google TV tiene más apps y Chromecast integrado; Roku es más simple y anda muy fluido en TV económicos. Si usás mucho el celular para mandar videos, Google TV.',
      },
      {
        q: '¿Los Samsung tienen Google TV?',
        a: 'No. Los smart TV Samsung usan Tizen, su sistema propio, y los LG usan webOS. Los dos tienen las apps de streaming principales.',
      },
      {
        q: '¿Qué hago si mi TV no tiene una app?',
        a: 'Podés sumarle un dispositivo de streaming (Chromecast con Google TV, Roku o un TV Box) por HDMI, o mandar el video desde el celular si el TV tiene Chromecast o AirPlay.',
      },
    ],
    enlaces: [
      { href: '/guias/que-smart-tv-comprar', texto: 'Qué smart TV comprar' },
      { href: '/guias/led-qled-u-oled-diferencias-smart-tv', texto: 'LED, QLED u OLED' },
      { href: '/mejor/smart-tv-hasta-600-mil', texto: 'Mejor smart TV hasta $600 mil' },
      { href: '/precio-hoy/smart-tv-43-pulgadas', texto: 'Precio de un smart TV de 43" hoy' },
      { href: '/comparador/smart-tv', texto: 'Comparador de smart TV' },
    ],
  },
  {
    slug: 'conviene-esperar-al-cyber-monday-para-comprar-tecnologia',
    titulo: 'Tecnología en Cyber Monday 2026: ¿conviene esperar o comprar ahora?',
    descripcion:
      'Si conviene esperar al Cyber Monday 2026 (2 al 4 de noviembre) para comprar celular, notebook o smart TV en Argentina, o comprar ahora: cuotas, precios inflados y qué ya está en su mínimo hoy.',
    pregunta: '¿Conviene esperar al Cyber Monday para comprar tecnología?',
    respuestaCorta:
      'Conviene esperar si lo que querés no está hoy en su precio más bajo registrado y no lo necesitás ya: en el Cyber Monday 2026 (del 2 al 4 de noviembre) suelen sumarse cuotas sin interés y cupones que bajan el costo final de celulares, notebooks y TV. Si el equipo ya está en su mínimo, comprarlo ahora no te hace perder nada y evitás el riesgo de que se agote o de un "descuento" inflado. Antes de pagar, compará el precio contra el historial, no contra el "antes".',
    secciones: [
      {
        h: 'Qué cambia en el Cyber Monday para la tecnología',
        p: [
          'En el Cyber Monday argentino (lo organiza la CACE) se concentran las cuotas sin interés y los cupones de bancos y marcas. En equipos de ticket alto como un celular, una notebook o un TV, tener 6 o 12 cuotas sin interés vale tanto como un descuento.',
          'También aparecen más precios "de lista" inflados: el producto sube unos días antes y el porcentaje se ve grande. En nuestros datos, una parte importante de las ofertas tiene el descuento inflado.',
        ],
      },
      {
        h: 'Cuándo esperar y cuándo comprar ya',
        p: [
          'Esperá si el equipo hoy está lejos de su precio más bajo registrado, si no te urge y si vas a pagar en cuotas (es cuando más se notan las promos).',
          'Comprá ya si está en su mínimo registrado (la lista de abajo muestra los que hoy lo están), si lo necesitás para trabajar o estudiar, o si es un modelo que suele agotarse.',
          'Si sale un modelo nuevo (por ejemplo una generación nueva de iPhone o Galaxy), el anterior suele bajar: los duelos /vs muestran la diferencia de precio de hoy entre generaciones.',
        ],
      },
      {
        h: 'Cómo no caer en un descuento inflado',
        p: [
          'Mirá el historial del producto: si estuvo igual o más barato hace unas semanas, el "40 % OFF" no es real. En cada equipo de la lista ves el precio más bajo que registramos.',
          'Compará a igual memoria y procesador: muchas "ofertas" son la versión con menos memoria al precio de la otra.',
          'Calculá el costo final con cuotas y envío. Después del Cyber Monday viene el Black Friday (27 de noviembre): si no encontrás lo que buscás, hay otra oportunidad.',
        ],
      },
    ],
    equipos: {
      comparador: ['celulares', 'notebooks', 'smart-tv'],
      titulo: 'Tecnología que hoy está en su precio más bajo registrado',
      enMinimo: true,
      orden: 'precio-desc',
      max: 8,
    },
    cta: { href: '/cyber-monday/tecnologia', titulo: 'Tecnología en Cyber Monday 2026, comparada con el historial', boton: 'Ver tecnología del Cyber Monday 🎯' },
    faq: [
      {
        q: '¿Cuándo es el Cyber Monday 2026 en Argentina?',
        a: 'Del lunes 2 al miércoles 4 de noviembre de 2026. Lo organiza la Cámara Argentina de Comercio Electrónico (CACE).',
      },
      {
        q: '¿Bajan los celulares en el Cyber Monday?',
        a: 'Suelen sumar cuotas sin interés y cupones, que bajan el costo final. El precio base no siempre baja: comparalo con el historial antes de comprar.',
      },
      {
        q: '¿Qué conviene más, Cyber Monday o Black Friday para tecnología?',
        a: 'Depende del producto y de las promociones bancarias de cada evento. Lo seguro es mirar si el precio está en su mínimo registrado: si lo está, cualquiera de las dos fechas sirve.',
      },
    ],
    enlaces: [
      { href: '/cyber-monday/tecnologia', texto: 'Tecnología en Cyber Monday' },
      { href: '/guias/hot-sale-cyber-monday-o-dia-comun-cuando-comprar-en-mercado-libre', texto: 'Hot Sale, Cyber Monday o un día común' },
      { href: '/guias/que-celular-comprar-cyber-monday', texto: 'Qué celular comprar en Cyber Monday' },
      { href: '/guias/que-notebook-comprar-cyber-monday', texto: 'Qué notebook comprar en Cyber Monday' },
      { href: '/guias/como-saber-si-un-descuento-de-mercado-libre-es-real', texto: 'Cómo saber si un descuento es real' },
      { href: '/descuentos-inflados', texto: 'Descuentos inflados de hoy' },
    ],
  },
]

export const FECHAS_GUIAS_TECNO: Record<string, { publicada: string; modificada: string }> = Object.fromEntries(
  GUIAS_TECNO.map(g => [g.slug, { publicada: '2026-10-23', modificada: '2026-10-23' }]),
)
