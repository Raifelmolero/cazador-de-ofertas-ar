import os
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import alertas as al  # noqa: E402

HIST = {"MLA123456789": {"min": 90000, "min_ts": "2026-09-01", "first_ts": "2026-08-01",
                         "last": 100000, "last_ts": "2026-09-20"}}
URL = "https://articulo.mercadolibre.com.ar/MLA-123456789-auriculares-gamer-hyperx-_JM"


class TestParsear(unittest.TestCase):
    def test_link_y_precio(self):
        p = al.parsear_link(f"{URL}?matt=1 $85.000")
        self.assertEqual(p["mla"], "MLA123456789")
        self.assertEqual(p["objetivo"], 85000)
        self.assertEqual(p["nombre"], "auriculares gamer hyperx")
        self.assertNotIn("?", p["url"])

    def test_sin_precio_y_sin_link(self):
        self.assertIsNone(al.parsear_link(URL)["objetivo"])
        self.assertIsNone(al.parsear_link("hola"))
        self.assertIsNone(al.parsear_link("https://www.google.com/MLA-123456789"))


class TestResponder(unittest.TestCase):
    def setUp(self):
        self.data = {"offset": 0, "alertas": []}

    def test_crea_con_objetivo_por_defecto(self):
        r = al.responder(self.data, 1, URL, HIST)
        self.assertIn("Alerta creada", r)
        self.assertEqual(self.data["alertas"][0]["objetivo"], 99999)

    def test_reemplaza_la_misma_y_borra(self):
        al.responder(self.data, 1, URL, HIST)
        al.responder(self.data, 1, URL + " 80000", HIST)
        self.assertEqual(len(self.data["alertas"]), 1)
        self.assertEqual(self.data["alertas"][0]["objetivo"], 80000)
        al.responder(self.data, 1, "/borrar 1", HIST)
        self.assertEqual(self.data["alertas"], [])

    def test_stop_solo_borra_lo_propio(self):
        al.responder(self.data, 1, URL, HIST)
        al.responder(self.data, 2, URL, HIST)
        al.responder(self.data, 1, "/stop", HIST)
        self.assertEqual([a["chat"] for a in self.data["alertas"]], [2])

    def test_start_con_codigo_y_ayuda(self):
        al.responder(self.data, 1, "/start MLA123456789", HIST)
        self.assertEqual(self.data["alertas"][0]["mla"], "MLA123456789")
        self.assertIn("Mandame el link", al.responder(self.data, 1, "/start", HIST))

    def test_limite_por_chat(self):
        for i in range(al.MAX_POR_CHAT):
            al.responder(self.data, 1, f"https://articulo.mercadolibre.com.ar/MLA-{100000000 + i}", HIST)
        self.assertIn("máximo", al.responder(self.data, 1, URL, HIST))


class TestAvisar(unittest.TestCase):
    def test_cumple_solo_si_se_vio_despues_y_al_precio(self):
        base = {"chat": 1, "mla": "MLA123456789", "url": URL, "nombre": ""}
        data = {"alertas": [
            {**base, "objetivo": 100000, "creada": "2026-09-19"},  # cumple
            {**base, "objetivo": 95000, "creada": "2026-09-19"},   # precio alto
            {**base, "objetivo": 100000, "creada": "2026-09-21"},  # visto antes de crearla
            {**base, "mla": "MLA999999999", "objetivo": None, "creada": "2026-09-01"},
        ]}
        self.assertEqual(len(al.para_avisar(data, HIST)), 1)

    def test_aviso_lleva_afiliado_y_aclaracion(self):
        a = {"url": URL, "nombre": "auriculares", "objetivo": 100000}
        t = al.texto_aviso(a, HIST["MLA123456789"], "cazador")
        self.assertIn("matt_word=alertas", t)
        self.assertIn("link de afiliado", t)


class TestCifrado(unittest.TestCase):
    def test_ida_y_vuelta_cifrado(self):
        from cryptography.fernet import Fernet
        os.environ["ALERTAS_KEY"] = Fernet.generate_key().decode()
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / "a.enc"
            al.guardar({"offset": 5, "alertas": [{"chat": 42}]}, p)
            self.assertNotIn(b"42", p.read_bytes())
            self.assertEqual(al.cargar(p)["offset"], 5)


if __name__ == "__main__":
    unittest.main()
