// setup.js file
import { vi } from 'vitest';
import { promiseTimeout } from '@vueuse/core';
import * as Icons from '../../src/icons';
import { useIcons } from '../../src/composables';

const { registerIcons } = useIcons();
registerIcons(Object.values(Icons));

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

const delay = (ms: number = 200) => promiseTimeout(ms);

vi.delay = delay;
