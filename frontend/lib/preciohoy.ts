// "Precio hoy" por producto genérico (/precio-hoy/[slug]): responde la
// búsqueda "cuánto sale un X hoy en Argentina" con datos propios: el rango de
// precios de las ofertas con descuento real que el bot vio hoy en
// mercadolibre.com.ar/ofertas + el historial de los productos que seguimos.
// (#19 GEO: es el formato que hace que Perplexity cite a la competencia.)
//
// Solo productos que aparecen seguido en el catálogo: una página sin datos
// propios sería contenido flojo.

import { getOfertas, type ProductWithMargins } from '@/lib/productos'
import { normalizar } from '@/lib/categorias'
import { getSeguidosPrincipales, type Seguido } from '@/lib/seguimiento'

export interface PrecioHoy {
  fem?: boolean // femenino: "la notebook", "una heladera"
  slug: string
  nombre: string // "smart TV de 55 pulgadas"
  patron: RegExp // sobre el título normalizado (minúsculas, sin tildes)
  excluir?: string[] // en las primeras 5 palabras: accesorios/repuestos
  busqueda: string // búsqueda en ML
  categoria?: string // /categoria/* relacionada
  consejo: string // qué mirar antes de comprar (criterio general, sin datos inventados)
  /** Ofertas vigentes mínimas para publicarla (lista, sitemap, links). Debajo
   *  de esto la página existe pero va noindex: sin datos sería contenido flojo. */
  minOfertas?: number
}

const TV_EXCLUIR = ['soporte', 'control', 'funda', 'cable', 'antena', 'rack', 'mesa']
export const CELU_EXCLUIR = ['funda', 'vidrio', 'templado', 'protector', 'cargador', 'cable', 'soporte', 'case', 'lente', 'repuesto', 'modulo', 'pantalla', 'bateria', 'power', 'auricular', 'reloj', 'smartwatch', 'tablet', 'tab ', 'buds', 'watch', 'monitor', 'notebook', 'tv', 'pendrive', 'memoria', 'disco']

// Neumáticos de auto por rodado (R14…R18): ticket alto y casi sin competencia.
// La medida va en el título como 205/55r16, 195/55zr16 o "175 65 R14".
const NEUMATICO = /^(neumatico|cubierta)s?\b/
const NEUMATICO_EXCLUIR = ['moto', 'bici', 'camara', 'parche', 'inflador', 'compresor', 'cuatriciclo', 'tractor', 'carretilla']
const NEUMATICO_MIN = 6
const rodado = (r: number): PrecioHoy => ({
  slug: `neumatico-rodado-${r}`,
  nombre: `neumático rodado ${r}`,
  patron: new RegExp(NEUMATICO.source + String.raw`.*\b\d{3} ?[/ ] ?\d{2} ?z?r ?${r}\b`),
  excluir: NEUMATICO_EXCLUIR,
  busqueda: `neumatico r${r}`,
  categoria: 'vehiculos',
  consejo: `Comprá la medida exacta que dice el costado de tu cubierta actual (por ejemplo 185/65 R${r}), con el mismo índice de carga y velocidad o mayor. Sumá al presupuesto la colocación, el balanceo y la alineación, y cambiá de a pares en el mismo eje.`,
  minOfertas: NEUMATICO_MIN,
})

