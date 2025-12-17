<script lang="ts" setup>
import type { DateTimeSegmentType } from '@/components/date-time-picker/types';
import type { TimePickerSelection } from '@/components/time-picker/RuiTimePicker.vue';
import type { TimeAccuracy } from '@/consts/time-accuracy';
import { logicAnd, logicOr } from '@vueuse/math';
import dayjs, { type Dayjs } from 'dayjs';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiDateTimePickerMenu from '@/components/date-time-picker/RuiDateTimePickerMenu.vue';
import { useInputHandler } from '@/components/date-time-picker/use-input-handler';
import { useKeyboardHandler } from '@/components/date-time-picker/use-keyboard-handler';
import { guessTimezone, includeMilliseconds, includeSeconds } from '@/components/date-time-picker/utils';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiMenu from '@/components/overlays/menu/RuiMenu.vue';
import { useRuiI8n } from '@/composables/use-rui-i18n';
import { RUI_I18N_KEYS } from '@/i18n/keys';

type DateFormat = 'year-first' | 'month-first' | 'day-first';

type DateTimeModelType = 'date' | 'epoch-ms' | 'epoch';

type ModelValueType<T extends DateTimeModelType> =
  T extends 'date' ? Date | undefined :
    T extends 'epoch-ms' ? number | undefined :
      T extends 'epoch' ? number | undefined :
        Date | number | undefined;

export interface RuiDateTimePickerProps {
  minDate?: Date | number;
  maxDate?: Date | number | 'now';
  format?: DateFormat;
  type?: DateTimeModelType;
  accuracy?: TimeAccuracy;
  disabled?: boolean;
  allowEmpty?: boolean;
  readonly?: boolean;
  dense?: boolean;
  label?: string;
  variant?: 'default' | 'filled' | 'outlined';
  hint?: string;
  errorMessages?: string | string[];
  successMessages?: string | string[];
  hideDetails?: boolean;
  required?: boolean;
}

defineOptions({
  name: 'RuiDateTimePicker',
  inheritAttrs: false,
});

const modelValue = defineModel<ModelValueType<typeof props.type>>({ required: true });

const props = withDefaults(defineProps<RuiDateTimePickerProps>(), {
  disabled: false,
  readonly: false,
  allowEmpty: false,
  dense: false,
  type: 'epoch-ms',
  hideDetails: false,
  label: 'Pick a date',
  variant: 'default',
  hint: undefined,
  maxDate: undefined,
  minDate: undefined,
  format: 'day-first',
  accuracy: 'minute',
  errorMessages: () => [],
  successMessages: () => [],
  required: false,
});

defineSlots<{
  'menu-content': () => any;
}>();

const baseFormats: Record<DateFormat, string> = {
  'day-first': 'DD/MM/YYYY HH:mm',
  'month-first': 'MM/DD/YYYY HH:mm',
  'year-first': 'YYYY/MM/DD HH:mm',
};

const MILLISECONDS = 1000;

const isOpen = ref<boolean>(false);
const cursorPosition = ref<number>(0);
const internalErrorMessages = ref<string[]>([]);

const selectedYear = ref<number>();
const selectedMonth = ref<number>();
const selectedDay = ref<number>();

const selectedHour = ref<number>();
const selectedMinute = ref<number>();
const selectedSecond = ref<number>();
const selectedMillisecond = ref<number>();
const selectedTimezone = ref<string | undefined>(guessTimezone());

const currentValue = ref<number>();
const now = ref(dayjs.tz(undefined, guessTimezone()));

const textInput = ref<HTMLInputElement>();
const activator = ref();
const menuWrapperRef = ref();
const calendarMenuOpen = ref<boolean>(false);

const { focused: activatorFocusedWithin } = useFocusWithin(activator);
const { focused: menuWrapperFocusedWithin } = useFocusWithin(menuWrapperRef);
const { focused: searchInputFocused } = useFocus(textInput);

const { setValue, update, getCurrent } = useInputHandler({
  DD: selectedDay,
  MM: selectedMonth,
  YYYY: selectedYear,
  HH: selectedHour,
  mm: selectedMinute,
  ss: selectedSecond,
  SSS: selectedMillisecond,
}, currentValue);

