'use client'
import { useEffect } from 'react'
import { track } from '@vercel/analytics'
import { faseBF } from '@/lib/black-friday-previa'

/** Eventos de la lander (brief §8), en Vercel Analytics con prefijo `bf_`.
 *  Cualquier link con `data-bf-evento="cta_whatsapp"` dispara `bf_cta_whatsapp`;
 *  los demás atributos `data-bf-*` viajan como parámetros (placement, slot, mla,
 *  categoria). El `clic_ml` general de clics-ml.tsx sigue disparando aparte. */
export default function EventosBF() {
  useEffect(() => {
    track('bf_page_view', { phase: faseBF() })
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.('[data-bf-evento]') as HTMLElement | null
      if (!el) return
      const { bfEvento, ...resto } = el.dataset
      const params: Record<string, string> = { page: '/black-friday' }
      for (const [k, v] of Object.entries(resto)) {
        if (k.startsWith('bf') && v) params[k.slice(2).toLowerCase()] = v
      }
      track(`bf_${bfEvento}`, params)
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])
  return null
}
