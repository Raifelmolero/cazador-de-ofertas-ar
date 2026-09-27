import NichoHub, { nichoMetadata } from '@/components/NichoHub'
import { getNicho } from '@/lib/nichos'

const nicho = getNicho('vehiculos')!

export const metadata = nichoMetadata(nicho)

export default function VehiculosPage() {
  return <NichoHub nicho={nicho} />
}
