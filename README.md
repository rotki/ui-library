# @rotki/ui-library

A Vue component library and design system for rotki

[![npm (scoped)](https://img.shields.io/npm/v/@rotki/ui-library?style=flat-square)](https://www.npmjs.com/package/@rotki/ui-library)
[![ci](https://github.com/rotki/ui-library/actions/workflows/ci.yml/badge.svg)](https://github.com/rotki/ui-library/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/rotki/ui-library/graph/badge.svg?token=9PIS7KMFC7)](https://codecov.io/gh/rotki/ui-library)
[![license](https://img.shields.io/github/license/rotki/ui-library)](https://github.com/rotki/ui-library/blob/main/LICENSE.md)

Vue 3 components, composables, icons and a Tailwind CSS 4 theme, used by
[rotki](https://github.com/rotki/rotki), [rotki.com](https://github.com/rotki/rotki.com) and the other rotki
frontends.

## Using the library

Installation, styles, icons, i18n and theming are described in
[packages/ui-library/README.md](./packages/ui-library/README.md), which is also the README published to
npm. Moving from 2.x to 3.0 is covered in [UPGRADING.md](./UPGRADING.md).

Component documentation lives in Storybook: `pnpm run storybook` from a checkout.

## Repository layout

| Path                   | What it holds                                                                    |
| ---------------------- | -------------------------------------------------------------------------------- |
| `packages/ui-library/` | The published `@rotki/ui-library` package: components, composables, theme, icons |
| `apps/example/`        | A Vue app that uses the built library; the e2e and visual tests run against it   |
| `.github/workflows/`   | CI (`ci.yml`), npm publishing (`release.yml`), Storybook deploy, CodeQL          |

## Working on the library

- [CONTRIBUTING.md](./CONTRIBUTING.md): setup, conventions, how to test and verify a change, pull requests.
- [MAINTAINING.md](./MAINTAINING.md): releases, dependency updates, CI, and the known traps.
- [AGENTS.md](./AGENTS.md): the rules for LLM coding agents working in this repository. Humans can read
  it too; it is the condensed version of the two documents above.

## License

[AGPL-3.0](./LICENSE.md) License &copy; 2023- [Rotki Solutions GmbH](https://github.com/rotki)
