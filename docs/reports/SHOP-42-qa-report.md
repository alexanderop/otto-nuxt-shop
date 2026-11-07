# QA-Report SHOP-42: Gutscheincode im Warenkorb einlösen

- **Branch:** `feat/gutschein` @ `7ee8d7e`
- **Datum:** 2026-11-07
- **Umgebung:** `nuxt dev` auf `http://localhost:3100` (via `verify-otto-shop`), Chromium über `agent-browser`, Viewport 1440×900, Start mit leeren Cookies
- **Video des gesamten Laufs:** [`SHOP-42/SHOP-42-qa-run.webm`](SHOP-42/SHOP-42-qa-run.webm)

## Urteil

**CRITICAL_BUGS**

Alle drei Gherkin-Szenarien bestehen. Der Rabatt wird aber nur **einmal beim Einlösen** berechnet und als fester Betrag im Cookie `otto-coupon-amount` gespeichert (`app/composables/useCoupon.ts:14`). Ändert sich danach der Warenkorb, stimmt der Rabatt nicht mehr. Im schlimmsten Fall wird die Gesamtsumme negativ (**−1,39 €**), und „Zur Kasse“ bleibt klickbar.

## Szenarien aus dem Ticket

| # | Szenario | Ergebnis | Beobachtet | Beleg |
|---|---|---|---|---|
| 1 | Gültiger Gutschein (`SPAR10`) | ✅ PASS | Zwischensumme 8,94 € → Zeile `Gutschein (SPAR10) −0,89 €`, Gesamt 14,89 € → 14,00 €, Cookie `otto-coupon=SPAR10` | [vorher](SHOP-42/s1-vorher.png), [nachher](SHOP-42/s1-gueltig.png) |
| 2 | Ungültiger Gutschein (`GIBTSNICHT`) | ✅ PASS | Meldung `Dieser Gutschein ist ungültig` (role `alert`), Gesamt bleibt 14,89 €, keine Rabattzeile | [Screenshot](SHOP-42/s2-ungueltig.png) |
| 3 | Gutschein entfernen | ✅ PASS | Rabattzeile weg, Gesamt wieder 14,89 €, `otto-coupon` gelöscht | [Screenshot](SHOP-42/s3-entfernt.png) |
| R | Regel: Gutschein bleibt nach Reload | ✅ PASS | Nach `reload` weiter `−0,89 €` / Gesamt 14,00 € | [Screenshot](SHOP-42/s4-reload.png) |
| R | Regel: höchstens ein Gutschein | ✅ PASS | Nach dem Einlösen ist das Eingabefeld weg, nur noch `Gutschein entfernen` | [Screenshot](SHOP-42/e1-kleinschreibung.png) |

## Explorative Tests ohne Fund

- Kleinschreibung und Leerzeichen (`"  spar10 "`) mit Enter: wird als `SPAR10` eingelöst. ✅
- Absenden per Enter-Taste funktioniert. ✅
- Keine Fehler in der Browser-Konsole (`agent-browser errors` leer).

## Funde

### F1: Rabatt wächst bei höherer Menge nicht mit (Severity: **Major**)

**Repro**
1. Produkt id 1 (8,94 €) in den Warenkorb legen, `/warenkorb` öffnen.
2. `SPAR10` einlösen → `−0,89 €`.
3. Mit `+` die Menge auf 5 erhöhen.

**Erwartet:** Rabatt = 10 % von 44,70 € = `−4,47 €`, Gesamt 46,18 €.
**Ist:** Rabatt bleibt `−0,89 €`, Gesamt 49,76 €. Ein Reload ändert nichts.
**Beleg:** [f1-menge-erhoeht.png](SHOP-42/f1-menge-erhoeht.png)

### F2: Rabatt bleibt hoch, wenn die Menge sinkt (Severity: **Critical**)

**Repro**
1. Produkt id 1 auf Menge 9 bringen (Zwischensumme 80,46 €).
2. `SPAR10` einlösen → `−8,05 €`.
3. Mit `−` auf Menge 1 reduzieren.

**Erwartet:** Rabatt `−0,89 €`, Gesamt 14,00 €.
**Ist:** Rabatt bleibt `−8,05 €` auf 8,94 € Zwischensumme (≈ 90 %), Gesamt `6,84 €`.
**Beleg:** [vorher](SHOP-42/f2-9stueck-eingeloest.png), [nachher](SHOP-42/f2-1stueck-rabatt-zu-hoch.png)

### F3: Gesamtsumme wird negativ; der Gutschein überlebt einen leeren Warenkorb (Severity: **Critical**)

**Repro**
1. Wie F2 Schritte 1–2 (Rabatt `−8,05 €`).
2. Die Position mit `Entfernen` löschen → `Dein Warenkorb ist leer`. Die Cookies `otto-coupon=SPAR10` und `otto-coupon-amount=8.05` bleiben stehen.
3. Produkt id 31 (Lemon, 0,71 €) in den Warenkorb legen, `/warenkorb` öffnen.

**Erwartet:** Rabatt `−0,07 €` (10 % von 0,71 €) und Gesamt 6,59 €. Mindestens darf die Gesamtsumme nie unter 0 fallen.
**Ist:** Rabatt `−8,05 €`, **Gesamt `-1,39 €`**. `Zur Kasse` bleibt aktiv und zeigt den Checkout-Toast.
**Beleg:** [leerer Warenkorb](SHOP-42/f3-leer-coupon-bleibt.png), [negative Summe](SHOP-42/f3-gesamt-negativ.png)

### F4: Der Rabattbetrag kommt ungeprüft aus einem Cookie (Severity: **Major**)

**Repro**
1. Mit eingelöstem `SPAR10` das Cookie `otto-coupon-amount` auf `500` setzen (DevTools oder `agent-browser cookies set`).
2. Seite neu laden.

**Erwartet:** Der Rabatt wird aus Code und Zwischensumme berechnet, gespeicherte Beträge werden ignoriert.
**Ist:** `Gutschein (SPAR10) −500,00 €`, Gesamt `-493,34 €`.
**Beleg:** [f4-cookie-manipuliert.png](SHOP-42/f4-cookie-manipuliert.png)

Hinweis: Der Shop hat keinen echten Checkout. Sobald einer kommt, wäre das ein direkt ausnutzbarer Preis-Exploit.

### F5: Leere Eingabe meldet „ungültig“ (Severity: **Minor**)

**Repro:** Feld leer lassen, `Einlösen` klicken.
**Erwartet:** Hinweis wie „Bitte gib einen Gutscheincode ein“ oder ein deaktivierter Button.
**Ist:** `Dieser Gutschein ist ungültig`.
**Beleg:** Video, Abschnitt nach Szenario 2.

## Ursache (für den Entwickler)

`useCoupon.redeem()` schreibt `amount = round(subtotal × 0.1)` einmalig ins Cookie `otto-coupon-amount`. `discount` liest danach nur noch diesen festen Wert. F1–F4 verschwinden, wenn `discount` als `computed` aus `code` und dem aktuellen `subtotal` berechnet wird, das Cookie `otto-coupon-amount` entfällt und `discount` auf `subtotal` begrenzt wird. Ein Regressionstest für „Menge ändern nach Einlösen“ fehlt.

## Belege

Alle Dateien liegen unter [`docs/reports/SHOP-42/`](SHOP-42/). Die vollständigen Rohbelege (ARIA-Snapshot, URL, Cookies je Schritt) liegen lokal in `.data/verify/evidence/shop-42-qa/` (git-ignored).
