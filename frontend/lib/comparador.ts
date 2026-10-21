// Comparador de celulares y notebooks (/comparador/[slug]): junta las ofertas
// de hoy y los productos que seguimos (vistos en los últimos 7 días), saca del
// título las specs que importan para elegir (memoria, RAM, procesador...) y
// los ordena por precio. Tecnología fue más de la mitad de la ganancia de
// oct-2026: la idea es que quien busca "qué celular comprar con $X" pase por
// acá antes de ir a Mercado Libre.
//
// Las specs salen del título de ML: si no se pueden leer seguro, quedan vacías
// (nunca se adivinan).
import { normalizar } from '@/lib/categorias'
import { CELU_EXCLUIR } from '@/lib/preciohoy'
import { getOfertas } from '@/lib/productos'
import { actualizadoSeguimiento, getSeguidosPrincipales, precioActual, slugPorId } from '@/lib/seguimiento'

export interface Equipo {
  id: string
  titulo: string
  marca: string
  precio: number
  minimo: number | null // el más bajo que registramos
  desde: string | null // desde cuándo lo seguimos
  descuento: number | null // % OFF de hoy (solo si está en oferta)
  enOferta: boolean
  visto: string // última vez que lo vimos (YYYY-MM-DD)
  url: string
  img: string | null
  historial: string | null // slug de /precio/*
  specs: Record<string, string> // ya formateadas para mostrar
  orden: Record<string, number> // valores numéricos para filtrar/ordenar
}

export interface Rango {
  hasta: number | null // null = sin tope
  texto: string
}

export interface FiltroSpec {
  clave: string // en Equipo.orden
  nombre: string
  opciones: { valor: number; texto: string }[] // "al menos valor"
}

export interface Comparador {
  slug: string
  categoria: string // /categoria/* relacionada
  incluye: RegExp // sobre el título normalizado: qué cuenta como equipo (sin accesorios)
  excluir: string[] // en las primeras 6 palabras
  nombre: string // "celular"
  plural: string // "celulares"
  fem: boolean
  titulo: string
  descripcion: string
  intro: string
  rangos: Rango[]
  filtros: FiltroSpec[]
  specs: string[] // claves de Equipo.specs, en orden
  guias: string[]
  precioHoy: string[]
  parse: (t: string) => Pick<Equipo, 'marca' | 'specs' | 'orden'>
}

const gb = (n: number) => (n >= 1024 ? `${n / 1024} TB` : `${n} GB`)
/** Par "RAM+memoria" del título ("4+64gb", "12+512 gb", "128/4gb"): [ram, memoria]. */
function parGb(t: string): [number, number] | null {
  const m = t.match(/(\d{1,4})\s?(?:\+|\/)\s?(\d{1,4})\s?gb/)
  if (!m) return null
  const [a, b] = [Number(m[1]), Number(m[2])]
  return [Math.min(a, b), Math.max(a, b)]
}
/** Números de GB del título (1tb → 1024): "8gb", "8 gb", "4+64gb", "128/4gb". */
function numerosGb(t: string): number[] {
  const out: number[] = []
  for (const m of t.matchAll(/(\d{1,4})\s?(?:\+|\/)\s?(\d{1,4})\s?gb/g)) out.push(Number(m[1]), Number(m[2]))
  for (const m of t.matchAll(/(\d{1,4})\s?gb\b/g)) out.push(Number(m[1]))
  for (const m of t.matchAll(/(\d)\s?tb\b/g)) out.push(Number(m[1]) * 1024)
  return out
}
const ALMACENAMIENTOS = [32, 64, 128, 256, 512, 1024, 2048]

const MARCAS_CELU: [RegExp, string][] = [
  [/\b(apple|iphone)\b/, 'Apple'],
  [/\b(samsung|galaxy)\b/, 'Samsung'],
  [/\b(motorola|moto)\b/, 'Motorola'],
  [/\b(xiaomi|redmi|poco)\b/, 'Xiaomi'],
  [/\btcl\b/, 'TCL'],
  [/\bzte\b/, 'ZTE'],
  [/\bnokia\b/, 'Nokia'],
  [/\bhonor\b/, 'Honor'],
  [/\brealme\b/, 'Realme'],
  [/\boppo\b/, 'Oppo'],
  [/\binfinix\b/, 'Infinix'],
]

