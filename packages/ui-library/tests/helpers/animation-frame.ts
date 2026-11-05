import { beforeEach, vi } from 'vitest';

/**
 * Runs `requestAnimationFrame` callbacks synchronously in every test of the
 * calling spec file, for components that position or animate in a frame.
 * The spy is set in `beforeEach`, since `restoreMocks` undoes it before each
 * test.
 */
export function syncAnimationFrames(): void {
  beforeEach(() => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback): number => {
      const now = Date.now();
      callback(now);
      return now;
    });
  });
}
