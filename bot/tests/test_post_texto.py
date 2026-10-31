import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import post_texto  # noqa: E402


class PostTextoTest(unittest.TestCase):
    def cargar_con(self, data):
        tmp = Path(tempfile.mkdtemp())
        (tmp / "x.json").write_text(json.dumps(data), encoding="utf-8")
        with mock.patch.object(post_texto, "DIR", tmp):
            return post_texto.cargar("x.json")

    def test_texto_completo_pasa(self):
        self.assertEqual(self.cargar_con({"threads": "ok", "facebook": "ok"})["threads"], "ok")

    def test_corchetes_sin_completar_se_rechazan(self):
        with self.assertRaises(ValueError):
            self.cargar_con({"threads": "Heladera: $[precio]", "facebook": "ok"})

    def test_ruta_fuera_de_la_carpeta_se_rechaza(self):
        with self.assertRaises(ValueError):
            post_texto.cargar("../cazador_bot.py")

    def test_todos_los_posts_guardados_son_publicables(self):
        for f in sorted(post_texto.DIR.glob("*.json")):
            d = post_texto.cargar(f.name)
            self.assertLessEqual(len(d.get("threads", "")), 500, f.name)


if __name__ == "__main__":
    unittest.main()
