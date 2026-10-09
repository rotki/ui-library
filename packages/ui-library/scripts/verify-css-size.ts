/**
 * Fails the build when the shipped stylesheet outgrows its budget. Every
 * consumer loads `style.css` whole, so a stray `@source`, a wide
 * `@source inline()` or a component that pulls in a utility family shows up
 * here first. The budget is on the gzipped size, which is what reaches the
 * browser; raise it on purpose, in the same change that needs the room.
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';
import { gzipSync } from 'node:zlib';

const BUDGET_GZIP_BYTES = 24 * 1024;

const file = join(import.meta.dirname, '..', 'dist', 'style.css');
const css = await readFile(file);
const gzipped = gzipSync(css, { level: 9 }).length;

const kb = (bytes: number): string => `${(bytes / 1024).toFixed(1)} kB`;

if (gzipped > BUDGET_GZIP_BYTES) {
  console.error(`\n❌ dist/style.css is ${kb(gzipped)} gzipped, over its ${kb(BUDGET_GZIP_BYTES)} budget (${kb(css.length)} raw).`);
  console.error('Check what new utilities it ships before raising BUDGET_GZIP_BYTES in scripts/verify-css-size.ts.\n');
  process.exit(1);
}

console.log(`✓ css size verified: dist/style.css is ${kb(gzipped)} gzipped of a ${kb(BUDGET_GZIP_BYTES)} budget (${kb(css.length)} raw).`);
