// Guías «Qué X comprar en Black Friday 2026» (pedido del 23/11/2026). Mismo formato
// que el resto de las guías (lib/guias.ts), pero con `bf`: la página las arma con
// components/black-friday/GuiaBF.tsx, que muestra el recomendado arriba con el botón
// de afiliado, como las landings de lib/black-friday-landings.ts.
//
// Reglas (no re-litigar):
// - Respuesta directa arriba, en un párrafo que Google y los asistentes de IA puedan citar.
// - Solo productos y links de afiliado de los datos del repo (acá van solo los ids);
//   precio solo si se vio hace 7 días o menos (productosDeItems). Nunca se inventa.
// - Nada de porcentajes de descuento, precios tachados, «mínimo histórico» ni cupones.
// - Sin marcas BGH ni HP/OMEN/Victus.
// - seoTitulo ≤ 60 y seoDescripcion ≤ 158 caracteres.
import type { Guia } from './guias'

const FAQ_PRECIO = {
  q: '¿El precio es el mismo que en Mercado Libre?',
  a: 'Sí. Los botones llevan a la publicación de Mercado Libre con nuestro link de afiliado: pagás lo mismo que entrando directo. El precio puede cambiar, confirmalo ahí antes de comprar.',
}

const FAQ_FECHA = {
  q: '¿Cuándo es el Black Friday 2026 en Argentina?',
  a: 'El viernes 27 de noviembre de 2026. No tiene organizador oficial: cada tienda decide si se suma y por cuántos días.',
}

