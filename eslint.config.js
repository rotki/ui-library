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
  // `__test__` is the established test-fixtures directory convention here
  // (e.g. `@/__test__/options`); exempt it from the directory-name rule.
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
