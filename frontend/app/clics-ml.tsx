'use client'

import { useEffect } from 'react'
import { track } from '@vercel/analytics'

// Evento "clic_ml" en Vercel Analytics por cada clic que sale a Mercado Libre:
// muestra qué página y qué tipo de link llevan gente a comprar.
const ML = /(^|\.)(mercadolibre\.com(\.ar)?|meli\.la)$/

export default function ClicsML() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!a) return
      let url: URL
      try {
        url = new URL(a.href, window.location.href)
      } catch {
        return
      }
      if (url.hostname === 't.me' && url.searchParams.get('start')?.startsWith('MLA')) {
        track('alerta_click', { pagina: window.location.pathname })
        return
      }
      if (!ML.test(url.hostname) || url.pathname.startsWith('/ayuda')) return
      track('clic_ml', {
        pagina: window.location.pathname,
        destino: url.hostname + url.pathname.slice(0, 40),
        etiqueta: url.searchParams.get('matt_word') ?? 'sin_etiqueta',
        ticket_alto: a.closest('[data-ticket-alto]') ? 'si' : 'no',
        seccion: a.closest('[data-seccion]')?.getAttribute('data-seccion') ?? 'grilla',
      })
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])
  return null
}
