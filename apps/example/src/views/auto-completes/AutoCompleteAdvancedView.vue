<script lang="ts" setup>
import { RuiAutoComplete } from '@rotki/ui-library/components';
import { createOptions, type SelectOption } from '@/data/options';

const objectOptions = createOptions();
const primitiveOptions: string[] = ['Lorem', 'Ipsum', 'Dolor', 'Sit amet', 'Consecteur'];

// Options with id starting at 0 for falsy value testing
const numericOptions: SelectOption[] = [
  { id: 0, label: 'Zero' },
  { id: 1, label: 'One' },
  { id: 2, label: 'Two' },
  { id: 3, label: 'Three' },
];

const returnObjectValue = ref<SelectOption>();
const returnObjectPreselected = ref<SelectOption>({ id: 1, label: 'Germany' });
const filledValue = ref<string>();
const filledOutlinedValue = ref<string>();
const falsyValue = ref<number>(0);
const searchInputValue = ref<string>();
const searchInputText = ref<string>('');

const multiClearValue = ref<string[]>(['Lorem', 'Ipsum', 'Dolor']);
const customBlurValue = ref<string>();
</script>

<template>
  <div data-cy="auto-completes-advanced">
    <h2 class="text-2xl font-bold mb-6">
      Advanced
    </h2>

    <div class="grid gap-6 grid-cols-2">
      <div class="py-4">
        <RuiAutoComplete
          v-model="returnObjectValue"
          return-object
          :options="objectOptions"
          key-attr="id"
          text-attr="label"
          label="Return Object"
          data-cy="ac-adv-return-object"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="returnObjectPreselected"
          return-object
          :options="objectOptions"
          key-attr="id"
          text-attr="label"
          label="Return Object (pre-selected)"
          data-cy="ac-adv-return-object-pre"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="filledValue"
          variant="filled"
          :options="primitiveOptions"
          label="Filled Variant"
          data-cy="ac-adv-filled"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="filledOutlinedValue"
          variant="outlined"
          :options="primitiveOptions"
          label="Outlined (comparison)"
          data-cy="ac-adv-outlined"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="falsyValue"
          :options="numericOptions"
          key-attr="id"
          text-attr="label"
          label="Falsy Value (0)"
          data-cy="ac-adv-falsy"
        />
        <div
          data-cy="ac-adv-falsy-display"
          class="mt-2 text-sm"
        >
          Model: {{ falsyValue === undefined ? 'undefined' : falsyValue }}
        </div>
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="searchInputValue"
          v-model:search-input="searchInputText"
          :options="primitiveOptions"
          label="Search Input Model"
          data-cy="ac-adv-search-input"
        />
        <div
          data-cy="ac-adv-search-display"
          class="mt-2 text-sm"
        >
          Search: "{{ searchInputText }}"
        </div>
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="multiClearValue"
          chips
          clearable
          :options="primitiveOptions"
          label="Multi Clear"
          data-cy="ac-adv-multi-clear"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="customBlurValue"
          custom-value
          :options="primitiveOptions"
          label="Custom Value on Blur"
          data-cy="ac-adv-custom-blur"
        />
      </div>
    </div>
  </div>
</template>
