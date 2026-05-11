from __future__ import annotations

import asyncio
import os
import random
import re
import time
from dataclasses import dataclass
from typing import Callable, Optional
from urllib.parse import urlparse

from playwright.async_api import Browser, Error, Frame, Page, async_playwright

from .config import Settings
from .models import ProductItem


USER_AGENTS: list[str] = [
    # Rotá UAs realistas (desktop). Podés agregar más.
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
]


def _rand_viewport() -> dict:
    widths = [1280, 1366, 1440, 1536, 1600, 1920]
    heights = [720, 768, 800, 900, 1080]
    return {"width": random.choice(widths), "height": random.choice(heights)}


def _parse_ventas(text: str) -> Optional[int]:
    """Parsea '+50 vendidos', '1.000+ vendidos', '50 vendidos', etc. → int."""
    if not text:
        return None
    cleaned = text.strip().lower().replace(".", "").replace(",", "").replace("+", "")
    m = re.search(r"(\d+)", cleaned)
    return int(m.group(1)) if m else None


def _infer_ml_id_from_url(url: str) -> Optional[str]:
    # Ejemplos comunes: ".../MLA-123456789..." o ".../MLA123456789..."
    m = re.search(r"(MLA[-]?\d{6,})", url, flags=re.IGNORECASE)
    return m.group(1).upper().replace("-", "") if m else None


def _normalize_price_to_float(text: str) -> Optional[float]:
    """
    Convierte strings tipo '$ 32.990' / '32.990' / '32,990' a float (ARS).
    """
    if not text:
        return None
    t = text.strip()
    t = t.replace("\u00a0", " ")
    t = re.sub(r"[^\d,\.]", "", t)
    if not t:
        return None
    # En AR suele usarse punto para miles y coma para decimales, pero ML frecuentemente es entero.
    # Regla simple: si hay coma y punto, asumimos punto=miles, coma=decimales.
    if "," in t and "." in t:
        t = t.replace(".", "").replace(",", ".")
    else:
        # si sólo hay puntos, asumimos miles
        if t.count(".") >= 1 and "," not in t:
            t = t.replace(".", "")
        # si sólo hay coma, asumimos decimales (poco común acá)
        if "," in t and "." not in t:
            t = t.replace(",", ".")
    try:
        return float(t)
    except ValueError:
        return None


@dataclass
class ScrapeResult:
    items: list[ProductItem]
    source_url: str


