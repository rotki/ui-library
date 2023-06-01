import { mergeConfig } from 'vite';
import { configDefaults, defineConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      exclude: [...configDefaults.exclude],
      reporters: ['default', 'html', 'json'],
      outputFile: 'tests/html/index.html',
      coverage: {
        provider: 'c8',
        reportsDirectory: 'tests/coverage',
        reporter: ['html', 'json'],
        include: ['src/*'],
        exclude: ['node_modules', 'tests/', '**/*.d.ts'],
      },
    },
  })
);
