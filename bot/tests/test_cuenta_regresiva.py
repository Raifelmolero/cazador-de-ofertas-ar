import sys
from datetime import datetime
from pathlib import Path
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import cazador_bot as bot

PERFUME = "Perfume Carolina Herrera 100ml"


def test_faltan_dias_dentro_de_las_dos_semanas():
    txt = bot.cuenta_regresiva(PERFUME, datetime(2026, 10, 9))
    assert txt.startswith("⏰ Faltan 9 días para el Día de la Madre")
    assert "fecha de entrega" in txt


def test_falta_un_dia_y_hoy():
    assert "Falta 1 día" in bot.cuenta_regresiva(PERFUME, datetime(2026, 10, 17))
    assert bot.cuenta_regresiva(PERFUME, datetime(2026, 10, 18)) == "🎁 Hoy es el Día de la Madre"


def test_sin_cuenta_lejos_de_la_fecha_o_si_no_es_regalo():
    assert bot.cuenta_regresiva(PERFUME, datetime(2026, 9, 28)) == ""
    assert bot.cuenta_regresiva(PERFUME, datetime(2026, 10, 19)) == ""
    assert bot.cuenta_regresiva("Kit Faros Led Auto H4", datetime(2026, 10, 9)) == ""


def test_reyes_cruza_el_anio():
    assert "Faltan 6 días para Reyes" in bot.cuenta_regresiva("Bicicleta rodado 20", datetime(2026, 12, 31))


def test_lavavajillas_es_regalo_del_dia_de_la_madre():
    assert "Día de la Madre" in bot.sello_temporada("Lavavajillas Midea 12 cubiertos", datetime(2026, 10, 9))


def test_caption_ig_lleva_cuenta_y_landing_escrita():
    deal = {"title": PERFUME, "discount": 30, "price_prev": 100_000, "price_cur": 70_000}
    hoy = datetime(2026, 10, 9)
    cr, lt, st = bot.cuenta_regresiva, bot.landing_temporada, bot.sello_temporada
    with mock.patch.object(bot, "cuenta_regresiva", lambda t: cr(t, hoy)),          mock.patch.object(bot, "landing_temporada", lambda t, s: lt(t, s, hoy)),          mock.patch.object(bot, "sello_temporada", lambda t: st(t, hoy)):
        cap = bot.ig_caption(deal)
    assert "Faltan 9 días" in cap
    assert "cazadordeofertas.com.ar/madre" in cap  # dirección corta (redirect)
    assert "utm_" not in cap
