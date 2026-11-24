#!/usr/bin/env node
// Dzieli teksty/en.json na części do tłumaczenia (teksty pogrupowane po pliku źródłowym, żeby tłumacz miał kontekst).
// Użycie: node scripts/podziel.mjs [liczba-części]   (domyślnie 8)
// Pomija teksty już przetłumaczone w pl/common.json — po aktualizacji Vortexa dzieli tylko nowe.
// Wynik: teksty/czesci/en-NN.json — { "<plik źródłowy>": { "<tekst>": { "liczba": bool } } }
import fs from "node:fs";
import path from "node:path";

const n = Number(process.argv[2] ?? 8);
const en = JSON.parse(fs.readFileSync("teksty/en.json", "utf8"));
const pl = fs.existsSync("pl/common.json") ? JSON.parse(fs.readFileSync("pl/common.json", "utf8")) : {};

const poPliku = new Map();
for (const [k, m] of Object.entries(en)) {
  if (Object.hasOwn(pl, k)) continue;
  const p = m.pliki[0];
  if (!poPliku.has(p)) poPliku.set(p, {});
  poPliku.get(p)[k] = { liczba: m.liczba };
}
const grupy = [...poPliku.entries()].sort(([a], [b]) => a.localeCompare(b));
const razem = grupy.reduce((s, [, t]) => s + Object.keys(t).length, 0);
const naCzesc = Math.ceil(razem / n);

const dir = "teksty/czesci";
fs.mkdirSync(dir, { recursive: true });
for (const f of fs.readdirSync(dir)) if (/^en-\d+\.json$/.test(f)) fs.rmSync(path.join(dir, f));

let nr = 1;
let biezaca = {};
let ile = 0;
const zapisz = () => {
  if (!ile) return;
  const f = path.join(dir, `en-${String(nr).padStart(2, "0")}.json`);
  fs.writeFileSync(f, JSON.stringify(biezaca, null, 1) + "\n");
  console.log(`${f}: ${ile} tekstów`);
  nr++; biezaca = {}; ile = 0;
};
for (const [p, t] of grupy) {
  biezaca[p] = t;
  ile += Object.keys(t).length;
  if (ile >= naCzesc) zapisz();
}
zapisz();
console.log(`do tłumaczenia: ${razem}`);
