<script lang="ts" setup>
import { skeletonBaseStyles } from './skeleton-base-styles';

export interface Props {
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

defineOptions({
  name: 'RuiSkeletonLoaderBase',
});

const { rounded } = defineProps<Props>();

// the bar is decoration only, so it is aria-hidden: an alert role made a screen reader announce every bar
const ui = computed<string>(() => skeletonBaseStyles({ rounded }));
</script>

<template>
  <div
    :class="ui"
    data-id="skeleton"
    aria-hidden="true"
  />
</template>
