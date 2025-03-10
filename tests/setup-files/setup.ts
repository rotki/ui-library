import { config } from '@vue/test-utils';
import { promiseTimeout } from '@vueuse/core';

// setup.js file
import { vi } from 'vitest';
import { createIconDefaults, IconsSymbol } from '../../src/composables/icons';
import * as Icons from '../../src/icons';

// @ts-expect-error symbol cannot be used as an index.
config.global.provide[IconsSymbol] = createIconDefaults({
  registeredIcons: Object.values(Icons),
});

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

const delay = (ms: number = 200) => promiseTimeout(ms);

vi.delay = delay;
