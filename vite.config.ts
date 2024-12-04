import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';
import AutoImport from 'unplugin-auto-import/vite';
import fg from 'fast-glob';
import consola from 'consola';

const entryPoints = [
  'src/components/index.ts',
  'src/composables/index.ts',
  'src/icons/*',
  'src/theme/index.ts',
  'src/index.ts',
];

const files = fg.sync(entryPoints, { absolute: true });

const entities = files.map((file) => {
  const [key] = file.match(/(?<=src\/).*$/) || [''];
  const keyWithoutExt = key.replace(/\.[^.]*$/, '');
  return [keyWithoutExt, file];
});

const entries = Object.fromEntries(entities);

function manualChunks(identifier: string): string {
  const relative = identifier.replace(__dirname, '');
  const pathsAfterModule = relative.split('node_modules/');

  if (pathsAfterModule.length > 1) {
    return 'vendor';
  }
  else {
    const pathWithoutSrc = pathsAfterModule[0].replace('/src/', '');
    if (pathWithoutSrc.startsWith('icons')) {
      return pathWithoutSrc.replace('.ts', '');
    }
    else if (pathWithoutSrc.startsWith('utils')) {
      return 'utils/index';
    }
    else if (pathWithoutSrc.startsWith('composables')) {
      return 'composables/index';
    }
    else if (pathWithoutSrc.startsWith('components') || pathWithoutSrc.includes('plugin-vue:export-helper')) {
      return 'components/index';
    }
    else if (pathWithoutSrc.startsWith('types')) {
      return 'types/index';
    }
    else if (pathWithoutSrc.endsWith('.ts')) {
      return pathWithoutSrc.replace('.ts', '');
    }
    else {
      consola.debug(pathWithoutSrc);
    }

    return 'index';
  }
}

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
      dirs: [
        'src/composables/**/!(theme.ts|icons.ts|breakpoint.ts)',
        'src/utils/**',
      ],
      vueTemplate: true,
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
      },
    },
  },
  build: {
    outDir: './dist',
    minify: true,
    lib: {
      entry: entries,
      fileName: (format, entryName) => `${entryName}.${format}.js`,
      formats: ['es'],
      cssFileName: 'style',
    },
    rollupOptions: {
      external: [
        'vue',
        'vue-router',
        'tailwindcss/plugin',
        '@vueuse/core',
        '@vueuse/shared',
        '@vueuse/math',
      ],
      output: {
        globals: {
          vue: 'vue',
        },
        manualChunks,
      },
    },
  },
  test: {
    globals: true,
    setupFiles: ['tests/setup-files/setup.ts'],
  },
});
