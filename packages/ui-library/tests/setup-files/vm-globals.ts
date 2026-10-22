import { BroadcastChannel } from 'node:worker_threads';

/*
 * A `vmThreads` context takes the environment's globals, not Node's, so MSW throws
 * `ReferenceError` on the missing `BroadcastChannel` at import
 * (https://github.com/mswjs/msw/issues/2340). Must precede `setup.ts` in `setupFiles`, which loads
 * MSW. `Object.assign` because Node's class and the DOM one differ in types MSW never touches.
 */
if (!globalThis.BroadcastChannel) {
  Object.assign(globalThis, { BroadcastChannel });
}

/*
 * happy-dom's `requestAnimationFrame` belongs to a context built before the fake clock, so its
 * callbacks never run and Vue leave transitions, which resolve on it, leave closed menus behind.
 * `setTimeout` puts frames on the test's clock. `Object.assign`: the DOM and Node timer return
 * types disagree only on paper.
 */
Object.assign(globalThis, {
  cancelAnimationFrame: (handle: number): void => {
    clearTimeout(handle);
  },
  requestAnimationFrame: (callback: FrameRequestCallback) => setTimeout(() => callback(Date.now()), 0),
});
