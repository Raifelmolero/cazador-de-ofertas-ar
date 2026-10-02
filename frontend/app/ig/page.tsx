import fs from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'
import Image from 'next/image'
import { getOfertas } from '@/lib/productos'
import { slugPorId } from '@/lib/seguimiento'
import type { OfertaLight } from '@/components/OfertaCard'
import OfertaCard from '@/components/OfertaCard'
import Footer from '@/components/Footer'
import BannerTemporada from '@/components/BannerTemporada'
import { DEALS_URL, WHATSAPP_URL } from '@/lib/marca'

// "Link en bio" de Instagram: los posts no pueden tener links, así que acá
// van las últimas ofertas publicadas en el feed, en el mismo orden, cada una
// con su botón de compra. Se regenera en cada deploy (3 veces por día, después
// de cada corrida del bot). Las que ya no están en oferta no se muestran; para
// que nunca quede vacía, abajo van las mejores de hoy.

export const metadata: Metadata = {
  title: 'Lo que viste en Instagram — Cazador de Ofertas AR',
  description: 'Las últimas ofertas que publicó Don Ofertín en Instagram, con el link para comprarlas.',
  alternates: { canonical: `${DEALS_URL}/ig` },
  robots: { index: false, follow: true },
}

const MAX = 12

// título normalizado: algunos posts quedaron con id provisorio ("T…") o con
// otro id de la misma publicación, así que también se cruzan por título
const norm = (t: string) =>
  t
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .slice(0, 45)

function publicadosEnIG(): { id: string; title: string }[] {
  try {
    const p = path.join(process.cwd(), '..', 'bot', 'state', 'posts_log.jsonl')
    const out: { id: string; title: string }[] = []
    const lineas = fs.readFileSync(p, 'utf8').split('\n').filter(Boolean).reverse()
    for (const l of lineas) {
      try {
        const x = JSON.parse(l)
        if (x?.ch === 'ig' && typeof x.id === 'string' && typeof x.title === 'string' && !out.some(o => o.id === x.id))
          out.push({ id: x.id, title: x.title })
      } catch {
        // línea rota: se ignora
      }
      if (out.length >= 40) break
    }
    return out
  } catch {
    return []
  }
}

export default function InstagramPage() {
  const todas = getOfertas()
  const porId = new Map(todas.map(o => [o.id_ml, o]))
  const porTitulo = new Map(todas.map(o => [norm(o.titulo), o]))
  const historial = slugPorId()
  const light = (o: (typeof todas)[number]): OfertaLight => ({
    id_ml: o.id_ml,
    titulo: o.titulo,
    precio_actual: o.precio_actual,
    precio_anterior: o.precio_anterior,
    descuento_pct: o.descuento_pct,
    minimo_historico: o.minimo_historico,
    relampago: o.relampago,
    url_producto: o.url_producto,
    url_imagen: o.url_imagen,
    historial: historial[o.id_ml],
  })

  const vistas = new Set<string>()
  const ofertas: OfertaLight[] = []
  for (const p of publicadosEnIG()) {
    const o = porId.get(p.id) ?? porTitulo.get(norm(p.title))
    if (!o || vistas.has(o.id_ml)) continue
    vistas.add(o.id_ml)
    ofertas.push(light(o))
    if (ofertas.length >= MAX) break
  }
  // relleno: mínimos históricos y ticket alto primero (lo que más comisión deja)
  const mas = todas
    .filter(o => !vistas.has(o.id_ml))
    .sort((a, b) => Number(!!b.minimo_historico) - Number(!!a.minimo_historico) || b.precio_actual - a.precio_actual)
    .slice(0, Math.max(6, MAX - ofertas.length))
    .map(light)

  return (
    <main className="min-h-screen">
      <section className="max-w-3xl mx-auto px-4 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <Image src="/personaje/avatar-256.webp" alt="Don Ofertín" width={64} height={64} className="rounded-full shrink-0" priority />
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-black leading-tight">Lo que viste en Instagram</h1>
            <p className="text-sm text-zinc-400">Las últimas ofertas que publiqué, la más nueva primero.</p>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-8">
        {ofertas.length === 0 ? (
          <p className="text-center text-zinc-500 py-6">Las ofertas que publiqué ya se terminaron, pero acá tenés las mejores de hoy.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ofertas.map((o, i) => (
              <OfertaCard key={o.id_ml} producto={o} priority={i < 4} />
            ))}
          </div>
        )}
        {/* fecha comercial vigente (Día de la Madre, Cyber…): mismo banner que la home */}
        <div className="-mx-4 sm:-mx-6">
          <BannerTemporada />
        </div>
        {mas.length > 0 && (
          <>
            <h2 className="font-display text-xl font-black mt-8 mb-3">Más ofertas como estas</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {mas.map(o => (
                <OfertaCard key={o.id_ml} producto={o} />
              ))}
            </div>
          </>
        )}
        <a
          href="/#ofertas"
          className="mt-8 flex items-center justify-center rounded-2xl bg-yellow-400 px-5 py-4 text-lg font-black text-black active:scale-[0.98] transition-transform"
        >
          🔥 Ver todas las ofertas de hoy
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center rounded-2xl border border-emerald-400/60 px-5 py-3 font-bold text-emerald-300"
        >
          💬 Recibí las ofertas por WhatsApp
        </a>
      </section>

      <Footer brand="ofertas" />
    </main>
  )
}
