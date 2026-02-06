<script lang="ts" setup>
import { RuiAutoComplete } from '@rotki/ui-library/components';
import { ref } from 'vue';
import { createOptions } from '@/data/options';

const objectOptions = createOptions();
const primitiveOptions: string[] = ['Lorem', 'Ipsum', 'Dolor', 'Sit amet', 'Consecteur'];

const filterValue = ref<number>();
const noFilterValue = ref<string>();
const customValue = ref<string>();
const customHideValue = ref<string>();
const noDataValue = ref<string>();
const hideNoDataValue = ref<string>();
const placeholderValue = ref<string>();
</script>

<template>
  <div data-cy="auto-completes-search">
    <h2 class="text-2xl font-bold mb-6">
      Search
    </h2>

    <div class="grid gap-6 grid-cols-2">
      <div class="py-4">
        <RuiAutoComplete
          v-model="filterValue"
          :options="objectOptions"
          key-attr="id"
          text-attr="label"
          label="Filter (type to search)"
          data-cy="ac-search-filter"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="noFilterValue"
          no-filter
          :options="primitiveOptions"
          label="No Filter"
          data-cy="ac-search-no-filter"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="customValue"
          custom-value
          :options="primitiveOptions"
          label="Custom Value"
          data-cy="ac-search-custom-value"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="customHideValue"
          custom-value
          hide-custom-value
          :options="primitiveOptions"
          label="Custom Value (hidden)"
          data-cy="ac-search-custom-hide"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="noDataValue"
          :options="primitiveOptions"
          no-data-text="Nothing found"
          label="No Data Text"
          data-cy="ac-search-no-data"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="hideNoDataValue"
          hide-no-data
          :options="primitiveOptions"
          label="Hide No Data"
          data-cy="ac-search-hide-no-data"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="placeholderValue"
          :options="primitiveOptions"
          placeholder="Type here..."
          label="With Placeholder"
          data-cy="ac-search-placeholder"
        />
      </div>
    </div>
  </div>
</template>
