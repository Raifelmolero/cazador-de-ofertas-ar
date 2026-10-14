"""utm_content: cada link a la web dice de qué oferta salió la visita."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import cazador_bot as bot


def test_lleva_el_id_de_la_oferta():
    url = bot.web_deal_url({"id": "MLA123"}, "telegram", {})
    assert url.endswith("&utm_content=MLA123") and "utm_source=telegram" in url


def test_id_raro_se_limpia_y_sin_id_no_agrega():
    assert "utm_content=MLA1x" in bot.web_deal_url({"id": "MLA1 x/&?"}, "ig", {})
    assert "utm_content" not in bot.web_deal_url({"id": ""}, "ig", {})


def test_el_link_de_afiliado_a_ml_no_se_toca():
    url = bot.affiliate_url("https://www.mercadolibre.com.ar/p/MLA1", "id", "telegram")
    assert "utm_content" not in url
