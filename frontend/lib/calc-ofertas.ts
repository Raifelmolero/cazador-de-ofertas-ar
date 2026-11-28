// Cuadro «oferta destacada» de las calculadoras (calculadoraml.com.ar, etiqueta calcml).
//
// Fuga calcml (panel ML 18-24/11/2026): 791 clics y 0 ventas, contra `sitio` 225 clics y
// 23 unidades (10,22 %). Diagnóstico (25/11): el botón grande de las 4 calculadoras de
// vendedores (comisiones, precio de venta, envío gratis, cuotas) iba a
// mercadolibre.com.ar/ofertas, un LISTADO genérico, no a un producto; el bloque BF anterior
// (PR #85) tenía producto pero sin precio. Los cuadros que venden (`sitio`) mandan a la
// publicación /p/MLA de un producto concreto, con foto, precio y fecha de verificación.
//
// Acá se arma ese mismo cuadro (components/CtaOfertaDestacada, lib/cta-destacados) para las
// calculadoras: un producto por rubro, sacado de las landings BF (lib/black-friday-landings),
// con el link de afiliado del catálogo (data/productos_rentables.json). La etiqueta calcml la
// pone app/clics-ml.tsx al hacer clic en calculadoraml.com.ar (no se toca acá).
// Reglas: solo productos con precio visto hace DIAS_PRECIO_VIEJO días o menos (vigentes: el
// cuadro siempre muestra precio); sin BGH, HP, OMEN, Victus, Omnibook, Vivobook, Likon ni el
// Noblex de $634.500; sin %, tachados, «mínimo histórico» ni cupones.
import { getLandingBF, productosBF, MARCAS_PROHIBIDAS, type ProductoBF } from '@/lib/black-friday-landings'
import { excluidoDeCta, MAX_DESTACADOS, type CtaDestacado } from '@/lib/cta-destacados'
import { rutaDestinoCalculadora, rutaVerMas } from '@/lib/navidad-post-bf'
import { desdeCalculadora } from '@/lib/afiliado'
import { DEALS_URL } from '@/lib/marca'

/** Marcas que no van en el cuadro de las calculadoras (además de MARCAS_PROHIBIDAS y las de CTA). */
export const MARCAS_EXCLUIDAS_CALC = /\b(bgh|hp|omen|victus|omnibook|vivobook|likon)\b/i
/** El Noblex de $634.500 tampoco va (pedido del 25/11), aunque vuelva al catálogo. */
const NOBLEX_EXCLUIDO = (p: ProductoBF) => /\bnoblex\b/i.test(p.nombre) && p.precio === 634_500

export function excluidoCalc(p: ProductoBF): boolean {
  return MARCAS_PROHIBIDAS.test(p.nombre) || MARCAS_EXCLUIDAS_CALC.test(p.nombre) || excluidoDeCta(p) || NOBLEX_EXCLUIDO(p)
}

/** Calculadoras de vendedores: rubros en orden de preferencia (los 3 primeros que tengan
 *  producto vigente). Los de más abajo son el respaldo si un rubro se queda sin precio fresco. */
// 26/11 (bf-ventas-2611): en el orden de lo que más ganancia dejó en el panel en la semana 19-25/11
// (notebooks, smart TV, lavarropas) y herramientas antes que celulares: paga más comisión por venta.
export const RUBROS_CALC = [
  'black-friday-notebooks',
  'black-friday-smart-tv',
  'black-friday-lavarropas',
  'black-friday-herramientas',
  'black-friday-celulares',
  'black-friday-freidoras-de-aire',
] as const

/** Calculadora de consumo eléctrico: equipos que gastan menos luz. */
export const RUBROS_CONSUMO = [
  'black-friday-aires-acondicionados',
  'black-friday-heladeras',
  'black-friday-lavarropas',
] as const

/** Solo electro de bajo consumo en el cuadro de consumo (la landing de aires trae una pileta). */
const BAJO_CONSUMO = /inverter|no ?frost|lavarropas|lavasecarropas|ecobubble|carga frontal|heladera|split/i

/** Primer producto vigente (con foto, link de afiliado y precio mostrable) de cada rubro, hasta `max`.
 *  Si un rubro no tiene producto fresco (p. ej. los aires con precio visto hace más de 7 días),
 *  completa el cupo con otros productos vigentes de esos mismos rubros. */
