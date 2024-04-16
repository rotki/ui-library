<script setup lang="ts">
import { useSSRContext } from 'vue';
import { isClient } from '@vueuse/shared';
import { transformCase } from '@/utils/helpers';
import fallback from './logo.svg';

interface ExternalLinks {
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

const props = withDefaults(defineProps<Props>(), {
  text: false,
  branch: 'develop',
  logo: undefined,
  size: 3,
  uniqueKey: undefined,
});

const customImageRef = ref<HTMLImageElement>();
const error = ref(false);
const decoding = ref(!!props.logo);
const pendingSources = ref(false);
const appName = 'rotki';
const emptyLinks: ExternalLinks = {
  app: undefined,
  website: undefined,
  about: undefined,
  emptyScreen: undefined,
};
const externalSources = ref(emptyLinks);

const externalSource = computed(() => {
  const sources = get(externalSources);
  const { logo } = props;
  if (!logo || !sources[logo]) {
    set(decoding, get(pendingSources));
    return undefined;
  }

  const url = `https://raw.githubusercontent.com/rotki/data/${props.branch}/assets/icons/${sources[logo]}`;

  if (props.uniqueKey !== undefined)
    return `${url}?key=${props.uniqueKey}`;

  return url;
});

async function fetchSources() {
  if (!props.logo)
    return set(externalSources, emptyLinks);

  set(pendingSources, true);
  try {
    const { data } = await useFetch<string>(
      `https://raw.githubusercontent.com/rotki/data/${props.branch}/constants/asset-mappings.json`,
    );

    set(externalSources, transformCase(JSON.parse(get(data) ?? 'null')?.logo, 'camelCase') ?? emptyLinks);
  }
  catch {
    set(externalSources, emptyLinks);
  }
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
