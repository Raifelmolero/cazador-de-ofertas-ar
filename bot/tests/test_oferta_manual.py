"""Escaneo de ML pausado + carga manual de ofertas (ML no permite el scrapeo)."""
import json
import sys
from datetime import date, datetime, timezone
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))

import cazador_bot as bot
import oferta_manual as om

URL = "https://www.mercadolibre.com.ar/colchon-norden-signia-pillow-top-2-plazas/p/MLA12345678?pdp_filters=x&matt_word=zz#polycard"


def oferta(**kw):
    base = dict(url=URL, titulo="Colchón Norden Signia 2 plazas", actual="398.857", anterior="749.999", imagen="")
    base.update(kw)
    return om.armar_oferta(**base, hoy=datetime(2026, 10, 14, tzinfo=timezone.utc))


# ---------------------------------------------------------------- validación

def test_arma_la_oferta_y_limpia_el_link():
    o = oferta()
    assert o["id"] == "MLA12345678"
    assert o["url"] == "https://www.mercadolibre.com.ar/colchon-norden-signia-pillow-top-2-plazas/p/MLA12345678"
    assert (o["price_cur"], o["price_prev"], o["discount"]) == (398857, 749999, 47)
    assert o["img"] is None and o["agregada"] == "2026-10-14"


@pytest.mark.parametrize("texto,esperado", [("1.234.567", 1234567), ("$ 1234567", 1234567), ("1.234.567,00", 1234567), ("98765", 98765)])
def test_precios_en_distintos_formatos(texto, esperado):
    assert om.parsear_precio(texto, "x") == esperado


@pytest.mark.parametrize("texto", ["", "abc", "0", "-5"])
def test_precio_invalido(texto):
    with pytest.raises(om.OfertaInvalida):
        om.parsear_precio(texto, "Precio")


def test_rechaza_link_corto_de_afiliado():
    with pytest.raises(om.OfertaInvalida, match="meli.la"):
        oferta(url="https://meli.la/1AbCdEf")


@pytest.mark.parametrize("url", ["http://www.mercadolibre.com.ar/x/p/MLA12345678", "https://otro-sitio.com/MLA12345678", "https://mercadolibre.com.ar.malo.com/x"])
def test_rechaza_links_que_no_son_de_ml(url):
    with pytest.raises(om.OfertaInvalida):
        oferta(url=url)


def test_sin_descuento_real_no_es_oferta():
    with pytest.raises(om.OfertaInvalida, match="mayor"):
        oferta(actual="100000", anterior="100000")
    with pytest.raises(om.OfertaInvalida, match="mayor"):
        oferta(actual="120000", anterior="100000")


def test_id_estable_sin_codigo_mla():
    a = oferta(url="https://www.mercadolibre.com.ar/producto-raro-sin-codigo")
    b = oferta(url="https://www.mercadolibre.com.ar/producto-raro-sin-codigo?x=1")
    assert a["id"] == b["id"] and a["id"].startswith("M")


def test_imagen_solo_de_mlstatic():
    ok = "https://http2.mlstatic.com/D_Q_NP_2X_123-MLA1-F.webp"
    assert oferta(imagen=ok)["img"] == ok
    with pytest.raises(om.OfertaInvalida, match="imagen"):
        oferta(imagen="https://evil.example.com/x.png")


# ---------------------------------------------------------------- guardado y vencimiento

def test_guardar_reemplaza_por_id_y_descarta_vencidas(tmp_path):
    p = tmp_path / "m.json"
    vieja = dict(oferta(), id="MLA1", agregada="2026-09-01")
    p.write_text(json.dumps({"items": [vieja]}), encoding="utf-8")
    om.guardar(oferta(), p)
    n = om.guardar(oferta(actual="350000"), p)  # mismo id: reemplaza
    items = json.loads(p.read_text(encoding="utf-8"))["items"]
    assert n == 1 and len(items) == 1 and items[0]["price_cur"] == 350000


def test_load_manual_deals_ignora_vencidas_y_rotas(tmp_path):
    p = tmp_path / "m.json"
    vigente = oferta()
    vencida = dict(oferta(), id="MLA2", agregada="2026-10-01")
    rota = {"id": "MLA3"}
    p.write_text(json.dumps({"items": [vigente, vencida, rota]}), encoding="utf-8")
    deals = bot.load_manual_deals(p, hoy=date(2026, 10, 14))
    assert [d["id"] for d in deals] == ["MLA12345678"]
    assert deals[0]["manual"] is True and deals[0]["discount"] == 47


def test_load_manual_deals_sin_archivo(tmp_path):
    assert bot.load_manual_deals(tmp_path / "no_existe.json") == []


# ---------------------------------------------------------------- escaneo pausado

def test_pausado_no_hace_ningun_pedido_a_ml(monkeypatch, tmp_path):
    def prohibido(*a, **k):
        raise AssertionError("con scrape=False no puede haber pedidos a ML")
    monkeypatch.setattr(bot, "http_get", prohibido)
    monkeypatch.setattr(bot.ml_api, "fetch_deals_api", prohibido)
    monkeypatch.setattr(bot, "MANUAL_PATH", tmp_path / "vacio.json")
    assert bot.fetch_deals(pages=20, relampago_pages=6, categoria_pages=3, scrape=False) == []


def test_config_viene_con_el_escaneo_pausado():
    cfg = json.loads((Path(__file__).resolve().parents[1] / "config.json").read_text(encoding="utf-8"))
    assert cfg["scrape_ml"] is False


# ---------------------------------------------------------------- qué se publica

