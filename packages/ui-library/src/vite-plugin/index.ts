import type { Plugin, ViteDevServer } from 'vite';
import type { RuiIconsPluginOptions, ScanResult } from './types';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  extractIconsFromSource,
  generateVirtualModule,
  validateIcons,
} from './scanner';

const VIRTUAL_MODULE_ID = 'virtual:rotki-icons';
const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`;

const DEFAULT_SCAN_PATTERNS = ['**/*.vue', '**/*.ts', '**/*.tsx'];
const EXCLUDED_PATTERNS = ['**/node_modules/**', '**/dist/**', '**/.git/**'];

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Pulls the quoted icon names out of a `RuiIcons = [...]` array literal.
 *
 * @param path - file that may hold the array
 * @param pattern - matches the array literal in that file, capturing its body
 * @returns the names, or undefined when the file is absent or holds no array
 */
function readIconNames(path: string, pattern: RegExp): Set<string> | undefined {
  if (!existsSync(path))
    return undefined;

  const body = readFileSync(path, 'utf-8').match(pattern)?.[1];
  if (!body)
    return undefined;

  return new Set(body.match(/"([^"]+)"/g)?.map(name => name.slice(1, -1)) ?? []);
}

/**
 * Loads the valid RuiIcons array from the library, preferring the built dist
 * that consumers install and falling back to the source the repo generates.
 */
function loadValidIcons(): Set<string> {
  try {
    // eslint-disable-next-line regexp/strict -- the unescaped `]` closes the built array literal and reads better than `\]`
    const built = readIconNames(resolve(__dirname, '../icons/index.js'), /(?:const|var|let) RuiIcons = \[(.*?)];?/s);
    if (built)
      return built;
  }
  catch {
    // A dist that cannot be read falls through to the source below
  }

  // eslint-disable-next-line regexp/strict -- the unescaped `]` closes the generated array literal and reads better than `\]`
  const source = readIconNames(resolve(__dirname, '../icons/index.ts'), /export const RuiIcons = \[(.*?)] as const/s);
  if (source)
    return source;

  console.warn('[@rotki/ui-library] Could not load RuiIcons list, validation disabled');
  return new Set();
}

/**
 * Loads the baseline icons used by library components, emitted at library
 * build time. Consumers always need these regardless of their own source.
 */
function loadLibraryBaselineIcons(): string[] {
  const distPath = resolve(__dirname, '../library-icons.json');
  if (existsSync(distPath)) {
    try {
      const parsed: unknown = JSON.parse(readFileSync(distPath, 'utf-8'));
      if (Array.isArray(parsed))
        return parsed.filter((v): v is string => typeof v === 'string');
    }
    catch {
      // fall through
    }
  }
  return [];
}

/**
 * Vite plugin for automatic icon detection and registration
 */
export function ruiIconsPlugin(options: RuiIconsPluginOptions = {}): Plugin {
  const {
    include = [],
    customIcons = [],
    scanPatterns = DEFAULT_SCAN_PATTERNS,
    strict = false,
    debug = false,
  } = options;

  const customIconSet = new Set(customIcons);

  let validIcons: Set<string>;
  let libraryBaseline: string[];
  let scanResult: ScanResult;
  let server: ViteDevServer | null = null;
  let root: string;

  const log = (message: string): void => {
    if (debug) {
      // eslint-disable-next-line no-console -- the plugin's debug output belongs on the build console
      console.log(`[@rotki/ui-library/icons] ${message}`);
    }
  };

  const warn = (message: string): void => {
    console.warn(`[@rotki/ui-library/icons] ${message}`);
  };

  /**
   * Scans all matching files for icon usage
   */
  async function scanFiles(): Promise<void> {
    const fg = await import('fast-glob');
    const glob = fg.default || fg;

    scanResult = {
      icons: new Set([...libraryBaseline, ...include]),
      invalidIcons: new Map(),
    };

    const files = glob.sync(scanPatterns, {
      cwd: root,
      ignore: EXCLUDED_PATTERNS,
      absolute: true,
    });

    log(`Scanning ${files.length} files for icon usage...`);

    for (const filePath of files) {
      try {
        const content = readFileSync(filePath, 'utf-8');
        const detectedIcons = extractIconsFromSource(content);

        if (detectedIcons.size > 0) {
          log(`Found ${detectedIcons.size} potential icons in ${filePath}`);
          validateIcons(detectedIcons, validIcons, filePath, scanResult, customIconSet);
        }
      }
      catch {
        warn(`Failed to read file: ${filePath}`);
      }
    }

    // Add manually included icons
    for (const icon of include) {
      if (validIcons.has(icon)) {
        scanResult.icons.add(icon);
      }
      else {
        warn(`Included icon "${icon}" is not a valid RuiIcon`);
      }
    }

    log(`Detected ${scanResult.icons.size} valid icons`);

    // Report invalid icons
    if (scanResult.invalidIcons.size > 0) {
      const invalidList = Array.from(scanResult.invalidIcons.entries(), ([icon, files]) => `  - "${icon}" in: ${files.join(', ')}`)
        .join('\n');

      const message = `Found ${scanResult.invalidIcons.size} invalid icon name(s):\n${invalidList}`;

      if (strict) {
        throw new Error(message);
      }
      else {
        warn(message);
      }
    }
  }

  /**
   * Handles a file change in dev mode, ignoring files the scan patterns do not
   * cover.
   *
   * @param filePath - the file that changed
   */
  function handleFileChange(filePath: string): void {
    const isRelevantFile = scanPatterns.some((pattern) => {
      const ext = filePath.split('.').pop();
      return pattern.includes(`*.${ext}`);
    });

    if (!isRelevantFile)
      return;

    try {
      const content = readFileSync(filePath, 'utf-8');
      const detectedIcons = extractIconsFromSource(content);
      const previousSize = scanResult.icons.size;

      validateIcons(detectedIcons, validIcons, filePath, scanResult, customIconSet);

      // If new icons were detected, invalidate the virtual module
      if (scanResult.icons.size > previousSize) {
        log(`New icons detected in ${filePath}, invalidating virtual module...`);

        // Invalidate the virtual module to trigger re-import
        const mod = server?.moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID);
        if (mod) {
          server?.moduleGraph.invalidateModule(mod);
          // Trigger HMR update
          server?.ws.send({
            type: 'full-reload',
            path: '*',
          });
        }
      }
    }
    catch {
      // Ignore read errors
    }
  }

  return {
    name: 'rotki-ui-library-icons',
    enforce: 'pre',

    configResolved(config) {
      root = config.root;
      validIcons = loadValidIcons();
      libraryBaseline = loadLibraryBaselineIcons();
      log(`Loaded ${validIcons.size} valid icon names`);
      log(`Loaded ${libraryBaseline.length} baseline icons used by library components`);
    },

    configureServer(_server) {
      server = _server;

      // Watch for file changes
      server.watcher.on('change', handleFileChange);
      server.watcher.on('add', handleFileChange);
    },

    async buildStart() {
      await scanFiles();
    },

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID;
      }
    },

    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        const moduleContent = generateVirtualModule(scanResult.icons);
        log(`Generated virtual module with ${scanResult.icons.size} icons`);
        return moduleContent;
      }
    },
  };
}

export type { RuiIconsPluginOptions } from './types';

// eslint-disable-next-line import/no-default-export -- vite plugins are consumed as default imports
export default ruiIconsPlugin;
