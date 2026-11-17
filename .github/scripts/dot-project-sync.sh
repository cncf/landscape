#!/usr/bin/env bash
# Syncs landscape.yml (and hosted_logos/) with the metadata every CNCF project
# publishes in its <org>/.project repository, opening one pull request per
# project.
#
# Must run from the root of a disposable landscape checkout: the working tree
# is force-reset to the starting commit between projects.
#
# Environment:
#   UPDATER          path to the landscape-updater binary (cncf/automation)
#   LANDSCAPE_REPO   owner/name the pull requests are opened against
#   GH_TOKEN         token for gh; also needs push access unless DRY_RUN=true
#   DRY_RUN          "true" prints each project's diff instead of pushing
#   SYNC_LOGOS       "false" leaves hosted_logos/ alone (default: true)
#   ONLY_ORG         limit the run to one GitHub organization
#   MAX_NEW_PRS      cap on pull requests opened per run (default: 25)
#   BASE_BRANCH      branch the pull requests target (default: current branch)
#
# A project whose metadata cannot be synced is reported as a warning and does
# not fail the run: one broken .project repository must not turn every nightly
# run red. Failures to push or to talk to GitHub abort the run.
set -euo pipefail

: "${UPDATER:?UPDATER must point at the landscape-updater binary}"
: "${LANDSCAPE_REPO:?LANDSCAPE_REPO must be set (owner/name)}"
DRY_RUN="${DRY_RUN:-false}"
SYNC_LOGOS="${SYNC_LOGOS:-true}"
ONLY_ORG="${ONLY_ORG:-}"
MAX_NEW_PRS="${MAX_NEW_PRS:-25}"

LANDSCAPE_FILE="landscape.yml"
LOGOS_DIR="hosted_logos"
BRANCH_PREFIX="dot-project-sync"

BASE_SHA="$(git rev-parse HEAD)"
BASE_BRANCH="${BASE_BRANCH:-$(git rev-parse --abbrev-ref HEAD)}"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

updated=0 created=0 unchanged=0 duplicate=0 closed=0 deferred=0 failed=0
summary_rows=()

record() { # record <project> <result>
  summary_rows+=("| $1 | $2 |")
  echo "$1: $2"
}

# One line per open same-repository pull request: "<number>\t<head branch>".
open_prs="$WORK/open-prs.tsv"
gh pr list --repo "$LANDSCAPE_REPO" --state open --limit 1000 \
  --json number,headRefName,isCrossRepository \
  --jq '.[] | select(.isCrossRepository | not) | [.number, .headRefName] | @tsv' >"$open_prs"

reset_tree() {
  git checkout --quiet --force --detach "$BASE_SHA"
  git clean --quiet -fd -- "$LOGOS_DIR"
}

# Organizations of every non-archived CNCF project in the landscape.
project_orgs() {
  yq -r '.landscape[].subcategories[].items[]
         | select(.project != null and .project != "archived")
         | .repo_url // ""' "$LANDSCAPE_FILE" |
    sed -nE 's#^https://github\.com/([A-Za-z0-9][A-Za-z0-9-]*)/.*#\1#p' |
    tr '[:upper:]' '[:lower:]' | sort -u
}

patch_id() { git patch-id --stable | cut -d' ' -f1; }

