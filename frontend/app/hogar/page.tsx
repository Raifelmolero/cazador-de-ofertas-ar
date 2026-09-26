import NichoHub, { nichoMetadata } from '@/components/NichoHub'
import { getNicho } from '@/lib/nichos'

const nicho = getNicho('hogar')!

export const metadata = nichoMetadata(nicho)

export default function HogarPage() {
  return <NichoHub nicho={nicho} />
}
