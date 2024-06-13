<script lang="ts" setup>
import { type ChipProps, RuiChip } from '@rotki/ui-library';

const dismissed = ref<Record<string | number, number>>({});

const chips = ref<ChipProps[]>([
  {
    disabled: false,
    color: 'grey',
    variant: 'filled',
    closeable: true,
  },
  {
    disabled: false,
    color: 'primary',
    variant: 'filled',
    closeable: true,
  },
  {
    disabled: false,
    color: 'secondary',
    variant: 'filled',
    closeable: true,
  },
  {
    disabled: false,
    color: 'error',
    variant: 'filled',
    closeable: true,
  },
  {
    disabled: false,
    color: 'warning',
    variant: 'filled',
    closeable: true,
  },
  {
    disabled: false,
    color: 'info',
    variant: 'filled',
    closeable: true,
  },
  {
    disabled: false,
    color: 'success',
    variant: 'filled',
    closeable: true,
  },
  {
    disabled: true,
    color: 'grey',
    variant: 'filled',
    closeable: true,
  },
  {
    disabled: true,
    color: 'primary',
    variant: 'filled',
    closeable: true,
  },
  {
    disabled: true,
    color: 'secondary',
    variant: 'filled',
    closeable: true,
  },
  {
    disabled: true,
    color: 'error',
    variant: 'filled',
    closeable: true,
  },
  {
    disabled: true,
    color: 'warning',
    variant: 'filled',
    closeable: true,
  },
  {
    disabled: true,
    color: 'info',
    variant: 'filled',
    closeable: true,
  },
  {
    disabled: true,
    color: 'success',
    variant: 'filled',
    closeable: true,
  },
  {
    disabled: false,
    color: 'grey',
    variant: 'filled',
    closeable: false,
  },
  {
    disabled: false,
    color: 'primary',
    variant: 'filled',
    closeable: false,
  },
  {
    disabled: false,
    color: 'secondary',
    variant: 'filled',
    closeable: false,
  },
  {
    disabled: false,
    color: 'error',
    variant: 'filled',
    closeable: false,
  },
  {
    disabled: false,
    color: 'warning',
    variant: 'filled',
    closeable: false,
  },
  {
    disabled: false,
    color: 'info',
    variant: 'filled',
    closeable: false,
  },
  {
    disabled: false,
    color: 'success',
    variant: 'filled',
    closeable: false,
  },
  {
    disabled: false,
    color: 'grey',
    variant: 'filled',
    closeable: false,
    tile: true,
  },
  {
    disabled: false,
    color: 'primary',
    variant: 'filled',
    closeable: false,
    tile: true,
  },
  {
    disabled: false,
    color: 'secondary',
    variant: 'filled',
    closeable: false,
    tile: true,
  },
  {
    disabled: false,
    color: 'error',
    variant: 'filled',
    closeable: false,
    tile: true,
  },
  {
    disabled: false,
    color: 'warning',
    variant: 'filled',
    closeable: false,
    tile: true,
  },
  {
    disabled: false,
    color: 'info',
    variant: 'filled',
    closeable: false,
    tile: true,
  },
  {
    disabled: false,
    color: 'success',
    variant: 'filled',
    closeable: false,
    tile: true,
  },

  {
    disabled: false,
    color: 'grey',
    variant: 'filled',
    closeable: false,
    tile: true,
    clickable: true,
  },
  {
    disabled: false,
    color: 'primary',
    variant: 'filled',
    closeable: false,
    tile: true,
    clickable: true,
  },
  {
    disabled: false,
    color: 'secondary',
    variant: 'filled',
    closeable: false,
    tile: true,
    clickable: true,
  },
  {
    disabled: false,
    color: 'error',
    variant: 'filled',
    closeable: false,
    tile: true,
    clickable: true,
  },
  {
    disabled: false,
    color: 'warning',
    variant: 'filled',
    closeable: false,
    tile: true,
    clickable: true,
  },
  {
    disabled: false,
    color: 'info',
    variant: 'filled',
    closeable: false,
    tile: true,
    clickable: true,
  },
  {
    disabled: false,
    color: 'success',
    variant: 'filled',
    closeable: false,
    tile: true,
    clickable: true,
  },
  {
    disabled: false,
    color: 'grey',
    variant: 'filled',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: false,
    color: 'primary',
    variant: 'filled',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: false,
    color: 'secondary',
    variant: 'filled',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: false,
    color: 'error',
    variant: 'filled',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: false,
    color: 'warning',
    variant: 'filled',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: false,
    color: 'info',
    variant: 'filled',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: false,
    color: 'success',
    variant: 'filled',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: true,
    color: 'grey',
    variant: 'filled',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: true,
    color: 'primary',
    variant: 'filled',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: true,
    color: 'secondary',
    variant: 'filled',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: true,
    color: 'error',
    variant: 'filled',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: true,
    color: 'warning',
    variant: 'filled',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: true,
    color: 'info',
    variant: 'filled',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: true,
    color: 'success',
    variant: 'filled',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: false,
    color: 'grey',
    variant: 'filled',
    closeable: false,
  },
  {
    disabled: false,
    color: 'primary',
    variant: 'filled',
    closeable: false,
  },
  {
    disabled: false,
    color: 'secondary',
    variant: 'filled',
    closeable: false,
  },
  {
    disabled: false,
    color: 'error',
    variant: 'filled',
    closeable: false,
  },
  {
    disabled: false,
    color: 'warning',
    variant: 'filled',
    closeable: false,
  },
  {
    disabled: false,
    color: 'info',
    variant: 'filled',
    closeable: false,
  },
  {
    disabled: false,
    color: 'success',
    variant: 'filled',
    closeable: false,
  },
  {
    disabled: false,
    color: 'grey',
    variant: 'outlined',
    closeable: true,
  },
  {
    disabled: false,
    color: 'primary',
    variant: 'outlined',
    closeable: true,
  },
  {
    disabled: false,
    color: 'secondary',
    variant: 'outlined',
    closeable: true,
  },
  {
    disabled: false,
    color: 'error',
    variant: 'outlined',
    closeable: true,
  },
  {
    disabled: false,
    color: 'warning',
    variant: 'outlined',
    closeable: true,
  },
  {
    disabled: false,
    color: 'info',
    variant: 'outlined',
    closeable: true,
  },
  {
    disabled: false,
    color: 'success',
    variant: 'outlined',
    closeable: true,
  },
  {
    disabled: true,
    color: 'grey',
    variant: 'outlined',
    closeable: true,
  },
  {
    disabled: true,
    color: 'primary',
    variant: 'outlined',
    closeable: true,
  },
  {
    disabled: true,
    color: 'secondary',
    variant: 'outlined',
    closeable: true,
  },
  {
    disabled: true,
    color: 'error',
    variant: 'outlined',
    closeable: true,
  },
  {
    disabled: true,
    color: 'warning',
    variant: 'outlined',
    closeable: true,
  },
  {
    disabled: true,
    color: 'info',
    variant: 'outlined',
    closeable: true,
  },
  {
    disabled: true,
    color: 'success',
    variant: 'outlined',
    closeable: true,
  },
  {
    disabled: false,
    color: 'grey',
    variant: 'outlined',
    closeable: false,
  },
  {
    disabled: false,
    color: 'primary',
    variant: 'outlined',
    closeable: false,
  },
  {
    disabled: false,
    color: 'secondary',
    variant: 'outlined',
    closeable: false,
  },
  {
    disabled: false,
    color: 'error',
    variant: 'outlined',
    closeable: false,
  },
  {
    disabled: false,
    color: 'warning',
    variant: 'outlined',
    closeable: false,
  },
  {
    disabled: false,
    color: 'info',
    variant: 'outlined',
    closeable: false,
  },
  {
    disabled: false,
    color: 'success',
    variant: 'outlined',
    closeable: false,
  },
  {
    disabled: false,
    color: 'grey',
    variant: 'outlined',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: false,
    color: 'primary',
    variant: 'outlined',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: false,
    color: 'secondary',
    variant: 'outlined',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: false,
    color: 'error',
    variant: 'outlined',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: false,
    color: 'warning',
    variant: 'outlined',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: false,
    color: 'info',
    variant: 'outlined',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: false,
    color: 'success',
    variant: 'outlined',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: true,
    color: 'grey',
    variant: 'outlined',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: true,
    color: 'primary',
    variant: 'outlined',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: true,
    color: 'secondary',
    variant: 'outlined',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: true,
    color: 'error',
    variant: 'outlined',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: true,
    color: 'warning',
    variant: 'outlined',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: true,
    color: 'info',
    variant: 'outlined',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: true,
    color: 'success',
    variant: 'outlined',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: false,
    color: 'grey',
    variant: 'outlined',
    closeable: false,
  },
  {
    disabled: false,
    color: 'primary',
    variant: 'outlined',
    closeable: false,
  },
  {
    disabled: false,
    color: 'secondary',
    variant: 'outlined',
    closeable: false,
  },
  {
    disabled: false,
    color: 'error',
    variant: 'outlined',
    closeable: false,
  },
  {
    disabled: false,
    color: 'warning',
    variant: 'outlined',
    closeable: false,
  },
  {
    disabled: false,
    color: 'info',
    variant: 'outlined',
    closeable: false,
  },
  {
    disabled: false,
    color: 'success',
    variant: 'outlined',
    closeable: false,
  },
]);

