# Vortex-PL

Polskie tłumaczenie interfejsu menedżera modów [Vortex](https://github.com/Nexus-Mods/Vortex) (Nexus Mods) dla wersji 2.x.
Tłumaczenie powstało od zera dla Vortexa 2.11.0 — teksty wyciągnięte bezpośrednio z kodu, pojęcia ujednolicone w
[SLOWNIK.md](SLOWNIK.md).

## Instalacja (Linux, VortexLinux / Windows)

Najprościej — skopiuj folder `pl/` do katalogu danych Vortexa:

| System | Katalog |
| --- | --- |
| Linux (VortexLinux, AppImage/RPM) | `~/.config/Vortex/locales/pl/` |
| Windows | `%APPDATA%\Vortex\locales\pl\` |

Potem w Vortexie: **Settings → Interface → Language → polski** i restart.

Z repo: `node scripts/paczka.mjs --zainstaluj` (składa `pl/` i kopiuje do `~/.config/Vortex/locales/pl`).

Paczka `dist/Vortex-PL-<wersja>.zip` to rozszerzenie tłumaczenia do wysłania na Nexus Mods (kategoria „Vortex Translations”).
Uwaga: rozszerzenie przeciągnięte ręcznie do Vortexa nie pojawi się na liście języków, dopóki Nexus Mods nie doda go do katalogu
— lista języków bierze rozszerzenia tylko z katalogu, a foldery z `locales/` zawsze. Dlatego lokalnie instaluj przez `locales/`.

## Jak to działa

- Vortex używa i18next: kluczem jest **angielski tekst**, wartością tłumaczenie; `fallbackNS: "common"`, więc wszystkie teksty
  z kodu są w `pl/common.json`, a klucze z angielskich `locales/en/<przestrzeń>.json` — w plikach o tej samej nazwie.
- Liczba mnoga: tryb i18next v3 (`_0` = 1, `_1` = 2–4, `_2` = 5+); paczka dopisuje też aliasy v4 (`_one`, `_few`, `_many`, `_other`).
- Napisy wpisane w kod Vortexa na sztywno (bez `t()`) zostaną po angielsku — tego nie da się przetłumaczyć rozszerzeniem.
  Podgląd, co przechodzi przez tłumaczenie: uruchom Vortex z `HIGHLIGHT_I18N=true` — przetłumaczalne teksty pokazują się
  WIELKIMI LITERAMI z prefiksem `TT:`.

## Aktualizacja do nowej wersji Vortexa

```bash
git -C vortex-src fetch --depth 1 origin tag v2.X.Y && git -C vortex-src checkout v2.X.Y   # albo świeży klon do vortex-src/
npm install
node scripts/wyciagnij.mjs      # teksty/en.json z nowej wersji
node scripts/podziel.mjs 2      # części tylko z NOWYMI tekstami (pomija przetłumaczone w pl/common.json)
# przetłumacz teksty/czesci/en-NN.json → pl-NN.json (wg SLOWNIK.md)
node scripts/sprawdz.mjs teksty/czesci/pl-*.json
node scripts/paczka.mjs --zainstaluj
node scripts/sprawdz.mjs        # pełna kontrola pl/common.json; WSZYSTKO=1 pokazuje też braki
```

Przy aktualizacji zachowaj stare części (`git mv` do `teksty/czesci/<wersja>/` albo scal do jednej) — `paczka.mjs` składa
wszystkie `teksty/czesci/pl-*.json`. Kod Vortexa (`vortex-src/`) nie jest w repo: `git clone --depth 1 --branch v2.11.0
https://github.com/Nexus-Mods/Vortex.git vortex-src`.

## Pliki

| Ścieżka | Co to |
| --- | --- |
| `pl/` | gotowe tłumaczenie (generowane przez `paczka.mjs`) |
| `teksty/en.json` | teksty wyciągnięte z kodu: tekst → pliki źródłowe, źródło, czy liczba mnoga |
| `teksty/en-locales.json`, `teksty/pl-locales.json` | klucze z `locales/en` Vortexa i ich tłumaczenie (ręczne) |
| `teksty/czesci/` | części do tłumaczenia (`en-NN`) i tłumaczenia (`pl-NN`) |
| `SLOWNIK.md` | zasady stylu i słownik pojęć |
| `scripts/` | `wyciagnij`, `podziel`, `sprawdz`, `paczka` |

## Licencja

Teksty źródłowe pochodzą z Vortexa (GPL-3.0). Tłumaczenie udostępniane na tej samej licencji.