const minAllowedDate = computed<Date>(() => {
  if (props.minDate === undefined) {
    return new Date(1970, 0, 1);
  }

  if (props.type === 'epoch' && typeof props.minDate === 'number') {
    return new Date(props.minDate * MILLISECONDS);
  }

  return new Date(props.minDate);
});

const maxAllowedDate = computed<Date | undefined>(() => {
  if (props.maxDate === undefined) {
    return undefined;
  }
  if (props.maxDate === 'now') {
    return get(now).toDate();
  }
  if (props.type === 'epoch' && typeof props.maxDate === 'number') {
    return new Date(props.maxDate * MILLISECONDS);
  }
  return new Date(props.maxDate);
});

const dateFormat = computed<string>(() => {
  const dateFormat = props.format;
  const format = baseFormats[dateFormat];
  if (props.accuracy === 'second') {
    return format.replace('HH:mm', 'HH:mm:ss');
  }
  else if (props.accuracy === 'millisecond') {
    return format.replace('HH:mm', 'HH:mm:ss.SSS');
  }
  return format;
});

const {
  clear: clearSegment,
  getCurrentSegment,
  handleClick,
  handleFocus,
  handleInput,
  handleInputSelection,
  handleKeyDown,
  handlePaste,
  setSegment,
} = useKeyboardHandler({
  currentValue,
  cursorPosition,
  disabled: props.disabled,
  getDateTime,
  getCurrent,
  readonly: props.readonly,
  dateFormat,
  setValue,
  textInput,
  accuracy: props.accuracy,
});

const { t } = useRuiI8n();

function handleInputClick(event: MouseEvent): void {
  // Open menu if not already open
  if (!get(isOpen)) {
    set(isOpen, true);
  }
  // Handle segment selection
  handleClick(event);
}

const anyFocused = logicOr(activatorFocusedWithin, menuWrapperFocusedWithin);

const selectedDate = computed<Date | undefined>({
  set(value?: Date) {
    set(selectedYear, value?.getFullYear());
    set(selectedMonth, value ? value.getMonth() + 1 : undefined);
    set(selectedDay, value?.getDate());
  },
  get() {
    if (!(isDefined(selectedYear) && isDefined(selectedMonth) && isDefined(selectedDay))) {
      return undefined;
    }
    const date = new Date();
    date.setFullYear(get(selectedYear));
    date.setMonth(get(selectedMonth) - 1);
    date.setDate(get(selectedDay));
    return date;
  },
});

const selectedTime = computed<Date | undefined>({
  set(value?: Date) {
    set(selectedHour, value?.getHours());
    set(selectedMinute, value?.getMinutes());
    set(selectedSecond, value?.getSeconds());
    set(selectedMillisecond, value?.getMilliseconds());
  },
  get() {
    if (!(isDefined(selectedHour) && isDefined(selectedMinute))) {
      return undefined;
    }
    const date = new Date();
    date.setHours(
      get(selectedHour),
      get(selectedMinute),
      get(selectedSecond) ?? 0,
      get(selectedMillisecond) ?? 0,
    );
    return date;
  },
});

const valueSet = computed<boolean>(() => isDefined(selectedDate) && isDefined(selectedTime));

const labelWithQuote = computed<string>(() => {
  if (!props.label)
    return '"\\200B"';

  const asterisk = props.required ? '﹡' : '';
  return `'  ${props.label}${asterisk}  '`;
});

const isOutlined = computed<boolean>(() => props.variant === 'outlined');

const formattedDisplay = computed<string>(() => {
  let result = get(dateFormat);

  const replacements = [
    { pattern: 'YYYY', value: getDisplayValue(selectedYear, 4) },
    { pattern: 'MM', value: getDisplayValue(selectedMonth, 2) },
    { pattern: 'DD', value: getDisplayValue(selectedDay, 2) },
    { pattern: 'HH', value: getDisplayValue(selectedHour, 2) },
    { pattern: 'mm', value: getDisplayValue(selectedMinute, 2) },
    { pattern: 'ss', value: getDisplayValue(selectedSecond, 2) },
    { pattern: 'SSS', value: getDisplayValue(selectedMillisecond, 3) },
  ];

  for (const { pattern, value } of replacements) {
    if (value !== undefined) {
      result = result.replace(pattern, value);
    }
  }

  return result;
});

