import { BroadcastChannel } from 'node:worker_threads';

/*
 * A `vmThreads` worker evaluates each test file in a fresh V8 context, and that context is built
 * from the environment's globals rather than Node's. `BroadcastChannel` is not among them, so MSW,
 * which reaches for it at import time, throws `ReferenceError` before any test runs. See
 * https://github.com/mswjs/msw/issues/2340.
 *
 * This file is listed ahead of `setup.ts` in `setupFiles` so the global exists before the MSW
 * server module is evaluated. Under the default `threads` pool the global is already there and the
 * assignment is skipped.
 *
 * `Object.assign` rather than a plain assignment: Node's class and the DOM one differ in the
 * `this` type of `onmessage` and in whose `MessagePort` they carry, neither of which MSW touches.
 */
if (!globalThis.BroadcastChannel) {
  Object.assign(globalThis, { BroadcastChannel });
}

/*
 * happy-dom's `requestAnimationFrame` belongs to the context it was built in, which the worker
 * creates before the fake clock exists, so a callback queued on it never runs. Vue resolves a
 * leave transition on that frame, which left a closed menu in the DOM. Routing the frame through
 * `setTimeout` puts it on the clock the test drives.
 *
 * `Object.assign` rather than a plain assignment: the DOM signature returns a `number` while the
 * `setTimeout` in scope is typed as Node's, and the two only disagree on paper.
 */
Object.assign(globalThis, {
  cancelAnimationFrame: (handle: number): void => {
    clearTimeout(handle);
  },
  requestAnimationFrame: (callback: FrameRequestCallback) => setTimeout(() => callback(Date.now()), 0),
});
