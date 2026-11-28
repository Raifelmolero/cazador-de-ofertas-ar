// Expansión verano ticket alto (27/11/2026, del Black Friday a Navidad y el verano).
//
// Las ventas que más plata dejan son pocas y caras, y la etiqueta que convierte es `sitio`
// (7,97 %; calcml: 0 ventas). Estas 5 comparativas /mejores/[slug] YA EXISTEN (lib/comparativas.ts):
// no hay rutas nuevas ni páginas estáticas de más. Este módulo les suma:
//   - un cuadro amarillo (#FACC15) arriba de todo, el mismo de /black-friday y las calculadoras
//     (components/CtaOfertaDestacada), con producto concreto + precio + botón a la ficha
//     /precio/[slug] del sitio (nunca al listado de ML ni a /ofertas);
//   - title y description de temporada;
//   - los enlaces internos entre ellas (components/EnlacesVerano: home, regalos, calculadoras).
//
// Reglas del cuadro (no inventar nada):
// - Solo productos con ficha /precio propia (data/seguimiento.json + lib/seguidos-manuales.ts) que
//   entran en la comparativa (misma categoría, keywords y exclusiones que la tabla).
// - Primero los vigentes (en el catálogo, precio visto hace DIAS_PRECIO_VIEJO días o menos), del
//   más caro al más barato.
// - Si hay menos de MAX_DESTACADOS vigentes, regla de /mejor (lib/presupuesto.ts, decisión 16/11):
//   se completa con el último precio registrado, los más recientes primero, rotulado.
// - Si ni así llega a MAX_DESTACADOS, el cuadro no se publica (la comparativa sigue igual).
// - Sin BGH (ni el resto de MARCAS_EXCLUIDAS_CTA), sin usados ni accesorios, sin % ni tachados.
//
// Estado de los datos al 27/11/2026 (corte del catálogo 26/11):
// - Heladeras, colchones y muebles de jardín (reposeras): con fichas /precio → cuadro publicado.
// - Aires acondicionados: 1 aire en el catálogo (Samsung, precio del 19/11) y 4 verificados a mano
//   en lib/mejor-aires.ts, pero NINGUNO tiene ficha /precio → el cuadro no se publica (no hay a dónde
//   mandar el botón sin pasar por ML). Vuelve solo cuando el bot siga un aire.
// - Piletas: 3 piletas en el catálogo, ninguna con ficha /precio → cuadro no publicado.
// - Ventiladores: 0 fichas /precio; por eso el rubro de aire libre es muebles de jardín.
import { categoriaDe, getComparativa, productosDe, type Comparativa } from '@/lib/comparativas'
import { getSeguidosPrincipales, seguidosDeCategoria, slugPorId, precioActual, type Seguido } from '@/lib/seguimiento'
import { normalizar } from '@/lib/categorias'
import { diasDesde, DIAS_PRECIO_VIEJO } from '@/lib/frescura'
import { IDS_EXCLUIDOS_CTA, MARCAS_EXCLUIDAS_CTA, MAX_DESTACADOS, type CtaDestacado } from '@/lib/cta-destacados'
import type { ProductoBF } from '@/lib/black-friday-landings'
import { nombreCorto } from '@/lib/nombrecorto'

export interface LandingVerano {
  /** slug de la comparativa /mejores/[slug] (tiene que existir en COMPARATIVAS) */
  slug: string
  /** texto del enlace interno */
  nombre: string
  emoji: string
  /** título del cuadro amarillo */
  titulo: string
  /** <title> de temporada, ≤ 60 caracteres, sin precios */
  seoTitulo: string
  /** meta description de temporada, sin precios ni descuentos */
  seoDescripcion: string
  /** palabras que sacan un producto del cuadro (además de las de la comparativa) */
  excluir?: string[]
  /** accesorio suelto: el título arranca con esta palabra */
  excluirSiEmpieza?: string[]
  /** si está, el título tiene que nombrar alguna de estas palabras para entrar en el cuadro */
  incluir?: string[]
}

