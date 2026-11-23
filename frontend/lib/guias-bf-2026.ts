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
      'Para la mayoría, la Lenovo IdeaPad Slim 3 con Ryzen 5, 16 GB de RAM y 512 GB de SSD: alcanza de sobra para estudiar, trabajar y el uso diario durante años. Si preferís Intel, la Lenovo V15 Gen 5 con Core i5 y la misma memoria. Para jugar o editar video hace falta placa de video dedicada, como la de la Lenovo LOQ o la Asus TUF Gaming A15. El Black Friday 2026 en Argentina es el viernes 27 de noviembre.',
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
      'Para la mayoría, la Noblex 50" DV50X8580: 4K y Google TV, con las apps de siempre sin sumar otro aparato. Si querés mejor imagen, la Samsung 50" Mini LED M60H o la Hisense 50" QLED 50Q6. Antes de comprar, confirmá que diga 4K (UHD): hay teles de 50" que son Full HD. El Black Friday 2026 en Argentina es el viernes 27 de noviembre.',
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
]

export const FECHAS_GUIAS_BF_2026: Record<string, { publicada: string; modificada: string }> = Object.fromEntries(
  GUIAS_BF_2026.map(g => [g.slug, { publicada: '2026-11-23', modificada: '2026-11-23' }]),
)
