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
const HP_255_G10: Modelo = { nombre: 'HP 255 G10', re: /\bhp 255r? g10\b/ }
const ASPIRE_GO_15: Modelo = { nombre: 'Acer Aspire Go 15', re: /\baspire go 15\b/ }
const ASPIRE_LITE_15: Modelo = { nombre: 'Acer Aspire Lite 15', re: /\baspire lite (15\b|al15)/ }
const VIVOBOOK_15: Modelo = { nombre: 'Asus Vivobook 15', re: /\bvivobook (15\b|f1504|m1502)/ }
const VIVOBOOK_14: Modelo = { nombre: 'Asus Vivobook 14', re: /\bvivobook (14\b|x1404)/ }
const IDEAPAD_SLIM_3: Modelo = { nombre: 'Lenovo IdeaPad Slim 3', re: /\bideapad (slim 3|3 slim)\b/ }
const IDEAPAD_1: Modelo = { nombre: 'Lenovo IdeaPad 1', re: /\bideapad 1\b/ }
const GALAXY_BOOK4: Modelo = { nombre: 'Samsung Galaxy Book4', re: /\bgalaxy book ?4\b/ }
const LENOVO_LOQ: Modelo = { nombre: 'Lenovo LOQ', re: /\bloq\b/ }
const HP_OMEN: Modelo = { nombre: 'HP OMEN', re: /\bomen\b/ }

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
  // Notebooks: cada modelo se vende en varias configuraciones, así que la tabla
  // muestra qué procesadores y discos hay de cada uno.
  { slug: 'hp-255-g10-vs-acer-aspire-go-15', comparador: 'notebooks', a: HP_255_G10, b: ASPIRE_GO_15, contexto: 'Dos de las notebooks con Ryzen 7 más vendidas en Argentina, cara a cara.' },
  { slug: 'acer-aspire-lite-15-vs-hp-255-g10', comparador: 'notebooks', a: ASPIRE_LITE_15, b: HP_255_G10, contexto: 'Acer contra HP en la gama media para trabajar y estudiar.' },
  { slug: 'asus-vivobook-15-vs-lenovo-ideapad-slim-3', comparador: 'notebooks', a: VIVOBOOK_15, b: IDEAPAD_SLIM_3, contexto: 'Las dos notebooks de 15" más buscadas para estudiar y home office.' },
  { slug: 'lenovo-ideapad-1-vs-acer-aspire-lite-15', comparador: 'notebooks', a: IDEAPAD_1, b: ASPIRE_LITE_15, contexto: 'Las de entrada de Lenovo y Acer: cuánto más cuesta dar el salto.' },
  { slug: 'samsung-galaxy-book4-vs-asus-vivobook-15', comparador: 'notebooks', a: GALAXY_BOOK4, b: VIVOBOOK_15, contexto: 'Samsung contra Asus en notebooks de 15" para el día a día.' },
  { slug: 'asus-vivobook-14-vs-asus-vivobook-15', comparador: 'notebooks', a: VIVOBOOK_14, b: VIVOBOOK_15, contexto: 'La misma línea de Asus en dos tamaños: cuánto cambia el precio.' },
  { slug: 'lenovo-loq-vs-hp-omen', comparador: 'notebooks', a: LENOVO_LOQ, b: HP_OMEN, contexto: 'Notebooks gamer: la LOQ de Lenovo contra la OMEN de HP.' },
]

export interface Lado {
  modelo: Modelo
  equipos: Equipo[] // de menor a mayor precio
  desde: number
  minimo: number | null // el más bajo registrado entre sus publicaciones
  memorias: string[] // celulares: memoria interna; notebooks: disco ("256 GB", "1 TB"...)
  procesadores: string[] // solo notebooks
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
  const memorias = [...new Set(xs.map(e => e.orden.memoria ?? e.orden.disco).filter(n => n > 0))]
    .sort((x, y) => x - y)
    .map(n => (n >= 1024 ? `${n / 1024} TB` : `${n} GB`))
  const procesadores = [...new Set(xs.map(e => e.specs.procesador).filter((p): p is string => !!p))].sort()
  return {
    modelo,
    equipos: xs,
    desde: xs[0].precio,
    minimo: mins.length ? Math.min(...mins) : null,
    memorias,
    procesadores,
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

/** Con qué se compara "a igual": la memoria en celulares, el procesador en notebooks. */
const igualDe = (e: Equipo): string | undefined => e.specs.memoria ?? e.specs.procesador

/**
 * Diferencia de precio entre los dos. Si comparten alguna memoria (celulares)
 * o procesador (notebooks), se compara a igual, en la que sale más barata:
 * comparar un 128 GB contra un 256 GB, o un Celeron contra un Ryzen 7,
 * exageraría la diferencia. Si no, se compara el más barato de cada lado.
 */
export function diferencia(x: DueloArmado) {
  const comunes = [...new Set(x.a.equipos.map(igualDe))].filter(
    (k): k is string => !!k && x.b.equipos.some(e => igualDe(e) === k),
  )
  // equipos ya viene de menor a mayor precio: el primero con esa clave es el más barato
  const par = (k: string) => [x.a.equipos.find(e => igualDe(e) === k)!, x.b.equipos.find(e => igualDe(e) === k)!] as const
  const igual = comunes.sort((p, q) => Math.min(...par(p).map(e => e.precio)) - Math.min(...par(q).map(e => e.precio)))[0] ?? null
  const [ea, eb] = igual ? par(igual) : [x.a.equipos[0], x.b.equipos[0]]
  const [barato, caro, eBarato, eCaro] = ea.precio <= eb.precio ? [x.a, x.b, ea, eb] : [x.b, x.a, eb, ea]
  const pesos = eCaro.precio - eBarato.precio
  return {
    barato,
    caro,
    eBarato,
    eCaro,
    igual, // "256 GB", "AMD Ryzen 7"... o null
    pesos,
    pct: Math.round((pesos / eBarato.precio) * 100),
  }
}
