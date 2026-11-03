#!/usr/bin/env bash
# Team Beta QA template v2 (identical in every repo). Used by .github/workflows/qa.yml, one subcommand per step.
#   qa.sh detect          what is in the tree (package.json, package manager, lockfile, Next.js, node version)
#   qa.sh install         pnpm install --frozen-lockfile, or npm ci (picked from the lockfile)
#   qa.sh lint|typecheck|test|build   run that package.json script (or the command set in qa.config.json),
#                         SKIPPED if neither exists or the check is listed in "skip"
#   qa.sh app-e2e         the app's own Playwright script, only when qa.config.json sets "appE2e"
#   qa.sh e2e             base browser checks from $QA_HOME/e2e (crawl, nav/footer links, mobile drawer,
#                         console errors, full-page screenshots at 375/1280), then the per-issue specs in
#                         .qa/issues/ in a separate run, then the Argos upload (never blocks QA)
#   qa.sh lighthouse      Lighthouse CI (3 runs, median) with the repo's lighthouserc
#   qa.sh result          writes passed/summary outputs, the step summary table and qa-artifacts/qa-summary.md
#   qa.sh all             every step in order (for local dry runs)
# Every step exits 0; the status of each check is kept in $QA_DIR and judged by `result`.
# A tree with no package.json FAILS: there is no app to test yet, so QA must not pass vacuously.
#
# QA_HOME is the .github folder the checks come from. In Claude-loop runs qa.yml points it at a copy of
# main's .github, so a branch cannot change its own checks. Per-repo settings: $QA_HOME/qa.config.json.
set -uo pipefail

QA_DIR=${QA_DIR:-${RUNNER_TEMP:-/tmp}/qa-status}
QA_HOME=${QA_HOME:-.github}
GITHUB_OUTPUT=${GITHUB_OUTPUT:-/dev/null}
GITHUB_STEP_SUMMARY=${GITHUB_STEP_SUMMARY:-/dev/null}
LHCI_VERSION=${LHCI_VERSION:-0.16}
PLAYWRIGHT_VERSION=${PLAYWRIGHT_VERSION:-1.64.1}
ARGOS_CLI_VERSION=${ARGOS_CLI_VERSION:-6.11.0}
QA_E2E_PORT=${QA_E2E_PORT:-3300}
CFG=$QA_HOME/qa.config.json
export QA_HOME   # custom commands in qa.config.json can use "$QA_HOME/scripts/..."
mkdir -p "$QA_DIR" qa-artifacts

status() { echo "$2" > "$QA_DIR/$1.status"; }
get()    { cat "$QA_DIR/$1.status" 2>/dev/null || echo SKIPPED; }
cfg()    { [ -f "$CFG" ] && jq -r "($1) // empty" "$CFG" 2>/dev/null; }       # string settings
cfg_is() { [ -f "$CFG" ] && [ "$(jq -r "$1" "$CFG" 2>/dev/null)" = "$2" ]; }  # boolean settings: cfg_is .argos.enabled false
has_script() { [ -f package.json ] && jq -e --arg s "$1" '.scripts[$s] // empty' package.json >/dev/null 2>&1; }
skipped_by_cfg() { [ -f "$CFG" ] && jq -e --arg c "$1" '(.skip // []) | index($c)' "$CFG" >/dev/null 2>&1; }
pm() {
  if [ -f pnpm-lock.yaml ]; then echo pnpm
  elif [ -f package-lock.json ]; then echo npm
  else case "$(jq -r '.packageManager // ""' package.json 2>/dev/null)" in npm@*) echo npm;; *) echo pnpm;; esac; fi
}
is_next() { jq -e '(.dependencies.next // .devDependencies.next) != null' package.json >/dev/null 2>&1; }
# How to serve the production build on a port: qa.config.json "serve" ({port} is replaced), else
# `next start` for Next.js, else the package.json "start" script.
serve_cmd() {
  local port=$1 s; s=$(cfg .serve)
  if [ -n "$s" ]; then echo "${s//\{port\}/$port}"
  elif is_next; then echo "npx --no-install next start -H 127.0.0.1 -p $port"
  elif has_script start; then echo "PORT=$port HOST=127.0.0.1 $(pm) run start"
  fi
}

