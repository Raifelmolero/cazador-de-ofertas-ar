// "¿Bajaron de verdad?": las ofertas de hoy contra el precio testigo de
// octubre (lib/testigo.ts). Antes del evento avisa que se están anotando los
// precios (o que ya quedaron anotados) y ofrece sumarse a los canales; durante y
// después del evento muestra qué bajó y qué estaba igual o más barato antes.
// Lo usan /cyber-monday y /black-friday.
import OfertaCard, { type OfertaLight } from '@/components/OfertaCard'
import { getOfertas } from '@/lib/productos'
import { slugPorId } from '@/lib/seguimiento'
import { getTestigo, veredictoTestigo } from '@/lib/testigo'

const TELEGRAM_URL = 'https://t.me/cazadordeofertasar'
const WHATSAPP_URL = 'https://whatsapp.com/channel/0029Vb9CICi7DAWspd4ius2Z'

/** "2026-09-27" → "27/09/2026" */
const fechaAR = (iso: string) => iso.split('-').reverse().join('/')
const pesos = (n: number) => `$${n.toLocaleString('es-AR')}`

export default function ComparacionTestigo({
  evento,
  etapa,
  ahora = new Date(),
}: {
  evento: string
  etapa: 'antes' | 'durante' | 'despues'
  ahora?: Date
}) {
  const testigo = getTestigo()
  const nTestigo = Object.keys(testigo.items).length

  if (etapa === 'antes') {
    const hoy = new Date(ahora.getTime() - 3 * 3_600_000).toISOString().slice(0, 10)
    const anotando = hoy <= testigo.hasta
    return (
      <section className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">
        <h2 className="font-display text-xl sm:text-2xl font-black mb-2">
          {anotando ? '📋 Estamos anotando los precios de antes' : '📋 Ya anotamos los precios de antes'}
        </h2>
        <p className="text-zinc-400 leading-relaxed [text-wrap:pretty]">
          {nTestigo > 0 ? (
            <>
              {anotando ? `Desde el ${fechaAR(testigo.desde)} registramos` : `Entre el ${fechaAR(testigo.desde)} y el ${fechaAR(testigo.hasta)} registramos`}{' '}
              el precio de <strong className="text-zinc-100">{nTestigo.toLocaleString('es-AR')} productos</strong> de
              Mercado Libre, 3 veces por día.
            </>
          ) : (
            <>Desde el {fechaAR(testigo.desde)} registramos el precio de cada producto en oferta de Mercado Libre, 3 veces por día.</>
          )}{' '}
          Cuando arranque el {evento} vas a ver acá cuáles bajaron de verdad contra su precio de octubre y cuáles solo
          cambiaron el cartel.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-block text-sm font-bold bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl px-5 py-2.5 transition-colors">
            Avisame por Telegram
          </a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-block text-sm font-bold border border-emerald-400/60 text-emerald-300 rounded-xl px-5 py-2.5">
            Avisame por WhatsApp
          </a>
        </div>
      </section>
    )
  }

  const historial = slugPorId()
  const conTestigo = getOfertas()
    .map(o => ({ o, t: testigo.items[o.id_ml], v: veredictoTestigo(o.precio_actual, testigo.items[o.id_ml]) }))
    .filter(x => x.v !== null)
  if (conTestigo.length === 0) return null
  const bajaron = conTestigo.filter(x => x.v === 'bajo')
  const noBajaron = conTestigo.filter(x => x.v !== 'bajo')
  const pctBajaron = Math.round((bajaron.length / conTestigo.length) * 100)
  const light = (o: (typeof conTestigo)[number]['o']): OfertaLight => ({
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

  return (
    <section className="mb-10">
      <h2 className="font-display text-xl sm:text-2xl font-black mb-2">¿Bajaron de verdad? Hoy contra octubre</h2>
      <p className="text-zinc-400 leading-relaxed mb-4 [text-wrap:pretty]">
        De las {conTestigo.length.toLocaleString('es-AR')} ofertas de hoy que seguimos desde antes del {evento},{' '}
        <strong className="text-zinc-100">{pctBajaron}%</strong> está al menos 3% más barata que el precio más bajo que
        registramos entre el {fechaAR(testigo.desde)} y el {fechaAR(testigo.hasta)}. El resto estuvo igual o más barato
        en esas semanas.
      </p>
      {bajaron.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {bajaron.slice(0, 9).map(({ o }) => (
            <OfertaCard key={o.id_ml} producto={light(o)} />
          ))}
        </div>
      )}
      {noBajaron.length > 0 && (
        <>
          <h3 className="font-display text-lg font-black mb-2">Estaban igual o más baratas antes del {evento}</h3>
          <ul className="divide-y divide-zinc-900 rounded-2xl border border-zinc-900 text-sm">
            {noBajaron.slice(0, 8).map(({ o, t }) => (
              <li key={o.id_ml} className="flex items-center justify-between gap-3 px-4 py-3">
                <span className="text-zinc-300 line-clamp-2">{o.titulo}</span>
                <span className="shrink-0 text-right text-xs text-zinc-500">
                  hoy <strong className="text-zinc-200">{pesos(o.precio_actual)}</strong>
                  <br />
                  el {fechaAR(t!.min_ts)}: <strong className="text-red-300">{pesos(t!.min)}</strong>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
