// Miniaturas del CDN de fotos de ML. El bot guarda la foto grande
// (D_NQ_NP_2X_…-F.webp, hasta 1200 px) y las tarjetas la muestran a ~170 px.
// Probado el 19/10 (workflow «Probe imágenes ML»): la cuadrada D_Q_NP_…-O es de
// 500×500 y pesa hasta 3,6× menos (54,6 → 15 KB); la -V es de 320×320.
// Las tarjetas ya son cuadradas con fondo blanco, así que no cambia el encuadre.
const PATRON = /^(https:\/\/http2\.mlstatic\.com\/)D_(?:NQ|Q)_NP_(?:2X_)?(.+)-[A-Z]{1,2}\.webp$/

export function miniaturaML(url: string, tamano: 'media' | 'chica' = 'media'): string {
  const m = url.match(PATRON)
  if (!m) return url
  return `${m[1]}D_Q_NP_${m[2]}-${tamano === 'media' ? 'O' : 'V'}.webp`
}
