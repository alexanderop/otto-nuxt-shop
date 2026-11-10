# QA-Report – Pull Request #1

## Status: nicht getestet (Testumgebung blockiert)

Ich konnte für diesen PR keinen QA-Lauf durchführen. Im Runner bricht jeder Shell-Befehl schon vor dem Start ab, auch ein einfaches `pwd`, und das mit und ohne Sandbox:

```
apply-seccomp: write /proc/self/setgroups (nested userns is capability-restricted; caller must provide CAP_SYS_ADMIN): Permission denied
```

Damit fehlte mir jedes Werkzeug für die geforderten Schritte:

- `gh pr view "1" --json closingIssuesReferences`: Ich konnte das verlinkte Issue nicht ermitteln.
- `gh issue view <nummer>`: Ich konnte die Akzeptanzkriterien und Gherkin-Szenarien nicht lesen.
- `gh pr diff "1"`: Ich konnte den Diff nicht lesen.
- `agent-browser --session otto-verify-3100 …`: Es gab keinen Browser-Test, keine Screenshots und kein Video.

## Szenarien

| # | Szenario | Ergebnis |
|---|----------|----------|
| – | Die Szenarien sind unbekannt, weil das Issue nicht lesbar war. | ❌ Nicht getestet |

Da kein Szenario geprüft wurde, gibt es auch keine Screenshots. Kein Szenario gilt als belegt.

## Funde

Im Shop wurden keine Funde ermittelt, weil keine Tests liefen. Das Problem liegt in der Infrastruktur:

### I1 – Shell-Ausführung im QA-Runner unmöglich (Severity: blockierend)

- **Repro:** Im QA-Job einen beliebigen Bash-Befehl ausführen, z. B. `pwd`.
- **Erwartet:** Der Befehl läuft.
- **Ist:** Abbruch mit `apply-seccomp: write /proc/self/setgroups … Permission denied`. Der Runner erlaubt keine verschachtelten User-Namespaces, der Sandbox-Wrapper braucht sie aber.
- **Vorschlag:** Den Runner mit den nötigen Rechten starten oder den Sandbox-/Seccomp-Wrapper für diesen Job anpassen. Danach den QA-Lauf wiederholen.

Das ist kein Urteil über die Qualität des PR. Er bleibt ungeprüft und darf ohne erneuten QA-Lauf nicht als bestanden gelten.
