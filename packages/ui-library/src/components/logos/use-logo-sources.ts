import type { ExternalLinks } from '@/components/logos/RuiLogo.vue';
import { transformCase } from '@/utils/helpers';

const ASSET_MAPPINGS_URL = 'https://raw.githubusercontent.com/rotki/data';

// Module-level cache: deduplicates asset-mappings fetches across all RuiLogo instances.
// Keyed by branch so different branches don't share stale data.
const sourcesCache = new Map<string, Promise<ExternalLinks | undefined>>();

function isExternalLinks(value: unknown): value is ExternalLinks {
  if (typeof value !== 'object' || value === null)
    return false;

  return Object.values(value).every(v => v === undefined || typeof v === 'string');
}

async function fetchSourcesFromNetwork(branch: string): Promise<ExternalLinks | undefined> {
  try {
    const { data } = await useFetch<string>(
      `${ASSET_MAPPINGS_URL}/${branch}/constants/asset-mappings.json`,
    );

    const links = transformCase(JSON.parse(get(data) ?? 'null')?.logo, 'camelCase');
    if (isExternalLinks(links))
      return links;

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
 * Clears the module-level cache. Exposed for testing only.
 */
export function clearLogoSourcesCache(): void {
  sourcesCache.clear();
}
