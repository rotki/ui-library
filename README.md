# @rotki/ui-library

A Vue component library and design system for rotki

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
import { createRui } from "@rotki/ui-library";

...
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
    <RuiButton outlined>This is button</RuiButton>
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
import { Ri4kFill, Ri4kLine, createRui } from '@rotki/ui-library';

const RuiPlugin = createRui({
  theme: {
    icons: [Ri4kFill, Ri4kLine]
  }
})
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

### Use @rotki/ui-library tailwindcss theme
You can extend @rotki/ui-library tailwind theme configuration by adding these to your tailwind config. It will provide you the classes for the colors, typography, and shadow.

```javascript
// tailwind.config.js

module.exports = {
    // ... your tailwind configs,
    plugins: [require('@rotki/ui-library/theme')]
}
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

[AGPL-3.0](./LICENSE) License &copy; 2023- [Rotki Solutions GmbH](https://github.com/rotki)

