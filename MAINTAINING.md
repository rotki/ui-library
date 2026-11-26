# Maintaining @rotki/ui-library

How to land changes, release, keep dependencies current, and read CI, plus the traps that already cost
time once. [CONTRIBUTING.md](./CONTRIBUTING.md) covers conventions and verification; read it first.

**Keep this file current.** When you learn something the hard way (a tool that misleads, a bump that
breaks in a non-obvious place, a decision that should not be reopened), add it here, or to AGENTS.md if it
is a rule for code, in the same pull request. There is no other place this knowledge lives.

## Ownership

- `CODEOWNERS` assigns everything to `@rotki/maintainers`. GitHub ignores a code owner without write
  access, so the team keeps write access to the repository.
- Every publish waits for a reviewer of the `npm` environment. The upload uses npm trusted publishing
  (OIDC), so no npm token is stored.
- Consumers: rotki, rotki.com and the premium components.

Who has access changes, so look it up rather than writing it down:

```bash
gh api orgs/rotki/teams/maintainers/members --jq '.[].login'
gh api repos/rotki/ui-library/environments/npm --jq '.protection_rules[].reviewers[]?.reviewer | .login // .slug'
gh api repos/rotki/ui-library/branches/main/protection
pnpm view @rotki/ui-library maintainers
```

## Landing pull requests

A pull request can land when it is based on the latest `main` (rebase it if not, never merge `main` into
it), CI is green, `license/cla` included, and it has an approving review.

Land it with GitHub's **Rebase and merge** when every commit is a standalone conventional commit, or with
**Squash and merge** otherwise. When squashing, edit the commit message into one conventional commit
(`type(scope): subject`, plus a `BREAKING CHANGE:` footer if needed): it becomes the changelog line.

## Releasing

1. **Bump.** On a branch from the latest `main`, run `pnpm run release --no-tag` and pick the version: a
   `!` or `BREAKING CHANGE:` since the last tag means major, a `feat` minor, anything else patch. It sets
   the version in the three `package.json` files and commits `chore: release vX.Y.Z`.
2. **Land it.** Open a pull request and land it with Rebase and merge.
3. **Tag the merged commit:**

   ```bash
   git fetch upstream
   git log -1 --format=%s upstream/main   # must print chore: release vX.Y.Z
   git tag -a vX.Y.Z -m vX.Y.Z upstream/main   # -s instead of -a to sign it
   git push upstream vX.Y.Z
   ```

4. **Approve.** The tag starts `release.yml`, which creates the GitHub release from the commit subjects and
   then waits for a reviewer of the `npm` environment ("Review deployments" on the run) before publishing.

A prerelease (`v3.5.0-beta.1`) publishes under its own dist-tag (`beta`). When a release changes something
for consumers, add the migration notes above the generated list with
`gh release edit vX.Y.Z --repo rotki/ui-library --notes-file notes.md`; a major also needs its
`UPGRADING.md` section.

## Dependency updates

