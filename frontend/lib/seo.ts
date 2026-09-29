// Helpers para que <title> y meta description entren en lo que muestra Google.
export const MAX_TITULO = 65
export const MAX_DESCRIPCION = 158

// Palabras que no deben quedar colgando al final de un recorte.
const CONECTORES = new Set(['de', 'del', 'la', 'el', 'los', 'las', 'con', 'sin', 'para', 'por', 'y', 'o', 'e', 'a', 'en', 'un', 'una', '+', '-', '—', '–', '|', '/', 'x'])

function limpiarCola(t: string): string {
  let palabras = t.trim().split(/\s+/)
  while (palabras.length > 1 && CONECTORES.has(palabras[palabras.length - 1].toLowerCase())) palabras = palabras.slice(0, -1)
  return palabras.join(' ').replace(/[\s,;:.\-–—|/(]+$/, '')
}

/** Recorta en palabra completa (sin cortar marcas/modelos al medio). `sufijo` se agrega solo si hubo recorte. */
export function recortar(texto: string, max: number, sufijo = '…'): string {
  const t = texto.replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  const lim = max - sufijo.length
  let corte = t.slice(0, lim + 1)
  const esp = corte.lastIndexOf(' ')
  corte = esp > 0 ? corte.slice(0, esp) : t.slice(0, lim)
  return limpiarCola(corte) + sufijo
}

/**
 * Arma un título probando formatos en orden (del más completo —con marca— al más corto)
 * con el nombre entero; si ninguno entra, usa el último formato con el nombre recortado en palabra.
 */
export function tituloSeo(nombre: string, formatos: ((n: string) => string)[], max = MAX_TITULO): string {
  const n = nombre.replace(/\s+/g, ' ').trim()
  for (const f of formatos) if (f(n).length <= max) return f(n)
  const ultimo = formatos[formatos.length - 1]
  const disponible = max - ultimo('').length
  return ultimo(recortar(n, Math.max(disponible, 10), '')).slice(0, max)
}

export const descripcionSeo = (texto: string) => recortar(texto, MAX_DESCRIPCION)

/**
 * Títulos distintos de ML que quedan iguales al recortarlos (p. ej. mismo modelo
 * en otro color o capacidad). Para cada id devuelve las palabras de su título
 * que no comparten todos los demás del grupo (máx. 3, tal cual vienen en el
 * título de ML) para agregarlas al nombre; '' si no hace falta.
 */
export function diferenciadores(nombres: Map<string, string>, recortado: (n: string) => string): Map<string, string> {
  const grupos = new Map<string, string[]>()
  for (const [id, n] of nombres) {
    const k = recortado(n)
    grupos.set(k, [...(grupos.get(k) ?? []), id])
  }
  const out = new Map<string, string>()
  const pal = (n: string) => n.replace(/\s+/g, ' ').trim().split(' ')
  for (const ids of grupos.values()) {
    if (ids.length < 2) continue
    const sets = ids.map(id => new Set(pal(nombres.get(id)!).map(w => w.toLowerCase())))
    ids.forEach((id, i) => {
      const propias = pal(nombres.get(id)!).filter(w => sets.some((s, j) => j !== i && !s.has(w.toLowerCase())))
      out.set(id, [...new Set(propias)].slice(0, 3).join(' '))
    })
  }
  return out
}

/** Agrega el diferenciador al nombre en todos los formatos (también al recortado). */
export const conDiferencia = (dif: string | undefined, formatos: ((n: string) => string)[]) =>
  dif ? formatos.map(f => (n: string) => f(`${n} ${dif}`)) : formatos
