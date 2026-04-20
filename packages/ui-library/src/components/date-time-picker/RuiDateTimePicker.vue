<script lang="ts" setup>
import type { DateTimeSegmentType } from '@/components/date-time-picker/types';
import type { TimePickerSelection } from '@/components/time-picker/RuiTimePicker.vue';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import { dateTimePickerStyles, type DateTimePickerVariant } from '@/components/date-time-picker/date-time-picker-styles';
import RuiDateTimePickerMenu from '@/components/date-time-picker/RuiDateTimePickerMenu.vue';
import { useDateTimeSelection } from '@/components/date-time-picker/use-date-time-selection';
import { useInputHandler } from '@/components/date-time-picker/use-input-handler';
import { useKeyboardHandler } from '@/components/date-time-picker/use-keyboard-handler';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiMenu from '@/components/overlays/menu/RuiMenu.vue';
import { useFormTextDetail } from '@/utils/form-text-detail';
import { getNonRootAttrs, getRootAttrs } from '@/utils/helpers';
import { cn } from '@/utils/tv';

type DateFormat = 'year-first' | 'month-first' | 'day-first';

type DateTimeModelType = 'date' | 'epoch-ms' | 'epoch';

type ModelValueType<T extends DateTimeModelType> = T extends 'date'
  ? Date | undefined
  : T extends 'epoch-ms'
    ? number | undefined
    : T extends 'epoch'
      ? number | undefined
      : Date | number | undefined;