const timeSelection = computed<TimePickerSelection>({
  get() {
    const type = getCurrentSegment()?.type;

    if (type === 'mm') {
      return 'minute';
    }
    else if (type === 'ss') {
      return 'second';
    }
    else if (type === 'SSS') {
      return 'millisecond';
    }
    return 'hour';
  },
  set(value: TimePickerSelection) {
    let segmentType: DateTimeSegmentType = 'HH';
    if (value === 'minute') {
      segmentType = 'mm';
    }
    else if (value === 'second') {
      segmentType = 'ss';
    }
    else if (value === 'millisecond') {
      segmentType = 'SSS';
    }

    setSegment(segmentType);
  },
});

const float = logicAnd(logicOr(isOpen, valueSet, searchInputFocused), isOutlined);

const combinedErrorMessages = computed<string[]>(() => {
  let propErrors: string[];
  if (props.errorMessages) {
    propErrors = Array.isArray(props.errorMessages)
      ? props.errorMessages
      : [props.errorMessages];
  }
  else {
    propErrors = Array.isArray(props.errorMessages)
      ? props.errorMessages
      : [];
  }
  return [...propErrors, ...get(internalErrorMessages)];
});

function getDisplayValue(digit: Ref<number | undefined>, padding: number): string | undefined {
  return isDefined(digit)
    ? get(digit).toString().padStart(padding, '0')
    : undefined;
}

async function setInputFocus(): Promise<void> {
  await nextTick(() => {
    set(searchInputFocused, true);
  });
}

function clear(segmentType?: string): void {
  set(internalErrorMessages, []);

  if (!segmentType) {
    set(selectedYear, undefined);
    set(selectedMonth, undefined);
    set(selectedDay, undefined);
    set(selectedHour, undefined);
    set(selectedMinute, undefined);
    set(selectedSecond, undefined);
    set(selectedMillisecond, undefined);
    set(currentValue, undefined);
    set(modelValue, undefined);
    return;
  }

  clearSegment(segmentType);
}

function arrowClicked(event: any): void {
  if (get(isOpen)) {
    set(isOpen, false);
    event.stopPropagation();
  }
}

function getDateTime(): Dayjs {
  let dateTime = dayjs();
  if (isDefined(selectedYear)) {
    dateTime = dateTime.year(get(selectedYear));
  }

  if (isDefined(selectedMonth)) {
    dateTime = dateTime.month(get(selectedMonth) - 1);
  }

  if (isDefined(selectedDay)) {
    const daysInMonth = dateTime.daysInMonth();
    const day = Math.min(get(selectedDay), daysInMonth);
    dateTime = dateTime.date(day);
  }

  if (isDefined(selectedHour)) {
    dateTime = dateTime.hour(get(selectedHour));
  }

  if (isDefined(selectedMinute)) {
    dateTime = dateTime.minute(get(selectedMinute));
  }

  if (isDefined(selectedSecond)) {
    dateTime = dateTime.second(get(selectedSecond));
  }

  if (isDefined(selectedMillisecond)) {
    dateTime = dateTime.millisecond(get(selectedMillisecond));
  }

  return dateTime;
}

function setNow(): void {
  set(internalErrorMessages, []);

  const date = dayjs();
  set(now, date);
  set(selectedYear, date.year());
  set(selectedMonth, date.month() + 1);
  set(selectedDay, date.date());
  set(selectedHour, date.hour());
  set(selectedMinute, date.minute());
  set(selectedSecond, includeSeconds(props.accuracy) ? date.second() : 0);
  set(selectedMillisecond, includeMilliseconds(props.accuracy) ? date.millisecond() : 0);

  nextTick(() => {
    updateModelValue();
  });
}

