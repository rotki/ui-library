# Contribution Guide

Thank you for considering contributing to @rotki/ui-library! We welcome all kinds of contributions, from code to documentation, and everything in between. This guide will help you get started with contributing to our project.

## Getting Started

Before you start contributing, make sure you read our contribution guide to understand what we expect from a contribution.

### Guidelines for Vue and TypeScript

We use Vue and TypeScript in our project. Please familiarize yourself with our style and structure guidelines to ensure consistency across the codebase.

**[Vue TypeScript Guide](https://docs.rotki.com/contribution-guides/vue-typescript.html#vue)**

This guide provides detailed instructions and best practices for working with Vue and TypeScript in our project. Please make sure you follow these guidelines when contributing to our codebase.

### Managing Dependencies

Proper dependency management is crucial for maintaining a healthy codebase. Please refer to the section on dependencies for more details.

**[Dependencies Guide](https://docs.rotki.com/contribution-guides/vue-typescript.html#dependencies)**

This section outlines how to add, update, and manage dependencies in our project. Understanding and following these rules will help us avoid common pitfalls associated with dependencies.

## Commit Style

We use Conventional Commits as our commit style to ensure consistent and descriptive commit messages. This helps in automatically generating changelogs, determining the nature of changes (major, minor, patch), and for generally keeping our project's history clean and readable.

### Conventional Commits

A specification for adding human and machine-readable meaning to commit messages. The commit message should be structured as follows:

```bash
[type(scope)]: message

[optional body]
[optional footer(s)]
```

**Types**:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation

#### Reverting and Breaking Changes

- If your commit reverts a previous commit, add `revert: ` before the type. E.g., `revert: feat(pencil): add 'graphiteWidth' option`.
- Breaking changes should start with the word BREAKING CHANGE: with a space or two newlines. The rest of the commit message is then used to describe the change, its rationale, and migration notes.

**Example**:

#### Commit a new feature

```text
feat(AutoComplete): add keyboard navigation support

Added keyboard navigation support to the AutoComplete component.
Users can now use arrow keys to navigate through the suggestions and press Enter to select one.

Addresses issue #123.
```

#### Commiting a fix

```text
fix(Dialog): correct modal closure on background click

Fixed an issue where the RuiDialog modal would not close when clicking the background.
The event listener for closing the modal on background click was not properly attached.

Closes issue #456.
```

#### Commiting a breaking change

```text
feat(Menu)!: refactor Menu component API

Refactored the Menu component to improve usability and flexibility.
The following breaking changes were made:
- `menuItems` prop renamed to `items`.
- `onSelect` method now passes an event object as the first argument.
- Removed deprecated `itemStyle` prop in favor of `styleClasses`.

BREAKING CHANGE: The Menu component API has been changed. Ensure to update the usage of `menuItems` to `items`, adjust `onSelect` method calls according to the new signature, and replace any usage of `itemStyle` with `styleClasses`.

Closes issue #789.
```

### Changelog Generation

Ensure that any changes that should be included in the change log are properly prefixed with `feat:` or `fix:`.
By following these guidelines, you will help ensure that our project remains maintainable and understandable for everyone involved.

## Testing

All changes must be accompanied by appropriate unit and integration tests. This ensures that new features work as expected and that bugs are fixed without introducing regressions.

- **Unit Tests**: We use **Vitest** for unit testing. Unit tests should cover individual functions or components to ensure they work as intended in isolation.
- **E2E Tests**: We use **Playwright** for end-to-end testing. E2E tests should verify that different parts of the application work together as expected.

Before submitting a pull request, please ensure:

- Your changes are fully covered by unit tests.
- Your changes are fully covered by integration tests.
- All tests pass successfully.

This helps maintain the overall health and stability of the codebase.

### Running Tests

```sh
# Unit tests
pnpm run test           # Run with Vitest UI
pnpm run test:run       # Run without UI
pnpm run coverage       # Run with coverage report

# E2E tests
pnpm run test:e2e       # Build and run against production build (CI mode)
pnpm run test:e2e:dev   # Run against dev server (local development)
pnpm run test:e2e:ui    # Run with Playwright UI (debugging)
```

### E2E Test Prerequisites

E2E tests require Chromium. You have two options:

1. **Install Playwright browsers** (downloads Chromium managed by Playwright):

   ```sh
   npx playwright install chromium
   ```

2. **Use system Chromium** (recommended for Arch Linux and other distros):

   ```sh
   # Install chromium via your package manager, e.g.:
   # Arch: pacman -S chromium
   # Ubuntu/Debian: apt install chromium-browser

   # Then set the environment variable:
   export PLAYWRIGHT_CHROMIUM_PATH=/usr/bin/chromium
   ```

   You can add the export to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.) for persistence.

### Writing E2E Tests

E2E tests are located in `apps/example/e2e/` and organized by component category:

- `forms/` - Form component tests (autocomplete, checkbox, radio, etc.)
- `overlays/` - Overlay component tests (dialog, menu, tooltip, etc.)
- Root level - General component tests (button, card, tabs, etc.)

**Test file naming**: Use `{component-name}.spec.ts` format.

**Test structure**:

```typescript
import { expect, test } from '@playwright/test';

test.describe('component name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/route');
  });

  test.afterEach(async ({ page }) => {
    // Clean up open overlays to prevent test pollution
    await page.keyboard.press('Escape');
  });

  test('should do something', async ({ page }) => {
    await expect(page.locator('[data-cy=element]')).toBeVisible();
  });
});
```

**Locator strategy** (in order of preference):

1. `[data-cy=...]` - Test-specific data attributes (preferred)
2. `[role=...]` - ARIA roles for accessibility
3. `[data-id=...]` - Component identifiers
4. `[class*=_name_]` - CSS module classes (last resort)

## Linting

We use `@rotki/eslint-config` for linting to ensure code quality and consistency. Please make sure your code adheres to the project's linting rules before submitting a pull request.

### Running Linting

To run the linter, use the following command:

```sh
pnpm run lint
```

### Fixing Linting Issues

If you encounter any linting issues, you can attempt to auto-fix them using:

```sh
pnpm run lint:fix
```

Ensure that your code passes all linting checks before submitting your pull request. Proper linting helps maintain readability and reduces potential errors in the codebase.

## Releases

We use `bumpp` to handle versioning for our releases, following Semantic Versioning principles. The release process involves updating the version and pushing a tag to trigger the release flow.

### Semantic Versioning

We follow [Semantic Versioning](https://semver.org/) to label our releases. The version number is of the format `MAJOR.MINOR.PATCH`:

- **MAJOR**: Incompatible API changes
- **MINOR**: Added functionality in a backwards-compatible manner
- **PATCH**: Backwards-compatible bug fixes

### Steps for Releasing

1. **Update Version**: Use `bumpp` to update the project version.

   ```sh
   pnpm run release
   ```

   Follow the prompts to select the appropriate version bump (e.g., patch, minor, major) based on the nature of the changes.

2. **Push Tag**: After updating the version, push the tag to remote to trigger the release flow.

   ```sh
   git push --follow-tags
   ```

3. **Trigger Release Flow**: The pushed tag will trigger the CI/CD pipeline to handle the remainder of the release process.

By following these steps and using semantic versioning, you ensure that releases are handled consistently and correctly, providing clear information about the nature of changes in each release.

## Contact

If you have any questions or need assistance, feel free to reach out to the [maintainers](https://discord.rotki.com) or open an issue on our repository.

Happy coding!
