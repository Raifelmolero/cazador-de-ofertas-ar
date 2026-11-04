import json
import sys
import unittest
from datetime import date, datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import x_post  # noqa: E402

HOY = date(2026, 11, 4)


def item(serie, lista=200000, visto="2026-11-04"):
    return {"slug": "s", "titulo": "Producto", "serie": serie, "precio_lista": lista,
            "min": min(p for _, p in serie), "ultimo_visto": visto}


class TestXPost(unittest.TestCase):
    def test_elige_minimo_con_historia_y_mas_ahorro(self):
        items = {
            "A": item([["d1", 150000], ["d2", 140000], ["d3", 120000]]),           # mínimo, ahorra 80k
            "B": item([["d1", 900000], ["d2", 800000], ["d3", 700000]], 1000000),  # mínimo, ahorra 300k
            "C": item([["d1", 100000], ["d2", 120000], ["d3", 130000]]),           # no está en mínimo
            "D": item([["d1", 100000]]),                                          # poca historia
            "E": item([["d1", 150000], ["d2", 140000], ["d3", 50000]], visto="2026-11-01"),  # no visto hoy
        }
        self.assertEqual(x_post.elegir(items, HOY, set())["id"], "B")
        self.assertEqual(x_post.elegir(items, HOY, {"B"})["id"], "A")

    def test_sin_bajada_real_no_tuitea(self):
        items = {"A": item([["d1", 120000], ["d2", 120000], ["d3", 120000]])}
        self.assertIsNone(x_post.elegir(items, HOY, set()))

    def test_texto(self):
        t = x_post.texto_tuit({"titulo": "Heladera", "slug": "heladera-x", "precio": 1234567,
                               "lista": 2000000, "desc": 38, "dias": 12})
        self.assertIn("$1.234.567", t)
        self.assertIn("/precio/heladera-x?utm_source=x", t)
        self.assertNotIn("@", t)

    def test_no_repite_en_7_dias(self):
        ahora = datetime(2026, 11, 4, 12, tzinfo=timezone.utc)
        lineas = [json.dumps({"ts": "2026-11-01T10:00:00+00:00", "ch": "x", "id": "A"}),
                  json.dumps({"ts": "2026-10-20T10:00:00+00:00", "ch": "x", "id": "B"}),
                  json.dumps({"ts": "2026-11-03T10:00:00+00:00", "ch": "ig", "id": "C"})]
        self.assertEqual(x_post.ya_publicados(lineas, ahora), {"A"})


if __name__ == "__main__":
    unittest.main()
