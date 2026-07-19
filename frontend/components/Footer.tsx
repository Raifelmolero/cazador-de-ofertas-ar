const BRANDS = {
  calculadora: {
    name: 'CalculadoraML',
    href: 'https://www.calculadoraml.com.ar',
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

export default function Footer({ brand = 'calculadora' }: { brand?: keyof typeof BRANDS }) {
  const b = BRANDS[brand]
  return (
    <footer className="border-t border-zinc-900 mt-12 py-10 px-4">
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
        </p>
      </div>
    </footer>
  )
}
