import type { GeneratedIcon } from '@/types/icons';
import { config, enableAutoUnmount } from '@vue/test-utils';
import { afterAll, afterEach, beforeAll, beforeEach, vi } from 'vitest';
import { createIconDefaults, IconsSymbol } from '@/composables/icons';
import * as Icons from '@/icons';
import { server } from '../mocks/server';

function isGeneratedIcon(value: unknown): value is GeneratedIcon {
  return typeof value === 'object' && value !== null && 'name' in value && 'components' in value;
}

// @ts-expect-error symbol cannot be used as an index.
config.global.provide[IconsSymbol] = createIconDefaults({
  registeredIcons: Object.values(Icons).filter(isGeneratedIcon),
});

class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

// `unstubGlobals` undoes stubs before each test, so the stub is set again for each one
beforeEach(() => {
  vi.stubGlobal('ResizeObserver', ResizeObserverMock);
});

// An unhandled request fails the test, so a network call slipping into the library shows up
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

/*
 * `afterEach` hooks run in reverse order, so this one runs after the auto unmount below: whatever
 * an unmount left in the body, such as a teleported overlay, is removed
 */
afterEach(() => {
  // Handlers a test added are dropped, so they cannot reach the next one
  server.resetHandlers();
  document.body.innerHTML = '';
});

// Every wrapper a test mounted is unmounted after it, even when the test fails part way
enableAutoUnmount(afterEach);

// Clean up after the tests are finished
afterAll(() => server.close());
