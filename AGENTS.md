# AGENTS.md

The rules for working on this repository, for LLM coding agents (Claude Code reads this file through
`CLAUDE.md`) and for people alike. [CONTRIBUTING.md](./CONTRIBUTING.md) covers setup, layout, icons and
commits; [MAINTAINING.md](./MAINTAINING.md) covers landing, releases, dependency updates, CI and known traps.
Read both before your first change in a session.

## Project

`@rotki/ui-library` is a Vue 3 component library and design system for rotki: components, composables,
icons and a Tailwind CSS 4 theme, built with Vite and TypeScript. It is a library, not an app: components
must work in any Vue 3.5+ project, and anything exported is public API that rotki, rotki.com and the
premium components depend on.

- `packages/ui-library/`: the published package. Components in `src/components/<area>/`, composables in
  `src/composables/`, theme in `src/theme/`, icons generated into `src/icons/` (gitignored), the icon Vite
  plugin in `src/vite-plugin/`, type tests in `tests/types/`, build and verify scripts in `scripts/`.
- `apps/example/`: an app built against the library's `dist/`. Routes come from `src/pages/` (thin wrappers
  over `src/views/`); index views use a `RuiCard` grid with `data-id="link-${route}"`. e2e specs live in
  `e2e/`, the screenshot suite in `e2e/visual/`.
- Entry points: `@rotki/ui-library` (everything), `/components`, `/composables`, `/vite-plugin`, plus
  `theme.css`, `tailwind.css` and `style.css`. Keep the export structure; consumers tree-shake by it.
- Vue, vue-router, dayjs, Tailwind and everything in `dependencies` stay external. VueUse is a
  devDependency on purpose: it is bundled and tree-shaken into `dist/vendor/`, so consumers can use any
  VueUse version. Public types must not name VueUse types (use `src/types/dom.ts` and friends).

## Commands

Run from the repository root. Use pnpm only (never npm or npx; `pnpm dlx` for one-off tools) and pass
arguments without `--`.

```bash
pnpm install --frozen-lockfile
pnpm run lint                     # lint:fix to autofix; read the diff afterwards
pnpm run typecheck
pnpm run test:run                 # --testNamePattern="..." or a file path to filter
pnpm run test:storybook
pnpm run build:prod
pnpm run test:e2e                 # test:e2e:dev against the dev server while iterating
pnpm run test:visual              # Docker
pnpm run lint:workflows           # Docker and uv; set GH_TOKEN for zizmor's online audits
pnpm run storybook
pnpm --filter example dev
pnpm --filter @rotki/ui-library generate-theme
pnpm --filter @rotki/ui-library generate-icons
pnpm run new <directory> <ComponentName>
```

Browser tests need Chromium: `PLAYWRIGHT_CHROMIUM_PATH=/usr/bin/chromium` for a system install, or
`pnpm exec playwright install chromium`.

## Agent skills

