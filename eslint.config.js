import rotki from '@rotki/eslint-config';

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
  // vue-router writes this one, bare `eslint-disable` and all, on every build
  files: ['apps/example/src/route-map.d.ts'],
  rules: {
    'eslint-comments/require-description': 'off',
  },
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
