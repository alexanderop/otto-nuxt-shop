# Kategorie-Listing

`/kategorie/<slug>` zeigt das Produktraster einer Kategorie: Breadcrumb, H1, Trefferzahl, zwei Filter-Chips, eine Sortierung und eine Paginierung (12 pro Seite). Filter, Sortierung und Seite stehen in der URL (`?sale=true&minRating=4&sort=price-asc&page=2`). Ein Reload oder ein geteilter Link stellt den Zustand also wieder her.

## Sub-features

- `listing-nav` öffnet ein Listing über die Kategorie-Navigation im Header.
- `listing-count` zeigt die Trefferzahl `<n> Artikel` und maximal 12 Karten.
- `listing-filter-sale` filtert per Chip `Nur Sale` auf reduzierte Artikel (`?sale=true`). Ein zweiter Klick hebt den Filter auf.
- `listing-filter-rating` filtert per Chip `4 Sterne & mehr` (`?minRating=4`).
- `listing-sort` sortiert über das Dropdown `Sortieren nach` (`?sort=price-asc|price-desc|rating|discount`).
- `listing-pagination` wechselt die Seite über die Seitenbuttons (`?page=2`). Ein Filter- oder Sortierwechsel setzt die Seite zurück.
- `listing-404` zeigt bei einem unbekannten Slug `Kategorie nicht gefunden` (HTTP 404).

## How to get to it (user POV)

- Im Header in der Navigation `Kategorien` einen Link wählen, z. B. `Multimedia` oder `Sale`.
- Auf der Startseite eine Kategorie-Kachel, einen Teaser oder `Alle anzeigen` an einer Produktreihe wählen.
- Auf der Produktseite im Breadcrumb die Kategorie wählen.

## Driving it with agent-browser

Voraussetzungen:

- Basis-Voraussetzungen erfüllt. Die Startseite ist geöffnet und bereit.
- Seed-Daten: `multimedia` = 38 Artikel (4 Seiten), mit `Nur Sale` 15, mit `4 Sterne & mehr` 14. `sale` = 47 und `herren-mode` = 10.

- **Navigation.** Befehl: `agent-browser find role link click --name "Multimedia"`. Befehl: `agent-browser wait --url "**/kategorie/multimedia"` und `$V wait-ready`. `agent-browser get text h1` ist `Multimedia`. `agent-browser eval "document.querySelector('main b2b-paragraph').textContent"` ist `38 Artikel`. `agent-browser get count "main .product-grid > li"` ist `12`.
- **Filter Sale an.** Befehl: `agent-browser find role checkbox click --name "Nur Sale"`. Befehl: `agent-browser wait --url "**sale=true*"`. Die Trefferzahl wird `15 Artikel`. Warte darauf mit `agent-browser wait --fn "document.querySelector('main b2b-paragraph').textContent.includes('15')"`.
- **Filter Sale aus.** Klicke denselben Chip noch einmal. Befehl: `agent-browser wait --fn "!location.search.includes('sale')"`. Die Zahl ist wieder `38 Artikel`.
- **Filter Bewertung.** Befehl: `agent-browser find role checkbox click --name "4 Sterne & mehr"`. Befehl: `agent-browser wait --url "**minRating=4*"`. Die Zahl wird `14 Artikel`.
- **Sortierung.** Das Dropdown hat keinen zugänglichen Namen. Hole die Ref: `REF=$(agent-browser snapshot -i -c | grep -E '^- combobox \[' | sed -E 's/.*ref=(e[0-9]+).*/\1/')`, dann `agent-browser click @$REF`. Die Listbox zeigt `Beliebtheit`, `Preis aufsteigend`, `Preis absteigend`, `Beste Bewertung` und `Höchster Rabatt`. Befehl: `agent-browser find role option click --name "Preis aufsteigend"`. Befehl: `agent-browser wait --url "**sort=price-asc*"`. Die erste Karte ist die billigste: `agent-browser eval "[...document.querySelectorAll('main .card__title')].slice(0,3).map(e=>e.textContent)"` beginnt bei Multimedia ohne Filter mit `Selfie Stick Monopod`.
- **Paginierung.** Befehl: `agent-browser find role button click --name "2" --exact`. Befehl: `agent-browser wait --url "**page=2*"`. Der Button `1` ist jetzt aktiv und `2` ist `disabled`, weil die aktuelle Seite deaktiviert ist.
- **Unbekannter Slug.** Befehl: `agent-browser open http://localhost:3100/kategorie/gibtsnicht`. `agent-browser get text body` enthält `404` und `Kategorie nicht gefunden`.
- **Nachweis.** Nach Filter + Sortierung `$V proof listing-multimedia-sale-preis`. Die URL-Datei enthält beide Query-Parameter. Der Screenshot zeigt den aktiven Chip und die Trefferzahl.

## Gotchas

- Vor `$V wait-ready` reagieren Chips, Dropdown und Paginierung nicht. Es sind Stencil-Web-Components, die erst im Client aufwachen.
- Das Dropdown liegt im Shadow DOM, hat keinen Namen und kein natives `<select>`. `agent-browser select` und `find role combobox --name …` funktionieren nicht. Nimm die Snapshot-Ref (`combobox [` ohne Namen, die Header-Suche heißt `Suche`).
- Die Trefferzahl wird nach dem URL-Wechsel nachgeladen. Warte auf die neue Zahl, nicht nur auf die URL.
- Filter- und Sortierwechsel entfernen `page`. Prüfe die Paginierung deshalb nach dem letzten Filterwechsel.
- Die Kategorie `Sale` ist selbst schon ein Filter (alle reduzierten Artikel). Dort ändert `Nur Sale` die Trefferzahl nicht.
- Direktes Öffnen von `?sort=…` prüft nur das Wiederherstellen aus der URL, nicht die Bedienung. Melde das getrennt.
