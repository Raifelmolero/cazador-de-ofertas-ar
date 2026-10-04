import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import cierre_reel as cr  # noqa: E402


def test_precio_ida_y_vuelta():
    assert cr.formatear_precio(1234567) == "$ 1.234.567"
    assert cr.parsear_precio("$ 1.234.567") == 1234567
    assert cr.parsear_precio("1.234.567,50") == 1234567
    assert cr.parsear_precio(99.6) == 100


def test_hogar_electro_excluye_accesorios():
    assert cr.es_hogar_electro("Heladera No Frost 400 L")
    assert not cr.es_hogar_electro("Filtro para heladera")
    assert not cr.es_hogar_electro("Zapatillas running")


def _item(id_ml, titulo, precio, antes, minimo=False, prioridad=0):
    return {"id_ml": id_ml, "titulo": titulo, "precio_actual": precio, "precio_anterior": antes,
            "descuento_pct": round(100 * (1 - precio / antes)), "url_imagen": "x.jpg",
            "minimo_historico": minimo, "prioridad": prioridad}


def test_elegir_producto_prioriza_minimo_historico():
    items = [
        _item("A", "Smart TV 55", 900_000, 1_500_000, prioridad=9),
        _item("B", "Heladera No Frost", 800_000, 1_100_000, minimo=True),
        _item("C", "Freidora de aire", 90_000, 200_000, minimo=True),   # ticket bajo
        _item("D", "Zapatillas", 300_000, 600_000, minimo=True),        # no es hogar
    ]
    assert cr.elegir_producto(items)["id"] == "B"
    assert cr.elegir_producto(items, buscar="smart tv")["id"] == "A"
    assert cr.elegir_producto(items, buscar="lavarropas") is None


def test_partir_lineas_parejas():
    lineas = cr.partir_lineas("uno dos tres cuatro", len, 12)
    assert lineas == ["uno dos", "tres cuatro"]


def test_segmentar_saca_lo_que_no_se_dibuja():
    tramos = cr.segmentar("hola 👀 ✖ chau", lambda c: c.isascii(), lambda c: c == "👀")
    assert tramos == [("hola ", False), ("👀", True), (" chau", False)]
