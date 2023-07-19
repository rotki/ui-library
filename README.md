# @rotki/ui-library

A vue component library and design system for rotki

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

# Storybook
In order to run the storybook, you can run:

```
pnpm run storybook
```

# Testing: Unit
In order to test the components, you can run:

```
pnpm run test
```

# Testing: end-to-end
In order to test the components in use in a vue 3 project, you can run:

```
pnpm run test:e2e
```

coverage results can be generated and previewed with:

```
pnpm run coverage
pnpm run coverage:preview
```


# How to test the usage locally.
After you build the bundle, in the `package.json` on your main project, you can add this to the dependencies:

```json
{
  "@rotki/ui-library": "file:...path_of_this_directory"
}
```

When the dependency installed on the main project, it will run the `postinstall` script.

Don't forget to import the `style.css` file from `@rotki/ui-library` in the project root (e.g main.ts)

```typescript
import '@rotki/ui-library/dist/style.css';
```

Also, import the library plugin use:

Vue 3
```typescript
import { RuiPlugin } from "@rotki/ui-library";

...

app.use(RuiPlugin, options);
```

And then you can use the component 
```vue
<script setup lang="ts">
import { RuiButton } from '@rotki/ui-library';
</script>

<template>
  <VContainer>
    <RuiButton outlined>This is button</RuiButton>
  </VContainer>
</template>
```

after complete setup, we can then use the theme manager as:

```typescript
const { toggleThemeMode, setThemeConfig, switchThemeScheme, state, store } = useRotkiTheme();

// to change the theme (pass colors as described by `ThemeConfig`) anytime:
setThemeConfig(newTheme);

// to switch between auto|light|dark
toggleThemeMode();

// to switch to a specific theme mode
switchThemeScheme(ThemeMode.dark);
```


# Use icons
We use remix-icons. You need to run this script to scrap the svgs data from remix-icons. (This script runs automatically on `postinstall`. Run this in case the icons aren't generated properly)
```
pnpm run generate:icons
```

You need to specify which icons you want to enable, when installing the RuiPlugin.
```typescript
import { Ri4kFill, Ri4kLine, RuiPlugin } from '@rotki/ui-library';

Vue.use(RuiPlugin, {
  icons: [Ri4kFill, Ri4kLine]
});
```

```vue
<script lang="ts" setup>
import { RuiIcon } from '@rotki/ui-library';
</script>

<template>
  <VContainer>
    <RuiIcon name="4k-fill" />
    <RuiIcon name="4k-line" />
  </VContainer>
</template>
```

## License

[AGPL-3.0](./LICENSE) License &copy; 2023- [Rotki Solutions GmbH](https://github.com/rotki)

