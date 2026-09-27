import NichoHub, { nichoMetadata } from '@/components/NichoHub'
import { getNicho } from '@/lib/nichos'

const nicho = getNicho('bebes-y-jugueteria')!

export const metadata = nichoMetadata(nicho)

export default function BebesPage() {
  return <NichoHub nicho={nicho} />
}
