import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import process from 'node:process';

const DIST = join(import.meta.dirname, '..', 'dist');

// Any of these markers in shipped code means a runtime dependency got bundled
// with pnpm peer-hash paths baked in, instead of being left as a bare specifier.
// That breaks consumers whose peer resolution produces a different hash (e.g.
// a different yaml version in the tailwindcss chain).
const FORBIDDEN: readonly string[] = [
  'node_modules/.pnpm/',
  '../node_modules/.pnpm/',
];

async function* walk(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory())
      yield* walk(full);
    else if (/\.(?:js|mjs|cjs|d\.ts)$/.test(entry.name))
      yield full;
  }
}

interface Offender { file: string; marker: string }

const offenders: Offender[] = [];
for await (const file of walk(DIST)) {
  const content = await readFile(file, 'utf8');
  for (const marker of FORBIDDEN) {
    if (content.includes(marker)) {
      offenders.push({ file: relative(DIST, file), marker });
      break;
    }
  }
}

if (offenders.length > 0) {
  console.error('\n❌ dist verification failed: pnpm-internal paths leaked into shipped code.\n');
  console.error('This means a runtime dependency was bundled instead of externalized.');
  console.error('Add it to `dependencies` (or `peerDependencies`) in package.json — the');
  console.error('rolldown `external` function picks those up automatically.\n');
  for (const { file, marker } of offenders)
    console.error(`  • dist/${file}  →  contains "${marker}"`);
  console.error('');
  process.exit(1);
}

console.log('✓ dist verified: no pnpm-internal paths leaked.');
