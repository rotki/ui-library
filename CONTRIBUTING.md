# Contributing to @rotki/ui-library

This guide covers setting up the repository, the conventions the code follows, and how to prove a change
works before it is merged. Releases, dependency updates and CI internals are in
[MAINTAINING.md](./MAINTAINING.md). LLM coding agents follow [AGENTS.md](./AGENTS.md), which condenses
both documents.

## Setup

Requirements:

- Node 24 (`.nvmrc`). The `engines` field rejects other majors.
- pnpm 12, the version pinned in `packageManager` (`corepack enable` picks it up).
- Chromium for the browser tests: either `pnpm exec playwright install chromium`, or a system Chromium
  with `export PLAYWRIGHT_CHROMIUM_PATH=/usr/bin/chromium` in your shell profile.
- Docker, only for the visual regression suite.

```bash
pnpm install --frozen-lockfile
```

The library's `prepare` script runs on install and generates the icon data (`packages/ui-library/src/icons/`,
gitignored). Then build the library once, because the example app, its typecheck and the e2e tests read the
built `dist/`:

```bash
pnpm run build:prod
```

Use pnpm for everything: `pnpm dlx` instead of `npx`, `pnpm view` instead of `npm view`. pnpm 9 and later
pass arguments straight through, so write `pnpm run test:run --testNamePattern=foo`, without `--`.

pnpm refuses packages published less than 7 days ago (`minimumReleaseAge` in `pnpm-workspace.yaml`). If an
install fails on a fresh release, wait or pick an older version; see MAINTAINING.md before overriding it.

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

A component folder usually holds:

- `RuiThing.vue`: the component.
- `thing-styles.ts`: its `tv()` style factory. Never call `tv()` inside a `.vue` file: a `<script setup>`
  runs per instance, a module runs once. ESLint enforces this.
- `RuiThing.spec.ts`: unit tests (Vitest, happy-dom).
- `RuiThing.stories.ts`: Storybook stories. Stories with a `play` function run as browser tests.
- Composables split out of the component (`use-thing-*.ts`) with their own specs.

A new public component is exported from `packages/ui-library/src/components/index.ts` (with its props
type), gets a page in the example app and an e2e spec. `pnpm run new <directory> <ComponentName>` scaffolds
the `.vue`, spec and story files in `src/components/<directory>/`.

## Code conventions

ESLint (`@rotki/eslint-config` plus the repo rules in `eslint.config.js`) enforces most of these. The rest
are review rules.

### Imports

- **Every import is explicit.** There are no auto-imports of any kind: `ref`, `computed`, `watch` come
  from `vue`, `get`/`set` from `@vueuse/shared`, VueUse functions from `@vueuse/core`, components from
  their `.vue` file. Do not add `unplugin-auto-import`, `unplugin-vue-components` or global component
  registration. A missing import fails `pnpm run typecheck`.
- Import from `@/...` (the `src/` alias), not relative paths across folders.
- Library code takes dayjs from `@/components/date-time-picker/dayjs-setup`, never from `dayjs`.
- Never write a bare `import './setup'`, and no top-level setup calls. The package declares
  `"sideEffects": ["**/*.css"]`, so a consumer's bundler drops them. Put setup in the initializer of an
  export that the code needing it imports (see `dayjs-setup.ts`).

### Vue and TypeScript

- `<script setup lang="ts">` in this order: imports, `defineProps`/`defineEmits`/`defineModel`, i18n and
  router, reactive state, stores, composables, computed, methods, watchers, lifecycle hooks, `defineExpose`.
- Type-based `defineProps<{ ... }>()` and short-form emits (`'update:value': [value: string]`).
- Explicit types on refs, computeds and function returns: `ref<boolean>(false)`,
  `computed<string>(() => ...)`, `function name(): string`.
- Read and write refs with `get()` and `set()` from `@vueuse/shared`, not `.value`.
- No `as` type assertions. Use type guards, generics or a restructure. If one is truly unavoidable, comment
  why.
- No HTML comments in templates. A comment beside a root element makes the component a fragment in dev
  builds, which breaks `<Transition>` and attribute fallthrough. Put the reasoning in the script.
- Use `$attrs` and `$style` in templates rather than `useAttrs()`/`useCssModule()` in script, unless the
  script needs them.
- A component that forwards `$attrs` types its props as
  `Props & /* @vue-ignore */ Omit<XHTMLAttributes, keyof Props>`. `@vue-ignore` only works on such an
  `extends`/intersection of a whole type, not on a single prop.
