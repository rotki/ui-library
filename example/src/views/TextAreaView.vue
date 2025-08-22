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

  { modelValue: '', color: 'primary', variant: 'filled' },
  { modelValue: '', color: 'secondary', variant: 'filled' },
  { modelValue: '', color: 'error', variant: 'filled' },
  { modelValue: '', color: 'warning', variant: 'filled' },
  { modelValue: '', color: 'info', variant: 'filled' },
  { modelValue: '', color: 'success', variant: 'filled' },

  { modelValue: '', color: 'primary', variant: 'filled', dense: true },
  { modelValue: '', color: 'secondary', variant: 'filled', dense: true },
  { modelValue: '', color: 'error', variant: 'filled', dense: true },
  { modelValue: '', color: 'warning', variant: 'filled', dense: true },
  { modelValue: '', color: 'info', variant: 'filled', dense: true },
  { modelValue: '', color: 'success', variant: 'filled', dense: true },

  { modelValue: '', color: 'primary', variant: 'outlined' },
  { modelValue: '', color: 'secondary', variant: 'outlined' },
  { modelValue: '', color: 'error', variant: 'outlined' },
  { modelValue: '', color: 'warning', variant: 'outlined' },
  { modelValue: '', color: 'info', variant: 'outlined' },
  { modelValue: '', color: 'success', variant: 'outlined' },

  { modelValue: '', color: 'primary', variant: 'outlined', dense: true },
  { modelValue: '', color: 'secondary', variant: 'outlined', dense: true },
  { modelValue: '', color: 'error', variant: 'outlined', dense: true },
  { modelValue: '', color: 'warning', variant: 'outlined', dense: true },
  { modelValue: '', color: 'info', variant: 'outlined', dense: true },
  { modelValue: '', color: 'success', variant: 'outlined', dense: true },

  { modelValue: '', color: 'primary', variant: 'outlined', disabled: true },
  { modelValue: '', color: 'secondary', variant: 'outlined', disabled: true },
  { modelValue: '', color: 'error', variant: 'outlined', disabled: true },
  { modelValue: '', color: 'warning', variant: 'outlined', disabled: true },
  { modelValue: '', color: 'info', variant: 'outlined', disabled: true },
  { modelValue: '', color: 'success', variant: 'outlined', disabled: true },

  { modelValue: '', color: 'primary', variant: 'outlined', hint: 'Text field hint' },
  {
    modelValue: '',
    color: 'secondary',
    variant: 'outlined',
    hint: 'Text field hint',
  },
  { modelValue: '', color: 'error', variant: 'outlined', hint: 'Text field hint' },
  { modelValue: '', color: 'warning', variant: 'outlined', hint: 'Text field hint' },
  { modelValue: '', color: 'info', variant: 'outlined', hint: 'Text field hint' },
  { modelValue: '', color: 'success', variant: 'outlined', hint: 'Text field hint' },

  {
    modelValue: '',
    color: 'primary',
    variant: 'outlined',
    errorMessages: ['Text field error message'],
  },
  {
    modelValue: '',
    color: 'secondary',
    variant: 'outlined',
    errorMessages: 'Text field error message',
  },
  {
    modelValue: '',
    color: 'error',
    variant: 'outlined',
    errorMessages: ['Text field error message'],
  },
  {
    modelValue: '',
    color: 'warning',
    variant: 'outlined',
    successMessages: ['Text field success message'],
  },
  {
    modelValue: '',
    color: 'info',
    variant: 'outlined',
    successMessages: 'Text field success message',
  },
  {
    modelValue: '',
    color: 'success',
    variant: 'outlined',
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
    variant: 'filled',
    appendIcon: 'lu-arrow-right',
  },
  {
    modelValue: '',
    color: 'primary',
    variant: 'outlined',
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
    variant: 'filled',
    prependIcon: 'lu-arrow-right',
  },
  {
    modelValue: '',
    color: 'primary',
    variant: 'outlined',
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
    variant: 'filled',
    prepend: 'Prepend',
    textColor: 'primary',
  },
  {
    modelValue: '',
    color: 'primary',
    variant: 'outlined',
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
    variant: 'filled',
    append: 'Append',
  },
  {
    modelValue: '',
    color: 'primary',
    variant: 'outlined',
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
    variant: 'filled',
    append: 'Append',
    clearable: true,
  },
  {
    modelValue: '',
    color: 'primary',
    variant: 'outlined',
    append: 'Append',
    clearable: true,
    textColor: 'primary',
  },
]);
</script>

<template>
  <ComponentView data-cy="text-fields">
    <template #title>
      Text Fields
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
