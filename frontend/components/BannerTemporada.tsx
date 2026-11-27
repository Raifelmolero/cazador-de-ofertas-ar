import BannerTemporadaVivo from '@/components/BannerTemporadaVivo'

/** Banner de la fecha comercial vigente (ver lib/temporada.ts). El servidor pasa la fecha del
 *  render; el navegador la vuelve a evaluar al montar (la home es estática, deploy cada ~3 días). */
export default function BannerTemporada({ ahora = new Date() }: { ahora?: Date }) {
  return <BannerTemporadaVivo ahoraInicial={ahora.getTime()} />
}
