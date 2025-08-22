<script setup lang="ts">
import { get, isDefined, set } from '@vueuse/core';
import { computed, provide, ref, watch } from 'vue';
import {
  CalendarStateSymbol,
  type MonthYearSelection,
  type RuiCalendarState,
} from '@/components/calendar/state';
import { useRotkiTheme } from '@/composables/theme';
import RuiCalendarGrid from './RuiCalendarGrid.vue';
import RuiCalendarHeader from './RuiCalendarHeader.vue';

export interface CalendarProps {
  maxDate?: Date | number;
  minDate?: Date | number;
  allowEmpty?: boolean;
  borderless?: boolean;
}

defineOptions({
  name: 'RuiCalendar',
  inheritAttrs: false,
});

const model = defineModel<Date | undefined>({ required: false });
const isMenuOpen = defineModel<boolean>('menu-open', { required: false, default: false });

const props = withDefaults(defineProps<CalendarProps>(), {
  maxDate: undefined,
  minDate: undefined,
  allowEmpty: false,
  borderless: false,
});

const emit = defineEmits<{
  'update:pages': [{ title: string }[]];
}>();

const currentDate = ref(isDefined(model) ? new Date(get(model)) : new Date());
const selectedDate = ref(isDefined(model) ? new Date(get(model)) : undefined);
const viewMonth = ref(get(currentDate).getMonth());
const viewYear = ref(get(currentDate).getFullYear());

const { isDark } = useRotkiTheme();

const monthTitle = computed<string>(() => {
  const date = new Date(get(viewYear), get(viewMonth));
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
});

provide(CalendarStateSymbol.valueOf(), {
  viewMonth,
  viewYear,
  selectedDate,
  maxDate: computed(() => props.maxDate ? new Date(props.maxDate) : undefined),
  minDate: computed(() => props.minDate ? new Date(props.minDate) : undefined),
  isDark,
  allowEmpty: props.allowEmpty,
} satisfies RuiCalendarState);

function moveMonth(delta: number) {
  let newMonth = get(viewMonth) + delta;
  let newYear = get(viewYear);

  if (newMonth > 11) {
    newMonth = 0;
    newYear++;
  }
  else if (newMonth < 0) {
    newMonth = 11;
    newYear--;
  }

  set(viewMonth, newMonth);
  set(viewYear, newYear);

  emit('update:pages', [{ title: get(monthTitle) }]);
}

function move(date: Date | number) {
  const newDate = new Date(date);
  set(viewMonth, newDate.getMonth());
  set(viewYear, newDate.getFullYear());
}

function selectMonth(selection: MonthYearSelection) {
  set(viewMonth, selection.month);
  set(viewYear, selection.year);
}

watch([selectedDate], ([date]) => {
  if (!date && !props.allowEmpty)
    return;

  if (date) {
    set(model, new Date(date));

    if (get(viewMonth) !== date.getMonth()) {
      set(viewMonth, date.getMonth());
    }

    if (get(viewYear) !== date.getFullYear()) {
      set(viewYear, date.getFullYear());
    }
  }
  else {
    set(model, undefined);
  }
});

watch(model, (newValue) => {
  if (newValue === undefined) {
    set(selectedDate, undefined);
    return;
  }

  const date = new Date(newValue);

  if (isDefined(selectedDate) && get(selectedDate).getTime() !== date.getTime()) {
    set(selectedDate, new Date(newValue));
    set(viewMonth, date.getMonth());
    set(viewYear, date.getFullYear());
  }
});

defineExpose({
  move,
});
</script>

<template>
  <div
    class="rui-calendar"
    :class="{ dark: isDark, bordered: !borderless }"
  >
    <RuiCalendarHeader
      v-model:menu-open="isMenuOpen"
      :title="monthTitle"
      :view-month="viewMonth"
      :view-year="viewYear"
      @prev-month="moveMonth(-1)"
      @next-month="moveMonth(1)"
      @select-month="selectMonth($event)"
    />

    <RuiCalendarGrid
      v-model="selectedDate"
      :view-month="viewMonth"
      :view-year="viewYear"
    />
  </div>
</template>

<style lang="scss">
.rui-calendar {
  @apply w-[18.75rem] bg-white overflow-hidden;

  &.bordered {
    @apply rounded-md shadow-sm border border-rui-grey-200;
  }

  &.dark {
    @apply bg-rui-grey-900;

    &.bordered {
      @apply border-rui-grey-800;
    }
  }
}
</style>
