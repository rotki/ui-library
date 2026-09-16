import type { Dayjs } from 'dayjs';
import type { Ref, ShallowRef } from 'vue';
import type { TimeAccuracy } from '@/consts/time-accuracy';
import { type Segment, SEGMENT_CONFIG, SEGMENT_METHODS } from '@/components/date-time-picker/segment-config';
import { getClickPosition, parseAndSetDateValues } from '@/components/date-time-picker/segment-utils';
import {
  type DateTimeSegmentType,
  isDateTimeSegmentType,
} from '@/components/date-time-picker/types';
import { assert } from '@/utils/assert';

interface KeyboardHandlerOptions {
  dateFormat: Ref<string>;
  cursorPosition: Ref<number>;
  currentValue: Ref<number | undefined>;
  textInput: Readonly<ShallowRef<HTMLInputElement | null>> | Ref<HTMLInputElement | undefined>;
  setValue: (segment: DateTimeSegmentType, value?: number) => void;
  getCurrent: (segment: DateTimeSegmentType) => number | undefined;
  getDateTime: () => Dayjs;
  disabled: boolean;
  readonly: boolean;
  accuracy: TimeAccuracy;
  timezone: Readonly<Ref<string | undefined>>;
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
    timezone,
  } = options;

  const pasteRejected = shallowRef<boolean>(false);

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
    return segments.find(segment => position >= segment.start && position <= segment.end);
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
      set(currentValue, undefined);
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
      setValue(
        segmentType,
        segmentType === 'MM' ? updatedDate.get(method) + 1 : updatedDate.get(method),
      );
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

  /**
   * Adds a typed digit to the segment under the caret, moving on to the next
   * segment once this one can hold no more.
   *
   * @param segment - the segment the caret sits in
   * @param segmentType - that segment's type, which states its value range
   * @param digit - the digit that was typed
   */
  function applyDigit(segment: Segment, segmentType: DateTimeSegmentType, digit: string): void {
    const config = SEGMENT_CONFIG[segmentType];
    const value = get(currentValue) ?? '';
    const combinedStr = `${value}${digit}`;
    const combinedValue = parseInt(combinedStr);
    const maxLength = segmentType.length;
    const minValue = config.minValue ?? 0;

    if (combinedValue >= minValue && combinedValue <= config.maxValue) {
      setValue(segmentType, combinedValue);
      setCursorPosition(segment);
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

  function handleDigitPressed(event: KeyboardEvent, digit: string): void {
    if (!(event.target instanceof HTMLInputElement))
      return;

    const currentSegment = getCurrentSegment(event.target.selectionStart ?? 0);
    if (!currentSegment || isNaN(parseInt(digit)))
      return;

    const segmentType = currentSegment.type;
    if (!isDateTimeSegmentType(segmentType))
      return;

    applyDigit(currentSegment, segmentType, digit);
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

  /**
   * Runs the picker's own handling for a key.
   *
   * @param event - the keydown being handled
   * @param key - the key that was pressed
   * @returns whether the picker handled it, which decides if the browser's own
   * handling is kept: Tab moves out of the field, Escape closes the menu and
   * Enter submits the surrounding form.
   */
  function dispatchKey(event: KeyboardEvent, key: string): boolean {
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
    else
      return false;

    return true;
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (disabled || readonly)
      return;

    set(pasteRejected, false);
    // Modifier combos belong to the browser: swallowing them made copy and paste impossible
    if (event.ctrlKey || event.metaKey || event.altKey)
      return;

    if (dispatchKey(event, event.key))
      event.preventDefault();
  }

  // Track the segment that was clicked, so handleFocus can restore it after DOM updates
  let clickedSegment: Segment | undefined;

  /**
   * Captures the clicked segment on mousedown, which fires before focus.
   *
   * The in-progress digit buffer is reset because switching segments must not
   * carry typed digits over, otherwise a leftover digit from another segment
   * combines with the next keystroke (type "1" in HH, click mm, type "3" and
   * mm would become 13 instead of 3).
   */
  function handleMouseDown(event: MouseEvent): void {
    if (disabled || readonly || !(event.target instanceof HTMLInputElement))
      return;
    const currentSegment = getCurrentSegment(getClickPosition(event, event.target, true));
    if (currentSegment) {
      set(currentValue, undefined);
      clickedSegment = currentSegment;
    }
  }

  function handleClick(event: MouseEvent): void {
    if (disabled || readonly || !(event.target instanceof HTMLInputElement))
      return;
    const currentSegment = getCurrentSegment(getClickPosition(event, event.target, true));
    if (currentSegment) {
      set(currentValue, undefined);
      clickedSegment = currentSegment;
      set(cursorPosition, currentSegment.end);
      event.target.setSelectionRange(currentSegment.start, currentSegment.end);
    }
  }

  function handleInputSelection(event: Event): void {
    const target = event.target as HTMLInputElement;
    set(cursorPosition, target.selectionStart ?? 0);
  }

  function selectFirstSegment(): void {
    const firstSegment = get(segmentPositions)[0];
    if (firstSegment)
      setCursorPosition(firstSegment);
  }

  /**
   * Restores the selection a click asked for, which opening the menu and the
   * DOM updates that follow can lose. With no click to restore, focus selects
   * the first segment, unless the user is already selecting text themselves.
   */
  function handleFocus(): void {
    if (clickedSegment) {
      setCursorPosition(clickedSegment);
      clickedSegment = undefined;
      return;
    }

    const input = get(textInput);
    if (input && input.selectionStart !== input.selectionEnd)
      return;
    selectFirstSegment();
  }

  /**
   * Forgets the cursor position and the clicked segment, so re-focusing on
   * another segment does not blink through the one left behind.
   */
  function handleBlur(): void {
    set(cursorPosition, 0);
    set(currentValue, undefined);
    set(pasteRejected, false);
    clickedSegment = undefined;
  }

  /** Text that is no date raises `pasteRejected` until the next key, paste, input or blur. */
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
    const parsed = parseAndSetDateValues(pastedText, get(dateFormat), accuracy, setValue, get(timezone));
    set(pasteRejected, !parsed);
  }

  function handleInput(event: Event): void {
    if (disabled || readonly)
      return;
    set(pasteRejected, false);

    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }

    const inputText = event.target.value;
    if (!inputText) {
      return;
    }

    parseAndSetDateValues(inputText, get(dateFormat), accuracy, setValue);
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
    pasteRejected: shallowReadonly(pasteRejected),
    selectFirstSegment,
    setSegment,
  };
}
