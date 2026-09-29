import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import atribucion as at  # noqa: E402

EJEMPLO = Path(__file__).resolve().parents[2] / "docs" / "atribucion" / "ejemplo-atribucion.csv"


def test_parse_num_formatos():
    assert at.parse_num("$ 715.610,50") == 715610.5
    assert at.parse_num("715.610") == 715610
    assert at.parse_num("1,234.5") == 1234.5
    assert at.parse_num("12,5") == 12.5
    assert at.parse_num("") == 0


def test_canal_de():
    assert at.canal_de("telegram") == "Telegram"
    assert at.canal_de("Gamer") == "Web - nicho gamer"
    assert at.canal_de("xyz").startswith("Otra")


def test_leer_csv_simple_y_agrupa():
    filas = at.leer_csv("etiqueta,clics,pedidos,ganancia\ntelegram,10,1,100\nTelegram,5,1,50\n")
    assert len(filas) == 1 and filas[0].clics == 15 and filas[0].ganancia == 150


def test_leer_csv_punto_y_coma_encabezados_alternativos():
    txt = "﻿Etiqueta;Clics;Ventas;Ganancia estimada;Otra\nweb;30;3;$ 45.000,00;x\nTotal;30;3;45000;\n"
    filas = at.leer_csv(txt)
    assert [(f.etiqueta, f.pedidos, f.ganancia) for f in filas] == [("web", 3, 45000)]


def test_falta_columna():
    with pytest.raises(ValueError):
        at.leer_csv("etiqueta,clics\nweb,1\n")


def test_reporte_ejemplo():
    md = at.generar_reporte(at.leer_csv(EJEMPLO.read_text(encoding="utf-8")))
    assert "Total: 285 clics · 27 pedidos · $450.000" in md
    assert "| Web (cazadordeofertas.com.ar) | `web` | 60 | 8 | $160.000 | 35.6% | $2.667 |" in md
    assert "**Más publicaciones en Web" in md
    assert "Revisar Threads" in md
    assert "no concluyente: `alertas`" in md
    assert "`youtube` (¿el canal" in md


def test_sin_datos_suficientes():
    md = at.generar_reporte([at.Fila("web", 3, 0, 0)])
    assert "no hay datos suficientes" in md


def test_main_escribe_archivo(tmp_path):
    out = tmp_path / "r.md"
    assert at.main([str(EJEMPLO), "-o", str(out)]) == 0
    assert out.read_text(encoding="utf-8").startswith("# Atribución por canal")
