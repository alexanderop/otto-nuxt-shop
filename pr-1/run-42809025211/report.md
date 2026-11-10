# QA-Report – Pull Request #1

## Status: QA konnte nicht durchgeführt werden

Der QA-Lauf brach ab, bevor ein Test laufen konnte. Der Grund ist ein Fehler in der CI-Umgebung, nicht im Code des PR.

Jeder Bash-Befehl schlug mit dieser Meldung fehl:

```
Sandbox is required but failed to initialize: Sandbox dependencies not available:
socat not installed. Restart to retry. Running it outside the sandbox
(dangerouslyDisableSandbox) is not allowed either.
```

Was deshalb nicht möglich war:

- `gh pr view "1" --json closingIssuesReferences` – das verknüpfte Issue und seine Akzeptanzkriterien ließen sich nicht lesen
- `gh pr diff "1"` – der Diff ließ sich nicht ansehen
- `agent-browser --session otto-verify-3100 …` – kein Browser-Test, keine Screenshots, keine Videoaufnahme

## Szenarien

| # | Szenario | Ergebnis |
|---|----------|----------|
| – | Konnten nicht gelesen werden (Issue nicht abrufbar) | Nicht geprüft |

Es gibt keine Screenshots: Ohne Bash ließ sich der Browser nicht starten.

## Funde

Im Produkt gibt es keine Funde, denn es wurde nichts getestet.

**Blocker in der Infrastruktur (Severity: kritisch für den QA-Lauf)**

- **Repro:** einen beliebigen Bash-Befehl im QA-Agenten-Job starten.
- **Erwartet:** Der Befehl läuft in der Sandbox.
- **Ist:** Die Sandbox startet nicht, weil `socat` auf dem Runner fehlt.
- **Abhilfe:** `socat` im Workflow installieren (z. B. `sudo apt-get install -y socat`) und den QA-Lauf neu starten.

Der PR ist nicht verifiziert. Er sollte erst gemergt werden, wenn ein erfolgreicher QA-Lauf vorliegt.
