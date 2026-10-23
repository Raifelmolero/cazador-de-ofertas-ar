// Vidriera de ticket alto en tecnología: celulares y notebooks de marcas
// conocidas que hoy están en su mínimo o con descuento real. Panel de afiliados
// 28/09-11/10: 8 celulares dejaron $802k de $2,03M (40 %) y notebooks $367k;
// desde el 12/10 se vendió 1 celular. La portada es la página con más clics a
// ML, pero en el celular se scrollea solo el 31 %: por eso van arriba.
//
// Sale de los mismos equipos que el comparador (lib/comparador: sin accesorios,
// fundas ni tablets) y solo de las ofertas de hoy, que traen el link de afiliado.
import { COMPARADORES, USADOS, equiposDe, type Equipo } from '@/lib/comparador'
import { normalizar } from '@/lib/categorias'
import { getOfertas } from '@/lib/productos'
import { TICKET_ALTO_DESDE } from '@/lib/ticketalto'

export interface ItemTecno {
  id_ml: string
  titulo: string
  tipo: 'celular' | 'notebook'
  precio_actual: number
  precio_anterior?: number
  descuento_pct?: number
  minimo_historico?: boolean
  url_producto: string
  url_imagen: string | null
  /** ganancia esperada del bot (ticket × comisión de la categoría) */
  prioridad: number
  marca: string
}

/** Descuento mínimo para entrar sin estar en el mínimo histórico. */
const DESCUENTO_MIN = 15
const MAX_POR_MARCA = 2

// Marcas y líneas que se venden (y se buscan) por nombre. Celulares: gama media
// alta para arriba; sin gama de entrada aunque supere el umbral de precio.
const CELU_OK = /\biphone\b|\bgalaxy (s|z ?(fold|flip))\s?\d|\bgalaxy a[5-9]\d\b|\b(moto(rola)?\s)?(edge|razr)\b|\b(xiaomi|redmi note|poco [fx]\d)/
const NB_MARCAS = new Set(['Apple', 'Lenovo', 'HP', 'Asus', 'Dell'])

/** Mismo modelo en otro color o con el título escrito distinto: uno solo. */
function modelo(titulo: string): string {
  const palabras = normalizar(titulo.split(' - ')[0])
    .replace(/[^a-z0-9 ]+/g, ' ')
    .split(/\s+/)
    .filter(p => p && !['notebook', 'laptop', 'gamer', 'celular', 'smartphone', 'telefono', 'apple', 'de', 'con'].includes(p))
  return palabras.slice(0, 3).join(' ')
}

function califica(e: Equipo, tipo: ItemTecno['tipo']): boolean {
  const t = normalizar(e.titulo)
  if (USADOS.test(t)) return false
  return tipo === 'celular' ? CELU_OK.test(t) : NB_MARCAS.has(e.marca)
}

/**
 * Celulares y notebooks de ticket alto para destacar, por ganancia esperada.
 * Reparte el lugar entre los dos rubros (al menos la mitad para cada uno si hay)
 * y no repite modelo. `minimo` sube el piso de precio (ej. compra mínima de un
 * cupón); `excluir` saca ids que la página ya muestra en otro bloque.
 */
export function vidrieraTecno({ cantidad = 6, minimo = 0, excluir = [] }: { cantidad?: number; minimo?: number; excluir?: Iterable<string> } = {}): ItemTecno[] {
  const fuera = new Set(excluir)
  const ofertas = new Map(getOfertas().map(o => [o.id_ml, o]))
  const piso = Math.max(TICKET_ALTO_DESDE, minimo)

  const porTipo = (['celular', 'notebook'] as const).map(tipo => {
    const c = COMPARADORES.find(x => x.slug === (tipo === 'celular' ? 'celulares' : 'notebooks'))
    if (!c) return []
    const vistos = new Set<string>()
    const out: ItemTecno[] = []
    for (const e of equiposDe(c)) {
      const o = ofertas.get(e.id)
      if (!e.enOferta || !o || fuera.has(o.id_ml) || o.precio_actual < piso || !califica(e, tipo)) continue
      if (!o.minimo_historico && (o.descuento_pct ?? 0) < DESCUENTO_MIN) continue
      out.push({
        id_ml: o.id_ml,
        titulo: o.titulo,
        tipo,
        precio_actual: o.precio_actual,
        precio_anterior: o.precio_anterior,
        descuento_pct: o.descuento_pct,
        minimo_historico: o.minimo_historico,
        url_producto: o.url_producto,
        url_imagen: o.url_imagen,
        prioridad: o.prioridad ?? 0,
        marca: e.marca,
      })
    }
    // Por ganancia esperada; ante empate, el de más descuento. Un modelo por
    // tarjeta y hasta 2 por marca (si no, la fila es toda iPhone).
    const porMarca = new Map<string, number>()
    return out
      .sort((a, b) => b.prioridad - a.prioridad || (b.descuento_pct ?? 0) - (a.descuento_pct ?? 0))
      .filter(i => {
        const m = modelo(i.titulo)
        const n = porMarca.get(i.marca) ?? 0
        if (vistos.has(m) || n >= MAX_POR_MARCA) return false
        vistos.add(m)
        porMarca.set(i.marca, n + 1)
        return true
      })
  })

  const mitad = Math.floor(cantidad / 2)
  const [celus, nbs] = porTipo
  const elegidos = [...celus.slice(0, mitad), ...nbs.slice(0, mitad)]
  const resto = [...celus.slice(mitad), ...nbs.slice(mitad)].sort((a, b) => b.prioridad - a.prioridad)
  return [...elegidos, ...resto.slice(0, cantidad - elegidos.length)].sort((a, b) => b.prioridad - a.prioridad)
}
