from __future__ import annotations

import asyncio
import json
import os
from datetime import datetime, timezone

try:
    import pandas as pd  # type: ignore
except Exception:
    pd = None

from .calculator import MarginCalculator
from .config import settings
from .ml_scraper import MLScraper
from .models import ProductWithMargins


def _model_dump_dict(obj) -> dict:
    if hasattr(obj, "model_dump"):
        return obj.model_dump()
    return obj.dict()


def _model_dump_json_dict(obj) -> dict:
    if hasattr(obj, "model_dump"):
        return obj.model_dump(mode="json")
    return json.loads(obj.json())


def _ensure_parent_dir(path: str) -> None:
    parent = os.path.dirname(path)
    if parent:
        os.makedirs(parent, exist_ok=True)


async def run() -> None:
    _ensure_parent_dir(settings.output_json_path)

    seed_urls = settings.get_seed_urls()
    print(f"Scrapeando {len(seed_urls)} categorías: {seed_urls}")

    # Recolectamos items de todas las URLs, deduplicamos por id_ml
    seen_ids: dict[str, object] = {}

    async with MLScraper(settings) as scraper:
        for url in seed_urls:
            print(f"  URL: {url}")
            try:
                result = await scraper.extraer_listado(url)
                for item in result.items:
                    if item.id_ml not in seen_ids:
                        seen_ids[item.id_ml] = item
            except Exception as exc:
                print(f"  ⚠️  Error en {url}: {exc}")

    all_items = list(seen_ids.values())
    print(f"Total sin duplicados: {len(all_items)}")

    # Ordenar: primero los que ML marca como "MÁS VENDIDO" (badge), luego el resto.
    # Dentro de cada grupo, orden de aparición en la página (ya viene implícito).
    badgeados = [p for p in all_items if p.ventas_estimadas is not None]
    sin_badge = [p for p in all_items if p.ventas_estimadas is None]
    all_items = (badgeados + sin_badge)[: settings.max_products]
    print(f"Con badge MAS VENDIDO: {len(badgeados)} | Sin badge: {len(sin_badge)} | Total final: {len(all_items)}")

    enriched: list[ProductWithMargins] = []
    for item in all_items:
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
        df = pd.DataFrame(rows)
        items_out = df.to_dict(orient="records")
    else:
        items_out = rows

    payload = {
        "metadata": {
            "source_urls": seed_urls,
            "scraped_at": datetime.now(timezone.utc).isoformat(),
            "count": int(len(enriched)),
            "min_ventas_filter": settings.min_ventas,
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