These skills give an agent current reference material for the stack here. Install them once per machine
with the [skills CLI](https://github.com/vercel-labs/skills); replace `claude-code` with `codex`, `cursor` or
another agent, or repeat `-a` for several:

```bash
pnpm dlx skills add antfu/skills --skill vue --skill vite --skill vitest --skill pnpm -g -a claude-code -y
pnpm dlx skills add vuejs-ai/skills --skill vue-best-practices --skill vue-testing-best-practices -g -a claude-code -y
pnpm dlx skills add vueuse/skills --skill vueuse-functions -g -a claude-code -y
pnpm dlx skills add wshobson/agents --skill e2e-testing-patterns --skill typescript-advanced-types -g -a claude-code -y
pnpm dlx skills add vercel-labs/agent-skills --skill web-design-guidelines -g -a claude-code -y
```

Update them with `pnpm dlx skills update -g`. They are written for Vue projects in general; where they
disagree with this file, this file wins. In particular, `vue-testing-best-practices` shows
`@testing-library/vue`, while this repository uses `@vue/test-utils`: do not add a second testing library.

## Hard rules

Each of these has broken something before.

- **No auto-imports.** Every import is explicit: Vue APIs from `vue`, `get`/`set` from `@vueuse/shared`,
  other VueUse functions from `@vueuse/core`, types with `import type` (or inline `type`), components from
  their `.vue` files. Do not add `unplugin-auto-import`, `unplugin-vue-components`, global component
  registration or global type declarations. A missing import fails the typecheck.
- **Never import a name that is also a prop of the component.** In the template the import wins over the
  prop: `readonly` imported from `vue` made every field with a `readonly` prop read-only.
  `vue/no-dupe-keys` catches it, except for props declared through `Omit<...>` or an intersection.
- **No `as` type assertions.** Use type guards, generics or a restructure. A cast that truly cannot be
  avoided needs a comment saying why.
- **No HTML comments in `<template>`.** A comment beside the root makes the component a fragment in dev
  builds, which breaks transitions and attribute fallthrough.
- **No side-effect modules.** The package declares `"sideEffects": ["**/*.css"]`, so a consumer's bundler
  drops a bare `import './x'` and top-level setup calls. Put setup in the initializer of an export the
  dependent code imports (`src/components/date-time-picker/dayjs-setup.ts`); library code imports dayjs
  from that module, never from `dayjs`.
- **No `tv()` in a `.vue` file.** Style factories live in a sibling `*-styles.ts`, which runs once, not per
  instance.
- **Theme tokens only.** No hex colors, arbitrary radii or shadows, or Tailwind palette colors in
  components. Change tokens in `src/theme/theme-css.ts`, then `generate-theme`.
- **`between:` for dividers and gaps between children** (`between:border-t`), not `divide-*` or
  `space-*`, which select differently and break with hidden children.
- **Boolean props default to `false`.** Opt-outs are named `disable-*`; `hide-*` hides a visible part;
  `no-*` exists only on form inputs. An absent boolean prop is `false`, never `undefined`, so do not build
  a "not passed" state on one.
- **Do not break public API silently.** Removing or renaming an export, prop, slot, event or CSS token is a
  breaking change, and a removed prop does not even fail a consumer's typecheck (Vue passes it on as an
  attribute). Keep the old one deprecated until the next major and note it for `UPGRADING.md`.
- **Do not lower a check to make it pass.** No raising lint limits, coverage thresholds or the CSS budget,
  no `eslint-disable`, `@ts-expect-error` or skipped tests, unless the commit explains why the check is
  wrong for this case.

ESLint (`eslint.config.js` on top of `@rotki/eslint-config`) enforces the side-effect, `tv()`, token and
prop-name rules.

## Code conventions

- `<script setup lang="ts">` ordered: imports, macros (`defineProps`, `defineEmits`, `defineModel`), i18n
  and router, reactive state, stores, composables, computed, methods, watchers, lifecycle hooks,
  `defineExpose`.
- Type-based `defineProps<{ ... }>()`; short-form emits: `defineEmits<{ 'update:msg': [msg: string] }>()`.
- Explicit types on every ref, computed and function return: `ref<boolean>(false)`,
  `computed<string>(() => ...)`, `function getName(): string`.
- Read and write refs through `get()`/`set()`, not `.value`.
- Prefer `$attrs`/`$style` in templates over `useAttrs()`/`useCssModule()`.
- A component that forwards `$attrs` types its props as
  `Props & /* @vue-ignore */ Omit<XHTMLAttributes, keyof Props>`. `@vue-ignore` works only on a whole-type
  `extends`/intersection, never on one prop.
- An optional model whose update is never `undefined` is a prop plus an event wired with `usePropModel`
  (`src/composables/prop-model.ts`); an optional `defineModel` types its update as `T | undefined`.
- Dev-only code checks `process.env.NODE_ENV` (`src/utils/development.ts`), not `import.meta.env.DEV`,
  which is frozen when the library is built.
- Import from `@/...` (the `src/` alias); ESLint orders imports, `@/components/` alphabetically and
  `@/utils/` after them.
- Split large components into composables and sub-components, one responsibility each; ESLint caps
  dependencies per file and file length.
- In `tv()`, a class in a base slot that a variant overrides reaches the DOM twice (base and variant are
  not deduplicated); put variant-specific classes only in the variants. Rules that style descendant cells
  go through `[:where(&)_td]:...`, so a consumer's plain class on the cell still wins.
