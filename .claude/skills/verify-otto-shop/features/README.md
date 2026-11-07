# Verifikations-Landkarte OTTO Demo-Shop

Dieses Verzeichnis ist die gepflegte Quelle, um das nutzersichtbare Verhalten des Demo-Shops zu verifizieren. Lies zuerst diesen Index und nimm dann die passende Feature-Datei als Rezept.

## Basis-Voraussetzungen

- Der Shop läuft über `$V launch` auf `http://localhost:$OTTO_VERIFY_PORT`, Standard `3100`. Port 3000 gehört einem anderen Projekt und ist tabu.
- `V=.claude/skills/verify-otto-shop/scripts/otto-verify.sh` und `export AGENT_BROWSER_SESSION=otto-verify-${OTTO_VERIFY_PORT:-3100}` sind gesetzt.
- `$V doctor` meldet in jeder Zeile `ok`, Produkt-`total=184` eingeschlossen.
- Der Viewport ist `agent-browser set viewport 1440 900` (Desktop-Layout).
- Der Startzustand hat leere Cookies: `agent-browser cookies clear`. Dann sind Warenkorb und Merkzettel leer.
- Steuere nie eine Instanz, die nicht dieser Lauf gestartet hat (`$V doctor` → `owned by our run`).

## Konventionen

- Starte jedes Rezept aus dem Startzustand, außer seine Voraussetzungen sagen etwas anderes.
- Führe nach jedem `agent-browser open …` zuerst `$V wait-ready` aus. Vorher reagieren die `b2b-*`-Komponenten nicht auf Klicks.
- Bevorzuge ARIA-Rolle + Name (`find role … --name …`). Nimm CSS nur dort, wo eine Datei es ausdrücklich nennt, weil der Name im Shadow DOM fehlt.
- Warte auf einen Zustand (`wait --url`, `wait --text`, `wait --fn`), nie auf eine feste Zeit.
- Toast-Texte (`b2b-snackbar`) liegen im Shadow DOM. Prüfe sie mit `wait --fn "document.querySelector('b2b-snackbar')?.shadowRoot?.textContent.includes('…')"`.
- Räume nach einer Mutation auf (`agent-browser cookies clear`). Belege bleiben liegen.

## Nachweis und Skip-Meldung

- Halte die Nutzeraktion **und** den Folgezustand fest. Mache vor und nach der Mutation je ein `$V proof <feature>-<schritt>`.
- UI-Nachweis = Screenshot + ARIA-Snapshot + URL (alles über `$V proof`).
- Ein Mutationsnachweis braucht eine zweite, lesende Sicht: das Cookie `otto-cart` / `otto-wishlist` (steht in `<name>.cookies.txt`) und das Header-Badge oder die Zielseite.
- Nenne zu jedem Beleg die Feature-ID und den benutzten Einstieg.
- Ist ein Pfad nicht erreichbar, melde den versuchten Befehl und die fehlende Voraussetzung.
- Melde einen übersprungenen Einstieg nicht als verifiziert, nur weil ein anderer Pfad funktioniert hat.

## Aufbau einer Feature-Datei

Jede Datei beginnt mit einer H1 und einem Absatz zum sichtbaren Verhalten. Danach folgen genau vier H2 in dieser Reihenfolge. Die Überschriften bleiben englisch, weil `/maintain-verification-skill` sie so erwartet.

1. `Sub-features`: kurze IDs mit je einer Zeile.
2. `How to get to it (user POV)`: alle Einstiege aus Nutzersicht.
3. `Driving it with agent-browser`: beginnt mit `Voraussetzungen:`, danach Stichpunkte nach dem Muster Aktion → exakter Befehl → beobachtbares Ergebnis.
4. `Gotchas`: Fallen, die einen Lauf verschwenden oder ungültig machen.

## Features

- [Startseite](./startseite.md): Gutscheine, Teaser-Karussells, Kategorie-Kacheln, Produktreihen.
- [Suche](./suche.md): Header-Suche mit Live-Vorschlägen, Tastatur, Ergebnisseite und leerer Zustand.
- [Kategorie-Listing](./kategorie-listing.md): Kategorie-Navigation, Filter-Chips, Sortierung, Paginierung. Der Zustand steht in der URL.
- [Produktseite](./produktseite.md): Galerie, Buybox, In den Warenkorb, Merkzettel-Button, Tabs, Ausverkauft.
- [Warenkorb](./warenkorb.md): Positionen, Menge `+`/`−`, Entfernen, Summen, Versandschwelle, leerer Zustand.
- [Merkzettel](./merkzettel.md): Herz auf Karten und Produktseite, Merkzettel-Seite, Entfernen, leerer Zustand.
