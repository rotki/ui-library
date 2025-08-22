import { get, set } from '@vueuse/shared';
import { ref } from 'vue';

export function useTimeoutManager() {
  const timeout = ref<NodeJS.Timeout>();

  const clear = () => {
    if (get(timeout)) {
      clearTimeout(get(timeout));
      set(timeout, undefined);
    }
  };

  const create = (callback: () => void, delay: number) => {
    clear();
    set(timeout, setTimeout(callback, delay));
  };

  const isActive = () => !!get(timeout);

  return { clear, create, isActive };
}
