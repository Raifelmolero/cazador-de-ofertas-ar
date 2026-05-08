import { getProductos } from '@/lib/productos'
import ProductsGrid from '@/components/ProductsGrid'

export default function HomePage() {
  const productos = getProductos()

  return (
    <main className="min-h-screen">
      {/* Sticky header */}
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">SEO Pasivo ML</h1>
            <p className="text-xs text-gray-500">Calculadora de márgenes · Mercado Libre</p>
          </div>
          <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-full">
            {productos.length} productos
          </span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <ProductsGrid productos={productos} />
      </div>
    </main>
  )
}
