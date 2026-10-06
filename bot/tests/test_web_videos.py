import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import web_videos  # noqa: E402


def item(i, desc=30, prio=100, img="http://x/i.jpg"):
    return {"id_ml": i, "titulo": f"Prod {i}", "precio_actual": 1000, "precio_anterior": 1500,
            "descuento_pct": desc, "url_imagen": img, "prioridad": prio, "minimo_historico": False}


class WebVideosTest(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        self.out = self.tmp / "videos"

    def datos(self, items):
        p = self.tmp / "d.json"
        p.write_text(json.dumps({"items": items}), encoding="utf-8")
        return p

    def render(self, deal, img, path):
        Path(path).write_bytes(b"mp4")

    def test_elige_por_prioridad_y_descuento(self):
        items = [item("MLA1", prio=10), item("MLA2", prio=90), item("MLA3", desc=10, prio=999), item("MLA4", img=None)]
        self.assertEqual([i["id_ml"] for i in web_videos.candidatos(items, 5)], ["MLA2", "MLA1"])

    def test_ids_raros_no_pasan(self):
        self.assertEqual(web_videos.candidatos([item("../x")], 5), [])

    def test_genera_solo_max_nuevos_y_poda(self):
        self.out.mkdir()
        (self.out / "MLAviejo.mp4").write_bytes(b"x")
        r = web_videos.generar(max_nuevos=2, keep=3, fetch=lambda u: b"img", render=self.render,
                               data_path=self.datos([item(f"MLA{n}", prio=n) for n in range(1, 6)]), out_dir=self.out)
        self.assertEqual(r["nuevos"], ["MLA5", "MLA4"])
        self.assertEqual(r["borrados"], 1)
        self.assertFalse((self.out / "MLAviejo.mp4").exists())

    def test_no_regenera_los_que_ya_existen(self):
        self.out.mkdir()
        (self.out / "MLA5.mp4").write_bytes(b"x")
        r = web_videos.generar(max_nuevos=1, keep=3, fetch=lambda u: b"img", render=self.render,
                               data_path=self.datos([item(f"MLA{n}", prio=n) for n in range(1, 6)]), out_dir=self.out)
        self.assertEqual(r["nuevos"], ["MLA4"])

    def test_un_render_roto_no_frena_a_los_demas(self):
        def render(deal, img, path):
            if deal["title"] == "Prod MLA5":
                raise RuntimeError("boom")
            Path(path).write_bytes(b"mp4")
        r = web_videos.generar(max_nuevos=2, keep=3, fetch=lambda u: b"img", render=render,
                               data_path=self.datos([item(f"MLA{n}", prio=n) for n in range(1, 6)]), out_dir=self.out)
        self.assertEqual(r["nuevos"], ["MLA4", "MLA3"])
        self.assertFalse((self.out / "MLA5.mp4").exists())


if __name__ == "__main__":
    unittest.main()
