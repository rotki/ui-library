# @rotki/ui-library

A Vue component library and design system for rotki

[![npm (scoped)](https://img.shields.io/npm/v/@rotki/ui-library?style=flat-square)](https://www.npmjs.com/package/@rotki/ui-library)
[![ci](https://github.com/rotki/ui-library/actions/workflows/ci.yml/badge.svg)](https://github.com/rotki/ui-library/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/rotki/ui-library/graph/badge.svg?token=9PIS7KMFC7)](https://codecov.io/gh/rotki/ui-library)
[![license](https://img.shields.io/github/license/rotki/ui-library)](https://github.com/rotki/ui-library/blob/main/LICENSE.md)

## Getting started

### Installing the library

You can start using the library after installing it from npm along with the Inter and Geist Mono fonts:

```bash
pnpm install -D --save-exact @rotki/ui-library @fontsource-variable/inter @fontsource-variable/geist-mono
```

### Importing the stylesheets

With Tailwind CSS 4 in the app, import the library into your Tailwind entry (see
[Use the @rotki/ui-library Tailwind CSS theme](#use-the-rotkiui-library-tailwind-css-theme)) and the fonts in
the project root (e.g. main.ts):

```typescript
import '@fontsource-variable/inter/opsz.css';
import '@fontsource-variable/geist-mono';
```

Without Tailwind, import the prebuilt stylesheet as well:

```typescript
import '@rotki/ui-library/style.css';
```

The library names the fonts but does not ship them. Inter's `opsz.css` adds the optical size axis, so large
headings get the display cut; `@fontsource-variable/inter` alone is about a third smaller. The static
`@fontsource/inter` and `@fontsource/geist-mono` builds work too. Self-host the fonts rather than loading
them from a CDN, so an offline app still renders them.

### Using the plugin

To use the library you must install the library plugin:

```typescript
import { createRui } from '@rotki/ui-library';

const RuiPlugin = createRui(options);
app.use(RuiPlugin);
```

### Using the components

Then you can you the library components e.g.:

```vue
<script setup lang="ts">
import { RuiButton } from '@rotki/ui-library';
</script>

<template>
  <div>
    <RuiButton outlined>
      This is button
    </RuiButton>
  </div>
</template>
```

### Managing the theme

To dynamically manage the theme you can use the theme manager

```typescript
import { useRotkiTheme } from '@rotki/ui-library';
const { toggleThemeMode, setThemeConfig, switchThemeScheme, state, store } = useRotkiTheme();

// to change the theme (pass colors as described by `ThemeConfig`) anytime:
setThemeConfig(newTheme);

// to switch between auto|light|dark
toggleThemeMode();

// to switch to a specific theme mode
switchThemeScheme(ThemeMode.dark);
```

### Using the icons

Icons must be registered when installing the RuiPlugin. There are two approaches:

#### Option 1: Auto-detection with Vite Plugin (Recommended)

The library provides a Vite plugin that automatically detects icon usage in your source files:

```typescript
// vite.config.ts
import { ruiIconsPlugin } from '@rotki/ui-library/vite-plugin';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [
    vue(),
    ruiIconsPlugin({
      // Optional: icons that are used dynamically and can't be statically detected
      include: ['lu-dynamic-icon'],
      // Optional: fail build on invalid icon names
      strict: false,
      // Optional: enable debug logging
      debug: false,
    }),
  ],
});
```

Then import and use the detected icons:

```typescript
// main.ts
import { createRui } from '@rotki/ui-library';
import icons from 'virtual:rotki-icons';

const RuiPlugin = createRui({
  theme: { icons },
});
app.use(RuiPlugin);
```

Add type support for the virtual module in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["@rotki/ui-library/vite-plugin/client"]
  }
}
```

**Handling Dynamic Icons:**

The plugin can only detect icons that are statically analyzable. For dynamic icon names (e.g., computed from variables), you must manually include them:

```vue
<!-- These CAN be auto-detected: -->
<RuiIcon name="lu-star" />

<RuiIcon :name="'lu-check'" />

<!-- These CANNOT be auto-detected (use `include` option): -->
<RuiIcon :name="iconName" />              <!-- Variable reference -->

<RuiIcon :name="`lu-${direction}`" />     <!-- Template literal with variable -->
```

```typescript
// These CAN be auto-detected:
const icon = 'lu-arrow-down';

// These CANNOT be auto-detected (use `include` option):
const icons = props.items.map(i => i.icon); // Dynamic mapping
```

#### Option 2: Manual Registration

You can manually import and register specific icons:

```typescript
import { createRui, LuArrowDown, LuCheck, LuStar } from '@rotki/ui-library';

const RuiPlugin = createRui({
  theme: {
    icons: [LuStar, LuCheck, LuArrowDown],
  },
});
app.use(RuiPlugin);
```

#### Using Icons in Templates

```vue
<script lang="ts" setup>
import { RuiIcon } from '@rotki/ui-library';
</script>

<template>
  <div>
    <RuiIcon name="lu-star" />
    <RuiIcon name="lu-check" />
  </div>
</template>
```

### Setting up internationalization (i18n)

The UI library supports internationalization through the `createRuiI8nPlugin` function. This allows you to provide translations for UI components.

#### Setting up the i18n plugin

First, you need to set up your Vue i18n instance and then connect it to the UI library:

```typescript
import { createRui, createRuiI8nPlugin } from '@rotki/ui-library';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';

// Create your i18n instance
const i18n = createI18n({
  legacy: false, // You must set `false`, to use Composition API
  locale: 'en',
  messages: {
    en: {
      // Your app translations, then the UI library's own (see below)
      rui: {
        date_time_picker: {
          date_after_max: 'Date cannot be after {date}',
          date_before_min: 'Date cannot be before {date}',
          date_in_future: 'The selected date cannot be in the future',
          paste_unreadable: 'Could not read a date from the pasted text',
        },
      },
    },
    // Other languages...
  },
});

const app = createApp(App);

// Create and use the Rotki UI plugin
const RuiPlugin = createRui();
app.use(RuiPlugin);

// Create and use the Rotki UI i18n plugin
const RuiI18nPlugin = createRuiI8nPlugin(i18n);
app.use(RuiI18nPlugin);

app.use(i18n);
app.mount('#app');
```

#### Available translation keys

The UI library uses the following translation keys:

```typescript
// These are defined in src/i18n/keys.ts
export const RUI_I18N_KEYS = {
  dateTimePicker: {
    dateAfterMax: 'rui.date_time_picker.date_after_max',
    dateBeforeMin: 'rui.date_time_picker.date_before_min',
    dateInFuture: 'rui.date_time_picker.date_in_future',
    pasteUnreadable: 'rui.date_time_picker.paste_unreadable',
  },
} as const;
```

### Use the @rotki/ui-library Tailwind CSS theme

The library is built for Tailwind CSS 4. Import it right after Tailwind in your CSS entry:

```css
/* main.css */
@import 'tailwindcss';
@import '@rotki/ui-library/tailwind.css';
```

That is the whole setup: there is no `style.css` to import. `tailwind.css` brings the theme, the color
values and the library's variants and utilities, and points your Tailwind build at the library's components,
so your build generates the classes they use, once, next to your own. A class you pass to a component then
competes with the component's own classes as any two Tailwind classes do, whatever order your stylesheets
load in.

`@rotki/ui-library/style.css` is the same library prebuilt with Tailwind itself, for an app without its own
Tailwind build. Don't import it alongside `tailwind.css`: everything would ship twice, and the prebuilt
classes would override your responsive ones (`lg:grid-cols-3`) by loading later.

The theme gives you the `rui-*` colors (`bg-rui-primary`, `text-rui-text-secondary`), the semantic surfaces and lines (`bg-rui-surface`, `border-rui-divider`, `border-rui-outline`), the role radii (`rounded-rui-control`, `rounded-rui-card`), the role shadows (`shadow-rui-menu`, `shadow-rui-drawer`, `shadow-rui-tooltip`, `shadow-rui-control`), the typography classes (`text-body-1`, `text-h6`) and a `dark:` variant that follows the theme `useRotkiTheme` sets. The tokens are CSS variables, so `--radius-rui-control` and the other role tokens can be retuned in your own CSS.

## Development

### Installation

To install the dependencies you need to run on the root of the repository

```
pnpm install --frozen-lockfile
```

### Compiles and minifies for production

The following command when executed from the project root will build the `@rotki/ui-library` bundle.
This command will create the bundle for both Vue version >=3.4.3.

```
pnpm run build:prod
```

If you want to build for specific version, you can run:

```
pnpm run build
```

### Lint check

```
pnpm run lint
```

### Lints and fixes files

```
pnpm run lint:fix
```

### Type check

```
pnpm run typecheck
```

### Storybook

In order to run the storybook, you can run:

```
pnpm run storybook
```

### Testing: Unit

In order to test the components, you can run:

```
pnpm run test
```

### Testing: end-to-end

In order to test the components in use in a vue 3 project, you can run:

```
pnpm run test:e2e
```

coverage results can be generated and previewed with:

```
pnpm run coverage
pnpm run coverage:preview
```

### Locally testing the library

After you build the bundle, in the `package.json` on your main project, you can add this to the dependencies:

```json
{
  "@rotki/ui-library": "file:...path_of_this_directory"
}
```

When the dependency installed on the main project, it will run the `prepare` script.

### Generating the library icons

We use [Lucide](https://lucide.dev/) icons as the base icon set. Brand icons (Discord, Reddit, X/Twitter, etc.) in the `src/custom-icons/` directory are sourced from [Simple Icons](https://simpleicons.org/).

The generator (`scripts/generate-icons.ts`) reads each Lucide icon's pre-parsed component data and the parsed XML of every SVG in `src/custom-icons/`, and emits one `[tag, attrs]` tuple per renderable primitive into `src/icons/icons_*.ts`. Multi-path icons stay as multiple entries — they are not collapsed into a single concatenated path. The generated files are gitignored and rebuilt by the `build` script; run the command below if you need to regenerate them by hand.

```
pnpm run generate-icons
```

## License

[AGPL-3.0](./LICENSE.md) License &copy; 2023- [Rotki Solutions GmbH](https://github.com/rotki)
