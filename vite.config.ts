import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';
import AutoImport from 'unplugin-auto-import/vite';
import fg from 'fast-glob';

const entryPoints = [
  'src/components/index.ts',
  'src/composables/index.ts',
  'src/all-icons.ts',
  'src/theme/index.ts',
  'src/index.ts',
];

const files = fg.sync(entryPoints, { absolute: true });

const entities = files.map((file) => {
  const [key] = file.match(/(?<=src\/).*$/) || [];
  const keyWithoutExt = key.replace(/\.[^.]*$/, '');
  return [keyWithoutExt, file];
});

const entries = Object.fromEntries(entities);

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
      entry: entries,
      fileName: (format, entryName) => `${entryName}.${format}.js`,
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'vue',
        'vue-router',
        'tailwindcss/plugin',
        '@vueuse/core',
        '@vueuse/shared',
      ],
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
