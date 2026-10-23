'use client'

import { useEffect } from 'react'
import { track } from '@vercel/analytics'
import { enModoApp } from '@/components/AppInstalable'
import { aEtiquetaSitio, ETIQUETA_CALC, ETIQUETA_META, ETIQUETA_SITIO } from '@/lib/afiliado'

// Evento "clic_ml" en Vercel Analytics por cada clic que sale a Mercado Libre:
// muestra qué página y qué tipo de link llevan gente a comprar.
const ML = /(^|\.)(mercadolibre\.com(\.ar)?|meli\.la)$/
const ALIEXPRESS = /(^|\.)(aliexpress\.com|s\.click\.aliexpress\.com)$/

// Mismo deploy, dos dominios: los clics hechos en calculadoraml.com.ar llevan su
// propia etiqueta (lib/afiliado: `sitio` hasta que se cree la del panel).
const CALCULADORA = /(^|\.)calculadoraml\.com\.ar$/

// La visita vino de un anuncio de Meta: se recuerda en la pestaña para que los
// clics de las páginas siguientes también salgan con la etiqueta `meta`.
function etiquetaVisita(): string {
  const propia = CALCULADORA.test(window.location.hostname) ? ETIQUETA_CALC : ETIQUETA_SITIO
  try {
    if (new URLSearchParams(window.location.search).get('utm_source') === 'meta') {
      sessionStorage.setItem('cz_origen', 'meta')
    }
    return sessionStorage.getItem('cz_origen') === 'meta' ? ETIQUETA_META : propia
  } catch {
    return propia
  }
}

export default function ClicsML() {
  useVistasSeccion()
  useEffect(() => {
    // Antes de que el navegador siga el link (clic, rueda, mantener apretado en
    // el celular, «abrir en pestaña nueva»): web → sitio (o meta). Ver lib/afiliado.
    const etiqueta = etiquetaVisita()
    const marcarSitio = (e: Event) => {
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!a || !ML.test(a.hostname)) return
      const nuevo = aEtiquetaSitio(a.href, etiqueta)
      if (nuevo) a.href = nuevo
    }
    const eventos = ['pointerdown', 'touchstart', 'mousedown', 'click', 'auxclick', 'contextmenu', 'keydown'] as const
    for (const ev of eventos) document.addEventListener(ev, marcarSitio, { capture: true, passive: true })
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!a) return
      let url: URL
      try {
        url = new URL(a.href, window.location.href)
      } catch {
        return
      }
      if (url.pathname.endsWith('.ics')) {
        track('agenda_click', { pagina: window.location.pathname })
        return
      }
      if (url.hostname === 't.me' && url.searchParams.get('start')?.startsWith('MLA')) {
        track('alerta_click', { pagina: window.location.pathname })
        return
      }
      if (ALIEXPRESS.test(url.hostname)) {
        track('clic_aliexpress', { pagina: window.location.pathname })
        return
      }
      if (!ML.test(url.hostname) || url.pathname.startsWith('/ayuda')) return
      track('clic_ml', {
        pagina: window.location.pathname,
        destino: url.hostname + url.pathname.slice(0, 40),
        etiqueta: url.searchParams.get('matt_word') ?? 'sin_etiqueta',
        ticket_alto: a.closest('[data-ticket-alto]') ? 'si' : 'no',
        seccion: a.closest('[data-seccion]')?.getAttribute('data-seccion') ?? 'grilla',
        // Abierto como app instalada o en el navegador: ¿los que instalan compran más?
        modo: enModoApp() ? 'app' : 'web',
      })
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => {
      document.removeEventListener('click', onClick, { capture: true })
      for (const ev of eventos) document.removeEventListener(ev, marcarSitio, { capture: true })
    }
  }, [])
  return null
}

// Vistas de sección: una vez por sección y página, para comparar vistas vs clics
// (ej. destacado visto N veces, M clics). Solo mide secciones marcadas con data-seccion.
export function useVistasSeccion() {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const vistas = new Set<string>()
    const io = new IntersectionObserver(
      entries => {
        for (const en of entries) {
          if (!en.isIntersecting) continue
          const s = (en.target as HTMLElement).dataset.seccion
          if (!s || vistas.has(s)) continue
          vistas.add(s)
          io.unobserve(en.target)
          track('vista_seccion', { pagina: window.location.pathname, seccion: s })
        }
      },
      { threshold: 0.5 },
    )
    document.querySelectorAll('[data-seccion]').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}
