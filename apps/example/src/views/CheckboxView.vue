<script lang="ts" setup>
import { type ContextColorsType, type FormDetails, RuiCheckbox, RuiCheckboxGroup } from '@rotki/ui-library';
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
  details?: FormDetails;
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

const checkboxGroups = ref<{
  value: string[];
  disabled?: boolean;
  size?: 'sm' | 'lg';
  inline?: boolean;
  options: { value: string; color: ContextColorsType }[];
}[]>([
  {
    value: ['apples', 'oranges'],
    inline: true,
    options: [
      { value: 'apples', color: 'primary' },
      { value: 'oranges', color: 'secondary' },
      { value: 'grapes', color: 'success' },
      { value: 'bananas', color: 'warning' },
    ],
  },
  {
    value: [],
    size: 'sm',
    inline: true,
    options: [
      { value: 'a', color: 'primary' },
      { value: 'b', color: 'secondary' },
      { value: 'c', color: 'success' },
    ],
  },
  {
    value: ['x'],
    disabled: true,
    size: 'lg',
    inline: true,
    options: [
      { value: 'x', color: 'primary' },
      { value: 'y', color: 'secondary' },
      { value: 'z', color: 'error' },
    ],
  },
]);

const numericCheckboxGroup = ref<{ value: number[]; options: { value: number; label: string }[] }>({
  value: [1, 3],
  options: [
    { value: 1, label: 'One' },
    { value: 2, label: 'Two' },
    { value: 3, label: 'Three' },
    { value: 4, label: 'Four' },
  ],
});

const underLabel = ref<{ backup: boolean; terms: boolean; wrap: boolean }>({ backup: true, terms: false, wrap: false });
</script>

<template>
  <ComponentView data-id="checkboxes">
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

    <h2
      class="text-h4 mb-6"
      data-id="checkbox-group-title"
    >
      Checkbox Groups
    </h2>
    <div
      class="grid gap-8"
      data-id="checkbox-group-wrapper"
    >
      <RuiCheckboxGroup
        v-for="(group, i) in checkboxGroups"
        :key="i"
        v-model="group.value"
        :disabled="group.disabled"
        :size="group.size"
        :inline="group.inline"
        :hint="`Selected: ${group.value.join(', ') || 'none'}`"
        :data-id="`checkbox-group-${i}`"
      >
        <RuiCheckbox
          v-for="(option, j) in group.options"
          :key="j"
          :value="option.value"
          :color="option.color"
        >
          <span class="capitalize">{{ option.value }}</span>
        </RuiCheckbox>
      </RuiCheckboxGroup>
      <RuiCheckboxGroup
        v-model="numericCheckboxGroup.value"
        :hint="`Selected: ${numericCheckboxGroup.value.join(', ') || 'none'}`"
        label="Numeric values"
        data-id="checkbox-group-numeric"
        inline
      >
        <RuiCheckbox
          v-for="(option, j) in numericCheckboxGroup.options"
          :key="j"
          :value="option.value"
        >
          {{ option.label }}
        </RuiCheckbox>
      </RuiCheckboxGroup>
    </div>

    <h4 class="mt-10 mb-3">
      Details under the label
    </h4>
    <div class="flex gap-10">
      <div
        class="flex flex-col w-80"
        data-id="checkbox-under-label"
      >
        <RuiCheckbox
          v-model="underLabel.backup"
          label="Back up the database daily"
          hint="Keeps the last seven copies"
          details="auto"
          details-under-label
          data-id="checkbox-under-label-md"
        />
        <RuiCheckbox
          v-model="underLabel.terms"
          size="lg"
          label="I accept the terms"
          error-messages="Accept the terms to continue"
          details="auto"
          details-under-label
          data-id="checkbox-under-label-lg"
        />
      </div>
      <div class="w-40">
        <RuiCheckbox
          v-model="underLabel.wrap"
          label="Show the long version of this label"
          hint="A hint under two lines"
          details="auto"
          details-under-label
          data-id="checkbox-under-label-wrap"
        />
      </div>
    </div>
  </ComponentView>
</template>
