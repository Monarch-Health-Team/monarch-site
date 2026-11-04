#!/usr/bin/env bash
# Guardrails for the Claude build loop (claude-build.yml). Plain gh API reads (needs actions: read), no AI.
#   qa-guard.sh gate   before a build/fix run: refuse to start while the latest finished QA run on main
#                      failed (e.g. after a QA settings change), with a comment on the issue/PR.
#   qa-guard.sh round  before a fix round: stop early when every failing QA check also fails on main
#                      (not this PR's job), or when the same failures came back unchanged after a fix round.
# Env: GH_TOKEN, REPO; gate: NUM, NOTIFY, GATE (repo var CLAUDE_MAIN_QA_GATE, "off" disables it);
# round: CUR_FAILED, CUR_SUMMARY, PREV_FAILED, PREV_SUMMARY (PREV_* empty before the first fix round).
# Failed checks are QA_STATUS keys (LINT, BUILD, E2E, ISSUE_E2E, ...), as printed by qa.sh result.
set -uo pipefail

norm() { printf '%s' "${1:-}" | tr -c 'A-Z0-9_' '\n' | sed '/^$/d' | sort -u | paste -sd, -; }
# Same failure text, ignoring colour codes, numbers (times, ports, line numbers) and whitespace.
fp() { printf '%s' "${1:-}" | sed 's/\x1b\[[0-9;]*m//g' | tr -d '0-9 \t\r\n' | sha256sum | cut -c1-16; }

# Latest finished (success/failure) QA run on main that is not a PR run. Cancelled runs are ignored.
main_qa() {
  MAIN_CONCLUSION=none; MAIN_URL=""; MAIN_FAILED=""
  local run id jid
  run=$(gh api "repos/$REPO/actions/workflows/qa.yml/runs?branch=main&status=completed&per_page=30" \
    --jq '[.workflow_runs[] | select(.event != "pull_request" and (.conclusion == "success" or .conclusion == "failure"))]
          | first // empty | [.id, .conclusion, .html_url] | @tsv' 2>/dev/null) || run=""
  if [ -z "$run" ]; then echo "No finished QA run on main found."; return 0; fi
  IFS=$'\t' read -r id MAIN_CONCLUSION MAIN_URL <<<"$run"
  if [ "$MAIN_CONCLUSION" = failure ]; then
    jid=$(gh api "repos/$REPO/actions/runs/$id/jobs" --jq '[.jobs[] | select(.name == "qa")] | first | .id // empty' 2>/dev/null || true)
    if [ -n "$jid" ]; then
      # curl, not gh api: newer gh refuses to print logs that contain colour codes. -L drops the token on the redirect.
      MAIN_FAILED=$(curl -sfL -H "Authorization: Bearer $GH_TOKEN" "${GITHUB_API_URL:-https://api.github.com}/repos/$REPO/actions/jobs/$jid/logs" 2>/dev/null \
        | grep -oE 'QA_STATUS [A-Z0-9_]+=failure' | sed 's/^QA_STATUS //; s/=failure$//' | paste -sd, -)
      MAIN_FAILED=$(norm "$MAIN_FAILED")
    fi
  fi
  echo "QA on main: $MAIN_CONCLUSION${MAIN_FAILED:+ (failed: $MAIN_FAILED)} $MAIN_URL"
}

gate() {
  main_qa
  [ "$MAIN_CONCLUSION" = failure ] || return 0
  if [ "${GATE:-on}" = off ]; then
    echo "::warning::QA on main is not green, but CLAUDE_MAIN_QA_GATE=off, so the run goes ahead."; return 0
  fi
  local msg
  # shellcheck disable=SC2016  # the backticks are Markdown, not a command
  msg=$(printf '@%s ⚠️ Not starting Claude on #%s: QA on main is not green after a QA settings change; fix main first.\n\nLatest finished QA run on main failed%s: %s\nWhen QA on main passes again, comment `/claude build` on the issue (or `/claude fix` on the PR) to retry.' \
    "${NOTIFY:-jeffreyjoju}" "$NUM" "${MAIN_FAILED:+ ($MAIN_FAILED)}" "$MAIN_URL")
  gh issue comment "$NUM" --repo "$REPO" --body "$msg" >/dev/null || true
  echo "::error::QA on main is not green ($MAIN_URL); fix main first."
  exit 1
}

# True when every key in $1 is also in $2 (comma lists).
subset() { local k; for k in ${1//,/ }; do [[ ",$2," == *",$k,"* ]] || return 1; done; }

round() {
  local cur prev stop=false kind="" detail=""
  cur=$(norm "${CUR_FAILED:-}"); prev=$(norm "${PREV_FAILED:-}")
  echo "Failing now: ${cur:-none}; before the last fix round: ${prev:-n/a}"
  if [ -n "$cur" ]; then
    main_qa
    if [ "$MAIN_CONCLUSION" = failure ] && [ -n "$MAIN_FAILED" ] && subset "$cur" "$MAIN_FAILED"; then
      stop=true; kind=main
      detail="Failing here and on main: $cur. Latest QA run on main: $MAIN_URL"
    elif [ -n "$prev" ] && [ "$cur" = "$prev" ] && [ "$(fp "${CUR_SUMMARY:-}")" = "$(fp "${PREV_SUMMARY:-}")" ]; then
      stop=true; kind=repeat
      detail="Same failing checks ($cur) with the same output before and after the fix round, so the remaining round was not used. Check whether a QA check or qa.config.json conflicts with the issue."
    fi
  fi
  echo "stop=$stop kind=${kind:-none}"
  { echo "stop=$stop"; echo "kind=$kind"; echo "detail=$detail"; } >> "${GITHUB_OUTPUT:-/dev/null}"
}

case "${1:-}" in
  gate) gate ;;
  round) round ;;
  *) echo "usage: qa-guard.sh gate|round" >&2; exit 2 ;;
esac
