import io
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from PIL import Image

import story


def test_pose_por_tipo_de_oferta():
    assert story.pose_personaje({"hist_low": True, "relampago": True}) == "festejando"
    assert story.pose_personaje({"relampago": True}) == "corriendo"
    assert story.pose_personaje({"price_cur": 300_000}) == "atrapando"
    assert story.pose_personaje({"price_cur": 50_000}) == "pulgar"


def test_poses_existen():
    for pose in ("festejando", "corriendo", "atrapando", "pulgar"):
        assert (story.PERSONAJE_DIR / f"{pose}.png").exists()


def test_placa_con_personaje(tmp_path):
    buf = io.BytesIO()
    Image.new("RGB", (500, 500), (200, 200, 200)).save(buf, "JPEG")
    deal = {"title": "Heladera No Frost", "discount": 20,
            "price_prev": 1_000_000, "price_cur": 800_000}
    out = story.render_feed(deal, buf.getvalue(), tmp_path / "p.jpg")
    assert Image.open(out).size == (1080, 1350)