function isDateValid(date: Dayjs): boolean {
  const min = get(minAllowedDate);
  const max = get(maxAllowedDate);

  set(internalErrorMessages, []);

  if (min && date.isBefore(min)) {
    const errorMessage = t(RUI_I18N_KEYS.dateTimePicker.dateBeforeMin, {
      date: min.toLocaleDateString(),
    }, `Date cannot be before ${min.toLocaleDateString()}`);
    set(internalErrorMessages, [...get(internalErrorMessages), errorMessage]);
    return false;
  }

  if (max && date.isAfter(max)) {
    const nowError = t(RUI_I18N_KEYS.dateTimePicker.dateInFuture, 'The selected date cannot be in the future');
    const maxError = t(RUI_I18N_KEYS.dateTimePicker.dateAfterMax, { date: max.toLocaleDateString() }, `Date cannot be after ${max.toLocaleDateString()}`);
    const errorMessage = props.maxDate === 'now' ? nowError : maxError;
    set(internalErrorMessages, [...get(internalErrorMessages), errorMessage]);
    return false;
  }

  return true;
}

function emitUpdate(updatedModel: Dayjs) {
  const typeMap = {
    'date': () => updatedModel.toDate(),
    'epoch-ms': () => updatedModel.valueOf(),
    'epoch': () => updatedModel.valueOf() / MILLISECONDS,
  } as const;

  set(modelValue, typeMap[props.type]());
}

function updateModelValue(): void {
  if (!isDefined(selectedDate) || !isDefined(selectedTime)) {
    return;
  }

  if (!(isDefined(selectedDate) && isDefined(selectedTime))) {
    set(modelValue, undefined);
  }
  else {
    const date = get(selectedDate);
    const time = get(selectedTime);

    const updatedModel = dayjs.tz(isDefined(modelValue) ? get(modelValue) : undefined, get(selectedTimezone))
      .year(date.getFullYear())
      .month(date.getMonth())
      .date(date.getDate())
      .hour(time.getHours())
      .minute(time.getMinutes())
      .second(includeSeconds(props.accuracy) ? time.getSeconds() : 0)
      .millisecond(includeMilliseconds(props.accuracy) ? time.getMilliseconds() : 0);

    if (!isDateValid(updatedModel)) {
      return;
    }

    emitUpdate(updatedModel);
  }
}

const { ignoreUpdates } = watchIgnorable([selectedDate, selectedTime], ([selectedDate, selectedTime], [prevSelectedDate, prevSelectedTime]) => {
  const currentTimezone = get(selectedTimezone);
  const newSelectedDate = dayjs.tz(selectedDate, currentTimezone);
  const oldSelectedDate = dayjs.tz(prevSelectedDate, currentTimezone);
  const newSelectedTime = dayjs.tz(selectedTime, currentTimezone);
  const oldSelectedTime = dayjs.tz(prevSelectedTime, currentTimezone);

  if (newSelectedDate.isSame(oldSelectedDate) && newSelectedTime.isSame(oldSelectedTime)) {
    return;
  }

  set(now, dayjs());
  updateModelValue();
});

function updateInternalModel(value: ModelValueType<typeof props.type>) {
  ignoreUpdates(() => {
    const updatedValue = props.type === 'epoch' && typeof value === 'number'
      ? value * MILLISECONDS
      : value;
    const date = dayjs.tz(updatedValue, get(selectedTimezone));
    isDateValid(date);
    update(date, props.accuracy);
  });
}

watch(selectedTimezone, (newTimezone: string | undefined) => {
  if (newTimezone && isDefined(selectedDate) && isDefined(selectedTime)) {
    set(now, dayjs());
    updateModelValue();
  }
});

watch(modelValue, (value) => {
  set(now, dayjs());
  if (value === undefined) {
    clear();
  }
  else {
    updateInternalModel(value);
  }
});

onMounted(() => {
  if (isDefined(modelValue)) {
    updateInternalModel(get(modelValue));
  }
  else if (!props.allowEmpty) {
    setNow();
  }
});
</script>