const prependChips = ref<ChipProps[]>([
  {
    disabled: false,
    color: 'grey',
    variant: 'filled',
    closeable: true,
  },
  {
    disabled: false,
    color: 'primary',
    variant: 'filled',
    closeable: true,
  },
  {
    disabled: false,
    color: 'secondary',
    variant: 'filled',
    closeable: true,
  },
  {
    disabled: false,
    color: 'error',
    variant: 'filled',
    closeable: true,
  },
  {
    disabled: false,
    color: 'warning',
    variant: 'filled',
    closeable: true,
  },
  {
    disabled: false,
    color: 'info',
    variant: 'filled',
    closeable: true,
  },
  {
    disabled: false,
    color: 'success',
    variant: 'filled',
    closeable: true,
  },
  {
    disabled: true,
    color: 'grey',
    variant: 'filled',
    closeable: true,
  },
  {
    disabled: true,
    color: 'primary',
    variant: 'filled',
    closeable: true,
  },
  {
    disabled: true,
    color: 'secondary',
    variant: 'filled',
    closeable: true,
  },
  {
    disabled: true,
    color: 'error',
    variant: 'filled',
    closeable: true,
  },
  {
    disabled: true,
    color: 'warning',
    variant: 'filled',
    closeable: true,
  },
  {
    disabled: true,
    color: 'info',
    variant: 'filled',
    closeable: true,
  },
  {
    disabled: true,
    color: 'success',
    variant: 'filled',
    closeable: true,
  },
  {
    disabled: false,
    color: 'grey',
    variant: 'filled',
    closeable: false,
  },
  {
    disabled: false,
    color: 'primary',
    variant: 'filled',
    closeable: false,
  },
  {
    disabled: false,
    color: 'secondary',
    variant: 'filled',
    closeable: false,
  },
  {
    disabled: false,
    color: 'error',
    variant: 'filled',
    closeable: false,
  },
  {
    disabled: false,
    color: 'warning',
    variant: 'filled',
    closeable: false,
  },
  {
    disabled: false,
    color: 'info',
    variant: 'filled',
    closeable: false,
  },
  {
    disabled: false,
    color: 'success',
    variant: 'filled',
    closeable: false,
  },
  {
    disabled: false,
    color: 'grey',
    variant: 'filled',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: false,
    color: 'primary',
    variant: 'filled',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: false,
    color: 'secondary',
    variant: 'filled',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: false,
    color: 'error',
    variant: 'filled',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: false,
    color: 'warning',
    variant: 'filled',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: false,
    color: 'info',
    variant: 'filled',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: false,
    color: 'success',
    variant: 'filled',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: true,
    color: 'grey',
    variant: 'filled',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: true,
    color: 'primary',
    variant: 'filled',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: true,
    color: 'secondary',
    variant: 'filled',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: true,
    color: 'error',
    variant: 'filled',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: true,
    color: 'warning',
    variant: 'filled',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: true,
    color: 'info',
    variant: 'filled',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: true,
    color: 'success',
    variant: 'filled',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: false,
    color: 'grey',
    variant: 'filled',
    size: 'sm',
    closeable: false,
  },
  {
    disabled: false,
    color: 'primary',
    variant: 'filled',
    size: 'sm',
    closeable: false,
  },
  {
    disabled: false,
    color: 'secondary',
    variant: 'filled',
    size: 'sm',
    closeable: false,
  },
  {
    disabled: false,
    color: 'error',
    variant: 'filled',
    size: 'sm',
    closeable: false,
  },
  {
    disabled: false,
    color: 'warning',
    variant: 'filled',
    size: 'sm',
    closeable: false,
  },
  {
    disabled: false,
    color: 'info',
    variant: 'filled',
    size: 'sm',
    closeable: false,
  },
  {
    disabled: false,
    color: 'success',
    variant: 'filled',
    size: 'sm',
    closeable: false,
  },
  {
    disabled: false,
    color: 'grey',
    variant: 'outlined',
    closeable: true,
  },
  {
    disabled: false,
    color: 'primary',
    variant: 'outlined',
    closeable: true,
  },
  {
    disabled: false,
    color: 'secondary',
    variant: 'outlined',
    closeable: true,
  },
  {
    disabled: false,
    color: 'error',
    variant: 'outlined',
    closeable: true,
  },
  {
    disabled: false,
    color: 'warning',
    variant: 'outlined',
    closeable: true,
  },
  {
    disabled: false,
    color: 'info',
    variant: 'outlined',
    closeable: true,
  },
  {
    disabled: false,
    color: 'success',
    variant: 'outlined',
    closeable: true,
  },
  {
    disabled: true,
    color: 'grey',
    variant: 'outlined',
    closeable: true,
  },
  {
    disabled: true,
    color: 'primary',
    variant: 'outlined',
    closeable: true,
  },
  {
    disabled: true,
    color: 'secondary',
    variant: 'outlined',
    closeable: true,
  },
  {
    disabled: true,
    color: 'error',
    variant: 'outlined',
    closeable: true,
  },
  {
    disabled: true,
    color: 'warning',
    variant: 'outlined',
    closeable: true,
  },
  {
    disabled: true,
    color: 'info',
    variant: 'outlined',
    closeable: true,
  },
  {
    disabled: true,
    color: 'success',
    variant: 'outlined',
    closeable: true,
  },
  {
    disabled: false,
    color: 'grey',
    variant: 'outlined',
    closeable: false,
  },
  {
    disabled: false,
    color: 'primary',
    variant: 'outlined',
    closeable: false,
  },
  {
    disabled: false,
    color: 'secondary',
    variant: 'outlined',
    closeable: false,
  },
  {
    disabled: false,
    color: 'error',
    variant: 'outlined',
    closeable: false,
  },
  {
    disabled: false,
    color: 'warning',
    variant: 'outlined',
    closeable: false,
  },
  {
    disabled: false,
    color: 'info',
    variant: 'outlined',
    closeable: false,
  },
  {
    disabled: false,
    color: 'success',
    variant: 'outlined',
    closeable: false,
  },
  {
    disabled: false,
    color: 'grey',
    variant: 'outlined',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: false,
    color: 'primary',
    variant: 'outlined',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: false,
    color: 'secondary',
    variant: 'outlined',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: false,
    color: 'error',
    variant: 'outlined',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: false,
    color: 'warning',
    variant: 'outlined',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: false,
    color: 'info',
    variant: 'outlined',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: false,
    color: 'success',
    variant: 'outlined',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: true,
    color: 'grey',
    variant: 'outlined',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: true,
    color: 'primary',
    variant: 'outlined',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: true,
    color: 'secondary',
    variant: 'outlined',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: true,
    color: 'error',
    variant: 'outlined',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: true,
    color: 'warning',
    variant: 'outlined',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: true,
    color: 'info',
    variant: 'outlined',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: true,
    color: 'success',
    variant: 'outlined',
    size: 'sm',
    closeable: true,
  },
  {
    disabled: false,
    color: 'grey',
    variant: 'outlined',
    size: 'sm',
    closeable: false,
  },
  {
    disabled: false,
    color: 'primary',
    variant: 'outlined',
    size: 'sm',
    closeable: false,
  },
  {
    disabled: false,
    color: 'secondary',
    variant: 'outlined',
    size: 'sm',
    closeable: false,
  },
  {
    disabled: false,
    color: 'error',
    variant: 'outlined',
    size: 'sm',
    closeable: false,
  },
  {
    disabled: false,
    color: 'warning',
    variant: 'outlined',
    size: 'sm',
    closeable: false,
  },
  {
    disabled: false,
    color: 'info',
    variant: 'outlined',
    size: 'sm',
    closeable: false,
  },
  {
    disabled: false,
    color: 'success',
    variant: 'outlined',
    size: 'sm',
    closeable: false,
  },
]);

function onRemove(identifier: number | string) {
  const status = { ...get(dismissed) };
  if (!(identifier in status))
    status[identifier] = 0;

  status[identifier]++;

  set(dismissed, status);
}
</script>

<template>
  <div>
    <h2
      class="text-h4 mb-6"
      data-cy="chips"
    >
      Chips
    </h2>
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
        v-for="(chip, i) in prependChips"
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
  </div>
</template>
