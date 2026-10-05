'use client'

import { useEffect } from 'react'

// ID del proyecto en clarity.microsoft.com ("El cazador de ofertas").
const CLARITY_ID = 'ylkc9qfvzy'
// Clarity mide solo el sitio de ofertas: calculadoraml.com.ar es otro público
// y ensuciaría los datos.
const DEALS_HOST = 'cazadordeofertas.com.ar'

export default function Clarity() {
  useEffect(() => {
    const host = window.location.hostname
    if (host !== DEALS_HOST && !host.endsWith(`.${DEALS_HOST}`)) return
    if (document.getElementById('clarity-script')) return

    // Snippet oficial de Clarity, en su forma estándar.
    const w = window as unknown as Record<string, unknown>
    const clarity =
      (w.clarity as ((...args: unknown[]) => void) & { q?: unknown[] }) ||
      (function (...args: unknown[]) {
        ;(clarity.q = clarity.q || []).push(args)
      } as ((...args: unknown[]) => void) & { q?: unknown[] })
    w.clarity = clarity

    // Canal de origen como custom tag para filtrar sesiones en Clarity
    // (Telegram/IG no mandan referrer). Se guarda en sessionStorage para que
    // la etiqueta siga aunque la persona navegue a otra página sin UTM.
    try {
      const params = new URLSearchParams(window.location.search)
      for (const k of ['utm_source', 'utm_medium', 'utm_campaign']) {
        let v = params.get(k)
        if (v) sessionStorage.setItem(k, v)
        else v = sessionStorage.getItem(k)
        if (v) clarity('set', k, v.slice(0, 100))
      }
    } catch {
      // sessionStorage bloqueado: seguimos sin etiqueta
    }

    // Cada clic a Mercado Libre (cualquier botón de afiliado del sitio) como
    // evento, con la página de origen: el panel de ML no dice de qué página
    // salió la venta. Captura en document para cubrir también server components.
    document.addEventListener(
      'click',
      e => {
        const a = (e.target as Element | null)?.closest?.('a[href*="mercadolibre.com"]')
        if (!a) return
        // window.clarity en el momento del clic: el script real reemplaza al stub al cargar
        const c = w.clarity as (...args: unknown[]) => void
        const pagina = window.location.pathname.split('/').slice(0, 2).join('/') || '/'
        c('set', 'click_ml_pagina', pagina)
        c('event', a.closest('[data-destacada]') ? 'click_ml_destacada' : 'click_ml')
      },
      true,
    )

    const script = document.createElement('script')
    script.id = 'clarity-script'
    script.async = true
    script.src = `https://www.clarity.ms/tag/${CLARITY_ID}`
    // Clarity ocupaba ~450 ms del procesador durante la carga en celular: se
    // pide cuando la página ya pintó. Los clics a ML se registran igual (el
    // listener de arriba encola en el stub hasta que llega el script real).
    const cargar = () => document.head.appendChild(script)
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback
    const despues = () => (ric ? ric.call(window, cargar, { timeout: 4000 }) : setTimeout(cargar, 2000))
    if (document.readyState === 'complete') despues()
    else window.addEventListener('load', despues, { once: true })
  }, [])

  return null
}
