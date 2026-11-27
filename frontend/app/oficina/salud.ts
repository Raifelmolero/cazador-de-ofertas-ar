// Lógica de semáforos de la Oficina. Pura: recibe "ahora" por parámetro.

export interface Metrica {
  label: string
  valor: number
  delta?: number
}
export interface Depto {
  id: string
  nombre: string
  emoji: string
  descripcion: string
  automatico: boolean
  frecuencia: string
  badge?: string
  ultima_actividad: string | null
  sin_registro?: boolean
  agentes: { nombre: string; tarea: string }[]
  metricas: Metrica[]
  metricas_titulo?: string
  ultimo_trabajo?: string | null
  entregas?: { fecha: string; titulo: string }[]
  proximamente?: boolean
  ventana_horas?: number
}
export interface DatosOficina {
  generado: string
  departamentos: Depto[]
}

export type Nivel = 'ok' | 'revisar' | 'pausa' | 'espera' | 'guardia' | 'pronto'

export interface Salud {
  nivel: Nivel
  texto: string
  detalle: string
}

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const DIAS_PAUSA = 30

export function haceCuanto(ms: number): string {
  const min = Math.max(0, Math.round(ms / 60000))
  if (min < 1) return 'hace un momento'
  if (min < 60) return `hace ${min} min`
  const h = Math.round(min / 60)
  if (h < 48) return `hace ${h} h`
  return `hace ${Math.round(h / 24)} días`
}

export function salud(d: Depto, ahora: number): Salud {
  if (d.proximamente) return { nivel: 'pronto', texto: 'Próximamente', detalle: 'Se suma en las próximas semanas' }
  if (d.sin_registro && !d.ultima_actividad) {
    return { nivel: 'guardia', texto: 'Vigilando', detalle: `${d.frecuencia} · sin registro en el repo` }
  }
  if (!d.ultima_actividad) return { nivel: 'espera', texto: 'En espera', detalle: 'Sin actividad todavía' }
  const t = new Date(d.ultima_actividad).getTime()
  const ms = ahora - t
  if (d.automatico) {
    const ok = ms < (d.ventana_horas ?? 12) * 3600 * 1000
    return {
      nivel: ok ? 'ok' : 'revisar',
      texto: ok ? 'Trabajando' : 'Revisar: sin actividad',
      detalle: `Última actividad ${haceCuanto(ms)}`,
    }
  }
  if (ms > DIAS_PAUSA * 86400 * 1000) {
    return {
      nivel: 'pausa',
      texto: `Sin informes desde ${MESES[new Date(t).getUTCMonth()]}`,
      detalle: 'Espera que le pidan algo',
    }
  }
  return { nivel: 'espera', texto: 'Listo, espera tarea', detalle: `Última entrega ${haceCuanto(ms)}` }
}

export function resumen(deptos: Depto[], ahora: number) {
  let ok = 0
  let revisar = 0
  let pausa = 0
  for (const d of deptos) {
    const n = salud(d, ahora).nivel
    if (n === 'revisar') revisar++
    else if (n === 'pausa') pausa++
    else if (n !== 'pronto') ok++
  }
  return { ok, revisar, pausa }
}

// Turnos (hora de Buenos Aires): de noche solo guardia; de día bot + Claude + Grok.
export const TURNO_DIA = { desde: 8, hasta: 22 }

export function horaBA(ahora: number): number {
  const h = new Intl.DateTimeFormat('en-GB', {
    hour: 'numeric',
    hour12: false,
    timeZone: 'America/Argentina/Buenos_Aires',
  }).format(new Date(ahora))
  return Number(h) % 24
}

export function esDeDia(hora: number): boolean {
  return hora >= TURNO_DIA.desde && hora < TURNO_DIA.hasta
}
