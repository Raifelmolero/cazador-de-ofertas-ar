// BORRADOR: noindex, fuera del sitemap y sin links desde otras páginas hasta que
// Raifel cargue MP_LINK_PACK y PRECIO_PACK (lib/pro.ts). Sin testimonios, ventas
// ni cifras de resultados: no inventar nada.
import type { Metadata } from 'next'
import Link from 'next/link'
import CalcHeader from '@/components/CalcHeader'
import Footer from '@/components/Footer'
import {
  CARGO_MAX,
  CARGO_MIN,
  COSTOS_VERIFICADOS,
  COSTOS_VIGENCIA,
  CUOTAS,
  FUENTE_COSTOS,
  SIMULADOR_ML,
  UMBRAL_COSTO_FIJO,
} from '@/lib/costosml'
import { CALC_URL } from '@/lib/vender'
import { MP_LINK_PACK, PRECIO_PACK } from '@/lib/pro'

const URL = `${CALC_URL}/pro`
const TITULO = 'Pack Vendedor: planilla Pro de costos de Mercado Libre'
const DESCRIPCION =
  'Planilla lista para usar con los costos oficiales de Mercado Libre, 30 prompts de IA y una guía corta para automatizar tu tienda.'
const CONTACTO = 'mailto:raifelmolero@gmail.com?subject=Automatizaci%C3%B3n%20para%20mi%20tienda'

export const metadata: Metadata = {
  title: `${TITULO} | CalculadoraML`,
  description: DESCRIPCION,
  alternates: { canonical: URL },
  robots: { index: false, follow: false },
}

const pct = (n: number) => String(n).replace('.', ',')
const pesos = (n: number) => `$${n.toLocaleString('es-AR')}`
const CUOTAS_PCT = CUOTAS.filter(c => c.pct > 0).map(c => c.pct)
const CUOTAS_MIN = Math.min(...CUOTAS_PCT)
const CUOTAS_MAX = Math.max(...CUOTAS_PCT)

const INCLUYE = [
  {
    emoji: '📊',
    titulo: 'Planilla Pro (.xlsx)',
    texto: 'Funciona en Excel o Google Sheets. Calculás el margen de muchos productos a la vez, con:',
    items: [
      `Cargo por vender (rango oficial de ${pct(CARGO_MIN)}% a ${pct(CARGO_MAX)}%)`,
      `Costo fijo por unidad en productos de menos de ${pesos(UMBRAL_COSTO_FIJO)}`,
      `Costo de cuotas (de ${pct(CUOTAS_MIN)}% a ${pct(CUOTAS_MAX)}% según la opción)`,
      'Costo de envío',
      'Precio mínimo para ganar lo que querés',
      'Alerta cuando el margen da negativo',
    ],
  },
  {
    emoji: '🤖',
    titulo: '30 prompts de IA para vendedores',
    texto: 'Textos listos para copiar y pegar en tu asistente de IA favorito, para:',
    items: ['Títulos de publicaciones', 'Descripciones', 'Respuestas a preguntas de compradores', 'Fotos', 'Promociones'],
  },
  {
    emoji: '📄',
    titulo: 'Guía corta en PDF',
    texto: '«Automatizá tu tienda con IA gratis»: los primeros pasos para sacarte tareas repetitivas de encima, sin gastar en herramientas.',
    items: [],
  },
]

const SERVICIOS = [
  { titulo: 'Aviso de ventas', texto: 'Te llega un mensaje a WhatsApp o Telegram cada vez que vendés.' },
  { titulo: 'Reporte semanal en planilla', texto: 'Un resumen de la semana que se arma solo en una hoja de cálculo.' },
  { titulo: 'Borradores de respuesta', texto: 'Respuestas sugeridas a las preguntas de tus compradores, para que revises y mandes.' },
]

const FAQS = [
  {
    q: '¿Sirve para Google Sheets?',
    a: 'Sí. Es un archivo .xlsx: lo abrís en Excel o lo subís a Google Sheets y funciona igual.',
  },
  {
    q: '¿Se actualizan los costos?',
    a: `La planilla trae los costos vigentes desde el ${COSTOS_VIGENCIA}. La celda del cargo por vender es editable, así que si Mercado Libre cambia algo (o tu categoría tiene otro porcentaje) lo ajustás vos.`,
  },
  {
    q: '¿Reemplaza al contador?',
    a: 'No. Calcula lo que te cobra Mercado Libre y tu margen por producto, pero no incluye impuestos ni asesoramiento contable. Eso lo ve tu contador.',
  },
  {
    q: '¿Cómo lo recibo?',
    a: 'Cuando esté disponible la compra vas a poder pagar con Mercado Pago. Los detalles de la entrega se confirman en ese momento.',
  },
]

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mb-14">
      <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight mb-5 [text-wrap:balance]">{titulo}</h2>
      {children}
    </section>
  )
}

