<script lang="ts" setup>
import {
  RuiButton,
  RuiTooltip,
  type TooltipProps,
} from '@rotki/ui-library/components';
import { objectOmit } from '@vueuse/shared';
import { ref } from 'vue';
import { type DataType } from '@/types';

const tooltips = ref<
  (TooltipProps & { buttonColor?: DataType<typeof RuiButton>['color'] })[]
>([
  {
    disabled: false,
    hideArrow: true,
    text: 'Bottom',
    buttonColor: 'primary',
    popper: { placement: 'bottom' },
  },
  {
    disabled: false,
    hideArrow: true,
    text: 'Top',
    buttonColor: 'secondary',
    popper: { placement: 'top' },
  },
  {
    disabled: false,
    hideArrow: true,
    text: 'Left',
    buttonColor: 'error',
    popper: { placement: 'left' },
  },
  {
    disabled: false,
    hideArrow: true,
    text: 'Right',
    buttonColor: 'info',
    popper: { placement: 'right' },
  },
  {
    disabled: false,
    hideArrow: false,
    text: 'Bottom With arrow',
    buttonColor: 'primary',
    popper: { placement: 'bottom' },
  },
  {
    disabled: false,
    hideArrow: false,
    text: 'Top With arrow',
    buttonColor: 'secondary',
    popper: { placement: 'top' },
  },
  {
    disabled: false,
    hideArrow: false,
    text: 'Left With arrow',
    buttonColor: 'error',
    popper: { placement: 'left' },
  },
  {
    disabled: false,
    hideArrow: false,
    text: 'Right With arrow',
    buttonColor: 'info',
    popper: { placement: 'right' },
  },
  {
    disabled: true,
    hideArrow: false,
    text: 'Tooltip disabled',
    buttonColor: 'primary',
    popper: { placement: 'bottom' },
  },
  {
    disabled: true,
    hideArrow: false,
    text: 'Tooltip disabled',
    buttonColor: 'secondary',
    popper: { placement: 'top' },
  },
  {
    disabled: true,
    hideArrow: false,
    text: 'Tooltip disabled',
    buttonColor: 'error',
    popper: { placement: 'left' },
  },
  {
    disabled: true,
    hideArrow: false,
    text: 'Tooltip disabled',
    buttonColor: 'info',
    popper: { placement: 'right' },
  },
]);
</script>

<template>
  <div>
    <h2 class="text-h4 mb-6" data-cy="tooltips">Tooltips</h2>
    <div class="grid gap-6 grid-cols-4">
      <div v-for="(tooltip, i) in tooltips" :key="i" class="p-4">
        <RuiTooltip
          v-bind="objectOmit(tooltip, ['buttonColor'])"
          :data-cy="`tooltip-${i}`"
        >
          <template #activator>
            <RuiButton :color="tooltip.buttonColor">
              {{ tooltip.text }}
            </RuiButton>
          </template>
          {{ tooltip.text }}
        </RuiTooltip>
      </div>
    </div>
  </div>
</template>
