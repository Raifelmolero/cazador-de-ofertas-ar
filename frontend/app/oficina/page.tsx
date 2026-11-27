// Oficina de agentes (tarjeta #21 de Trello): una sala por departamento con
// qué está haciendo cada uno. Los datos salen de frontend/data/oficina.json
// (lo arma bot/tools/oficina.py sin gastar tokens). El build hornea una copia
// y el navegador la refresca solo desde GitHub (ver Tablero.tsx).
// Página interna: noindex, Disallow en robots y fuera del sitemap/menú.

import type { Metadata } from 'next'
import oficina from '@/data/oficina.json'
import Tablero from './Tablero'
import type { DatosOficina } from './salud'

export const metadata: Metadata = {
  title: 'Oficina de agentes',
  robots: { index: false, follow: false },
}

export default function OficinaPage() {
  return (
    <main className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <Tablero inicial={oficina as DatosOficina} />
    </main>
  )
}
