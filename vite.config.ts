import { resolve } from 'node:path';
import vue3 from '@vitejs/plugin-vue';
import vue from '@vitejs/plugin-vue2';
import { defineConfig } from 'vite';
import AutoImport from 'unplugin-auto-import/vite';
import * as Vue3SfcCompiler from '@vue/compiler-sfc';
import { isVue3 } from 'vue-demi';
import { unheadVueComposablesImports } from '@vueuse/head';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  plugins: [
    isVue3
      ? vue3({
          // @ts-ignore
          compiler: Vue3SfcCompiler
        })
      : vue(),
    AutoImport({
      imports: [
        'vue-demi',
        '@vueuse/core',
        { '@vueuse/shared': ['get', 'set'] },
        unheadVueComposablesImports
      ],
      dts: './auto-imports.d.ts',
      vueTemplate: true,
      eslintrc: {
        enabled: true
      }
    })
  ],
  optimizeDeps: {
    exclude: ['vue-demi']
  },
  build: {
    outDir: `./dist/v${isVue3 ? '3' : '2'}`,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'rotki-ui-library',
      fileName: format => `index.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'vue-demi'],
      output: {
        globals: {
          vue: 'vue',
          'vue-demi': 'vue-demi'
        }
      }
    }
  }
});
