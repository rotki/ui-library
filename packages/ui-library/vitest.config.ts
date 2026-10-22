import { join } from 'node:path';
import process from 'node:process';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { mergeConfig } from 'vite';
import { configDefaults, defineConfig } from 'vitest/config';
import viteConfig from './vite.config.js';

const chromiumPath = process.env.PLAYWRIGHT_CHROMIUM_PATH;
const isCI = process.env.CI === 'true';

/*
 * `test.env` applies inside the worker, too late for a `vmThreads` V8 context, which builds its
 * `Date` from the timezone the process started with; a spec pinning the clock would drift by the
 * local offset. Set on the parent, every worker inherits it. `test.env` still covers the runtime.
 */
process.env.TZ = 'UTC';

const vitestConfig = defineConfig({
  test: {
    // The html reporter takes a directory of its own, and ignores `outputFile`
    reporters: ['default', ['html', { outputDir: './tests/html' }], 'json', ...(isCI ? ['github-actions'] : [])],
    outputFile: {
      json: './tests/json/index.json',
    },
    /*
     * Each `vmThreads` worker holds its own happy-dom context, so one worker per core costs memory
     * without speeding the run up: past four workers the suite gets no faster.
     */
    maxWorkers: 4,
    coverage: {
      provider: 'v8',
      reportsDirectory: 'tests/coverage',
      reporter: ['html', 'json'],
      include: ['src/**'],
      // stylesheets are Tailwind source, which the coverage parser reads as JavaScript and fails on
      exclude: ['node_modules', 'tests/', '**/*.d.ts', '**/*.css', 'src/**/*.stories.ts', 'src/**/__test__/**'],
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
          environment: 'happy-dom',
          /*
           * `vmThreads` builds happy-dom once per worker rather than per file, saving a quarter
           * of the run. `vmMemoryLimit` is required with it, since the pool does not reclaim
           * contexts reliably, and it is a top-level option: under `poolOptions` it does nothing.
           */
          pool: 'vmThreads',
          vmMemoryLimit: '512MB',
          /*
           * A V8 context takes its own timers, so the set to fake is spelled out rather than left
           * to the default: without it the debounced search never fires and its specs fail.
           */
          fakeTimers: {
            toFake: [
              'setTimeout',
              'clearTimeout',
              'setInterval',
              'clearInterval',
              'setImmediate',
              'clearImmediate',
              'Date',
            ],
          },
          setupFiles: ['./tests/setup-files/vm-globals.ts', './tests/setup-files/setup.ts'],
          exclude: [...configDefaults.exclude, '**/*.stories.ts'],
          typecheck: {
            tsconfig: './tsconfig.vitest.json',
          },
        },
      },
      {
        extends: true,
        plugins: [storybookTest({ configDir: join(import.meta.dirname, '.storybook') })],
        optimizeDeps: {
          include: [
            'storybook/test',
            '@storybook/addon-a11y/preview',
            '@storybook/vue3-vite',
            'storybook/preview-api',
            '@floating-ui/dom',
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
          closeTimeout: 30_000,
          retry: 2,
          exclude: ['**/stories/references/**'],
          setupFiles: ['./.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
});

export default mergeConfig(viteConfig, vitestConfig);
