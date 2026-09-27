// BORRADOR (Trello #10 "Vender el sistema del bot como servicio" — fase de
// validación). Noindex y sin links desde otras páginas ni sitemap: es para que
// Raifel lo revise antes de publicarlo. Cada función listada acá existe en el
// bot (bot/cazador_bot.py, bot/alertas.py, bot/shorts.py, bot/weekly_report.py,
// .github/workflows/*). Sin precio, testimonios ni cifras: no inventar nada.
import type { Metadata } from 'next'
import Footer from '@/components/Footer'

const DEALS_URL = 'https://cazadordeofertas.com.ar'
const URL = `${DEALS_URL}/servicio`
const TITULO = 'Tu propio cazador de ofertas automático'
const DESCRIPCION =
  'Un bot que rastrea las ofertas de Mercado Libre Argentina, descarta los descuentos inflados y publica solo en tus redes con tus links de afiliado.'
const CONTACTO = 'mailto:raifelmolero@gmail.com?subject=Quiero%20mi%20cazador%20de%20ofertas'

export const metadata: Metadata = {
  title: `${TITULO} — Cazador de Ofertas AR`,
  description: DESCRIPCION,
  alternates: { canonical: URL },
  robots: { index: false, follow: false },
}

const FUNCIONES = [
  {
    titulo: 'Rastreo de ofertas 3 veces por día',
    texto:
      'Recorre las páginas de ofertas de Mercado Libre Argentina, las ofertas relámpago y las categorías de ticket alto a la mañana, a la tarde y a la noche. Corre solo en la nube: no hace falta tener una compu prendida.',
  },
  {
    titulo: 'Historial de precios propio',
    texto:
      'Guarda el precio de cada producto en cada pasada. Con eso sabe si una oferta está en el precio más bajo que registró y la marca con el sello de mínimo histórico.',
  },
  {
    titulo: 'Filtro de descuentos inflados',
    texto:
      'Si un producto ya estuvo más barato antes, el "descuento" contra el precio tachado no es real y la oferta se descarta. Tu audiencia ve solo bajas de precio verificadas.',
  },
  {
    titulo: 'Ranking por lo que más conviene publicar',
    texto:
      'Ordena las ofertas por ganancia esperada: precio, comisión estimada de la categoría y fechas comerciales, con prioridad para mínimos históricos y relámpago.',
  },
  {
    titulo: 'Links de afiliado etiquetados por canal',
    texto:
      'Cada link lleva tu etiqueta de afiliado y una etiqueta distinta por red (Telegram, Instagram, Threads), así el panel de afiliados te muestra qué canal vende.',
  },
  {
    titulo: 'Canal de Telegram en piloto automático',
    texto:
      'Publica las mejores ofertas de cada pasada con foto, precio anterior, precio actual y botón de compra.',
  },
  {
    titulo: 'Instagram: posts y stories con diseño',
    texto:
      'Genera la placa de cada oferta (4:5 para el feed y 9:16 para la story), escribe la caption, publica y deja un primer comentario con el llamado a la acción.',
  },
  {
    titulo: 'Threads',
    texto:
      'Posts con placa y link de afiliado en el texto, más un post de solo texto conversacional por día.',
  },
  {
    titulo: 'Reels y YouTube Shorts',
    texto:
      'Arma un video vertical corto de la oferta del día y puede repartirlo también a YouTube Shorts si conectás tu canal.',
  },
  {
    titulo: 'Alertas de precio por Telegram',
    texto:
      'Tus seguidores le mandan un link de Mercado Libre al bot y les avisa por privado cuando el producto aparece a ese precio o menos.',
  },
  {
    titulo: 'Reporte semanal',
    texto:
      'Todos los domingos te llega por Telegram el resumen de la semana: publicaciones por canal, las mejores ofertas y la evolución de seguidores.',
  },
  {
    titulo: 'Cero mantenimiento',
    texto:
      'Los accesos de Instagram y Threads se renuevan solos cada semana y, si algo falla, te llega un aviso por Telegram. Si una red se cae, las demás siguen publicando.',
  },
]

const PARA_QUIEN = [
  {
    titulo: 'Afiliados de Mercado Libre',
    texto: 'Que hoy buscan y publican ofertas a mano y quieren sostener varias publicaciones por día sin estar pendientes.',
  },
  {
    titulo: 'Creadores de contenido',
    texto: 'Con una comunidad en Telegram, Instagram o Threads que quieren sumarle una sección de ofertas sin dedicarle horas.',
  },
  {
    titulo: 'Tiendas y cuentas de nicho',
    texto: 'Que quieren un canal de ofertas enfocado en su rubro (herramientas, hogar, bebés, gamer, etc.).',
  },
]

const PASOS = [
  { titulo: 'Nos escribís', texto: 'Nos contás qué redes tenés, a qué público le hablás y si querés enfocarte en algún rubro.' },
  { titulo: 'Conectamos tus cuentas', texto: 'Cargamos tu etiqueta de afiliado de Mercado Libre y conectamos tus redes con los accesos oficiales de cada plataforma.' },
  { titulo: 'Ajustamos el filtro', texto: 'Definimos descuento mínimo, precio mínimo, cantidad de posts por día y categorías prioritarias.' },
  { titulo: 'Arranca solo', texto: 'Desde ahí el bot rastrea, filtra y publica 3 veces por día. Vos recibís los avisos y el reporte semanal por Telegram.' },
]

