import Link from 'next/link'
import NichoHub, { nichoMetadata } from '@/components/NichoHub'
import { getNicho } from '@/lib/nichos'
import LinksTecno from '@/components/LinksTecno'

const nicho = getNicho('tecno')!

export const metadata = nichoMetadata(nicho)

// El bloque de links del Cyber Monday se sacó: esas URLs redirigen al Black Friday (BF-1).
export default function TecnoPage() {
  return <NichoHub nicho={nicho} extra={<LinksTecno className="mb-10" />} />
}
