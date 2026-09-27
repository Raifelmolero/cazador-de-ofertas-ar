import NichoHub, { nichoMetadata } from '@/components/NichoHub'
import { getNicho } from '@/lib/nichos'

const nicho = getNicho('pequenos-electrodomesticos')!

export const metadata = nichoMetadata(nicho)

export default function PequenosElectrodomesticosPage() {
  return <NichoHub nicho={nicho} />
}
