// Frescura del precio de una oferta. Módulo puro (sin fs): lo usan servidor y componentes cliente.
//
// Las ofertas cargadas a mano guardan `precio_visto` (YYYY-MM-DD): el día en que se vio el precio en
// Mercado Libre. El bot las descarta a los 14 días (MANUAL_MAX_DIAS en bot/cazador_bot.py), pero entre
// una corrida y el próximo deploy el sitio puede tener precios de hace una semana o más. Ese precio no
// se puede mostrar como «hoy»: se ordena después de los recientes y se rotula con su antigüedad.

/** Pasados estos días desde que se vio el precio, la oferta ya no se muestra (misma regla que el bot). */
export const DIAS_VIGENCIA = 14
/** Hasta acá el precio se considera «de hoy» (ordena primero). */
export const DIAS_PRECIO_RECIENTE = 3
/** Más que esto es un precio viejo: va después y pide confirmarlo en Mercado Libre. */
export const DIAS_PRECIO_VIEJO = 7

/** Hoy (YYYY-MM-DD, UTC) al armar el sitio. */
export const hoyISO = () => new Date().toISOString().slice(0, 10)

/** Días enteros entre `fecha` (YYYY-MM-DD) y `hoy`; null si no hay fecha legible. Nunca negativo. */
export function diasDesde(fecha?: string | null, hoy: string = hoyISO()): number | null {
  if (!fecha || !/^\d{4}-\d{2}-\d{2}/.test(fecha)) return null
  const d = Math.round((Date.parse(hoy.slice(0, 10)) - Date.parse(fecha.slice(0, 10))) / 86_400_000)
  return Number.isNaN(d) ? null : Math.max(d, 0)
}

/** ¿Pasó la vigencia? Sin fecha (productos viejos del escaneo) no se poda, igual que en el bot. */
export const precioVencido = (fecha?: string | null) => {
  const d = diasDesde(fecha)
  return d !== null && d > DIAS_VIGENCIA
}

/** ¿El precio tiene más de DIAS_PRECIO_VIEJO días? (sin fecha: no) */
export const edadVieja = (dias?: number | null) => (dias ?? 0) > DIAS_PRECIO_VIEJO

/** Para ordenar: 0 = precio reciente o de la última semana, 1 = viejo. Va primero el 0. */
export const tramoEdad = (dias?: number | null) => (edadVieja(dias) ? 1 : 0)

/** Rótulo para el precio según su antigüedad; null si es de hoy o de ayer. */
export function etiquetaEdad(dias?: number | null): string | null {
  if (dias == null || dias < 2) return null
  return dias > DIAS_PRECIO_VIEJO
    ? `Precio de hace ${dias} días: confirmalo en Mercado Libre`
    : `Precio visto hace ${dias} días`
}
