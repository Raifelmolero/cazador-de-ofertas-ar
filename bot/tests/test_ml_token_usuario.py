"""Token de usuario de ML (grant refresh_token) y la herramienta ml_obtener_token.

Sin red: las requests van mockeadas (el parámetro `request=` de ml_api y
`post=` de la herramienta). Se verifica también que ningún token/secret
salga por stdout.
"""
import contextlib
import io
import json
import os
import sys
import tempfile
import unittest
import urllib.error
import urllib.parse
from pathlib import Path
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "tools"))
import ml_api  # noqa: E402
import ml_obtener_token as obt  # noqa: E402

ENV = {"ML_CLIENT_ID": "app-id", "ML_CLIENT_SECRET": "app-secret-XYZ"}
ENV_USER = {**ENV, "ML_REFRESH_TOKEN": "TG-refresh-viejo-111"}


def http_err(code, cuerpo=None):
    import io as _io
    fp = _io.BytesIO(json.dumps(cuerpo).encode()) if cuerpo is not None else None
    return urllib.error.HTTPError("u", code, "e", {}, fp)


def campos(data):
    return {k: v[0] for k, v in urllib.parse.parse_qs(data.decode()).items()}


class Recorder:
    """request mockeado: guarda las llamadas y responde según grant_type."""

    def __init__(self, refresh=None, app=None):
        self.refresh, self.app, self.calls = refresh, app, []

    def __call__(self, url, data=None, headers=None):
        self.calls.append((url, campos(data) if data else None, headers))
        if "oauth" in url:
            grant = campos(data)["grant_type"]
            r = self.refresh if grant == "refresh_token" else self.app
            if isinstance(r, Exception):
                raise r
            return r
        return {"content": []}

    def grants(self):
        return [c[1]["grant_type"] for c in self.calls if c[1]]


