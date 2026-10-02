import { join } from 'node:path';
import process from 'node:process';
import { build, type Plugin, type Rollup } from 'vite';

/**
 * Bundles small consumer apps against the built dist the way an app's bundler
 * would, honouring the package's `sideEffects` field, and checks what ships.
 * The package declares no side effects except CSS, so this catches the two ways
 * that goes wrong: a component dragging in unrelated code, and setup code (the
 * dayjs plugins) silently dropped from a consumer's build.
 */

const DIST_ENTRY = join(import.meta.dirname, '..', 'dist', 'index.js');

interface Consumer {
  name: string;
  source: string;
  check: (code: string) => string[];
}

const DAYJS_PLUGINS: readonly string[] = ['utc', 'timezone', 'customParseFormat'];

/**
 * Names under which each dayjs plugin is imported and then registered with `.extend()`.
 */
function missingDayjsPlugins(code: string): string[] {
  return DAYJS_PLUGINS.filter((plugin) => {
    const imported = new RegExp(`import (\\w+) from "dayjs/plugin/${plugin}\\.js"`).exec(code)?.[1];
    return !imported || !code.includes(`.extend(${imported})`);
  });
}

const consumers: readonly Consumer[] = [
  {
    name: 'button only',
    source: 'import { RuiButton } from \'@rotki/ui-library\';\nconsole.log(RuiButton);',
    check: (code: string): string[] => [
      ...['RuiAutoComplete', 'RuiDataTable', 'RuiDateTimePicker']
        .filter(name => code.includes(name))
        .map(name => `ships ${name}, which it never imports`),
      ...(code.includes('"dayjs') ? ['ships dayjs, which it never uses'] : []),
    ],
  },
  {
    name: 'date-time picker',
    source: 'import { RuiDateTimePicker } from \'@rotki/ui-library\';\nconsole.log(RuiDateTimePicker);',
    check: (code: string): string[] =>
      missingDayjsPlugins(code).map(plugin => `drops the dayjs ${plugin} plugin registration`),
  },
];

function virtualEntry(source: string): Plugin {
  const id = 'virtual:consumer';
  return {
    name: 'consumer-entry',
    resolveId: (request: string): string | undefined => (request === id ? `\0${id}` : undefined),
    load: (request: string): string | undefined => (request === `\0${id}` ? source : undefined),
  };
}

function isBuildOutput(value: unknown): value is Rollup.RollupOutput {
  return typeof value === 'object' && value !== null && 'output' in value;
}

async function bundle(source: string): Promise<string> {
  const result = await build({
    configFile: false,
    logLevel: 'silent',
    plugins: [virtualEntry(source)],
    resolve: { alias: { '@rotki/ui-library': DIST_ENTRY } },
    build: {
      write: false,
      minify: false,
      rollupOptions: {
        input: 'virtual:consumer',
        // Third-party packages stay out, so only the library's own modules are judged
        external: (id: string): boolean => !id.startsWith('.') && !id.startsWith('/') && !id.startsWith('\0') && !id.startsWith('virtual:') && id !== '@rotki/ui-library',
      },
    },
  });

  const outputs: Rollup.RollupOutput[] = (Array.isArray(result) ? result : [result]).filter(isBuildOutput);
  return outputs
    .flatMap(output => output.output)
    .filter((chunk): chunk is Rollup.OutputChunk => chunk.type === 'chunk')
    .map(chunk => chunk.code)
    .join('\n');
}

const failures: string[] = [];
for (const consumer of consumers) {
  const problems = consumer.check(await bundle(consumer.source));
  failures.push(...problems.map(problem => `${consumer.name}: ${problem}`));
}

if (failures.length > 0) {
  console.error('\n❌ tree-shaking verification failed.\n');
  console.error('The package declares no side effects except CSS (`sideEffects` in package.json).');
  console.error('Module-level setup must run inside an export that the code using it imports,');
  console.error('and components must not import each other\'s modules without using them.\n');
  for (const failure of failures)
    console.error(`  • ${failure}`);
  console.error('');
  process.exit(1);
}

console.log('✓ tree-shaking verified: consumers ship only what they import, with dayjs set up.');