- An optional model whose update is never `undefined` is a prop plus an event wired with `usePropModel`
  (`src/composables/prop-model.ts`). An optional `defineModel` types its update as `T | undefined`.

### Props and API design

- Boolean props default to `false`, so a bare attribute switches something on. An opt-out is named
  `disable-*` (`disablePerPage`); `hide-*` hides a visible part; `no-*` exists only on form inputs.
- Vue turns an absent boolean prop into `false`, never `undefined`. Do not build a "not passed" state on a
  boolean prop.
- Removing or renaming a prop is a breaking change: Vue passes an unknown prop on as an attribute, so
  consumers get no error. Keep the old prop declared and deprecated until the next major.
- Keep existing sizes, spacing and defaults unless the change is about them.

### Styling

- Colors, radii and shadows come from the theme tokens (`bg-rui-surface`, `border-rui-divider`,
  `rounded-rui-control`, `shadow-rui-menu`, `text-rui-text-secondary`). ESLint rejects hex colors,
  arbitrary radii and shadows, and Tailwind's own palette. To add or change a token, edit
  `src/theme/theme-css.ts` and run `pnpm --filter @rotki/ui-library generate-theme`.
- Dividers and gaps between children use the `between:` variant (`between:border-t`, `between:ml-2`).
  Tailwind 4's `divide-*` and `space-*` select differently and break with hidden children.
- A class in a `tv()` base slot that a variant must override ends up twice in the DOM: tailwind-variants
  does not deduplicate base against variant. Put variant-specific classes only in the variants.
- Rules that style descendant cells go through `[:where(&)_td]:...` so a consumer's plain class on the cell
  still wins.
- Dev-only code checks `process.env.NODE_ENV` (see `src/utils/development.ts`), not `import.meta.env.DEV`,
  which is frozen when the library is built.

### Tests

- Every test hook is a `data-id` attribute. Playwright's `getByTestId` reads `data-id`.
- Locators in order of preference: `getByTestId`, ARIA roles, CSS module class fragments (last resort).
  No hard-coded class names, no text matching for text the user cannot see.
- Overlays teleport to `document.body`: unit specs look there and clean up with
  `cleanupElements('*', document.body)` in `afterEach`. e2e specs press Escape in `afterEach`.
- happy-dom has no layout. Anything about size, scroll, overflow or the cascade is tested in e2e.
- Virtual lists render a subset of rows: never assert totals there.

## Verifying a change

Run what matches the change, from the repository root. CI runs all of it on every pull request, but a
failing CI run is the slow way to find out.

| You changed                            | Run                                                                                  |
| -------------------------------------- | ------------------------------------------------------------------------------------ |
| Anything                               | `pnpm run lint` and `pnpm run typecheck`                                             |
| Component or composable logic          | `pnpm run test:run`, plus the component's stories: `pnpm run test:storybook`         |
| Anything a consumer sees (DOM, styles) | `pnpm run build:prod`, then `pnpm run test:e2e`                                      |
| Styles that move pixels                | `pnpm run test:visual` (Docker)                                                      |
| Exports, entry points, dependencies    | `pnpm run build:prod` (it verifies dist paths, tree-shaking and the CSS size budget) |
| Theme tokens                           | `generate-theme`, then the e2e and visual suites                                     |
| Workflows in `.github/workflows/`      | actionlint and zizmor (commands in MAINTAINING.md, "Workflow checks")                |

What each command checks:

- `pnpm run lint`: ESLint on everything, Markdown and YAML included. `pnpm run lint:fix` fixes what it can;
  read its diff, since a fix can merge an import into `import type` or rewrite a `/* @vue-ignore */`
  comment.
- `pnpm run typecheck`: the library, its specs, the type tests under `tests/types/` with
  `strictTemplates`, and the example app. The example app reads the library's types from `dist/`, so
  rebuild first, or you get errors that are not there.
- `pnpm run test:run`: unit tests. Filter with `--testNamePattern="name"` or pass a file path.
  `pnpm run test` opens the Vitest UI.
- `pnpm run test:storybook`: every story renders in Chromium, `play` functions run, and each story must
  pass axe (`a11y.test: 'error'` in `.storybook/preview.ts`; exceptions are set per story).
