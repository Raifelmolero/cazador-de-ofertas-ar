// Filtro rápido por categoría de /hoy. Módulo puro (lo importa la grilla, que corre en el navegador).
// `slug` es el de lib/categorias: la regla de qué entra en cada rubro es la misma que en /categoria.
export const RUBROS_FILTRO = [
  { slug: 'notebooks', label: '💻 Notebooks' },
  { slug: 'smart-tv', label: '📺 Smart TV' },
  { slug: 'aire-acondicionado', label: '❄️ Aires' },
  { slug: 'celulares', label: '📱 Celulares' },
  { slug: 'heladeras', label: '🧊 Heladeras' },
  { slug: 'colchones', label: '🛏️ Colchones' },
  { slug: 'herramientas-electricas', label: '🛠️ Herramientas' },
  { slug: 'bicicletas', label: '🚲 Bicis' },
] as const
