<script setup lang="ts">
import { isClient } from '@vueuse/shared';
import { useSSRContext } from 'vue';
import fallback from '@/components/logos/logo.svg';
import { transformCase } from '@/utils/helpers';

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
}

defineOptions({
  name: 'RuiLogo',
});

const { text = false, branch = 'develop', logo, size = 3, uniqueKey } = defineProps<Props>();

const customImageRef = useTemplateRef<HTMLImageElement>('customImageRef');
const error = ref<boolean>(false);
const decoding = ref<boolean>(!!logo);
const pendingSources = ref<boolean>(false);
const appName = 'rotki';
const emptyLinks: ExternalLinks = {
  app: undefined,
  website: undefined,
  about: undefined,
  emptyScreen: undefined,
};
const externalSources = ref<ExternalLinks>(emptyLinks);

const externalSource = computed<string | undefined>(() => {
  const sources = get(externalSources);
  if (!logo || !sources[logo]) {
    set(decoding, get(pendingSources));
    return undefined;
  }

  const url = `https://raw.githubusercontent.com/rotki/data/${branch}/assets/icons/${sources[logo]}`;

  if (uniqueKey !== undefined)
    return `${url}?key=${uniqueKey}`;

  return url;
});

async function fetchSources(): Promise<void> {
  if (!logo)
    return;

  set(pendingSources, true);
  try {
    const { data } = await useFetch<string>(
      `https://raw.githubusercontent.com/rotki/data/${branch}/constants/asset-mappings.json`,
    );

    const links = transformCase(JSON.parse(get(data) ?? 'null')?.logo, 'camelCase');

    if (links)
      set(externalSources, links);
  }
  catch {}
  set(pendingSources, false);
}

watch(
  () => get(customImageRef)?.complete,
  (complete) => {
    if (complete) {
      get(customImageRef)
        ?.decode()
        .catch(() => set(error, true))
        .finally(() => set(decoding, false));
    }
  },
);

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
      v-if="!externalSource && decoding"
      role="img"
      :aria-label="appName"
      class="h-full transition delay-0 opacity-0"
      :style="{ width: `${size}rem` }"
    />
    <img
      v-else-if="externalSource && (!error || decoding)"
      ref="customImageRef"
      :src="externalSource"
      :alt="appName"
      data-image="custom"
      class="h-full transition ease-out duration-200 delay-100"
      :style="{ width: `${size}rem` }"
      @error="error = true"
    />
    <img
      v-else
      :src="fallback"
      :alt="appName"
      data-image="fallback"
      class="h-full transition ease-out duration-200 delay-100"
      :style="{ width: `${size}rem` }"
    />
    <div
      v-if="text"
      class="text-h4 text-rui-primary dark:text-white"
    >
      {{ appName }}
    </div>
  </div>
</template>
