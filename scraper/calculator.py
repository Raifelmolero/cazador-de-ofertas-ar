from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class MarginResult:
    margen_neto_clasico_ars: float
    margen_neto_premium_ars: float
    comision_clasica_pct: float
    comision_premium_pct: float
    retencion_iibb_pct: float
    costo_envio_base_ars: float


class MarginCalculator:
    """
    Calculadora simple y ajustable de márgenes.

    Importante: Esto NO modela costos reales (producto, ads, devoluciones, etc.).
    Es un estimador inicial para programmatic SEO.
    """

    COMISION_CLASICA_PCT = 0.15
    COMISION_PREMIUM_PCT = 0.30
    RETENCION_IIBB_PCT = 0.03
    COSTO_ENVIO_BASE_ARS = 8000.0
    UMBRAL_ENVIO_GRATIS_ARS = 30000.0

    @staticmethod
    def calcular(precio_ars: float) -> MarginResult:
        """
        Retorna margen neto esperado (en ARS) para comisiones Clásica y Premium.

        Supuestos:
        - Comisión se aplica sobre el precio.
        - IIBB se aplica sobre el precio (aprox).
        - Costo de envío base sólo se descuenta si el producto supera el umbral de "envío gratis".
        """

        if precio_ars < 0:
            raise ValueError("precio_ars no puede ser negativo")

        envio = MarginCalculator.COSTO_ENVIO_BASE_ARS if precio_ars >= MarginCalculator.UMBRAL_ENVIO_GRATIS_ARS else 0.0

        iibb = precio_ars * MarginCalculator.RETENCION_IIBB_PCT
        com_clasica = precio_ars * MarginCalculator.COMISION_CLASICA_PCT
        com_premium = precio_ars * MarginCalculator.COMISION_PREMIUM_PCT

        margen_clasico = precio_ars - com_clasica - iibb - envio
        margen_premium = precio_ars - com_premium - iibb - envio

        return MarginResult(
            margen_neto_clasico_ars=float(round(margen_clasico, 2)),
            margen_neto_premium_ars=float(round(margen_premium, 2)),
            comision_clasica_pct=MarginCalculator.COMISION_CLASICA_PCT,
            comision_premium_pct=MarginCalculator.COMISION_PREMIUM_PCT,
            retencion_iibb_pct=MarginCalculator.RETENCION_IIBB_PCT,
            costo_envio_base_ars=envio,
        )

