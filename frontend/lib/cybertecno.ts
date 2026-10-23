// Cyber Monday de tecnología (/cyber-monday/tecnologia): el precio testigo de
// octubre (lib/testigo.ts) de celulares, notebooks, smart TV y monitores,
// agrupado por rubro. Tecnología fue más de la mitad de la ganancia de
// oct-2026 (4 iPhones ≈ 41 %), así que es el rubro donde más pesa saber si el
// descuento del evento es real.
import { normalizar } from '@/lib/categorias'
import { getOfertas, type ProductWithMargins } from '@/lib/productos'
import { CELU_EXCLUIR } from '@/lib/preciohoy'
import { getSeguidos, principalDe } from '@/lib/seguimiento'
import { getTestigo, TESTIGO_MIN_DIAS, veredictoTestigo, type PrecioTestigo, type Veredicto } from '@/lib/testigo'

export interface RubroTecno {
  slug: string
  nombre: string
  patron: RegExp // sobre el título normalizado
  excluir: string[] // en las primeras 5 palabras
  precioHoy?: string // /precio-hoy/* del rubro
  guia?: string // /guias/* del rubro
}

const PC_EXCLUIR = ['funda', 'mochila', 'cargador', 'soporte', 'bateria', 'teclado', 'base', 'cooler']
const TV_EXCLUIR = ['soporte', 'control', 'funda', 'cable', 'antena', 'rack', 'mesa']

// El orden importa: cada producto va al primer rubro que coincide.
export const RUBROS_TECNO: RubroTecno[] = [
  { slug: 'iphone', nombre: 'iPhone', patron: /^(celular |smartphone )?(apple )?iphone \d/, excluir: CELU_EXCLUIR, precioHoy: 'iphone', guia: 'que-celular-gama-alta-comprar' },
  { slug: 'galaxy-s', nombre: 'Samsung Galaxy S', patron: /galaxy s\d{2}/, excluir: CELU_EXCLUIR, precioHoy: 'samsung-galaxy-s', guia: 'que-celular-gama-alta-comprar' },
  { slug: 'celulares', nombre: 'Otros celulares', patron: /^(celular|smartphone)\b|^(samsung|motorola|xiaomi|zte|tcl|nokia|honor|realme|oppo|infinix|tecno)\b.*\b\d+ ?gb\b/, excluir: CELU_EXCLUIR, precioHoy: 'celular', guia: 'que-celular-comprar-segun-presupuesto' },
  { slug: 'notebooks', nombre: 'Notebooks', patron: /^(notebook|laptop|macbook|apple macbook)\b/, excluir: PC_EXCLUIR, precioHoy: 'notebook', guia: 'que-notebook-comprar' },
  { slug: 'smart-tv', nombre: 'Smart TV', patron: /^(smart tv|televisor|tv)\b|\bsmart tv\b/, excluir: TV_EXCLUIR, guia: 'que-smart-tv-comprar' },
  { slug: 'monitores', nombre: 'Monitores', patron: /^monitor\b/, excluir: ['soporte', 'brazo'], precioHoy: 'monitor', guia: 'que-monitor-comprar' },
]

export interface FilaTecno {
  id: string
  titulo: string
  testigo: PrecioTestigo
  hoy: ProductWithMargins | undefined // en oferta hoy
  veredicto: Veredicto | null
  historial?: string // slug de /precio/*
}

function rubroDe(titulo: string) {
  const t = normalizar(titulo)
  const inicio = t.split(/\s+/).slice(0, 5).join(' ')
  return RUBROS_TECNO.find(r => r.patron.test(t) && !r.excluir.some(x => inicio.includes(x)))
}

/** Productos de tecnología con precio testigo (≥ TESTIGO_MIN_DIAS días), por rubro. */
export function filasPorRubro(): { rubro: RubroTecno; filas: FilaTecno[] }[] {
  const testigo = getTestigo()
  const ofertas = new Map(getOfertas().map(o => [o.id_ml, o]))
  const seguidos = new Map(getSeguidos().map(s => [s.id, principalDe(s).slug]))
  const grupos = new Map<string, FilaTecno[]>()
  for (const [id, t] of Object.entries(testigo.items)) {
    if (t.dias < TESTIGO_MIN_DIAS) continue
    const r = rubroDe(t.t)
    if (!r) continue
    const hoy = ofertas.get(id)
    const fila: FilaTecno = { id, titulo: t.t, testigo: t, hoy, veredicto: hoy ? veredictoTestigo(hoy.precio_actual, t) : null, historial: seguidos.get(id) }
    grupos.set(r.slug, [...(grupos.get(r.slug) ?? []), fila])
  }
  return RUBROS_TECNO.map(rubro => ({
    rubro,
    // Lo que hoy está en oferta primero (se puede comprar), después por precio.
    filas: (grupos.get(rubro.slug) ?? []).sort((a, b) => Number(!!b.hoy) - Number(!!a.hoy) || a.testigo.min - b.testigo.min),
  })).filter(g => g.filas.length > 0)
}

