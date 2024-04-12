<script setup lang="ts">
import logo from './logo.svg';

export interface Props {
  text?: boolean;
  customSrc?: string;
}

defineOptions({
  name: 'RuiLogo',
});

withDefaults(defineProps<Props>(), {
  text: false,
  customSrc: undefined,
});

const customImageRef = ref<HTMLImageElement>();
const error = ref(false);
const decoding = ref(false);
const appName = 'rotki';

watch(customImageRef, (image) => {
  if (image?.complete && !get(decoding)) {
    set(decoding, true);
    image.decode().catch(() => set(error, true));
  }
});
</script>

<template>
  <div class="h-12 space-x-4 flex items-center">
    <img
      v-if="customSrc && !error"
      ref="customImageRef"
      class="h-full"
      :src="customSrc"
      :alt="appName"
      data-image="custom"
      @error="error = true"
    />
    <img
      v-else
      :src="logo"
      :alt="appName"
      data-image="fallback"
      class="h-full"
    />
    <div
      v-if="text"
      class="text-h4 text-rui-primary dark:text-white"
    >
      {{ appName }}
    </div>
  </div>
</template>
