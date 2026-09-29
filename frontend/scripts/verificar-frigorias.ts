// Verificación de la calculadora de frigorías. Correr:
//   npx tsc lib/frigorias.ts scripts/verificar-frigorias.ts --outDir $TEMP/verif-frig --module commonjs --target es2020 && node $TEMP/verif-frig/scripts/verificar-frigorias.js
import { btuAFrigorias, calcularFrigorias, frigoriasABtu, frigoriasAKw, frigoriasDelTitulo, kwAFrigorias, sirvePara, type Entrada } from '../lib/frigorias'

let ok = true
function check(nombre: string, obtenido: unknown, esperado: unknown) {
  const pasa = obtenido === esperado
  if (!pasa) ok = false
  console.log(`${pasa ? 'OK ' : 'MAL'} ${nombre}: ${String(obtenido)}${pasa ? '' : ` (esperado ${String(esperado)})`}`)
}
const r2 = (n: number) => Math.round(n * 100) / 100

// Conversiones (NIST SP 811: cal_IT = 4,1868 J; Btu_IT = 1055,056 J)
check('1 frigoría = 3,968 BTU', Math.round(frigoriasABtu(1) * 1000) / 1000, 3.968)
check('18000 BTU = 4536 frigorías', Math.round(btuAFrigorias(18000)), 4536)
check('12000 BTU = 3024 frigorías', Math.round(btuAFrigorias(12000)), 3024)
check('9000 BTU = 2268 frigorías', Math.round(btuAFrigorias(9000)), 2268)
check('1 kW = 859,85 frigorías', r2(kwAFrigorias(1)), 859.85)
check('3000 frigorías = 3,49 kW', r2(frigoriasAKw(3000)), 3.49)

const casos: { nombre: string; e: Entrada; total: number; rec: number | null }[] = [
  { nombre: '20 m², 2,6 m, poco sol, 2 personas', e: { m2: 20, altura: 2.6, sol: 'poco', personas: 2, watts: 0 }, total: 2600, rec: 2750 },
  { nombre: '20 m², 2,6 m, sol normal', e: { m2: 20, altura: 2.6, sol: 'normal', personas: 2, watts: 0 }, total: 2860, rec: 3000 },
  { nombre: '12 m², 2,5 m, poco sol (dormitorio)', e: { m2: 12, altura: 2.5, sol: 'poco', personas: 2, watts: 0 }, total: 1500, rec: 2250 },
  { nombre: '30 m², 2,6 m, mucho sol, 4 personas, 200 W', e: { m2: 30, altura: 2.6, sol: 'mucho', personas: 4, watts: 200 }, total: 5052, rec: 5500 },
  { nombre: '50 m², 2,7 m, mucho sol: más de 6000', e: { m2: 50, altura: 2.7, sol: 'mucho', personas: 2, watts: 0 }, total: 8100, rec: null },
  { nombre: 'Vacío', e: { m2: 0, altura: 2.6, sol: 'normal', personas: 2, watts: 0 }, total: 0, rec: null },
]
for (const c of casos) {
  const r = calcularFrigorias(c.e)
  check(`${c.nombre} → total`, r.total, c.total)
  check(`${c.nombre} → equipo`, r.recomendado, c.rec)
}

// Lectura de frigorías de títulos reales del catálogo
const titulos: [string, number | null][] = [
  ['Aire Acondicionado Split Frío/calor BGH Likon 2700f Lks35wcew', 2700],
  ['Aire Acondicionado Split Inverter Sansei Frio Calor 3225 Frigorias / 3750 W', 3225],
  ['Aire Acondicionado Comfee Inverter Split Frío/calor 3105 Fg Color Blanco', 3105],
  ['Aire Acondicionado Split Frío/calor Likon 3200w LKS35WCEW Color Blanco', 2752],
  ['Aire Acondicionado Split 18000 BTU Frío Calor', 4536],
  ['Aire Acondicionado Split 5.500 Frigorías', 5500],
  ['Aire Acondicionado Hyundai HY12INV-6600FCW Inverter Wifi Blanco', null],
]
for (const [t, esp] of titulos) check(`título "${t.slice(0, 50)}…"`, frigoriasDelTitulo(t), esp)

check('2700 f sirve para 2600 → 2750', sirvePara(2700, 2600, 2750), true)
check('4500 no sirve para 2750', sirvePara(4500, 2600, 2750), false)
check('2250 no sirve para 2860 → 3000', sirvePara(2250, 2860, 3000), false)

process.exit(ok ? 0 : 1)
