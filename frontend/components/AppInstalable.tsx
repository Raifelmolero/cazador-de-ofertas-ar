'use client'

import { useEffect, useState } from 'react'
import { track } from '@vercel/analytics'

/**
 * Hace que cazadordeofertas.com.ar se pueda instalar como app (PWA):
 * agrega el manifest, registra el service worker y muestra un aviso
 * "Instalá la app" (Android/PC: botón nativo; iPhone: cómo hacerlo en Safari).
 * Solo en el dominio de ofertas: calculadoraml.com.ar es otro público.
 */
const DEALS_HOST = 'cazadordeofertas.com.ar'
const CERRADO_KEY = 'app_aviso_cerrado'
const VISITAS_KEY = 'app_visitas'
const DIAS_SIN_MOLESTAR = 14

type PromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }

function esDominioOfertas(host: string) {
  return host === DEALS_HOST || host.endsWith(`.${DEALS_HOST}`) || host === 'localhost'
}

export function enModoApp() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function agregarHead(tag: 'link' | 'meta', attrs: Record<string, string>) {
  const sel = tag === 'link' ? `link[rel="${attrs.rel}"]` : `meta[name="${attrs.name}"]`
  if (document.head.querySelector(sel)) return
  const el = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
  document.head.appendChild(el)
}

function leer(key: string) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function guardar(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // localStorage bloqueado: el aviso puede volver a aparecer, no pasa nada
  }
}

export default function AppInstalable() {
  const [modo, setModo] = useState<'android' | 'ios' | null>(null)
  const [prompt, setPrompt] = useState<PromptEvent | null>(null)

  useEffect(() => {
    if (!esDominioOfertas(window.location.hostname)) return
    agregarHead('link', { rel: 'manifest', href: '/app/manifest.webmanifest' })
    agregarHead('link', { rel: 'apple-touch-icon', href: '/app/apple-touch-icon.png' })
    agregarHead('meta', { name: 'apple-mobile-web-app-title', content: 'Ofertas' })
    agregarHead('meta', { name: 'apple-mobile-web-app-capable', content: 'yes' })

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }

    if (enModoApp()) {
      // Ya la abrió como app: una vez por sesión, para contar uso real
      try {
        if (!sessionStorage.getItem('app_abierta')) {
          sessionStorage.setItem('app_abierta', '1')
          track('app_abierta')
        }
      } catch {}
      return
    }

    const cerrado = Number(leer(CERRADO_KEY) ?? 0)
    if (Date.now() - cerrado < DIAS_SIN_MOLESTAR * 86_400_000) return
    const visitas = Number(leer(VISITAS_KEY) ?? 0) + 1
    guardar(VISITAS_KEY, String(visitas))
    // Primera visita: esperar a que vea ofertas; si ya volvió, avisar antes
    const espera = visitas >= 2 ? 6_000 : 25_000

    let timer: ReturnType<typeof setTimeout> | undefined
    const onPrompt = (e: Event) => {
      e.preventDefault()
      setPrompt(e as PromptEvent)
      timer = setTimeout(() => setModo('android'), espera)
    }
    const onInstalada = () => {
      setModo(null)
      track('app_instalada')
      guardar(CERRADO_KEY, String(Date.now() + 3650 * 86_400_000))
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalada)

    // iPhone/iPad en Safari (en Instagram/Facebook no se puede agregar a inicio)
    const ua = navigator.userAgent
    const ios = /iPhone|iPad|iPod/.test(ua) && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|Instagram|FBAN|FBAV/.test(ua)
    if (ios) timer = setTimeout(() => setModo('ios'), espera)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalada)
    }
  }, [])

  useEffect(() => {
    if (modo) track('app_aviso_visto', { modo, pagina: window.location.pathname })
  }, [modo])

  if (!modo) return null

  const cerrar = () => {
    guardar(CERRADO_KEY, String(Date.now()))
    track('app_aviso_cerrado', { modo })
    setModo(null)
  }

  const instalar = async () => {
    if (!prompt) return
    track('app_instalar_click')
    await prompt.prompt()
    const { outcome } = await prompt.userChoice
    track('app_instalar_respuesta', { outcome })
    setPrompt(null)
    setModo(null)
    if (outcome !== 'accepted') guardar(CERRADO_KEY, String(Date.now()))
  }

  return (
    <div
      role="dialog"
      aria-label="Instalá la app del Cazador de Ofertas"
      className="fixed z-30 left-3 right-16 bottom-20 sm:left-5 sm:right-auto sm:bottom-5 sm:w-96 rounded-2xl border border-yellow-400/30 bg-zinc-900/95 backdrop-blur-md shadow-xl shadow-black/50 py-2.5 pl-2.5 pr-2 flex items-center gap-2.5 rise-in"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/app/icon-192.png" alt="" width={36} height={36} className="shrink-0 rounded-lg" />
      {modo === 'android' ? (
        <>
          <p className="min-w-0 flex-1 text-xs text-zinc-400 leading-snug">
            <span className="block text-sm font-black text-white">📲 Instalá la app</span>
            Gratis, ocupa casi nada
          </p>
          <button
            onClick={instalar}
            className="shrink-0 rounded-lg bg-yellow-400 px-3 py-2 text-xs font-black text-black active:scale-[0.97] transition-transform"
          >
            Instalar
          </button>
        </>
      ) : (
        <p className="min-w-0 flex-1 text-xs text-zinc-400 leading-snug">
          <span className="block text-sm font-black text-white">📲 Tenela como app</span>
          Tocá <span className="font-bold text-white">Compartir</span>{' '}
          <svg aria-label="(ícono compartir)" viewBox="0 0 24 24" className="inline w-4 h-4 -mt-0.5 fill-none stroke-current text-sky-400" strokeWidth={2}>
            <path d="M12 3v12M7 8l5-5 5 5M5 12v8h14v-8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>{' '}
          y <span className="font-bold text-white">Agregar a inicio</span>
        </p>
      )}
      <button onClick={cerrar} aria-label="Cerrar" className="shrink-0 p-1 text-zinc-500 hover:text-white text-lg leading-none">
        ×
      </button>
    </div>
  )
}
