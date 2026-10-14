#!/usr/bin/env node
// Elige una excusa según el tipo de fallo detectado en el log y la imprime.
// Uso: node excusa.js <ruta-al-log> [--categoria=flaky] [--author=x] [--test=x] [--file=x]

const fs = require("fs");
const path = require("path");

const args = Object.fromEntries(
  process.argv.slice(3).map((a) => {
    const [k, ...v] = a.replace(/^--/, "").split("=");
    return [k, v.join("=")];
  })
);

const logPath = process.argv[2];
const log = logPath && fs.existsSync(logPath) ? fs.readFileSync(logPath, "utf8") : "";
const excusas = JSON.parse(fs.readFileSync(path.join(__dirname, "excusas.json"), "utf8"));

const reglas = [
  ["null", /null|undefined|NoneType|NullPointer|nil pointer/i],
  ["timeout", /timeout|timed out|ETIMEDOUT|deadline exceeded/i],
  ["merge", /merge conflict|CONFLICT|<<<<<<<|rebase/i],
  ["dependencias", /npm ERR|ERESOLVE|ModuleNotFound|Cannot find module|dependency|dependabot|pip.*error/i],
  ["produccion", /production|prod\b|deploy|rollback/i],
  ["flaky", /flaky|retry|intermittent|rerun/i],
  ["tests", /FAIL|AssertionError|expected .* to|Test failed|tests? failed/i],
];

function detectar() {
  if (args.categoria && excusas[args.categoria]) return args.categoria;
  for (const [cat, re] of reglas) if (re.test(log)) return cat;
  return "generico";
}

function primero(re) {
  const m = log.match(re);
  return m ? m[1] || m[0] : null;
}

const ctx = {
  author: args.author || process.env.GITHUB_ACTOR || "alguien",
  test: args.test || primero(/(?:FAIL|✕|●)\s+([^\n]{3,60})/) || "el test",
  file: args.file || primero(/([\w./-]+\.(?:js|ts|py|go|java|rb|rs|cs|php))/) || "el archivo",
};

const cat = detectar();
const lista = excusas[cat];
const elegida = lista[Math.floor(Math.random() * lista.length)].replace(
  /\{(author|test|file)\}/g,
  (_, k) => ctx[k]
);

process.stdout.write(`${cat}\n${elegida}\n`);