<template>
  <RuiMenu
    v-model="isOpen"
    :class="$style.wrapper"
    :dense="dense"
    :hint="hint"
    :disabled="disabled"
    :success-messages="successMessages"
    :error-messages="combinedErrorMessages"
    :close-on-content-click="false"
    :show-details="!hideDetails"
    :persistent="calendarMenuOpen"
    :popper="{
      placement: 'bottom-start',
    }"
    full-width
    v-bind="{
      ...getRootAttrs($attrs),
    }"
  >
    <template #activator="{ attrs, open, hasError, hasSuccess }">
      <div
        ref="activator"
        class="group"
        :class="[
          $style.activator,
          {
            [$style.disabled]: disabled,
            [$style.readonly]: readonly,
            [$style.outlined]: isOutlined,
            [$style.dense]: dense,
            [$style.float]: float,
            [$style.opened]: open,
            [$style['with-value']]: valueSet,
            [$style['with-error']]: hasError,
            [$style['with-success']]: hasSuccess && !hasError,
          },
        ]"
        v-bind="{
          ...getNonRootAttrs($attrs, ['onClick', 'class']),
          ...(props.readonly ? {} : attrs) }
        "
        data-id="activator"
        :tabindex="disabled || props.readonly ? -1 : 0"
        @click="setInputFocus()"
      >
        <span
          v-if="isOutlined && (searchInputFocused || open || valueSet)"
          :class="[
            $style.label,
            {
              'absolute': isOutlined,
              'pr-2': !valueSet && !open && isOutlined,
            },
          ]"
        >
          {{ label }}
          <span
            v-if="props.required"
            class="text-rui-error"
          >
            ﹡
          </span>
        </span>

        <span :class="[$style.icon__wrapper, $style.icon__prepend]">
          <RuiIcon
            :class="[$style.icon]"
            :size="dense ? 16 : 24"
            name="lu-calendar-days"
          />
        </span>

        <div :class="$style.value">
          <input
            ref="textInput"
            :disabled="disabled"
            :value="formattedDisplay"
            class="bg-transparent outline-none flex-1 min-w-0"
            type="text"
            :placeholder="dateFormat"
            :readonly="readonly"
            @focus="handleFocus()"
            @select="handleInputSelection($event)"
            @click.stop="handleInputClick($event)"
            @keydown="handleKeyDown($event)"
            @paste="handlePaste($event)"
            @input="handleInput($event)"
          />
        </div>

        <RuiButton
          v-if="allowEmpty && valueSet && !disabled"
          variant="text"
          icon
          data-id="clear-button"
          size="sm"
          tabindex="-1"
          color="error"
          class="group-hover:!visible"
          :class="[$style.clear, anyFocused && '!visible', {
            'mr-2': !dense,
          }]"
          @click.stop.prevent="clear()"
        >
          <RuiIcon
            name="lu-x"
            size="18"
          />
        </RuiButton>

        <span
          :class="[$style.icon__wrapper, $style.icon__append]"
          @click="arrowClicked($event)"
        >
          <RuiIcon
            :class="[$style.icon, { 'rotate-180': open }]"
            :size="dense ? 16 : 24"
            name="lu-chevron-down"
          />
        </span>
      </div>
      <fieldset
        v-if="isOutlined"
        :class="$style.fieldset"
      >
        <legend :class="{ 'px-2': float }" />
      </fieldset>
    </template>
    <template #default>
      <RuiDateTimePickerMenu
        ref="menuWrapperRef"
        v-model:selected-date="selectedDate"
        v-model:selected-time="selectedTime"
        v-model:selected-hour="selectedHour"
        v-model:selected-minute="selectedMinute"
        v-model:selected-second="selectedSecond"
        v-model:selected-millisecond="selectedMillisecond"
        v-model:time-selection="timeSelection"
        v-model:selected-timezone="selectedTimezone"
        v-model:calendar-menu-open="calendarMenuOpen"
        :accuracy="accuracy"
        :max-date="maxAllowedDate"
        :min-date="minAllowedDate"
        @set-now="setNow()"
      >
        <slot name="menu-content" />
      </RuiDateTimePickerMenu>
    </template>
  </RuiMenu>
</template>

