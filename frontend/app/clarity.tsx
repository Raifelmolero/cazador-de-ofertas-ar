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

    const script = document.createElement('script')
    script.id = 'clarity-script'
    script.async = true
    script.src = `https://www.clarity.ms/tag/${CLARITY_ID}`
    document.head.appendChild(script)
  }, [])

  return null
}
