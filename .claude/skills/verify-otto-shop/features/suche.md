# Suche

Die Suche im Header (grauer Pill, Combobox `Suche`) zeigt ab 2 Zeichen Live-Vorschläge. Enter oder die Lupe führen auf die Ergebnisseite `/suche?q=…`, ein Vorschlag direkt auf die Produktseite. Die Ergebnisseite nutzt dasselbe Listing (Filter, Sortierung, Paginierung) wie die Kategorien.

## Sub-features

- `search-suggest` zeigt ab 2 Zeichen bis zu 6 Vorschläge in einer Listbox.
- `search-suggest-open` öffnet per Klick auf einen Vorschlag die Produktseite.
- `search-keyboard` wählt einen Vorschlag mit `ArrowDown` und öffnet ihn mit `Enter`.
- `search-submit` führt per `Enter` oder Button `Suchen` zu `/suche?q=<begriff>` mit Heading und Trefferzahl.
- `search-empty` zeigt bei einem Begriff ohne Treffer `Keine Treffer`.
- `search-filter` funktioniert auf der Ergebnisseite wie im [Kategorie-Listing](./kategorie-listing.md).

## How to get to it (user POV)

- Auf jeder Seite in die Header-Combobox `Suche` (Placeholder „Wonach suchst du?“) tippen.
- Mit `Enter` oder dem Button `Suchen` (Lupe) abschicken.
- Einen Vorschlag mit der Maus oder per Pfeiltasten + `Enter` wählen.

## Driving it with agent-browser

Voraussetzungen:

- Basis-Voraussetzungen erfüllt. Die Startseite ist geöffnet und `$V wait-ready` ist durchgelaufen.
- Seed-Daten: `laptop` liefert genau 5 Treffer, `mascara` hat den Treffer `Essence Mascara Lash Princess` (id 1), `xyzqq` liefert 0 Treffer.

- **Vorschläge.** Befehl: `agent-browser find role combobox fill "laptop" --name "Suche"`. Befehl: `agent-browser wait --fn "document.querySelectorAll('#search-suggestions [role=option]').length>0"`. `agent-browser snapshot -i -s form` zeigt `combobox "Suche" [expanded=true]` und eine Listbox mit 5 Optionen, darunter `Apple MacBook Pro 14 Inch Space Grey`.
- **Abschicken.** Befehl: `agent-browser press Enter`. Befehl: `agent-browser wait --url "**/suche?q=laptop"`. `agent-browser get text h1` ist `Ergebnisse für „laptop“`. Die Trefferzahl `agent-browser eval "document.querySelector('main b2b-paragraph').textContent"` ist `5 Artikel`. `agent-browser get count "main .product-grid > li"` ist `5`.
- **Lupe statt Enter.** Befehl: `agent-browser find role combobox fill "watch" --name "Suche"` und `agent-browser find role button click --name "Suchen"`. Befehl: `agent-browser wait --url "**/suche?q=watch"`.
- **Vorschlag anklicken.** Befehl: `agent-browser find role combobox fill "mascara" --name "Suche"` und warte wie oben auf die Optionen. Befehl: `agent-browser find role option click --name "Essence Mascara Lash Princess"`. Befehl: `agent-browser wait --url "**/p/1"`. Der Titel ist `Essence Mascara Lash Princess | OTTO Demo`.
- **Tastatur.** Fülle erneut `mascara` ein und warte auf die Optionen. Befehl: `agent-browser press ArrowDown`. Erwartet: `agent-browser eval "document.querySelector('#search-suggestions [aria-selected=true]')?.textContent"` ist `Essence Mascara Lash Princess`. Befehl: `agent-browser press Enter`. Erwartet: Die URL ist `**/p/1` (erster Vorschlag), nicht `/suche`. **Stand 2026-11-07 schlägt dieser Schritt fehl**, siehe Gotchas.
- **Leerer Zustand.** Fülle `xyzqq` ein und drücke `Enter`. Befehl: `agent-browser wait --text "Keine Treffer"`. Die Trefferzahl ist `0 Artikel`.
- **Nachweis.** Nach dem Abschicken von `laptop` `$V proof suche-laptop`. Die URL-Datei enthält `/suche?q=laptop`. Der ARIA-Snapshot enthält das Heading und 5 Produktlinks.

## Gotchas

- Die Vorschläge kommen 150 ms verzögert (Debounce). Warte auf die Optionen, nicht mit `wait 200`.
- Unter 2 Zeichen gibt es keine Vorschläge. `Enter` sucht trotzdem.
- **Bekannter Bug (Stand 2026-11-07):** `ArrowDown` markiert keinen Vorschlag. `move()` in `app/components/SearchBox.vue:39` rechnet `(activeIndex + step + count + 1) % (count + 1) - 1`, und von `-1` aus ergibt das wieder `-1`. `Enter` landet deshalb auf `/suche?q=mascara`. `ArrowUp` springt auf den vorletzten statt auf den letzten Vorschlag. Melde `search-keyboard` als **fehlgeschlagen** mit diesem Grund, bis der Bug behoben ist. Schwäche den Schritt nicht ab.
- Wenn die Tastatur funktioniert, öffnet `ArrowDown` + `Enter` den markierten **Vorschlag**, nicht die Ergebnisseite. Wer die Ergebnisseite prüfen will, drückt `Enter` ohne Pfeiltaste.
- Die Vorschlagsliste schließt beim Blur. `agent-browser click` an anderer Stelle schließt sie, bevor ein Vorschlag gewählt ist.
- `agent-browser open "http://localhost:3100/suche?q=laptop"` prüft nur die Ergebnisseite, nicht die Header-Suche. Melde `search-submit` nur als verifiziert, wenn getippt und abgeschickt wurde.
- Die Suche prüft per Teilstring Titel, Marke und Kategorie, und die Seed-Daten von dummyjson sind englisch. `watch` findet Treffer, `uhr` und `handy` liefern 0. Ein leeres Ergebnis bei einem deutschen Begriff ist also kein Bug.
