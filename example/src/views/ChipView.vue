<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { RuiChip } from '@rotki/ui-library';

const dismissed = reactive({});

const chips = ref([
  {
    disabled: false,
    color: 'primary',
    label: 'Chip',
    dismissible: true,
  },
  {
    disabled: false,
    color: 'secondary',
    label: 'Chip',
    dismissible: true,
  },
  {
    disabled: false,
    color: 'error',
    label: 'Chip',
    dismissible: true,
  },
  {
    disabled: false,
    color: 'warning',
    label: 'Chip',
    dismissible: true,
  },
  {
    disabled: false,
    color: 'info',
    label: 'Chip',
    dismissible: true,
  },
  {
    disabled: false,
    color: 'success',
    label: 'Chip',
    dismissible: true,
  },
  {
    disabled: true,
    color: 'primary',
    label: 'Chip',
    dismissible: true,
  },
  {
    disabled: true,
    color: 'secondary',
    label: 'Chip',
    dismissible: true,
  },
  {
    disabled: true,
    color: 'error',
    label: 'Chip',
    dismissible: true,
  },
  {
    disabled: true,
    color: 'warning',
    label: 'Chip',
    dismissible: true,
  },
  {
    disabled: true,
    color: 'info',
    label: 'Chip',
    dismissible: true,
  },
  {
    disabled: true,
    color: 'success',
    label: 'Chip',
    dismissible: true,
  },
  {
    disabled: false,
    color: 'primary',
    label: 'Chip',
    dismissible: false,
  },
  {
    disabled: false,
    color: 'secondary',
    label: 'Chip',
    dismissible: false,
  },
  {
    disabled: false,
    color: 'error',
    label: 'Chip',
    dismissible: false,
  },
  {
    disabled: false,
    color: 'warning',
    label: 'Chip',
    dismissible: false,
  },
  {
    disabled: false,
    color: 'info',
    label: 'Chip',
    dismissible: false,
  },
  {
    disabled: false,
    color: 'success',
    label: 'Chip',
    dismissible: false,
  },
  {
    disabled: false,
    color: 'primary',
    label: 'Chip',
    size: 'sm',
    dismissible: true,
  },
  {
    disabled: false,
    color: 'secondary',
    label: 'Chip',
    size: 'sm',
    dismissible: true,
  },
  {
    disabled: false,
    color: 'error',
    label: 'Chip',
    size: 'sm',
    dismissible: true,
  },
  {
    disabled: false,
    color: 'warning',
    label: 'Chip',
    size: 'sm',
    dismissible: true,
  },
  {
    disabled: false,
    color: 'info',
    label: 'Chip',
    size: 'sm',
    dismissible: true,
  },
  {
    disabled: false,
    color: 'success',
    label: 'Chip',
    size: 'sm',
    dismissible: true,
  },
  {
    disabled: true,
    color: 'primary',
    label: 'Chip',
    size: 'sm',
    dismissible: true,
  },
  {
    disabled: true,
    color: 'secondary',
    label: 'Chip',
    size: 'sm',
    dismissible: true,
  },
  {
    disabled: true,
    color: 'error',
    label: 'Chip',
    size: 'sm',
    dismissible: true,
  },
  {
    disabled: true,
    color: 'warning',
    label: 'Chip',
    size: 'sm',
    dismissible: true,
  },
  {
    disabled: true,
    color: 'info',
    label: 'Chip',
    size: 'sm',
    dismissible: true,
  },
  {
    disabled: true,
    color: 'success',
    label: 'Chip',
    size: 'sm',
    dismissible: true,
  },
  {
    disabled: false,
    color: 'primary',
    label: 'Chip',
    dismissible: false,
  },
  {
    disabled: false,
    color: 'secondary',
    label: 'Chip',
    dismissible: false,
  },
  {
    disabled: false,
    color: 'error',
    label: 'Chip',
    dismissible: false,
  },
  {
    disabled: false,
    color: 'warning',
    label: 'Chip',
    dismissible: false,
  },
  {
    disabled: false,
    color: 'info',
    label: 'Chip',
    dismissible: false,
  },
  {
    disabled: false,
    color: 'success',
    label: 'Chip',
    dismissible: false,
  },
]);
const prependChips = ref([
  {
    disabled: false,
    color: 'primary',
    label: 'Chip',
    dismissible: true,
  },
  {
    disabled: false,
    color: 'secondary',
    label: 'Chip',
    dismissible: true,
  },
  {
    disabled: false,
    color: 'error',
    label: 'Chip',
    dismissible: true,
  },
  {
    disabled: false,
    color: 'warning',
    label: 'Chip',
    dismissible: true,
  },
  {
    disabled: false,
    color: 'info',
    label: 'Chip',
    dismissible: true,
  },
  {
    disabled: false,
    color: 'success',
    label: 'Chip',
    dismissible: true,
  },
  {
    disabled: true,
    color: 'primary',
    label: 'Chip',
    dismissible: true,
  },
  {
    disabled: true,
    color: 'secondary',
    label: 'Chip',
    dismissible: true,
  },
  {
    disabled: true,
    color: 'error',
    label: 'Chip',
    dismissible: true,
  },
  {
    disabled: true,
    color: 'warning',
    label: 'Chip',
    dismissible: true,
  },
  {
    disabled: true,
    color: 'info',
    label: 'Chip',
    dismissible: true,
  },
  {
    disabled: true,
    color: 'success',
    label: 'Chip',
    dismissible: true,
  },
  {
    disabled: false,
    color: 'primary',
    label: 'Chip',
    dismissible: false,
  },
  {
    disabled: false,
    color: 'secondary',
    label: 'Chip',
    dismissible: false,
  },
  {
    disabled: false,
    color: 'error',
    label: 'Chip',
    dismissible: false,
  },
  {
    disabled: false,
    color: 'warning',
    label: 'Chip',
    dismissible: false,
  },
  {
    disabled: false,
    color: 'info',
    label: 'Chip',
    dismissible: false,
  },
  {
    disabled: false,
    color: 'success',
    label: 'Chip',
    dismissible: false,
  },
  {
    disabled: false,
    color: 'primary',
    label: 'Chip',
    size: 'sm',
    dismissible: true,
  },
  {
    disabled: false,
    color: 'secondary',
    label: 'Chip',
    size: 'sm',
    dismissible: true,
  },
  {
    disabled: false,
    color: 'error',
    label: 'Chip',
    size: 'sm',
    dismissible: true,
  },
  {
    disabled: false,
    color: 'warning',
    label: 'Chip',
    size: 'sm',
    dismissible: true,
  },
  {
    disabled: false,
    color: 'info',
    label: 'Chip',
    size: 'sm',
    dismissible: true,
  },
  {
    disabled: false,
    color: 'success',
    label: 'Chip',
    size: 'sm',
    dismissible: true,
  },
  {
    disabled: true,
    color: 'primary',
    label: 'Chip',
    size: 'sm',
    dismissible: true,
  },
  {
    disabled: true,
    color: 'secondary',
    label: 'Chip',
    size: 'sm',
    dismissible: true,
  },
  {
    disabled: true,
    color: 'error',
    label: 'Chip',
    size: 'sm',
    dismissible: true,
  },
  {
    disabled: true,
    color: 'warning',
    label: 'Chip',
    size: 'sm',
    dismissible: true,
  },
  {
    disabled: true,
    color: 'info',
    label: 'Chip',
    size: 'sm',
    dismissible: true,
  },
  {
    disabled: true,
    color: 'success',
    label: 'Chip',
    size: 'sm',
    dismissible: true,
  },
  {
    disabled: false,
    color: 'primary',
    label: 'Chip',
    size: 'sm',
    dismissible: false,
  },
  {
    disabled: false,
    color: 'secondary',
    label: 'Chip',
    size: 'sm',
    dismissible: false,
  },
  {
    disabled: false,
    color: 'error',
    label: 'Chip',
    size: 'sm',
    dismissible: false,
  },
  {
    disabled: false,
    color: 'warning',
    label: 'Chip',
    size: 'sm',
    dismissible: false,
  },
  {
    disabled: false,
    color: 'info',
    label: 'Chip',
    size: 'sm',
    dismissible: false,
  },
  {
    disabled: false,
    color: 'success',
    label: 'Chip',
    size: 'sm',
    dismissible: false,
  },
]);

const onRemove = (identifier: number | string) => {
  if (!(identifier in dismissed)) {
    dismissed[identifier] = 0;
  }

  dismissed[identifier]++;
};
</script>

<template>
  <div>
    <h2 class="text-h4 mb-6" data-cy="chips">Chips</h2>
    <div class="grid gap-6 grid-cols-6">
      <div v-for="(chip, i) in chips" :key="i">
        <RuiChip :data-cy="`chip-${i}`" v-bind="chip" @remove="onRemove(i)" />
        <div v-if="dismissed[i]">{{ dismissed[i] }} times</div>
      </div>
    </div>
    <h2 class="text-h4 mb-6 mt-14" data-cy="chip">Chips with Prepend</h2>
    <div class="grid gap-6 grid-cols-6">
      <div v-for="(chip, i) in prependChips" :key="i">
        <RuiChip
          :data-cy="`pre-chip-${i}`"
          v-bind="chip"
          @remove="onRemove(`pre-${i}`)"
        >
          <template #prepend>
            <span>OP</span>
          </template>
        </RuiChip>
        <div v-if="dismissed[`pre-${i}`]">
          {{ dismissed[`pre-${i}`] }} times
        </div>
      </div>
    </div>
  </div>
</template>
