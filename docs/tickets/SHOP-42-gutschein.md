# SHOP-42: Gutscheincode im Warenkorb einlösen

**User Story:** Als Kunde möchte ich einen Gutscheincode im Warenkorb einlösen, damit ich beim Einkauf spare.

## Regeln

- Der Code `SPAR10` gibt 10 % Rabatt auf die Zwischensumme.
- Pro Bestellung gilt höchstens ein Gutschein.
- Der Rabatt erscheint als eigene Zeile „Gutschein (SPAR10)“ in der Zusammenfassung.
- Der Gutschein bleibt nach einem Reload erhalten.

## Akzeptanzkriterien

```gherkin
Funktionalität: Gutschein im Warenkorb

  Szenario: Gültiger Gutschein
    Angenommen ein Artikel liegt im Warenkorb
    Wenn ich den Code "SPAR10" einlöse
    Dann sehe ich eine Rabattzeile "Gutschein (SPAR10)" mit 10 % der Zwischensumme
    Und die Gesamtsumme sinkt um diesen Betrag

  Szenario: Ungültiger Gutschein
    Angenommen ein Artikel liegt im Warenkorb
    Wenn ich den Code "GIBTSNICHT" einlöse
    Dann sehe ich die Meldung "Dieser Gutschein ist ungültig"
    Und die Gesamtsumme bleibt unverändert

  Szenario: Gutschein entfernen
    Angenommen der Code "SPAR10" ist eingelöst
    Wenn ich den Gutschein entferne
    Dann verschwindet die Rabattzeile
    Und es gilt wieder die volle Gesamtsumme
```
