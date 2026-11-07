#!/usr/bin/env bash
# Launch, check, and stop a verification instance of the OTTO demo shop.
# Usage: otto-verify.sh launch|doctor|wait-ready|proof <name>|stop|status|evidence-dir
# Env:   OTTO_VERIFY_PORT (default 3100)
#        OTTO_VERIFY_RUN  (evidence subfolder, default: today's date)
#        AGENT_BROWSER_SESSION (default: otto-verify-$OTTO_VERIFY_PORT)
set -euo pipefail

PORT="${OTTO_VERIFY_PORT:-3100}"
REPO="$(cd "$(dirname "$0")/../../../.." && pwd)"
STATE="$REPO/.data/verify/instance-$PORT"
EVIDENCE_ROOT="$REPO/.data/verify/evidence"
BASE="http://localhost:$PORT"
RUN="${OTTO_VERIFY_RUN:-$(date +%Y%m%d)}"
export AGENT_BROWSER_SESSION="${AGENT_BROWSER_SESSION:-otto-verify-$PORT}"
READY_JS="!!document.querySelector('#__nuxt')?.__vue_app__ && !!document.querySelector('b2b-icon-100.hydrated')"

listener_pid() { lsof -nP -iTCP:"$PORT" -sTCP:LISTEN -t 2>/dev/null | head -1 || true; }
our_pid() { [[ -f "$STATE/pid" ]] && cat "$STATE/pid" || true; }

# our pid plus every descendant (nuxt forks a child that owns the socket)
tree() {
  local p="$1"; echo "$p"
  for c in $(pgrep -P "$p" 2>/dev/null); do tree "$c"; done
}

owns_port() {
  local lp ours
  lp="$(listener_pid)"; ours="$(our_pid)"
  [[ -n "$lp" && -n "$ours" ]] || return 1
  local all; all="$(tree "$ours")"; grep -qx "$lp" <<<"$all"
}

doctor() {
  local ok=0
  echo "repo:      $REPO"
  echo "commit:    $(git -C "$REPO" rev-parse --short HEAD)$(git -C "$REPO" diff --quiet || echo ' (dirty)')"
  echo "url:       $BASE"
  local lp; lp="$(listener_pid)"
  if [[ -z "$lp" ]]; then echo "FAIL port $PORT: nothing listening"; return 1; fi
  if owns_port; then echo "ok   port $PORT owned by our run (root pid $(our_pid))"
  else echo "FAIL port $PORT owned by foreign pid $lp: $(ps -o command= -p "$lp" | cut -c1-120)"; ok=1; fi
  local html; html="$(curl -fsS --max-time 30 "$BASE/" || true)"
  if grep -q 'Zur Startseite' <<<"$html" && grep -q 'Beliebte Kategorien' <<<"$html"; then echo "ok   GET / renders OTTO homepage (SSR)"
  else echo "FAIL GET / did not render the OTTO homepage"; ok=1; fi
  local total; total="$(curl -fsS --max-time 15 "$BASE/api/products?pageSize=1" | tr -d ' \n' | sed -n 's/.*"total":\([0-9]*\).*/\1/p')"
  if [[ "${total:-0}" -gt 0 ]]; then echo "ok   /api/products total=$total"
  else echo "FAIL /api/products returned no products"; ok=1; fi
  if curl -fsS --max-time 10 -o /dev/null https://assets.otto.de/ 2>/dev/null || curl -sS --max-time 10 -o /dev/null -w '%{http_code}' https://www.otto.de/ >/dev/null 2>&1; then echo "ok   internet reachable (design-system icons/font load from OTTO CDN)"
  else echo "warn no internet: icons and OttoSans font will be missing in screenshots"; fi
  return $ok
}

launch() {
  if [[ -n "$(listener_pid)" ]]; then
    if owns_port; then echo "already running"; doctor; return; fi
    echo "port $PORT is taken by another process; pick another: OTTO_VERIFY_PORT=31xx $0 launch" >&2
    exit 1
  fi
  mkdir -p "$STATE"
  [[ -d "$REPO/node_modules" ]] || (cd "$REPO" && pnpm install --frozen-lockfile)
  ( cd "$REPO" && exec ./node_modules/.bin/nuxt dev --port "$PORT" --host localhost --strictPort --no-takeover --no-tui ) \
    >"$STATE/server.log" 2>&1 &
  echo $! >"$STATE/pid"
  echo "started pid $(cat "$STATE/pid"), log $STATE/server.log"
  for _ in $(seq 1 90); do
    if curl -fsS --max-time 30 "$BASE/" 2>/dev/null | grep -q 'Beliebte Kategorien'; then
      echo "ready: $BASE"; doctor; return
    fi
    if ! kill -0 "$(cat "$STATE/pid")" 2>/dev/null; then echo "server exited:"; tail -30 "$STATE/server.log"; exit 1; fi
    sleep 1
  done
  echo "not ready after 90s:"; tail -30 "$STATE/server.log"; exit 1
}

stop() {
  local pid; pid="$(our_pid)"
  if [[ -z "$pid" ]]; then echo "no instance recorded for port $PORT"; return; fi
  local pids; pids="$(tree "$pid" | tr '\n' ' ')"
  kill -TERM $pids 2>/dev/null || true
  for _ in $(seq 1 20); do
    alive=0; for p in $pids; do kill -0 "$p" 2>/dev/null && alive=1; done
    [[ $alive == 0 ]] && break; sleep 0.5
  done
  kill -KILL $pids 2>/dev/null || true
  agent-browser close >/dev/null 2>&1 || true
  rm -rf "$STATE"
  echo "stopped pids $pids; port $PORT listener now: $(listener_pid)"
  echo "closed browser session $AGENT_BROWSER_SESSION"
  echo "evidence kept in $EVIDENCE_ROOT"
}

case "${1:-}" in
  launch) launch ;;
  doctor) doctor ;;
  stop) stop ;;
  status) [[ -n "$(our_pid)" ]] && echo "pid $(our_pid) port $PORT" || echo "none" ;;
  evidence-dir) d="$EVIDENCE_ROOT/$RUN"; mkdir -p "$d"; echo "$d" ;;
  wait-ready)
    # Vue mounted + Stencil b2b-* components upgraded; before this clicks on b2b-* do nothing
    agent-browser wait --fn "$READY_JS" >/dev/null && echo "ready: $(agent-browser get url)" ;;
  proof)
    name="${2:?usage: $0 proof <name>}"; d="$EVIDENCE_ROOT/$RUN"; mkdir -p "$d"
    agent-browser get url >"$d/$name.url.txt"
    agent-browser snapshot -c >"$d/$name.aria.txt"
    agent-browser cookies get >"$d/$name.cookies.txt" 2>&1 || true
    agent-browser screenshot "$d/$name.png" >/dev/null
    echo "proof $name -> $d/$name.{png,aria.txt,url.txt,cookies.txt}" ;;
  *) echo "usage: $0 launch|doctor|wait-ready|proof <name>|stop|status|evidence-dir  (OTTO_VERIFY_PORT=$PORT)"; exit 2 ;;
esac
