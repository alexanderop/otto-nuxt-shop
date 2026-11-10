# QA-Report – Pull Request #1

## Status: QA-Lauf nicht durchführbar

Die QA konnte nicht durchgeführt werden. Jeder Shell-Befehl in der QA-Umgebung brach sofort ab, bevor er ausgeführt wurde:

```
apply-seccomp: write /proc/self/setgroups (nested userns is capability-restricted; caller must provide CAP_SYS_ADMIN): Permission denied
```

Betroffen waren:

- `gh pr view "1" --json closingIssuesReferences`: Das verlinkte Issue mit den Akzeptanzkriterien ließ sich nicht ermitteln.
- Sogar ein triviales `pwd`, sowohl mit als auch ohne Sandbox.

Daraus folgt:

- Es wurde kein Issue gelesen. Gherkin-Szenarien liegen nicht vor.
- Der Diff wurde nicht gelesen (`gh pr diff "1"`).
- Es wurden keine Browser-Tests mit `agent-browser` durchgeführt, und es gibt weder Screenshots noch ein Video.

## Szenarien

| # | Szenario | Ergebnis |
|---|----------|----------|
| – | Keine Szenarien gefunden: Das Issue konnte nicht gelesen werden | Nicht getestet |

## Funde

### F1 – QA-Umgebung kann keine Befehle ausführen (Severity: kritisch, Infrastruktur)

- **Repro:** Im QA-Workflow einen beliebigen Bash-Befehl ausführen, z. B. `pwd`.
- **Erwartet:** Der Befehl wird ausgeführt.
- **Ist:** Der Abbruch erfolgt mit dem seccomp-/User-Namespace-Fehler von oben (es fehlt `CAP_SYS_ADMIN` für einen verschachtelten User-Namespace).
- **Beleg:** Es gibt keinen Screenshot, weil der Browser nicht gestartet werden konnte. Dieser Fund ist nur durch die Fehlermeldung oben belegt.

Dies ist **kein** Befund über den Code des PR. Der PR ist ungeprüft und darf auf Grundlage dieses Laufs nicht als getestet gelten. Der Sandbox-Runner muss repariert werden (z. B. User-Namespaces auf dem Runner erlauben oder die Sandbox-Konfiguration anpassen). Danach muss die QA neu laufen.
