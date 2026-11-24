#!/usr/bin/env node
// Wyciąga teksty interfejsu z kodu Vortexa (parser TypeScript, nie regex).
// Użycie: node scripts/wyciagnij.mjs [katalog-kodu-vortexa]   (domyślnie ./vortex-src)
// Wynik: teksty/en.json — { "<tekst>": { "pliki": [...], "zrodlo": "t|wlasciwosc|api", "liczba": bool } }
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = path.resolve(process.argv[2] ?? "vortex-src");
const katalogi = ["src/renderer/src", "src/main/src", "extensions"];
const wynikPlik = path.resolve("teksty/en.json");

// Funkcje, których 1. argument to tekst do tłumaczenia.
const FUNKCJE_T = new Set(["t", "translate", "tFunc", "_t"]);
// Wywołania API, w których tekst stoi na danej pozycji (Vortex tłumaczy go później).
const API_POZYCJE = {
  showDialog: [1],
  registerAction: [4],
  registerMainPage: [1],
  registerSettings: [0],
  registerDashlet: [0],
  registerFooter: [],
  registerBanner: [],
  showErrorNotification: [0],
};
// Właściwości obiektów, które Vortex przepuszcza przez t() (dialogi, powiadomienia, akcje, kolumny).
const WLASCIWOSCI = new Set([
  "title", "text", "message", "description", "label", "placeholder", "tooltip", "bbcode",
  "header", "caption", "hint", "subtitle", "summary", "buttonText", "helpText", "help",
  "confirmText", "cancelText", "emptyText", "noun", "dialogTitle", "detail",
]);
// "name" tylko w definicjach kolumn tabel (obiekt ma placement / calc / isToggleable).
const KOLUMNY = new Set(["placement", "calc", "isToggleable", "isSortable", "edit"]);

const wyniki = new Map();

function dodaj(tekst, plik, zrodlo, liczba = false) {
  if (typeof tekst !== "string") return;
  const s = tekst;
  if (!/[A-Za-z]/.test(s)) return;
  if (s.length > 4000) return;
  if (zrodlo !== "t") {
    // identyfikatory, ścieżki, adresy, klasy CSS
    if (!/\s/.test(s) && !/^[A-Z][a-z]/.test(s)) return;
    if (/^(https?:|file:|\.{0,2}\/)/.test(s)) return;
    if (/^[\w.-]+\.(json|js|ts|dll|exe|esp|esm|bsa|ba2)$/i.test(s)) return;
  }
  const rel = path.relative(root, plik);
  const w = wyniki.get(s) ?? { pliki: new Set(), zrodla: new Set(), liczba: false };
  w.pliki.add(rel);
  w.zrodla.add(zrodlo);
  w.liczba ||= liczba;
  wyniki.set(s, w);
}

// Wartość literału: 'a', `a` (bez ${}), 'a' + 'b'.
function literal(n) {
  if (!n) return undefined;
  if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) return n.text;
  if (ts.isParenthesizedExpression(n)) return literal(n.expression);
  if (ts.isBinaryExpression(n) && n.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const a = literal(n.left);
    const b = literal(n.right);
    return a !== undefined && b !== undefined ? a + b : undefined;
  }
  return undefined;
}

function nazwaWywolania(e) {
  if (ts.isIdentifier(e)) return e.text;
  if (ts.isPropertyAccessExpression(e)) return e.name.text;
  return undefined;
}

function maCount(arg) {
  if (!arg || !ts.isObjectLiteralExpression(arg)) return false;
  return arg.properties.some((p) => p.name && ts.isIdentifier(p.name) && p.name.text === "count")
    || arg.properties.some((p) => ts.isShorthandPropertyAssignment(p) && p.name.text === "count");
}

function przejdz(plik, zrodlo) {
  const sf = ts.createSourceFile(plik, zrodlo, ts.ScriptTarget.Latest, true,
    plik.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const odwiedz = (n) => {
    if (ts.isCallExpression(n)) {
      const nazwa = nazwaWywolania(n.expression);
      if (nazwa && FUNKCJE_T.has(nazwa)) {
        const a0 = n.arguments[0];
        if (a0 && ts.isArrayLiteralExpression(a0)) {
          a0.elements.forEach((el) => dodaj(literal(el), plik, "t"));
        } else {
          dodaj(literal(a0), plik, "t", maCount(n.arguments[1]));
        }
      } else if (nazwa && Object.hasOwn(API_POZYCJE, nazwa)) {
        for (const i of API_POZYCJE[nazwa]) dodaj(literal(n.arguments[i]), plik, "api");
      }
    } else if (ts.isPropertyAssignment(n) && n.name && (ts.isIdentifier(n.name) || ts.isStringLiteral(n.name))) {
      const klucz = n.name.text;
      const v = literal(n.initializer);
      if (v !== undefined) {
        if (WLASCIWOSCI.has(klucz)) {
          dodaj(v, plik, "wlasciwosc");
        } else if (klucz === "name" && ts.isObjectLiteralExpression(n.parent)
          && n.parent.properties.some((p) => p.name && ts.isIdentifier(p.name) && KOLUMNY.has(p.name.text))) {
          dodaj(v, plik, "wlasciwosc");
        }
      }
    } else if (ts.isJsxAttribute(n) && n.initializer && ts.isStringLiteral(n.initializer)) {
      // <Button tooltip="..."> — Vortex zwykle tłumaczy tooltip/placeholder w komponencie
      const k = n.name.getText(sf);
      if (["tooltip", "placeholder", "title", "label"].includes(k)) dodaj(n.initializer.text, plik, "wlasciwosc");
    }
    ts.forEachChild(n, odwiedz);
  };
  odwiedz(sf);
}

function pliki(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", "dist", "build", "__tests__", "__mocks__", "test", "tests"].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...pliki(p));
    else if (/\.tsx?$/.test(e.name) && !/\.(test|spec|d|demo|stories)\.tsx?$/.test(e.name)) out.push(p);
  }
  return out;
}

let n = 0;
for (const k of katalogi) {
  for (const p of pliki(path.join(root, k))) {
    przejdz(p, fs.readFileSync(p, "utf8"));
    n++;
  }
}

// Klucze z angielskich plików locales (np. "view_all", "actions::search", formy _plural).
const locales = path.join(root, "locales/en");
const kluczeLocales = {};
for (const f of fs.readdirSync(locales).filter((x) => x.endsWith(".json"))) {
  kluczeLocales[f.replace(/\.json$/, "")] = JSON.parse(fs.readFileSync(path.join(locales, f), "utf8"));
}

const posortowane = [...wyniki.entries()].sort(([a], [b]) => a.localeCompare(b));
const obiekt = {};
for (const [s, w] of posortowane) {
  obiekt[s] = { pliki: [...w.pliki].sort(), zrodlo: [...w.zrodla].sort().join(","), liczba: w.liczba };
}
fs.mkdirSync(path.dirname(wynikPlik), { recursive: true });
fs.writeFileSync(wynikPlik, JSON.stringify(obiekt, null, 1) + "\n");
fs.writeFileSync(path.resolve("teksty/en-locales.json"), JSON.stringify(kluczeLocales, null, 1) + "\n");
const zT = posortowane.filter(([, w]) => w.zrodla.has("t")).length;
console.log(`plików: ${n}, tekstów: ${posortowane.length} (z t(): ${zT}), z liczbą mnogą: ${posortowane.filter(([, w]) => w.liczba).length}`);
console.log(`zapisano ${path.relative(process.cwd(), wynikPlik)} i teksty/en-locales.json`);
