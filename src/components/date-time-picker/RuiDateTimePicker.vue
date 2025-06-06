<script lang="ts" setup>
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiCalendar from '@/components/calendar/RuiCalendar.vue';
import { timezones } from '@/components/date-time-picker/timezones';
import { type DateTimeSegmentType, isDateTimeSegmentType } from '@/components/date-time-picker/types';
import { useInputHandler } from '@/components/date-time-picker/use-input-handler';
import { guessTimezone } from '@/components/date-time-picker/utils';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiMenu from '@/components/overlays/menu/RuiMenu.vue';
import RuiTimePicker, { type TimePickerSelection } from '@/components/time-picker/RuiTimePicker.vue';
import { TimeAccuracy } from '@/consts/time-accuracy';
import { logicAnd, logicOr } from '@vueuse/math';
import dayjs, { type Dayjs } from 'dayjs';
import { RuiAutoComplete } from '~/src';

type DateFormat = 'year-first' | 'month-first' | 'day-first';

type DateTimeModelType = 'date' | 'epoch-ms' | 'epoch';

type ModelValueType<T extends DateTimeModelType> =
  T extends 'date' ? Date | undefined :
    T extends 'epoch-ms' ? number | undefined :
      T extends 'epoch' ? number | undefined :
        Date | number | undefined;

interface Segment {
  start: number;
  end: number;
  type: DateTimeSegmentType;
}

export interface RuiDateTimePickerProps {
  minDate?: Date | number;
  maxDate?: Date | number;
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
});

const baseFormats: Record<DateFormat, string> = {
  'day-first': 'DD/MM/YYYY hh:mm',
  'month-first': 'MM/DD/YYYY hh:mm',
  'year-first': 'YYYY/MM/DD hh:mm',
};

const isOpen = ref<boolean>(false);
const cursorPosition = ref<number>(0);

const selectedYear = ref<number>();
const selectedMonth = ref<number>();
const selectedDay = ref<number>();

const selectedHour = ref<number>();
const selectedMinute = ref<number>();
const selectedSecond = ref<number>();
const selectedMillisecond = ref<number>();
const selectedTimezone = ref<string | undefined>(guessTimezone());

const currentValue = ref<number>();

const textInput = ref<HTMLInputElement>();
const activator = ref();
const menuWrapperRef = ref();

const { focused: activatorFocusedWithin } = useFocusWithin(activator);
const { focused: menuWrapperFocusedWithin } = useFocusWithin(menuWrapperRef);
const { focused: searchInputFocused } = useFocus(textInput);

const { setValue, update } = useInputHandler({
  DD: selectedDay,
  MM: selectedMonth,
  YYYY: selectedYear,
  hh: selectedHour,
  mm: selectedMinute,
  ss: selectedSecond,
  SSS: selectedMillisecond,
}, currentValue);

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

  return `'  ${props.label}  '`;
});

const isOutlined = computed<boolean>(() => props.variant === 'outlined');

const dateFormat = computed<string>(() => {
  const dateFormat = props.format;
  const format = baseFormats[dateFormat];
  if (props.accuracy === 'second') {
    return format.replace('hh:mm', 'hh:mm:ss');
  }
  else if (props.accuracy === 'millisecond') {
    return format.replace('hh:mm', 'hh:mm:ss.SSS');
  }
  return format;
});

const formattedDisplay = computed<string>(() => {
  let result = get(dateFormat);

  const yearValue = getDisplayValue(selectedYear, 4);
  if (yearValue !== undefined) {
    result = result.replace('YYYY', yearValue);
  }

  const monthValue = getDisplayValue(selectedMonth, 2);
  if (monthValue !== undefined) {
    result = result.replace('MM', monthValue);
  }

  const dayValue = getDisplayValue(selectedDay, 2);
  if (dayValue !== undefined) {
    result = result.replace('DD', dayValue);
  }

  const hourValue = getDisplayValue(selectedHour, 2);
  if (hourValue !== undefined) {
    result = result.replace('hh', hourValue);
  }

  const minuteValue = getDisplayValue(selectedMinute, 2);
  if (minuteValue !== undefined) {
    result = result.replace('mm', minuteValue);
  }

  const secondValue = getDisplayValue(selectedSecond, 2);
  if (secondValue !== undefined) {
    result = result.replace('ss', secondValue);
  }

  const millisecondValue = getDisplayValue(selectedMillisecond, 3);
  if (millisecondValue !== undefined) {
    result = result.replace('SSS', millisecondValue);
  }

  return result;
});

