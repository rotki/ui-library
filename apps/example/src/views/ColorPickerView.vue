<script setup lang='ts'>
import { RuiCard, RuiColorPicker } from '@rotki/ui-library';
import ComponentView from '@/components/ComponentView.vue';

interface ColorPickerItem {
  modelValue: string;
}

const colorPickers = ref<ColorPickerItem[]>([
  { modelValue: '' },
  { modelValue: '45858a' },
]);
</script>

<template>
  <ComponentView data-cy="color-pickers">
    <template #title>
      Color Pickers
    </template>

    <div class="grid gap-4 md:grid-cols-2 items-center justify-center">
      <div
        v-for="(item, i) in colorPickers"
        :key="i"
      >
        <RuiCard class="mb-2">
          <RuiColorPicker
            v-model="item.modelValue"
            :data-cy="`color-picker-${i}`"
          />
        </RuiCard>
        Selected value: {{ item.modelValue }}
      </div>
    </div>
  </ComponentView>
</template>
