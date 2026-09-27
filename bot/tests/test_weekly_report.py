"""Tests del reporte semanal: que cada canal se llame por su nombre y que el
reporte incluya a Facebook y el pedido de la captura del panel de ML."""

import sys
import unittest
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import weekly_report as wr  # noqa: E402


def entry(ch: str, id_: str = "MLA1") -> dict:
    return {
        "ts": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "ch": ch, "id": id_, "title": "Producto", "discount": 40, "price": 50000,
        "low": False, "excl": False,
    }


class TestBuildReport(unittest.TestCase):
    def test_los_canales_reel_y_facebook_salen_con_su_nombre(self):
        rep = wr.build_report([entry("reel", "A"), entry("facebook", "B")])
        self.assertIn("IG reels: 1", rep)
        self.assertIn("Facebook: 1", rep)
        self.assertNotIn("reel:", rep)

    def test_incluye_seguidores_de_facebook_con_la_variacion(self):
        rep = wr.build_report([entry("telegram")], {"fb": 30}, {"fb": 25})
        self.assertIn("Facebook: 30 (+5 vs sem. pasada)", rep)

    def test_facebook_sin_dato_dice_sin_dato_pero_no_rompe(self):
        rep = wr.build_report([entry("telegram")], {"tg": 2}, {})
        self.assertIn("Facebook: s/d", rep)

    def test_pide_la_captura_del_panel_de_ml_por_canal(self):
        rep = wr.build_report([entry("telegram")])
        self.assertIn("Panel de afiliados ML", rep)
        self.assertIn("facebook", rep)


if __name__ == "__main__":
    unittest.main()


class TestMedicionPorCanal(unittest.TestCase):
    def e(self, ch, id_, title="Producto", price=50000, low=False):
        d = entry(ch, id_)
        d.update(title=title, price=price, low=low)
        return d

    def test_week_stats_cuenta_unicas_minimos_y_ticket(self):
        es = [self.e("telegram", "A", price=100000, low=True), self.e("ig", "A", price=100000, low=True),
              self.e("telegram", "B", price=50000)]
        st = wr.week_stats(es)
        self.assertEqual(st["total"], 3)
        self.assertEqual(st["unicas"], 2)
        self.assertEqual(st["pct_low"], 50)
        self.assertEqual(st["ticket"], 75000)
        self.assertEqual(st["canales"], {"telegram": 2, "ig": 1})

    def test_categoria_por_titulo_sin_acentos(self):
        self.assertEqual(wr.categoria("Colchón Piero 2 plazas"), "Colchones")
        self.assertEqual(wr.categoria("Taladro Percutor Bosch"), "Herramientas")
        self.assertEqual(wr.categoria("Cosa rara"), "Otras")

    def test_top5_categorias(self):
        titulos = ["Colchón", "Taladro", "Smart TV", "Freidora de aire", "Neumático", "Silla", "Cosa"]
        st = wr.week_stats([self.e("telegram", str(i), t) for i, t in enumerate(titulos)])
        self.assertEqual(len(st["cats"]), 5)

    def test_flecha_sube_baja_igual_y_sin_dato(self):
        self.assertEqual(wr.flecha(5, 2), " (↑3 vs sem. ant.)")
        self.assertEqual(wr.flecha(2, 5), " (↓3 vs sem. ant.)")
        self.assertEqual(wr.flecha(2, 2), " (= sem. ant.)")
        self.assertEqual(wr.flecha(2, None), "")
        self.assertIn("↑$1.500", wr.flecha(3500, 2000, precio=True))

    def test_reporte_compara_con_semana_anterior(self):
        rep = wr.build_report([self.e("telegram", "A"), self.e("telegram", "B")],
                              prev_entries=[self.e("telegram", "C")])
        self.assertIn("Telegram: 2 (↑1 vs sem. ant.)", rep)
        self.assertIn("Ofertas únicas: 2 (↑1 vs sem. ant.)", rep)
        self.assertIn("Ticket promedio:", rep)
        self.assertIn("Top 5 categorías", rep)

    def test_canal_que_dejo_de_publicar_sale_con_cero(self):
        rep = wr.build_report([self.e("telegram", "A")], prev_entries=[self.e("reel", "B")])
        self.assertIn("IG reels: 0 (↓1 vs sem. ant.)", rep)

    def test_aclara_canales_sin_registro_en_vez_de_inventar(self):
        rep = wr.build_report([self.e("telegram", "A")])
        self.assertIn("Sin registro en el repo", rep)
        self.assertIn("WhatsApp", rep)

    def test_para_completar_a_mano_lista_etiquetas_sin_numeros(self):
        rep = wr.build_report([self.e("telegram", "A")])
        self.assertIn("Para completar a mano", rep)
        for t in ("telegram", "instagram", "threads", "whatsapp", "web", "alertas"):
            self.assertIn(f"• {t}: __ clics", rep)

    def test_etiquetas_incluyen_nichos_del_sitio(self):
        tags = wr.etiquetas_ml()
        self.assertEqual(len(tags), len(set(tags)))
        if wr.NICHOS_TS_PATH.exists():
            self.assertIn("herramientas", tags)

    def test_split_telegram_respeta_el_limite(self):
        texto = "\n\n".join("x" * 1500 for _ in range(5))
        partes = wr.split_telegram(texto)
        self.assertGreater(len(partes), 1)
        self.assertTrue(all(len(p) <= wr.TG_MAX for p in partes))
        self.assertEqual(wr.split_telegram("corto"), ["corto"])
        self.assertTrue(all(len(p) <= 100 for p in wr.split_telegram("y" * 350, 100)))
