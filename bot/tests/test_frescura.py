"""Frescura de las ofertas manuales: fecha visible, poda de vencidas y web sin exclusivas."""
import json
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import cazador_bot as bot


def deal(id_, agregada="2026-10-14", **kw):
    d = {"id": id_, "title": f"Producto {id_}", "url": f"https://www.mercadolibre.com.ar/p/{id_}",
         "price_prev": 100000, "price_cur": 60000, "discount": 40, "img": None, "manual": True,
         "agregada": agregada, "relampago": False, "inflada": False}
    d.update(kw)
    return d


def escribir(bot_mod, monkeypatch, tmp_path, deals, exclusivas=None, previo=None):
    ruta = tmp_path / "site.json"
    if previo is not None:
        ruta.write_text(json.dumps({"metadata": {"scraped_at": "2026-10-13T05:00:00+00:00"}, "items": previo}), encoding="utf-8")
    monkeypatch.setattr(bot_mod, "SITE_DATA_PATH", ruta)
    bot_mod.write_site_data(deals, "", exclusivas, {}, mezclar=previo is not None)
    return json.loads(ruta.read_text(encoding="utf-8"))["items"]


def test_manual_vencida_solo_pasados_los_dias():
    hoy = date(2026, 10, 21)
    assert not bot.manual_vencida({"precio_visto": "2026-10-07"}, hoy)   # 14 días: todavía vale
    assert bot.manual_vencida({"precio_visto": "2026-10-06"}, hoy)       # 15 días: vencida
    assert not bot.manual_vencida({}, hoy)                               # del escaneo viejo: no se poda
    assert not bot.manual_vencida({"precio_visto": "basura"}, hoy)


def test_el_item_del_sitio_lleva_la_fecha_de_carga(monkeypatch, tmp_path):
    items = escribir(bot, monkeypatch, tmp_path, [deal("A"), deal("B", agregada=None)])
    por_id = {i["id_ml"]: i for i in items}
    assert por_id["A"]["precio_visto"] == "2026-10-14"
    assert "precio_visto" not in por_id["B"]


def test_mezclar_poda_manuales_vencidas_y_conserva_las_viejas_sin_fecha(monkeypatch, tmp_path):
    hoy = bot.datetime.now(bot.timezone.utc).date()
    vieja = (hoy - bot.timedelta(days=bot.MANUAL_MAX_DIAS + 1)).isoformat()
    previo = [
        {"id_ml": "VENCIDA", "precio_visto": vieja},
        {"id_ml": "ESCANEO"},   # sin fecha: se conserva
        {"id_ml": "VIGENTE", "precio_visto": hoy.isoformat()},
    ]
    items = escribir(bot, monkeypatch, tmp_path, [deal("NUEVA", agregada=hoy.isoformat())], previo=previo)
    assert {i["id_ml"] for i in items} == {"NUEVA", "ESCANEO", "VIGENTE"}


def test_exclusiva_oculta_en_la_web_solo_si_se_pasa(monkeypatch, tmp_path):
    assert escribir(bot, monkeypatch, tmp_path, [deal("A")], exclusivas={"A"}) == []
    assert [i["id_ml"] for i in escribir(bot, monkeypatch, tmp_path, [deal("A")], exclusivas=set())] == ["A"]


def test_gancho_de_ig_no_promete_urgencia_falsa():
    assert not any("NO DURA" in h for h in bot.IG_HOOKS)