- Keep existing sizes, spacing and defaults unless the change is about them.
- Tests: hooks are `data-id` attributes (`getByTestId` in Playwright). Locators in order of preference:
  `getByTestId`, ARIA roles, CSS module class fragments; no hard-coded class names, no matching on text
  the user cannot see. Overlays teleport to `document.body`: unit specs clean up with
  `cleanupElements('*', document.body)`, e2e specs press Escape in `afterEach`. happy-dom has no layout, so
  sizes, scrolling and the cascade are tested in e2e. Virtual lists render a subset; never assert totals.
  Clock-pinning specs use fake timers with `advanceTimersToNextTimerAsync`; the suite runs with `TZ=UTC`.
  The example app's `SelectOption` is `{ id: number, label }` (`@/data/options`); unit tests use
  `{ id: string, label }` (`@/__test__/options`).

## Verify before you finish

A change is done when the checks for it pass locally and you have looked at it running. Report which
commands you ran and their result; if you skipped one, say so and why.

| You changed                            | Run                                                                         |
| -------------------------------------- | --------------------------------------------------------------------------- |
| Anything                               | `lint`, `typecheck`                                                         |
| Library code                           | `build:prod` first: the example app reads types from `dist/`                |
| Component or composable logic          | `test:run`, `test:storybook`, and a spec that fails without your change     |
| Anything a consumer sees (DOM, styles) | `build:prod`, then `test:e2e`, and an e2e spec for new behaviour            |
| Styles that move pixels                | `test:visual`                                                               |
| Exports, entry points, dependencies    | `build:prod` (it verifies dist paths, tree-shaking and the CSS size budget) |
| Theme tokens                           | `generate-theme`, then `test:e2e` and `test:visual`                         |
| `.github/workflows/`                   | `lint:workflows`; pin every action to a commit SHA                          |

Then look at it: Storybook or the example app in a browser, light and dark theme. Tests do not catch a
color that disappeared or a class that stopped applying.

- `test:storybook` fails a story that does not pass axe; exceptions are set per story.
- `playwright test` on its own does not rebuild anything, so a stale `dist/` tests old code.
- Visual baselines change only on purpose, in their own commit that says why:
  `bash apps/example/scripts/visual-docker.sh --update-snapshots=missing` writes new ones,
  `--update-snapshots` regenerates changed ones. Review every changed PNG.
- After `lint:fix` or any mass edit, read the diff: autofix can turn an import type-only, rewrite
  `/* @vue-ignore */` into a JSDoc block, or drop a comment after `defineProps<`.

When a check fails, find the cause. Do not retry until it passes, and do not edit the test to match broken
behaviour. A failure you believe is a flake needs evidence (the failing assertion from the log, a passing
re-run) and goes in your report.

## Git and pull requests

Commit and pull request rules are in CONTRIBUTING.md. On top of them, for agents:

- Branch names: `type/short-description` (`fix/menu-focus`), never an agent-tool prefix such as `claude/`.
- End every commit you create or amend with exactly one of each trailer, after a blank line and below any
  `Fix #<issue>` line:

  ```text
  LLM-Model: <provider>/<model-id>
  Harness: <harness-name> <version>
  ```

  Use the model selected in the current session and the harness version of the process that runs you, not
  of a CLI on `PATH` (a desktop app ships its own copy): walk up the parent processes
  (`ps -o pid=,args= -p <ppid>`) to the binary and ask it for `--version`. If you cannot verify either, ask
  before committing.

- No AI `Co-Authored-By` trailers and no "generated with" lines in commits, pull requests or code.
- Do not push to `main`, merge pull requests, create tags or run `pnpm run release` unless the maintainer
  asks for that specific step.

## Recording what you learn

Before you finish, ask whether you hit something the next person would trip over. If you did, first try to
make a tool catch it: a lint rule in `eslint.config.js`, a verify script, a test or a CI check. Write it
down only when no tool can, short and with the fix or the reason, in the same pull request:

- A rule about code: "Hard rules" or "Code conventions" above.
- A tooling, CI, dependency or release trap: "Known traps" or "Versions held on purpose" in MAINTAINING.md.
- Unfinished work: propose a GitHub issue to the maintainer, never a to-do list in these files.
