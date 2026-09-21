import type { Metadata } from 'next'
import { Suspense } from 'react'
import CallbackCode from './CallbackCode'

export const metadata: Metadata = {
  title: 'Autorización de TikTok',
  robots: { index: false, follow: false },
}

// Destino de la redirección OAuth de TikTok (Login Kit).
export default function TikTokCallbackPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center space-y-4">
        <h1 className="font-display text-2xl font-black text-white">Autorización de TikTok</h1>
        <Suspense fallback={<p className="text-zinc-500">Esperando el código de TikTok…</p>}>
          <CallbackCode />
        </Suspense>
      </div>
    </main>
  )
}
