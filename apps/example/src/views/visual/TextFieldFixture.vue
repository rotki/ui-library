<script lang="ts" setup>
import { RuiTextField, type TextFieldProps } from '@rotki/ui-library';
import VisualGrid from '@/views/visual/VisualGrid.vue';

type Variant = NonNullable<TextFieldProps['variant']>;

interface Cell {
  id: string;
  variant: Variant;
  dense: boolean;
  prepend: boolean;
}

const variants: Variant[] = ['default', 'filled', 'outlined'];
const densities: boolean[] = [false, true];
const prepends: boolean[] = [false, true];

const cells: Cell[] = [];
for (const variant of variants) {
  for (const dense of densities) {
    for (const prepend of prepends) {
      cells.push({
        id: `${variant}-${dense ? 'dense' : 'normal'}-${prepend ? 'prepend' : 'noprepend'}`,
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
