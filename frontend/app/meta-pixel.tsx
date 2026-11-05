'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Píxel de Meta del portfolio «Cazador de Ofertas» (Administrador de eventos).
// El ID va por variable de entorno: sin ella el píxel no carga (previews, local).
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID
// Igual que Clarity: solo el sitio de ofertas, calculadoraml.com.ar es otro público.
const DEALS_HOST = 'cazadordeofertas.com.ar'
const ML = /(^|\.)(mercadolibre\.com(\.ar)?|meli\.la)$/
const ALIEXPRESS = /(^|\.)(aliexpress\.com|s\.click\.aliexpress\.com)$/

type Fbq = ((...args: unknown[]) => void) & { q?: unknown[]; queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown; callMethod?: (...a: unknown[]) => void }

function fbq(): Fbq | undefined {
  return (window as unknown as { fbq?: Fbq }).fbq
}

function enSitioOfertas(): boolean {
  const host = window.location.hostname
  return host === DEALS_HOST || host.endsWith(`.${DEALS_HOST}`)
}

export default function MetaPixel() {
  const pathname = usePathname()

  // Carga el script una vez y escucha los clics que salen a ML / AliExpress.
  useEffect(() => {
    if (!PIXEL_ID || !enSitioOfertas() || fbq()) return

    // Snippet oficial de Meta, en su forma estándar.
    const w = window as unknown as Record<string, unknown>
    const f = function (...args: unknown[]) {
      if (f.callMethod) f.callMethod(...args)
      else f.queue!.push(args)
    } as Fbq
    f.push = f
    f.loaded = true
    f.version = '2.0'
    f.queue = []
    w.fbq = f
    w._fbq = f
    f('init', PIXEL_ID)

    const script = document.createElement('script')
    script.async = true
    script.src = 'https://connect.facebook.net/en_US/fbevents.js'
    document.head.appendChild(script)

    // Clic a la tienda = la conversión que nos importa (la venta pasa en ML y
    // Meta no la ve). Sirve para optimizar anuncios y armar retargeting.
    const onClick = (e: MouseEvent) => {
      if (e.type === 'auxclick' && e.button !== 1) return
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!a) return
      let url: URL
      try {
        url = new URL(a.href, window.location.href)
      } catch {
        return
      }
      const pagina = window.location.pathname
      if (ALIEXPRESS.test(url.hostname)) {
        f('trackCustom', 'clic_aliexpress', { pagina })
        return
      }
      if (!ML.test(url.hostname) || url.pathname.startsWith('/ayuda')) return
      f('trackCustom', 'clic_ml', {
        pagina,
        ticket_alto: a.closest('[data-ticket-alto]') ? 'si' : 'no',
        seccion: a.closest('[data-seccion]')?.getAttribute('data-seccion') ?? 'grilla',
      })
    }
    document.addEventListener('click', onClick, true)
    document.addEventListener('auxclick', onClick, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('auxclick', onClick, true)
    }
  }, [])

  // PageView en la carga y en cada navegación interna (App Router no recarga).
  useEffect(() => {
    fbq()?.('track', 'PageView')
  }, [pathname])

  return null
}
