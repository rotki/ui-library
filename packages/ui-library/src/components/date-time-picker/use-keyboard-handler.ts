import type { Ref } from 'vue';
import type { TimeAccuracy } from '@/consts/time-accuracy';
import dayjs, { type Dayjs } from 'dayjs';
import { type DateTimeSegmentType, isDateTimeSegmentType } from '@/components/date-time-picker/types';
import { includeMilliseconds, includeSeconds } from '@/components/date-time-picker/utils';
import { assert } from '@/utils/assert';

interface Segment { start: number; end: number; type: DateTimeSegmentType }

type SegmentMethod = 'date' | 'hour' | 'month' | 'minute' | 'second' | 'millisecond' | 'year';
const SEGMENT_METHODS: Record<DateTimeSegmentType, SegmentMethod> = {
  DD: 'date',
  HH: 'hour',
  MM: 'month',
  SSS: 'millisecond',
  YYYY: 'year',
  mm: 'minute',
  ss: 'second',
};

interface SegmentBounds { maxValue: number; minValue?: number }
const SEGMENT_CONFIG: Record<DateTimeSegmentType, SegmentBounds> = {
  DD: { maxValue: 31, minValue: 1 },
  HH: { maxValue: 23, minValue: 0 },
  MM: { maxValue: 12, minValue: 1 },
  SSS: { maxValue: 999, minValue: 0 },
  YYYY: { maxValue: 9999, minValue: 1 },
  mm: { maxValue: 59, minValue: 0 },
  ss: { maxValue: 59, minValue: 0 },
};

interface KeyboardHandlerOptions {
  dateFormat: Ref<string>;
  cursorPosition: Ref<number>;
  currentValue: Ref<number | undefined>;
  textInput: Ref<HTMLInputElement | undefined>;
  setValue: (segment: DateTimeSegmentType, value?: number) => void;
  getCurrent: (segment: DateTimeSegmentType) => number | undefined;
  getDateTime: () => Dayjs;
  disabled: boolean;
  readonly: boolean;
  accuracy: TimeAccuracy;
}

