# Słownik pojęć — tłumaczenie Vortexa na polski

Jedno pojęcie = jedno tłumaczenie w całym interfejsie. Nowe pojęcie dopisz tutaj, zanim użyjesz go w tłumaczeniu.

## Zasady stylu

- Zwracamy się do użytkownika na „ty”, bez wielkich liter w zaimkach: „Czy na pewno chcesz usunąć ten mod?”.
- Przyciski, pozycje menu i akcje — tryb rozkazujący, krótko: „Zainstaluj”, „Anuluj”, „Otwórz folder gry”.
- Nagłówki kolumn i etykiety pól — rzeczownik: „Wersja”, „Kategoria”, „Data instalacji”.
- Komunikaty o błędach — zdanie bezosobowe lub „nie udało się …”: „Nie udało się pobrać pliku”.
- Wielkie litery jak w polskim zdaniu, nie jak w angielskim tytule: „Open Game Folder” → „Otwórz folder gry”.
- Zachowuj interpunkcję końcową oryginału (kropka, dwukropek, wielokropek `...`, wykrzyknik).
- Polskie cudzysłowy „…” w treści; ale cudzysłowy wokół wstawek `"{{name}}"` zostaw jak w oryginale (`"…"`).
- Nie tłumacz: nazw własnych (Vortex, Nexus Mods, Premium, FOMOD, LOOT, Steam, GOG, Epic, Xbox, Wine, Proton, Mod Organizer,
  NMM, BepInEx, SKSE, ENB, INI, LSLib, …), nazw gier, nazw plików, rozszerzeń, poleceń, kluczy konfiguracji.

## Elementy techniczne (nie wolno ich zmieniać)

- Wstawki i18next `{{name}}`, `{{ count }}` — dokładnie te same, w tej samej liczbie; wolno przestawić kolejność w zdaniu.
- `$t(...)`, `%s`, `%d` — bez zmian.
- Znaczniki BBCode `[b]…[/b]`, `[url=…]…[/url]`, `[br][/br]`, `[list]`, `[*]`, `[color=…]`, `[h2]` — bez zmian, tłumaczysz tylko tekst
  pomiędzy; adresy URL bez zmian.
- Znaczniki HTML/JSX `<1>…</1>`, `<a>…</a>` — bez zmian.
- Znaki nowej linii `\n` i akapity — w tej samej liczbie i miejscach.
- Spacje na początku/końcu tekstu — zachowaj.

## Liczba mnoga

Teksty oznaczone `"liczba": true` dostają cztery wpisy (format i18next v3, polskie formy):

| Klucz | Kiedy | Przykład dla „{{ count }} file” |
| --- | --- | --- |
| `tekst` | bez liczby / zapas | `{{ count }} plików` |
| `tekst_0` | 1 | `{{ count }} plik` |
| `tekst_1` | 2–4, 22–24, … | `{{ count }} pliki` |
| `tekst_2` | 0, 5–21, 25–31, … | `{{ count }} plików` |

## Pojęcia

| Angielski | Polski | Uwagi |
| --- | --- | --- |
| mod / mods | mod / mody (dop. modów) | |
| mod manager | menedżer modów | |
| install / installation / installer | zainstaluj / instalacja / instalator | |
| uninstall / remove | odinstaluj / usuń | remove = usuń |
| reinstall | zainstaluj ponownie | |
| enable / disable / enabled / disabled | włącz / wyłącz / włączony / wyłączony | |
| deploy / deployment / purge | wdróż / wdrożenie / wycofaj (wdrożenie) | purge = „wycofaj mody”, „wycofanie” |
| deployment method | metoda wdrażania | |
| hardlink / symlink / move deployment | dowiązania twarde / dowiązania symboliczne / przenoszenie | |
| staging folder | folder przejściowy | „folder przejściowy modów” gdy trzeba doprecyzować |
| download / downloads | pobierz / pobrane (pliki), pobieranie | lista: „Pobrane”; proces: „pobieranie” |
| archive | archiwum | |
| load order | kolejność wczytywania | |
| plugin (gry Bethesdy, .esp/.esm) | wtyczka | |
| master (plugin) | plik nadrzędny (master) | |
| profile | profil | |
| collection / collections | kolekcja / kolekcje | |
| curator | kurator | |
| game / game mode | gra / tryb gry | |
| managed game | zarządzana gra | |
| discovery / discover / scan | wykrywanie / wykryj / skanuj | |
| tool / tools / dashlet | narzędzie / narzędzia / panel | |
| dashboard | pulpit | |
| extension | rozszerzenie | |
| theme | motyw | |
| settings / preferences | ustawienia | |
| interface | interfejs | |
| workarounds | obejścia | |
| conflict / rule / dependency | konflikt / reguła / zależność | |
| load before / load after | wczytuj przed / wczytuj po | |
| requires / recommends | wymaga / zaleca | |
| incompatible | niezgodny | |
| file override | nadpisanie pliku | |
| endorse / endorsement | poleć / polecenie | Nexus Mods „Endorse” |
| track / tracked | obserwuj / obserwowane | |
| category | kategoria | |
| version / update / update available | wersja / aktualizacja / dostępna aktualizacja | |
| check for updates | sprawdź aktualizacje | |
| restart | uruchom ponownie | |
| log in / log out / account | zaloguj się / wyloguj się / konto | |
| notification | powiadomienie | |
| dismiss | odrzuć | „Dismiss all” → „Odrzuć wszystkie” |
| attribute / column | atrybut / kolumna | |
| filter / sort / search | filtr / sortuj / szukaj | |
| feedback / report / support bundle | opinia / zgłoszenie / pakiet diagnostyczny | |
| save game / savegame | zapis gry | |
| executable | plik wykonywalny | |
| script extender | Script Extender | nazwa własna |
| variant | wariant | |
| source (mod source) | źródło | |
| loose files | luźne pliki | |
| browse | przeglądaj | |
| elevated / administrator | z uprawnieniami administratora | |
| quick launch | szybkie uruchamianie | |
| backup / restore | kopia zapasowa / przywróć | |
| Cancel / OK / Continue / Close / Yes / No | Anuluj / OK / Kontynuuj / Zamknij / Tak / Nie | |
| More / Less / Details | Więcej / Mniej / Szczegóły | |
| Never / Ignore / Retry / Skip | Nigdy / Ignoruj / Ponów / Pomiń | |

## Pojęcia ustalone przy tłumaczeniu 2.11.0

| Angielski | Polski | Uwagi |
| --- | --- | --- |
| revision (kolekcji) | rewizja | |
| log / logs | dziennik / dzienniki | nie „logi” |
| changelog | lista zmian | |
| health check | kontrola stanu | |
| patch / binary patching | łatka / łatanie binarne | |
| Workshop (kolekcje) | warsztat | |
| INI tweak | poprawka INI | |
| instance | instancja | |
| snapshot | migawka | |
| issue tracker | system zgłoszeń | |
| savegame, autosave, quicksave | zapis gry, autozapis, szybki zapis | |
| Vortex (odmiana) | Vortexa, w Vortexie | „Zamknij Vortexa” |
| enable / disable wstawiane w zdanie (`{{enable}}`) | włączyć / wyłączyć | bezokolicznik; przycisk „Enable” = „Włącz” |
| `<None>`, `<No category>` … | `<Brak>`, `<Brak kategorii>` … | tłumaczyć — to tekst, nie znacznik |