const NECESITAS = [
  'Tu cuenta del programa de afiliados de Mercado Libre (los links y las comisiones son tuyos).',
  'Un canal de Telegram donde publicar (si no tenés, te ayudamos a crearlo).',
  'Opcional: una cuenta profesional de Instagram, tu perfil de Threads y tu canal de YouTube.',
  'Un rato para conectar las cuentas al principio. Después no hace falta tocar nada.',
]

const FAQS = [
  {
    q: '¿Cuánto cuesta?',
    a: 'Precio a medida — consultanos. Depende de cuántas redes quieras conectar y de cuánto haya que ajustar el filtro a tu rubro.',
  },
  {
    q: '¿Me garantiza ventas o comisiones?',
    a: 'No. El bot se encarga de encontrar y publicar ofertas con descuento verificado, pero las ventas dependen de tu audiencia, del rubro y de Mercado Libre. Nadie puede prometerte una ganancia.',
  },
  {
    q: '¿Las comisiones de afiliado son mías?',
    a: 'Sí. Los links se arman con tu etiqueta de afiliado, así que lo que se venda por tus redes lo cobrás vos en tu cuenta de Mercado Libre.',
  },
  {
    q: '¿Tengo que darles mi contraseña?',
    a: 'No. Instagram, Threads y YouTube se conectan con los permisos oficiales de cada plataforma, que podés revocar cuando quieras. En Telegram alcanza con sumar el bot como administrador de tu canal.',
  },
  {
    q: '¿Puedo elegir qué tipo de ofertas se publican?',
    a: 'Sí. Se configuran el descuento mínimo, el precio mínimo, la cantidad de posts y las categorías a las que se les da prioridad.',
  },
  {
    q: '¿Qué pasa si una red se cae o cambia algo?',
    a: 'Cada red publica por separado: si una falla, las demás siguen. El bot te avisa por Telegram con el error para que se revise.',
  },
  {
    q: '¿Sirve fuera de Argentina?',
    a: 'Por ahora está hecho para Mercado Libre Argentina.',
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

function BotonContacto() {
  return (
    <a
      href={CONTACTO}
      className="inline-flex items-center justify-center rounded-xl bg-yellow-400 px-6 py-3 font-extrabold text-zinc-950 hover:bg-yellow-300 transition-colors"
    >
      Escribinos
    </a>
  )
}

export default function ServicioPage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-zinc-900 bg-zinc-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <a href={DEALS_URL} className="font-display text-lg font-extrabold tracking-tight">
            🎯 <span className="text-yellow-400">Cazador de Ofertas</span>
          </a>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-wider text-yellow-400 mb-3">Para afiliados, creadores y tiendas</p>
        <h1 className="font-display text-3xl sm:text-5xl font-black leading-[1.05] tracking-tight mb-5 [text-wrap:balance]">
          {TITULO}
        </h1>
        <p className="text-lg text-zinc-300 leading-relaxed mb-8 [text-wrap:pretty]">
          El mismo sistema que mueve Cazador de Ofertas AR, funcionando para tus redes: rastrea Mercado Libre
          Argentina 3 veces por día, descarta los descuentos inflados y publica solo con tus links de afiliado.
        </p>
        <div className="flex flex-wrap items-center gap-4 mb-14">
          <BotonContacto />
          <span className="text-sm text-zinc-400">Precio a medida — consultanos.</span>
        </div>

        <Seccion titulo="Qué hace">
          <ul className="grid gap-4 sm:grid-cols-2">
            {FUNCIONES.map(f => (
              <li key={f.titulo} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                <h3 className="font-bold text-zinc-100 mb-1.5">{f.titulo}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{f.texto}</p>
              </li>
            ))}
          </ul>
        </Seccion>

        <Seccion titulo="Para quién es">
          <ul className="grid gap-4 sm:grid-cols-3">
            {PARA_QUIEN.map(p => (
              <li key={p.titulo} className="rounded-2xl border border-yellow-400/30 bg-yellow-400/5 p-5">
                <h3 className="font-bold text-yellow-300 mb-1.5">{p.titulo}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{p.texto}</p>
              </li>
            ))}
          </ul>
        </Seccion>

        <Seccion titulo="Cómo funciona">
          <ol className="space-y-4">
            {PASOS.map((p, i) => (
              <li key={p.titulo} className="flex gap-4">
                <span className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400 font-black text-zinc-950">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-bold text-zinc-100">{p.titulo}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{p.texto}</p>
                </div>
              </li>
            ))}
          </ol>
        </Seccion>

        <Seccion titulo="Qué necesitás">
          <ul className="space-y-3 text-zinc-300 leading-relaxed">
            {NECESITAS.map(n => (
              <li key={n} className="flex gap-3">
                <span className="text-yellow-400 font-black" aria-hidden="true">✓</span>
                <span>{n}</span>
              </li>
            ))}
          </ul>
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
          <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight mb-3">¿Querés tu propio cazador de ofertas?</h2>
          <p className="text-zinc-300 mb-6 [text-wrap:pretty]">
            Contanos qué redes tenés y a qué público le hablás. Precio a medida — consultanos.
          </p>
          <BotonContacto />
        </section>
      </article>

      <Footer brand="ofertas" />
    </main>
  )
}
