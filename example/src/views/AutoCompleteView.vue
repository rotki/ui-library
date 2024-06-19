<script lang="ts" setup>
import {
  type AutoCompleteProps,
  RuiAutoComplete,
  RuiButton,
  RuiIcon,
} from '@rotki/ui-library/components';
import { objectOmit } from '@vueuse/shared';
import { ref } from 'vue';

interface Options { id: string | number; label: string | number }
const options: Options[] = [
  { id: '1', label: 'Germany' },
  { id: '2', label: 'Nigeria' },
  { id: '3', label: 'Greece' },
  { id: '4', label: 'Indonesia' },
  { id: '5', label: 'Spain' },
  { id: '6', label: 'India' },
  { id: '7', label: 'France' },
  { id: '8', label: 'Option with very long name to test and see truncate behaviour' },
  ...[...new Array(5000).keys()].map(index => ({
    id: index + 9,
    label: index + 9,
  })),
];

const autoComplete = ref<AutoCompleteProps<Options>[]>([
  {
    disabled: false,
    keyAttr: 'id',
    textAttr: 'label',
    modelValue: undefined,
    options,
  },
  {
    disabled: true,
    keyAttr: 'id',
    textAttr: 'label',
    modelValue: undefined,
    options,
  },
  {
    disabled: false,
    variant: 'outlined',
    keyAttr: 'id',
    textAttr: 'label',
    modelValue: undefined,
    options,
  },
  {
    disabled: true,
    variant: 'outlined',
    keyAttr: 'id',
    textAttr: 'label',
    modelValue: undefined,
    options,
  },
  {
    dense: true,
    disabled: false,
    keyAttr: 'id',
    textAttr: 'label',
    modelValue: undefined,
    options,
  },
  {
    dense: true,
    disabled: true,
    keyAttr: 'id',
    textAttr: 'label',
    modelValue: undefined,
    options,
  },
  {
    dense: true,
    disabled: false,
    variant: 'outlined',
    keyAttr: 'id',
    textAttr: 'label',
    modelValue: undefined,
    options,
  },
  {
    dense: true,
    disabled: true,
    variant: 'outlined',
    keyAttr: 'id',
    textAttr: 'label',
    modelValue: undefined,
    options,
  },
]);

const autoCompleteCustom = ref<AutoCompleteProps<Options>[]>([
  {
    disabled: false,
    keyAttr: 'id',
    textAttr: 'label',
    modelValue: undefined,
    label: 'Auto complete with very long name to test and see truncate behaviour',
    hint: 'lorem ipsum dolor',
    options,
  },
  {
    keyAttr: 'id',
    textAttr: 'label',
    modelValue: undefined,
    dense: true,
    errorMessages: ['This is required'],
    hint: 'lorem ipsum dolor',
    options,
  },
  {
    disabled: false,
    label: 'primitive return',
    variant: 'outlined',
    keyAttr: 'id',
    textAttr: 'label',
    successMessages: ['lgtm!'],
    modelValue: undefined,
    options,
  },
  {
    disabled: true,
    variant: 'outlined',
    keyAttr: 'id',
    textAttr: 'label',
    modelValue: undefined,
    options,
  },
]);

const primitiveOptions: string[] = ['Lorem', 'Ipsum', 'Dolor', 'Sit amet', 'Consecteur'];

const autoCompletePrimitive = ref<AutoCompleteProps<string>[]>([
  {
    modelValue: 'Lorem',
    options: primitiveOptions,
  },
  {
    modelValue: undefined,
    dense: true,
    options: primitiveOptions,
  },
  {
    modelValue: undefined,
    dense: true,
    disabled: true,
    options: primitiveOptions,
  },
  {
    modelValue: 'Lorem',
    dense: true,
    disabled: true,
    options: primitiveOptions,
  },
  {
    modelValue: undefined,
    variant: 'outlined',
    options: primitiveOptions,
  },
  {
    modelValue: undefined,
    dense: true,
    variant: 'outlined',
    options: primitiveOptions,
  },
  {
    modelValue: undefined,
    dense: true,
    disabled: true,
    variant: 'outlined',
    options: primitiveOptions,
  },
  {
    modelValue: 'Lorem',
    dense: true,
    disabled: true,
    variant: 'outlined',
    options: primitiveOptions,
  },
  {
    modelValue: [],
    chips: true,
    variant: 'outlined',
    label: 'Multiple',
    options: primitiveOptions,
  },
  {
    modelValue: [],
    chips: true,
    dense: true,
    variant: 'outlined',
    label: 'Multiple',
    options: primitiveOptions,
  },
  {
    modelValue: [],
    chips: true,
    dense: true,
    disabled: true,
    variant: 'outlined',
    label: 'Multiple',
    options: primitiveOptions,
  },
  {
    modelValue: ['Lorem'],
    dense: true,
    disabled: true,
    variant: 'outlined',
    label: 'Multiple',
    options: primitiveOptions,
  },
  {
    modelValue: undefined,
    variant: 'outlined',
    label: 'Custom Value',
    customValue: true,
    options: primitiveOptions,
  },
  {
    modelValue: undefined,
    dense: true,
    variant: 'outlined',
    label: 'Custom Value',
    customValue: true,
    options: primitiveOptions,
  },
  {
    modelValue: [],
    chips: true,
    dense: true,
    variant: 'outlined',
    label: 'Multiple With Custom Value',
    customValue: true,
    options: primitiveOptions,
  },
  {
    modelValue: ['Lorem'],
    dense: true,
    variant: 'outlined',
    label: 'Multiple With Custom Value',
    customValue: true,
    options: primitiveOptions,
  },
]);

