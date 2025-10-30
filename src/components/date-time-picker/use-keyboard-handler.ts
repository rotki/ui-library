import type { Ref } from 'vue';
import type { TimeAccuracy } from '@/consts/time-accuracy';
import dayjs, { type Dayjs } from 'dayjs';
import { type DateTimeSegmentType, isDateTimeSegmentType } from '@/components/date-time-picker/types';
import { includeMilliseconds, includeSeconds } from '@/components/date-time-picker/utils';
import { assert } from '@/utils/assert';

interface Segment {
  start: number;
  end: number;
  type: DateTimeSegmentType;
}

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

    const segmentMethods = {
      DD: 'date',
      HH: 'hour',
      MM: 'month',
      mm: 'minute',
      ss: 'second',
      SSS: 'millisecond',
      YYYY: 'year',
    } as const;

    const segmentType = currentSegment.type;
    const method = segmentMethods[segmentType];
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
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }
    const position = event.target.selectionStart ?? 0;
    const currentSegment = getCurrentSegment(position);
    if (!currentSegment)
      return;

    const number = parseInt(digit);
    if (isNaN(number))
      return;

    const segmentConfig: Record<DateTimeSegmentType, { maxValue: number }> = {
      DD: { maxValue: 31 },
      HH: { maxValue: 23 },
      MM: { maxValue: 12 },
      mm: { maxValue: 59 },
      ss: { maxValue: 59 },
      SSS: { maxValue: 999 },
      YYYY: { maxValue: 9999 },
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
    const position = event.target.selectionStart ?? 0;
    const currentSegment = getCurrentSegment(position);
    if (!currentSegment)
      return;

    const value = get(currentValue) ?? getCurrent(currentSegment.type) ?? '';
    const updatedValue = value.toString().slice(0, -1);
    setValue(currentSegment.type, updatedValue.length === 0 ? undefined : parseInt(updatedValue));
    setCursorPosition(currentSegment);
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

  function handleKeyDown(event: KeyboardEvent): void {
    if (disabled || readonly)
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

  function handleClick(event: MouseEvent): void {
    if (disabled || readonly)
      return;

    const eventTarget = event.target;
    if (!(eventTarget instanceof HTMLInputElement)) {
      return;
    }
    const position = eventTarget.selectionStart ?? 0;
    const currentSegment = getCurrentSegment(position);
    if (currentSegment)
      setCursorPosition(currentSegment);
  }

  function handleInputSelection(event: Event): void {
    const target = event.target as HTMLInputElement;
    set(cursorPosition, target.selectionStart ?? 0);
  }

  function handleFocus(): void {
    const firstSegment = get(segmentPositions)[0];
    if (firstSegment) {
      setCursorPosition(firstSegment);
    }
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
    handleClick,
    handleFocus,
    handleInput,
    handleInputSelection,
    handleKeyDown,
    handlePaste,
    setSegment,
  };
}
