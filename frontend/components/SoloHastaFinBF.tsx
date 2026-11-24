'use client'
// Oculta su contenido en el navegador una vez pasado el 30/11 (FIN_AVISO_BF).
// En el servidor y durante la hidratación vale «vigente» (así el HTML coincide);
// después se lee el reloj del navegador.
import { useSyncExternalStore, type ReactNode } from 'react'
import { avisoBFVigente } from '@/lib/bf-enlaces'

const sinSuscripcion = () => () => {}
const vigenteAhora = () => avisoBFVigente()
const vigenteServidor = () => true

export default function SoloHastaFinBF({ children }: { children: ReactNode }) {
  const vigente = useSyncExternalStore(sinSuscripcion, vigenteAhora, vigenteServidor)
  return vigente ? children : null
}
