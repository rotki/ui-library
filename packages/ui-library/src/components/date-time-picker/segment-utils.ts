import type { DateTimeSegmentType } from '@/components/date-time-picker/types';
import type { TimeAccuracy } from '@/consts/time-accuracy';
import dayjs from 'dayjs';
import { includeMilliseconds, includeSeconds } from '@/components/date-time-picker/utils';

import '@/components/date-time-picker/dayjs-setup';

export function getClickPosition(
  event: MouseEvent,
  input: HTMLInputElement,
  useCaretPosition: boolean,
): number {
  const fallback = input.selectionStart ?? 0;
  if (!useCaretPosition)
    return fallback;
  const caretPos = document.caretPositionFromPoint?.(event.clientX, event.clientY);
  if (caretPos)
    return caretPos.offset;
  return document.caretRangeFromPoint?.(event.clientX, event.clientY)?.startOffset ?? fallback;
}

export function parseAndSetDateValues(
  pastedText: string,
  dateFormat: string,
  accuracy: TimeAccuracy,
  setValue: (segment: DateTimeSegmentType, value?: number) => void,
): void {
  try {
    const parsedDate = dayjs(pastedText, dateFormat);

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
