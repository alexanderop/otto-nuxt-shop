# Merkzettel

Mit dem Herz auf jeder Produktkarte und in der Buybox merkt sich der Nutzer Artikel. Die Seite `/merkzettel` zeigt alle gemerkten Artikel als Kartenraster. Ein erneuter Klick aufs Herz entfernt den Artikel. Der Zustand liegt im Cookie `otto-wishlist` (Array von Produkt-ids), das Header-Badge zeigt die Anzahl.

## Sub-features

- `wish-empty` zeigt ohne gemerkte Artikel `Noch nichts gemerkt`.
- `wish-add-card` merkt per Herz auf einer Produktkarte (Listing, Suche, Startseite) den Artikel: `aria-pressed=true`, Label `Vom Merkzettel entfernen`.
- `wish-add-pdp` merkt per Herz in der Buybox den Artikel (siehe [Produktseite](./produktseite.md)).
- `wish-list` zeigt auf `/merkzettel` jeden gemerkten Artikel genau einmal, als Karte mit Link zur Produktseite.
- `wish-remove` entfernt per Herz auf der Merkzettel-Seite den Artikel sofort aus dem Raster.
- `wish-badge` zeigt im Header-Link `Merkzettel` die Anzahl.

## How to get to it (user POV)

- Im Header `Merkzettel` (Herz-Icon mit Badge) wählen.
- Auf einer Produktkarte oder in der Buybox das Herz (`Auf den Merkzettel`) klicken.

## Driving it with agent-browser

Voraussetzungen:

- Basis-Voraussetzungen erfüllt, Cookies leer.
- Seed-Daten: Die erste Karte in `Herren-Mode` (Standard-Sortierung) ist `Blue & Black Check Shirt`.

- **Leer.** Befehl: `agent-browser find role link click --name "Merkzettel"`, `agent-browser wait --url "**/merkzettel"` und `$V wait-ready`. Befehl: `agent-browser wait --text "Noch nichts gemerkt"`.
- **Merken auf Karte.** Befehl: `agent-browser find role link click --name "Herren-Mode"`, `agent-browser wait --url "**/kategorie/herren-mode"` und `$V wait-ready`. Befehl: `agent-browser find first 'main .product-grid button[aria-label="Auf den Merkzettel"]' click`. Befehl: `agent-browser wait --fn "document.querySelector('main .product-grid button.card__wish').getAttribute('aria-pressed')==='true'"`. Der Titel der Karte (`agent-browser get text "main .product-grid li:first-child .card__title"`) ist `Blue & Black Check Shirt`.
- **Badge und Cookie.** Befehl: `agent-browser wait --fn "document.querySelector('a[href=\"/merkzettel\"] .action__badge')?.textContent==='1'"`. `agent-browser cookies get` enthält `otto-wishlist=%5B` mit genau einer id. Befehl: `$V proof merkzettel-gemerkt`.
- **Liste.** Befehl: `agent-browser find role link click --name "Merkzettel"`, `agent-browser wait --url "**/merkzettel"` und `$V wait-ready`. `agent-browser get count "main .product-grid > li"` ist `1`. `agent-browser get text "main .card__title"` ist `Blue & Black Check Shirt`. Befehl: `$V proof merkzettel-liste`.
- **Entfernen.** Befehl: `agent-browser find role button click --name "Vom Merkzettel entfernen"`. Befehl: `agent-browser wait --text "Noch nichts gemerkt"`. Das Cookie ist `otto-wishlist=%5B%5D`, das Badge ist weg.
- **Persistenz.** Merke einen Artikel erneut, öffne `/merkzettel`, dann `agent-browser reload` und `$V wait-ready`. Die Karte bleibt.

## Gotchas

- `find role button --name "Auf den Merkzettel"` ohne Eingrenzung trifft den ersten passenden Button der Seite. Auf der Startseite ist das eine Karte in „Jetzt extra sparen“, auf der Produktseite eine Karte in „Das könnte dir auch gefallen“, nicht die Buybox. Grenze mit `main .product-grid` ein oder nimm den Buybox-Selektor aus `produktseite.md`.
- Auf `/merkzettel` gibt es kein Toast und keine Rückfrage. Der Klick aufs Herz entfernt sofort.
- Das Header-Badge erscheint erst im Client (`ClientOnly`) und synchronisiert sich asynchron. Im SSR-HTML (`curl`) fehlt es immer.
- Die Merkzettel-Seite lädt alle 184 Produkte und filtert im Client nach den ids. Eine id im Cookie, die es nicht gibt, wird stillschweigend ignoriert.
- Die Herz-Buttons der Karten sind native `<button>`s mit korrektem Namen. Nur der Buybox-Button (`b2b-button`) hat im Accessibility-Tree keinen Namen.
