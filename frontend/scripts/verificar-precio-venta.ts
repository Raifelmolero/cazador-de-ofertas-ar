// Verificación de la calculadora inversa. Correr:
//   npx tsc lib/precioventa.ts lib/costosml.ts scripts/verificar-precio-venta.ts --outDir $TEMP/verif --module commonjs --target es2020 && node $TEMP/verif/scripts/verificar-precio-venta.js
import { calcular } from '../lib/costosml'
import { precioParaGanancia } from '../lib/precioventa'

const casos = [
  { nombre: 'Banda $0–$14.999, justo debajo del límite', costo: 8000, ganancia: 3400, cargoPct: 14.69, cuotasPct: 0, envio: 0 },
  { nombre: 'Límite $14.999/$15.000: no entra en la banda 1, salta a la 2', costo: 8000, ganancia: 3470, cargoPct: 14.69, cuotasPct: 0, envio: 0 },
  { nombre: 'Límite $23.999/$24.000: salta a la banda 3', costo: 12000, ganancia: 5800, cargoPct: 14.69, cuotasPct: 0, envio: 0 },
  { nombre: 'Cerca de $33.000: conviene subir al umbral', costo: 20000, ganancia: 4500, cargoPct: 14.69, cuotasPct: 0, envio: 0 },
  { nombre: 'Hueco antes de $33.000: la respuesta es exactamente $33.000', costo: 20000, ganancia: 5000, cargoPct: 14.69, cuotasPct: 0, envio: 0 },
  { nombre: 'Más de $33.000 con cuotas y envío', costo: 30000, ganancia: 20, cargoPct: 17.75, cuotasPct: 8.9, envio: 6190 },
]
let ok = true
for (const c of casos) {
  const s = precioParaGanancia(c)!
  const r = calcular({ precio: s.precio, cargoPct: c.cargoPct, cuotasPct: c.cuotasPct, envio: c.envio, costo: c.costo })
  const rMenos = calcular({ precio: s.precio - 1, cargoPct: c.cargoPct, cuotasPct: c.cuotasPct, envio: c.envio, costo: c.costo })
  // Debe dar la ganancia pedida y ningún precio más bajo debe alcanzarla.
  let minimo = true
  for (let p = Math.max(1, s.precio - 40000); p < s.precio; p++)
    if (calcular({ precio: p, cargoPct: c.cargoPct, cuotasPct: c.cuotasPct, envio: c.envio, costo: c.costo }).ganancia >= c.ganancia - 1e-6) { minimo = false; break }
  // Sin pasarse más de $1, salvo que el precio sea el inicio de la banda (ej. $33.000).
  const pasa = r.ganancia >= c.ganancia - 1e-6 && (r.ganancia - c.ganancia < 1 || s.precio === s.banda.desde) && minimo
  if (!pasa) ok = false
  console.log(`${pasa ? 'OK ' : 'MAL'} ${c.nombre}: precio $${s.precio} (fijo $${r.fijo}) → ganancia $${r.ganancia.toFixed(2)} (pedida $${c.ganancia}); a $${s.precio - 1}: $${rMenos.ganancia.toFixed(2)}${s.subirAlUmbral ? `; a $33.000 ganás $${s.subirAlUmbral.gananciaExtra.toFixed(0)} más` : ''}`)
}
process.exit(ok ? 0 : 1)
