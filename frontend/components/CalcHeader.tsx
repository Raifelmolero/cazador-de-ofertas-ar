import Link from 'next/link'

// Encabezado de las páginas de calculadoraml.com.ar (vendedores).
export default function CalcHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
      <nav className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
        <Link href="/" className="text-lg font-extrabold text-yellow-400 tracking-tight">
          CalculadoraML
        </Link>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <Link href="/calculadora-de-comisiones" className="text-zinc-300 hover:text-yellow-400">
            Calculadora
          </Link>
          <Link href="/vender" className="text-zinc-300 hover:text-yellow-400">
            Guías para vender
          </Link>
        </div>
      </nav>
    </header>
  )
}