export const PRECIOS_HOY: PrecioHoy[] = [
  { slug: 'smart-tv-32-pulgadas', nombre: 'smart TV de 32 pulgadas', patron: /(tv|televisor).*\b32\b/, excluir: TV_EXCLUIR, busqueda: 'smart tv 32', categoria: 'smart-tv', consejo: 'En 32" alcanza con resolución HD; fijate que sea Smart (Google TV, Android TV o webOS) y que tenga al menos 2 HDMI.' },
  { slug: 'smart-tv-43-pulgadas', nombre: 'smart TV de 43 pulgadas', patron: /(tv|televisor).*\b43\b/, excluir: TV_EXCLUIR, busqueda: 'smart tv 43', categoria: 'smart-tv', consejo: 'En 43" ya conviene Full HD o 4K. Mirá el sistema operativo y que la marca tenga service en Argentina.' },
  { slug: 'smart-tv-50-pulgadas', nombre: 'smart TV de 50 pulgadas', patron: /(tv|televisor).*\b50\b/, excluir: TV_EXCLUIR, busqueda: 'smart tv 50', categoria: 'smart-tv', consejo: 'Desde 50" elegí 4K UHD. Para ver deportes, una frecuencia de 120 Hz o tecnología de movimiento ayuda.' },
  { slug: 'smart-tv-55-pulgadas', nombre: 'smart TV de 55 pulgadas', patron: /(tv|televisor).*\b55\b/, excluir: TV_EXCLUIR, busqueda: 'smart tv 55 4k', categoria: 'smart-tv', consejo: 'En 55" pedí 4K con HDR. QLED u OLED mejoran color y contraste; LED es la opción más barata.' },
  { slug: 'smart-tv-65-pulgadas', nombre: 'smart TV de 65 pulgadas', patron: /(tv|televisor).*\b65\b/, excluir: TV_EXCLUIR, busqueda: 'smart tv 65', categoria: 'smart-tv', consejo: 'Medí el espacio: un 65" ocupa cerca de 1,45 m de ancho. A esa medida el panel (QLED/OLED) se nota mucho.' },
  { slug: 'aire-acondicionado-inverter', nombre: 'aire acondicionado inverter', patron: /aire acondicionado.*inverter|inverter.*aire acondicionado/, excluir: ['soporte', 'control', 'cano', 'kit'], busqueda: 'aire acondicionado inverter', categoria: 'aire-acondicionado', consejo: 'Calculá las frigorías según los m² del ambiente y sumá la instalación al presupuesto: casi nunca viene incluida.' },
  { slug: 'heladera-no-frost', fem: true, nombre: 'heladera no frost', patron: /heladera.*no ?frost/, excluir: ['burlete', 'repuesto', 'filtro'], busqueda: 'heladera no frost', categoria: 'heladeras', consejo: 'Compará la capacidad en litros y la etiqueta de eficiencia energética (A o mejor).' },
  { slug: 'lavarropas-automatico', nombre: 'lavarropas automático', patron: /lavarropas/, excluir: ['repuesto', 'bomba', 'correa', 'funda', 'plaqueta'], busqueda: 'lavarropas automatico', categoria: 'lavarropas', consejo: 'Carga frontal lava mejor y gasta menos agua; carga superior es más barata. Mirá los kilos y las RPM del centrifugado.' },
  { slug: 'colchon-2-plazas', nombre: 'colchón de 2 plazas', patron: /colchon.*(2 plazas|dos plazas|140 ?x|160 ?x)/, excluir: ['protector', 'funda', 'cubre'], busqueda: 'colchon 2 plazas', categoria: 'colchones', consejo: 'Resortes pocket o espuma de alta densidad duran más. Fijate la medida exacta (140x190 o 160x200) y la garantía.' },
  { slug: 'freidora-de-aire', fem: true, nombre: 'freidora de aire', patron: /freidora.*aire|air ?fryer/, excluir: ['papel', 'molde', 'accesorio', 'repuesto'], busqueda: 'freidora de aire', categoria: 'freidoras-de-aire', consejo: 'Para 1-2 personas alcanza con 3-4 litros; para una familia, 5 litros o más.' },
  { slug: 'taladro', nombre: 'taladro', patron: /taladro/, excluir: ['mecha', 'broca', 'soporte', 'mandril', 'carbones'], busqueda: 'taladro percutor', categoria: 'herramientas-electricas', consejo: 'Para la casa alcanza un percutor de 500-750 W o un atornillador 18 V; fijate si incluye batería y cargador.' },
  { slug: 'notebook', fem: true, nombre: 'notebook', patron: /notebook/, excluir: ['funda', 'mochila', 'cargador', 'soporte', 'bateria', 'teclado'], busqueda: 'notebook', categoria: 'notebooks', consejo: 'Para estudiar o trabajar pedí al menos 8 GB de RAM y disco SSD; el procesador importa menos que esas dos cosas.' },
  { slug: 'monitor', nombre: 'monitor', patron: /monitor/, excluir: ['arterial', 'presion', 'bebe', 'soporte', 'brazo', 'tensiometro'], busqueda: 'monitor', categoria: 'monitores', consejo: '24" Full HD sirve para casi todo; para jugar, 144 Hz o más. IPS da mejores colores.' },
  // Tecnología: la mitad de la ganancia de oct-2026 fueron celulares y notebooks.
  { slug: 'iphone', nombre: 'iPhone', patron: /^(celular |smartphone )?(apple )?iphone \d/, excluir: CELU_EXCLUIR, busqueda: 'iphone', categoria: 'celulares', consejo: 'Compará la capacidad (128, 256 o 512 GB) antes que el modelo: es lo que más cambia el precio. Comprá a la tienda oficial de Apple o a vendedores con garantía en Argentina, y fijate que diga "nuevo" y no "reacondicionado".' },
  { slug: 'samsung-galaxy-s', nombre: 'Samsung Galaxy S', patron: /galaxy s\d{2}/, excluir: CELU_EXCLUIR, busqueda: 'samsung galaxy s', categoria: 'celulares', consejo: 'La versión Ultra suma lápiz y mejor zoom; la base y la Plus alcanzan para casi todo. Fijate que sea la versión para Argentina (con garantía oficial de Samsung).' },
  { slug: 'motorola-moto-g', nombre: 'Motorola Moto G', patron: /moto ?g\d|motorola g\d/, excluir: CELU_EXCLUIR, busqueda: 'motorola moto g', categoria: 'celulares', consejo: 'Es la gama media más vendida: pedí al menos 8 GB de RAM y 256 GB para que no se quede corto en dos años. Los Moto G con 5G cuestan poco más y duran más.' },
  { slug: 'celular', nombre: 'celular', patron: /^(celular|smartphone)\b|^(apple )?iphone \d|^(samsung|motorola|xiaomi|zte|tcl|nokia|honor|realme|oppo|infinix|tecno)\b.*\b\d+ ?gb\b/, excluir: CELU_EXCLUIR, busqueda: 'celular', categoria: 'celulares', consejo: 'Definí primero el presupuesto y la memoria (128 GB como mínimo). Para durar, conviene una marca con actualizaciones y service en Argentina.' },
  { slug: 'smartwatch', nombre: 'smartwatch', patron: /smartwatch|reloj inteligente|smart watch/, excluir: ['malla', 'correa', 'cargador', 'protector', 'vidrio', 'funda'], busqueda: 'smartwatch', consejo: 'Fijate que sea compatible con tu celular (Apple Watch solo funciona con iPhone) y cuánto dura la batería: varía de 1 día a 2 semanas.' },
  { slug: 'auriculares-bluetooth', nombre: 'auricular bluetooth', patron: /auricular.*(bluetooth|inalambric|\btws\b)|(bluetooth|inalambric).*auricular|airpods|earbuds/, excluir: ['estuche', 'funda', 'almohadilla', 'repuesto', 'cable'], busqueda: 'auriculares bluetooth', consejo: 'Cancelación de ruido activa (ANC) es lo que más se nota en el colectivo o la oficina. Mirá la batería con y sin el estuche.' },
  { slug: 'neumaticos', nombre: 'neumático', patron: NEUMATICO, excluir: NEUMATICO_EXCLUIR, busqueda: 'neumaticos', categoria: 'vehiculos', consejo: 'La medida está en el costado de la cubierta (ej. 205/55 R16 91V): el último número es el rodado. Una marca conocida con fecha de fabricación reciente (los 4 dígitos DOT: semana y año) vale más que unos pesos de diferencia.', minOfertas: NEUMATICO_MIN },
  ...[14, 15, 16, 17, 18].map(rodado),
  { slug: 'termotanque', nombre: 'termotanque', patron: /termotanque/, excluir: ['resistencia', 'termostato', 'anodo', 'repuesto'], busqueda: 'termotanque', categoria: 'termotanques', consejo: 'Elegí gas o eléctrico según tu instalación, y los litros según cuántas personas se bañan seguido.' },
]

