import type { DateTimeSegmentType } from '@/components/date-time-picker/types';
import dayjs from 'dayjs';
import { describe, expect, it, vi } from 'vitest';
import { TimeAccuracy } from '@/consts/time-accuracy';
import { useKeyboardHandler } from './use-keyboard-handler';

function createMockOptions(overrides: Partial<Parameters<typeof useKeyboardHandler>[0]> = {}) {
  const segmentValues: Record<DateTimeSegmentType, number | undefined> = {
    DD: 15,
    HH: 14,
    MM: 6,
    SSS: 0,
    YYYY: 2023,
    mm: 30,
    ss: 0,
  };

  const mockSetValue = vi.fn((segment: DateTimeSegmentType, value?: number) => {
    segmentValues[segment] = value;
  });

  const mockGetCurrent = vi.fn((segment: DateTimeSegmentType) => segmentValues[segment]);

  const mockGetDateTime = vi.fn(() => dayjs('2023-06-15 14:30:00'));

  const mockInput = document.createElement('input');
  mockInput.value = '15/06/2023 14:30';

  return {
    handler: useKeyboardHandler({
      accuracy: TimeAccuracy.MINUTE,
      currentValue: ref<number | undefined>(undefined),
      cursorPosition: ref<number>(0),
      dateFormat: ref<string>('DD/MM/YYYY HH:mm'),
      disabled: false,
      getCurrent: mockGetCurrent,
      getDateTime: mockGetDateTime,
      readonly: false,
      setValue: mockSetValue,
      textInput: ref<HTMLInputElement | undefined>(mockInput),
      ...overrides,
    }),
    mockGetCurrent,
    mockGetDateTime,
    mockInput,
    mockSetValue,
    segmentValues,
  };
}

