"""salud_tokens: clasifica ok / caído / sin configurar y avisa solo si algo cayó."""
import salud_tokens as st

TODO = {
    "TELEGRAM_BOT_TOKEN": "t", "IG_ACCESS_TOKEN": "i", "THREADS_ACCESS_TOKEN": "h",
    "FB_PAGE_ACCESS_TOKEN": "f", "ML_CLIENT_ID": "a", "ML_CLIENT_SECRET": "b",
    "ML_REFRESH_TOKEN": "r", "YT_CLIENT_ID": "y", "YT_CLIENT_SECRET": "z",
    "YT_REFRESH_TOKEN": "w", "TIKTOK_CLIENT_KEY": "k", "TIKTOK_CLIENT_SECRET": "s",
    "TIKTOK_REFRESH_TOKEN": "x",
}


def http_ok(url, data=None):
    if "api.telegram.org" in url:
        return 200, {"ok": True}
    if "oauth" in url or "googleapis.com/token" in url:
        return 200, {"access_token": "tok"}
    return 200, {"id": "1"}


def estados(res):
    return {n: e for n, e, _ in res}


def test_todo_ok():
    assert set(estados(st.chequeos(TODO, http_ok)).values()) == {st.OK}


def test_secret_ausente_es_sin_config_no_caido():
    env = {k: v for k, v in TODO.items() if k != "THREADS_ACCESS_TOKEN"}
    assert estados(st.chequeos(env, http_ok))["Threads"] == st.SIN_CONFIG


def test_token_rechazado_es_caido():
    def http(url, data=None):
        if "graph.instagram.com" in url:
            return 400, {"error": {"message": "expired"}}
        return http_ok(url, data)
    res = st.chequeos(TODO, http)
    assert estados(res)["Instagram"] == st.CAIDO
    assert "expired" in {n: d for n, _, d in res}["Instagram"]


def test_error_de_red_es_caido():
    res = st.chequeos(TODO, lambda u, d=None: (0, {"error": "URLError"}))
    assert estados(res)["Facebook"] == st.CAIDO


def test_no_usa_refresh_token_de_ml_ni_tiktok():
    visto = []

    def http(url, data=None):
        visto.append((url, data))
        return http_ok(url, data)
    st.chequeos(TODO, http)
    for _, d in visto:
        assert not d or d.get("refresh_token") not in ("r", "x")
    assert not any("tiktok" in u for u, _ in visto)


def test_main_sin_caidos_no_avisa():
    enviados = []
    assert st.main([], env=TODO, http=http_ok, notificar=enviados.append) == 0
    assert enviados == []


def test_main_con_caido_avisa_y_falla():
    enviados = []

    def http(url, data=None):
        return (401, {}) if "graph.threads.net" in url else http_ok(url, data)
    assert st.main([], env=TODO, http=http, notificar=enviados.append) == 1
    assert len(enviados) == 1 and "Threads" in enviados[0]


def test_dry_no_envia():
    enviados = []
    rc = st.main(["--dry"], env=TODO, http=lambda u, d=None: (401, {}), notificar=enviados.append)
    assert rc == 1 and enviados == []
