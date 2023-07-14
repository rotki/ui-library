import { type GeneratedIcon } from '@/types/icons';
import {
  RiAlertFill,
  RiAlertLine,
  RiArrowLeftSLine,
  RiCheckLine,
  RiCheckboxBlankCircleFill,
  RiCheckboxBlankCircleLine,
  RiCheckboxBlankLine,
  RiCheckboxCircleFill,
  RiCheckboxCircleLine,
  RiCheckboxFill,
  RiCheckboxIndeterminateFill,
  RiCloseFill,
  RiErrorWarningFill,
  RiErrorWarningLine,
  RiEyeLine,
  RiEyeOffLine,
  RiInformationFill,
  RiInformationLine,
  RiRadioButtonLine,
} from '@/all-icons';

export const useIcons = createGlobalState(() => {
  const requiredIcons: GeneratedIcon[] = [
    RiAlertFill,
    RiAlertLine,
    RiArrowLeftSLine,
    RiCheckLine,
    RiCheckboxBlankCircleFill,
    RiCheckboxBlankCircleLine,
    RiCheckboxBlankLine,
    RiCheckboxCircleFill,
    RiCheckboxCircleLine,
    RiCheckboxFill,
    RiCheckboxIndeterminateFill,
    RiCloseFill,
    RiErrorWarningFill,
    RiErrorWarningLine,
    RiEyeLine,
    RiEyeOffLine,
    RiInformationFill,
    RiInformationLine,
    RiRadioButtonLine,
  ];

  const registeredIcons: Ref<Record<string, string>> = ref({});
  const registerIcons = (iconsToAdd: GeneratedIcon[]) => {
    set(registeredIcons, {
      ...get(registeredIcons),
      ...Object.fromEntries(
        [...requiredIcons, ...iconsToAdd].map(({ name, path }) => [name, path]),
      ),
    });
  };

  return { registeredIcons, registerIcons };
});
