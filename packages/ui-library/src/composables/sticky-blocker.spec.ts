import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { effectScope, nextTick } from 'vue';
import { findStickyBlocker, useStickyBlockerWarning } from '@/composables/sticky-blocker';

describe('composables/sticky-blocker', () => {
  let outer: HTMLDivElement;
  let inner: HTMLDivElement;
  let bar: HTMLDivElement;

  beforeEach(() => {
    outer = document.createElement('div');
    inner = document.createElement('div');
    bar = document.createElement('div');
    inner.append(bar);
    outer.append(inner);
    document.body.append(outer);
  });

  afterEach(() => {
    outer.remove();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('findStickyBlocker', () => {
    it('should find the nearest overflow: hidden ancestor on either axis', () => {
      expect(findStickyBlocker(bar)).toBeUndefined();

      outer.style.overflowX = 'hidden';
      expect(findStickyBlocker(bar)).toBe(outer);

      inner.style.overflowY = 'hidden';
      expect(findStickyBlocker(bar)).toBe(inner);
    });

    it('should skip overflow: clip, scroll areas and boxes that clip only while animating', () => {
      outer.style.overflowY = 'clip';
      inner.style.overflowY = 'auto';
      expect(findStickyBlocker(bar)).toBeUndefined();

      inner.style.overflowY = 'hidden';
      inner.dataset.clipped = 'true';
      expect(findStickyBlocker(bar)).toBeUndefined();
    });
  });

  describe('useStickyBlockerWarning', () => {
    it('should warn once, after the delay, when a hidden ancestor blocks the element', async () => {
      vi.useFakeTimers();
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      outer.style.overflowY = 'hidden';
      const enabled = ref<boolean>(true);

      const scope = effectScope();
      scope.run(() => useStickyBlockerWarning(ref<HTMLElement>(bar), enabled, 'The bar'));

      expect(warn).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1000);
      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls[0]?.[0]).toContain('The bar cannot stick to the page');
      expect(warn.mock.calls[0]?.[1]).toBe(outer);

      set(enabled, false);
      await nextTick();
      set(enabled, true);
      await nextTick();
      vi.advanceTimersByTime(1000);
      expect(warn).toHaveBeenCalledTimes(1);
      scope.stop();
    });

    it('should not warn while the element is not meant to stick', () => {
      vi.useFakeTimers();
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      outer.style.overflowY = 'hidden';

      const scope = effectScope();
      scope.run(() => useStickyBlockerWarning(ref<HTMLElement>(bar), false, 'The bar'));
      vi.advanceTimersByTime(1000);

      expect(warn).not.toHaveBeenCalled();
      scope.stop();
    });
  });
});
