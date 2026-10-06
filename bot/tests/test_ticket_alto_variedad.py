"""Ranking de ticket alto, variedad de categoría en IG y captions con gancho."""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import cazador_bot as bot  # noqa: E402


def deal(title, price=200_000, **kw):
    return {"id": title, "title": title, "price_cur": price,
            "price_prev": price * 2, "discount": 50, **kw}


def test_colchon_y_herramienta_suben_contra_mismo_precio_sin_plus():
    base = bot.ganancia_esperada(deal("Colchon Piero 2 plazas"))
    sin = bot.ganancia_esperada(deal("Colchon Piero 2 plazas")) / bot.categoria_plus("Colchon Piero")
    assert base > sin
    assert bot.categoria_plus("Taladro percutor Bosch") == 1.25
    assert bot.categoria_plus("Sommier 2 plazas") == 1.25
    assert bot.categoria_plus("Aire acondicionado split inverter") == 1.15
    assert bot.categoria_plus("Heladera No Frost") == 1.15
    assert bot.categoria_plus("Parlante bluetooth") == 1.0


def test_colchon_15pct_supera_a_heladera_de_mismo_precio():
    assert bot.ganancia_esperada(deal("Colchon resortes 2 plazas", 500_000)) > \
        bot.ganancia_esperada(deal("Heladera No Frost 400L", 500_000))


def _log(tmp_path, titulos, ch="ig"):
    p = tmp_path / "posts_log.jsonl"
    p.write_text("\n".join(
        json.dumps({"ts": "2026-10-04T10:00:00+00:00", "ch": ch, "title": t}) for t in titulos
    ), encoding="utf-8")
    return p


def test_categorias_recientes_solo_ig_y_reel(tmp_path):
    p = tmp_path / "l.jsonl"
    filas = [("telegram", "Colchon A"), ("ig", "Taladro B"), ("reel", "Sommier C"), ("threads", "Aire acondicionado")]
    p.write_text("\n".join(json.dumps({"ts": "x", "ch": c, "title": t}) for c, t in filas), encoding="utf-8")
    assert bot.categorias_recientes_ig(path=p) == [bot.categoria_clave("Taladro B"), bot.categoria_clave("Sommier C")]


def test_estrella_no_repite_categoria_mas_de_dos_en_seis(tmp_path):
    p = _log(tmp_path, ["Colchon A", "Taladro X", "Colchon B", "Parlante"])
    rec = bot.categorias_recientes_ig(path=p)
    lote = [deal("Colchon Nuevo"), deal("Heladera No Frost"), deal("Taladro Dos")]
    # colchon y sommier son la misma familia (2 colchones ya en la ventana) -> salta
    out = bot.elegir_estrella(lote, rec)
    assert out[0]["title"] == "Heladera No Frost"
    assert sorted(d["title"] for d in out) == sorted(d["title"] for d in lote)


def test_estrella_mantiene_orden_si_no_hay_saturacion():
    lote = [deal("Colchon Nuevo"), deal("Heladera")]
    assert bot.elegir_estrella(lote, [])[0]["title"] == "Colchon Nuevo"


def test_estrella_todas_saturadas_no_rompe():
    rec = [bot.categoria_clave("Colchon")] * 2
    lote = [deal("Colchon uno"), deal("Sommier dos")]
    assert bot.elegir_estrella(lote, rec) == lote


def test_producto_sin_familia_nunca_se_limita():
    assert bot.categoria_clave("Parlante bluetooth") is None
    assert bot.elegir_estrella([deal("Parlante bluetooth")], [None, None, None])[0]["title"] == "Parlante bluetooth"


def test_ig_primera_linea_lleva_porcentaje_y_precio():
    d = deal("Colchon Piero 2 plazas", 300_000)
    d["price_prev"], d["discount"] = 600_000, 50
    primera = bot.ig_caption(d).splitlines()[0]
    assert "50% OFF" in primera and bot.fmt_price(300_000) in primera


def test_ig_link_de_bio_antes_que_telegram_y_sin_arroba():
    cap = bot.ig_caption(deal("Colchon Piero"))
    assert cap.index("cazadordeofertas.com.ar/ig") < cap.index("t.me/")
    assert "@" not in cap


def test_threads_primera_linea_lleva_porcentaje_y_precio_y_cabe():
    d = deal("Taladro Percutor", 90_000)
    cap = bot.th_caption(d, "https://cazadordeofertas.com.ar/x")
    primera = cap.splitlines()[0]
    assert "50% OFF" in primera and bot.fmt_price(90_000) in primera
    assert len(cap) <= 500
