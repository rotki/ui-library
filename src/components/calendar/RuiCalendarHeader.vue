<script setup lang="ts">
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import { CalendarStateSymbol, type MonthYearSelection, type RuiCalendarState } from '@/components/calendar/state';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { computed, inject, ref } from 'vue';
import RuiCalendarMenu from './RuiCalendarMenu.vue';

defineOptions({
  name: 'RuiCalendarHeader',
  inheritAttrs: false,
});

const isMenuOpen = defineModel<boolean>('menu-open', { required: true });

const props = defineProps<{
  title: string;
  viewMonth: number;
  viewYear: number;
}>();

const emit = defineEmits<{
  'prev-month': [];
  'next-month': [];
  'select-month': [MonthYearSelection];
}>();

const anchorEl = ref<HTMLElement>();

const calendarState = inject<RuiCalendarState>(CalendarStateSymbol) as RuiCalendarState;

const canGoToNext = computed<boolean>(() => {
  const { maxDate } = calendarState;
  if (!isDefined(maxDate)) {
    return true;
  }

  const date = new Date(props.viewYear, props.viewMonth);
  return date.getTime() < get(maxDate).getTime();
});

const canGoToPrev = computed<boolean>(() => {
  const { minDate } = calendarState;
  if (!isDefined(minDate)) {
    return true;
  }

  const date = new Date(props.viewYear, props.viewMonth);
  return date.getTime() > get(minDate).getTime();
});

function handleTitleClick(e: Event) {
  set(anchorEl, e.currentTarget as HTMLElement ?? undefined);
  set(isMenuOpen, true);
}

function handleDateSelection(selection: MonthYearSelection) {
  emit('select-month', selection);
}
</script>

<template>
  <div class="calendar-header">
    <RuiButton
      type="button"
      class="nav-button"
      icon
      :disabled="!canGoToPrev"
      variant="text"
      @click.stop="emit('prev-month')"
    >
      <RuiIcon
        name="lu-chevron-left"
        size="20"
      />
    </RuiButton>

    <h3
      class="header-title"
      @click.stop="handleTitleClick($event)"
    >
      {{ title }}
      <RuiIcon
        name="lu-chevron-down"
        size="16"
        class="ml-1"
      />
    </h3>

    <RuiCalendarMenu
      v-model="isMenuOpen"
      :anchor-el="anchorEl"
      :view-month="viewMonth"
      :view-year="viewYear"
      @select="handleDateSelection($event)"
    />

    <RuiButton
      type="button"
      class="nav-button"
      variant="text"
      icon
      :disabled="!canGoToNext"
      @click.stop="emit('next-month')"
    >
      <RuiIcon
        name="lu-chevron-right"
        size="20"
      />
    </RuiButton>
  </div>
</template>

<style scoped>
.calendar-header {
  @apply flex items-center justify-between px-4 py-3;
}

.header-title {
  @apply font-medium text-gray-800 dark:text-gray-200 flex items-center cursor-pointer pl-8;
}

.nav-button {
  @apply p-1 rounded-full text-gray-500 hover:text-rui-primary hover:bg-gray-100;
  @apply dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-rui-primary;
}
</style>