/** Ofertas de hoy de celulares y notebooks, las más caras primero: en el
 *  Cyber es donde cada venta deja más comisión (un iPhone ≈ 7 % de $1-2 M). */
export function ofertasTecnoTicketAlto(n = 8, rubros = ['iphone', 'galaxy-s', 'celulares', 'notebooks']): ProductWithMargins[] {
  return getOfertas()
    .filter(o => {
      const r = rubroDe(o.titulo)
      return !!r && rubros.includes(r.slug)
    })
    .sort((a, b) => b.precio_actual - a.precio_actual)
    .slice(0, n)
}

// ── Landings de cola larga: /cyber-monday/celulares, /notebooks y /smart-tv ──
// Mismo precio testigo que /cyber-monday/tecnologia, pero de un solo rubro y
// agrupado por marca (así se busca: «iphone cyber monday 2026»).

export interface MarcaCyber {
  nombre: string
  patron: RegExp // sobre el título normalizado; la primera que coincide gana
  busqueda: string // búsqueda en ML con link de afiliado
}

export interface LandingCyber {
  slug: 'celulares' | 'notebooks' | 'smart-tv'
  /** "celulares", "notebooks", "smart TV" */
  nombre: string
  rubros: string[]
  marcas: MarcaCyber[]
  /** Subgrupo destacado aparte (notebooks gamer), además de la marca */
  destacado?: { id: string; nombre: string; patron: RegExp; texto: string }
  comparativa: string // /mejores/*
  comparador: string // /comparador/*
  guias: string[]
  keywords: string[]
}

