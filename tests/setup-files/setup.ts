// setup.js file
import { vi } from 'vitest';
import * as Icons from '../../src/all-icons';
import { useIcons } from '../../src/composables/icons';

const { registerIcons } = useIcons();
registerIcons(Object.values(Icons));

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal('ResizeObserver', ResizeObserverMock);