def test_manual_salta_los_minimos_pero_no_las_infladas_ni_repetidas():
    cfg = {"min_discount": 25, "min_price": 40000}
    chica = {"id": "A", "discount": 10, "price_cur": 20000, "inflada": False}
    assert not bot.es_candidata(chica, cfg, set())              # escaneada: no cumple mínimos
    assert bot.es_candidata({**chica, "manual": True}, cfg, set())   # manual: la eligió el dueño
    assert not bot.es_candidata({**chica, "manual": True, "inflada": True}, cfg, set())
    assert not bot.es_candidata({**chica, "manual": True}, cfg, {"A"})


# ---------------------------------------------------------------- el sitio no se achica

def _deal(**kw):
    d = bot.load_manual_deals  # solo para tener el nombre a mano
    base = {"id": "MLA777", "title": "Heladera Nueva No Frost 400 litros", "url": "https://www.mercadolibre.com.ar/x/p/MLA777",
            "price_prev": 900000, "price_cur": 700000, "discount": 22, "img": None, "relampago": False,
            "manual": True, "hist_low": False, "inflada": False}
    base.update(kw)
    return base


def test_con_escaneo_pausado_las_manuales_se_suman_al_catalogo(monkeypatch, tmp_path):
    site = tmp_path / "productos.json"
    site.write_text(json.dumps({"metadata": {"scraped_at": "2026-10-13T05:18:57+00:00", "total_items": 2},
                                "items": [{"id_ml": "MLA1", "titulo": "Viejo 1"}, {"id_ml": "MLA777", "titulo": "Viejo repetido"}]}),
                    encoding="utf-8")
    monkeypatch.setattr(bot, "SITE_DATA_PATH", site)
    bot.write_site_data([_deal()], "afi", mezclar=True)
    d = json.loads(site.read_text(encoding="utf-8"))
    assert [i["id_ml"] for i in d["items"]] == ["MLA777", "MLA1"]          # nueva primero, sin duplicar
    assert d["items"][0]["titulo"].startswith("Heladera")
    assert d["metadata"]["scraped_at"] == "2026-10-13T05:18:57+00:00"      # la fecha NO se refresca: el cartel dice la verdad
    assert d["metadata"]["total_items"] == 2


def test_sin_mezclar_el_catalogo_se_reemplaza_como_siempre(monkeypatch, tmp_path):
    site = tmp_path / "productos.json"
    site.write_text(json.dumps({"metadata": {"scraped_at": "2026-10-13T05:18:57+00:00"}, "items": [{"id_ml": "MLA1"}]}), encoding="utf-8")
    monkeypatch.setattr(bot, "SITE_DATA_PATH", site)
    bot.write_site_data([_deal()], "afi")
    d = json.loads(site.read_text(encoding="utf-8"))
    assert [i["id_ml"] for i in d["items"]] == ["MLA777"]
    assert d["metadata"]["scraped_at"] != "2026-10-13T05:18:57+00:00"


def test_mezclar_sin_catalogo_previo_no_falla(monkeypatch, tmp_path):
    monkeypatch.setattr(bot, "SITE_DATA_PATH", tmp_path / "no_existe.json")
    bot.write_site_data([_deal()], "afi", mezclar=True)
    assert json.loads((tmp_path / "no_existe.json").read_text(encoding="utf-8"))["metadata"]["total_items"] == 1


def test_mensaje_de_pesos_sin_comas_sueltas():
    assert om.pesos(1234567) == "$1.234.567"
    with pytest.raises(om.OfertaInvalida) as e:
        oferta(actual="120000", anterior="100000")
    assert "($100.000)" in str(e.value) and "si no tiene, no es" in str(e.value)


A = "https://www.mercadolibre.com.ar/p/MLA123456789 | Heladera Samsung 400L | 900.000 | 1.200.000"
B = "https://www.mercadolibre.com.ar/p/MLA987654321 | Notebook Lenovo 15 | 700000 | 900000 | https://http2.mlstatic.com/D_1.jpg"


def test_lote_por_lineas_o_separador():
    assert len(om.parsear_lote(A + "\n" + B)) == 2
    assert len(om.parsear_lote(A + " ;; " + B)) == 2


def test_lote_todo_o_nada():
    with pytest.raises(om.OfertaInvalida, match="Oferta 2"):
        om.parsear_lote(A + "\nhttps://meli.la/xx | Algo largo | 10 | 20")


def test_lote_campos_de_menos():
    with pytest.raises(om.OfertaInvalida):
        om.parsear_lote("solo | tres | campos")


# ---------------------------------------------------------------- validaciones nuevas

def test_descuento_absurdo_es_error():
    with pytest.raises(om.OfertaInvalida):
        oferta(actual="10000", anterior="900000")


def test_avisos_duplicado_por_titulo(tmp_path):
    a = oferta()
    otro = dict(a, id="MLA999999999")
    av = om.avisos(otro, [a], set())
    assert any("igual a otra oferta" in x for x in av)


def test_baja_de_precio_libera_el_id_publicado(tmp_path):
    manual, state = tmp_path / "m.json", tmp_path / "p.json"
    state.write_text(json.dumps({"posted_ids": ["MLA12345678", "MLA1"]}))
    om.guardar(oferta(actual="500000", anterior="749999"), manual, state)
    assert "MLA12345678" in json.loads(state.read_text())["posted_ids"]   # sin carga previa no se toca
    om.guardar(oferta(actual="450000", anterior="749999"), manual, state)   # baja 10% vs la carga previa
    assert "MLA12345678" not in json.loads(state.read_text())["posted_ids"]
    assert "MLA1" in json.loads(state.read_text())["posted_ids"]
