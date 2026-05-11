from __future__ import annotations

import asyncio
import json
import os
import random
from datetime import datetime, timezone


from .calculator import MarginCalculator
from .config import settings, CATEGORY_ROTATION_SIZE
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


def _warn_if_stale(output_path: str) -> None:
    """Avisa si el JSON existente tiene más de 48 horas de antigüedad."""
    if not os.path.exists(output_path):
        return
    try:
        with open(output_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        scraped_at_str = data.get("metadata", {}).get("scraped_at")
        if scraped_at_str:
            scraped_at = datetime.fromisoformat(scraped_at_str)
            age_h = (datetime.now(timezone.utc) - scraped_at).total_seconds() / 3600
            if age_h > 48:
                print(f"⚠️  DATOS DESACTUALIZADOS: el JSON tiene {age_h:.1f} h de antigüedad (> 48 h).")
            else:
                print(f"ℹ️  Datos anteriores: {age_h:.1f} h de antigüedad.")
    except Exception:
        pass


async def run() -> None:
    _ensure_parent_dir(settings.output_json_path)
    _warn_if_stale(settings.output_json_path)

    all_urls = settings.get_seed_urls()
    # Rotación aleatoria: elegimos CATEGORY_ROTATION_SIZE categorías distintas por ejecución.
    seed_urls = random.sample(all_urls, min(CATEGORY_ROTATION_SIZE, len(all_urls)))
    print(f"Categorías elegidas ({len(seed_urls)}/{len(all_urls)}): {seed_urls}")

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
    # Descartamos items que probablemente ya no tienen stock o son errores de parsing:
    # precio 0 / negativo indica placeholder; margen negativo no aporta valor al usuario.
    before = len(all_items)
    all_items = [p for p in all_items if p.precio_actual > 0]
    print(f"Total sin duplicados: {len(all_items)} (descartados {before - len(all_items)} sin precio)")

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

    # Eliminamos productos con margen negativo (sin stock real o con precio mal parseado).
    enriched = [p for p in enriched if p.margen_neto_clasico_ars > 0]
    print(f"Con margen positivo: {len(enriched)}")

    items_out = [_model_dump_json_dict(x) for x in enriched]

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
