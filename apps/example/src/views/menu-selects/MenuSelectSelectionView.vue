<script lang="ts" setup>
import { RuiMenuSelect } from '@rotki/ui-library';

const primitiveOptions: string[] = ['Lorem', 'Ipsum', 'Dolor', 'Sit amet', 'Consecteur'];

const singleValue = ref<string>();
const preselectedValue = ref<string>('Lorem');
const autoFirstValue = ref<string>();
const noDataValue = ref<string>();
const hideNoDataValue = ref<string>();
</script>

<template>
  <div data-cy="menu-selects-selection">
    <h2 class="text-2xl font-bold mb-6">
      Menu Selects: Selection
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="flex flex-col space-y-2">
        <h4>Single Select</h4>
        <RuiMenuSelect
          v-model="singleValue"
          :options="primitiveOptions"
          data-cy="ms-select-single"
        />
      </div>

      <div class="flex flex-col space-y-2">
        <h4>Preselected + Clearable</h4>
        <RuiMenuSelect
          v-model="preselectedValue"
          :options="primitiveOptions"
          clearable
          data-cy="ms-select-preselected"
        />
      </div>

      <div class="flex flex-col space-y-2">
        <h4>Auto Select First</h4>
        <RuiMenuSelect
          v-model="autoFirstValue"
          :options="primitiveOptions"
          auto-select-first
          data-cy="ms-select-auto-first"
        />
      </div>

      <div class="flex flex-col space-y-2">
        <h4>No Data</h4>
        <RuiMenuSelect
          v-model="noDataValue"
          :options="[]"
          no-data-text="Nothing found"
          data-cy="ms-select-no-data"
        />
      </div>

      <div class="flex flex-col space-y-2">
        <h4>Hide No Data</h4>
        <RuiMenuSelect
          v-model="hideNoDataValue"
          :options="[]"
          hide-no-data
          data-cy="ms-select-hide-no-data"
        />
      </div>
    </div>
  </div>
</template>
