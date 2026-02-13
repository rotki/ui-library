import process from 'node:process';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { mergeConfig } from 'vite';
import { configDefaults, defineConfig } from 'vitest/config';
import viteConfig from './vite.config.js';

const chromiumPath = process.env.PLAYWRIGHT_CHROMIUM_PATH;
const isCI = process.env.CI === 'true';

const vitestConfig = defineConfig({
  test: {
    reporters: ['default', 'html', 'json', ...(isCI ? ['github-actions'] : [])],
    outputFile: {
      html: './tests/html/index.html',
      json: './tests/json/index.json',
    },
    coverage: {
      provider: 'v8',
      reportsDirectory: 'tests/coverage',
      reporter: ['html', 'json'],
      include: ['src/**'],
      exclude: ['node_modules', 'tests/', '**/*.d.ts', 'src/**/*.stories.ts', 'src/**/__test__/**'],
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
        plugins: [storybookTest({ configDir: `${import.meta.dirname}/.storybook` })],
        optimizeDeps: {
          include: [
            'storybook/test',
            '@storybook/addon-a11y/preview',
            '@storybook/vue3-vite',
            'storybook/preview-api',
            '@popperjs/core',
            'tinycolor2',
          ],
        },
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            provider: playwright({
              launchOptions: {
                ...(chromiumPath ? { executablePath: chromiumPath } : {}),
                args: ['--disable-dev-shm-usage', '--no-sandbox'],
              },
              actionTimeout: 5_000,
            }),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
          isolate: false,
          fileParallelism: false,
          testTimeout: 15_000,
          hookTimeout: 15_000,
          retry: 2,
          exclude: ['**/stories/references/**'],
          setupFiles: ['./.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
});

export default mergeConfig(viteConfig, vitestConfig);
