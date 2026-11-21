import type { OfertaLight } from '@/components/OfertaCard'
import datos from '@/data/top-concurso.json'

/** Top del concurso 21-23/11: precios reconfirmados a mano el 21/11 (data/top-concurso.json). */
export function topConcurso(): OfertaLight[] {
  return datos.items as OfertaLight[]
}
