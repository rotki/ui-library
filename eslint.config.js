import rotki from '@rotki/eslint-config';
import betterTailwind from 'eslint-plugin-better-tailwindcss';

/*
 * Tailwind class checks, read against the CSS entry each project builds with:
 * a class that Tailwind 4 renamed, or that it does not generate at all, fails
 * the lint instead of silently styling nothing.
 */
function tailwindRules(markers) {
  return {
    'better-tailwindcss/no-deprecated-classes': 'error',
    // markers are plain class names the tests and consumers select by, with no styles of their own
    'better-tailwindcss/no-unknown-classes': ['error', { ignore: markers }],
    'better-tailwindcss/no-duplicate-classes': 'error',
    'better-tailwindcss/no-conflicting-classes': 'error',
  };
}

export default rotki({
  vue: true,
  typescript: true,
  stylistic: true,
  formatters: true,
  storybook: true,
  test: true,
  regexp: true,
  rotki: {
    overrides: {
      '@rotki/consistent-ref-type-annotation': 'off',
    },
  },
}, {
  /*
   * A component takes more props than the default eight, but a sub-component
   * the package never exports has no public API to answer for and stays near
   * the widest of them, RuiAutoCompleteOptionList at 16.
   */
  files: ['packages/ui-library/src/components/**/*.vue'],
  rules: {
    'vue/max-props': ['error', { maxProps: 20 }],
  },
}, {
  /*
   * The exported components whose props are wider than that. Each is public
   * API, so cutting them into object props would break every consumer, and the
   * ceiling still holds: RuiAutoComplete, the widest, declares 38.
   */
  files: [
    'packages/ui-library/src/components/forms/auto-complete/RuiAutoComplete.vue',
    'packages/ui-library/src/components/forms/category-picker/RuiCategoryPicker.vue',
    'packages/ui-library/src/components/forms/select/RuiMenuSelect.vue',
    'packages/ui-library/src/components/forms/text-area/RuiTextArea.vue',
    'packages/ui-library/src/components/overlays/menu/RuiMenu.vue',
    'packages/ui-library/src/components/tables/RuiDataTable.vue',
  ],
  rules: {
    'vue/max-props': ['error', { maxProps: 40 }],
  },
}, {
  /*
   * These two keep deprecated props declared, so passing one stays a no-op
   * instead of falling through as an attribute. The rule cannot read
   * `@deprecated`, and its `ignorePublicMembers` option skips props.
   */
  files: [
    'packages/ui-library/src/components/forms/select/RuiMenuSelect.vue',
    'packages/ui-library/src/components/tabs/tab/RuiTab.vue',
  ],
  rules: {
    'vue/no-unused-properties': 'off',
  },
}, {
  // The library's index files are its export surface, which is what a consumer tree-shakes
  files: ['packages/ui-library/src/**/index.ts'],
  rules: {
    'unicorn/no-barrel-files': 'off',
  },
}, {
  /*
   * The package declares no side effects except CSS (`sideEffects` in its
   * package.json), so a consumer's bundler drops any module imported only for
   * its effect. A bare import is a bug waiting to happen: export what the
   * module sets up and import that instead. dayjs is the one library that needs
   * setting up, so it comes from the module that registers its plugins.
   */
  files: ['packages/ui-library/src/**/*.{ts,vue}'],
  ignores: ['**/*.spec.ts', '**/*.stories.ts', '**/__test__/**'],
  rules: {
    'no-restricted-syntax': ['error', 'TSEnumDeclaration[const=true]', 'TSExportAssignment', {
      selector: 'ImportDeclaration[specifiers.length=0]:not([importKind=\'type\']):not([source.value=/\\.s?css$/])',
      message: 'The package is side-effect free, so a bundler may drop a module imported only for its effect. Export what it sets up and import that.',
    }],
    '@typescript-eslint/no-restricted-imports': ['error', {
      paths: [{
        name: 'dayjs',
        allowTypeImports: true,
        message: 'Import { dayjs } from \'@/components/date-time-picker/dayjs-setup\', which registers the plugins the library relies on.',
      }],
    }],
  },
}, {
  files: ['packages/ui-library/src/components/date-time-picker/dayjs-setup.ts'],
  rules: {
    '@typescript-eslint/no-restricted-imports': 'off',
  },
}, {
  // vue-router writes this one, bare `eslint-disable` and all, on every build
  files: ['apps/example/src/route-map.d.ts'],
  rules: {
    'eslint-comments/require-description': 'off',
  },
}, {
  files: ['packages/ui-library/src/**/*.{ts,vue}'],
  ignores: ['**/*.spec.ts', '**/__test__/**'],
  plugins: { 'better-tailwindcss': betterTailwind },
  settings: { 'better-tailwindcss': { entryPoint: 'packages/ui-library/.storybook/preview.css' } },
  rules: tailwindRules(['^details$', '^rui-icon$', '^rui-time-picker-period$']),
}, {
  files: ['apps/example/src/**/*.{ts,vue}'],
  plugins: { 'better-tailwindcss': betterTailwind },
  settings: { 'better-tailwindcss': { entryPoint: 'apps/example/src/assets/main.css' } },
  // `wrapper` is the example app's own layout class, defined in assets/main.css
  rules: tailwindRules(['^wrapper$']),
}, {
  // `pnpm run generate-theme` writes it from src/theme/theme-css.ts
  ignores: ['packages/ui-library/src/theme/theme.css'],
}, {
  // `__test__` is this repo's test-fixtures directory convention, so the directory-name rule skips it
  files: ['**/__test__/**'],
  rules: {
    'unicorn/filename-case': 'off',
  },
}, {
  files: ['**/*.stories.ts', '**/vue-shim.d.ts', '**/.storybook/**/*.ts'],
  rules: {
    'import/no-default-export': 'off',
    'max-lines': 'off',
  },
}, {
  files: ['**/*.ts'],
  rules: {
    'storybook/no-uninstalled-addons': 'off', // until storybook eslint official supports eslint 9
  },
}, {
  files: ['**/*.scss'],
  rules: {
    'max-lines': 'off',
  },
}, {
  files: ['**/*.yml', '**/*.yaml'],
  rules: {
    '@stylistic/spaced-comment': 'off', // rotki/eslint-config#80
  },
}, {
  files: ['pnpm-workspace.yaml'],
  rules: {
    'pnpm/yaml-enforce-settings': 'off',
  },
});