/** Artículo según el género: el/la, un/una. */
export const art = (p: PrecioHoy, def: boolean) => (def ? (p.fem ? 'la' : 'el') : p.fem ? 'una' : 'un')

export const getPrecioHoy = (slug: string) => PRECIOS_HOY.find(p => p.slug === slug)

function coincide(p: PrecioHoy, titulo: string) {
  const t = normalizar(titulo)
  const inicio = t.split(/\s+/).slice(0, 5).join(' ')
  return p.patron.test(t) && !(p.excluir ?? []).some(x => inicio.includes(x))
}

export function ofertasDe(p: PrecioHoy): ProductWithMargins[] {
  return getOfertas()
    .filter(o => coincide(p, o.titulo))
    .sort((a, b) => a.precio_actual - b.precio_actual)
}

export function seguidosDe(p: PrecioHoy): Seguido[] {
  return getSeguidosPrincipales().filter(s => coincide(p, s.titulo))
}

/** ¿Tiene ofertas suficientes para mostrarla y pedir que Google la indexe? */
export const precioHoyVisible = (p: PrecioHoy) => !p.minOfertas || ofertasDe(p).length >= p.minOfertas

/** Las que se listan en /precio-hoy, el sitemap y los links internos. */
export const preciosHoyVisibles = () => PRECIOS_HOY.filter(precioHoyVisible)

/** Mediana (más representativa que el promedio con pocos datos). */
export function mediana(xs: number[]) {
  if (!xs.length) return 0
  const s = [...xs].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2)
}
