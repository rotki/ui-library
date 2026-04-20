import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import { defineConfig } from 'vitest/config';

const require = createRequire(import.meta.url);
const pkg = require('./package.json') as {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

const declaredDeps: string[] = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
];

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '~': resolve(__dirname),
    },
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', '@vueuse/core', { '@vueuse/shared': ['get', 'set'] }],
      dts: 'src/auto-imports.d.ts',
      vueTemplate: true,
    }),
  ],
  build: {
    outDir: './dist',
    minify: false,
    sourcemap: true,
    lib: {
      entry: {
        'index': resolve(__dirname, 'src/index.ts'),
        'components/index': resolve(__dirname, 'src/components/index.ts'),
        'composables/index': resolve(__dirname, 'src/composables/index.ts'),
        'theme/index': resolve(__dirname, 'src/theme/index.ts'),
        'vite-plugin/index': resolve(__dirname, 'src/vite-plugin/index.ts'),
      },
      formats: ['es'],
      cssFileName: 'style',
    },
    rolldownOptions: {
      external: (id: string) => {
        // Anything declared in package.json (deps + peerDeps) is always externalized —
        // runtime deps must be installed by the consumer and resolved from their
        // node_modules, never bundled with pnpm peer-hash paths baked in.
        const extraExternals = [
          // Transitive runtime deps not listed in package.json but referenced directly
          '@floating-ui/core',
          '@floating-ui/utils',
          // Build-time only deps
          'tailwindcss',
          // Node.js built-ins (for vite-plugin)
          'node:fs',
          'node:path',
          'node:url',
          'fs',
          'path',
          'fast-glob',
          'vite',
        ];

        const allExternal = [...declaredDeps, ...extraExternals];

        // Match bare id or subpaths (e.g., dayjs/plugin/utc)
        return allExternal.some(dep => id === dep || id.startsWith(`${dep}/`));
      },
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
  },
});
