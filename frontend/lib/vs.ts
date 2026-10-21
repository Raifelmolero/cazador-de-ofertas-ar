// Páginas "X vs Y" (/vs/[slug]): dos modelos cara a cara con los precios
// reales de hoy, sacados del comparador (lib/comparador.ts). Apuntan a las
// búsquedas "iphone 17 vs 17 pro", "galaxy s26 o iphone 17"... que hoy
// responden blogs sin precios argentinos.
//
// Solo se arma la página si los dos modelos tienen al menos una publicación
// (en oferta o vista en la última semana): sin precio real no hay página.
// Nada de specs inventadas: lo que se muestra sale del título de ML.
import { normalizar } from '@/lib/categorias'
import { equiposDe, getComparador, type Equipo } from '@/lib/comparador'

export interface Modelo {
  nombre: string // "iPhone 17 Pro"
  re: RegExp // sobre el título normalizado
}

export interface Duelo {
  slug: string
  comparador: 'celulares' | 'notebooks'
  a: Modelo
  b: Modelo
  /** Una línea de contexto propia del duelo (sin datos técnicos que no podamos verificar). */
  contexto: string
}

const IPHONE_17: Modelo = { nombre: 'iPhone 17', re: /\biphone 17\b(?! ?(pro|air|e)\b)/ }
const IPHONE_17_PRO: Modelo = { nombre: 'iPhone 17 Pro', re: /\biphone 17 pro\b(?! ?max\b)/ }
const IPHONE_17_PRO_MAX: Modelo = { nombre: 'iPhone 17 Pro Max', re: /\biphone 17 pro max\b/ }
const IPHONE_16: Modelo = { nombre: 'iPhone 16', re: /\biphone 16\b(?! ?(pro|plus|e)\b)/ }
const GALAXY_S26: Modelo = { nombre: 'Samsung Galaxy S26', re: /\bgalaxy s26\b(?! ?(\+|plus|ultra|edge|fe)\b)/ }
const GALAXY_S25_ULTRA: Modelo = { nombre: 'Samsung Galaxy S25 Ultra', re: /\bgalaxy s25 ultra\b/ }
const GALAXY_A16: Modelo = { nombre: 'Samsung Galaxy A16', re: /\bgalaxy a16\b/ }
const GALAXY_A17: Modelo = { nombre: 'Samsung Galaxy A17', re: /\bgalaxy a17\b/ }
const GALAXY_A07: Modelo = { nombre: 'Samsung Galaxy A07', re: /\bgalaxy a07\b/ }
const GALAXY_A37: Modelo = { nombre: 'Samsung Galaxy A37', re: /\bgalaxy a37\b/ }
const GALAXY_A57: Modelo = { nombre: 'Samsung Galaxy A57', re: /\bgalaxy a57\b/ }
const MOTO_G06: Modelo = { nombre: 'Motorola Moto G06', re: /\b(moto|motorola) ?g06\b/ }
const MOTO_G15: Modelo = { nombre: 'Motorola Moto G15', re: /\b(moto|motorola) ?g15\b/ }
const MOTO_G17: Modelo = { nombre: 'Motorola Moto G17', re: /\b(moto|motorola) ?g17\b/ }
const EDGE_70_FUSION: Modelo = { nombre: 'Motorola Edge 70 Fusion', re: /\bedge 70 fusion\b/ }
const REDMI_15C: Modelo = { nombre: 'Xiaomi Redmi 15C', re: /\bredmi 15c\b/ }