detect() {
  local pkg=false lock=false next=false pmf="" p=pnpm
  [ -f package.json ] && pkg=true
  { [ -f pnpm-lock.yaml ] || [ -f package-lock.json ]; } && lock=true
  if $pkg; then
    pmf=$(jq -r '.packageManager // ""' package.json 2>/dev/null)
    is_next && next=true
    p=$(pm)
  fi
  # pnpm/action-setup errors if a version is given AND package.json has packageManager, so give one only when it doesn't.
  local pnpm_version=""
  if [[ "$pmf" != pnpm@* ]]; then pnpm_version=$(cfg .pnpmVersion); pnpm_version=${pnpm_version:-10}; fi
  local node; node=$(cfg .node); node=${node:-22}
  {
    echo "has_package=$pkg"; echo "has_lockfile=$lock"; echo "is_next=$next"; echo "pm=$p"
    echo "pnpm_version=$pnpm_version"; echo "node_version=$node"
  } | tee -a "$GITHUB_OUTPUT"
  if ! $pkg; then
    status app FAIL
    printf '%s\n' "No package.json at the repository root, so there is no app to test yet." \
      "The first claude-build issue should scaffold the site (see CLAUDE.md)." > "$QA_DIR/app.log"
    echo "::error::No package.json at the repository root: nothing to test. QA fails until the app is scaffolded."
  else
    status app PASS
  fi
}

install() {
  [ "$(get app)" = PASS ] || { status install SKIPPED; return 0; }
  local cmd
  if [ "$(pm)" = npm ]; then
    if [ -f package-lock.json ]; then cmd=(npm ci --no-audit --no-fund); else
      cmd=(npm install --no-audit --no-fund); echo "::warning::No package-lock.json committed; installing without a lockfile."; fi
  else
    if [ -f pnpm-lock.yaml ]; then cmd=(pnpm install --frozen-lockfile); else
      cmd=(pnpm install --no-frozen-lockfile); echo "::warning::No pnpm-lock.yaml committed; installing without a lockfile. Commit pnpm-lock.yaml."; fi
  fi
  if "${cmd[@]}" 2>&1 | tee "$QA_DIR/install.log"; then status install PASS; else status install FAIL; fi
}

run_script() {
  local name=$1 custom
  [ "$(get install)" = PASS ] || { status "$name" SKIPPED; return 0; }
  if skipped_by_cfg "$name"; then echo "\"$name\" is listed in qa.config.json skip; skipped."; status "$name" NOSCRIPT; return 0; fi
  custom=$(cfg ".commands.$name")
  if [ -n "$custom" ]; then
    if bash -c "$custom" 2>&1 | tee "$QA_DIR/$name.log"; then status "$name" PASS; else status "$name" FAIL; fi
    return 0
  fi
  if ! has_script "$name"; then echo "No \"$name\" script in package.json; skipped."; status "$name" NOSCRIPT; return 0; fi
  if "$(pm)" run "$name" 2>&1 | tee "$QA_DIR/$name.log"; then status "$name" PASS; else status "$name" FAIL; fi
}

# The app's own Playwright suite (monarch-site has one), when qa.config.json sets "appE2e": "<script>".
app_e2e() {
  local s; s=$(cfg .appE2e)
  [ -n "$s" ] || { status app_e2e NOSCRIPT; return 0; }
  [ "$(get install)" = PASS ] || { status app_e2e SKIPPED; return 0; }
  case "$(get build)" in FAIL|SKIPPED) status app_e2e SKIPPED; return 0;; esac
  local p; p=$(pm)
  if { "$p" exec playwright install --with-deps chromium && "$p" run "$s"; } 2>&1 | tee "$QA_DIR/app_e2e.log"; then
    status app_e2e PASS; else status app_e2e FAIL; fi
}

