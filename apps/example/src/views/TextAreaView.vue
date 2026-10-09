<script lang="ts" setup>
import type { Slots } from '@/types';
import { RuiTextArea, type TextAreaProps } from '@rotki/ui-library';
import { objectOmit } from '@vueuse/shared';
import ComponentView from '@/components/ComponentView.vue';

type TextAreaData = TextAreaProps & Slots & { modelValue: string };

const textAreas = ref<TextAreaData[]>([
  {
    modelValue: '',
    color: 'primary',
    textColor: 'primary',
    autoGrow: true,
  },
  {
    modelValue: '',
    color: 'secondary',
    textColor: 'secondary',
    maxRows: 5,
  },
  {
    modelValue: '',
    color: 'error',
    textColor: 'error',
    minRows: 2,
  },
  {
    modelValue: '',
    color: 'warning',
    textColor: 'warning',
    minRows: 1,
    maxRows: 5,
  },
  { modelValue: '', color: 'info', textColor: 'info' },
  { modelValue: '', color: 'success', textColor: 'success' },

  { modelValue: '', color: 'primary', dense: true },
  { modelValue: '', color: 'secondary', dense: true },
  { modelValue: '', color: 'error', dense: true },
  { modelValue: '', color: 'warning', dense: true },
  { modelValue: '', color: 'info', dense: true },
  { modelValue: '', color: 'success', dense: true },

  { modelValue: '', color: 'primary' },
  { modelValue: '', color: 'secondary' },
  { modelValue: '', color: 'error' },
  { modelValue: '', color: 'warning' },
  { modelValue: '', color: 'info' },
  { modelValue: '', color: 'success' },

  { modelValue: '', color: 'primary', disabled: true },
  { modelValue: '', color: 'secondary', disabled: true },
  { modelValue: '', color: 'error', disabled: true },
  { modelValue: '', color: 'warning', disabled: true },
  { modelValue: '', color: 'info', disabled: true },
  { modelValue: '', color: 'success', disabled: true },

  { modelValue: '', color: 'primary', hint: 'Text field hint' },
  {
    modelValue: '',
    color: 'secondary',
    hint: 'Text field hint',
  },
  { modelValue: '', color: 'error', hint: 'Text field hint' },
  { modelValue: '', color: 'warning', hint: 'Text field hint' },
  { modelValue: '', color: 'info', hint: 'Text field hint' },
  { modelValue: '', color: 'success', hint: 'Text field hint' },

  {
    modelValue: '',
    color: 'primary',
    errorMessages: ['Text field error message'],
  },
  {
    modelValue: '',
    color: 'secondary',
    errorMessages: 'Text field error message',
  },
  {
    modelValue: '',
    color: 'error',
    errorMessages: ['Text field error message'],
  },
  {
    modelValue: '',
    color: 'warning',
    successMessages: ['Text field success message'],
  },
  {
    modelValue: '',
    color: 'info',
    successMessages: 'Text field success message',
  },
  {
    modelValue: '',
    color: 'success',
    successMessages: ['Text field success message'],
  },

  {
    modelValue: '',
    color: 'primary',
    appendIcon: 'lu-arrow-right',
  },
  {
    modelValue: '',
    color: 'primary',
    appendIcon: 'lu-arrow-right',
    textColor: 'primary',
  },

  {
    modelValue: '',
    color: 'primary',
    prependIcon: 'lu-arrow-right',
  },
  {
    modelValue: '',
    color: 'primary',
    prependIcon: 'lu-arrow-right',
    textColor: 'primary',
  },

  {
    modelValue: 'lorem ipsum dolor',
    color: 'primary',
    clearable: true,
  },
  {
    modelValue: '',
    color: 'primary',
    prepend: 'Prepend',
    textColor: 'primary',
  },
  {
    modelValue: '',
    color: 'primary',
    prepend: 'Prepend',
  },
  {
    modelValue: '',
    color: 'primary',
    append: 'Append',
  },
  {
    modelValue: '',
    color: 'primary',
    append: 'Append',
    textColor: 'primary',
  },
  {
    modelValue: '',
    color: 'primary',
    append: 'Append',
    clearable: true,
  },
  {
    modelValue: '',
    color: 'primary',
    append: 'Append',
    clearable: true,
    textColor: 'primary',
  },
]);
</script>

<template>
  <ComponentView data-id="text-areas">
    <template #title>
      Text Areas
    </template>

    <div class="grid gap-4 grid-cols-3">
      <RuiTextArea
        v-for="(field, i) in textAreas"
        :key="i"
        v-model="field.modelValue"
        :label="field.color"
        placeholder="Placeholder"
        v-bind="objectOmit(field, ['modelValue'])"
      >
        <template
          v-if="field.prepend"
          #prepend
        >
          {{ field.prepend }}
        </template>
        <template
          v-if="field.append"
          #append
        >
          {{ field.append }}
        </template>
      </RuiTextArea>
    </div>
  </ComponentView>
</template>
