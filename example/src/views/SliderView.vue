<script lang="ts" setup>
import {
  RuiSlider,
  type SliderProps,
} from '@rotki/ui-library';
import { ref } from 'vue';

type SliderData = SliderProps &
  {
    value?: number;
  };

const textFields = ref<SliderData[]>([
  { value: 50, color: 'primary' },
  { value: 50, color: 'secondary' },

  { value: 50, label: 'With Label', color: 'primary' },
  { value: 50, label: 'With Label', color: 'secondary' },

  { value: 50, label: 'Disabled', color: 'primary', disabled: true },
  { value: 50, label: 'Disabled', color: 'secondary', disabled: true },

  { value: 50, label: 'Vertical', color: 'primary', vertical: true },
  { value: 50, label: 'Vertical', color: 'secondary', vertical: true },

  { value: 50, label: 'Show Thumb Label', color: 'primary', showThumbLabel: true },
  { value: 50, label: 'Show Thumb Label', color: 'secondary', showThumbLabel: true },

  { value: 50, label: 'Show Thicks', color: 'primary', showTicks: true },
  { value: 50, label: 'Show Thicks', color: 'secondary', showTicks: true },

  { value: 50, label: 'With Hint', color: 'primary', hint: 'Slider hints' },
  { value: 50, label: 'With Hint', color: 'secondary', hint: 'Slider hints' },

  { value: 50, label: 'With Error', color: 'primary', errorMessages: 'Slider error messages' },
  { value: 50, label: 'With Success', color: 'secondary', successMessages: 'Slider success messages' },

  {
    value: 1,
    label: 'Custom',
    color: 'primary',
    max: 2,
    showTicks: true,
    hideTrack: true,
    sliderClass: '!bg-rui-grey-200 dark:!bg-rui-grey-800',
    tickClass: '!bg-rui-grey-200 dark:!bg-rui-grey-800',
    tickSize: 12,
  },

  {
    value: 1,
    label: 'Custom',
    color: 'secondary',
    max: 2,
    showTicks: true,
    hideTrack: true,
    sliderClass: '!bg-rui-grey-200 dark:!bg-rui-grey-800',
    tickClass: '!bg-rui-grey-200 dark:!bg-rui-grey-800',
    tickSize: 12,
  },
]);
</script>

<template>
  <div>
    <h2
      class="text-h4 mb-6"
      data-cy="sliders"
    >
      Sliders
    </h2>
    <div class="grid gap-4 grid-rows-2 grid-cols-2">
      <RuiSlider
        v-for="(field, i) in textFields"
        :key="i"
        v-model="field.value"
        :label="field.label"
        v-bind="field"
      />
    </div>
  </div>
</template>
