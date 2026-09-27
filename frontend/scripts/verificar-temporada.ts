// Verificación del banner de temporada. Correr:
//   npx tsc lib/temporada.ts scripts/verificar-temporada.ts --outDir $TEMP/verif --module commonjs --target es2020 && node $TEMP/verif/scripts/verificar-temporada.js
import { temporadaActual } from '../lib/temporada'

const casos: [string, string | null][] = [
  ['2026-10-18T23:59:00-03:00', 'madre'],
  ['2026-10-19T00:00:00-03:00', 'cyber'],
  ['2026-11-04T23:59:00-03:00', 'cyber'],
  ['2026-11-05T00:00:00-03:00', 'blackfriday'],
  ['2026-11-27T23:59:00-03:00', 'blackfriday'],
  ['2026-11-28T00:00:00-03:00', 'navidad'],
  ['2027-01-06T23:59:00-03:00', 'navidad'],
  ['2027-01-07T00:00:00-03:00', null],
]
let ok = true
for (const [f, esperado] of casos) {
  const r = temporadaActual(new Date(f))?.id ?? null
  const pasa = r === esperado
  if (!pasa) ok = false
  console.log(`${pasa ? 'OK ' : 'MAL'} ${f} → ${r} (esperado ${esperado})`)
}
process.exit(ok ? 0 : 1)
