import { ImageResponse } from 'next/og'

// Tarjeta OpenGraph de texto, mismo estilo que app/hoy/opengraph-image.tsx
// (fondo zinc-950 + amarillo). La marca depende del host de la página:
// 'calc' = calculadoraml.com.ar, 'cazador' = cazadordeofertas.com.ar.
export const OG_SIZE = { width: 1200, height: 630 }

const MARCAS = {
  calc: { emoji: '🧮', nombre: 'CalculadoraML', resto: '', dominio: 'calculadoraml.com.ar' },
  cazador: { emoji: '🎯', nombre: 'Cazador de Ofertas', resto: ' AR', dominio: 'cazadordeofertas.com.ar' },
} as const

export function ogCard({
  marca,
  etiqueta,
  titulo,
  bajada,
}: {
  marca: keyof typeof MARCAS
  etiqueta?: string
  titulo: string
  bajada: string
}) {
  const m = MARCAS[marca]
  const t = titulo.length > 110 ? `${titulo.slice(0, 107)}…` : titulo
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#09090b',
          padding: '56px',
          color: 'white',
          fontFamily: 'sans-serif',
          borderBottom: '14px solid #facc15',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 40, fontWeight: 800 }}>
          {m.emoji}&nbsp;<span style={{ color: '#facc15' }}>{m.nombre}</span>
          {m.resto}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {etiqueta ? (
            <div
              style={{
                display: 'flex',
                alignSelf: 'flex-start',
                background: '#facc15',
                color: '#09090b',
                fontWeight: 800,
                fontSize: 28,
                padding: '8px 24px',
                borderRadius: 999,
              }}
            >
              {etiqueta}
            </div>
          ) : null}
          <div style={{ display: 'flex', fontSize: t.length > 60 ? 54 : 64, fontWeight: 800, lineHeight: 1.15 }}>{t}</div>
          <div style={{ display: 'flex', fontSize: 30, color: '#d4d4d8', lineHeight: 1.3 }}>{bajada}</div>
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: '#a1a1aa' }}>{m.dominio} →</div>
      </div>
    ),
    { ...OG_SIZE }
  )
}
