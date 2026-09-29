// Calculadora de consumo eléctrico (cazadordeofertas.com.ar/calculadora-consumo-electrico).
// Lógica pura: la usan la página, el componente cliente y
// scripts/verificar-consumo.ts.
//
// Fórmula (física, exacta): energía (kWh) = potencia (W) × horas / 1000.
// Por mes: W × horas por día × días de uso / 1000.
// El costo en $ lo calcula solo el usuario con SU precio del kWh (figura en la
// factura): no publicamos tarifas porque cambian por distribuidora, categoría y
// nivel de subsidio.
//
// Potencias por equipo: son ESTIMACIONES ORIENTATIVAS de rangos habituales,
// no datos de una norma. El usuario debe reemplazarlas por la potencia de la
// etiqueta/placa de su equipo. En heladeras y aires el compresor corta y
// arranca, así que usamos una potencia media (ver nota de cada equipo).

export interface Equipo {
  id: string
  nombre: string
  /** Potencia media orientativa en W (estimación). */
  watts: number
  horas: number
  dias: number
  nota: string
  /** Slug de comparativa en /mejores con ofertas de este equipo, si existe. */
  comparativa: string | null
  /** Búsqueda en ML si no hay comparativa u ofertas. */
  busqueda: string
}

export const EQUIPOS: Equipo[] = [
  { id: 'aire', nombre: 'Aire acondicionado', watts: 1100, horas: 6, dias: 30, nota: 'Equipo de ~3.000 frigorías con el compresor andando. Los inverter bajan la potencia al llegar a la temperatura: si la etiqueta trae kWh, usá ese dato.', comparativa: 'mejores-aires-acondicionados', busqueda: 'aire acondicionado split inverter' },
  { id: 'heladera', nombre: 'Heladera', watts: 40, horas: 24, dias: 30, nota: 'Potencia media: el compresor corta y arranca. Mejor usá el consumo anual de la etiqueta (kWh/año × 1000 ÷ 8760 = W medios).', comparativa: 'mejores-heladeras', busqueda: 'heladera no frost' },
  { id: 'freidora', nombre: 'Freidora de aire', watts: 1500, horas: 0.5, dias: 30, nota: 'Potencia de placa; la resistencia cicla, así que el consumo real suele ser algo menor.', comparativa: 'mejores-freidoras-de-aire', busqueda: 'freidora de aire' },
  { id: 'lavarropas', nombre: 'Lavarropas', watts: 500, horas: 1, dias: 12, nota: 'Promedio de un ciclo con agua fría; calentar agua multiplica el consumo. La etiqueta indica kWh por ciclo.', comparativa: 'mejores-lavarropas', busqueda: 'lavarropas automatico' },
  { id: 'termotanque', nombre: 'Termotanque eléctrico', watts: 1500, horas: 3, dias: 30, nota: 'Horas en que la resistencia está calentando (no las 24 h enchufado). Depende mucho del uso de agua caliente.', comparativa: 'mejores-termotanques', busqueda: 'termotanque electrico' },
  { id: 'pava', nombre: 'Pava eléctrica', watts: 2000, horas: 0.2, dias: 30, nota: 'Unos 12 minutos por día en total.', comparativa: null, busqueda: 'pava electrica' },
  { id: 'microondas', nombre: 'Microondas', watts: 1200, horas: 0.25, dias: 30, nota: 'Potencia consumida (es mayor que la "potencia de salida" que figura en la caja).', comparativa: 'mejores-microondas', busqueda: 'microondas' },
  { id: 'estufa', nombre: 'Estufa eléctrica / caloventor', watts: 2000, horas: 4, dias: 30, nota: 'En potencia máxima. Con termostato corta al llegar a la temperatura.', comparativa: null, busqueda: 'estufa electrica' },
  { id: 'notebook', nombre: 'Notebook', watts: 50, horas: 8, dias: 22, nota: 'Uso de oficina; el cargador marca el máximo (p.ej. 65 W), no el promedio.', comparativa: 'mejores-notebooks', busqueda: 'notebook' },
  { id: 'tv', nombre: 'Smart TV', watts: 90, horas: 4, dias: 30, nota: 'TV LED de unas 50". La etiqueta indica la potencia en modo encendido.', comparativa: 'mejores-smart-tv', busqueda: 'smart tv' },
]

export interface Resultado {
  kwhDia: number
  kwhMes: number
  kwhAnio: number
  /** null si no se cargó precio del kWh. */
  costoMes: number | null
  costoAnio: number | null
}

const pos = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0)

export function calcularConsumo(watts: number, horas: number, dias: number, precioKwh?: number): Resultado {
  const h = Math.min(24, pos(horas))
  const d = Math.min(31, pos(dias))
  const kwhDia = (pos(watts) * h) / 1000
  const kwhMes = kwhDia * d
  const kwhAnio = kwhMes * 12
  const p = pos(precioKwh ?? 0)
  return { kwhDia, kwhMes, kwhAnio, costoMes: p ? kwhMes * p : null, costoAnio: p ? kwhAnio * p : null }
}

/** W medios a partir del consumo anual de la etiqueta (kWh/año). */
export const wattsDesdeKwhAnio = (kwhAnio: number) => (pos(kwhAnio) * 1000) / (365 * 24)
