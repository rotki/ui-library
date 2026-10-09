<script lang="ts" setup>
import { type LabelPlacement, RuiTextField, type TextFieldProps } from '@rotki/ui-library';
import VisualGrid from '@/views/visual/VisualGrid.vue';

type Variant = NonNullable<TextFieldProps['variant']>;

interface Group {
  key: string;
  placement: LabelPlacement;
  variant?: Variant;
}

interface Cell {
  id: string;
  placement: LabelPlacement;
  variant?: Variant;
  dense: boolean;
  prepend: boolean;
}

// The floating groups keep their 2.x ids, so their baselines guard the floating look
const groups: Group[] = [
  { key: 'default', placement: 'floating', variant: 'default' },
  { key: 'filled', placement: 'floating', variant: 'filled' },
  { key: 'outlined', placement: 'floating', variant: 'outlined' },
  { key: 'top', placement: 'top' },
  { key: 'hidden', placement: 'hidden' },
];
const densities: boolean[] = [false, true];
const prepends: boolean[] = [false, true];

const cells: Cell[] = [];
for (const { key, placement, variant } of groups) {
  for (const dense of densities) {
    for (const prepend of prepends) {
      cells.push({
        id: `${key}-${dense ? 'dense' : 'normal'}-${prepend ? 'prepend' : 'noprepend'}`,
        placement,
        variant,
        dense,
        prepend,
      });
    }
  }
}

const values = ref<Record<string, string>>(
  Object.fromEntries(cells.map(c => [c.id, ''])),
);
</script>

<template>
  <VisualGrid :cells="cells">
    <template #default="{ cell }">
      <RuiTextField
        v-model="values[cell.id]"
        :label-placement="cell.placement"
        :variant="cell.variant"
        :dense="cell.dense"
        :prepend-icon="cell.prepend ? 'lu-heart' : undefined"
        label="Label"
        placeholder="Placeholder"
        hide-details
      />
    </template>
  </VisualGrid>
</template>
