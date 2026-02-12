import { get, set } from '@vueuse/shared';
import { ref } from 'vue';

interface UseTimeoutManagerReturn {
  clear: () => void;
  create: (callback: () => void, delay: number) => void;
  isActive: () => boolean;
}

export function useTimeoutManager(): UseTimeoutManagerReturn {
  const timeout = ref<NodeJS.Timeout>();

  const clear = (): void => {
    if (get(timeout)) {
      clearTimeout(get(timeout));
      set(timeout, undefined);
    }
  };

  const create = (callback: () => void, delay: number): void => {
    clear();
    set(timeout, setTimeout(callback, delay));
  };

  const isActive = (): boolean => !!get(timeout);

  return { clear, create, isActive };
}
