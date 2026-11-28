#!/bin/bash
# Ignored Build Step de Vercel: exit 0 = saltar el build, exit 1 = buildear.
# Corre con el Root Directory del proyecto (frontend/) como cwd.

# Previews (cualquier rama que no sea main): ya las valida frontend_ci.yml en
# GitHub, así que no gastan Build CPU de Vercel. Solo buildea producción.
[ "$VERCEL_ENV" = "preview" ] && exit 0
case "$VERCEL_GIT_COMMIT_REF" in dependabot/*) exit 0 ;; esac

# Regla 25/11: nunca un deploy por merge ni por push a main. Se acumulan
# los merges y sale un solo build agrupado cada tanto (deploy_agrupado.yml,
# cron semanal o workflow_dispatch). Solo buildea el commit "deploy:".
# Antes, el ignore salteaba bot:/datos:/oferta manual: pero NO los merges,
# y cada PR mergeado a main gastaba un build de producción.
case "$VERCEL_GIT_COMMIT_MESSAGE" in
  "deploy:"*) ;;
  *) exit 0 ;;
esac

P=${VERCEL_GIT_PREVIOUS_SHA:-HEAD^}
# Sin commit previo conocido → buildear por las dudas.
git cat-file -e "$P^{commit}" 2>/dev/null || exit 1

# Aunque el mensaje sea deploy:, no gastar CPU si no cambió el sitio.
# data/oficina.json y oficina-panel.json (estado de /oficina) los toca cada corrida del bot y
# no justifica un deploy. Tampoco bot/state (historial de precios, scan_log):
# solo cuenta lo que cambió dentro de frontend/.
git diff --quiet "$P" HEAD -- . ':(exclude)data/oficina.json' ':(exclude)data/oficina-panel.json'
