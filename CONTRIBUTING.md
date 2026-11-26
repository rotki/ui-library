# Contributing to @rotki/ui-library

How to set up the repository, where things live, and how commits and pull requests look. The rules for the
code itself and the checks to run before a change is done are in [AGENTS.md](./AGENTS.md), which applies to
people as much as to agents. Releases, dependency updates and CI are in [MAINTAINING.md](./MAINTAINING.md).

## Setup

Requirements:

- The Node version in `.nvmrc`; `engines` rejects other majors.
- A recent pnpm; it switches itself to the version pinned in `packageManager` (root `package.json`) on
  first use.
- Chromium for the browser tests: `pnpm exec playwright install chromium`, or a system Chromium with
  `PLAYWRIGHT_CHROMIUM_PATH=/usr/bin/chromium` in your shell profile.
- Docker for the visual suite and `lint:workflows`, and [uv](https://docs.astral.sh/uv/) for the latter.

```bash
pnpm install --frozen-lockfile
pnpm run build:prod
```

The install generates the icon data (`packages/ui-library/src/icons/`, gitignored). The build is needed once
because the example app, its typecheck and the e2e tests read the library's `dist/`.

Use pnpm for everything (`pnpm dlx` instead of `npx`) and pass arguments without `--`:
`pnpm run test:run --testNamePattern=foo`. pnpm refuses packages published less than 7 days ago
(`minimumReleaseAge`); if an install fails on a fresh release, wait or pick an older version.

## Repository layout

| Path                                    | What it is                                                                       |
| --------------------------------------- | -------------------------------------------------------------------------------- |
| `packages/ui-library/src/components/`   | Components, one folder per component or family                                   |
| `packages/ui-library/src/composables/`  | Composables, exported from `@rotki/ui-library/composables`                       |
| `packages/ui-library/src/theme/`        | `theme-css.ts` (source of truth for tokens) and the generated `theme.css`        |
| `packages/ui-library/src/custom-icons/` | rotki icons Lucide lacks, as SVG                                                 |
| `packages/ui-library/src/vite-plugin/`  | `ruiIconsPlugin`, shipped as `@rotki/ui-library/vite-plugin`                     |
| `packages/ui-library/tests/types/`      | Type tests: files that are only typechecked, never run                           |
| `packages/ui-library/scripts/`          | Build, generation and verification scripts                                       |
| `packages/ui-library/docs/`             | Storybook MDX pages (colors, tokens, typography)                                 |
| `apps/example/src/`                     | The example app; routes come from `src/pages/`, which wrap views in `src/views/` |
| `apps/example/e2e/`                     | Playwright e2e specs; `e2e/visual/` holds the screenshot suite                   |

A component folder usually holds `RuiThing.vue`, its `tv()` style factory `thing-styles.ts`, unit tests
`RuiThing.spec.ts`, stories `RuiThing.stories.ts` (stories with a `play` function run as browser tests),
and composables split out of the component with their own specs. A new public component is exported from
`packages/ui-library/src/components/index.ts` with its props type, and gets a page in the example app and an
e2e spec. `pnpm run new <directory> <ComponentName>` scaffolds the `.vue`, spec and story files.

## Trying a build in a consumer

To test an unreleased build in rotki, rotki.com or the premium components: run `pnpm run build:prod`, then
`pnpm --filter @rotki/ui-library pack`, and give the tarball a unique name (pnpm reuses a same-named
tarball). In the consumer, point `@rotki/ui-library` at the tarball under `overrides:` in its
`pnpm-workspace.yaml` (pnpm no longer reads `pnpm.overrides` from `package.json`, and catalogs reject
`file:`).

## Icons

Icons come from [Lucide](https://lucide.dev/) plus `packages/ui-library/src/custom-icons/`. The library ships
no brand logos; apps register their own.

A custom SVG uses `viewBox="0 0 24 24"` and puts everything on its primitives (`path`, `rect`, `circle`, ...).
The generator rejects a `transform`, attributes on a `<g>`, and paint on the `<svg>` other than
`fill="none"` / `stroke="currentColor"`. It drops `stroke-width`, `stroke-linecap` and `stroke-linejoin`
(set by `RuiIcon`) and turns any color into `currentColor`. Icons are outlined; give a solid shape
`fill="currentColor" stroke="none"`. The `CustomIcons` story shows each custom icon beside its Lucide
neighbour.

`pnpm --filter @rotki/ui-library generate-icons` writes `src/icons/`. Every icon name ever published is
listed in `scripts/published-icons.json`, and the generator fails if one disappears, since consumers may use
it. After a Lucide bump adds icons, `generate-icons --update` records the new names; commit that file with
the bump.

When a Lucide bump fails with "published icon name(s) are no longer generated", Lucide has usually renamed
the icon and kept the old name as a numbered alias (`Music2` for `eighth-note`), which the generator would
turn into `lu-music2`. Add the old name to `LEGACY_ALIAS_NAMES` in `scripts/generate-icons.ts` with the icon
it now points to (look the alias up in `node_modules/lucide/dist/esm/lucide.mjs`). Remove a name from
`published-icons.json` only in a breaking release.

## Commits and pull requests

- Conventional commits, with the types `@commitlint/config-conventional` accepts: `type(scope): subject`,
  imperative, lower case, no trailing period. A breaking change gets `!` (`feat(menu)!: ...`) and a
  `BREAKING CHANGE:` footer with the migration. commitlint checks this in CI and in the `commit-msg` hook.
- The GitHub release notes are generated from the commit subjects, so make each subject say what changed
  for a consumer. Bodies and `style:` commits do not appear in the notes.
- Each commit stands alone: it builds, lints, typechecks and passes the tests. When a change needs code
  fixes first (a dependency bump, say), the fixes go in their own commit before it.
- A commit made by an AI agent ends with the `LLM-Model:` and `Harness:` trailers described in AGENTS.md.
- The pre-commit hook runs ESLint on staged files; do not skip it.
- A pull request targets `main` and is based on the latest `main`; rebase it when `main` moves, never merge
  `main` into it. Fill in the template.

## Contact

Questions go to the [rotki Discord](https://discord.rotki.com) or an issue on this repository.
