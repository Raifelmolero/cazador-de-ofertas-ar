// Datos de /mejor/aires-acondicionados (T-010). Precios verificados a mano el 18/11/2026
// (informe de tendencias del día). Se actualizan editando este archivo; no se scrapea nada.
// No se muestra el % de descuento anunciado: en varios aires el "antes" estaba inflado.
export const AIRES_VERIFICADO = '2026-11-18'
const TAG = 'matt_word=web&matt_tool=37267219'

export interface AireHoy {
  id: string
  titulo: string
  /** Capacidad tal como figura en el título de la publicación (no la inventamos). */
  capacidad: string
  precio: number
  url: string
  nota?: string
}

const link = (id: string) => `https://www.mercadolibre.com.ar/p/${id}?${TAG}`

export const AIRES_HOY: AireHoy[] = [
  { id: 'MLA80862058', titulo: 'Aire Likon split inverter frío/calor 3200F', capacidad: '3200 frigorías', precio: 699999, url: link('MLA80862058'), nota: 'El más barato de la lista.' },
  { id: 'MLA45670320', titulo: 'Aire Hyundai split inverter con wifi 3200W', capacidad: '3200 W', precio: 761779, url: link('MLA45670320') },
  { id: 'MLA63226247', titulo: 'Aire Philco split inverter frío/calor 3225 fg', capacidad: '3225 frigorías', precio: 824754, url: link('MLA63226247') },
  { id: 'MLA80863421', titulo: 'Aire BGH split inverter con wifi frío/calor', capacidad: 'ver publicación', precio: 828870, url: link('MLA80863421') },
  { id: 'MLA60932288', titulo: 'Aire Samsung split inverter frío/calor 2580F', capacidad: '2580 frigorías', precio: 883599, url: link('MLA60932288'), nota: 'Otro vendedor lo tiene a $1.055.999: comparar antes de comprar.' },
  { id: 'MLA15316559', titulo: 'Aire LG DualCool 4500 frío/calor inverter', capacidad: '4500 frigorías', precio: 1458329, url: link('MLA15316559'), nota: 'El de mayor capacidad de la lista.' },
]
