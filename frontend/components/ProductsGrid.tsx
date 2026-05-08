'use client'

import { useState, useMemo } from 'react'
import type { ProductWithMargins } from '@/lib/productos'
import ProductCard from './ProductCard'

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-base font-bold truncate ${accent ? 'text-emerald-400' : 'text-white'}`}>{value}</p>
    </div>
  )
}

export default function ProductsGrid({ productos }: { productos: ProductWithMargins[] }) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return productos
    const q = search.toLowerCase()
    return productos.filter(p => p.titulo.toLowerCase().includes(q))
  }, [productos, search])

  const avgMargen = Math.round(
    productos.reduce((sum, p) => sum + p.margen_neto_clasico_ars, 0) / productos.length
  )
  const maxMargen = Math.max(...productos.map(p => p.margen_neto_clasico_ars))

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard label="Total Productos" value={productos.length.toString()} />
        <StatCard
          label="Margen Promedio"
          value={`$${avgMargen.toLocaleString('es-AR')}`}
          accent
        />
        <StatCard
          label="Mayor Margen"
          value={`$${Math.round(maxMargen).toLocaleString('es-AR')}`}
          accent
        />
        <StatCard label="Datos" value="Actualizados" />
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Buscar productos por nombre..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-11 pr-10 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors text-sm"
          >
            ✕
          </button>
        )}
      </div>

      {/* Results count */}
      {search && (
        <p className="text-sm text-gray-400 mb-4">
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} para &ldquo;{search}&rdquo;
        </p>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => (
            <ProductCard key={p.id_ml} producto={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-gray-500">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg font-medium text-gray-400">Sin resultados</p>
          <p className="text-sm mt-1">No hay productos para &ldquo;{search}&rdquo;</p>
        </div>
      )}
    </div>
  )
}
