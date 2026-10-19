import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "tools"))
import auditoria_semanal as aud  # noqa: E402


class LinksInternos(unittest.TestCase):
    def test_solo_rutas_internas_de_paginas(self):
        html = ('<a href="/categoria/aires/">x</a><a href="/precio/abc?utm=1">y</a>'
                '<a href="/hoy#ofertas">z</a><a href="https://www.mercadolibre.com.ar/x">ml</a>'
                '<a href="//cdn.x/y">cdn</a><img src="/a.png"><a href="/og.png">i</a>'
                '<link href="/_next/static/a.css"><a href="/">home</a>')
        self.assertEqual(aud.links_internos(html), {"/categoria/aires", "/precio/abc", "/hoy", "/"})


if __name__ == "__main__":
    unittest.main()
