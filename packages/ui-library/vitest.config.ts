import { mergeConfig } from 'vite';
import { configDefaults, defineConfig } from 'vitest/config';
import viteConfig from './vite.config.js';

const vitestConfig = defineConfig({
  test: {
    env: {
      TZ: 'UTC',
    },
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup-files/setup.ts'],
    exclude: [...configDefaults.exclude],
    reporters: ['default', 'html', 'json'],
    outputFile: {
      html: './tests/html/index.html',
      json: './tests/json/index.json',
    },
    typecheck: {
      tsconfig: './tsconfig.vitest.json',
    },
    coverage: {
      provider: 'v8',
      reportsDirectory: 'tests/coverage',
      reporter: ['html', 'json'],
      include: ['src/*'],
      exclude: ['node_modules', 'tests/', '**/*.d.ts', 'src/**/*.stories.ts'],
    },
  },
});

export default mergeConfig(
  viteConfig,
  vitestConfig,
);
