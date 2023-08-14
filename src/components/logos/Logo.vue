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
</script>

<template>
  <div class="h-12 space-x-4 flex items-center">
    <img class="h-full" :src="customSrc ?? logo" alt="Rotki" />
    <div v-if="text" class="text-h4 text-rui-light-primary dark:text-white">
      rotki
    </div>
  </div>
</template>
