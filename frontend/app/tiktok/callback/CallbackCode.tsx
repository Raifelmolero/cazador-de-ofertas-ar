'use client'

import { useSearchParams } from 'next/navigation'

// Muestra el código que devuelve TikTok en la redirección OAuth para copiarlo
// en la terminal (bot/tools/setup_tiktok.py). No guarda ni envía nada.
export default function CallbackCode() {
  const params = useSearchParams()
  const code = params.get('code')
  const error = params.get('error_description') || params.get('error')

  if (code) {
    return (
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
    )
  }
  if (error) return <p className="text-red-400">TikTok devolvió un error: {error}</p>
  return <p className="text-zinc-500">Esperando el código de TikTok…</p>
}
