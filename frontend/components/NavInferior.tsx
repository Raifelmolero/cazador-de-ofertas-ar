// Barra inferior del celular (rediseño 27/11): las 4 cosas que se buscan con una mano, solo a
// rutas que existen. Sin hooks ni estado: va en el HTML del servidor y no hidrata nada.
//
// Con `cta` (ficha /precio) la barra integra el botón de compra en vez de apilar otra barra
// fija: el botón amarillo ocupa la mitad derecha y los atajos quedan como íconos.
// En la home el CtaFijoML se apoya encima (prop `sobreNav`), así no se pisan.
import { DEALS_URL } from '@/lib/marca'

// Alto de la barra: h-14 (3.5rem) + safe-area. CtaFijoML, BackToTop, AvisoSeguir y el
// padding de la home usan ese mismo 3.5rem: si cambia acá, cambiarlo allá.

type Item = { href: string; texto: string; icono: React.ReactNode; actual?: boolean }

const svg = { viewBox: '0 0 24 24', width: 22, height: 22, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const

const ICONOS = {
  ofertas: (
    <svg {...svg}>
      <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </svg>
  ),
  regalos: (
    <svg {...svg}>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5" />
    </svg>
  ),
  rubros: (
    <svg {...svg}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  verificar: (
    <svg {...svg}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5M8 11l2 2 4-4" />
    </svg>
  ),
}

export default function NavInferior({
  pagina,
  cta,
}: {
  /** en la home los atajos son anclas de la misma página */
  pagina: 'hoy' | 'precio'
  cta?: { url: string; precio: string; seccion: string }
}) {
  const base = pagina === 'hoy' ? '' : DEALS_URL
  const items: Item[] = [
    { href: pagina === 'hoy' ? '#ofertas' : DEALS_URL, texto: 'Ofertas', icono: ICONOS.ofertas, actual: pagina === 'hoy' },
    { href: '/regalos-navidad', texto: 'Regalos', icono: ICONOS.regalos },
    { href: `${base}/#rubros`, texto: 'Rubros', icono: ICONOS.rubros },
    ...(cta ? [] : [{ href: '#verificador-movil', texto: 'Verificar', icono: ICONOS.verificar }]),
  ]
  return (
    <nav
      aria-label="Navegación rápida"
      className="sm:hidden fixed inset-x-0 bottom-0 z-30 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex h-14 items-stretch">
        <ul className={`flex ${cta ? 'w-[48%]' : 'w-full'}`}>
          {items.map(it => (
            <li key={it.texto} className="flex-1">
              <a
                href={it.href}
                aria-current={it.actual ? 'page' : undefined}
                className={`presionable flex h-full flex-col items-center justify-center gap-0.5 text-[11px] font-bold leading-none tracking-wide transition-colors ${
                  it.actual ? 'text-yellow-400' : 'text-zinc-300 hover:text-yellow-300'
                }`}
              >
                {it.icono}
                <span className="nav-etiqueta">{it.texto}</span>
              </a>
            </li>
          ))}
        </ul>
        {cta && (
          <div className="flex flex-1 items-center py-1.5 pr-3">
            <a
              href={cta.url}
              data-seccion={cta.seccion}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="presionable flex h-full w-full flex-col items-center justify-center rounded-xl bg-[#FACC15] px-2 text-center font-black leading-none text-black"
            >
              <span className="text-[15px]">Ver en Mercado Libre</span>
              <span className="mt-0.5 font-display text-[13px] tabular-nums text-black/75">{cta.precio}</span>
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}
