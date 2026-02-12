import process from 'node:process';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { mergeConfig } from 'vite';
import { configDefaults, defineConfig } from 'vitest/config';
import viteConfig from './vite.config.js';

const chromiumPath = process.env.PLAYWRIGHT_CHROMIUM_PATH;

const vitestConfig = defineConfig({
  test: {
    reporters: ['default', 'html', 'json'],
    outputFile: {
      html: './tests/html/index.html',
      json: './tests/json/index.json',
    },
    coverage: {
      provider: 'v8',
      reportsDirectory: 'tests/coverage',
      reporter: ['html', 'json'],
      include: ['src/*'],
      exclude: ['node_modules', 'tests/', '**/*.d.ts', 'src/**/*.stories.ts'],
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          env: {
            TZ: 'UTC',
          },
          globals: true,
          environment: 'jsdom',
          setupFiles: ['./tests/setup-files/setup.ts'],
          exclude: [...configDefaults.exclude, '**/*.stories.ts'],
          typecheck: {
            tsconfig: './tsconfig.vitest.json',
          },
        },
      },
      {
        extends: true,
        plugins: [
          storybookTest({ configDir: `${import.meta.dirname}/.storybook` }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            provider: playwright({
              launchOptions: chromiumPath ? { executablePath: chromiumPath } : {},
            }),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
          retry: 2,
          setupFiles: ['./.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
});

export default mergeConfig(
  viteConfig,
  vitestConfig,
);
