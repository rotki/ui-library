import { type GeneratedIcon } from '@/types/icons';
import {
  RiAlertFill,
  RiCheckLine,
  RiCheckboxBlankCircleFill,
  RiCheckboxBlankCircleLine,
  RiCheckboxBlankLine,
  RiCheckboxCircleFill,
  RiCheckboxFill,
  RiCheckboxIndeterminateFill,
  RiErrorWarningFill,
  RiInformationFill,
  RiRadioButtonLine,
} from '@/all-icons';

export const useIcons = createGlobalState(() => {
  const requiredIcons: GeneratedIcon[] = [
    RiAlertFill,
    RiCheckLine,
    RiCheckboxBlankCircleFill,
    RiCheckboxBlankCircleLine,
    RiCheckboxBlankLine,
    RiCheckboxCircleFill,
    RiCheckboxFill,
    RiCheckboxIndeterminateFill,
    RiErrorWarningFill,
    RiInformationFill,
    RiRadioButtonLine,
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
