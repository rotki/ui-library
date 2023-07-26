import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';
import AutoImport from 'unplugin-auto-import/vite';

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
      dts: './auto-imports.d.ts',
      dirs: ['src/composables/**', 'src/utils/**'],
      vueTemplate: true,
      eslintrc: {
        enabled: true,
      },
    }),
  ],
  build: {
    outDir: './dist',
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        theme: resolve(__dirname, 'src/theme/index.ts'),
      },
      fileName: (format, entryName) => `${entryName}.${format}.js`,
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue', 'tailwindcss/plugin'],
      output: {
        globals: {
          vue: 'vue',
        },
      },
    },
  },
  test: {
    globals: true,
    setupFiles: ['tests/setup-files/setup.ts'],
  },
});
