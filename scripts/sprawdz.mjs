#!/usr/bin/env node
// Sprawdza tłumaczenie względem tekstów źródłowych.
// Użycie: node scripts/sprawdz.mjs [plik-pl.json ...]   (domyślnie pl/common.json)
// Błędy: zmienione wstawki {{…}}, $t(…), znaczniki BBCode/HTML, liczba \n, brak form liczby mnogiej, puste tłumaczenia.
// Ostrzeżenia: teksty bez tłumaczenia, tłumaczenie identyczne z oryginałem (poza krótkimi/nazwami).
import fs from "node:fs";
import path from "node:path";

const en = JSON.parse(fs.readFileSync("teksty/en.json", "utf8"));
const pliki = process.argv.slice(2);
if (pliki.length === 0) pliki.push("pl/common.json");

const SUF = /_(0|1|2|plural)$/;
const wstawki = (s) => [...s.matchAll(/\{\{\s*[^}]+?\s*\}\}|\$t\([^)]*\)|%[sd]/g)].map((m) => m[0].replace(/\s+/g, "")).sort();
const znaczniki = (s) => [...s.matchAll(/\[\/?[a-z*]+[^\]]*\]|<\/?[a-zA-Z0-9]+[^>]*>/g)]
  .map((m) => m[0].replace(/=.*\]$/, "]").replace(/\s.*>$/, ">")).sort();
const nl = (s) => (s.match(/\n/g) ?? []).length;
const rowne = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

let bledy = 0;
let ostrz = 0;
const blad = (m) => { bledy++; console.log(`BŁĄD  ${m}`); };
const uwaga = (m) => { ostrz++; if (process.env.WSZYSTKO) console.log(`uwaga ${m}`); };
const krotko = (s) => JSON.stringify(s.length > 70 ? s.slice(0, 67) + "..." : s);

const pl = {};
for (const p of pliki) Object.assign(pl, JSON.parse(fs.readFileSync(p, "utf8")));

for (const [k, v] of Object.entries(pl)) {
  const baza = k.replace(SUF, "");
  const zrodlo = Object.hasOwn(en, k) ? k : Object.hasOwn(en, baza) ? baza : null;
  if (typeof v !== "string") continue; // zagnieżdżone klucze z locales (np. actions)
  if (zrodlo === null) continue; // klucze z locales/en (view_all itd.) — porównuje sprawdz-locales
  if (!v.trim()) { blad(`puste tłumaczenie ${krotko(k)}`); continue; }
  const wO = wstawki(zrodlo);
  const wT = wstawki(v);
  // w formach liczby mnogiej wolno pominąć {{count}} (np. „jeden plik”), ale nie dodać obcych wstawek
  const okLiczba = k !== zrodlo && wT.every((x) => wO.includes(x)) && wO.filter((x) => !/count/.test(x)).every((x) => wT.includes(x));
  if (!rowne(wO, wT) && !okLiczba) blad(`wstawki ${JSON.stringify(wO)} → ${JSON.stringify(wT)} w ${krotko(k)}`);
  if (!rowne(znaczniki(zrodlo), znaczniki(v))) blad(`znaczniki różnią się w ${krotko(k)}`);
  if (nl(zrodlo) !== nl(v)) blad(`nowe linie ${nl(zrodlo)} → ${nl(v)} w ${krotko(k)}`);
  if (/::/.test(k)) blad(`klucz zawiera „::” (separator i18next) ${krotko(k)}`);
  if (v === zrodlo && zrodlo.length > 12 && /\s/.test(zrodlo)) uwaga(`bez zmian ${krotko(k)}`);
}

for (const [k, meta] of Object.entries(en)) {
  if (!Object.hasOwn(pl, k)) { uwaga(`brak tłumaczenia ${krotko(k)}`); continue; }
  if (meta.liczba) {
    for (const s of ["_0", "_1", "_2"]) if (!Object.hasOwn(pl, k + s)) blad(`brak formy ${s} dla ${krotko(k)}`);
  }
}

const brak = Object.keys(en).filter((k) => !Object.hasOwn(pl, k)).length;
console.log(`\n${path.basename(pliki.join(", "))}: tekstów ${Object.keys(en).length}, przetłumaczonych ${Object.keys(en).length - brak}, `
  + `błędów ${bledy}, uwag ${ostrz}${process.env.WSZYSTKO ? "" : " (WSZYSTKO=1 pokazuje uwagi)"}`);
process.exit(bledy ? 1 : 0);
