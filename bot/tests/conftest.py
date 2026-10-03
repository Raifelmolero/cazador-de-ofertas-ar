"""Fixtures comunes: los tests que corren main() no deben escribir el
precio testigo real (bot/state/precio_testigo_2026.json)."""
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))


@pytest.fixture(autouse=True)
def _testigo_aislado(tmp_path, monkeypatch):
    import cazador_bot
    monkeypatch.setattr(cazador_bot, "TESTIGO_PATH", tmp_path / "testigo.json")
