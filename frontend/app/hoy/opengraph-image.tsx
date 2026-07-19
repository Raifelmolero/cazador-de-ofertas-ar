import { ImageResponse } from 'next/og'
import { getOfertas } from '@/lib/productos'

export const runtime = 'nodejs'
export const alt = 'Ofertas de hoy — Cazador de Ofertas AR'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

function fmtPrice(n: number) {
  return `$${Math.round(n).toLocaleString('es-AR')}`
}

function jpgImage(url: string) {
  return url
    .replace('D_Q_NP_', 'D_NQ_NP_')
    .replace(/-[A-Z]{1,2}\.webp$/, '-F.jpg')
    .replace(/\.webp$/, '.jpg')
}

export default async function Image() {
  const ofertas = getOfertas()
  const top = ofertas[0]

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#09090b',
          padding: '56px',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: 40, fontWeight: 800 }}>
            🎯&nbsp;<span style={{ color: '#facc15' }}>Cazador de Ofertas</span>&nbsp;AR
          </div>

          {top ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
              {top.url_imagen ? (
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt=""
                  src={jpgImage(top.url_imagen)}
                  width={340}
                  height={340}
                  style={{ objectFit: 'contain', borderRadius: 24, background: 'white' }}
                />
              ) : null}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 620 }}>
                {top.descuento_pct ? (
                  <div
                    style={{
                      display: 'flex',
                      background: '#facc15',
                      color: '#09090b',
                      fontWeight: 800,
                      fontSize: 32,
                      padding: '8px 24px',
                      borderRadius: 999,
                      alignSelf: 'flex-start',
                    }}
                  >
                    {top.descuento_pct}% OFF
                  </div>
                ) : null}
                <div style={{ display: 'flex', fontSize: 34, fontWeight: 700, lineHeight: 1.25 }}>
                  {top.titulo.slice(0, 70)}
                </div>
                <div style={{ display: 'flex', fontSize: 44, fontWeight: 800, color: '#facc15' }}>
                  {fmtPrice(top.precio_actual)}
                </div>
              </div>
            </div>
          ) : null}

          <div style={{ display: 'flex', fontSize: 28, color: '#a1a1aa' }}>
            Ofertas reales, cazadas y verificadas 3 veces por día →
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
