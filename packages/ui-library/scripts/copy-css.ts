/**
 * Copies the source stylesheets into dist next to the built components. `tailwind.css` keeps its
 * relative imports (`./theme/theme.css`, `./styles/colors.css`) and its `@source './**\/*.js'`, so it
 * resolves the same files from dist as from src. `theme.css` also stays at the dist root for the
 * `@rotki/ui-library/theme.css` export.
 */
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const root = join(import.meta.dirname, '..');

const copies: [from: string, to: string][] = [
  ['src/tailwind.css', 'dist/tailwind.css'],
  ['src/theme/theme.css', 'dist/theme/theme.css'],
  ['src/theme/theme.css', 'dist/theme.css'],
  ['src/styles/colors.css', 'dist/styles/colors.css'],
  ['src/styles/tokens.css', 'dist/styles/tokens.css'],
];

for (const [from, to] of copies) {
  const target = join(root, to);
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(join(root, from), target);
}

console.log(`✓ copied ${copies.length} stylesheets into dist`);
