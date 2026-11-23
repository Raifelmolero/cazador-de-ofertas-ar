// Guías de Black Friday 2026 y su landing (/mejores/black-friday-*). Módulo puro, sin imports:
// lo usan lib/guias.ts (fecha), la página de guías (JSON-LD, «Actualizado el», productos),
// llms.txt y bot/tests/test_landings_black_friday.py.
//
// Pedido del 23/11/2026: cada guía BF enlaza a su landing y cada landing a 2 guías
// relacionadas (eso último vive en `enlaces` de lib/black-friday-landings.ts).

/** Última revisión del texto de las guías BF (respuesta corta, links). Subirla solo si se edita de verdad. */
export const FECHA_REVISION_BF = '2026-11-23'

/** slug de la guía → slug de su landing BF; null = no hay landing del rubro (va a /black-friday). */
export const GUIA_BF_A_LANDING: Record<string, string | null> = {
  'que-notebook-comprar-black-friday-2026': 'black-friday-notebooks',
  'que-tv-50-pulgadas-comprar-black-friday-2026': 'black-friday-smart-tv',
  'que-notebook-comprar-black-friday': 'black-friday-notebooks',
  'que-celular-comprar-black-friday': 'black-friday-celulares',
  'que-smart-tv-comprar-black-friday': 'black-friday-smart-tv',
  'que-bicicleta-comprar-black-friday': 'black-friday-bicicletas',
  'mejores-aires-acondicionados-black-friday-2026': 'black-friday-aires-acondicionados',
  'mejores-lavarropas-black-friday-2026': 'black-friday-lavarropas',
  'que-consola-comprar-black-friday': null,
  'black-friday-argentina-que-conviene-comprar': null,
}

export const esGuiaBF = (slug: string) => slug in GUIA_BF_A_LANDING

/** '2026-11-23' → '23/11/2026' */
export const fechaAR = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`

/** Primera frase de un texto (para llms.txt: «qué recomienda» en una línea). */
export function primeraFrase(texto: string): string {
  const m = texto.match(/^.+?[.!?](?=\s|$)/)
  return (m ? m[0] : texto).trim()
}
