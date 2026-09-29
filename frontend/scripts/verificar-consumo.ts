// Verificación de la calculadora de consumo eléctrico. Correr:
//   npx tsc lib/consumo.ts scripts/verificar-consumo.ts --outDir $TEMP/verif-cons --module commonjs --target es2020 && node $TEMP/verif-cons/scripts/verificar-consumo.js
import { EQUIPOS, calcularConsumo, wattsDesdeKwhAnio } from '../lib/consumo'

let ok = true
function check(nombre: string, obtenido: unknown, esperado: unknown) {
  const pasa = obtenido === esperado
  if (!pasa) ok = false
  console.log(`${pasa ? 'OK ' : 'MAL'} ${nombre}: ${String(obtenido)}${pasa ? '' : ` (esperado ${String(esperado)})`}`)
}
const r2 = (n: number | null) => (n == null ? null : Math.round(n * 100) / 100)

check('1000 W × 1 h = 1 kWh', calcularConsumo(1000, 1, 1).kwhDia, 1)
check('1100 W × 6 h × 30 d = 198 kWh/mes', r2(calcularConsumo(1100, 6, 30).kwhMes), 198)
check('40 W × 24 h × 30 d = 28,8 kWh/mes', r2(calcularConsumo(40, 24, 30).kwhMes), 28.8)
check('Año = mes × 12', r2(calcularConsumo(40, 24, 30).kwhAnio), 345.6)
check('Sin precio → costo null', calcularConsumo(1000, 1, 30).costoMes, null)
check('30 kWh × $100 = $3000', r2(calcularConsumo(1000, 1, 30, 100).costoMes), 3000)
check('Horas topean en 24', calcularConsumo(1000, 30, 1).kwhDia, 24)
check('Negativos → 0', calcularConsumo(-5, 2, 3).kwhMes, 0)
check('350 kWh/año ≈ 39,95 W', r2(wattsDesdeKwhAnio(350)), 39.95)
check('10 equipos', EQUIPOS.length, 10)
check('ids únicos', new Set(EQUIPOS.map(e => e.id)).size, EQUIPOS.length)

console.log(ok ? '\nTODO OK' : '\nHAY ERRORES')
if (!ok) process.exit(1)
