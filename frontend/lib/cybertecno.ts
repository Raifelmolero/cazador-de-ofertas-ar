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
