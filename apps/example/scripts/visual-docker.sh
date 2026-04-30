#!/usr/bin/env bash
# Run the visual regression suite inside Playwright's pinned Docker image so
# the rendering environment (browser binary + system fonts + freetype + CPU
# arch) matches the one CI uses. This is the only way `toHaveScreenshot`
# baselines stay stable across contributor machines (Arch, macOS, etc.) and
# the Ubuntu runner.
#
# Usage:
#   bash scripts/visual-docker.sh                     # verify against committed baselines
#   bash scripts/visual-docker.sh --update-snapshots  # regenerate baselines
#
# Pass any extra Playwright CLI args after the script name; they're forwarded
# verbatim to `playwright test`.
#
# The container bind-mounts the entire monorepo so file edits are picked up
# on every run, but uses anonymous volumes to shadow each `node_modules/`
# directory — that keeps host install artefacts (potentially built for a
# different platform, e.g. macOS arm64) out of the linux x64 container, and
# lets pnpm install fresh inside.
set -euo pipefail

# Keep this in sync with `pnpm-workspace.yaml -> @playwright/test` so the
# image's bundled browser matches the test runner version.
PLAYWRIGHT_IMAGE="${PLAYWRIGHT_IMAGE:-mcr.microsoft.com/playwright:v1.59.1-noble}"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"

if ! command -v docker >/dev/null 2>&1; then
  echo "error: docker is required to run visual regression tests." >&2
  echo "       install docker or use a contributor environment that has it." >&2
  exit 1
fi

# `--ipc=host` is recommended by Playwright to avoid Chrome OOMs in CI.
# `--network=host` lets the dev/preview server bind on the same loopback
# Playwright connects to without a separate compose stack.
exec docker run --rm \
  --ipc=host \
  --network=host \
  -v "$REPO_ROOT:/work" \
  -v /work/node_modules \
  -v /work/apps/example/node_modules \
  -v /work/packages/ui-library/node_modules \
  -e PLAYWRIGHT_VISUAL=1 \
  -e CI="${CI:-}" \
  -w /work \
  "$PLAYWRIGHT_IMAGE" \
  bash -c "set -euo pipefail; corepack enable >/dev/null 2>&1; pnpm install --frozen-lockfile; pnpm --filter @rotki/ui-library build:prod >/dev/null; pnpm --filter example build:app >/dev/null; cd apps/example; pnpm exec playwright test e2e/visual $*"
