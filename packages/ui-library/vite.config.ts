import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import { defineConfig } from 'vitest/config';

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
    rollupOptions: {
      external: (id: string) => {
        // Externalize all peer dependencies and their subpaths
        const peerDeps = [
          'vue',
          'vue-router',
          '@vueuse/core',
          '@vueuse/shared',
          '@vueuse/math',
          'dayjs',
        ];

        // Externalize regular dependencies (installed with the library but not bundled)
        const dependencies = [
          '@popperjs/core',
          'scule',
          'tinycolor2',
        ];

        // Externalize build-time only dependencies
        const buildOnlyDeps = [
          'tailwindcss',
        ];

        // Externalize Node.js built-ins (for vite-plugin)
        const nodeBuiltins = [
          'node:fs',
          'node:path',
          'node:url',
          'fs',
          'path',
          'fast-glob',
          'vite',
        ];

        const allExternal = [...peerDeps, ...dependencies, ...buildOnlyDeps, ...nodeBuiltins];

        // Check if the import matches any external dependency (including subpaths like dayjs/plugin/utc)
        return allExternal.some(dep => id === dep || id.startsWith(`${dep}/`));
      },
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
  },
  test: {
    globals: true,
    setupFiles: ['tests/setup-files/setup.ts'],
  },
});
