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
  // zinc steps rather than translucent black and white, which in dark came out lighter than any surface
  base: 'animate-pulse bg-rui-neutral-200 dark:bg-rui-neutral-800',
  variants: {
    rounded: {
      none: 'rounded-none',
      sm: 'rounded-xs',
      md: 'rounded-rui-control',
      lg: 'rounded-rui-card',
      full: 'rounded-full',
    },
  },
});

// the bar is decoration only, so it is aria-hidden: an alert role made a screen reader announce every bar
const ui = computed<string>(() => skeleton({ rounded }));
</script>

<template>
  <div
    :class="ui"
    data-id="skeleton"
    aria-hidden="true"
  />
</template>
