<script setup lang="ts">
import {
  CalendarStateSymbol,
  type MonthYearSelection,
  type RuiCalendarState,
  TimeAccuracy,
} from '@/components/calendar/state';
import { computed, provide, ref, watch } from 'vue';
import RuiCalendarGrid from './RuiCalendarGrid.vue';
import RuiCalendarHeader from './RuiCalendarHeader.vue';

export interface CalendarProps {
  maxDate?: Date | number;
  minDate?: Date | number;
  allowEmpty?: boolean;
  mode?: 'date' | 'datetime' | 'time';
  timeAccuracy?: TimeAccuracy;
}

defineOptions({
  name: 'RuiCalendar',
  inheritAttrs: false,
});

const model = defineModel<Date | undefined>({ required: false });

const props = withDefaults(defineProps<CalendarProps>(), {
  maxDate: undefined,
  minDate: undefined,
  allowEmpty: false,
  mode: 'date',
  timeAccuracy: TimeAccuracy.SECONDS,
});

const emit = defineEmits<{
  'update:pages': [{ title: string }[]];
}>();

const currentDate = ref(isDefined(model) ? new Date(get(model)) : new Date());
const selectedDate = ref(isDefined(model) ? new Date(get(model)) : undefined);
const selectedTime = ref(isDefined(model) ? new Date(get(model)) : undefined);
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

watch(
  [selectedDate, selectedTime],
  ([date, time]) => {
    if (!date && !props.allowEmpty)
      return;

    if (date) {
      if (props.mode === 'date') {
        set(model, new Date(date));
      }
      else if ((props.mode === 'datetime' || props.mode === 'time') && time) {
        const newDate = new Date(date);
        newDate.setHours(time.getHours());
        newDate.setMinutes(time.getMinutes());
        newDate.setSeconds(time.getSeconds());
        newDate.setMilliseconds(time.getMilliseconds());
        set(model, newDate);
      }

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
  },
);

watch(model, (newValue) => {
  if (newValue === undefined) {
    set(selectedDate, undefined);
    return;
  }

  if (isDefined(selectedDate) && get(selectedDate).getTime() !== newValue.getTime()) {
    set(selectedDate, new Date(newValue));
    set(selectedTime, new Date(newValue));
    set(viewMonth, newValue.getMonth());
    set(viewYear, newValue.getFullYear());
  }
});

defineExpose({
  move,
});
</script>

<template>
  <div
    class="rui-calendar"
    :class="{ dark: isDark }"
  >
    <RuiCalendarHeader
      :title="monthTitle"
      :view-month="viewMonth"
      :view-year="viewYear"
      @prev-month="moveMonth(-1)"
      @next-month="moveMonth(1)"
      @select-month="selectMonth($event)"
    />

    <RuiCalendarGrid
      v-if="mode !== 'time'"
      v-model="selectedDate"
      :view-month="viewMonth"
      :view-year="viewYear"
    />
  </div>
</template>

<style lang="scss">
.rui-calendar {
  @apply w-[18.75rem] bg-white rounded-md shadow-sm overflow-hidden border border-rui-grey-200;

  &.dark {
    @apply bg-rui-grey-900 border-rui-grey-800;
  }
}
</style>
