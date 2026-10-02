<script setup lang="ts">
import fallback from '@/components/logos/logo.svg';
import { getCachedLogoSources, getLogoSources, getVerifiedLogoUrl, removeVerifiedLogoUrl, setVerifiedLogoUrl } from '@/components/logos/use-logo-sources';

export interface ExternalLinks {
  drawer?: string;
  app?: string;
  website?: string;
  about?: string;
  emptyScreen?: string;
  [key: string]: string | undefined;
}

export interface Props {
  text?: boolean;
  branch?: 'develop' | 'main' | string;
  logo?: keyof ExternalLinks;
  size?: string | number; // in rems
  uniqueKey?: string | number;
  src?: string;
}

defineOptions({
  name: 'RuiLogo',
});

const { text = false, branch = 'develop', logo, size = 3, uniqueKey, src } = defineProps<Props>();

const appName = 'rotki';
const emptyLinks: () => ExternalLinks = () => ({
  app: undefined,
  website: undefined,
  about: undefined,
  emptyScreen: undefined,
});

const error = ref<boolean>(false);
const seasonalReady = ref<boolean>(false);
const externalSources = ref<ExternalLinks>(emptyLinks());

const isMounted = ref<boolean>(false);

const customImageRef = useTemplateRef<HTMLImageElement>('customImageRef');

function buildExternalUrl(sources: ExternalLinks): string | undefined {
  if (!logo || !sources[logo])
    return undefined;

  const url = `https://raw.githubusercontent.com/rotki/data/${branch}/assets/icons/${sources[logo]}`;

  if (uniqueKey !== undefined)
    return `${url}?key=${uniqueKey}`;

  return url;
}

const externalSource = computed<string | undefined>(() => {
  if (src)
    return src;

  return buildExternalUrl(get(externalSources));
});

const showCustom = computed<boolean>(() => !!src || (!!get(externalSource) && get(seasonalReady) && !get(error)));

function preloadImage(url: string): void {
  const existing = document.head.querySelectorAll<HTMLLinkElement>('link[rel="preload"][as="image"]');
  for (const link of existing) {
    if (link.href === url)
      return;
  }

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = url;
  document.head.appendChild(link);
}

/**
 * Restores the seasonal logo cached by an earlier page load. It runs after mount
 * because sessionStorage does not exist on the server: reading it during setup made
 * the client's first render differ from the server-rendered HTML.
 */
function restoreCachedSources(): void {
  if (!logo || src)
    return;

  const cached = getCachedLogoSources(branch);
  if (cached)
    set(externalSources, cached);

  const currentUrl = get(externalSource);
  if (!currentUrl)
    return;

  // A URL that already decoded on an earlier load is shown without waiting for it again
  if (getVerifiedLogoUrl(branch, String(logo)) === currentUrl)
    set(seasonalReady, true);

  preloadImage(currentUrl);
}

async function fetchSources(): Promise<void> {
  if (!logo || src || !get(isMounted))
    return;

  const links = await getLogoSources(branch);

  if (links)
    set(externalSources, links);
}

function onImageError(): void {
  set(error, true);
  if (logo)
    removeVerifiedLogoUrl(branch, String(logo));
}

function onImageLoaded(): void {
  const img = get(customImageRef);
  if (!img)
    return;

  img.decode()
    .then(() => {
      set(seasonalReady, true);
      // Cache the verified URL so subsequent page loads can trust it immediately
      const url = get(externalSource);
      if (url && logo)
        setVerifiedLogoUrl(branch, String(logo), url);
    })
    .catch(() => set(error, true));
}

watch(() => get(customImageRef)?.complete, (complete) => {
  if (complete)
    onImageLoaded();
});

watchEffect(fetchSources);

// Server and client render only the bundled fallback (or `src`), so hydration matches
onMounted(() => {
  restoreCachedSources();
  set(isMounted, true);
});
</script>

<template>
  <div
    class="gap-x-4 flex items-center relative"
    :style="{ height: `${size}rem` }"
  >
    <div
      class="relative"
      :style="{ width: `${size}rem`, height: `${size}rem` }"
    >
      <!-- Fallback: always in DOM, fades out when custom image is ready -->
      <img
        :src="fallback"
        :alt="appName"
        data-image="fallback"
        class="absolute inset-0 h-full w-full transition ease-out duration-200"
        :class="showCustom ? 'opacity-0' : 'opacity-100'"
      />

      <!-- Custom/seasonal image: fades in when decoded -->
      <img
        v-if="externalSource && !error"
        ref="customImageRef"
        :src="externalSource"
        :alt="appName"
        data-image="custom"
        class="absolute inset-0 h-full w-full transition ease-out duration-200"
        :class="showCustom ? 'opacity-100' : 'opacity-0 pointer-events-none'"
        @error="onImageError()"
        @load="onImageLoaded()"
      />
    </div>

    <div
      v-if="text"
      class="text-h4 text-rui-primary dark:text-white"
    >
      {{ appName }}
    </div>
  </div>
</template>
