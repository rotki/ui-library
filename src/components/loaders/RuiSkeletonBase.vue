<script lang="ts" setup>
export interface Props {
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

defineOptions({
  name: 'RuiSkeletonLoaderBase',
});

withDefaults(defineProps<Props>(), {
  rounded: undefined,
});
</script>

<template>
  <div
    :class="[$style.skeleton, { [`rounded-${rounded}`]: !!rounded }]"
    role="alert"
  />
</template>

<style lang="scss" module>
.skeleton {
  @apply animate-pulse bg-black/[.12];
}

:global(.dark) {
  .skeleton {
    @apply bg-white/[.16];
  }
}
</style>