export const DUELOS: Duelo[] = [
  { slug: 'iphone-17-vs-iphone-17-pro', comparador: 'celulares', a: IPHONE_17, b: IPHONE_17_PRO, contexto: 'Es la duda más común de la línea nueva de Apple: cuánto más cuesta el Pro en Argentina y si conviene estirarse.' },
  { slug: 'iphone-17-pro-vs-iphone-17-pro-max', comparador: 'celulares', a: IPHONE_17_PRO, b: IPHONE_17_PRO_MAX, contexto: 'Los dos son la gama más alta de Apple; la diferencia que más pesa al elegir es el tamaño y el precio.' },
  { slug: 'iphone-16-vs-iphone-17', comparador: 'celulares', a: IPHONE_16, b: IPHONE_17, contexto: 'Con la salida del 17, el 16 suele bajar de precio: acá ves cuánto ahorrás hoy eligiendo el modelo anterior.' },
  { slug: 'samsung-galaxy-s26-vs-iphone-17', comparador: 'celulares', a: GALAXY_S26, b: IPHONE_17, contexto: 'El duelo de siempre entre Android y iPhone en la gama alta, con los precios de hoy en Mercado Libre Argentina.' },
  { slug: 'samsung-galaxy-s25-ultra-vs-iphone-17-pro', comparador: 'celulares', a: GALAXY_S25_ULTRA, b: IPHONE_17_PRO, contexto: 'Los tope de gama de Samsung y Apple cara a cara: el Ultra del año pasado suele estar bastante más barato.' },
  { slug: 'samsung-galaxy-a16-vs-galaxy-a17', comparador: 'celulares', a: GALAXY_A16, b: GALAXY_A17, contexto: 'Dos de los Samsung más vendidos: cuánto más sale el modelo nuevo frente al anterior.' },
  { slug: 'samsung-galaxy-a07-vs-galaxy-a16', comparador: 'celulares', a: GALAXY_A07, b: GALAXY_A16, contexto: 'Los Samsung de entrada: si te alcanza con lo básico o conviene subir un escalón.' },
  { slug: 'samsung-galaxy-a37-vs-galaxy-a57', comparador: 'celulares', a: GALAXY_A37, b: GALAXY_A57, contexto: 'La gama media alta de Samsung: cuánto separa al A37 del A57 hoy.' },
  { slug: 'moto-g06-vs-moto-g15', comparador: 'celulares', a: MOTO_G06, b: MOTO_G15, contexto: 'Los Motorola más baratos: qué ganás pagando el G15 en vez del G06.' },
  { slug: 'moto-g15-vs-moto-g17', comparador: 'celulares', a: MOTO_G15, b: MOTO_G17, contexto: 'El G15 y su sucesor, cara a cara con los precios de hoy.' },
  { slug: 'moto-g15-vs-samsung-galaxy-a16', comparador: 'celulares', a: MOTO_G15, b: GALAXY_A16, contexto: 'Los dos celulares de precio medio más buscados en Argentina, Motorola contra Samsung.' },
  { slug: 'moto-g17-vs-samsung-galaxy-a17', comparador: 'celulares', a: MOTO_G17, b: GALAXY_A17, contexto: 'Motorola contra Samsung en la camada nueva de gama media.' },
  { slug: 'xiaomi-redmi-15c-vs-moto-g15', comparador: 'celulares', a: REDMI_15C, b: MOTO_G15, contexto: 'Xiaomi contra Motorola en el rango de precio más vendido.' },
  { slug: 'motorola-edge-70-fusion-vs-samsung-galaxy-a37', comparador: 'celulares', a: EDGE_70_FUSION, b: GALAXY_A37, contexto: 'Gama media alta: el Edge de Motorola contra el A37 de Samsung.' },
]

export interface Lado {
  modelo: Modelo
  equipos: Equipo[] // de menor a mayor precio
  desde: number
  minimo: number | null // el más bajo registrado entre sus publicaciones
  memorias: string[] // "128 GB", "256 GB"...
  enOferta: number
}

export interface DueloArmado {
  duelo: Duelo
  a: Lado
  b: Lado
}

function lado(modelo: Modelo, equipos: Equipo[]): Lado | null {
  const xs = equipos.filter(e => modelo.re.test(normalizar(e.titulo)))
  if (!xs.length) return null
  const mins = xs.map(e => e.minimo).filter((n): n is number => typeof n === 'number')
  const memorias = [...new Set(xs.map(e => e.orden.memoria).filter(n => n > 0))]
    .sort((x, y) => x - y)
    .map(n => (n >= 1024 ? `${n / 1024} TB` : `${n} GB`))
  return {
    modelo,
    equipos: xs,
    desde: xs[0].precio,
    minimo: mins.length ? Math.min(...mins) : null,
    memorias,
    enOferta: xs.filter(e => e.enOferta).length,
  }
}

const cache = new Map<string, Equipo[]>()
function equipos(slug: Duelo['comparador']): Equipo[] {
  if (!cache.has(slug)) {
    const c = getComparador(slug)
    cache.set(slug, c ? equiposDe(c) : [])
  }
  return cache.get(slug)!
}

/** Arma el duelo con los precios de hoy; null si a alguno de los dos le falta precio. */
export function armarDuelo(d: Duelo): DueloArmado | null {
  const xs = equipos(d.comparador)
  const a = lado(d.a, xs)
  const b = lado(d.b, xs)
  return a && b ? { duelo: d, a, b } : null
}

export const getDuelo = (slug: string) => DUELOS.find(d => d.slug === slug)

/** Los duelos que hoy tienen precio de los dos lados (los que se publican). */
export const duelosConPrecio = (): DueloArmado[] => DUELOS.map(armarDuelo).filter((x): x is DueloArmado => !!x)

/** El más barato de un lado con esa memoria (en GB). */
const conMemoria = (l: Lado, gb: number) => l.equipos.find(e => e.orden.memoria === gb)

/**
 * Diferencia de precio entre los dos. Si comparten alguna memoria, se compara
 * a igual memoria (la más chica en común): comparar un 128 GB contra un 256 GB
 * exageraría la diferencia. Si no, se compara el más barato de cada lado.
 */
export function diferencia(x: DueloArmado) {
  const comunes = [...new Set(x.a.equipos.map(e => e.orden.memoria))]
    .filter(gb => gb > 0 && x.b.equipos.some(e => e.orden.memoria === gb))
    .sort((p, q) => p - q)
  const gb = comunes[0] ?? null
  const ea = gb ? conMemoria(x.a, gb)! : x.a.equipos[0]
  const eb = gb ? conMemoria(x.b, gb)! : x.b.equipos[0]
  const [barato, caro, eBarato, eCaro] = ea.precio <= eb.precio ? [x.a, x.b, ea, eb] : [x.b, x.a, eb, ea]
  const pesos = eCaro.precio - eBarato.precio
  return {
    barato,
    caro,
    eBarato,
    eCaro,
    memoria: gb ? (gb >= 1024 ? `${gb / 1024} TB` : `${gb} GB`) : null,
    pesos,
    pct: Math.round((pesos / eBarato.precio) * 100),
  }
}
