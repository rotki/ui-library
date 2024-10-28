<script lang="ts" setup>
import { type ChipProps, RuiChip } from '@rotki/ui-library';
import ComponentView from '@/components/ComponentView.vue';

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

    <div class="grid gap-6 grid-cols-7">
      <div
        v-for="(chip, i) in chips"
        :key="i"
      >
        <RuiChip
          :data-cy="`chip-${i}`"
          v-bind="chip"
          @click:close="onRemove(i)"
        >
          Chip
        </RuiChip>
        <div v-if="dismissed[i]">
          {{ dismissed[i] }} times
        </div>
      </div>
    </div>
    <h2
      class="text-h4 mb-6 mt-14"
      data-cy="chip"
    >
      Chips with Prepend
    </h2>
    <div class="grid gap-6 grid-cols-7">
      <div
        v-for="(chip, i) in chips"
        :key="i"
      >
        <RuiChip
          :data-cy="`pre-chip-${i}`"
          v-bind="chip"
          @click:close="onRemove(`pre-${i}`)"
        >
          <template #prepend>
            <span>OP</span>
          </template>
          Chip
        </RuiChip>
        <div v-if="dismissed[`pre-${i}`]">
          {{ dismissed[`pre-${i}`] }} times
        </div>
      </div>
    </div>
  </ComponentView>
</template>
