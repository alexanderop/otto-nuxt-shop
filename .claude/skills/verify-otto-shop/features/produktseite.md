# Produktseite

`/p/<id>` zeigt Breadcrumb, Bildergalerie mit Thumbnails, die Buybox (Marke, Titel, Bewertung, Preis, Lieferstatus, `In den Warenkorb`, Merkzettel-Herz), die Tabs `Beschreibung` / `Details` / `Bewertungen (n)` und die Reihe „Das könnte dir auch gefallen“.

## Sub-features

- `pdp-render` zeigt Titel, Preis und Lieferstatus aus den Produktdaten.
- `pdp-add-to-cart` legt mit `In den Warenkorb` den Artikel in den Warenkorb. Ein Toast erscheint, das Header-Badge zählt hoch, das Cookie `otto-cart` wird geschrieben.
- `pdp-wishlist` schaltet mit dem Herz-Button den Artikel auf den Merkzettel und wieder herunter.
- `pdp-gallery` wechselt per Thumbnail `Bild <n> anzeigen` das Hauptbild.
- `pdp-tabs` wechselt die Tabs. `Details` zeigt Artikelnummer, Marke, Kategorie und Lagerbestand.
- `pdp-soldout` deaktiviert bei Lagerbestand 0 den Warenkorb-Button und zeigt `Leider ausverkauft`.
- `pdp-related` öffnet über eine Karte aus „Das könnte dir auch gefallen“ eine andere Produktseite.
- `pdp-404` zeigt bei einer unbekannten id `Produkt nicht gefunden` (HTTP 404).

## How to get to it (user POV)

- Eine Produktkarte im Listing, in der Suche, auf der Startseite oder auf dem Merkzettel anklicken.
- Einen Vorschlag der Header-Suche wählen.
- Im Warenkorb Bild oder Titel einer Position anklicken.

## Driving it with agent-browser

Voraussetzungen:

- Basis-Voraussetzungen erfüllt, Cookies leer.
- Seed-Daten: id `1` = `Essence Mascara Lash Princess`, Marke `Essence`, Kategorie `Beauty & Drogerie`, Preis `8,94 €`, Bestand 99, 3 Bewertungen. id `132` = `Samsung Galaxy S8`, Bestand 0.

- **Hinkommen.** Befehl: `agent-browser open http://localhost:3100/kategorie/beauty` und `$V wait-ready`. Befehl: `agent-browser find role link click --name "Essence Mascara Lash Princess"`. Das ist der Kartenlink, dessen Name mit dem Titel beginnt. Befehl: `agent-browser wait --url "**/p/1"` und `$V wait-ready`. `agent-browser get title` ist `Essence Mascara Lash Princess | OTTO Demo`.
- **In den Warenkorb.** Befehl: `agent-browser find role button click --name "In den Warenkorb"`. Befehl: `agent-browser wait --fn "document.querySelector('b2b-snackbar')?.shadowRoot?.textContent.includes('liegt im Warenkorb')"`. Befehl: `agent-browser wait --fn "document.querySelector('a[href=\"/warenkorb\"] .action__badge')?.textContent==='1'"`. `agent-browser cookies get` enthält `otto-cart=` mit `%22id%22%3A1` und `quantity%22%3A1`.
- **Merkzettel an.** Befehl: `agent-browser click 'b2b-button[aria-label="Auf den Merkzettel"]'`. Befehl: `agent-browser wait 'b2b-button[aria-label="Vom Merkzettel entfernen"]'`. Das Badge an `a[href="/merkzettel"]` ist `1`. Das Cookie enthält `otto-wishlist=%5B1%5D`.
- **Merkzettel aus.** Befehl: `agent-browser click 'b2b-button[aria-label="Vom Merkzettel entfernen"]'`. Befehl: `agent-browser wait 'b2b-button[aria-label="Auf den Merkzettel"]'`. Das Cookie ist `otto-wishlist=%5B%5D`.
- **Tabs.** Befehl: `agent-browser find role tab click --name "Details"`. Befehl: `agent-browser wait --text "Artikelnummer"`. `agent-browser get text "dl.details"` enthält `00000001`, `Essence`, `Beauty & Drogerie` und `99`.
- **Galerie.** Befehl: `agent-browser find role button click --name "Bild 1 anzeigen"`. Das Hauptbild-`src` (`agent-browser get attr src ".gallery__main img"`) gehört zu Bild 1. Bei mehreren Bildern wechselt `Bild 2 anzeigen` das `src`.
- **Ausverkauft.** Befehl: `agent-browser open http://localhost:3100/p/132` und `$V wait-ready`. Die Buybox zeigt `Leider ausverkauft`. `agent-browser eval "document.querySelector('.buybox b2b-button[variant=primary]').hasAttribute('disabled')"` ist `true`.
- **Nachweis.** Nach dem Hinzufügen `$V proof produktseite-warenkorb`. Die Cookies-Datei enthält die Position. Der Screenshot zeigt das Badge `1`.

## Gotchas

- Der Merkzettel-Button der Buybox hat im Accessibility-Tree **keinen Namen**. Das `aria-label` sitzt am `b2b-button`-Host, nicht am inneren Button. `find role button --name "Auf den Merkzettel"` trifft deshalb das Herz der **ersten Karte in „Das könnte dir auch gefallen“**, nicht den Artikel selbst. Nimm den CSS-Selektor `b2b-button[aria-label=…]`.
- Der Toast steht im Shadow DOM von `b2b-snackbar`. `wait --text "liegt im Warenkorb"` läuft ins Timeout. Nimm `wait --fn` wie oben.
- Das Header-Badge hinkt einen Tick hinterher: Es synchronisiert sich asynchron über das Cookie. Warte mit `wait --fn` auf den Zielwert, statt ihn sofort zu lesen.
- Ein zweiter Klick auf `In den Warenkorb` legt keine zweite Position an. Er erhöht die Menge der bestehenden Position auf 2.
- Viele Seed-Produkte haben nur ein Bild, auch id `1`. Dann gibt es nur `Bild 1 anzeigen`, und ein Bildwechsel lässt sich nicht beweisen. Melde `pdp-gallery` dann mit Begründung als nicht prüfbar oder nimm ein Produkt mit mehreren Thumbnails (`agent-browser get count ".gallery__thumbs li"` > 1).
- Der Preis in der Buybox ist der reduzierte Preis (`salePrice`). Den übernimmt auch der Warenkorb, nicht den UVP.
