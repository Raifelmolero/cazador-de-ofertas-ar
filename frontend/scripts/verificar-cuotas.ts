// Verificación de la calculadora de cuotas sin interés. Correr:
//   npx tsc lib/cuotas.ts lib/costosml.ts scripts/verificar-cuotas.ts --outDir $TEMP/verif --module commonjs --target es2020 && node $TEMP/verif/scripts/verificar-cuotas.js
import { calcularCuotas } from '../lib/cuotas'

// Esperados calculados a mano con CUOTAS/costoFijo de costosml.ts.
const casos = [
  // 40000·14,69% = 5876 → sin: 34124; 6 cuotas 13,4% = 5360 → con: 28764; 34124/0,7191 = 47453,8 → 47454
  { nombre: '$40.000, 6 cuotas, cargo 14,69%', precio: 40000, id: '6', cargo: 14.69, costo: 5360, sin: 34124, con: 28764, igual: 47454 },
  // 20000·14% = 2800, fijo 2740 → sin: 14460; 3 cuotas 8,9% = 1780 → con: 12680;
  // (14460+2740)/0,771 = 22308,7 → 22309 (fijo 2740 aplica, ≤ 23.999)
  { nombre: '$20.000, 3 cuotas, cargo 14% (con costo fijo)', precio: 20000, id: '3', cargo: 14, costo: 1780, sin: 14460, con: 12680, igual: 22309 },
  // 30000·12% = 3600, fijo 3320 → sin: 23080; 12 cuotas 21,6% = 6480 → con: 16600;
  // con fijo 3320: 26400/0,664 = 39759 ≥ 33.000 → no aplica fijo: 23080/0,664 = 34759,04 → 34760
  { nombre: '$30.000, 12 cuotas, cargo 12% (cruza el umbral de $33.000)', precio: 30000, id: '12', cargo: 12, costo: 6480, sin: 23080, con: 16600, igual: 34760 },
]
let ok = true
for (const c of casos) {
  const r = calcularCuotas(c.precio, c.id, c.cargo)!
  const pasa =
    Math.round(r.costoCuotas) === c.costo && Math.round(r.recibisSin) === c.sin && Math.round(r.recibisCon) === c.con && r.precioIgual === c.igual
  if (!pasa) ok = false
  console.log(`${pasa ? 'OK ' : 'MAL'} ${c.nombre}: cuotas $${r.costoCuotas.toFixed(0)}, sin $${r.recibisSin.toFixed(0)}, con $${r.recibisCon.toFixed(0)}, precio igual $${r.precioIgual}`)
}
process.exit(ok ? 0 : 1)
