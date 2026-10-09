<script lang="ts" setup>
import { type LabelPlacement, RuiTextField } from '@rotki/ui-library';
import VisualGrid from '@/views/visual/VisualGrid.vue';

interface Cell {
  id: string;
  placement: LabelPlacement;
  dense: boolean;
  prepend: boolean;
}

const placements: LabelPlacement[] = ['top', 'hidden'];
const densities: boolean[] = [false, true];
const prepends: boolean[] = [false, true];

const cells: Cell[] = [];
for (const placement of placements) {
  for (const dense of densities) {
    for (const prepend of prepends) {
      cells.push({
        id: `${placement}-${dense ? 'dense' : 'normal'}-${prepend ? 'prepend' : 'noprepend'}`,
        placement,
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
        :dense="cell.dense"
        :prepend-icon="cell.prepend ? 'lu-heart' : undefined"
        label="Label"
        placeholder="Placeholder"
        hide-details
      />
    </template>
  </VisualGrid>
</template>
