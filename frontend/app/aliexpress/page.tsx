// Sección de importados (AliExpress). Es un piloto aparte de Mercado Libre: los
// productos se cargan a mano en data/aliexpress.json con el link generado en el
// Link Generator de AliExpress Portals (tracking ID propio). Mientras no haya
// productos la página no se indexa y no entra al sitemap.
import Image from 'next/image'
import type { Metadata } from 'next'
import data from '@/data/aliexpress.json'
import Footer from '@/components/Footer'
import { DEALS_URL } from '@/lib/marca'

const URL = `${DEALS_URL}/aliexpress`
const TITULO = 'Importados de AliExpress: ofertas con envío internacional'
const DESCRIPCION =
  'Selección de productos de AliExpress para Argentina: tecnología y accesorios baratos, con aviso de plazos de envío y qué mirar antes de comprar.'

type Producto = {
  titulo: string
  link: string
  precio: string
  precioAntes?: string
  imagen: string
  nota?: string
}

const productos = (data.productos ?? []) as Producto[]

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  metadataBase: new globalThis.URL(DEALS_URL),
  alternates: { canonical: URL },
  robots: productos.length >= 3 ? { index: true, follow: true } : { index: false, follow: true },
  openGraph: { title: TITULO, description: DESCRIPCION, url: URL, type: 'website', locale: 'es_AR', siteName: 'Cazador de Ofertas AR' },
}

export default function AliExpressPage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href={DEALS_URL} className="font-display text-lg font-extrabold tracking-tight">
            🎯 <span className="text-yellow-400">Cazador de Ofertas</span>
          </a>
          <a href={DEALS_URL} className="text-xs font-bold text-black bg-yellow-400 hover:bg-yellow-300 px-3 py-1.5 rounded-full">
            Ofertas de Mercado Libre →
          </a>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
        <p className="text-xs font-bold tracking-widest text-yellow-400 mb-3">IMPORTADOS · AliExpress</p>
        <h1 className="font-display text-3xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-5 [text-wrap:balance]">
          Importados de AliExpress
        </h1>

        <div className="rounded-2xl border border-yellow-400/30 bg-yellow-400/5 px-5 py-4 mb-8 text-zinc-200 leading-relaxed">
          <p className="text-xs font-bold text-yellow-400 mb-1">ANTES DE COMPRAR</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>El envío es internacional: suele tardar entre 15 y 40 días.</li>
            <li>Los precios y el envío los define AliExpress al momento de la compra; puede haber impuestos de importación.</li>
            <li>Para comprar rápido y con garantía local, mirá las <a className="text-yellow-400 underline" href={DEALS_URL}>ofertas de Mercado Libre</a>.</li>
          </ul>
        </div>

        {productos.length === 0 ? (
          <p className="text-zinc-400">Estamos armando la selección. Volvé en unos días.</p>
        ) : (
          <div data-seccion="aliexpress" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {productos.map(p => (
              <article key={p.link} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden flex flex-col">
                <Image src={p.imagen} alt={p.titulo} width={600} height={600} unoptimized className="w-full aspect-square object-cover bg-white" />
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <h2 className="font-bold text-zinc-100 leading-snug">{p.titulo}</h2>
                  <p className="text-xl font-black text-yellow-400">
                    {p.precio}
                    {p.precioAntes && <span className="ml-2 text-sm font-normal text-zinc-500 line-through">{p.precioAntes}</span>}
                  </p>
                  {p.nota && <p className="text-sm text-zinc-400">{p.nota}</p>}
                  <a
                    href={p.link}
                    target="_blank"
                    rel="sponsored nofollow noopener"
                    className="mt-auto flex items-center justify-center rounded-xl bg-yellow-400 px-4 py-3 font-black text-black hover:bg-yellow-300 transition-colors"
                  >
                    Ver en AliExpress ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        <p className="mt-10 text-xs text-zinc-500">
          Participamos del programa de afiliados de AliExpress: si comprás desde estos links podemos recibir una comisión,
          sin costo extra para vos.
        </p>
      </section>

      <Footer brand="ofertas" />
    </main>
  )
}
