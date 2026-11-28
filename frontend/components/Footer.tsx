import SeguirRedes from '@/components/SeguirRedes'

const BRANDS = {
  calculadora: {
    name: 'CalculadoraML',
    href: 'https://calculadoraml.com.ar',
    domain: 'calculadoraml.com.ar',
    legal: 'Los márgenes son estimados. Verificá comisiones y costos en Mercado Libre antes de vender.',
  },
  ofertas: {
    name: '🎯 Cazador de Ofertas AR',
    href: 'https://cazadordeofertas.com.ar',
    domain: 'cazadordeofertas.com.ar',
    legal: 'Los precios pueden cambiar sin aviso. Verificá el precio final en Mercado Libre antes de comprar.',
  },
} as const

/** `sinCupones`: las landings de Black Friday de ticket alto no mencionan cupones (pedido 23/11/2026). */
export default function Footer({ brand = 'calculadora', sinCupones = false }: { brand?: keyof typeof BRANDS; sinCupones?: boolean }) {
  const b = BRANDS[brand]
  return (
    <footer className="border-t border-zinc-900 mt-12 py-10 px-4">
      {/* Seguinos (rediseño 27/11): solo en el sitio de ofertas; los links salen de lib/marca (REDES_SEGUIR) */}
      {brand === 'ofertas' && (
        <div className="max-w-md mx-auto mb-8 text-center">
          <p className="font-display text-base font-black text-zinc-100">Te avisamos antes que nadie</p>
          <p className="mt-0.5 mb-3 text-sm text-zinc-400">Publicamos las ofertas todos los días en WhatsApp, Instagram, X y Telegram.</p>
          <SeguirRedes variante="chico" donde="footer" />
        </div>
      )}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-yellow-400 text-sm">{b.name}</span>
          <span>·</span>
          <a href={b.href} className="hover:text-yellow-400 transition-colors">
            {b.domain}
          </a>
        </div>
        <p className="text-center sm:text-right leading-relaxed">
          {b.legal}{' '}
          <br className="hidden sm:block" />
          Este sitio usa links de afiliado de Mercado Libre.
          <br />
          <a href="https://cazadordeofertas.com.ar/privacidad" className="underline hover:text-yellow-400 transition-colors">
            Política de privacidad
          </a>
          {' · '}
          <a href="https://cazadordeofertas.com.ar/terminos" className="underline hover:text-yellow-400 transition-colors">
            Términos de servicio
          </a>
          {brand === 'ofertas' && (
            <>
              {!sinCupones && (
                <>
                  {' · '}
                  <a href="https://cazadordeofertas.com.ar/cupones-mercado-libre" className="underline hover:text-yellow-400 transition-colors">
                    Cupones de Mercado Libre
                  </a>
                </>
              )}
              {' · '}
              <a href="https://cazadordeofertas.com.ar/guias" className="underline hover:text-yellow-400 transition-colors">
                Guías de compra
              </a>
              {' · '}
              <a href="https://cazadordeofertas.com.ar/mejores" className="underline hover:text-yellow-400 transition-colors">
                Mejores en oferta
              </a>
              <br />
              Comparadores:{' '}
              {[
                ['/comparador/celulares', 'Celulares'],
                ['/comparador/notebooks', 'Notebooks'],
                ['/comparador/smart-tv', 'Smart TV'],
                ['/mejor/celular-hasta-300-mil', 'Mejor celular hasta $300 mil'],
                ['/mejor/celular-hasta-600-mil', 'Mejor celular hasta $600 mil'],
                ['/mejor/notebook-hasta-1-millon', 'Mejor notebook hasta $1 millón'],
              ].map(([href, txt], i) => (
                <span key={href}>
                  {i > 0 && ' · '}
                  <a href={`https://cazadordeofertas.com.ar${href}`} className="underline hover:text-yellow-400 transition-colors">
                    {txt}
                  </a>
                </span>
              ))}
            </>
          )}
        </p>
      </div>
    </footer>
  )
}
