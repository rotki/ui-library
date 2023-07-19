<script lang="ts" setup>
import { RuiRadio, RuiRadioGroup } from '@rotki/ui-library';
import { ref } from 'vue';
import { type DataType } from '@/types';

type RadioData = DataType<typeof RuiRadio, string> & {
  modelValue?: string;
  label?: string;
};

const radios = ref<RadioData[]>([
  {
    value: 'primary',
    modelValue: 'primary',
    color: 'primary',
  },
  {
    value: 'secondary',
    color: 'secondary',
  },
  {
    value: 'error',
    color: 'error',
  },
  {
    value: 'warning',
    color: 'warning',
  },
  {
    value: 'info',
    color: 'info',
  },
  {
    value: 'success',
    color: 'success',
  },
  {
    value: 'primary',
    color: 'primary',
    label: 'primary',
  },
  {
    value: 'secondary',
    color: 'secondary',
    label: 'secondary',
  },
  {
    value: 'error',
    color: 'error',
    label: 'error',
  },
  {
    value: 'warning',
    color: 'warning',
    label: 'warning',
  },
  {
    value: 'info',
    color: 'info',
    label: 'info',
  },
  {
    value: 'success',
    color: 'success',
    label: 'success',
  },
  {
    value: 'primary',
    modelValue: 'primary',
    color: 'primary',
    label: 'primary',
  },
  {
    value: 'secondary',
    modelValue: 'secondary',
    color: 'secondary',
    label: 'secondary',
  },
  {
    value: 'error',
    modelValue: 'error',
    color: 'error',
    label: 'error',
  },
  {
    value: 'warning',
    modelValue: 'warning',
    color: 'warning',
    label: 'warning',
  },
  {
    value: 'info',
    modelValue: 'info',
    color: 'info',
    label: 'info',
  },
  {
    value: 'success',
    modelValue: 'success',
    color: 'success',
    label: 'success',
  },
  {
    value: 'primary',
    disabled: true,
    color: 'primary',
    label: 'primary',
  },
  {
    value: 'secondary',
    disabled: true,
    color: 'secondary',
    label: 'secondary',
  },
  {
    value: 'error',
    disabled: true,
    color: 'error',
    label: 'error',
  },
  {
    value: 'warning',
    disabled: true,
    color: 'warning',
    label: 'warning',
  },
  {
    value: 'info',
    disabled: true,
    color: 'info',
    label: 'info',
  },
  {
    value: 'success',
    disabled: true,
    color: 'success',
    label: 'success',
  },
  {
    value: 'primary',
    modelValue: 'primary',
    disabled: true,
    color: 'primary',
    label: 'primary',
  },
  {
    value: 'secondary',
    modelValue: 'secondary',
    disabled: true,
    color: 'secondary',
    label: 'secondary',
  },
  {
    value: 'error',
    modelValue: 'error',
    disabled: true,
    color: 'error',
    label: 'error',
  },
  {
    value: 'warning',
    modelValue: 'warning',
    disabled: true,
    color: 'warning',
    label: 'warning',
  },
  {
    value: 'info',
    modelValue: 'info',
    disabled: true,
    color: 'info',
    label: 'info',
  },
  {
    value: 'success',
    modelValue: 'success',
    disabled: true,
    color: 'success',
    label: 'success',
  },
]);

const radioGroups = ref<
  {
    value: string;
    options: {
      color: RadioData['color'];
      size?: RadioData['size'];
      disabled?: boolean;
    }[];
  }[]
>([
  {
    value: 'primary',
    options: [
      { color: 'primary' },
      { color: 'secondary' },
      { color: 'error' },
      { color: 'warning' },
      { color: 'info' },
      { color: 'success' },
    ],
  },
  {
    value: 'primary',
    options: [
      { color: 'primary', size: 'sm' },
      { color: 'secondary', size: 'sm' },
      { color: 'error', size: 'sm' },
      { color: 'warning', size: 'sm' },
      { color: 'info', size: 'sm' },
      { color: 'success', size: 'sm' },
    ],
  },
  {
    value: 'primary',
    options: [
      { color: 'primary', size: 'lg' },
      { color: 'secondary', size: 'lg', disabled: true },
      { color: 'error', size: 'lg', disabled: true },
      { color: 'warning', size: 'lg', disabled: true },
      { color: 'info', size: 'lg', disabled: true },
      { color: 'success', size: 'lg' },
    ],
  },
]);
</script>

<template>
  <div>
    <h2 class="text-h4 mb-6" data-cy="radio-buttons">Radio Buttons</h2>
    <div class="grid gap-4 grid-cols-6 mb-14" data-cy="radio-wrapper">
      <RuiRadio
        v-for="(radio, j) in radios"
        :key="j"
        v-model="radio.modelValue"
        v-bind="radio"
      >
        <span v-if="radio.label" class="capitalize"> {{ radio.label }} </span>
      </RuiRadio>
    </div>
    <h2 class="text-h4 mb-6" data-cy="radio-group-buttons">Radio Groups</h2>
    <div class="grid gap-8" data-cy="radio-group-wrapper">
      <RuiRadioGroup
        v-for="(radioGroup, i) in radioGroups"
        :key="i"
        v-model="radioGroup.value"
        :hint="`Selected value: ${radioGroup.value}`"
        inline
      >
        <RuiRadio
          v-for="(radio, j) in radioGroup.options"
          :key="j"
          :value="radio.color"
          v-bind="radio"
        >
          <span class="capitalize"> {{ radio.color }} </span>
        </RuiRadio>
      </RuiRadioGroup>
    </div>
  </div>
</template>