export const LANDINGS_CYBER: LandingCyber[] = [
  {
    slug: 'celulares',
    nombre: 'celulares',
    rubros: ['iphone', 'galaxy-s', 'celulares'],
    marcas: [
      { nombre: 'iPhone', patron: /iphone/, busqueda: 'iphone' },
      { nombre: 'Samsung Galaxy S', patron: /galaxy s\d{2}/, busqueda: 'samsung galaxy s25' },
      { nombre: 'Motorola Edge', patron: /\bedge\b/, busqueda: 'motorola edge' },
      { nombre: 'Samsung Galaxy A y otros', patron: /samsung|galaxy/, busqueda: 'samsung galaxy a' },
      { nombre: 'Motorola Moto G y otros', patron: /motorola|\bmoto\b/, busqueda: 'motorola moto g' },
      { nombre: 'Xiaomi', patron: /xiaomi|redmi|\bpoco\b/, busqueda: 'xiaomi redmi' },
      { nombre: 'Otras marcas', patron: /./, busqueda: 'celular' },
    ],
    comparativa: 'cyber-monday-celulares',
    comparador: 'celulares',
    guias: ['que-celular-comprar-cyber-monday', 'que-celular-gama-alta-comprar', 'que-celular-comprar-segun-presupuesto'],
    keywords: ['cyber monday 2026 celulares', 'iphone cyber monday 2026', 'samsung galaxy s25 cyber monday', 'motorola edge cyber monday', 'celulares cyber monday mercado libre'],
  },
  {
    slug: 'notebooks',
    nombre: 'notebooks',
    rubros: ['notebooks'],
    marcas: [
      { nombre: 'MacBook', patron: /macbook/, busqueda: 'macbook' },
      { nombre: 'Lenovo', patron: /lenovo|legion|ideapad|thinkpad/, busqueda: 'notebook lenovo' },
      { nombre: 'HP', patron: /\bhp\b|omen|victus/, busqueda: 'notebook hp' },
      { nombre: 'Asus', patron: /asus|\brog\b|\btuf\b|vivobook|zenbook/, busqueda: 'notebook asus' },
      { nombre: 'Acer', patron: /acer|nitro|predator|aspire/, busqueda: 'notebook acer' },
      { nombre: 'Dell', patron: /\bdell\b|inspiron|alienware/, busqueda: 'notebook dell' },
      { nombre: 'Otras marcas', patron: /./, busqueda: 'notebook' },
    ],
    destacado: {
      id: 'gamer',
      nombre: 'Notebooks gamer',
      patron: /\bgamer\b|gaming|\brtx\b|\bgtx\b|omen|legion|\brog\b|\btuf\b|nitro|victus|\bloq\b|predator|katana/,
      texto: 'Las que traen placa de video dedicada (RTX o GTX) o son de líneas gamer: es donde más pesos hay en juego entre un día común y el Cyber.',
    },
    comparativa: 'cyber-monday-notebooks',
    comparador: 'notebooks',
    guias: ['que-notebook-comprar-cyber-monday', 'que-notebook-comprar'],
    keywords: ['cyber monday 2026 notebooks', 'notebook gamer cyber monday', 'macbook cyber monday 2026', 'notebooks cyber monday mercado libre'],
  },
  {
    slug: 'smart-tv',
    nombre: 'smart TV',
    rubros: ['smart-tv'],
    marcas: [
      { nombre: 'Samsung', patron: /samsung/, busqueda: 'smart tv samsung' },
      { nombre: 'LG', patron: /\blg\b/, busqueda: 'smart tv lg' },
      { nombre: 'TCL', patron: /\btcl\b/, busqueda: 'smart tv tcl' },
      { nombre: 'Philips', patron: /philips/, busqueda: 'smart tv philips' },
      { nombre: 'Noblex', patron: /noblex/, busqueda: 'smart tv noblex' },
      { nombre: 'BGH', patron: /\bbgh\b/, busqueda: 'smart tv bgh' },
      { nombre: 'Hisense', patron: /hisense/, busqueda: 'smart tv hisense' },
      { nombre: 'Otras marcas', patron: /./, busqueda: 'smart tv' },
    ],
    comparativa: 'cyber-monday-smart-tv',
    comparador: 'smart-tv',
    guias: ['que-smart-tv-comprar-cyber-monday', 'que-smart-tv-comprar'],
    keywords: ['cyber monday 2026 smart tv', 'televisores cyber monday 2026', 'smart tv cyber monday mercado libre', 'precio smart tv cyber monday'],
  },
]

/** Con menos productos con precio testigo, la landing queda noindex (misma
 *  regla que las comparativas: MIN_PRODUCTOS_INDEXABLE en lib/comparativas.ts). */
export const MIN_CYBER_INDEXABLE = 3

export const getLandingCyber = (slug: string) => LANDINGS_CYBER.find(l => l.slug === slug)

export interface LandingCyberArmada {
  l: LandingCyber
  filas: FilaTecno[]
  porMarca: { marca: MarcaCyber; filas: FilaTecno[] }[]
  destacadas: FilaTecno[]
}

export function armarLandingCyber(l: LandingCyber): LandingCyberArmada {
  // Lo que hoy se puede comprar primero; después lo más caro (ticket alto).
  const filas = filasPorRubro()
    .filter(g => l.rubros.includes(g.rubro.slug))
    .flatMap(g => g.filas)
    .sort((a, b) => Number(!!b.hoy) - Number(!!a.hoy) || b.testigo.min - a.testigo.min)
  const grupos = new Map<string, FilaTecno[]>()
  for (const f of filas) {
    const t = normalizar(f.titulo)
    const m = l.marcas.find(x => x.patron.test(t)) ?? l.marcas[l.marcas.length - 1]
    grupos.set(m.nombre, [...(grupos.get(m.nombre) ?? []), f])
  }
  const porMarca = l.marcas.map(marca => ({ marca, filas: grupos.get(marca.nombre) ?? [] })).filter(g => g.filas.length > 0)
  const d = l.destacado
  const destacadas = d ? filas.filter(f => d.patron.test(normalizar(f.titulo))) : []
  return { l, filas, porMarca, destacadas }
}

export const landingCyberIndexable = (x: LandingCyberArmada) => x.filas.length >= MIN_CYBER_INDEXABLE

/** Landings con al menos un producto (las que no llegan al mínimo quedan noindex). */
export function landingsCyberConDatos(): LandingCyberArmada[] {
  return LANDINGS_CYBER.map(armarLandingCyber).filter(x => x.filas.length > 0)
}
