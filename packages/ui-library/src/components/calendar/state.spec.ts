import { describe, expect, it } from 'vitest';
import { createApp } from 'vue';
import { useCalendarState } from '@/components/calendar/state';

describe('components/calendar/state', () => {
  it('should throw when used outside a RuiCalendar', () => {
    const app = createApp({});

    expect(() => app.runWithContext(() => useCalendarState())).toThrow('useCalendarState must be used within a RuiCalendar');
  });
});
