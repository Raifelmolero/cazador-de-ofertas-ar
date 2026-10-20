import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "tools"))
import lote_navegador as ln  # noqa: E402

HOY = date(2026, 10, 20)


def linea(path, titulo="Lavarropas Drean 8kg", cur=400000, prev=600000, img="123-MLA456_102026"):
    return f"W{path}§{titulo}§{cur}§{prev}§{img}"


def test_arma_url_titulo_e_imagen():
    lote, desc = ln.armar([linea("/lavarropas/p/MLA111")], {}, {}, HOY)
    assert lote == ["https://www.mercadolibre.com.ar/lavarropas/p/MLA111 | Lavarropas Drean 8kg | 400000 | 600000 | "
                    "https://http2.mlstatic.com/D_NQ_NP_2X_123-MLA456_102026-F.webp"]
    assert desc == {}


def test_descarta_infladas_excluidas_y_recientes_pero_refresca_viejas():
    lineas = [
        linea("/a/p/MLA10000001"),                                      # vigente de ayer → ya cargada
        linea("/b/p/MLA10000002"),                                      # vigente de hace 6 días → se refresca
        linea("/c/p/MLA10000003", titulo="Aire Acondicionado Split"),   # rubro excluido
        linea("/d/p/MLA10000004"),                                      # historial la vio más barata → inflada
        linea("/e/p/MLA10000005", cur=590000),                          # menos de 20 % OFF
        "basura",
    ]
    vig = {"MLA10000001": "2026-10-19", "MLA10000002": "2026-10-14"}
    hist = {"MLA10000004": {"min": 300000}}
    lote, desc = ln.armar(lineas, vig, hist, HOY)
    assert [l.split(" | ")[0].rsplit("/", 1)[1] for l in lote] == ["MLA10000002"]
    assert desc == {"ya cargada": 1, "rubro excluido": 1, "historial: inflada": 1,
                    "descuento fuera de rango": 1, "formato": 1}


def test_ordena_por_precio_y_acepta_links_de_articulo():
    lineas = ["A/MLA-619144275-estufa-_JM§Estufa§100000§200000§", linea("/x/p/MLA10000009", cur=900000, prev=1200000)]
    lote, _ = ln.armar(lineas, {}, {}, HOY)
    assert lote[0].startswith("https://www.mercadolibre.com.ar/x/p/MLA10000009")
    assert lote[1].startswith("https://articulo.mercadolibre.com.ar/MLA-619144275") and lote[1].endswith("200000")
