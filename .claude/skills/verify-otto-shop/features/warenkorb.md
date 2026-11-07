# Warenkorb

`/warenkorb` listet die Positionen aus dem Cookie `otto-cart`, jeweils mit Bild, Titel, Menge (`−` / `+`), `Entfernen` und Zeilenpreis. Die Zusammenfassung zeigt Zwischensumme, Versand (5,95 € unter 79 €, sonst `kostenlos`) und Gesamt sowie einen Fortschrittsbalken bis zum kostenlosen Versand. Darunter lässt sich ein Gutscheincode einlösen (`SPAR10` = 10 % auf die Zwischensumme, höchstens ein Gutschein); er steht im Cookie `otto-coupon`. `Zur Kasse` zeigt nur einen Demo-Toast.

## Sub-features

- `cart-empty` zeigt ohne Positionen `Dein Warenkorb ist leer` und den Button `Weiter einkaufen`.
- `cart-line` zeigt eine Position mit Titel, Menge und Zeilenpreis = Stückpreis × Menge.
- `cart-qty-plus` erhöht mit `+` die Menge um 1. Zeilenpreis, Summen, Header-Badge und Cookie ziehen mit.
- `cart-qty-minus` verringert mit `−` die Menge um 1. Bei Menge 1 entfernt `−` die Position.
- `cart-remove` entfernt mit `Entfernen` die Position sofort und zeigt den Toast `Artikel entfernt`.
- `cart-shipping` berechnet unter 79 € Zwischensumme 5,95 € Versand und zeigt den Balken, ab 79 € `kostenlos`.
- `cart-persist` erhält den Warenkorb über einen Reload, weil er im Cookie liegt (auch im SSR-HTML).
- `cart-coupon-valid` löst `SPAR10` ein: Rabattzeile `Gutschein (SPAR10)` mit `−` 10 % der Zwischensumme (kaufmännisch auf Cent gerundet), Gesamt sinkt um genau diesen Betrag, Cookie `otto-coupon=SPAR10`, das Eingabefeld wird durch `Gutschein SPAR10 eingelöst` + `Gutschein entfernen` ersetzt.
- `cart-coupon-invalid` zeigt bei unbekanntem Code `Dieser Gutschein ist ungültig` (role `alert`, Light DOM). Summen und Cookie bleiben unverändert.
- `cart-coupon-remove` entfernt mit `Gutschein entfernen` Rabattzeile und Cookie, Gesamt ist wieder voll.
- `cart-coupon-persist` erhält den Gutschein über einen Reload (Cookie, auch im SSR-HTML).
- `cart-checkout` zeigt bei `Zur Kasse` nur den Toast `Demo: Kein echter Checkout 🙂`.

## How to get to it (user POV)

- Im Header `Warenkorb` (Korb-Icon mit Badge) wählen.
- Erst auf einer Produktseite `In den Warenkorb` klicken, dann über den Header gehen.

## Driving it with agent-browser

Voraussetzungen:

- Basis-Voraussetzungen erfüllt, Cookies leer.
- Seed-Daten: Produkt id `1` kostet `8,94 €` (reduziert). Ein Artikel ergibt Zwischensumme `8,94 €`, Versand `5,95 €`, Gesamt `14,89 €`.
- Der Warenkorb wird über die Produktseite befüllt (siehe [Produktseite](./produktseite.md)), nicht über ein gesetztes Cookie.