export function useKeyboardHandler(options: KeyboardHandlerOptions) {
  const {
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
  } = options;

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
          end: currentPosition + segment.length,
          start: currentPosition,
          type: segment,
        });
      }
      currentPosition += segment.length;
    });

    return positions;
  });

  function getCurrentSegment(position: number = get(cursorPosition)) {
    const segments = get(segmentPositions);
    return segments.find(
      segment => position >= segment.start && position <= segment.end,
    );
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

  function setSegment(segmentType: DateTimeSegmentType): void {
    const segments = get(segmentPositions).find(segment => segment.type === segmentType);
    if (segments) {
      setCursorPosition(segments);
    }
  }

  function clear(segmentType?: string): void {
    const currentSegment = getCurrentSegment();
    if (!segmentType && !currentSegment) {
      return;
    }

    const typeToUse = segmentType ?? currentSegment?.type;
    if (!typeToUse) {
      return;
    }

    setValue(typeToUse as DateTimeSegmentType, undefined);

    if (currentSegment) {
      setCursorPosition(currentSegment);
    }
  }

  function changeSegmentValue(increment: boolean): void {
    if (!isDefined(textInput))
      return;
    const currentSegment = getCurrentSegment();
    if (!currentSegment)
      return;
    const segmentType = currentSegment.type;
    const method = SEGMENT_METHODS[segmentType];
    const selectedDate = getDateTime();
    const updatedDate = selectedDate.set(method, selectedDate.get(method) + (increment ? 1 : -1));
    if (updatedDate.year() >= 1970) {
      setValue(segmentType, segmentType === 'MM' ? updatedDate.get(method) + 1 : updatedDate.get(method));
      setCursorPosition(currentSegment);
    }
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
        assert(nextSegment);
        setCursorPosition(nextSegment);
      }
    }
    else {
      nextSegmentIndex = currentSegmentIndex - 1;
      if (nextSegmentIndex >= 0) {
        const nextSegment = positions[nextSegmentIndex];
        assert(nextSegment);
        setCursorPosition(nextSegment);
      }
    }
  }

  function handleDigitPressed(event: KeyboardEvent, digit: string): void {
    if (!(event.target instanceof HTMLInputElement))
      return;
    const position = event.target.selectionStart ?? 0;
    const currentSegment = getCurrentSegment(position);
    if (!currentSegment || isNaN(parseInt(digit)))
      return;
    const segmentType = currentSegment.type;
    if (!isDateTimeSegmentType(segmentType))
      return;

    const config = SEGMENT_CONFIG[segmentType];
    const value = get(currentValue) ?? '';
    const combinedStr = `${value}${digit}`;
    const combinedValue = parseInt(combinedStr);
    const maxLength = segmentType.length;
    const minValue = config.minValue ?? 0;

    if (combinedValue >= minValue && combinedValue <= config.maxValue) {
      setValue(segmentType, combinedValue);
      setCursorPosition(currentSegment);
    }
    else if (combinedValue < minValue && combinedStr.length < maxLength) {
      // Track digit even if below minValue, so next digit can combine (e.g., "0" allows "01")
      set(currentValue, combinedValue);
    }

    const willExceedMax = parseInt(`${combinedStr}0`) > config.maxValue;
    // Use string length of typed digits, not parsed number length (e.g., "01" has length 2)
    if (willExceedMax || combinedStr.length >= maxLength)
      navigateSegments('ArrowRight');
  }

  function handleKeyboardNavigation(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp')
      changeSegmentValue(true);
    else if (event.key === 'ArrowDown')
      changeSegmentValue(false);
  }

  function handleBackspace(event: KeyboardEvent): void {
    if (!(event.target instanceof HTMLInputElement))
      return;
    const currentSegment = getCurrentSegment(event.target.selectionStart ?? 0);
    if (!currentSegment)
      return;
    const value = get(currentValue) ?? getCurrent(currentSegment.type) ?? '';
    const updatedValue = value.toString().slice(0, -1);
    setValue(currentSegment.type, updatedValue.length === 0 ? undefined : parseInt(updatedValue));
    setCursorPosition(currentSegment);
  }

  function onInputDeletePressed(event: KeyboardEvent): void {
    if (!(event.target instanceof HTMLInputElement))
      return;
    const segment = getCurrentSegment(event.target.selectionStart ?? 0);
    if (segment) {
      clear(segment.type);
      setCursorPosition(segment);
    }
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (disabled || readonly)
      return;
    const { key } = event;
    if (key === 'Tab')
      return;
    event.preventDefault();
    if (key === 'ArrowRight' || key === 'ArrowLeft')
      navigateSegments(key);
    else if (key === 'ArrowUp' || key === 'ArrowDown')
      handleKeyboardNavigation(event);
    else if (key === 'Backspace')
      handleBackspace(event);
    else if (key === 'Delete')
      onInputDeletePressed(event);
    else if (/^\d$/.test(key))
      handleDigitPressed(event, key);
  }

  function getClickPosition(event: MouseEvent, input: HTMLInputElement, useCaretPosition: boolean): number {
    const fallback = input.selectionStart ?? 0;
    if (!useCaretPosition)
      return fallback;
    const caretPos = document.caretPositionFromPoint?.(event.clientX, event.clientY);
    if (caretPos)
      return caretPos.offset;
    return document.caretRangeFromPoint?.(event.clientX, event.clientY)?.startOffset ?? fallback;
  }

  // Track the segment that was clicked, so handleFocus can restore it after DOM updates
  let clickedSegment: Segment | undefined;

  // Capture clicked segment on mousedown (fires before focus event)
  function handleMouseDown(event: MouseEvent): void {
    if (disabled || readonly || !(event.target instanceof HTMLInputElement))
      return;
    const currentSegment = getCurrentSegment(getClickPosition(event, event.target, true));
    if (currentSegment) {
      clickedSegment = currentSegment;
    }
  }

  function handleClick(event: MouseEvent): void {
    if (disabled || readonly || !(event.target instanceof HTMLInputElement))
      return;
    const currentSegment = getCurrentSegment(getClickPosition(event, event.target, true));
    if (currentSegment) {
      clickedSegment = currentSegment;
      set(cursorPosition, currentSegment.end);
      event.target.setSelectionRange(currentSegment.start, currentSegment.end);
    }
  }

  function handleInputSelection(event: Event): void {
    const target = event.target as HTMLInputElement;
    set(cursorPosition, target.selectionStart ?? 0);
  }

  function handleFocus(): void {
    // If we just clicked on a segment, restore that selection
    // (the selection may have been lost due to menu opening/DOM updates)
    if (clickedSegment) {
      setCursorPosition(clickedSegment);
      clickedSegment = undefined;
      return;
    }

    // Only select first segment if no text is currently selected in the input
    const input = get(textInput);
    if (input && input.selectionStart !== input.selectionEnd)
      return;
    const firstSegment = get(segmentPositions)[0];
    if (firstSegment)
      setCursorPosition(firstSegment);
  }

  function handleBlur(): void {
    // Reset cursor position and clicked segment when input loses focus
    // This prevents "blinking" when re-focusing on a different segment
    set(cursorPosition, 0);
    set(currentValue, undefined);
    clickedSegment = undefined;
  }

  function parseAndSetDateValues(pastedText: string) {
    try {
      const parsedDate = dayjs(pastedText, get(dateFormat));

      if (!parsedDate.isValid()) {
        return;
      }

      const date = parsedDate.toDate();
      setValue('YYYY', date.getFullYear());
      setValue('MM', date.getMonth() + 1);
      setValue('DD', date.getDate());
      setValue('HH', date.getHours());
      setValue('mm', date.getMinutes());
      if (includeSeconds(accuracy)) {
        setValue('ss', date.getSeconds());
      }
      if (includeMilliseconds(accuracy)) {
        setValue('SSS', date.getMilliseconds());
      }
    }
    catch {
      // Invalid format, ignore paste
    }
  }

  function handlePaste(event: ClipboardEvent): void {
    if (disabled || readonly)
      return;

    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }

    event.preventDefault();

    const pastedText = event.clipboardData?.getData('text');
    if (!pastedText) {
      return;
    }
    parseAndSetDateValues(pastedText);
  }

  function handleInput(event: Event): void {
    if (disabled || readonly)
      return;

    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }

    const inputText = event.target.value;
    if (!inputText) {
      return;
    }

    parseAndSetDateValues(inputText);
  }

  return {
    clear,
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
  };
}
