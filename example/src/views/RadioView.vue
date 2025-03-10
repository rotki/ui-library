<script lang="ts" setup>
import ComponentView from '@/components/ComponentView.vue';
import { type RadioProps, RuiRadio, RuiRadioGroup } from '@rotki/ui-library';

type RadioData = RadioProps<string> & {
  label?: string;
  modelValue?: string;
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
    disabled?: boolean;
    size?: RadioData['size'];
    options: {
      color: NonNullable<RadioData['color']>;
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
    size: 'sm',
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
    disabled: true,
    size: 'lg',
    options: [
      { color: 'primary' },
      { color: 'secondary' },
      { color: 'error' },
      { color: 'warning' },
      { color: 'info' },
      { color: 'success' },
    ],
  },
]);

const customTypeRadioGroup = ref<
  {
    value: string | number | boolean;
    options: {
      value: string | number | boolean;
      label: string;
    }[];
  }[]
>([
  {
    value: true,
    options: [
      { value: false, label: 'False' },
      { value: true, label: 'True' },
    ],
  },
  {
    value: 1,
    options: [
      { value: 1, label: '1' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4' },
      { value: 5, label: '5' },
    ],
  },
]);
</script>

<template>
  <ComponentView data-cy="radio-buttons">
    <template #title>
      Radio Buttons
    </template>

    <div
      class="grid gap-4 grid-cols-6 mb-14"
      data-cy="radio-wrapper"
    >
      <RuiRadio
        v-for="(radio, j) in radios"
        :key="j"
        v-model="radio.modelValue"
        v-bind="radio"
      >
        <span
          v-if="radio.label"
          class="capitalize"
        >
          {{ radio.label }}
        </span>
      </RuiRadio>
    </div>
    <h2
      class="text-h4 mb-6"
      data-cy="radio-group-buttons"
    >
      Radio Groups
    </h2>
    <div
      class="grid gap-8"
      data-cy="radio-group-wrapper"
    >
      <RuiRadioGroup
        v-for="(radioGroup, i) in radioGroups"
        :key="i"
        v-model="radioGroup.value"
        :disabled="radioGroup.disabled"
        :size="radioGroup.size"
        :hint="`Selected value: ${radioGroup.value}`"
        inline
      >
        <RuiRadio
          v-for="(radio, j) in radioGroup.options"
          :key="j"
          :value="radio.color"
        >
          <span class="capitalize"> {{ radio.color }} </span>
        </RuiRadio>
      </RuiRadioGroup>
      <RuiRadioGroup
        v-for="(radioGroup, i) in customTypeRadioGroup"
        :key="i"
        v-model="radioGroup.value"
        :hint="`Selected value: ${radioGroup.value}`"
        inline
      >
        <RuiRadio
          v-for="(radio, j) in radioGroup.options"
          :key="j"
          :value="radio.value"
        >
          <span class="capitalize"> {{ radio.label }} </span>
        </RuiRadio>
      </RuiRadioGroup>
    </div>
  </ComponentView>
</template>
