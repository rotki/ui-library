<script lang="ts" setup>
import { RuiRevealableTextField, RuiTextField } from '@rotki/ui-library';
import { ref } from 'vue';
import { type DataType, type Slots } from '@/types';

type TextFieldData = DataType<typeof RuiTextField, string> & Slots;

const textFields = ref<TextFieldData[]>([
  { value: '', color: 'primary' },
  { value: '', color: 'secondary' },
  { value: '', color: 'error' },
  { value: '', color: 'warning' },
  { value: '', color: 'info' },
  { value: '', color: 'success' },

  { value: '', color: 'primary', dense: true },
  { value: '', color: 'secondary', dense: true },
  { value: '', color: 'error', dense: true },
  { value: '', color: 'warning', dense: true },
  { value: '', color: 'info', dense: true },
  { value: '', color: 'success', dense: true },

  { value: '', color: 'primary', variant: 'filled' },
  { value: '', color: 'secondary', variant: 'filled' },
  { value: '', color: 'error', variant: 'filled' },
  { value: '', color: 'warning', variant: 'filled' },
  { value: '', color: 'info', variant: 'filled' },
  { value: '', color: 'success', variant: 'filled' },

  { value: '', color: 'primary', variant: 'filled', dense: true },
  { value: '', color: 'secondary', variant: 'filled', dense: true },
  { value: '', color: 'error', variant: 'filled', dense: true },
  { value: '', color: 'warning', variant: 'filled', dense: true },
  { value: '', color: 'info', variant: 'filled', dense: true },
  { value: '', color: 'success', variant: 'filled', dense: true },

  { value: '', color: 'primary', variant: 'outlined' },
  { value: '', color: 'secondary', variant: 'outlined' },
  { value: '', color: 'error', variant: 'outlined' },
  { value: '', color: 'warning', variant: 'outlined' },
  { value: '', color: 'info', variant: 'outlined' },
  { value: '', color: 'success', variant: 'outlined' },

  { value: '', color: 'primary', variant: 'outlined', dense: true },
  { value: '', color: 'secondary', variant: 'outlined', dense: true },
  { value: '', color: 'error', variant: 'outlined', dense: true },
  { value: '', color: 'warning', variant: 'outlined', dense: true },
  { value: '', color: 'info', variant: 'outlined', dense: true },
  { value: '', color: 'success', variant: 'outlined', dense: true },

  { value: '', color: 'primary', variant: 'outlined', disabled: true },
  { value: '', color: 'secondary', variant: 'outlined', disabled: true },
  { value: '', color: 'error', variant: 'outlined', disabled: true },
  { value: '', color: 'warning', variant: 'outlined', disabled: true },
  { value: '', color: 'info', variant: 'outlined', disabled: true },
  { value: '', color: 'success', variant: 'outlined', disabled: true },

  { value: '', color: 'primary', variant: 'outlined', hint: 'Text field hint' },
  {
    value: '',
    color: 'secondary',
    variant: 'outlined',
    hint: 'Text field hint',
  },
  { value: '', color: 'error', variant: 'outlined', hint: 'Text field hint' },
  { value: '', color: 'warning', variant: 'outlined', hint: 'Text field hint' },
  { value: '', color: 'info', variant: 'outlined', hint: 'Text field hint' },
  { value: '', color: 'success', variant: 'outlined', hint: 'Text field hint' },

  {
    value: '',
    color: 'primary',
    variant: 'outlined',
    errorMessages: ['Text field error message'],
  },
  {
    value: '',
    color: 'secondary',
    variant: 'outlined',
    errorMessages: ['Text field error message'],
  },
  {
    value: '',
    color: 'error',
    variant: 'outlined',
    errorMessages: ['Text field error message'],
  },
  {
    value: '',
    color: 'warning',
    variant: 'outlined',
    errorMessages: ['Text field error message'],
  },
  {
    value: '',
    color: 'info',
    variant: 'outlined',
    errorMessages: ['Text field error message'],
  },
  {
    value: '',
    color: 'success',
    variant: 'outlined',
    errorMessages: ['Text field error message'],
  },

  {
    value: '',
    color: 'primary',
    appendIcon: 'arrow-right-line',
  },
  {
    value: '',
    color: 'primary',
    variant: 'filled',
    appendIcon: 'arrow-right-line',
  },
  {
    value: '',
    color: 'primary',
    variant: 'outlined',
    appendIcon: 'arrow-right-line',
  },

  {
    value: '',
    color: 'primary',
    prependIcon: 'arrow-right-line',
  },
  {
    value: '',
    color: 'primary',
    variant: 'filled',
    prependIcon: 'arrow-right-line',
  },
  {
    value: '',
    color: 'primary',
    variant: 'outlined',
    prependIcon: 'arrow-right-line',
  },

  {
    value: '',
    color: 'primary',
    prepend: 'Prepend',
  },
  {
    value: '',
    color: 'primary',
    variant: 'filled',
    prepend: 'Prepend',
  },
  {
    value: '',
    color: 'primary',
    variant: 'outlined',
    prepend: 'Prepend',
  },
  {
    value: '',
    color: 'primary',
    append: 'Append',
  },
  {
    value: '',
    color: 'primary',
    variant: 'filled',
    append: 'Append',
  },
  {
    value: '',
    color: 'primary',
    variant: 'outlined',
    append: 'Append',
  },
]);

const revealableTextFields = ref([
  { value: '', color: 'primary', variant: 'outlined', label: 'Password' },
  { value: '', color: 'secondary', variant: 'outlined', label: 'Password' },
  { value: '', color: 'error', variant: 'outlined', label: 'Password' },
  { value: '', color: 'warning', variant: 'outlined', label: 'Password' },
  { value: '', color: 'info', variant: 'outlined', label: 'API Key' },
  { value: '', color: 'success', variant: 'outlined', label: 'API Secret' },
]);
</script>

<template>
  <div>
    <h2 class="text-h4 mb-6" data-cy="text-fields">Text Fields</h2>
    <div class="grid gap-4 grid-rows-2 grid-cols-3">
      <RuiTextField
        v-for="(field, i) in textFields"
        :key="i"
        v-model="field.value"
        :label="field.color"
        placeholder="Placeholder"
        v-bind="field"
      >
        <template v-if="field.prepend" #prepend>{{ field.prepend }}</template>
        <template v-if="field.append" #append>{{ field.append }}</template>
      </RuiTextField>
    </div>
    <h2 class="text-h4 mb-6 mt-14" data-cy="text-fields">
      Revealable Text Fields
    </h2>
    <div class="grid gap-4 grid-rows-2 grid-cols-3">
      <RuiRevealableTextField
        v-for="(field, i) in revealableTextFields"
        :key="i"
        v-model="field.value"
        placeholder="Placeholder"
        v-bind="field"
      />
    </div>
  </div>
</template>
