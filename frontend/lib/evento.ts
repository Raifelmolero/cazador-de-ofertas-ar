// Eventos propios del sitio → Microsoft Clarity (único medidor de eventos desde que se quitó
// @vercel/analytics, 27/11/2026, para ahorrar ~USD 2,50/mes). Reenvía a window.clarity('event', nombre)
// (el stub de app/clarity.tsx encola hasta que carga el script real). Si Clarity no está (calculadoraml,
// que no lo carga, o antes del montaje) no hace nada. Clarity no admite propiedades por evento:
// las props se descartan y, cuando importan, van como etiqueta de sesión (clarity('set', ...)).
export function track(nombre: string, props?: Record<string, unknown>): void {
  void props
  if (typeof window === 'undefined') return
  try {
    const c = (window as unknown as { clarity?: (...args: unknown[]) => void }).clarity
    if (typeof c === 'function') c('event', nombre.slice(0, 60))
  } catch {
    // medir nunca rompe la página
  }
}
