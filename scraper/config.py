from __future__ import annotations

import os
from dataclasses import dataclass

# Categorías 'hot' (ticket alto → mejor comisión). Siempre incluidas en cada ejecución.
HOT_SEED_URLS: list[str] = [
    "https://listado.mercadolibre.com.ar/celulares-telefonos/",
    "https://listado.mercadolibre.com.ar/consolas-videojuegos/",
    "https://listado.mercadolibre.com.ar/computacion/",
]

# Pool rotativo — se elige CATEGORY_ROTATION_SIZE al azar en cada ejecución.
DEFAULT_SEED_URLS: list[str] = [
    "https://listado.mercadolibre.com.ar/herramientas/",
    "https://listado.mercadolibre.com.ar/electrodomesticos/",
    "https://listado.mercadolibre.com.ar/belleza-y-cuidado-personal/",
    "https://listado.mercadolibre.com.ar/hogar-muebles-jardin/",
    "https://listado.mercadolibre.com.ar/deportes-y-fitness/",
    "https://listado.mercadolibre.com.ar/electronica/",
    "https://listado.mercadolibre.com.ar/ropa-calzado-accesorios/",
    "https://listado.mercadolibre.com.ar/juegos-juguetes/",
    "https://listado.mercadolibre.com.ar/bebes/",
    "https://listado.mercadolibre.com.ar/musica-peliculas-series/",
]

# Cuántas categorías del pool rotativo usar por ejecución.
CATEGORY_ROTATION_SIZE: int = 2

# Máximo de productos aceptados por URL de categoría (evita inundar con una sola subcategoría).
PER_CATEGORY_LIMIT: int = 15


@dataclass(frozen=True)
class Settings:
    """
    Configuración centralizada (env vars + defaults).
    """

    # Mercado Libre AR
    ml_base_url: str = os.getenv("ML_BASE_URL", "https://www.mercadolibre.com.ar")

    # URLs semilla separadas por coma. Si está vacío, usa DEFAULT_SEED_URLS.
    seed_search_urls_csv: str = os.getenv("ML_SEED_SEARCH_URLS", "")

    # Playwright
    headless: bool = os.getenv("HEADLESS", "1") not in {"0", "false", "False"}
    navigation_timeout_ms: int = int(os.getenv("NAV_TIMEOUT_MS", "45000"))
    max_products: int = int(os.getenv("MAX_PRODUCTS", "500"))
    max_pages: int = int(os.getenv("MAX_PAGES", "5"))

    # Anti-baneo / throttling
    min_delay_s: float = float(os.getenv("MIN_DELAY_S", "0.8"))
    max_delay_s: float = float(os.getenv("MAX_DELAY_S", "2.2"))

    # Filtro: solo muestra productos que ML marca como "MÁS VENDIDO" (badge).
    # 1 = solo badgeados, 0 = sin filtro (todos los resultados).
    min_ventas: int = int(os.getenv("MIN_VENTAS", "1"))

    # Afiliados — Mercado Libre Partners
    ml_affiliate_id: str = os.getenv("ML_AFFILIATE_ID", "")

    # Output
    output_json_path: str = os.getenv(
        "OUTPUT_JSON_PATH",
        os.path.join("frontend", "data", "productos_rentables.json"),
    )

    def get_seed_urls(self) -> list[str]:
        if self.seed_search_urls_csv.strip():
            return [u.strip() for u in self.seed_search_urls_csv.split(",") if u.strip()]
        # Hot categories siempre presentes; más N rotativas aleatorias del pool.
        import random as _random
        rotativas = _random.sample(DEFAULT_SEED_URLS, min(CATEGORY_ROTATION_SIZE, len(DEFAULT_SEED_URLS)))
        return HOT_SEED_URLS + rotativas


settings = Settings()
