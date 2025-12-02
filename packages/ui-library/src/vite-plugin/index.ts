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
 * Loads the valid RuiIcons array from the library
 */
function loadValidIcons(): Set<string> {
  // Import the RuiIcons array from the icons module
  // This will be resolved at build time
  try {
    // Try to load from the built dist first (for consumers)
    const distPath = resolve(__dirname, '../icons/index.js');
    if (existsSync(distPath)) {
      // Read and parse the file to extract the RuiIcons array
      const content = readFileSync(distPath, 'utf-8');
      // eslint-disable-next-line regexp/strict
      const match = content.match(/const RuiIcons = \[(.*?)];/s);
      if (match?.[1]) {
        const iconsStr = match[1];
        const icons = iconsStr.match(/"([^"]+)"/g)?.map(s => s.slice(1, -1)) || [];
        return new Set(icons);
      }
    }
  }
  catch {
    // Fallback: parse the icons source file directly
  }

  // Fallback: read and parse the source file
  const sourcePath = resolve(__dirname, '../icons/index.ts');
  if (existsSync(sourcePath)) {
    const content = readFileSync(sourcePath, 'utf-8');
    // eslint-disable-next-line regexp/strict
    const match = content.match(/export const RuiIcons = \[(.*?)] as const/s);
    if (match?.[1]) {
      const iconsStr = match[1];
      const icons = iconsStr.match(/"([^"]+)"/g)?.map(s => s.slice(1, -1)) || [];
      return new Set(icons);
    }
  }

  console.warn('[@rotki/ui-library] Could not load RuiIcons list, validation disabled');
  return new Set();
}

/**
 * Vite plugin for automatic icon detection and registration
 */
export function ruiIconsPlugin(options: RuiIconsPluginOptions = {}): Plugin {
  const {
    include = [],
    scanPatterns = DEFAULT_SCAN_PATTERNS,
    strict = false,
    debug = false,
  } = options;

  let validIcons: Set<string>;
  let scanResult: ScanResult;
  let server: ViteDevServer | null = null;
  let root: string;

  const log = (message: string): void => {
    if (debug) {
      // eslint-disable-next-line no-console
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
      icons: new Set(include),
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
          validateIcons(detectedIcons, validIcons, filePath, scanResult);
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
      const invalidList = [...scanResult.invalidIcons.entries()]
        .map(([icon, files]) => `  - "${icon}" in: ${files.join(', ')}`)
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
   * Handles file changes in dev mode
   */
  function handleFileChange(filePath: string): void {
    // Check if the changed file matches our scan patterns
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

      validateIcons(detectedIcons, validIcons, filePath, scanResult);

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
      log(`Loaded ${validIcons.size} valid icon names`);
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

// eslint-disable-next-line import/no-default-export
export default ruiIconsPlugin;
