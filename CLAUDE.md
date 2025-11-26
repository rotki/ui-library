# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is `@rotki/ui-library` - a Vue 3 component library and design system for rotki applications. It provides reusable UI components, composables, icons, and theming utilities built with Vue 3, TypeScript, Tailwind CSS, and Vite.

## Common Development Commands

### Building

- `pnpm run build` - Build the library for development
- `pnpm run build:prod` - Build production bundle for both Vue versions
- `pnpm run build:types` - Generate TypeScript declarations
- `pnpm run build:tailwind` - Build Tailwind CSS output
- `pnpm run build:web-types` - Generate web-types for IDE support

### Testing

- `pnpm run test` - Run unit tests with Vitest UI
- `pnpm run test:run` - Run unit tests without UI
- `pnpm run test:ci` - Run tests in CI mode
- `pnpm run test:e2e` - Run end-to-end tests in example app
- `pnpm run test:all` - Run both unit and e2e tests
- `pnpm run coverage` - Generate test coverage report

### Linting & Type Checking

- `pnpm run lint` - Run ESLint
- `pnpm run lint:fix` - Run ESLint with auto-fix
- `pnpm run typecheck` - Run Vue TypeScript compiler check

### Development

- `pnpm run dev` - Start Vite development server
- `pnpm run storybook` - Start Storybook for component development and documentation
- `pnpm run generate-icons` - Generate icon components from remix-icons
- `pnpm run new` - Create new component story scaffold

## Project Architecture

### Core Structure

- **Components** (`src/components/`): Vue components organized by category (buttons, forms, overlays, etc.)
- **Composables** (`src/composables/`): Reusable Vue composition functions
- **Icons** (`src/icons/`): Auto-generated icon components from remix-icons
- **Theme** (`src/theme/`): Tailwind CSS theme configuration and utilities
- **Types** (`src/types/`): TypeScript type definitions
- **Utils** (`src/utils/`): Utility functions and helpers

### Component Organization

Components are organized in folders by functionality:

- `buttons/` - Button components and button groups
- `forms/` - Form controls (text fields, checkboxes, selects, etc.)
- `overlays/` - Modal-like components (dialogs, menus, tooltips)
- `tables/` - Data table components
- `calendar/` - Calendar and date picker components
- And more...

Each component typically includes:

- `.vue` file with the component implementation
- `.spec.ts` file with unit tests
- `.stories.ts` file for Storybook documentation

### Key Architecture Patterns

- **Modular Exports**: Components, composables, icons, and theme are exported separately for tree-shaking
- **TypeScript**: Fully typed with comprehensive prop interfaces
- **Tailwind Integration**: Custom theme plugin provides design system tokens
- **Auto-imports**: Vue APIs and utility functions are auto-imported via unplugin-auto-import
- **Icon System**: Icons are generated from remix-icons and must be explicitly registered

### Build System

- **Vite**: Primary build tool with custom multi-entry configuration
- **Entry Points**: Separate builds for components, composables, icons, and theme
- **External Dependencies**: Vue, VueUse, dayjs, and Tailwind are external dependencies
- **CSS**: SCSS preprocessing with Tailwind CSS integration

### Testing Strategy

- **Unit Tests**: Vitest with Vue Test Utils for component testing
- **E2E Tests**: Playwright tests run against the example application
- **Coverage**: Comprehensive test coverage tracking with v8
- **Storybook**: Visual testing and component documentation

### E2E Testing with Playwright

E2E tests are located in `apps/example/e2e/` and run against the example application.

**Prerequisites:**

E2E tests require Chromium. You have two options:

1. **Install Playwright browsers** (downloads Chromium managed by Playwright):

   ```bash
   npx playwright install chromium
   ```

2. **Use system Chromium** (recommended for Arch Linux and other distros):

   ```bash
   # Install chromium via your package manager, e.g.:
   # Arch: pacman -S chromium
   # Ubuntu/Debian: apt install chromium-browser

   # Then set the environment variable:
   export PLAYWRIGHT_CHROMIUM_PATH=/usr/bin/chromium
   ```

**Running Tests:**

- `pnpm run test:e2e` - Build and run tests against production build (CI mode)
- `pnpm run test:e2e:dev` - Run against dev server (local development)
- `pnpm run test:e2e:ui` - Run with Playwright UI (debugging)

**Using System Chromium:**

```bash
# One-time run
PLAYWRIGHT_CHROMIUM_PATH=/usr/bin/chromium pnpm test:e2e:dev

# Or export in your shell profile (~/.bashrc, ~/.zshrc, etc.)
export PLAYWRIGHT_CHROMIUM_PATH=/usr/bin/chromium
pnpm test:e2e:dev
```

**Test File Organization:**

