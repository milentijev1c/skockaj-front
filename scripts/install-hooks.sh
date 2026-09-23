#!/usr/bin/env bash
# Install git hooks for skockaj-front (idempotent).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "install-hooks: not a git repo — skip"
  exit 0
fi

if [[ ! -d "$ROOT/scripts/githooks" ]]; then
  echo "install-hooks: no scripts/githooks — skip"
  exit 0
fi

# Prefer sibling backend installer when present (shared style), else local
if [[ -x "$ROOT/../skockaj/scripts/install-hooks.sh" ]]; then
  # still install THIS repo's hooks
  :
fi

git config core.hooksPath scripts/githooks

GIT_DIR="$(git rev-parse --git-dir)"
HOOKS_DIR="$GIT_DIR/hooks"
mkdir -p "$HOOKS_DIR"
for f in "$ROOT"/scripts/githooks/*; do
  name="$(basename "$f")"
  target="$HOOKS_DIR/$name"
  chmod +x "$f"
  if [[ "$(readlink -f "$f")" != "$(readlink -f "$target" 2>/dev/null || echo "$target")" ]]; then
    cp "$f" "$target"
    chmod +x "$target"
  fi
done

echo "install-hooks: core.hooksPath=scripts/githooks (also copied into $HOOKS_DIR)"