/** Las 5 de verano, en el orden en que se enlazan. */
export const LANDINGS_VERANO: LandingVerano[] = [
  {
    slug: 'mejores-aires-acondicionados',
    nombre: 'Aires acondicionados',
    emoji: '❄️',
    titulo: 'El aire que elegimos para este verano',
    seoTitulo: 'Aires acondicionados 2026: precios para el verano',
    seoDescripcion:
      'Aires acondicionados split e inverter para el verano 2026: frigorías según los m², consumo y el precio más bajo que registramos en Mercado Libre.',
    excluir: ['limpiadora', 'soporte', 'cobertor', 'funda', 'control remoto', 'kit de instalacion'],
  },
  {
    slug: 'mejores-heladeras',
    nombre: 'Heladeras',
    emoji: '🧊',
    titulo: 'Las heladeras que elegimos para el verano',
    seoTitulo: 'Mejores heladeras 2026: precios para el verano',
    seoDescripcion:
      'Heladeras no frost, inverter y con freezer para el verano 2026: litros, consumo y el precio más bajo que registramos en Mercado Libre Argentina.',
    excluir: ['frigobar', 'portatil', '12v', 'bajo mesada', 'exhibidora'],
  },
  {
    slug: 'mejores-colchones',
    nombre: 'Colchones',
    emoji: '🛏️',
    titulo: 'Los colchones que elegimos hoy',
    seoTitulo: 'Mejores colchones 2026: precios de verano y Navidad',
    seoDescripcion:
      'Colchones y sommiers de espuma, resortes pocket o híbridos: medidas, firmeza y el precio más bajo que registramos en Mercado Libre Argentina.',
    excluir: ['inflable', 'electrico', 'protector', 'cubre', 'cuna', 'colchoneta', 'antiescaras', 'carpa', 'practicuna', 'sillon', 'mat '],
  },
  {
    slug: 'mejores-piletas',
    nombre: 'Piletas',
    emoji: '🏊',
    titulo: 'La pileta que elegimos para este verano',
    seoTitulo: 'Piletas estructurales y de lona 2026: precios de verano',
    seoDescripcion:
      'Piletas estructurales y de lona para el verano 2026: litros, medidas, bomba filtrante y el precio más bajo que registramos en Mercado Libre.',
    excluir: ['termometro', 'cloro', 'pastilla', 'barrefondo', 'saca hojas', 'inflable', 'cobertor', 'flotador'],
    // La bomba o el filtro sueltos son accesorios; una pileta «con bomba filtrante» sí entra.
    excluirSiEmpieza: ['bomba', 'filtro', 'kit', 'lona para', 'cubre'],
  },
  {
    slug: 'mejores-muebles-de-jardin',
    nombre: 'Jardín y aire libre',
    emoji: '🌿',
    titulo: 'Para el jardín y el aire libre: lo que elegimos hoy',
    seoTitulo: 'Muebles de jardín, reposeras y gazebos 2026: precios',
    seoDescripcion:
      'Reposeras, gazebos, juegos de jardín y sombrillas para el verano 2026, con el precio más bajo que registramos en Mercado Libre Argentina.',
    // «exterior» trae puertas y calefactores: en el cuadro solo muebles, sombra y guardado de jardín.
    incluir: ['gazebo', 'glorieta', 'pergola', 'sombrilla', 'reposera', 'camastro', 'tumbona', 'hamaca', 'juego de jardin', 'set de jardin', 'sillon', 'silla', 'mesa', 'banco', 'cobertizo', 'galpon', 'deposito de jardin', 'armario exterior'],
    excluir: ['puerta', 'calefactor', 'estufa', 'camara', 'luz', 'lampara', 'reflector'],
  },
]

export const getLandingVerano = (slug: string) => LANDINGS_VERANO.find(l => l.slug === slug)

/** Ni usados ni reacondicionados en un cuadro de recomendación. */
const USADOS = /\b(usad[oa]s?|reacondicionad[oa]s?|segunda mano)\b/

/** ¿Queda afuera del cuadro? BGH (y el resto de las marcas de los cuadros), ids vetados, usados y accesorios. */
export function excluidoVerano(l: LandingVerano, id: string, titulo: string): boolean {
  const t = normalizar(titulo)
  return (
    IDS_EXCLUIDOS_CTA.has(id) ||
    MARCAS_EXCLUIDAS_CTA.test(titulo) ||
    MARCAS_EXCLUIDAS_CTA.test(t) ||
    USADOS.test(t) ||
    (l.excluir ?? []).some(x => t.includes(normalizar(x))) ||
    (l.excluirSiEmpieza ?? []).some(x => t.startsWith(normalizar(x))) ||
    (!!l.incluir && !l.incluir.some(x => t.includes(normalizar(x))))
  )
}

/** Fichas /precio que entran en la comparativa: misma regla que «Historial de precios de otros
 *  modelos» de app/mejores/[slug] (categoría o keywords, y exclusiones de la comparativa). */
function seguidosDe(c: Comparativa): Seguido[] {
  const cat = categoriaDe(c)
  const kws = (c.keywords ?? []).map(normalizar)
  const fuera = (c.excluir ?? []).map(normalizar)
  const base = cat ? seguidosDeCategoria(cat.slug) : kws.length ? getSeguidosPrincipales() : []
  return base.filter(s => {
    const t = normalizar(s.titulo)
    return (!kws.length || kws.some(k => t.includes(k))) && !fuera.some(f => t.includes(f))
  })
}

