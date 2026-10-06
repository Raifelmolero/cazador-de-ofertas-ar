// Umbral de "ticket alto" compartido por el cliente (tarjeta) y el servidor
// (orden de la grilla). Aparte de lib/ofertashoy.ts porque ese módulo importa
// 'fs' vía productos y no puede llegar al bundle del navegador.
export const TICKET_ALTO_DESDE = 250_000
