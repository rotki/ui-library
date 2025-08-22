<script lang="ts" setup>
import { type ProgressProps, RuiProgress } from '@rotki/ui-library';
import ComponentView from '@/components/ComponentView.vue';

const progress = ref<ProgressProps[]>([
  {
    value: 40,
    color: 'primary',
  },
  {
    value: 40,
    color: 'secondary',
  },
  {
    value: 40,
    color: 'inherit',
  },
  {
    value: 40,
    color: 'primary',
    showLabel: true,
  },
  {
    value: 40,
    color: 'secondary',
    showLabel: true,
  },
  {
    value: 40,
    color: 'inherit',
    showLabel: true,
  },
  {
    value: 40,
    color: 'primary',
    variant: 'indeterminate',
  },
  {
    value: 40,
    color: 'secondary',
    variant: 'indeterminate',
  },
  {
    value: 40,
    color: 'inherit',
    variant: 'indeterminate',
  },
  {
    value: 40,
    bufferValue: 55,
    color: 'primary',
    variant: 'buffer',
  },
  {
    value: 40,
    bufferValue: 55,
    color: 'secondary',
    variant: 'buffer',
  },
  {
    value: 40,
    bufferValue: 55,
    color: 'inherit',
    variant: 'buffer',
  },
  {
    value: 40,
    bufferValue: 55,
    color: 'primary',
    variant: 'buffer',
    showLabel: true,
  },
  {
    value: 40,
    bufferValue: 55,
    color: 'secondary',
    variant: 'buffer',
    showLabel: true,
  },
  {
    value: 40,
    bufferValue: 55,
    color: 'inherit',
    variant: 'buffer',
    showLabel: true,
  },
  {
    value: 40,
    color: 'primary',
    circular: true,
  },
  {
    value: 80,
    color: 'secondary',
    circular: true,
  },
  {
    value: 100,
    color: 'inherit',
    circular: true,
  },
  {
    value: 40,
    color: 'primary',
    circular: true,
    showLabel: true,
  },
  {
    value: 80,
    color: 'secondary',
    circular: true,
    showLabel: true,
  },
  {
    value: 100,
    color: 'inherit',
    circular: true,
    showLabel: true,
  },
  {
    value: 40,
    color: 'primary',
    circular: true,
    variant: 'indeterminate',
  },
  {
    value: 40,
    color: 'secondary',
    circular: true,
    variant: 'indeterminate',
  },
  {
    value: 40,
    color: 'inherit',
    circular: true,
    variant: 'indeterminate',
  },
]);
</script>

<template>
  <ComponentView data-cy="progress">
    <template #title>
      Progress
    </template>

    <div class="grid gap-4 grid-cols-3">
      <RuiProgress
        v-for="(item, i) in progress"
        :key="i"
        class="mb-6"
        v-bind="item"
      />
    </div>
  </ComponentView>
</template>
