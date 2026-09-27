import NichoHub, { nichoMetadata } from '@/components/NichoHub'
import { getNicho } from '@/lib/nichos'

const nicho = getNicho('gamer')!

export const metadata = nichoMetadata(nicho)

export default function GamerPage() {
  return <NichoHub nicho={nicho} />
}
