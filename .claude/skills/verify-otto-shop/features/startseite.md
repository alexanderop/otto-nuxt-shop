# Startseite

Die Startseite `/` zeigt Gutschein-Karten, zwei horizontale Karussells (Teaser, „Lass dich inspirieren“), die Kacheln „Beliebte Kategorien“, den Block „Jetzt extra sparen“ und die Produktreihe „Trending Topseller der letzten Tage“. Jede Kachel und jeder Teaser führt in ein Kategorie-Listing.

## Sub-features

- `home-render` rendert alle Abschnitte serverseitig, mit Produktkarten in „Jetzt extra sparen“ und „Trending Topseller“.
- `home-coupon` aktiviert einen Gutschein: Der Button wechselt zu `Aktiviert ✓` und ein Toast erscheint.
- `home-scroller` blättert ein Karussell mit `Weiter`. Danach erscheint `Zurück`.
- `home-tile` führt über eine Kategorie-Kachel ins passende Listing.
- `home-logo` bringt den Nutzer von jeder Seite über das Logo zurück auf `/`.

## How to get to it (user POV)

- `http://localhost:3100/` direkt öffnen.
- Auf jeder Seite das OTTO-Logo anklicken (Link `Zur Startseite`).
- Im Breadcrumb `Startseite` wählen (Listing, Suche, Produktseite).

## Driving it with agent-browser

Voraussetzungen:

- Basis-Voraussetzungen aus `README.md` erfüllt, Cookies leer.

- **Öffnen.** Befehl: `agent-browser open http://localhost:3100/` und `$V wait-ready`. Der Titel (`agent-browser get title`) ist `OTTO Demo-Shop`. `agent-browser find role heading text --name "Beliebte Kategorien"` liefert die Überschrift.
- **Abschnitte.** Befehl: `agent-browser snapshot -i -c`. Der Snapshot enthält die Headings `Beliebte Kategorien`, `Lass dich inspirieren`, `Jetzt extra sparen` und `Trending Topseller der letzten Tage`, vier Buttons `Zur Aktivierung ›` und Produktlinks mit `€`-Preis.
- **Gutschein aktivieren.** Befehl: `agent-browser find first 'button.coupon__cta' click`. Befehl: `agent-browser wait --fn "document.querySelector('b2b-snackbar')?.shadowRoot?.textContent.includes('Gutschein aktiviert')"`. Danach liefert `agent-browser find role button text --name "Aktiviert ✓"` den deaktivierten Button.
- **Karussell blättern.** Befehl: `agent-browser find role button click --name "Weiter"`. Befehl: `agent-browser wait --fn "document.querySelector('.scroller__track').scrollLeft>0"`. Ein Button `Zurück` existiert jetzt (`agent-browser find role button text --name "Zurück"` schlägt nicht fehl).
- **Kategorie-Kachel.** Befehl: `agent-browser find role link click --name "Laptops" --exact`. Befehl: `agent-browser wait --url "**/kategorie/multimedia"`. `agent-browser get text h1` ist `Multimedia`.
- **Zurück per Logo.** Befehl: `agent-browser find role link click --name "Zur Startseite"`. Befehl: `agent-browser wait --url "http://localhost:3100/"`.
- **Nachweis.** Befehl: `$V proof startseite`. Screenshot und ARIA-Snapshot zeigen den Header mit `OTTO` und die Abschnitts-Headings.

## Gotchas

- Die Gutschein-Aktivierung ist reine Demo. Sie wird nicht gespeichert, ist nach einem Reload weg und ändert die Warenkorb-Summe nicht, obwohl der Toast „wird im Warenkorb abgezogen“ sagt. Prüfe keinen Rabatt im Warenkorb.
- Mehrere Kacheln und Teaser zeigen auf dieselbe Kategorie. „Laptops“, „Smartphones“ und „Apple Perfect Match“ führen alle nach `/kategorie/multimedia`. Prüfe die URL, nicht nur den Linktext.
- Es gibt mehrere `Weiter`-Buttons, einen pro Karussell. `find role button … --name "Weiter"` trifft den ersten (Gutscheine). Bei 1440 px passen dort nicht alle Karten in den Viewport, der Button existiert also. Bei breiteren Viewports kann er fehlen.
- Icons und die OttoSans-Schrift kommen vom OTTO-CDN. Ohne Internet fehlen sie im Screenshot, die Funktion bleibt aber gleich.
- Die Nuxt-DevTools-Buttons (`Toggle Nuxt DevTools`) erscheinen in jedem Snapshot. Sie gehören nicht zur App.
