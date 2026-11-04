<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

export interface Props {
  vertical?: boolean;
}

defineOptions({
  name: 'RuiDivider',
  inheritAttrs: false,
});

const { vertical = false } = defineProps<Props & /* @vue-ignore */ Omit<HTMLAttributes, keyof Props>>();
</script>

<template>
  <div
    :class="vertical ? 'border-l' : 'border-t'"
    class="border-default"
    role="separator"
    :aria-orientation="vertical ? 'vertical' : 'horizontal'"
    v-bind="$attrs"
  />
</template>
