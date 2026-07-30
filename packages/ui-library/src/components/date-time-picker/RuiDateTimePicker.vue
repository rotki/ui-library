<script lang="ts" setup>
import type { ComponentPublicInstance } from 'vue';
import type { DateTimePickerAction, DateTimeSegmentType } from '@/components/date-time-picker/types';
import type { TimePickerSelection } from '@/components/time-picker/RuiTimePicker.vue';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import { dateTimePickerStyles, type DateTimePickerVariant } from '@/components/date-time-picker/date-time-picker-styles';
import RuiDateTimePickerMenu from '@/components/date-time-picker/RuiDateTimePickerMenu.vue';
import { useDateTimeSelection } from '@/components/date-time-picker/use-date-time-selection';
import { useInputHandler } from '@/components/date-time-picker/use-input-handler';
import { useKeyboardHandler } from '@/components/date-time-picker/use-keyboard-handler';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import RuiMenu from '@/components/overlays/menu/RuiMenu.vue';
import { type FloatingOptions, Placement } from '@/composables/floating';
import { useRuiI8n } from '@/composables/use-rui-i18n';
import { RUI_I18N_KEYS } from '@/i18n/keys';
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
  /**
   * Renders the timezone selector in the menu. Off by default: the value is
   * emitted as a date or an epoch, so the picked timezone does not survive a
   * round trip and most consumers work in local time.
   */
  showTimezone?: boolean;
  /**
   * Actions rendered in the menu footer. `clear` is only rendered when the
   * picker is `allowEmpty`. Pass an empty array to drop the footer entirely.
   */
  actions?: DateTimePickerAction[];
  /**
   * Focuses the field once it is mounted. The native attribute is ignored for
   * an input inserted into an already loaded document, which is the usual case
   * for a picker revealed by an editor or a dialog.
   */
  autofocus?: boolean;
}

defineOptions({
  name: 'RuiDateTimePicker',
  inheritAttrs: false,
});

const modelValue = defineModel<ModelValueType<DateTimeModelType>>({ required: true });
const menuOpen = defineModel<boolean>('menuOpen', { default: false });

const {
  disabled = false,
  readonly = false,
  allowEmpty = false,
  dense = false,
  type = 'epoch-ms',
  hideDetails = false,
  label,
  variant = 'default',
  hint,
  maxDate,
  minDate,
  format = 'day-first',
  accuracy = 'minute',
  errorMessages = [],
  successMessages = [],
  required = false,
  showTimezone = false,
  actions = ['now'],
  autofocus = false,
} = defineProps<RuiDateTimePickerProps>();

defineSlots<{
  'menu-content': () => any;
}>();

const MENU_OPTIONS: FloatingOptions = { placement: Placement.bottomStart };

const baseFormats: Record<DateFormat, string> = {
  'day-first': 'DD/MM/YYYY HH:mm',
  'month-first': 'MM/DD/YYYY HH:mm',
  'year-first': 'YYYY/MM/DD HH:mm',
};

const isOpen = ref<boolean>(false);
const isHovered = ref<boolean>(false);
const cursorPosition = ref<number>(0);
const currentValue = ref<number>();

const { t } = useRuiI8n();

const keys = RUI_I18N_KEYS.dateTimePicker;

const fieldLabel = computed<string>(() => label ?? t(keys.label, 'Pick a date'));
const clearLabel = computed<string>(() => t(keys.clearValue, 'Clear the date'));
const toggleLabel = computed<string>(() => (get(isOpen)
  ? t(keys.closeCalendar, 'Close the calendar')
  : t(keys.openCalendar, 'Open the calendar')));

const textInput = useTemplateRef<HTMLInputElement>('textInput');
const activator = useTemplateRef<HTMLDivElement>('activator');
const menuWrapperRef = useTemplateRef<ComponentPublicInstance>('menuWrapperRef');
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
  setToday,
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

/** True once any segment holds a digit, even a partially typed date. */
const anySegmentSet = computed<boolean>(() => [
  selectedYear,
  selectedMonth,
  selectedDay,
  selectedHour,
  selectedMinute,
  selectedSecond,
  selectedMillisecond,
].some(segment => isDefined(segment)));

const formattedDisplay = computed<string>(() => {
  // An untouched field shows its format through the placeholder rather than
  // holding the tokens as its value, where a screen reader reads them as
  // content and select-all copies them. The tokens stay while the field is
  // focused: that is when the segment machinery highlights them, and
  // collapsing the value mid-edit would blank the field under the cursor.
  // The guard is "no segment set" and not `valueSet`, so blurring a half
  // typed date keeps what was entered on screen.
  if (!get(anySegmentSet) && !get(searchInputFocused)) {
    return '';
  }

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
  if (!get(float))
    return '';
  const resolved = get(fieldLabel);
  return required ? `${resolved} ﹡` : resolved;
});

