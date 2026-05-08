from __future__ import annotations

import asyncio
import json
import os
from datetime import datetime, timezone

try:
    import pandas as pd  # type: ignore
except Exception:  # pandas puede no estar disponible (ej. Python 3.14 sin wheels)
    pd = None

from .calculator import MarginCalculator
from .config import settings
from .ml_scraper import MLScraper
from .models import ProductWithMargins


def _model_dump_dict(obj) -> dict:
    """Pydantic v2 (`model_dump`) o v1 (`dict`)."""
    if hasattr(obj, "model_dump"):
        return obj.model_dump()
    return obj.dict()


def _model_dump_json_dict(obj) -> dict:
    """URLs y tipos especiales como JSON-serializables."""
    if hasattr(obj, "model_dump"):
        return obj.model_dump(mode="json")
    return json.loads(obj.json())


def _ensure_parent_dir(path: str) -> None:
    parent = os.path.dirname(path)
    if parent:
        os.makedirs(parent, exist_ok=True)


async def run() -> None:
    _ensure_parent_dir(settings.output_json_path)

    async with MLScraper(settings) as scraper:
        result = await scraper.extraer_listado_tendencias()

    enriched: list[ProductWithMargins] = []
    for item in result.items:
        # Por ahora asumimos que precio_actual está en ARS.
        # Si más adelante scrapeás USD u otras monedas, normalizá acá.
        margen = MarginCalculator.calcular(item.precio_actual)

        enriched.append(
            ProductWithMargins(
                **_model_dump_dict(item),
                comision_clasica_pct=margen.comision_clasica_pct,
                comision_premium_pct=margen.comision_premium_pct,
                retencion_iibb_pct=margen.retencion_iibb_pct,
                costo_envio_base_ars=margen.costo_envio_base_ars,
                margen_neto_clasico_ars=margen.margen_neto_clasico_ars,
                margen_neto_premium_ars=margen.margen_neto_premium_ars,
            )
        )

    rows = [_model_dump_json_dict(x) for x in enriched]
    if pd is not None:
        # Aplanamos a DataFrame para limpieza/estructuración futura (y fácil export).
        df = pd.DataFrame(rows)
        items_out = df.to_dict(orient="records")
    else:
        items_out = rows

    payload = {
        "metadata": {
            "source_url": result.source_url,
            "scraped_at": datetime.now(timezone.utc).isoformat(),
            "count": int(len(enriched)),
        },
        "items": items_out,
    }

    with open(settings.output_json_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print(f"OK: guardado {len(enriched)} items en {settings.output_json_path}")


def main() -> None:
    asyncio.run(run())


if __name__ == "__main__":
    main()