class TestTokenUsuario(unittest.TestCase):
    def setUp(self):
        ml_api._TOKEN.update(value=None, exp=0)
        self.tmp = tempfile.TemporaryDirectory()
        self.out = Path(self.tmp.name) / "nuevo_refresh.txt"

    def tearDown(self):
        self.tmp.cleanup()

    def _get_token(self, rec, env=None):
        env = {**ENV_USER, "ML_REFRESH_TOKEN_OUT": str(self.out)} if env is None else env
        buf = io.StringIO()
        with mock.patch.dict(os.environ, env, clear=True), contextlib.redirect_stdout(buf):
            tok = ml_api.get_token(rec)
        return tok, buf.getvalue()

    def test_usa_refresh_token_y_manda_los_campos(self):
        rec = Recorder(refresh={"access_token": "ACC-USER", "expires_in": 21600,
                                "refresh_token": "TG-refresh-viejo-111"})
        tok, _ = self._get_token(rec)
        self.assertEqual(tok, "ACC-USER")
        self.assertEqual(rec.grants(), ["refresh_token"])
        url, c, _h = rec.calls[0]
        self.assertTrue(url.endswith("/oauth/token"))
        self.assertEqual(c["refresh_token"], "TG-refresh-viejo-111")
        self.assertEqual(c["client_id"], "app-id")
        self.assertEqual(c["client_secret"], "app-secret-XYZ")

    def test_rotacion_guarda_el_nuevo_en_archivo_y_no_lo_imprime(self):
        rec = Recorder(refresh={"access_token": "ACC-USER", "expires_in": 21600,
                                "refresh_token": "TG-refresh-NUEVO-222"})
        tok, out = self._get_token(rec)
        self.assertEqual(tok, "ACC-USER")
        self.assertEqual(self.out.read_text(encoding="utf-8"), "TG-refresh-NUEVO-222")
        for secreto in ("TG-refresh-NUEVO-222", "TG-refresh-viejo-111", "ACC-USER", "app-secret-XYZ"):
            self.assertNotIn(secreto, out)
        self.assertIn("rotó", out)

    def test_sin_rotacion_no_escribe_archivo(self):
        rec = Recorder(refresh={"access_token": "ACC", "expires_in": 21600})
        tok, out = self._get_token(rec)
        self.assertEqual(tok, "ACC")
        self.assertFalse(self.out.exists())
        self.assertIn("no cambió", out)

    def test_rotacion_sin_archivo_definido_avisa_y_sigue(self):
        rec = Recorder(refresh={"access_token": "ACC", "expires_in": 21600,
                                "refresh_token": "TG-refresh-NUEVO-222"})
        tok, out = self._get_token(rec, env=dict(ENV_USER))
        self.assertEqual(tok, "ACC")
        self.assertIn("ML_REFRESH_TOKEN_OUT", out)
        self.assertNotIn("TG-refresh-NUEVO-222", out)

    def test_refresh_rechazado_cae_a_client_credentials(self):
        rec = Recorder(refresh=http_err(400, {"error": "invalid_grant", "message": "TG-refresh-viejo-111"}),
                       app={"access_token": "ACC-APP", "expires_in": 21600})
        tok, out = self._get_token(rec)
        self.assertEqual(tok, "ACC-APP")
        self.assertEqual(rec.grants(), ["refresh_token", "client_credentials"])
        self.assertIn("invalid_grant", out)
        self.assertNotIn("TG-refresh-viejo-111", out)  # no se vuelca el cuerpo

    def test_refresh_con_error_de_red_cae_a_client_credentials(self):
        rec = Recorder(refresh=TimeoutError("boom"), app={"access_token": "ACC-APP"})
        tok, _ = self._get_token(rec)
        self.assertEqual(tok, "ACC-APP")

    def test_refresh_sin_access_token_cae_a_client_credentials(self):
        rec = Recorder(refresh={"foo": "bar"}, app={"access_token": "ACC-APP"})
        tok, _ = self._get_token(rec)
        self.assertEqual(tok, "ACC-APP")

    def test_ambos_fallan_devuelve_none(self):
        rec = Recorder(refresh=http_err(400), app=http_err(401))
        tok, _ = self._get_token(rec)
        self.assertIsNone(tok)

    def test_sin_refresh_token_solo_client_credentials(self):
        rec = Recorder(app={"access_token": "ACC-APP", "expires_in": 21600})
        tok, _ = self._get_token(rec, env=dict(ENV))
        self.assertEqual(tok, "ACC-APP")
        self.assertEqual(rec.grants(), ["client_credentials"])

    def test_refresh_token_vacio_se_ignora(self):
        rec = Recorder(app={"access_token": "ACC-APP"})
        tok, _ = self._get_token(rec, env={**ENV, "ML_REFRESH_TOKEN": ""})
        self.assertEqual(rec.grants(), ["client_credentials"])
        self.assertEqual(tok, "ACC-APP")

    def test_refresh_sin_client_id_no_hace_nada(self):
        rec = Recorder(refresh={"access_token": "X"})
        tok, _ = self._get_token(rec, env={"ML_REFRESH_TOKEN": "TG-x"})
        self.assertIsNone(tok)
        self.assertEqual(rec.calls, [])

    def test_token_se_cachea_y_el_refresh_se_usa_una_sola_vez(self):
        rec = Recorder(refresh={"access_token": "ACC", "expires_in": 21600,
                                "refresh_token": "TG-refresh-NUEVO-222"})
        env = {**ENV_USER, "ML_REFRESH_TOKEN_OUT": str(self.out)}
        with mock.patch.dict(os.environ, env, clear=True), contextlib.redirect_stdout(io.StringIO()):
            self.assertEqual(ml_api.get_token(rec), "ACC")
            self.assertEqual(ml_api.get_token(rec), "ACC")
        self.assertEqual(rec.grants(), ["refresh_token"])

    def test_fetch_deals_api_usa_token_de_usuario_en_bearer(self):
        vistos = []

        def req(url, data=None, headers=None):
            if "oauth" in url:
                return {"access_token": "ACC-USER", "expires_in": 21600}
            vistos.append(headers.get("Authorization"))
            return {"content": []}
        env = {**ENV_USER, "ML_REFRESH_TOKEN_OUT": str(self.out)}
        with mock.patch.dict(os.environ, env, clear=True), contextlib.redirect_stdout(io.StringIO()):
            self.assertEqual(ml_api.fetch_deals_api(["MLA1"], request=req), [])
        # highlights y, al no dar nada, el catálogo: todo con el mismo token de usuario
        self.assertTrue(vistos)
        self.assertEqual(set(vistos), {"Bearer ACC-USER"})

    def test_has_user_token(self):
        with mock.patch.dict(os.environ, ENV_USER, clear=True):
            self.assertTrue(ml_api.has_user_token())
        with mock.patch.dict(os.environ, ENV, clear=True):
            self.assertFalse(ml_api.has_user_token())


