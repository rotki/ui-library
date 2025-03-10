<script lang="ts" setup>
import ComponentView from '@/components/ComponentView.vue';
import { createOptions, type SelectOption } from '@/data/options';
import {
  type AutoCompleteProps,
  RuiAutoComplete,
  RuiButton,
  RuiIcon,
} from '@rotki/ui-library/components';
import { objectOmit } from '@vueuse/shared';
import { ref } from 'vue';

type RuiAutoCompleteProps<TValue = number, TItem = SelectOption> = AutoCompleteProps<TValue, TItem> & {
  modelValue: TValue extends Array<infer U> ? U[] : TValue | undefined;
};

const options = createOptions();

const autoComplete = ref<RuiAutoCompleteProps[]>([
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

const autoCompleteCustom = ref<RuiAutoCompleteProps<number | SelectOption[]>[]>([
  {
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
    label: 'With error messages',
    dense: true,
    errorMessages: ['This is required'],
    hint: 'lorem ipsum dolor',
    options,
  },
  {
    variant: 'outlined',
    keyAttr: 'id',
    textAttr: 'label',
    dense: true,
    label: 'With success messages',
    successMessages: ['lgtm!'],
    modelValue: undefined,
    options,
  },
  {
    disabled: true,
    variant: 'outlined',
    keyAttr: 'id',
    textAttr: 'label',
    label: 'Disabled',
    dense: true,
    modelValue: undefined,
    options,
  },
  {
    variant: 'outlined',
    textAttr: 'label',
    keyAttr: 'id',
    label: 'Multiple',
    dense: true,
    modelValue: [],
    options,
  },
  {
    variant: 'outlined',
    textAttr: 'label',
    label: 'Return Object',
    dense: true,
    modelValue: undefined,
    returnObject: true,
    options,
  },
  {
    variant: 'outlined',
    keyAttr: 'id',
    textAttr: 'label',
    label: 'Multiple and Return Object',
    dense: true,
    modelValue: [],
    chips: true,
    returnObject: true,
    options,
  },
  {
    variant: 'outlined',
    keyAttr: 'id',
    textAttr: 'label',
    label: 'Multiple, Return Object, and Custom Value',
    dense: true,
    modelValue: [],
    chips: true,
    customValue: true,
    returnObject: true,
    options,
  },
]);

const primitiveOptions: string[] = ['Lorem', 'Ipsum', 'Dolor', 'Sit amet', 'Consecteur'];

const autoCompletePrimitive = ref<RuiAutoCompleteProps<string[] | string, string>[]>([
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

function getDisplayText(options?: SelectOption | SelectOption[]): string {
  const defaultText = 'Choose Option';
  return (Array.isArray(options) ? options?.[0]?.label?.toString() : options?.label?.toString()) ?? defaultText;
}
</script>

<template>
  <ComponentView data-cy="auto-completes">
    <template #title>
      Auto Completes
    </template>

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
              variant="list"
              :disabled="disabled"
              v-bind="{ ...attrs, 'data-cy': 'activator' }"
            >
              {{ getDisplayText(value) }}
              <template #append>
                <RuiIcon
                  class="transition"
                  :class="[{ 'rotate-180': open }]"
                  name="lu-chevron-down"
                  size="24"
                />
              </template>
            </RuiButton>
          </template>
        </RuiAutoComplete>
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
              variant="list"
              :disabled="disabled"
              v-bind="{ ...attrs, 'data-cy': 'activator' }"
            >
              {{ getDisplayText(value) }}
              <template #append>
                <RuiIcon
                  class="transition"
                  :class="[{ 'rotate-180': open }]"
                  name="lu-chevron-down"
                  size="24"
                />
              </template>
            </RuiButton>
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
              name="lu-check"
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
              name="lu-check"
              size="24"
            />
          </template>
        </RuiAutoComplete>
      </div>
    </div>
    <h4
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
              name="lu-check"
              size="24"
            />
          </template>
        </RuiAutoComplete>
      </div>
    </div>
  </ComponentView>
</template>
