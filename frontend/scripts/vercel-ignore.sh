#!/bin/bash
# Ignored Build Step de Vercel: exit 0 = saltar el build, exit 1 = buildear.
# Corre con el Root Directory del proyecto (frontend/) como cwd.

# Previews de Dependabot: ya las valida frontend_ci.yml, no gastan Build CPU.
case "$VERCEL_GIT_COMMIT_REF" in dependabot/*) exit 0 ;; esac

P=${VERCEL_GIT_PREVIOUS_SHA:-HEAD^}
# Sin commit previo conocido → buildear por las dudas.
git cat-file -e "$P^{commit}" 2>/dev/null || exit 1

# Buildear solo si cambió algo del sitio. data/oficina.json (estado de /oficina)
# lo toca cada corrida del bot y no justifica un deploy.
git diff --quiet "$P" HEAD -- . ':(exclude)data/oficina.json' \
  ../bot/state/price_history.json ../bot/state/scan_log.jsonl