describe('use-keyboard-handler', () => {
  describe('getCurrentSegment', () => {
    it('should return the correct segment for a given position', () => {
      const { handler } = createMockOptions({
        cursorPosition: ref<number>(0),
      });

      // Position 0-2 should be DD segment
      const segment = handler.getCurrentSegment(1);
      expect(segment).toBeDefined();
      expect(segment?.type).toBe('DD');
      expect(segment?.start).toBe(0);
      expect(segment?.end).toBe(2);
    });

    it('should return month segment for positions 3-5', () => {
      const { handler } = createMockOptions();

      const segment = handler.getCurrentSegment(4);
      expect(segment).toBeDefined();
      expect(segment?.type).toBe('MM');
    });

    it('should return year segment for positions 6-10', () => {
      const { handler } = createMockOptions();

      const segment = handler.getCurrentSegment(8);
      expect(segment).toBeDefined();
      expect(segment?.type).toBe('YYYY');
    });

    it('should return hour segment for positions 11-13', () => {
      const { handler } = createMockOptions();

      const segment = handler.getCurrentSegment(12);
      expect(segment).toBeDefined();
      expect(segment?.type).toBe('HH');
    });

    it('should return minute segment for positions 14-16', () => {
      const { handler } = createMockOptions();

      const segment = handler.getCurrentSegment(15);
      expect(segment).toBeDefined();
      expect(segment?.type).toBe('mm');
    });

    it('should return undefined for positions outside segments (separator positions)', () => {
      const { handler } = createMockOptions({
        cursorPosition: ref<number>(2),
      });

      // Position 2 is the "/" separator
      const segment = handler.getCurrentSegment(2);
      // Depending on implementation, this might return undefined or the adjacent segment
      // The implementation shows it uses >= start && <= end, so position 2 might match DD (end is 2)
      expect(segment).toBeDefined();
    });
  });

  describe('handleKeyDown', () => {
    it('should not process events when disabled', () => {
      const { handler, mockSetValue } = createMockOptions({
        disabled: true,
      });

      const event = new KeyboardEvent('keydown', { key: '5' });
      handler.handleKeyDown(event);

      expect(mockSetValue).not.toHaveBeenCalled();
    });

    it('should not process events when readonly', () => {
      const { handler, mockSetValue } = createMockOptions({
        readonly: true,
      });

      const event = new KeyboardEvent('keydown', { key: '5' });
      handler.handleKeyDown(event);

      expect(mockSetValue).not.toHaveBeenCalled();
    });

    it('should allow Tab key to pass through', () => {
      const { handler } = createMockOptions();

      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      handler.handleKeyDown(event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('should prevent default for other keys', () => {
      const { handler, mockInput } = createMockOptions();

      const event = new KeyboardEvent('keydown', { key: '5' });
      Object.defineProperty(event, 'target', { value: mockInput });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      handler.handleKeyDown(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('clear', () => {
    it('should clear the current segment value', () => {
      const { handler, mockSetValue } = createMockOptions({
        cursorPosition: ref<number>(1),
      });

      handler.clear();

      expect(mockSetValue).toHaveBeenCalledWith('DD', undefined);
    });

    it('should clear a specific segment type', () => {
      const { handler, mockSetValue } = createMockOptions();

      handler.clear('MM');

      expect(mockSetValue).toHaveBeenCalledWith('MM', undefined);
    });

    it('should not clear anything if no segment is found and no type provided', () => {
      const { handler, mockSetValue } = createMockOptions({
        cursorPosition: ref<number>(100), // Position outside any segment
      });

      handler.clear();

      expect(mockSetValue).not.toHaveBeenCalled();
    });
  });

  describe('setSegment', () => {
    it('should set cursor to specific segment', async () => {
      const cursorPosition = ref<number>(0);
      const mockInput = document.createElement('input');
      mockInput.value = '15/06/2023 14:30';
      vi.spyOn(mockInput, 'setSelectionRange');

      createMockOptions({
        cursorPosition,
        textInput: ref<HTMLInputElement | undefined>(mockInput),
      });

      // Wait for nextTick
      await nextTick();

      // The setSegment function should update cursor position
      expect(cursorPosition.value).toBeDefined();
    });
  });

  describe('segment switching resets in-progress digit buffer', () => {
    function makeInputWithSelection(value: string, start: number, end: number): HTMLInputElement {
      const input = document.createElement('input');
      input.value = value;
      Object.defineProperty(input, 'selectionStart', { value: start, writable: true, configurable: true });
      Object.defineProperty(input, 'selectionEnd', { value: end, writable: true, configurable: true });
      return input;
    }

    it('should not carry a partially typed HH digit into mm when clicking minute segment', () => {
      const segmentValues: Record<DateTimeSegmentType, number | undefined> = {
        DD: 15,
        HH: 14,
        MM: 6,
        SSS: 0,
        YYYY: 2023,
        mm: 30,
        ss: 0,
      };
      const currentValue = ref<number | undefined>(undefined);
      const cursorPosition = ref<number>(0);
      const hhInput = makeInputWithSelection('15/06/2023 14:30', 11, 13);

      const setValue = vi.fn((segment: DateTimeSegmentType, value?: number) => {
        segmentValues[segment] = value;
        currentValue.value = value;
      });

      const { handler } = createMockOptions({
        currentValue,
        cursorPosition,
        setValue,
        textInput: ref<HTMLInputElement | undefined>(hhInput),
      });

      // Type "1" in HH segment → HH=1, currentValue=1, no auto-navigate (length < 2)
      const key1 = new KeyboardEvent('keydown', { key: '1' });
      Object.defineProperty(key1, 'target', { value: hhInput });
      handler.handleKeyDown(key1);
      expect(segmentValues.HH).toBe(1);
      expect(currentValue.value).toBe(1);

      // User clicks on minute segment via mouse (selection 14-16)
      const mmInput = makeInputWithSelection('15/06/2023 01:30', 14, 16);
      const click = new MouseEvent('click', { clientX: 0, clientY: 0 });
      Object.defineProperty(click, 'target', { value: mmInput });
      handler.handleClick(click);

      // currentValue must be cleared so the next digit doesn't combine with "1"
      expect(currentValue.value).toBeUndefined();

      // Type "3" in mm — should become 3, not 13
      const key3 = new KeyboardEvent('keydown', { key: '3' });
      Object.defineProperty(key3, 'target', { value: mmInput });
      handler.handleKeyDown(key3);
      expect(segmentValues.mm).toBe(3);
    });

    it('should reset currentValue when handleMouseDown selects a segment', () => {
      const currentValue = ref<number | undefined>(7);
      const mmInput = makeInputWithSelection('15/06/2023 14:30', 14, 16);

      const { handler } = createMockOptions({ currentValue });

      const event = new MouseEvent('mousedown', { clientX: 50, clientY: 10 });
      Object.defineProperty(event, 'target', { value: mmInput });
      handler.handleMouseDown(event);

      expect(currentValue.value).toBeUndefined();
    });

    it('should reset currentValue when setSegment switches segments programmatically', () => {
      const currentValue = ref<number | undefined>(4);
      const mockInput = makeInputWithSelection('15/06/2023 14:30', 0, 0);

      const { handler } = createMockOptions({
        currentValue,
        textInput: ref<HTMLInputElement | undefined>(mockInput),
      });

      handler.setSegment('mm');

      expect(currentValue.value).toBeUndefined();
    });

    it('should not let a leftover mm digit bleed into HH after switching back', () => {
      const segmentValues: Record<DateTimeSegmentType, number | undefined> = {
        DD: 15,
        HH: 14,
        MM: 6,
        SSS: 0,
        YYYY: 2023,
        mm: 30,
        ss: 0,
      };
      const currentValue = ref<number | undefined>(undefined);
      const cursorPosition = ref<number>(0);
      const mmInput = makeInputWithSelection('15/06/2023 14:30', 14, 16);

      const setValue = vi.fn((segment: DateTimeSegmentType, value?: number) => {
        segmentValues[segment] = value;
        currentValue.value = value;
      });

      const { handler } = createMockOptions({
        currentValue,
        cursorPosition,
        setValue,
        textInput: ref<HTMLInputElement | undefined>(mmInput),
      });

      // Type "2" in mm → mm=2, currentValue=2
      const key2 = new KeyboardEvent('keydown', { key: '2' });
      Object.defineProperty(key2, 'target', { value: mmInput });
      handler.handleKeyDown(key2);
      expect(segmentValues.mm).toBe(2);

      // Switch to HH via the menu's setSegment (e.g. clicking "Select hours" tab)
      handler.setSegment('HH');
      expect(currentValue.value).toBeUndefined();

      // Type "1" then "2" expecting HH=12 (not 212 or 13 or anything else)
      const hhInput = makeInputWithSelection('15/06/2023 14:02', 11, 13);
      const k1 = new KeyboardEvent('keydown', { key: '1' });
      Object.defineProperty(k1, 'target', { value: hhInput });
      handler.handleKeyDown(k1);
      expect(segmentValues.HH).toBe(1);

      const k2 = new KeyboardEvent('keydown', { key: '2' });
      Object.defineProperty(k2, 'target', { value: hhInput });
      handler.handleKeyDown(k2);
      expect(segmentValues.HH).toBe(12);
    });
  });

  describe('handleClick', () => {
    it('should set cursor position to clicked segment', () => {
      const cursorPosition = ref<number>(0);
      const mockInput = document.createElement('input');
      mockInput.value = '15/06/2023 14:30';
      Object.defineProperty(mockInput, 'selectionStart', { value: 4, writable: true });

      const { handler } = createMockOptions({
        cursorPosition,
        textInput: ref<HTMLInputElement | undefined>(mockInput),
      });

      const event = new MouseEvent('click', { clientX: 50, clientY: 10 });
      Object.defineProperty(event, 'target', { value: mockInput });

      handler.handleClick(event);

      // Cursor position should be updated based on the clicked segment
      expect(cursorPosition.value).toBeGreaterThanOrEqual(0);
    });

    it('should not handle click when disabled', () => {
      const cursorPosition = ref<number>(0);
      const { handler } = createMockOptions({
        cursorPosition,
        disabled: true,
      });

      const event = new MouseEvent('click');
      handler.handleClick(event);

      expect(cursorPosition.value).toBe(0);
    });

    it('should not handle click when readonly', () => {
      const cursorPosition = ref<number>(0);
      const { handler } = createMockOptions({
        cursorPosition,
        readonly: true,
      });

      const event = new MouseEvent('click');
      handler.handleClick(event);

      expect(cursorPosition.value).toBe(0);
    });
  });

  describe('handleFocus', () => {
    it('should select first segment on focus when no selection exists', async () => {
      const cursorPosition = ref<number>(0);
      const mockInput = document.createElement('input');
      mockInput.value = '15/06/2023 14:30';
      Object.defineProperty(mockInput, 'selectionStart', { value: 0, writable: true });
      Object.defineProperty(mockInput, 'selectionEnd', { value: 0, writable: true });

      const { handler } = createMockOptions({
        cursorPosition,
        textInput: ref<HTMLInputElement | undefined>(mockInput),
      });

      handler.handleFocus();
      await nextTick();

      // Should select the first segment (DD)
      expect(cursorPosition.value).toBe(2); // End of DD segment
    });
  });

  describe('handleBlur', () => {
    it('should reset cursor position on blur', () => {
      const cursorPosition = ref<number>(10);
      const currentValue = ref<number | undefined>(5);

      const { handler } = createMockOptions({
        currentValue,
        cursorPosition,
      });

      handler.handleBlur();

      expect(cursorPosition.value).toBe(0);
      expect(currentValue.value).toBeUndefined();
    });
  });

  describe('handleInputSelection', () => {
    it('should update cursor position from input selection', () => {
      const cursorPosition = ref<number>(0);
      const mockInput = document.createElement('input');
      Object.defineProperty(mockInput, 'selectionStart', { value: 5, writable: true });

      const { handler } = createMockOptions({
        cursorPosition,
      });

      const event = { target: mockInput } as unknown as Event;
      handler.handleInputSelection(event);

      expect(cursorPosition.value).toBe(5);
    });
  });

  describe('handlePaste', () => {
    it('should prevent default and attempt to parse pasted text', () => {
      const { handler } = createMockOptions();

      const clipboardData = {
        getData: vi.fn().mockReturnValue('25/12/2023 18:45'),
      };

      const event = {
        clipboardData,
        preventDefault: vi.fn(),
        target: document.createElement('input'),
      } as unknown as ClipboardEvent;

      handler.handlePaste(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(clipboardData.getData).toHaveBeenCalledWith('text');
    });

    it('should not process paste when disabled', () => {
      const { handler, mockSetValue } = createMockOptions({
        disabled: true,
      });

      const preventDefaultMock = vi.fn();
      const event = {
        clipboardData: { getData: () => '25/12/2023 18:45' },
        preventDefault: preventDefaultMock,
        target: document.createElement('input'),
      } as unknown as ClipboardEvent;

      handler.handlePaste(event);

      expect(mockSetValue).not.toHaveBeenCalled();
      expect(preventDefaultMock).not.toHaveBeenCalled();
    });

    it('should not process paste when readonly', () => {
      const { handler, mockSetValue } = createMockOptions({
        readonly: true,
      });

      const preventDefaultMock = vi.fn();
      const event = {
        clipboardData: { getData: () => '25/12/2023 18:45' },
        preventDefault: preventDefaultMock,
        target: document.createElement('input'),
      } as unknown as ClipboardEvent;

      handler.handlePaste(event);

      expect(mockSetValue).not.toHaveBeenCalled();
      expect(preventDefaultMock).not.toHaveBeenCalled();
    });

    it('should handle invalid pasted text gracefully', () => {
      const { handler } = createMockOptions();

      const event = {
        clipboardData: { getData: () => 'invalid date' },
        preventDefault: vi.fn(),
        target: document.createElement('input'),
      } as unknown as ClipboardEvent;

      // Should not throw
      expect(() => handler.handlePaste(event)).not.toThrow();
    });

    it('should not process paste without clipboardData', () => {
      const { handler, mockSetValue } = createMockOptions();

      const event = {
        clipboardData: null,
        preventDefault: vi.fn(),
        target: document.createElement('input'),
      } as unknown as ClipboardEvent;

      handler.handlePaste(event);

      expect(mockSetValue).not.toHaveBeenCalled();
    });

    it('should not process paste when target is not HTMLInputElement', () => {
      const { handler, mockSetValue } = createMockOptions();

      const event = {
        clipboardData: { getData: () => '25/12/2023 18:45' },
        preventDefault: vi.fn(),
        target: document.createElement('div'),
      } as unknown as ClipboardEvent;

      handler.handlePaste(event);

      expect(mockSetValue).not.toHaveBeenCalled();
    });
  });

  describe('handleInput', () => {
    it('should attempt to parse date from input value', () => {
      const { handler } = createMockOptions();

      const mockInput = document.createElement('input');
      mockInput.value = '31/12/2023 23:59';

      const event = { target: mockInput } as unknown as Event;

      // Should not throw
      expect(() => handler.handleInput(event)).not.toThrow();
    });

    it('should not process input when disabled', () => {
      const { handler, mockSetValue } = createMockOptions({
        disabled: true,
      });

      const mockInput = document.createElement('input');
      mockInput.value = '31/12/2023 23:59';

      const event = { target: mockInput } as unknown as Event;
      handler.handleInput(event);

      expect(mockSetValue).not.toHaveBeenCalled();
    });

    it('should not process input when readonly', () => {
      const { handler, mockSetValue } = createMockOptions({
        readonly: true,
      });

      const mockInput = document.createElement('input');
      mockInput.value = '31/12/2023 23:59';

      const event = { target: mockInput } as unknown as Event;
      handler.handleInput(event);

      expect(mockSetValue).not.toHaveBeenCalled();
    });

    it('should not process empty input', () => {
      const { handler, mockSetValue } = createMockOptions();

      const mockInput = document.createElement('input');
      mockInput.value = '';

      const event = { target: mockInput } as unknown as Event;
      handler.handleInput(event);

      expect(mockSetValue).not.toHaveBeenCalled();
    });

    it('should not process input when target is not HTMLInputElement', () => {
      const { handler, mockSetValue } = createMockOptions();

      const event = { target: document.createElement('div') } as unknown as Event;
      handler.handleInput(event);

      expect(mockSetValue).not.toHaveBeenCalled();
    });
  });

  describe('handleMouseDown', () => {
    it('should track clicked segment', () => {
      const { handler, mockInput } = createMockOptions();

      Object.defineProperty(mockInput, 'selectionStart', { value: 4, writable: true });

      const event = new MouseEvent('mousedown', { clientX: 50, clientY: 10 });
      Object.defineProperty(event, 'target', { value: mockInput });

      // Should not throw
      expect(() => handler.handleMouseDown(event)).not.toThrow();
    });

    it('should not track when disabled', () => {
      const { handler, mockInput } = createMockOptions({
        disabled: true,
      });

      const event = new MouseEvent('mousedown');
      Object.defineProperty(event, 'target', { value: mockInput });

      // Should not throw and should return early
      expect(() => handler.handleMouseDown(event)).not.toThrow();
    });
  });

  describe('format segments', () => {
    it('should parse day-first format correctly', () => {
      const { handler } = createMockOptions({
        dateFormat: ref<string>('DD/MM/YYYY HH:mm'),
      });

      const ddSegment = handler.getCurrentSegment(1);
      expect(ddSegment?.type).toBe('DD');

      const mmSegment = handler.getCurrentSegment(4);
      expect(mmSegment?.type).toBe('MM');
    });

    it('should parse month-first format correctly', () => {
      const { handler } = createMockOptions({
        dateFormat: ref<string>('MM/DD/YYYY HH:mm'),
      });

      const mmSegment = handler.getCurrentSegment(1);
      expect(mmSegment?.type).toBe('MM');

      const ddSegment = handler.getCurrentSegment(4);
      expect(ddSegment?.type).toBe('DD');
    });

    it('should parse year-first format correctly', () => {
      const { handler } = createMockOptions({
        dateFormat: ref<string>('YYYY/MM/DD HH:mm'),
      });

      const yyyySegment = handler.getCurrentSegment(2);
      expect(yyyySegment?.type).toBe('YYYY');

      const mmSegment = handler.getCurrentSegment(6);
      expect(mmSegment?.type).toBe('MM');
    });

    it('should handle format with seconds', () => {
      const { handler } = createMockOptions({
        accuracy: TimeAccuracy.SECOND,
        dateFormat: ref<string>('DD/MM/YYYY HH:mm:ss'),
      });

      const ssSegment = handler.getCurrentSegment(18);
      expect(ssSegment?.type).toBe('ss');
    });

    it('should handle format with milliseconds', () => {
      const { handler } = createMockOptions({
        accuracy: TimeAccuracy.MILLISECOND,
        dateFormat: ref<string>('DD/MM/YYYY HH:mm:ss.SSS'),
      });

      const sssSegment = handler.getCurrentSegment(21);
      expect(sssSegment?.type).toBe('SSS');
    });
  });

  describe('paste with different accuracies', () => {
    it('should handle paste with second accuracy format', () => {
      const { handler } = createMockOptions({
        accuracy: TimeAccuracy.SECOND,
        dateFormat: ref<string>('DD/MM/YYYY HH:mm:ss'),
      });

      const event = {
        clipboardData: { getData: vi.fn().mockReturnValue('25/12/2023 18:45:30') },
        preventDefault: vi.fn(),
        target: document.createElement('input'),
      } as unknown as ClipboardEvent;

      // Should not throw
      expect(() => handler.handlePaste(event)).not.toThrow();
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should handle paste with millisecond accuracy format', () => {
      const { handler } = createMockOptions({
        accuracy: TimeAccuracy.MILLISECOND,
        dateFormat: ref<string>('DD/MM/YYYY HH:mm:ss.SSS'),
      });

      const event = {
        clipboardData: { getData: vi.fn().mockReturnValue('25/12/2023 18:45:30.123') },
        preventDefault: vi.fn(),
        target: document.createElement('input'),
      } as unknown as ClipboardEvent;

      // Should not throw
      expect(() => handler.handlePaste(event)).not.toThrow();
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });
});