sync_project() { # sync_project <org> <project.yaml> <.project commit>
  local org="$1" project_file="$2" source_sha="$3"
  local slug name label branch pr

  slug="$(yq -r '.slug // ""' "$project_file")"
  name="$(yq -r '.name // ""' "$project_file" | tr -d '[:cntrl:]' | cut -c1-80)"
  # The slug becomes part of a branch name, so accept only the documented form.
  if [[ ! "$slug" =~ ^[a-z0-9][a-z0-9-]{0,62}$ ]] || [[ -z "$name" ]]; then
    echo "::warning::$org/.project: ${project_file##*/.project/} has no usable slug or name; skipped"
    failed=$((failed + 1))
    return
  fi
  label="$name ($org/.project)"
  branch="$BRANCH_PREFIX/$slug"
  pr="$(awk -F'\t' -v b="$branch" '$2 == b { print $1; exit }' "$open_prs")"

  reset_tree
  local args=(--project "$project_file" --landscape "$LANDSCAPE_FILE")
  if [[ "$SYNC_LOGOS" == "true" ]]; then
    args+=(--logos-dir "$LOGOS_DIR")
  fi
  if ! "$UPDATER" "${args[@]}"; then
    echo "::warning::$label: landscape-updater failed; skipped"
    failed=$((failed + 1))
    return
  fi

  git add -- "$LANDSCAPE_FILE" "$LOGOS_DIR"
  if git diff --cached --quiet; then
    unchanged=$((unchanged + 1))
    if [[ -n "$pr" ]]; then
      # Our pull request is still open but the landscape no longer differs
      # from the project's metadata: the change landed another way or was
      # reverted upstream.
      if [[ "$DRY_RUN" != "true" ]]; then
        gh pr close "$pr" --repo "$LANDSCAPE_REPO" --delete-branch \
          --comment "The landscape already matches \`$org/.project\`, so this sync is no longer needed."
      fi
      closed=$((closed + 1))
      record "$label" "closed stale #$pr"
    fi
    return
  fi

  if [[ "$DRY_RUN" == "true" ]]; then
    git --no-pager diff --cached --stat
    git --no-pager diff --cached -- "$LANDSCAPE_FILE"
  fi

  git commit --quiet --signoff -m "Sync $name metadata from $org/.project" \
    -m "Source: https://github.com/$org/.project/commit/$source_sha"
  local wanted candidate legacy_prefix
  wanted="$(git diff "$BASE_SHA" HEAD | patch_id)"

  # Skip when an open pull request already proposes exactly this change:
  # either ours from an earlier night, or one pushed by the project's own
  # update-landscape workflow (branch "update-<name>-<timestamp>").
  legacy_prefix="update-$(tr '[:upper:] ' '[:lower:]-' <<<"$name")-"
  while IFS=$'\t' read -r candidate head; do
    if [[ "$head" != "$branch" && "$head" != "$legacy_prefix"* ]]; then
      continue
    fi
    if [[ "$(gh pr diff "$candidate" --repo "$LANDSCAPE_REPO" | patch_id)" == "$wanted" ]]; then
      duplicate=$((duplicate + 1))
      record "$label" "already proposed in #$candidate"
      return
    fi
  done <"$open_prs"

  if [[ -z "$pr" ]] && ((created >= MAX_NEW_PRS)); then
    deferred=$((deferred + 1))
    record "$label" "deferred (limit of $MAX_NEW_PRS new pull requests per run)"
    return
  fi

  if [[ "$DRY_RUN" == "true" ]]; then
    if [[ -n "$pr" ]]; then
      updated=$((updated + 1))
      record "$label" "would update #$pr (dry run)"
    else
      created=$((created + 1))
      record "$label" "would open a pull request (dry run)"
    fi
    return
  fi

  git push --quiet --force origin "HEAD:refs/heads/$branch"
  if [[ -n "$pr" ]]; then
    updated=$((updated + 1))
    record "$label" "updated #$pr"
    return
  fi

  local body url changed_files
  # shellcheck disable=SC2016 # the backticks are literal Markdown
  changed_files="$(git diff --name-only "$BASE_SHA" HEAD | sed 's/^/- `/; s/$/`/')"
  body="$(
    cat <<BODY
Automated nightly sync of **$name** with the metadata its maintainers publish in [\`$org/.project\`](https://github.com/$org/.project/tree/$source_sha).

Changed files:
$changed_files

To change these values, update \`$org/.project\` rather than editing this pull request: the next run overwrites this branch. Closing the pull request without merging does not stop it from being reopened while the landscape and \`.project\` disagree.
BODY
  )"
  url="$(gh pr create --repo "$LANDSCAPE_REPO" --base "$BASE_BRANCH" --head "$branch" \
    --title "Sync $name metadata from $org/.project" --body "$body")"
  created=$((created + 1))
  record "$label" "opened $url"
}

if [[ -n "$ONLY_ORG" ]]; then
  orgs="$(tr '[:upper:]' '[:lower:]' <<<"$ONLY_ORG")"
else
  orgs="$(project_orgs)"
fi

adopters=0
for org in $orgs; do
  # A 404 means the organization has not adopted .project; anything else is
  # worth surfacing rather than treating as "not adopted".
  if ! status="$(gh api "repos/$org/.project" --jq '.private' 2>&1)"; then
    if [[ "$status" != *"HTTP 404"* ]]; then
      echo "::warning::$org/.project: lookup failed: $status"
      failed=$((failed + 1))
    fi
    continue
  fi
  if [[ "$status" != "false" ]]; then
    echo "::warning::$org/.project is private; skipped"
    continue
  fi

  clone="$WORK/$org/.project"
  # Anonymous clone: the repository content is untrusted data and must never
  # see the token.
  if ! git -c credential.helper= clone --quiet --depth 1 "https://github.com/$org/.project.git" "$clone"; then
    echo "::warning::$org/.project: clone failed; skipped"
    failed=$((failed + 1))
    continue
  fi
  adopters=$((adopters + 1))
  source_sha="$(git -C "$clone" rev-parse HEAD)"

  if ! project_files="$("$UPDATER" --list-projects --repo-root "$clone")"; then
    echo "::warning::$org/.project: no project.yaml could be discovered; skipped"
    failed=$((failed + 1))
    continue
  fi
  while IFS= read -r project_file; do
    [[ -n "$project_file" ]] || continue
    sync_project "$org" "$project_file" "$source_sha"
  done <<<"$project_files"
done

reset_tree
git checkout --quiet "$BASE_BRANCH" 2>/dev/null || true

{
  echo "## .project sync"
  echo
  echo "$adopters organization(s) with a \`.project\` repository: $created opened, $updated updated, $duplicate already proposed, $closed closed, $deferred deferred, $unchanged in sync, $failed skipped with a warning."
  if ((${#summary_rows[@]} > 0)); then
    echo
    echo "| Project | Result |"
    echo "|---|---|"
    printf '%s\n' "${summary_rows[@]}"
  fi
} >>"${GITHUB_STEP_SUMMARY:-/dev/stdout}"
