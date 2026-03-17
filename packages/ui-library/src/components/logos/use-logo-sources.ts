import type { ExternalLinks } from '@/components/logos/RuiLogo.vue';
import { transformCase } from '@/utils/helpers';

const ASSET_MAPPINGS_URL = 'https://raw.githubusercontent.com/rotki/data';
const SESSION_SOURCES_PREFIX = 'rui-logo-sources';
const SESSION_VERIFIED_PREFIX = 'rui-logo-verified';

// Module-level cache: deduplicates asset-mappings fetches across all RuiLogo instances.
// Keyed by branch so different branches don't share stale data.
const sourcesCache = new Map<string, Promise<ExternalLinks | undefined>>();

function isExternalLinks(value: unknown): value is ExternalLinks {
  if (typeof value !== 'object' || value === null)
    return false;

  return Object.values(value).every(v => v === undefined || typeof v === 'string');
}

function writeSessionStorage(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  }
  catch {
    // sessionStorage may be full or unavailable
  }
}

function readSessionStorage(key: string): string | undefined {
  try {
    return sessionStorage.getItem(key) ?? undefined;
  }
  catch {
    return undefined;
  }
}

function clearSessionStorage(prefix: string): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key?.startsWith(prefix))
        keysToRemove.push(key);
    }
    keysToRemove.forEach(key => sessionStorage.removeItem(key));
  }
  catch {
    // sessionStorage may be unavailable
  }
}

/**
 * Returns cached logo sources synchronously from sessionStorage.
 * Returns undefined if nothing is cached or sessionStorage is unavailable.
 */
export function getCachedLogoSources(branch: string): ExternalLinks | undefined {
  const raw = readSessionStorage(`${SESSION_SOURCES_PREFIX}:${branch}`);
  if (!raw)
    return undefined;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (isExternalLinks(parsed))
      return parsed;
  }
  catch {
    // Invalid JSON, ignore
  }
  return undefined;
}

/**
 * Returns a previously verified (successfully decoded) seasonal logo URL
 * for the given branch and logo type from sessionStorage.
 */
export function getVerifiedLogoUrl(branch: string, logo: string): string | undefined {
  return readSessionStorage(`${SESSION_VERIFIED_PREFIX}:${branch}:${logo}`);
}

/**
 * Stores a verified seasonal logo URL in sessionStorage after successful decode.
 */
export function setVerifiedLogoUrl(branch: string, logo: string, url: string): void {
  writeSessionStorage(`${SESSION_VERIFIED_PREFIX}:${branch}:${logo}`, url);
}

/**
 * Removes a previously verified seasonal logo URL from sessionStorage.
 * Called when an image fails to load so stale entries aren't trusted on next load.
 */
export function removeVerifiedLogoUrl(branch: string, logo: string): void {
  try {
    sessionStorage.removeItem(`${SESSION_VERIFIED_PREFIX}:${branch}:${logo}`);
  }
  catch {
    // sessionStorage may be unavailable
  }
}

async function fetchSourcesFromNetwork(branch: string): Promise<ExternalLinks | undefined> {
  try {
    const response = await fetch(
      `${ASSET_MAPPINGS_URL}/${branch}/constants/asset-mappings.json`,
    );

    if (!response.ok)
      return undefined;

    const json = await response.json();
    const links = transformCase(json?.logo, 'camelCase');
    if (isExternalLinks(links)) {
      writeSessionStorage(`${SESSION_SOURCES_PREFIX}:${branch}`, JSON.stringify(links));
      return links;
    }

    return undefined;
  }
  catch {
    return undefined;
  }
}

/**
 * Fetches external logo sources for a given branch, deduplicating concurrent requests.
 * Uses a module-level cache so all RuiLogo instances share a single fetch per branch.
 */
export function getLogoSources(branch: string): Promise<ExternalLinks | undefined> {
  const cached = sourcesCache.get(branch);
  if (cached)
    return cached;

  const promise = fetchSourcesFromNetwork(branch);
  sourcesCache.set(branch, promise);
  return promise;
}

/**
 * Clears the module-level cache and sessionStorage entries. Exposed for testing only.
 */
export function clearLogoSourcesCache(): void {
  sourcesCache.clear();
  clearSessionStorage(SESSION_SOURCES_PREFIX);
  clearSessionStorage(SESSION_VERIFIED_PREFIX);
}
