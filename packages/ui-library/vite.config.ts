import type { Plugin } from 'vite';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import { defineConfig } from 'vitest/config';

/** The pnpm store prefix of a bundled dependency, up to its package path. */
const PNPM_STORE_PATH = /(?:\.\.\/)*node_modules\/\.pnpm\/[^/]+\/node_modules\//g;

/**
 * Bundled dependencies (VueUse) keep their pnpm store path in the `//#region`
 * comments and source map sources the bundler writes; this points both at
 * `vendor/`, where `entryFileNames` puts the files. Same line count, so the
 * maps stay valid.
 */
function vendorPaths(): Plugin {
  return {
    name: 'rui:vendor-paths',
    apply: 'build',
    generateBundle(_options, bundle) {
      for (const output of Object.values(bundle)) {
        if (output.type === 'chunk') {
          output.code = output.code.replace(PNPM_STORE_PATH, 'vendor/');
        }
        // the bundler emits source maps as separate assets
        else if (output.fileName.endsWith('.map') && typeof output.source === 'string') {
          output.source = output.source.replace(PNPM_STORE_PATH, 'vendor/');
        }
      }
    },
  };
}

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
    tailwindcss(),
    vue(),
    AutoImport({
      imports: ['vue', '@vueuse/core', { '@vueuse/shared': ['get', 'set'] }],
      dts: 'src/auto-imports.d.ts',
      vueTemplate: true,
    }),
    vendorPaths(),
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
        'vite-plugin/index': resolve(__dirname, 'src/vite-plugin/index.ts'),
      },
      formats: ['es'],
      cssFileName: 'style',
    },
    rolldownOptions: {
      /**
       * Everything declared in package.json, dependencies and peers alike,
       * stays external: a runtime dependency has to resolve from the
       * consumer's own node_modules rather than ship with pnpm peer-hash paths
       * baked in. VueUse is a devDependency on purpose: it is bundled and
       * tree-shaken, so a consumer on another VueUse version gets neither a
       * second copy nor a version mismatch.
       */
      external: (id: string) => {
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
        /**
         * A bundled dependency would otherwise keep its pnpm store path
         * (`node_modules/.pnpm/<pkg>@<version>_<peers>/...`); it goes under
         * `vendor/` with only the package path kept.
         */
        entryFileNames: (chunk) => {
          const marker = 'node_modules/';
          const index = chunk.name.lastIndexOf(marker);
          return index === -1 ? '[name].js' : `vendor/${chunk.name.slice(index + marker.length)}.js`;
        },
      },
    },
  },
});
