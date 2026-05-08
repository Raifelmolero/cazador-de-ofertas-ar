from __future__ import annotations

import os
from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    """
    Configuración centralizada (env vars + defaults).

    Ajustá estas variables vía entorno o editando defaults.
    """

    # Mercado Libre AR
    ml_base_url: str = os.getenv("ML_BASE_URL", "https://www.mercadolibre.com.ar")

    # URL "semilla" para extraer productos.
    # Suele ser más estable scrapear desde un resultado de búsqueda que desde módulos dinámicos.
    # Probá con distintas queries (ej. "tendencias", "mas vendidos", "ofertas").
    seed_search_url: str = os.getenv(
        "ML_SEED_SEARCH_URL",
        "https://listado.mercadolibre.com.ar/tendencias",
    )

    # Playwright
    headless: bool = os.getenv("HEADLESS", "1") not in {"0", "false", "False"}
    navigation_timeout_ms: int = int(os.getenv("NAV_TIMEOUT_MS", "45000"))
    max_products: int = int(os.getenv("MAX_PRODUCTS", "50"))
    max_pages: int = int(os.getenv("MAX_PAGES", "5"))

    # Anti-baneo / throttling (muy importante)
    min_delay_s: float = float(os.getenv("MIN_DELAY_S", "0.8"))
    max_delay_s: float = float(os.getenv("MAX_DELAY_S", "2.2"))

    # Output
    output_json_path: str = os.getenv(
        "OUTPUT_JSON_PATH",
        os.path.join("data", "productos_rentables.json"),
    )


settings = Settings()

