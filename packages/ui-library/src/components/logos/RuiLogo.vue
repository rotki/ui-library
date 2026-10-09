<script setup lang="ts">
import fallback from '@/components/logos/logo.svg';
import { getVerifiedLogoUrl, removeVerifiedLogoUrl, setVerifiedLogoUrl } from '@/components/logos/verified-logo';
import { useLogoOptions } from '@/composables/defaults/logo';

export interface Props {
  text?: boolean;
  /**
   * Name handed to the `logo.resolve` option of `createRui`. Without a resolver
   * the bundled logo shows.
   */
  logo?: string;
  size?: string | number; // in rems
  /**
   * Appended to the resolved URL as `key`, so each instance loads its own copy.
   */
  uniqueKey?: string | number;
  src?: string;
}

defineOptions({
  name: 'RuiLogo',
});

const { text = false, logo, size = 3, uniqueKey, src } = defineProps<Props>();

const appName = 'rotki';

const resolvedUrl = ref<string>();
const error = ref<boolean>(false);
const seasonalReady = ref<boolean>(false);

const isMounted = ref<boolean>(false);

const customImageRef = useTemplateRef<HTMLImageElement>('customImageRef');

const logoOptions = useLogoOptions();

const externalSource = computed<string | undefined>(() => {
  if (src)
    return src;

  const url = get(resolvedUrl);
  if (!url || uniqueKey === undefined)
    return url;

  return `${url}${url.includes('?') ? '&' : '?'}key=${uniqueKey}`;
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

async function callResolver(name: string): Promise<string | undefined> {
  try {
    return await logoOptions?.resolve(name);
  }
  catch {
    // A failing resolver leaves the bundled logo in place
    return undefined;
  }
}

/**
 * Asks the app's resolver for the logo URL. It runs only after mount, so the
 * server and the client's first render both show the bundled fallback (or
 * `src`) and hydration matches.
 */
async function resolveLogo(): Promise<void> {
  if (!get(isMounted))
    return;

  if (src || !logo || !logoOptions) {
    set(resolvedUrl, undefined);
    return;
  }

  const name = logo;
  const url = await callResolver(name);

  // The logo prop changed while the resolver ran; that newer run wins
  if (name !== logo)
    return;

  set(error, false);
  // A URL that already decoded in this session is shown without waiting for it again
  set(seasonalReady, !!url && getVerifiedLogoUrl(name) === url);
  set(resolvedUrl, url);

  const source = get(externalSource);
  if (source)
    preloadImage(source);
}

function onImageError(): void {
  set(error, true);
  if (logo)
    removeVerifiedLogoUrl(logo);
}

function onImageLoaded(): void {
  const img = get(customImageRef);
  if (!img)
    return;

  img.decode()
    .then(() => {
      set(seasonalReady, true);
      // Remember the decoded URL so the next page load can trust it immediately
      const url = get(resolvedUrl);
      if (url && logo)
        setVerifiedLogoUrl(logo, url);
    })
    .catch(() => set(error, true));
}

watch(() => get(customImageRef)?.complete, (complete) => {
  if (complete)
    onImageLoaded();
});

watchEffect(resolveLogo);

onMounted(() => {
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
      class="text-h4 text-rui-primary dark:text-rui-text"
    >
      {{ appName }}
    </div>
  </div>
</template>
