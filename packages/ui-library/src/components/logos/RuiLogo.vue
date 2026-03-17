<script setup lang="ts">
import { isClient } from '@vueuse/shared';
import { useSSRContext } from 'vue';
import fallback from '@/components/logos/logo.svg';
import { getLogoSources } from '@/components/logos/use-logo-sources';

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

const externalSource = computed<string | undefined>(() => {
  if (src)
    return src;

  const sources = get(externalSources);
  if (!logo || !sources[logo])
    return undefined;

  const url = `https://raw.githubusercontent.com/rotki/data/${branch}/assets/icons/${sources[logo]}`;

  if (uniqueKey !== undefined)
    return `${url}?key=${uniqueKey}`;

  return url;
});

const showCustom = computed<boolean>(() => !!src || (get(seasonalReady) && !get(error)));

async function fetchSources(): Promise<void> {
  if (!logo || src)
    return;

  const links = await getLogoSources(branch);

  if (links)
    set(externalSources, links);
}

function onImageLoaded(): void {
  const img = get(customImageRef);
  if (!img)
    return;

  img.decode()
    .then(() => set(seasonalReady, true))
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
    <!-- Fallback: always rendered, hidden when custom image is ready -->
    <img
      v-if="!showCustom"
      :src="fallback"
      :alt="appName"
      data-image="fallback"
      class="h-full"
      :style="{ width: `${size}rem` }"
    />

    <!-- Custom/seasonal image: rendered off-screen while loading, shown when decoded -->
    <img
      v-if="externalSource && !error"
      ref="customImageRef"
      :src="externalSource"
      :alt="appName"
      data-image="custom"
      class="h-full transition ease-out duration-200"
      :class="showCustom ? 'opacity-100' : 'absolute opacity-0 pointer-events-none'"
      :style="{ width: `${size}rem` }"
      @error="error = true"
      @load="onImageLoaded()"
    />

    <div
      v-if="text"
      class="text-h4 text-rui-primary dark:text-white"
    >
      {{ appName }}
    </div>
  </div>
</template>