class MLScraper:
    """
    Scraper asíncrono de listados de Mercado Libre Argentina.

    Anti-detección básico:
    - User-Agent rotativo
    - viewport aleatorio
    - `navigator.webdriver` false via init_script
    - pausas aleatorias entre acciones

    Nota: Para resiliencia real ante baneos, se suele sumar:
    - proxies rotativos (residencial/datacenter)
    - fingerprints más completos
    - reintentos con backoff
    - manejo de captchas / bloqueos
    """

    def __init__(self, settings: Settings):
        self.settings = settings
        self._browser: Optional[Browser] = None
        self._playwright = None

    async def __aenter__(self) -> "MLScraper":
        self._playwright = await async_playwright().start()
        # --no-sandbox is required when running as root on Linux CI (GitHub Actions).
        launch_args = ["--no-sandbox", "--disable-setuid-sandbox"] if os.getenv("CI") else []
        self._browser = await self._playwright.chromium.launch(
            headless=self.settings.headless, args=launch_args
        )
        return self

    async def __aexit__(self, exc_type, exc, tb) -> None:
        if self._browser:
            await self._browser.close()
        if self._playwright:
            await self._playwright.stop()

    async def _new_page(self) -> Page:
        assert self._browser is not None
        ua = random.choice(USER_AGENTS)
        viewport = _rand_viewport()

        context = await self._browser.new_context(
            user_agent=ua,
            viewport=viewport,
            locale="es-AR",
            timezone_id="America/Argentina/Buenos_Aires",
        )
        context.set_default_navigation_timeout(self.settings.navigation_timeout_ms)
        context.set_default_timeout(self.settings.navigation_timeout_ms)

        # Reduce señales de automatización (básico).
        await context.add_init_script(
            """
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
            """
        )

        page = await context.new_page()
        return page

    async def _jitter(self) -> None:
        await asyncio.sleep(random.uniform(self.settings.min_delay_s, self.settings.max_delay_s))

    async def _try_networkidle(self, page: Page, timeout_ms: int = 12000) -> None:
        """
        ML mantiene conexiones abiertas: `networkidle` a veces nunca llega.
        Si no se cumple dentro del timeout, seguimos sin fallar (mejor que esperar eternamente).
        """
        try:
            await page.wait_for_load_state("networkidle", timeout=timeout_ms)
        except Error:
            return

    def _attach_main_frame_navigation_clock(self, page: Page) -> tuple[dict[str, float], Callable[[], None]]:
        """
        Registra navegaciones del frame principal antes de operaciones que redirigen.

        IMPORTANTE: el listener debe existir antes de `page.goto(...)`, clicks de paginación, etc.,
        porque ML encadena redirects y SPA navigations rápidamente.
        """
        clock = {"t": time.monotonic()}

        def bump(frame: Frame) -> None:
            if frame == page.main_frame:
                clock["t"] = time.monotonic()

        page.on("framenavigated", bump)

        def detach() -> None:
            try:
                page.remove_listener("framenavigated", bump)
            except Exception:
                pass

        return clock, detach

    async def _wait_until_navigation_idle(
        self,
        page: Page,
        clock: dict[str, float],
        *,
        idle_s: float,
        max_wait_s: float,
    ) -> None:
        """
        Espera ~`idle_s` sin navegaciones en el frame principal, luego `load`.
        """
        deadline = time.monotonic() + min(max_wait_s, self.settings.navigation_timeout_ms / 1000)
        while time.monotonic() < deadline:
            await asyncio.sleep(0.12)
            if time.monotonic() - clock["t"] >= idle_s:
                await page.wait_for_load_state("load")
                return

        # Si no llegó a idle (sitio muy nervioso), por lo menos garantizamos un `load`.
        await page.wait_for_load_state("load")

    async def _goto_listing_then_settle(self, page: Page, url_str: str) -> None:
        clock, detach = self._attach_main_frame_navigation_clock(page)
        try:
            await page.goto(url_str, wait_until="load")
            await self._wait_until_navigation_idle(page, clock, idle_s=1.35, max_wait_s=28.0)
            await page.wait_for_load_state("load")
            await self._try_networkidle(page)
        finally:
            detach()

    async def _wait_until_listing_ready(self, page: Page, selectors: list[str]) -> str:
        """
        Hasta que aparezcan cards de resultado tras la última carga estable.
        Devuelve el selector que funcionó.
        """
        deadline = time.monotonic() + min(40.0, self.settings.navigation_timeout_ms / 1000)
        last_exc: Optional[BaseException] = None
        while time.monotonic() < deadline:
            for sel in selectors:
                try:
                    await page.wait_for_selector(sel, state="attached", timeout=14000)
                    await page.wait_for_load_state("load")
                    await asyncio.sleep(0.25)
                    await page.wait_for_selector(sel, state="attached", timeout=10000)
                    return sel
                except Error as exc:
                    last_exc = exc
                except asyncio.CancelledError:
                    raise
                except BaseException as exc:
                    last_exc = exc
            await asyncio.sleep(0.35)
        raise RuntimeError(
            "No apareció ningún listado conocido. Ajustá SELECTOR_RESULT_CARD_CANDIDATES en ml_scraper.py. "
            f"Último error: {last_exc}"
        )

    async def _query_selector_all_resilient(self, page: Page, selector: str, attempts: int = 5) -> list:
        for _ in range(attempts):
            try:
                return await page.query_selector_all(selector)
            except Error as exc:
                msg = str(exc).lower()
                if "destroyed" not in msg and "navigation" not in msg:
                    raise
                await page.wait_for_load_state("load")
                await asyncio.sleep(0.2)
                clock, detach = self._attach_main_frame_navigation_clock(page)
                try:
                    await page.wait_for_load_state("load")
                    await asyncio.sleep(0.2)
                    await self._wait_until_navigation_idle(page, clock, idle_s=0.85, max_wait_s=14.0)
                    await page.wait_for_selector(selector, state="attached", timeout=22000)
                finally:
                    detach()
        return []

    async def extraer_listado(self, url: str) -> ScrapeResult:
        """
        Navega a `url` y extrae hasta `max_products` items con ventas reales.

        IMPORTANTE: Los selectores cambian seguido en ML.
        - Ajustá `SELECTOR_*` (idealmente usando `data-testid` / atributos estables).
        - Si ML muestra interstitials/cookies, agregá un handler acá.
        """

        page = await self._new_page()

        await self._goto_listing_then_settle(page, url)

        items: list[ProductItem] = []

        # =========================
        # SELECTORES (AJUSTABLES)
        # =========================
        # Consejo: preferí `data-testid` cuando existan.
        # En listados de ML suele haber contenedores tipo:
        # - li.ui-search-layout__item
        # - div.ui-search-result__wrapper
        SELECTOR_RESULT_CARD_CANDIDATES = [
            "li.ui-search-layout__item",
            ".ui-search-layout__item",
            "section.ui-search-results .ui-search-layout__item",
        ]
        SELECTOR_TITLE = "h2"
        SELECTOR_PRODUCT_LINK_PRIMARY = (
            "a.poly-component__title, "
            ".poly-card a.poly-component__title, "
            "h2.poly-component__title-wrapper a, "
            "h2.ui-search-item__group__element a, "
            "a.ui-search-item__group__element--title, "
            "a[href*='/p/'], "
            "a[href*='articulo.mercadolibre'], "
            "a[href*='MLA'], "
            "a[href*='mla']"
        )
        SELECTOR_LINK_FALLBACK = "a[href*='mercadolibre.com.ar']:not([href*='click1'])"
        SELECTOR_PRICE = "span.andes-money-amount__fraction, .andes-money-amount .andes-money-amount__fraction"
        SELECTOR_CURRENCY = "span.andes-money-amount__currency-symbol"
        SELECTOR_IMG = "img"
        SELECTOR_BREADCRUMB_CATEGORY = "ol.andes-breadcrumb__list li a"
        SELECTOR_NEXT = "a[title='Siguiente'], a.andes-pagination__link[aria-label*='Siguiente']"
        # Ventas estimadas — ML muestra "X vendidos" en distintos formatos según versión del polycard
        SELECTOR_SOLD_CANDIDATES = [
            "span.poly-component__sold",
            ".poly-component__sold-and-reviews span",
            ".ui-search-item__sold",
            "span[class*='sold']",
        ]

        SELECTOR_RESULT_CARD = await self._wait_until_listing_ready(page, SELECTOR_RESULT_CARD_CANDIDATES)
        await self._jitter()

        async def extract_from_current_page() -> None:
            cards = await self._query_selector_all_resilient(page, SELECTOR_RESULT_CARD)
            for card in cards:
                if len(items) >= self.settings.max_products:
                    break

                title_el = await card.query_selector(SELECTOR_TITLE)
                link_el = await card.query_selector(SELECTOR_PRODUCT_LINK_PRIMARY)

                if not link_el:
                    links = await card.query_selector_all(SELECTOR_LINK_FALLBACK)
                    for cand in links:
                        href_c = await cand.get_attribute("href")
                        if href_c and (
                            "/p/" in href_c or "MLA" in href_c.upper() or "articulo" in href_c.lower()
                        ):
                            link_el = cand
                            break
                    if not link_el and links:
                        link_el = links[0]

                if not link_el:
                    continue

                titulo = ""
                if title_el:
                    titulo = (await title_el.inner_text()).strip()
                if not titulo:
                    titulo = (await link_el.inner_text()).strip()

                href = await link_el.get_attribute("href")
                if not href:
                    continue

                # Normalizamos URL (muchas vienen con tracking).
                # Si href es relativo, lo resolvemos contra base_url.
                if href.startswith("/"):
                    url_producto = f"{self.settings.ml_base_url}{href}"
                else:
                    url_producto = href

                # Extraemos el MLA ID antes de transformar la URL.
                id_ml = (
                    _infer_ml_id_from_url(url_producto)
                    or re.sub(r"\W+", "", urlparse(url_producto).path)[-24:]
                    or url_producto
                )

                # Las URLs click1.mercadolibre.com.ar son redirects internos de ML:
                # si añadimos matt_tool ahí, se pierde al redirigir al producto final.
                # Cuando tenemos el MLA ID construimos la URL directa del artículo.
                if "click1.mercadolibre.com.ar" in url_producto and re.match(r"^MLA\d+$", id_ml):
                    url_producto = f"https://articulo.mercadolibre.com.ar/{id_ml[:3]}-{id_ml[3:]}"

                # Inyectamos el ID de afiliado sobre la URL final del producto.
                # El parámetro debe quedar en el query string (antes del #),
                # no en el fragmento — el servidor ML nunca recibe lo que va después de #.
                if self.settings.ml_affiliate_id:
                    if "#" in url_producto:
                        base, fragment = url_producto.split("#", 1)
                        sep = "&" if "?" in base else "?"
                        url_producto = f"{base}{sep}matt_tool={self.settings.ml_affiliate_id}#{fragment}"
                    else:
                        sep = "&" if "?" in url_producto else "?"
                        url_producto = f"{url_producto}{sep}matt_tool={self.settings.ml_affiliate_id}"

                currency_el = await card.query_selector(SELECTOR_CURRENCY)
                currency_symbol = (await currency_el.inner_text()).strip() if currency_el else "$"
                moneda = "ARS" if currency_symbol == "$" else currency_symbol

                price_el = await card.query_selector(SELECTOR_PRICE)
                precio = _normalize_price_to_float((await price_el.inner_text()).strip() if price_el else "")
                if precio is None:
                    continue

                img_el = await card.query_selector(SELECTOR_IMG)
                img = await img_el.get_attribute("src") if img_el else None
                if img and img.startswith("data:"):
                    alt = await img_el.get_attribute("data-src") if img_el else None
                    img = alt or img

                        # Ventas estimadas — ML no expone conteo en listados.
                # Usamos el badge "MÁS VENDIDO" (poly-component__float-highlight)
                # como señal: 1 = ML lo marca como más vendido, None = sin badge.
                ventas_estimadas: Optional[int] = None
                badge_el = await card.query_selector("span.poly-component__float-highlight")
                if badge_el:
                    ventas_estimadas = 1

                # Categoría principal (best-effort).
                # Ajuste típico: breadcrumb o chips; si falla, "desconocida".
                categoria_principal = "desconocida"
                bc = await page.query_selector_all(SELECTOR_BREADCRUMB_CATEGORY)
                if bc:
                    try:
                        categoria_principal = (await bc[-1].inner_text()).strip()
                    except Error:
                        pass

                try:
                    item = ProductItem(
                        id_ml=id_ml,
                        titulo=titulo,
                        categoria_principal=categoria_principal,
                        precio_actual=float(precio),
                        moneda=moneda,
                        ventas_estimadas=ventas_estimadas,
                        url_producto=url_producto,
                        url_imagen=img,
                    )
                    items.append(item)
                except Exception:
                    # Si algún campo falla validación, omitimos ese card.
                    continue

        # Paginación: después de navegar esperamos nueva carga y ventana estable.
        for _ in range(self.settings.max_pages):
            await extract_from_current_page()
            if len(items) >= self.settings.max_products:
                break

            next_el = await page.query_selector(SELECTOR_NEXT)
            if not next_el:
                break

            await self._jitter()
            clock_p, detach_p = self._attach_main_frame_navigation_clock(page)
            try:
                await next_el.click()
                await page.wait_for_load_state("load")
                await self._wait_until_navigation_idle(page, clock_p, idle_s=1.0, max_wait_s=22.0)
                await page.wait_for_load_state("load")
                await self._try_networkidle(page)
                await page.wait_for_selector(SELECTOR_RESULT_CARD, state="attached", timeout=22000)
            except Error:
                break
            except Exception:
                break
            finally:
                detach_p()

            await self._jitter()

        await page.context.close()
        return ScrapeResult(items=items[: self.settings.max_products], source_url=url)

