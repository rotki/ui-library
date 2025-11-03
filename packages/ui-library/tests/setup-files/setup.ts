import type { GeneratedIcon } from '@/types/icons';
import { config } from '@vue/test-utils';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
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

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

// Start MSW server before all tests
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());
