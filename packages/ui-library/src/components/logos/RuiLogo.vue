<script setup lang="ts">
import { isClient } from '@vueuse/shared';
import { useSSRContext } from 'vue';
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

const customImageRef = useTemplateRef<HTMLImageElement>('customImageRef');

// Synchronously hydrate from sessionStorage so the URL is available immediately on refresh
if (isClient && logo && !src) {
  const cached = getCachedLogoSources(branch);
  if (cached)
    set(externalSources, cached);
}

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

// If we have a previously verified URL that matches the current source, trust it immediately
if (isClient && logo && !src) {
  const verifiedUrl = getVerifiedLogoUrl(branch, String(logo));
  const currentUrl = get(externalSource);
  if (verifiedUrl && currentUrl && verifiedUrl === currentUrl)
    set(seasonalReady, true);
}

function preloadImage(url: string): void {
  if (!isClient)
    return;

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

// Inject a preload hint for the seasonal image so the browser starts fetching early
if (isClient && logo && !src) {
  const url = get(externalSource);
  if (url)
    preloadImage(url);
}

async function fetchSources(): Promise<void> {
  if (!logo || src)
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

if (!isClient)
  useSSRContext();

onServerPrefetch(async () => {
  await fetchSources();
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
