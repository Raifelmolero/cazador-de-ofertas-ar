from __future__ import annotations

from typing import Optional, Union

from pydantic import BaseModel, Field, HttpUrl


VentasEstimadas = Union[int, str]


class ProductItem(BaseModel):
    """
    Item base extraído del listado de Mercado Libre.

    Nota: En listados, a veces no existe ID ML visible. En esos casos:
    - intentamos inferirlo desde la URL del producto
    - o dejamos un id derivado (hash/slug) si no se puede inferir
    """

    id_ml: str = Field(..., description="ID del ítem en Mercado Libre (ej. MLA123...)")
    titulo: str
    categoria_principal: str = Field(..., description="Categoría principal inferida o extraída")
    precio_actual: float
    moneda: str = Field(..., description="ARS, USD, etc.")
    ventas_estimadas: Optional[VentasEstimadas] = Field(
        default=None,
        description="Estimación de ventas (si se puede inferir del listing).",
    )
    url_producto: HttpUrl
    url_imagen: Optional[HttpUrl] = None


class ProductWithMargins(ProductItem):
    """
    Item enriquecido con cálculos de márgenes.
    """

    comision_clasica_pct: float
    comision_premium_pct: float
    retencion_iibb_pct: float
    costo_envio_base_ars: float

    margen_neto_clasico_ars: float
    margen_neto_premium_ars: float

