import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import cazador_bot as cb


DEAL = {"id": "MLA1", "title": "Aire acondicionado inverter 3000 frigorías",
        "discount": 30, "price_cur": 900000, "price_prev": 1300000,
        "url": "https://www.mercadolibre.com.ar/p/MLA1", "img": "https://x/y.jpg"}


def test_story_kit_trae_web_y_ml():
    msg = cb.story_kit(DEAL, "AFF", "instagram", {"MLA1": "aire-inverter"},
                       "https://raw/story.jpg")
    assert "/precio/aire-inverter?utm_source=ig_story" in msg
    assert "matt_word=instagram" in msg
    assert "https://raw/story.jpg" in msg


def test_story_kit_sin_ficha_va_a_su_comparativa():
    # Un aire sin ficha /precio va a la comparativa de aires (no a /hoy)
    msg = cb.story_kit(DEAL, "AFF", "instagram", {}, None)
    assert "/mejores/mejores-aires-acondicionados?utm_source=ig_story" in msg


def test_story_kit_sin_ficha_ni_comparativa_va_a_hoy():
    msg = cb.story_kit({**DEAL, "title": "Freidora de aire Philco"}, "AFF", "instagram", {}, None)
    assert "/hoy?utm_source=ig_story" in msg
    assert "https://x/y.jpg" in msg
