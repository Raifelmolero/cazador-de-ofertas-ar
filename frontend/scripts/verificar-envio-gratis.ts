// Verificación de la calculadora de envío gratis contra valores de las tablas
// oficiales de ML (ayuda 40538, 40545, 40547). Correr:
//   npx tsc lib/enviogratis.ts lib/costosml.ts scripts/verificar-envio-gratis.ts --outDir $TEMP/verif --module commonjs --target es2020 && node $TEMP/verif/scripts/verificar-envio-gratis.js
import { calcular } from '../lib/costosml'
import { costoEnvioGratis, type Reputacion } from '../lib/enviogratis'

const casos: { nombre: string; precio: number; peso: number; rep: Reputacion; esperado: number | null; recibis?: number }[] = [
  { nombre: 'Verde, $40.000, 0,8 kg, cargo 14% (ejemplo de la guía)', precio: 40000, peso: 0.8, rep: 'verde', esperado: 7790, recibis: 26610 },
  { nombre: 'Amarilla, $25.000, 0,3 kg (opcional, 20% off)', precio: 25000, peso: 0.3, rep: 'amarilla', esperado: 9904 },
  { nombre: 'Naranja, $60.000, 1 kg (sin descuento)', precio: 60000, peso: 1, rep: 'naranja', esperado: 16580 },
  { nombre: 'Verde, 12 kg: fuera de la tabla', precio: 50000, peso: 12, rep: 'verde', esperado: null },
]
let ok = true
for (const c of casos) {
  const e = costoEnvioGratis(c.precio, c.peso, c.rep)
  let pasa = (e?.costo ?? null) === c.esperado
  let extra = ''
  if (e && c.recibis !== undefined) {
    const r = calcular({ precio: c.precio, cargoPct: 14, cuotasPct: 0, envio: e.costo, costo: 0 })
    pasa = pasa && Math.round(r.recibis) === c.recibis
    extra = ` → te quedan $${r.recibis}`
  }
  if (!pasa) ok = false
  console.log(`${pasa ? 'OK ' : 'MAL'} ${c.nombre}: ${e ? `$${e.costo} (obligatorio: ${e.obligatorio})` : 'sin dato'}${extra}`)
}
process.exit(ok ? 0 : 1)
