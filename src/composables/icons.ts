import { type GeneratedIcon } from '@/types/icons';

export const useIcons = createGlobalState(() => {
  const registeredIcons: Ref<Record<string, string>> = ref({});
  const registerIcons = (iconsToAdd: GeneratedIcon[]) => {
    set(registeredIcons, {
      ...get(registeredIcons),
      ...Object.fromEntries(iconsToAdd.map(({ name, path }) => [name, path])),
    });
  };

  return { registeredIcons, registerIcons };
});
