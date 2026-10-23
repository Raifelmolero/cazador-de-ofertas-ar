"""Mensaje diario del canal de WhatsApp (bot/tools/mensaje_whatsapp.py)."""
import json
import sys
from datetime import date, datetime, timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))

import mensaje_whatsapp as mw  # noqa: E402

HOY = date(2026, 10, 23)


def _serie(precios):
    """Serie diaria que termina ayer (hoy no cuenta como historial)."""
    n = len(precios)
    return [[(HOY - timedelta(days=n - i)).isoformat(), p] for i, p in enumerate(precios)]


def _id(i):
    return f"MLA{1000000 + i}"


def _item(i, titulo, precio, comision=0.1):
    return {"id_ml": _id(i), "titulo": titulo, "precio_actual": precio,
            "comision_clasica_pct": comision,
            "url_producto": f"https://www.mercadolibre.com.ar/x/p/{_id(i)}?matt_word=web&matt_tool=37267219"}


# ------------------------------------------------------------ links

def test_reemplaza_matt_word_existente():
    url = "https://www.mercadolibre.com.ar/x/p/MLA1?matt_word=web&matt_tool=37267219"
    out = mw.link_whatsapp(url)
    assert out == "https://www.mercadolibre.com.ar/x/p/MLA1?matt_word=whatsapp&matt_tool=37267219"
    assert out.count("matt_word") == 1


def test_agrega_matt_si_no_hay_y_conserva_otros_params():
    out = mw.link_whatsapp("https://articulo.mercadolibre.com.ar/MLA-1-x?pdp_filters=a#frag")
    assert out.endswith("?pdp_filters=a&matt_word=whatsapp&matt_tool=37267219")
    assert "#" not in out


def test_precio_y_nombre_corto():
    assert mw.fmt_precio(2299999.0) == "$2.299.999"
    assert mw.nombre_corto("Apple iPhone 17 (256 GB) - Blanco - Distribuidor Autorizado") == "Apple iPhone 17 256 GB"
    assert len(mw.nombre_corto("palabra " * 30)) <= 48


# ------------------------------------------------------------ selección

def test_descuento_real_contra_historial_no_tachado():
    it = _item(1, "Smart TV Samsung 55 4K", 400_000)
    it["precio_anterior"] = 1_000_000  # tachado inflado: no se usa
    c = mw.evaluar(it, {"serie": _serie([500_000] * 5)}, HOY, set())
    assert c["pct"] == 20 and c["ticket_alto"] and c["categoria"] == "tv"


def test_filtra_sin_historial_usados_infladas_y_sin_baja():
    seg = {"serie": _serie([500_000] * 5)}
    assert mw.evaluar(_item(1, "Celular Moto G15", 400_000), None, HOY, set()) is None
    assert mw.evaluar(_item(2, "Celular Moto G15", 400_000), {"serie": _serie([500_000] * 2)}, HOY, set()) is None
    assert mw.evaluar(_item(3, "iPhone 15 Reacondicionado", 400_000), seg, HOY, set()) is None
    assert mw.evaluar(_item(4, "Notebook Usada Lenovo", 400_000), seg, HOY, set()) is None
    assert mw.evaluar(_item(5, "Celular Moto G15", 400_000), seg, HOY, {_id(5)}) is None
    # Precio plano: está "en su mínimo" pero no bajó nada -> no es oferta.
    assert mw.evaluar(_item(6, "Celular Moto G15", 500_000), seg, HOY, set()) is None
    # En su mínimo con baja chica (8 %): entra.
    c = mw.evaluar(_item(7, "Celular Moto G15", 460_000), seg, HOY, set())
    assert c and c["en_minimo"] and c["pct"] == 8


def _cands():
    seg = {"serie": _serie([1_000_000] * 6)}
    items = [
        _item(1, "Celular Samsung Galaxy A55", 900_000),
        _item(2, "Celular Motorola Edge 50", 880_000),
        _item(3, "Celular Xiaomi Redmi Note 14", 870_000),
        _item(4, "Notebook Lenovo Ideapad", 860_000),
        _item(5, "Smart TV Noblex 50 4K", 890_000),
        _item(6, "Heladera No Frost Drean", 850_000),
    ] + [_item(10 + i, f"Auriculares Modelo{i} Bluetooth", 50_000 + i) for i in range(3)] \
      + [_item(20 + i, f"Taladro Marca{i} Inalámbrico", 60_000) for i in range(3)] \
      + [_item(30 + i, f"Freidora de aire Marca{i}", 70_000) for i in range(3)]
    segs = {it["id_ml"]: seg for it in items}
    for i in range(3):  # baratos: historial a su escala, descuento real 22-44 %
        for base in (10, 20, 30):
            segs[_id(base + i)] = {"serie": _serie([90_000] * 6)}
    return mw.candidatos(items, segs, HOY)


