---
name: verify-otto-shop
description: Launch the OTTO demo shop (Nuxt 4 web UI) on its own port (default 3100) and drive it in a real browser with the agent-browser CLI to prove a change works — homepage, search, category listing, product page, cart (Warenkorb) and wishlist (Merkzettel). Use whenever you need evidence that a UI change in this repo actually behaves, not just that it compiles.
---

# Verify the OTTO demo shop

The shop is a Nuxt 4 SSR app (`app/`, `server/`). All user state (cart, wishlist) lives in two browser cookies, `otto-cart` and `otto-wishlist`. There is no database and no login. Product data is a static JSON snapshot (`server/data/products.json`, 184 products).

Everything below runs from the repo root. The helper is
`.claude/skills/verify-otto-shop/scripts/otto-verify.sh` — call it as `$V`:

```bash
V=.claude/skills/verify-otto-shop/scripts/otto-verify.sh
export OTTO_VERIFY_PORT=3100                 # optional, 3100 is the default
export OTTO_VERIFY_RUN=$(date +%Y%m%d)-mytask   # optional, names the evidence folder
```

The helper sets `AGENT_BROWSER_SESSION=otto-verify-$OTTO_VERIFY_PORT` when you have not set it. Export the same value in your shell so plain `agent-browser …` calls hit the same isolated browser:

```bash
export AGENT_BROWSER_SESSION=otto-verify-${OTTO_VERIFY_PORT:-3100}
```

## Hard rules

- **Never touch port 3000.** Another project on this machine owns it. Do not stop, kill, or reuse it.
- **Kill only what you started.** `$V stop` kills the process tree whose root PID it recorded in `.data/verify/instance-$PORT/pid`. Never `pkill node` / `pkill nuxt`.
- **One instance per checkout.** All `nuxt dev` processes in this checkout share `.nuxt/`. A second instance on another port would rebuild under the first one. For parallel runs, use a separate git worktree (with its own `pnpm install`) and a different port.

## Launch

```bash
$V launch
```

This runs `./node_modules/.bin/nuxt dev --port $PORT --host localhost --strictPort --no-takeover --no-tui` in the background. It installs deps first when `node_modules` is missing. `--strictPort` fails instead of drifting to another port. `--no-takeover` stops Nuxt from killing a dev server already running on this project. The log goes to `.data/verify/instance-$PORT/server.log`.

**Ready** means `GET /` returns server-rendered HTML that contains `Beliebte Kategorien`. The helper polls for up to 90 s (a cold start takes about 5–10 s), then runs doctor. It exits non-zero and prints the log tail if the server dies or never gets ready. If the port is taken by a foreign process, it refuses and tells you to pick another port.

## Doctor

```bash
$V doctor
```

Read-only. It checks and prints:

1. the repo path and git commit (`(dirty)` when the working tree has changes)
2. that the port listener is our recorded PID or one of its children (`ok port … owned by our run`)
3. that `GET /` renders the homepage (`Zur Startseite`, `Beliebte Kategorien`)
4. that `/api/products` reports `total>0` (expect `184`)
5. that the internet is reachable (design-system icons and the OttoSans font load from OTTO's CDN)

Every line must say `ok`. Run doctor first whenever anything looks off. A `FAIL … foreign pid` means you are about to drive someone else's server — stop.

## Drive

Use the `agent-browser` CLI against `http://localhost:$PORT`. Run `agent-browser --help` or `agent-browser skills get core` for the full command set.

```bash
agent-browser set viewport 1440 900          # desktop layout; below 900px the header labels disappear
agent-browser cookies clear                  # empty cart + wishlist = baseline state
agent-browser open http://localhost:${OTTO_VERIFY_PORT:-3100}/
$V wait-ready                                # Vue mounted AND b2b-* web components upgraded
agent-browser snapshot -i -c                 # interactive elements with @refs
```

After **every** `open`, run `$V wait-ready` before you click. The HTML arrives server-rendered, but `b2b-*` buttons, chips, dropdowns, and pagination do nothing until Vue hydrates and Stencil upgrades them.

Stable handles, best first:

| Handle | Example |
| --- | --- |
| ARIA role + name | `agent-browser find role combobox fill "laptop" --name "Suche"` |
| Header links | `find role link click --name "Warenkorb"` / `"Merkzettel"` / `"Zur Startseite"` |
| Category nav | `find role link click --name "Multimedia"` (inside navigation `Kategorien`) |
| Host attribute on `b2b-*` | `agent-browser click 'b2b-button[aria-label="Auf den Merkzettel"]'` (product page) |
| URL (state lives in the query) | `wait --url "**sort=price-asc*"` |
| Cookies (side effect) | `agent-browser cookies get` → `otto-cart=…`, `otto-wishlist=…` (URL-encoded JSON) |

Some text lives in shadow DOM, and `wait --text` cannot see it: the toast (`b2b-snackbar`) and the sort label. Wait with JS instead:

```bash
agent-browser wait --fn "document.querySelector('b2b-snackbar')?.shadowRoot?.textContent.includes('liegt im Warenkorb')"
```

The per-feature recipes are in [`features/README.md`](features/README.md). Read the index, then the matching feature file.

## Evidence

```bash
$V proof <name>      # e.g. $V proof warenkorb-nach-plus
```

This writes four files to `.data/verify/evidence/$OTTO_VERIFY_RUN/`:

- `<name>.png` — screenshot
- `<name>.aria.txt` — accessibility snapshot
- `<name>.url.txt` — current URL
- `<name>.cookies.txt` — cookies, which are the cart and wishlist state

`.data/` is git-ignored, so evidence never shows up as a change. `$V evidence-dir` prints the folder.

Proof standards:

- Drive the real user path: click the header link, type into the search box, press the `+` button. Opening `/suche?q=…` directly does not prove the search box. Writing a cookie by hand does not prove "In den Warenkorb".
- Capture the action **and** the resulting state. Take a `proof` before and after a mutation, for example `warenkorb-vorher` and `warenkorb-nachher`.
- Verify side effects. A cart or wishlist change must show up in the cookie (`proof` captures it) and in a second view: the header badge, a reload, or the other page.
- No mocks. `/api/*` is part of the app. Do not route or stub it.

## Cleanup

```bash
$V stop
```

This kills the recorded process tree (TERM, then KILL after 10 s), closes the `$AGENT_BROWSER_SESSION` browser, and removes `.data/verify/instance-$PORT/`. It **keeps** `.data/verify/evidence/`. Run it after every run, including failed ones. To delete old evidence, remove `.data/verify/evidence/<run>` by hand once you no longer need it.

## Helper reference

| Command | Effect |
| --- | --- |
| `$V launch` | start (or confirm) the instance on `$OTTO_VERIFY_PORT`, wait for ready, run doctor |
| `$V doctor` | read-only health check; exit 0 only if every check passes |
| `$V wait-ready` | wait in the current browser session until Vue and the `b2b-*` components are live |
| `$V proof <name>` | save screenshot, ARIA snapshot, URL, and cookies to the evidence folder |
| `$V status` | print the recorded PID for this port, or `none` |
| `$V evidence-dir` | create and print the evidence folder for `$OTTO_VERIFY_RUN` |
| `$V stop` | kill our process tree, close the browser session, keep the evidence |
