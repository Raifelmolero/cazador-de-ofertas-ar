// Monotributo (ARCA): tabla con valores de aplicación desde el 1/08/2026.
// Fuente: arca.gob.ar/monotributo/categorias.asp (leída el 27/09/2026).
// El tope de la K y el precio unitario máximo coinciden con los que usa
// Mercado Libre para la percepción de IVA ("montos actualizados en agosto de
// 2026", nota "Percepción de IVA para monotributistas"). Si ARCA publica una
// tabla nueva, actualizar acá: la guía de /vender sale de este archivo.

export const MONOTRIBUTO_VIGENCIA = '1/08/2026'
export const MONOTRIBUTO_VERIFICADO = '27 de septiembre de 2026'
export const FUENTE_MONOTRIBUTO = 'https://www.arca.gob.ar/monotributo/categorias.asp'

/** Precio unitario máximo para venta de cosas muebles (igual en todas las categorías). */
export const PRECIO_UNITARIO_MAX = 716840.77

/** Por categoría: tope de ingresos brutos anuales y cuota mensual total para
 *  venta de cosas muebles (impuesto integrado + SIPA + obra social del
 *  titular, sin adherentes). */
export const CATEGORIAS_MONOTRIBUTO: { cat: string; tope: number; cuotaVenta: number }[] = [
  { cat: 'A', tope: 12009410.45, cuotaVenta: 49527.18 },
  { cat: 'B', tope: 17595182.74, cuotaVenta: 56379.08 },
  { cat: 'C', tope: 24670494.31, cuotaVenta: 64530.58 },
  { cat: 'D', tope: 30628651.43, cuotaVenta: 82564.81 },
  { cat: 'E', tope: 36028231.33, cuotaVenta: 108267.51 },
  { cat: 'F', tope: 45151659.41, cuotaVenta: 129930.65 },
  { cat: 'G', tope: 53995798.87, cuotaVenta: 158815.05 },
  { cat: 'H', tope: 81924660.37, cuotaVenta: 317895.01 },
  { cat: 'I', tope: 91699761.9, cuotaVenta: 474992.78 },
  { cat: 'J', tope: 105012519.2, cuotaVenta: 580793.69 },
  { cat: 'K', tope: 126610838.75, cuotaVenta: 702103.24 },
]

/** Tope anual del monotributo (categoría K). */
export const TOPE_MONOTRIBUTO = CATEGORIAS_MONOTRIBUTO[CATEGORIAS_MONOTRIBUTO.length - 1].tope

/** Pesos con centavos, formato argentino: $12.009.410,45 */
export const arsCentavos = (n: number) =>
  `$${n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