export interface CandidatoVerano {
  id: string
  titulo: string
  /** slug de la ficha /precio/[slug] (la principal) */
  ficha: string
  url: string
  img: string | null
  precio: number
  /** 'AAAA-MM-DD' del precio */
  fecha: string
  /** true = en el catálogo con precio visto hace DIAS_PRECIO_VIEJO días o menos */
  vigente: boolean
}

const ddmm = (iso: string) => iso.slice(8, 10) + '/' + iso.slice(5, 7)

/** Candidatos del cuadro, ya ordenados: vigentes del más caro al más barato, después el último
 *  precio registrado (los más recientes primero). Sin repetir ficha. */
export function candidatosVerano(l: LandingVerano, hoy?: string): CandidatoVerano[] {
  const c = getComparativa(l.slug)
  if (!c) return []
  const fichas = slugPorId()
  const usados = new Set<string>()
  const vigentes: CandidatoVerano[] = []
  const viejos: CandidatoVerano[] = []
  // 1) Catálogo del día (productosDe ya poda lo vencido y aplica las exclusiones de la tabla).
  for (const p of productosDe(c)) {
    const ficha = fichas[p.id_ml]
    if (!ficha || !p.precio_actual || p.precio_actual <= 0 || excluidoVerano(l, p.id_ml, p.titulo)) continue
    if (!p.precio_visto || !/^\d{4}-\d{2}-\d{2}/.test(p.precio_visto)) continue
    const d = diasDesde(p.precio_visto, hoy)
    const x: CandidatoVerano = {
      id: p.id_ml, titulo: p.titulo, ficha, url: p.url_producto, img: p.url_imagen,
      precio: p.precio_actual, fecha: p.precio_visto.slice(0, 10), vigente: d !== null && d <= DIAS_PRECIO_VIEJO,
    }
    ;(x.vigente ? vigentes : viejos).push(x)
  }
  // 2) Fichas del rubro que hoy no están en el catálogo: solo con su último precio registrado.
  const enCatalogo = new Set([...vigentes, ...viejos].map(x => x.id))
  for (const s of seguidosDe(c)) {
    if (enCatalogo.has(s.id) || !s.serie.length || excluidoVerano(l, s.id, s.titulo)) continue
    const precio = precioActual(s)
    if (!precio || precio <= 0) continue
    viejos.push({ id: s.id, titulo: s.titulo, ficha: s.slug, url: s.url, img: s.img, precio, fecha: s.serie[s.serie.length - 1][0], vigente: false })
  }
  vigentes.sort((a, b) => b.precio - a.precio || a.ficha.localeCompare(b.ficha))
  viejos.sort((a, b) => b.fecha.localeCompare(a.fecha) || b.precio - a.precio || a.ficha.localeCompare(b.ficha))
  const out: CandidatoVerano[] = []
  for (const x of [...vigentes, ...viejos]) {
    if (usados.has(x.ficha)) continue
    usados.add(x.ficha)
    out.push(x)
  }
  return out
}

/** Cuadro amarillo de la landing de verano, o null si no llega a MAX_DESTACADOS productos. */
export function cuadroVerano(slug: string, hoy?: string): CtaDestacado | null {
  const l = getLandingVerano(slug)
  if (!l) return null
  const elegidos = candidatosVerano(l, hoy).slice(0, MAX_DESTACADOS)
  if (elegidos.length < MAX_DESTACADOS) return null
  const fichaDe = new Map(elegidos.map(x => [x.id, x.ficha]))
  const rotulos: Record<string, string> = {}
  const productos: ProductoBF[] = elegidos.map(x => {
    if (!x.vigente) rotulos[x.id] = `Último precio registrado (${ddmm(x.fecha)}): confirmalo en la ficha`
    return {
      id: x.id,
      nombre: nombreCorto(x.titulo),
      detalle: '',
      url: x.url,
      img: x.img,
      precio: x.precio,
      visto: x.vigente ? x.fecha : null,
    }
  })
  return {
    titulo: l.titulo,
    seccion: `verano_${slug}`,
    evento: 'verano_destacado',
    items: productos,
    productos,
    verMas: { href: '#comparativa', texto: 'Ver la comparativa completa' },
    // Botón a la ficha del sitio: ahí el clic a ML sale con la etiqueta `sitio` (app/clics-ml.tsx).
    destinoInterno: p => `/precio/${fichaDe.get(p.id) ?? ''}`,
    textoBoton: 'Ver precio e historial →',
    rotulos,
  }
}
