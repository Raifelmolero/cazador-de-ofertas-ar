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
      for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']) {
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
    // Si el clic llega antes de que Clarity cargue (idle), se carga ya mismo: así
    // el evento no queda encolado en un stub que se pierde al abrir ML en la app.
    let cargarYa: () => void = () => {}
    const onClickML = (e: MouseEvent) => {
        // auxclick: solo botón del medio (abrir en pestaña nueva)
        if (e.type === 'auxclick' && e.button !== 1) return
        const a = (e.target as Element | null)?.closest?.(
          'a[href*="mercadolibre.com"], a[href*="meli.la"], a[href*="mercadolibre.ar"]',
        )
        if (!a) return
        // Primero se pide el script real (si todavía es el stub): así arranca la
        // descarga antes de que el celular pase a la app de ML y la pestaña quede
        // en segundo plano. Los eventos quedan en clarity.q y se envían al cargar.
        cargarYa()
        // window.clarity en el momento del clic: el script real reemplaza al stub al cargar
        const c = w.clarity as (...args: unknown[]) => void
        const pagina = window.location.pathname.split('/').slice(0, 2).join('/') || '/'
        // Etiqueta de sesión: permite filtrar "sesiones con clic a ML" aunque el
        // panel/API no muestre el evento personalizado.
        c('set', 'click_ml', '1')
        c('set', 'click_ml_pagina', pagina)
        // Siempre el evento base click_ml (antes la destacada lo reemplazaba)
        c('event', 'click_ml')
        if (a.closest('[data-destacada]')) c('event', 'click_ml_destacada')
        // Ticket alto (colchones, herramientas, >= $250.000): lo que más ganancia deja
        if (a.closest('[data-ticket-alto]')) c('event', 'click_ml_ticket_alto')
        // Etiqueta de afiliado del link (web/nicho): cruza con el panel de ML
        try {
          const mw = new URL((a as HTMLAnchorElement).href).searchParams.get('matt_word')
          if (mw) c('set', 'click_ml_etiqueta', mw.slice(0, 40))
        } catch {
          // href raro: sin etiqueta
        }
        // Lugar de la tarjeta en la grilla (1 = primera): dice hasta dónde baja la gente
        const pos = Number(a.getAttribute('data-posicion'))
        if (pos > 0) c('set', 'click_ml_posicion', String(Math.min(pos, 99)))
        // Sección de la página donde estaba el botón (data-seccion en el contenedor)
        const sec = a.closest('[data-seccion]')?.getAttribute('data-seccion')
        if (sec) {
          c('set', 'click_ml_seccion', sec.slice(0, 40))
          // Además como evento: en Clarity los eventos se filtran más fácil que las etiquetas
          c('event', `click_ml_seccion_${sec.slice(0, 30)}`)
        }
        // Marca la sesión como importante: Clarity la guarda aunque haya muestreo
        c('upgrade', 'click_ml')
    }
    // Captura en document: cubre todos los links (también server components y
    // los que frenan la propagación). target=_blank no corta: la pestaña sigue viva.
    document.addEventListener('click', onClickML, true)
    document.addEventListener('auxclick', onClickML, true)

    const script = document.createElement('script')
    script.id = 'clarity-script'
    script.async = true
    script.src = `https://www.clarity.ms/tag/${CLARITY_ID}`
    // Clarity ocupaba ~450 ms del procesador durante la carga en celular: se
    // pide cuando la página ya pintó. Los clics a ML se registran igual (el
    // listener de arriba encola en el stub hasta que llega el script real).
    const cargar = () => {
      if (!script.isConnected) document.head.appendChild(script)
    }
    cargarYa = cargar
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback
    const despues = () => (ric ? ric.call(window, cargar, { timeout: 4000 }) : setTimeout(cargar, 2000))
    if (document.readyState === 'complete') despues()
    else window.addEventListener('load', despues, { once: true })
  }, [])

  return null
}
