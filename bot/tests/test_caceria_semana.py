import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))
import caceria_semana as cs  # noqa: E402


def test_top_semana_prioriza_minimo_y_ahorro_y_no_repite():
    entries = [
        {"id": "A", "title": "a", "discount": 50, "price": 100_000, "low": False},
        {"id": "B", "title": "b", "discount": 20, "price": 900_000, "low": True},
        {"id": "C", "title": "c", "discount": 40, "price": 1_000_000, "low": False},
        {"id": "C", "title": "c", "discount": 40, "price": 1_000_000, "low": False},
    ]
    assert [e["id"] for e in cs.top_semana(entries)] == ["B", "C", "A"]
