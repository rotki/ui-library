import { type GeneratedIcon } from '@/types/icons';
import {
  RiAlertFill,
  RiCheckLine,
  RiCheckboxBlankCircleFill,
  RiCheckboxBlankLine,
  RiCheckboxCircleFill,
  RiCheckboxFill,
  RiCheckboxIndeterminateFill,
  RiErrorWarningFill,
  RiInformationFill,
} from '@/all-icons';

export const useIcons = createGlobalState(() => {
  const requiredIcons: GeneratedIcon[] = [
    RiCheckboxFill,
    RiCheckboxCircleFill,
    RiCheckboxIndeterminateFill,
    RiCheckboxBlankLine,
    RiCheckboxBlankCircleFill,
    RiCheckLine,
    RiErrorWarningFill,
    RiAlertFill,
    RiInformationFill,
  ];

  const registeredIcons: Ref<Record<string, string>> = ref({});
  const registerIcons = (iconsToAdd: GeneratedIcon[]) => {
    set(registeredIcons, {
      ...get(registeredIcons),
      ...Object.fromEntries(
        [...requiredIcons, ...iconsToAdd].map(({ name, path }) => [name, path])
      ),
    });
  };

  return { registeredIcons, registerIcons };
});
