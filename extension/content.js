// Panel del Cazador en la página de producto de Mercado Libre.
// Regla de oro: NUNCA agrega ni reemplaza el link de afiliado solo. Solo si la
// persona toca "Comprar con Cazador" se abre el producto con nuestra etiqueta.
;(function () {
  const ids = [...location.href.matchAll(/MLA-?(\d{6,13})/gi)].map(m => 'MLA' + m[1])
  if (!ids.length || document.getElementById('cazador-panel')) return

  const pesos = n => '$' + Math.round(n).toLocaleString('es-AR')
  const fecha = s => s.split('-').reverse().join('/')

  function precioDePagina() {
    const meta = document.querySelector('meta[itemprop="price"]')
    if (meta?.content) return Number(meta.content)
    const f = document.querySelector('.ui-pdp-price__second-line .andes-money-amount__fraction')
    return f ? Number(f.textContent.replace(/\D/g, '')) : 0
  }

  function veredicto(fila, precio) {
    const [min, minTs, desde, last, lastTs] = fila
    const p = precio || last
    const hist = `Lo seguimos desde el ${fecha(desde)}. Mínimo registrado: ${pesos(min)} (${fecha(minTs)}).`
    if (min < p * 0.95)
      return { sello: 'INFLADO', color: '#f87171', titulo: `Ya estuvo ${Math.round((1 - min / p) * 100)}% más barato`, hist }
    if (p <= min * 1.01) return { sello: 'CAZADO', color: '#34d399', titulo: 'Es el precio más bajo que registramos', hist }
    return { sello: 'NORMAL', color: '#facc15', titulo: 'Precio normal: ni inflado ni mínimo', hist }
  }

  function comprarConCazador() {
    const u = new URL(location.href)
    u.searchParams.set('matt_word', 'web')
    u.searchParams.set('matt_tool', '37267219')
    location.href = u.toString()
  }

  function pintar(v, slug) {
    const host = document.createElement('div')
    host.id = 'cazador-panel'
    const root = host.attachShadow({ mode: 'closed' })
    root.innerHTML = `
      <style>
        .c{position:fixed;right:16px;bottom:16px;z-index:2147483647;width:300px;font:14px/1.45 system-ui,sans-serif;
          background:#18181b;color:#e4e4e7;border:1px solid #3f3f46;border-radius:14px;padding:14px 16px;box-shadow:0 12px 32px rgba(0,0,0,.35);
          transition:opacity .2s cubic-bezier(.23,1,.32,1),transform .2s cubic-bezier(.23,1,.32,1)}
        @starting-style{.c{opacity:0;transform:translateY(8px)}}
        .top{display:flex;justify-content:space-between;align-items:center;font-size:12px;color:#a1a1aa}
        .x{background:none;border:0;color:#a1a1aa;font-size:18px;cursor:pointer;line-height:1}
        .s{display:inline-block;margin-top:8px;border:2px solid;border-radius:5px;padding:1px 6px;font-weight:900;letter-spacing:.12em;transform:rotate(-4deg)}
        h3{margin:6px 0 4px;font-size:16px;color:#fafafa}
        p{margin:0;color:#a1a1aa;font-size:13px}
        a{color:#facc15}
        button.b{margin-top:12px;width:100%;background:#facc15;color:#000;border:0;border-radius:10px;padding:10px;font-weight:800;cursor:pointer;transition:transform .15s ease-out}
        button.b:active{transform:scale(.97)}
        small{display:block;margin-top:6px;font-size:11px;color:#71717a}
      </style>
      <div class="c" role="complementary" aria-label="Cazador de Ofertas">
        <div class="top"><span>🎯 Cazador de Ofertas</span><button class="x" aria-label="Cerrar">×</button></div>
        ${v.sello ? `<span class="s" style="color:${v.color};border-color:${v.color}">${v.sello}</span>` : ''}
        <h3>${v.titulo}</h3>
        <p>${v.hist}${slug ? ` <a href="https://cazadordeofertas.com.ar/precio/${slug}" target="_blank" rel="noopener">Ver historial</a>` : ''}</p>
        <button class="b">Comprar con Cazador</button>
        <small>Opcional: nos apoya con una comisión de afiliado y a vos te cuesta lo mismo.</small>
      </div>`
    root.querySelector('.x').onclick = () => host.remove()
    root.querySelector('.b').onclick = comprarConCazador
    document.body.appendChild(host)
  }

  chrome.runtime.sendMessage({ tipo: 'consulta', ids }, r => {
    if (!r?.ok) return
    if (!r.fila) {
      pintar({ titulo: 'Todavía no seguimos este producto', hist: 'Registramos los que pasan por las ofertas de ML desde julio.' }, '')
      return
    }
    pintar(veredicto(r.fila, precioDePagina()), r.fila[5])
  })
})()
