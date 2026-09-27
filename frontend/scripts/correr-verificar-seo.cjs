/* eslint-disable @typescript-eslint/no-require-imports */
// Ejecuta el verificador compilado resolviendo el alias "@/" y los JSON.
const Module = require('module')
const path = require('path')
const out = path.join(__dirname, '..', '.verif-seo')
const orig = Module._resolveFilename
Module._resolveFilename = function (req, ...r) {
  if (req.startsWith('@/')) {
    const rel = req.slice(2)
    for (const c of [path.join(out, rel), path.join(__dirname, '..', rel)]) { try { return orig.call(this, c, ...r) } catch {} }
  }
  return orig.call(this, req, ...r)
}
require.extensions['.css'] = () => {}
require(path.join(out, 'scripts', 'verificar-seo.js'))