export function destacadosDeRubros(
  rubros: readonly string[],
  max: number,
  { hoy, filtro }: { hoy?: string; filtro?: (p: ProductoBF) => boolean } = {},
): ProductoBF[] {
  const out: ProductoBF[] = []
  const vistos = new Set<string>()
  const sirve = (x: ProductoBF) =>
    Boolean(x.img && x.precio !== null && !vistos.has(x.id) && !excluidoCalc(x) && (!filtro || filtro(x)))
  const agregarDe = (soloPrimero: boolean) => {
    for (const slug of rubros) {
      const l = getLandingBF(slug)
      if (!l) continue
      for (const p of productosBF(l, hoy)) {
        if (!sirve(p)) continue
        vistos.add(p.id)
        out.push(p)
        if (out.length >= max || soloPrimero) break
      }
      if (out.length >= max) break
    }
  }
  agregarDe(true)
  if (out.length < max) agregarDe(false)
  return out
}

/** «Ver más»: Black Friday hasta el 29/11, regalos de Navidad hasta Reyes, después las ofertas de hoy
 *  (lib/navidad-post-bf). Siempre al dominio de ofertas con URL absoluta (desde la calculadora esas
 *  rutas redirigen: así no hay salto de más). */
function verMas(): CtaDestacado['verMas'] {
  const { ruta, texto } = rutaVerMas()
  return { href: `${DEALS_URL}${ruta}`, texto }
}

/** Enlaces internos del bloque post-resultado (27/11): a donde sigue quien ya hizo la cuenta.
 *  Todo al sitio de ofertas (`sitio` convierte ~7-8 %), con el utm de la calculadora solo para
 *  medir origen. Nunca a listados de ML. */
export const ENLACES_CALCULADORA: { href: string; texto: string }[] = [
  { href: `${DEALS_URL}/mejores`, texto: 'Comparativas: qué comprar' },
  { href: `${DEALS_URL}/hoy`, texto: 'Ofertas de hoy' },
  { href: `${DEALS_URL}/regalos-navidad`, texto: 'Regalos de Navidad' },
]

function armar(
  def: Omit<CtaDestacado, 'productos' | 'items' | 'verMas'>,
  productos: ProductoBF[],
  link: (v: CtaDestacado['verMas']) => CtaDestacado['verMas'] = v => v,
  destinoInterno?: CtaDestacado['destinoInterno'],
  enlaces?: CtaDestacado['enlaces'],
): CtaDestacado | null {
  return productos.length
    ? { ...def, items: productos, productos, verMas: link(verMas()), ...(destinoInterno ? { destinoInterno } : {}), ...(enlaces ? { enlaces } : {}) }
    : null
}

/** Destino de cada producto del cuadro de las calculadoras (26/11): páginas internas del sitio de
 *  ofertas, donde la etiqueta `sitio` convierte ~8 %. Según la fecha (rutaDestinoCalculadora): BF hasta
 *  el 29/11; desde el 30/11 /regalos-navidad (notebooks → su categoría); pasados Reyes, /hoy.
 *  Nunca una publicación de ML con calcml (1.605 clics, 0 ventas). */
export function destinoCalculadora(p: ProductoBF): string {
  const esNotebook = /notebook|laptop/i.test(p.nombre)
  return desdeCalculadora(`${DEALS_URL}${rutaDestinoCalculadora(esNotebook)}`)
}

/** Cuadro de las calculadoras de vendedores (comisiones, precio de venta, envío, cuotas, fichas). */
export function ctaCalculadora(hoy?: string): CtaDestacado | null {
  return armar(
    {
      titulo: '¿También estás por comprar? Lo que elegimos hoy',
      seccion: 'calcml_destacado',
      evento: 'calcml_oferta_boton',
    },
    destacadosDeRubros(RUBROS_CALC, MAX_DESTACADOS, { hoy }),
    // Solo acá (calculadoraml.com.ar): la de consumo eléctrico ya vive en el sitio de ofertas.
    v => ({ ...v, href: desdeCalculadora(v.href) }),
    destinoCalculadora,
    ENLACES_CALCULADORA.map(e => ({ ...e, href: desdeCalculadora(e.href) })),
  )
}

/** Cuadro de la calculadora de consumo eléctrico: equipos que gastan menos luz. */
export function ctaConsumo(hoy?: string): CtaDestacado | null {
  return armar(
    {
      titulo: '¿Vas a cambiar un equipo? Los que gastan menos, elegidos hoy',
      seccion: 'consumo_destacado',
      evento: 'consumo_oferta_boton',
    },
    destacadosDeRubros(RUBROS_CONSUMO, MAX_DESTACADOS, { hoy, filtro: p => BAJO_CONSUMO.test(`${p.nombre} ${p.detalle}`) }),
  )
}
