# @rotki/ui-library

A Vue component library and design system for rotki

[![npm (scoped)](https://img.shields.io/npm/v/@rotki/ui-library?style=flat-square)](https://www.npmjs.com/package/@rotki/ui-library)
[![ci](https://github.com/rotki/ui-library/actions/workflows/ci.yml/badge.svg)](https://github.com/rotki/ui-library/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/rotki/ui-library/graph/badge.svg?token=9PIS7KMFC7)](https://codecov.io/gh/rotki/ui-library)
[![license](https://img.shields.io/github/license/rotki/ui-library)](https://github.com/rotki/ui-library/blob/main/LICENSE.md)

## Getting started

### Installing the library

You can start using the library after installing it from npm along with the roboto font:

```bash
pnpm install -D --save-exact @rotki/ui-library @fontsource/roboto
```

### Importing the stylesheets

Don't forget to import the `style.css` file from `@rotki/ui-library` along with the latin roboto font,
in the project root (e.g main.ts)

```typescript
import '@rotki/ui-library/dist/style.css';
import '@fontsource/roboto/latin.css';
```

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

You need to specify which icons you want to enable, when installing the RuiPlugin.

```typescript
import { createRui, Ri4kFill, Ri4kLine } from '@rotki/ui-library';

const RuiPlugin = createRui({
  theme: {
    icons: [Ri4kFill, Ri4kLine],
  },
});
app.use(RuiPlugin);
```

```vue
<script lang="ts" setup>
import { RuiIcon } from '@rotki/ui-library';
</script>

<template>
  <div>
    <RuiIcon name="4k-fill" />
    <RuiIcon name="4k-line" />
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
      // Your app translations
      // UI library translations (see below)
      rui: {
        date_time_picker: {
          date_after_max: 'Date cannot be after {date}',
          date_before_min: 'Date cannot be before {date}',
          date_in_future: 'The selected date cannot be in the future',
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
  },
} as const;
```

### Use @rotki/ui-library tailwindcss theme

You can extend @rotki/ui-library tailwind theme configuration by adding these to your tailwind config. It will provide you the classes for the colors, typography, and shadow.

```javascript
// tailwind.config.js

module.exports = {
  // ... your tailwind configs,
  plugins: [require('@rotki/ui-library/theme')],
};
```

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

We use remix-icons. You need to run this script to scrap the svgs data from remix-icons. (This script runs automatically on `prepare`. Run this in case the icons aren't generated properly)

```
pnpm run generate:icons
```

## License

[AGPL-3.0](./LICENSE.md) License &copy; 2023- [Rotki Solutions GmbH](https://github.com/rotki)
