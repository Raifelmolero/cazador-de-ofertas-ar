'use client'

import { useEffect } from 'react'

/** Los links a /#verificador (cupones, guías, temporadas) caen en un bloque
 *  oculto en celular: ahí el verificador vive más abajo, en #verificador-movil. */
export default function AnclaVerificador() {
  useEffect(() => {
    if (window.location.hash !== '#verificador') return
    if (!window.matchMedia('(max-width: 639px)').matches) return
    const destino = document.getElementById('verificador-movil')
    if (!destino) return
    history.replaceState(null, '', '#verificador-movil')
    destino.scrollIntoView()
  }, [])

  return null
}
