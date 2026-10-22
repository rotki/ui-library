/**
 * Generates `src/icons/icons_*.ts` and `src/icons/index.ts` from two sources:
 *
 * 1. Lucide icons in `node_modules/lucide/dist/esm/icons/*.mjs`. Each module
 *    already exports a `[ [tag, attrs], ... ]` array, exactly the shape
 *    `RuiIcon` expects, so it passes through verbatim, one component entry per
 *    renderable primitive. A multi-path icon such as eye-off stays
 *    multi-path rather than collapsing into one concatenated `d`.
 *
 * 2. Custom SVGs in `src/custom-icons/*.svg`, parsed into one `[tag, attrs]`
 *    tuple per renderable primitive (path, rect, circle, ellipse, line,
 *    polyline, polygon), recursing into wrapper elements like `g`.
 *
 * Output is chunked by `CHUNK_SIZE` so each generated file stays small enough
 * for IDE indexing. The chunked files are gitignored and rebuilt by
 * `pnpm run build`, or directly by `pnpm run generate-icons`.
 *
 * Every name a release shipped is recorded in `PUBLISHED_FILE`, and the run
 * fails when one of them would no longer be generated, so a lucide bump
 * cannot drop a name consumers use. `--update` records new names.
 */
import type { GeneratedIcon } from '../src/types/icons.js';
import { mkdirSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import consola from 'consola';
import fg from 'fast-glob';
import { XMLParser } from 'fast-xml-parser';
import { kebabCase, pascalCase } from 'scule';

const LUCIDE_PREFIX = 'lu-';
const LUCIDE_EXT = '.mjs';
const TARGET = 'src/icons';
const CHUNK_SIZE = 500;
const PUBLISHED_FILE = 'scripts/published-icons.json';
/**
 * The module lucide ships every documented alias in: each line re-exports one
 * canonical icon's default under one or more names. Mining it lets consumers
 * use any official lucide name, and keeps pre-v1 names such as `waves`
 * working.
 */
const LUCIDE_ALIASES_FILE = 'iconsAndAliases.mjs';

/**
 * Names lucide once shipped as icons of their own and later kept only as an
 * alias export. The alias file gives PascalCase names alone (`Trash2`), and
 * `kebabCase` glues a trailing number (`trash2`), so without this list these
 * names would come out spelled differently from the release that had them.
 * When lucide turns another icon into an alias, its old name goes here.
 */
const LEGACY_ALIAS_NAMES = [
  'lu-building-2', // now an alias of building-complex
  'lu-flip-horizontal-2', // now an alias of triangles-centerline-dashed-horizontal
  'lu-flip-vertical-2', // now an alias of triangles-centerline-dashed-vertical
  'lu-trash-2', // now an alias of trash
];

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

/**
 * Strips fast-xml-parser's `@_` prefix from attribute keys.
 *
 * @param item - a parsed XML node
 * @returns its attributes under their plain names
 */
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

/**
 * Attributes `RuiIcon` sets on the svg for every icon. A copy baked into a
 * primitive would beat what it inherits: a path's `stroke-width="2"` ignores
 * `--rui-icon-stroke` and draws heavier than the lucide icons beside it.
 */
const RENDERER_ATTRS = new Set([
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin',
]);

/** The paint `RuiIcon` puts on the svg, which every primitive inherits. */
const DEFAULT_PAINT: Record<string, string> = { fill: 'none', stroke: 'currentColor' };

/**
 * Drops the attributes `RuiIcon` owns and turns every paint colour into
 * `currentColor`, so a design tool's `black` follows the icon colour. `none`
 * survives: it is how a solid mark drops the default outline.
 *
 * @param attrs - a primitive's attributes as drawn
 * @returns the attributes the icon ships with
 */
function normalizeCustomAttrs(attrs: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(attrs)) {
    if (RENDERER_ATTRS.has(k))
      continue;
    out[k] = (k === 'fill' || k === 'stroke') && v !== 'none' ? 'currentColor' : v;
  }
  return out;
}

/**
 * Rejects an element's attributes when the generator would lose them.
 *
 * @param tag - the element's name
 * @param attrs - its attributes
 */
function assertKeptAttrs(tag: string, attrs: Record<string, string>): void {
  if (attrs.transform)
    throw new Error(`<${tag} transform> is not supported; bake the transform into the coordinates`);
  if (tag === 'g' && Object.keys(attrs).length > 0)
    throw new Error(`attributes on <g> are dropped; move them to its primitives`);
}

/**
 * Rejects what the generator would otherwise drop without a word: only
 * primitives are kept, so a transform, or anything set on the svg or a
 * group, would be lost and the icon would render differently from its file.
 *
 * @param root - the parsed `<svg>` element
 */
function assertSupportedSvg(root: unknown): void {
  const rootAttrs = stripAttrPrefix(root);
  if (rootAttrs.viewBox !== '0 0 24 24')
    throw new Error(`viewBox must be "0 0 24 24", found "${rootAttrs.viewBox ?? 'none'}"`);
  for (const [k, v] of Object.entries(DEFAULT_PAINT)) {
    const own = rootAttrs[k];
    if (own !== undefined && own !== v)
      throw new Error(`<svg ${k}="${own}"> is dropped; set ${k} on the primitives instead`);
  }

  function visit(n: unknown, tag: string): void {
    if (!n || typeof n !== 'object')
      return;
    assertKeptAttrs(tag, stripAttrPrefix(n));
    for (const [key, value] of Object.entries(n as Record<string, unknown>)) {
      if (key.startsWith('@_') || key === '#text')
        continue;
      if (key !== 'g' && !SVG_PRIMITIVES.has(key))
        throw new Error(`<${key}> is not supported`);
      for (const item of Array.isArray(value) ? value : [value]) visit(item, key);
    }
  }

  visit(root, 'svg');
}

