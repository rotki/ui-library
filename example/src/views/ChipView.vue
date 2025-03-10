<script lang="ts" setup>
import ComponentGroup from '@/components/ComponentGroup.vue';
import ComponentView from '@/components/ComponentView.vue';
import { type ChipProps, RuiChip } from '@rotki/ui-library';

const colors = ['grey', 'primary', 'secondary', 'error', 'warning', 'info', 'success'] as const;

const variants = ['filled', 'outlined'] as const;

const attributes: Partial<ChipProps>[] = [
  { disabled: false, closeable: true },
  { disabled: true, closeable: true },
  { disabled: false, closeable: false },
  { disabled: false, closeable: false, tile: true },
  { disabled: false, closeable: false, tile: true, clickable: true },
  { disabled: false, closeable: true, size: 'sm' },
  { disabled: true, closeable: true, size: 'sm' },
];

const chips = ref<ChipProps[]>([]);
const dismissed = ref<Record<string | number, number>>({});

function generateChips(): ChipProps[] {
  const chips: ChipProps[] = [];
  for (const variant of variants) {
    for (const attr of attributes) {
      for (const color of colors) {
        chips.push(createChip(color, {
          variant,
          ...attr,
        }));
      }
    }
  }
  return chips;
}

function createChip(color: typeof colors[number], options: Partial<ChipProps>): ChipProps {
  return {
    color,
    variant: 'filled',
    ...options,
  };
}

function onRemove(identifier: number | string) {
  const status = { ...get(dismissed) };
  if (!(identifier in status))
    status[identifier] = 0;

  status[identifier]++;

  set(dismissed, status);
}

onBeforeMount(() => {
  set(chips, generateChips());
});
</script>

<template>
  <ComponentView data-cy="chips">
    <template #title>
      Chips
    </template>

    <ComponentGroup
      :items="chips"
      class="grid gap-6 grid-cols-7"
    >
      <template #item="{ item, index }">
        <RuiChip
          :data-cy="`chip-${index}`"
          v-bind="item"
          @click:close="onRemove(index)"
        >
          Chip
        </RuiChip>
        <div v-if="dismissed[index]">
          {{ dismissed[index] }} times
        </div>
      </template>
    </ComponentGroup>

    <ComponentGroup
      :items="chips"
      data-cy="chip"
      class="grid gap-6 grid-cols-7"
    >
      <template #title>
        Chips with Prepend
      </template>
      <template #item="{ item, index }">
        <RuiChip
          :data-cy="`pre-chip-${index}`"
          v-bind="item"
          @click:close="onRemove(`pre-${index}`)"
        >
          <template #prepend>
            <span>OP</span>
          </template>
          Chip
        </RuiChip>
        <div v-if="dismissed[`pre-${index}`]">
          {{ dismissed[`pre-${index}`] }} times
        </div>
      </template>
    </ComponentGroup>
  </ComponentView>
</template>
