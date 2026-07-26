// ESLint 9 usa "flat config" y Next 16 sacó `next lint`: la config vive acá y
// el script de package.json llama a eslint directo. eslint-config-next 16 ya
// exporta flat config, así que se spreadea tal cual.
import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

const config = [
  { ignores: ['.next/**', 'out/**', 'node_modules/**', 'next-env.d.ts'] },
  ...coreWebVitals,
  ...typescript,
]

export default config