function getDisplayText(options?: Options | Options[]): string {
  const defaultText = 'Choose Option';
  return (Array.isArray(options) ? options?.[0]?.label?.toString() : options?.label?.toString()) ?? defaultText;
}
</script>

<template>
  <div>
    <h2
      class="text-h4 mb-6"
      data-cy="auto-completes"
    >
      Auto Completes
    </h2>
    <div class="grid gap-6 grid-cols-2">
      <div
        v-for="(item, i) in autoComplete"
        :key="i"
        class="py-4"
      >
        <RuiAutoComplete
          v-model="item.modelValue"
          clearable
          auto-select-first
          v-bind="objectOmit(item, ['modelValue'])"
          :data-cy="`auto-complete-${i}`"
        />
      </div>
    </div>
    <h4
      class="text-h6 mt-6"
      data-cy="auto-completes-custom"
    >
      Auto Complete: custom activator content
    </h4>
    <div class="grid gap-6 grid-cols-2">
      <div
        v-for="(item, i) in autoCompleteCustom"
        :key="i"
        class="py-4"
      >
        <RuiAutoComplete
          v-model="item.modelValue"
          clearable
          auto-select-first
          v-bind="objectOmit(item, ['modelValue'])"
          :data-cy="`auto-complete-custom-${i}`"
        >
          <template #activator="{ attrs, disabled, open, value }">
            <RuiButton
              class="!rounded-md border"
              data-cy="activator"
              variant="list"
              :disabled="disabled"
              v-bind="attrs"
            >
              {{ getDisplayText(value) }}
              <template #append>
                <RuiIcon
                  class="transition"
                  :class="[{ 'rotate-180': open }]"
                  name="arrow-drop-down-fill"
                  size="32"
                />
              </template>
            </RuiButton>
          </template>
        </RuiAutoComplete>
      </div>
    </div>
    <h4
      class="text-h6 mt-6"
      data-cy="auto-completes-custom-inner"
    >
      Auto Complete: custom activator inner content
    </h4>
    <div class="grid gap-6 grid-cols-2">
      <div
        v-for="(autoCompleteProp, i) in autoCompleteCustom"
        :key="i"
        class="py-4"
      >
        <RuiAutoComplete
          v-model="autoCompleteProp.modelValue"
          clearable
          auto-select-first
          v-bind="objectOmit(autoCompleteProp, ['modelValue'])"
          :data-cy="`auto-complete-custom-inner-${i}`"
          :item-height="autoCompleteProp.dense ? undefined : 80"
          :label-class="autoCompleteProp.dense ? undefined : 'h-20'"
          variant="outlined"
        >
          <template #selection="{ item }">
            {{ item.id }} | {{ item.label }}
          </template>
          <template #item="{ item }">
            <span
              class="block"
              :class="{ 'my-4': !autoCompleteProp.dense }"
            >
              {{ item.label }}
            </span>
          </template>
        </RuiAutoComplete>
      </div>
    </div>
    <h4
      class="text-h6 mt-6"
      data-cy="auto-completes-custom-options"
    >
      Auto Complete: custom options
    </h4>
    <div class="grid gap-6 grid-cols-2">
      <div
        v-for="(item, i) in autoCompleteCustom"
        :key="i"
        class="py-4"
      >
        <RuiAutoComplete
          v-model="item.modelValue"
          clearable
          auto-select-first
          v-bind="objectOmit(item, ['modelValue'])"
          :append-width="1.5"
          :data-cy="`auto-complete-custom-options-${i}`"
        >
          <template #item.append="{ active }">
            <RuiIcon
              v-if="active"
              class="transition"
              name="check-line"
              size="24"
            />
          </template>
        </RuiAutoComplete>
      </div>
    </div>
    <h4
      class="text-h6 mt-6"
      data-cy="auto-completes-custom-options"
    >
      Auto Complete: primitive values
    </h4>
    <div class="grid gap-6 grid-cols-2">
      <div
        v-for="(item, i) in autoCompletePrimitive"
        :key="i"
        class="py-4"
      >
        <RuiAutoComplete
          v-model="item.modelValue"
          clearable
          auto-select-first
          return-primitive
          v-bind="objectOmit(item, ['modelValue'])"
          :append-width="1.5"
          :data-cy="`auto-complete-custom-options-${i}`"
        >
          <template #item.append="{ active }">
            <RuiIcon
              v-if="active"
              class="transition"
              name="check-line"
              size="24"
            />
          </template>
        </RuiAutoComplete>
      </div>
    </div><h4
      class="text-h6 mt-6"
      data-cy="auto-completes-readonly"
    >
      Auto Complete: readonly
    </h4>
    <div class="grid gap-6 grid-cols-2">
      <div
        v-for="(item, i) in autoCompletePrimitive"
        :key="i"
        class="py-4"
      >
        <RuiAutoComplete
          v-model="item.modelValue"
          clearable
          auto-select-first
          v-bind="objectOmit(item, ['modelValue'])"
          :append-width="1.5"
          :data-cy="`auto-complete-readonly-${i}`"
          read-only
        >
          <template #item.append="{ active }">
            <RuiIcon
              v-if="active"
              class="transition"
              name="check-line"
              size="24"
            />
          </template>
        </RuiAutoComplete>
      </div>
    </div>
  </div>
</template>
