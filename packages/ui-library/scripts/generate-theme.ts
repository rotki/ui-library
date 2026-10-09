/**
 * Writes `src/theme/theme.css` from `buildThemeCss()`. The file is committed,
 * so the library's own build and Storybook read it without a generate step;
 * `theme-css.spec.ts` fails when it falls behind the generator.
 */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import consola from 'consola';
import { buildThemeCss } from '../src/theme/theme-css.js';

const target = path.resolve(import.meta.dirname, '..', 'src', 'theme', 'theme.css');

await writeFile(target, buildThemeCss());
consola.success(`wrote ${path.relative(process.cwd(), target)}`);
