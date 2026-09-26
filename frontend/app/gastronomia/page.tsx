import NichoHub, { nichoMetadata } from '@/components/NichoHub'
import { getNicho } from '@/lib/nichos'

const nicho = getNicho('gastronomia')!

export const metadata = nichoMetadata(nicho)

export default function GastronomiaPage() {
  return <NichoHub nicho={nicho} />
}
