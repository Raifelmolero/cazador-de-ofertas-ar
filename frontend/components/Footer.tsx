export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 mt-12 py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-yellow-400 text-sm">CalculadoraML</span>
          <span>·</span>
          <a
            href="https://www.calculadoraml.com.ar"
            className="hover:text-yellow-400 transition-colors"
          >
            calculadoraml.com.ar
          </a>
        </div>
        <p className="text-center sm:text-right leading-relaxed">
          Los márgenes son estimados. Verificá comisiones y costos en Mercado Libre antes de vender.
          <br className="hidden sm:block" />
          Este sitio usa links de afiliado de Mercado Libre.
        </p>
      </div>
    </footer>
  )
}
