import NichoHub, { nichoMetadata } from '@/components/NichoHub'
import { getNicho } from '@/lib/nichos'

const nicho = getNicho('tecno')!

export const metadata = nichoMetadata(nicho)

export default function TecnoPage() {
  return <NichoHub nicho={nicho} />
}
