// Datos de la lander /black-friday (brief EQUIPO-GROK/BRIEF-WEB-PREVIA-BF.md).
// Todo sale de data/black-friday-previa.json: acá no hay precios ni links
// inventados. Un slot solo se publica si se reconfirmó HOY (hora Argentina).
import datos from '@/data/black-friday-previa.json'

export type SlotBF = {
  slot: number
  categoria: string
  nombre: string
  precio: string
  precio_antes: string
  cuotas: string
  link_afiliado: string
  img: string
  /** '2026-11-27T15:40' en hora Argentina. */
  reconfirmado: string
  descuento: string
  ahorro: string
  sello_minimo: boolean
  mla: string
}

export type DatosBF = {
  link_canal_whatsapp: string
  link_canal_telegram: string
  ok_dia_d: boolean
  hora_actualizacion_pagina: string
  estado_evento: string
  grilla_fecha: string
  grilla_hora: string
  slots: SlotBF[]
}

export function getDatosBF(): DatosBF {
  return datos as DatosBF
}

/** Fecha 'AAAA-MM-DD' de hoy en Argentina. */
export function hoyAR(ahora = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Buenos_Aires' }).format(ahora)
}

/** El slot tiene lo mínimo del brief y se reconfirmó hoy (hora Argentina). */
export function slotPublicable(s: SlotBF, ahora = new Date()): boolean {
  if (!s.nombre || !s.precio || !s.link_afiliado || !s.reconfirmado) return false
  return s.reconfirmado.slice(0, 10) === hoyAR(ahora)
}

/** '2026-11-27T15:40' → '27/11 a las 15:40' */
export function reconfirmadoTexto(iso: string): string {
  const [f, h = ''] = iso.split('T')
  const [, m, d] = f.split('-')
  return h ? `${d}/${m} a las ${h.slice(0, 5)}` : `${d}/${m}`
}

/** Hora de inicio del Black Friday: viernes 27/11/2026 00:00 ART. */
export const INICIO_BF = '2026-11-27T00:00:00-03:00'
export const FIN_BF = '2026-11-28T00:00:00-03:00'

export type FaseBF = 'previa' | 'dia_d' | 'post'

export function faseBF(ahora = new Date()): FaseBF {
  const t = ahora.getTime()
  if (t < new Date(INICIO_BF).getTime()) return 'previa'
  if (t < new Date(FIN_BF).getTime()) return 'dia_d'
  return 'post'
}
