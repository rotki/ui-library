import { config } from '@vue/test-utils';
import { promiseTimeout } from '@vueuse/core';

// setup.js file
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { createIconDefaults, IconsSymbol } from '../../src/composables/icons';
import * as Icons from '../../src/icons';
import { server } from '../mocks/server';

// @ts-expect-error symbol cannot be used as an index.
config.global.provide[IconsSymbol] = createIconDefaults({
  registeredIcons: Object.values(Icons),
});

class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

const delay = (ms: number = 200) => promiseTimeout(ms);

vi.delay = delay;

// Start MSW server before all tests
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());
