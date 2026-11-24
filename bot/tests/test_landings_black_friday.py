"""Landings de Black Friday de ticket alto (frontend/lib/black-friday-landings.ts).

Fija las reglas del pedido del 23/11/2026: solo productos que existen en los
datos del repo, sin marcas BGH ni HP/OMEN/Victus, sin % de descuento, precio
tachado, «mínimo histórico» ni cupones, la IdeaPad Slim 3 primera en notebooks
y títulos/descripciones que entran en Google.
"""
import json
import re
import shutil
import subprocess
import unittest
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
FRONT = RAIZ / "frontend"
LANDINGS = FRONT / "lib" / "black-friday-landings.ts"
COMPONENTE = FRONT / "components" / "black-friday" / "LandingBF.tsx"
CATALOGO = FRONT / "data" / "productos_rentables.json"
AIRES = FRONT / "lib" / "mejor-aires.ts"

PROHIBIDAS = re.compile(r"\b(bgh|hp|omen|victus)\b", re.I)


def _bloques(src: str) -> dict[str, str]:
    """slug -> texto de su bloque en LANDINGS_BF."""
    partes = re.split(r"\n  \{\n    slug: '", src)
    out = {}
    for p in partes[1:]:
        slug = p.split("'", 1)[0]
        out[slug] = p
    return out