function extractComponentsFromXml(node: unknown): GeneratedIcon['components'] {
  const out: GeneratedIcon['components'] = [];

  function emit(tag: string, items: unknown[]): void {
    for (const item of items) {
      if (item && typeof item === 'object')
        out.push([tag, normalizeCustomAttrs(stripAttrPrefix(item))]);
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
  assertSupportedSvg(parsed.svg);
  const components = extractComponentsFromXml(parsed.svg);
  if (components.length === 0) {
    consola.warn(`No primitives extracted from ${file}`);
    return null;
  }
  return { name, components };
}

async function loadLucideIcon(file: string): Promise<GeneratedIcon> {
  const name = LUCIDE_PREFIX + path.basename(file, LUCIDE_EXT);
  const iconModule = await import(file) as { default: GeneratedIcon['components'] };
  return { name, components: iconModule.default };
}

/**
 * Emits every official lucide alias as its own icon pointing at the canonical
 * art, so consumers can use any documented lucide name, pre-v1 names that
 * became aliases included, such as `waves` for `waves-horizontal`. A name
 * already taken by a canonical icon or a custom SVG wins, and its alias is
 * skipped.
 *
 * @param byName - the canonical icons, keyed by name
 * @param existing - names already taken by a canonical icon or custom SVG
 * @returns one icon per alias that earned a name of its own
 */
async function buildAliases(
  byName: Map<string, GeneratedIcon['components']>,
  existing: Set<string>,
): Promise<GeneratedIcon[]> {
  const file = resolveRoot('node_modules', 'lucide', 'dist', 'esm', LUCIDE_ALIASES_FILE);
  const source = await readFile(file, 'utf8');
  const out: GeneratedIcon[] = [];
  const added = new Set<string>();
  // Exports are keyed by `pascalCase(name)`, so `arrow-down-0-1` and `arrow-down-01` would clash as `LuArrowDown01`
  const takenIds = new Set(Array.from(existing, name => pascalCase(name)));
  const legacyByExportId = new Map(LEGACY_ALIAS_NAMES.map(name => [pascalCase(name), name]));
  const lineRe = /export\s*\{([^}]*)\}\s*from\s*'\.\/icons\/([^']+)\.mjs'/g;
  for (const line of source.matchAll(lineRe)) {
    const canonicalName = LUCIDE_PREFIX + line[2];
    const components = byName.get(canonicalName);
    if (!components)
      continue;
    for (const name of line[1].matchAll(/default as (\w+)/g)) {
      const defaultName = LUCIDE_PREFIX + kebabCase(name[1]);
      const exportId = pascalCase(defaultName);
      const aliasName = legacyByExportId.get(exportId) ?? defaultName;
      if (aliasName === canonicalName || existing.has(aliasName) || added.has(aliasName) || takenIds.has(exportId))
        continue;
      added.add(aliasName);
      takenIds.add(exportId);
      out.push({ name: aliasName, components });
    }
  }
  return out;
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
    fg(`**/*${LUCIDE_EXT}`, { cwd: lucideDir, absolute: true }),
  ]);
  const [customIcons, lucideIcons] = await Promise.all([
    loadAll(customFiles, loadCustomIcon),
    loadAll(lucideFiles, loadLucideIcon),
  ]);
  const existing = new Set([...customIcons, ...lucideIcons].map(icon => icon.name));
  const byName = new Map(lucideIcons.map(icon => [icon.name, icon.components]));
  const aliasIcons = await buildAliases(byName, existing);
  return [...customIcons, ...lucideIcons, ...aliasIcons];
}

function renderChunk(chunk: GeneratedIcon[]): string {
  let body = `// Generated by scripts/generate-icons.ts. Do not edit by hand.
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

/**
 * Fails when a name a release shipped is no longer generated. A name lucide
 * turned into a numbered alias goes in `LEGACY_ALIAS_NAMES`; a name dropped
 * on purpose, in a breaking release, is removed from `PUBLISHED_FILE` by hand.
 * With `update`, names generated for the first time are recorded.
 *
 * @param names - every generated icon name
 * @param update - whether to record new names
 */
async function checkPublishedNames(names: string[], update: boolean): Promise<void> {
  const file = resolveRoot(PUBLISHED_FILE);
  const published: string[] = JSON.parse(await readFile(file, 'utf8'));
  const generated = new Set(names);
  const missing = published.filter(name => !generated.has(name));
  if (missing.length > 0) {
    throw new Error(`${missing.length} published icon name(s) are no longer generated: ${missing.join(', ')}. `
      + `Map a lucide alias in LEGACY_ALIAS_NAMES, or drop the name from ${PUBLISHED_FILE} in a breaking release.`);
  }

  const known = new Set(published);
  const added = names.filter(name => !known.has(name));
  if (added.length === 0)
    return;
  if (!update) {
    consola.info(`${added.length} new icon name(s); run \`pnpm run generate-icons --update\` to record them`);
    return;
  }
  const all = [...published, ...added].sort();
  await writeFile(file, `${JSON.stringify(all, null, 2)}\n`, 'utf8');
  consola.success(`Recorded ${added.length} new icon name(s) in ${PUBLISHED_FILE}`);
}

mkdirSync(resolveRoot(TARGET), { recursive: true });
const metadata = await collectAllIcons();
await checkPublishedNames(metadata.map(icon => icon.name), process.argv.includes('--update'));
await writeMetadata(metadata);