function BotonCompra() {
  if (!MP_LINK_PACK) {
    return (
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          disabled
          className="inline-flex items-center justify-center rounded-xl bg-zinc-800 px-6 py-3 font-extrabold text-zinc-500 cursor-not-allowed"
        >
          Link de pago próximamente
        </button>
        <p className="text-xs font-semibold text-amber-300 bg-amber-400/10 border border-amber-400/30 rounded-lg px-3 py-1.5">
          Borrador: falta el link de Mercado Pago
        </p>
      </div>
    )
  }
  return (
    <a
      href={MP_LINK_PACK}
      rel="nofollow noopener"
      target="_blank"
      className="inline-flex items-center justify-center rounded-xl bg-yellow-400 px-6 py-3 font-extrabold text-zinc-950 hover:bg-yellow-300 transition-colors"
    >
      Quiero el Pack Vendedor
    </a>
  )
}

export default function ProPage() {
  return (
    <main className="min-h-screen">
      <CalcHeader />

      <section
        className="border-b border-zinc-900 px-4 py-12 sm:py-16"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(250,204,21,0.07) 0%, transparent 70%)' }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-yellow-400 mb-3">Pack Vendedor</p>
          <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4 [text-wrap:balance]">
            Sabé cuánto ganás de <span className="text-yellow-400">verdad</span> en cada venta de Mercado Libre
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8 [text-wrap:pretty]">
            Una planilla lista para usar con los mismos costos oficiales que usa la calculadora: cargá tus productos y
            mirá el margen real de cada uno.
          </p>
          {PRECIO_PACK !== null && <p className="text-3xl font-black text-yellow-400 mb-4">{PRECIO_PACK}</p>}
          <BotonCompra />
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <Seccion titulo="Qué incluye">
          <ul className="grid gap-4 sm:grid-cols-3">
            {INCLUYE.map(i => (
              <li key={i.titulo} className="rounded-2xl border border-yellow-400/30 bg-yellow-400/5 p-5">
                <span className="text-2xl" aria-hidden="true">{i.emoji}</span>
                <h3 className="font-bold text-yellow-300 mt-2 mb-2 leading-snug">{i.titulo}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{i.texto}</p>
                {i.items.length > 0 && (
                  <ul className="mt-3 space-y-1.5 text-sm text-zinc-300">
                    {i.items.map(it => (
                      <li key={it} className="flex gap-2">
                        <span className="text-yellow-400 font-black" aria-hidden="true">✓</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </Seccion>

        <Seccion titulo="De dónde salen los datos">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-sm text-zinc-300 leading-relaxed space-y-3">
            <p>
              Los costos son los publicados por Mercado Libre, vigentes desde el {COSTOS_VIGENCIA} y verificados el{' '}
              {COSTOS_VERIFICADOS}. Fuente:{' '}
              <a href={FUENTE_COSTOS} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">
                costos de vender en Mercado Libre
              </a>
              .
            </p>
            <p>
              El cargo exacto depende de la categoría y de la provincia. Antes de fijar un precio, chequealo en el{' '}
              <a href={SIMULADOR_ML} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">
                simulador oficial de Mercado Libre
              </a>
              .
            </p>
          </div>
        </Seccion>

        <Seccion titulo="¿Querés que te lo automatice?">
          <p className="text-zinc-400 leading-relaxed mb-5 max-w-2xl [text-wrap:pretty]">
            Si preferís no armarlo vos, armamos automatizaciones con IA a medida para tu tienda.
          </p>
          <ul className="grid gap-4 sm:grid-cols-3 mb-6">
            {SERVICIOS.map(s => (
              <li key={s.titulo} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                <h3 className="font-bold text-zinc-100 mb-1.5">{s.titulo}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{s.texto}</p>
              </li>
            ))}
          </ul>
          <a
            href={CONTACTO}
            className="inline-flex items-center justify-center rounded-xl bg-yellow-400 px-6 py-3 font-extrabold text-zinc-950 hover:bg-yellow-300 transition-colors"
          >
            Escribinos
          </a>
        </Seccion>

        <Seccion titulo="Preguntas frecuentes">
          <div className="space-y-3">
            {FAQS.map(f => (
              <details key={f.q} className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                <summary className="cursor-pointer list-none font-bold text-zinc-100 flex justify-between gap-4">
                  {f.q}
                  <span className="text-yellow-400 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </Seccion>

        <section className="rounded-2xl border border-yellow-400/30 bg-yellow-400/5 p-6 sm:p-8 text-center">
          <h2 className="font-display text-xl sm:text-2xl font-black tracking-tight mb-3">¿Primero querés probar?</h2>
          <p className="text-zinc-300 mb-5 [text-wrap:pretty]">La calculadora de comisiones es gratis y no necesitás registrarte.</p>
          <Link
            href="/calculadora-de-comisiones"
            className="inline-flex items-center justify-center rounded-xl bg-yellow-400 px-6 py-3 font-extrabold text-zinc-950 hover:bg-yellow-300 transition-colors"
          >
            Ir a la calculadora gratis →
          </Link>
        </section>
      </div>

      <Footer />
    </main>
  )
}
