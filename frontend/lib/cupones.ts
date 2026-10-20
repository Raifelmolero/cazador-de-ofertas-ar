// Cupón del día de Mercado Libre (data/cupones-del-dia.json). Los códigos los
// manda Mercado Libre al canal oficial de Afiliados para difundir; acá solo se
// muestran mientras están vigentes. El sitio se rebuildea varias veces por día
// (la corrida de la noche cae después de las 00:00), así que uno vencido no
// queda más de unas horas; igual el texto dice hasta cuándo vale.
import data from '@/data/cupones-del-dia.json'

export interface CuponDelDia {
  codigo: string
  descuento: number
  minimo: number
  hasta: string
  condiciones?: string
  campania?: string
  link?: string
}

export function cuponesVigentes(ahora = new Date(), cupones: CuponDelDia[] = data.cupones): CuponDelDia[] {
  return cupones.filter(c => new Date(c.hasta).getTime() > ahora.getTime())
}

const pesos = (n: number) => `$${n.toLocaleString('es-AR')}`

export function textoCupon(c: CuponDelDia): string {
  const d = new Date(c.hasta)
  const hora = d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'America/Argentina/Buenos_Aires' })
  const dia = d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', timeZone: 'America/Argentina/Buenos_Aires' })
  return `${pesos(c.descuento)} OFF en compras desde ${pesos(c.minimo)}. Vale hasta las ${hora} del ${dia}${c.condiciones ? ` · ${c.condiciones}` : ''}.`
}
