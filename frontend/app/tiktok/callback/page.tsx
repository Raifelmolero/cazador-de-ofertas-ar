'use client'

import { useEffect, useState } from 'react'

// Destino de la redirección OAuth de TikTok (Login Kit): muestra el código
// para copiarlo en la terminal durante bot/tools/setup_tiktok.py. No guarda ni
// envía nada a ningún lado.
export default function TikTokCallbackPage() {
  const [code, setCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    setCode(p.get('code'))
    setError(p.get('error_description') || p.get('error'))
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <meta name="robots" content="noindex,nofollow" />
      <div className="max-w-xl w-full text-center space-y-4">
        <h1 className="font-display text-2xl font-black text-white">Autorización de TikTok</h1>
        {code ? (
          <>
            <p className="text-zinc-400">Copiá este código completo y pegalo en la terminal:</p>
            <textarea
              readOnly
              value={code}
              rows={4}
              onFocus={e => e.currentTarget.select()}
              className="w-full rounded-lg bg-zinc-900 border border-zinc-700 p-3 text-sm text-yellow-300 break-all"
            />
          </>
        ) : error ? (
          <p className="text-red-400">TikTok devolvió un error: {error}</p>
        ) : (
          <p className="text-zinc-500">Esperando el código de TikTok…</p>
        )}
      </div>
    </main>
  )
}
