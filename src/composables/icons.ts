import { type GeneratedIcon } from '@/types/icons';
import {
  RiAlertFill,
  RiAlertLine,
  RiCheckLine,
  RiCheckboxBlankCircleFill,
  RiCheckboxBlankLine,
  RiCheckboxCircleFill,
  RiCheckboxCircleLine,
  RiCheckboxFill,
  RiCheckboxIndeterminateFill,
  RiCloseFill,
  RiErrorWarningFill,
  RiErrorWarningLine,
  RiInformationFill,
  RiInformationLine,
} from '@/all-icons';

export const useIcons = createGlobalState(() => {
  const requiredIcons: GeneratedIcon[] = [
    RiAlertFill,
    RiAlertLine,
    RiCheckLine,
    RiCheckboxBlankCircleFill,
    RiCheckboxBlankLine,
    RiCheckboxCircleFill,
    RiCheckboxCircleLine,
    RiCheckboxFill,
    RiCheckboxIndeterminateFill,
    RiCloseFill,
    RiErrorWarningFill,
    RiErrorWarningLine,
    RiInformationFill,
    RiInformationLine,
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
