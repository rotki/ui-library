import path from 'node:path';
import rotki from '@rotki/eslint-config';

export default rotki({
  vue: true,
  typescript: true,
  stylistic: true,
  formatters: true,
  storybook: true,
  test: true,
  regexp: true,
  cypress: {
    testDirectory: path.join('example', 'cypress'),
  },
  rotki: {
    overrides: {
      '@rotki/consistent-ref-type-annotation': 'off',
    },
  },
}, {
  files: ['**/*.stories.ts', '**/vue-shim.d.ts', '**/.storybook/**/*.ts'],
  rules: {
    'import/no-default-export': 'off',
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
});
