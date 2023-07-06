import { type GeneratedIcon } from '@/types/icons';
import {
  RiAlertFill,
  RiArrowLeftSLine,
  RiCheckLine,
  RiCheckboxBlankCircleFill,
  RiCheckboxBlankLine,
  RiCheckboxCircleFill,
  RiCheckboxFill,
  RiCheckboxIndeterminateFill,
  RiErrorWarningFill,
  RiEyeLine,
  RiEyeOffLine,
  RiInformationFill,
} from '@/all-icons';

export const useIcons = createGlobalState(() => {
  const requiredIcons: GeneratedIcon[] = [
    RiAlertFill,
    RiArrowLeftSLine,
    RiCheckLine,
    RiCheckboxBlankCircleFill,
    RiCheckboxBlankLine,
    RiCheckboxCircleFill,
    RiCheckboxFill,
    RiCheckboxIndeterminateFill,
    RiErrorWarningFill,
    RiEyeLine,
    RiEyeOffLine,
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