const ui = computed<ReturnType<typeof dateTimePickerStyles>>(() => dateTimePickerStyles({
  filled: variant === 'filled',
  outlined: get(isOutlined),
  float: get(float),
  opened: get(isOpen),
  hovered: get(isHovered),
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

/**
 * The menu is teleported to the body, so it never sits next to the field in
 * the tab sequence. Opening it from the keyboard therefore moves focus into
 * the calendar; opening it with the mouse leaves focus in the field, which is
 * what `disable-auto-focus` on the menu is there for.
 */
const focusCalendarOnOpen = ref<boolean>(false);

function focusCalendar(): void {
  // the menu is teleported and mounts a frame later, so this waits for the
  // wrapper to appear rather than guessing at a number of ticks
  set(focusCalendarOnOpen, true);
}

watch(menuWrapperRef, (menu) => {
  if (!menu || !get(focusCalendarOnOpen))
    return;

  set(focusCalendarOnOpen, false);
  nextTick(() => {
    const el = menu.$el as HTMLElement | undefined;
    el?.querySelector<HTMLButtonElement>('[role="gridcell"][tabindex="0"]')?.focus({ preventScroll: true });
  });
});

/** Moves focus to the field. Exposed so a consumer can drive it from a ref. */
function focus(): void {
  get(textInput)?.focus({ preventScroll: true });
}

function focusField(): void {
  nextTick(focus);
}

onMounted(() => {
  if (autofocus && !disabled)
    focusField();
});

/** Escape inside the calendar closes it and hands focus back to the field. */
function closeFromMenu(): void {
  set(isOpen, false);
  focusField();
}

/**
 * The menu used to be mouse-only: the activator carried no key handlers, so
 * there was no way to reach the calendar from the keyboard. Alt+ArrowDown
 * opens it and Escape closes it, following the combobox convention, and the
 * append chevron is a real button for anyone who tabs to it instead.
 */
function onKeyDown(event: KeyboardEvent): void {
  if (disabled || readonly)
    return;

  if (event.altKey && event.key === 'ArrowDown') {
    event.preventDefault();
    set(isOpen, true);
    focusCalendar();
    return;
  }

  if (event.key === 'Escape' && get(isOpen)) {
    set(isOpen, false);
    return;
  }

  handleKeyDown(event);
}

function arrowClicked(event: MouseEvent): void {
  if (get(isOpen)) {
    set(isOpen, false);
    event.stopPropagation();
  }
}

const menuActions = computed<DateTimePickerAction[]>(
  () => actions.filter(action => action !== 'clear' || allowEmpty),
);

const anyMenuOpen = computed<boolean>(() => get(isOpen) || get(calendarMenuOpen));

watch(anyMenuOpen, (value) => {
  set(menuOpen, value);
});

defineExpose({
  focus,
});
</script>

<template>
  <RuiMenu
    v-model="isOpen"
    v-bind="getRootAttrs($attrs, [])"
    :class="ui.wrapper({ class: cn($attrs.class) })"
    :options="MENU_OPTIONS"
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
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
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
          {{ fieldLabel }}
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
            inputmode="numeric"
            spellcheck="false"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            :placeholder="dateFormat"
            :readonly="readonly"
            :aria-invalid="hasError"
            :aria-label="fieldLabel"
            :aria-required="required || undefined"
            @mousedown="handleMouseDown($event)"
            @focus="handleFocus()"
            @blur="handleBlur()"
            @select="handleInputSelection($event)"
            @click.stop="handleInputClick($event)"
            @keydown="onKeyDown($event)"
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
          color="error"
          :aria-label="clearLabel"
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

        <button
          v-if="!disabled && !readonly"
          type="button"
          :class="ui.iconWrapper()"
          data-id="append"
          :aria-label="toggleLabel"
          :aria-expanded="isOpen"
          aria-haspopup="dialog"
          @click="arrowClicked($event)"
        >
          <RuiIcon
            :class="ui.icon()"
            :size="dense ? 16 : 24"
            name="lu-chevron-down"
          />
        </button>
        <span
          v-else
          :class="ui.iconWrapper()"
          data-id="append"
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
        :show-timezone="showTimezone"
        :actions="menuActions"
        @keydown.escape="closeFromMenu()"
        @set-now="setNow()"
        @set-today="setToday()"
        @clear="clear()"
      >
        <slot name="menu-content" />
      </RuiDateTimePickerMenu>
    </template>
  </RuiMenu>
</template>
