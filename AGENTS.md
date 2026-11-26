# AGENTS.md

Instructions for LLM coding agents (Claude Code, Codex, Cursor, and others) working in this repository.
Claude Code reads this file through `CLAUDE.md`.

This library is maintained by people who direct the work through an agent and may not know its history.
Everything the project has learned is in this file, [CONTRIBUTING.md](./CONTRIBUTING.md) and
[MAINTAINING.md](./MAINTAINING.md). Nothing lives in anyone's head or in a tool's private memory, so:

- Read CONTRIBUTING.md and MAINTAINING.md before your first change in a session. They are the long form of
  the rules below.
- When you learn something non-obvious (a trap, a held dependency, a decision), write it down in the same
  pull request: a code rule here, a process or tooling trap in MAINTAINING.md. Remove what turns out to be
  wrong.
- Never claim a change works without running the checks for it (see "Verify before you finish").

## Project

`@rotki/ui-library` is a Vue 3 component library and design system for rotki: components, composables,
icons and a Tailwind CSS 4 theme, built with Vite and TypeScript. It is a library, not an app: components
must work in any Vue 3.5+ project, and anything exported is public API that rotki, the premium components
and rotki.com depend on.

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
pnpm install --frozen-lockfile    # install; also generates the icons
pnpm run lint                     # ESLint on everything
pnpm run lint:fix                 # autofix; read the diff afterwards
pnpm run typecheck                # library, specs, type tests (strictTemplates), example app
pnpm run test:run                 # unit tests; --testNamePattern="..." or a file path to filter
pnpm run test:storybook           # stories in Chromium: render, play functions, axe
pnpm run build:prod               # build the package and verify dist, tree-shaking, CSS size
pnpm run test:e2e                 # build the example app, run Playwright against it
pnpm run test:e2e:dev             # e2e against the dev server while iterating
pnpm run test:visual              # screenshot suite in Docker
pnpm run storybook                # Storybook dev server on :6006
pnpm --filter example dev         # example app dev server
pnpm --filter @rotki/ui-library generate-theme   # rewrite src/theme/theme.css from theme-css.ts
pnpm --filter @rotki/ui-library generate-icons   # rewrite src/icons/
pnpm run new <directory> <ComponentName>         # scaffold a component, spec and story
```

Browser tests need Chromium: `PLAYWRIGHT_CHROMIUM_PATH=/usr/bin/chromium` for a system install, or
`pnpm exec playwright install chromium`.

## Agent skills

These skills give an agent current reference material for the stack here. They are not committed to the
repository; install them once per machine with the [skills CLI](https://github.com/vercel-labs/skills).
Replace `claude-code` with `codex`, `cursor` or another agent, or repeat `-a` for several:

```bash
pnpm dlx skills add antfu/skills --skill vue --skill vite --skill vitest --skill pnpm -g -a claude-code -y
pnpm dlx skills add vuejs-ai/skills --skill vue-best-practices --skill vue-testing-best-practices -g -a claude-code -y
pnpm dlx skills add vueuse/skills --skill vueuse-functions -g -a claude-code -y
pnpm dlx skills add wshobson/agents --skill e2e-testing-patterns --skill typescript-advanced-types -g -a claude-code -y
pnpm dlx skills add vercel-labs/agent-skills --skill web-design-guidelines -g -a claude-code -y
```

Update them with `pnpm dlx skills update -g`; `pnpm dlx skills check` lists what is out of date.

| Skill                        | Use it for                                                                |
| ---------------------------- | ------------------------------------------------------------------------- |
| `vue`, `vue-best-practices`  | SFCs, script setup macros, reactivity, component boundaries               |
| `vue-testing-best-practices` | Unit specs with Vue Test Utils, what to test in Vitest versus the browser |
| `vitest`                     | Vitest 5 APIs, projects, mocking, fake timers, coverage                   |
| `vite`                       | Vite 8 config, the library build, Rolldown options, plugin API            |
| `pnpm`                       | Workspaces, catalogs, overrides, release-age policy                       |
| `vueuse-functions`           | Picking the VueUse function for a job instead of writing it               |
| `e2e-testing-patterns`       | Playwright specs that do not flake                                        |
| `typescript-advanced-types`  | Generic component props, conditional and mapped types in the type tests   |
| `web-design-guidelines`      | Reviewing a component for accessibility and interaction guidelines        |

The skills are written for Vue projects in general. Where they disagree with this file, this file wins.
The disagreements seen so far:

- Their examples read and write `.value`; here refs go through `get()`/`set()`.
- `vue-testing-best-practices` shows `@testing-library/vue`; this repository uses `@vue/test-utils`. Do not
  add a second testing library.
- They show an optional `defineModel<T>()`; here an optional model whose update is never `undefined` uses
  `usePropModel`.
- They run `npx`; here it is `pnpm dlx` or `pnpm exec`.
- Nuxt-oriented advice (auto-imports, global components) does not apply: every import is explicit.
- A VueUse function is fine inside a component, but a public type must not name a VueUse type.

## Hard rules

These are not style preferences. Each has broken something before.

- **No auto-imports.** Every import is explicit: Vue APIs from `vue`, `get`/`set` from `@vueuse/shared`,
  other VueUse functions from `@vueuse/core`, types with `import type` (or inline `type`), components from
  their `.vue` files. Do not add `unplugin-auto-import`, `unplugin-vue-components`, global component
  registration or global type declarations to stand in for imports.
- **Never import a name that is also a prop of the component.** In the template the import wins over the
  prop: importing `readonly` from `vue` in a component with a `readonly` prop makes `:readonly="readonly"`
  the function, which is truthy. The typecheck does not reliably catch it.
- **No `as` type assertions.** Use type guards, generics or a restructure. A cast that truly cannot be
  avoided needs a comment saying why.
- **No HTML comments in `<template>`.** A comment beside the root makes the component a fragment in dev
  builds, which breaks transitions and attribute fallthrough.
- **No side-effect modules.** The package declares `"sideEffects": ["**/*.css"]`. No bare `import './x'`, no
  top-level setup calls: put setup in the initializer of an export the dependent code imports (see
  `src/components/date-time-picker/dayjs-setup.ts`). Library code imports dayjs from that module, never from
  `dayjs`. ESLint and `verify:tree-shaking` enforce this.
- **No `tv()` in a `.vue` file.** Style factories live in a sibling `*-styles.ts`, which runs once.
- **Theme tokens only.** No hex colors, arbitrary radii or shadows, or Tailwind palette colors in
  components. Change tokens in `src/theme/theme-css.ts`, then `generate-theme`. ESLint enforces this, and
  rejects classes Tailwind does not generate.
- **`between:` for dividers and gaps between children**, not `divide-*` or `space-*`.
- **Boolean props default to `false`.** Opt-outs are named `disable-*`; `hide-*` hides a visible part.
- **Do not break public API silently.** Removing or renaming an export, prop, slot, event or CSS token is a
  breaking change; keep the old one deprecated until the next major and note it for UPGRADING.md.
- **Do not lower a check to make it pass.** No raising lint limits, coverage thresholds or the CSS budget,
  no `eslint-disable`, `@ts-expect-error` or skipped tests, unless the commit explains why the check is
  wrong for this case.

## Code conventions

Full list in CONTRIBUTING.md. In short:

- `<script setup lang="ts">` ordered: imports, macros (`defineProps`, `defineEmits`, `defineModel`), i18n
  and router, reactive state, stores, composables, computed, methods, watchers, lifecycle hooks,
  `defineExpose`.
- Type-based `defineProps<{ ... }>()`; short-form emits: `defineEmits<{ 'update:msg': [msg: string] }>()`.
- Explicit types on every ref, computed and function return: `ref<boolean>(false)`,
  `computed<string>(() => ...)`, `function getName(): string`.
- Read and write refs through `get()`/`set()` from `@vueuse/shared`, not `.value`.
- Prefer `$attrs`/`$style` in templates over `useAttrs()`/`useCssModule()`.
- A component that forwards `$attrs` types its props as
  `Props & /* @vue-ignore */ Omit<XHTMLAttributes, keyof Props>`. `@vue-ignore` works only on a whole-type
  `extends`/intersection, never on one prop.
- An optional model whose update is never `undefined` is a prop plus an event wired with `usePropModel`
  (`src/composables/prop-model.ts`); an optional `defineModel` types its update as `T | undefined`.
- Dev-only code checks `process.env.NODE_ENV`, not `import.meta.env.DEV`.
- Split large components into composables and sub-components, one responsibility each. ESLint caps
  dependencies per file (`@rotki/max-dependencies`) and file length; prefer splitting to raising a cap.
- ESLint orders imports: `@/components/` imports alphabetically, `@/utils/` after them.
- Tests select by `data-id` (`getByTestId` in Playwright). Overlays teleport to `document.body`; unit specs
  clean up with `cleanupElements('*', document.body)`. happy-dom has no layout: test sizes, scrolling and
  the cascade in e2e. Virtual lists render a subset; never assert totals. The example app's `SelectOption` is
  `{ id: number, label }` (`@/data/options`); unit tests use `{ id: string, label }`
  (`@/__test__/options`).
- Unit tests that pin the clock use fake timers with `advanceTimersToNextTimerAsync`; the suite runs with
  `TZ=UTC`.

## Verify before you finish

A change is done when the checks for it pass locally and you have looked at it running. Report which
commands you ran and their result; if you skipped one, say so and why.

1. Always: `pnpm run lint` and `pnpm run typecheck`. If `typecheck` reports errors in `apps/example`, run
   `pnpm run build:prod` first: the example reads the library's types from `dist/`.
2. Logic in a component or composable: `pnpm run test:run` and `pnpm run test:storybook`. Add or update a
   spec that fails without your change.
3. Anything a consumer sees: `pnpm run build:prod`, then `pnpm run test:e2e`. Add an e2e spec for new
   behaviour in `apps/example/e2e/`, with a page or section in the example app to drive it.
4. Styles that move pixels: `pnpm run test:visual`. Update baselines only on purpose, in their own commit,
   and say in the message what changed and why.
5. Exports, entry points, dependencies or build config: `pnpm run build:prod` must pass all its verify
   steps. A dependency pass follows the flow in MAINTAINING.md, "Dependency updates".
6. Anything under `.github/workflows/`: actionlint and zizmor, with the commands in MAINTAINING.md,
   "Workflow checks". Pin every action to a commit SHA.
7. Look at it: Storybook or the example app in a browser, light and dark theme. Tests do not catch a color
   that disappeared or a class that stopped applying.

When a check fails, find the cause. Do not retry until it passes, and do not edit the test to match broken
behaviour. A failure you believe is a flake needs evidence (the failing assertion from the log, a passing
re-run) and goes in your report.

After `pnpm run lint:fix` or any mass edit, read the diff: autofix can turn an import type-only, rewrite
`/* @vue-ignore */` into a JSDoc block, or drop a comment after `defineProps<`.

## Git and pull requests

- Branch names: `type/short-description` (`fix/menu-focus`). Never an agent-tool prefix such as `claude/`.
- Conventional commits: `type(scope): subject`, imperative, lower case, no trailing period. `!` and a
  `BREAKING CHANGE:` footer for breaking changes. The release notes are built from commit subjects, so each
  subject is one changelog line written for consumers.
- Each commit builds, lints and passes tests on its own. When a dependency bump needs fixes, commit the
  fixes first, then the bump.
- When you create or amend a commit, end it with exactly one of each trailer, separated from the body by a
  blank line. Use the model selected in the current session and the actual harness name and version from
  runtime metadata. If you cannot verify either, ask before committing; do not infer it from a configured
  default. A `Fix #<issue>` line stays above the trailers.

  ```text
  LLM-Model: <provider>/<model-id>
  Harness: <harness-name> <version>
  ```

  Take the harness version from the process that runs you, not from a CLI on `PATH`: a desktop app ships
  its own copy. On 2026-11-26 the Claude desktop app ran Claude Code 2.1.330 while `claude --version` on
  `PATH` said 2.1.318. Walk up the parent processes (`ps -o pid=,args= -p <ppid>`) to the binary and ask
  it for `--version`.

- No AI `Co-Authored-By` trailers in commits or PRs, and no "generated with" lines in commits, PRs or code.
- Do not push to `main`, merge pull requests, create tags or run `pnpm run release` unless the maintainer
  asks for that specific step. Landing and releasing are described in MAINTAINING.md.
- In the PR description, list what you verified and how.

## Recording what you learn

Before you finish a task, ask whether you hit anything the next person would trip over: a misleading error,
a tool that behaves unexpectedly, a dependency that cannot be bumped, a design decision the maintainer made.
If so, add it, short and concrete, with the fix or the reason:

- A rule about code: the "Hard rules" or "Code conventions" section of this file.
- A tooling, CI, dependency or release trap: "Known traps" or "Versions held on purpose" in MAINTAINING.md.
- Unfinished work you discovered: a GitHub issue, never these files. They describe how the library works
  and how to work on it; a to-do list in them goes stale. Propose the issue to the maintainer before
  filing it.

Date entries that describe a state that can change ("held at 3.3.11 as of 2026-11"), so the next reader
knows to re-check them.
