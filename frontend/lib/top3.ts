// Bloques "3 ofertas destacadas": antes tomaban las 3 primeras de la lista, y
// como el orden premia el mínimo histórico salían ofertas con 7-12 % OFF
// (19/10). Ahora van primero las de al menos 20 % OFF, respetando el orden
// recibido; si no alcanzan, se completa con las siguientes para no dejar el
// bloque vacío en páginas flacas.
export const DESCUENTO_MIN_DESTACADA = 20

export function elegirTop<T extends { descuento_pct?: number | null }>(ofertas: T[], n = 3): T[] {
  const fuertes = ofertas.filter(o => (o.descuento_pct ?? 0) >= DESCUENTO_MIN_DESTACADA)
  if (fuertes.length >= n) return fuertes.slice(0, n)
  const resto = ofertas.filter(o => (o.descuento_pct ?? 0) < DESCUENTO_MIN_DESTACADA)
  return [...fuertes, ...resto].slice(0, n)
}
