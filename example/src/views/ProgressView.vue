<script lang="ts" setup>
import { RuiProgress } from '@rotki/ui-library';
import { ref } from 'vue';
import { type DataType } from '@/types';

type ProgressData = DataType<typeof RuiProgress, number>;

const progress = ref<ProgressData[]>([
  {
    value: 0.4,
  },
  {
    value: 0.4,
    color: 'secondary',
  },
  {
    value: 0.4,
    color: 'inherit',
  },
  {
    value: 0.4,
    showLabel: true,
  },
  {
    value: 0.4,
    color: 'secondary',
    showLabel: true,
  },
  {
    value: 0.4,
    color: 'inherit',
    showLabel: true,
  },
  {
    value: 0.4,
    variant: 'indeterminate',
  },
  {
    value: 0.4,
    color: 'secondary',
    variant: 'indeterminate',
  },
  {
    value: 0.4,
    color: 'inherit',
    variant: 'indeterminate',
  },
  {
    value: 0.4,
    bufferValue: 0.55,
    variant: 'buffer',
  },
  {
    value: 0.4,
    bufferValue: 0.55,
    color: 'secondary',
    variant: 'buffer',
  },
  {
    value: 0.4,
    bufferValue: 0.55,
    color: 'inherit',
    variant: 'buffer',
  },
  {
    value: 0.4,
    bufferValue: 0.55,
    variant: 'buffer',
    showLabel: true,
  },
  {
    value: 0.4,
    bufferValue: 0.55,
    color: 'secondary',
    variant: 'buffer',
    showLabel: true,
  },
  {
    value: 0.4,
    bufferValue: 0.55,
    color: 'inherit',
    variant: 'buffer',
    showLabel: true,
  },
  {
    value: 0.4,
    circular: true,
  },
  {
    value: 0.8,
    color: 'secondary',
    circular: true,
  },
  {
    value: 1,
    color: 'inherit',
    circular: true,
  },
  {
    value: 0.4,
    circular: true,
    showLabel: true,
  },
  {
    value: 0.8,
    color: 'secondary',
    circular: true,
    showLabel: true,
  },
  {
    value: 1,
    color: 'inherit',
    circular: true,
    showLabel: true,
  },
  {
    value: 0.4,
    circular: true,
    variant: 'indeterminate',
  },
  {
    value: 0.4,
    color: 'secondary',
    circular: true,
    variant: 'indeterminate',
  },
  {
    value: 0.4,
    color: 'inherit',
    circular: true,
    variant: 'indeterminate',
  },
]);
</script>

<template>
  <div>
    <h2 class="text-h4 mb-6" data-cy="progress">Progress</h2>
    <div class="grid gap-4 grid-cols-3">
      <RuiProgress
        v-for="(item, i) in progress"
        :key="i"
        class="mb-6"
        v-bind="item"
      />
    </div>
  </div>
</template>
