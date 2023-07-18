<script lang="ts" setup>
import { RuiCheckbox } from '@rotki/ui-library';
import { ref } from 'vue';

const checkboxes = ref([
  { value: false, color: 'primary' },
  { value: false, color: 'secondary' },
  { value: false, color: 'error' },
  { value: false, color: 'warning' },
  { value: false, color: 'info' },
  { value: false, color: 'success' },

  { value: true, color: 'primary' },
  { value: true, color: 'secondary' },
  { value: true, color: 'error' },
  { value: true, color: 'warning' },
  { value: true, color: 'info' },
  { value: true, color: 'success' },

  { indeterminate: true, color: 'primary' },
  { indeterminate: true, color: 'secondary' },
  { indeterminate: true, color: 'error' },
  { indeterminate: true, color: 'warning' },
  { indeterminate: true, color: 'info' },
  { indeterminate: true, color: 'success' },

  { value: false, color: 'primary', size: 'sm' },
  { value: false, color: 'secondary', size: 'sm' },
  { value: false, color: 'error', size: 'sm' },
  { value: false, color: 'warning', size: 'sm' },
  { value: false, color: 'info', size: 'sm' },
  { value: false, color: 'success', size: 'sm' },

  { value: false, color: 'primary', size: 'lg' },
  { value: false, color: 'secondary', size: 'lg' },
  { value: false, color: 'error', size: 'lg' },
  { value: false, color: 'warning', size: 'lg' },
  { value: false, color: 'info', size: 'lg' },
  { value: false, color: 'success', size: 'lg' },

  { value: false, color: 'primary', disabled: true },
  { value: false, color: 'secondary', disabled: true },
  { value: false, color: 'error', disabled: true },
  { value: false, color: 'warning', disabled: true },
  { value: false, color: 'info', disabled: true },
  { value: false, color: 'success', disabled: true },

  { value: false, color: 'primary', hint: 'Checkbox hint' },
  { value: false, color: 'secondary', hint: 'Checkbox hint' },
  { value: false, color: 'error', hint: 'Checkbox hint' },
  { value: false, color: 'warning', hint: 'Checkbox hint' },
  { value: false, color: 'info', hint: 'Checkbox hint' },
  { value: false, color: 'success', hint: 'Checkbox hint' },

  { value: false, color: 'primary', errorMessages: ['Checkbox error message'] },
  {
    value: false,
    color: 'secondary',
    errorMessages: ['Checkbox error message'],
  },
  { value: false, color: 'error', errorMessages: ['Checkbox error message'] },
  { value: false, color: 'warning', errorMessages: ['Checkbox error message'] },
  { value: false, color: 'info', errorMessages: ['Checkbox error message'] },
  { value: false, color: 'success', errorMessages: ['Checkbox error message'] },
]);
</script>

<template>
  <div>
    <h2 class="text-h4 mb-6" data-cy="checkboxes">Checkboxes</h2>
    <div class="grid gap-1 grid-rows-2 grid-cols-6">
      <RuiCheckbox
        v-for="(checkbox, i) in checkboxes"
        :key="i"
        v-model="checkbox.value"
        v-model:indeterminate="checkbox.indeterminate"
        v-bind="checkbox"
      >
        <span class="capitalize"> {{ checkbox.color }} </span>
      </RuiCheckbox>
    </div>
  </div>
</template>