class TestObtenerToken(unittest.TestCase):
    def test_armar_url(self):
        u = obt.armar_url("123", "https://x.com.ar/cb", "st4te")
        p = urllib.parse.urlparse(u)
        self.assertEqual((p.scheme, p.netloc, p.path), ("https", "auth.mercadolibre.com.ar", "/authorization"))
        q = {k: v[0] for k, v in urllib.parse.parse_qs(p.query).items()}
        self.assertEqual(q["response_type"], "code")
        self.assertEqual(q["client_id"], "123")
        self.assertEqual(q["redirect_uri"], "https://x.com.ar/cb")
        self.assertEqual(q["state"], "st4te")
        self.assertNotIn("code_challenge", q)

    def test_armar_url_pkce(self):
        v, ch = obt.par_pkce()
        q = urllib.parse.parse_qs(urllib.parse.urlparse(obt.armar_url("1", "https://x", "s", ch)).query)
        self.assertEqual(q["code_challenge"], [ch])
        self.assertEqual(q["code_challenge_method"], ["S256"])
        self.assertGreaterEqual(len(v), 43)

    def test_extraer_code(self):
        self.assertEqual(obt.extraer_code("  TG-abc-123  "), "TG-abc-123")
        self.assertEqual(obt.extraer_code("https://x.com.ar/cb?code=TG-1&state=s", "s"), "TG-1")
        self.assertEqual(obt.extraer_code("?code=TG-2&state=s", "s"), "TG-2")
        self.assertEqual(obt.extraer_code("https://x.com.ar/cb?code=TG-3", "s"), "TG-3")

    def test_extraer_code_errores(self):
        for malo in ("", "https://x.com.ar/cb?error=access_denied", "dos palabras"):
            with self.assertRaises(ValueError, msg=malo):
                obt.extraer_code(malo, "s")
        with self.assertRaises(ValueError):
            obt.extraer_code("https://x.com.ar/cb?code=TG-1&state=otro", "s")

    def test_canjear_code_campos(self):
        vistos = {}

        def post(url, data):
            vistos.update(url=url, **campos(data))
            return {"refresh_token": "R"}
        obt.canjear_code("id", "sec", "TG-1", "https://x/cb", verifier="ver", post=post)
        self.assertEqual(vistos["url"], "https://api.mercadolibre.com/oauth/token")
        self.assertEqual(vistos["grant_type"], "authorization_code")
        self.assertEqual((vistos["code"], vistos["redirect_uri"], vistos["code_verifier"]),
                         ("TG-1", "https://x/cb", "ver"))

    def _correr(self, argv, post, pegado, env=None):
        buf = io.StringIO()
        env = {"ML_CLIENT_ID": "id", "ML_CLIENT_SECRET": "sec-SECRETO"} if env is None else env
        with mock.patch.dict(os.environ, env, clear=True), contextlib.redirect_stdout(buf):
            rc = obt.main(argv, leer_secreto=lambda _p: pegado, post=post)
        return rc, buf.getvalue()

    def test_main_guarda_refresh_y_no_lo_imprime(self):
        with tempfile.TemporaryDirectory() as d:
            salida = Path(d) / "sub" / "r.txt"
            post = mock.Mock(return_value={"access_token": "ACC-SECRETO", "refresh_token": "TG-REFRESH-SECRETO",
                                           "user_id": 42, "scope": "offline_access read write"})
            rc, out = self._correr(["--redirect-uri", "https://x/cb", "--salida", str(salida)],
                                   post, "https://x/cb?code=TG-codigo-SECRETO")
            self.assertEqual(rc, 0)
            self.assertEqual(salida.read_text(encoding="utf-8"), "TG-REFRESH-SECRETO")
            for s in ("TG-REFRESH-SECRETO", "ACC-SECRETO", "sec-SECRETO", "TG-codigo-SECRETO"):
                self.assertNotIn(s, out)
            self.assertIn("gh secret set ML_REFRESH_TOKEN", out)
            self.assertEqual(campos(post.call_args[0][1])["code"], "TG-codigo-SECRETO")

    def test_main_sin_refresh_token_en_respuesta(self):
        with tempfile.TemporaryDirectory() as d:
            salida = Path(d) / "r.txt"
            rc, out = self._correr(["--redirect-uri", "https://x/cb", "--salida", str(salida)],
                                   mock.Mock(return_value={"access_token": "A"}), "TG-1")
            self.assertEqual(rc, 1)
            self.assertFalse(salida.exists())
            self.assertIn("offline_access", out)

    def test_main_http_error(self):
        with tempfile.TemporaryDirectory() as d:
            salida = Path(d) / "r.txt"
            post = mock.Mock(side_effect=http_err(400, {"error": "invalid_grant", "message": "code vencido"}))
            rc, out = self._correr(["--redirect-uri", "https://x/cb", "--salida", str(salida)], post, "TG-1")
            self.assertEqual(rc, 1)
            self.assertIn("HTTP 400", out)
            self.assertFalse(salida.exists())

    def test_main_rechaza_salida_dentro_del_repo(self):
        dentro = obt.REPO / "bot" / "state" / "token.txt"
        post = mock.Mock()
        rc, out = self._correr(["--redirect-uri", "https://x/cb", "--salida", str(dentro)], post, "TG-1")
        self.assertEqual(rc, 2)
        post.assert_not_called()
        self.assertFalse(dentro.exists())

    def test_salida_default_fuera_del_repo(self):
        self.assertFalse(obt._dentro_del_repo(obt.SALIDA_DEFAULT))


if __name__ == "__main__":
    unittest.main()
