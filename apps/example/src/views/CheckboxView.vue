<script lang="ts" setup>
import { type ContextColorsType, RuiCheckbox } from '@rotki/ui-library';
import ComponentGroup from '@/components/ComponentGroup.vue';
import ComponentView from '@/components/ComponentView.vue';

interface CheckboxData {
  value?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  color?: ContextColorsType;
  size?: 'sm' | 'lg';
  label?: string;
  hint?: string;
  errorMessages?: string | string[];
  successMessages?: string | string[];
  hideDetails?: boolean;
  required?: boolean;
}

const colors = ['primary', 'secondary', 'error', 'warning', 'info', 'success'] as const;
const attributes: Partial<CheckboxData>[] = [
  { value: false },
  { value: true },
  { indeterminate: true },
  { value: false, size: 'sm' },
  { value: false, size: 'lg' },
  { value: false, disabled: true },
  { value: true, disabled: true },
  { value: false, hint: 'Checkbox hint' },
  { value: false, errorMessages: ['Checkbox error message'] },
  { value: false, successMessages: ['Checkbox success message'] },
];

const checkboxes = ref<CheckboxData[]>([]);

function generateCheckboxes(): CheckboxData[] {
  const checkboxes: CheckboxData[] = [];
  for (const attrs of attributes) {
    for (const color of colors) {
      checkboxes.push({
        ...attrs,
        color,
      });
    }
  }
  return checkboxes;
}

onBeforeMount(() => {
  set(checkboxes, generateCheckboxes());
});
</script>

<template>
  <ComponentView data-cy="checkboxes">
    <template #title>
      Checkboxes
    </template>

    <ComponentGroup
      :items="checkboxes"
      class="grid gap-1 grid-rows-2 grid-cols-6"
    >
      <template #item="{ item }">
        <RuiCheckbox
          v-model="item.value"
          v-model:indeterminate="item.indeterminate"
          v-bind="item"
        >
          <span class="capitalize"> {{ item.color }} </span>
        </RuiCheckbox>
      </template>
    </ComponentGroup>

    <div />
  </ComponentView>
</template>