lighthouse() {
  [ "$(get install)" = PASS ] || { status lighthouse SKIPPED; return 0; }
  case "$(get build)" in FAIL|SKIPPED) status lighthouse SKIPPED; return 0;; esac
  skipped_by_cfg lighthouse && { status lighthouse NOSCRIPT; return 0; }
  local rc extra=() server; rc=$(cfg .lighthouserc)
  if [ -z "$rc" ]; then rc="$QA_HOME/lighthouserc.json"
  elif [[ "$rc" == .github/* ]]; then rc="$QA_HOME/${rc#.github/}"
  elif [ "${QA_LOOP:-false}" = true ] && git cat-file -e "origin/main:$rc" 2>/dev/null; then
    # A config outside .github (e.g. monarch-site's root lighthouserc.json): in Claude-loop runs use main's copy.
    git show "origin/main:$rc" > "$QA_DIR/lighthouserc.trusted.json"; rc="$QA_DIR/lighthouserc.trusted.json"
  fi
  if ! jq -e '.ci.collect.startServerCommand // empty' "$rc" >/dev/null 2>&1; then
    server=$(serve_cmd 3200)
    if [ -z "$server" ]; then
      echo "Cannot run Lighthouse: no startServerCommand in $rc, no \"serve\" in qa.config.json, not Next.js and no \"start\" script." > "$QA_DIR/lighthouse.log"
      status lighthouse FAIL; return 0
    fi
    extra=(--collect.startServerCommand="$server" --collect.startServerReadyPattern="(ready|Ready|listening|started|serving|Local|3200)")
  fi
  if npx --yes "@lhci/cli@${LHCI_VERSION}" autorun --config="$rc" "${extra[@]}" 2>&1 | tee "$QA_DIR/lighthouse.log"; then
    status lighthouse PASS
  else
    status lighthouse FAIL
  fi
  local man=qa-artifacts/lighthouse/manifest.json
  if [ -f "$man" ]; then
    jq -r '[.[] | select(.isRepresentativeRun)] | first | .summary // empty
           | "perf \((.performance*100|round)), a11y \((.accessibility*100|round)), best-practices \((."best-practices"*100|round)), SEO \((.seo*100|round))"' \
      "$man" > "$QA_DIR/lighthouse.scores" 2>/dev/null || true
  fi
}

# --- browser checks -------------------------------------------------------------------------------
e2e_setup() { # $1 = home dir; installs @playwright/test (+ chromium) outside the app
  local home=$1 with_deps=(); [ -n "${CI:-}" ] && with_deps=(--with-deps)
  rm -rf "$home"; mkdir -p "$home"; cp -R "$QA_HOME/e2e/." "$home/"
  jq --arg v "$PLAYWRIGHT_VERSION" '.dependencies["@playwright/test"]=$v' "$QA_HOME/e2e/package.json" > "$home/package.json"
  # Per-repo e2e settings: the "e2e" key of qa.config.json (or a legacy .github/qa.e2e.json).
  if [ -f "$CFG" ] && jq -e '.e2e' "$CFG" >/dev/null 2>&1; then jq '.e2e' "$CFG" > "$home/qa.e2e.json"
  elif [ -f "$QA_HOME/qa.e2e.json" ]; then cp "$QA_HOME/qa.e2e.json" "$home/qa.e2e.json"
  else echo '{}' > "$home/qa.e2e.json"; fi
  { (cd "$home" && npm install --no-audit --no-fund --loglevel=error) &&
    { [ -n "${QA_E2E_CHANNEL:-}" ] || (cd "$home" && npx playwright install "${with_deps[@]}" --only-shell chromium); }; } \
    > "$QA_DIR/e2e-setup.log" 2>&1
}

e2e() {
  local s
  for s in e2e e2e_issue argos; do status "$s" SKIPPED; done
  [ "$(get install)" = PASS ] || return 0
  case "$(get build)" in FAIL|SKIPPED) return 0;; esac
  if [ "${QA_E2E:-on}" = off ] || skipped_by_cfg e2e; then echo "Browser checks switched off (QA_E2E=off or skip: e2e)."; return 0; fi
  if [ ! -f "$QA_HOME/e2e/playwright.config.ts" ]; then
    echo "::warning::No $QA_HOME/e2e/playwright.config.ts; browser checks skipped."; return 0
  fi
  local root=$PWD out=$PWD/qa-artifacts/e2e log=$QA_DIR/e2e.log home=${RUNNER_TEMP:-/tmp}/qa-e2e server
  server=$(serve_cmd "$QA_E2E_PORT")
  if [ -z "$server" ]; then
    echo "Cannot run browser checks: not Next.js, no \"serve\" in qa.config.json and no \"start\" script to serve the build on port $QA_E2E_PORT." > "$log"
    status e2e FAIL; return 0
  fi
  rm -rf "$out"; mkdir -p "$out"
  if ! e2e_setup "$home"; then
    { echo "Could not install Playwright $PLAYWRIGHT_VERSION / chromium:"; tail -n 30 "$QA_DIR/e2e-setup.log"; } > "$log"
    status e2e FAIL; return 0
  fi
  local env_common=(QA_REPO_ROOT="$root" QA_E2E_PORT="$QA_E2E_PORT" QA_E2E_SERVER_CMD="$server" QA_E2E_CONFIG="$home/qa.e2e.json")

  # 1) Base suite (trusted). Scored and written to $QA_DIR before any issue spec runs.
  local rc
  (cd "$home" && env "${env_common[@]}" QA_E2E_OUT="$out" npx playwright test -c playwright.config.ts) 2>&1 | tee "$QA_DIR/e2e.raw.log"
  rc=${PIPESTATUS[0]}
  local probs warns shots routes
  probs=$(cat "$out"/problems/*.txt 2>/dev/null)
  warns=$(cat "$out"/warnings/*.txt 2>/dev/null)
  shots=$(find "$out/screenshots" -name '*.png' 2>/dev/null | wc -l | tr -d ' ')
  routes=$(jq -r '.routes | map(select(.status==200)) | length' "$out/routes.json" 2>/dev/null || echo 0)
  echo "$routes routes, $shots screenshots" > "$QA_DIR/e2e.info"
  { echo "# Browser checks"; echo; echo "## Problems"; echo "${probs:-none}"; echo; echo "## Warnings"; echo "${warns:-none}"; } > "$out/report.md"
  if [ "$rc" -eq 0 ] && [ -z "$probs" ]; then status e2e PASS; else status e2e FAIL; fi
  if [ -n "$probs" ]; then
    { printf '%s\n' "$probs" | head -n 40
      local n; n=$(printf '%s\n' "$probs" | wc -l | tr -d ' ')
      [ "$n" -gt 40 ] && echo "...and $((n - 40)) more in qa-artifacts/e2e/report.md"
      echo "Screenshots: qa-artifacts/e2e/screenshots/{375,1280}/ in the QA artifact."; } > "$log"
  elif [ "$rc" -ne 0 ]; then
    { echo "Playwright exited $rc without a check report (server or test crash):"; grep -v '^\s*$' "$QA_DIR/e2e.raw.log" | tail -n 40; } > "$log"
  fi
  [ -n "$warns" ] && printf '%s\n' "$warns" | sed 's/^/::warning::/' | head -n 20

  # 2) Per-issue specs written by Claude (.qa/issues/*.spec.ts), separate process, separate output.
  local specs=() f
  for f in .qa/issues/*.spec.ts; do [ -f "$f" ] && specs+=("$f"); done
  if [ "${#specs[@]}" -gt 0 ]; then
    local iout=$out/issues ilog=$QA_DIR/e2e_issue.log irc
    mkdir -p "$home/issues" "$iout"; cp "${specs[@]}" "$home/issues/"
    (cd "$home" && env "${env_common[@]}" QA_E2E_OUT="$iout" npx playwright test -c playwright.issues.config.ts) 2>&1 | tee "$QA_DIR/e2e_issue.raw.log"
    irc=${PIPESTATUS[0]}
    # Keep the end-of-test screenshots (one per test and viewport) for reviewers and the Claude review.
    mkdir -p "$out/issue-screenshots"
    find "$iout/test-results" -name '*.png' 2>/dev/null | while read -r p; do
      cp "$p" "$out/issue-screenshots/$(basename "$(dirname "$p")" | cut -c1-80).png"; done
    local nt; nt=$(jq '[.. | objects | select(has("specs")) | .specs[]] | length' "$iout/results.json" 2>/dev/null || echo "?")
    echo "${#specs[@]} file(s), $nt test(s) x desktop+mobile" > "$QA_DIR/e2e_issue.info"
    if [ "$irc" -eq 0 ]; then status e2e_issue PASS; else
      status e2e_issue FAIL
      { jq -r '.. | objects | select(has("specs")) | .specs[] | select(.ok == false) as $s
              | $s.tests[] | select(.status == "unexpected") | "- [\(.projectName)] \($s.file): \($s.title): " +
                ((.results[-1].error.message // "failed") | gsub("\u001b\\[[0-9;]*m"; "") | split("\n") | map(select(length>0)) | .[0:3] | join(" / "))' \
            "$iout/results.json" 2>/dev/null | head -n 30
        echo "Issue tests live in .qa/issues/. In QA fix rounds they are locked: fix the app, not the test."; } > "$ilog"
      [ -s "$ilog" ] && [ "$(wc -l < "$ilog")" -gt 1 ] || { echo "Issue tests failed to run:"; grep -v '^\s*$' "$QA_DIR/e2e_issue.raw.log" | tail -n 30; } >> "$ilog"
    fi
  elif [[ "${QA_BRANCH:-}" == cc/issue-* ]]; then
    echo "::warning::No .qa/issues/*.spec.ts on ${QA_BRANCH}; Claude should have written an issue test."
  fi

  # 3) Argos visual comparison of the BASE screenshots (not issue screenshots), only when the base checks
  #    passed (failing rounds get re-tested anyway, and this saves Hobby-plan screenshots). Never blocks QA.
  argos_upload "$out/screenshots"
  return 0
}

argos_upload() {
  local dir=$1
  [ "$(get e2e)" = PASS ] || return 0
  cfg_is .argos.enabled false && return 0
  [ -d "$dir" ] || return 0
  if [ -z "${ARGOS_TOKEN:-}" ]; then
    # Tokenless only works when the uploaded branch/commit are the workflow run's own (pull_request/push
    # runs), never inside a Claude-loop run (that run belongs to main/the issue event).
    if ! cfg_is .argos.tokenless true || [ "${QA_LOOP:-false}" = true ]; then
      echo "No ARGOS_TOKEN secret; visual comparison skipped." > "$QA_DIR/argos.info"; return 0
    fi
  fi
  local args=(upload "$dir" --build-name "${ARGOS_BUILD_NAME:-qa-e2e}")
  [ -n "$(cfg '.argos.threshold')" ] && args+=(--threshold "$(cfg '.argos.threshold')")
  local envs=()
  # In Claude-loop runs GITHUB_REF/GITHUB_SHA are main's (the run was started by an issue event), so tell
  # Argos which branch/commit/PR this really is, or it would record the PR as a new main baseline.
  [ -n "${QA_BRANCH:-}" ] && envs+=(ARGOS_BRANCH="$QA_BRANCH")
  [ -n "${QA_SHA:-}" ] && envs+=(ARGOS_COMMIT="$QA_SHA")
  [ -n "${QA_PR:-}" ] && envs+=(ARGOS_PR_NUMBER="$QA_PR")
  [ -n "${QA_BRANCH:-}" ] && [ "$QA_BRANCH" != main ] && envs+=(ARGOS_REFERENCE_BRANCH=main)
  if env "${envs[@]}" npx --yes "@argos-ci/cli@${ARGOS_CLI_VERSION}" "${args[@]}" > "$QA_DIR/argos.log" 2>&1; then
    status argos PASS
    echo "uploaded $(find "$dir" -name '*.png' | wc -l | tr -d ' ') screenshots; see the Argos check on the PR" > "$QA_DIR/argos.info"
  else
    status argos FAIL
    echo "upload failed (does not fail QA): $(grep -v '^\s*$' "$QA_DIR/argos.log" | tail -n 1 | cut -c1-200)" > "$QA_DIR/argos.info"
    echo "::warning::Argos upload failed; see the Argos row in the QA summary."
  fi
}

result() {
  local s=""
  add() { s+=$'\n'"### $1 failed"$'\n''```'$'\n'"$(grep -v '^\s*$' "$QA_DIR/$2.log" 2>/dev/null | grep -v '■' | grep -Ev '^npm (warn|notice)' | tail -n "$3" | cut -c1-300)"$'\n''```'; }
  [ "$(get app)" = PASS ]         || add "App check" app 10
  [ "$(get install)" != FAIL ]    || add "Install" install 40
  [ "$(get lint)" != FAIL ]       || add "Lint" lint 50
  [ "$(get typecheck)" != FAIL ]  || add "Typecheck" typecheck 50
  [ "$(get test)" != FAIL ]       || add "Unit tests" test 50
  [ "$(get build)" != FAIL ]      || add "Build" build 50
  [ "$(get app_e2e)" != FAIL ]    || add "App Playwright suite" app_e2e 50
  [ "$(get e2e)" != FAIL ]        || add "Browser tests (links, mobile drawer, console errors, screenshots)" e2e 45
  [ "$(get e2e_issue)" != FAIL ]  || add "Issue acceptance tests (.qa/issues)" e2e_issue 35
  [ "$(get lighthouse)" != FAIL ] || add "Lighthouse (median of 3)" lighthouse 30
  s="${s:0:6000}"
  local passed=false; [ -z "$s" ] && passed=true
  echo "passed=$passed" >> "$GITHUB_OUTPUT"
  { echo "summary<<QA_EOF"; printf '%s\n' "$s"; echo "QA_EOF"; } >> "$GITHUB_OUTPUT"
  show() { case "$1" in PASS) echo PASS;; FAIL) echo FAIL;; NOSCRIPT) echo "SKIPPED (not set up)";; *) echo SKIPPED;; esac; }
  info() { local v; v=$(cat "$QA_DIR/$1" 2>/dev/null); [ -n "$v" ] && echo ": $v"; }
  {
    echo "## QA summary"
    echo ""
    echo "| Check | Result |"
    echo "| --- | --- |"
    echo "| App present (package.json) | $(show "$(get app)") |"
    echo "| Install ($( [ -f package.json ] && pm || echo pnpm)) | $(show "$(get install)") |"
    echo "| Lint | $(show "$(get lint)") |"
    echo "| Typecheck | $(show "$(get typecheck)") |"
    echo "| Unit tests | $(show "$(get test)") |"
    echo "| Build | $(show "$(get build)") |"
    [ "$(get app_e2e)" = NOSCRIPT ] || echo "| App Playwright suite | $(show "$(get app_e2e)") |"
    echo "| Browser tests (links, drawer at 375px, console errors, screenshots at 375/1280) | $(show "$(get e2e)")$(info e2e.info) |"
    echo "| Issue acceptance tests (.qa/issues, desktop + mobile) | $(show "$(get e2e_issue)")$(info e2e_issue.info) |"
    echo "| Visual comparison (Argos, informational) | $(show "$(get argos)")$(info argos.info) |"
    echo "| Lighthouse, median of 3 | $(show "$(get lighthouse)")$(info lighthouse.scores) |"
  } | tee -a "$GITHUB_STEP_SUMMARY" | tee qa-artifacts/qa-summary.md
  [ -f qa-artifacts/e2e/report.md ] && { echo; sed -n '/^## Warnings/,$p' qa-artifacts/e2e/report.md | head -n 25; } >> qa-artifacts/qa-summary.md
  # Machine-readable lines (kept for anything that parses the log; nothing is sent anywhere).
  gh_word() { case "$1" in PASS) echo success;; FAIL) echo failure;; *) echo skipped;; esac; }
  local k
  for k in app:APP install:INSTALL lint:LINT typecheck:TYPECHECK test:TEST build:BUILD app_e2e:APP_E2E e2e:E2E e2e_issue:ISSUE_E2E lighthouse:LHCI; do
    echo "QA_STATUS ${k#*:}=$(gh_word "$(get "${k%%:*}")")"
  done
  if [ -n "$s" ]; then echo "QA_FAILURES_BEGIN"; printf '%s\n' "$s"; echo "QA_FAILURES_END"; fi
  echo "passed=$passed"
}

case "${1:-}" in
  detect) detect ;;
  install) install ;;
  lint|typecheck|test|build) run_script "$1" ;;
  app-e2e) app_e2e ;;
  e2e) e2e ;;
  lighthouse) lighthouse ;;
  result) result ;;
  all) detect >/dev/null; install; for c in lint typecheck test build; do run_script $c; done; app_e2e; e2e; lighthouse; result ;;
  *) echo "usage: qa.sh detect|install|lint|typecheck|test|build|app-e2e|e2e|lighthouse|result|all" >&2; exit 2 ;;
esac
exit 0
