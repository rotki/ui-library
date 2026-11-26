# Maintaining @rotki/ui-library

How to land changes, release, keep dependencies current and read CI, plus the traps no tool catches.
[AGENTS.md](./AGENTS.md) has the rules for code and the checks; [CONTRIBUTING.md](./CONTRIBUTING.md) has
setup and the commit format.

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
it), CI is green, `license/cla` included, and another member of `@rotki/maintainers` has approved it. An
admin can merge without the approval when no other maintainer is available.

Land it with GitHub's **Rebase and merge** when every commit is a standalone conventional commit, or with
**Squash and merge** otherwise. When squashing, edit the commit message into one conventional commit
(`type(scope): subject`, plus a `BREAKING CHANGE:` footer if needed): it becomes the changelog line.

## Releasing

1. **Bump.** On a branch from the latest `main`, run `pnpm run release --no-tag` and pick the version: a
   `!` or `BREAKING CHANGE:` since the last tag means major, a `feat` minor, anything else patch. It sets
   the version in the three `package.json` files and commits `chore: release vX.Y.Z`.
2. **Land it.** Open a pull request and land it with Rebase and merge.
3. **Tag the merged commit.** `upstream` below is the remote for `rotki/ui-library` (`origin` in a direct
   clone):

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
- Pin GitHub actions to a commit SHA with the tag as a comment, and run `pnpm run lint:workflows`.
- `@playwright/test` moves together with the Playwright image in `ci.yml` and
  `apps/example/scripts/visual-docker.sh`. The actionlint and zizmor versions in `ci.yml` move together
  with the `lint:workflows` script.

### Versions held on purpose

Re-check each condition before bumping, with the repository's own checks.

| Package                         | Held at | Why                                                                             | Bump when                                      |
| ------------------------------- | ------- | ------------------------------------------------------------------------------- | ---------------------------------------------- |
| `vue-tsc`, `vue-component-meta` | 3.3.11  | From 3.3.12, `//` in a static template prop (a URL) corrupts the generated code | `pnpm run typecheck` passes on the new version |
| `typescript`                    | 6.0.x   | TypeScript 7 (the Go port) waits for 7.1 stable and for Vue tooling support     | 7.1 is `latest` on npm and vue-tsc runs on it  |

The vue-tsc canary is `apps/example/src/views/AvatarView.vue` (a URL prop inside a `v-for`): on an
affected version the typecheck reports `Cannot find name 's'`.

## CI

`.github/workflows/ci.yml` runs on pull requests and on pushes to `main`; the comments there explain the
jobs. Jobs: `commit-lint`, `workflow-lint`, `validate` (lint and typecheck), `unit`, `storybook`,
`coverage`, `e2e` and `visual`. The browser jobs run inside the pinned Playwright image. `deploy.yml`
publishes Storybook to GitHub Pages on pushes to `main`; `codeql-analysis.yml` runs CodeQL.

Triage a failure from the log, not the summary: `gh run view --repo rotki/ui-library --job <id> --log`.

- An e2e failure at 0ms with `net::ERR_NETWORK_CHANGED` is the runner's network, not the code: re-run.
- An autocomplete spec that clicks right after `fill()` races the 50ms debounced search. Wait for the
  filtered option count before clicking.
- If e2e retries or flakes rise, drop `--workers=2` from the e2e job.

### Workflow checks

Changes under `.github/workflows/` must pass actionlint and zizmor: the `workflow-lint` job, or
`pnpm run lint:workflows` locally (`GH_TOKEN=$(gh auth token)` adds zizmor's online audits). zizmor warns
about the YAML anchors in `ci.yml`; that is expected. A finding that is a deliberate choice gets an inline
`# zizmor: ignore[<rule>] <reason>`, never an ignore without a reason.

Two rules no tool checks: every job has `timeout-minutes`, and every permission has a comment saying what
it is for.

## Known traps

Each of these cost real time once, and no tool catches them.

### Build and package

- Under `"sideEffects": ["**/*.css"]`, top-level `dayjs.extend(x)` next to `export { dayjs }` is dropped
  too: the re-export is wired straight to the dayjs package. What works is
  `export const dayjs = withPlugins()`, a new binding whose initializer runs the setup. Unit tests never see
  this; `verify:tree-shaking` (part of `build:prod`) does.
- Vite's dev server can serve a stale SFC after a rebase or two quick edits. Make a real edit to the file
  or restart.
- `pnpm install` runs the library's `prepare` script, which can run a full `build:prod` when the install is
  not considered local; expect a slow first install after switching branches.

### Vue and TypeScript

- To see what a component actually received, read `el.__vueParentComponent.props` and
  `el.__vueParentComponent.setupState` in the browser console.
- Generic SFCs hoist only the leading `export` block: a local type declared before `export interface Props`
  gives TS1184 / TS4025. `InstanceType<typeof GenericSfc>` does not work; specs use
  `ReturnType<typeof createWrapper>`.
- `strictTemplates` rejects `data-*` attributes unless `dataAttributes: ['data-*']` is set in the
  `vueCompilerOptions` (it is, in each tsconfig that needs it).
- To find removed props a consumer still passes, run vue-tsc there with `checkUnknownProps`.

### Styling

- The `tv()` merger only knows Tailwind 4 class names. A Tailwind 3 utility (`bg-opacity-40`,
  `flex-shrink-0`) is misclassified and can drop the class it conflicts with (a slider once lost its color).
- `p-*` is emitted before `py-*`, so a component class `py-3` beats a consumer's `py-0` on the same element.
  Default paddings on table cells live in `:where()` for that reason; keep new ones there.
- Tailwind 4 `dark:` defaults to `:where()` (no specificity); the library's dark variant uses `:is()` so it
  still beats `hover:` and `disabled:`. `translate-*`/`rotate-*` set the individual `translate`/`rotate`
  properties, not `transform`: code that checks `transform` to find a containing block must check those too.
- Quoted attribute selectors in arbitrary variants compile to invalid CSS in some consumer builds
  (lightningcss drops the rule). Select on an unquoted `data-*` attribute.
- The example app scrolls inside `body`: element screenshots need
  `html, body { height: auto; overflow: visible }` and a static header.
- The buttons page is route `/`, not `/buttons`. Scope page selectors to `getByTestId('page-content')`, or
  they hit the header's theme toggle.

### Dependencies

- `pnpm add --config.minimumReleaseAge=0` is not a one-off: later installs reject the lockfile. For a
  version that cannot wait, add a dated `minimumReleaseAgeExclude` entry and remove it later.
- After a bump, auto-installed peers can keep the old version: `grep <old-version> pnpm-lock.yaml`, then
  `pnpm update -r --depth 99 <pkg>`.
- Reverting a bump and reinstalling leaves the new version in the lockfile. Restore it with
  `git checkout HEAD -- pnpm-lock.yaml`, then `pnpm install`.
- Run the typecheck even when the tests pass: msw 3 renamed an option and silently ignored the old name.

### Tests

- happy-dom does not expand the `overflow` shorthand; set `overflowX`/`overflowY` in specs. Storybook's
  `userEvent.hover` does not trigger CSS `:hover`.
- Measure two boxes in one `page.evaluate`: images loading elsewhere shift the layout between two separate
  `boundingBox()` calls.
- `pnpm run test:visual:update <file>` does not filter: the script passes `--update-snapshots` first, so the
  file becomes its value. Call `visual-docker.sh` directly with `--update-snapshots=missing` or the file
  last.

### Shell

- zsh aborts a command on an unmatched glob: quote globs (`grep --include='*.ts'`). `echo ===` fails
  (`=` expansion).