function parseCelular(titulo: string): Pick<Equipo, 'marca' | 'specs' | 'orden'> {
  const t = normalizar(titulo)
  const marca = MARCAS_CELU.find(([re]) => re.test(t))?.[1] ?? 'Otra'
  const nums = numerosGb(t)
  const par = parGb(t)
  const almac = par && ALMACENAMIENTOS.includes(par[1]) ? par[1] : Math.max(0, ...nums.filter(n => ALMACENAMIENTOS.includes(n)))
  const ramTag = t.match(/(\d{1,2})\s?gb\s?(?:de\s)?ram|ram\s?(\d{1,2})\s?gb|(\d{1,2})\s?ram\b/)
  let ram = ramTag ? Number(ramTag[1] ?? ramTag[2] ?? ramTag[3]) : par && par[0] <= 24 ? par[0] : 0
  if (!ram && almac) {
    const chicos = nums.filter(n => n <= 24 && n !== almac)
    if (chicos.length) ram = Math.max(...chicos)
  }
  const g5 = /\b5g\b/.test(t)
  const specs: Record<string, string> = {}
  if (almac) specs.memoria = gb(almac)
  if (ram) specs.ram = `${ram} GB RAM`
  if (g5) specs.red = '5G'
  return { marca, specs, orden: { memoria: almac, ram, g5: g5 ? 1 : 0 } }
}

const MARCAS_NB: [RegExp, string][] = [
  [/\b(apple|macbook)\b/, 'Apple'],
  [/\blenovo\b/, 'Lenovo'],
  [/\b(hp|omen|victus)\b/, 'HP'],
  [/\basus\b/, 'Asus'],
  [/\bacer\b/, 'Acer'],
  [/\bdell\b/, 'Dell'],
  [/\b(msi)\b/, 'MSI'],
  [/\bsamsung\b/, 'Samsung'],
  [/\b(bgh)\b/, 'BGH'],
  [/\b(exo)\b/, 'EXO'],
  [/\b(gfast)\b/, 'Gfast'],
]

/** Nivel de procesador: 1 básico, 2 i3/Ryzen 3, 3 i5/Ryzen 5/M1-M2, 4 i7/Ryzen 7/M3+, 5 i9/Ryzen 9. */
function procesador(t: string): [string, number] | null {
  let m = t.match(/\b(?:core\s?)?i([3579])(?:[-\s]?\d{3,5}\w*)?\b/)
  if (m) return [`Intel Core i${m[1]}`, { '3': 2, '5': 3, '7': 4, '9': 5 }[m[1]]!]
  m = t.match(/\bcore\s?ultra\s?([579])\b/)
  if (m) return [`Intel Core Ultra ${m[1]}`, { '5': 3, '7': 4, '9': 5 }[m[1]]!]
  m = t.match(/\bryzen\s?([3579])\b/)
  if (m) return [`AMD Ryzen ${m[1]}`, { '3': 2, '5': 3, '7': 4, '9': 5 }[m[1]]!]
  m = t.match(/\bm([1-5])\b(?:\s?(pro|max))?/)
  if (m && /macbook|apple/.test(t)) return [`Apple M${m[1]}${m[2] ? ' ' + m[2] : ''}`, Number(m[1]) >= 3 ? 4 : 3]
  if (/\b(celeron|pentium|n4020|n4500|n100|n200|n305|athlon|mediatek)\b/.test(t)) return ['Básico (Celeron/N)', 1]
  return null
}

