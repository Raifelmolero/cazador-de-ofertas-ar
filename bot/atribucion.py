"""Atribución de ventas por canal (tarjeta #05).

Lee un CSV con resultados por etiqueta (matt_word) del panel de afiliados de
Mercado Libre y genera un reporte markdown: ganancia por canal, % del total,
ganancia por clic y recomendación de dónde publicar más.

FORMATO SOPORTADO (CSV simple, lo completa Raifel copiando del panel):
    etiqueta,clics,pedidos,ganancia
    telegram,120,12,210000
Acepta ; o , como separador, encabezados en español con o sin tildes
(p. ej. "Etiqueta", "Clics", "Pedidos"/"Ventas", "Ganancia"/"Ganancia estimada")
y montos tipo "$ 715.610,50". El formato EXACTO del export del panel de ML no
está verificado en el repo: si el archivo exportado trae otras columnas, se
ignoran; solo hacen falta esas cuatro (se reconocen por nombre).

Uso: python bot/atribucion.py archivo.csv [-o reporte.md]
"""
from __future__ import annotations

import argparse
import csv
import io
import re
import sys
import unicodedata
from dataclasses import dataclass
from pathlib import Path

# etiqueta (matt_word) -> canal. Fuente: cazador_bot.affiliate_link + env
# ML_WORD_*, alertas.py (MATT_WORD), frontend/lib/afiliado.ts y nichos.ts.
CANALES = {
    "telegram": "Telegram",
    "instagram": "Instagram",
    "threads": "Threads",
    "facebook": "Facebook",
    "whatsapp": "WhatsApp (kit)",
    "youtube": "YouTube Shorts",
    "web": "Web (cazadordeofertas.com.ar)",
    "alertas": "Alertas de precio (Telegram privado)",
}
NICHOS = {"herramientas", "hogar", "tecno", "gastronomia", "gamer", "bebes",
          "electro", "vehiculos"}

ALIAS = {
    "etiqueta": ("etiqueta", "matt_word", "word", "tag", "canal"),
    "clics": ("clics", "clicks", "clic", "click"),
    "pedidos": ("pedidos", "ventas", "ordenes", "unidades", "compras"),
    "ganancia": ("ganancia", "ganancia estimada", "ganancias", "comision",
                 "comisiones", "ingresos"),
}
MIN_CLICS = 20  # debajo de esto la ganancia por clic es ruido


def _norm(s: str) -> str:
    s = unicodedata.normalize("NFKD", s or "").encode("ascii", "ignore").decode()
    return re.sub(r"\s+", " ", s.strip().lower())


def canal_de(etiqueta: str) -> str:
    e = _norm(etiqueta)
    if e in CANALES:
        return CANALES[e]
    if e in NICHOS:
        return f"Web - nicho {e}"
    return f"Otra ({etiqueta})"


def parse_num(v: str) -> float:
    """'$ 715.610,50' -> 715610.5 ; '1,234.5' -> 1234.5 ; '' -> 0."""
    s = re.sub(r"[^\d,.\-]", "", v or "")
    if not s:
        return 0.0
    if "," in s and "." in s:
        if s.rfind(",") > s.rfind("."):
            s = s.replace(".", "").replace(",", ".")
        else:
            s = s.replace(",", "")
    elif "," in s:
        ent, _, dec = s.rpartition(",")
        s = f"{ent.replace(',', '')}.{dec}" if len(dec) != 3 else s.replace(",", "")
    elif s.count(".") > 1 or (s.count(".") == 1 and len(s.split(".")[1]) == 3):
        s = s.replace(".", "")
    return float(s)


@dataclass
class Fila:
    etiqueta: str
    clics: float
    pedidos: float
    ganancia: float

    @property
    def canal(self) -> str:
        return canal_de(self.etiqueta)


def leer_csv(texto: str) -> list[Fila]:
    lineas = [ln for ln in texto.lstrip("﻿").splitlines()
              if ln.strip() and not ln.lstrip().startswith("#")]
    if not lineas:
        raise ValueError("CSV vacío")
    delim = ";" if lineas[0].count(";") > lineas[0].count(",") else ","
    reader = csv.reader(io.StringIO("\n".join(lineas)), delimiter=delim)
    header = [_norm(h) for h in next(reader)]
    idx = {}
    for campo, alias in ALIAS.items():
        for i, h in enumerate(header):
            if h in alias:
                idx[campo] = i
                break
    faltan = [c for c in ALIAS if c not in idx]
    if faltan:
        raise ValueError(f"Faltan columnas {faltan}. Encabezado leído: {header}")
    filas: dict[str, Fila] = {}
    for row in reader:
        if len(row) <= max(idx.values()):
            continue
        et = row[idx["etiqueta"]].strip()
        if not et or _norm(et) in ("total", "totales"):
            continue
        f = filas.setdefault(_norm(et), Fila(_norm(et), 0, 0, 0))
        f.clics += parse_num(row[idx["clics"]])
        f.pedidos += parse_num(row[idx["pedidos"]])
        f.ganancia += parse_num(row[idx["ganancia"]])
    return list(filas.values())


