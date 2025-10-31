import { mergeConfig } from 'vite';
import { configDefaults, defineConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      env: {
        TZ: 'UTC',
      },
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./tests/setup-files/setup.ts'],
      exclude: [...configDefaults.exclude],
      reporters: ['default', 'html', 'json'],
      outputFile: 'tests/html/index.html',
      coverage: {
        provider: 'v8',
        reportsDirectory: 'tests/coverage',
        reporter: ['html', 'json'],
        include: ['src/*'],
        exclude: ['node_modules', 'tests/', '**/*.d.ts', 'src/**/*.stories.ts'],
      },
      testTransformMode: {
        ssr: ['**/*.ssr.spec.ts'],
      },
    },
  }),
);