<style lang="scss" module>
.wrapper {
  @apply w-full inline-flex flex-col;

  .activator {
    @apply relative inline-flex items-center w-full;
    @apply outline-none focus-within:outline-none cursor-pointer min-h-14 pl-3 py-2 pr-8 rounded;
    @apply m-0 bg-white transition-all text-body-1 text-left hover:border-black;

    &:not(.outlined) {
      @apply hover:bg-gray-100 focus-within:bg-gray-100;
    }

    &.dense {
      @apply py-1.5 min-h-10;

      ~ .fieldset {
        @apply px-2;
      }
    }

    &.disabled {
      @apply opacity-65 text-rui-text-disabled active:text-rui-text-disabled cursor-default pointer-events-none;
    }

    &.readonly {
      @apply opacity-80 pointer-events-none cursor-default bg-gray-50;
    }

    &.outlined {
      @apply border-none hover:border-none;

      &.opened,
      &:focus,
      &:focus-within {
        @apply border-rui-primary;

        ~ .fieldset {
          @apply border-rui-primary #{!important};
          @apply border-2 #{!important};
        }
      }

      ~ .fieldset {
        @apply border border-black/[0.23];
      }

      &:hover {
        ~ .fieldset {
          @apply border-black;
        }
      }

      &.disabled {
        ~ .fieldset {
          @apply border-dotted;
          @apply border border-black/[0.23] #{!important};
        }
      }

      &.with-success {
        .label {
          @apply text-rui-success #{!important};
        }

        ~ .fieldset {
          @apply border-rui-success #{!important};
        }
      }

      &.with-error {
        .label {
          @apply text-rui-error #{!important};
        }

        ~ .fieldset {
          @apply border-rui-error #{!important};
        }
      }
    }

    .label {
      @apply text-rui-text-secondary;
      max-width: calc(100% - 2.5rem);
    }

    .label,
    .value {
      @apply block truncate transition-all duration-75;
    }

    .value {
      @apply flex gap-1 flex-wrap flex-1 ps-8;
    }

    .clear {
      @apply ml-auto shrink-0 invisible;
    }

    .icon {
      @apply text-rui-text-secondary transition;

      &__wrapper {
        @apply flex items-center justify-end;
        @apply absolute top-px bottom-0;
      }

      &__append {
        @apply right-3;
      }

      &__prepend {
        @apply left-3;
      }
    }

    &.float {
      .label {
        @apply -translate-y-2 top-0 text-xs px-1;
      }

      ~ .fieldset {
        legend {
          &:after {
            content: v-bind(labelWithQuote);
          }
        }
      }

      &.opened,
      &.opened.with-value,
      &:focus,
      &:focus.with-value,
      &:focus-within,
      &:focus-within.with-value {
        .label {
          @apply text-rui-primary;
        }

        ~ .fieldset {
          @apply border-rui-primary;
          @apply border-2 #{!important};
        }
      }
    }
  }

  .fieldset {
    @apply absolute w-full min-w-0 h-[calc(100%+0.5rem)] top-0 left-0 rounded pointer-events-none px-2 transition-all -mt-2;

    legend {
      @apply opacity-0 text-xs truncate;
      max-width: calc(100% - 1rem);

      &:before {
        content: ' ';
      }

      &:after {
        @apply truncate max-w-full leading-[0];
        content: '\200B';
      }
    }
  }
}

.menu {
  @apply overflow-y-auto max-h-60 min-w-[2.5rem];
}

.highlighted {
  @apply bg-rui-grey-200 #{!important};

  &.active {
    @apply bg-rui-grey-300 #{!important};
  }
}

:global(.dark) {
  .wrapper {
    .activator {
      @apply bg-transparent text-rui-text;

      &:not(.outlined) {
        @apply hover:bg-white/10 focus-within:bg-white/10;

        &.disabled {
          @apply bg-white/10;
        }
      }

      &.readonly {
        @apply bg-white/10;
      }

      &.outlined {
        ~ .fieldset {
          @apply border-white/[0.23];
        }

        &.disabled {
          ~ .fieldset {
            @apply border-white/[0.23] #{!important};
          }
        }

        &:hover {
          ~ .fieldset {
            @apply border-white;
          }
        }
      }
    }
  }

  .highlighted {
    @apply bg-rui-grey-800 #{!important};

    &.active {
      @apply bg-rui-grey-700 #{!important};
    }
  }
}
</style>