class TestLandingsBlackFriday(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.src = LANDINGS.read_text(encoding="utf-8")
        cls.comp = COMPONENTE.read_text(encoding="utf-8")
        cls.bloques = _bloques(cls.src)
        items = json.loads(CATALOGO.read_text(encoding="utf-8"))["items"]
        cls.catalogo = {p["id_ml"]: p for p in items}
        cls.aires = set(re.findall(r"id: '(MLA\d+)'", AIRES.read_text(encoding="utf-8")))

    def test_estan_las_cuatro(self):
        for slug in (
            "black-friday-notebooks",
            "black-friday-celulares",
            "black-friday-smart-tv",
            "black-friday-aires-acondicionados",
            "black-friday-lavarropas",
            "black-friday-cafeteras",
            "black-friday-heladeras",
            "black-friday-celulares-baratos",
            "black-friday-gaming",
        ):
            self.assertIn(slug, self.bloques)

    def test_ideapad_primera_en_notebooks(self):
        ids = re.findall(r"id: '(MLA\d+)'", self.bloques["black-friday-notebooks"])
        self.assertEqual(ids[0], "MLA77766168")
        p = self.catalogo.get("MLA77766168")
        if p:  # el bot poda a los 14 días: si sigue, tiene que ser la de 16/512
            self.assertIn("Ideapad Slim 3", p["titulo"])
            self.assertEqual(int(p["precio_actual"]), 1573949)

    def test_productos_del_repo_y_sin_marcas_prohibidas(self):
        for slug, b in self.bloques.items():
            ids = re.findall(r"id: '(MLA\d+)'", b)
            self.assertGreaterEqual(len(ids), 4, slug)
            for i in ids:
                p = self.catalogo.get(i)
                if p is None:
                    # Fuera del catálogo solo valen los aires verificados a mano.
                    self.assertIn(i, self.aires, f"{slug}: {i} no está en los datos del repo")
                    continue
                self.assertNotRegex(p["titulo"], PROHIBIDAS, f"{slug}: {i}")
                self.assertIn("matt_tool=37267219", p["url_producto"], i)
        for nombre in re.findall(r"nombre: '([^']+)'", self.src):
            self.assertNotRegex(nombre, PROHIBIDAS)

    def test_sin_descuentos_tachados_minimos_ni_cupones(self):
        texto = (self.src + self.comp).lower()
        # Los comentarios explican la regla: se miran solo los textos y el JSX.
        sin_comentarios = re.sub(r"//.*", "", texto)
        for prohibido in ("% off", "descuento_pct", "precio_anterior", "line-through", "minimo_historico",
                          "mínimo histórico", "minimo historico", "cupón", "cupones de", "cupones-mercado-libre"):
            self.assertNotIn(prohibido, sin_comentarios, prohibido)
        self.assertNotRegex(sin_comentarios, r"\d+\s*%")

    def test_seo(self):
        for slug, b in self.bloques.items():
            titulo = re.search(r"titulo: '([^']+)'", b).group(1)
            desc = re.search(r"descripcion:\s*'([^']+)'", b).group(1)
            self.assertLessEqual(len(titulo), 65, slug)
            self.assertLessEqual(len(desc), 158, slug)
            self.assertIn("black friday 2026", titulo.lower(), slug)
            self.assertIn("argentina", titulo.lower(), slug)
        kws = re.search(r"keywords: \[([^\]]+)\]", self.bloques["black-friday-notebooks"]).group(1)
        self.assertIn("black friday 2026 notebooks argentina", kws)

    def test_boton_ver_en_mercado_libre(self):
        self.assertIn("Ver en Mercado Libre", self.comp)
        self.assertIn("pulgar.webp", self.comp)  # Don Ofertín
        self.assertIn('<Footer brand="ofertas" sinCupones />', self.comp)  # sin el link a cupones del footer

    def test_boton_principal_con_link_de_afiliado(self):
        # El botón grande de arriba abre el link del recomendado (no la búsqueda) y
        # productosBF descarta los productos sin link de afiliado.
        self.assertRegex(self.comp, r"href=\{principal\.url\}[\s\S]{0,800}Ver en Mercado Libre")
        self.assertIn("esLinkAfiliado(p ? p.url_producto : a?.url)", self.src)
        self.assertIn("'37267219'", self.src)


class TestLavarropasCafeterasBF(unittest.TestCase):
    """/mejores/black-friday-lavarropas y -cafeteras (SEO quick wins del 24/11/2026):
    reciben el 308 de su /mejores/cyber-monday-* y están en sitemap, llms.txt y /black-friday."""

    SLUGS = ("black-friday-lavarropas", "black-friday-cafeteras")

    @classmethod
    def setUpClass(cls):
        cls.bloques = _bloques(LANDINGS.read_text(encoding="utf-8"))
        items = json.loads(CATALOGO.read_text(encoding="utf-8"))["items"]
        cls.catalogo = {p["id_ml"]: p for p in items}

    def test_estan_y_son_del_rubro(self):
        palabra = {"black-friday-lavarropas": r"(?i)lava(seca)?rropas", "black-friday-cafeteras": r"(?i)cafetera"}
        for slug in self.SLUGS:
            self.assertIn(slug, self.bloques)
            for i in re.findall(r"id: '(MLA\d+)'", self.bloques[slug]):
                p = self.catalogo.get(i)
                if p:  # el bot poda a los 14 días: la página saltea los que ya no están
                    self.assertRegex(p["titulo"], palabra[slug], i)

    def test_titulos_60_y_descripcion_158(self):
        for slug in self.SLUGS + ("black-friday-aires-acondicionados", "black-friday-smart-tv"):
            b = self.bloques[slug]
            self.assertLessEqual(len(re.search(r"titulo: '([^']+)'", b).group(1)), 60, slug)
            self.assertLessEqual(len(re.search(r"descripcion:\s*'([^']+)'", b).group(1)), 158, slug)

    def test_redirects_cyber_a_su_landing(self):
        conf = (FRONT / "next.config.mjs").read_text(encoding="utf-8")
        rubros = re.search(r"const rubrosBF = \[([^\]]+)\]", conf).group(1)
        for r in ("aires-acondicionados", "lavarropas", "cafeteras"):
            self.assertIn(f"'{r}'", rubros)
        self.assertIn("[`/mejores/cyber-monday-${r}`, `/mejores/black-friday-${r}`]", conf)

    def test_sitemap_llms_y_black_friday(self):
        comp = (FRONT / "lib" / "comparativas.ts").read_text(encoding="utf-8")
        perennes = comp.split("const PERENNES")[1].split("])")[0]
        llms = (FRONT / "app" / "llms.txt" / "route.ts").read_text(encoding="utf-8")
        for slug in self.SLUGS:
            self.assertIn(f"slug: '{slug}'", comp)  # generateStaticParams, sitemap y OG
            self.assertIn(f"'{slug}'", perennes)
            self.assertIn(f"/mejores/{slug})", llms)
        self.assertIn("LANDINGS_BF.map", (FRONT / "app" / "black-friday" / "page.tsx").read_text(encoding="utf-8"))

    def test_guia_de_lavarropas_ida_y_vuelta(self):
        self.assertIn("/guias/mejores-lavarropas-black-friday-2026", self.bloques["black-friday-lavarropas"])
        guia = (FRONT / "lib" / "guias-tecno.ts").read_text(encoding="utf-8")
        self.assertIn("href: '/mejores/black-friday-lavarropas'", guia)


class TestBicicletasBF(unittest.TestCase):
    """Landing corta /mejores/black-friday-bicicletas (pedido del 23/11/2026)."""

    @classmethod
    def setUpClass(cls):
        cls.bloques = _bloques(LANDINGS.read_text(encoding="utf-8"))
        items = json.loads(CATALOGO.read_text(encoding="utf-8"))["items"]
        cls.catalogo = {p["id_ml"]: p for p in items}

    def test_battle_primera_y_todas_r29(self):
        b = self.bloques["black-friday-bicicletas"]
        ids = re.findall(r"id: '(MLA\d+)'", b)
        self.assertEqual(ids[0], "MLA53194352")
        for i in ids:
            p = self.catalogo.get(i)
            if p:
                self.assertRegex(p["titulo"], r"(?i)\b(r29|rodado 29)\b", i)
                self.assertIn("bicicleta", p["titulo"].lower(), i)

    def test_titulo_60_y_en_comparativas(self):
        b = self.bloques["black-friday-bicicletas"]
        self.assertLessEqual(len(re.search(r"titulo: '([^']+)'", b).group(1)), 60)
        comp = (FRONT / "lib" / "comparativas.ts").read_text(encoding="utf-8")
        self.assertIn("slug: 'black-friday-bicicletas'", comp)  # generateStaticParams, sitemap y OG
        self.assertIn("'black-friday-bicicletas'", comp.split("const PERENNES")[1].split("])")[0])

    def test_enlazada_desde_black_friday(self):
        # /black-friday arma los botones por rubro con LANDINGS_BF.
        self.assertIn("LANDINGS_BF.map", (FRONT / "app" / "black-friday" / "page.tsx").read_text(encoding="utf-8"))


class TestHeladerasCelularesBaratosGamingBF(unittest.TestCase):
    """Landings /mejores/black-friday-heladeras, -celulares-baratos (hasta $400.000) y -gaming
    (pedido del 23/11/2026): productos del rubro, FAQ de 4 a 6, en sitemap y llms.txt."""

    SLUGS = ("black-friday-heladeras", "black-friday-celulares-baratos", "black-friday-gaming")

    @classmethod
    def setUpClass(cls):
        cls.bloques = _bloques(LANDINGS.read_text(encoding="utf-8"))
        items = json.loads(CATALOGO.read_text(encoding="utf-8"))["items"]
        cls.catalogo = {p["id_ml"]: p for p in items}

    def test_estan_y_son_del_rubro(self):
        palabra = {
            "black-friday-heladeras": r"(?i)^heladera",
            "black-friday-celulares-baratos": r"(?i)(celular|galaxy|moto g|redmi)",
            "black-friday-gaming": r"(?i)(pc gamer|monitor gamer|gamer|lenovo loq)",
        }
        for slug in self.SLUGS:
            self.assertIn(slug, self.bloques)
            for i in re.findall(r"id: '(MLA\d+)'", self.bloques[slug]):
                p = self.catalogo.get(i)
                if p:  # el bot poda a los 14 días: la página saltea los que ya no están
                    self.assertRegex(p["titulo"], palabra[slug], i)
                    self.assertNotRegex(p["titulo"], r"(?i)\blikon\b", i)

    def test_celulares_baratos_hasta_400_mil(self):
        for i in re.findall(r"id: '(MLA\d+)'", self.bloques["black-friday-celulares-baratos"]):
            p = self.catalogo.get(i)
            if p:
                self.assertLessEqual(p["precio_actual"], 400000, i)

    def test_faq_entre_4_y_6(self):
        for slug in self.SLUGS:
            faq = self.bloques[slug].split("faq: [")[1].split("\n    ],")[0]
            self.assertIn(len(re.findall(r"\{ q: '", faq)), range(4, 7), slug)

    def test_sitemap_llms_y_black_friday(self):
        comp = (FRONT / "lib" / "comparativas.ts").read_text(encoding="utf-8")
        perennes = comp.split("const PERENNES")[1].split("])")[0]
        llms = (FRONT / "app" / "llms.txt" / "route.ts").read_text(encoding="utf-8")
        for slug in self.SLUGS:
            self.assertIn(f"slug: '{slug}'", comp)  # generateStaticParams, sitemap y OG
            self.assertIn(f"'{slug}'", perennes)
            self.assertIn(f"/mejores/{slug})", llms)
        self.assertIn("LANDINGS_BF.map", (FRONT / "app" / "black-friday" / "page.tsx").read_text(encoding="utf-8"))

    def test_boton_con_tracking_por_landing(self):
        # bf_<slug>_boton: el botón grande de arriba de cada landing.
        self.assertIn("data-seccion={`bf_${l.slug}_boton`}", COMPONENTE.read_text(encoding="utf-8"))


class TestGuiasBF2026(unittest.TestCase):
    """Guías «Qué notebook / qué TV de 50 pulgadas comprar en Black Friday 2026»."""

    @classmethod
    def setUpClass(cls):
        cls.src = (FRONT / "lib" / "guias-bf-2026.ts").read_text(encoding="utf-8")
        cls.comp = (FRONT / "components" / "black-friday" / "GuiaBF.tsx").read_text(encoding="utf-8")
        cls.guias = {}
        for parte in re.split(r"\n  \{\n    slug: '", cls.src)[1:]:
            cls.guias[parte.split("'", 1)[0]] = parte
        items = json.loads(CATALOGO.read_text(encoding="utf-8"))["items"]
        cls.catalogo = {p["id_ml"]: p for p in items}

    def test_estan_las_dos_y_su_recomendada_primero(self):
        nb = self.guias["que-notebook-comprar-black-friday-2026"]
        tv = self.guias["que-tv-50-pulgadas-comprar-black-friday-2026"]
        self.assertEqual(re.findall(r"id: '(MLAU?\d+)'", nb)[0], "MLA77766168")
        self.assertEqual(re.findall(r"id: '(MLAU?\d+)'", tv)[0], "MLA53221633")
        p = self.catalogo.get("MLA53221633")
        if p:
            self.assertIn("dv50x8580", p["titulo"].lower())
        for g in (nb, tv):
            self.assertIn("/mejores/black-friday-notebooks", g)
            self.assertIn("/mejores/black-friday-smart-tv", g)

    def test_productos_del_repo_sin_marcas_prohibidas(self):
        for slug, b in self.guias.items():
            for i in re.findall(r"id: '(MLAU?\d+)'", b):
                p = self.catalogo.get(i)
                if p is None:
                    continue  # el bot poda a los 14 días: la página lo saltea
                self.assertNotRegex(p["titulo"], PROHIBIDAS, f"{slug}: {i}")
                self.assertIn("matt_tool=37267219", p["url_producto"], i)
        self.assertNotRegex(re.sub(r"//.*", "", self.src), PROHIBIDAS)

    def test_seo_y_respuesta_directa(self):
        for slug, b in self.guias.items():
            self.assertLessEqual(len(re.search(r"seoTitulo: '([^']+)'", b).group(1)), 60, slug)
            self.assertLessEqual(len(re.search(r"seoDescripcion:\s*'([^']+)'", b).group(1)), 158, slug)
            self.assertIn("respuestaCorta", b)
            self.assertIn("faq:", b)

    def test_sin_descuentos_tachados_minimos_ni_cupones(self):
        texto = re.sub(r"//.*", "", (self.src + self.comp).lower())
        for prohibido in ("% off", "descuento", "precio_anterior", "line-through", "minimo_historico",
                          "mínimo histórico", "minimo historico", "cupón", "cupones de", "cupones-mercado-libre"):
            self.assertNotIn(prohibido, texto, prohibido)
        self.assertNotRegex(texto, r"\d+\s*%")
        self.assertIn('<Footer brand="ofertas" sinCupones />', self.comp)

    def test_en_guias_sitemap_y_llms(self):
        guias = (FRONT / "lib" / "guias.ts").read_text(encoding="utf-8")
        self.assertIn("...GUIAS_BF_2026", guias)
        self.assertIn("GUIAS.filter(guiaIndexable)", (FRONT / "app" / "sitemap.ts").read_text(encoding="utf-8"))
        llms = (FRONT / "app" / "llms.txt" / "route.ts").read_text(encoding="utf-8")
        for slug in self.guias:
            self.assertIn("/guias/" + slug + ")", llms)
        self.assertIn("/mejores/black-friday-bicicletas)", llms)
        pagina = (FRONT / "app" / "guias" / "[slug]" / "page.tsx").read_text(encoding="utf-8")
        self.assertIn("if (g.bf) return <GuiaBFPage g={g} />", pagina)


class TestLoteBFConv2411(unittest.TestCase):
    """Lote del 24/11/2026 (bf-conv-2411): 7 landings BF de rubros que faltaban, 3 guías BF 2026,
    registro en sitemap/llms/redirects y conversión (botón #FACC15 arriba, sticky y WhatsApp)."""

    SLUGS = {
        "black-friday-freidoras-de-aire": r"(?i)freidora",
        "black-friday-auriculares": r"(?i)auricular|airpods",
        "black-friday-tablets": r"(?i)tablet|ipad|galaxy tab",
        "black-friday-smartwatch": r"(?i)smartwatch|reloj|watch",
        "black-friday-colchones": r"(?i)colch[oó]n",
        "black-friday-herramientas": r"(?i)taladro|rotomartillo|amoladora|sierra|hidrolavadora",
        "black-friday-juguetes": r"(?i)lego|bloques|mu[ñn]eca|babycorns",
    }
    GUIAS = {
        "que-freidora-de-aire-comprar-black-friday-2026": "black-friday-freidoras-de-aire",
        "que-tablet-comprar-black-friday-2026": "black-friday-tablets",
        "que-smartwatch-comprar-black-friday-2026": "black-friday-smartwatch",
    }
    EXCLUIDAS = re.compile(r"\b(bgh|hp|omen|victus|vivobook|likon)\b", re.I)

    @classmethod
    def setUpClass(cls):
        cls.src = LANDINGS.read_text(encoding="utf-8")
        cls.bloques = _bloques(cls.src)
        items = json.loads(CATALOGO.read_text(encoding="utf-8"))["items"]
        cls.catalogo = {p["id_ml"]: p for p in items}
        cls.guias_src = (FRONT / "lib" / "guias-bf-2026.ts").read_text(encoding="utf-8")

    def test_landings_del_rubro_y_sin_marcas_excluidas(self):
        for slug, palabra in self.SLUGS.items():
            self.assertIn(slug, self.bloques)
            for i in re.findall(r"id: '(MLA\d+)'", self.bloques[slug]):
                p = self.catalogo.get(i)
                if p:  # el bot poda a los 14 días: la página saltea los que ya no están
                    self.assertRegex(p["titulo"], palabra, i)
                    self.assertNotRegex(p["titulo"], self.EXCLUIDAS, i)
            self.assertNotRegex(self.bloques[slug], self.EXCLUIDAS, slug)
        self.assertIn("vivobook|likon", self.src)  # MARCAS_PROHIBIDAS

    def test_registradas_en_comparativas_llms_y_redirects(self):
        comp = (FRONT / "lib" / "comparativas.ts").read_text(encoding="utf-8")
        perennes = comp.split("const PERENNES")[1].split("])")[0]
        llms = (FRONT / "app" / "llms.txt" / "route.ts").read_text(encoding="utf-8")
        conf = (FRONT / "next.config.mjs").read_text(encoding="utf-8")
        rubros = re.search(r"const rubrosBF = \[([^\]]+)\]", conf).group(1)
        for slug in self.SLUGS:
            self.assertIn(f"slug: '{slug}'", comp)
            self.assertIn(f"'{slug}'", perennes)
            self.assertIn(f"/mejores/{slug})", llms)
            self.assertIn("'" + slug.replace("black-friday-", "") + "'", rubros)

    def test_guias_con_su_landing(self):
        mapa = (FRONT / "lib" / "bf-guias.ts").read_text(encoding="utf-8")
        llms = (FRONT / "app" / "llms.txt" / "route.ts").read_text(encoding="utf-8")
        for guia, landing in self.GUIAS.items():
            self.assertIn(f"'{guia}': '{landing}'", mapa)
            self.assertIn(f"slug: '{guia}'", self.guias_src)
            self.assertIn(f"landing: '{landing}'", self.guias_src)
            self.assertIn(f"/guias/{guia})", llms)
            self.assertIn(f"/guias/{guia}'", self.bloques[landing])  # ida y vuelta

    def test_boton_amarillo_arriba_sticky_y_whatsapp(self):
        landing = COMPONENTE.read_text(encoding="utf-8")
        guia = (FRONT / "components" / "black-friday" / "GuiaBF.tsx").read_text(encoding="utf-8")
        boton = re.search(r"export const BOTON_HERO =\s*'([^']+)'", landing).group(1)
        for clase in ("bg-[#FACC15]", "text-black", "min-h-12", "w-full"):
            self.assertIn(clase, boton)
        for src in (landing, guia):
            self.assertIn("className={BOTON_HERO}", src)
            self.assertIn("<CtaFijoML", src)  # sticky en el celular
            self.assertIn("<CanalWhatsAppBF", src)
        wa = (FRONT / "components" / "black-friday" / "CanalWhatsAppBF.tsx").read_text(encoding="utf-8")
        self.assertIn("WHATSAPP_URL", wa)
        self.assertIn("https://whatsapp.com/channel/0029Vb9CICi7DAWspd4ius2Z", (FRONT / "lib" / "marca.ts").read_text(encoding="utf-8"))

    def test_black_friday_con_destacado_y_rubros_nuevos(self):
        bf = (FRONT / "app" / "black-friday" / "page.tsx").read_text(encoding="utf-8")
        self.assertIn("ctaDestacado('/black-friday')", bf)
        self.assertIn("<CtaOfertaDestacada", bf)
        self.assertIn("<StickyWhatsAppBF", bf)
        self.assertIn("/mejores/black-friday-herramientas", bf)
        cta = (FRONT / "lib" / "cta-destacados.ts").read_text(encoding="utf-8")
        bloque = cta.split("'/black-friday': {")[1].split("\n  },")[0]
        ids = re.findall(r"id: '(MLA\d+)'", bloque)
        self.assertGreaterEqual(len(ids), 3)
        self.assertNotRegex(re.sub(r"//.*", "", bloque), r"\d+\s*%|cup[oó]n|m[ií]nimo hist")


class TestAvisoBFCalculadora(unittest.TestCase):
    """Bloque amarillo arriba de la calculadora (calculadoraml.com.ar, etiqueta calcml)."""

    def test_bloque(self):
        comp = (FRONT / "components" / "AvisoBFCalculadora.tsx").read_text(encoding="utf-8")
        self.assertIn("#FACC15", comp)
        self.assertIn("text-black", comp)
        for ruta in ("/black-friday", "/mejores/black-friday-notebooks", "/mejores/black-friday-smart-tv"):
            self.assertIn(ruta, comp)
        self.assertIn("avisoBFVigente()", comp)
        self.assertIn("SoloHastaFinBF", comp)
        self.assertNotRegex(re.sub(r"//.*", "", comp), r"\d+\s*%|cup[oó]n|m[ií]nimo hist")

    def test_en_las_paginas_de_la_calculadora(self):
        self.assertIn("<AvisoBFCalculadora />", (FRONT / "components" / "CalcHeader.tsx").read_text(encoding="utf-8"))
        self.assertIn("<AvisoBFCalculadora />", (FRONT / "app" / "calculadora" / "[id]" / "page.tsx").read_text(encoding="utf-8"))
        for f in ("app/page.tsx", "app/calculadora/page.tsx", "app/calculadora-de-comisiones/page.tsx"):
            self.assertIn("<CalcHeader />", (FRONT / f).read_text(encoding="utf-8"), f)


class TestAvisoBFRubro(unittest.TestCase):
    """Bloque «Black Friday 27/11: lo que conviene» en 10 páginas (lib/bf-enlaces.ts)."""

    @classmethod
    def setUpClass(cls):
        cls.src = (FRONT / "lib" / "bf-enlaces.ts").read_text(encoding="utf-8")
        cls.comp = (FRONT / "components" / "AvisoBFRubro.tsx").read_text(encoding="utf-8")
        cls.rutas = dict(re.findall(r"'(/(?:mejor|mejores|guias|precio-hoy)/[a-z0-9-]+)': (\w+)", cls.src))

    def test_diez_paginas_de_los_cuatro_rubros(self):
        self.assertEqual(len(self.rutas), 10)
        self.assertEqual(set(self.rutas.values()), {"NOTEBOOKS", "CELULARES", "TV", "AIRES"})
        landings = LANDINGS.read_text(encoding="utf-8")
        for slug in re.findall(r"slug: '(black-friday-[a-z-]+)'", self.src):
            self.assertIn(f"slug: '{slug}'", landings)

    def test_se_apaga_despues_del_30_11(self):
        self.assertIn("FIN_AVISO_BF = '2026-12-01T00:00:00-03:00'", self.src)
        self.assertIn("avisoBFVigente()", self.comp)
        self.assertIn("SoloHastaFinBF", self.comp)

    def test_texto_y_colores(self):
        self.assertIn("Black Friday 27/11: lo que conviene", self.comp)
        self.assertIn("#FACC15", self.comp)
        self.assertIn("text-black", self.comp)
        # Los comentarios explican la regla: se miran solo los textos y el JSX.
        sin_comentarios = re.sub(r"//.*", "", self.src + self.comp)
        self.assertNotRegex(sin_comentarios, r"\d+\s*%|cup[oó]n|m[ií]nimo hist")

    def test_las_plantillas_lo_usan(self):
        for f in ("app/mejores/[slug]/page.tsx", "app/precio-hoy/[slug]/page.tsx",
                  "app/guias/[slug]/page.tsx", "app/mejor/aires-acondicionados/page.tsx"):
            self.assertIn("<AvisoBFRubro ruta=", (FRONT / f).read_text(encoding="utf-8"), f)


JSONLD = FRONT / "lib" / "bf-jsonld.ts"
BF_GUIAS = FRONT / "lib" / "bf-guias.ts"
TS = FRONT / "node_modules" / "typescript"

# Transpila lib/bf-jsonld.ts con el TypeScript del frontend y lo corre en node con productos de ejemplo.
_NODE_JSONLD = r"""
const ts = require(process.argv[1]);
const fs = require('fs');
const src = fs.readFileSync(process.argv[2], 'utf8');
const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const m = { exports: {} };
new Function('module', 'exports', 'require', js)(m, m.exports, require);
const L = m.exports;
const productos = [
  { nombre: 'Lenovo IdeaPad Slim 3', detalle: 'Ryzen 5 · 16 GB', url: 'https://www.mercadolibre.com.ar/p/MLA1?matt_tool=37267219&matt_word=web', img: 'https://http2.mlstatic.com/x.webp', precio: 1573949.4 },
  { nombre: 'Lenovo V15 Gen 5', detalle: 'Core i5', url: 'https://www.mercadolibre.com.ar/p/MLA2?matt_tool=37267219&matt_word=web', img: null, precio: null },
];
process.stdout.write(JSON.stringify({
  lista: L.itemListLD('Notebooks para el Black Friday 2026', 'https://cazadordeofertas.com.ar/mejores/black-friday-notebooks', productos),
  faq: L.faqLD([{ q: '¿Qué notebook conviene?', a: 'La IdeaPad Slim 3.' }]),
  migas: L.breadcrumbLD([{ name: 'Ofertas de hoy', item: 'https://cazadordeofertas.com.ar' }, { name: 'Black Friday 2026', item: 'https://cazadordeofertas.com.ar/black-friday' }]),
}));
"""


def _todas_las_claves(x):
    if isinstance(x, dict):
        for k, v in x.items():
            yield k
            yield from _todas_las_claves(v)
    elif isinstance(x, list):
        for v in x:
            yield from _todas_las_claves(v)


class TestJsonLdBF(unittest.TestCase):
    """JSON-LD de landings y guías BF (lib/bf-jsonld.ts, pedido GEO del 23/11/2026): ItemList con
    Product/Offer solo con precio reciente, FAQPage y BreadcrumbList; nunca ratings ni
    inventoryLevel. availability (InStock) desde el 24/11 por el aviso de Search Console."""

    @classmethod
    def setUpClass(cls):
        cls.src = JSONLD.read_text(encoding="utf-8")

    @unittest.skipUnless(shutil.which("node") and TS.exists(), "hace falta node y frontend/node_modules")
    def test_estructura_en_node(self):
        out = subprocess.run(["node", "-e", _NODE_JSONLD, str(TS), str(JSONLD)],
                             capture_output=True, text=True, check=True, timeout=60).stdout
        ld = json.loads(out)
        lista = ld["lista"]
        self.assertEqual(lista["@context"], "https://schema.org")
        self.assertEqual(lista["@type"], "ItemList")
        self.assertEqual(lista["numberOfItems"], 2)
        con, sin = lista["itemListElement"]
        self.assertEqual([con["position"], sin["position"]], [1, 2])
        # Con precio reciente: Product + Offer en ARS, precio entero, sin ratings.
        prod = con["item"]
        self.assertEqual(prod["@type"], "Product")
        self.assertEqual(prod["offers"]["@type"], "Offer")
        self.assertEqual(prod["offers"]["priceCurrency"], "ARS")
        self.assertEqual(prod["offers"]["price"], 1573949)
        self.assertIn("matt_tool=37267219", prod["offers"]["url"])
        # 24/11: Search Console pide availability en offers; InStock porque hay precio vigente.
        self.assertEqual(prod["offers"]["availability"], "https://schema.org/InStock")
        # Sin precio (visto hace más de 7 días): ListItem simple, nunca un Product sin offers (inválido).
        self.assertNotIn("item", sin)
        self.assertEqual(sin["@type"], "ListItem")
        self.assertEqual(sin["name"], "Lenovo V15 Gen 5")
        claves = set(_todas_las_claves(ld))
        for prohibida in ("aggregateRating", "review", "ratingValue", "inventoryLevel"):
            self.assertNotIn(prohibida, claves)
        faq = ld["faq"]
        self.assertEqual(faq["@type"], "FAQPage")
        self.assertEqual(faq["mainEntity"][0]["@type"], "Question")
        self.assertEqual(faq["mainEntity"][0]["acceptedAnswer"]["@type"], "Answer")
        migas = ld["migas"]
        self.assertEqual(migas["@type"], "BreadcrumbList")
        self.assertEqual([m["position"] for m in migas["itemListElement"]], [1, 2])
        self.assertTrue(all(m["item"].startswith("https://") for m in migas["itemListElement"]))

    def test_sin_ratings_en_el_codigo(self):
        sin_comentarios = re.sub(r"//.*", "", self.src)
        for prohibida in ("aggregateRating", "ratingValue", "review", "inventoryLevel"):
            self.assertNotIn(prohibida, sin_comentarios)
        # availability sí (aviso de Search Console del 24/11), pero siempre por disponibilidadLD.
        self.assertIn("availability: disponibilidadLD(p.precio)", sin_comentarios)

    def test_paginas_usan_el_modulo(self):
        landing = COMPONENTE.read_text(encoding="utf-8")
        guia_bf = (FRONT / "components" / "black-friday" / "GuiaBF.tsx").read_text(encoding="utf-8")
        guias = (FRONT / "app" / "guias" / "[slug]" / "page.tsx").read_text(encoding="utf-8")
        for src in (landing, guia_bf):
            for fn in ("breadcrumbLD(", "faqLD(", "itemListLD("):
                self.assertIn(fn, src)
        self.assertIn("breadcrumbLD(", guias)
        self.assertIn("itemListLD(", guias)
        # El precio que llega al JSON-LD ya viene filtrado a 7 días (productosDeItems → precioMostrable).
        self.assertIn("d <= DIAS_PRECIO_VIEJO ? precio : null", LANDINGS.read_text(encoding="utf-8"))


class TestGeoYConversionBF(unittest.TestCase):
    """Respuesta corta + «Actualizado el», llms.txt, enlazado guía ↔ landing y botón de las tarjetas."""

    @classmethod
    def setUpClass(cls):
        cls.src = LANDINGS.read_text(encoding="utf-8")
        cls.bloques = _bloques(cls.src)
        cls.mapa = dict(re.findall(r"^  '([a-z0-9-]+)': (?:'([a-z0-9-]+)'|null),", BF_GUIAS.read_text(encoding="utf-8"), re.M))
        cls.guias_src = "".join((FRONT / "lib" / f).read_text(encoding="utf-8") for f in (
            "guias.ts", "guias-long-tail.ts", "guias-tecno.ts", "guias-bf-2026.ts", "guias-ticket-alto.ts"))
        cls.guias = {}
        for parte in re.split(r"\n  \{\n    slug: '", cls.guias_src)[1:]:
            cls.guias.setdefault(parte.split("'", 1)[0], parte.split("\n  },\n")[0])

    @staticmethod
    def _frases(texto):
        return [f for f in re.split(r"(?<=[.!?])\s+", texto.strip()) if f]

    def _respuesta(self, bloque):
        return re.search(r"respuestaCorta:\s*'((?:[^'\\]|\\.)*)'", bloque).group(1).replace("\\'", "'")

    def test_respuesta_corta_landings(self):
        for slug, b in self.bloques.items():
            rc = self._respuesta(b)
            self.assertIn(len(self._frases(rc)), (2, 3), slug)
            # Modelo concreto: el nombre (o su marca + modelo) del recomendado de la lista.
            principal = re.search(r"nombre: '([^']+)'", b).group(1)
            modelo = [t for t in principal.split() if t.lower() not in ("bicicleta", "mtb", "apple")][0]
            self.assertIn(modelo, rc, slug)
            self.assertNotRegex(rc, r"\d+\s*%|tachad|m[ií]nimo|cup[oó]n|\$\s*\d")
            self.assertNotRegex(rc, PROHIBIDAS)

    def test_respuesta_corta_guias_bf(self):
        self.assertGreaterEqual(len(self.mapa), 8)
        for slug in self.mapa:
            self.assertIn(slug, self.guias, slug)
            rc = self._respuesta(self.guias[slug])
            self.assertIn(len(self._frases(rc)), (2, 3), slug)
            self.assertNotRegex(rc, r"\d+\s*%|tachad|m[ií]nimo|cup[oó]n|\$\s*\d", slug)
            self.assertNotRegex(rc, PROHIBIDAS, slug)
            b = self.guias[slug]
            st = re.search(r"seoTitulo: '([^']+)'", b)
            sd = re.search(r"seoDescripcion:\s*'((?:[^'\\]|\\.)+)'", b)
            self.assertTrue(st and sd, f"{slug}: falta seoTitulo/seoDescripcion")
            self.assertLessEqual(len(st.group(1)), 60, slug)
            self.assertLessEqual(len(sd.group(1)), 158, slug)

    def test_actualizado_el_visible(self):
        self.assertIn("Actualizado el", COMPONENTE.read_text(encoding="utf-8"))
        self.assertIn("<RespuestaCorta", (FRONT / "components" / "black-friday" / "GuiaBF.tsx").read_text(encoding="utf-8"))
        self.assertIn("Actualizado el", (FRONT / "app" / "guias" / "[slug]" / "page.tsx").read_text(encoding="utf-8"))
        self.assertIn("esGuiaBF(slug)", (FRONT / "lib" / "guias.ts").read_text(encoding="utf-8"))

    def test_titulos_landings_60(self):
        for slug, b in self.bloques.items():
            self.assertLessEqual(len(re.search(r"titulo: '([^']+)'", b).group(1)), 60, slug)

    def test_cada_guia_enlaza_a_su_landing(self):
        for slug, landing in self.mapa.items():
            destino = f"/mejores/{landing}" if landing else "/black-friday"
            self.assertIn(f"href: '{destino}'", self.guias[slug], slug)
            if landing:
                self.assertIn(f"slug: '{landing}'", self.src)

    def test_cada_landing_enlaza_a_dos_guias(self):
        for slug, b in self.bloques.items():
            enlaces = b.split("enlaces: [")[1].split("]")[0]
            guias = re.findall(r"href: '/guias/([a-z0-9-]+)'", enlaces)
            self.assertGreaterEqual(len(guias), 2, slug)
            for g in guias:
                self.assertIn(g, self.guias, f"{slug} → /guias/{g} no existe")

    def test_llms_txt_seccion_black_friday(self):
        llms = (FRONT / "app" / "llms.txt" / "route.ts").read_text(encoding="utf-8")
        self.assertIn("## Black Friday 2026 Argentina", llms)
        self.assertIn("LANDINGS_BF.map", llms)
        self.assertIn("Object.keys(GUIA_BF_A_LANDING)", llms)
        self.assertIn("primeraFrase(", llms)

    def test_boton_de_las_tarjetas(self):
        comp = COMPONENTE.read_text(encoding="utf-8")
        tarjeta = comp.split("export function Tarjeta(")[1].split("\nexport ")[0]
        boton = re.search(r'className="([^"]*)"\s*>\s*Ver en Mercado Libre', tarjeta).group(1)
        self.assertIn("w-full", boton)
        self.assertIn("min-h-[48px]", boton)
        self.assertIn("<LineaConfianza p={p} />", tarjeta)
        confianza = comp.split("export function LineaConfianza(")[1].split("\nexport ")[0]
        self.assertIn("Envío y cuotas: mirá en ML", confianza)
        # «Tienda oficial» solo si el dato existe.
        self.assertIn("{p.tiendaOficial && ", confianza)


class TestOfertasCalculadora(unittest.TestCase):
    """Ofertas debajo del resultado de la calculadora (etiqueta calcml, 0 ventas)."""

    @classmethod
    def setUpClass(cls):
        cls.lib = (FRONT / "lib" / "calc-ofertas.ts").read_text(encoding="utf-8")
        cls.comp = (FRONT / "components" / "OfertasCalculadora.tsx").read_text(encoding="utf-8")
        cls.bloques = _bloques(LANDINGS.read_text(encoding="utf-8"))
        items = json.loads(CATALOGO.read_text(encoding="utf-8"))["items"]
        cls.catalogo = {i["id_ml"]: i for i in items}

    def test_salen_de_landings_bf_y_hay_al_menos_3(self):
        self.assertIn("productosBF(l)", self.lib)
        self.assertIn("MAX_OFERTAS_CALC = 4", self.lib)
        slugs = re.findall(r"'(black-friday-[a-z-]+)'", self.lib)
        self.assertGreaterEqual(len(slugs), 3)
        con_producto = 0
        for slug in slugs:
            self.assertIn(slug, self.bloques, slug)
            ids = re.findall(r"id: '(MLA\d+)'", self.bloques[slug])
            ok = [
                i for i in ids
                if i in self.catalogo and self.catalogo[i].get("url_imagen")
                and not PROHIBIDAS.search(self.catalogo[i]["titulo"])
                and "matt_tool=37267219" in self.catalogo[i]["url_producto"]
            ]
            con_producto += bool(ok)
        self.assertGreaterEqual(con_producto, 3)

    def test_boton_48px_tracking_y_black_friday(self):
        self.assertIn("min-h-[48px]", self.comp)
        # El evento es una prop (la calculadora de consumo usa otro); el default sigue siendo calcml.
        self.assertIn("evento = 'calcml_oferta_boton'", self.comp)
        self.assertIn("data-evento={evento}", self.comp)
        self.assertIn('rel="sponsored nofollow noopener"', self.comp)
        self.assertIn("/black-friday", self.comp)
        self.assertIn("a.dataset.evento", (FRONT / "app" / "clics-ml.tsx").read_text(encoding="utf-8"))

    def test_sin_precios_descuentos_ni_cupones(self):
        jsx = re.sub(r"//.*", "", self.comp)
        self.assertNotRegex(jsx, r"\d+\s*%|cup[oó]n|m[ií]nimo hist|line-through|p\.precio")

    def test_debajo_de_las_calculadoras(self):
        for f in ("app/calculadora/[id]/page.tsx", "app/calculadora-de-comisiones/page.tsx"):
            src = (FRONT / f).read_text(encoding="utf-8")
            self.assertIn("<OfertasCalculadora", src, f)
        idp = (FRONT / "app" / "calculadora" / "[id]" / "page.tsx").read_text(encoding="utf-8")
        self.assertLess(idp.index("<ProfitCalculator"), idp.index("<OfertasCalculadora"))
        com = (FRONT / "app" / "calculadora-de-comisiones" / "page.tsx").read_text(encoding="utf-8")
        self.assertLess(com.index("<CalculadoraComisiones />"), com.index("<OfertasCalculadora"))


if __name__ == "__main__":
    unittest.main()
