<script setup lang="ts">
import type { ExtractPropTypes } from 'vue';
import ComponentView from '@/components/ComponentView.vue';
import { RuiTimePicker } from '@rotki/ui-library';
import { objectOmit } from '@vueuse/shared';

type RuiTimePickerProps = ExtractPropTypes<typeof RuiTimePicker['props']>;

const timePickers = ref<RuiTimePickerProps[]>([{
  modelValue: new Date(2023, 0, 2, 20, 20),
}]);
</script>

<template>
  <ComponentView data-cy="timepickers">
    <template #title>
      Time Pickers
    </template>
    <div>
      <RuiTimePicker
        v-for="(field, i) in timePickers"
        :key="i"
        v-model="field.modelValue"
        v-bind="objectOmit(field, ['modelValue'])"
      />
    </div>
  </ComponentView>
</template>