function parseNotebook(titulo: string): Pick<Equipo, 'marca' | 'specs' | 'orden'> {
  const t = normalizar(titulo)
  const marca = MARCAS_NB.find(([re]) => re.test(t))?.[1] ?? 'Otra'
  const cpu = procesador(t)
  const nums = numerosGb(t)
  const ssdTag = t.match(/(\d{3,4})\s?gb\s?(?:de\s)?(?:ssd|emmc|nvme)|ssd\s?(?:de\s)?(\d{3,4})\s?gb|(\d)\s?tb/)
  let disco = ssdTag ? (ssdTag[3] ? Number(ssdTag[3]) * 1024 : Number(ssdTag[1] ?? ssdTag[2])) : 0
  if (!disco) disco = Math.max(0, ...nums.filter(n => n >= 128 && ALMACENAMIENTOS.includes(n)))
  const ramTag = t.match(/(\d{1,2})\s?gb\s?(?:de\s)?(?:ram|ddr\d?)|ram\s?(?:de\s)?(\d{1,2})\s?gb/)
  let ram = ramTag ? Number(ramTag[1] ?? ramTag[2]) : 0
  if (!ram) {
    const chicos = nums.filter(n => n >= 4 && n <= 64 && n !== disco)
    if (chicos.length) ram = Math.min(...chicos)
  }
  const pant = t.match(/\b(1[0-8](?:[.,]\d)?)\s?(?:"|''|”|pulgadas|pulg|plg)/)
  const gamer = /\b(gamer|rtx|gtx|rx\s?\d{4})\b/.test(t)
  const specs: Record<string, string> = {}
  if (cpu) specs.procesador = cpu[0]
  if (ram) specs.ram = `${ram} GB RAM`
  if (disco) specs.disco = `${gb(disco)} SSD`
  if (pant) specs.pantalla = `${pant[1].replace(',', '.')}"`
  if (gamer) specs.uso = 'Gamer'
  return { marca, specs, orden: { cpu: cpu?.[1] ?? 0, ram, disco, gamer: gamer ? 1 : 0 } }
}

export const COMPARADORES: Comparador[] = [
  {
    slug: 'celulares',
    categoria: 'celulares',
    incluye: /^(celular|smartphone|telefono celular|telefono)\b|^(apple )?iphone \d|^(samsung )?galaxy [asz]\d|^(motorola|moto)\b|^(xiaomi )?(redmi|poco)\b|^(xiaomi|samsung|zte|tcl|nokia|honor|realme|oppo|infinix|tecno|nubia|cubot|huawei|vivo)\b.*(\b\d+ ?gb\b|\b4g\b|\b5g\b|flip|dual sim)/,
    excluir: [...CELU_EXCLUIR, 'mini', 'juguete', 'infantil', 'galaxy book', 'galaxy tab', 'galaxy watch', 'galaxy buds', 'bm10', 'selfie', 'microfono', 'teclado', 'lente', 'anteojo'],
    nombre: 'celular',
    plural: 'celulares',
    fem: false,
    titulo: 'Comparador de celulares: precios de hoy en Mercado Libre',
    descripcion:
      'Compará celulares por precio, memoria, RAM y 5G con los precios reales de hoy en Mercado Libre Argentina y el más bajo que registramos de cada uno. iPhone, Samsung, Motorola, Xiaomi y más.',
    intro:
      'Elegí tu presupuesto y lo que necesitás: te mostramos los celulares que hoy están en Mercado Libre Argentina con su precio real y el más bajo que registramos, para que sepas si es buen momento. Tildá hasta 3 y comparalos lado a lado.',
    rangos: [
      { hasta: 300_000, texto: 'Hasta $300.000' },
      { hasta: 600_000, texto: '$300.000 a $600.000' },
      { hasta: 1_200_000, texto: '$600.000 a $1.200.000' },
      { hasta: 2_500_000, texto: '$1.200.000 a $2.500.000' },
      { hasta: null, texto: 'Más de $2.500.000' },
    ],
    filtros: [
      { clave: 'memoria', nombre: 'Memoria', opciones: [{ valor: 128, texto: '128 GB o más' }, { valor: 256, texto: '256 GB o más' }, { valor: 512, texto: '512 GB o más' }] },
      { clave: 'ram', nombre: 'RAM', opciones: [{ valor: 6, texto: '6 GB o más' }, { valor: 8, texto: '8 GB o más' }, { valor: 12, texto: '12 GB o más' }] },
      { clave: 'g5', nombre: 'Red', opciones: [{ valor: 1, texto: 'Con 5G' }] },
    ],
    specs: ['memoria', 'ram', 'red'],
    guias: ['que-celular-comprar-segun-presupuesto', 'que-celular-gama-alta-comprar'],
    precioHoy: ['iphone', 'samsung-galaxy-s', 'motorola-moto-g', 'celular'],
    parse: parseCelular,
  },
  {
    slug: 'notebooks',
    categoria: 'notebooks',
    incluye: /^(notebook|laptop|macbook|apple macbook)\b|^(samsung )?galaxy book\b/,
    excluir: ['funda', 'mochila', 'cargador', 'soporte', 'bateria', 'teclado', 'base', 'cooler', 'repuesto', 'pantalla', 'bisagra', 'flex', 'mother'],
    nombre: 'notebook',
    plural: 'notebooks',
    fem: true,
    titulo: 'Comparador de notebooks: precios de hoy en Mercado Libre',
    descripcion:
      'Compará notebooks por precio, procesador, RAM y disco con los precios reales de hoy en Mercado Libre Argentina y el más bajo que registramos de cada una. Lenovo, HP, Asus, Acer, MacBook y más.',
    intro:
      'Elegí tu presupuesto y para qué la querés: te mostramos las notebooks que hoy están en Mercado Libre Argentina con su precio real y el más bajo que registramos. Para estudiar o trabajar, pedí al menos 8 GB de RAM y disco SSD. Tildá hasta 3 y comparalas lado a lado.',
    rangos: [
      { hasta: 600_000, texto: 'Hasta $600.000' },
      { hasta: 1_000_000, texto: '$600.000 a $1.000.000' },
      { hasta: 1_500_000, texto: '$1.000.000 a $1.500.000' },
      { hasta: 2_500_000, texto: '$1.500.000 a $2.500.000' },
      { hasta: null, texto: 'Más de $2.500.000' },
    ],
    filtros: [
      { clave: 'cpu', nombre: 'Procesador', opciones: [{ valor: 3, texto: 'i5 / Ryzen 5 o mejor' }, { valor: 4, texto: 'i7 / Ryzen 7 o mejor' }] },
      { clave: 'ram', nombre: 'RAM', opciones: [{ valor: 8, texto: '8 GB o más' }, { valor: 16, texto: '16 GB o más' }] },
      { clave: 'disco', nombre: 'Disco', opciones: [{ valor: 256, texto: '256 GB o más' }, { valor: 512, texto: '512 GB o más' }] },
      { clave: 'gamer', nombre: 'Uso', opciones: [{ valor: 1, texto: 'Gamer' }] },
    ],
    specs: ['procesador', 'ram', 'disco', 'pantalla', 'uso'],
    guias: ['que-notebook-comprar'],
    precioHoy: ['notebook'],
    parse: parseNotebook,
  },
]

export const getComparador = (slug: string) => COMPARADORES.find(c => c.slug === slug)

/** Días hacia atrás que cuenta un producto seguido como "visto hace poco". */
const DIAS_VISTO = 7

export function equiposDe(c: Comparador): Equipo[] {
  const es = (titulo: string) => {
    const t = normalizar(titulo)
    const inicio = t.split(/\s+/).slice(0, 6).join(' ')
    return c.incluye.test(t) && !c.excluir.some(x => inicio.includes(x))
  }
  const historial = slugPorId()
  const vistos = new Set<string>()
  const clave = (t: string) => normalizar(t).replace(/\s+/g, ' ').trim()
  const hoyIso = actualizadoSeguimiento() || new Date().toISOString().slice(0, 10)
  const out: Equipo[] = []

  for (const o of getOfertas()) {
    if (!es(o.titulo) || vistos.has(clave(o.titulo))) continue
    vistos.add(clave(o.titulo))
    out.push({
      id: o.id_ml,
      titulo: o.titulo,
      precio: o.precio_actual,
      minimo: o.precio_minimo_registrado ?? null,
      desde: o.seguimiento_desde ?? null,
      descuento: o.descuento_pct ?? null,
      enOferta: true,
      visto: o.precio_visto ?? hoyIso,
      url: o.url_producto,
      img: o.url_imagen,
      historial: historial[o.id_ml] ?? null,
      ...c.parse(o.titulo),
    })
  }

  const limite = new Date(new Date(hoyIso).getTime() - DIAS_VISTO * 86_400_000).toISOString().slice(0, 10)
  for (const s of getSeguidosPrincipales()) {
    if (s.ultimo_visto < limite || !es(s.titulo) || vistos.has(clave(s.titulo))) continue
    vistos.add(clave(s.titulo))
    out.push({
      id: s.id,
      titulo: s.titulo,
      precio: precioActual(s),
      minimo: s.min,
      desde: s.desde,
      descuento: null,
      enOferta: false,
      visto: s.ultimo_visto,
      url: s.url,
      img: s.img,
      historial: s.slug,
      ...c.parse(s.titulo),
    })
  }
  return out.sort((a, b) => a.precio - b.precio)
}

/** Índice del rango de presupuesto de un precio. */
export const rangoDe = (c: Comparador, precio: number) => {
  const i = c.rangos.findIndex(r => r.hasta === null || precio <= r.hasta)
  return i === -1 ? c.rangos.length - 1 : i
}