export const GUIAS_BF_2026: Guia[] = [
  {
    slug: 'que-notebook-comprar-black-friday-2026',
    titulo: 'Qué notebook comprar en Black Friday 2026',
    descripcion:
      'Qué notebook comprar en el Black Friday 2026 en Argentina: la Lenovo IdeaPad Slim 3 con Ryzen 5, 16 GB y 512 GB SSD para la mayoría, y cuál elegir para jugar o llevar.',
    seoTitulo: 'Qué notebook comprar en Black Friday 2026 (Argentina)',
    seoDescripcion:
      'Para la mayoría, la Lenovo IdeaPad Slim 3 con Ryzen 5, 16 GB de RAM y 512 GB SSD. Cuál conviene para estudiar, trabajar o jugar en el Black Friday del 27/11.',
    pregunta: '¿Qué notebook conviene comprar en el Black Friday 2026?',
    respuestaCorta:
      'Para la mayoría, la Lenovo IdeaPad Slim 3 con Ryzen 5, 16 GB de RAM y 512 GB de SSD: rinde de sobra para estudiar, trabajar y el uso diario durante años. Si preferís Intel, la Lenovo V15 Gen 5 con Core i5 y la misma memoria; para jugar o editar video, la Lenovo LOQ o la Asus TUF Gaming A15, que traen placa de video dedicada. El Black Friday 2026 en Argentina es el viernes 27 de noviembre.',
    bf: {
      landing: 'black-friday-notebooks',
      items: [
        { id: 'MLA77766168', nombre: 'Lenovo IdeaPad Slim 3', detalle: 'Ryzen 5 · 16 GB de RAM · 512 GB SSD', nota: 'La que recomendamos para la mayoría: estudio, oficina y uso diario.' },
        { id: 'MLA72201400', nombre: 'Lenovo V15 Gen 5', detalle: 'Intel Core i5 · 16 GB de RAM · 512 GB SSD', nota: 'La misma idea, con Intel.' },
        { id: 'MLA53659389', nombre: 'Lenovo IdeaPad Slim 3 táctil', detalle: 'Ryzen 7 8840HS · 16 GB de RAM · 512 GB SSD · Windows 11', nota: 'Más procesador y pantalla táctil.' },
        { id: 'MLA61813247', nombre: 'Asus Zenbook 14 OLED', detalle: 'Ryzen 7 8840HS · 16 GB de RAM · 1 TB SSD', nota: 'Para llevar a todos lados: 14" y pantalla OLED.' },
        { id: 'MLA54436970', nombre: 'Lenovo LOQ (gamer)', detalle: 'Core i5-12450HX · 16 GB · 512 GB SSD · RTX 3050 6 GB', nota: 'Para jugar y editar video.' },
        { id: 'MLA61270430', nombre: 'Asus TUF Gaming A15', detalle: 'Ryzen 7 7445HS · 16 GB · 512 GB SSD · RTX 3050 4 GB', nota: 'La otra gamer, de Asus.' },
      ],
    },
    tabla: {
      titulo: 'Cuál elegir según el uso',
      columnas: ['Uso', 'Qué buscar', 'De esta guía'],
      filas: [
        ['Estudio, oficina, uso diario', 'Ryzen 5 o Core i5, 16 GB de RAM, SSD de 512 GB', 'Lenovo IdeaPad Slim 3 (Ryzen 5) o Lenovo V15 Gen 5 (Core i5)'],
        ['Llevarla a todos lados', '14 pulgadas y poco peso', 'Asus Zenbook 14 OLED'],
        ['Más potencia sin ser gamer', 'Ryzen 7, 16 GB de RAM', 'Lenovo IdeaPad Slim 3 táctil (Ryzen 7)'],
        ['Jugar y editar video', 'Placa de video dedicada (RTX)', 'Lenovo LOQ o Asus TUF Gaming A15'],
      ],
    },
    secciones: [
      {
        h: 'Por qué la IdeaPad Slim 3 con Ryzen 5 va primero',
        p: [
          'Junta lo que más pesa para la mayoría: un procesador de gama media que rinde de sobra para navegar con muchas pestañas, videollamadas, Office y la facultad; 16 GB de RAM, para que no se ponga lenta en un par de años; y 512 GB de SSD, que arranca rápido y deja lugar para fotos y archivos.',
          'Es Lenovo, una marca con service en Argentina. Antes de pagar, mirá en la publicación si trae Windows o viene sin sistema operativo.',
        ],
      },
      {
        h: 'AMD o Intel',
        p: [
          'Para el uso de todos los días, un Ryzen 5 y un Core i5 de generaciones parecidas rinden muy parecido. Elegí por el resto: memoria, disco, pantalla y precio.',
          'Si la vas a usar enchufada en un escritorio, la Lenovo V15 Gen 5 con Core i5 es la alternativa directa a la IdeaPad.',
        ],
      },
      {
        h: 'Para jugar o editar video',
        p: [
          'Ahí sí hace falta placa de video dedicada. La Lenovo LOQ (RTX 3050 de 6 GB) y la Asus TUF Gaming A15 (RTX 3050 de 4 GB) corren juegos actuales en calidad media y sirven para editar video.',
          'Son más pesadas y la batería dura menos: si casi no vas a jugar, conviene una de las de arriba.',
        ],
      },
      {
        h: 'Antes de pagar en el Black Friday',
        p: [
          'Confirmá en la publicación el modelo exacto (procesador, RAM y disco), si trae Windows y si el vendedor da factura y garantía en Argentina.',
          'El precio puede cambiar de un día para el otro: miralo en Mercado Libre el mismo día que comprás.',
        ],
      },
    ],
    faq: [
      FAQ_FECHA,
      { q: '¿Alcanza con 8 GB de RAM?', a: 'Para uso básico sí, pero con 16 GB la notebook sigue andando bien en unos años. Todas las de esta guía tienen 16 GB.' },
      { q: '¿Qué notebook conviene para la facultad?', a: 'Una liviana con Ryzen 5 o Core i5, 16 GB de RAM y SSD, como la Lenovo IdeaPad Slim 3. Si la llevás todos los días, la Asus Zenbook 14 OLED pesa menos.' },
      FAQ_PRECIO,
    ],
    cta: { href: '/mejores/black-friday-notebooks', titulo: 'Las notebooks que elegimos para el Black Friday', boton: 'Ver las notebooks del Black Friday' },
    enlaces: [
      { href: '/mejores/black-friday-notebooks', texto: 'Notebooks del Black Friday 2026' },
      { href: '/mejores/black-friday-smart-tv', texto: 'Smart TV del Black Friday 2026' },
      { href: '/black-friday', texto: 'Todo el Black Friday 2026' },
      { href: '/guias/cuanta-ram-necesita-una-notebook', texto: 'Cuánta RAM necesita una notebook' },
      { href: '/guias/intel-core-i5-o-ryzen-5-cual-conviene', texto: 'Intel Core i5 o Ryzen 5' },
    ],
  },
  {
    slug: 'que-tv-50-pulgadas-comprar-black-friday-2026',
    titulo: 'Qué TV de 50 pulgadas comprar en Black Friday 2026',
    descripcion:
      'Qué smart TV de 50 pulgadas comprar en el Black Friday 2026 en Argentina: la Noblex 50" DV50X8580 4K con Google TV para la mayoría, y cuál elegir para mejor imagen.',
    seoTitulo: 'Qué TV de 50 pulgadas comprar en Black Friday 2026',
    seoDescripcion:
      'Para la mayoría, la Noblex 50" DV50X8580: 4K y Google TV. Cuándo conviene Samsung Mini LED, Hisense QLED o Philips en el Black Friday del 27/11 en Argentina.',
    pregunta: '¿Qué TV de 50 pulgadas conviene comprar en el Black Friday 2026?',
    respuestaCorta:
      'Para la mayoría, la Noblex 50" DV50X8580: 4K y Google TV, con las apps de siempre sin sumar otro aparato. Si querés mejor imagen, la Samsung 50" Mini LED M60H o la Hisense 50" QLED 50Q6; antes de comprar, confirmá que diga 4K (UHD), porque hay teles de 50" que son Full HD. El Black Friday 2026 en Argentina es el viernes 27 de noviembre.',
    bf: {
      landing: 'black-friday-smart-tv',
      items: [
        { id: 'MLA53221633', nombre: 'Noblex 50" DV50X8580', detalle: '4K · LED · Google TV', nota: 'La que recomendamos para la mayoría.' },
        { id: 'MLA80753446', nombre: 'Samsung 50" Mini LED M60H', detalle: 'Mini LED · HDR', nota: 'Mejor imagen, con Mini LED.' },
        { id: 'MLA46070992', nombre: 'Hisense 50" QLED 50Q6', detalle: '4K · QLED · Google TV', nota: 'QLED con Google TV.' },
        { id: 'MLA28001260', nombre: 'Samsung 50" Crystal UHD CU7000', detalle: '4K · LED', nota: 'La Samsung 4K más simple.' },
        { id: 'MLA81241799', nombre: 'Philips 50" QLED 50PQD8511', detalle: '4K · QLED · Ambilight · Titan OS', nota: 'Con luces de ambiente detrás de la pantalla.' },
        { id: 'MLAU5377814198', nombre: 'LG 50" Nano NU85', detalle: '4K · Nano · 50NU855BPSA', nota: 'La opción de LG.' },
      ],
    },
    tabla: {
      titulo: 'Las de 50" de esta guía',
      columnas: ['Modelo', 'Panel', 'Para quién'],
      filas: [
        ['Noblex DV50X8580', '4K LED, Google TV', 'La mayoría: series, deportes y apps'],
        ['Samsung M60H', 'Mini LED', 'Mejor imagen y más brillo'],
        ['Hisense 50Q6', '4K QLED, Google TV', 'Colores más vivos con Google TV'],
        ['Samsung CU7000', '4K LED', 'Quien prefiere Samsung'],
        ['Philips 50PQD8511', '4K QLED, Ambilight', 'Quien quiere luz de ambiente detrás'],
        ['LG 50NU855', '4K Nano', 'Quien prefiere LG'],
      ],
    },
    secciones: [
      {
        h: '¿50 pulgadas es tu medida?',
        p: [
          'Una de 50" queda bien mirando a 1,5 a 2,5 metros: dormitorio, living chico o monoambiente. Si el sillón está más lejos, mirá las de 55" o más.',
          'Medí el mueble o la pared: una de 50" mide alrededor de 1,1 m de ancho.',
        ],
      },
      {
        h: 'Por qué la Noblex DV50X8580 va primero',
        p: [
          'Es 4K y trae Google TV: Netflix, YouTube, Disney+ y el resto de las apps ya están, sin comprar un Chromecast o un TV Box aparte. Es lo que necesita la mayoría para ver series, películas y deportes.',
          'Noblex es una marca que se fabrica en Argentina, con service en el país.',
        ],
      },
      {
        h: '4K o Full HD',
        p: [
          'En 50 pulgadas, 4K (también dice UHD) se nota: la imagen es más nítida a la distancia de un living. Algunas de 50" baratas son Full HD; leé bien el título y la ficha antes de pagar.',
        ],
      },
      {
        h: 'LED, QLED o Mini LED',
        p: [
          'Una LED común alcanza para la mayoría. QLED da colores más vivos; Mini LED, además, controla mejor la luz y los negros, y se nota en películas oscuras y en partidos de día.',
          'Si la vas a usar con consola, fijate en la ficha si tiene modo juego.',
        ],
      },
      {
        h: 'Antes de pagar en el Black Friday',
        p: [
          'Confirmá el modelo exacto en la publicación (por ejemplo, DV50X8580), que sea 4K, la garantía oficial y el costo de envío. Si la vas a colgar, sumá un soporte de pared para 50".',
          'El precio puede cambiar de un día para el otro: miralo en Mercado Libre el mismo día que comprás.',
        ],
      },
    ],
    faq: [
      FAQ_FECHA,
      { q: '¿A qué distancia se mira una TV de 50 pulgadas?', a: 'De 1,5 a 2,5 metros, más o menos. Más lejos conviene una de 55" o más.' },
      { q: '¿Conviene Google TV o el sistema de la marca?', a: 'Los dos traen las apps más usadas. Google TV suma la búsqueda por voz de Google y Chromecast incorporado; si ya usás Android, te va a resultar conocido.' },
      FAQ_PRECIO,
    ],
    cta: { href: '/mejores/black-friday-smart-tv', titulo: 'Los smart TV que elegimos para el Black Friday', boton: 'Ver los smart TV del Black Friday' },
    enlaces: [
      { href: '/mejores/black-friday-smart-tv', texto: 'Smart TV del Black Friday 2026' },
      { href: '/mejores/black-friday-notebooks', texto: 'Notebooks del Black Friday 2026' },
      { href: '/black-friday', texto: 'Todo el Black Friday 2026' },
      { href: '/guias/que-smart-tv-comprar', texto: 'Qué smart TV comprar' },
    ],
  },
  // ── Lote del 24/11/2026 (bf-conv-2411) ─────────────────────────────────────────────
  {
    slug: 'que-freidora-de-aire-comprar-black-friday-2026',
    titulo: 'Qué freidora de aire comprar en Black Friday 2026',
    descripcion:
      'Qué freidora de aire comprar en el Black Friday 2026 en Argentina: la Philips XL Series de 6,2 litros para una familia, y cuál elegir si son más o si vivís solo.',
    seoTitulo: 'Qué freidora de aire comprar en Black Friday 2026',
    seoDescripcion:
      'Para una familia de 3 o 4, la Philips XL Series de 6,2 litros. Cuántos litros conviene y cuándo una de doble canasto, para el Black Friday del 27/11.',
    pregunta: '¿Qué freidora de aire conviene comprar en el Black Friday 2026?',
    respuestaCorta:
      'Para una familia de 3 o 4 personas, la Philips XL Series de 6,2 litros: alcanza para cocinar para todos de una vez. Si son más o querés hacer dos cosas al mismo tiempo, la Novohome de doble canasto (6 + 6 litros); para 1 o 2 personas alcanza una de 4,5 litros, como la Daewoo DAF1857. El Black Friday 2026 en Argentina es el viernes 27 de noviembre.',
    bf: {
      landing: 'black-friday-freidoras-de-aire',
      items: [
        { id: 'MLA54262263', nombre: 'Philips XL Series 6,2 L', detalle: 'Freidora de aire · 6,2 litros · negra · PHNA13000', nota: 'La que recomendamos para una familia de 3 o 4 personas.' },
        { id: 'MLA51421298', nombre: 'Novohome doble canasto 12 L', detalle: 'Dos canastos de 6 litros · panel táctil', nota: 'Dos comidas distintas al mismo tiempo.' },
        { id: 'MLA23078273', nombre: 'Electrolux Experience EAF90 12 L', detalle: 'Freidora de aire · 12 litros · grafito', nota: 'Grande: para familias numerosas.' },
        { id: 'MLA41829394', nombre: 'Peabody PE-AFD720N 7,2 L', detalle: '7,2 litros · visor · 11 programas · negra', nota: 'Con visor para ver la comida sin abrir.' },
        { id: 'MLA27351841', nombre: 'Atma Pro FR60AR 6,5 L', detalle: 'Digital · 6,5 litros · blanca' },
        { id: 'MLA24096771', nombre: 'Daewoo DAF1857 4,5 L', detalle: '4,5 litros · 1400 W · negra', nota: 'Para 1 o 2 personas.' },
      ],
    },
    tabla: {
      titulo: 'Cuántos litros según la casa',
      columnas: ['Personas', 'Litros', 'De esta guía'],
      filas: [
        ['1 o 2', '3 a 4,5 litros', 'Daewoo DAF1857 (4,5 L)'],
        ['3 o 4', '6 a 7 litros', 'Philips XL Series (6,2 L), Atma Pro FR60AR (6,5 L) o Peabody (7,2 L)'],
        ['5 o más', '10 a 12 litros', 'Electrolux EAF90 (12 L)'],
        ['Dos comidas a la vez', 'Doble canasto', 'Novohome doble canasto (6 + 6 L)'],
      ],
    },
    secciones: [
      {
        h: 'Por qué la Philips XL Series va primero',
        p: [
          'Con 6,2 litros entra comida para 3 o 4 personas en una sola tanda, que es lo que más se usa en una casa. Es de una marca con service en Argentina y repuestos fáciles de conseguir.',
          'Si casi siempre cocinás para 1 o 2, una más chica ocupa menos lugar y calienta más rápido.',
        ],
      },
      {
        h: 'Doble canasto o uno grande',
        p: [
          'El doble canasto sirve para hacer dos cosas distintas a la vez, por ejemplo papas y milanesas, cada una con su temperatura. Un canasto grande, como el de la Electrolux de 12 litros, conviene para un pollo entero o tandas grandes de lo mismo.',
        ],
      },
      {
        h: 'Antes de pagar en el Black Friday',
        p: [
          'Medí la mesada: las de 10 litros o más son altas y anchas. Confirmá en la publicación los litros reales del canasto y si es apto lavavajillas.',
          'El precio puede cambiar de un día para el otro: miralo en Mercado Libre el mismo día que comprás.',
        ],
      },
    ],
    faq: [
      FAQ_FECHA,
      { q: '¿Cuántos litros de freidora de aire necesito?', a: 'Como referencia, 3 a 4,5 litros para 1 o 2 personas, 6 a 7 litros para 3 o 4 y 10 litros o más si son muchos o querés hacer un pollo entero.' },
      { q: '¿Gasta mucha luz una freidora de aire?', a: 'Consume entre 1400 y 2200 W mientras calienta, pero cocina en pocos minutos. Para porciones chicas suele gastar menos que prender el horno eléctrico.' },
      FAQ_PRECIO,
    ],
    cta: { href: '/mejores/black-friday-freidoras-de-aire', titulo: 'Las freidoras de aire que elegimos para el Black Friday', boton: 'Ver las freidoras del Black Friday' },
    enlaces: [
      { href: '/mejores/black-friday-freidoras-de-aire', texto: 'Freidoras de aire del Black Friday 2026' },
      { href: '/mejores/black-friday-cafeteras', texto: 'Cafeteras del Black Friday 2026' },
      { href: '/black-friday', texto: 'Todo el Black Friday 2026' },
      { href: '/guias/freidora-de-aire-cuantos-litros-conviene', texto: 'Cuántos litros de freidora conviene' },
    ],
  },
  {
    slug: 'que-tablet-comprar-black-friday-2026',
    titulo: 'Qué tablet comprar en Black Friday 2026',
    descripcion:
      'Qué tablet comprar en el Black Friday 2026 en Argentina: la Samsung Galaxy Tab S10 Lite para la mayoría, el iPad 11 si usás iPhone y la Redmi Pad 7 si querés más memoria.',
    seoTitulo: 'Qué tablet comprar en Black Friday 2026 (Argentina)',
    seoDescripcion:
      'Para la mayoría, la Samsung Galaxy Tab S10 Lite. Cuándo conviene el iPad 11, la Xiaomi Redmi Pad 7 o una Lenovo con lápiz en el Black Friday del 27/11.',
    pregunta: '¿Qué tablet conviene comprar en el Black Friday 2026?',
    respuestaCorta:
      'Para la mayoría, la Samsung Galaxy Tab S10 Lite de 128 GB y 6 GB de RAM: pantalla de 10,9 pulgadas para series, estudio y videollamadas. Si usás iPhone, el iPad 11 (A16) de 128 GB; si querés más memoria por menos, la Xiaomi Redmi Pad 7 de 256 GB. El Black Friday 2026 en Argentina es el viernes 27 de noviembre.',
    bf: {
      landing: 'black-friday-tablets',
      items: [
        { id: 'MLA61965090', nombre: 'Samsung Galaxy Tab S10 Lite', detalle: '128 GB · 6 GB de RAM · 10,9"', nota: 'La que recomendamos para la mayoría.' },
        { id: 'MLA57493504', nombre: 'Apple iPad 11 (A16)', detalle: '11" · 128 GB · 6 GB de RAM · rosa', nota: 'Si ya usás iPhone.' },
        { id: 'MLA50195168', nombre: 'Xiaomi Redmi Pad 7', detalle: '11,2" · 256 GB · 8 GB de RAM · gris', nota: 'La que más memoria trae.' },
        { id: 'MLA61753207', nombre: 'Lenovo Idea Tab 11 2.5K', detalle: '128 GB · 8 GB de RAM · con lápiz y funda', nota: 'Viene con lápiz: para tomar apuntes.' },
        { id: 'MLA59138771', nombre: 'Samsung Galaxy Tab S10 FE+', detalle: '13,1" · 128 GB · 8 GB de RAM · con lápiz', nota: 'Pantalla grande, para dibujar o trabajar.' },
        { id: 'MLA65189679', nombre: 'Samsung Galaxy Tab A11', detalle: '8,7" · 64 GB · 4 GB de RAM · wifi', nota: 'Chica: para leer o para chicos.' },
      ],
    },
    tabla: {
      titulo: 'Cuál elegir según el uso',
      columnas: ['Uso', 'Qué buscar', 'De esta guía'],
      filas: [
        ['Series, estudio, videollamadas', '10 u 11 pulgadas, 128 GB', 'Samsung Galaxy Tab S10 Lite'],
        ['Si tenés iPhone', 'iPadOS, misma cuenta de Apple', 'iPad 11 (A16)'],
        ['Mucha memoria', '256 GB y 8 GB de RAM', 'Xiaomi Redmi Pad 7'],
        ['Tomar apuntes', 'Lápiz incluido', 'Lenovo Idea Tab 11 o Galaxy Tab S10 FE+'],
        ['Leer o para chicos', '8 a 9 pulgadas, liviana', 'Samsung Galaxy Tab A11'],
      ],
    },
    secciones: [
      {
        h: 'Por qué la Galaxy Tab S10 Lite va primero',
        p: [
          'Tiene el tamaño que más se usa (10,9 pulgadas), 128 GB para apps, fotos y series descargadas, y 6 GB de RAM para pasar de una app a otra sin que se trabe. Samsung tiene service en Argentina.',
          'Si la querés para dibujar o tomar apuntes, mirá en la publicación si viene con lápiz: algunas versiones lo traen.',
        ],
      },
      {
        h: 'iPad o Android',
        p: [
          'Si ya usás iPhone, el iPad comparte fotos, mensajes y apps con tu celular sin hacer nada. Con un celular Android, una Samsung, Xiaomi o Lenovo se llevan mejor y suelen dar más memoria por la misma plata.',
        ],
      },
      {
        h: 'Antes de pagar en el Black Friday',
        p: [
          'Confirmá en la publicación la memoria (64, 128 o 256 GB), si es la versión wifi o con chip y si trae lápiz o funda.',
          'El precio puede cambiar de un día para el otro: miralo en Mercado Libre el mismo día que comprás.',
        ],
      },
    ],
    faq: [
      FAQ_FECHA,
      { q: '¿Cuánta memoria necesita una tablet?', a: '128 GB alcanzan para la mayoría. Con 64 GB se llena rápido si descargás series o juegos; 256 GB si la vas a usar mucho para fotos y videos.' },
      { q: '¿Tablet o notebook para estudiar?', a: 'La tablet es mejor para leer, mirar clases y tomar apuntes con lápiz. Si vas a escribir trabajos largos o usar programas de la facultad, conviene una notebook.' },
      FAQ_PRECIO,
    ],
    cta: { href: '/mejores/black-friday-tablets', titulo: 'Las tablets que elegimos para el Black Friday', boton: 'Ver las tablets del Black Friday' },
    enlaces: [
      { href: '/mejores/black-friday-tablets', texto: 'Tablets del Black Friday 2026' },
      { href: '/mejores/black-friday-notebooks', texto: 'Notebooks del Black Friday 2026' },
      { href: '/black-friday', texto: 'Todo el Black Friday 2026' },
      { href: '/guias/tablet-o-notebook-cual-conviene', texto: 'Tablet o notebook, cuál conviene' },
    ],
  },
  {
    slug: 'que-smartwatch-comprar-black-friday-2026',
    titulo: 'Qué smartwatch comprar en Black Friday 2026',
    descripcion:
      'Qué smartwatch comprar en el Black Friday 2026 en Argentina: el Huawei Watch GT 7 si querés que ande con Android y iPhone, el Apple Watch SE 3 con iPhone y el Galaxy Watch9 con Samsung.',
    seoTitulo: 'Qué smartwatch comprar en Black Friday 2026',
    seoDescripcion:
      'Huawei Watch GT 7, Apple Watch SE 3, Galaxy Watch9 o Garmin: cuál conviene según tu celular y para qué lo usás, para el Black Friday del 27/11.',
    pregunta: '¿Qué smartwatch conviene comprar en el Black Friday 2026?',
    respuestaCorta:
      'Si querés uno que funcione con Android y con iPhone y que la batería dure varios días, el Huawei Watch GT 7 de 46 mm, con GPS y NFC. Con iPhone, el Apple Watch SE 3 es el que mejor se integra; con un celular Samsung, el Galaxy Watch9, y para correr, el Garmin Forerunner 170 Music. El Black Friday 2026 en Argentina es el viernes 27 de noviembre.',
    bf: {
      landing: 'black-friday-smartwatch',
      items: [
        { id: 'MLA77843334', nombre: 'Huawei Watch GT 7 46 mm', detalle: 'GPS · NFC · bluetooth · Android e iOS', nota: 'El que recomendamos: anda con Android y con iPhone.' },
        { id: 'MLA54110750', nombre: 'Apple Watch SE 3 44 mm', detalle: 'GPS · caja de aluminio · blanco estelar', nota: 'Para iPhone.' },
        { id: 'MLA75492569', nombre: 'Samsung Galaxy Watch9 44 mm', detalle: 'Bluetooth · resistente al agua 5ATM · grafito', nota: 'Para celulares Samsung.' },
        { id: 'MLA70715360', nombre: 'Garmin Forerunner 170 Music', detalle: 'GPS · pantalla AMOLED · música', nota: 'Para correr.' },
        { id: 'MLA43283375', nombre: 'Amazfit T-Rex 3', detalle: 'GPS · mapas sin conexión · 10 ATM', nota: 'Resistente, para aire libre.' },
        { id: 'MLA39368735', nombre: 'Huawei Watch GT 5 41 mm', detalle: 'Caja de 41 mm · para correr y bici', nota: 'Más chico, para muñecas finas.' },
      ],
    },
    tabla: {
      titulo: 'Cuál elegir según tu celular y el uso',
      columnas: ['Situación', 'Qué buscar', 'De esta guía'],
      filas: [
        ['Android o iPhone, batería larga', 'Que ande con los dos sistemas', 'Huawei Watch GT 7'],
        ['Tenés iPhone', 'Integración con el iPhone', 'Apple Watch SE 3'],
        ['Tenés un Samsung', 'Integración con Galaxy', 'Samsung Galaxy Watch9'],
        ['Correr', 'GPS y métricas de entrenamiento', 'Garmin Forerunner 170 Music'],
        ['Aire libre, trekking', 'Resistente y mapas sin conexión', 'Amazfit T-Rex 3'],
      ],
    },
    secciones: [
      {
        h: 'Primero, tu celular',
        p: [
          'El Apple Watch solo funciona con iPhone. El Galaxy Watch anda con cualquier Android, pero saca más jugo con un Samsung. Huawei, Garmin y Amazfit funcionan con Android y con iPhone.',
        ],
      },
      {
        h: 'Por qué el Huawei Watch GT 7 va primero',
        p: [
          'Sirve para casi todos: anda con los dos sistemas, trae GPS para salir a correr sin el celular y la batería dura varios días, así que no hay que cargarlo todas las noches.',
          'Si tenés iPhone y querés responder mensajes y usar apps desde el reloj, el Apple Watch SE 3 hace más cosas, a cambio de cargarlo casi todos los días.',
        ],
      },
      {
        h: 'Antes de pagar en el Black Friday',
        p: [
          'Confirmá el tamaño de la caja (40 a 42 mm para muñecas finas, 44 a 46 mm para el resto) y si es la versión con GPS o con LTE.',
          'El precio puede cambiar de un día para el otro: miralo en Mercado Libre el mismo día que comprás.',
        ],
      },
    ],
    faq: [
      FAQ_FECHA,
      { q: '¿El Apple Watch funciona con Android?', a: 'No. Necesita un iPhone para configurarse y usarse. Con Android conviene un Galaxy Watch, un Huawei, un Garmin o un Amazfit.' },
      { q: '¿Cuánto dura la batería de un smartwatch?', a: 'Depende del modelo: el Apple Watch y el Galaxy Watch suelen pedir carga casi diaria; los Huawei, Garmin y Amazfit duran varios días.' },
      FAQ_PRECIO,
    ],
    cta: { href: '/mejores/black-friday-smartwatch', titulo: 'Los smartwatch que elegimos para el Black Friday', boton: 'Ver los smartwatch del Black Friday' },
    enlaces: [
      { href: '/mejores/black-friday-smartwatch', texto: 'Smartwatch del Black Friday 2026' },
      { href: '/mejores/black-friday-auriculares', texto: 'Auriculares del Black Friday 2026' },
      { href: '/black-friday', texto: 'Todo el Black Friday 2026' },
      { href: '/guias/que-smartwatch-comprar', texto: 'Qué smartwatch comprar' },
    ],
  },
]

/** Guías del lote del 24/11 (bf-conv-2411): publicadas un día después que las primeras. */
const PUBLICADAS_24_11 = new Set([
  'que-freidora-de-aire-comprar-black-friday-2026',
  'que-tablet-comprar-black-friday-2026',
  'que-smartwatch-comprar-black-friday-2026',
])

export const FECHAS_GUIAS_BF_2026: Record<string, { publicada: string; modificada: string }> = Object.fromEntries(
  GUIAS_BF_2026.map(g => {
    const f = PUBLICADAS_24_11.has(g.slug) ? '2026-11-24' : '2026-11-23'
    return [g.slug, { publicada: f, modificada: f }]
  }),
)
