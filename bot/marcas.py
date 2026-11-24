"""
Marcas que NO se publican en ningún canal (IG, Facebook, Telegram, WhatsApp,
Threads, X, stories, reels, kits). Pedido del dueño, 24/11/2026.

Stdlib pura: lo importan el bot y las herramientas de bot/tools.

Ojo con "HP": también es la unidad de caballos de fuerza ("Compresor 7.5 Hp",
"Motor 1/2 HP", "Bomba 1hp"). Solo cuenta como marca si NO viene pegado a un
número (o a "CV/").
"""

from __future__ import annotations

import re
import unicodedata

# Marcas por palabra completa (sin tildes, minúsculas). Likon es de BGH.
MARCAS_EXCLUIDAS = ("hp", "hewlett", "omen", "victus", "omnibook", "bgh", "vivobook", "likon")

_PALABRAS = re.compile(r"\b(" + "|".join(m for m in MARCAS_EXCLUIDAS if m != "hp") + r")\b")
_HP = re.compile(r"\bhp\b")
# lo que hay justo antes de "hp" cuando es la unidad: "7.5 ", "1/2 ", "3,5", "cv/"
_UNIDAD_ANTES = re.compile(r"(\d[\d.,/]*\s*|\bcv\s*/\s*)$")


def _norm(texto: str) -> str:
    t = unicodedata.normalize("NFKD", texto or "")
    return "".join(c for c in t if not unicodedata.combining(c)).lower()


def marca_excluida(titulo: str) -> bool:
    """True si el título es de una marca que no se publica."""
    t = _norm(titulo)
    if _PALABRAS.search(t):
        return True
    for m in _HP.finditer(t):
        if not _UNIDAD_ANTES.search(t[: m.start()]):
            return True
    return False


def sin_marcas_excluidas(deals: list[dict], campo: str = "title") -> list[dict]:
    """Filtra una lista de ofertas por el título (campo `title` o `titulo`)."""
    return [d for d in deals if not marca_excluida(d.get(campo) or "")]
