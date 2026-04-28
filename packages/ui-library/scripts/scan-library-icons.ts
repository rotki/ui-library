import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';
import consola from 'consola';
import fg from 'fast-glob';
import { extractIconsFromSource } from '../src/vite-plugin/scanner.js';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');

if (!existsSync(dist)) {
  consola.error(`dist/ not found at ${dist} — run the main build first`);
  process.exit(1);
}

const iconsSource = readFileSync(resolve(root, 'src/icons/index.ts'), 'utf-8');
// eslint-disable-next-line regexp/strict
const validIconsMatch = iconsSource.match(/export const RuiIcons = \[(.*?)] as const/s)
  // eslint-disable-next-line regexp/strict
  ?? iconsSource.match(/export const RuiIcons = \[(.*?)]/s);
if (!validIconsMatch?.[1]) {
  consola.error('could not parse RuiIcons from src/icons/index.ts');
  process.exit(1);
}
const validIcons = new Set<string>(
  validIconsMatch[1].match(/"([^"]+)"/g)?.map(s => s.slice(1, -1)) ?? [],
);

const files = fg.sync(['src/components/**/*.vue', 'src/components/**/*.ts'], {
  cwd: root,
  absolute: true,
  ignore: ['**/*.spec.ts', '**/*.stories.ts'],
});

const icons = new Set<string>();
for (const file of files) {
  const source = readFileSync(file, 'utf-8');
  for (const name of extractIconsFromSource(source)) {
    if (validIcons.has(name))
      icons.add(name);
  }
}

const sorted = [...icons].sort();
const out = resolve(dist, 'library-icons.json');
writeFileSync(out, `${JSON.stringify(sorted, null, 2)}\n`);

consola.success(`wrote dist/library-icons.json (${sorted.length} icons used by library components)`);
