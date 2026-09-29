// Calculadora de frigorías (cazadordeofertas.com.ar/calculadora-frigorias).
// Lógica pura: la usan la página, el componente cliente y
// scripts/verificar-frigorias.ts.
//
// Conversiones (exactas, por definición de unidades):
// - Frigoría = 1 kilocaloría/hora de frío (kcal/h).
// - Caloría internacional (IT) = 4,1868 J y BTU (IT) = 1055,05585262 J
//   (NIST SP 811, apéndice B.8; ISO 80000-5).
//   → 1 frigoría/h = 4186,8 / 1055,05585262 = 3,9683 BTU/h
//   → 1 kW = 3.600.000 J/h / 4186,8 = 859,85 frigorías/h
//
// Carga térmica: la regla "volumen (m² × altura) × 50 frigorías" es una
// estimación orientativa muy usada en Argentina (vendedores e instaladores).
// NO encontramos una norma oficial que la fije, así que la página la presenta
// como estimación. Los ajustes por sol, personas y equipos también son
// orientativos, pero los de equipos son física pura: toda la potencia eléctrica
// que consume un aparato termina como calor (1 W = 0,86 frigorías).

export const J_POR_KCAL = 4186.8
export const J_POR_BTU = 1055.05585262
export const BTU_POR_FRIGORIA = J_POR_KCAL / J_POR_BTU // 3,9683
export const FRIGORIAS_POR_KW = 3_600_000 / J_POR_KCAL // 859,85

export const frigoriasABtu = (f: number) => f * BTU_POR_FRIGORIA
export const btuAFrigorias = (b: number) => b / BTU_POR_FRIGORIA
export const frigoriasAKw = (f: number) => f / FRIGORIAS_POR_KW
export const kwAFrigorias = (kw: number) => kw * FRIGORIAS_POR_KW

export const FRIGORIAS_POR_M3 = 50
/** Personas incluidas en la regla base; cada una extra suma PERSONA_EXTRA. */
export const PERSONAS_BASE = 2
/** Una persona sentada libera ~100-120 W de calor (≈ 90-100 kcal/h): orientativo. */
export const PERSONA_EXTRA = 100

export type Sol = 'poco' | 'normal' | 'mucho'
export const SOLES: { id: Sol; nombre: string; ajuste: number; ayuda: string }[] = [
  { id: 'poco', nombre: 'Poco sol', ajuste: 0, ayuda: 'Orientación sur o a la sombra' },
  { id: 'normal', nombre: 'Sol normal', ajuste: 0.1, ayuda: 'Este, o algunas horas de sol' },
  { id: 'mucho', nombre: 'Mucho sol', ajuste: 0.2, ayuda: 'Norte/oeste, ventanales o último piso' },
]

/** Tamaños comerciales habituales en Argentina (frigorías). */
export const TAMANOS = [2250, 2750, 3000, 3500, 4500, 5500, 6000] as const

export interface Entrada {
  m2: number
  altura: number
  sol: Sol
  personas: number
  /** Watts de equipos que quedan prendidos (TV, PC, heladera, iluminación). */
  watts: number
}

export interface Resultado {
  base: number
  porSol: number
  porPersonas: number
  porEquipos: number
  total: number
  btu: number
  kw: number
  /** Tamaño comercial recomendado (el primero que cubre el total), o null si supera 6000. */
  recomendado: number | null
}

export function calcularFrigorias(e: Entrada): Resultado {
  const m2 = Math.max(0, e.m2 || 0)
  const altura = Math.max(0, e.altura || 0)
  const base = m2 * altura * FRIGORIAS_POR_M3
  const ajuste = SOLES.find(s => s.id === e.sol)?.ajuste ?? 0
  const porSol = base * ajuste
  const porPersonas = Math.max(0, Math.round(e.personas || 0) - PERSONAS_BASE) * PERSONA_EXTRA
  const porEquipos = Math.max(0, e.watts || 0) * (FRIGORIAS_POR_KW / 1000)
  const total = Math.round(base + porSol + porPersonas + porEquipos)
  return {
    base: Math.round(base),
    porSol: Math.round(porSol),
    porPersonas,
    porEquipos: Math.round(porEquipos),
    total,
    btu: Math.round(frigoriasABtu(total)),
    kw: Math.round(frigoriasAKw(total) * 100) / 100,
    recomendado: tamanoComercial(total),
  }
}

export function tamanoComercial(total: number): number | null {
  if (total <= 0) return null
  return TAMANOS.find(t => t >= total) ?? null
}

function normalizar(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

/** Frigorías que declara el título de una publicación ("2752 Frigorías",
 *  "5700f", "3105 Fg", "3200W", "12000 BTU"). null si no se puede leer. */
export function frigoriasDelTitulo(titulo: string): number | null {
  const t = normalizar(titulo).replace(/(\d)\.(\d{3})/g, '$1$2')
  const f = t.match(/(?:^|\D)(\d{4})\s*(?:frigorias|frig|fg|f)(?![a-z])/)
  if (f) return Number(f[1])
  const btu = t.match(/(?:^|\D)(\d{4,5})\s*btu/)
  if (btu) return Math.round(btuAFrigorias(Number(btu[1])))
  const w = t.match(/(?:^|\s)(\d{4})\s*w(?![a-z])/)
  if (w) return Math.round(kwAFrigorias(Number(w[1]) / 1000))
  return null
}

/** Un equipo "sirve" para el recomendado si su capacidad está entre el
 *  necesario y el tamaño comercial siguiente (con 5% de tolerancia abajo:
 *  los títulos redondean, p.ej. 2700 f para 2750). */
export function sirvePara(capacidad: number, necesario: number, recomendado: number | null): boolean {
  if (!recomendado) return capacidad >= necesario * 0.95
  const i = TAMANOS.indexOf(recomendado as (typeof TAMANOS)[number])
  const techo = TAMANOS[i + 1] ?? recomendado * 1.25
  return capacidad >= Math.min(necesario, recomendado) * 0.95 && capacidad < techo
}