Versions live in the `catalog:` of `pnpm-workspace.yaml`. Renovate lists the available updates on the
[Dependency Dashboard](https://github.com/rotki/ui-library/issues/170). Apply them in a pass, on one branch
from the latest `main` and one pull request, rather than merging Renovate's pull requests one by one.

- pnpm refuses versions published less than 7 days ago (`minimumReleaseAge`), so take the newest version
  past that. The dashboard lags npm; check with `pnpm view <pkg> time --json`.
- One commit per bump, or per group that moves together (all `@storybook/*`, all `@vitest/*`). Code changes
  a bump needs go in their own commit before it.
- After each bump: `pnpm install`, lint, `build:prod`, typecheck and unit tests. At the end, the whole suite,
  e2e and visual included.
- Pin GitHub actions to a commit SHA with the tag as a comment, and run the workflow checks.
- `@playwright/test` moves together with the Playwright image in `ci.yml` and
  `apps/example/scripts/visual-docker.sh`.

### Versions held on purpose

Re-check each condition before bumping, with the repository's own checks. Last checked 2026-11-26.

| Package                         | Held at | Why                                                                             | Bump when                                      |
| ------------------------------- | ------- | ------------------------------------------------------------------------------- | ---------------------------------------------- |
| `vue-tsc`, `vue-component-meta` | 3.3.11  | From 3.3.12, `//` in a static template prop (a URL) corrupts the generated code | `pnpm run typecheck` passes on the new version |
| `typescript`                    | 6.0.x   | TypeScript 7 (the Go port) waits for 7.1 stable and for Vue tooling support     | 7.1 is `latest` on npm and vue-tsc runs on it  |

The vue-tsc canary is `apps/example/src/views/AvatarView.vue` (a URL prop inside a `v-for`): on an
affected version the typecheck reports `Cannot find name 's'`.

## CI

`.github/workflows/ci.yml` runs on pull requests and on pushes to `main`. Jobs run in parallel, each with its
own install:

| Job             | Checks                                                                             |
| --------------- | ---------------------------------------------------------------------------------- |
| `commit-lint`   | commitlint over the PR's commits                                                   |
| `workflow-lint` | actionlint and zizmor over `.github/workflows/` (see "Workflow checks")            |
| `validate`      | `pnpm run lint`, library typecheck (sources, specs, type tests), example typecheck |
| `unit`          | Vitest unit project with coverage (no browser, no build; generates icons only)     |
| `storybook`     | `build:prod`, Storybook build, story tests in Chromium with coverage               |
| `coverage`      | merges the unit and storybook coverage, enforces thresholds, uploads to Codecov    |
| `e2e`           | `build:prod`, example app build, Playwright in two shards with two workers each    |
| `visual`        | screenshot suite in the pinned Playwright image                                    |

Browser jobs run inside the Playwright container, so nothing installs Chromium or apt packages.
`deploy.yml` publishes Storybook to GitHub Pages on pushes to `main`. `codeql-analysis.yml` runs CodeQL.

Triage a failure from the log, not the summary: `gh run view --repo rotki/ui-library --job <id> --log`.

- An e2e failure at 0ms with `net::ERR_NETWORK_CHANGED` is the runner's network, not the code: re-run.
- An autocomplete spec that clicks right after `fill()` races the 50ms debounced search. Wait for the
  filtered option count before clicking.
- Each e2e shard runs two workers (`--workers=2`, set 2026-10-23 as an experiment). If retries or flakes
  rise, drop the flag.
- The coverage job rewrites the storybook blob's paths (`/__w/<repo>/<repo>/`) to the runner's workspace;
  blobs keep absolute paths and would not merge otherwise.

### Workflow checks

Every change under `.github/workflows/` goes through two tools, in CI (`workflow-lint`) and locally before
you push:

- **actionlint** checks workflow syntax, expressions, job references and, through shellcheck, the shell
  in `run:` steps.
- **zizmor** checks for security problems: actions not pinned to a commit SHA, `${{ }}` expressions that
  can inject into a shell, credentials left in the checkout, broader `permissions:` than a job needs, and
  (online) pinned commits that are not on the action's repository or have known advisories.

Run them the way CI does, so local and CI versions match:

```bash
docker run --rm -v "$PWD:/repo" -w /repo rhysd/actionlint:1.7.12@sha256:b1934ee5f1c509618f2508e6eb47ee0d3520686341fec936f3b79331f9315667 -color
GH_TOKEN=$(gh auth token) uvx --from zizmor==1.32.0 zizmor .github/workflows
```

zizmor warns that the workflows use YAML anchors (`&playwright-image`); that is expected. A finding that
is a deliberate choice gets an inline `# zizmor: ignore[<rule>] <reason>` on the line, as rotki does;
never an ignore without a reason. The versions of both tools are pinned in `ci.yml`; bump them in the
dependency pass, local commands with them.

Rules the workflows here already follow, and new jobs must too: every `uses:` pinned to a full commit SHA
with the tag as a comment; `permissions: { }` at the top and the minimum per job, each with a comment
saying what it is for; `persist-credentials: false` on every checkout; values from `${{ }}` passed to
`run:` through `env:`, never inlined; `timeout-minutes` on every job.

## Known traps

Each of these cost real time once. They are not caught by any tool unless noted.

### Build and package

- `"sideEffects": ["**/*.css"]` means a consumer's bundler keeps a module only as far as a used export
  needs it. A bare `import './setup'` is dropped, and so is `dayjs.extend(x)` at top level next to
  `export { dayjs }` (the re-export is wired straight to the dayjs package). What works is
  `export const dayjs = withPlugins()`, a new binding whose initializer runs the setup. Unit tests never see
  this; `verify:tree-shaking` (part of `build:prod`) bundles small consumer apps and does.
- VueUse is a devDependency on purpose: it is bundled into `dist/vendor/` and tree-shaken, so consumers can
  use any VueUse version. Public types must not name VueUse types (use `src/types/dom.ts` and friends).
  `verify:dist` fails if a pnpm store path leaks into `dist/`.
- `build:prod` fails if the gzipped `style.css` grows past its budget (`verify:css-size`). Raise the budget
  only for a reason you can name in the commit.
- The example app and its typecheck read the library from `dist/`. After changing library code, rebuild
  before trusting an example typecheck error or an e2e result.
- Vite's dev server can serve a stale SFC after a rebase or two quick edits. Make a real edit to the file
  or restart.
- `pnpm install` runs the library's `prepare` script, which can run a full `build:prod` when the install is
  not considered local; expect a slow first install after switching branches.

### Vue and TypeScript

- An import named like a prop shadows the prop in the template. A component with a `readonly` prop that
  also imports `readonly` from `vue` renders `:readonly="readonly"` as the function, which is truthy. The
  typecheck does not always catch this (it missed it in the generic `RuiDateTimePicker`). Never import a
  name that is also a prop of the component.
- Vue coerces an absent boolean prop to `false`, never `undefined`, even with type-only `defineProps`. A
  check like `mobile !== undefined` is always true. Debug props in the browser through
  `el.__vueParentComponent.props` and setup state through `el.__vueParentComponent.setupState`.
- `@vue-ignore` is only honoured on an `extends` clause or intersection of a whole type, not before a single
  prop.
- Generic SFCs hoist only the leading `export` block: a local type declared before `export interface Props`
  gives TS1184 / TS4025. `InstanceType<typeof GenericSfc>` does not work; specs use
  `ReturnType<typeof createWrapper>`.
- `strictTemplates` rejects `data-*` attributes unless `dataAttributes: ['data-*']` is set in the
  `vueCompilerOptions` (it is, in each tsconfig that needs it).
- ESLint autofix can turn a merged import type-only (`computed` imported as a type), rewrite
  `/* @vue-ignore */` into a JSDoc block, or delete a comment right after `defineProps<`. Read the diff after
  `lint:fix`.
- A removed prop does not fail a consumer's typecheck; Vue passes it on as an attribute. To find them in a
  consumer, run vue-tsc with `checkUnknownProps`.

### Styling

- `tv()` `extend` and base slots do not deduplicate against variants: both classes reach the DOM and
  Tailwind's CSS order picks the winner. Never put a class in a base slot that a variant overrides.
- The `tv()` merger only knows Tailwind 4 class names. A Tailwind 3 utility (`bg-opacity-40`,
  `flex-shrink-0`) is misclassified and can drop the class it conflicts with (a slider once lost its color).
  Use v4 names.
- `p-*` is emitted before `py-*`, so a component class `py-3` beats a consumer's `py-0` on the same element.
  Default paddings on table cells live in `:where()` for that reason; keep new ones there.
- Tailwind 4 `dark:` defaults to `:where()` (no specificity); the library's dark variant uses `:is()` so it
  still beats `hover:` and `disabled:`. `translate-*`/`rotate-*` set the individual `translate`/`rotate`
  properties, not `transform`: code that checks `transform` to find a containing block must check those too.
- Quoted attribute selectors in arbitrary variants compile to invalid CSS in some consumer builds
  (lightningcss drops the rule). Select on an unquoted `data-*` attribute.
- The example app scrolls inside `body`: element screenshots need
  `html, body { height: auto; overflow: visible }` and a static header. The buttons page is route `/`, not `/buttons`. Scope page selectors to
  `getByTestId('page-content')`, or they hit the header's theme toggle.

### Dependencies

- `pnpm add --config.minimumReleaseAge=0` is not a one-off: later installs reject the lockfile. For a
  version that cannot wait, add a dated `minimumReleaseAgeExclude` entry and remove it later.
- After a bump, auto-installed peers can keep the old version: `grep <old-version> pnpm-lock.yaml`, then
  `pnpm update -r --depth 99 <pkg>`.
- Reverting a bump and reinstalling leaves the new version in the lockfile. Restore it with
  `git checkout HEAD -- pnpm-lock.yaml`, then `pnpm install`.
- Run the typecheck even when the tests pass: msw 3 renamed an option and silently ignored the old name.

### Tests

- happy-dom has no layout (`scrollHeight` is 0) and does not expand the `overflow` shorthand; set
  `overflowX`/`overflowY` in specs and test layout in e2e. Storybook's `userEvent.hover` does not trigger CSS
  `:hover`.
- Measure two boxes in one `page.evaluate`: images loading elsewhere shift the layout between two separate
  `boundingBox()` calls.
- `pnpm run test:visual:update <file>` does not filter: the script passes `--update-snapshots` first, so the
  file becomes its value. Call `visual-docker.sh` directly with `--update-snapshots=missing` or the file
  last.
- A green unit run says nothing about a bundle, a consumer's CSS, or real layout. Those are covered only by
  `build:prod`, e2e and visual.

### Shell

- zsh aborts a command on an unmatched glob: quote globs (`grep --include='*.ts'`). `echo ===` fails
  (`=` expansion).
