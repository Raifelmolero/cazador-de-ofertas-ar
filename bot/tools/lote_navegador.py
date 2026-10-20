"""Arma lotes para «Agregar oferta manual» con lo que se juntó mirando
mercadolibre.com.ar/ofertas en el navegador de Raifel (19/10/2026).

ML (Agustina, Afiliados) autorizó que un asistente de IA lea ofertas desde el
navegador del dueño, con su sesión y a ritmo de persona. NO es para correr desde
servidores ni Actions: el bot sigue con scrape_ml=false.

Cómo se usa (lo hace Claude con Claude in Chrome):
1. En la pestaña de ML, guardar el extractor EXTRACTOR_JS en localStorage y
   recorrer /ofertas?category=<id>&price=50000-*&page=N (esperando unos segundos
   entre páginas) ejecutando `eval(localStorage.getItem('__cz_ext'))` en cada una.
   Cada producto queda como «W/ruta§título§actual§tachado§código-de-foto».
2. Volcar todo a un <textarea>, Ctrl+C, y en PowerShell `Get-Clipboard -Raw` a un
   archivo (las herramientas del navegador cortan a ~50.000 caracteres).
3. python bot/tools/lote_navegador.py <archivo> <carpeta_salida>
   → lote_N.json listos para: gh workflow run oferta_manual.yml --json < lote_N.json
   (por stdin: Windows no acepta argumentos de más de 32 KB). De a uno: el
   workflow comparte grupo de concurrencia con el bot.

Categorías útiles (ids de ML): Electrodomésticos MLA5726, Computación MLA1648,
Celulares MLA1051, Electrónica MLA1000, Herramientas MLA407134, Hogar MLA1574,
Deportes MLA1276, Belleza MLA1246, Bebés MLA1384, Juguetes MLA1132, Salud MLA409431.
"""
from __future__ import annotations

import json
import re
import sys
from datetime import date, datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import oferta_manual as om  # noqa: E402

BASE = Path(__file__).resolve().parent.parent

EXTRACTOR_JS = r"""(function(){const out=[];document.querySelectorAll('.poly-card').forEach(c=>{const a=c.querySelector('.poly-component__title a, a.poly-component__title')||c.querySelector('a');let link='';try{const u=new URL(a.href);link=(u.host.startsWith('articulo')?'A':'W')+u.pathname}catch(e){}const t=((c.querySelector('.poly-component__title')||a).textContent||'').trim().replace(/§/g,' ');const num=el=>el?parseInt((el.querySelector('.andes-money-amount__fraction')||el).textContent.replace(/\D/g,'')):0;const cur=num(c.querySelector('.poly-price__current .andes-money-amount'));const prev=num(c.querySelector('s.andes-money-amount--previous, .andes-money-amount--previous'));const img=c.querySelector('img');const s=img&&(img.getAttribute('data-src')||img.src)||'';const m=s.match(/_(\d+-ML[A-Z]\d+_\d+)/);if(link&&prev&&cur&&(prev-cur)/prev>=0.2)out.push([link,t,cur,prev,m?m[1]:''].join('§'))});const acc=JSON.parse(localStorage.getItem('__cz_acc')||'{}');out.forEach(l=>acc[l.split('§')[0]]=l);localStorage.setItem('__cz_acc',JSON.stringify(acc));return out.length+' nuevas-pag / acc '+Object.keys(acc).length})()"""

# Clima frío (feedback de Raifel): nada de aires/verano; tampoco industrial ni repuestos.
FUERA = re.compile(r"aire acondicionado|aire acond|\bsplit\b|ventilador|pileta|piscina|industrial|"
                   r"gastron|exhibidor|comercial|neum[aá]tico|repuesto|cartucho", re.I)
REFRESCAR_DESDE_DIAS = 5   # una vigente cargada hace 5+ días se vuelve a cargar con el precio de hoy
POR_LOTE = 120


def armar(lineas: list[str], vigentes: dict[str, str], historial: dict,
          hoy: date | None = None) -> tuple[list[str], dict[str, int]]:
    """Devuelve (líneas de lote ordenadas por precio, conteo de descartes)."""
    hoy = hoy or datetime.now(timezone.utc).date()
    lote, desc, vistos = [], {}, set()

    def descartar(motivo: str) -> None:
        desc[motivo] = desc.get(motivo, 0) + 1

    for l in lineas:
        p = l.strip().split("§")
        if len(p) != 5:
            descartar("formato")
            continue
        link, titulo, cur, prev, img = p
        host = "articulo.mercadolibre.com.ar" if link.startswith("A") else "www.mercadolibre.com.ar"
        url = f"https://{host}{link[1:]}"
        try:
            _, idm = om.limpiar_url(url)
            cur, prev = int(cur), int(prev)
        except (om.OfertaInvalida, ValueError):
            descartar("url/precio")
            continue
        if idm in vistos:
            continue
        if idm in vigentes and (hoy - date.fromisoformat(vigentes[idm])).days < REFRESCAR_DESDE_DIAS:
            descartar("ya cargada")
            continue
        if FUERA.search(titulo):
            descartar("rubro excluido")
            continue
        pct = round((prev - cur) / prev * 100)
        if pct < 20 or pct > om.DESCUENTO_MAX_PCT:
            descartar("descuento fuera de rango")
            continue
        h = historial.get(idm)
        if isinstance(h, dict) and isinstance(h.get("min"), (int, float)) and h["min"] < cur * 0.95:
            descartar("historial: inflada")
            continue
        vistos.add(idm)
        titulo = re.sub(r"\s+", " ", titulo.replace("|", "/").replace(";;", ";")).strip()[:140]
        imagen = f"https://http2.mlstatic.com/D_NQ_NP_2X_{img}-F.webp" if img else ""
        lote.append((cur, f"{url} | {titulo} | {cur} | {prev} | {imagen}".rstrip(" |")))
    lote.sort(key=lambda x: -x[0])  # ticket alto primero
    return [x[1] for x in lote], desc


def main() -> None:
    crudo, salida = Path(sys.argv[1]), Path(sys.argv[2])
    items = json.loads((BASE / "state/ofertas_manuales.json").read_text(encoding="utf-8"))["items"]
    vigentes = {i["id"]: i["agregada"] for i in items}
    historial = json.loads((BASE / "state/price_history.json").read_text(encoding="utf-8"))
    lineas, desc = armar(crudo.read_text(encoding="utf-8").splitlines(), vigentes, historial)
    if lineas:
        om.parsear_lote("\n".join(lineas))  # valida todo antes de mandar nada
    salida.mkdir(parents=True, exist_ok=True)
    partes = [lineas[i:i + POR_LOTE] for i in range(0, len(lineas), POR_LOTE)]
    for n, parte in enumerate(partes, 1):
        (salida / f"lote_{n}.json").write_text(json.dumps({"lote": " ;; ".join(parte)}), encoding="utf-8")
    print(f"{len(lineas)} para cargar en {len(partes)} lotes; descartadas: {desc}")


if __name__ == "__main__":
    main()