- `pnpm run build:prod`: builds the package and runs `verify:dist`, `verify:tree-shaking` and
  `verify:css-size`. A failure here means consumers would get a broken or bloated package.
- `pnpm run test:e2e`: builds the example app and runs Playwright against its production build. Use
  `pnpm run test:e2e:dev` against the dev server while iterating, `pnpm run test:e2e:ui` to debug, or pass a
  file (`pnpm run test:e2e forms/autocomplete.spec.ts`). `playwright test` on its own does not rebuild
  anything, so a stale `dist/` tests old code.
- `pnpm run test:visual`: the screenshot suite, inside the pinned Playwright Docker image so pixels match
  CI. To write new baselines, run `bash apps/example/scripts/visual-docker.sh --update-snapshots=missing`;
  to regenerate changed ones, `--update-snapshots`. Review every changed PNG; commit baseline changes in
  their own commit with the reason in the message.
- `pnpm run coverage`: unit and storybook coverage, merged, with the thresholds CI enforces.

Look at the change in a browser as well: `pnpm run storybook` for the component in isolation, or
`pnpm --filter example dev` for the example app. Check light and dark themes. Tests assert behaviour; they
miss a color that went missing or a class that stopped applying.

To try an unreleased build in a consumer app (rotki, rotki.com), run `pnpm --filter @rotki/ui-library pack`
after `build:prod`, give the tarball a unique name (pnpm reuses a same-named tarball), and point the
consumer at it with `pnpm.overrides` (catalogs reject `file:`).

## Icons

Icons come from [Lucide](https://lucide.dev/) plus `packages/ui-library/src/custom-icons/`. The library
ships no brand logos; apps register their own.

A custom SVG uses `viewBox="0 0 24 24"` and puts everything on its primitives (`path`, `rect`, `circle`,
...). The generator rejects a `transform`, attributes on a `<g>`, and paint on the `<svg>` other than
`fill="none"` / `stroke="currentColor"`. It drops `stroke-width`, `stroke-linecap` and `stroke-linejoin`
(set by `RuiIcon`) and turns any color into `currentColor`. Icons are outlined; give a solid shape
`fill="currentColor" stroke="none"`. The `CustomIcons` story shows each custom icon beside its Lucide
neighbour.

`pnpm --filter @rotki/ui-library generate-icons` writes `src/icons/` (gitignored). Every icon name ever
published is listed in `scripts/published-icons.json`, and the generator fails if one disappears, since
consumers may use it. After a Lucide bump adds icons, `generate-icons --update` records the new names;
commit that file with the bump.

When a Lucide bump fails with "published icon name(s) are no longer generated", Lucide has usually renamed
the icon and kept the old name as a numbered alias (`Music2` for `eighth-note`). The generator would turn
that alias into `lu-music2`, so the published `lu-music-2` disappears. Add the old name to
`LEGACY_ALIAS_NAMES` in `scripts/generate-icons.ts` with the icon it now points to; look the alias up in
`node_modules/lucide/dist/esm/lucide.mjs`. Remove a name from `published-icons.json` only in a breaking
release.

## Commits and pull requests

- Conventional commits: `type(scope): subject`, imperative, lower case, no trailing period. Types: `feat`,
  `fix`, `refactor`, `perf`, `test`, `docs`, `style`, `build`, `ci`, `chore`. A breaking change gets `!`
  (`feat(menu)!: ...`) and a `BREAKING CHANGE:` footer with the migration. commitlint checks this in CI and
  in the `commit-msg` hook.
- The GitHub release notes are generated from the commit subjects (changelogithub), so each commit is one
  changelog line: make the subject say what changed for a consumer. Bodies and `style:` commits do not
  appear in the notes.
- Each commit stands alone: it builds, lints, typechecks and passes the tests on its own. Group commits by
  topic. When a dependency bump needs code fixes, the fixes come first in their own commit, then the bump.
- A commit made by an AI agent ends with `LLM-Model:` and `Harness:` trailers and has no AI
  `Co-Authored-By`; the exact format is in AGENTS.md, and matches rotki's.
- The pre-commit hook runs ESLint on staged files (lint-staged); do not skip it.
- Open the pull request against `main`. Fill in the template and link the issue. Describe what you verified
  and how, including anything you checked by hand in the browser.
- Mention consumer impact: a changed default, a new required setup step, a visual change. Those go into the
  release notes by hand.

## Contact

Questions go to the [rotki Discord](https://discord.rotki.com) or an issue on this repository.