def fmt_ars(x: float) -> str:
    return "$" + f"{x:,.0f}".replace(",", ".")


def recomendacion(filas: list[Fila]) -> list[str]:
    medibles = [f for f in filas if f.clics >= MIN_CLICS]
    if not medibles:
        return [f"- Ninguna etiqueta llega a {MIN_CLICS} clics: todavía no hay "
                "datos suficientes para recomendar. Juntá más semanas."]
    tot_c = sum(f.clics for f in medibles)
    tot_g = sum(f.ganancia for f in medibles)
    prom = tot_g / tot_c if tot_c else 0
    orden = sorted(medibles, key=lambda f: f.ganancia / f.clics, reverse=True)
    out = [f"- Ganancia por clic promedio (etiquetas con ≥{MIN_CLICS} clics): "
           f"{fmt_ars(prom)}."]
    for f in orden:
        gpc = f.ganancia / f.clics
        if prom and gpc >= prom * 1.2:
            out.append(f"- **Más publicaciones en {f.canal}** (`{f.etiqueta}`): "
                       f"{fmt_ars(gpc)}/clic, {gpc / prom:.1f}x el promedio.")
        elif gpc <= prom * 0.5:
            out.append(f"- Revisar {f.canal} (`{f.etiqueta}`): {fmt_ars(gpc)}/clic, "
                       "menos de la mitad del promedio (probá otros productos u "
                       "horarios antes de sumarle volumen).")
    chicas = [f for f in filas if 0 < f.clics < MIN_CLICS or (f.clics == 0 and f.ganancia)]
    if chicas:
        out.append("- Pocos datos (<{} clics), no concluyente: {}.".format(
            MIN_CLICS, ", ".join(f"`{f.etiqueta}`" for f in chicas)))
    sin = [f for f in filas if f.clics == 0 and f.ganancia == 0]
    if sin:
        out.append("- Sin clics ni ventas: {} (¿el canal está publicando?).".format(
            ", ".join(f"`{f.etiqueta}`" for f in sin)))
    return out


def generar_reporte(filas: list[Fila], titulo: str = "Atribución por canal") -> str:
    tot_g = sum(f.ganancia for f in filas)
    tot_c = sum(f.clics for f in filas)
    tot_p = sum(f.pedidos for f in filas)
    lin = [f"# {titulo}", "",
           f"Total: {tot_c:.0f} clics · {tot_p:.0f} pedidos · {fmt_ars(tot_g)} de ganancia.", "",
           "| Canal | Etiqueta | Clics | Pedidos | Ganancia | % del total | $/clic | Conversión |",
           "|---|---|---:|---:|---:|---:|---:|---:|"]
    for f in sorted(filas, key=lambda f: f.ganancia, reverse=True):
        pct = f"{f.ganancia / tot_g * 100:.1f}%" if tot_g else "-"
        gpc = fmt_ars(f.ganancia / f.clics) if f.clics else "-"
        conv = f"{f.pedidos / f.clics * 100:.1f}%" if f.clics else "-"
        lin.append(f"| {f.canal} | `{f.etiqueta}` | {f.clics:.0f} | {f.pedidos:.0f} | "
                   f"{fmt_ars(f.ganancia)} | {pct} | {gpc} | {conv} |")
    lin += ["", "## Recomendación", "", *recomendacion(filas), ""]
    return "\n".join(lin)


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Reporte de atribución por canal")
    ap.add_argument("csv")
    ap.add_argument("-o", "--output")
    a = ap.parse_args(argv)
    md = generar_reporte(leer_csv(Path(a.csv).read_text(encoding="utf-8-sig")))
    if a.output:
        Path(a.output).write_text(md, encoding="utf-8")
    else:
        sys.stdout.reconfigure(encoding="utf-8")
        print(md)
    return 0


if __name__ == "__main__":
    sys.exit(main())
