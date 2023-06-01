import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import AutoImport from 'unplugin-auto-import/vite';
import { unheadVueComposablesImports } from '@vueuse/head';

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
      imports: [
        'vue',
        '@vueuse/core',
        { '@vueuse/shared': ['get', 'set'] },
        unheadVueComposablesImports,
      ],
      dts: './auto-imports.d.ts',
      dirs: ['src/composables/**'],
      vueTemplate: true,
      eslintrc: {
        enabled: true,
      },
    }),
  ],
  build: {
    outDir: './dist',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'rotki-ui-library',
      fileName: (format) => `index.${format}.js`,
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'vue',
        },
      },
    },
  },
});
