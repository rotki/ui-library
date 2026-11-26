<script setup lang="ts">
import { RuiTimePicker } from '@rotki/ui-library';
import { objectOmit } from '@vueuse/shared';
import { type ExtractPropTypes, ref } from 'vue';
import ComponentView from '@/components/ComponentView.vue';

type RuiTimePickerProps = ExtractPropTypes<typeof RuiTimePicker['props']>;

const timePickers = ref<RuiTimePickerProps[]>([
  {
    modelValue: new Date(2023, 0, 2, 20, 20),
  },
  {
    modelValue: new Date(2023, 0, 2, 14, 30, 45),
    accuracy: 'second',
  },
]);
</script>

<template>
  <ComponentView data-id="timepickers">
    <template #title>
      Time Pickers
    </template>
    <div class="grid gap-6 grid-cols-2">
      <RuiTimePicker
        v-for="(field, i) in timePickers"
        :key="i"
        v-model="field.modelValue"
        data-id="timepicker"
        :data-index="i"
        v-bind="objectOmit(field, ['modelValue'])"
      />
    </div>
  </ComponentView>
</template>
