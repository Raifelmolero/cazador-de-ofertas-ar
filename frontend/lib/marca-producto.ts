// Marca de un producto derivada del título, para el `brand` del JSON-LD.
// Los datos de seguimiento no traen campo de marca, así que se deduce de forma
// conservadora: solo marcas conocidas, como palabra entera, y nunca cuando el
// título la nombra como compatibilidad («funda para iPhone»). Ante la duda
// (ninguna o más de una marca) devuelve undefined y no se declara brand.

const MARCAS: [RegExp, string][] = [
  [/\b(apple|iphone|ipad|macbook|airpods)\b/, 'Apple'],
  [/\b(samsung|galaxy)\b/, 'Samsung'],
  // «moto» solo no: también es motocicleta
  [/\b(motorola|moto (g|e)\d+|moto edge)\b/, 'Motorola'],
  // «poco» solo no: es una palabra común
  [/\b(xiaomi|redmi|poco [xfmc]\d+)\b/, 'Xiaomi'],
  [/\blg\b/, 'LG'],
  [/\bphilips\b/, 'Philips'],
  [/\bbgh\b/, 'BGH'],
  // «2 hp» es potencia, no la marca
  [/(?<!\d\s?)(?<!\/)\bhp\b/, 'HP'],
  [/\blenovo\b/, 'Lenovo'],
  [/\basus\b/, 'Asus'],
  [/\bacer\b/, 'Acer'],
  [/\bdell\b/, 'Dell'],
  [/\bmsi\b/, 'MSI'],
  [/\bsony\b/, 'Sony'],
  [/\bmidea\b/, 'Midea'],
  [/\belectrolux\b/, 'Electrolux'],
  [/\bwhirlpool\b/, 'Whirlpool'],
  [/\bdrean\b/, 'Drean'],
  [/\bnoblex\b/, 'Noblex'],
  [/\btcl\b/, 'TCL'],
  [/\bhisense\b/, 'Hisense'],
  [/\bphilco\b/, 'Philco'],
  [/\bpeabody\b/, 'Peabody'],
  [/\batma\b/, 'Atma'],
  [/\bliliana\b/, 'Liliana'],
  [/\boster\b/, 'Oster'],
  [/\bsurrey\b/, 'Surrey'],
  [/\bgafa\b/, 'Gafa'],
  [/\bkanji\b/, 'Kanji'],
  [/\benova\b/, 'Enova'],
  [/\bhuawei\b/, 'Huawei'],
  [/\bzte\b/, 'ZTE'],
  [/\bnokia\b/, 'Nokia'],
  [/\brealme\b/, 'Realme'],
  [/\boppo\b/, 'Oppo'],
  [/\binfinix\b/, 'Infinix'],
  [/\bjbl\b/, 'JBL'],
  [/\blogitech\b/, 'Logitech'],
  [/\bredragon\b/, 'Redragon'],
  [/\bepson\b/, 'Epson'],
  [/\bkingston\b/, 'Kingston'],
  [/\bsandisk\b/, 'SanDisk'],
  [/\bgarmin\b/, 'Garmin'],
  [/\bbosch\b/, 'Bosch'],
  [/\bmakita\b/, 'Makita'],
  [/\bmoulinex\b/, 'Moulinex'],
  [/\bnespresso\b/, 'Nespresso'],
  [/\bultracomb\b/, 'Ultracomb'],
  [/\byelmo\b/, 'Yelmo'],
  [/\bnintendo\b/, 'Nintendo'],
]

/** Todo lo que sigue a «para», «compatible», «apto» o «tipo» nombra otra marca, no la del producto. */
const COMPATIBILIDAD = /\b(para|compatible|compatibles|apto|apta|tipo|simil|estilo)\b.*$/

export function marcaDeTitulo(titulo: string): string | undefined {
  const t = titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(COMPATIBILIDAD, '')
  const halladas = new Set(MARCAS.filter(([re]) => re.test(t)).map(([, marca]) => marca))
  return halladas.size === 1 ? [...halladas][0] : undefined
}
