// Generates `src/icons/icons_*.ts` and `src/icons/index.ts` from two sources:
//
//   1. Lucide icons in `node_modules/lucide/dist/esm/icons/*.js`. Each module
//      already exports a `[ [tag, attrs], ... ]` array — exactly the shape
//      `RuiIcon` expects — so we pass it through verbatim, one component
//      entry per renderable primitive. Multi-path icons (e.g. eye-off) stay
//      multi-path; we do not collapse them into a single concatenated `d`.
//
//   2. Custom SVGs in `src/custom-icons/*.svg`. We parse the XML and emit
//      one `[tag, attrs]` tuple per renderable primitive (path, rect,
//      circle, ellipse, line, polyline, polygon), recursing into wrapper
//      elements like <g>.
//
// Output is chunked by `CHUNK_SIZE` so each generated file stays small
// enough for IDE indexing. The chunked files are gitignored and rebuilt
// by `pnpm run build` (or directly via `pnpm run generate-icons`).
import type { GeneratedIcon } from '../src/types/icons.js';
import { mkdirSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import consola from 'consola';
import fg from 'fast-glob';
import { XMLParser } from 'fast-xml-parser';
import { pascalCase } from 'scule';

const LUCIDE_PREFIX = 'lu-';
const TARGET = 'src/icons';
const CHUNK_SIZE = 500;

const SVG_PRIMITIVES = new Set([
  'path',
  'rect',
  'circle',
  'ellipse',
  'line',
  'polyline',
  'polygon',
]);

function resolveRoot(...dir: string[]): string {
  return path.resolve(import.meta.dirname, '..', ...dir);
}

function chunkArray<T>(a: T[], n: number): T[][] {
  return Array.from({ length: Math.ceil(a.length / n) }, (_, i) =>
    a.slice(n * i, n * i + n));
}

// Strip fast-xml-parser's `@_` prefix from attribute keys.
function stripAttrPrefix(item: unknown): Record<string, string> {
  const attrs: Record<string, string> = {};
  if (!item || typeof item !== 'object')
    return attrs;
  for (const [k, v] of Object.entries(item as Record<string, unknown>)) {
    if (k.startsWith('@_'))
      attrs[k.slice(2)] = String(v);
  }
  return attrs;
}

function extractComponentsFromXml(node: unknown): GeneratedIcon['components'] {
  const out: GeneratedIcon['components'] = [];

  function emit(tag: string, items: unknown[]): void {
    for (const item of items) {
      if (item && typeof item === 'object')
        out.push([tag, stripAttrPrefix(item)]);
    }
  }

  function visit(n: unknown): void {
    if (!n || typeof n !== 'object')
      return;
    for (const [key, value] of Object.entries(n as Record<string, unknown>)) {
      if (key.startsWith('@_'))
        continue;
      const items = Array.isArray(value) ? value : [value];
      if (SVG_PRIMITIVES.has(key)) {
        emit(key, items);
      }
      else {
        for (const item of items) visit(item);
      }
    }
  }

  visit(node);
  return out;
}

async function loadCustomIcon(file: string): Promise<GeneratedIcon | null> {
  const name = path.basename(file, '.svg');
  const svg = await readFile(file, 'utf8');
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(svg) as { svg: unknown };
  const components = extractComponentsFromXml(parsed.svg);
  if (components.length === 0) {
    consola.warn(`No primitives extracted from ${file}`);
    return null;
  }
  return { name, components };
}

async function loadLucideIcon(file: string): Promise<GeneratedIcon> {
  const name = LUCIDE_PREFIX + path.basename(file, '.js');
  const iconModule = await import(file) as { default: GeneratedIcon['components'] };
  return { name, components: iconModule.default };
}

async function loadAll(
  files: string[],
  load: (file: string) => Promise<GeneratedIcon | null>,
): Promise<GeneratedIcon[]> {
  const failures: string[] = [];
  const results = await Promise.all(files.map(async (file) => {
    try {
      return await load(file);
    }
    catch (error) {
      consola.error(`Failed to process ${file}`, error);
      failures.push(file);
      return null;
    }
  }));
  if (failures.length > 0) {
    const head = failures.slice(0, 3).join(', ');
    const tail = failures.length > 3 ? ` (+${failures.length - 3} more)` : '';
    throw new Error(`Failed to process ${failures.length} icon(s): ${head}${tail}`);
  }
  return results.filter((r: GeneratedIcon | null): r is GeneratedIcon => r !== null);
}

async function collectAllIcons(): Promise<GeneratedIcon[]> {
  const customDir = resolveRoot('src', 'custom-icons');
  const lucideDir = resolveRoot('node_modules', 'lucide', 'dist', 'esm', 'icons');
  const [customFiles, lucideFiles] = await Promise.all([
    fg('**/*.svg', { cwd: customDir, absolute: true }),
    fg('**/*.js', { cwd: lucideDir, absolute: true }),
  ]);
  const [customIcons, lucideIcons] = await Promise.all([
    loadAll(customFiles, loadCustomIcon),
    loadAll(lucideFiles, loadLucideIcon),
  ]);
  return [...customIcons, ...lucideIcons];
}

function renderChunk(chunk: GeneratedIcon[]): string {
  let body = `// Generated by scripts/generate-icons.ts — do not edit by hand.
// @ts-nocheck
/* eslint-disable */
/* prettier-ignore */
/* dprint-ignore-file */
// oxlint-disable
// biome-ignore-all lint: generated file
// biome-ignore-all format: generated file
import { type GeneratedIcon } from '@/types/icons';\n
`;
  for (const icon of chunk) {
    body += `export const ${pascalCase(icon.name)}: GeneratedIcon = {
  name: '${icon.name}',
  components: ${JSON.stringify(icon.components)},
};\n`;
  }
  return body;
}

function renderIndex(chunkCount: number, names: string[]): string {
  const exports = Array.from({ length: chunkCount }, (_, i) => `export * from './icons_${i + 1}';`).join('\n');
  const arr = names.map(n => `"${n}"`).join(',');
  return `${exports}
export const RuiIcons = [${arr}] as const;
export type RuiIcons = string;
export function isRuiIcon(x: any): x is RuiIcons {
  return RuiIcons.includes(x);
}
`;
}

async function writeMetadata(metadata: GeneratedIcon[]): Promise<void> {
  const chunks = chunkArray(metadata, CHUNK_SIZE);
  const targetDir = resolveRoot(TARGET);

  const chunkWrites = chunks.map((chunk, i) =>
    writeFile(path.join(targetDir, `icons_${i + 1}.ts`), renderChunk(chunk), 'utf8'),
  );
  const indexWrite = writeFile(
    path.join(targetDir, 'index.ts'),
    renderIndex(chunks.length, metadata.map(m => m.name)),
    'utf8',
  );

  await Promise.all([...chunkWrites, indexWrite]);
}

mkdirSync(resolveRoot(TARGET), { recursive: true });
const metadata = await collectAllIcons();
await writeMetadata(metadata);
