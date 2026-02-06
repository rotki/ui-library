<script lang="ts" setup>
import { RuiAutoComplete } from '@rotki/ui-library/components';
import { ref } from 'vue';

const primitiveOptions: string[] = ['Lorem', 'Ipsum', 'Dolor', 'Sit amet', 'Consecteur'];

const singleValue = ref<string | undefined>(undefined);
const singlePreselectedValue = ref<string | undefined>('Lorem');
const multiValue = ref<string[]>([]);
const multiPreselectedValue = ref<string[]>(['Lorem', 'Ipsum']);
const autoFirstValue = ref<string | undefined>(undefined);
const hideSelectedValue = ref<string[]>([]);
</script>

<template>
  <div data-cy="auto-completes-selection">
    <h2 class="text-2xl font-bold mb-6">
      Selection
    </h2>

    <div class="grid gap-6 grid-cols-2">
      <div class="py-4">
        <RuiAutoComplete
          v-model="singleValue"
          :options="primitiveOptions"
          label="Single Select"
          data-cy="ac-select-single"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="singlePreselectedValue"
          clearable
          :options="primitiveOptions"
          label="Single Pre-selected"
          data-cy="ac-select-single-preselected"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="multiValue"
          chips
          :options="primitiveOptions"
          label="Multi Select"
          data-cy="ac-select-multi"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="multiPreselectedValue"
          chips
          :options="primitiveOptions"
          label="Multi Pre-selected"
          data-cy="ac-select-multi-preselected"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="autoFirstValue"
          auto-select-first
          :options="primitiveOptions"
          label="Auto Select First"
          data-cy="ac-select-auto-first"
        />
      </div>

      <div class="py-4">
        <RuiAutoComplete
          v-model="hideSelectedValue"
          chips
          hide-selected
          :options="primitiveOptions"
          label="Hide Selected"
          data-cy="ac-select-hide-selected"
        />
      </div>
    </div>
  </div>
</template>
