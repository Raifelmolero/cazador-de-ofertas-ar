// Bloque «Si también estás por comprar» debajo del resultado de la calculadora
// (lib/calc-ofertas.ts). Componente de servidor, sin estado ni JS propio: no frena la
// calculadora en el celular. Fotos chicas del CDN de ML con carga diferida.
// El clic en «Ver en Mercado Libre» lo mide app/clics-ml.tsx: `clic_ml` (etiqueta
// calcml en este dominio) y, por el data-evento, `calcml_oferta_boton`.
import { ofertasCalculadora, type OfertaCalc } from '@/lib/calc-ofertas'
import { miniaturaML } from '@/lib/imagenml'
import { DEALS_URL } from '@/lib/marca'

// Mismo bloque en la calculadora de consumo eléctrico (lote ctr-cta 24/11): le pasa sus
// ofertas (lib/calc-ofertas.ts, ofertasConsumo), su título y su evento/sección.
export default function OfertasCalculadora({
  className = '',
  ofertas = ofertasCalculadora(),
  titulo = '¿También estás por comprar? Lo que elegimos para el Black Friday',
  seccion = 'calcml_ofertas',
  evento = 'calcml_oferta_boton',
}: {
  className?: string
  ofertas?: OfertaCalc[]
  titulo?: string
  seccion?: string
  evento?: string
}) {
  if (ofertas.length === 0) return null
  return (
    <section aria-label="Ofertas para comprar" data-seccion={seccion} className={className}>
      <h2 className="font-display text-lg font-black text-zinc-50 [text-wrap:balance]">
        {titulo}
      </h2>
      <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ofertas.map(({ slug, rubro, emoji, producto: p }) => (
          <li key={p.id} className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900 p-3">
            <div className="flex gap-3">
              {p.img && (
                // eslint-disable-next-line @next/next/no-img-element -- fotos del CDN de ML, sin optimizador (ver CLAUDE.md)
                <img
                  src={miniaturaML(p.img, 'chica')}
                  alt={p.nombre}
                  width={80}
                  height={80}
                  loading="lazy"
                  decoding="async"
                  className="h-20 w-20 shrink-0 rounded-xl bg-white object-contain"
                />
              )}
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">{emoji} {rubro}</p>
                <p className="font-bold text-zinc-100 leading-snug">{p.nombre}</p>
                <p className="text-xs text-zinc-400">{p.detalle}</p>
              </div>
            </div>
            <a
              href={p.url}
              target="_blank"
              rel="sponsored nofollow noopener"
              data-evento={evento}
              data-mla={p.id}
              className="mt-3 flex min-h-[48px] items-center justify-center rounded-xl bg-[#FACC15] px-4 text-center font-black text-black hover:bg-yellow-300 transition-colors"
            >
              Ver en Mercado Libre ↗
            </a>
            <a href={`${DEALS_URL}/mejores/${slug}`} className="mt-2 text-center text-xs font-bold text-zinc-400 hover:text-yellow-400">
              Ver más {rubro.toLowerCase()} →
            </a>
          </li>
        ))}
      </ul>
      <a
        href={`${DEALS_URL}/black-friday`}
        className="mt-3 flex min-h-[48px] items-center justify-center rounded-xl border-2 border-yellow-400 px-4 text-center font-black text-yellow-400 hover:bg-yellow-400/10"
      >
        Ver todo el Black Friday →
      </a>
      <p className="mt-2 text-[11px] text-zinc-500">
        Link de afiliado de Mercado Libre: si comprás, ganamos una comisión y el precio para vos es el mismo. Mirá el precio de hoy en la publicación.
      </p>
    </section>
  )
}