const formatSegments = computed<string[]>(() => {
  const format = get(dateFormat);
  return format.split(/([\s./:])/g).filter(Boolean);
});

const segmentPositions = computed<Segment[]>(() => {
  const segments = get(formatSegments);
  const positions: Segment[] = [];
  let currentPosition = 0;

  segments.forEach((segment) => {
    if (!/[\s./:]/.test(segment)) {
      assert(isDateTimeSegmentType(segment), `Invalid date format segment: ${segment}`);
      positions.push({
        start: currentPosition,
        end: currentPosition + segment.length,
        type: segment,
      });
    }
    currentPosition += segment.length;
  });

  return positions;
});

const timeSelection = computed<TimePickerSelection>({
  get() {
    const currentSegment = getCurrentSegment(get(cursorPosition));
    const type = currentSegment?.type;

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
    let segmentType: string = 'hh';
    if (value === 'minute') {
      segmentType = 'mm';
    }
    else if (value === 'second') {
      segmentType = 'ss';
    }
    else if (value === 'millisecond') {
      segmentType = 'SSS';
    }

    const segments = get(segmentPositions).find(segment => segment.type === segmentType);
    if (segments) {
      setCursorPosition(segments);
    }
  },
});

const float = logicAnd(logicOr(isOpen, valueSet, searchInputFocused), isOutlined);

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
  if (!segmentType || segmentType === 'YY')
    set(selectedYear, undefined);
  if (!segmentType || segmentType === 'MM')
    set(selectedMonth, undefined);
  if (!segmentType || segmentType === 'DD')
    set(selectedDay, undefined);
  if (!segmentType || segmentType === 'hh')
    set(selectedHour, undefined);
  if (!segmentType || segmentType === 'mm')
    set(selectedMinute, undefined);
  if (!segmentType || segmentType === 'ss')
    set(selectedSecond, undefined);
  if (!segmentType || segmentType === 'SSS')
    set(selectedMillisecond, undefined);

  set(currentValue, undefined);
}

function onInputDeletePressed(event: KeyboardEvent): void {
  if (!(event.target instanceof HTMLInputElement)) {
    return;
  }
  const selectionStart = event.target.selectionStart ?? 0;
  const segment = getCurrentSegment(selectionStart);
  if (segment) {
    clear(segment.type);
    setCursorPosition(segment);
  }
}

function arrowClicked(event: any): void {
  if (get(isOpen)) {
    set(isOpen, false);
    event.stopPropagation();
  }
}

function handleBlur(): void {

}

function setCursorPosition(segment: Segment): void {
  set(cursorPosition, segment.end);

  nextTick(() => {
    if (isDefined(textInput)) {
      const input = get(textInput);
      input.setSelectionRange(segment.start, segment.end);
      input.focus();
    }
  });
}

function handleFocus(): void {
  if (get(cursorPosition) !== 0) {
    return;
  }
  const firstSegment = get(segmentPositions)[0];
  if (firstSegment) {
    setCursorPosition(firstSegment);
  }
}

function handleInputSelection(event: Event): void {
  const target = event.target as HTMLInputElement;
  set(cursorPosition, target.selectionStart || 0);
}

function handleClick(event: MouseEvent): void {
  if (props.disabled || props.readonly)
    return;

  const eventTarget = event.target;
  if (!(eventTarget instanceof HTMLInputElement)) {
    return;
  }
  const position = eventTarget.selectionStart || 0;
  const currentSegment = getCurrentSegment(position);
  if (currentSegment)
    setCursorPosition(currentSegment);
}

