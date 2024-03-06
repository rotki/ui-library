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

const pending = ref(true);
const error = ref(false);
</script>

<template>
  <div class="h-12 space-x-4 flex items-center">
    <img
      v-if="customSrc && !error"
      class="h-full"
      :class="{ hidden: pending }"
      :src="customSrc"
      @loadstart="pending = true"
      @load="pending = false"
      @error="
        error = true;
        pending = false;
      "
    />
    <img
      v-if="!customSrc || pending || error"
      :src="logo"
      alt="Rotki"
      class="h-full"
    />
    <div
      v-if="text"
      class="text-h4 text-rui-primary dark:text-white"
    >
      rotki
    </div>
  </div>
</template>
