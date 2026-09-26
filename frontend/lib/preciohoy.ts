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
import { getSeguidos, type Seguido } from '@/lib/seguimiento'

export interface PrecioHoy {
  slug: string
  nombre: string // "smart TV de 55 pulgadas"
  patron: RegExp // sobre el título normalizado (minúsculas, sin tildes)
  excluir?: string[] // en las primeras 5 palabras: accesorios/repuestos
  busqueda: string // búsqueda en ML
  categoria?: string // /categoria/* relacionada
  consejo: string // qué mirar antes de comprar (criterio general, sin datos inventados)
}

const TV_EXCLUIR = ['soporte', 'control', 'funda', 'cable', 'antena', 'rack', 'mesa']

export const PRECIOS_HOY: PrecioHoy[] = [
  { slug: 'smart-tv-32-pulgadas', nombre: 'smart TV de 32 pulgadas', patron: /(tv|televisor).*\b32\b/, excluir: TV_EXCLUIR, busqueda: 'smart tv 32', categoria: 'smart-tv', consejo: 'En 32" alcanza con resolución HD; fijate que sea Smart (Google TV, Android TV o webOS) y que tenga al menos 2 HDMI.' },
  { slug: 'smart-tv-43-pulgadas', nombre: 'smart TV de 43 pulgadas', patron: /(tv|televisor).*\b43\b/, excluir: TV_EXCLUIR, busqueda: 'smart tv 43', categoria: 'smart-tv', consejo: 'En 43" ya conviene Full HD o 4K. Mirá el sistema operativo y que la marca tenga service en Argentina.' },
  { slug: 'smart-tv-50-pulgadas', nombre: 'smart TV de 50 pulgadas', patron: /(tv|televisor).*\b50\b/, excluir: TV_EXCLUIR, busqueda: 'smart tv 50', categoria: 'smart-tv', consejo: 'Desde 50" elegí 4K UHD. Para ver deportes, una frecuencia de 120 Hz o tecnología de movimiento ayuda.' },
  { slug: 'smart-tv-55-pulgadas', nombre: 'smart TV de 55 pulgadas', patron: /(tv|televisor).*\b55\b/, excluir: TV_EXCLUIR, busqueda: 'smart tv 55 4k', categoria: 'smart-tv', consejo: 'En 55" pedí 4K con HDR. QLED u OLED mejoran color y contraste; LED es la opción más barata.' },
  { slug: 'smart-tv-65-pulgadas', nombre: 'smart TV de 65 pulgadas', patron: /(tv|televisor).*\b65\b/, excluir: TV_EXCLUIR, busqueda: 'smart tv 65', categoria: 'smart-tv', consejo: 'Medí el espacio: un 65" ocupa cerca de 1,45 m de ancho. A esa medida el panel (QLED/OLED) se nota mucho.' },
  { slug: 'aire-acondicionado-inverter', nombre: 'aire acondicionado inverter', patron: /aire acondicionado.*inverter|inverter.*aire acondicionado/, excluir: ['soporte', 'control', 'cano', 'kit'], busqueda: 'aire acondicionado inverter', categoria: 'aire-acondicionado', consejo: 'Calculá las frigorías según los m² del ambiente y sumá la instalación al presupuesto: casi nunca viene incluida.' },
  { slug: 'heladera-no-frost', nombre: 'heladera no frost', patron: /heladera.*no ?frost/, excluir: ['burlete', 'repuesto', 'filtro'], busqueda: 'heladera no frost', categoria: 'heladeras', consejo: 'Compará la capacidad en litros y la etiqueta de eficiencia energética (A o mejor).' },
  { slug: 'lavarropas-automatico', nombre: 'lavarropas automático', patron: /lavarropas/, excluir: ['repuesto', 'bomba', 'correa', 'funda', 'plaqueta'], busqueda: 'lavarropas automatico', categoria: 'lavarropas', consejo: 'Carga frontal lava mejor y gasta menos agua; carga superior es más barata. Mirá los kilos y las RPM del centrifugado.' },
  { slug: 'colchon-2-plazas', nombre: 'colchón de 2 plazas', patron: /colchon.*(2 plazas|dos plazas|140 ?x|160 ?x)/, excluir: ['protector', 'funda', 'cubre'], busqueda: 'colchon 2 plazas', categoria: 'colchones', consejo: 'Resortes pocket o espuma de alta densidad duran más. Fijate la medida exacta (140x190 o 160x200) y la garantía.' },
  { slug: 'freidora-de-aire', nombre: 'freidora de aire', patron: /freidora.*aire|air ?fryer/, excluir: ['papel', 'molde', 'accesorio', 'repuesto'], busqueda: 'freidora de aire', categoria: 'freidoras-de-aire', consejo: 'Para 1-2 personas alcanza con 3-4 litros; para una familia, 5 litros o más.' },
  { slug: 'taladro', nombre: 'taladro', patron: /taladro/, excluir: ['mecha', 'broca', 'soporte', 'mandril', 'carbones'], busqueda: 'taladro percutor', categoria: 'herramientas-electricas', consejo: 'Para la casa alcanza un percutor de 500-750 W o un atornillador 18 V; fijate si incluye batería y cargador.' },
  { slug: 'notebook', nombre: 'notebook', patron: /notebook/, excluir: ['funda', 'mochila', 'cargador', 'soporte', 'bateria', 'teclado'], busqueda: 'notebook', consejo: 'Para estudiar o trabajar pedí al menos 8 GB de RAM y disco SSD; el procesador importa menos que esas dos cosas.' },
  { slug: 'monitor', nombre: 'monitor', patron: /monitor/, excluir: ['arterial', 'presion', 'bebe', 'soporte', 'brazo', 'tensiometro'], busqueda: 'monitor', categoria: 'monitores', consejo: '24" Full HD sirve para casi todo; para jugar, 144 Hz o más. IPS da mejores colores.' },
  { slug: 'termotanque', nombre: 'termotanque', patron: /termotanque/, excluir: ['resistencia', 'termostato', 'anodo', 'repuesto'], busqueda: 'termotanque', categoria: 'termotanques', consejo: 'Elegí gas o eléctrico según tu instalación, y los litros según cuántas personas se bañan seguido.' },
]

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
  return getSeguidos().filter(s => coincide(p, s.titulo))
}

/** Mediana (más representativa que el promedio con pocos datos). */
export function mediana(xs: number[]) {
  if (!xs.length) return 0
  const s = [...xs].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2)
}
