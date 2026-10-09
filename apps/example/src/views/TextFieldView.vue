<script lang="ts" setup>
import type { Slots } from '@/types';
import {
  type RevealableTextFieldProps,
  RuiRevealableTextField,
  RuiTextField,
  type TextFieldProps,
} from '@rotki/ui-library';
import { objectOmit } from '@vueuse/shared';
import ComponentView from '@/components/ComponentView.vue';

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

  { modelValue: '', color: 'primary' },
  { modelValue: '', color: 'secondary' },
  { modelValue: '', color: 'error' },
  { modelValue: '', color: 'warning' },
  { modelValue: '', color: 'info' },
  { modelValue: '', color: 'success' },

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

  { modelValue: '', color: 'primary', dense: true },
  { modelValue: '', color: 'secondary', dense: true },
  { modelValue: '', color: 'error', dense: true },
  { modelValue: '', color: 'warning', dense: true },
  { modelValue: '', color: 'info', dense: true },
  { modelValue: '', color: 'success', dense: true },

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
  },
  {
    modelValue: '',
    color: 'primary',
    prependIcon: 'lu-arrow-right',
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
  },
  {
    modelValue: '',
    color: 'primary',
    append: 'Append',
    clearable: true,
    textColor: 'primary',
  },
]);

const revealableTextFields = ref<RevealableTextFieldData[]>([
  {
    modelValue: '',
    color: 'primary',
    label: 'Password',
    textColor: 'primary',
  },
  {
    modelValue: '',
    color: 'secondary',
    label: 'Password',
    textColor: 'secondary',
  },
  {
    modelValue: '',
    color: 'error',
    label: 'Password',
    textColor: 'error',
  },
  {
    modelValue: '',
    color: 'warning',
    label: 'Password',
    textColor: 'warning',
  },
  {
    modelValue: '',
    color: 'info',
    label: 'API Key',
    textColor: 'info',
    disabled: true,
  },
  {
    modelValue: 'some secret key',
    color: 'success',
    label: 'API Secret',
    textColor: 'success',
    prependIcon: 'lu-arrow-right',
    successMessages: ['lorem ipsum success message'],
    errorMessages: ['lorem ipsum error message'],
    hint: 'lorem ipsum hint',
    disabled: false,
  },
  {
    color: 'info',
    label: 'API Key',
    textColor: 'info',
    clearable: true,
    modelValue: 'some values',
  },
]);
</script>

<template>
  <ComponentView data-id="text-fields">
    <template #title>
      Text Fields
    </template>

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
      data-id="text-fields"
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
  </ComponentView>
</template>
