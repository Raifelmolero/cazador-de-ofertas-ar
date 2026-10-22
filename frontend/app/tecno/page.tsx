import NichoHub, { nichoMetadata } from '@/components/NichoHub'
import { getNicho } from '@/lib/nichos'
import LinksTecno from '@/components/LinksTecno'

const nicho = getNicho('tecno')!

export const metadata = nichoMetadata(nicho)

export default function TecnoPage() {
  return <NichoHub nicho={nicho} extra={<LinksTecno className="mb-10" />} />
}
