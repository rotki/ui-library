<script setup lang="ts">
import type { Slots } from '@/types';
import { type CalendarProps, RuiCalendar } from '@rotki/ui-library';
import { objectOmit } from '@vueuse/shared';
import ComponentView from '@/components/ComponentView.vue';

type CalendarData = CalendarProps & Slots & { modelValue: Date };

const calendars = ref<CalendarData[]>([
  {
    modelValue: new Date(2023, 0, 2),
  },
]);
</script>

<template>
  <ComponentView data-cy="calendars">
    <template #title>
      Calendar
    </template>
    <div>
      <RuiCalendar
        v-for="(field, i) in calendars"
        :key="i"
        v-model="field.modelValue"
        v-bind="objectOmit(field, ['modelValue'])"
      />
    </div>
  </ComponentView>
</template>
