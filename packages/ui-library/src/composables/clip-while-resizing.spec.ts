import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { effectScope, nextTick } from 'vue';
import { useClipWhileResizing } from '@/composables/clip-while-resizing';

describe('composables/clip-while-resizing', () => {
  let box: HTMLDivElement;
  let scope: ReturnType<typeof effectScope>;

  beforeEach(() => {
    vi.useFakeTimers();
    box = document.createElement('div');
    document.body.append(box);
    scope = effectScope();
  });

  afterEach(() => {
    scope.stop();
    box.remove();
    vi.useRealTimers();
  });

  function transition(target: EventTarget, propertyName: string): void {
    const event = new Event('transitionend', { bubbles: true });
    Object.defineProperty(event, 'propertyName', { value: propertyName });
    target.dispatchEvent(event);
  }

  function setup(): { height: Ref<string>; clipped: ComputedRef<boolean> } {
    const height = ref<string>('0px');
    const clipped = scope.run(() => useClipWhileResizing(ref<HTMLElement | null>(box), height))!;
    return { height, clipped };
  }

  it('should not clip until the height changes', () => {
    const { clipped } = setup();
    expect(get(clipped)).toBe(false);
  });

  it('should clip from a height change until the box\'s own height transition ends', async () => {
    const { height, clipped } = setup();

    set(height, '120px');
    await nextTick();
    expect(get(clipped)).toBe(true);

    const child = document.createElement('span');
    box.append(child);
    transition(child, 'height');
    transition(box, 'opacity');
    expect(get(clipped)).toBe(true);

    transition(box, 'height');
    expect(get(clipped)).toBe(false);
  });

  it('should stop clipping after the fallback when no transition runs', async () => {
    const { height, clipped } = setup();

    set(height, '120px');
    await nextTick();
    expect(get(clipped)).toBe(true);

    vi.advanceTimersByTime(300);
    expect(get(clipped)).toBe(false);
  });
});
