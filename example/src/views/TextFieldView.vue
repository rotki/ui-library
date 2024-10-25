<script lang="ts" setup>
import {
  type RevealableTextFieldProps,
  RuiRevealableTextField,
  RuiTextField,
  type TextFieldProps,
} from '@rotki/ui-library';
import { objectOmit } from '@vueuse/shared';
import type { Slots } from '@/types';

type TextFieldData = TextFieldProps &
  Slots & {
    modelValue: string;
  };

type RevealableTextFieldData = RevealableTextFieldProps &
  Slots & {
    modelValue: string;
  };

const textFields = ref<TextFieldData[]>([
  { modelValue: '', color: 'primary', textColor: 'primary' },
  { modelValue: '', color: 'secondary', textColor: 'secondary' },
  { modelValue: '', color: 'error', textColor: 'error' },
  { modelValue: '', color: 'warning', textColor: 'warning' },
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

  { modelValue: '', color: 'primary', variant: 'default' },
  { modelValue: '', color: 'secondary', variant: 'default' },
  { modelValue: '', color: 'error', variant: 'default' },
  { modelValue: '', color: 'warning', variant: 'default' },
  { modelValue: '', color: 'info', variant: 'default' },
  { modelValue: '', color: 'success', variant: 'default' },

  { modelValue: '', color: 'primary', variant: 'default', dense: true },
  { modelValue: '', color: 'secondary', variant: 'default', dense: true },
  { modelValue: '', color: 'error', variant: 'default', dense: true },
  { modelValue: '', color: 'warning', variant: 'default', dense: true },
  { modelValue: '', color: 'info', variant: 'default', dense: true },
  { modelValue: '', color: 'success', variant: 'default', dense: true },

  { modelValue: '', color: 'primary', variant: 'default', disabled: true },
  { modelValue: '', color: 'secondary', variant: 'default', disabled: true },
  { modelValue: '', color: 'error', variant: 'default', disabled: true },
  { modelValue: '', color: 'warning', variant: 'default', disabled: true },
  { modelValue: '', color: 'info', variant: 'default', disabled: true },
  { modelValue: '', color: 'success', variant: 'default', disabled: true },

  { modelValue: '', color: 'primary', variant: 'default', hint: 'Text field hint' },
  {
    modelValue: '',
    color: 'secondary',
    variant: 'default',
    hint: 'Text field hint',
  },
  { modelValue: '', color: 'error', variant: 'default', hint: 'Text field hint' },
  { modelValue: '', color: 'warning', variant: 'default', hint: 'Text field hint' },
  { modelValue: '', color: 'info', variant: 'default', hint: 'Text field hint' },
  { modelValue: '', color: 'success', variant: 'default', hint: 'Text field hint' },

  {
    modelValue: '',
    color: 'primary',
    variant: 'default',
    errorMessages: ['Text field error message'],
  },
  {
    modelValue: '',
    color: 'secondary',
    variant: 'default',
    errorMessages: 'Text field error message',
  },
  {
    modelValue: '',
    color: 'error',
    variant: 'default',
    errorMessages: ['Text field error message'],
  },
  {
    modelValue: '',
    color: 'warning',
    variant: 'default',
    successMessages: ['Text field success message'],
  },
  {
    modelValue: '',
    color: 'info',
    variant: 'default',
    successMessages: 'Text field success message',
  },
  {
    modelValue: '',
    color: 'success',
    variant: 'default',
    successMessages: ['Text field success message'],
  },

  {
    modelValue: '',
    color: 'primary',
    appendIcon: 'arrow-right-line',
  },
  {
    modelValue: '',
    color: 'primary',
    variant: 'filled',
    appendIcon: 'arrow-right-line',
  },
  {
    modelValue: '',
    color: 'primary',
    variant: 'default',
    appendIcon: 'arrow-right-line',
    textColor: 'primary',
  },

  {
    modelValue: '',
    color: 'primary',
    prependIcon: 'arrow-right-line',
  },
  {
    modelValue: '',
    color: 'primary',
    variant: 'filled',
    prependIcon: 'arrow-right-line',
  },
  {
    modelValue: '',
    color: 'primary',
    variant: 'default',
    prependIcon: 'arrow-right-line',
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
    variant: 'filled',
    prepend: 'Prepend',
    textColor: 'primary',
  },
  {
    modelValue: '',
    color: 'primary',
    variant: 'default',
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
    variant: 'default',
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
    variant: 'default',
    append: 'Append',
    clearable: true,
    textColor: 'primary',
  },
]);

const revealableTextFields = ref<RevealableTextFieldData[]>([
  {
    modelValue: '',
    color: 'primary',
    variant: 'default',
    label: 'Password',
    textColor: 'primary',
  },
  {
    modelValue: '',
    color: 'secondary',
    variant: 'default',
    label: 'Password',
    textColor: 'secondary',
  },
  {
    modelValue: '',
    color: 'error',
    variant: 'default',
    label: 'Password',
    textColor: 'error',
  },
  {
    modelValue: '',
    color: 'warning',
    variant: 'default',
    label: 'Password',
    textColor: 'warning',
  },
  {
    modelValue: '',
    color: 'info',
    variant: 'default',
    label: 'API Key',
    textColor: 'info',
    disabled: true,
  },
  {
    modelValue: 'some secret key',
    color: 'success',
    variant: 'default',
    label: 'API Secret',
    textColor: 'success',
    prependIcon: 'arrow-right-line',
    successMessages: ['lorem ipsum success message'],
    errorMessages: ['lorem ipsum error message'],
    hint: 'lorem ipsum hint',
    disabled: false,
  },
  {
    color: 'info',
    variant: 'default',
    label: 'API Key',
    textColor: 'info',
    clearable: true,
    modelValue: 'some values',
  },
]);
</script>

<template>
  <div>
    <h2
      class="text-h4 mb-6"
      data-cy="text-fields"
    >
      Text Fields
    </h2>
    <div class="grid gap-4 grid-rows-2 grid-cols-3">
      <RuiTextField
        v-for="(field, i) in textFields"
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
      </RuiTextField>
    </div>
    <h2
      class="text-h4 mb-6 mt-14"
      data-cy="text-fields"
    >
      Revealable Text Fields
    </h2>
    <div class="grid gap-4 grid-rows-2 grid-cols-3">
      <RuiRevealableTextField
        v-for="(field, i) in revealableTextFields"
        :key="i"
        v-model="field.modelValue"
        placeholder="Placeholder"
        v-bind="objectOmit(field, ['modelValue', 'append', 'prepend'])"
      />
    </div>
  </div>
</template>
