import type { DateRange } from '../date/range';
import type { Locale } from '../locale';
import type { CalendarDay } from '../page';
import type { PopoverOptions } from '../popovers';
import { computed, type ComputedRef, reactive, toRefs } from 'vue';
import { MS_PER_MINUTE } from '../date/helpers';
import { omit } from '../helpers';

export interface ResizeOrigin {
  start: Date;
  end: Date;
  isStart: boolean;
}

export interface DragOrigin {
  day: CalendarDay;
  start: Date;
  end: Date;
  minOffsetWeeks: number;
  maxOffsetWeeks: number;
  minOffsetWeekdays: number;
  maxOffsetWeekdays: number;
  minOffsetMs: number;
  maxOffsetMs: number;
  durationMs: number;
}

export interface EventConfig {
  key: PropertyKey;
  summary: string;
  description: string;
  start: Date;
  end: Date;
  range: DateRange;
  allDay: boolean;
  color: string;
  selected: boolean;
}

export interface EventState {
  key: any;
  summary: string;
  description: string;
  range: DateRange;
  allDay: boolean;
  color: string;
  fill: string;
  selected: boolean;
  draggable: boolean;
  dragging: boolean;
  resizable: boolean;
  resizing: boolean;
  editing: boolean;
  order: number;
  snapMinutes: number;
  minDurationMinutes: number;
  maxDurationMinutes: number;
  popover: Partial<PopoverOptions> | null;
  resizeOrigin: ResizeOrigin | null;
  dragOrigin: DragOrigin | null;
}

export interface EventContext {
  days: ComputedRef<CalendarDay[]>;
  dayRows: ComputedRef<number>;
  dayColumns: ComputedRef<number>;
  isDaily: ComputedRef<boolean>;
  isMonthly: ComputedRef<boolean>;
  locale: ComputedRef<Locale>;
}

export function createEvent(config: Partial<EventConfig>, ctx: EventContext) {
  if (!config.key)
    throw new Error('Key required for events');

  const range = rangeFromConfig(config);
  if (!range) {
    throw new Error('Start and end dates required for events');
  }

  const state: EventState = reactive({
    allDay: false,
    color: 'indigo',
    description: '',
    draggable: true,
    dragging: false,
    dragOrigin: null,
    editing: false,
    fill: 'light',
    key: config.key,
    maxDurationMinutes: 0,
    minDurationMinutes: 15,
    order: 0,
    popover: null,
    range,
    resizable: true,
    resizeOrigin: null,
    resizing: false,
    selected: false,
    snapMinutes: 15,
    summary: 'New Event',
    ...omit(config, 'range', 'start', 'end'),
  });

  function rangeFromConfig({ end, range, start }: Partial<EventConfig>) {
    if (range != null)
      return range;
    if (!start || !end) {
      throw new Error('Start and end dates required for events');
    }
    return ctx.locale.value.range({ end, start });
  }

  const locale = computed(() => ctx.locale.value);

  function formatDate(date: Date, mask: string) {
    return locale.value.formatDate(date, mask);
  }

  function formatTime(date: Date) {
    if (!date)
      return '';
    return formatDate(date, 'h:mma');
  }

  const refSelector = computed(() => `[data-cell-id="${state.key}"]`);

  const startDate = computed(() => state.range.start!.date);
  const startDateTime = computed(() => startDate.value.getTime());
  const startTimeLabel = computed(() => formatTime(startDate.value));

  const endDate = computed(() => state.range.end!.date);
  const endDateTime = computed(() => endDate.value.getTime());
  const endTimeLabel = computed(() => formatTime(endDate.value));

  const timeLabel = computed(() => `${startTimeLabel.value} - ${endTimeLabel.value}`);

  const durationMs = computed(
    () => endDate.value.getTime() - startDate.value.getTime(),
  );
  const durationMinutes = computed(() => durationMs.value / MS_PER_MINUTE);

  const isMultiDay = computed(() => state.range.isMultiDay);
  const isWeekly = computed(() => state.allDay || isMultiDay.value);

  const isSolid = computed(() => state.allDay || !ctx.isMonthly.value);

  const dragIsDirty = computed(() => {
    const { dragging, dragOrigin } = state;
    if (!dragging || !dragOrigin)
      return false;
    return (
      dragOrigin.start.getTime() !== startDateTime.value
      || dragOrigin.end.getTime() !== endDateTime.value
    );
  });

  return reactive({
    ...toRefs(state),
    dragIsDirty,
    durationMinutes,
    durationMs,
    endDate,
    endDateTime,
    endTimeLabel,
    formatDate,
    isMultiDay,
    isSolid,
    isWeekly,
    refSelector,
    startDate,
    startDateTime,
    startTimeLabel,
    timeLabel,
  });
}
