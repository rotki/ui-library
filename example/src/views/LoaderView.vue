<script lang="ts" setup>
import { RuiSkeletonLoader, type SkeletonLoaderProps } from '@rotki/ui-library';
import ComponentView from '@/components/ComponentView.vue';

type SkeletonData = SkeletonLoaderProps & {
  class?: string;
};

const loaders = ref<(SkeletonData)[]>([
  {},
  {
    type: 'paragraph',
  },
  {
    type: 'heading',
  },
  {
    type: 'article',
  },
  {
    type: 'button',
  },
  {
    type: 'icon',
  },
  {
    type: 'avatar',
  },
  {
    type: 'thumbnail',
  },
  {
    type: 'custom',
    class: 'w-20 h-20',
  },
  {
    type: 'custom',
    class: 'w-20 h-20',
    rounded: 'full',
  },
]);
</script>

<template>
  <ComponentView data-cy="skeleton-loader">
    <template #title>
      Skeleton Loader
    </template>

    <div class="grid gap-4 grid-cols-2 items-center justify-center">
      <div
        v-for="(item, i) in loaders"
        :key="i"
      >
        <p class="mb-2">
          {{ item.type ?? 'text' }}
        </p>
        <RuiSkeletonLoader v-bind="item" />
      </div>
    </div>
  </ComponentView>
</template>
