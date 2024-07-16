import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import consola from 'consola';

const dist = path.resolve(import.meta.dirname, '..', 'dist');

if (fs.existsSync(dist))
  fs.rmSync(dist, { recursive: true });

consola.info('Building library');
execSync('pnpm run build');
consola.info('Building types');
execSync('pnpm run build:types');
consola.info('resolving aliases');
execSync('pnpm run resolve:alias');
consola.success('build done');
