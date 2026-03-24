<script lang="ts" setup>
import { tv } from '@/utils/tv';

export interface Props {
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

defineOptions({
  name: 'RuiSkeletonLoaderBase',
});

const { rounded } = defineProps<Props>();

const skeleton = tv({
  base: 'animate-pulse bg-black/[.12] dark:bg-white/[.16]',
  variants: {
    rounded: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    },
  },
});

const ui = computed<string>(() => skeleton({ rounded }));
</script>

<template>
  <div
    :class="ui"
    role="alert"
  />
</template>