export interface RuiDateTimePickerProps {
  minDate?: Date | number;
  maxDate?: Date | number | 'now';
  format?: DateFormat;
  type?: DateTimeModelType;
  accuracy?: 'minute' | 'second' | 'millisecond';
  disabled?: boolean;
  allowEmpty?: boolean;
  readonly?: boolean;
  dense?: boolean;
  label?: string;
  variant?: DateTimePickerVariant;
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

const modelValue = defineModel<ModelValueType<DateTimeModelType>>({ required: true });

const {
  disabled = false,
  readonly = false,
  allowEmpty = false,
  dense = false,
  type = 'epoch-ms',
  hideDetails = false,
  label = 'Pick a date',
  variant = 'default',
  hint,
  maxDate,
  minDate,
  format = 'day-first',
  accuracy = 'minute',
  errorMessages = [],
  successMessages = [],
  required = false,
} = defineProps<RuiDateTimePickerProps>();

defineSlots<{
  'menu-content': () => any;
}>();

const baseFormats: Record<DateFormat, string> = {
  'day-first': 'DD/MM/YYYY HH:mm',
  'month-first': 'MM/DD/YYYY HH:mm',
  'year-first': 'YYYY/MM/DD HH:mm',
};

const isOpen = ref<boolean>(false);
const cursorPosition = ref<number>(0);
const currentValue = ref<number>();

const textInput = useTemplateRef<HTMLInputElement>('textInput');
const activator = useTemplateRef<HTMLDivElement>('activator');
const menuWrapperRef = useTemplateRef<HTMLDivElement>('menuWrapperRef');
const calendarMenuOpen = ref<boolean>(false);

const { focused: activatorFocusedWithin } = useFocusWithin(activator);
const { focused: menuWrapperFocusedWithin } = useFocusWithin(menuWrapperRef);
const { focused: searchInputFocused } = useFocus(textInput);

const anyFocused = computed<boolean>(() => get(activatorFocusedWithin) || get(menuWrapperFocusedWithin));

const {
  clear: clearSelection,
  getDateTime,
  internalErrorMessages,
  maxAllowedDate,
  minAllowedDate,
  segmentData,
  selectedDate,
  selectedDay,
  selectedHour,
  selectedMillisecond,
  selectedMinute,
  selectedMonth,
  selectedSecond,
  selectedTime,
  selectedTimezone,
  selectedYear,
  setNow,
  valueSet,
} = useDateTimeSelection({
  accuracy,
  allowEmpty,
  maxDate,
  minDate,
  modelValue,
  type,
});

const { setValue, getCurrent } = useInputHandler(segmentData, currentValue);

const dateFormat = computed<string>(() => {
  const fmt = baseFormats[format];
  if (accuracy === 'second') {
    return fmt.replace('HH:mm', 'HH:mm:ss');
  }
  else if (accuracy === 'millisecond') {
    return fmt.replace('HH:mm', 'HH:mm:ss.SSS');
  }
  return fmt;
});

const {
  clear: clearSegment,
  getCurrentSegment,
  handleBlur,
  handleClick,
  handleFocus,
  handleInput,
  handleInputSelection,
  handleKeyDown,
  handleMouseDown,
  handlePaste,
  setSegment,
} = useKeyboardHandler({
  accuracy,
  currentValue,
  cursorPosition,
  dateFormat,
  disabled,
  getCurrent,
  getDateTime,
  readonly,
  setValue,
  textInput,
});

const { hasError, hasSuccess } = useFormTextDetail(
  () => errorMessages,
  () => successMessages,
);

const isOutlined = computed<boolean>(() => variant === 'outlined');

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

const float = computed<boolean>(() => (get(isOpen) || get(valueSet) || get(searchInputFocused)) && get(isOutlined));

const legendText = computed<string>(() => {
  if (!get(float) || !label)
    return '';
  return required ? `${label} ﹡` : label;
});

const ui = computed<ReturnType<typeof dateTimePickerStyles>>(() => dateTimePickerStyles({
  filled: variant === 'filled',
  outlined: get(isOutlined),
  float: get(float),
  opened: get(isOpen),
  dense,
  disabled,
  readonly,
  hasError: get(hasError),
  hasSuccess: get(hasSuccess) && !get(hasError),
}));

const combinedErrorMessages = computed<string[]>(() => {
  if (!errorMessages)
    return get(internalErrorMessages);

  const propErrors = Array.isArray(errorMessages) ? errorMessages : [errorMessages];
  return [...propErrors, ...get(internalErrorMessages)];
});

function getDisplayValue(digit: Ref<number | undefined>, padding: number): string | undefined {
  return isDefined(digit) ? get(digit).toString().padStart(padding, '0') : undefined;
}

async function setInputFocus(): Promise<void> {
  await nextTick(() => {
    set(searchInputFocused, true);
  });
}

function clear(segmentType?: string): void {
  if (!segmentType) {
    clearSelection();
    set(currentValue, undefined);
    return;
  }

  clearSegment(segmentType);
}

function handleInputClick(event: MouseEvent): void {
  // Handle segment selection first, before any DOM changes from menu opening
  handleClick(event);
  // Open menu if not already open
  if (!get(isOpen)) {
    set(isOpen, true);
  }
}

function arrowClicked(event: MouseEvent): void {
  if (get(isOpen)) {
    set(isOpen, false);
    event.stopPropagation();
  }
}
</script>

<template>
  <RuiMenu
    v-model="isOpen"
    v-bind="getRootAttrs($attrs, [])"
    :class="ui.wrapper({ class: cn($attrs.class) })"
    placement="bottom-start"
    :dense="dense"
    :hint="hint"
    :disabled="disabled"
    :success-messages="successMessages"
    :error-messages="combinedErrorMessages"
    :close-on-content-click="false"
    :show-details="!hideDetails"
    :persistent="calendarMenuOpen"
    full-width
    disable-auto-focus
  >
    <template #activator="{ attrs, open }">
      <div
        ref="activator"
        :class="ui.activator()"
        v-bind="{
          ...getNonRootAttrs($attrs, ['onClick', 'class']),
          ...(readonly ? {} : attrs),
        }"
        data-id="activator"
        :aria-invalid="hasError"
        :tabindex="disabled || readonly ? -1 : 0"
        @click="setInputFocus()"
      >
        <span
          v-if="isOutlined && (searchInputFocused || open || valueSet)"
          data-id="label"
          :class="[
            ui.label(),
            { 'pr-2': !valueSet && !open && isOutlined },
          ]"
        >
          {{ label }}
          <span
            v-if="required"
            data-id="required-indicator"
            :class="ui.required()"
          >
            ﹡
          </span>
        </span>

        <span :class="ui.iconPrepend()">
          <RuiIcon
            class="text-rui-text-secondary transition"
            :size="dense ? 16 : 24"
            name="lu-calendar-days"
          />
        </span>

        <div :class="ui.value()">
          <input
            ref="textInput"
            :disabled="disabled"
            :value="formattedDisplay"
            class="bg-transparent outline-none flex-1 min-w-0"
            type="text"
            :placeholder="dateFormat"
            :readonly="readonly"
            :aria-invalid="hasError"
            @mousedown="handleMouseDown($event)"
            @focus="handleFocus()"
            @blur="handleBlur()"
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
          :class="[
            ui.clear(),
            anyFocused && '!visible',
            { 'mr-2': !dense },
          ]"
          @click.stop.prevent="clear()"
        >
          <RuiIcon
            name="lu-x"
            size="18"
          />
        </RuiButton>

        <span
          :class="ui.iconWrapper()"
          data-id="append"
          @click="arrowClicked($event)"
        >
          <RuiIcon
            :class="ui.icon()"
            :size="dense ? 16 : 24"
            name="lu-chevron-down"
          />
        </span>
      </div>
      <fieldset
        v-if="isOutlined"
        :class="ui.fieldset()"
      >
        <legend :class="ui.legend()">
          {{ legendText }}
        </legend>
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