- **Leer.** Befehl: `agent-browser find role link click --name "Warenkorb"`, `agent-browser wait --url "**/warenkorb"` und `$V wait-ready`. Der Text `Dein Warenkorb ist leer` ist sichtbar (`agent-browser wait --text "Dein Warenkorb ist leer"`).
- **Befüllen.** Befehl: `agent-browser open http://localhost:3100/p/1` und `$V wait-ready`. Befehl: `agent-browser find role button click --name "In den Warenkorb"`. Befehl: `agent-browser wait --fn "document.querySelector('a[href=\"/warenkorb\"] .action__badge')?.textContent==='1'"`. Dann `agent-browser find role link click --name "Warenkorb"`, `agent-browser wait --url "**/warenkorb"` und `$V wait-ready`.
- **Position prüfen.** `agent-browser get text ".line__qty span"` ist `1`. `agent-browser get text ".line__price"` ist `8,94 €`. `agent-browser get text ".summary__rows"` enthält `Zwischensumme 8,94 €`, `Versand 5,95 €` und `Gesamt 14,89 €`. Befehl: `$V proof warenkorb-vorher`.
- **Menge erhöhen.** Befehl: `agent-browser find role button click --name "+" --exact`. Befehl: `agent-browser wait --fn "document.querySelector('.line__qty span').textContent.trim()==='2'"`. Der Zeilenpreis wird `17,88 €`. Befehl: `agent-browser wait --fn "document.querySelector('a[href=\"/warenkorb\"] .action__badge')?.textContent==='2'"`. `agent-browser cookies get` enthält `quantity%22%3A2`. Befehl: `$V proof warenkorb-nach-plus`.
- **Menge verringern.** Befehl: `agent-browser find role button click --name "−" --exact`. Das Zeichen ist U+2212, kein Bindestrich. Befehl: `agent-browser wait --fn "document.querySelector('.line__qty span').textContent.trim()==='1'"`. Der Zeilenpreis ist wieder `8,94 €`, das Cookie enthält `quantity%22%3A1`.
- **Persistenz.** Befehl: `agent-browser reload` und `$V wait-ready`. Menge `1` und Zeilenpreis bleiben.
- **Auf 0 verringern.** Klicke `−` noch einmal. Befehl: `agent-browser wait --text "Dein Warenkorb ist leer"`. Das Cookie ist `otto-cart=%5B%5D` und das Badge ist verschwunden. Befehl: `$V proof warenkorb-leer`.
- **Entfernen.** Befülle neu wie oben. Befehl: `agent-browser find role button click --name "Entfernen"`. Befehl: `agent-browser wait --fn "document.querySelector('b2b-snackbar')?.shadowRoot?.textContent.includes('Artikel entfernt')"`. Der leere Zustand erscheint.
- **Versandschwelle.** Lege mit `+` so viele Stück an, dass die Zwischensumme ≥ 79 € ist (id 1: 9 Stück = `80,46 €`). `.summary__rows` zeigt `Versand kostenlos` und der `b2b-progress-bar` verschwindet (`agent-browser get count "b2b-progress-bar"` = `0`).
- **Gutschein gültig.** Befülle wie oben (id 1). Befehl: `agent-browser find role textbox fill "SPAR10" --name "Gutscheincode"`, dann `agent-browser find role button click --name "Einlösen"`. Befehl: `agent-browser wait --text "Gutschein (SPAR10)"`. `agent-browser get text ".summary__rows"` enthält `Gutschein (SPAR10) −0,89 €` und `Gesamt 14,00 €` (vorher `14,89 €`). Das Cookie enthält `otto-coupon=SPAR10`. Befehl: `$V proof gutschein-gueltig`.
- **Gutschein-Persistenz.** Befehl: `agent-browser reload` und `$V wait-ready`. Rabattzeile und `Gesamt 14,00 €` bleiben.
- **Gutschein entfernen.** Befehl: `agent-browser find role button click --name "Gutschein entfernen"`. Befehl: `agent-browser wait --fn "!document.querySelector('.summary__discount')"`. `.summary__rows` zeigt wieder `Gesamt 14,89 €`, `agent-browser cookies get` enthält kein `otto-coupon`. Befehl: `$V proof gutschein-entfernt`.
- **Gutschein ungültig.** Befehl: `agent-browser find role textbox fill "GIBTSNICHT" --name "Gutscheincode"`, dann `agent-browser find role button click --name "Einlösen"`. Befehl: `agent-browser wait --text "Dieser Gutschein ist ungültig"`. `.summary__rows` bleibt `Gesamt 14,89 €`, `agent-browser get count ".summary__discount"` = `0`. Befehl: `$V proof gutschein-ungueltig`.
- **Zur Kasse.** Befehl: `agent-browser find role button click --name "Zur Kasse"`. Der Snackbar-Text enthält `Kein echter Checkout`. Die URL bleibt `/warenkorb`.

## Gotchas

- Die Mengen-Buttons heißen im Accessibility-Tree `+` und `−` (U+2212). Die `aria-label`s `Menge erhöhen` / `Menge verringern` sitzen am `b2b-button`-Host und kommen nicht an. Nimm `--exact`, sonst trifft `+` auch andere Buttons.
- Das Header-Badge synchronisiert sich asynchron und hinkt direkt nach dem Klick einen Wert hinterher. Warte mit `wait --fn` auf den Zielwert.
- Toasts liegen im Shadow DOM. `wait --text "Artikel entfernt"` funktioniert nicht.
- `−` bei Menge 1 entfernt die Position **ohne** Toast. Nur `Entfernen` zeigt `Artikel entfernt`.
- Das Label des Fortschrittsbalkens („Noch … bis zum kostenlosen Versand“) ist eine Property, kein Attribut, und liegt im Shadow DOM. Prüfe den Versand über `.summary__rows`, nicht über das Label.
- Der Stückpreis wird beim Hinzufügen ins Cookie kopiert. Ändern sich später die Produktdaten, zeigt der Warenkorb weiter den alten Preis.
- Ein Cookie per `agent-browser cookies set` zu setzen beweist nichts über `In den Warenkorb`. Nimm das nur als Abkürzung, wenn ausschließlich Warenkorb-Verhalten geprüft wird, und melde es so.
- Der Gutschein-Rabatt rechnet nur auf die Zwischensumme, nicht auf den Versand. Die Versandschwelle (79 €) gilt weiter für die Zwischensumme **vor** Rabatt.
- Die Gutschein-Steuerung sind native `<input>`/`<button>`, keine `b2b-*`-Komponenten. `find role textbox … --name "Gutscheincode"` trifft das Feld direkt; die Fehlermeldung liegt im Light DOM, also funktioniert `wait --text`.
- `snapshot -c` zeigt den Text der `alert`-Region nicht an (nur `- alert`). Prüfe die Meldung mit `wait --text` oder `get text "#coupon-error"`, nicht über den kompakten Snapshot.
- Ein Gutschein-Cookie bleibt auch bei leerem Warenkorb stehen; die Gutschein-UI erscheint erst wieder mit einer Position. Nach dem Test `agent-browser cookies clear`.
