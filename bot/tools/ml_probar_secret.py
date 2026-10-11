"""Prueba si ML_CLIENT_SECRET (variable de entorno) es válido. No imprime el secret."""
import json
import os
import urllib.error
import urllib.parse
import urllib.request

cid = os.getenv("ML_CLIENT_ID", "7890698556822222")
sec = os.getenv("ML_CLIENT_SECRET", "")
print("largo del secret cargado:", len(sec), "| espacios en los bordes:", sec != sec.strip())
data = urllib.parse.urlencode({"grant_type": "client_credentials", "client_id": cid,
                               "client_secret": sec.strip()}).encode()
req = urllib.request.Request("https://api.mercadolibre.com/oauth/token", data=data,
                             headers={"Content-Type": "application/x-www-form-urlencoded"})
try:
    with urllib.request.urlopen(req, timeout=20) as r:
        print("OK: el secret es valido (HTTP", r.status, ")")
except urllib.error.HTTPError as e:
    cuerpo = e.read().decode("utf-8", "replace")[:300]
    print("RECHAZADO HTTP", e.code, cuerpo)
