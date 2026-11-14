#!/bin/bash
# Ignored Build Step de Vercel: exit 0 = saltar el build, exit 1 = buildear.
# Corre con el Root Directory del proyecto (frontend/) como cwd.

# Previews (cualquier rama que no sea main): ya las valida frontend_ci.yml en
# GitHub, así que no gastan Build CPU de Vercel. Solo buildea producción.
[ "$VERCEL_ENV" = "preview" ] && exit 0
case "$VERCEL_GIT_COMMIT_REF" in dependabot/*) exit 0 ;; esac

# Commits automáticos del bot (ofertas publicadas, tendencias, placas): no
# despliegan uno por uno. Los junta deploy_agrupado.yml, que hace un commit
# "deploy:" 1 vez por día; ese build compara contra el último deploy y
# levanta todo lo acumulado. Antes eran ~10 builds por día (USD 51 en oct-2026).
case "$VERCEL_GIT_COMMIT_MESSAGE" in "bot:"*|"datos:"*|"oferta manual:"*|"cupones:"*|"auditoria:"*) exit 0 ;; esac

P=${VERCEL_GIT_PREVIOUS_SHA:-HEAD^}
# Sin commit previo conocido → buildear por las dudas.
git cat-file -e "$P^{commit}" 2>/dev/null || exit 1

# Buildear solo si cambió algo del sitio. data/oficina.json (estado de /oficina)
# lo toca cada corrida del bot y no justifica un deploy.
git diff --quiet "$P" HEAD -- . ':(exclude)data/oficina.json' \
  ../bot/state/price_history.json ../bot/state/scan_log.jsonl
