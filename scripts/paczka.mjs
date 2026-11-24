#!/usr/bin/env node
// Składa tłumaczenie: teksty/czesci/pl-*.json + teksty/pl-locales.json → pl/<przestrzeń>.json,
// paczka rozszerzenia dist/Vortex-PL-<wersja>.zip (do wysłania na Nexus Mods) i opcjonalnie instalacja lokalna.
// Użycie: node scripts/paczka.mjs [--zainstaluj [katalog-danych-vortexa]]   (domyślnie ~/.config/Vortex)
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const wersja = pkg.version ?? "0.0.0";

// 1. common: części tłumaczenia (płaskie) + klucze z locales (zagnieżdżone)
const common = {};
const czesci = fs.readdirSync("teksty/czesci").filter((f) => /^pl-\d+\.json$/.test(f)).sort();
for (const f of czesci) {
  const d = JSON.parse(fs.readFileSync(path.join("teksty/czesci", f), "utf8"));
  for (const [k, v] of Object.entries(d)) {
    if (Object.hasOwn(common, k) && common[k] !== v) console.warn(`uwaga: różne tłumaczenia „${k.slice(0, 60)}” — biorę z ${f}`);
    common[k] = v;
  }
}
const locales = JSON.parse(fs.readFileSync("teksty/pl-locales.json", "utf8"));
const przestrzenie = { ...locales, common: { ...common, ...(locales.common ?? {}) } };

// 2. formy liczby mnogiej: Vortex używa i18next w trybie v3 (_0/_1/_2), ale część kluczy ma już nazwy v4
//    (_one/_other) — dopisujemy obie wersje, żeby działało niezależnie od trybu.
const ALIAS = { _0: ["_one"], _1: ["_few"], _2: ["_many", "_other"] };
function aliasy(obj) {
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v === "object") { aliasy(v); continue; }
    const m = k.match(/_(0|1|2)$/);
    if (!m) continue;
    const baza = k.slice(0, -2);
    for (const s of ALIAS[`_${m[1]}`]) if (!Object.hasOwn(obj, baza + s)) obj[baza + s] = v;
  }
}
const sortuj = (o) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b))
  .map(([k, v]) => [k, v && typeof v === "object" ? sortuj(v) : v]));

fs.rmSync("pl", { recursive: true, force: true });
fs.mkdirSync("pl");
for (const [ns, obj] of Object.entries(przestrzenie)) {
  aliasy(obj);
  fs.writeFileSync(path.join("pl", `${ns}.json`), JSON.stringify(sortuj(obj), null, 1) + "\n");
}
console.log(`pl/: ${Object.keys(przestrzenie).length} plików, common: ${Object.keys(przestrzenie.common).length} kluczy (z ${czesci.length} części)`);

// 3. paczka rozszerzenia (bez index.js i info.json — Vortex rozpoznaje tłumaczenie po jednym katalogu BCP 47)
fs.mkdirSync("dist", { recursive: true });
const zip = path.resolve("dist", `Vortex-PL-${wersja}.zip`);
fs.rmSync(zip, { force: true });
execFileSync("zip", ["-q", "-r", zip, "pl"]);
console.log(`paczka: ${path.relative(process.cwd(), zip)}`);

// 4. instalacja lokalna do katalogu danych Vortexa (lista języków w ustawieniach czyta <dane>/locales/*)
const i = process.argv.indexOf("--zainstaluj");
if (i !== -1) {
  const dane = path.resolve(process.argv[i + 1] ?? path.join(os.homedir(), ".config/Vortex"));
  if (!fs.existsSync(dane)) throw new Error(`brak katalogu danych Vortexa: ${dane} (uruchom Vortex raz)`);
  const cel = path.join(dane, "locales", "pl");
  fs.rmSync(cel, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(cel), { recursive: true });
  fs.cpSync("pl", cel, { recursive: true });
  console.log(`zainstalowano: ${cel} — w Vortexie: Ustawienia → Interfejs → Język → polski, potem restart`);
}
