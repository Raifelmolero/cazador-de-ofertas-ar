from pathlib import Path


def test_solo_datos_no_publica():
    """La corrida de la mañana (SOLO_DATOS=1) sale antes de publicar y no marca exclusivas."""
    src = (Path(__file__).resolve().parents[1] / "cazador_bot.py").read_text(encoding="utf-8")
    i_solo = src.index('if solo_datos:\n        save_state(state)')
    i_tg = src.index("for i, deal in enumerate(to_post):")
    assert i_solo < i_tg
    assert 'n_excl = 0 if solo_datos else' in src


def test_workflow_cron_manana_es_solo_datos():
    wf = (Path(__file__).resolve().parents[2] / ".github" / "workflows" / "deals_bot.yml").read_text(encoding="utf-8")
    assert "- cron: '23 9 * * *'" in wf
    assert "github.event.schedule == '23 9 * * *'" in wf