```
apps/example/e2e/
├── forms/           # Form component tests (autocomplete, checkbox, etc.)
├── overlays/        # Overlay component tests (dialog, menu, tooltip, etc.)
├── button.spec.ts   # General component tests at root level
├── card.spec.ts
└── ...
```

**Writing E2E Tests:**

```typescript
import { expect, test } from '@playwright/test';

test.describe('component name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/route');
  });

  test.afterEach(async ({ page }) => {
    // Clean up any open overlays (menus, dialogs, tooltips)
    await page.keyboard.press('Escape');
  });

  test('should do something', async ({ page }) => {
    await expect(page.locator('[data-cy=element]')).toBeVisible();
  });
});
```

**Locator Best Practices (in order of preference):**

1. `[data-cy=...]` - Test-specific attributes (preferred)
2. `[role=...]` - ARIA roles for accessibility testing
3. `[data-id=...]` - Component-specific identifiers
4. `[class*=_component_]` - CSS module classes (last resort for internal state)

**Avoid:**

- Hardcoded class names like `.rui-hour-06` (use data attributes instead)
- Complex CSS selectors that are brittle to refactoring
- Text content matching for non-visible text

### Development Tools

- **Storybook**: Component development and documentation
- **Example App**: Full Vue 3 application for testing integration
- **ESLint**: Custom Rotki ESLint configuration
- **Husky**: Git hooks for pre-commit linting
- **Auto-imports**: Automatic import generation for Vue APIs and utilities

## Vue & TypeScript Coding Standards

Follow these specific patterns based on rotki's contribution guidelines:

### Setup Script Structure

Use this order in Vue `<script setup>`:

1. Imports
2. Definitions (defineProps, defineEmits, etc.)
3. I18n & vue-router
4. Reactive State variables
5. Pinia stores
6. Composables
7. Computed properties
8. Methods
9. Watchers
10. Lifecycle hooks
11. Exposed methods

### Component Patterns

- **Props**: Use `defineProps<{}>()` instead of `defineProps({})`
- **Emits**: Use short style:
  ```typescript
  const emit = defineEmits<{
    'update:msg': [msg: string];
  }>();
  ```
- **Template access**: Prefer `$style` and `$attrs` in template over `useCssModules()` and `useAttrs()` in script

#### Explicit TypeScript Typing Requirements

- **Always use explicit types for refs**: `ref<boolean>(false)` instead of `ref(false)`
- **Always use explicit types for computed**: `computed<boolean>(() => ...)` instead of `computed(() => ...)`
- **Always return explicit types from functions**: `function getName(): string { ... }`
- **Always type reactive variables**: `const isLoading = ref<boolean>(false)`
- **Always type computed properties**: `const fullName = computed<string>(() => ...)`

#### VueUse get/set Pattern

- **Always use `get()` and `set()` from VueUse** instead of `.value` for reading and updating reactive properties
- Import `get` and `set` from `@vueuse/shared`
- This provides better consistency and readability across the codebase

#### Correct Examples:

```typescript
// ✅ Correct - Explicit typing with VueUse get/set
import { get, set } from '@vueuse/shared';

const isVisible = ref<boolean>(true);
const count = ref<number>(0);
const items = ref<string[]>([]);
const user = ref<User>();

const isEven = computed<boolean>(() => get(count) % 2 === 0);
const formattedName = computed<string>(() => `${get(firstName)} ${get(lastName)}`);

function getUserById(id: number): User | undefined {
  return get(users).find(user => user.id === id) || undefined;
}

function updateCount(newValue: number): void {
  set(count, newValue);
}

async function fetchData(): Promise<ApiResponse> {
  return await $fetch('/api/data');
}
```

#### Incorrect Examples:

```typescript
// ❌ Incorrect - Missing explicit types
const isVisible = ref(true);
const count = ref(0);
const items = ref([]);
const user = ref();

const isEven = computed(() => count.value % 2 === 0);
const formattedName = computed(() => `${firstName.value} ${lastName.value}`);

function getUserById(id: number) {
  return users.value.find(user => user.id === id) || undefined;
}

async function fetchData() {
  return await $fetch('/api/data');
}
```

### Code Organization & Maintainability

- **Split complex logic**: Break down large templates and script logic into smaller, focused composables
- **Component decomposition**: Split large components into smaller, reusable sub-components
- **Logical separation**: Each composable should have a single, well-defined responsibility
- **Maintainability focus**: Prioritize code readability and maintainability over brevity

## Important Notes

- This is a library package, not an application - components must be usable across different Vue 3 projects
- Icons must be explicitly registered when using the library - check how icons are used in stories/tests
- The theme system uses CSS custom properties and Tailwind CSS - changes to colors/spacing should go through the theme configuration
- Components follow Vue 3 Composition API patterns with full TypeScript support
- The build generates separate entry points for tree-shaking - maintain the current export structure