def test_elige_10_con_ticket_alto_y_max_2_por_categoria():
    sel = mw.elegir(_cands(), n=10)
    assert len(sel) == 10
    assert sum(c["ticket_alto"] for c in sel) >= 3
    cats = [c["categoria"] for c in sel]
    assert all(cats.count(k) <= 2 for k in set(cats))


def test_no_repite_lo_del_dia_anterior(tmp_path):
    ayer = tmp_path / (HOY - timedelta(days=1)).isoformat()
    ayer.mkdir()
    (ayer / "whatsapp-canal.md").write_text(
        "📱 x\nhttps://www.mercadolibre.com.ar/x/p/MLA1000001?matt_word=whatsapp\n", encoding="utf-8")
    excluir = mw.ids_dia_anterior(tmp_path, HOY)
    assert excluir == {_id(1)}
    assert _id(1) not in {c["id"] for c in mw.elegir(_cands(), excluir)}


# ------------------------------------------------------------ cupón y formato

CUPON = {"cupones": [{"codigo": "MODONUBE", "descuento": 8000, "minimo": 80000,
                      "hasta": "2026-10-23T23:59:00-03:00"}]}


def test_cupon_vigente_y_vencido():
    antes = datetime.fromisoformat("2026-10-23T10:00:00-03:00")
    despues = datetime.fromisoformat("2026-10-24T00:30:00-03:00")
    assert mw.cupon_vigente(CUPON, antes)["codigo"] == "MODONUBE"
    assert mw.cupon_vigente(CUPON, despues) is None


def test_formato_del_mensaje():
    sel = mw.elegir(_cands(), n=10)
    cupon = CUPON["cupones"][0]
    txt = mw.armar_mensaje(sel, HOY, cupon, total_ofertas=2333)
    lineas = txt.splitlines()
    assert lineas[0] == "🔥 *OFERTAS DE HOY EN MERCADO LIBRE* (23/10)"
    assert "`MODONUBE`" in txt and "$8.000 OFF" in txt and "$80.000" in txt and "23:59" in txt
    assert txt.index("MODONUBE") < txt.index("mercadolibre")  # cupón arriba
    assert "*Más del 20 % OFF real* 👇" in txt and "*También hoy*" in txt
    assert "Más de 2.300 ofertas" in txt
    assert "https://cazadordeofertas.com.ar/?utm_source=whatsapp" in txt
    assert lineas[-1] == "_Precios y stock pueden cambiar en el día._"
    links = [l for l in lineas if "mercadolibre.com.ar" in l]
    assert len(links) == 10 and all("matt_word=whatsapp&matt_tool=37267219" in l for l in links)
    assert "matt_word=web" not in txt
    assert len(txt) < 3500  # corto para WhatsApp


def test_seccion_50_cuando_hay():
    c = mw.evaluar(_item(1, "Colchón 2 plazas", 200_000), {"serie": _serie([500_000] * 5)}, HOY, set())
    txt = mw.armar_mensaje([c], HOY)
    assert "*Más del 50 % OFF* 👇" in txt and "*60 % OFF*" in txt


def test_main_escribe_archivo(tmp_path):
    datos = tmp_path / "data"
    datos.mkdir()
    items = [_item(i, f"Celular Samsung Galaxy A{i}", 400_000) for i in range(1, 11)]
    (datos / "productos_rentables.json").write_text(json.dumps({"items": items}), encoding="utf-8")
    (datos / "seguimiento.json").write_text(json.dumps(
        {"items": {it["id_ml"]: {"serie": _serie([500_000] * 5)} for it in items}}), encoding="utf-8")
    (datos / "cupones-del-dia.json").write_text(json.dumps(CUPON), encoding="utf-8")
    salida = tmp_path / "out" / HOY.isoformat()
    assert mw.main(["--carpeta", str(salida), "--datos", str(datos), "--fecha", HOY.isoformat()]) == 0
    txt = (salida / "whatsapp-canal.md").read_text(encoding="utf-8")
    assert txt.startswith("🔥 *OFERTAS DE HOY")