function getCurrentSegment(position: number = get(cursorPosition)) {
  const segments = get(segmentPositions);
  return segments.find(
    segment => position >= segment.start && position <= segment.end,
  );
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

function changeSegmentValue(increment: boolean): void {
  if (!isDefined(textInput))
    return;

  const currentSegment = getCurrentSegment();

  if (!currentSegment)
    return;

  const segmentMethods = {
    DD: 'date',
    MM: 'month',
    YYYY: 'year',
    hh: 'hour',
    mm: 'minute',
    ss: 'second',
    SSS: 'millisecond',
  } as const;

  const segmentType = currentSegment.type;
  const method = segmentMethods[segmentType];
  const selectedDate = getDateTime();
  const updatedDate = selectedDate.set(method, selectedDate.get(method) + (increment ? 1 : -1));
  setValue(segmentType, segmentType === 'MM' ? updatedDate.get(method) + 1 : updatedDate.get(method));
  setCursorPosition(currentSegment);
}

function navigateSegments(key: string) {
  const position = get(cursorPosition);
  const positions = get(segmentPositions);
  const currentSegmentIndex = positions.findIndex(
    segment => position >= segment.start && position <= segment.end,
  );

  if (currentSegmentIndex === -1) {
    return;
  }

  set(currentValue, undefined);

  let nextSegmentIndex: number;
  if (key === 'ArrowRight') {
    nextSegmentIndex = currentSegmentIndex + 1;
    if (nextSegmentIndex < positions.length) {
      const nextSegment = positions[nextSegmentIndex];
      setCursorPosition(nextSegment);
    }
  }
  else {
    nextSegmentIndex = currentSegmentIndex - 1;
    if (nextSegmentIndex >= 0) {
      const nextSegment = positions[nextSegmentIndex];
      setCursorPosition(nextSegment);
    }
  }
}

function handleDigitPressed(event: KeyboardEvent, digit: string): void {
  if (!(event.target instanceof HTMLInputElement)) {
    return;
  }
  const position = event.target.selectionStart || 0;
  const currentSegment = getCurrentSegment(position);
  if (!currentSegment)
    return;

  const number = parseInt(digit);
  if (isNaN(number))
    return;

  const segmentConfig: Record<DateTimeSegmentType, { maxValue: number }> = {
    DD: { maxValue: 31 },
    MM: { maxValue: 12 },
    YYYY: { maxValue: 9999 },
    hh: { maxValue: 23 },
    mm: { maxValue: 59 },
    ss: { maxValue: 59 },
    SSS: { maxValue: 999 },
  };

  const segmentType = currentSegment.type;

  if (isDateTimeSegmentType(segmentType)) {
    const config = segmentConfig[segmentType];
    const value = get(currentValue) ?? '';
    const combinedValue = parseInt(`${value}${digit}`);
    const nextCombinedValue = parseInt(`${value}${digit}0`);

    const maxLength = segmentType.length;
    const adjustedCombinedValue = segmentType === 'MM' ? combinedValue - 1 : combinedValue;

    if (adjustedCombinedValue <= config.maxValue) {
      setValue(segmentType, combinedValue);
      setCursorPosition(currentSegment);
    }

    const willExceedMax = nextCombinedValue > config.maxValue;
    const reachedMaxLength = adjustedCombinedValue.toString().length >= maxLength;

    if (willExceedMax || reachedMaxLength) {
      navigateSegments('ArrowRight');
    }
  }
}

function handleKeyboardNavigation(event: KeyboardEvent): void {
  if (event.key === 'ArrowUp') {
    changeSegmentValue(true);
  }
  else if (event.key === 'ArrowDown') {
    changeSegmentValue(false);
  }
}

function handleBackspace(event: KeyboardEvent) {
  if (!(event.target instanceof HTMLInputElement)) {
    return;
  }
  const position = event.target.selectionStart || 0;
  const currentSegment = getCurrentSegment(position);
  if (!currentSegment)
    return;

  const value = get(currentValue) ?? '';
  const updatedValue = value.toString().slice(0, -1);
  setValue(currentSegment.type, updatedValue.length === 0 ? undefined : parseInt(updatedValue));
  setCursorPosition(currentSegment);
}

function handleKeyDown(event: KeyboardEvent): void {
  if (props.disabled || props.readonly)
    return;

  const { key } = event;

  if (['Tab'].includes(key)) {
    return;
  }

  event.preventDefault();

  if (key === 'ArrowRight' || key === 'ArrowLeft') {
    navigateSegments(key);
  }
  else if (key === 'ArrowUp' || key === 'ArrowDown') {
    handleKeyboardNavigation(event);
  }
  else if (key === 'Backspace') {
    handleBackspace(event);
  }
  else if (key === 'Delete') {
    onInputDeletePressed(event);
  }
  else if (/^\d$/.test(key)) {
    handleDigitPressed(event, key);
  }
}

function setNow(): void {
  const date = dayjs();
  set(selectedYear, date.year());
  set(selectedMonth, date.month() + 1);
  set(selectedDay, date.date());
  set(selectedHour, date.hour());
  set(selectedMinute, date.minute());
  const includeSeconds = props.accuracy === TimeAccuracy.SECOND || props.accuracy === TimeAccuracy.MILLISECOND;
  const includesMilliseconds = TimeAccuracy.MILLISECOND === props.accuracy;
  set(selectedSecond, includeSeconds ? date.second() : 0);
  set(selectedMillisecond, includesMilliseconds ? date.millisecond() : 0);

  updateModelValue();
}

function updateModelValue(): void {
  if (!(isDefined(selectedDate) && isDefined(selectedTime))) {
    set(modelValue, undefined);
  }
  else {
    const date = get(selectedDate);
    const time = get(selectedTime);

    const updatedModel = isDefined(modelValue) ? new Date(get(modelValue)) : new Date();
    updatedModel.setFullYear(date.getFullYear());
    updatedModel.setMonth(date.getMonth());
    updatedModel.setDate(date.getDate());
    updatedModel.setHours(time.getHours());
    updatedModel.setMinutes(time.getMinutes());
    updatedModel.setSeconds(time.getSeconds());
    updatedModel.setMilliseconds(time.getMilliseconds());

    if (props.type === 'date') {
      set(modelValue, updatedModel);
    }
    else if (props.type === 'epoch-ms') {
      set(modelValue, updatedModel.getTime());
    }
    else if (props.type === 'epoch') {
      set(modelValue, updatedModel.getTime() / 1000);
    }
  }
}

watch([selectedDate, selectedTime], updateModelValue);

watch(modelValue, (value: Date | number | undefined) => {
  if (value === undefined) {
    clear();
  }
  else {
    if (props.type === 'date' || props.type === 'epoch-ms') {
      update(new Date(value), props.accuracy);
    }
    else if (props.type === 'epoch') {
      assert(typeof value === 'number');
      update(new Date(value / 1000), props.accuracy);
    }
  }
});

onMounted(() => {
  if (!props.allowEmpty) {
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
    :error-messages="errorMessages"
    :close-on-content-click="false"
    :show-details="!hideDetails"
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
          v-if="isOutlined && (searchInputFocused || open)"
          :class="[
            $style.label,
            {
              'absolute': isOutlined,
              'pr-2': !valueSet && !open && isOutlined,
            },
          ]"
        >
          {{ label }}
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
            @blur="handleBlur()"
            @focus="handleFocus()"
            @select="handleInputSelection($event)"
            @click="handleClick($event)"
            @keydown="handleKeyDown($event)"
          />
        </div>

        <RuiButton
          v-if="allowEmpty && valueSet && !disabled"
          variant="text"
          icon
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
      <div
        ref="menuWrapperRef"
        class="flex gap-2"
      >
        <RuiCalendar
          v-model="selectedDate"
          borderless
          :max-date="maxDate"
          :min-date="minDate"
        />
        <RuiTimePicker
          v-model="selectedTime"
          v-model:hour="selectedHour"
          v-model:minute="selectedMinute"
          v-model:second="selectedSecond"
          v-model:millisecond="selectedMillisecond"
          v-model:selection="timeSelection"
          :accuracy="accuracy"
          borderless
        />
        <div>
          <div class="flex gap-2">
            <div class="flex flex-col justify-center items-center">
              <RuiButton
                variant="text"
                icon
                @click="setNow()"
              >
                <RuiIcon
                  name="lu-clock"
                  size="18"
                />
              </RuiButton>
            </div>
            <RuiAutoComplete
              v-model="selectedTimezone"
              hide-details
              label="Timezone"
              class="!p-4 pb-0"
              variant="outlined"
              :options="timezones"
            />
          </div>
        </div>
      </div>
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
